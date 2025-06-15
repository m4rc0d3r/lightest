import type { Domain } from "@lightest/core";

type AuthTokenPayload = {
  userId: Domain.User.Schema["id"];
};

export type { AuthTokenPayload };
