import { z } from "zod";

import { zMultipleSchema } from "./multiple";
import { zSingleSchema } from "./single";
import { TypeSchema } from "./type";

const DISCRIMINATOR = "type";

const zSchema = z.discriminatedUnion(DISCRIMINATOR, [
  zSingleSchema.extend({
    [DISCRIMINATOR]: z.literal(TypeSchema.SINGLE),
  }),
  zMultipleSchema.extend({
    [DISCRIMINATOR]: z.literal(TypeSchema.MULTIPLE),
  }),
]);
type Schema = z.infer<typeof zSchema>;

export { DISCRIMINATOR, zSchema };
export type { Schema };
