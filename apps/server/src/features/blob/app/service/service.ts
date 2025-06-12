import type { taskEither } from "fp-ts";

import type { NotFoundError } from "../errors";
import type { StorageProvider } from "../ports";

class Service {
  constructor(private readonly provider: StorageProvider) {}

  upload(file: File): Promise<string> {
    return this.provider.upload(file);
  }

  delete(url: string): taskEither.TaskEither<NotFoundError, void> {
    return this.provider.delete(url);
  }
}

export { Service };
