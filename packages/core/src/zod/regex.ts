import { z } from "zod";

import { TypeGuard } from "~/type-guard";

const DOES_NOT_MATCH_REGEX = "does_not_match_regex";
const CUSTOM_CODE = "customCode";

type RegexIssue = Omit<z.ZodCustomIssue, "params"> & {
  params: {
    [CUSTOM_CODE]: typeof DOES_NOT_MATCH_REGEX;
    regexCode: RegexCode;
  };
};

function isRegexIssue(value: z.ZodIssueOptionalMessage): value is RegexIssue {
  return (
    value.code === z.ZodIssueCode.custom &&
    TypeGuard.isObject(value.params) &&
    value.params[CUSTOM_CODE] === DOES_NOT_MATCH_REGEX
  );
}

const zRegexCode = z.enum([
  "MUST_CONTAIN_LOWERCASE_ENGLISH_LETTERS",
  "MUST_CONTAIN_UPPERCASE_ENGLISH_LETTERS",
  "MUST_CONTAIN_DIGITS",
  "MUST_CONTAIN_SPECIAL_CHARACTERS",
]);
const RegexCode = zRegexCode.Values;
type RegexCode = z.infer<typeof zRegexCode>;

type RegexMapEntryValue = {
  regex: RegExp;
  errorMessage: string;
};

const REGEX_MAP: Record<RegexCode, RegexMapEntryValue> = {
  [RegexCode.MUST_CONTAIN_LOWERCASE_ENGLISH_LETTERS]: {
    regex: /[a-z]/gm,
    errorMessage: "Must contain lowercase English letters",
  },
  [RegexCode.MUST_CONTAIN_UPPERCASE_ENGLISH_LETTERS]: {
    regex: /[A-Z]/gm,
    errorMessage: "Must contain uppercase English letters",
  },
  [RegexCode.MUST_CONTAIN_DIGITS]: {
    regex: /[\d]/gm,
    errorMessage: "Must contain digits",
  },
  [RegexCode.MUST_CONTAIN_SPECIAL_CHARACTERS]: {
    regex: /[~!@#$%^&*()\-=_+[\]{}\/|\\:;'"<>?.,]/gm,
    errorMessage: "Must contain special characters",
  },
};

function matchesRegex(regexCode: RegexCode) {
  const { regex } = REGEX_MAP[regexCode];
  return (value: string, ctx: z.RefinementCtx) => {
    if (!value.match(regex)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        params: {
          customCode: DOES_NOT_MATCH_REGEX,
          regexCode,
        } satisfies RegexIssue["params"],
      });
    }
  };
}

const REFINEMENTS = {
  containsLowercaseEnglishLetters: matchesRegex(RegexCode.MUST_CONTAIN_LOWERCASE_ENGLISH_LETTERS),
  containsUppercaseEnglishLetters: matchesRegex(RegexCode.MUST_CONTAIN_UPPERCASE_ENGLISH_LETTERS),
  containsDigits: matchesRegex(RegexCode.MUST_CONTAIN_DIGITS),
  containsSpecialCharacters: matchesRegex(RegexCode.MUST_CONTAIN_SPECIAL_CHARACTERS),
};

const errorMap: z.ZodErrorMap = (issue, ctx) => {
  if (isRegexIssue(issue)) {
    return {
      message: REGEX_MAP[issue.params.regexCode].errorMessage,
    };
  }

  return {
    message: ctx.defaultError,
  };
};

export { errorMap, isRegexIssue, REFINEMENTS, RegexCode };
export type { RegexIssue };
