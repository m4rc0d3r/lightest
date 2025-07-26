import { z } from "zod";

const zSchema = z.enum(["BOOLEAN", "MULTIPLE_CHOICE", "SHORT_ANSWER"]);
const Schema = zSchema.Enum;
type Schema = z.infer<typeof zSchema>;

export { Schema, zSchema };
