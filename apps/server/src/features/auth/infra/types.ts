import type { User } from "@lightest/core";

type AuthTokenPayload = {
  userId: User["id"];
};

export type { AuthTokenPayload };
