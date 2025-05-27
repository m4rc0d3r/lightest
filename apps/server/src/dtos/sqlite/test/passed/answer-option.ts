import type { SQLiteAnswerOption } from "../answer-option";

import type { SQLitePassedQuestion } from "./question.js";

type SQLitePassedAnswerOption = {
  id: number;
  passed_question_id: SQLitePassedQuestion["id"];
  answer_option_id: SQLiteAnswerOption["id"];
  is_chosen: boolean;
};

export type { SQLitePassedAnswerOption };
