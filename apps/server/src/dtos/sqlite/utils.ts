import { FieldName as UserFieldName } from "../app/user.js";
import { ColumnName as UserColumnName } from "./user.js";
import { FieldName as SessionFieldName } from "../app/session.js";
import { ColumnName as SessionColumnName } from "./session.js";

export function convertUserFieldNameToColumnName(fieldName: UserFieldName): UserColumnName {
  switch (fieldName) {
    case "id":
      return "id";
      break;
    case "email":
      return "email";
      break;
    case "password":
      return "password";
      break;
    case "activationLink":
      return "activation_link";
      break;
    case "isActivated":
      return "is_activated";
      break;
  }
}

export function convertSessionFieldNameToColumnName(
  fieldName: SessionFieldName,
): SessionColumnName {
  switch (fieldName) {
    case "id":
      return "id";
      break;
    case "userId":
      return "user_id";
      break;
    case "refreshToken":
      return "refresh_token";
      break;
    case "expires":
      return "expires";
      break;
  }
}
