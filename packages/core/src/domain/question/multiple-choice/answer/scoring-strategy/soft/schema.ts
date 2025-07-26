import { z } from "zod";

import { zWhenChoosingWrongOptionSchema } from "./when-choosing-wrong-option";

const zSchema = z.object({
  whenChoosingWrongOption: zWhenChoosingWrongOptionSchema,
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
