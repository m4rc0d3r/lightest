import { Domain } from "@lightest/core";
import type { z } from "zod";

const zIn = Domain.User.zSchema.pick({
  id: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
