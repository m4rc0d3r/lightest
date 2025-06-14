import { zUser } from "@lightest/core";
import type { z } from "zod";

const zIn = zUser.pick({
  email: true,
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
