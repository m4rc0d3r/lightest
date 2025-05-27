<template>
  <div class="control-panel">
    <select
      class="type-of-displayed-tests"
      :value="displayedTests"
      @change="displayedTests = ($event.target as HTMLSelectElement).value as DisplayedTest"
    >
      <option
        v-for="questionType in allDisplayedTestsForSelect"
        :key="questionType.value"
        :value="questionType.value"
        :label="questionType.label"
      ></option>
    </select>
    <router-link
      class="create-test-button"
      to="/create-test"
      v-show="displayedTests === createdDisplayedTest"
      >Create test</router-link
    >
  </div>

  <TestList
    v-if="tests.length > 0"
    :tests="tests"
    :test-mode="displayedTests === createdDisplayedTest ? editableTestMode : passedTestMode"
  />
  <p v-else>There are currently no tests created.</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { TEST_MODE } from "@/components/tests-view/shared";
import TestList from "@/components/tests-view/TestList.vue";
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

export default defineComponent({
  components: {
    TestList,
  },

  data() {
    return {
      tests: [] as BriefTest[] | BriefPassedTest[],
      notificationStore: useNotificationStore(),
      displayedTests: DISPLAYED_TEST.CREATED as DisplayedTest,
    };
  },

  async mounted() {
    await this.loadTests();
  },

  watch: {
    displayedTests: {
      async handler() {
        const tests = await this.loadTests();
        if (tests !== undefined) {
          this.tests = tests;
        }
      },
      immediate: true,
    },
  },

  computed: {
    editableTestMode() {
      return TEST_MODE.EDITABLE;
    },

    passedTestMode() {
      return TEST_MODE.PASSED;
    },

    createdDisplayedTest() {
      return DISPLAYED_TEST.CREATED;
    },

    passedDisplayedTest() {
      return DISPLAYED_TEST.PASSED;
    },

    allDisplayedTestsForSelect() {
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
    },
  },

  methods: {
    async loadTests() {
      let result: APIError | Report<BriefTest[]> | Report<BriefPassedTest[]> | null = null;

      switch (this.displayedTests) {
        case DISPLAYED_TEST.CREATED:
          result = extractData(await TestService.getBriefTestsCreatedByUser());
          break;
        case DISPLAYED_TEST.PASSED:
          result = extractData(await TestService.getBriefTestsPassedByUser());
          break;
      }

      if (result instanceof Report) {
        this.notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
        if (result.payload) {
          return result.payload;
        }
      } else {
        this.notificationStore.add(new Notification(STATUS.FAILURE, result.message));
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.control-panel {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;

  .type-of-displayed-tests {
    padding: 5px;
    color: white;
    background-color: #1e434c;

    > option {
      background-color: #1e434c;
    }
  }

  > .create-test-button {
    padding: 5px;
    border: 1px solid black;
    border-radius: 5px;

    color: white;
    text-align: center;
    text-decoration: none;

    background-color: #1e434c;
  }
}
</style>
