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
  "login.noun": "вхід",
  "login.verb": "увійти",
  log_in_to_your_account_to_access_test_management:
    "увійдіть до свого облікового запису, щоб отримати доступ до керування тестами",
  failed_to_log_in: "не вдалося увійти",
  login_completed_successfully: "вхід успішно завершено",
} satisfies Record<Tk, string>;

export { MESSAGES };
