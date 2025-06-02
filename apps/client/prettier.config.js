import base from "@test-and-be-tested/prettier-config/base";

/**
 * @type {import("prettier").Config}
 */
export default {
  ...base,
  plugins: ["prettier-plugin-tailwindcss"],
};
