<template>
  <TestList
    v-if="tests.length > 0"
    :tests="tests"
    :test-mode="passableTestMode"
  />
  <p v-else>There are currently no tests created.</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import TestList from "@/components/tests-view/TestList.vue";
import { TestMode } from "@/components/tests-view/TestItem.vue";

import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import type { BriefTest } from "@/dtos/test/brief";
import { Report } from "@/http/dtos/report";
import { TestService } from "@/services/test-service";
import { extractData } from "@/services/helpers";

export default defineComponent({
  components: {
    TestList,
  },

  data() {
    return {
      tests: [] as BriefTest[],
      notificationStore: useNotificationStore(),
    };
  },

  async mounted() {
    await this.loadTests();
  },

  computed: {
    passableTestMode() {
      return TestMode.PASSABLE;
    },
  },

  methods: {
    async loadTests() {
      const result = extractData(await TestService.getBriefTests());

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          this.tests = result.payload;
        }
      } else {
        this.notificationStore.add(
          new Notification(Status.FAILURE, result.message)
        );
      }
    },
  },
});
</script>

<style scoped></style>
