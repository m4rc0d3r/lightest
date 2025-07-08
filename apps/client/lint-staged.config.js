import path from "node:path";

import base from "@lightest/lint-staged-config/base";
import { STYLELINT, runStylelint } from "@lightest/lint-staged-config/commands";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

const STEIGER = "steiger";
const TYPESCRIPT_FILE_EXTENSIONS = ["ts", "mts", "cts", "tsx"];

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    {
      program: "vue-tsc",
      glob: `src/**/*.{${TYPESCRIPT_FILE_EXTENSIONS.join()},vue}`,
      pathToConfigFile: "tsconfig.app.json",
      additionalTasks: {
        [STEIGER]: [STEIGER, "--fail-on-warnings src"].join(" "),
        [STYLELINT]: (files) =>
          runStylelint(
            files
              .filter((file) => !TYPESCRIPT_FILE_EXTENSIONS.includes(path.extname(file).slice(1)))
              .join(" "),
          ),
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
