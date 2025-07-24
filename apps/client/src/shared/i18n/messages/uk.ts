import type { Tk } from "../tk";

const MESSAGES = {
  en: "англ",
  uk: "укр",
  english: "англійська",
  ukrainian: "українська",
  main: "головна",
  about_us: "про нас",
  register: "зареєструватися",
  registration: "реєстрація",
  create_an_account_to_be_able_to_create_and_manage_your_own_tests:
    "створіть обліковий запис, щоб мати змогу створювати та керувати власними тестами",
  first_name: "ім'я",
  last_name: "прізвище",
  avatar: "аватар",
  email: "електронна пошта",
  password: "пароль",
  registration_successfully_completed: "реєстрацію успішно завершено",
  failed_to_register: "не вдалося зареєструватися",
} satisfies Record<Tk, string>;

export { MESSAGES };
