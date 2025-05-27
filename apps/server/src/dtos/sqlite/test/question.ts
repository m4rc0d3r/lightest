import type { SQLiteQuestionType } from "./question-type.js";
import type { SQLiteTest } from "./test.js";

type SQLiteQuestion = {
  id: number;
  test_id: SQLiteTest["id"];
  type_id: SQLiteQuestionType["id"];
  content: string;
  worth: number;
};

export type { SQLiteQuestion };
