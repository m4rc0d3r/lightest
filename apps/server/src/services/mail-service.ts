import path from "path";

import type { TestAccount, Transporter } from "nodemailer";
import nodeMailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import pug from "pug";

import type { User } from "../dtos/app/user";

import type { Config } from "~/infra/config";
import type { ClientAppConfig } from "~/infra/config/client-app";
import type { MailConfig } from "~/infra/config/mail";
import type { AsyncInit } from "~/infra/dependencies";
import { createUrl } from "~/shared";

const PATH_TO_FOLDER_WITH_LETTER_TEMPLATES = "src/mail-templates";

class MailService implements AsyncInit {
  private testAccount: TestAccount | null = null;
  private transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;
  private readonly mailConfig: MailConfig;
  private readonly clientApp: ClientAppConfig;
  private from = "";

  constructor(config: Config) {
    this.mailConfig = config.mail;
    this.clientApp = config.clientApp;
  }

  async asyncInit() {
    const secure = false;
    if (this.mailConfig.useFakeSending) {
      this.testAccount = await nodeMailer.createTestAccount();
      this.from = this.testAccount.user;

      this.transporter = nodeMailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure,
        auth: {
          user: this.testAccount.user,
          pass: this.testAccount.pass,
        },
      });
    } else {
      if (this.mailConfig.user) {
        this.from = this.mailConfig.user;
      }

      this.transporter = nodeMailer.createTransport({
        host: this.mailConfig.smtpHost,
        port: this.mailConfig.smtpPort,
        secure,
        auth: {
          user: this.mailConfig.user,
          pass: this.mailConfig.password,
        },
      });
    }
  }

  async sendActivationMail(
    to: User["email"],
    activationLink: User["activationLink"],
  ): Promise<void> {
    if (!this.transporter) {
      console.error(
        "The mail transport was not initialized, so no attempt was made to send an email.",
      );
      return;
    }
    const pathToLetterTemplate = path.resolve(
      PATH_TO_FOLDER_WITH_LETTER_TEMPLATES,
      "activation-letter.pug",
    );
    const letterContent = pug.renderFile(pathToLetterTemplate, { pretty: true, activationLink });

    const { protocol, address, port } = this.clientApp;
    const info = await this.transporter.sendMail({
      from: this.from,
      to,
      subject: `Account activation on the ${createUrl(protocol, address, port)}`,
      html: letterContent,
    });

    console.log(
      `Account activation email sent. Preview link: ${nodeMailer.getTestMessageUrl(info)}`,
    );
  }
}

export { MailService };
