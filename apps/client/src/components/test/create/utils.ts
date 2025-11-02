import { generatePhantomId } from "../../../lib/utils";

import type {
  BasicQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionType,
  OneAnswerOption,
  QuestionType,
  SeveralAnswerOption,
  ShortAnswerQuestion,
} from "./schemas";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE } from "./schemas";

function questionTypeToString(value: QuestionType) {
  switch (value) {
    case QUESTION_TYPE.SHORT_ANSWER:
      return "Short answer question";
    case QUESTION_TYPE.MULTIPLE_CHOICE:
      return "Multiple choice question";
  }
}

function multipleChoiceQuestionTypeToString(value: MultipleChoiceQuestionType) {
  switch (value) {
    case MULTIPLE_CHOICE_QUESTION_TYPE.ONE:
      return "One correct option";
    case MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL:
      return "Several correct options";
  }
}

type CreateQuestionParams =
  | {
      type: Extract<QuestionType, typeof QUESTION_TYPE.SHORT_ANSWER>;
    }
  | {
      type: Extract<QuestionType, typeof QUESTION_TYPE.MULTIPLE_CHOICE>;
      numberOfCorrect: MultipleChoiceQuestionType;
    };
function createQuestion(params: CreateQuestionParams) {
  const basicQuestion: BasicQuestion = {
    id: generatePhantomId(),
    text: "",
    points: 1,
  };
  const { type } = params;
  switch (type) {
    case QUESTION_TYPE.SHORT_ANSWER:
      return {
        type,
        answer: "",
        ...basicQuestion,
      } satisfies ShortAnswerQuestion;
    case QUESTION_TYPE.MULTIPLE_CHOICE: {
      const { numberOfCorrect } = params;

      return {
        type,
        options:
          numberOfCorrect === MULTIPLE_CHOICE_QUESTION_TYPE.ONE
            ? {
                numberOfCorrect,
                indexOfCorrect: 0,
                values: [],
              }
            : {
                numberOfCorrect,
                values: [],
              },
        ...basicQuestion,
      } satisfies MultipleChoiceQuestion;
    }
  }
}

function createAnswerOption(type: MultipleChoiceQuestionType) {
  const basicAnswerOption: OneAnswerOption = {
    id: generatePhantomId(),
    text: "",
  };
  switch (type) {
    case MULTIPLE_CHOICE_QUESTION_TYPE.ONE:
      return basicAnswerOption;
    case MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL: {
      return {
        isCorrect: false,
        ...basicAnswerOption,
      } satisfies SeveralAnswerOption;
    }
  }
}

export {
  createAnswerOption,
  createQuestion,
  multipleChoiceQuestionTypeToString,
  questionTypeToString,
};
