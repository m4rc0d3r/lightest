<template>
  <input
    class="extended-answer"
    type="text"
    :value="correctAnswer"
    @input="
      $emit('update:correctAnswer', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    correctAnswer: {
      type: String,
      required: true,
    },
  },
  emits: {
    "update:correctAnswer"(value: string) {
      return typeof value === "string";
    },
  },
});
</script>

<style lang="scss" scoped></style>
