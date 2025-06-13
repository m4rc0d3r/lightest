import type { GenerateUidFn } from "../ports";

class Service {
  constructor(private readonly generateUid_: GenerateUidFn) {}

  generateUid(lengthInBytes: number): ReturnType<GenerateUidFn> {
    return this.generateUid_(lengthInBytes);
  }
}

export { Service };
