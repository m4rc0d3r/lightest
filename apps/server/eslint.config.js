import base from "@lightest/eslint-config/base";
import globals from "globals";

export default [
  ...base,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    languageOptions: { globals: globals.node },
  },
  {
    ignores: ["build"],
  },
];
