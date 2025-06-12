import type { TestAccount, Transporter } from "nodemailer";
import nodemailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

import type { ApiIos } from "../app";
import { Api } from "../app";

import type { AsyncInit, Config } from "~/infra";

const ETHEREAL_SERVER_OPTIONS = {
  host: "smtp.ethereal.email",
  port: 587,
};

class NodemailerApi extends Api implements AsyncInit {
  private transporter: Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options> | null =
    null;
  private testAccount: TestAccount | null = null;
  private from = "";

  constructor(private readonly mailConfig: Config["mail"]) {
    super();
  }

  async asyncInit() {
    const options = await (async () => {
      const secure = false;
      if (this.mailConfig.useRealSending) {
        const { smtpHost, smtpPort, user, password } = this.mailConfig;
        return {
          host: smtpHost,
          port: smtpPort,
          secure,
          auth: {
            user,
            pass: password,
          },
        };
      } else {
        this.testAccount = await nodemailer.createTestAccount();
        return {
          ...ETHEREAL_SERVER_OPTIONS,
          secure,
          auth: {
            user: this.testAccount.user,
            pass: this.testAccount.pass,
          },
        };
      }
    })();

    this.transporter = nodemailer.createTransport(options);
    this.from = options.auth.user ?? "";
  }

  override async send({ from, to, subject, text, html }: ApiIos.Send.In): Promise<boolean> {
    if (!this.transporter)
      throw new Error(
        `This method should only be called after the ${NodemailerApi.name} has been initialized.`,
      );

    const sendingResult = await this.transporter.sendMail({
      from: from ?? this.from,
      to,
      subject,
      text,
      html,
    });
    console.log("Result of sending email:", sendingResult);

    return sendingResult.accepted.includes(to);
  }
}

export { NodemailerApi };
