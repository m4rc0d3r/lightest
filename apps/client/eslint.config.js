import js from "@eslint/js";
import base from "@test-and-be-tested/eslint-config/base";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import vueParser from "vue-eslint-parser";

export default defineConfig([
  {
    extends: base,
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslint.parser,
        projectService: {
          allowDefaultProject: ["*.config.js"],
        },
        tsconfigRootDir: import.meta.dirname,
        extraFileExtensions: ["vue"],
      },
    },
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    plugins: { js },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,vue}"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginVue.configs["flat/essential"],
  {
    files: ["**/*.vue"],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
    rules: {
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: [
            "Button",
            "Input",
            "Card",
            "Select",
            "Checkbox",
            "Sonner",
            "Label",
            "Accordion",
            "Calendar",
            "Popover",
            "Separator",
          ],
        },
      ],
      "vue/no-reserved-component-names": [
        "error",
        {
          htmlElementCaseSensitive: true,
        },
      ],
    },
  },
]);
