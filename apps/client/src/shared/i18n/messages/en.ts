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
  password: "password",
  registration_successfully_completed: "registration successfully completed",
  failed_to_register: "failed to register",
  "login.noun": "login",
  "login.verb": "login",
  log_in_to_your_account_to_access_test_management:
    "log in to your account to access test management",
  failed_to_log_in: "failed to log in",
  login_completed_successfully: "login completed successfully",
} satisfies Record<Tk, string>;

export { MESSAGES };
