import type { SQLiteQuestion } from "./question.js";

type SQLiteAnswerOption = {
  id: number;
  question_id: SQLiteQuestion["id"];
  content: string;
  is_correct: boolean;
};

export type { SQLiteAnswerOption };
