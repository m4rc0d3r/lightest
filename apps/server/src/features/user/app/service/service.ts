import type { either } from "fp-ts";

import type { Service as HashingService } from "../../../hashing";
import type { Repository } from "../ports";

import type { Create } from "./ios";

import type { UniqueKeyViolationError } from "~/app";

class Service {
  constructor(
    private readonly userRepository: Repository.Repository,
    private readonly passwordHashingService: HashingService.Service,
  ) {}

  async create({
    password,
    ...rest
  }: Create.In): Promise<either.Either<UniqueKeyViolationError, Repository.Create.Out>> {
    return this.userRepository.create({
      passwordHash: await this.passwordHashingService.hash(password),
      ...rest,
    })();
  }
}

export { Service };
