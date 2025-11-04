<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink } from "vue-router";

import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { injectDiContainer } from "@/features/di";
import { EMPTY_ARGS } from "@/shared/ts-rest";

const DISPLAYED_TEST = {
  CREATED: "CREATED",
  PASSED: "PASSED",
} as const;
type DisplayedTest = (typeof DISPLAYED_TEST)[keyof typeof DISPLAYED_TEST];

const DisplayedTestCount = 2;

class DisplayedTestForSelect {
  value: DisplayedTest;
  label: string;

  constructor(value: DisplayedTest, label: string) {
    this.value = value;
    this.label = label;
  }
}

const displayedTests = ref<DisplayedTest>(DISPLAYED_TEST.CREATED);

const allDisplayedTestsForSelect = computed(() => {
  const questionTypes = [
    new DisplayedTestForSelect(DISPLAYED_TEST.CREATED, "Created by me"),
    new DisplayedTestForSelect(DISPLAYED_TEST.PASSED, "Passed me by"),
  ];

  if (questionTypes.length !== DisplayedTestCount) {
    throw new Error(
      `Number of displayed tests ${DisplayedTestCount}, not ${questionTypes.length}.`,
    );
  }

  return questionTypes;
});

const { tsRestClient } = injectDiContainer();
const {
  data: testsCreatedByMe,
  isError: isTestsCreatedByMeError,
  isPending: isTestsCreatedByMePending,
} = tsRestClient.test.getUserCreatedTests.useQuery(["test", "getUserCreatedTests"], EMPTY_ARGS, {
  retry: false,
});
const {
  data: testsPassedByMe,
  isError: isTestsPassedByMeError,
  isPending: isTestsPassedByMePending,
} = tsRestClient.test.getTestsPassedByUser.useQuery(["test", "getTestsPassedByUser"], EMPTY_ARGS, {
  retry: false,
});
</script>

<template>
  <div class="flex flex-grow flex-col gap-4 overflow-auto p-4">
    <div class="flex justify-between">
      <Select
        :model-value="displayedTests"
        @update:model-value="(value) => (displayedTests = value as DisplayedTest)"
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem
              v-for="{ label, value } in allDisplayedTestsForSelect"
              :key="value"
              :value="value"
              >{{ label }}</SelectItem
            >
          </SelectGroup>
        </SelectContent>
      </Select>
      <Button as-child>
        <RouterLink
          class="create-test-button"
          to="/create-test"
          v-show="displayedTests === DISPLAYED_TEST.CREATED"
          >Create test</RouterLink
        >
      </Button>
    </div>
    <template v-if="displayedTests === 'CREATED'">
      <Spinner v-if="isTestsCreatedByMePending" class="m-auto h-1/2 w-auto" />
      <p v-else-if="isTestsCreatedByMeError" class="m-auto text-center text-4xl">
        Failed to load tests
      </p>
      <template v-else>
        <TestList
          v-if="(testsCreatedByMe?.body.payload.length ?? 0) > 0"
          :tests="testsCreatedByMe?.body.payload ?? []"
          :test-mode="TEST_MODE.EDITABLE"
          class="w-full"
        />
        <p v-else class="m-auto text-3xl">There are currently no tests created.</p>
      </template>
    </template>
    <template v-else>
      <Spinner v-if="isTestsPassedByMePending" class="m-auto h-1/2 w-auto" />
      <p v-else-if="isTestsPassedByMeError" class="m-auto text-center text-4xl">
        Failed to load tests
      </p>
      <template v-else>
        <TestList
          v-if="(testsPassedByMe?.body.payload.length ?? 0) > 0"
          :tests="testsPassedByMe?.body.payload ?? []"
          :test-mode="TEST_MODE.PASSED"
          class="w-full"
        />
        <p v-else class="m-auto text-3xl">You haven't taken any tests yet.</p>
      </template>
    </template>
  </div>
</template>
