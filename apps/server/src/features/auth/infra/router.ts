import { Contract, Time, TypeGuard } from "@lightest/core";
import type { CookieOptions, Response } from "express";
import { either, function as function_, taskEither } from "fp-ts";

import type { AuthTokenPayload } from "./types";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { JwtSignedPayload } from "~/features/jwt";
import { tsRestNoBody, tsRestServer, tsRestUnexpectedErrorBody } from "~/infra";

const router: ReturnType<typeof tsRestServer.router<typeof Contract.contract.auth>> =
  tsRestServer.router(Contract.contract.auth, {
    register: async ({ req, res, body }) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        defaultCookieOptions,
        userService2,
        authTokenService,
      } = req.container.cradle;

      const resultOfCreation = await function_.pipe(
        userService2.create(body),
        taskEither.flatMap((user) =>
          function_.pipe(
            authTokenService.generate({ userId: user.id }),
            taskEither.tapIO(
              ({ token: authToken, payload }) =>
                () =>
                  setAuthenticationCookie(
                    res,
                    { name: tokenCookieName, options: defaultCookieOptions },
                    { encoded: authToken, payload },
                  ),
            ),
            taskEither.map(() => user),
            taskEither.map(({ passwordHash, verificationCode, updatedAt, ...me }) => me),
          ),
        ),
        taskEither.toUnion,
      )();

      if (resultOfCreation instanceof Error) {
        if (resultOfCreation instanceof UniqueKeyViolationError)
          return { status: 409, body: { area: "KEY_VIOLATION", ...resultOfCreation } };

        return tsRestUnexpectedErrorBody();
      }

      return {
        status: 201,
        body: {
          me: resultOfCreation,
        },
      };
    },
    login: async ({ req, res, body }) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        defaultCookieOptions,
        userService2,
        authTokenService,
      } = req.container.cradle;

      const searchResult = await function_.pipe(
        userService2.get(body),
        taskEither.flatMap((user) =>
          function_.pipe(
            authTokenService.generate({ userId: user.id }),
            taskEither.tapIO(
              ({ token: authToken, payload }) =>
                () =>
                  setAuthenticationCookie(
                    res,
                    { name: tokenCookieName, options: defaultCookieOptions },
                    { encoded: authToken, payload },
                  ),
            ),
            taskEither.map(() => user),
            taskEither.map(({ passwordHash, verificationCode, updatedAt, ...me }) => me),
          ),
        ),
        taskEither.toUnion,
      )();

      if (searchResult instanceof Error) {
        if (searchResult instanceof NotFoundError)
          return { status: 404, body: { area: "NOT_FOUND", ...searchResult } };

        return tsRestUnexpectedErrorBody();
      }

      return {
        status: 200,
        body: {
          me: searchResult,
        },
      };
    },
    logout: async ({ req, res }) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        authTokenService,
      } = req.container.cradle;

      return function_.pipe(
        req.cookies,
        either.fromPredicate(TypeGuard.isObject, () => tsRestNoBody(401)),
        either.map((cookies) => (cookies as Record<string, unknown>)[tokenCookieName]),
        either.flatMap((token) =>
          function_.pipe(
            token,
            either.fromPredicate(
              (token) => typeof token === "string",
              () => tsRestNoBody(401),
            ),
          ),
        ),
        taskEither.fromEither,
        taskEither.flatMap((token) =>
          function_.pipe(
            authTokenService.verify(token),
            taskEither.tapIO(() => () => clearAuthenticationCookies(res, tokenCookieName)),
            taskEither.mapLeft(() => tsRestNoBody(401)),
            taskEither.map(() => tsRestNoBody(200)),
          ),
        ),
        taskEither.toUnion,
      )();
    },
  });

function setAuthenticationCookie(
  res: Response,
  cookie: {
    name: string;
    options: CookieOptions;
  },
  token: {
    encoded: string;
    payload: JwtSignedPayload<AuthTokenPayload>;
  },
) {
  const { exp, iat } = token.payload;
  const maxAge = (exp - iat) * Time.MILLISECONDS_PER_SECOND;
  const expires = new Date(exp * Time.MILLISECONDS_PER_SECOND);

  res.cookie(cookie.name, token.encoded, {
    ...cookie.options,
    expires,
    maxAge,
    signed: false,
  });
}

function clearAuthenticationCookies(res: Response, cookieName: string) {
  res.clearCookie(cookieName);
}

export { router };
