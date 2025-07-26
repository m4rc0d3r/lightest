import { z } from "zod";

import { zOptionSchema } from "./option";
import { zSchema } from "./scoring-strategy";

const zMultipleSchema = z.object({
  options: z.array(
    zOptionSchema.extend({
      isCorrect: z.boolean(),
    }),
  ),
  scoringStrategy: zSchema,
});
type MultipleSchema = z.infer<typeof zMultipleSchema>;

export { zMultipleSchema };
export type { MultipleSchema };
