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
  "email.genitive": "електронної пошти",
  password: "пароль",
  registration_successfully_completed: "реєстрацію успішно завершено",
  failed_to_register: "не вдалося зареєструватися",
  "login.noun": "вхід",
  "login.verb": "увійти",
  log_in_to_your_account_to_access_test_management:
    "увійдіть до свого облікового запису, щоб отримати доступ до керування тестами",
  failed_to_log_in: "не вдалося увійти",
  login_completed_successfully: "вхід успішно завершено",
  already_have_an_account: "вже маєте обліковий запис",
  create: "створити",
  don_t_have_an_account: "немає облікового запису",
  name_not_specified: "ім'я не вказано",
  logout: "вийти",
  logout_completed_successfully: "вихід успішно завершено",
  failed_to_log_out: "не вдалося вийти",
  user_avatar: "аватар користувача",
  this_email_address_is_already_taken: "ця адреса електронної пошти вже зайнята",
  incorrect_email_address_and_or_password: "неправильна адреса електронної пошти та/або пароль",
  an_unexpected_situation_has_occurred_please_try_again:
    "виникла непередбачена ситуація, спробуйте ще раз",
  failed_to_send_request_possibly_a_connection_problem:
    "не вдалося надіслати запит, можливо, проблема з підключенням",
  does_not_match_the_format: "не відповідає формату {format}",
  at_least_n_characters_required:
    "потрібно щонайменше {n} символів | потрібен щонайменше {n} символ | потрібно щонайменше {n} символи | потрібно щонайменше {n} символів",
  must_contain_lowercase_english_letters: "має містити малі англійські літери",
  must_contain_uppercase_english_letters: "має містити великі англійські літери",
  must_contain_digits: "має містити цифри",
  must_contain_special_characters: "має містити спеціальні символи",
  unsupported_file_extension: "непідтримуване розширення файлу",
} satisfies Record<Tk, string>;

export { MESSAGES };
