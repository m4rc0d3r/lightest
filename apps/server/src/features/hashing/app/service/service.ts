import type { CompareFn, HashFn } from "../ports";

class Service {
  constructor(
    private readonly hashData: HashFn,
    private readonly compareHashWithData: CompareFn,
  ) {}

  hash(data: string): ReturnType<HashFn> {
    return this.hashData(data);
  }

  compare(data: string, hash: string): ReturnType<CompareFn> {
    return this.compareHashWithData(data, hash);
  }
}

export { Service };
