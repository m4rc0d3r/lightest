import type {
  QuestionWithExtendedAnswer,
  QuestionWithAnswerOptions,
  AnswerOption,
} from "../base";

export interface QuestionWithExtendedAnswerToEdit
  extends QuestionWithExtendedAnswer {
  correctAnswer: string;
}

export interface QuestionWithAnswerOptionsToEdit
  extends Omit<QuestionWithAnswerOptions, "answerOptions"> {
  answerOptions: AnswerOptionToEdit[];
}

export interface AnswerOptionToEdit extends AnswerOption {
  isCorrect: boolean;
}
