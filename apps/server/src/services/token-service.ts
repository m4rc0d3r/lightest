import jwt from "jsonwebtoken";

import type { Config } from "~/infra/config";
import type { AuthConfig } from "~/infra/config/auth";

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

class TokenService {
  private readonly jwt: AuthConfig["jwt"];

  constructor(config: Config) {
    this.jwt = config.auth.jwt;
  }

  generateTokens(payload: object): Tokens {
    const accessToken = jwt.sign(payload, this.jwt.access.secret, {
      expiresIn: this.jwt.access.lifetime,
    });
    const refreshToken = jwt.sign(payload, this.jwt.refresh.secret, {
      expiresIn: this.jwt.refresh.lifetime,
    });

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.verify(token, this.jwt.access.secret);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.verify(token, this.jwt.refresh.secret);
    } catch {
      return null;
    }
  }

  getTokenExpirationDate(token: string): Date {
    const expires = jwt.decode(token, { json: true })?.exp;
    if (expires === undefined) {
      throw new Error(`The token '${token}' has no expiration date.`);
    }

    return new Date(expires * 1000);
  }
}

export { TokenService };
export type { Tokens };
