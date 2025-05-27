<template>
  <li class="answer-option">
    <input
      :type="question.type === withOneCorrectAnswerOptionQuestionType ? 'radio' : 'checkbox'"
      :name="
        (question.type === withOneCorrectAnswerOptionQuestionType
          ? question.id
          : answerOption.id
        ).toString()
      "
      :id="answerOption.id.toString()"
      :checked="answerOption.isChosen"
      @change="
        (event) =>
          answerOption.changeChoice.call(
            answerOption,
            question,
            (event.target as HTMLInputElement).checked,
          )
      "
    />
    <label class="content" :for="answerOption.id.toString()">{{ answerOption.content }}</label>
  </li>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import { QUESTION_TYPE } from "@/models/test/base";
import type { AnswerOptionToPass, QuestionWithAnswerOptionsToPass } from "@/models/test/to-pass";

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
      return QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION;
    },
  },
});
</script>

<style lang="scss" scoped>
.content {
  flex-grow: 1;
}

.answer-option {
  display: flex;
  list-style-type: none;

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
</style>
