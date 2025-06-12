import { zEmail } from "@lightest/core";
import { z } from "zod";

const zIn = z.object({
  from: zEmail.optional(),
  to: zEmail,
  subject: z.string(),
  text: z.string().optional(),
  html: z.string().optional(),
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
