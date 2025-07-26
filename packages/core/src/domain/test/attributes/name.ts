import { z } from "zod";

const CONSTRAINTS = {
  length: {
    minimum: 2,
    maximum: 64,
  },
};

const zSchema = z.string().trim().min(CONSTRAINTS.length.minimum).max(CONSTRAINTS.length.maximum);
type Schema = z.infer<typeof zSchema>;

export { CONSTRAINTS, zSchema };
export type { Schema };
