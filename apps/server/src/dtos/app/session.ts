export interface Session {
  id: number;
  userId: number;
  refreshToken: string;
  expires: string;
}

export type FieldName = keyof Session;
