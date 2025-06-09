import { taskEither } from "fp-ts";
import { JsonWebTokenError, TokenExpiredError, verify } from "jsonwebtoken";

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
        verify(token, secret, (error, decoded) =>
          error === null ? resolve(decoded as T) : reject(error),
        ),
      ),
    (reason) => {
      if (reason instanceof TokenExpiredError) {
        const { expiredAt } = reason;
        return new ExpirationError(expiredAt);
      } else if (reason instanceof JsonWebTokenError) {
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
