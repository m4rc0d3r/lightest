<template>
  <TestList v-if="tests.length > 0" :tests="tests" :test-mode="passableTestMode" />
  <p v-else>There are currently no tests created.</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
import type { BriefTest } from "@/dtos/test/brief";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

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
      return TEST_MODE.PASSABLE;
    },
  },

  methods: {
    async loadTests() {
      const result = extractData(await TestService.getBriefTests());

      if (result instanceof Report) {
        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
        if (result.payload) {
          this.tests = result.payload;
        }
      } else {
        this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
      }
    },
  },
});
</script>

style>
