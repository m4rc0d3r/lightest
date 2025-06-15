import { Debug } from "@lightest/core";

import type { StorageProvider } from "../ports";

@Debug.ClassDisplayName.set("BlobService")
class Service {
  private readonly provider: StorageProvider;

  constructor(blobStorageProvider: StorageProvider) {
    this.provider = blobStorageProvider;
  }

  upload(file: File): ReturnType<StorageProvider["upload"]> {
    return this.provider.upload(file);
  }

  delete(url: string): ReturnType<StorageProvider["delete"]> {
    return this.provider.delete(url);
  }
}

export { Service };
