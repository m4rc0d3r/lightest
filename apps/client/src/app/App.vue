<script setup lang="ts">
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";

import { persistLocale } from "../shared/i18n";

import { Toaster } from "@/shared/ui/sonner";

import "vue-sonner/style.css";

const { locale } = useI18n();

watchEffect(() => {
  persistLocale(locale.value);
});
</script>

<template>
  <Toaster />
  <RouterView></RouterView>
</template>
