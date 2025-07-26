import { z } from "zod";

const zWhenChoosingWrongOptionSchema = z.enum(["SUBTRACT", "IGNORE"]);
const WhenChoosingWrongOptionSchema = zWhenChoosingWrongOptionSchema.Enum;
type WhenChoosingWrongOptionSchema = z.infer<typeof zWhenChoosingWrongOptionSchema>;

export { WhenChoosingWrongOptionSchema, zWhenChoosingWrongOptionSchema };
