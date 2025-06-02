import { either as e } from "fp-ts";
import { createApp } from "vue";

import { createConfig } from "./infra/config/config";
import { useConfigStore } from "./infra/config/store";

import App from "@/App.vue";
import router from "@/router";
import { pinia } from "@/stores/pinia";

import "./index.css";

const eitherConfig = createConfig(import.meta.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

app.use(pinia);
app.use(router);
useConfigStore().setConfig(eitherConfig.right);

app.mount("#app");
