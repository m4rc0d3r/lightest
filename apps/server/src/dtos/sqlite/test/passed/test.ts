import type { SQLiteUser } from "../../user.js";
import type { SQLiteTest } from "../test.js";

type SQLitePassedTest = {
  id: number;
  test_id: SQLiteTest["id"];
  passing_id: SQLiteUser["id"];
};

export type { SQLitePassedTest };
