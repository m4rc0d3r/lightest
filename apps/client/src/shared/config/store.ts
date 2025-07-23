import { defineStore } from "pinia";
import { ref } from "vue";

import { EMPTY } from "../str";

import type { Config } from "./config";
import { NodeEnv } from "./config";

const useConfigStore = defineStore("config", () => {
  const config = ref<Config>({
    nodeEnv: NodeEnv.dev,
    serverApp: {
      protocol: EMPTY,
      address: EMPTY,
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
