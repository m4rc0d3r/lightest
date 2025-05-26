<template>
  <li class="question">
    <span class="content">{{ question.content }}</span>
    <span class="worth"
      >Grade: {{ receivedScore.toFixed(1) }} out of {{ question.worth }}</span
    >
    <!-- <div>{{ enteredOrChosenAnswer }}</div> -->
    <AccomplishedExtendedAnswer
      v-if="question.type === extendedQuestionType"
      :correctAnswer="(question as PassedQuestionWithExtendedAnswer).correctAnswer"
      :enteredAnswer="(question as PassedQuestionWithExtendedAnswer).enteredAnswer"
    />
    <AccomplishedAnswerOptionBlock
      v-else
      :question="(question as PassedQuestionWithAnswerOptions)"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import AccomplishedExtendedAnswer from "./AccomplishedExtendedAnswer.vue";
import AccomplishedAnswerOptionBlock from "./AccomplishedAnswerOptionBlock.vue";

import { QuestionType } from "@/models/test/base";
import type {
  PassedQuestion,
  PassedQuestionWithExtendedAnswer,
  PassedQuestionWithAnswerOptions,
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
        case QuestionType.EXTENDED:
          return (this.question as PassedQuestionWithExtendedAnswer)
            .enteredAnswer;
        case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION: {
          const answerOption = (
            this.question as PassedQuestionWithAnswerOptions
          ).answerOptions.find((answerOption) => answerOption.isChosen);
          if (answerOption !== undefined) {
            const index = (
              this.question as PassedQuestionWithAnswerOptions
            ).answerOptions.indexOf(answerOption);
            return `${index + 1}. ${answerOption.content}`;
          } else {
            return "";
          }
        }
        case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
          const correctAnswers = (
            this.question as PassedQuestionWithAnswerOptions
          ).answerOptions
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
      return QuestionType.EXTENDED;
    },
  },
});
</script>

<style lang="scss" scoped>
.question {
  list-style-type: none;
  border: 2px solid #1e434c;
  border-radius: 5px;
  padding: 10px;
  padding-top: 30px;
  position: relative;
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 10px;
  }
  > *:last-child {
    margin-bottom: 0;
  }

  .content,
  .worth {
    color: #070f11;
    font-size: 1.2rem;
  }
}
</style>
