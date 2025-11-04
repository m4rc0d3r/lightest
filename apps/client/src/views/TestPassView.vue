<script setup lang="ts">
import { iife, isObject } from "@lightest/core";
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import type { Test } from "@/components/test/pass";
import {
  FormForTaking,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
} from "@/components/test/pass";
import { Spinner } from "@/components/ui/spinner";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import type {
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
} from "@/dtos/test/to-pass";
import { injectDiContainer } from "@/features/di";

const router = useRouter();
const route = useRoute();
const testId = ref(Number(route.params["id"]));

const { tsRestClient } = injectDiContainer();
const { mutate: pass, isPending: isPassing } =
  tsRestClient.test.sendTestForVerification.useMutation();
const {
  data: test,
  isError: isTestError,
  isPending: isTestPending,
} = tsRestClient.test.getTestToPass.useQuery(
  ["test", "getTestToPass", testId],
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
                  answer: (question as unknown as QuestionWithExtendedAnswerToPass).enteredAnswer,
                }
              : {
                  type: QUESTION_TYPE.MULTIPLE_CHOICE,
                  options:
                    question.type === OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION
                      ? {
                          values: (
                            question as unknown as QuestionWithAnswerOptionsToPass
                          ).answerOptions.map(({ id, content }) => ({
                            id,
                            text: content,
                          })),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
                          indexOfChosen: -1,
                        }
                      : {
                          values: (
                            question as unknown as QuestionWithAnswerOptionsToPass
                          ).answerOptions.map(({ id, content, isChosen }) => ({
                            id,
                            text: content,
                            isChosen,
                          })),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL,
                        },
                }),
          };
        }) satisfies Test["questions"],
      };
    },
  },
);

function handlePass(test: Parameters<typeof pass>[0]["body"]) {
  pass(
    {
      body: test,
    },
    {
      onSuccess: ({ body: { payload } }) => {
        toast.success("The test was passed successfully");
        void router.push(`/passed-test/${payload}`);
      },
      onError: (error) => {
        toast.error("Failed to submit test for review", {
          description: iife(() => {
            const MESSAGE = "message";
            const { body } = error;

            if (isObject(body) && MESSAGE in body && typeof body[MESSAGE] === "string") {
              return body[MESSAGE];
            }

            return "Something went wrong";
          }),
        });
      },
    },
  );
}
</script>

<template>
  <div class="relative flex grow p-4">
    <Spinner v-if="isTestPending" class="m-auto h-1/2 w-auto" />
    <p v-else-if="isTestError" class="m-auto text-center text-4xl">Failed to load test</p>
    <FormForTaking
      v-else
      :submitButton="{
        disabled: isPassing,
        text: 'Finish',
      }"
      :test="test!"
      class="grow"
      @submit="
        async ({ questions }) => {
          if (!test) return;

          handlePass({
            id: test.id,
            title: test.name,
            questions: questions.map((question) => {
              const { id, text, points } = question;
              return {
                id,
                ...(question.type === QUESTION_TYPE.SHORT_ANSWER
                  ? {
                      type: OLD_QUESTION_TYPE.EXTENDED,
                      enteredAnswer: question.answer,
                    }
                  : question.options.numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.ONE
                    ? (() => {
                        const { indexOfChosen } = question.options;
                        return {
                          type: OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION,
                          answerOptions: question.options.values.map(({ id, text }, index) => ({
                            id,
                            content: text,
                            isChosen: index === indexOfChosen,
                          })),
                        };
                      })()
                    : {
                        type: OLD_QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
                        answerOptions: question.options.values.map(({ id, text, isChosen }) => ({
                          id,
                          content: text,
                          isChosen,
                        })),
                      }),
                content: text,
                worth: points,
              };
            }),
          });
        }
      "
    />
  </div>
</template>
