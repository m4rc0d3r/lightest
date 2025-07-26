import type { Tk } from "../tk";

const MESSAGES = {
  en: "en",
  uk: "uk",
  english: "english",
  ukrainian: "ukrainian",
  main: "main",
  about_us: "about us",
  register: "register",
  registration: "registration",
  create_an_account_to_be_able_to_create_and_manage_your_own_tests:
    "create an account to be able to create and manage your own tests",
  first_name: "first name",
  last_name: "last name",
  avatar: "avatar",
  email: "email ",
  "email.genitive": "email",
  password: "password",
  registration_successfully_completed: "registration successfully completed",
  failed_to_register: "failed to register",
  "login.noun": "login",
  "login.verb": "login",
  log_in_to_your_account_to_access_test_management:
    "log in to your account to access test management",
  failed_to_log_in: "failed to log in",
  login_completed_successfully: "login completed successfully",
  already_have_an_account: "already have an account",
  create: "create",
  don_t_have_an_account: "don't have an account",
  name_not_specified: "name not specified",
  logout: "logout",
  logout_completed_successfully: "logout completed successfully",
  failed_to_log_out: "failed to log out",
  user_avatar: "user avatar",
  this_email_address_is_already_taken: "this email address is already taken",
  incorrect_email_address_and_or_password: "incorrect email address and/or password",
  an_unexpected_situation_has_occurred_please_try_again:
    "an unexpected situation has occurred, please try again",
  failed_to_send_request_possibly_a_connection_problem:
    "failed to send request, possibly a connection problem",
  does_not_match_the_format: "does not match {format} format",
  at_least_n_characters_required:
    "at least {n} characters required | at least {n} character required | at least {n} characters required",
  must_contain_lowercase_english_letters: "must contain lowercase English letters",
  must_contain_uppercase_english_letters: "must contain uppercase English letters",
  must_contain_digits: "must contain digits",
  must_contain_special_characters: "must contain special characters",
  unsupported_file_extension: "unsupported file extension",
} satisfies Record<Tk, string>;

export { MESSAGES };
