<template>
  <li class="answer-option">
    <input
      :type="
        question.type === withOneCorrectAnswerOptionQuestionType
          ? 'radio'
          : 'checkbox'
      "
      :name="
        (question.type === withOneCorrectAnswerOptionQuestionType
          ? question.id
          : answerOption.id
        ).toString()
      "
      :id="answerOption.id.toString()"
      :checked="answerOption.isChosen"
      @change="(event) => answerOption.changeChoice.call(answerOption, question, (event.target as HTMLInputElement).checked)"
    />
    <label class="content" :for="answerOption.id.toString()">{{
      answerOption.content
    }}</label>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { QuestionType } from "@/models/test/base";
import type {
  QuestionWithAnswerOptionsToPass,
  AnswerOptionToPass,
} from "@/models/test/to-pass";

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<QuestionWithAnswerOptionsToPass>,
      required: true,
    },
    answerOption: {
      type: Object as PropType<AnswerOptionToPass>,
      required: true,
    },
  },

  computed: {
    withOneCorrectAnswerOptionQuestionType() {
      return QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION;
    },
  },
});
</script>

<style lang="scss" scoped>
.answer-option {
  list-style-type: none;
  display: flex;

  > * {
    margin-right: 5px;
  }
  > *:last-child {
    margin-right: 0;
  }

  > .content {
    color: #070f11;
  }
}

.content {
  flex-grow: 1;
}
</style>
