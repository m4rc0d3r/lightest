<template>
  <div></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { toast } from "vue-sonner";

import { APIError } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { useAuthStore } from "@/stores/auth";

export default defineComponent({
  async beforeCreate() {
    if (typeof this.$route.params["link"] === "string") {
      const link = this.$route.params["link"];
      const result = await useAuthStore().activate(link);
      if (result instanceof Report) {
        toast.success(result.message);
      } else if (result instanceof APIError) {
        toast.error("Invalid activation link.");
      }
    } else {
      toast.error("Invalid activation link.");
    }
    void this.$router.push("/");
  },
});
</script>

style>
