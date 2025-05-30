import type { CookieOptions, NextFunction, Request, Response } from "express";

import type { Tokens } from "../services/token-service.js";
import type { AuthData } from "../types/auth-data.js";
import type { ParamsDictionary, ParsedQs } from "../types/express.js";
import type { Report } from "../types/report.js";

class AuthController {
  async register(
    req: Request<ParamsDictionary, Report<string>, AuthData, ParsedQs, Record<string, unknown>>,
    res: Response<Report<string>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const {
      config: {
        auth: { refreshTokenCookieName },
      },
      defaultCookieOptions,
      authService,
    } = req.container.cradle;

    try {
      const { email, password } = req.body;
      const { tokens, refreshTokenExpirationDate } = await authService.register(email, password);
      this.sendResponseWithCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
        "Account registration completed successfully.",
      );
    } catch (e) {
      next(e);
    }
  }

  async login(
    req: Request<ParamsDictionary, Report<string>, AuthData, ParsedQs, Record<string, unknown>>,
    res: Response<Report<string>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const {
      config: {
        auth: { refreshTokenCookieName },
      },
      defaultCookieOptions,
      authService,
    } = req.container.cradle;

    try {
      const { email, password } = req.body;
      const { tokens, refreshTokenExpirationDate } = await authService.login(email, password);
      this.sendResponseWithCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
        "Account login completed successfully.",
      );
    } catch (e) {
      next(e);
    }
  }

  async logout(
    req: Request<ParamsDictionary, Report, AuthData, ParsedQs, Record<string, unknown>>,
    res: Response<Report, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const {
      config: {
        auth: { refreshTokenCookieName },
      },
      authService,
    } = req.container.cradle;

    try {
      const refreshToken = this.getRefreshTokenFromCookies(req, refreshTokenCookieName);

      await authService.logout(refreshToken);
      res.clearCookie(refreshTokenCookieName);
      res.json({ message: "Account logout completed successfully." });
    } catch (e) {
      next(e);
    }
  }

  async refresh(
    req: Request<ParamsDictionary, Report<string>, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report<string>, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const {
      config: {
        auth: { refreshTokenCookieName },
      },
      defaultCookieOptions,
      authService,
    } = req.container.cradle;

    try {
      const refreshToken = this.getRefreshTokenFromCookies(req, refreshTokenCookieName);

      const { tokens, refreshTokenExpirationDate } = await authService.refresh(refreshToken);
      this.sendResponseWithCookie(
        res,
        tokens,
        refreshTokenCookieName,
        defaultCookieOptions,
        refreshTokenExpirationDate,
        "Access token updated successfully.",
      );
    } catch (e) {
      next(e);
    }
  }

  async activate(
    req: Request<ParamsDictionary, Report, unknown, ParsedQs, Record<string, unknown>>,
    res: Response<Report, Record<string, unknown>>,
    next: NextFunction,
  ): Promise<void> {
    const { authService } = req.container.cradle;

    try {
      const activationLink = (req.params as unknown as { link: string }).link;
      await authService.activate(activationLink);
      res.json({ message: "Account successfully activated." });
    } catch (e) {
      next(e);
    }
  }

  private getRefreshTokenFromCookies(req: Request, refreshTokenCookieName: string) {
    const { [refreshTokenCookieName]: refreshToken } = req.cookies;
    if (typeof refreshToken !== "string")
      throw new TypeError("The request cookie must contain a refresh token.");

    return refreshToken;
  }

  private sendResponseWithCookie(
    res: Response<Report<string>, Record<string, unknown>>,
    tokens: Tokens,
    cookieName: string,
    cookieOptions: CookieOptions,
    refreshTokenExpirationDate: Date,
    message: string,
  ) {
    res.cookie(cookieName, tokens.refreshToken, {
      ...cookieOptions,
      expires: refreshTokenExpirationDate,
      signed: false,
    });
    res.json({ message, payload: tokens.accessToken });
  }
}

const authController = new AuthController();

export { authController };
