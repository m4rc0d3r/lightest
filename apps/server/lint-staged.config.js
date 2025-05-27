import base from "@test-and-be-tested/lint-staged-config/base";
import { setUpTasksForTypescriptFiles } from "@test-and-be-tested/lint-staged-config/helpers";

export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts}",
      pathToConfigFile: "tsconfig.json",
    },
  ]),
};
