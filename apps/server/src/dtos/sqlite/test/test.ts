import { SQLiteUser } from "../user.js";

export interface SQLiteTest {
  id: number;
  author_id: SQLiteUser["id"];
  title: string;
}
