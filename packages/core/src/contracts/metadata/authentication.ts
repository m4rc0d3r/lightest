import type { AppRoute, AppRouter } from "@ts-rest/core";

import { TypeGuard } from "~/type-guard";

const AUTHENTICATION_REQUIRED_KEY = Symbol("AUTHENTICATION_REQUIRED_KEY");

function requiresAuthentication() {
  return {
    [AUTHENTICATION_REQUIRED_KEY]: true,
  };
}

function isAuthenticationRequired({ metadata }: AppRouter | AppRoute) {
  return (
    TypeGuard.isObject(metadata) &&
    (metadata as Record<symbol, unknown>)[AUTHENTICATION_REQUIRED_KEY]
  );
}

export { isAuthenticationRequired, requiresAuthentication };
