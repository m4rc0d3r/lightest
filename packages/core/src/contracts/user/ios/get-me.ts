import z from "zod";

import { Domain } from "~/domain";

const zResBody200 = z.object({
  me: Domain.User.zSchema.pick({
    id: true,
    firstName: true,
    lastName: true,
    avatar: true,
    email: true,
    createdAt: true,
  }),
});

export { zResBody200 };
