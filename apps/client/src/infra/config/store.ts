import { defineStore } from "pinia";

import type { Config } from "./config";

const useConfigStore = defineStore("config", {
  state() {
    const _config: Config = {
      serverApp: {
        protocol: "",
        address: "",
        port: 0,
        apiBaseUrl: "",
        deploymentPlatform: "LOCAL",
      },
    };
    return {
      _config,
    };
  },

  getters: {
    config(): Config {
      return this._config;
    },
  },

  actions: {
    setConfig(value: Config) {
      this._config = value;
    },
  },
});

export { useConfigStore };
