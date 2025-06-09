import { zUser } from "@lightest/core";
import type z from "zod";

const zIn = zUser.pick({
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  password: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
