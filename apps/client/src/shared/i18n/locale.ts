import { z } from "zod";

const zLocale = z.enum(["en", "uk"]);
const Locale = zLocale.Enum;
type Locale = z.infer<typeof zLocale>;

const AVAILABLE_LOCALES: Record<Locale, string> = {
  en: "english",
  uk: "ukrainian",
};

export { AVAILABLE_LOCALES, Locale };
