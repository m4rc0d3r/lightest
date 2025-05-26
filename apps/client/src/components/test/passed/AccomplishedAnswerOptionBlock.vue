<template>
  <div class="answer-options-wrapper">
    <ol v-if="question.answerOptions.length > 0" class="answer-options">
      <AccomplishedAnswerOption
        v-for="answerOption in question.answerOptions"
        :key="answerOption.id"
        :question="question"
        :answerOption="answerOption"
      />
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import AccomplishedAnswerOption from "./AccomplishedAnswerOption.vue";

import type { PassedQuestionWithAnswerOptions } from "@/models/test/passed";

export default defineComponent({
  components: {
    AccomplishedAnswerOption,
  },

  props: {
    question: {
      type: Object as PropType<PassedQuestionWithAnswerOptions>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.answer-options-wrapper {
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}

.answer-options {
  border: 2px solid #1e434c;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
