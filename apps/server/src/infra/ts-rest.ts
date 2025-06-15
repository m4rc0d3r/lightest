import type { AppRoute, AppRouter, HTTPStatusCode } from "@ts-rest/core";
import { createExpressEndpoints, initServer } from "@ts-rest/express";
import type { RequestHandler } from "express";

const tsRestServer: ReturnType<typeof initServer> = initServer();

const tsRestContentTypeMiddleware: RequestHandler = (req, _res, next) => {
  const CONTENT_TYPE = "contentType";
  const TS_REST_ROUTE = "tsRestRoute";

  if (!(TS_REST_ROUTE in req))
    throw new Error(
      `The content type validation middleware should only be used as part of the globalMiddleware when using ${createExpressEndpoints.name} provided by ts-rest.`,
    );

  const { tsRestRoute } = req as { [TS_REST_ROUTE]: AppRouter | AppRoute };
  const expectedContentType = CONTENT_TYPE in tsRestRoute ? tsRestRoute[CONTENT_TYPE] : null;
  if (typeof expectedContentType === "string" && !req.is(expectedContentType))
    throw new Error(
      `Invalid content type. Expected '${expectedContentType}', got '${req.headers["content-type"]}'.`,
    );

  next();
};

function tsRestNoBody<T extends HTTPStatusCode>(status: T) {
  return { status, body: undefined };
}

function tsRestUnexpectedErrorBody() {
  return {
    status: 500,
    body: {
      area: "UNEXPECTED",
      message: "Something went wrong.",
    },
  } as const;
}

export { tsRestContentTypeMiddleware, tsRestNoBody, tsRestServer, tsRestUnexpectedErrorBody };
