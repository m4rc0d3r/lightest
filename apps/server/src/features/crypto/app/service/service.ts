import { Debug } from "@lightest/core";

import type { GenerateUid } from "../ports";

@Debug.ClassDisplayName.set("CryptoService")
class Service {
  constructor(private readonly generateUid_: GenerateUid) {}

  generateUid(lengthInBytes: number): ReturnType<GenerateUid> {
    return this.generateUid_(lengthInBytes);
  }
}

export { Service };
