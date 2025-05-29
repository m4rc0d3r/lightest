import type { PostgresExtendedAnswer } from "../correct-extended-answer.js";

import type { PostgresPassedQuestion } from "./question.js";

type PostgresPassedExtendedAnswer = {
  id: number;
  passed_question_id: PostgresPassedQuestion["id"];
  correct_answer_id: PostgresExtendedAnswer["id"];
  content: string;
};

export type { PostgresPassedExtendedAnswer };
