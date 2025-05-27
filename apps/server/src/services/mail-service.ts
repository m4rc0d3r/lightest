import fs from "fs/promises";
import path from "path";

import dotenv from "dotenv";
import type { TestAccount, Transporter } from "nodemailer";
import nodeMailer from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";
import pug from "pug";

import type { User } from "../dtos/app/user";

dotenv.config();

const SMTP_HOST = process.env["SMTP_HOST"] ?? "undefined";
const SMTP_PORT = Number(process.env["SMTP_PORT"] ?? NaN);
const USE_FAKE_EMAIL_SENDING = process.env["USE_FAKE_EMAIL_SENDING"] ?? "undefined";
const CLIENT_URL = process.env["CLIENT_URL"] ?? "undefined";

const PATH_TO_FOLDER_WITH_LETTER_TEMPLATES = "src/mail-templates";
const FOLDER_NAME_WITH_ACTIVATION_LETTERS = "activation-letters";

if (
  SMTP_HOST === "undefined" ||
  isNaN(SMTP_PORT) ||
  USE_FAKE_EMAIL_SENDING === "undefined" ||
  CLIENT_URL === "undefined"
) {
  throw new Error(
    "'SMTP_HOST', 'SMTP_PORT', 'USE_FAKE_EMAIL_SENDING' and/or 'CLIENT_URL' not specified in the config file '.env'.",
  );
}

class MailService {
  private _testEmailAccount: TestAccount | null = null;
  private _transporter: Transporter<SMTPTransport.SentMessageInfo> | null = null;

  async init() {
    if (USE_FAKE_EMAIL_SENDING === "no") {
      this._testEmailAccount = await nodeMailer.createTestAccount();

      this._transporter = nodeMailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
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

    if (USE_FAKE_EMAIL_SENDING === "no") {
      await this._transporter?.sendMail({
        from: this._testEmailAccount?.user,
        to,
        subject: `Account activation on the ${CLIENT_URL}`,
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
