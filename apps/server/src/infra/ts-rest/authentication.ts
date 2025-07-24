import type { Domain } from "@lightest/core";
import type { Request } from "express";

const USER_KEY = Symbol("USER_KEY");

type User = Pick<Domain.User.Schema, "id">;

function attachUserToRequest(req: Request, user: User) {
  (req as unknown as { [USER_KEY]: User })[USER_KEY] = user;
}

function getUserFromRequest(req: Request) {
  const user = (req as unknown as { [USER_KEY]: User })[USER_KEY];

  if (!user) throw new Error();

  return user;
}

export { attachUserToRequest, getUserFromRequest };
