import type { SQLiteQuestion } from "./question.js";

type SQLiteExtendedAnswer = {
  id: number;
  question_id: SQLiteQuestion["id"];
  content: string;
};

export type { SQLiteExtendedAnswer };
