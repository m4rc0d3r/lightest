import { FpTs } from "@lightest/core";
import bcrypt from "bcrypt";

import type { CompareDataHash } from "../../app";

const compareHashData: CompareDataHash = (data: string, hash: string) => {
  return FpTs.Task.fromPromise(bcrypt.compare(data, hash));
};

export { compareHashData };
