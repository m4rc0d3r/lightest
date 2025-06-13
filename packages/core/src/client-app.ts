import { SLASH } from "./string";

const VERIFY_EMAIL = "verify-email";

function getRouterPathToVerifyEmail(appUrl: string, verificationCode: string) {
  return [appUrl, VERIFY_EMAIL, verificationCode].join(SLASH);
}

export { getRouterPathToVerifyEmail };
