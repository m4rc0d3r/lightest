import type { PostgresQuestion } from "../question.js";

import type { PostgresPassedTest } from "./test.js";

type PostgresPassedQuestion = {
  id: number;
  passed_test_id: PostgresPassedTest["id"];
  question_id: PostgresQuestion["id"];
};

export type { PostgresPassedQuestion };
