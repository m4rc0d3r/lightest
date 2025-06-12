import { BlobNotFoundError, del, put } from "@vercel/blob";
import { function as function_, taskEither } from "fp-ts";

import { NotFoundError, StorageProvider } from "../app";

class VercelStorageProvider extends StorageProvider {
  constructor(private readonly readWriteToken: string) {
    super();
  }

  override async upload(file: File): Promise<string> {
    return function_.pipe(
      await put(file.name, file, {
        access: "public",
        addRandomSuffix: true,
        token: this.readWriteToken,
      }),
      ({ url }) => url,
    );
  }

  override delete(url: string): taskEither.TaskEither<NotFoundError, void> {
    return taskEither.tryCatch(
      () =>
        del(url, {
          token: this.readWriteToken,
        }),
      (reason) => {
        if (reason instanceof BlobNotFoundError) {
          return new NotFoundError(url);
        }
        throw reason;
      },
    );
  }
}

export { VercelStorageProvider };
