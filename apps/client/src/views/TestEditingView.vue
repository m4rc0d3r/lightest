<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

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
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

const router = useRouter();
const route = useRoute();
const notificationStore = useNotificationStore();

const test = ref<Test | null>(null);

onMounted(() => {
  void loadTest();
});

async function loadTest() {
  const result = extractData(await TestService.getTestToEdit(Number(route.params["id"])));
  if (result instanceof Report) {
    notificationStore.add(new Notification(STATUS.SUCCESS, result.message));
    if (result.payload) {
      const { id, title, questions } = result.payload;
      test.value = {
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
    }
  } else {
    notificationStore.add(new Notification(STATUS.FAILURE, result.message));
  }
}
</script>

<template>
  <div class="flex-grow p-4">
    <EditingForm
      submitButtonText="Save"
      :initial-values="test"
      @submit="
        async ({ id, name, questions }) => {
          const result = extractData(
            await TestService.update({
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
            }),
          );

          if (result instanceof Report) {
            void router.push('/my-tests');
          }
        }
      "
    />
  </div>
</template>
