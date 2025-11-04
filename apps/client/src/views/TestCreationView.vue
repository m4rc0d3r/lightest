<script setup lang="ts">
import { useRouter } from "vue-router";
import { iife, isObject } from "@lightest/core";
import { toast } from "vue-sonner";

import {
  EditingForm,
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_TYPE,
} from "@/components/test/create";
import { QUESTION_TYPE as OLD_QUESTION_TYPE } from "@/dtos/test/base";
import { injectDiContainer } from "@/features/di";

const router = useRouter();

const { tsRestClient } = injectDiContainer();
const { mutate: create, isPending: isCreating } = tsRestClient.test.create.useMutation();

function handleCreate(test: Parameters<typeof create>[0]["body"]) {
  create(
    {
      body: test,
    },
    {
      onSuccess: () => {
        toast.success("The test was created successfully");
        void router.push("/my-tests");
      },
      onError: (error) => {
        toast.error("Failed to create test", {
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
  <div class="flex-grow p-4">
    <EditingForm
      :submitButton="{
        disabled: isCreating,
        text: 'Create',
      }"
      @submit="
        ({ id, name, questions }) => {
          handleCreate({
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
