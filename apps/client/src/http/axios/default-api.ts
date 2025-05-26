import axios, { Axios, AxiosError } from "axios";

import { API_URL } from "@/env";
import { pinia } from "@/stores/pinia";
import { useAuthStore } from "@/stores/auth";

export const defaultAPI = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

defaultAPI.interceptors.request.use((config) => {
  if (config.headers !== undefined) {
    config.headers.authorization = `Bearer ${useAuthStore(pinia).token}`;
  }

  return config;
});

defaultAPI.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    if (error instanceof AxiosError) {
      const originalRequest = error.config;
      if (
        error.response?.status === 401 &&
        !(originalRequest as { _retry: boolean })._retry
      ) {
        (originalRequest as { _retry: boolean })._retry = true;
        try {
          await useAuthStore(pinia).refresh();
          const originalResponse = await defaultAPI.request(originalRequest);

          return originalResponse;
        } catch (e) {
          if (e instanceof AxiosError) {
            return e;
          }
        }
      } else {
        throw error;
      }
    }
  }
);
