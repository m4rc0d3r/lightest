import type { ImpossibleError, UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

import type { Common, Create, Get } from "./ios";

import type { NotFoundError, UniqueKeyViolationError } from "~/app";

abstract class Repository {
  abstract create(
    params: Create.In,
  ): taskEither.TaskEither<UnexpectedError | ImpossibleError | UniqueKeyViolationError, Common.Out>;
  abstract get(params: Get.In): taskEither.TaskEither<UnexpectedError | NotFoundError, Common.Out>;
}

export { Repository };
