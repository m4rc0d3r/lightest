import type { PostgresUser } from "../../user";
import type { PostgresTest } from "../test.js";

type PostgresPassedTest = {
  id: number;
  test_id: PostgresTest["id"];
  passing_id: PostgresUser["id"];
};

export type { PostgresPassedTest };
