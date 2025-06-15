import { Domain } from "@lightest/core";
import type { z } from "zod";

const zIn = Domain.User.zSchema.pick({
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  passwordHash: true,
  verificationCode: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
