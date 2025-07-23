<script setup lang="ts">
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";
import { RouterView } from "vue-router";

import { persistLocale } from "../shared/i18n";

import { Toaster } from "@/shared/ui/sonner";
import { provideDiContainer } from "@/features/di";
import type { DiContainer } from "@/features/di";
import "vue-sonner/style.css";

type Props = {
  diContainer: DiContainer;
};

const { diContainer } = defineProps<Props>();

provideDiContainer(diContainer);

const { locale } = useI18n();

watchEffect(() => {
  persistLocale(locale.value);
});
</script>

<template>
  <Toaster />
  <RouterView></RouterView>
</template>
