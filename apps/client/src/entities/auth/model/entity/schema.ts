import { Domain } from "@lightest/core";
import type { z } from "zod";

const zSourceSchema = Domain.User.zSchema;

const zSchema = zSourceSchema.pick({
  id: true,
  firstName: true,
  lastName: true,
  avatar: true,
  email: true,
  createdAt: true,
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
