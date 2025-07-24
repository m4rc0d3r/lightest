import type { RequestHandler } from "express";

import { getTsRestRoute } from "./get-ts-rest-route";

const contentTypeCheck: RequestHandler = (req, _res, next) => {
  const tsRestRoute = getTsRestRoute(req);
  const CONTENT_TYPE = "contentType";
  const expectedContentType = CONTENT_TYPE in tsRestRoute ? tsRestRoute[CONTENT_TYPE] : null;
  if (typeof expectedContentType === "string" && !req.is(expectedContentType))
    throw new Error(
      `Invalid content type. Expected '${expectedContentType}', got '${req.headers["content-type"]}'.`,
    );

  next();
};

export { contentTypeCheck };
