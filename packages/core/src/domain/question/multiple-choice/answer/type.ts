import { z } from "zod";

const zTypeSchema = z.enum(["SINGLE", "MULTIPLE"]);
const TypeSchema = zTypeSchema.Enum;
type TypeSchema = z.infer<typeof zTypeSchema>;

export { TypeSchema, zTypeSchema };
