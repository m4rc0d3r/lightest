import type { OperationalErrorOptions } from "@lightest/core";
import { OperationalError } from "@lightest/core";

class NotFoundError extends OperationalError {
  constructor(
    readonly url: string,
    options?: OperationalErrorOptions,
  ) {
    super(options);
    this.message = `BLOB at "${this.url}" not found.`;
  }
}

export { NotFoundError };
