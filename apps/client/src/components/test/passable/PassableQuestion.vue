<template>
  <li class="question">
    <span class="content">{{ question.content }}</span>
    <span class="worth">Points: {{ question.worth }}</span>
    <!-- <div>{{ enteredOrChosenAnswer }}</div> -->
    <div class="extended-answer" v-if="question.type === extendedQuestionType">
      <label for="">Answer</label>
      <PassableExtendedAnswer
        v-if="question.type === extendedQuestionType"
        v-model:enteredAnswer="(question as QuestionWithExtendedAnswerToPass).enteredAnswer"
      />
    </div>
    <PassableAnswerOptionBlock v-else :question="questionWithAnswerOptionsToPass" />
  </li>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import PassableAnswerOptionBlock from "./PassableAnswerOptionBlock.vue";
import PassableExtendedAnswer from "./PassableExtendedAnswer.vue";

import { QUESTION_TYPE } from "@/models/test/base";
import type {
  QuestionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
} from "@/models/test/to-pass";

export default defineComponent({
  components: {
    PassableExtendedAnswer,
    PassableAnswerOptionBlock,
  },

  props: {
    question: {
      type: Object as PropType<QuestionToPass>,
      required: true,
    },
  },

  computed: {
    enteredOrChosenAnswer(): string | string[] {
      switch (this.question.type) {
        case QUESTION_TYPE.EXTENDED:
          return (this.question as QuestionWithExtendedAnswerToPass).enteredAnswer;
        case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION: {
          const answerOption = (
            this.question as QuestionWithAnswerOptionsToPass
          ).answerOptions.find((answerOption) => answerOption.isChosen);
          if (answerOption !== undefined) {
            const index = (this.question as QuestionWithAnswerOptionsToPass).answerOptions.indexOf(
              answerOption,
            );
            return `${index + 1}. ${answerOption.content}`;
          } else {
            return "";
          }
        }
        case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
          const correctAnswers = (this.question as QuestionWithAnswerOptionsToPass).answerOptions
            .filter((answerOption) => answerOption.isChosen)
            .map((answerOption) => {
              const index = (
                this.question as QuestionWithAnswerOptionsToPass
              ).answerOptions.indexOf(answerOption);
              return `${index + 1}. ${answerOption.content}`;
            });
          return correctAnswers.length > 0 ? correctAnswers : "";
        }
        default:
          return "";
      }
    },

    extendedQuestionType() {
      return QUESTION_TYPE.EXTENDED;
    },

    questionWithAnswerOptionsToPass() {
      if (
        this.question.type === QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION ||
        this.question.type === QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS
      ) {
        return this.question as QuestionWithAnswerOptionsToPass;
      } else {
        throw new TypeError("This was expected to be a multiple choice question.");
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.question {
  position: relative;

  display: flex;
  flex-direction: column;

  padding: 10px;
  padding-top: 30px;
  border: 2px solid #1e434c;
  border-radius: 5px;

  list-style-type: none;

  > * {
    margin-bottom: 10px;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  .content,
  .worth {
    font-size: 1.2rem;
    color: #070f11;
  }
  .extended-answer {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    > label {
      font-size: 1.1rem;
      color: #070f11;
    }
  }
}
</style>
