import base from "@lightest/prettier-config/base";

/** @type {import("prettier").Config} */
export default {
  ...base,
  overrides: [
    ...(base.overrides ?? []),
    {
      files: "*.svg",
      options: {
        plugins: ["@prettier/plugin-xml"],
      },
    },
  ],
};
