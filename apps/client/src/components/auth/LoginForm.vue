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
        <span class="error" v-for="error in errors" :key="error.id">{{
          error.message
        }}</span>
      </div>
    </form>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import { Report } from "@/http/dtos/report";
import { APIError, APIErrorCode } from "@/http/dtos/api-error";

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
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        this.$router.push("/");
      } else if (result instanceof APIError) {
        if (result.code === APIErrorCode.ERR_NETWORK) {
          this.notificationStore.add(
            new Notification(Status.FAILURE, result.message)
          );
        } else {
          this.errors = result.message
            .split("\n")
            .map((error) => new Notification(Status.FAILURE, error));
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
  border: 2px solid #1e434c;
  border-radius: 5px;
  margin: auto;
  min-width: 300px;
  min-height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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
  background-color: white;
  margin: 0 10px;
}

.error {
  color: red;
  font-size: 1.3rem;
  margin: auto;
  padding: 0 10px;
}
</style>
