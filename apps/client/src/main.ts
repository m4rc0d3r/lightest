import "./index.css";

import { createPinia } from "pinia";
import { createApp } from "vue";
import { createI18n } from "vue-i18n";

import App from "./App.vue";
import router from "./router";
import { AVAILABLE_LOCALES, Locale, MESSAGES } from "./shared/i18n";

const i18n = createI18n({
  legacy: false,
  availableLocales: Object.keys(AVAILABLE_LOCALES),
  fallbackLocale: Locale.en,
  messages: MESSAGES,
});

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");
