<script setup lang="ts">
import {
  FormForEditingTest,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
  type Test,
} from "@/components/test/create";
import { useRouter } from "vue-router";

import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import { Report } from "@/http/dtos/report";
import { extractData } from "@/services/helpers";
import { TestService } from "@/services/test-service";

const router = useRouter();

let nextId = 0;

const INITIAL_VALUES: Test = {
  id: --nextId,
  name: "",
  questions: [
    {
      id: --nextId,
      type: QUESTION_TYPE.SHORT_ANSWER,
      text: "Question with detailed answer",
      points: 1,
      answer: "There is no correct answer",
    },
    {
      id: --nextId,
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      text: "Question with one correct answer",
      points: 1,
      options: {
        numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
        indexOfCorrect: 0,
        values: [
          {
            id: --nextId,
            text: "Answer option 1",
          },
          {
            id: --nextId,
            text: "Answer option 2",
          },
        ],
      },
    },
    {
      id: --nextId,
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      text: "Question with multiple correct answers",
      points: 2,
      options: {
        numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL,
        values: [
          {
            id: --nextId,
            text: "Answer option 1",
            isCorrect: false,
          },
          {
            id: --nextId,
            text: "Answer option 2",
            isCorrect: true,
          },
          {
            id: --nextId,
            text: "Answer option 3",
            isCorrect: false,
          },
          {
            id: --nextId,
            text: "Answer option 4",
            isCorrect: true,
          },
        ],
      },
    },
  ],
};
</script>

<template>
  <div class="flex-grow p-4">
    <FormForEditingTest
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
            void router.push('/');
          }
        }
      "
    />
  </div>
</template>
