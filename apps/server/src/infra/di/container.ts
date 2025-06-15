import type { drizzle } from "drizzle-orm/node-postgres";
import type { CookieOptions } from "express";

import type { Config } from "../config";

import type { BlobService, BlobStorageProvider } from "~/features/blob";
import type { CryptoService, GenerateUid } from "~/features/crypto";
import type { EmailTemplateEngine, EmailTemplateService } from "~/features/email-template";
import type { CompareHashWithDataFn, HashDataFn, HashingService } from "~/features/hashing";
import type { JwtPayloadToSign, JwtService } from "~/features/jwt";
import type { MailApi, MailService } from "~/features/mail";
import type { UserRepository, UserService } from "~/features/user";

type Logger = {
  log(message: string): void;
};

type Container<AuthTokenPayload extends JwtPayloadToSign = JwtPayloadToSign> = {
  config: Config;
  cookieOptions: CookieOptions;
  logger: Logger;
  db: ReturnType<typeof drizzle>;

  blobStorageProvider: BlobStorageProvider;
  blobService: BlobService;

  generateUid_: GenerateUid;
  cryptoService: CryptoService;

  hashData: HashDataFn;
  compareHashWithData: CompareHashWithDataFn;
  passwordHashingService: HashingService;

  emailTemplateEngine: EmailTemplateEngine;
  emailTemplateService: EmailTemplateService;

  mailApi: MailApi;
  mailService: MailService;

  userRepository: UserRepository;
  userService: UserService;

  authTokenService: JwtService<AuthTokenPayload>;
};

export type { Container };
