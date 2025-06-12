import type { either } from "fp-ts";

import type { Repository, RepositoryIos } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";
import type { HashingService } from "~/features/hashing";

class Service {
  constructor(
    private readonly userRepository: Repository,
    private readonly passwordHashingService: HashingService,
  ) {}

  async create({
    password,
    ...rest
  }: Create.In): Promise<either.Either<UniqueKeyViolationError, RepositoryIos.Create.Out>> {
    return this.userRepository.create({
      passwordHash: await this.passwordHashingService.hash(password),
      ...rest,
    })();
  }
}

export { Service };
