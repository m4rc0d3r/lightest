/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { createRouter, createWebHistory } from "vue-router";

import AboutView from "../views/AboutView.vue";
import ActivationView from "../views/ActivationView.vue";
import LoginView from "../views/LoginView.vue";
import MyTestsView from "../views/MyTestsView.vue";
import RegistrationView from "../views/RegistrationView.vue";
import TestCreationView from "../views/TestCreationView.vue";
import TestEditingView from "../views/TestEditingView.vue";
import TestsView from "../views/TestsView.vue";

import MainLayout from "@/layouts/MainLayout.vue";
import { useAuthStore } from "@/stores/auth";
import PassedTestView from "@/views/PassedTestView.vue";
import TestPassView from "@/views/TestPassView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: MainLayout,
      children: [
        {
          path: "/",
          name: "tests",
          component: TestsView,
          alias: ["/tests", "/home"],
        },
        {
          path: "/my-tests",
          name: "my-tests",
          component: MyTestsView,
          beforeEnter(_to, _from) {
            return useAuthStore().isLoggedIn;
          },
        },
        {
          path: "/about",
          name: "about",
          component: AboutView,
        },

        {
          path: "/create-test",
          name: "test-creator",
          component: TestCreationView,
          beforeEnter(_to, _from) {
            return useAuthStore().isLoggedIn;
          },
        },
        {
          path: "/edit-test/:id",
          name: "test-editor",
          component: TestEditingView,
          beforeEnter(_to, _from) {
            return useAuthStore().isLoggedIn;
          },
        },
        {
          path: "/pass-test/:id",
          name: "test-passing",
          component: TestPassView,
          beforeEnter(_to, _from) {
            return useAuthStore().isLoggedIn;
          },
        },
        {
          path: "/passed-test/:id",
          name: "passed-test",
          component: PassedTestView,
          beforeEnter(_to, _from) {
            return useAuthStore().isLoggedIn;
          },
        },
      ],
    },
    {
      path: "/register",
      name: "registration",
      component: RegistrationView,
      beforeEnter(_to, _from) {
        return !useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter(_to, _from) {
        return !useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/activate/:link",
      name: "activation",
      component: ActivationView,
    },
  ],
});

export default router;
