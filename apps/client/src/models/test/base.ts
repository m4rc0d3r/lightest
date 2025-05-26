export interface Test<T extends Question> {
  id: number;
  title: string;
  questions: T[];

  addQuestion(question?: T): void;
  changeQuestionType(questionIndex: number, type: QuestionType): void;
  deleteQuestion(questionIndex: number): void;
  get maximumScore(): T["worth"];
}

export interface Question {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;
}

export interface QuestionWithExtendedAnswer extends Question {}

export interface QuestionWithAnswerOptions<T> extends Question {
  answerOptions: T[];

  addAnswerOption(): void;
  deleteAnswerOption(answerOptionIndex: number): void;
}

export interface AnswerOption {
  id: number;
  content: string;
}

export enum QuestionType {
  EXTENDED = "EXTENDED",
  WITH_ONE_CORRECT_ANSWER_OPTION = "WITH_ONE_CORRECT_ANSWER_OPTION",
  WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS = "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
}

export const QuestionTypeCount = 3;

export function convertStringToQuestionType(value: string) {
  switch (value) {
    case QuestionType.EXTENDED:
      return QuestionType.EXTENDED;
    case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
      return QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION;
    case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
      return QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS;
    default:
      throw new Error(
        `Invalid string '${value}' passed to function ${convertStringToQuestionType.name} to convert string to question type.`
      );
  }
}

export function getAllQuestionTypes() {
  return [
    QuestionType.EXTENDED,
    QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
    QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
  ];
}
