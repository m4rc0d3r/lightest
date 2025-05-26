<template>
  <div class="control-panel">
    <select
      class="type-of-displayed-tests"
      :value="displayedTests"
      @change="
        displayedTests = ($event.target as HTMLSelectElement)
          .value as DisplayedTest
      "
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
    :test-mode="
      displayedTests === createdDisplayedTest
        ? editableTestMode
        : passedTestMode
    "
  />
  <p v-else>There are currently no tests created.</p>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import { TestMode } from "@/components/tests-view/TestItem.vue";

import { useNotificationStore } from "@/stores/notification";
import { Notification, Status } from "@/models/notification";
import TestList from "@/components/tests-view/TestList.vue";
import type { BriefTest, BriefPassedTest } from "@/dtos/test/brief";
import { Report } from "@/http/dtos/report";
import { TestService } from "@/services/test-service";
import { extractData } from "@/services/helpers";
import type { APIError } from "@/http/dtos/api-error";

enum DisplayedTest {
  CREATED = "CREATED",
  PASSED = "PASSED",
}

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
      displayedTests: DisplayedTest.CREATED,
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
      return TestMode.EDITABLE;
    },

    passedTestMode() {
      return TestMode.PASSED;
    },

    createdDisplayedTest() {
      return DisplayedTest.CREATED;
    },

    passedDisplayedTest() {
      return DisplayedTest.PASSED;
    },

    allDisplayedTestsForSelect() {
      const questionTypes = [
        new DisplayedTestForSelect(DisplayedTest.CREATED, "Created by me"),
        new DisplayedTestForSelect(DisplayedTest.PASSED, "Passed me by"),
      ];

      if (questionTypes.length !== DisplayedTestCount) {
        throw new Error(
          `Number of displayed tests ${DisplayedTestCount}, not ${questionTypes.length}.`
        );
      }

      return questionTypes;
    },
  },

  methods: {
    async loadTests() {
      let result:
        | APIError
        | Report<BriefTest[]>
        | Report<BriefPassedTest[]>
        | null = null;

      switch (this.displayedTests) {
        case DisplayedTest.CREATED:
          result = extractData(await TestService.getBriefTestsCreatedByUser());
          break;
        case DisplayedTest.PASSED:
          result = extractData(await TestService.getBriefTestsPassedByUser());
          break;
      }

      if (result instanceof Report) {
        this.notificationStore.add(
          new Notification(Status.SUCCESS, result.message)
        );
        if (result.payload) {
          return result.payload;
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

<style lang="scss" scoped>
.control-panel {
  display: flex;
  justify-content: space-between;

  padding: 10px 0;

  .type-of-displayed-tests {
    background-color: #1e434c;
    color: white;
    padding: 5px;

    > option {
      background-color: #1e434c;
    }
  }

  > .create-test-button {
    background-color: #1e434c;
    border: 1px solid black;
    border-radius: 5px;
    padding: 5px;
    color: white;
    text-decoration: none;
    text-align: center;
  }
}
</style>
