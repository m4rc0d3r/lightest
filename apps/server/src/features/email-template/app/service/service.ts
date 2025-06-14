import type { TemplateEngine, TemplateEngineIos } from "../ports";

class Service {
  constructor(private readonly templateEngine: TemplateEngine) {}

  emailVerification(
    params: TemplateEngineIos.EmailVerification.In,
  ): ReturnType<TemplateEngine["emailVerification"]> {
    return this.templateEngine.emailVerification(params);
  }
}

export { Service };
