import z from "zod";

import { zMe } from "./common";

import { Domain } from "~/domain";

const zReqBody = Domain.User.zSchema.pick({
  email: true,
  password: true,
});

const zResBody200 = z.object({
  me: zMe,
});

export { zReqBody, zResBody200 };
