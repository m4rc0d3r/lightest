import { z } from "zod";

import { zOptionSchema } from "./option";

const zSingleSchema = z.object({
  options: z.array(zOptionSchema),
  correctId: zOptionSchema.shape.id,
});
type SingleSchema = z.infer<typeof zSingleSchema>;

export { zSingleSchema };
export type { SingleSchema };
