import { z } from "zod";

const zSchema = z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]);
const Schema = zSchema.Enum;
type Schema = z.infer<typeof zSchema>;

export { Schema, zSchema };
