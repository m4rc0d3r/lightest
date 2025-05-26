<template>
  <div
    :class="{
      success: notification.status === 'SUCCESS',
      failure: notification.status === 'FAILURE',
    }"
  >
    <span class="notification-message">{{ notification.message }}</span>
    <input
      type="image"
      src="https://cdn2.iconfinder.com/data/icons/miscellaneous-symbols/100/symbol-bold-math-multiply-512.png"
      alt="Delete message"
      title="Delete message"
      class="delete-notification-button"
      @click="$emit('delete')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { Notification } from "@/models/notification";

export default defineComponent({
  props: {
    notification: {
      type: Notification,
      required: true,
    },
  },

  emits: {
    delete() {
      return true;
    },
  },
});
</script>

<style lang="scss" scoped>
%notification {
  margin: 5px 0;
  padding: 5px 10px;
}

.success {
  @extend %notification;
  background-color: lightgreen;
}

.failure {
  @extend %notification;
  background-color: pink;
}

.notification-message {
  margin-right: 5px;
}

.delete-notification-button {
  width: 30px;
}
</style>
