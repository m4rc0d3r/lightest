import { Domain } from "@lightest/core";
import type z from "zod";

const zOut = Domain.User.zSchema.omit({
  password: true,
});
type Out = z.infer<typeof zOut>;

export { zOut };
export type { Out };
