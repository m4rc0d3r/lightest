type Test<T extends Question> = {
  id: number;
  title: string;
  questions: T[];

  addQuestion(question?: T): void;
  changeQuestionType(questionIndex: number, type: QuestionType): void;
  deleteQuestion(questionIndex: number): void;
  get maximumScore(): T["worth"];
};

type Question = {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;
};

type QuestionWithExtendedAnswer = {} & Question;

type QuestionWithAnswerOptions<T> = {
  answerOptions: T[];

  addAnswerOption(): void;
  deleteAnswerOption(answerOptionIndex: number): void;
} & Question;

type AnswerOption = {
  id: number;
  content: string;
};

const QUESTION_TYPE = {
  EXTENDED: "EXTENDED",
  WITH_ONE_CORRECT_ANSWER_OPTION: "WITH_ONE_CORRECT_ANSWER_OPTION",
  WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
} as const;
type QuestionType = (typeof QUESTION_TYPE)[keyof typeof QUESTION_TYPE];

const QuestionTypeCount = 3;

function convertStringToQuestionType(value: string) {
  switch (value) {
    case QUESTION_TYPE.EXTENDED:
      return QUESTION_TYPE.EXTENDED;
    case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION:
      return QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION;
    case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
      return QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS;
    default:
      throw new Error(
        `Invalid string '${value}' passed to function ${convertStringToQuestionType.name} to convert string to question type.`,
      );
  }
}

function getAllQuestionTypes() {
  return [
    QUESTION_TYPE.EXTENDED,
    QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION,
    QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
  ];
}

export { convertStringToQuestionType, getAllQuestionTypes, QUESTION_TYPE, QuestionTypeCount };
export type {
  AnswerOption,
  Question,
  QuestionType,
  QuestionWithAnswerOptions,
  QuestionWithExtendedAnswer,
  Test,
};
