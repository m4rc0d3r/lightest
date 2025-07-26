import { z } from "zod";

import { zBaseSchema } from "./base";

const zBooleanSchema = zBaseSchema.extend({
  answer: z.boolean(),
});
type BooleanSchema = z.infer<typeof zBooleanSchema>;

export { zBooleanSchema };
export type { BooleanSchema };
