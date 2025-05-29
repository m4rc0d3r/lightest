import z from "zod";

const TRUE = "true";

const zBooleanishString = z.enum([TRUE, "false"]).transform((value) => value === TRUE);

function zArrayable<T extends z.ZodSchema>(schema: T) {
  return z.union([schema, z.array(schema)]);
}

export { zArrayable, zBooleanishString };
