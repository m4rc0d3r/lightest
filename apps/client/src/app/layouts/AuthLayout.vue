<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useRouter } from "vue-router";

import LanguageSwitcher from "./LanguageSwitcher.vue";
import LayoutTemplate from "./LayoutTemplate.vue";

import { Button } from "@/shared/ui/button";

const router = useRouter();
</script>

<template>
  <LayoutTemplate>
    <ul class="flex justify-between">
      <li>
        <Button variant="outline" size="icon" @click="router.back()">
          <ArrowLeft />
        </Button>
      </li>
      <li class="flex gap-2">
        <LanguageSwitcher />
      </li>
    </ul>
  </LayoutTemplate>
</template>
