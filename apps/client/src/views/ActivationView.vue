<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { pinia } from "@/stores/pinia";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import { Report } from "@/http/dtos/report";
import { APIError } from "@/http/dtos/api-error";

export default defineComponent({
  async beforeCreate() {
    if (typeof this.$route.params["link"] === "string") {
      const link = this.$route.params["link"];
      const result = await useAuthStore().activate(link);
      if (result instanceof Report) {
        useNotificationStore(pinia).add(
          new Notification(Status.SUCCESS, result.message)
        );
      } else if (result instanceof APIError) {
        useNotificationStore(pinia).add(
          new Notification(Status.FAILURE, "Invalid activation link.")
        );
      }
    } else {
      useNotificationStore(pinia).add(
        new Notification(Status.FAILURE, "Invalid activation link.")
      );
    }
    this.$router.push("/");
  },
});
</script>

<style scoped></style>
