import type { AppRouter, FlattenAppRouter } from "@ts-rest/core";
import type { RequestValidationError, TsRestRequest } from "@ts-rest/express";
import type { NextFunction, Response } from "express";

import { APIError, Code as APIErrorCode } from "../exceptions/api-error.js";

import { isObject } from "~/shared/index.js";

const validationMiddleware =
  <T extends AppRouter>(_schema: T) =>
  (
    err: RequestValidationError,
    _req: TsRestRequest<FlattenAppRouter<T>>,
    _res: Response,
    next: NextFunction,
  ) => {
    const { pathParams, query, headers, body } = err;
    const error = pathParams ?? query ?? headers ?? body;

    if (!error) return next();

    const _ERRORS = "_errors";

    next(
      APIError.BadRequest(
        Object.entries(error.format())
          .filter(([key]) => key !== _ERRORS)
          .map(([, value]) =>
            isObject(value) && _ERRORS in value && Array.isArray(value[_ERRORS])
              ? value[_ERRORS].join("\n")
              : "",
          )
          .filter((value) => !!value)
          .join("\n"),
        APIErrorCode.INVALID_DATA_FORMAT,
      ),
    );
  };

export { validationMiddleware };
