<script setup lang="ts">
import { Tk } from "@/shared/i18n";
import { capitalize } from "@/shared/str";
</script>

<template>
  <div class="flex grow items-center justify-center">
    <p>{{ capitalize($t(Tk.about_us)) }}</p>
  </div>
</template>
