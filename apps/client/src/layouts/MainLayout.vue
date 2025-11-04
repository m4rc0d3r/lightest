<script setup lang="ts">
import { iife, isObject } from "@lightest/core";
import { RouterLink, RouterView, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import { Button } from "@/components/ui/button";
import { injectDiContainer } from "@/features/di";
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

const { tsRestClient } = injectDiContainer();
const { mutate: logout, isPending: isLogoutPending } = tsRestClient.auth.logout.useMutation();

function handleLogout() {
  logout(
    {},
    {
      onSuccess: () => {
        authStore.logout();
        toast.success("Successful logout");
        void router.push("/");
      },
      onError: (error) => {
        toast.error("Failed to log out", {
          description: iife(() => {
            const MESSAGE = "message";
            const { body } = error;

            if (isObject(body) && MESSAGE in body && typeof body[MESSAGE] === "string") {
              return body[MESSAGE];
            }

            return "Something went wrong";
          }),
        });
      },
    },
  );
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
            <Button
              variant="outline"
              :disabled="isLogoutPending"
              class="font-bold"
              @click="handleLogout"
              >Logout</Button
            >
          </li>
        </ul>
      </nav>
    </header>
    <main className="flex flex-grow overflow-hidden">
      <RouterView />
    </main>
  </div>
</template>
