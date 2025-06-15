import { UnexpectedError } from "@lightest/core";
import bcrypt from "bcrypt";
import { taskEither } from "fp-ts";

import type { CompareDataHash } from "../../app";

const compareHashData: CompareDataHash = (data: string, hash: string) => {
  return taskEither.tryCatch(
    () => bcrypt.compare(data, hash),
    (reason) => new UnexpectedError(reason),
  );
};

export { compareHashData };
