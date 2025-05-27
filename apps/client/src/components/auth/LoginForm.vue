<template>
  <div class="form-wrapper">
    <form class="form" @submit.prevent>
      <div class="email-wrapper">
        <label for="email">Email</label>
        <input type="email" id="email" required v-model="email" />
      </div>
      <div class="password-wrapper">
        <label for="password">Password</label>
        <input type="password" id="password" required v-model="password" />
      </div>
      <div class="button-wrapper">
        <button @click="login">Login</button>
      </div>
      <div class="errors-wrapper" v-if="errors.length > 0">
        <span class="error" v-for="error in errors" :key="error.id">{{ error.message }}</span>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { APIError, API_ERROR_CODE } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

export default defineComponent({
  data() {
    return {
      email: "",
      password: "",
      errors: [] as Notification[],
      authStore: useAuthStore(),
      notificationStore: useNotificationStore(),
    };
  },

  methods: {
    async login() {
      const result = await this.authStore.login(this.email, this.password);
      if (result instanceof Report) {
        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
        void this.$router.push("/");
      } else if (result instanceof APIError) {
        if (result.code === API_ERROR_CODE.ERR_NETWORK) {
          this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
        } else {
          this.errors = result.message
            .split("\n")
            .map((error) => new Notification(STATUS.FAILURE, error));
        }
      }
    },
  },
});
</script>

<style lang="scss" scoped>
@mixin form-element {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 10px;
}

.form-wrapper {
  display: flex;
  height: 100vh;
}

form {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  min-width: 300px;
  min-height: 200px;
  margin: auto;
  padding: 20px;
  border: 2px solid #1e434c;
  border-radius: 5px;
}

form > *:last-child {
  margin-bottom: 0;
}

.email-wrapper {
  @include form-element;

  > label {
    font-size: 2rem;
  }

  > input {
    font-size: 1.5rem;
  }
}

.password-wrapper {
  @include form-element;

  > label {
    font-size: 2rem;
  }

  > input {
    font-size: 1.5rem;
  }
}

.button-wrapper {
  @include form-element;

  > button {
    font-size: 1.5rem;
  }
}

.errors-wrapper {
  @include form-element;

  margin: 0 10px;
  background-color: white;
}

.error {
  margin: auto;
  padding: 0 10px;
  font-size: 1.3rem;
  color: red;
}
</style>
