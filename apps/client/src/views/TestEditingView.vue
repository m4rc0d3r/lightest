<template>
  <main>
    <EditableTest />
  </main>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import EditableTest from "@/components/test/editable/EditableTest.vue";

export default defineComponent({
  components: {
    EditableTest,
  },
});
</script>

<style lang="scss"></style>
