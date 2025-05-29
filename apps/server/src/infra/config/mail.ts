import { z } from "zod";

import { zBooleanishString } from "../zod";

const zMailConfig = z
  .object({
    MAIL_SMTP_HOST: z.string(),
    MAIL_SMTP_PORT: z.coerce.number().positive(),
    MAIL_USE_FAKE_EMAIL_SENDING: zBooleanishString,
  })
  .transform(({ MAIL_SMTP_HOST, MAIL_SMTP_PORT, MAIL_USE_FAKE_EMAIL_SENDING }) => ({
    smtpHost: MAIL_SMTP_HOST,
    smtpPort: MAIL_SMTP_PORT,
    useFakeEmailSending: MAIL_USE_FAKE_EMAIL_SENDING,
  }));
type MailConfig = z.infer<typeof zMailConfig>;

export { zMailConfig };
export type { MailConfig };
