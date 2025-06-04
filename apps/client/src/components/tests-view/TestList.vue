<script setup lang="ts">
import type { TestMode } from "./shared";

import TestItem from "@/components/tests-view/TestItem.vue";
import type { BriefPassedTest, BriefTest } from "@/dtos/test/brief";

type Props = {
  tests: BriefTest[] | BriefPassedTest[];
  testMode: TestMode;
};

defineProps<Props>();
</script>

<template>
  <ul class="flex flex-col gap-3">
    <li v-for="test in tests" :key="test.id">
      <TestItem :test="test" :test-mode="testMode" />
    </li>
  </ul>
</template>
