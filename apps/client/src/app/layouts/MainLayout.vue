<script setup lang="ts">
import { Str } from "@lightest/core";

import LanguageSwitcher from "./LanguageSwitcher.vue";
import LayoutTemplate from "./LayoutTemplate.vue";
import MeSection from "./MeSection.vue";

import { useAuthStore } from "@/entities/auth";
import { Tk } from "@/shared/i18n";
import { ROUTES } from "@/shared/routing";
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

const AUTH_MENU_ITEMS: MenuItem[] = [
  {
    path: ROUTES.register,
    label: Tk.register,
  },
  {
    path: ROUTES.login,
    label: Tk["login.verb"],
  },
];

const authStore = useAuthStore();
</script>

<template>
  <LayoutTemplate>
    <nav>
      <ul class="flex justify-between">
        <li>
          <ul class="flex">
            <li v-for="{ label, path } in MENU_ITEMS" :key="path">
              <Button as-child variant="link" class="font-bold">
                <RouterLink :to="path">{{ Str.capitalize($t(label)) }}</RouterLink>
              </Button>
            </li>
          </ul>
        </li>
        <li class="flex items-center gap-2">
          <LanguageSwitcher />
          <MeSection v-if="authStore.isAuthenticated" />
          <ul v-else class="flex">
            <li v-for="{ label, path } in AUTH_MENU_ITEMS" :key="path">
              <Button as-child variant="ghost">
                <RouterLink :to="path">{{ Str.capitalize($t(label)) }}</RouterLink>
              </Button>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </LayoutTemplate>
</template>
