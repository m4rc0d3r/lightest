export interface SQLiteUser {
  id: number;
  email: string;
  password: string;
  activation_link: string;
  is_activated: boolean;
}

export type ColumnName = keyof SQLiteUser;
