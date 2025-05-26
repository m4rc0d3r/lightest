import type { QuestionWithAnswerOptions } from "../base";
import type {
  QuestionWithExtendedAnswerToEdit,
  AnswerOptionToEdit,
} from "../to-edit";

export interface PassedQuestionWithExtendedAnswer
  extends QuestionWithExtendedAnswerToEdit {
  enteredAnswer: string;
}

export interface PassedQuestionWithAnswerOptions
  extends QuestionWithAnswerOptions {
  answerOptions: PassedAnswerOption[];
}

export interface PassedAnswerOption extends AnswerOptionToEdit {
  isChosen: boolean;
}
