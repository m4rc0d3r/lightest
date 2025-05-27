import type { User } from "../dtos/app/user";

type AuthData = Pick<User, "email" | "password">;

export type { AuthData };
