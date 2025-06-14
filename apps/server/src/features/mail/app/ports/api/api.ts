import type { ImpossibleError, UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

import type { Send } from "./ios";

abstract class Api {
  abstract send(params: Send.In): taskEither.TaskEither<UnexpectedError | ImpossibleError, boolean>;
}

export { Api };
