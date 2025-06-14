import type { UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

import type { NotFoundError } from "../errors";

abstract class StorageProvider {
  abstract upload(file: File): taskEither.TaskEither<UnexpectedError, string>;
  abstract delete(url: string): taskEither.TaskEither<UnexpectedError | NotFoundError, void>;
}

export { StorageProvider };
