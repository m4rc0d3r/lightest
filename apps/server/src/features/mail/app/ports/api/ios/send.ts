import { z } from "zod";

const zIn = z.object({
  from: z.string().email().optional(),
  to: z.string().email(),
  subject: z.string(),
  text: z.string().optional(),
  html: z.string().optional(),
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
