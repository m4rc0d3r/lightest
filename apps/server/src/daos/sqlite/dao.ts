import dotenv from "dotenv";
import sqlite3 from "sqlite3";
import { Database } from "sqlite";

import { DAO } from "../app/dao.js";
import { DAOError, DAOConstraintUniqueError } from "../app/errors.js";
import { User, FieldName as UserFieldName } from "../../dtos/app/user.js";
import { Session, FieldName as SessionFieldName } from "../../dtos/app/session.js";
import { Test } from "../../dtos/app/test/base/index.js";
import { BriefTest, BriefPassedTest } from "../../dtos/app/test/brief/index.js";
import { SQLiteUser } from "../../dtos/sqlite/user.js";
import { SQLiteSession } from "../../dtos/sqlite/session.js";
import {
  convertUserFieldNameToColumnName,
  convertSessionFieldNameToColumnName,
} from "../../dtos/sqlite/utils.js";
import { QuestionType } from "../../dtos/app/test/base/index.js";
import {
  AnswerOptionToEdit,
  QuestionWithAnswerOptionsToEdit,
} from "../../dtos/app/test/to-edit/index.js";
import { QuestionWithExtendedAnswerToEdit } from "../../dtos/app/test/to-edit/index.js";
import { SQLiteTest } from "../../dtos/sqlite/test/test.js";
import { SQLiteQuestion } from "../../dtos/sqlite/test/question.js";
import { SQLiteQuestionType } from "../../dtos/sqlite/test/question-type.js";
import { SQLiteAnswerOption } from "../../dtos/sqlite/test/answer-option.js";

import {
  AnswerOptionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
} from "../../dtos/app/test/to-pass/index.js";
import {
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
} from "../../dtos/app/test/passed/index.js";
import { SQLiteExtendedAnswer } from "../../dtos/sqlite/test/correct-extended-answer.js";
import { SQLitePassedQuestion } from "../../dtos/sqlite/test/passed/question.js";
import { SQLitePassedExtendedAnswer } from "../../dtos/sqlite/test/passed/correct-extended-answer.js";
import { SQLitePassedAnswerOption } from "../../dtos/sqlite/test/passed/answer-option.js";
import { SQLitePassedTest } from "../../dtos/sqlite/test/passed/test.js";

dotenv.config();

const DB_NAME = process.env.DB_NAME;

class SQLiteDAO implements DAO {
  private _database: Database;

  public constructor() {
    if (DB_NAME === undefined) {
      throw new Error("'DB_NAME' not specified in the config file '.env'.");
    }

    this._database = new Database({
      filename: DB_NAME,
      driver: sqlite3.Database,
    });
  }

  public async init(): Promise<void> {
    try {
      await this._database.open();
      await this._database.run("pragma foreign_keys = on");
      await this._database.run(
        "insert into question_type(name) values('EXTENDED'), ('WITH_ONE_CORRECT_ANSWER_OPTION'), ('WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS');",
      );
    } catch (e) {
      if (
        (e as Error).message !== "SQLITE_CONSTRAINT: UNIQUE constraint failed: question_type.name"
      ) {
        throw e;
      }
    }
  }

  public async createUser(
    email: User["email"],
    password: User["password"],
    activationLink: User["activationLink"],
  ): Promise<User["id"]> {
    try {
      const result = await this._database.run(
        "insert into user(email, password, activation_link) values(?, ?, ?);",
        email,
        password,
        activationLink,
      );

      if (result.lastID === undefined) {
        throw new DAOError("Failed to register user account.");
      }

      return result.lastID;
    } catch (e) {
      if ((e as Error).message === "SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email") {
        throw new DAOConstraintUniqueError((e as Error).message, "User.email");
      } else {
        throw e;
      }
    }
  }

