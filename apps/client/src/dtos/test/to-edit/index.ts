import type { AnswerOption, QuestionWithAnswerOptions, QuestionWithExtendedAnswer } from "../base";

type QuestionWithExtendedAnswerToEdit = {
  correctAnswer: string;
} & QuestionWithExtendedAnswer;

type QuestionWithAnswerOptionsToEdit = {
  answerOptions: AnswerOptionToEdit[];
} & Omit<QuestionWithAnswerOptions, "answerOptions">;

type AnswerOptionToEdit = {
  isCorrect: boolean;
} & AnswerOption;

export type {
  AnswerOptionToEdit,
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
};
