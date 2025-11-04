import { contract } from "@lightest/core";
import type { CookieOptions, Request, Response } from "express";

import type { Tokens } from "../services/token-service.js";
import type { Report } from "../types/report.js";

import { tsRestServer } from "~/infra/ts-rest.js";

const authRouter: ReturnType<typeof tsRestServer.router<typeof contract.auth>> =
  tsRestServer.router(contract.auth, {
    register: async ({ req, res, body: { email, password } }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        defaultCookieOptions,
        authService,
      } = req.container.cradle;

      const { tokens, refreshTokenExpirationDate } = await authService.register(email, password);
      setAuthenticationCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
      );

      return {
        status: 200,
        body: {
          message: "Account registration completed successfully.",
          payload: tokens.accessToken,
        },
      };
    },
    login: async ({ req, res, body: { email, password } }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        defaultCookieOptions,
        authService,
      } = req.container.cradle;

      const { tokens, refreshTokenExpirationDate } = await authService.login(email, password);
      setAuthenticationCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
      );

      return {
        status: 200,
        body: {
          message: "Account registration completed successfully.",
          payload: tokens.accessToken,
        },
      };
    },
    logout: async ({ req, res }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        authService,
      } = req.container.cradle;

      const refreshToken = getRefreshTokenFromCookies(req, refreshTokenCookieName);

      await authService.logout(refreshToken);
      clearAuthenticationCookies(res, refreshTokenCookieName);

      return {
        status: 200,
        body: { message: "Account logout completed successfully." },
      };
    },
    refresh: async ({ req, res }) => {
      const {
        config: {
          auth: { refreshTokenCookieName },
        },
        defaultCookieOptions,
        authService,
      } = req.container.cradle;

      const refreshToken = getRefreshTokenFromCookies(req, refreshTokenCookieName);

      const { tokens, refreshTokenExpirationDate } = await authService.refresh(refreshToken);
      setAuthenticationCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
      );

      return {
        status: 200,
        body: {
          message: "Access token updated successfully.",
          payload: tokens.accessToken,
        },
      };
    },
    activate: async ({ req, params: { link: activationLink } }) => {
      const { authService } = req.container.cradle;

      await authService.activate(activationLink);

      return {
        status: 200,
        body: { message: "Account successfully activated." },
      };
    },
  });

function getRefreshTokenFromCookies(req: Request, refreshTokenCookieName: string) {
  const { [refreshTokenCookieName]: refreshToken } = req.cookies;
  if (typeof refreshToken !== "string")
    throw new TypeError("The request cookie must contain a refresh token.");

  return refreshToken;
}

function setAuthenticationCookie(
  res: Response<Report<string>, Record<string, unknown>>,
  tokens: Tokens,
  cookieName: string,
  cookieOptions: CookieOptions,
  refreshTokenExpirationDate: Date,
) {
  res.cookie(cookieName, tokens.refreshToken, {
    ...cookieOptions,
    expires: refreshTokenExpirationDate,
    signed: false,
  });
}

function clearAuthenticationCookies(
  res: Response<Report<string>, Record<string, unknown>>,
  cookieName: string,
) {
  res.clearCookie(cookieName);
}

export { authRouter };
