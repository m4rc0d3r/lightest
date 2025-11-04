<script setup lang="ts">
import { useRoute } from "vue-router";
import { ref } from "vue";

import { Spinner } from "@/components/ui/spinner";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE } from "@/components/test/pass";
import type { Test } from "@/components/test/passed";
import { FormOfPassedTest } from "@/components/test/passed";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import type {
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
} from "@/dtos/test/passed";
import { injectDiContainer } from "@/features/di";

const route = useRoute();
const testId = ref(Number(route.params["id"]));

const { tsRestClient } = injectDiContainer();
const {
  data: test,
  isError: isTestError,
  isPending: isTestPending,
} = tsRestClient.test.getTestResult.useQuery(
  ["test", "getTestResult", testId],
  () => ({
    params: {
      id: testId.value,
    },
  }),
  {
    retry: false,
    select({
      body: {
        payload: { id, title, questions },
      },
    }) {
      return {
        id,
        name: title,
        questions: questions.map((question) => {
          const { id, type, worth, content } = question;
          return {
            id,
            text: content,
            points: worth,
            ...(type === OLD_QUESTION_TYPE.EXTENDED
              ? {
                  type: QUESTION_TYPE.SHORT_ANSWER,
                  answers: {
                    correct: (question as PassedQuestionWithExtendedAnswer).correctAnswer,
                    entered: (question as PassedQuestionWithExtendedAnswer).enteredAnswer,
                  },
                }
              : {
                  type: QUESTION_TYPE.MULTIPLE_CHOICE,
                  options:
                    question.type === OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION
                      ? {
                          values: (question as PassedQuestionWithAnswerOptions).answerOptions.map(
                            ({ id, content }) => ({
                              id,
                              text: content,
                            }),
                          ),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
                          indexOfCorrect:
                            (question as PassedQuestionWithAnswerOptions).answerOptions.findIndex(
                              ({ isCorrect }) => isCorrect,
                            ) ?? -1,
                          indexOfChosen:
                            (question as PassedQuestionWithAnswerOptions).answerOptions.findIndex(
                              ({ isChosen }) => isChosen,
                            ) ?? -1,
                        }
                      : {
                          values: (question as PassedQuestionWithAnswerOptions).answerOptions.map(
                            ({ id, content, isCorrect, isChosen }) => ({
                              id,
                              text: content,
                              isCorrect,
                              isChosen,
                            }),
                          ),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL,
                        },
                }),
          };
        }) satisfies Test["questions"],
      };
    },
  },
);
</script>

<template>
  <div class="flex grow p-4">
    <Spinner v-if="isTestPending" class="m-auto h-1/2 w-auto" />
    <p v-else-if="isTestError" class="m-auto text-center text-4xl">Failed to load test</p>
    <FormOfPassedTest v-else :test="test!" class="grow" />
  </div>
</template>
