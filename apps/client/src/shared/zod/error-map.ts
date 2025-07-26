import { Str, Zod } from "@lightest/core";
import type { useI18n, UseI18nOptions } from "vue-i18n";
import { z } from "zod";

import { Tk } from "../i18n";

function errorMapForForms<Options extends UseI18nOptions = UseI18nOptions>(
  t: ReturnType<typeof useI18n<Options>>["t"],
) {
  const map: z.ZodErrorMap = (issue, ctx) => {
    const { code } = issue;

    if (code === z.ZodIssueCode.invalid_string) {
      const { validation } = issue;
      if (typeof validation === "string") {
        let format: string = validation;
        if (format === "email") {
          format = t(Tk["email.genitive"]);
        }
        return {
          message: Str.capitalize(
            t(Tk.does_not_match_the_format, {
              format,
            }),
          ),
        };
      }
    }

    if (code === z.ZodIssueCode.too_small) {
      const { inclusive, minimum, type, exact } = issue;
      if (type === "string" && !exact) {
        const exactMinimum = Number(inclusive ? minimum : Number(minimum) + 1);
        return {
          message: Str.capitalize(t(Tk.at_least_n_characters_required, exactMinimum)),
        };
      }
    }

    if (Zod.Regex.isRegexIssue(issue)) {
      const { regexCode } = issue.params;
      const TK_BY_REGEX_CODE: Record<typeof regexCode, Tk> = {
        MUST_CONTAIN_LOWERCASE_ENGLISH_LETTERS: Tk.must_contain_lowercase_english_letters,
        MUST_CONTAIN_UPPERCASE_ENGLISH_LETTERS: Tk.must_contain_uppercase_english_letters,
        MUST_CONTAIN_DIGITS: Tk.must_contain_digits,
        MUST_CONTAIN_SPECIAL_CHARACTERS: Tk.must_contain_special_characters,
      };

      return {
        message: Str.capitalize(t(TK_BY_REGEX_CODE[regexCode])),
      };
    }

    if (Zod.File.isMimeTypeIssue(issue)) {
      return {
        message: Str.capitalize(t(Tk.unsupported_file_extension)),
      };
    }

    return {
      message: ctx.defaultError,
    };
  };

  return map;
}

export { errorMapForForms };
