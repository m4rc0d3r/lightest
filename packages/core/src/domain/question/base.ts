import { z } from "zod";

import { Points, Text } from "./attributes";

import { Zod } from "~/zod";

const zBaseSchema = z.object({
  id: z.number().int(),
  text: Text.zSchema,
  image: Zod.zUrlOrEmptyStr,
  points: Points.zSchema,
});
type BaseSchema = z.infer<typeof zBaseSchema>;

export { zBaseSchema };
export type { BaseSchema };
