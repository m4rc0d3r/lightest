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

const QUESTION_TYPE = {
  EXTENDED: "EXTENDED",
  WITH_ONE_CORRECT_ANSWER_OPTION: "WITH_ONE_CORRECT_ANSWER_OPTION",
  WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
} as const;
type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

type QuestionWithExtendedAnswer = {} & Question;

type QuestionWithAnswerOptions = {
  answerOptions: AnswerOption[];
} & Question;

type AnswerOption = {
  id: number;
  content: string;
};

export { QUESTION_TYPE };
export type {
  AnswerOption,
  Question,
  QuestionType,
  QuestionWithAnswerOptions,
  QuestionWithExtendedAnswer,
  Test,
};
