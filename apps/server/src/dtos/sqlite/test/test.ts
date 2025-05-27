import type { SQLiteUser } from "../user.js";

type SQLiteTest = {
  id: number;
  author_id: SQLiteUser["id"];
  title: string;
};

export type { SQLiteTest };
