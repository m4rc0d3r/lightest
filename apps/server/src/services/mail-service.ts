import fs from "fs/promises";
import path from "path";

import { either as e } from "fp-ts";
import type { TestAccount, Transporter } from "nodemailer";
import nodeMailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import pug from "pug";

import type { User } from "../dtos/app/user";

import { createConfig } from "~/infra/config";
import { createUrl } from "~/shared";

const eitherConfig = createConfig(process.env);
if (e.isLeft(eitherConfig)) throw eitherConfig.left;
const config = eitherConfig.right;

const PATH_TO_FOLDER_WITH_LETTER_TEMPLATES = "src/mail-templates";
const FOLDER_NAME_WITH_ACTIVATION_LETTERS = "activation-letters";

class MailService {
  private _testEmailAccount: TestAccount | null = null;
  private _transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

  async init() {
    if (!config.mail.useFakeEmailSending) {
      this._testEmailAccount = await nodeMailer.createTestAccount();

      this._transporter = nodeMailer.createTransport({
        host: config.mail.smtpHost,
        port: config.mail.smtpPort,
        secure: false,
        auth: {
          user: this._testEmailAccount.user,
          pass: this._testEmailAccount.pass,
        },
      });
    } else {
      this._testEmailAccount = null;
      this._transporter = null;
    }
  }

  async sendActivationMail(
    to: User["email"],
    activationLink: User["activationLink"],
  ): Promise<void> {
    const pathToLetterTemplate = path.resolve(
      PATH_TO_FOLDER_WITH_LETTER_TEMPLATES,
      "activation-letter.pug",
    );
    const letterContent = pug.renderFile(pathToLetterTemplate, { pretty: true, activationLink });

    if (!config.mail.useFakeEmailSending) {
      const { protocol, address, port } = config.clientApp;
      await this._transporter?.sendMail({
        from: this._testEmailAccount?.user,
        to,
        subject: `Account activation on the ${createUrl(protocol, address, port)}`,
        html: letterContent,
      });
    } else {
      const pathToFolderWithActivationLetters = path.resolve(FOLDER_NAME_WITH_ACTIVATION_LETTERS);
      const pathToActivationLetter = path.resolve(
        pathToFolderWithActivationLetters,
        `${to.replace("@", "---")}.html`,
      );

      try {
        await fs.access(pathToFolderWithActivationLetters);
      } catch (e) {
        if ((e as Error).message.startsWith("ENOENT")) {
          await fs.mkdir(path.resolve(pathToFolderWithActivationLetters), { recursive: true });
        } else {
          throw e;
        }
      }

      await fs.writeFile(pathToActivationLetter, letterContent);
    }
  }
}

const mailService = new MailService();

export { mailService };
