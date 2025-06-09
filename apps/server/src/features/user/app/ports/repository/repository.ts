import type { taskEither } from "fp-ts";

import type { Create } from "./ios";

abstract class Repository {
  abstract create(params: Create.In): taskEither.TaskEither<string, Create.Out>;
}

export { Repository };
