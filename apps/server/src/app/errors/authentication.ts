import type { OperationalErrorOptions } from "@lightest/core";
import { OperationalError } from "@lightest/core";

class AuthenticationError extends OperationalError {
  constructor(options?: OperationalErrorOptions) {
    super(options);
    this.message = "You are not authenticated.";
  }
}

export { AuthenticationError };
