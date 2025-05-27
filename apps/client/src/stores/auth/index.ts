import { defineStore } from "pinia";

import { APIError, API_ERROR_CODE } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { AuthService } from "@/services/auth-service";
import { extractData } from "@/services/helpers";
import type { TokenType } from "@/stores/auth/dtos/token";

export const useAuthStore = defineStore("auth", {
  state() {
    return {
      _token: "",
    };
  },

  getters: {
    token(): string {
      return this._token;
    },

    isLoggedIn(): boolean {
      return this._token.length > 0;
    },
  },

  actions: {
    async register(email: string, password: string): Promise<Report | APIError | undefined> {
      const responseData = extractData<TokenType>(await AuthService.register(email, password));

      if (responseData instanceof Report) {
        if (responseData.payload) {
          this._token = responseData.payload;
        }
        return new Report(responseData.message);
      } else {
        return responseData;
      }
    },

    async login(email: string, password: string): Promise<Report | APIError | undefined> {
      const responseData = extractData<TokenType>(await AuthService.login(email, password));

      if (responseData instanceof Report) {
        if (responseData.payload) {
          this._token = responseData.payload;
        }
        return new Report(responseData.message);
      } else {
        return responseData;
      }
    },

    async logout(): Promise<Report | APIError | undefined> {
      const responseData = extractData(await AuthService.logout());

      if (
        responseData instanceof Report ||
        (responseData instanceof APIError && responseData.code !== API_ERROR_CODE.ERR_NETWORK)
      ) {
        this._token = "";
      }

      return responseData;
    },

    async refresh(): Promise<Report | APIError | undefined> {
      const responseData = extractData<TokenType>(await AuthService.refresh());

      if (responseData instanceof Report) {
        if (responseData.payload) {
          this._token = responseData.payload;
        }
        return new Report(responseData.message);
      } else {
        this._token = "";
        return responseData;
      }
    },

    async activate(link: string): Promise<Report | APIError | undefined> {
      return extractData(await AuthService.activate(link));
    },
  },
});
