import type { taskEither } from "fp-ts";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";

abstract class Repository {
  abstract create(params: Create.In): taskEither.TaskEither<UniqueKeyViolationError, Create.Out>;
}

export { Repository };
