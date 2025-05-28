import type {
  AnswerOption,
  Question,
  QuestionType,
  QuestionWithAnswerOptions,
  QuestionWithExtendedAnswer,
  Test,
} from "./base";
import { QUESTION_TYPE } from "./base";

class TestToEdit implements Test<QuestionToEdit> {
  id: number;
  title: string;
  questions: QuestionToEdit[];

  constructor(title = "", questions = [] as QuestionToEdit[], id = -Date.now()) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }

  addQuestion(question?: QuestionToEdit) {
    if (question) {
      this.questions.push(question);
    } else {
      this.questions.push(new QuestionWithExtendedAnswerToEdit());
    }
  }

  changeQuestionType(questionIndex: number, type: QuestionType) {
    const question = this.questions[questionIndex];
    if (!question) return;

    switch (type) {
      case QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION:
      case QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
        if (
          (
            [
              QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION,
              QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
            ] as string[]
          ).includes(this.questions[questionIndex]?.type ?? "")
        ) {
          this.questions[questionIndex] = new QuestionWithAnswerOptionsToEdit(
            type,
            question.content,
            question.worth,
            this.getCopiedAnswersOptions(question as QuestionWithAnswerOptionsToEdit),
            question.id,
          );
        } else {
          this.questions[questionIndex] = new QuestionWithAnswerOptionsToEdit(
            type,
            question.content,
            question.worth,
            [],
            question.id,
          );
        }
        break;
      case QUESTION_TYPE.EXTENDED:
        this.questions[questionIndex] = new QuestionWithExtendedAnswerToEdit(
          question.content,
          question.worth,
          "",
          question.id,
        );
        break;
    }
  }

  deleteQuestion(questionIndex: number) {
    this.questions.splice(questionIndex, 1);
  }

  get maximumScore() {
    return this.questions.reduce((prev, cur) => prev + cur.worth, 0);
  }

  private getCopiedAnswersOptions(question: QuestionWithAnswerOptionsToEdit) {
    const answerOptions = question.answerOptions.map(
      (answerOption) =>
        new AnswerOptionToEdit(answerOption.content, answerOption.isCorrect, answerOption.id),
    );

    if (
      question.type === QUESTION_TYPE.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS &&
      answerOptions.filter((answerOption) => answerOption.isCorrect).length > 1
    ) {
      for (const answerOption of answerOptions) {
        answerOption.isCorrect = false;
      }
    }

    return answerOptions;
  }
}

class QuestionToEdit implements Question {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;

  constructor(
    type = QUESTION_TYPE.EXTENDED as QuestionType,
    content = "",
    worth = 0,
    id = -Date.now(),
  ) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.worth = worth;
  }
}

class QuestionWithExtendedAnswerToEdit
  extends QuestionToEdit
  implements QuestionWithExtendedAnswer
{
  correctAnswer: string;

  constructor(content = "", worth = 0, correctAnswer = "", id = -Date.now()) {
    super(QUESTION_TYPE.EXTENDED, content, worth, id);
    this.correctAnswer = correctAnswer;
  }
}

class QuestionWithAnswerOptionsToEdit
  extends QuestionToEdit
  implements QuestionWithAnswerOptions<AnswerOptionToEdit>
{
  answerOptions: AnswerOptionToEdit[];

  constructor(
    type: Extract<
      QuestionType,
      "WITH_ONE_CORRECT_ANSWER_OPTION" | "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS"
    >,
    content = "",
    worth = 0,
    answerOptions = [] as AnswerOptionToEdit[],
    id = -Date.now(),
  ) {
    super(type, content, worth, id);
    this.answerOptions = answerOptions;
  }

  addAnswerOption() {
    this.answerOptions.push(new AnswerOptionToEdit());
  }

  deleteAnswerOption(answerOptionIndex: number) {
    this.answerOptions.splice(answerOptionIndex, 1);
  }
}

class AnswerOptionToEdit implements AnswerOption {
  id: number;
  content: string;
  isCorrect: boolean;

  constructor(content = "", isCorrect = false, id = -Date.now()) {
    this.id = id;
    this.content = content;
    this.isCorrect = isCorrect;
  }

  changeCorrectness(question: QuestionWithAnswerOptionsToEdit, checked: boolean) {
    if (question.type === QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION) {
      for (const answerOption of question.answerOptions) {
        answerOption.isCorrect = false;
      }
    }
    this.isCorrect = checked;
  }
}

export {
  AnswerOptionToEdit,
  QuestionToEdit,
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
  TestToEdit,
};
