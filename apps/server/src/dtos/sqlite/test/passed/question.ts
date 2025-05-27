import type { SQLiteQuestion } from "../question.js";

import type { SQLitePassedTest } from "./test.js";

type SQLitePassedQuestion = {
  id: number;
  passed_test_id: SQLitePassedTest["id"];
  question_id: SQLiteQuestion["id"];
};

export type { SQLitePassedQuestion };
