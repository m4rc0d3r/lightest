import { SQLiteAnswerOption } from "../answer-option";
import { SQLitePassedQuestion } from "./question.js";

export interface SQLitePassedAnswerOption {
  id: number;
  passed_question_id: SQLitePassedQuestion["id"];
  answer_option_id: SQLiteAnswerOption["id"];
  is_chosen: boolean;
}
