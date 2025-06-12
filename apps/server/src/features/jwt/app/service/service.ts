import type { taskEither } from "fp-ts";

import type { ExpirationError, VerificationError } from "../errors";
import type { Generate, Verify } from "../ports";
import type { PayloadToSign, SignedPayload } from "../types";

class Service {
  constructor(
    private readonly secret: string,
    private readonly lifetime: string,
    private readonly generateJwt: Generate.Fn,
    private readonly verifyJwt: Verify.Fn,
  ) {}

  generate<T extends PayloadToSign, U extends SignedPayload<T>>(
    payload: Generate.In<T>["payload"],
  ): Generate.Out<U> {
    return this.generateJwt({
      secret: this.secret,
      payload,
      lifetime: this.lifetime,
    });
  }

  verify<T extends PayloadToSign>(
    token: Verify.In["token"],
  ): taskEither.TaskEither<VerificationError | ExpirationError, T> {
    return this.verifyJwt({
      secret: this.secret,
      token,
    });
  }
}

export { Service };
