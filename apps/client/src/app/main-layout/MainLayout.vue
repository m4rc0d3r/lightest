<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import LanguageSwitcher from "./LanguageSwitcher.vue";

import { Tk } from "@/shared/i18n";
import { ROUTES } from "@/shared/routing";
import { capitalize } from "@/shared/str";
import { Button } from "@/shared/ui/button";

type MenuItem = {
  path: string;
  label: Tk;
};

const MENU_ITEMS: MenuItem[] = [
  {
    path: ROUTES.home,
    label: Tk.main,
  },
  {
    path: ROUTES.about,
    label: Tk.about_us,
  },
];
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="bg-secondary px-4 py-2">
      <ul class="flex justify-between">
        <li>
          <nav>
            <ul class="flex">
              <li v-for="{ label, path } in MENU_ITEMS" :key="path">
                <Button as-child variant="link" class="font-bold">
                  <RouterLink :to="path">{{ capitalize($t(label)) }}</RouterLink>
                </Button>
              </li>
            </ul>
          </nav>
        </li>
        <li>
          <LanguageSwitcher />
        </li>
      </ul>
    </header>
    <main class="flex grow">
      <RouterView />
    </main>
  </div>
</template>
