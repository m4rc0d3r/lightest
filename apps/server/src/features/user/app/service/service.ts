import { Str } from "@lightest/core";
import type { either } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import type { BlobService } from "~/features/blob";
import type { CryptoService } from "~/features/crypto";
import type { HashingService } from "~/features/hashing";
import type { MailService } from "~/features/mail";
import type { Config } from "~/infra";

class Service {
  private readonly emailVerificationCodeLength: number;

  constructor(
    private readonly userRepository: Repository,
    private readonly passwordHashingService: HashingService,
    private readonly blobService: BlobService,
    private readonly mailService2: MailService,
    private readonly cryptoService: CryptoService,
    config: Config,
  ) {
    this.emailVerificationCodeLength = config.user.emailVerificationCodeLength;
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

    return resultOfCreation;
  }
}

export { Service };
