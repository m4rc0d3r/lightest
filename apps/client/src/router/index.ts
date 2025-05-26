import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import AboutView from "../views/AboutView.vue";
import RegistrationView from "../views/RegistrationView.vue";
import LoginView from "../views/LoginView.vue";
import ActivationView from "../views/ActivationView.vue";
import TestsView from "../views/TestsView.vue";
import MyTestsView from "../views/MyTestsView.vue";
import TestCreationView from "../views/TestCreationView.vue";
import TestEditingView from "../views/TestEditingView.vue";
import TestPassView from "@/views/TestPassView.vue";
import PassedTestView from "@/views/PassedTestView.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
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
      beforeEnter(to, from) {
        return useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/about",
      name: "about",
      component: AboutView,
    },
    {
      path: "/register",
      name: "registration",
      component: RegistrationView,
      beforeEnter(to, from) {
        return !useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/login",
      name: "login",
      component: LoginView,
      beforeEnter(to, from) {
        return !useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/activate/:link",
      name: "activation",
      component: ActivationView,
    },
    {
      path: "/create-test",
      name: "test-creator",
      component: TestCreationView,
      beforeEnter(to, from) {
        return useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/edit-test/:id",
      name: "test-editor",
      component: TestEditingView,
      beforeEnter(to, from) {
        return useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/pass-test/:id",
      name: "test-passing",
      component: TestPassView,
      beforeEnter(to, from) {
        return useAuthStore().isLoggedIn;
      },
    },
    {
      path: "/passed-test/:id",
      name: "passed-test",
      component: PassedTestView,
      beforeEnter(to, from) {
        return useAuthStore().isLoggedIn;
      },
    },
  ],
});

export default router;
