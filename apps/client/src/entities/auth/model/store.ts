import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";

const useAuthStore = defineStore("auth", () => {
  const isAuthenticated = useStorage("isAuthenticated", false);

  function setAuthenticated(value: boolean) {
    isAuthenticated.value = value;
  }

  return { isAuthenticated, setAuthenticated };
});

export { useAuthStore };
