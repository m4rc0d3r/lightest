import { z } from "zod";

import { zBaseSchema } from "./base";

const zShortAnswerSchema = zBaseSchema.extend({
  answer: z.string().trim().nonempty(),
});
type ShortAnswerSchema = z.infer<typeof zShortAnswerSchema>;

export { zShortAnswerSchema };
export type { ShortAnswerSchema };
