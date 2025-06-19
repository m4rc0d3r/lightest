import js from "@eslint/js";

import type { Config } from "./common";

const config: Config = {
  ...js.configs.recommended,
  rules: {
    eqeqeq: "error",
  },
};
export { config };
