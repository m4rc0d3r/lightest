<script setup lang="ts">
import { Str } from "@lightest/core";

import { Tk } from "@/shared/i18n";
</script>

<template>
  <div class="flex grow items-center justify-center">
    <p>{{ Str.capitalize($t(Tk.main)) }}</p>
  </div>
</template>
