<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";

import LanguageSwitcher from "./LanguageSwitcher.vue";

import { Tk } from "@/shared/i18n";
import { ROUTES } from "@/shared/routing";
import { capitalize } from "@/shared/str";
import { Button } from "@/shared/ui/button";
import type { ComponentProps } from "@/shared/vue";

type MenuItem = {
  path: string;
  label: Tk;
};

type AuthMenuItem = MenuItem & Pick<ComponentProps<typeof Button>, "variant">;

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

const AUTH_MENU_ITEMS: AuthMenuItem[] = [
  {
    path: ROUTES.register,
    label: Tk.register,
    variant: "outline",
  },
];
</script>

<template>
  <div class="flex h-full flex-col">
    <header class="bg-secondary px-4 py-2">
      <nav>
        <ul class="flex justify-between">
          <li>
            <ul class="flex">
              <li v-for="{ label, path } in MENU_ITEMS" :key="path">
                <Button as-child variant="link" class="font-bold">
                  <RouterLink :to="path">{{ capitalize($t(label)) }}</RouterLink>
                </Button>
              </li>
            </ul>
          </li>
          <li class="flex gap-2">
            <LanguageSwitcher />
            <ul class="flex">
              <li v-for="{ label, path, variant } in AUTH_MENU_ITEMS" :key="path">
                <Button as-child :variant>
                  <RouterLink :to="path">{{ capitalize($t(label)) }}</RouterLink>
                </Button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
    <main class="flex grow">
      <RouterView />
    </main>
  </div>
</template>
