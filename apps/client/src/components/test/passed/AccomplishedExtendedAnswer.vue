<template>
  <div class="answer">
    <span
      class="entered"
      :class="
        correctAnswer === enteredAnswer
          ? 'entered-correctly'
          : 'entered-incorrectly'
      "
    >
      {{ enteredAnswer }}</span
    >
    <span v-if="correctAnswer !== enteredAnswer" class="correct"
      >Correct answer: {{ correctAnswer }}</span
    >
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    correctAnswer: {
      type: String,
      required: true,
    },
    enteredAnswer: {
      type: String,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.answer {
  display: flex;
  flex-direction: column;

  > * {
    margin-bottom: 5px;
  }

  > *:last-child {
    margin-bottom: 0;
  }
}
.entered-correctly {
  background-color: lightgreen;
}

.entered-incorrectly {
  background-color: lightcoral;
}

.correct {
  background-color: greenyellow;
}
</style>
