<script setup lang="ts">
import { useRouter } from "vue-router";

import {
  EditingForm,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
} from "@/components/test/create";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

const router = useRouter();
</script>

<template>
  <div class="flex-grow p-4">
    <EditingForm
      submitButtonText="Create"
      @submit="
        async ({ id, name, questions }) => {
          const result = extractData(
            await TestService.create({
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
