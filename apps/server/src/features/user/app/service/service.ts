import { ClientApp, Http, ImpossibleError, Str } from "@lightest/core";
import { either } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import type { BlobService } from "~/features/blob";
import type { CryptoService } from "~/features/crypto";
import type { EmailTemplateService } from "~/features/email-template";
import type { HashingService } from "~/features/hashing";
import type { MailService } from "~/features/mail";
import type { Config } from "~/infra";

class Service {
  private readonly emailVerificationCodeLength: number;
  private readonly appName: string;
  private readonly clientApp: Config["clientApp"];

  constructor(
    private readonly userRepository: Repository,
    private readonly passwordHashingService: HashingService,
    private readonly blobService: BlobService,
    private readonly mailService2: MailService,
    private readonly cryptoService: CryptoService,
    private readonly emailTemplateService: EmailTemplateService,
    config: Config,
  ) {
    this.emailVerificationCodeLength = config.user.emailVerificationCodeLength;
    this.appName = config.app.name;
    this.clientApp = config.clientApp;
  }

  async create({
    avatar,
    password,
    ...rest
  }: Create.In): Promise<either.Either<UniqueKeyViolationError, RepositoryIos.Create.Out>> {
    const resultOfCreation = await this.userRepository.create({
      avatar: avatar instanceof File ? await this.blobService.upload(avatar) : avatar,
      passwordHash: await this.passwordHashingService.hash(password),
      verificationCode: await this.cryptoService.generateUid(
        Str.getNumberOfBytesToStoreBase64(this.emailVerificationCodeLength),
      ),
      ...rest,
    })();

    if (either.isRight(resultOfCreation)) {
      const { email, verificationCode } = resultOfCreation.right;
      if (verificationCode === null)
        throw new ImpossibleError("verificationCode is null but must be a string.");

      const clientAppUrl = Http.createUrl(this.clientApp);
      await this.mailService2.send({
        to: email,
        subject: `Welcome to ${this.appName}, please confirm your email address`,
        html: await this.emailTemplateService.emailVerification({
          appName: this.appName,
          clientAppUrl,
          linkToConfirmEmailAddress: ClientApp.getRouterPathToVerifyEmail(
            clientAppUrl,
            verificationCode,
          ),
        }),
      });
    }

    return resultOfCreation;
  }
}

export { Service };
