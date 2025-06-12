import type { either } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import type { BlobService } from "~/features/blob";
import type { HashingService } from "~/features/hashing";

class Service {
  constructor(
    private readonly userRepository: Repository,
    private readonly passwordHashingService: HashingService,
    private readonly blobService: BlobService,
  ) {}

  async create({
    avatar,
    password,
    ...rest
  }: Create.In): Promise<either.Either<UniqueKeyViolationError, RepositoryIos.Create.Out>> {
    const avatarUrl = avatar instanceof File ? await this.blobService.upload(avatar) : avatar;
    return this.userRepository.create({
      avatar: avatarUrl,
      passwordHash: await this.passwordHashingService.hash(password),
      ...rest,
    })();
  }
}

export { Service };
