<template>
  <div class="app">
    <nav class="menu" v-if="$route.path !== '/register' && $route.path !== '/login'">
      <div class="general-menu">
        <router-link class="menu-item" to="/home">Home</router-link>
        <router-link class="menu-item" to="/about">About</router-link>

        <router-link class="menu-item" to="/my-tests">My tests</router-link>
      </div>
      <div>
        <router-link class="menu-item" to="/register" v-if="!authStore.isLoggedIn"
          >Register</router-link
        >
        <router-link class="menu-item" to="/login" v-if="!authStore.isLoggedIn">Login</router-link>
        <a class="menu-item" @click="logout" v-if="authStore.isLoggedIn">Logout</a>
      </div>
    </nav>
    <router-view />
    <div class="notifications-wrapper" v-if="notificationStore.notifications.length > 0">
      <SimpleNotification
        v-for="notification in notificationStore.notifications"
        :key="notification.id"
        :notification="notification"
        @delete="notificationStore.remove(notification.id)"
      />
    </div>

    <!-- <nav class="admin-navbar">
      <router-link to="/home">Home</router-link>
      <router-link to="/about">About</router-link>
      <router-link to="/create-test">Create test</router-link>
      <router-link to="/my-tests">My tests</router-link>
      <router-link to="/register">Register</router-link>
      <router-link to="/login">Login</router-link>
      <a @click="logout">Logout</a>
    </nav> -->
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import SimpleNotification from "@/components/SimpleNotification.vue";
import { APIError } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { useAuthStore } from "@/stores/auth";
import { useNotificationStore } from "@/stores/notification";

export default defineComponent({
  components: {
    SimpleNotification,
  },
  data() {
    return {
      authStore: useAuthStore(),
      notificationStore: useNotificationStore(),
    };
  },

  async mounted() {
    await this.authStore.refresh();
    if (this.$route.name === undefined) {
      if ((await this.$router.push(location.pathname)) !== undefined) {
        await this.$router.push("/");
      }
    }
  },

  methods: {
    async logout() {
      if (this.authStore.isLoggedIn) {
        const result = await this.authStore.logout();
        if (result instanceof Report) {
          this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
        } else if (result instanceof APIError) {
          this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
        }
        void this.$router.push("/home");
      }
    },
  },
});
</script>

<style lang="scss">
@use "@/stylesheets/reset";

body {
  font-family: Cambria, Cochin, Georgia, Times, "Times New Roman", serif;
  background-color: #f78a31;
}

.app {
  overflow: auto;
  width: 80%;
  margin: 20px auto;
}

.menu {
  display: flex;
  justify-content: space-between;
  font-size: 1.75rem;
  background-color: #1e434c;
}

.menu-item {
  cursor: pointer;

  display: inline-block;

  box-sizing: border-box;
  margin-right: 10px;
  padding: 10px 15px;

  color: white;
  text-decoration: none;

  &:last-child {
    margin-right: 0;
  }
}

.notifications-wrapper {
  position: fixed;
  top: 0;
  left: 50%;
  transform: translate(-50%);

  display: flex;
  flex-direction: column;
  align-items: center;
}

.admin-navbar {
  position: fixed;
  bottom: 0;
}

input:not([type="image"]) {
  border: none;
  border-bottom: 1px solid #1e434c;
  color: white;
  background-color: transparent;

  &::placeholder {
    color: rgb(236, 236, 236);
  }

  &:focus {
    border-bottom: 2px solid #1e434c;
    outline: none;
  }
}

button {
  padding: 5px;
  border: 1px solid black;
  border-radius: 5px;

  color: white;
  text-align: center;
  text-decoration: none;

  background-color: #1e434c;
}
</style>
