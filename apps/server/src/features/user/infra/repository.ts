import { Debug, ImpossibleError, UnexpectedError } from "@lightest/core";
import { eq } from "drizzle-orm";
import { array, function as function_, option, taskEither } from "fp-ts";

import type { RepositoryIos } from "../app";
import { Repository } from "../app";

import { NotFoundError, UniqueKeyViolationError } from "~/app";
import type { Di } from "~/infra";
import { CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT, isUniqueKeyViolation, TABLE } from "~/infra";

const MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT =
  "The array of rows returned from the database must contain 1 element since no errors occurred during the insert.";

@Debug.ClassDisplayName.set("DrizzleUserRepository")
class DrizzleRepository extends Repository {
  constructor(private readonly db: Di.Container["db"]) {
    super();
  }

  override create(
    params: RepositoryIos.Create.In,
  ): taskEither.TaskEither<
    UnexpectedError | ImpossibleError | UniqueKeyViolationError,
    RepositoryIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.insert(TABLE.users).values(params).returning(),
        (reason) => {
          if (isUniqueKeyViolation(reason)) {
            const constraintName = CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT[reason.constraint];
            if (!constraintName) return new UnexpectedError(reason);

            return new UniqueKeyViolationError(constraintName);
          }
          return new UnexpectedError(reason);
        },
      ),
      taskEither.map(([user]) => user),
      taskEither.flatMap(
        taskEither.fromPredicate(
          (user) => !!user,
          () => {
            return new ImpossibleError(MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT);
          },
        ),
      ),
    );
  }

  override get({
    email,
  }: RepositoryIos.Get.In): taskEither.TaskEither<
    UnexpectedError | NotFoundError,
    RepositoryIos.Common.Out
  > {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.select().from(TABLE.users).where(eq(TABLE.users.email, email)),
        (reason) => new UnexpectedError(reason),
      ),
      taskEither.chain((rows) =>
        function_.pipe(
          rows,
          array.head,
          option.map(taskEither.right),
          option.getOrElse(() => taskEither.left(new NotFoundError())),
        ),
      ),
    );
  }
}

export { DrizzleRepository };
