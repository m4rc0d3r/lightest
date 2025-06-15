import z from "zod";

import { zMe } from "./common";

import { Domain } from "~/domain";

const zReqBody = Domain.User.zSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    password: true,
  })
  .extend({
    avatar: z.union([Domain.User.zSchema.shape.avatar, Domain.User.Attribute.Avatar.zFileSchema]),
  });

const zResBody201 = z.object({
  me: zMe,
});

export { zReqBody, zResBody201 };
