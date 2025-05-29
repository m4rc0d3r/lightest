type PostgresSession = {
  id: number;
  user_id: number;
  refresh_token: string;
  expires: string;
};

type ColumnName = keyof PostgresSession;

export type { ColumnName, PostgresSession };
