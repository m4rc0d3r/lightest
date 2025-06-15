import {
  ClientApp,
  File as FileModule,
  Http,
  ImpossibleError,
  UnexpectedError,
} from "@lightest/core";
import { apply, either, function as function_, taskEither } from "fp-ts";

import type { Repository } from "../ports";

import type { Create, Get } from "./ios";

import { NotFoundError } from "~/app";
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

  create({ avatar, password, ...rest }: Create.In): ReturnType<Repository["create"]> {
    return function_.pipe(
      apply.sequenceS(taskEither.ApplyPar)({
        avatar: function_.pipe(
          avatar,
          taskEither.fromPredicate(
            (avatar): avatar is string => typeof avatar === "string",
            (avatar) => avatar,
          ),
          taskEither.orElse((avatar) =>
            avatar instanceof File
              ? this.blobService.upload(avatar)
              : taskEither.left(
                  new UnexpectedError(
                    new ImpossibleError("Avatar must be an instance of the file."),
                  ),
                ),
          ),
        ),
        passwordHash: this.passwordHashingService.hash(password),
        verificationCode: this.cryptoService.generateUid(
          FileModule.Base64.getNumberOfBytesToStore(this.emailVerificationCodeLength),
        ),
      }),
      taskEither.flatMap(({ avatar, passwordHash, verificationCode }) =>
        function_.pipe(
          this.userRepository.create({
            avatar,
            passwordHash,
            verificationCode,
            ...rest,
          }),
          taskEither.tap(({ email }) => {
            const clientAppUrl = Http.createUrl(this.clientApp);
            return function_.pipe(
              this.emailTemplateService.emailVerification({
                appName: this.appName,
                clientAppUrl,
                linkToConfirmEmailAddress: ClientApp.getRouterPathToVerifyEmail(
                  clientAppUrl,
                  verificationCode,
                ),
              }),
              taskEither.tap((html) =>
                this.mailService2.send({
                  to: email,
                  subject: `Welcome to ${this.appName}, please confirm your email address`,
                  html,
                }),
              ),
            );
          }),
        ),
      ),
    );
  }

  get({ password, ...params }: Get.In): ReturnType<Repository["get"]> {
    return function_.pipe(
      this.userRepository.get(params),
      taskEither.flatMap((user) =>
        function_.pipe(
          user,
          ({ passwordHash }) => this.passwordHashingService.compare(password, passwordHash),
          taskEither.flatMap((arePasswordsEqual) =>
            function_.pipe(
              arePasswordsEqual,
              either.fromPredicate(
                () => arePasswordsEqual,
                () => new NotFoundError(),
              ),
              either.map(() => user),
              taskEither.fromEither,
            ),
          ),
        ),
      ),
    );
  }
}

export { Service };
