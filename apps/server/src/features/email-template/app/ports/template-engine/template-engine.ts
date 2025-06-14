import type { UnexpectedError } from "@lightest/core";
import type { taskEither } from "fp-ts";

import type { EmailVerification } from "./ios";

abstract class TemplateEngine {
  abstract emailVerification(
    params: EmailVerification.In,
  ): taskEither.TaskEither<UnexpectedError, string>;
}

export { TemplateEngine };
