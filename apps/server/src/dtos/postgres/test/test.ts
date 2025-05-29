import type { PostgresUser } from "../user";

type PostgresTest = {
  id: number;
  author_id: PostgresUser["id"];
  title: string;
};

export type { PostgresTest };
