<template>
  <div class="flex h-full">
    <div class="m-auto flex flex-col gap-2">
      <p class="text-5xl font-bold">Such page does not exist</p>
      <Button as-child variant="link">
        <RouterLink to="/"> Go to the main page </RouterLink>
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

import { Button } from "@/components/ui/button";
</script>
