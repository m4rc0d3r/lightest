import type { taskEither } from "fp-ts";

import type { Common, Create, Get } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";

abstract class Repository {
  abstract create(params: Create.In): taskEither.TaskEither<UniqueKeyViolationError, Common.Out>;
  abstract get(params: Get.In): taskEither.TaskEither<NotFoundError, Common.Out>;
}

export { Repository };
