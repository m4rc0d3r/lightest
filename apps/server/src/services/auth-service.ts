import bcrypt from "bcrypt";
import * as uuid from "uuid";

import { DAOConstraintUniqueError, DAOError } from "../daos/app/errors.js";
import type { Session } from "../dtos/app/session.js";
import type { User } from "../dtos/app/user.js";
import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";

import type { MailService } from "./mail-service.js";
import type { SessionInfo, SessionService } from "./session-service.js";
import type { TokenService } from "./token-service.js";

import type { DAO } from "~/daos/app/dao.js";
import type { ClientAppConfig } from "~/infra/config/client-app.js";
import type { Config } from "~/infra/config/config.js";
import { createUrl } from "~/shared/index.js";

class AuthService {
  private readonly roundsForPasswordHash: number;
  private readonly clientApp: ClientAppConfig;

  constructor(
    private readonly dao: DAO,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
    private readonly mailService: MailService,
    config: Config,
  ) {
    this.roundsForPasswordHash = config.bcrypt.roundsForPasswordHash;
    this.clientApp = config.clientApp;
  }

  async register(email: User["email"], password: User["password"]): Promise<SessionInfo> {
    try {
      const passwordHash = await bcrypt.hash(password, this.roundsForPasswordHash);
      const activationLink = uuid.v4();
      const userId = await this.dao.createUser(email, passwordHash, activationLink);
      const user = await this.dao.getUserBy("id", userId);

      if (user === undefined) {
        throw APIError.InternalServerError(
          "The user was saved to the storage, but an error occurred while trying to retrieve the stored user information.",
        );
      }

      const { protocol, address, port } = this.clientApp;
      await this.mailService.sendActivationMail(
        email,
        `${createUrl(protocol, address, port)}/activate/${user.activationLink}`,
      );

      return await this.sessionService.createSession(user);
    } catch (e) {
      if (e instanceof DAOConstraintUniqueError && e.columnName === "User.email") {
        throw APIError.BadRequest(`Email '${email}' is already taken.`, APIErrorCode.EMAIL_IS_BUSY);
      } else {
        throw e;
      }
    }
  }

  async login(email: User["email"], password: User["password"]): Promise<SessionInfo> {
    const user = await this.dao.getUserBy("email", email);

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

    return await this.sessionService.createSession(user);
  }

  async logout(refreshToken: Session["refreshToken"]): Promise<void> {
    try {
      await this.sessionService.destroySession(refreshToken);
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

    const payload = this.tokenService.validateRefreshToken(refreshToken) as {
      userId: number;
      userEmail: string;
    } | null;

    const session = await this.sessionService.getSession(refreshToken);

    if (!payload || !session) {
      throw APIError.Unauthorized();
    }

    const user = await this.dao.getUserBy("id", payload.userId);

    if (user === undefined) {
      throw APIError.InternalServerError(`User with ID ${payload.userId} not found in storage.`);
    }

    return await this.sessionService.updateSession(user, refreshToken);
  }

  async activate(activationLink: User["activationLink"]): Promise<void> {
    const user = await this.dao.getUserBy("activationLink", activationLink);

    if (user === undefined) {
      throw APIError.BadRequest(
        `Activation link '${activationLink}' is invalid.`,
        APIErrorCode.ACTIVATION_LINK_IS_INVALID,
      );
    }

    await this.dao.activateUser(user.id);
  }
}

export { AuthService };
