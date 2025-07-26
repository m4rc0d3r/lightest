import { z } from "zod";

import { zSchema as zSoftSchema } from "./soft";
import { TypeSchema } from "./type";

const DISCRIMINATOR = "type";

const zSchema = z.discriminatedUnion(DISCRIMINATOR, [
  zSoftSchema.extend({
    [DISCRIMINATOR]: z.literal(TypeSchema.SOFT),
  }),
  z.object({
    [DISCRIMINATOR]: z.literal(TypeSchema.HARD),
  }),
]);
type Schema = z.infer<typeof zSchema>;

export { DISCRIMINATOR, zSchema };
export type { Schema };
