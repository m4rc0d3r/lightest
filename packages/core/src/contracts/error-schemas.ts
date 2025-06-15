import { z } from "zod";

const zErrorArea = z.enum(["KEY_VIOLATION", "NOT_FOUND"]);
const ERROR_AREA = zErrorArea.Values;
type ErrorArea = z.infer<typeof zErrorArea>;

const zNotFoundError = z.object({
  area: z.literal(ERROR_AREA.NOT_FOUND),
});

const zUniqueKeyViolationError = z.object({
  area: z.literal(ERROR_AREA.KEY_VIOLATION),
  type: z.enum(["foreign", "unique"]),
  constraintName: z.string().trim(),
});

const HTTP_STATUS_CODES_BY_ERROR_AREA = {
  [ERROR_AREA.NOT_FOUND]: 404,
  [ERROR_AREA.KEY_VIOLATION]: 409,
} as const satisfies Record<ErrorArea, number>;

function getErrorWithHttpStatusCode<T extends z.ZodObject<{ area: z.ZodLiteral<ErrorArea> }>>(
  schema: T,
) {
  return {
    [HTTP_STATUS_CODES_BY_ERROR_AREA[schema.shape.area.value]]: schema,
  };
}

export {
  ERROR_AREA,
  getErrorWithHttpStatusCode,
  HTTP_STATUS_CODES_BY_ERROR_AREA,
  zErrorArea,
  zNotFoundError,
  zUniqueKeyViolationError,
};
