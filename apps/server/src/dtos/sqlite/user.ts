type SQLiteUser = {
  id: number;
  email: string;
  password: string;
  activation_link: string;
  is_activated: boolean;
};

type ColumnName = keyof SQLiteUser;

export type { ColumnName, SQLiteUser };
