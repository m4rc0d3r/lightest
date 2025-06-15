import { Domain } from "@lightest/core";
import { DatabaseError } from "pg";

import { CONSTRAINT } from "./schema";

const ERROR_CODE = {
  uniqueKeyViolation: "23505",
} as const;

type UniqueKeyViolationError = DatabaseError & {
  code: (typeof ERROR_CODE)["uniqueKeyViolation"];
  constraint: string;
};

function isUniqueKeyViolation(error: unknown): error is UniqueKeyViolationError {
  return (
    error instanceof DatabaseError &&
    error.code === ERROR_CODE.uniqueKeyViolation &&
    typeof error.constraint === "string"
  );
}

const CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT: Record<string, string> = {
  [CONSTRAINT.userEmail]: Domain.User.Constraint.UNIQUE_USER_EMAIL,
  [CONSTRAINT.userVerificationCode]: Domain.User.Constraint.UNIQUE_USER_VERIFICATION_CODE,
} satisfies Record<
  (typeof CONSTRAINT)[keyof typeof CONSTRAINT],
  (typeof Domain.User.Constraint)[keyof typeof Domain.User.Constraint]
>;

export { CONSTRAINT_NAMES_BY_DRIZZLE_CONSTRAINT, isUniqueKeyViolation };
export type { UniqueKeyViolationError };
