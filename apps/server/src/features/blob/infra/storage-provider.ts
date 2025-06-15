import { UnexpectedError } from "@lightest/core";
import { BlobNotFoundError, del, put } from "@vercel/blob";
import { function as function_, taskEither } from "fp-ts";

import { NotFoundError, StorageProvider } from "../app";

class VercelStorageProvider extends StorageProvider {
  constructor(private readonly readWriteToken: string) {
    super();
  }

  override upload(file: File): taskEither.TaskEither<UnexpectedError, string> {
    return function_.pipe(
      taskEither.tryCatch(
        () =>
          put(file.name, file, {
            access: "public",
            addRandomSuffix: true,
            token: this.readWriteToken,
          }),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.map(({ url }) => url),
    );
  }

  override delete(url: string): taskEither.TaskEither<UnexpectedError | NotFoundError, void> {
    return taskEither.tryCatch(
      () =>
        del(url, {
          token: this.readWriteToken,
        }),
      (reason) => {
        if (reason instanceof BlobNotFoundError) {
          return new NotFoundError(url);
        }
        return new UnexpectedError(reason);
      },
    );
  }
}

export { VercelStorageProvider };
