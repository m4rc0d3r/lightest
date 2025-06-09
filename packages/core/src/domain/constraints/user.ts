import z from "zod";

const zUserConstraint = z.enum(["UNIQUE_USER_EMAIL", "UNIQUE_USER_VERIFICATION_CODE"]);
const USER_CONSTRAINT = zUserConstraint.Values;

export { USER_CONSTRAINT };
