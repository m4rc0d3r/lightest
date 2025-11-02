<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { toast } from "vue-sonner";

import type { Test } from "@/components/test/pass";
import {
  FormForTaking,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
} from "@/components/test/pass";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import type {
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
} from "@/dtos/test/to-pass";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

const router = useRouter();
const route = useRoute();

const test = ref<Test | null>(null);

onMounted(() => {
  void loadTest();
});

async function loadTest() {
  const result = extractData(await TestService.getTestToPass(Number(route.params["id"])));
  if (result instanceof Report) {
    toast.success(result.message);
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
                  answer: (question as QuestionWithExtendedAnswerToPass).enteredAnswer,
                }
              : {
                  type: QUESTION_TYPE.MULTIPLE_CHOICE,
                  options:
                    question.type === OLD_QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION
                      ? {
                          values: (question as QuestionWithAnswerOptionsToPass).answerOptions.map(
                            ({ id, content }) => ({
                              id,
                              text: content,
                            }),
                          ),
                          numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
                          indexOfChosen: -1,
                        }
                      : {
                          values: (question as QuestionWithAnswerOptionsToPass).answerOptions.map(
                            ({ id, content, isChosen }) => ({
                              id,
                              text: content,
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
    toast.error(result.message);
  }
}
</script>

<template>
  <div class="grow p-4">
    <FormForTaking
      v-if="test"
      submitButtonText="Finish"
      :test="test"
      class="h-full"
      @submit="
        async ({ questions }) => {
          if (!test) return;

          const result = extractData(
            await TestService.submitTestForReview({
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
            }),
          );

          if (result instanceof Report) {
            void router.push(`/passed-test/${result.payload}`);
          }
        }
      "
    />
  </div>
</template>
