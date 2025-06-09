import type { OperationalErrorOptions } from "@lightest/core";
import { OperationalError } from "@lightest/core";

class NotFoundError extends OperationalError {
  constructor(options?: OperationalErrorOptions) {
    super(options);
    this.message = "Object not found.";
  }
}

export { NotFoundError };
