import { dao } from "../daos/sqlite/dao.js";
import { tokenService, Tokens } from "./token-service.js";
import { User } from "../dtos/app/user.js";
import { Session } from "../dtos/app/session.js";

export interface SessionInfo {
  tokens: Tokens;
  refreshTokenExpirationDate: Date;
}

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

export const sessionService = new SessionService();
