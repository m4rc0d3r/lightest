import { z } from "zod";

const zErrorArea = z.enum(["KEY_VIOLATION", "NOT_FOUND", "UNEXPECTED"]);
const ErrorArea = zErrorArea.Values;
type ErrorArea = z.infer<typeof zErrorArea>;

const zNotFoundError = z.object({
  area: z.literal(ErrorArea.NOT_FOUND),
});

const zUniqueKeyViolationError = z.object({
  area: z.literal(ErrorArea.KEY_VIOLATION),
  type: z.enum(["foreign", "unique"]),
  constraintName: z.string().trim(),
});

const zUnexpectedError = z.object({
  area: z.literal(ErrorArea.UNEXPECTED),
  message: z.string().trim(),
});

export { ErrorArea, zErrorArea, zNotFoundError, zUnexpectedError, zUniqueKeyViolationError };
