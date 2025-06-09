import type { taskEither } from "fp-ts";

import type { Repository } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";

class Service {
  constructor(private readonly repository: Repository.Repository) {}

  create(params: Create.In): taskEither.TaskEither<UniqueKeyViolationError, Repository.Create.Out> {
    throw new Error("Method not implemented.");
  }
}

export { Service };
