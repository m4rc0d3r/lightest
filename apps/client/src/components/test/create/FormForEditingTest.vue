<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod";
import { Plus, Trash } from "lucide-vue-next";
import type { AcceptableValue } from "reka-ui";
import { useForm } from "vee-validate";

import type { MultipleChoiceQuestion, MultipleChoiceQuestionType, Test } from "./schemas";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE, zTest } from "./schemas";
import {
  createAnswerOption,
  createQuestion,
  multipleChoiceQuestionTypeToString,
  questionTypeToString,
} from "./utils";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generatePhantomId } from "@/lib/utils";
import { watch } from "vue";

const props = withDefaults(
  defineProps<{
    submitButtonText: string;
    resetButtonText?: string | undefined;
    initialValues?:
      | NonNullable<Parameters<typeof useForm<Partial<Test>, Test>>[0]>["initialValues"]
      | undefined;
  }>(),
  {
    resetButtonText: "Reset",
  },
);

const emit = defineEmits<{
  (e: "submit", ...args: Parameters<Parameters<typeof form.handleSubmit>[0]>): void;
}>();

const formSchema = toTypedSchema(zTest);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    id: generatePhantomId(),
    name: "",
    questions: [],
    ...props.initialValues,
  },
});

watch(
  () => props.initialValues,
  (value, oldValue) => {
    if (!oldValue && value) {
      form.resetForm({ values: value });
    }
  },
);

function addQuestion() {
  form.setFieldValue("questions", [
    ...(form.values.questions ?? []),
    createQuestion({ type: QUESTION_TYPE.SHORT_ANSWER }),
  ]);
}

function addAnswerOption(questionIndex: number) {
  const question = form.values.questions?.[questionIndex];
  if (!(question && question.type === QUESTION_TYPE.MULTIPLE_CHOICE)) return;

  form.setFieldValue(`questions.${questionIndex}.options.values`, [
    ...question.options.values,
    createAnswerOption(question.options.numberOfCorrect),
  ]);
}

function deleteAnswerOption(questionIndex: number, answerOptionIndex: number) {
  const question = form.values.questions?.[questionIndex];
  if (!(question && question.type === QUESTION_TYPE.MULTIPLE_CHOICE)) return;

  form.setFieldValue(
    `questions.${questionIndex}.options.values`,
    question.options.values.toSpliced(answerOptionIndex, 1),
  );
}

function changeQuestionType(questionIndex: number, value: AcceptableValue) {
  if (!(value === QUESTION_TYPE.SHORT_ANSWER || value === QUESTION_TYPE.MULTIPLE_CHOICE)) return;

  const type = value;
  const question = form.values.questions?.[questionIndex];
  if (!question) return;

  const { text, points } = question;
  if (type === QUESTION_TYPE.SHORT_ANSWER) {
    form.setFieldValue(`questions.${questionIndex}`, {
      ...createQuestion({ type }),
      text,
      points,
    });
  } else {
    form.setFieldValue(`questions.${questionIndex}`, {
      ...createQuestion({ type, numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE }),
      text,
      points,
    });
  }
}

function changeMultipleChoiceQuestionType(questionIndex: number, value: AcceptableValue) {
  if (
    !(
      value === MULTIPLE_CHOICE_QUESTION_TYPE.ONE || value === MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL
    )
  )
    return;

  const type = value;
  const question = form.values.questions?.[questionIndex];
  if (!(question && question.type === QUESTION_TYPE.MULTIPLE_CHOICE)) return;

  if (question.options.numberOfCorrect === type) return;

  type OptionsType<T extends MultipleChoiceQuestionType> = Extract<
    MultipleChoiceQuestion["options"],
    { numberOfCorrect: T }
  >;

  if (type === MULTIPLE_CHOICE_QUESTION_TYPE.ONE) {
    const indexOfCorrect = question.options.values.findIndex(
      (value) => "isCorrect" in value && value.isCorrect,
    );
    form.setFieldValue(`questions.${questionIndex}.options`, {
      numberOfCorrect: type,
      indexOfCorrect: indexOfCorrect === -1 ? 0 : indexOfCorrect,
      values: question.options.values.map(({ id, text }) => ({ id, text })),
    } satisfies OptionsType<typeof type>);
  } else {
    form.setFieldValue(`questions.${questionIndex}.options`, {
      numberOfCorrect: type,
      values: question.options.values.map(({ id, text }, index) => ({
        id,
        text,
        isCorrect:
          "indexOfCorrect" in question.options && index === question.options.indexOfCorrect,
      })),
    } satisfies OptionsType<typeof type>);
  }
}

const handleSubmit = form.handleSubmit((...args) => {
  emit("submit", ...args);
});
</script>

