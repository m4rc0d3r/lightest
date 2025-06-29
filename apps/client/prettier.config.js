import base from "@lightest/prettier-config/base";

/** @type {import("prettier").Config} */
export default {
  ...base,
  plugins: [...(base.plugins ?? []), "prettier-plugin-tailwindcss"],
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
