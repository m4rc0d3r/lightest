import { auth2Contract } from "@lightest/core";
import type { CookieOptions, Response } from "express";
import { either } from "fp-ts";

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
      const {
        token: refreshToken,
        payload: { exp: refreshTokenExpirationDate },
      } = await refreshTokenService.generate(payload);

      setAuthenticationCookie(
        res,
        refreshToken,
        refreshTokenCookieName,
        defaultCookieOptions,
        new Date(refreshTokenExpirationDate),
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
      const {
        token: refreshToken,
        payload: { exp: refreshTokenExpirationDate },
      } = await refreshTokenService.generate(payload);

      setAuthenticationCookie(
        res,
        refreshToken,
        refreshTokenCookieName,
        defaultCookieOptions,
        new Date(refreshTokenExpirationDate),
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

function setAuthenticationCookie(
  res: Response,
  refreshToken: string,
  cookieName: string,
  cookieOptions: CookieOptions,
  refreshTokenExpirationDate: Date,
) {
  res.cookie(cookieName, refreshToken, {
    ...cookieOptions,
    expires: refreshTokenExpirationDate,
    signed: false,
  });
}

export { router };