<template>
  <form class="relative flex h-full flex-col space-y-4" @submit="handleSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>Test name</FormLabel>
        <FormControl>
          <Input v-bind="componentField" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <FormFieldArray name="questions" v-slot="{ fields, remove: removeQuestion }">
      <ul class="flex flex-col gap-4 overflow-auto">
        <li v-for="(field, questionIdx) in fields" :key="field.key">
          <Card>
            <CardHeader class="flex items-center justify-between">
              <CardTitle>Question {{ questionIdx + 1 }}</CardTitle>
              <CardDescription class="flex items-center gap-4">
                <FormField
                  v-slot="{
                    componentField: {
                      'onUpdate:modelValue': _onUpdateModelValue,
                      ...componentField
                    },
                  }"
                  :name="`questions[${questionIdx}].type`"
                >
                  <FormItem>
                    <Select
                      v-bind="componentField"
                      @update:modelValue="(value) => changeQuestionType(questionIdx, value)"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select question type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem
                            v-for="type in Object.values(QUESTION_TYPE)"
                            :key="type"
                            :value="type"
                          >
                            {{ questionTypeToString(type) }}
                          </SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" :name="`questions[${questionIdx}].points`">
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Enter points for question" v-bind="componentField" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                </FormField>
                <Button type="button" variant="destructive" @click="removeQuestion(questionIdx)">
                  <Trash />
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
              <FormField v-slot="{ componentField }" :name="`questions[${questionIdx}].text`">
                <FormItem>
                  <FormLabel>Question text</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <FormField
                v-if="form.values.questions?.[questionIdx]?.type === QUESTION_TYPE.SHORT_ANSWER"
                v-slot="{ componentField }"
                :name="`questions[${questionIdx}].answer`"
              >
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Input v-bind="componentField" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </FormField>
              <template v-else>
                <div class="flex justify-between">
                  <FormField
                    v-slot="{
                      componentField: {
                        'onUpdate:modelValue': _onUpdateModelValue,
                        ...componentField
                      },
                    }"
                    :name="`questions[${questionIdx}].options.numberOfCorrect`"
                  >
                    <FormItem>
                      <Select
                        v-bind="componentField"
                        @update:modelValue="
                          (value) => changeMultipleChoiceQuestionType(questionIdx, value)
                        "
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select the number of correct options" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem
                              v-for="type in Object.values(MULTIPLE_CHOICE_QUESTION_TYPE)"
                              :key="type"
                              :value="type"
                            >
                              {{ multipleChoiceQuestionTypeToString(type) }}
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  </FormField>
                  <div class="flex items-center gap-2">
                    <p>
                      Number of answer options:
                      <span class="font-bold"
                        >{{ form.values.questions?.[questionIdx]?.options.values.length ?? 0 }}
                      </span>
                    </p>
                    <Button type="button" variant="secondary" @click="addAnswerOption(questionIdx)">
                      <Plus />
                    </Button>
                  </div>
                </div>
                <FormFieldArray
                  v-if="
                    form.values.questions?.[questionIdx]?.type === QUESTION_TYPE.MULTIPLE_CHOICE &&
                    form.values.questions[questionIdx].options.numberOfCorrect ===
                      MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL
                  "
                  :name="`questions[${questionIdx}].options.values`"
                  v-slot="{ fields, remove }"
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
                        :name="`questions[${questionIdx}].options.values[${answerOptionIdx}].isCorrect`"
                      >
                        <FormItem>
                          <FormControl>
                            <Checkbox :model-value="value" @update:model-value="handleChange" />
                          </FormControl>
                        </FormItem>
                      </FormField>
                      <FormField
                        v-slot="{ componentField }"
                        :name="`questions[${questionIdx}].options.values[${answerOptionIdx}].text`"
                      >
                        <FormItem class="w-full">
                          <FormControl>
                            <Input
                              placeholder="Enter the text of the answer option"
                              v-bind="componentField"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      </FormField>
                      <Button type="button" variant="destructive" @click="remove(answerOptionIdx)">
                        <Trash />
                      </Button>
                    </li>
                  </ul>
                </FormFieldArray>
                <FormField
                  v-else
                  v-slot="{ componentField }"
                  type="radio"
                  :name="`questions[${questionIdx}].options.indexOfCorrect`"
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
                          <FormField
                            v-slot="{ componentField }"
                            :name="`questions[${questionIdx}].options.values[${answerOptionIdx}].text`"
                          >
                            <FormItem class="w-full">
                              <FormControl>
                                <Input
                                  placeholder="Enter the text of the answer option"
                                  v-bind="componentField"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          </FormField>
                          <Button
                            type="button"
                            variant="destructive"
                            @click="deleteAnswerOption(questionIdx, answerOptionIdx)"
                          >
                            <Trash />
                          </Button>
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
      <div class="flex items-center gap-2">
        <p>
          Number of questions:
          <span class="font-bold">{{ form.values.questions?.length ?? 0 }}</span>
        </p>
        <Button type="button" variant="secondary" @click="addQuestion">
          <Plus />
        </Button>
      </div>
      <div class="flex gap-2">
        <Button type="button" @click="form.resetForm()">{{ resetButtonText }}</Button>
        <Button type="submit">{{ submitButtonText }}</Button>
      </div>
    </div>
  </form>
</template>
