import { UnexpectedError } from "@lightest/core";
import bcrypt from "bcrypt";
import { taskEither } from "fp-ts";

import type { HashData } from "../../app";

function createDataHasher(numberOfRounds: number): HashData {
  return (data: string) => {
    return taskEither.tryCatch(
      () => bcrypt.hash(data, numberOfRounds),
      (reason) => new UnexpectedError(reason),
    );
  };
}

export { createDataHasher };
