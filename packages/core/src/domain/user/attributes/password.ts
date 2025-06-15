import { z } from "zod";

import { Zod } from "~/zod";

const CONSTRAINTS = {
  length: {
    minimum: 6,
    maximum: 32,
  },
};

const zSchema = z
  .string()
  .trim()
  .min(CONSTRAINTS.length.minimum)
  .max(CONSTRAINTS.length.maximum)
  .superRefine(Zod.Regex.REFINEMENTS.containsDigits)
  .superRefine(Zod.Regex.REFINEMENTS.containsLowercaseEnglishLetters)
  .superRefine(Zod.Regex.REFINEMENTS.containsSpecialCharacters)
  .superRefine(Zod.Regex.REFINEMENTS.containsUppercaseEnglishLetters);

export { CONSTRAINTS, zSchema };
