import { VueQueryPlugin } from "@tanstack/vue-query";
import { either as e } from "fp-ts";
import { createApp } from "vue";
import { toast } from "vue-sonner";

import { initDiContainer } from "./features/di";
import { createConfig } from "./shared/config/config";
import { useConfigStore } from "./shared/config/store";
import { useAuthStore } from "./stores/auth";

import App from "@/App.vue";
import router from "@/router";
import { pinia } from "@/stores/pinia";

import "./index.css";

const eitherConfig = createConfig(import.meta.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;

const config = eitherConfig.right;

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App, {
  diContainer: initDiContainer({
    config,
    getAccessToken: () => useAuthStore(pinia).token,
    refreshAuthentication: async (client) => {
      const { body, status } = await client.auth.refresh.mutation();
      if (status === 200) {
        useAuthStore(pinia).login(body.payload);
      }
      return status === 200;
    },
    onUnauthorized: () => {
      toast.info("Authentication session expired");
      void router.push("/");
      useAuthStore(pinia).logout();
    },
  }),
});

app.use(pinia);
app.use(router);
app.use(VueQueryPlugin, {
  enableDevtoolsV6Plugin: true,
});
useConfigStore().setConfig(config);

app.mount("#app");
