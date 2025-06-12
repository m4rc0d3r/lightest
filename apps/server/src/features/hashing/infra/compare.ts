import bcrypt from "bcrypt";

import type { CompareFn } from "../app";

const bcryptCompareFn: CompareFn = (data: string, hash: string) => {
  return bcrypt.compare(data, hash);
};

export { bcryptCompareFn };
