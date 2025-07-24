import { Contract, TypeGuard } from "@lightest/core";
import type { RequestHandler } from "express";
import { either, function as function_, taskEither } from "fp-ts";

import { attachUserToRequest } from "../authentication";

import { getTsRestRoute } from "./get-ts-rest-route";

import { AuthenticationError } from "~/app";

const authentication: RequestHandler = (req, res, next) => {
  const tsRestRoute = getTsRestRoute(req);

  if (!Contract.isAuthenticationRequired(tsRestRoute)) next();

  const {
    config: {
      auth: { tokenCookieName },
    },
    authTokenService,
  } = req.container.cradle;

  void function_
    .pipe(
      req.cookies,
      either.fromPredicate(TypeGuard.isObject, () => new AuthenticationError()),
      either.map((cookies) => (cookies as Record<string, unknown>)[tokenCookieName]),
      either.flatMap((token) =>
        function_.pipe(
          token,
          either.fromPredicate(
            (token) => typeof token === "string",
            () => new AuthenticationError(),
          ),
        ),
      ),
      taskEither.fromEither,
      taskEither.flatMap((token) =>
        function_.pipe(
          authTokenService.verify(token),
          taskEither.mapLeft(() => new AuthenticationError()),
          taskEither.map(({ userId }) => ({
            id: userId,
          })),
        ),
      ),
      taskEither.toUnion,
    )()
    .then((authenticationResult) => {
      if (authenticationResult instanceof Error) {
        res.status(401).send();
      } else {
        attachUserToRequest(req, authenticationResult);

        next();
      }
    });
};

export { authentication };
