import { Bool, ClientApp, Http, Str, UnexpectedError } from "@lightest/core";
import { either, function as function_, taskEither } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create, Get } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
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

  async create({
    avatar,
    password,
    ...rest
  }: Create.In): Promise<
    either.Either<UnexpectedError | UniqueKeyViolationError, RepositoryIos.Common.Out>
  > {
    const eitherAvatar =
      avatar instanceof File ? await this.blobService.upload(avatar)() : either.right(avatar);
    if (either.isLeft(eitherAvatar)) return eitherAvatar;

    const generationResult = await this.cryptoService.generateUid(
      Str.getNumberOfBytesToStoreBase64(this.emailVerificationCodeLength),
    )();
    if (either.isLeft(generationResult)) return generationResult;

    const verificationCode = generationResult.right;
    const resultOfCreation = await this.userRepository.create({
      avatar: eitherAvatar.right,
      passwordHash: await this.passwordHashingService.hash(password)(),
      verificationCode,
      ...rest,
    })();

    if (either.isRight(resultOfCreation)) {
      const { email } = resultOfCreation.right;

      const clientAppUrl = Http.createUrl(this.clientApp);
      const renderingResult = await this.emailTemplateService.emailVerification({
        appName: this.appName,
        clientAppUrl,
        linkToConfirmEmailAddress: ClientApp.getRouterPathToVerifyEmail(
          clientAppUrl,
          verificationCode,
        ),
      })();
      if (either.isLeft(renderingResult))
        return either.left(new UnexpectedError(renderingResult.left));

      await this.mailService2.send({
        to: email,
        subject: `Welcome to ${this.appName}, please confirm your email address`,
        html: renderingResult.right,
      })();
    }

    return resultOfCreation;
  }

  get({
    password,
    ...params
  }: Get.In): taskEither.TaskEither<NotFoundError, RepositoryIos.Common.Out> {
    return function_.pipe(
      this.userRepository.get(params),
      taskEither.flatMap((user) =>
        function_.pipe(
          user,
          ({ passwordHash }) => this.passwordHashingService.compare(password, passwordHash),
          taskEither.fromTask,
          taskEither.flatMap((arePasswordsEqual) =>
            function_.pipe(
              arePasswordsEqual,
              either.fromPredicate(Bool.isTruthy, () => new NotFoundError()),
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
