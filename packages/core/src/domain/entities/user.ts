import { z } from "zod";

import { zPassword, zPasswordHash } from "../value-objects";

import { zEmail, zInt, zTrimmedStr, zUrlOrEmptyStr } from "~/zod";

const zUser = z.object({
  id: zInt,
  firstName: zTrimmedStr,
  lastName: zTrimmedStr,
  email: zEmail,
  password: zPassword,
  passwordHash: zPasswordHash,
  avatar: zUrlOrEmptyStr,
  createdAt: z.date(),
  updatedAt: z.date(),
});

export { zUser };
