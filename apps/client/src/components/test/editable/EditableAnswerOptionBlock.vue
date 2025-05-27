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
import type { PropType } from "vue";
import { defineComponent } from "vue";

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
}

.answer-options {
  display: flex;
  flex-direction: column;

  padding: 5px;
  border: 1px solid #1e434c;
  border-radius: 5px;

  > * {
    margin-bottom: 5px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}

.answer-options-wrapper > *:last-child {
  margin-bottom: 0;
}
</style>
