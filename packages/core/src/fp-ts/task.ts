import type { task } from "fp-ts";

function fromPromise<T>(value: Promise<T>): task.Task<T> {
  return () => value;
}

export { fromPromise };
