import { FpTs } from "@lightest/core";
import bcrypt from "bcrypt";

import type { HashData } from "../../app";

function createDataHasher(numberOfRounds: number): HashData {
  return (data: string) => {
    return FpTs.Task.fromPromise(bcrypt.hash(data, numberOfRounds));
  };
}

export { createDataHasher };
