<template>
  <div class="questions-wrapper">
    <ol v-if="questions.length > 0" class="questions">
      <PassableQuestion
        v-for="question in questions"
        :key="question.id"
        :question="question"
      ></PassableQuestion>
    </ol>
  </div>
</template>

<script lang="ts">
import { defineComponent, type PropType } from "vue";

import PassableQuestion from "./PassableQuestion.vue";

import type { QuestionToPass } from "@/models/test/to-pass";

export default defineComponent({
  components: {
    PassableQuestion,
  },

  props: {
    questions: {
      type: Array as PropType<QuestionToPass[]>,
      required: true,
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
