import { Debug } from "@lightest/core";

import type { CompareDataHash, HashData } from "../ports";

@Debug.ClassDisplayName.set("HashingService")
class Service {
  constructor(
    private readonly hashData: HashData,
    private readonly compareHashWithData: CompareDataHash,
  ) {}

  hash(data: string): ReturnType<HashData> {
    return this.hashData(data);
  }

  compare(data: string, hash: string): ReturnType<CompareDataHash> {
    return this.compareHashWithData(data, hash);
  }
}

export { Service };
