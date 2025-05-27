import type { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";

import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";

function validationMiddleware(
  req: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>,
  _res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation middleware encountered errors:", errors);

    return next(
      APIError.BadRequest(
        errors
          .array()
          .map(({ msg }) => (typeof msg === "string" ? msg : ""))
          .filter((value) => !!value)
          .join("\n"),
        APIErrorCode.INVALID_DATA_FORMAT,
      ),
    );
  } else {
    next();
  }
}

export { validationMiddleware };
