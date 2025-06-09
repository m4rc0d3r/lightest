import { zUser } from "@lightest/core";
import type { z } from "zod";

const zIn = zUser.pick({
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  passwordHash: true,
});
type In = z.infer<typeof zIn>;

const zOut = zUser.omit({
  password: true,
});
type Out = z.infer<typeof zOut>;

export { zIn, zOut };
export type { In, Out };
