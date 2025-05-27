import type { AxiosError, AxiosResponse } from "axios";

import { handleError } from "./helpers";

import { authAPI } from "@/http/axios/auth-api";
import type { APIError } from "@/http/dtos/api-error";
import type { Report } from "@/http/dtos/report";
import type { TokenType } from "@/stores/auth/dtos/token";

export class AuthService {
  static async register(
    email: string,
    password: string,
  ): Promise<AxiosResponse<Report<TokenType>, unknown> | AxiosError<APIError, unknown>> {
    try {
      const response = await authAPI.post<Report<TokenType>>("register", {
        email,
        password,
      });

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async login(
    email: string,
    password: string,
  ): Promise<AxiosResponse<Report<TokenType>, unknown> | AxiosError<APIError, unknown>> {
    try {
      const response = await authAPI.post<Report<TokenType>>("login", {
        email,
        password,
      });

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async logout(): Promise<AxiosResponse<Report, unknown> | AxiosError<APIError, unknown>> {
    try {
      const response = await authAPI.post<Report>("logout");

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async refresh(): Promise<
    AxiosResponse<Report<TokenType>, unknown> | AxiosError<APIError, unknown>
  > {
    try {
      const response = await authAPI.post<Report<TokenType>>("refresh");

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  static async activate(
    link: string,
  ): Promise<AxiosResponse<Report, unknown> | AxiosError<APIError, unknown>> {
    try {
      const response = await authAPI.get<Report>(`activate/${link}`);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }
}
