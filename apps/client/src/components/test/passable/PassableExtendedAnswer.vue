<template>
  <input
    class="entered-answer"
    type="text"
    :value="enteredAnswer"
    @input="
      $emit('update:enteredAnswer', ($event.target as HTMLInputElement).value)
    "
  />
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: {
    enteredAnswer: {
      type: String,
      required: true,
    },
  },
  emits: {
    "update:enteredAnswer"(value: string) {
      return typeof value === "string";
    },
  },
});
</script>

<style lang="scss" scoped></style>
