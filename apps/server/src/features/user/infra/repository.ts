import { ImpossibleError } from "@lightest/core";
import { function as function_, taskEither } from "fp-ts";

import { Repository } from "../app";

import { UniqueKeyViolationError } from "~/app";
import type { Dependencies } from "~/infra";
import {
  CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT,
  isUniqueKeyViolation,
  TABLE,
} from "~/infra/drizzle";

const MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT =
  "The array of rows returned from the database must contain 1 element since no errors occurred during the insert.";

class DrizzleRepository extends Repository.Repository {
  constructor(private readonly db: Dependencies["db"]) {
    super();
  }

  override create(
    params: Repository.Create.In,
  ): taskEither.TaskEither<UniqueKeyViolationError, Repository.Create.Out> {
    return function_.pipe(
      taskEither.tryCatch(
        () => this.db.insert(TABLE.users).values(params).returning(),
        (reason) => {
          if (isUniqueKeyViolation(reason)) {
            const constraintName = CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT[reason.constraint];
            if (!constraintName) throw reason;

            return new UniqueKeyViolationError(constraintName);
          }
          throw reason;
        },
      ),
      taskEither.map(([user]) => user),
      taskEither.flatMap(
        taskEither.fromPredicate(
          (user) => !!user,
          () => {
            throw new ImpossibleError(MESSAGE_ABOUT_INCORRECT_INSERTION_RESULT);
          },
        ),
      ),
    );
  }
}

export { DrizzleRepository };
