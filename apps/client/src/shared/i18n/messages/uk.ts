import type { Tk } from "../tk";

const MESSAGES = {
  en: "англ",
  uk: "укр",
  english: "англійська",
  ukrainian: "українська",
  main: "головна",
  about_us: "про нас",
} satisfies Record<Tk, string>;

export { MESSAGES };
