import type {
  Test,
  Question,
  QuestionWithExtendedAnswer,
  QuestionWithAnswerOptions,
  AnswerOption,
} from "./base";
import { QuestionType } from "./base";

export class TestToEdit implements Test<QuestionToEdit> {
  id: number;
  title: string;
  questions: QuestionToEdit[];

  constructor(
    title = "",
    questions = [] as QuestionToEdit[],
    id = -Date.now()
  ) {
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
    switch (type) {
      case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
      case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
        if (
          [
            QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
            QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
          ].includes(this.questions[questionIndex].type)
        ) {
          this.questions[questionIndex] = new QuestionWithAnswerOptionsToEdit(
            type,
            this.questions[questionIndex].content,
            this.questions[questionIndex].worth,
            this.getCopiedAnswersOptions(
              this.questions[questionIndex] as QuestionWithAnswerOptionsToEdit
            ),
            this.questions[questionIndex].id
          );
        } else {
          this.questions[questionIndex] = new QuestionWithAnswerOptionsToEdit(
            type,
            this.questions[questionIndex].content,
            this.questions[questionIndex].worth,
            [],
            this.questions[questionIndex].id
          );
        }
        break;
      case QuestionType.EXTENDED:
        this.questions[questionIndex] = new QuestionWithExtendedAnswerToEdit(
          this.questions[questionIndex].content,
          this.questions[questionIndex].worth,
          "",
          this.questions[questionIndex].id
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
        new AnswerOptionToEdit(
          answerOption.content,
          answerOption.isCorrect,
          answerOption.id
        )
    );

    if (
      question.type === QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS &&
      answerOptions.filter((answerOption) => answerOption.isCorrect).length > 1
    ) {
      for (const answerOption of answerOptions) {
        answerOption.isCorrect = false;
      }
    }

    return answerOptions;
  }
}

export class QuestionToEdit implements Question {
  id: number;
  type: QuestionType;
  content: string;
  worth: number;

  constructor(
    type = QuestionType.EXTENDED,
    content = "",
    worth = 0,
    id = -Date.now()
  ) {
    this.id = id;
    this.type = type;
    this.content = content;
    this.worth = worth;
  }
}

export class QuestionWithExtendedAnswerToEdit
  extends QuestionToEdit
  implements QuestionWithExtendedAnswer
{
  correctAnswer: string;

  constructor(content = "", worth = 0, correctAnswer = "", id = -Date.now()) {
    super(QuestionType.EXTENDED, content, worth, id);
    this.correctAnswer = correctAnswer;
  }
}

export class QuestionWithAnswerOptionsToEdit
  extends QuestionToEdit
  implements QuestionWithAnswerOptions<AnswerOptionToEdit>
{
  answerOptions: AnswerOptionToEdit[];

  constructor(
    type:
      | QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION
      | QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
    content = "",
    worth = 0,
    answerOptions = [] as AnswerOptionToEdit[],
    id = -Date.now()
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

export class AnswerOptionToEdit implements AnswerOption {
  id: number;
  content: string;
  isCorrect: boolean;

  constructor(content = "", isCorrect = false, id = -Date.now()) {
    this.id = id;
    this.content = content;
    this.isCorrect = isCorrect;
  }

  changeCorrectness(
    question: QuestionWithAnswerOptionsToEdit,
    checked: boolean
  ) {
    if (question.type === QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION) {
      for (const answerOption of question.answerOptions) {
        answerOption.isCorrect = false;
      }
    }
    this.isCorrect = checked;
  }
}
