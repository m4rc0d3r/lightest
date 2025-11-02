<script setup lang="ts">
import { onMounted, reactive } from "vue";
import { toast } from "vue-sonner";

import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
import type { BriefTest } from "@/dtos/test/brief";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

const tests = reactive<BriefTest[]>([]);

onMounted(async () => {
  await loadTests();
});

async function loadTests() {
  const result = extractData(await TestService.getBriefTests());

  if (result instanceof Report) {
    toast.success(result.message);
    if (result.payload) {
      tests.splice(0, tests.length, ...result.payload);
    }
  } else {
    toast.error(result.message);
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
