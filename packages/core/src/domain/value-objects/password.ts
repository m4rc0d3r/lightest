import { Zod } from "~/zod";

const { Regex, zTrimmedStr } = Zod;

const PASSWORD_LENGTH = {
  minimum: 6,
  maximum: 32,
};

const zPassword = zTrimmedStr
  .min(PASSWORD_LENGTH.minimum)
  .max(PASSWORD_LENGTH.maximum)
  .superRefine(Regex.REFINEMENTS.containsDigits)
  .superRefine(Regex.REFINEMENTS.containsLowercaseEnglishLetters)
  .superRefine(Regex.REFINEMENTS.containsSpecialCharacters)
  .superRefine(Regex.REFINEMENTS.containsUppercaseEnglishLetters);

export { PASSWORD_LENGTH, zPassword };
