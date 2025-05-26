import { SQLiteQuestion } from "./question.js";

export interface SQLiteAnswerOption {
  id: number;
  question_id: SQLiteQuestion["id"];
  content: string;
  is_correct: boolean;
}
