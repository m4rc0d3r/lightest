<script setup lang="ts">
import { RouterView } from "vue-router";

import { Toaster } from "@/shared/ui/sonner";

import "vue-sonner/style.css";
</script>

<template>
  <Toaster />
  <RouterView></RouterView>
</template>
