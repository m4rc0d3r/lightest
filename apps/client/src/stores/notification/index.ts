import { defineStore } from "pinia";

import type { Status, Notification } from "@/models/notification";

const errorLifetime = 5000;

export const useNotificationStore = defineStore("notification", {
  state() {
    return {
      _notifications: [] as Notification[],
    };
  },

  getters: {
    notifications(): Notification[] {
      return this._notifications;
    },
  },

  actions: {
    add(notification: Notification) {
      this._notifications.push(notification);
      const errorId = notification.id;
      setTimeout(() => {
        const id = this._notifications.findIndex(
          (notification) => notification.id === errorId
        );
        if (id !== -1) {
          this._notifications.splice(id, 1);
        }
      }, errorLifetime);
    },

    remove(id: string) {
      this._notifications.splice(
        this._notifications.findIndex((notification) => notification.id === id),
        1
      );
    },
  },
});
