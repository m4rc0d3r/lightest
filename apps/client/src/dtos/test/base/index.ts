export interface Test {
  id: number;
  title: string;
  questions: Question[];
}

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;
}

export enum QuestionType {
  EXTENDED = "EXTENDED",
  WITH_ONE_CORRECT_ANSWER_OPTION = "WITH_ONE_CORRECT_ANSWER_OPTION",
  WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS = "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
}

export interface QuestionWithExtendedAnswer extends Question {}

export interface QuestionWithAnswerOptions extends Question {
  answerOptions: AnswerOption[];
}

export interface AnswerOption {
  id: number;
  content: string;
}
