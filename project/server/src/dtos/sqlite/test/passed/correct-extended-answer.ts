import { SQLitePassedQuestion } from "./question.js";
import { SQLiteExtendedAnswer } from "../correct-extended-answer.js";

export interface SQLitePassedExtendedAnswer {
  id: number;
  passed_question_id: SQLitePassedQuestion["id"];
  correct_answer_id: SQLiteExtendedAnswer["id"];
  content: string;
}
