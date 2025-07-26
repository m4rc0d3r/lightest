import type { z } from "zod";

import { zBaseSchema } from "../base";

import { zSchema as zAnswerSchema } from "./answer";

const zSchema = zBaseSchema.extend({
  answer: zAnswerSchema,
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
