import { ImpossibleError, Str, UnexpectedError } from "@lightest/core";
import { function as function_, taskEither } from "fp-ts";
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

  override send({
    from,
    to,
    subject,
    text,
    html,
  }: ApiIos.Send.In): taskEither.TaskEither<UnexpectedError | ImpossibleError, boolean> {
    const { transporter } = this;
    if (!transporter)
      return taskEither.left(
        new ImpossibleError(
          `This method should only be called after the ${NodemailerApi.name} has been initialized.`,
        ),
      );

    return function_.pipe(
      taskEither.tryCatch(
        () =>
          transporter.sendMail({
            from: from ?? this.from,
            to,
            subject,
            text,
            html,
          }),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.tapIO((sendingResult) => () => {
        const logMessage = [`Message with ID ${sendingResult.messageId} has been sent.`];
        if (!this.mailConfig.useRealSending) {
          logMessage.push(`Preview URL: ${nodemailer.getTestMessageUrl(sendingResult)}`);
        }

        console.log(logMessage.join(Str.SPACE));
      }),
      taskEither.map((sendingResult) => sendingResult.accepted.includes(to)),
    );
  }
}

export { NodemailerApi };
