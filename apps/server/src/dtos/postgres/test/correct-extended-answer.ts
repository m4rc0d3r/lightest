import type { PostgresQuestion } from "./question.js";

type PostgresExtendedAnswer = {
  id: number;
  question_id: PostgresQuestion["id"];
  content: string;
};

export type { PostgresExtendedAnswer };
