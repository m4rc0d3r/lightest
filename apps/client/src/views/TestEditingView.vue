<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";
import { iife, isObject } from "@lightest/core";
import { ref } from "vue";

import { Spinner } from "@/components/ui/spinner";
import type { Test } from "@/components/test/create";
import {
  EditingForm,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
} from "@/components/test/create";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import type {
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
} from "@/dtos/test/to-edit";
import { injectDiContainer } from "@/features/di";

const router = useRouter();
const route = useRoute();
const testId = ref(Number(route.params["id"]));

const { tsRestClient } = injectDiContainer();
const { mutate: update, isPending: isUpdating } = tsRestClient.test.update.useMutation();
const {
  data: test,
  isError: isTestError,
  isPending: isTestPending,
} = tsRestClient.test.getTestToEdit.useQuery(
  ["test", "getTestToEdit", testId],
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
                  answer: (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
                }
              : {
                  type: QUESTION_TYPE.MULTIPLE_CHOICE,
                  options:
                    question.type === OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION
                      ? {
                          values: (question as QuestionWithAnswerOptionsToEdit).answerOptions.map(
                            ({ id, content }) => ({
                              id,
                              text: content,
                            }),
                          ),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
                          indexOfCorrect:
                            (question as QuestionWithAnswerOptionsToEdit).answerOptions.findIndex(
                              ({ isCorrect }) => isCorrect,
                            ) ?? -1,
                        }
                      : {
                          values: (question as QuestionWithAnswerOptionsToEdit).answerOptions.map(
                            ({ id, content, isCorrect }) => ({
                              id,
                              text: content,
                              isCorrect,
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

function handleUpdate(test: Parameters<typeof update>[0]["body"]) {
  update(
    {
      body: test,
    },
    {
      onSuccess: () => {
        toast.success("The test was updated successfully");
        void router.push("/my-tests");
      },
      onError: (error) => {
        toast.error("Failed to update test", {
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
  <div class="flex grow p-4">
    <Spinner v-if="isTestPending" class="m-auto h-1/2 w-auto" />
    <p v-else-if="isTestError" class="m-auto text-center text-4xl">Failed to load test</p>
    <EditingForm
      v-else
      :submitButton="{
        disabled: isUpdating,
        text: 'Save',
      }"
      :initial-values="test"
      class="grow"
      @submit="
        ({ id, name, questions }) => {
          handleUpdate({
            id,
            title: name,
            questions: questions.map((question) => {
              const { id, text, points } = question;
              return {
                id,
                ...(question.type === QUESTION_TYPE.SHORT_ANSWER
                  ? {
                      type: OLD_QUESTION_TYPE.EXTENDED,
                      correctAnswer: question.answer,
                    }
                  : question.options.numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.ONE
                    ? (() => {
                        const { indexOfCorrect } = question.options;
                        return {
                          type: OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION,
                          answerOptions: question.options.values.map(({ id, text }, index) => ({
                            id,
                            content: text,
                            isCorrect: index === indexOfCorrect,
                          })),
                        };
                      })()
                    : {
                        type: OLD_QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
                        answerOptions: question.options.values.map(({ id, text, isCorrect }) => ({
                          id,
                          content: text,
                          isCorrect,
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
