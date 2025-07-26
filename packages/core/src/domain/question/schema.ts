import z from "zod";

import { Type } from "./attributes";
import { zBooleanSchema } from "./boolean";
import { zSchema as zMultipleChoiceSchema } from "./multiple-choice";
import { zShortAnswerSchema } from "./short-answer";

const DISCRIMINATOR = "type";

const zSchema = z.discriminatedUnion(DISCRIMINATOR, [
  zBooleanSchema.extend({
    [DISCRIMINATOR]: z.literal(Type.Schema.BOOLEAN),
  }),
  zMultipleChoiceSchema.extend({
    [DISCRIMINATOR]: z.literal(Type.Schema.MULTIPLE_CHOICE),
  }),
  zShortAnswerSchema.extend({
    [DISCRIMINATOR]: z.literal(Type.Schema.SHORT_ANSWER),
  }),
]);
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
