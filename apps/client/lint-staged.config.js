import path from "node:path";

import base from "@lightest/lint-staged-config/base";
import { STYLELINT, runStylelint } from "@lightest/lint-staged-config/commands";
import { setUpTasksForTypescriptFiles } from "@lightest/lint-staged-config/helpers";

const STEIGER = "steiger";
const TYPESCRIPT_FILE_EXTENSIONS = ["ts", "mts", "cts", "tsx"];
const APP_FILE_EXTENSIONS = [...TYPESCRIPT_FILE_EXTENSIONS, "vue"];

/**
 * @typedef {object} Params
 * @property {string} glob
 * @property {string} pathToConfigFile
 * @property {Ignore} [ignore]
 */

/**
 * @typedef {object} Ignore
 * @property {string} baseUrl
 * @property {string} glob
 */

/** @param {Params} params */
function setUpForApp({ glob, pathToConfigFile, ignore }) {
  return {
    program: "vue-tsc",
    glob,
    ignore,
    pathToConfigFile,
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
  };
}

/** @type {import("lint-staged").Configuration} */
export default {
  ...base,
  ...setUpTasksForTypescriptFiles([
    setUpForApp({
      glob: `src/**/*.{${APP_FILE_EXTENSIONS.join()}}`,
      pathToConfigFile: "tsconfig.app.json",
      ignore: {
        baseUrl: import.meta.dirname,
        glob: "src/shared/ui/**/*",
      },
    }),
    setUpForApp({
      glob: `src/shared/ui/**/*.{${APP_FILE_EXTENSIONS.join()}}`,
      pathToConfigFile: "tsconfig.ui.json",
    }),
    {
      glob: "*.config.ts",
      pathToConfigFile: "tsconfig.node.json",
    },
  ]),
};
