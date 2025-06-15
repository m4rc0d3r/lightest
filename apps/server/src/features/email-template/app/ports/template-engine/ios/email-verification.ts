import { z } from "zod";

const zIn = z.object({
  appName: z.string().trim().nonempty(),
  clientAppUrl: z.string().url(),
  linkToConfirmEmailAddress: z.string().url(),
});
type In = z.infer<typeof zIn>;

export { zIn };
export type { In };