  public async getUserBy<T extends UserFieldName>(
    fieldName: T,
    value: User[T],
  ): Promise<User | undefined> {
    const columnName = convertUserFieldNameToColumnName(fieldName);
    const user = await this._database.get<SQLiteUser>(
      `select * from user where ${columnName} = ?`,
      value,
    );

    if (user !== undefined) {
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        activationLink: user.activation_link,
        isActivated: Boolean(user.is_activated),
      };
    }
  }

  public async activateUser(id: User["id"]): Promise<void> {
    const result = await this._database.run(
      "update user set is_activated = ? where id = ?",
      true,
      id,
    );

    if (result.changes === undefined || result.changes !== 1) {
      throw new DAOError("Failed to activate user account.");
    }
  }

  public async getUsers(): Promise<User[]> {
    const users = await this._database.all<SQLiteUser[]>("select * from user");

    return users.map((user) => {
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        activationLink: user.activation_link,
        isActivated: Boolean(user.is_activated),
      };
    });
  }

  public async createSession(
    userId: User["id"],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<Session["id"]> {
    try {
      const result = await this._database.run(
        "insert into session(refresh_token, user_id, expires) values(?, ?, ?);",
        refreshToken,
        userId,
        expires,
      );

      if (result.lastID === undefined) {
        throw new DAOError("Failed to create session.");
      }

      return result.lastID;
    } catch (e) {
      if (
        (e as Error).message ===
        "SQLITE_CONSTRAINT: UNIQUE constraint failed: session.refresh_token"
      ) {
        throw new DAOConstraintUniqueError((e as Error).message, "Session.refreshToken");
      } else {
        throw e;
      }
    }
  }

  public async getSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
  ): Promise<Session | undefined> {
    const columnName = convertSessionFieldNameToColumnName(fieldName);
    const session = await this._database.get<SQLiteSession>(
      `select * from session where ${columnName} = ?`,
      value,
    );

    if (session !== undefined) {
      return {
        id: session.id,
        userId: session.user_id,
        refreshToken: session.refresh_token,
        expires: session.expires,
      };
    }
  }

  public async updateSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<void> {
    const columnName = convertSessionFieldNameToColumnName(fieldName);
    const result = await this._database.run(
      `update session set refresh_token = ?, expires = ? where ${columnName} = ?`,
      refreshToken,
      expires,
      value,
    );

    if (result.changes === undefined || result.changes !== 1) {
      throw new DAOError("Failed to create session.");
    }
  }

  public async destroySessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
  ): Promise<void> {
    const columnName = convertSessionFieldNameToColumnName(fieldName);
    const result = await this._database.run(`delete from session where ${columnName} = ?`, value);

    if (result.changes === undefined || result.changes !== 1) {
      throw new DAOError("Failed to destroy session.");
    }
  }

  public async createTest(author_id: User["id"], test: Test): Promise<Test["id"]> {
    const errorText = "Failed to create test.";
    await this._database.get("begin transaction;");

    const result = await this._database.run(
      "insert into test(author_id, title) values(?, ?);",
      author_id,
      test.title,
    );

    if (result.lastID === undefined) {
      await this._database.get("rollback;");
      throw new DAOError(errorText);
    }

    const testId = result.lastID;

    for (const question of test.questions) {
      const result = await this._database.run(
        "insert into question(test_id, type_id, content, worth) values(?, (select id from question_type where name = ?), ?, ?);",
        testId,
        question.type,
        question.content,
        question.worth,
      );

      if (result.lastID === undefined) {
        await this._database.get("rollback;");
        throw new DAOError(errorText);
      }

      const questionId = result.lastID;

      if (question.type === QuestionType.EXTENDED) {
        const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToEdit;
        const result = await this._database.run(
          "insert into correct_extended_answer(question_id, content) values(?, ?);",
          questionId,
          questionWithExtendedAnswer.correctAnswer,
        );

        if (result.lastID === undefined) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }
      } else {
        const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToEdit;
        for (const answerOption of questionWithAnswerOptions.answerOptions) {
          const result = await this._database.run(
            "insert into answer_option(question_id, content, is_correct) values(?, ?, ?);",
            questionId,
            answerOption.content,
            answerOption.isCorrect,
          );

          if (result.lastID === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }
      }
    }

    await this._database.get("end transaction;");

    return testId;
  }

  public async getTestToEdit(test_id: Test["id"]): Promise<Test | undefined> {
    const test = await this._database.get<SQLiteTest>("select * from test where id = ?;", test_id);

    if (test === undefined) {
      return;
    }

    const testToEdit = { id: test.id, title: test.title, questions: [] } as Test;

    const questions = await this._database.all<SQLiteQuestion[]>(
      "select * from question where test_id = ?;",
      test.id,
    );

    const questionTypes = await this._database.all<SQLiteQuestionType[]>(
      "select * from question_type;",
    );

    for (const question of questions) {
      const questionType = questionTypes.find(
        (questionType) => questionType.id === question.type_id,
      );

      if (questionType === undefined) {
        return;
      }

      if (questionType.name === QuestionType.EXTENDED) {
        const correctAnswer = await this._database.get<SQLiteExtendedAnswer>(
          "select * from correct_extended_answer where question_id = ?;",
          question.id,
        );

        if (correctAnswer === undefined) {
          return;
        }

        testToEdit.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          correctAnswer: correctAnswer.content,
        } as QuestionWithExtendedAnswerToEdit);
      } else {
        const answerOptions = await this._database.all<SQLiteAnswerOption[]>(
          "select * from answer_option where question_id = ?;",
          question.id,
        );
        testToEdit.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          answerOptions: answerOptions.map((answerOption) => {
            return {
              id: answerOption.id,
              content: answerOption.content,
              isCorrect: answerOption.is_correct,
            } as AnswerOptionToEdit;
          }),
        } as QuestionWithAnswerOptionsToEdit);
      }
    }

    return testToEdit;
  }

  public async updateTest(test: Test): Promise<void> {
    const errorText = "Failed to update test.";

    await this._database.get("begin transaction;");

    const result = await this._database.run(
      "update test set title = ? where id = ?;",
      test.title,
      test.id,
    );

    if (result.changes === undefined || result.changes !== 1) {
      await this._database.get("rollback;");
      throw new DAOError(errorText);
    }

    const questionTypes = await this._database.all<SQLiteQuestionType[]>(
      "select * from question_type;",
    );

    const oldQuestions = await this._database.all<SQLiteQuestion[]>(
      "select * from question where test_id = ?;",
      test.id,
    );

    const unusedQuestions = oldQuestions.filter((oldQuestion) => {
      return test.questions.findIndex((question) => question.id === oldQuestion.id) === -1;
    });

    for (const question of unusedQuestions) {
      const questionType = questionTypes.find(
        (questionType) => questionType.id === question.type_id,
      );

      if (questionType === undefined) {
        await this._database.get("rollback;");
        return;
      }

      if (questionType.name === QuestionType.EXTENDED) {
        const unusedExtendedAnswer = await this._database.get<SQLiteExtendedAnswer>(
          "select * from correct_extended_answer inner join passed_extended_answer on correct_extended_answer.id = passed_extended_answer.correct_answer_id where correct_extended_answer.question_id = ?;",
          question.id,
        );

        if (unusedExtendedAnswer === undefined) {
          const result = await this._database.run(
            "delete from correct_extended_answer where question_id = ?;",
            question.id,
          );

          if (result.changes === undefined || result.changes !== 1) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        } else {
          const result = await this._database.run(
            "update correct_extended_answer set question_id = null where question_id = ?;",
            question.id,
          );

          if (result.changes === undefined || result.changes !== 1) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }
      } else {
        const unusedAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
          "select * from answer_option where answer_option.question_id = ?;",
          question.id,
        );
        const passedAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
          "select answer_option.* from answer_option inner join passed_answer_option on answer_option.id = passed_answer_option.answer_option_id where answer_option.question_id = ?;",
          question.id,
        );
        const answerOptionsToDelete = unusedAnswerOptions.filter(
          (answerOption) =>
            passedAnswerOptions.findIndex(
              (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
            ) === -1,
        );

        for (const answerOption of passedAnswerOptions) {
          const result = await this._database.run(
            "update answer_option set question_id = null where id = ?;",
            answerOption.id,
          );

          if (result.changes === undefined || result.changes !== 1) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }

        for (const answerOption of answerOptionsToDelete) {
          const result = await this._database.run(
            "delete from answer_option where id = ?;",
            answerOption.id,
          );

          if (result.changes === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }
      }

      const usedQuestion = await this._database.get<SQLiteQuestion>(
        "select * from question inner join passed_question on question.id = passed_question.question_id where question.id = ?;",
        question.id,
      );

      if (usedQuestion === undefined) {
        const result = await this._database.run("delete from question where id = ?;", question.id);

        if (result.changes === undefined || result.changes !== 1) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }
      } else {
        const result = await this._database.run(
          "update question set test_id = null where id = ?;",
          question.id,
        );

        if (result.changes === undefined || result.changes !== 1) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }
      }
    }

    for (const question of test.questions) {
      if (question.id > 0) {
        const oldQuestion = oldQuestions.find((oldQuestion) => oldQuestion.id === question.id);
        const questionType = questionTypes.find(
          (questionType) => questionType.name === question.type,
        );
        const oldQuestionType = questionTypes.find(
          (questionType) => questionType.id === oldQuestion?.type_id,
        );

        if (
          oldQuestion === undefined ||
          questionType === undefined ||
          oldQuestionType === undefined
        ) {
          await this._database.get("rollback;");
          return;
        }

        const usedQuestion = await this._database.get<SQLiteQuestion>(
          "select * from question inner join passed_question on question.id = passed_question.question_id where question.id = ?;",
          question.id,
        );

        if (usedQuestion === undefined) {
          const result = await this._database.run(
            "update question set type_id = ?, content = ?, worth = ? where id = ?;",
            questionType.id,
            question.content,
            question.worth,
            question.id,
          );

          if (result.changes === undefined || result.changes !== 1) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        } else if (
          questionType.id !== usedQuestion.type_id ||
          question.content !== usedQuestion.content ||
          question.worth !== usedQuestion.worth
        ) {
          const result = await this._database.run(
            "update question set test_id = null where id = ?;",
            question.id,
          );

          if (result.changes === undefined || result.changes !== 1) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }

          const result2 = await this._database.run(
            "insert into question(test_id, type_id, content, worth) values(?, (select id from question_type where name = ?), ?, ?);",
            test.id,
            question.type,
            question.content,
            question.worth,
          );

          if (result2.lastID === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }

          question.id = result2.lastID;

          const result3 = await this._database.run(
            "update correct_extended_answer set question_id = ? where question_id = ?;",
            question.id,
            oldQuestion.id,
          );

          if (result3.changes === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }

          const result4 = await this._database.run(
            "update answer_option set question_id = ? where question_id = ?;",
            question.id,
            oldQuestion.id,
          );

          if (result4.changes === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }

        if (questionType.name === QuestionType.EXTENDED) {
          if (questionType.id === oldQuestion.type_id) {
            const usedExtendedAnswer = await this._database.get<SQLiteExtendedAnswer>(
              "select * from correct_extended_answer inner join passed_extended_answer on correct_extended_answer.id = passed_extended_answer.correct_answer_id where correct_extended_answer.question_id = ?;",
              question.id,
            );

            if (usedExtendedAnswer === undefined) {
              const result = await this._database.run(
                "update correct_extended_answer set content = ? where question_id = ?;",
                (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
                question.id,
              );

              if (result.changes === undefined || result.changes !== 1) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            } else {
              const result = await this._database.run(
                "update correct_extended_answer set question_id = null where question_id = ?;",
                question.id,
              );

              if (result.changes === undefined || result.changes !== 1) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }

              const result2 = await this._database.run(
                "insert into correct_extended_answer(question_id, content) values(?, ?);",
                question.id,
                (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
              );

              if (result2.lastID === undefined) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }
          } else {
            const result = await this._database.run(
              "insert into correct_extended_answer(question_id, content) values(?, ?);",
              question.id,
              (question as QuestionWithExtendedAnswerToEdit).correctAnswer,
            );

            if (result.lastID === undefined) {
              await this._database.get("rollback;");
              throw new DAOError(errorText);
            }

            const unusedAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
              "select * from answer_option where answer_option.question_id = ?;",
              question.id,
            );
            const passedAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
              "select answer_option.* from answer_option inner join passed_answer_option on answer_option.id = passed_answer_option.answer_option_id where answer_option.question_id = ?;",
              question.id,
            );
            const answerOptionsToDelete = unusedAnswerOptions.filter(
              (answerOption) =>
                passedAnswerOptions.findIndex(
                  (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
                ) === -1,
            );

            for (const answerOption of passedAnswerOptions) {
              const result = await this._database.run(
                "update answer_option set question_id = null where id = ?;",
                answerOption.id,
              );

              if (result.changes === undefined || result.changes !== 1) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }

            for (const answerOption of answerOptionsToDelete) {
              const result = await this._database.run(
                "delete from answer_option where id = ?;",
                answerOption.id,
              );

              if (result.changes === undefined) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }
          }
        } else if (
          [
            QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
            QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
          ].includes(questionType.name)
        ) {
          if (
            [
              QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
              QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
            ].includes(oldQuestionType.name)
          ) {
            const oldAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
              "select * from answer_option where question_id = ?;",
              question.id,
            );
            const unusedAnswerOptions = oldAnswerOptions.filter((oldAnswerOption) => {
              return (
                (question as QuestionWithAnswerOptionsToEdit).answerOptions.findIndex(
                  (answerOption) => answerOption.id === oldAnswerOption.id,
                ) === -1
              );
            });
            const passedAnswerOptions = await this._database.all<SQLiteAnswerOption[]>(
              "select answer_option.* from answer_option inner join passed_answer_option on answer_option.id = passed_answer_option.answer_option_id where answer_option.question_id = ?;",
              question.id,
            );
            const answerOptionsToDelete = unusedAnswerOptions.filter(
              (answerOption) =>
                passedAnswerOptions.findIndex(
                  (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
                ) === -1,
            );

            for (const answerOption of answerOptionsToDelete) {
              const result = await this._database.run(
                "delete from answer_option where id = ?;",
                answerOption.id,
              );

              if (result.changes === undefined) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }

            const answerOptionsToUpdate = (question as QuestionWithAnswerOptionsToEdit)
              .answerOptions;

            for (const answerOption of answerOptionsToUpdate) {
              if (answerOption.id > 0) {
                const passedAnswerOption = passedAnswerOptions.find(
                  (passedAnswerOption) => passedAnswerOption.id === answerOption.id,
                );

                if (
                  passedAnswerOption &&
                  (answerOption.content !== passedAnswerOption.content ||
                    Boolean(answerOption.isCorrect) !== Boolean(passedAnswerOption.is_correct))
                ) {
                  const result = await this._database.run(
                    "update answer_option set question_id = null where id = ?;",
                    answerOption.id,
                  );

                  if (result.changes === undefined || result.changes !== 1) {
                    await this._database.get("rollback;");
                    throw new DAOError(errorText);
                  }

                  const result2 = await this._database.run(
                    "insert into answer_option(question_id, content, is_correct) values(?, ?, ?);",
                    question.id,
                    answerOption.content,
                    answerOption.isCorrect,
                  );

                  if (result2.lastID === undefined) {
                    await this._database.get("rollback;");
                    throw new DAOError(errorText);
                  }
                } else {
                  const result = await this._database.run(
                    "update answer_option set content = ?, is_correct = ? where id = ?;",
                    answerOption.content,
                    answerOption.isCorrect,
                    answerOption.id,
                  );

                  if (result.changes === undefined || result.changes !== 1) {
                    await this._database.get("rollback;");
                    throw new DAOError(errorText);
                  }
                }
              } else {
                const result = await this._database.run(
                  "insert into answer_option(question_id, content, is_correct) values(?, ?, ?);",
                  question.id,
                  answerOption.content,
                  answerOption.isCorrect,
                );

                if (result.lastID === undefined) {
                  await this._database.get("rollback;");
                  throw new DAOError(errorText);
                }
              }
            }
          } else {
            for (const answerOption of (question as QuestionWithAnswerOptionsToEdit)
              .answerOptions) {
              const result = await this._database.run(
                "insert into answer_option(question_id, content, is_correct) values(?, ?, ?);",
                question.id,
                answerOption.content,
                answerOption.isCorrect,
              );

              if (result.lastID === undefined) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }

            const unusedExtendedAnswer = await this._database.get<SQLiteExtendedAnswer>(
              "select * from correct_extended_answer inner join passed_extended_answer on correct_extended_answer.id = passed_extended_answer.correct_answer_id where correct_extended_answer.question_id = ?;",
              question.id,
            );

            if (unusedExtendedAnswer === undefined) {
              const result = await this._database.run(
                "delete from correct_extended_answer where question_id = ?;",
                question.id,
              );

              if (result.changes === undefined || result.changes !== 1) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            } else {
              const result = await this._database.run(
                "update correct_extended_answer set question_id = null where question_id = ?;",
                question.id,
              );

              if (result.changes === undefined || result.changes !== 1) {
                await this._database.get("rollback;");
                throw new DAOError(errorText);
              }
            }
          }
        }
      } else {
        const result = await this._database.run(
          "insert into question(test_id, type_id, content, worth) values(?, (select id from question_type where name = ?), ?, ?);",
          test.id,
          question.type,
          question.content,
          question.worth,
        );

        if (result.lastID === undefined) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }

        const questionId = result.lastID;

        if (question.type === QuestionType.EXTENDED) {
          const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToEdit;
          const result = await this._database.run(
            "insert into correct_extended_answer(question_id, content) values(?, ?);",
            questionId,
            questionWithExtendedAnswer.correctAnswer,
          );

          if (result.lastID === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        } else {
          const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToEdit;
          for (const answerOption of questionWithAnswerOptions.answerOptions) {
            const result = await this._database.run(
              "insert into answer_option(question_id, content, is_correct) values(?, ?, ?);",
              questionId,
              answerOption.content,
              answerOption.isCorrect,
            );

            if (result.lastID === undefined) {
              await this._database.get("rollback;");
              throw new DAOError(errorText);
            }
          }
        }
      }
    }

    await this._database.get("end transaction;");
  }

  public async getTestAuthor(test_id: Test["id"]): Promise<User | undefined> {
    const user = await this._database.get<SQLiteUser>(
      "select user.* from user inner join test on user.id = test.author_id where test.id = ?;",
      test_id,
    );

    if (user !== undefined) {
      return {
        id: user.id,
        email: user.email,
        password: user.password,
        activationLink: user.activation_link,
        isActivated: Boolean(user.is_activated),
      };
    }
  }

  public async getBriefTests(): Promise<BriefTest[]> {
    const briefTests = await this._database.all<BriefTest[]>(
      "select test.id, test.title, count(question.id) as 'numberOfQuestions', sum(question.worth) as 'grade' from test left join question on test.id = question.test_id group by test.id, test.title;",
    );

    return briefTests;
  }

  public async getBriefTestsCreatedByUser(authorId: User["id"]): Promise<BriefTest[]> {
    const briefTests = await this._database.all<BriefTest[]>(
      "select test.id, test.title, count(question.id) as 'numberOfQuestions', sum(question.worth) as 'grade' from test left join question on test.id = question.test_id where test.author_id = ? group by test.id, test.title;",
      authorId,
    );

    return briefTests;
  }

  public async getBriefTestsPassedByUser(passingId: User["id"]): Promise<BriefPassedTest[]> {
    const briefTests = await this._database.all<BriefPassedTest[]>(
      "select passed_test.id, test.title, (select count(*) from passed_question as pq where pq.passed_test_id = passed_test.id) as 'numberOfQuestions', (select sum(q.worth) from passed_question as pq inner join question as q on pq.question_id = q.id where pq.passed_test_id = passed_test.id) as 'grade', sum(case question.type_id when 1 then iif(passed_extended_answer.content = correct_extended_answer.content, question.worth, 0) when 2 then iif((select count(*) from passed_answer_option as pao inner join answer_option as ao on pao.answer_option_id = ao.id inner join passed_question as pq on pao.passed_question_id = pq.id where pq.id = passed_question.id and pao.is_chosen = ao.is_correct and ao.is_correct = true) = 1, question.worth, 0) when 3 then ( CAST((select count(*) from passed_answer_option as pao inner join answer_option as ao on pao.answer_option_id = ao.id inner join passed_question as pq on pao.passed_question_id = pq.id where pq.id = passed_question.id and pao.is_chosen = ao.is_correct and ao.is_correct = true) as REAL) / (select count(*) from passed_answer_option as pao inner join answer_option as ao on pao.answer_option_id = ao.id where pao.passed_question_id = passed_question.id and ao.is_correct = true) ) * question.worth end) as 'score' from passed_test inner join passed_question on passed_test.id = passed_question.passed_test_id left join passed_extended_answer on passed_question.id = passed_extended_answer.passed_question_id inner join test on passed_test.test_id = test.id left join question on passed_question.question_id = question.id left join correct_extended_answer on passed_extended_answer.correct_answer_id = correct_extended_answer.id where passed_test.passing_id = ? group by passed_test.id;",
      passingId,
    );

    return briefTests;
  }

  public async getTestToPass(id: Test["id"]): Promise<Test | undefined> {
    const test = await this._database.get<SQLiteTest>("select * from test where id = ?;", id);

    if (test === undefined) {
      return;
    }

    const testToPass = { id: test.id, title: test.title, questions: [] } as Test;

    const questions = await this._database.all<SQLiteQuestion[]>(
      "select * from question where test_id = ?;",
      test.id,
    );

    const questionTypes = await this._database.all<SQLiteQuestionType[]>(
      "select * from question_type;",
    );

    for (const question of questions) {
      const questionType = questionTypes.find(
        (questionType) => questionType.id === question.type_id,
      );

      if (questionType === undefined) {
        return;
      }

      if (questionType.name === QuestionType.EXTENDED) {
        testToPass.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          enteredAnswer: "",
        } as QuestionWithExtendedAnswerToPass);
      } else {
        const answerOptions = await this._database.all<SQLiteAnswerOption[]>(
          "select * from answer_option where question_id = ?;",
          question.id,
        );
        testToPass.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          answerOptions: answerOptions.map((answerOption) => {
            return {
              id: answerOption.id,
              content: answerOption.content,
              isChosen: false,
            } as AnswerOptionToPass;
          }),
        } as QuestionWithAnswerOptionsToPass);
      }
    }

    return testToPass;
  }

  public async createPassedTest(passingId: User["id"], test: Test): Promise<Test["id"]> {
    const errorText = "Failed to create test pass record.";
    await this._database.get("begin transaction;");

    const result = await this._database.run(
      "insert into passed_test(test_id, passing_id) values(?, ?);",
      test.id,
      passingId,
    );

    if (result.lastID === undefined) {
      await this._database.get("rollback;");
      throw new DAOError(errorText);
    }

    const passedTestId = result.lastID;

    for (const question of test.questions) {
      const result = await this._database.run(
        "insert into passed_question(passed_test_id, question_id) values(?, ?);",
        passedTestId,
        question.id,
      );

      if (result.lastID === undefined) {
        await this._database.get("rollback;");
        throw new DAOError(errorText);
      }

      const passedQuestionId = result.lastID;

      if (question.type === QuestionType.EXTENDED) {
        const correctAnswer = await this._database.get<SQLiteExtendedAnswer>(
          "select * from correct_extended_answer where question_id = ?;",
          question.id,
        );

        if (correctAnswer === undefined) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }
        const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToPass;
        const result = await this._database.run(
          "insert into passed_extended_answer(passed_question_id, correct_answer_id, content) values(?, ?, ?);",
          passedQuestionId,
          correctAnswer.id,
          questionWithExtendedAnswer.enteredAnswer,
        );

        if (result.lastID === undefined) {
          await this._database.get("rollback;");
          throw new DAOError(errorText);
        }
      } else {
        const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToPass;
        for (const answerOption of questionWithAnswerOptions.answerOptions) {
          const result = await this._database.run(
            "insert into passed_answer_option(passed_question_id, answer_option_id, is_chosen) values(?, ?, ?);",
            passedQuestionId,
            answerOption.id,
            answerOption.isChosen,
          );

          if (result.lastID === undefined) {
            await this._database.get("rollback;");
            throw new DAOError(errorText);
          }
        }
      }
    }

    await this._database.get("end transaction;");

    return passedTestId;
  }

  public async getPassedTest(id: Test["id"]): Promise<Test | undefined> {
    const accomplishedTest = await this._database.get<SQLitePassedTest>(
      "select * from passed_test where id = ?;",
      id,
    );

    if (accomplishedTest === undefined) {
      return;
    }

    const test = await this._database.get<SQLiteTest>(
      "select * from test where id = ?;",
      accomplishedTest.test_id,
    );

    if (test === undefined) {
      return;
    }

    const passedTest = { id: accomplishedTest.id, title: test.title, questions: [] } as Test;

    const passedQuestions = await this._database.all<SQLitePassedQuestion[]>(
      "select * from passed_question where passed_test_id = ?;",
      passedTest.id,
    );

    const questionTypes = await this._database.all<SQLiteQuestionType[]>(
      "select * from question_type;",
    );

    for (const passedQuestion of passedQuestions) {
      const question = await this._database.get<SQLiteQuestion>(
        "select * from question where id = ?;",
        passedQuestion.question_id,
      );

      if (question === undefined) {
        return;
      }

      const questionType = questionTypes.find(
        (questionType) => questionType.id === question.type_id,
      );

      if (questionType === undefined) {
        return;
      }

      if (questionType.name === QuestionType.EXTENDED) {
        const enteredAnswer = await this._database.get<SQLitePassedExtendedAnswer>(
          "select * from passed_extended_answer where passed_question_id = ?;",
          passedQuestion.id,
        );

        if (enteredAnswer === undefined) {
          return;
        }

        const correctAnswer = await this._database.get<SQLiteExtendedAnswer>(
          "select * from correct_extended_answer where id = ?;",
          enteredAnswer.correct_answer_id,
        );

        if (correctAnswer === undefined) {
          return;
        }

        passedTest.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          correctAnswer: correctAnswer.content,
          enteredAnswer: enteredAnswer.content,
        } as PassedQuestionWithExtendedAnswer);
      } else {
        const passedAnswerOptions = await this._database.all<SQLitePassedAnswerOption[]>(
          "select * from passed_answer_option where passed_question_id = ?;",
          passedQuestion.id,
        );
        const answerOptions = [] as SQLiteAnswerOption[];
        for (const passedAnswerOption of passedAnswerOptions) {
          const answerOption = await this._database.get<SQLiteAnswerOption>(
            "select * from answer_option where id = ?;",
            passedAnswerOption.answer_option_id,
          );

          if (answerOption === undefined) {
            return;
          }

          answerOptions.push(answerOption);
        }
        passedTest.questions.push({
          id: question.id,
          type: questionType.name,
          content: question.content,
          worth: question.worth,
          answerOptions: answerOptions.map((answerOption, index) => {
            return {
              id: answerOption.id,
              content: answerOption.content,
              isCorrect: answerOption.is_correct,
              isChosen: passedAnswerOptions[index].is_chosen,
            } as AnswerOptionToPass;
          }),
        } as PassedQuestionWithAnswerOptions);
      }
    }

    return passedTest;
  }
}

export const dao: DAO = new SQLiteDAO();
