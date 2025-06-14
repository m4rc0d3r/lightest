import type { CompareDataHash, HashData } from "../ports";

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
