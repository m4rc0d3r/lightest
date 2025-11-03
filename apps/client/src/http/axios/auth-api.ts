import axios from "axios";

import { createUrl } from "./shared";

import { useConfigStore } from "@/infra/config/store";
import { pinia } from "@/stores/pinia";

const authAPI = axios.create({
  withCredentials: true,
});

authAPI.interceptors.request.use((config) => {
  const {
    config: {
      serverApp: { protocol, address, port, apiBaseUrl },
    },
  } = useConfigStore(pinia);
  config.baseURL = `${createUrl({
    protocol,
    address,
    port,
    baseUrl: apiBaseUrl,
  })}/auth`;

  return config;
});

export { authAPI };
