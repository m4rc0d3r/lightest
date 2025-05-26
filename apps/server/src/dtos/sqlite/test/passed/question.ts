import { SQLitePassedTest } from "./test.js";
import { SQLiteQuestion } from "../question.js";

export interface SQLitePassedQuestion {
  id: number;
  passed_test_id: SQLitePassedTest["id"];
  question_id: SQLiteQuestion["id"];
}
