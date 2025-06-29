/** @type {import("stylelint").Config} */
const config = {
  extends: ["stylelint-config-recommended-vue", "stylelint-config-clean-order/error"],
  rules: {
    "at-rule-no-deprecated": [
      true,
      {
        ignoreAtRules: ["apply"],
      },
    ],
    "at-rule-no-unknown": [
      true,
      {
        ignoreAtRules: ["custom-variant", "theme"],
      },
    ],
    "import-notation": "string",
  },
};

export default config;
