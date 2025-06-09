import type { taskEither } from "fp-ts";

import type { ExpirationError, VerificationError } from "../errors";
import type { Payload } from "../types";

type In = {
  secret: string;
  token: string;
};

type Fn = <T extends Payload>(
  params: In,
) => taskEither.TaskEither<VerificationError | ExpirationError, T>;

export type { Fn, In };
