import type {
  QuestionWithExtendedAnswer,
  QuestionWithAnswerOptions,
  AnswerOption,
} from "../base";

export interface QuestionWithExtendedAnswerToPass
  extends QuestionWithExtendedAnswer {
  enteredAnswer: string;
}

export interface QuestionWithAnswerOptionsToPass
  extends QuestionWithAnswerOptions {
  answerOptions: AnswerOptionToPass[];
}

export interface AnswerOptionToPass extends AnswerOption {
  isChosen: boolean;
}
