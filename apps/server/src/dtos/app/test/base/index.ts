type Test = {
  id: number;
  title: string;
  questions: Question[];
};

type Question = {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;
};

enum QuestionType {
  EXTENDED = "EXTENDED",
  WITH_ONE_CORRECT_ANSWER_OPTION = "WITH_ONE_CORRECT_ANSWER_OPTION",
  WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS = "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
}

type QuestionWithExtendedAnswer = Question;

type QuestionWithAnswerOptions = {
  answerOptions: AnswerOption[];
} & Question;

type AnswerOption = {
  id: number;
  content: string;
};

export { QuestionType };
export type { AnswerOption, Question, QuestionWithAnswerOptions, QuestionWithExtendedAnswer, Test };
