import base from "@lightest/prettier-config/base";

/** @type {import("prettier").Config} */
export default {
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    {
      files: "*.{sql,js,mjs,cjs,ts,mts,cts}",
      options: {
        plugins: ["prettier-plugin-sql", "prettier-plugin-embed"],
        language: "postgresql",
        keywordCase: "upper",
        dataTypeCase: "upper",
        functionCase: "lower",
        identifierCase: "lower",
      },
    },
    {
      files: "*.pug",
      options: {
        plugins: ["@prettier/plugin-pug"],
      },
    },
  ],
};
