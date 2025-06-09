import base from "@lightest/lint-staged-config/base";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts,tsx}",
      pathToConfigFile: "tsconfig.json",
    },
  ]),
};
