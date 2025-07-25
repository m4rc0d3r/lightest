import { z } from "zod";

const zTk = z.enum([
  "en",
  "uk",
  "english",
  "ukrainian",
  "main",
  "about_us",
  "register",
  "registration",
  "create_an_account_to_be_able_to_create_and_manage_your_own_tests",
  "first_name",
  "last_name",
  "avatar",
  "email",
  "password",
  "registration_successfully_completed",
  "failed_to_register",
  "login.noun",
  "login.verb",
  "log_in_to_your_account_to_access_test_management",
  "failed_to_log_in",
  "login_completed_successfully",
]);
const Tk = zTk.Values;
type Tk = z.infer<typeof zTk>;

export { Tk };
