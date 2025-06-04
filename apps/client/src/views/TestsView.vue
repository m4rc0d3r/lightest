<script setup lang="ts">
import { onMounted, reactive } from "vue";

import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
import type { BriefTest } from "@/dtos/test/brief";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

const tests = reactive<BriefTest[]>([]);
const notificationStore = useNotificationStore();

onMounted(async () => {
  await loadTests();
});

async function loadTests() {
  const result = extractData(await TestService.getBriefTests());

  if (result instanceof Report) {
    notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
    if (result.payload) {
      tests.splice(0, tests.length, ...result.payload);
    }
  } else {
    notificationStore.add(new Notification(STATUS.FAILURE, result.message));
  }
}
</script>

<template>
  <div class="flex flex-grow overflow-auto p-4">
    <TestList
      v-if="tests.length > 0"
      :tests="tests"
      :test-mode="TEST_MODE.PASSABLE"
      class="w-full"
    />
    <p v-else class="m-auto text-3xl">No user has created a test yet.</p>
  </div>
</template>
