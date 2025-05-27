import type { AnswerOption, QuestionWithAnswerOptions, QuestionWithExtendedAnswer } from "../base";

type QuestionWithExtendedAnswerToPass = {
  enteredAnswer: string;
} & QuestionWithExtendedAnswer;

type QuestionWithAnswerOptionsToPass = {
  answerOptions: AnswerOptionToPass[];
} & QuestionWithAnswerOptions;

type AnswerOptionToPass = {
  isChosen: boolean;
} & AnswerOption;

export type {
  AnswerOptionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
};
