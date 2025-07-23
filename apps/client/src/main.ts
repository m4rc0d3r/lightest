import "./index.css";

import { VueQueryPlugin } from "@tanstack/vue-query";
import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import { App } from "./app";
import router from "./app/router";
import { AVAILABLE_LOCALES, getPersistedLocale, Locale, MESSAGES } from "./shared/i18n";

const i18n = createI18n({
  legacy: false,
  availableLocales: Object.keys(AVAILABLE_LOCALES),
  fallbackLocale: Locale.en,
  locale: getPersistedLocale(),
  messages: MESSAGES,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
});

app.mount("#app");
