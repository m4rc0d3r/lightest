<script setup lang="ts">
import { createUrl } from "@lightest/core";
import { useStorage } from "@vueuse/core";
import { Info } from "lucide-vue-next";
import { onMounted, ref } from "vue";
import { RouterView, useRouter } from "vue-router";

import "vue-sonner/style.css"; // vue-sonner v2 requires this import
import { Button } from "./components/ui/button";
import type { DiContainer } from "./features/di";
import { provideDiContainer } from "./features/di";
import { cn } from "./lib/utils";
import { zConfig } from "./shared/config/config";
import { useConfigStore } from "./shared/config/store";
import { useAuthStore } from "./stores/auth";

import { Toaster } from "@/components/ui/sonner";

const router = useRouter();

const configStore = useConfigStore();
const authStore = useAuthStore();

type Props = {
  diContainer: DiContainer;
};

const { diContainer } = defineProps<Props>();

provideDiContainer(diContainer);

onMounted(async () => {
  try {
    const { body, status } = await diContainer.tsRestClient.auth.refresh.mutation();
    if (status === 200) {
      authStore.login(body.payload);
    } else {
      authStore.logout();
      void router.push("/");
    }
  } catch {
    void router.push("/");
  }
});

const isReqTakingTooLongMsgRead = useStorage("isLongBackendResponseNotificationRead", false);

const isReqTakingTooLongMsgVisible = ref(false);
</script>

<template>
  <RouterView />
  <Toaster />
  <div
    v-if="
      configStore.config.serverApp.deploymentPlatform ===
      zConfig.shape.serverApp.innerType().shape.VITE_SERVER_DEPLOYMENT_PLATFORM.Enum.RENDER
    "
    class="fixed bottom-0 left-0 flex items-end gap-4 p-2"
  >
    <button
      type="button"
      :class="
        cn(
          'hover:bg-secondary flex aspect-square size-12 rounded-full',
          !isReqTakingTooLongMsgRead && 'size-36 animate-pulse text-red-500',
        )
      "
      @click="isReqTakingTooLongMsgVisible = !isReqTakingTooLongMsgVisible"
    >
      <Info :class="cn('m-auto size-3/4')" />
    </button>
    <div
      :class="
        cn(
          'bg-primary-foreground text-primary hidden rounded-lg border p-2',
          isReqTakingTooLongMsgVisible && 'flex flex-col',
        )
      "
    >
      <p>
        If any operation (e.g. register, create test, submit test for review) does not respond for a
        long time (more than 5 seconds), it may indicate that the backend has stopped due to
        inactivity. You can check this by going to this
        <Button variant="link" class="p-0"
          ><a :href="createUrl(configStore.config.serverApp)" target="_blank">address</a></Button
        >:
      </p>
      <ul class="list-inside list-disc">
        <li>if the backend is inactive, you will see a page with a notification about it</li>
        <li>if the backend is active, you will see a white page with the text "Hello World!"</li>
      </ul>
      <p>If the backend is inactive, wait for it to start and repeat the operation again.</p>
      <Button
        class="self-end"
        @click="
          () => {
            isReqTakingTooLongMsgVisible = false;
            isReqTakingTooLongMsgRead = true;
          }
        "
        >OK</Button
      >
    </div>
  </div>
</template>
