import { Str } from "@lightest/core";
import { createRouter, createWebHistory } from "vue-router";

import { AuthLayout, MainLayout } from "../layouts";

import { defineMeta, getOnlyFor, OnlyFor, onlyFor } from "./meta";

import { useAuthStore } from "@/entities/auth";
import AboutPage from "@/pages/AboutPage.vue";
import HomePage from "@/pages/HomePage.vue";
import LoginPage from "@/pages/LoginPage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import { ROUTES } from "@/shared/routing";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: Str.SLASH,
      component: MainLayout,
      children: [
        {
          path: ROUTES.home,
          name: "home",
          component: HomePage,
        },
        {
          path: ROUTES.about,
          name: "about",
          component: AboutPage,
        },
      ],
    },
    {
      path: Str.SLASH,
      component: AuthLayout,
      meta: defineMeta(onlyFor(OnlyFor.UNAUTHENTICATED)),
      children: [
        {
          path: ROUTES.register,
          name: "registration",
          component: RegistrationPage,
        },
        {
          path: ROUTES.login,
          name: "login",
          component: LoginPage,
        },
      ],
    },
  ],
});

router.beforeEach((to) => {
  const onlyFor = getOnlyFor(to);

  if (onlyFor === undefined) return true;

  const authenticationStatus: OnlyFor = useAuthStore().isAuthenticated
    ? OnlyFor.AUTHENTICATED
    : OnlyFor.UNAUTHENTICATED;

  return (
    onlyFor === authenticationStatus || {
      path: ROUTES.home,
    }
  );
});

export { router };
