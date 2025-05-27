import { createApp } from "vue";

import App from "@/App.vue";
import router from "@/router";
import { pinia } from "@/stores/pinia";

// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");
