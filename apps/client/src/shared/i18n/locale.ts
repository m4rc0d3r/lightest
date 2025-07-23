import { z } from "zod";

import { getItem, setItem } from "../storage";

import { Tk } from "./tk";

const zLocale = z.enum(["en", "uk"]);
const Locale = zLocale.Enum;
type Locale = z.infer<typeof zLocale>;

const AVAILABLE_LOCALES: Record<Locale, Tk> = {
  en: Tk.english,
  uk: Tk.ukrainian,
};

const STORAGE_KEY = "vue-i18n-locale";

function persistLocale(locale: string) {
  setItem(localStorage, STORAGE_KEY, locale);
}

function getPersistedLocale() {
  return getItem(localStorage, STORAGE_KEY, zLocale, Locale.en);
}

export { AVAILABLE_LOCALES, getPersistedLocale, Locale, persistLocale };
