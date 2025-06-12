import bcrypt from "bcrypt";

import type { HashFn } from "../app";

function createBcryptHashFn(numberOfRounds: number): HashFn {
  return (data: string) => {
    return bcrypt.hash(data, numberOfRounds);
  };
}

export { createBcryptHashFn };
