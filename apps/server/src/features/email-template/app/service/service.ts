import { Debug } from "@lightest/core";

import type { TemplateEngine, TemplateEngineIos } from "../ports";

@Debug.ClassDisplayName.set("EmailTemplateService")
class Service {
  private readonly templateEngine: TemplateEngine;

  constructor(emailTemplateEngine: TemplateEngine) {
    this.templateEngine = emailTemplateEngine;
  }

  emailVerification(
    params: TemplateEngineIos.EmailVerification.In,
  ): ReturnType<TemplateEngine["emailVerification"]> {
    return this.templateEngine.emailVerification(params);
  }
}

export { Service };
