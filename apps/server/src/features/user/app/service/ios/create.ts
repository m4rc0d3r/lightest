import { Domain } from "@lightest/core";
import { z } from "zod";

const zIn = Domain.User.zSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  })
  .extend({
    avatar: z.union([Domain.User.zSchema.shape.avatar, Domain.User.Attribute.Avatar.zFileSchema]),
  });
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
