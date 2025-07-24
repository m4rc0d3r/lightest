import { Str } from "@lightest/core";
import { defineStore } from "pinia";
import { ref } from "vue";

import type { Config } from "./config";
import { NodeEnv } from "./config";

const useConfigStore = defineStore("config", () => {
  const config = ref<Config>({
    nodeEnv: NodeEnv.dev,
    serverApp: {
      protocol: Str.EMPTY,
      address: Str.EMPTY,
      port: 0,
    },
  });

  function setConfig(value: Config) {
    config.value = value;
  }

  return {
    config,
    setConfig,
  };
});

export { useConfigStore };
