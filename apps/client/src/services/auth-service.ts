import type { AxiosError, AxiosResponse } from "axios";

import { authAPI } from "@/http/axios/auth-api";
import type { Report } from "@/http/dtos/report";
import type { APIError } from "@/http/dtos/api-error";
import type { TokenType } from "@/stores/auth/dtos/token";
import { handleError } from "./helpers";

export class AuthService {
  public static async register(
    email: string,
    password: string
  ): Promise<
    AxiosResponse<Report<TokenType>, any> | AxiosError<APIError, any>
  > {
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

  public static async login(
    email: string,
    password: string
  ): Promise<
    AxiosResponse<Report<TokenType>, any> | AxiosError<APIError, any>
  > {
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

  public static async logout(): Promise<
    AxiosResponse<Report, any> | AxiosError<APIError, any>
  > {
    try {
      const response = await authAPI.post<Report>("logout");

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  public static async refresh(): Promise<
    AxiosResponse<Report<TokenType>, any> | AxiosError<APIError, any>
  > {
    try {
      const response = await authAPI.post<Report<TokenType>>("refresh");

      return response;
    } catch (e) {
      return handleError(e);
    }
  }

  public static async activate(
    link: string
  ): Promise<AxiosResponse<Report, any> | AxiosError<APIError, any>> {
    try {
      const response = await authAPI.get<Report>(`activate/${link}`);

      return response;
    } catch (e) {
      return handleError(e);
    }
  }
}
