import type { FieldName as SessionFieldName } from "../../dtos/app/session.js";
import type { FieldName as UserFieldName } from "../../dtos/app/user.js";

import { QuestionType } from "~/dtos/app/test/base/index.js";
import type { questionTypeEnum } from "~/infra/drizzle/schema.js";
import { sessionTable, userTable } from "~/infra/drizzle/schema.js";

function getColumnByUserField(fieldName: UserFieldName) {
  switch (fieldName) {
    case "id":
      return userTable.id;
    case "email":
      return userTable.email;
    case "password":
      return userTable.password;
    case "activationLink":
      return userTable.activationLink;
    case "isActivated":
      return userTable.isActivated;
  }
}

function getColumnBySessionField(fieldName: SessionFieldName) {
  switch (fieldName) {
    case "id":
      return sessionTable.id;
    case "userId":
      return sessionTable.userId;
    case "refreshToken":
      return sessionTable.refreshToken;
    case "expires":
      return sessionTable.expires;
  }
}

function getDbQuestionTypeByApp(value: QuestionType): (typeof questionTypeEnum.enumValues)[number] {
  switch (value) {
    case QuestionType.EXTENDED:
      return "EXTENDED";
    case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
      return "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS";
    case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
      return "WITH_ONE_CORRECT_ANSWER_OPTION";
  }
}

function getAppQuestionTypeByDb(value: (typeof questionTypeEnum.enumValues)[number]): QuestionType {
  switch (value) {
    case "EXTENDED":
      return QuestionType.EXTENDED;
    case "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS":
      return QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS;
    case "WITH_ONE_CORRECT_ANSWER_OPTION":
      return QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION;
  }
}

export {
  getAppQuestionTypeByDb,
  getColumnBySessionField,
  getColumnByUserField,
  getDbQuestionTypeByApp,
};
