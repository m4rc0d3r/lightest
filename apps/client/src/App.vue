<script setup lang="ts">
import { onMounted } from "vue";
import { RouterView, useRoute, useRouter } from "vue-router";

import { Toaster } from "@/components/ui/sonner";
import { useAuthStore } from "@/stores/auth";
import "vue-sonner/style.css"; // vue-sonner v2 requires this import

const router = useRouter();
const route = useRoute();

const authStore = useAuthStore();

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
  <Toaster />
</template>
