import z from "zod";

import { Regex } from "~/zod/pub-api";

const PASSWORD_LENGTH = {
  minimum: 6,
  maximum: 32,
};

const zPassword = z
  .string()
  .trim()
  .min(PASSWORD_LENGTH.minimum)
  .max(PASSWORD_LENGTH.maximum)
  .superRefine(Regex.REFINEMENTS.containsDigits)
  .superRefine(Regex.REFINEMENTS.containsLowercaseEnglishLetters)
  .superRefine(Regex.REFINEMENTS.containsSpecialCharacters)
  .superRefine(Regex.REFINEMENTS.containsUppercaseEnglishLetters);

export { PASSWORD_LENGTH, zPassword };
