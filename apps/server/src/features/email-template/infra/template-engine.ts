import path from "node:path";

import pug from "pug";

import type { TemplateEngineIos } from "../app";
import { TemplateEngine } from "../app";

const TEMPLATE_FILE_NAMES = {
  emailVerification: "email-verification.pug",
};

class PugTemplateEngine extends TemplateEngine {
  constructor() {
    super();
  }

  override emailVerification(params: TemplateEngineIos.EmailVerification.In): Promise<string> {
    return new Promise<string>((resolve, reject) =>
      pug.renderFile(
        getPathToTemplate(TEMPLATE_FILE_NAMES.emailVerification),
        params,
        (err, html) => (err === null ? resolve(html) : reject(err)),
      ),
    );
  }
}

const TEMPLATE_DIRECTORY = "templates";

function getPathToTemplate(templateFileName: string) {
  return path.join(
    path.resolve(process.cwd(), import.meta.dirname),
    TEMPLATE_DIRECTORY,
    templateFileName,
  );
}

export { PugTemplateEngine };
