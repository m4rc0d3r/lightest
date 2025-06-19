import type { Config } from "typescript-eslint";
import { configs } from "typescript-eslint";

import type { Config as CommonConfig } from "./common";

type ConfigName = Extract<keyof typeof configs, "recommendedTypeChecked" | "stylisticTypeChecked">;

const CONFIG_NAMES = ["recommendedTypeChecked", "stylisticTypeChecked"] satisfies ConfigName[];

const RULES: NonNullable<Extract<Config, unknown[]>[number]["rules"]> = {
  "@typescript-eslint/consistent-type-definitions": ["error", "type"],
  "@typescript-eslint/consistent-type-exports": "error",
  "@typescript-eslint/consistent-type-imports": "error",
  "@typescript-eslint/explicit-member-accessibility": [
    "error",
    {
      accessibility: "no-public",
    },
  ],
  "@typescript-eslint/no-unused-vars": [
    "error",
    {
      args: "all",
      argsIgnorePattern: "^_",
      caughtErrors: "all",
      caughtErrorsIgnorePattern: "^_",
      destructuredArrayIgnorePattern: "^_",
      varsIgnorePattern: "^_",
      ignoreRestSiblings: true,
    },
  ],
};

function baseConfig<T extends Record<ConfigName, unknown>>(configs: T) {
  return [
    ...extractConfigs(configs),
    {
      rules: RULES,
    },
  ] as Extract<CommonConfig, unknown[]>;
}
function extractConfigs<T extends Record<ConfigName, unknown>>(configs: T) {
  return Object.entries(configs)
    .filter(([name]) => (CONFIG_NAMES as string[]).includes(name))
    .map(([, config]) => config) as T[ConfigName][];
}

function ordinary(tsconfigRootDir: string) {
  return [
    ...baseConfig(configs),
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir,
        },
      },
    },
    {
      files: ["**/*.{js,mjs,cjs}"],
      ...configs.disableTypeChecked,
    },
  ] as CommonConfig;
}

function vue<T extends Record<ConfigName, unknown>>(configs: T): ReturnType<typeof baseConfig<T>> {
  return baseConfig(configs);
}

export { ordinary, vue };
