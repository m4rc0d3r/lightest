import { createRouter, createWebHistory } from "vue-router";

import { MainLayout } from "./main-layout";

import AboutPage from "@/pages/AboutPage.vue";
import HomePage from "@/pages/HomePage.vue";
import RegistrationPage from "@/pages/RegistrationPage.vue";
import { ROUTES } from "@/shared/routing";
import { SLASH } from "@/shared/str";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: SLASH,
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
      path: ROUTES.register,
      name: "registration",
      component: RegistrationPage,
    },
  ],
});

export default router;
