import type { OperationalErrorOptions } from "@lightest/core";
import { OperationalError } from "@lightest/core";

class ExpirationError extends OperationalError {
  constructor(
    readonly expiredAt: Date,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = `Token expired on ${this.expiredAt.toString()}`;
  }
}

export { ExpirationError };
