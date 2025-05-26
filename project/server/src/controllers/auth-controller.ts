import { ParamsDictionary, Query as ParsedQs, Request, Response, NextFunction } from "express-serve-static-core";

import { Tokens } from "../services/token-service.js";
import { authService } from "../services/auth-service.js";
import { AuthData } from "../types/auth-data.js";
import { Report } from "../types/report.js";

const API_URL = process.env.API_URL || "undefined";

if (API_URL === "undefined") {
    throw new Error("'API_URL' not specified in config file '.env'.");
}

class AuthController {
    public async register(
        req: Request<ParamsDictionary, Report<string>, AuthData, ParsedQs, Record<string, unknown>>,
        res: Response<Report<string>, Record<string, unknown>>,
        next: NextFunction,
    ): Promise<void> {
        try {
            const {email, password} = req.body;
            const {tokens, refreshTokenExpirationDate} = await authService.register(email, password);
            this.sendRequestWithTokens(res, tokens, refreshTokenExpirationDate, "Account registration completed successfully.");
        } catch (e) {
            next(e);
        }
    }

    public async login(
        req: Request<ParamsDictionary, Report<string>, AuthData, ParsedQs, Record<string, unknown>>,
        res: Response<Report<string>, Record<string, unknown>>,
        next: NextFunction,
    ): Promise<void> {
        try {
            const {email, password} = req.body;
            const {tokens, refreshTokenExpirationDate} = await authService.login(email, password);
            this.sendRequestWithTokens(res, tokens, refreshTokenExpirationDate, "Account login completed successfully.");
        } catch (e) {
            next(e);
        }
    }

    public async logout(
        req: Request<ParamsDictionary, Report, AuthData, ParsedQs, Record<string, unknown>>,
        res: Response<Report, Record<string, unknown>>,
        next: NextFunction,
    ): Promise<void> {
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken);
            res.clearCookie("refreshToken");
            res.json({message: "Account logout completed successfully."});
        } catch (e) {
            next(e);
        }
    }

    public async refresh(
        req: Request<ParamsDictionary, Report<string>, unknown, ParsedQs, Record<string, unknown>>,
        res: Response<Report<string>, Record<string, unknown>>,
        next: NextFunction,
    ): Promise<void> {
        try {
            const {refreshToken} = req.cookies;
            const {tokens, refreshTokenExpirationDate} = await authService.refresh(refreshToken);
            this.sendRequestWithTokens(res, tokens, refreshTokenExpirationDate, "Access token updated successfully.");
        } catch (e) {
            next(e);
        }
    }
    
    public async activate(
        req: Request<ParamsDictionary, Report, unknown, ParsedQs, Record<string, unknown>>,
        res: Response<Report, Record<string, unknown>>,
        next: NextFunction,
    ): Promise<void> {
        try {
            const activationLink = (req.params as unknown as {link: string}).link;
            await authService.activate(activationLink);
            res.json({message: "Account successfully activated."});
        } catch (e) {
            next(e);
        }
    }

    private sendRequestWithTokens(
        res: Response<Report<string>, Record<string, unknown>>,
        tokens: Tokens,
        refreshTokenExpirationDate: Date,
        message: string
    ) {
        res.cookie("refreshToken", tokens.refreshToken, {expires: refreshTokenExpirationDate, httpOnly: true});
        res.json({message, payload: tokens.accessToken});
    }
}

export const authController = new AuthController();