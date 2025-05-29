import type { Session } from "../dtos/app/session.js";
import type { User } from "../dtos/app/user.js";

import type { Tokens, TokenService } from "./token-service.js";

import type { DAO } from "~/daos/app/dao.js";

type SessionInfo = {
  tokens: Tokens;
  refreshTokenExpirationDate: Date;
};

class SessionService {
  constructor(
    private readonly dao: DAO,
    private readonly tokenService: TokenService,
  ) {}

  async createSession(user: User): Promise<SessionInfo> {
    const tokens = this.tokenService.generateTokens({ userId: user.id, userEmail: user.email });
    const refreshTokenExpirationDate = this.tokenService.getTokenExpirationDate(
      tokens.refreshToken,
    );
    await this.dao.createSession(
      user.id,
      tokens.refreshToken,
      refreshTokenExpirationDate.toISOString(),
    );

    return { tokens, refreshTokenExpirationDate };
  }

  async updateSession(user: User, refreshToken: Session["refreshToken"]): Promise<SessionInfo> {
    const tokens = this.tokenService.generateTokens({ userId: user.id, userEmail: user.email });
    const refreshTokenExpirationDate = this.tokenService.getTokenExpirationDate(
      tokens.refreshToken,
    );
    await this.dao.updateSessionBy(
      "refreshToken",
      refreshToken,
      tokens.refreshToken,
      refreshTokenExpirationDate.toISOString(),
    );

    return { tokens, refreshTokenExpirationDate };
  }

  async destroySession(refreshToken: Session["refreshToken"]): Promise<void> {
    await this.dao.destroySessionBy("refreshToken", refreshToken);
  }

  async getSession(refreshToken: Session["refreshToken"]): Promise<Session | undefined> {
    return await this.dao.getSessionBy("refreshToken", refreshToken);
  }
}

export { SessionService };
export type { SessionInfo };
