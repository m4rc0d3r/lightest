import { either as e } from "fp-ts";
import jwt from "jsonwebtoken";

import { createConfig } from "~/infra/config";

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;

type Tokens = {
  accessToken: string;
  refreshToken: string;
};

class TokenService {
  generateTokens(payload: object): Tokens {
    const accessToken = jwt.sign(payload, config.auth.jwt.access.secret, {
      expiresIn: config.auth.jwt.access.lifetime,
    });
    const refreshToken = jwt.sign(payload, config.auth.jwt.refresh.secret, {
      expiresIn: config.auth.jwt.refresh.lifetime,
    });

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.verify(token, config.auth.jwt.access.secret);
    } catch {
      return null;
    }
  }

  validateRefreshToken(token: string): jwt.JwtPayload | string | null {
    try {
      return jwt.verify(token, config.auth.jwt.refresh.secret);
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

const tokenService = new TokenService();

export { tokenService };
export type { Tokens };
