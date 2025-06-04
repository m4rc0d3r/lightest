<script setup lang="ts">
import { RouterLink } from "vue-router";

import type { TestMode } from "./shared";
import { TEST_MODE } from "./shared";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { BriefPassedTest, BriefTest } from "@/dtos/test/brief";

type Props = {
  test: BriefTest | BriefPassedTest;
  testMode: TestMode;
};

defineProps<Props>();
</script>

<template>
  <Card class="gap-2">
    <CardHeader>
      <CardTitle class="text-2xl">{{ test.title }}</CardTitle>
    </CardHeader>
    <CardContent class="text-lg">
      <p>Number of questions: {{ test.numberOfQuestions }}</p>
      <p
        v-if="testMode === TEST_MODE.PASSED && typeof (test as BriefPassedTest).score === 'number'"
      >
        Grade: {{ (test as BriefPassedTest).score.toFixed(1) }} out of {{ test.grade }}
      </p>
      <p class="grade" v-else>Grade: {{ test.grade }}</p>
    </CardContent>
    <CardFooter class="justify-end">
      <Button as-child>
        <RouterLink
          class="open-test-page-button"
          v-if="testMode === TEST_MODE.EDITABLE"
          :to="`/edit-test/${test.id}`"
        >
          Edit
        </RouterLink>
        <RouterLink
          class="open-test-page-button"
          v-else-if="testMode === TEST_MODE.PASSABLE"
          :to="`/pass-test/${test.id}`"
        >
          Pass
        </RouterLink>
        <RouterLink
          class="open-test-page-button"
          v-else-if="testMode === TEST_MODE.PASSED"
          :to="`/passed-test/${test.id}`"
        >
          View result
        </RouterLink>
      </Button>
    </CardFooter>
  </Card>
</template>
