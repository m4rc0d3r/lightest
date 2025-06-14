import type { UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

type CompareDataHash = (
  data: string,
  hash: string,
) => taskEither.TaskEither<UnexpectedError, boolean>;

export type { CompareDataHash };
