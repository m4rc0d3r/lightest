import type { PostgresQuestion } from "./question.js";

type PostgresAnswerOption = {
  id: number;
  question_id: PostgresQuestion["id"];
  content: string;
  is_correct: boolean;
};

export type { PostgresAnswerOption };
