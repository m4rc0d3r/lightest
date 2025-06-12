import type { taskEither } from "fp-ts";

import type { NotFoundError } from "../errors";

abstract class StorageProvider {
  abstract upload(file: File): Promise<string>;
  abstract delete(url: string): taskEither.TaskEither<NotFoundError, void>;
}

export { StorageProvider };
