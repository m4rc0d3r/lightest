import { Str } from "./str";

const VERIFY_EMAIL = "verify-email";

function getRouterPathToVerifyEmail(appUrl: string, verificationCode: string) {
  return [appUrl, VERIFY_EMAIL, verificationCode].join(Str.SLASH);
}

export { getRouterPathToVerifyEmail };
