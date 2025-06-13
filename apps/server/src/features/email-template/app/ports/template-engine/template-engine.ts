import type { EmailVerification } from "./ios";

abstract class TemplateEngine {
  abstract emailVerification(params: EmailVerification.In): Promise<string>;
}

export { TemplateEngine };
