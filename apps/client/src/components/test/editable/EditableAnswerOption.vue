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
      :checked="answerOption.isCorrect"
      @change="(event) => answerOption.changeCorrectness.call(answerOption, question, (event.target as HTMLInputElement).checked)"
    />
    <div class="content">
      <label for="">Answer option</label>
      <input
        type="text"
        :value="answerOption.content"
        @input="
          $emit('update:content', ($event.target as HTMLInputElement).value)
        "
      />
    </div>
    <button @click="$emit('delete')">Delete</button>
  </li>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import { QuestionType } from "@/models/test/base";
import type {
  QuestionWithAnswerOptionsToEdit,
  AnswerOptionToEdit,
} from "@/models/test/to-edit";

export default defineComponent({
  props: {
    question: {
      type: Object as PropType<QuestionWithAnswerOptionsToEdit>,
      required: true,
    },
    answerOption: {
      type: Object as PropType<AnswerOptionToEdit>,
      required: true,
    },
  },
  emits: {
    "update:content"(value: string) {
      return typeof value === "string";
    },
    "change-correctness"(value: boolean) {
      return typeof value === "boolean";
    },
    delete() {
      return true;
    },
  },

  computed: {
    withOneCorrectAnswerOptionQuestionType() {
      return QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION;
    },
  },

  // methods: {
  //   changeCorrectness(event: Event, question: QuestionWithAnswerOptionsToEdit) {
  //     this.answerOption.changeCorrectness.call(
  //       this.answerOption,
  //       question,
  //       (event.target as HTMLInputElement).checked
  //     );
  //   },
  // },
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
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    > label {
      color: #070f11;
    }
  }
}
</style>
