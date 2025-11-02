<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE } from "@/components/test/pass";
import type { Test } from "@/components/test/passed";
import { FormOfPassedTest } from "@/components/test/passed";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import type {
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
} from "@/dtos/test/passed";
import { Report } from "@/http/dtos/report";
import { Notification, STATUS } from "@/models/notification";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";
import { useNotificationStore } from "@/stores/notification";

const route = useRoute();
const notificationStore = useNotificationStore();

const test = ref<Test | null>(null);

onMounted(() => {
  void loadTest();
});

async function loadTest() {
  const result = extractData(await TestService.getPassedTest(Number(route.params["id"])));
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
    }
  } else {
    notificationStore.add(new Notification(STATUS.FAILURE, result.message));
  }
}
</script>

<template>
  <div class="grow p-4">
    <FormOfPassedTest v-if="test" :test="test" class="h-full" />
  </div>
</template>
