import z from "zod";

import { Avatar, Password, PasswordHash, VerificationCode } from "./attributes";

const zSchema = z.object({
  id: z.number().int(),
  firstName: z.string().trim(),
  lastName: z.string().trim(),
  avatar: Avatar.zSchema,
  email: z.string().email(),
  password: Password.zSchema,
  passwordHash: PasswordHash.zSchema,
  verificationCode: VerificationCode.zSchema.nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
