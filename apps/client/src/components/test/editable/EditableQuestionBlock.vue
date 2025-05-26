<template>
  <div class="questions-wrapper">
    <div class="control-panel">
      <button class="add-question-button" @click="$emit('add-question')">
        Add a question
      </button>
    </div>
    <ol v-if="questions.length > 0" class="questions">
      <EditableQuestion
        v-for="(question, questionIndex) in questions"
        :key="question.id"
        :question="question"
        v-model:content="question.content"
        v-model:worth.number="question.worth"
        @change-type="
          (type) => $emit('change-question-type', questionIndex, type)
        "
        @delete="$emit('delete-question', questionIndex)"
      ></EditableQuestion>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import EditableQuestion from "./EditableQuestion.vue";

import type { QuestionType } from "@/models/test/base";
import type { QuestionToEdit } from "@/models/test/to-edit";

export default defineComponent({
  components: {
    EditableQuestion,
  },

  props: {
    questions: {
      type: Array as PropType<QuestionToEdit[]>,
      required: true,
    },
  },

  emits: {
    "add-question"() {
      return true;
    },
    "change-question-type"(questionIndex: number, type: QuestionType) {
      return typeof questionIndex === "number" && typeof type === "string";
    },
    "delete-question"(questionIndex: number) {
      return typeof questionIndex === "number";
    },
  },
});
</script>

<style lang="scss" scoped>
.questions-wrapper {
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 15px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
.questions {
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 15px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
