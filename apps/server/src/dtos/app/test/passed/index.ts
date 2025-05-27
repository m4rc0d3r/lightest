import type { QuestionWithAnswerOptions } from "../base";
import type { AnswerOptionToEdit, QuestionWithExtendedAnswerToEdit } from "../to-edit";

type PassedQuestionWithExtendedAnswer = {
  enteredAnswer: string;
} & QuestionWithExtendedAnswerToEdit;

type PassedQuestionWithAnswerOptions = {
  answerOptions: PassedAnswerOption[];
} & QuestionWithAnswerOptions;

type PassedAnswerOption = {
  isChosen: boolean;
} & AnswerOptionToEdit;

export type {
  PassedAnswerOption,
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
};
