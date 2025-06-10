import bcrypt from "bcrypt";

import type { HashFn } from "../app";

function createBcryptHashFunction(numberOfRounds: number): HashFn {
  return (data: string) => {
    return bcrypt.hash(data, numberOfRounds);
  };
}

export { createBcryptHashFunction };
