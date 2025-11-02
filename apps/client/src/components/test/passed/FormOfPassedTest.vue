<script setup lang="ts">
import type { Test } from "./schemas";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE } from "./schemas";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

defineProps<{
  test: Test;
}>();

function getPointsForQuestion({ points, ...question }: Test["questions"][number]) {
  if (question.type === QUESTION_TYPE.SHORT_ANSWER)
    return question.answers.correct === question.answers.entered ? points : 0;

  const option = question.options;
  if (option.numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.ONE)
    return option.indexOfChosen === option.indexOfCorrect ? points : 0;
  if (option.numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL) {
    const chosen = option.values.filter(({ isChosen }) => isChosen);
    const correctCount = option.values.filter(({ isCorrect }) => isCorrect).length;
    let total = 0;
    for (const { isChosen, isCorrect } of chosen) {
      if (isCorrect !== isChosen) return 0;
      total += points / correctCount;
    }
    return total;
  }

  return 0;
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">{{ test.name }}</h2>
      <div>
        <p class="text-lg">
          Number of questions:
          <span class="font-bold">{{ test.questions.length }}</span>
        </p>
        <p class="text-lg">
          Points:
          <span class="font-bold">
            {{ test.questions.map(getPointsForQuestion).reduce((points, acc) => acc + points) }}/{{
              test.questions.map(({ points }) => points).reduce((points, acc) => acc + points)
            }}</span
          >
        </p>
      </div>
    </div>
    <ul class="flex flex-col gap-4 overflow-auto">
      <li v-for="(question, questionIdx) in test.questions" :key="question.id">
        <Card>
          <CardHeader class="flex items-center justify-between">
            <CardTitle> {{ questionIdx + 1 }}) {{ question.text }} </CardTitle>
            <CardDescription class="text-lg"
              >Points: {{ getPointsForQuestion(question) }}/{{ question.points }}</CardDescription
            >
          </CardHeader>
          <CardContent>
            <div v-if="question.type === QUESTION_TYPE.SHORT_ANSWER" class="flex flex-col gap-2">
              <span
                :class="
                  cn(
                    'rounded-md p-1',
                    question.answers.correct === question.answers.entered
                      ? 'bg-green-300'
                      : 'bg-red-300',
                  )
                "
              >
                {{ question.answers.entered }}
              </span>
              <span
                v-if="question.answers.correct !== question.answers.entered"
                class="rounded-md bg-green-300 p-1"
                >{{ question.answers.correct }}</span
              >
            </div>
            <template v-else>
              <div
                v-if="question.options.numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL"
              >
                <ul className="flex flex-col gap-2">
                  <li
                    v-for="option in question.options.values"
                    :key="option.id"
                    :class="
                      cn(
                        'flex items-center gap-2 rounded-md p-1',
                        option.isChosen && option.isCorrect && 'bg-green-600',
                        !option.isChosen && option.isCorrect && 'bg-green-300',
                        option.isChosen && !option.isCorrect && 'bg-red-300',
                      )
                    "
                  >
                    <Checkbox class="pointer-events-none" :default-value="option.isChosen" />
                    <Label>
                      {{ option.text }}
                    </Label>
                  </li>
                </ul>
              </div>
              <div v-else>
                <RadioGroup :default-value="question.options.indexOfChosen">
                  <div
                    v-for="(option, optionIdx) in question.options.values"
                    :key="option.id"
                    :class="
                      cn(
                        'flex items-center gap-2 rounded-md p-1',
                        optionIdx === question.options.indexOfChosen &&
                          optionIdx === question.options.indexOfCorrect &&
                          'bg-green-600',
                        optionIdx !== question.options.indexOfChosen &&
                          optionIdx === question.options.indexOfCorrect &&
                          'bg-green-300',
                        optionIdx === question.options.indexOfChosen &&
                          optionIdx !== question.options.indexOfCorrect &&
                          'bg-red-300',
                      )
                    "
                  >
                    <RadioGroupItem id="option-two" :value="optionIdx" />
                    <Label for="option-two">{{ option.text }}</Label>
                  </div>
                </RadioGroup>
              </div>
            </template>
          </CardContent>
        </Card>
      </li>
    </ul>
  </div>
</template>
