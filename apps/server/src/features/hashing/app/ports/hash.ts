import type { task } from "fp-ts";

type HashData = (data: string) => task.Task<string>;

export type { HashData };
