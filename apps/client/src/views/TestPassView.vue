<template>
  <main>
    <PassableTest />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import PassableTest from "@/components/test/passable/PassableTest.vue";

export default defineComponent({
  components: {
    PassableTest,
  },
});
</script>

<style lang="scss"></style>
