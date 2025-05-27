import { dao } from "../daos/sqlite/dao.js";
import type { Session } from "../dtos/app/session.js";
import type { User } from "../dtos/app/user.js";

import type { Tokens } from "./token-service.js";
import { tokenService } from "./token-service.js";

type SessionInfo = {
  tokens: Tokens;
  refreshTokenExpirationDate: Date;
};

class SessionService {
  async createSession(user: User): Promise<SessionInfo> {
    const tokens = tokenService.generateTokens({ userId: user.id, userEmail: user.email });
    const refreshTokenExpirationDate = tokenService.getTokenExpirationDate(tokens.refreshToken);
    await dao.createSession(user.id, tokens.refreshToken, refreshTokenExpirationDate.toISOString());

    return { tokens, refreshTokenExpirationDate };
  }

  async updateSession(user: User, refreshToken: Session["refreshToken"]): Promise<SessionInfo> {
    const tokens = tokenService.generateTokens({ userId: user.id, userEmail: user.email });
    const refreshTokenExpirationDate = tokenService.getTokenExpirationDate(tokens.refreshToken);
    await dao.updateSessionBy(
      "refreshToken",
      refreshToken,
      tokens.refreshToken,
      refreshTokenExpirationDate.toISOString(),
    );

    return { tokens, refreshTokenExpirationDate };
  }

  async destroySession(refreshToken: Session["refreshToken"]): Promise<void> {
    await dao.destroySessionBy("refreshToken", refreshToken);
  }

  async getSession(refreshToken: Session["refreshToken"]): Promise<Session | undefined> {
    return await dao.getSessionBy("refreshToken", refreshToken);
  }
}

const sessionService = new SessionService();

export { sessionService };
export type { SessionInfo };
