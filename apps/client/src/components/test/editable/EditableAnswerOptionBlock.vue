<template>
  <div class="answer-options-wrapper">
    <div class="control-panel">
      <button @click="$emit('add-answer-option')">Add an answer option</button>
    </div>
    <ol v-if="question.answerOptions.length > 0" class="answer-options">
      <EditableAnswerOption
        v-for="(answerOption, answerOptionIndex) in question.answerOptions"
        :key="answerOption.id"
        :question="question"
        :answerOption="answerOption"
        v-model:content="answerOption.content"
        @delete="$emit('delete-answer-option', answerOptionIndex)"
      />
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import EditableAnswerOption from "./EditableAnswerOption.vue";

import type { QuestionWithAnswerOptionsToEdit } from "@/models/test/to-edit";

export default defineComponent({
  components: {
    EditableAnswerOption,
  },

  props: {
    question: {
      type: Object as PropType<QuestionWithAnswerOptionsToEdit>,
      required: true,
    },
  },

  emits: {
    "add-answer-option"() {
      return true;
    },
    "delete-answer-option"(answerOptionIndex: number) {
      return typeof answerOptionIndex === "number";
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
  > *:last-child {
    margin-bottom: 0;
  }
}

.answer-options {
  border: 1px solid #1e434c;
  border-radius: 5px;
  padding: 5px;
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
