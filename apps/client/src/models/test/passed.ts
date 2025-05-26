import type {
  Test,
  Question,
  QuestionWithExtendedAnswer,
  QuestionWithAnswerOptions,
  AnswerOption,
} from "./base";
import { QuestionType } from "./base";

export class PassedTest implements Test<PassedQuestion> {
  id: number;
  title: string;
  questions: PassedQuestion[];

  constructor(
    title = "",
    questions = [] as PassedQuestion[],
    id = -Date.now()
  ) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }

  addQuestion(question?: PassedQuestion) {
    return;
  }

  changeQuestionType(questionIndex: number, type: QuestionType) {
    return;
  }

  deleteQuestion(questionIndex: number) {
    return;
  }

  get maximumScore() {
    return this.questions.reduce((prev, cur) => prev + cur.worth, 0);
  }

  get receivedScore() {
    return this.questions.reduce(
      (prev, cur) =>
        prev + (cur as PassedQuestionWithExtendedAnswer).receivedScore,
      0
    );
  }
}

export class PassedQuestion implements Question {
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

  get receivedScore() {
    return 0;
  }
}

export class PassedQuestionWithExtendedAnswer
  extends PassedQuestion
  implements QuestionWithExtendedAnswer
{
  correctAnswer: string;
  enteredAnswer: string;

  constructor(
    content = "",
    worth = 0,
    correctAnswer = "",
    enteredAnswer = "",
    id = -Date.now()
  ) {
    super(QuestionType.EXTENDED, content, worth, id);
    this.correctAnswer = correctAnswer;
    this.enteredAnswer = enteredAnswer;
  }

  get receivedScore() {
    return (this as PassedQuestionWithExtendedAnswer).enteredAnswer ===
      (this as PassedQuestionWithExtendedAnswer).correctAnswer
      ? this.worth
      : 0;
  }
}

export class PassedQuestionWithAnswerOptions
  extends PassedQuestion
  implements QuestionWithAnswerOptions<PassedAnswerOption>
{
  answerOptions: PassedAnswerOption[];

  constructor(
    type:
      | QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION
      | QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
    content = "",
    worth = 0,
    answerOptions = [] as PassedAnswerOption[],
    id = -Date.now()
  ) {
    super(type, content, worth, id);
    this.answerOptions = answerOptions;
  }

  addAnswerOption() {
    return;
  }

  deleteAnswerOption(answerOptionIndex: number) {
    return;
  }

  get receivedScore() {
    switch (this.type) {
      case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION: {
        const answerOption = (
          this as PassedQuestionWithAnswerOptions
        ).answerOptions.find((answerOption) => answerOption.isChosen);
        if (answerOption !== undefined) {
          return answerOption.isChosen === answerOption.isCorrect
            ? this.worth
            : 0;
        } else {
          return 0;
        }
      }
      case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS: {
        return (this as PassedQuestionWithAnswerOptions).answerOptions
          .filter((answerOption) => answerOption.isCorrect)
          .reduce(
            (prev, cur, index, array) =>
              prev +
              (cur.isCorrect === cur.isChosen ? this.worth / array.length : 0),
            0
          );
      }
      default:
        return 0;
    }
  }
}

export class PassedAnswerOption implements AnswerOption {
  id: number;
  content: string;
  isCorrect: boolean;
  isChosen: boolean;

  constructor(
    content = "",
    isCorrect = false,
    isChosen = false,
    id = -Date.now()
  ) {
    this.id = id;
    this.content = content;
    this.isCorrect = isCorrect;
    this.isChosen = isChosen;
  }
}
