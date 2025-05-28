import type { AxiosRequestConfig } from "axios";
import axios, { AxiosError } from "axios";

import { API_URL } from "@/env";
import { useAuthStore } from "@/stores/auth";
import { pinia } from "@/stores/pinia";

const defaultAPI = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

defaultAPI.interceptors.request.use((config) => {
  if (config.headers !== undefined) {
    config.headers["authorization"] = `Bearer ${useAuthStore(pinia).token}`;
  }

  return config;
});

defaultAPI.interceptors.response.use(
  (config) => {
    return config;
  },
  async (error) => {
    if (!(error instanceof AxiosError)) throw error;

    const originalRequest = error.config;
    if (
      !(
        error.response?.status === 401 &&
        (!isRequestWithRetryFlag(originalRequest) || !originalRequest[RETRY_FLAG_KEY])
      )
    )
      throw error;

    (originalRequest as REQUEST_WITH_RETRY_FLAG)[RETRY_FLAG_KEY] = true;
    await useAuthStore(pinia).refresh();
    return await defaultAPI.request(originalRequest);
  },
);

const RETRY_FLAG_KEY = "_retry";
type REQUEST_WITH_RETRY_FLAG = AxiosRequestConfig & { [RETRY_FLAG_KEY]: boolean };
function isRequestWithRetryFlag(request: AxiosRequestConfig): request is REQUEST_WITH_RETRY_FLAG {
  return RETRY_FLAG_KEY in request && typeof request[RETRY_FLAG_KEY] === "boolean";
}

export { defaultAPI };
