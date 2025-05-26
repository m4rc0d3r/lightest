<template>
  <li class="question">
    <div class="content">
      <label for="">Question</label>
      <input
        type="text"
        :value="content"
        @input="
          $emit('update:content', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <div class="worth">
      <label for="">Worth</label>
      <input
        type="number"
        :value="worth"
        @input="
          $emit(
            'update:worth',
            ($event.target as HTMLInputElement).value.length > 0
              ? ($event.target as HTMLInputElement).value
              : '0'
          )
        "
      />
    </div>
    <div class="type">
      <label for="">Type</label>
      <select
        :value="question.type"
        @change="(event) => $emit('change-type', (event.target as HTMLSelectElement).value as QuestionType)"
      >
        <option
          v-for="questionType in allQuestionTypesForSelect"
          :key="questionType.value"
          :value="questionType.value"
          :label="questionType.label"
        ></option>
      </select>
    </div>
    <div class="answer">
      <label v-if="question.type === extendedQuestionType" for="">Answer</label>
      <EditableExtendedAnswer
        v-if="question.type === extendedQuestionType"
        v-model:correctAnswer="(question as QuestionWithExtendedAnswerToEdit).correctAnswer"
      />
      <EditableAnswerOptionBlock
        v-else
        :question="(question as QuestionWithAnswerOptionsToEdit)"
        @add-answer-option="
          (question as QuestionWithAnswerOptionsToEdit).addAnswerOption.call(
            question
          )
        "
        @delete-answer-option="(answerOptionIndex) => (question as QuestionWithAnswerOptionsToEdit).deleteAnswerOption.call(question, answerOptionIndex)"
      />
    </div>
    <button class="delete-button" @click="$emit('delete')">Delete</button>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import EditableExtendedAnswer from "./EditableExtendedAnswer.vue";
import EditableAnswerOptionBlock from "./EditableAnswerOptionBlock.vue";

import {
  QuestionType,
  convertStringToQuestionType,
  getAllQuestionTypes,
  QuestionTypeCount,
} from "@/models/test/base";
import type {
  QuestionToEdit,
  QuestionWithExtendedAnswerToEdit,
  QuestionWithAnswerOptionsToEdit,
} from "@/models/test/to-edit";

class QuestionTypeForSelect {
  value: QuestionType;
  label: string;

  constructor(value: QuestionType, label: string) {
    this.value = value;
    this.label = label;
  }
}

export default defineComponent({
  components: {
    EditableExtendedAnswer,
    EditableAnswerOptionBlock,
  },

  props: {
    question: {
      type: Object as PropType<QuestionToEdit>,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    worth: {
      type: Number,
      required: true,
    },
  },

  emits: {
    "update:content"(value: string) {
      return typeof value === "string";
    },
    "update:worth"(value: string) {
      return typeof value === "string";
    },
    "change-type"(type: QuestionType) {
      return typeof type === "string";
    },
    delete() {
      return true;
    },
  },

  computed: {
    correctAnswer(): string | string[] {
      switch (this.question.type) {
        case QuestionType.EXTENDED:
          return (this.question as QuestionWithExtendedAnswerToEdit)
            .correctAnswer;
        case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION: {
          const answerOption = (
            this.question as QuestionWithAnswerOptionsToEdit
          ).answerOptions.find((answerOption) => answerOption.isCorrect);
          if (answerOption !== undefined) {
            const index = (
              this.question as QuestionWithAnswerOptionsToEdit
            ).answerOptions.indexOf(answerOption);
            return `${index + 1}. ${answerOption.content}`;
          } else {
            return "";
          }
        }
        case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
          const correctAnswers = (
            this.question as QuestionWithAnswerOptionsToEdit
          ).answerOptions
            .filter((answerOption) => answerOption.isCorrect)
            .map((answerOption) => {
              const index = (
                this.question as QuestionWithAnswerOptionsToEdit
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

    allQuestionTypes() {
      return getAllQuestionTypes();
    },

    allQuestionTypesForSelect() {
      const questionTypes = [
        new QuestionTypeForSelect(QuestionType.EXTENDED, "Detailed answer"),
        new QuestionTypeForSelect(
          QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
          "One of the list"
        ),
        new QuestionTypeForSelect(
          QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
          "A few from the list"
        ),
      ];

      if (questionTypes.length !== QuestionTypeCount) {
        throw new Error(
          `Number of question types ${QuestionTypeCount}, not ${questionTypes.length}.`
        );
      }

      return questionTypes;
    },
  },

  methods: {
    convertStringToQuestionType,
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

  > .content,
  .worth,
  .type,
  .answer {
    display: flex;
    flex-direction: column;

    > label {
      color: #070f11;
    }
  }

  .type > select {
    background-color: #1e434c;
    color: white;
    padding: 5px;

    > option {
      background-color: #1e434c;
    }
  }

  & label {
    font-size: 1.1rem;
  }

  & input {
    font-size: 1.1rem;
  }
}
</style>
