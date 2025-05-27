import type {
  AnswerOption,
  Question,
  QuestionType,
  QuestionWithAnswerOptions,
  QuestionWithExtendedAnswer,
  Test,
} from "./base";
import { QUESTION_TYPE } from "./base";

class TestToPass implements Test<QuestionToPass> {
  id: number;
  title: string;
  questions: QuestionToPass[];

  constructor(title = "", questions = [] as QuestionToPass[], id = -Date.now()) {
    this.id = id;
    this.title = title;
    this.questions = questions;
  }

  addQuestion(_question?: QuestionToPass) {
    return;
  }

  changeQuestionType(_questionIndex: number, _type: QuestionType) {
    return;
  }

  deleteQuestion(_questionIndex: number) {
    return;
  }

  get maximumScore() {
    return this.questions.reduce((prev, cur) => prev + cur.worth, 0);
  }
}

class QuestionToPass implements Question {
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

class QuestionWithExtendedAnswerToPass
  extends QuestionToPass
  implements QuestionWithExtendedAnswer
{
  enteredAnswer: string;

  constructor(content = "", worth = 0, enteredAnswer = "", id = -Date.now()) {
    super(QUESTION_TYPE.EXTENDED, content, worth, id);
    this.enteredAnswer = enteredAnswer;
  }
}

class QuestionWithAnswerOptionsToPass
  extends QuestionToPass
  implements QuestionWithAnswerOptions<AnswerOptionToPass>
{
  answerOptions: AnswerOptionToPass[];

  constructor(
    type: Extract<
      QuestionType,
      "WITH_ONE_CORRECT_ANSWER_OPTION" | "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS"
    >,
    content = "",
    worth = 0,
    answerOptions = [] as AnswerOptionToPass[],
    id = -Date.now(),
  ) {
    super(type, content, worth, id);
    this.answerOptions = answerOptions;
  }

  addAnswerOption() {
    return;
  }

  deleteAnswerOption(_answerOptionIndex: number) {
    return;
  }
}

class AnswerOptionToPass implements AnswerOption {
  id: number;
  content: string;
  isChosen: boolean;

  constructor(content = "", isChosen = false, id = -Date.now()) {
    this.id = id;
    this.content = content;
    this.isChosen = isChosen;
  }

  changeChoice(question: QuestionWithAnswerOptionsToPass, checked: boolean) {
    if (question.type === QUESTION_TYPE.WITH_ONE_CORRECT_ANSWER_OPTION) {
      for (const answerOption of question.answerOptions) {
        answerOption.isChosen = false;
      }
    }
    this.isChosen = checked;
  }
}

export {
  AnswerOptionToPass,
  QuestionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
  TestToPass,
};
