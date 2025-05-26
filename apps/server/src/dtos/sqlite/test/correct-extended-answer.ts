import { SQLiteQuestion } from "./question.js";

export interface SQLiteExtendedAnswer {
  id: number;
  question_id: SQLiteQuestion["id"];
  content: string;
}
