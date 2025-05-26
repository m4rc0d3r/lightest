<template>
  <li
    class="answer-option"
    :class="{
      'chosen-correctly': answerOption.isChosen && answerOption.isCorrect,
      'chosen-incorrectly': answerOption.isChosen && !answerOption.isCorrect,
      'correct-but-not-chosen':
        answerOption.isCorrect && !answerOption.isChosen,
    }"
  >
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
      :checked="answerOption.isChosen"
      disabled
    />
    <span class="content">{{ answerOption.content }}</span>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { QuestionType } from "@/models/test/base";
import type {
  PassedQuestionWithAnswerOptions,
  PassedAnswerOption,
} from "@/models/test/passed";

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<PassedQuestionWithAnswerOptions>,
      required: true,
    },
    answerOption: {
      type: Object as PropType<PassedAnswerOption>,
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

.correct {
  background-color: lightgreen;
}

.wrong {
  background-color: lightpink;
}

.chosen-correctly {
  background-color: lightgreen;
}

.chosen-incorrectly {
  background-color: lightcoral;
}

.correct-but-not-chosen {
  background-color: greenyellow;
}

.content {
  flex-grow: 1;
}
</style>
