import { Debug } from "@lightest/core";

import type { GenerateToken, VerifyToken } from "../ports";
import type { PayloadToSign, SignedPayload } from "../types";

@Debug.ClassDisplayName.set("JwtService")
class Service<
  T extends PayloadToSign = PayloadToSign,
  U extends SignedPayload<T> = SignedPayload<T>,
> {
  constructor(
    private readonly secret: string,
    private readonly lifetime: string,
    private readonly generateToken: GenerateToken.Fn<T, U>,
    private readonly verifyToken: VerifyToken.Fn<T>,
  ) {}

  generate(payload: GenerateToken.In<T>["payload"]): ReturnType<GenerateToken.Fn<T, U>> {
    return this.generateToken({
      secret: this.secret,
      payload,
      lifetime: this.lifetime,
    });
  }

  verify(token: VerifyToken.In["token"]): ReturnType<VerifyToken.Fn> {
    return this.verifyToken({
      secret: this.secret,
      token,
    });
  }
}

export { Service };
