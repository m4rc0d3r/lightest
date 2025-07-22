import type { OperationalErrorOptions } from "./operational";
import { OperationalError } from "./operational";

class UnexpectedError extends OperationalError {
  constructor(
    cause: OperationalErrorOptions["cause"],
    message?: OperationalErrorOptions["message"],
  ) {
    super({
      message,
      cause,
    });

    if (!this.message) {
      this.message = "An unexpected error occurred";
    }
  }
}

export { UnexpectedError };
