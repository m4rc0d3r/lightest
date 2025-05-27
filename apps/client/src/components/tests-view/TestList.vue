<template>
  <ol class="tests">
    <TestItem v-for="test in tests" :key="test.id" :test="test" :test-mode="testMode" />
  </ol>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

import TestItem from "@/components/tests-view/TestItem.vue";
import type { TestMode } from "@/components/tests-view/TestItem.vue";
import type { BriefTest, BriefPassedTest } from "@/dtos/test/brief";

export default defineComponent({
  components: {
    TestItem,
  },

  props: {
    tests: {
      type: Array as PropType<BriefTest[] | BriefPassedTest[]>,
      required: true,
    },
    testMode: {
      type: String as PropType<TestMode>,
      required: true,
    },
  },
});
</script>

<style lang="scss" scoped>
.tests {
  display: flex;
  flex-direction: column;
  // border: 2px solid black;
  padding: 10px 0;

  > * {
    margin-bottom: 10px;
  }
  > *:last-child {
    margin-bottom: 0;
  }
}
</style>
