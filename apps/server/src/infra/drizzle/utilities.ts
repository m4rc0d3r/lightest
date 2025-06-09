import { USER_CONSTRAINT } from "@lightest/core";
import { DrizzleError } from "drizzle-orm";
import { DatabaseError } from "pg";

import { CONSTRAINT } from "./schema";

const ERROR_CODE = {
  uniqueKeyViolation: "23505",
} as const;

type UniqueKeyViolationError = DrizzleError & {
  cause: DatabaseError & {
    code: (typeof ERROR_CODE)["uniqueKeyViolation"];
    constraint: string;
  };
};

function isUniqueKeyViolation(error: unknown): error is UniqueKeyViolationError {
  return (
    error instanceof DrizzleError &&
    error.cause instanceof DatabaseError &&
    error.cause.code === ERROR_CODE.uniqueKeyViolation &&
    typeof error.cause.constraint === "string"
  );
}

const CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT: Record<string, string> = {
  [CONSTRAINT.userEmail]: USER_CONSTRAINT.UNIQUE_USER_EMAIL,
  [CONSTRAINT.userVerificationCode]: USER_CONSTRAINT.UNIQUE_USER_VERIFICATION_CODE,
} satisfies Record<
  (typeof CONSTRAINT)[keyof typeof CONSTRAINT],
  (typeof USER_CONSTRAINT)[keyof typeof USER_CONSTRAINT]
>;

export { CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT, isUniqueKeyViolation };
export type { UniqueKeyViolationError };

