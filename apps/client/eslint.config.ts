import { Import, Javascript, Typescript } from "@lightest/eslint-config";
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";
import pluginVue from "eslint-plugin-vue";
import { globalIgnores } from "eslint/config";

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

const config: ReturnType<typeof defineConfigWithVueTs> = defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  {
    rules: {
      "vue/multi-word-component-names": [
        "error",
        {
          ignores: ["Avatar", "Badge", "Button", "Card", "Checkbox", "Dialog", "Input"],
        },
      ],
    },
  },
  ...([Javascript.config, Typescript.vue(vueTsConfigs), Import.config] as Parameters<
    typeof defineConfigWithVueTs
  >),
  {
    settings: {
      "import/resolver": {
        alias: {
          map: [["@", "./src"]],
        },
      },
    },
  },
  skipFormatting,
);

export default config;
