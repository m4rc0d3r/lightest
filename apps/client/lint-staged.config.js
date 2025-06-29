import base from "@lightest/lint-staged-config/base";
import { STYLELINT, runStylelint } from "@lightest/lint-staged-config/commands";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

const STEIGER = "steiger";

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      program: "vue-tsc",
      glob: "src/**/*.{ts,mts,cts,tsx,vue}",
      pathToConfigFile: "tsconfig.app.json",
      additionalTasks: {
        [STEIGER]: [STEIGER, "--fail-on-warnings src"].join(" "),
        [STYLELINT]: runStylelint,
      },
      launchOptions: {
        [STEIGER]: true,
        [STYLELINT]: true,
      },
    },
    {
      glob: "*.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
