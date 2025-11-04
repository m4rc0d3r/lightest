<template>
  <div></div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { z } from "zod";

import { injectDiContainer } from "@/features/di";

const router = useRouter();
const route = useRoute();
const { tsRestClient } = injectDiContainer();

onMounted(async () => {
  try {
    const link = z.string().uuid().parse(route.params["link"]);
    const { status } = await tsRestClient.auth.activate.query({
      params: {
        link,
      },
    });
    if (status === 200) {
      toast.success("The account has been successfully activated");
    } else {
      toast.error("Failed to activate your account", {
        description: "This link does not correspond to any account.",
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      toast.error("Invalid activation link");
    } else {
      toast.error("Failed to activate your account");
    }
  }
  void router.push("/");
});
</script>
