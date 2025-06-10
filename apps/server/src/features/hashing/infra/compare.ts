import bcrypt from "bcrypt";

import type { CompareFn } from "../app";

const bcryptCompareFunction: CompareFn = (data: string, hash: string) => {
  return bcrypt.compare(data, hash);
};

export { bcryptCompareFunction };
