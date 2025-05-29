import type { PostgresTest } from "./test.js";

import type { questionTypeEnum } from "~/infra/drizzle/schema.js";

type PostgresQuestion = {
  id: number;
  test_id: PostgresTest["id"];
  type: (typeof questionTypeEnum)["enumValues"][number];
  content: string;
  worth: number;
};

export type { PostgresQuestion };
