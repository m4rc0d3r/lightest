import type { NextFunction, Request, Response } from "express";

import { APIError } from "../exceptions/api-error.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";

function authMiddleware(
  req: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>,
  _res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void {
  const { tokenService } = req.container.cradle;

  try {
    const authorizationHeader = req.headers.authorization;
    if (!authorizationHeader) {
      console.log("!authorizationHeader");
      return next(APIError.Unauthorized());
    }

    const accessToken = authorizationHeader.split(" ")[1];
    if (!accessToken) {
      console.log("!accessToken");
      return next(APIError.Unauthorized());
    }

    const payload = tokenService.validateAccessToken(accessToken);
    if (!payload) {
      console.log("!payload");
      return next(APIError.Unauthorized());
    }

    (req as unknown as { userId: number }).userId = (payload as { userId: number }).userId;

    next();
  } catch {
    return next(APIError.Unauthorized());
  }
}

export { authMiddleware };
