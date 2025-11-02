<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import { APIError } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();

const authStore = useAuthStore();

const mainRoutes = [
  {
    path: "/home",
    label: "Home",
  },
  {
    path: "/about",
    label: "About",
  },
  {
    path: "/my-tests",
    label: "My tests",
  },
];
const authRoutes = [
  {
    path: "/register",
    label: "Register",
  },
  {
    path: "/login",
    label: "Login",
  },
];

async function logout() {
  if (authStore.isLoggedIn) {
    const result = await authStore.logout();
    if (result instanceof Report) {
      toast.success(result.message);
    } else if (result instanceof APIError) {
      toast.error(result.message);
    }
    void router.push("/home");
  }
}
</script>

<template>
  <div class="flex h-full flex-col">
    <header>
      <nav class="bg-primary flex justify-between px-4 py-2 text-3xl">
        <ul class="flex justify-between">
          <li v-for="{ path, label } in mainRoutes" :key="path">
            <Button as-child class="text-3xl font-bold"
              ><RouterLink :to="path">{{ label }}</RouterLink></Button
            >
          </li>
        </ul>
        <ul class="flex justify-between gap-2">
          <template v-if="!authStore.isLoggedIn">
            <li v-for="{ path, label } in authRoutes" :key="path" class="flex items-center">
              <Button as-child variant="outline" class="font-bold">
                <RouterLink :to="path">{{ label }}</RouterLink>
              </Button>
            </li>
          </template>
          <li v-else class="flex items-center">
            <Button variant="outline" class="font-bold" @click="logout">Logout</Button>
          </li>
        </ul>
      </nav>
    </header>
    <main className="flex flex-grow overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
