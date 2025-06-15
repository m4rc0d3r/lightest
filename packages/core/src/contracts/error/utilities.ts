import type { z } from "zod";

import { ErrorArea } from "./schemas";

const HttpStatusCodeByErrorArea = {
  [ErrorArea.NOT_FOUND]: 404,
  [ErrorArea.KEY_VIOLATION]: 409,
  [ErrorArea.UNEXPECTED]: 500,
} as const satisfies Record<ErrorArea, number>;
type HttpStatusCodeByErrorArea = typeof HttpStatusCodeByErrorArea;

type FailedResponseSchema = z.ZodObject<{ area: z.ZodLiteral<ErrorArea> }>;
type FailedResponseSchemas = [FailedResponseSchema, ...FailedResponseSchema[]] | [];
type FailedResponseMap<Schemas extends FailedResponseSchemas> = {
  [S in Schemas[number] as HttpStatusCodeByErrorArea[S["shape"]["area"]["value"]]]: S;
};

function getFailedResponses<Schemas extends FailedResponseSchemas>(schemas: Schemas) {
  return Object.fromEntries(
    schemas.map((schema) => [HttpStatusCodeByErrorArea[schema.shape.area.value], schema]),
  ) as FailedResponseMap<Schemas>;
}

export { getFailedResponses };
