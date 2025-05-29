import type { PostgresAnswerOption } from "../answer-option";

import type { PostgresPassedQuestion } from "./question.js";

type PostgresPassedAnswerOption = {
  id: number;
  passed_question_id: PostgresPassedQuestion["id"];
  answer_option_id: PostgresAnswerOption["id"];
  is_chosen: boolean;
};

export type { PostgresPassedAnswerOption };
