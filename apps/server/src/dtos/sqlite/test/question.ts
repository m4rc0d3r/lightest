import { SQLiteTest } from "./test.js";
import { SQLiteQuestionType } from "./question-type.js";

export interface SQLiteQuestion {
  id: number;
  test_id: SQLiteTest["id"];
  type_id: SQLiteQuestionType["id"];
  content: string;
  worth: number;
}
