import { z } from "zod";

import { zAvatar, zPassword, zPasswordHash } from "../value-objects";

import { zEmail, zInt, zTrimmedStr } from "~/zod";

const zUser = z.object({
  id: zInt,
  firstName: zTrimmedStr,
  lastName: zTrimmedStr,
  avatar: zAvatar,
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
