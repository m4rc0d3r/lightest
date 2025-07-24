import type { AppRoute, AppRouter } from "@ts-rest/core";
import { createExpressEndpoints } from "@ts-rest/express";
import type { RequestHandler } from "express";

function getTsRestRoute(req: Parameters<RequestHandler>[0]) {
  const TS_REST_ROUTE = "tsRestRoute";

  if (!(TS_REST_ROUTE in req))
    throw new Error(
      `The content type validation middleware should only be used as part of the globalMiddleware when using ${createExpressEndpoints.name} provided by ts-rest.`,
    );

  return (req as { [TS_REST_ROUTE]: AppRouter | AppRoute })[TS_REST_ROUTE];
}

export { getTsRestRoute };
