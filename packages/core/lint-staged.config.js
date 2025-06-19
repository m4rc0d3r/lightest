import base from "@lightest/lint-staged-config/base";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts}",
      pathToConfigFile: "tsconfig.app.json",
    },
    {
      glob: "*.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
