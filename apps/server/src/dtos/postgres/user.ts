type PostgresUser = {
  id: number;
  email: string;
  password: string;
  activation_link: string;
  is_activated: boolean;
};

type ColumnName = keyof PostgresUser;

export type { ColumnName, PostgresUser };
