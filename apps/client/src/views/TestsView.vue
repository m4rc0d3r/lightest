<script setup lang="ts">
import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
import { Spinner } from "@/components/ui/spinner";
import { injectDiContainer } from "@/features/di";
import { EMPTY_ARGS } from "@/shared/ts-rest";

const { tsRestClient } = injectDiContainer();
const {
  data: tests,
  isError: isTestsError,
  isPending: isTestsPending,
} = tsRestClient.test.getBriefTests.useQuery(["test", "getBriefTests"], EMPTY_ARGS, {
  retry: false,
});
</script>

<template>
  <div class="flex flex-grow overflow-auto p-4">
    <Spinner v-if="isTestsPending" class="m-auto h-1/2 w-auto" />
    <p v-else-if="isTestsError" class="m-auto text-center text-4xl">Failed to load tests</p>
    <template v-else>
      <TestList
        v-if="(tests?.body.payload.length ?? 0) > 0"
        :tests="tests?.body.payload ?? []"
        :test-mode="TEST_MODE.PASSABLE"
        class="w-full"
      />
      <p v-else class="m-auto text-3xl">No user has created a test yet.</p>
    </template>
  </div>
</template>
