<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useRouter } from "vue-router";

import LanguageSwitcher from "./LanguageSwitcher.vue";

import { Button } from "@/shared/ui/button";

const router = useRouter();
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="bg-secondary px-4 py-2">
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
    </header>
    <main class="flex grow">
      <RouterView />
    </main>
  </div>
</template>
