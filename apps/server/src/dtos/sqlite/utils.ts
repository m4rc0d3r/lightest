import type { FieldName as SessionFieldName } from "../app/session.js";
import type { FieldName as UserFieldName } from "../app/user.js";

import type { ColumnName as SessionColumnName } from "./session.js";
import type { ColumnName as UserColumnName } from "./user.js";

function convertUserFieldNameToColumnName(fieldName: UserFieldName): UserColumnName {
  switch (fieldName) {
    case "id":
      return "id";
    case "email":
      return "email";
    case "password":
      return "password";
    case "activationLink":
      return "activation_link";
    case "isActivated":
      return "is_activated";
  }
}

function convertSessionFieldNameToColumnName(fieldName: SessionFieldName): SessionColumnName {
  switch (fieldName) {
    case "id":
      return "id";
    case "userId":
      return "user_id";
    case "refreshToken":
      return "refresh_token";
    case "expires":
      return "expires";
  }
}

export { convertSessionFieldNameToColumnName, convertUserFieldNameToColumnName };
