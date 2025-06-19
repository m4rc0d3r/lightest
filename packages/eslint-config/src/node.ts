import globals from "globals";

import type { Config } from "./common";

const config: Config = {
  languageOptions: {
    globals: globals.node,
  },
};
export { config };
