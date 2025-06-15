import { z } from "zod";

import { zAvatar, zPassword, zPasswordHash } from "../value-objects";

import { Zod } from "~/zod";

const { zEmail, zInt, zTrimmedStr } = Zod;

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
