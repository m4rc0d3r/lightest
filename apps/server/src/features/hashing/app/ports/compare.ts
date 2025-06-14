import type { task } from "fp-ts";

type CompareDataHash = (data: string, hash: string) => task.Task<boolean>;

export type { CompareDataHash };
