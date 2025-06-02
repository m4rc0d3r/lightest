<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

import SimpleNotification from "@/components/SimpleNotification.vue";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();
const notificationStore = useNotificationStore();

onMounted(async () => {
  await authStore.refresh();
  if (route.name === undefined) {
    if ((await router.push(location.pathname)) !== undefined) {
      await router.push("/");
    }
  }
});
</script>

<template>
  <RouterView />
  <div
    class="fixed top-0 left-2/4 flex -translate-x-2/4 flex-col items-center"
    v-if="notificationStore.notifications.length > 0"
  >
    <SimpleNotification
      v-for="notification in notificationStore.notifications"
      :key="notification.id"
      :notification="notification"
      @delete="notificationStore.remove(notification.id)"
    />
  </div>
</template>
