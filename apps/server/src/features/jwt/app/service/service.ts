import type { taskEither } from "fp-ts";

import type { ExpirationError, VerificationError } from "../errors";
import type { GenerateJwt, VerifyJwt } from "../ports";
import type { PayloadToSign, SignedPayload } from "../types";

class Service {
  constructor(
    private readonly secret: string,
    private readonly lifetime: string,
    private readonly generateJwt: GenerateJwt.Fn,
    private readonly verifyJwt: VerifyJwt.Fn,
  ) {}

  generate<T extends PayloadToSign, U extends SignedPayload<T>>(
    payload: GenerateJwt.In<T>["payload"],
  ): GenerateJwt.Out<U> {
    return this.generateJwt({
      secret: this.secret,
      payload,
      lifetime: this.lifetime,
    });
  }

  verify<T extends PayloadToSign>(
    token: VerifyJwt.In["token"],
  ): taskEither.TaskEither<VerificationError | ExpirationError, T> {
    return this.verifyJwt({
      secret: this.secret,
      token,
    });
  }
}

export { Service };
