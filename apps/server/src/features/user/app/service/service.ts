import type { taskEither } from "fp-ts";

import type { Repository } from "../ports";

import type { Create } from "./ios";

class Service {
  constructor(private readonly repository: Repository.Repository) {}

  create({ password, ...rest }: Create.In): taskEither.TaskEither<string, Repository.Create.Out> {
    return this.repository.create({
      passwordHash: password,
      ...rest,
    });
  }
}

export { Service };
