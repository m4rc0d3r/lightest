import { z } from "zod";

import { zAvatar, zPassword, zPasswordHash } from "../value-objects";

const zUser = z.object({
  id: z.number().int(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  avatar: zAvatar,
  email: z.string().email(),
  password: zPassword,
  passwordHash: zPasswordHash,
  verificationCode: z.string().trim().nonempty().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
type User = z.infer<typeof zUser>;

export { zUser };
export type { User };
