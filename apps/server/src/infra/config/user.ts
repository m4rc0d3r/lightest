import { z } from "zod";

const EMAIL_VERIFICATION_CODE_LENGTH = {
  minimum: 16,
  maximum: 24,
  multipleOf: 4,
};

const zUserConfig = z
  .object({
    USER_EMAIL_VERIFICATION_CODE_LENGTH: z.coerce
      .number()
      .positive()
      .min(EMAIL_VERIFICATION_CODE_LENGTH.minimum)
      .max(EMAIL_VERIFICATION_CODE_LENGTH.maximum)
      .multipleOf(EMAIL_VERIFICATION_CODE_LENGTH.multipleOf),
  })
  .transform(({ USER_EMAIL_VERIFICATION_CODE_LENGTH }) => ({
    emailVerificationCodeLength: USER_EMAIL_VERIFICATION_CODE_LENGTH,
  }));
type UserConfig = z.infer<typeof zUserConfig>;

export { EMAIL_VERIFICATION_CODE_LENGTH, zUserConfig };
export type { UserConfig };
