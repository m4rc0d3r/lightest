import {
  ParamsDictionary,
  Query as ParsedQs,
  Request,
  Response,
  NextFunction,
} from "express-serve-static-core";

import { APIError } from "../exceptions/api-error.js";
import { tokenService } from "../services/token-service.js";

export function authMiddleware(
  req: Request<ParamsDictionary, unknown, unknown, ParsedQs, Record<string, unknown>>,
  res: Response<unknown, Record<string, unknown>>,
  next: NextFunction,
): void {
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
