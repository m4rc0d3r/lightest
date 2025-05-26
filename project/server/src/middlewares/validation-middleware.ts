import {
  ParamsDictionary,
  Query as ParsedQs,
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";
import { validationResult } from "express-validator";

import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";

export function validationMiddleware(
  req: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>,
  res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log("Validation middleware encountered errors:", errors);

    return next(
      APIError.BadRequest(
        errors
          .array()
          .map((error) => error.msg)
          .join("\n"),
        APIErrorCode.INVALID_DATA_FORMAT,
      ),
    );
  } else {
    next();
  }
}
