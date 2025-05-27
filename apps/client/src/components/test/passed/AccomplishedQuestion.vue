<template>
  <li class="question">
    <span class="content">{{ question.content }}</span>
    <span class="worth">Grade: {{ receivedScore.toFixed(1) }} out of {{ question.worth }}</span>
    <!-- <div>{{ enteredOrChosenAnswer }}</div> -->
    <AccomplishedExtendedAnswer
      v-if="question.type === extendedQuestionType"
      :correctAnswer="(question as PassedQuestionWithExtendedAnswer).correctAnswer"
      :enteredAnswer="(question as PassedQuestionWithExtendedAnswer).enteredAnswer"
    />
    <AccomplishedAnswerOptionBlock v-else :question="passedQuestionWithAnswerOptions" />
  </li>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import AccomplishedAnswerOptionBlock from "./AccomplishedAnswerOptionBlock.vue";
import AccomplishedExtendedAnswer from "./AccomplishedExtendedAnswer.vue";

import { QUESTION_TYPE } from "@/dtos/test/base";
import type {
  PassedQuestion,
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
} from "@/models/test/passed";

export default defineComponent({
  components: {
    AccomplishedExtendedAnswer,
    AccomplishedAnswerOptionBlock,
  },

  props: {
    question: {
      type: Object as PropType<PassedQuestion>,
      required: true,
    },
  },

  computed: {
    enteredOrChosenAnswer(): string | string[] {
      switch (this.question.type) {
        case QUESTION_TYPE.EXTENDED:
          return (this.question as PassedQuestionWithExtendedAnswer).enteredAnswer;
        case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION: {
          const answerOption = (
            this.question as PassedQuestionWithAnswerOptions
          ).answerOptions.find((answerOption) => answerOption.isChosen);
          if (answerOption !== undefined) {
            const index = (this.question as PassedQuestionWithAnswerOptions).answerOptions.indexOf(
              answerOption,
            );
            return `${index + 1}. ${answerOption.content}`;
          } else {
            return "";
          }
        }
        case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
          const correctAnswers = (this.question as PassedQuestionWithAnswerOptions).answerOptions
            .filter((answerOption) => answerOption.isChosen)
            .map((answerOption) => {
              const index = (
                this.question as PassedQuestionWithAnswerOptions
              ).answerOptions.indexOf(answerOption);
              return `${index + 1}. ${answerOption.content}`;
            });
          return correctAnswers.length > 0 ? correctAnswers : "";
        }
        default:
          return "";
      }
    },

    receivedScore() {
      return this.question.receivedScore;
    },

    extendedQuestionType() {
      return QUESTION_TYPE.EXTENDED;
    },

    passedQuestionWithAnswerOptions() {
      if (
        this.question.type === QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION ||
        this.question.type === QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS
      ) {
        return this.question as PassedQuestionWithAnswerOptions;
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
}
</style>
