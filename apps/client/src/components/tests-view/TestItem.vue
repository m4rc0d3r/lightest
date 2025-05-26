<template>
  <li class="test">
    <span class="title">{{ test.title }}</span>
    <span class="number-of-questions"
      >Number of questions: {{ test.numberOfQuestions }}</span
    >
    <span
      class="grade"
      v-if="testMode === passedTestMode && typeof (test as BriefPassedTest).score === 'number'"
      >Grade: {{ (test as BriefPassedTest).score.toFixed(1) }} out of
      {{ test.grade }}</span
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
import { defineComponent, type PropType } from "vue";
import type { BriefPassedTest, BriefTest } from "@/dtos/test/brief";

export enum TestMode {
  EDITABLE = "EDITABLE",
  PASSABLE = "PASSABLE",
  PASSED = "PASSED",
}

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
      return TestMode.EDITABLE;
    },

    passableTestMode() {
      return TestMode.PASSABLE;
    },

    passedTestMode() {
      return TestMode.PASSED;
    },
  },
});
</script>

<style lang="scss" scoped>
.test {
  border: 4px solid #1e434c;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  padding: 10px;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}

.title {
  color: #070f11;
  font-size: 1.5rem;
  font-weight: bold;
}

.number-of-questions {
  color: #070f11;
  font-size: 1.2rem;
}

.grade {
  color: #070f11;
  font-size: 1.2rem;
}

.open-test-page-button {
  background-color: #1e434c;
  border: 1px solid black;
  border-radius: 5px;
  color: white;
  font-size: 1.4rem;
  text-decoration: none;
  text-align: center;
}
</style>
