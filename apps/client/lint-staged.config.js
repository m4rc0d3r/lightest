import base from "@lightest/lint-staged-config/base";
import { runEslint, runPrettier, STYLELINT_COMMAND } from "@lightest/lint-staged-config/commands";
import { JS_GLOB } from "@lightest/lint-staged-config/globs";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

const STYLELINT = "stylelint";

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  [JS_GLOB]: (files) => {
    const listOfFiles = files.join(" ");
    return [STYLELINT_COMMAND, runEslint(listOfFiles), runPrettier(listOfFiles)];
  },
  ...setUpTasksForTypescriptFiles([
    {
      program: "vue-tsc",
      glob: "src/**/*.{ts,mts,cts,tsx,vue}",
      pathToConfigFile: "tsconfig.app.json",
      additionalTasks: {
        [STYLELINT]: (files) => [STYLELINT_COMMAND, files].join(" "),
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
