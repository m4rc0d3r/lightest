import { Str } from "@lightest/core";
import { createRouter, createWebHistory } from "vue-router";

import { AuthLayout, MainLayout } from "./layouts";

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

export default router;
