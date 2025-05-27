import base from "@test-and-be-tested/lint-staged-config/base";
import {
  runEslint,
  runPrettier,
  STYLELINT_COMMAND,
} from "@test-and-be-tested/lint-staged-config/commands";
import { JS_GLOB } from "@test-and-be-tested/lint-staged-config/globs";
import { setUpTasksForTypescriptFiles } from "@test-and-be-tested/lint-staged-config/helpers";

const STYLELINT = "stylelint";

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  [JS_GLOB]: (files) => {
    const listOfFiles = files.join(" ");
    return [
      STYLELINT_COMMAND,
      runEslint(listOfFiles),
      runPrettier(listOfFiles),
    ];
  },
  ...setUpTasksForTypescriptFiles([
    {
      glob: "src/**/*.{ts,mts,cts,tsx,vue}",
      pathToConfigFile: "tsconfig.app.json",
      additionalTasks: {
        [STYLELINT]: STYLELINT_COMMAND,
      },
      launchOptions: {
        [STYLELINT]: true,
      },
    },
    {
      glob: "vite.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
