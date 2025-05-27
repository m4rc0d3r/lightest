<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { APIError } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { pinia } from "@/stores/pinia";

export default defineComponent({
  async beforeCreate() {
    if (typeof this.$route.params["link"] === "string") {
      const link = this.$route.params["link"];
      const result = await useAuthStore().activate(link);
      if (result instanceof Report) {
        useNotificationStore(pinia).add(new Notification(STATUS.SUCCESS, result.message));
      } else if (result instanceof APIError) {
        useNotificationStore(pinia).add(
          new Notification(STATUS.FAILURE, "Invalid activation link."),
        );
      }
    } else {
      useNotificationStore(pinia).add(new Notification(STATUS.FAILURE, "Invalid activation link."));
    }
    void this.$router.push("/");
  },
});
</script>

style>
