import { zAvatarAsFile, zUser } from "@lightest/core";
import { z } from "zod";

const zIn = zUser
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  })
  .extend({
    avatar: z.union([zUser.shape.avatar, zAvatarAsFile]),
  });
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
