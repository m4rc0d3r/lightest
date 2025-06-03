<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import type { RouterLink, RouterLinkProps } from "vue-router";

import { cn } from "@/lib/utils";

type Props = {
  class?: HTMLAttributes["class"];
} & RouterLinkProps;

const props = defineProps<Props>();
</script>

<template>
  <RouterLink
    :class="cn('text-link-foreground underline-offset-4 hover:underline', props.class)"
    v-bind="props"
  >
    <slot />
  </RouterLink>
</template>
