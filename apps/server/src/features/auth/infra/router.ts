import { auth2Contract, ImpossibleError, Time } from "@lightest/core";
import type { CookieOptions, Response } from "express";
import { either } from "fp-ts";

import type { AuthTokenPayload } from "./types";

import { UniqueKeyViolationError } from "~/app";
import type { JwtSignedPayload } from "~/features/jwt";
import { tsRestNoBody, tsRestServer } from "~/infra";
import { isObject } from "~/shared";

const router: ReturnType<typeof tsRestServer.router<typeof auth2Contract>> = tsRestServer.router(
  auth2Contract,
  {
    register: async ({ req, res, body }) => {
      const {
        config: {
          auth: { tokenCookieName },
        },
        defaultCookieOptions,
        userService2,
        authTokenService,
      } = req.container.cradle;
      const resultOfCreation = await userService2.create(body)();

      if (either.isLeft(resultOfCreation)) {
        const error = resultOfCreation.left;

        if (error instanceof UniqueKeyViolationError)
          return {
            status: 409,
            body: resultOfCreation.left,
          };

        return tsRestNoBody(500);
      }

      const { passwordHash, updatedAt, ...me } = resultOfCreation.right;
      const generationResult = await authTokenService.generate({ userId: me.id })();
      if (either.isLeft(generationResult)) return tsRestNoBody(500);

      const { token: authToken, payload } = generationResult.right;

      setAuthenticationCookie(
        res,
        { name: tokenCookieName, options: defaultCookieOptions },
        { encoded: authToken, payload },
      );

      return {
        status: 201,
        body: {
          me,
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
      const searchResult = await userService2.get(body)();

      if (either.isLeft(searchResult))
        return {
          status: 404,
          body: searchResult.left,
        };

      const { passwordHash, updatedAt, ...me } = searchResult.right;
      const generationResult = await authTokenService.generate({ userId: me.id })();
      if (either.isLeft(generationResult)) return tsRestNoBody(500);

      const { token: authToken, payload } = generationResult.right;

      setAuthenticationCookie(
        res,
        { name: tokenCookieName, options: defaultCookieOptions },
        { encoded: authToken, payload },
      );

      return {
        status: 200,
        body: {
          me,
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

      if (!isObject(req.cookies)) throw new ImpossibleError("Cookies must be of type object.");

      const token = (req.cookies as Record<string, unknown>)[tokenCookieName];
      if (typeof token !== "string") return tsRestNoBody(401);

      const verificationResult = await authTokenService.verify(token)();
      if (either.isLeft(verificationResult)) return tsRestNoBody(401);

      clearAuthenticationCookies(res, tokenCookieName);

      return tsRestNoBody(200);
    },
  },
);

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
