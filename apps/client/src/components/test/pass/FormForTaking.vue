<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { useForm } from "vee-validate";

import type { MultipleChoiceQuestion, Test } from "./schemas";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE, zTest } from "./schemas";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormFieldArray,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const props = withDefaults(
  defineProps<{
    submitButtonText: string;
    resetButtonText?: string | undefined;
    test: Test;
  }>(),
  {
    resetButtonText: "Reset",
  },
);

const emit =
  defineEmits<
    (e: "submit", ...args: Parameters<Parameters<typeof form.handleSubmit>[0]>) => void
  >();

const formSchema = toTypedSchema(
  zTest.pick({
    questions: true,
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: props.test,
});

const handleSubmit = form.handleSubmit((...args) => {
  emit("submit", ...args);
}, console.log);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h2 class="text-3xl font-bold">{{ test.name }}</h2>
      <p class="text-lg">
        Number of questions:
        <span class="font-bold">{{ test.questions.length }}</span>
      </p>
    </div>
    <form class="flex flex-col gap-4 overflow-hidden" @submit="handleSubmit">
      <FormFieldArray name="questions" v-slot="{ fields }">
        <ul class="flex flex-col gap-4 overflow-auto">
          <li v-for="(field, questionIdx) in fields" :key="field.key">
            <Card>
              <CardHeader class="flex items-center justify-between">
                <CardTitle
                  >{{ questionIdx + 1 }}) {{ test.questions[questionIdx]?.text }}</CardTitle
                >
                <CardDescription class="flex items-center gap-4">
                  <span class="text-lg font-semibold">
                    Points: <span class="font-bold">{{ test.questions[questionIdx]?.points }}</span>
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent class="space-y-4">
                <FormField
                  v-if="form.values.questions?.[questionIdx]?.type === QUESTION_TYPE.SHORT_ANSWER"
                  v-slot="{ componentField }"
                  :name="`questions[${questionIdx}].answer`"
                >
                  <FormItem>
                    <FormLabel class="text-base">Enter the answer</FormLabel>
                    <FormControl>
                      <Input v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <template v-else>
                  <div class="flex justify-between">
                    <div class="flex items-center gap-2">
                      <p>
                        {{
                          (test.questions[questionIdx] as MultipleChoiceQuestion).options
                            .numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.ONE
                            ? "Select an option"
                            : "Select option(s)"
                        }}
                      </p>
                    </div>
                  </div>
                  <FormFieldArray
                    v-if="
                      form.values.questions?.[questionIdx]?.type ===
                        QUESTION_TYPE.MULTIPLE_CHOICE &&
                      form.values.questions[questionIdx].options.numberOfCorrect ===
                        MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL
                    "
                    :name="`questions[${questionIdx}].options.values`"
                    v-slot="{ fields }"
                  >
                    <ul class="flex flex-col gap-2">
                      <li
                        v-for="(field, answerOptionIdx) in fields"
                        :key="field.key"
                        class="flex items-center gap-2"
                      >
                        <FormField
                          v-slot="{ value, handleChange }"
                          type="checkbox"
                          :name="`questions[${questionIdx}].options.values[${answerOptionIdx}].isChosen`"
                        >
                          <FormItem class="flex">
                            <FormControl>
                              <Checkbox :model-value="value" @update:model-value="handleChange" />
                            </FormControl>
                            <FormLabel>
                              {{
                                (test.questions[questionIdx] as MultipleChoiceQuestion).options
                                  .values[answerOptionIdx]?.text
                              }}
                            </FormLabel>
                          </FormItem>
                        </FormField>
                      </li>
                    </ul>
                  </FormFieldArray>
                  <FormField
                    v-else
                    v-slot="{ componentField }"
                    type="radio"
                    :name="`questions[${questionIdx}].options.indexOfChosen`"
                  >
                    <FormItem class="space-y-3">
                      <FormControl>
                        <RadioGroup class="flex flex-col space-y-1" v-bind="componentField">
                          <FormItem
                            v-for="(_, answerOptionIdx) in (
                              form.values.questions?.[questionIdx] as MultipleChoiceQuestion
                            ).options.values"
                            :key="answerOptionIdx"
                            class="flex items-center space-y-0 gap-x-3"
                          >
                            <FormControl>
                              <RadioGroupItem :value="answerOptionIdx" />
                            </FormControl>
                            <FormLabel>
                              {{
                                (test.questions[questionIdx] as MultipleChoiceQuestion).options
                                  .values[answerOptionIdx]?.text
                              }}
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                </template>
              </CardContent>
            </Card>
          </li>
        </ul>
      </FormFieldArray>
      <div class="flex justify-between">
        <div class="flex items-center gap-2"></div>
        <div class="flex gap-2">
          <Button type="button" @click="form.resetForm()">{{ resetButtonText }}</Button>
          <Button type="submit">{{ submitButtonText }}</Button>
        </div>
      </div>
    </form>
  </div>
</template>
