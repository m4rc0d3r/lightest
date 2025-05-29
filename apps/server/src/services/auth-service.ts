import bcrypt from "bcrypt";
import { either as e } from "fp-ts";
import * as uuid from "uuid";

import { DAOConstraintUniqueError, DAOError } from "../daos/app/errors.js";
import { dao } from "../daos/postgres/dao.js";
import type { Session } from "../dtos/app/session.js";
import type { User } from "../dtos/app/user.js";
import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";

import { mailService } from "./mail-service.js";
import type { SessionInfo } from "./session-service.js";
import { sessionService } from "./session-service.js";
import { tokenService } from "./token-service.js";

import { createConfig } from "~/infra/config/config.js";
import { createUrl } from "~/shared/index.js";

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;

class AuthService {
  async register(email: User["email"], password: User["password"]): Promise<SessionInfo> {
    try {
      const passwordHash = await bcrypt.hash(password, config.bcrypt.roundsForPasswordHash);
      const activationLink = uuid.v4();
      const userId = await dao.createUser(email, passwordHash, activationLink);
      const user = await dao.getUserBy("id", userId);

      if (user === undefined) {
        throw APIError.InternalServerError(
          "The user was saved to the storage, but an error occurred while trying to retrieve the stored user information.",
        );
      }

      const { protocol, address, port } = config.clientApp;
      await mailService.sendActivationMail(
        email,
        `${createUrl(protocol, address, port)}/activate/${user.activationLink}`,
      );

      return await sessionService.createSession(user);
    } catch (e) {
      if (e instanceof DAOConstraintUniqueError && e.columnName === "User.email") {
        throw APIError.BadRequest(`Email '${email}' is already taken.`, APIErrorCode.EMAIL_IS_BUSY);
      } else {
        throw e;
      }
    }
  }

  async login(email: User["email"], password: User["password"]): Promise<SessionInfo> {
    const user = await dao.getUserBy("email", email);

    if (user === undefined) {
      throw APIError.BadRequest(
        `Email '${email}' not found in storage.`,
        APIErrorCode.EMAIL_NOT_FOUND,
      );
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);

    if (!isCorrectPassword) {
      throw APIError.BadRequest("Wrong password specified.", APIErrorCode.INVALID_PASSWORD);
    }

    return await sessionService.createSession(user);
  }

  async logout(refreshToken: Session["refreshToken"]): Promise<void> {
    try {
      await sessionService.destroySession(refreshToken);
    } catch (e) {
      if (e instanceof DAOError) {
        throw APIError.Unauthorized();
      } else {
        throw e;
      }
    }
  }

  async refresh(refreshToken: Session["refreshToken"]): Promise<SessionInfo> {
    if (!refreshToken) {
      throw APIError.Unauthorized();
    }

    const payload = tokenService.validateRefreshToken(refreshToken) as {
      userId: number;
      userEmail: string;
    } | null;

    const session = await sessionService.getSession(refreshToken);

    if (!payload || !session) {
      throw APIError.Unauthorized();
    }

    const user = await dao.getUserBy("id", payload.userId);

    if (user === undefined) {
      throw APIError.InternalServerError(`User with ID ${payload.userId} not found in storage.`);
    }

    return await sessionService.updateSession(user, refreshToken);
  }

  async activate(activationLink: User["activationLink"]): Promise<void> {
    const user = await dao.getUserBy("activationLink", activationLink);

    if (user === undefined) {
      throw APIError.BadRequest(
        `Activation link '${activationLink}' is invalid.`,
        APIErrorCode.ACTIVATION_LINK_IS_INVALID,
      );
    }

    await dao.activateUser(user.id);
  }
}

const authService = new AuthService();

export { authService };
