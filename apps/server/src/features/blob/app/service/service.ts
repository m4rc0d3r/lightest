import type { StorageProvider } from "../ports";

class Service {
  constructor(private readonly provider: StorageProvider) {}

  upload(file: File): ReturnType<StorageProvider["upload"]> {
    return this.provider.upload(file);
  }

  delete(url: string): ReturnType<StorageProvider["delete"]> {
    return this.provider.delete(url);
  }
}

export { Service };
