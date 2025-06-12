import { z } from "zod";

import { FALSE, TRUE } from "../zod";

const MAIL_CONFIG_DISCRIMINATOR_KEY = "MAIL_USE_REAL_SENDING";

const zMailConfig = z
  .discriminatedUnion(MAIL_CONFIG_DISCRIMINATOR_KEY, [
    z.object({
      [MAIL_CONFIG_DISCRIMINATOR_KEY]: z.literal(TRUE),
      MAIL_SMTP_HOST: z.string().nonempty(),
      MAIL_SMTP_PORT: z.coerce.number().positive(),
      MAIL_USER: z.string().nonempty(),
      MAIL_PASSWORD: z.string().nonempty(),
    }),
    z.object({
      [MAIL_CONFIG_DISCRIMINATOR_KEY]: z.literal(FALSE),
    }),
  ])
  .transform((value) => {
    if (value[MAIL_CONFIG_DISCRIMINATOR_KEY] === TRUE) {
      const { MAIL_SMTP_HOST, MAIL_SMTP_PORT, MAIL_USER, MAIL_PASSWORD } = value;
      return {
        useRealSending: true,
        smtpHost: MAIL_SMTP_HOST,
        smtpPort: MAIL_SMTP_PORT,
        user: MAIL_USER,
        password: MAIL_PASSWORD,
      };
    } else {
      return {
        useRealSending: false,
      };
    }
  });
type MailConfig = z.infer<typeof zMailConfig>;

export { zMailConfig };
export type { MailConfig };
