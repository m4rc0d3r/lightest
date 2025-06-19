import tseslint from "typescript-eslint";
import { Combined } from "@lightest/eslint-config";

const config: ReturnType<typeof tseslint.config> = tseslint.config(
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"] },
  {
    ignores: ["dist"],
  },
  Combined.config(import.meta.dirname),
);

export default config;
