import "./index.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { either } from "fp-ts";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import { App } from "./app";
import router from "./app/router";
import { initDiContainer } from "./features/di";
import { createConfig, NodeEnv, useConfigStore } from "./shared/config";
import { AVAILABLE_LOCALES, getPersistedLocale, Locale, MESSAGES } from "./shared/i18n";

const i18n = createI18n({
  legacy: false,
  availableLocales: Object.keys(AVAILABLE_LOCALES),
  fallbackLocale: Locale.en,
  locale: getPersistedLocale(),
  messages: MESSAGES,
});

const eitherConfig = createConfig({
  ...import.meta.env,
  ...(import.meta.env.DEV && { NODE_ENV: NodeEnv.dev }),
  ...(import.meta.env.PROD && { NODE_ENV: NodeEnv.prod }),
});
if (either.isLeft(eitherConfig)) throw eitherConfig.left;

const config = eitherConfig.right;

const app = createApp(App, {
  diContainer: initDiContainer({
    config,
  }),
});

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
});

useConfigStore().setConfig(config);

app.mount("#app");
