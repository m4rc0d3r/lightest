<script setup lang="ts">
import { watchEffect } from "vue";
import { useI18n } from "vue-i18n";

import { persistLocale } from "../shared/i18n";

import type { DiContainer } from "@/features/di";
import { provideDiContainer } from "@/features/di";
import { Toaster } from "@/shared/ui/sonner";
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
