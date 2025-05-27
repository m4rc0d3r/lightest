import type { NextFunction, Request, Response } from "express";

import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";

function errorMiddleware(
  err: APIError | Error,
  _req: Request<ParamsDictionary, APIError, unknown, ParsedQs, Record<string, unknown>>,
  res: Response<APIError, Record<string, unknown>>,
  _next: NextFunction,
): void {
  console.log("error-middleware got an error:");
  console.log(err);
  console.log();
  console.log();

  if (err instanceof APIError) {
    res.status(err.status).json(err);
  } else if (
    err instanceof SyntaxError &&
    "body" in err &&
    "type" in err &&
    (err as { type: string }).type === "entity.parse.failed"
  ) {
    res
      .status(500)
      .json(
        APIError.InternalServerError("Failed to read data.", APIErrorCode.DATA_CANNOT_BE_PARSED),
      );
  } else {
    res.status(500).json(APIError.InternalServerError(err.message, APIErrorCode.GENERAL));
  }
}

export { errorMiddleware };
