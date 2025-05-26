import dotenv from "dotenv";
import jwt from "jsonwebtoken";

dotenv.config();

const JWT_ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "undefined";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "undefined";
const JWT_ACCESS_EXPIRES_IN = process.env.JWT_ACCESS_EXPIRES_IN || "undefined";
const JWT_REFRESH_EXPIRES_IN = process.env.JWT_REFRESH_EXPIRES_IN || "undefined";

if (JWT_ACCESS_SECRET === "undefined" || JWT_REFRESH_SECRET === "undefined" || JWT_ACCESS_EXPIRES_IN === "undefined" || JWT_REFRESH_EXPIRES_IN === "undefined") {
    throw new Error("'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'JWT_ACCESS_EXPIRES_IN' and/or 'JWT_REFRESH_EXPIRES_IN' not specified in the config file '.env'.");
}

export interface Tokens {
    accessToken: string;
    refreshToken: string;
}

class TokenService {
    generateTokens(payload: object): Tokens {
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {expiresIn: JWT_ACCESS_EXPIRES_IN});
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {expiresIn: JWT_REFRESH_EXPIRES_IN});

        return {accessToken, refreshToken};
    }

    validateAccessToken(token: string): jwt.JwtPayload | string | null {
        try {
            return jwt.verify(token, JWT_ACCESS_SECRET);
        } catch {
            return null;
        }
    }

    validateRefreshToken(token: string): jwt.JwtPayload | string | null {
        try {
            return jwt.verify(token, JWT_REFRESH_SECRET);
        } catch {
            return null;
        }
    }

    getTokenExpirationDate(token: string): Date {
        const expires = jwt.decode(token, {json: true})?.exp;
        if (expires === undefined) {
            throw new Error(`The token '${token}' has no expiration date.`);
        }
    
        return new Date(expires * 1000);
    }
}

export const tokenService = new TokenService();