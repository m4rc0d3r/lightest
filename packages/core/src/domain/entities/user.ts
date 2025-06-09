import { z } from "zod";

import { zPassword, zPasswordHash } from "../value-objects";

import { zEmail, zInt, zTrimmedStr, zUrlOrEmptyStr } from "~/zod";

const zUser = z.object({
  id: zInt,
  firstName: zTrimmedStr,
  lastName: zTrimmedStr,
  avatar: zUrlOrEmptyStr,
  email: zEmail,
  password: zPassword,
  passwordHash: zPasswordHash,
  verificationCode: zTrimmedStr.nonempty().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
type User = z.infer<typeof zUser>;

export { zUser };
export type { User };
