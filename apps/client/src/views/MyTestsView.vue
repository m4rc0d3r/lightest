<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";
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
import type { BriefPassedTest, BriefTest } from "@/dtos/test/brief";
import type { APIError } from "@/http/dtos/api-error";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

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

const tests = reactive<BriefTest[] | BriefPassedTest[]>([]);
const notificationStore = useNotificationStore();
const displayedTests = ref<DisplayedTest>(DISPLAYED_TEST.CREATED);

onMounted(async () => {
  await loadTests();
});

watch(
  displayedTests,
  async () => {
    const loadedTests = await loadTests();
    if (loadedTests !== undefined) {
      tests.splice(0, tests.length, ...loadedTests);
    }
  },
  {
    immediate: true,
  },
);

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

async function loadTests() {
  let result: APIError | Report<BriefTest[]> | Report<BriefPassedTest[]> | null = null;

  switch (displayedTests.value) {
    case DISPLAYED_TEST.CREATED:
      result = extractData(await TestService.getBriefTestsCreatedByUser());
      break;
    case DISPLAYED_TEST.PASSED:
      result = extractData(await TestService.getBriefTestsPassedByUser());
      break;
  }

  if (result instanceof Report) {
    notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
    if (result.payload) {
      return result.payload;
    }
  } else {
    notificationStore.add(new Notification(STATUS.FAILURE, result.message));
  }
  return undefined;
}
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
    <TestList
      v-if="tests.length > 0"
      :tests="tests"
      :test-mode="displayedTests === DISPLAYED_TEST.CREATED ? TEST_MODE.EDITABLE : TEST_MODE.PASSED"
    />
    <p v-else class="m-auto text-3xl">
      {{
        displayedTests === DISPLAYED_TEST.CREATED
          ? "There are currently no tests created."
          : "You haven't taken any tests yet."
      }}
    </p>
  </div>
</template>
