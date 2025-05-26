import type {
  Test,
  Question,
  QuestionWithExtendedAnswer,
  QuestionWithAnswerOptions,
  AnswerOption,
} from "./base";
import { QuestionType } from "./base";

export class TestToPass implements Test<QuestionToPass> {
  id: number;
  title: string;
  questions: QuestionToPass[];

  constructor(
    title = "",
    questions = [] as QuestionToPass[],
    id = -Date.now()
  ) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }

  addQuestion(question?: QuestionToPass) {
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
}

export class QuestionToPass implements Question {
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

export class QuestionWithExtendedAnswerToPass
  extends QuestionToPass
  implements QuestionWithExtendedAnswer
{
  enteredAnswer: string;

  constructor(content = "", worth = 0, enteredAnswer = "", id = -Date.now()) {
    super(QuestionType.EXTENDED, content, worth, id);
    this.enteredAnswer = enteredAnswer;
  }
}

export class QuestionWithAnswerOptionsToPass
  extends QuestionToPass
  implements QuestionWithAnswerOptions<AnswerOptionToPass>
{
  answerOptions: AnswerOptionToPass[];

  constructor(
    type:
      | QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION
      | QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
    content = "",
    worth = 0,
    answerOptions = [] as AnswerOptionToPass[],
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
}

export class AnswerOptionToPass implements AnswerOption {
  id: number;
  content: string;
  isChosen: boolean;

  constructor(content = "", isChosen = false, id = -Date.now()) {
    this.id = id;
    this.content = content;
    this.isChosen = isChosen;
  }

  changeChoice(question: QuestionWithAnswerOptionsToPass, checked: boolean) {
    if (question.type === QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION) {
      for (const answerOption of question.answerOptions) {
        answerOption.isChosen = false;
      }
    }
    this.isChosen = checked;
  }
}
