type User = {
  id: number;
  email: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
};

type FieldName = keyof User;

export type { FieldName, User };
