import type { UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

type GenerateUid = (lengthInBytes: number) => taskEither.TaskEither<UnexpectedError, string>;

export type { GenerateUid };
