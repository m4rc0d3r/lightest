import { User } from "../dtos/app/user";

export type AuthData = Pick<User, "email" | "password">;
