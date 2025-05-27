type SQLiteSession = {
  id: number;
  user_id: number;
  refresh_token: string;
  expires: string;
};

type ColumnName = keyof SQLiteSession;

export type { ColumnName, SQLiteSession };
