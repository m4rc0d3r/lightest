<template>
  <li class="test">
    <span class="title">{{ test.title }}</span>
    <span class="number-of-questions">Number of questions: {{ test.numberOfQuestions }}</span>
    <span
      class="grade"
      v-if="testMode === passedTestMode && typeof (test as BriefPassedTest).score === 'number'"
      >Grade: {{ (test as BriefPassedTest).score.toFixed(1) }} out of {{ test.grade }}</span
    >
    <span class="grade" v-else>Grade: {{ test.grade }}</span>
    <router-link
      class="open-test-page-button"
      v-if="testMode === editableTestMode"
      :to="`/edit-test/${test.id}`"
    >
      Edit
    </router-link>
    <router-link
      class="open-test-page-button"
      v-else-if="testMode === passableTestMode"
      :to="`/pass-test/${test.id}`"
    >
      Pass
    </router-link>
    <router-link
      class="open-test-page-button"
      v-else-if="testMode === passedTestMode"
      :to="`/passed-test/${test.id}`"
    >
      View result
    </router-link>
  </li>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import type { TestMode } from "./shared";
import { TEST_MODE } from "./shared";

import type { BriefPassedTest, BriefTest } from "@/dtos/test/brief";

export default defineComponent({
  props: {
    test: {
      type: Object as PropType<BriefTest | BriefPassedTest>,
      required: true,
    },
    testMode: {
      type: String as PropType<TestMode>,
      required: true,
    },
  },

  computed: {
    editableTestMode() {
      return TEST_MODE.EDITABLE;
    },

    passableTestMode() {
      return TEST_MODE.PASSABLE;
    },

    passedTestMode() {
      return TEST_MODE.PASSED;
    },
  },
});
</script>

<style lang="scss" scoped>
.test {
  display: flex;
  flex-direction: column;

  padding: 10px;
  border: 4px solid #1e434c;
  border-radius: 5px;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}

.title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #070f11;
}

.number-of-questions {
  font-size: 1.2rem;
  color: #070f11;
}

.grade {
  font-size: 1.2rem;
  color: #070f11;
}

.open-test-page-button {
  border: 1px solid black;
  border-radius: 5px;

  font-size: 1.4rem;
  color: white;
  text-align: center;
  text-decoration: none;

  background-color: #1e434c;
}
</style>
