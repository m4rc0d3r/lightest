import { z } from "zod";

const zConstraint = z.enum(["UNIQUE_USER_EMAIL", "UNIQUE_USER_VERIFICATION_CODE"]);
const Constraint = zConstraint.Values;

export { Constraint };
