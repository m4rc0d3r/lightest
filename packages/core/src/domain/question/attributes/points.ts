import { z } from "zod";

const zSchema = z.number().int().positive();
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
