import type { Test } from "./schemas";
import { MULTIPLE_CHOICE_QUESTION_TYPE, QUESTION_TYPE } from "./schemas";

const INITIAL_VALUES: Test = {
  name: "",
  questions: [
    {
      type: QUESTION_TYPE.SHORT_ANSWER,
      text: "Question with detailed answer",
      points: 1,
      answer: "There is no correct answer",
    },
    {
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      text: "Question with one correct answer",
      points: 1,
      options: {
        numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.ONE,
        indexOfCorrect: 0,
        values: [
          {
            text: "Answer option 1",
          },
          {
            text: "Answer option 2",
          },
        ],
      },
    },
    {
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      text: "Question with multiple correct answers",
      points: 2,
      options: {
        numberOfCorrect: MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL,
        values: [
          {
            text: "Answer option 1",
            isCorrect: false,
          },
          {
            text: "Answer option 2",
            isCorrect: true,
          },
          {
            text: "Answer option 3",
            isCorrect: false,
          },
          {
            text: "Answer option 4",
            isCorrect: true,
          },
        ],
      },
    },
  ],
};

export { INITIAL_VALUES };
