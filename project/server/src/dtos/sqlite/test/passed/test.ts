import { SQLiteTest } from "../test.js";
import { SQLiteUser } from "../../user.js";

export interface SQLitePassedTest {
  id: number;
  test_id: SQLiteTest["id"];
  passing_id: SQLiteUser["id"];
}
