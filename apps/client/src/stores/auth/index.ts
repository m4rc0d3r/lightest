import { EMPTY } from "@lightest/core";
import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const _token = ref(EMPTY);

  const token = computed(() => _token.value);
  const isLoggedIn = computed(() => _token.value.length > 0);

  function login(token: string) {
    _token.value = token;
  }
  function logout() {
    _token.value = EMPTY;
  }

  return {
    token,
    isLoggedIn,
    login,
    logout,
  };
});
