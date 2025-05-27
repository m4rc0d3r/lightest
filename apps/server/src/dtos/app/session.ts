type Session = {
  id: number;
  userId: number;
  refreshToken: string;
  expires: string;
};

type FieldName = keyof Session;

export type { FieldName, Session };
