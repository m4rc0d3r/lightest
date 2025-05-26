<template>
  <li class="question">
    <span class="content">{{ question.content }}</span>
    <span class="worth">Grade: {{ question.worth }}</span>
    <!-- <div>{{ enteredOrChosenAnswer }}</div> -->
    <div class="extended-answer" v-if="question.type === extendedQuestionType">
      <label for="">Answer</label>
      <PassableExtendedAnswer
        v-if="question.type === extendedQuestionType"
        v-model:enteredAnswer="(question as QuestionWithExtendedAnswerToPass).enteredAnswer"
      />
    </div>
    <PassableAnswerOptionBlock
      v-else
      :question="(question as QuestionWithAnswerOptionsToPass)"
    />
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import PassableExtendedAnswer from "./PassableExtendedAnswer.vue";
import PassableAnswerOptionBlock from "./PassableAnswerOptionBlock.vue";

import { QuestionType } from "@/models/test/base";
import type {
  QuestionToPass,
  QuestionWithExtendedAnswerToPass,
  QuestionWithAnswerOptionsToPass,
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
        case QuestionType.EXTENDED:
          return (this.question as QuestionWithExtendedAnswerToPass)
            .enteredAnswer;
        case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION: {
          const answerOption = (
            this.question as QuestionWithAnswerOptionsToPass
          ).answerOptions.find((answerOption) => answerOption.isChosen);
          if (answerOption !== undefined) {
            const index = (
              this.question as QuestionWithAnswerOptionsToPass
            ).answerOptions.indexOf(answerOption);
            return `${index + 1}. ${answerOption.content}`;
          } else {
            return "";
          }
        }
        case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
          const correctAnswers = (
            this.question as QuestionWithAnswerOptionsToPass
          ).answerOptions
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
  .extended-answer {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    > label {
      color: #070f11;
      font-size: 1.1rem;
    }
  }
}
</style>
