import type { taskEither } from "fp-ts";

import type { ExpirationError, VerificationError } from "../errors";
import type { PayloadToSign } from "../types";

type In = {
  secret: string;
  token: string;
};

type Fn = <T extends PayloadToSign>(
  params: In,
) => taskEither.TaskEither<VerificationError | ExpirationError, T>;

export type { Fn, In };
