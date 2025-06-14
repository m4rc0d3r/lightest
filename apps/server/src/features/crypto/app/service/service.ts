import type { GenerateUid } from "../ports";

class Service {
  constructor(private readonly generateUid_: GenerateUid) {}

  generateUid(lengthInBytes: number): ReturnType<GenerateUid> {
    return this.generateUid_(lengthInBytes);
  }
}

export { Service };
