import { z } from "zod";

const zTypeSchema = z.enum(["HARD", "SOFT"]);
const TypeSchema = zTypeSchema.Enum;
type TypeSchema = z.infer<typeof zTypeSchema>;

export { TypeSchema, zTypeSchema };
