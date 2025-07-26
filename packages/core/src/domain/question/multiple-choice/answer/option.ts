import { z } from "zod";

const zOptionSchema = z.object({
  id: z.number().int(),
  text: z.string().trim().nonempty(),
});
type OptionSchema = z.infer<typeof zOptionSchema>;

export { zOptionSchema };
export type { OptionSchema };
