import type { SQLiteExtendedAnswer } from "../correct-extended-answer.js";

import type { SQLitePassedQuestion } from "./question.js";

type SQLitePassedExtendedAnswer = {
  id: number;
  passed_question_id: SQLitePassedQuestion["id"];
  correct_answer_id: SQLiteExtendedAnswer["id"];
  content: string;
};

export type { SQLitePassedExtendedAnswer };
