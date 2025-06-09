import { taskEither } from "fp-ts";
import jwt from "jsonwebtoken";

import type { Payload, VerifyJwt } from "../app";
import { ExpirationError, VerificationError } from "../app/errors";

const REASONS_BY_MESSAGE: Record<string, VerificationError["reason"]> = {
  "invalid token": "SYNTACTICALLY_INCORRECT",
  "jwt malformed": "SYNTACTICALLY_INCORRECT",
  "jwt signature is required": "SYNTACTICALLY_INCORRECT",
  "invalid signature": "CRYPTOGRAPHICALLY_INVALID",
};

const verifyJwt: VerifyJwt.Fn = <T extends Payload>({ secret, token }: VerifyJwt.In) => {
  return taskEither.tryCatch(
    () =>
      new Promise<T>((resolve, reject) =>
        jwt.verify(token, secret, (error, decoded) =>
          error === null ? resolve(decoded as T) : reject(error),
        ),
      ),
    (reason) => {
      if (reason instanceof jwt.TokenExpiredError) {
        const { expiredAt } = reason;
        return new ExpirationError(expiredAt);
      } else if (reason instanceof jwt.JsonWebTokenError) {
        const jwtReason = REASONS_BY_MESSAGE[reason.message];
        if (!jwtReason) {
          throw reason;
        }
        return new VerificationError(jwtReason);
      }
      throw reason;
    },
  );
};

export { verifyJwt };
