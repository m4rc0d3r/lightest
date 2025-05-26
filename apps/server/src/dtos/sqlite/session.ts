export interface SQLiteSession {
  id: number;
  user_id: number;
  refresh_token: string;
  expires: string;
}

export type ColumnName = keyof SQLiteSession;
