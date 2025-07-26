import { z } from "zod";

const CONSTRAINTS = {
  length: {
    maximum: 256,
  },
};

const zSchema = z.string().trim().max(CONSTRAINTS.length.maximum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
