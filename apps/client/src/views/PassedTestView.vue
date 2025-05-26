<template>
  <main>
    <AccomplishedTest />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import AccomplishedTest from "@/components/test/passed/AccomplishedTest.vue";

export default defineComponent({
  components: {
    AccomplishedTest,
  },
});
</script>

<style lang="scss"></style>
