import type { User } from "@lightest/core";
import { auth2Contract, Time } from "@lightest/core";
import type { CookieOptions, Response } from "express";
import { either } from "fp-ts";

import type { JwtSignedPayload } from "~/features/jwt";
import { tsRestServer } from "~/infra";

const router: ReturnType<typeof tsRestServer.router<typeof auth2Contract>> = tsRestServer.router(
  auth2Contract,
  {
    register: async ({ req, res, body }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        defaultCookieOptions,
        userService2,
        accessTokenService,
        refreshTokenService,
      } = req.container.cradle;
      const resultOfCreation = await userService2.create(body);

      if (either.isLeft(resultOfCreation))
        return {
          status: 409,
          body: resultOfCreation.left,
        };

      const { passwordHash, updatedAt, ...me } = resultOfCreation.right;
      const payload = { userId: me.id };
      const { token: accessToken } = await accessTokenService.generate(payload);
      const { token: refreshToken, payload: signedPayload } =
        await refreshTokenService.generate(payload);

      setAuthenticationCookie(
        res,
        { name: refreshTokenCookieName, options: defaultCookieOptions },
        { encoded: refreshToken, payload: signedPayload },
      );

      return {
        status: 201,
        body: {
          accessToken,
          me,
        },
      };
    },
    login: async ({ req, res, body }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        defaultCookieOptions,
        userService2,
        accessTokenService,
        refreshTokenService,
      } = req.container.cradle;
      const searchResult = await userService2.get(body)();

      if (either.isLeft(searchResult))
        return {
          status: 404,
          body: searchResult.left,
        };

      const { passwordHash, updatedAt, ...me } = searchResult.right;
      const payload = { userId: me.id };
      const { token: accessToken } = await accessTokenService.generate(payload);
      const { token: refreshToken, payload: signedPayload } =
        await refreshTokenService.generate(payload);

      setAuthenticationCookie(
        res,
        { name: refreshTokenCookieName, options: defaultCookieOptions },
        { encoded: refreshToken, payload: signedPayload },
      );

      return {
        status: 200,
        body: {
          accessToken,
          me,
        },
      };
    },
  },
);

type RefreshTokenPayload = {
  userId: User["id"];
};

function setAuthenticationCookie(
  res: Response,
  cookie: {
    name: string;
    options: CookieOptions;
  },
  token: {
    encoded: string;
    payload: JwtSignedPayload<RefreshTokenPayload>;
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

export { router };
