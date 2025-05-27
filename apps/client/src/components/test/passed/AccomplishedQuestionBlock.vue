<template>
  <div class="questions-wrapper">
    <ol v-if="questions.length > 0" class="questions">
      <AccomplishedQuestion
        v-for="question in questions"
        :key="question.id"
        :question="question"
      ></AccomplishedQuestion>
    </ol>
  </div>
</template>

<script lang="ts">
import type { PropType } from "vue";
import { defineComponent } from "vue";

import AccomplishedQuestion from "./AccomplishedQuestion.vue";

import type { PassedQuestion } from "@/models/test/passed";

export default defineComponent({
  components: {
    AccomplishedQuestion,
  },

  props: {
    questions: {
      type: Array as PropType<PassedQuestion[]>,
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

.questions-wrapper > *:last-child {
  margin-bottom: 0;
}
</style>
