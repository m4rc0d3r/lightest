<template>
  <div class="answer-options-wrapper">
    <ol v-if="question.answerOptions.length > 0" class="answer-options">
      <PassableAnswerOption
        v-for="answerOption in question.answerOptions"
        :key="answerOption.id"
        :question="question"
        :answerOption="answerOption"
      />
    </ol>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import PassableAnswerOption from "./PassableAnswerOption.vue";

import type { QuestionWithAnswerOptionsToPass } from "@/models/test/to-pass";

export default defineComponent({
  components: {
    PassableAnswerOption,
  },

  props: {
    question: {
      type: Object as PropType<QuestionWithAnswerOptionsToPass>,
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
}

.answer-options {
  display: flex;
  flex-direction: column;

  padding: 5px;
  border: 2px solid #1e434c;
  border-radius: 5px;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}

.answer-options-wrapper > *:last-child {
  margin-bottom: 0;
}
</style>
