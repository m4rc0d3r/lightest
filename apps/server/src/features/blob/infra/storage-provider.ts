import { Debug, UnexpectedError } from "@lightest/core";
import { BlobNotFoundError, del, put } from "@vercel/blob";
import { function as function_, taskEither } from "fp-ts";

import { NotFoundError, StorageProvider } from "../app";

import type { Config } from "~/infra";

@Debug.ClassDisplayName.set("VercelBlobStorageProvider")
class VercelStorageProvider extends StorageProvider {
  private readonly readWriteToken: string;

  constructor(config: Config) {
    super();
    this.readWriteToken = config.vercel.blobReadWriteToken;
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
