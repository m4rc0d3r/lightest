import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

const config = defineConfig([
  ...fsd.configs.recommended,
  {
    files: ["./src/shared/**"],
    rules: {
      "fsd/public-api": "off",
    },
  },
]);

export default config;
