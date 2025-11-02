import { sql } from "drizzle-orm";
import { DatabaseError } from "pg";

import type { Session, FieldName as SessionFieldName } from "../../dtos/app/session.js";
import type { Test } from "../../dtos/app/test/base";
import { QuestionType } from "../../dtos/app/test/base";
import type { BriefPassedTest, BriefTest } from "../../dtos/app/test/brief";
import type {
  PassedQuestionWithAnswerOptions,
  PassedQuestionWithExtendedAnswer,
} from "../../dtos/app/test/passed";
import type {
  AnswerOptionToEdit,
  QuestionWithAnswerOptionsToEdit,
  QuestionWithExtendedAnswerToEdit,
} from "../../dtos/app/test/to-edit";
import type {
  AnswerOptionToPass,
  QuestionWithAnswerOptionsToPass,
  QuestionWithExtendedAnswerToPass,
} from "../../dtos/app/test/to-pass";
import type { User, FieldName as UserFieldName } from "../../dtos/app/user.js";
import type { PostgresAnswerOption } from "../../dtos/postgres/test/answer-option.js";
import type { PostgresExtendedAnswer } from "../../dtos/postgres/test/correct-extended-answer.js";
import type { PostgresQuestion } from "../../dtos/postgres/test/question.js";
import type { DAO } from "../app/dao.js";
import { DAOConstraintUniqueError, DAOError } from "../app/errors.js";

import {
  getAppQuestionTypeByDb,
  getColumnBySessionField,
  getColumnByUserField,
  getDbQuestionTypeByApp,
} from "./utils.js";

import type { PostgresSession } from "~/dtos/postgres/session.js";
import type { PostgresPassedAnswerOption } from "~/dtos/postgres/test/passed/answer-option.js";
import type { PostgresPassedExtendedAnswer } from "~/dtos/postgres/test/passed/correct-extended-answer.js";
import type { PostgresPassedQuestion } from "~/dtos/postgres/test/passed/question.js";
import type { PostgresPassedTest } from "~/dtos/postgres/test/passed/test.js";
import type { PostgresTest } from "~/dtos/postgres/test/test.js";
import type { PostgresUser } from "~/dtos/postgres/user.js";
import type { Dependencies } from "~/infra/dependencies.js";
import {
  answerOptionTable,
  correctExtendedAnswerTable,
  passedAnswerOptionTable,
  passedExtendedAnswerTable,
  passedQuestionTable,
  passedTestTable,
  questionTable,
  sessionTable,
  testTable,
  userTable,
} from "~/infra/drizzle/schema.js";

const CONSTRAINT = {
  userEmail: "user_email_unique",
  sessionRefreshToken: "session_refresh_token_unique",
} as const;

const ERROR_CODE = {
  uniqueViolation: "23505",
} as const;

class PostgresDAO implements DAO {
  constructor(private readonly db: Dependencies["db"]) {}

  async createUser(
    email: User["email"],
    password: User["password"],
    activationLink: User["activationLink"],
  ): Promise<User["id"]> {
    try {
      const result = await this.db.execute<PostgresUser>(sql`
        INSERT INTO
          ${userTable} (email, password, activation_link)
        VALUES
          (
            ${email},
            ${password},
            ${activationLink}
          )
        RETURNING
          *
      `);

      const { id } = result.rows[0] ?? {};

      if (id === undefined) {
        throw new DAOError("Failed to register user account.");
      }

      return id;
    } catch (e) {
      if (
        e instanceof DatabaseError &&
        e.code === ERROR_CODE.uniqueViolation &&
        e.constraint === CONSTRAINT.userEmail
      ) {
        throw new DAOConstraintUniqueError((e as Error).message, "User.email");
      }
      throw e;
    }
  }

  async getUserBy<T extends UserFieldName>(
    fieldName: T,
    value: User[T],
  ): Promise<User | undefined> {
    const result = await this.db.execute<PostgresUser>(sql`
      SELECT
        *
      FROM
        ${userTable}
      WHERE
        ${getColumnByUserField(fieldName)} = ${value}
    `);
    const user = result.rows[0];

    return user && mapDbUserToApp(user);
  }

  async activateUser(id: User["id"]): Promise<void> {
    const result = await this.db.execute(sql`
      UPDATE ${userTable}
      SET
        is_activated = ${true}
      WHERE
        id = ${id}
    `);

    if (result.rowCount !== 1) {
      throw new DAOError("Failed to activate user account.");
    }
  }

  async getUsers(): Promise<User[]> {
    const result = await this.db.execute<PostgresUser>(sql`
      SELECT
        *
      FROM
        ${userTable}
    `);

    return result.rows.map(mapDbUserToApp);
  }

  async createSession(
    userId: User["id"],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<Session["id"]> {
    try {
      const result = await this.db.execute<PostgresSession>(sql`
        INSERT INTO
          ${sessionTable} (refresh_token, user_id, expires)
        VALUES
          (
            ${refreshToken},
            ${userId},
            ${expires}
          )
        RETURNING
          *
      `);

      const { id } = result.rows[0] ?? {};

      if (id === undefined) {
        throw new DAOError("Failed to create session.");
      }

      return id;
    } catch (e) {
      if (
        e instanceof DatabaseError &&
        e.code === ERROR_CODE.uniqueViolation &&
        e.constraint === CONSTRAINT.sessionRefreshToken
      ) {
        throw new DAOConstraintUniqueError((e as Error).message, "Session.refreshToken");
      }
      throw e;
    }
  }

  async getSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
  ): Promise<Session | undefined> {
    const result = await this.db.execute<PostgresSession>(sql`
      SELECT
        *
      FROM
        ${sessionTable}
      WHERE
        ${getColumnBySessionField(fieldName)} = ${value}
    `);

    const session = result.rows[0];

    return (
      session && {
        id: session.id,
        userId: session.user_id,
        refreshToken: session.refresh_token,
        expires: session.expires,
      }
    );
  }

  async updateSessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
    refreshToken: Session["refreshToken"],
    expires: Session["expires"],
  ): Promise<void> {
    const result = await this.db.execute(sql`
      UPDATE ${sessionTable}
      SET
        refresh_token = ${refreshToken},
        expires = ${expires}
      WHERE
        ${getColumnBySessionField(fieldName)} = ${value}
    `);

    if (result.rowCount !== 1) {
      throw new DAOError("Failed to update session.");
    }
  }

  async destroySessionBy<T extends SessionFieldName>(
    fieldName: T,
    value: Session[T],
  ): Promise<void> {
    const result = await this.db.execute(sql`
      DELETE FROM ${sessionTable}
      WHERE
        ${getColumnBySessionField(fieldName)} = ${value}
    `);
    if (result.rowCount !== 1) {
      throw new DAOError("Failed to destroy session.");
    }
  }

  async createTest(author_id: User["id"], test: Test): Promise<Test["id"]> {
    return await this.db.transaction(async (tx) => {
      const errorText = "Failed to create test.";

      const result = await tx.execute<PostgresTest>(sql`
        INSERT INTO
          ${testTable} (author_id, title)
        VALUES
          (
            ${author_id},
            ${test.title}
          )
        RETURNING
          *
      `);
      const { id: testId } = result.rows[0] ?? {};
      if (testId === undefined) throw new DAOError(errorText);

      for (const question of test.questions) {
        const result = await tx.execute<PostgresQuestion>(sql`
          INSERT INTO
            ${questionTable} (test_id, type, content, worth)
          VALUES
            (
              ${testId},
              ${getDbQuestionTypeByApp(question.type)},
              ${question.content},
              ${question.worth}
            )
          RETURNING
            *
        `);
        const { id: questionId } = result.rows[0] ?? {};
        if (questionId === undefined) throw new DAOError(errorText);

        if (question.type === QuestionType.EXTENDED) {
          const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToEdit;
          const result = await tx.execute<PostgresExtendedAnswer>(sql`
            INSERT INTO
              ${correctExtendedAnswerTable} (question_id, content)
            VALUES
              (
                ${questionId},
                ${questionWithExtendedAnswer.correctAnswer}
              )
            RETURNING
              *
          `);
          if (result.rows[0]?.id === undefined) throw new DAOError(errorText);
        } else {
          const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToEdit;
          for (const answerOption of questionWithAnswerOptions.answerOptions) {
            const result = await tx.execute<PostgresAnswerOption>(sql`
              INSERT INTO
                ${answerOptionTable} (question_id, content, is_correct)
              VALUES
                (
                  ${questionId},
                  ${answerOption.content},
                  ${answerOption.isCorrect}
                )
              RETURNING
                *
            `);
            if (result.rows[0]?.id === undefined) throw new DAOError(errorText);
          }
        }
      }

      return testId;
    });
  }

  async getTestToEdit(test_id: Test["id"]): Promise<Test | undefined> {
    const selectTestResult = await this.db.execute<PostgresTest>(sql`
      SELECT
        *
      FROM
        ${testTable}
      WHERE
        ${testTable.id} = ${test_id}
    `);
    const test = selectTestResult.rows[0];
    if (test === undefined) return;

    const testToEdit = { id: test.id, title: test.title, questions: [] } as Test;

    const selectQuestionResult = await this.db.execute<PostgresQuestion>(sql`
      SELECT
        *
      FROM
        ${questionTable}
      WHERE
        ${questionTable.testId} = ${test.id}
    `);
    const questions = selectQuestionResult.rows;

    for (const question of questions) {
      if (question.type === getDbQuestionTypeByApp(QuestionType.EXTENDED)) {
        const selectCorrectExtendedAnswerResult = await this.db.execute<
          typeof correctExtendedAnswerTable.$inferSelect
        >(sql`
          SELECT
            *
          FROM
            ${correctExtendedAnswerTable}
          WHERE
            ${correctExtendedAnswerTable.questionId} = ${question.id}
        `);
        const correctAnswer = selectCorrectExtendedAnswerResult.rows[0];
        if (correctAnswer === undefined) return;

        testToEdit.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
          content: question.content,
          worth: question.worth,
          correctAnswer: correctAnswer.content,
        } as QuestionWithExtendedAnswerToEdit);
      } else {
        const selectAnswerOptionResult = await this.db.execute<PostgresAnswerOption>(sql`
          SELECT
            *
          FROM
            ${answerOptionTable}
          WHERE
            question_id = ${question.id}
        `);
        const answerOptions = selectAnswerOptionResult.rows;
        testToEdit.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
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

  async updateTest(test: Test): Promise<void> {
    return await this.db.transaction(async (tx) => {
      const errorText = "Failed to update test.";

      const updateTestResult = await tx.execute(sql`
        UPDATE ${testTable}
        SET
          title = ${test.title}
        WHERE
          id = ${test.id}
      `);
      if (updateTestResult.rowCount !== 1) throw new DAOError(errorText);

      const selectOldQuestionsResult = await tx.execute<PostgresQuestion>(sql`
        SELECT
          *
        FROM
          ${questionTable}
        WHERE
          ${questionTable.testId} = ${test.id}
      `);
      const oldQuestions = selectOldQuestionsResult.rows;

      const unusedQuestions = oldQuestions.filter((oldQuestion) => {
        return test.questions.findIndex((question) => question.id === oldQuestion.id) === -1;
      });

      for (const question of unusedQuestions) {
        if (question.type === getDbQuestionTypeByApp(QuestionType.EXTENDED)) {
          const selectUnusedExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(sql`
            SELECT
              ${correctExtendedAnswerTable}.*
            FROM
              ${correctExtendedAnswerTable}
              INNER JOIN ${passedExtendedAnswerTable} ON ${correctExtendedAnswerTable.id} = ${passedExtendedAnswerTable.correctAnswerId}
            WHERE
              ${correctExtendedAnswerTable.questionId} = ${question.id}
          `);
          const unusedExtendedAnswer = selectUnusedExtendedAnswerResult.rows[0];

          if (unusedExtendedAnswer === undefined) {
            const result = await tx.execute(sql`
              DELETE FROM ${correctExtendedAnswerTable}
              WHERE
                ${correctExtendedAnswerTable.questionId} = ${question.id}
            `);
            if (result.rowCount !== 1) throw new DAOError(errorText);
          } else {
            const result = await tx.execute(sql`
              UPDATE ${correctExtendedAnswerTable}
              SET
                question_id = NULL
              WHERE
                ${correctExtendedAnswerTable.questionId} = ${question.id}
            `);
            if (result.rowCount !== 1) throw new DAOError(errorText);
          }
        } else {
          const selectUnusedAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
            SELECT
              *
            FROM
              ${answerOptionTable}
            WHERE
              ${answerOptionTable.questionId} = ${question.id}
          `);
          const unusedAnswerOptions = selectUnusedAnswerOptionsResult.rows;
          const selectPassedAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
            SELECT
              ${answerOptionTable}.*
            FROM
              answer_option
              INNER JOIN ${passedAnswerOptionTable} ON ${answerOptionTable.id} = ${passedAnswerOptionTable.answerOptionId}
            WHERE
              ${answerOptionTable.questionId} = ${question.id}
          `);
          const passedAnswerOptions = selectPassedAnswerOptionsResult.rows;

          const answerOptionsToDelete = unusedAnswerOptions.filter(
            (answerOption) =>
              passedAnswerOptions.findIndex(
                (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
              ) === -1,
          );

          for (const answerOption of passedAnswerOptions) {
            const result = await tx.execute(sql`
              UPDATE ${answerOptionTable}
              SET
                question_id = NULL
              WHERE
                ${answerOptionTable.id} = ${answerOption.id}
            `);
            if (result.rowCount !== 1) throw new DAOError(errorText);
          }

          for (const answerOption of answerOptionsToDelete) {
            const result = await tx.execute(sql`
              DELETE FROM ${answerOptionTable}
              WHERE
                ${answerOptionTable.id} = ${answerOption.id}
            `);
            if (result.rowCount !== 1) throw new DAOError(errorText);
          }
        }

        const selectUsedQuestionResult = await tx.execute<PostgresQuestion>(sql`
          SELECT
            *
          FROM
            ${questionTable}
            INNER JOIN ${passedQuestionTable} ON ${questionTable.id} = ${passedQuestionTable.questionId}
          WHERE
            ${questionTable.id} = ${question.id}
        `);
        const usedQuestion = selectUsedQuestionResult.rows[0];

        if (usedQuestion === undefined) {
          const result = await tx.execute(sql`
            DELETE FROM ${questionTable}
            WHERE
              ${questionTable.id} = ${question.id}
          `);
          if (result.rowCount !== 1) throw new DAOError(errorText);
        } else {
          const result = await tx.execute(sql`
            UPDATE ${questionTable}
            SET
              test_id = NULL
            WHERE
              ${questionTable.id} = ${question.id}
          `);
          if (result.rowCount !== 1) throw new DAOError(errorText);
        }
      }

      for (const question of test.questions) {
        if (question.id > 0) {
          const oldQuestion = oldQuestions.find((oldQuestion) => oldQuestion.id === question.id);
          if (oldQuestion === undefined) return;

          const selectUsedQuestionResult = await tx.execute<PostgresQuestion>(sql`
            SELECT
              *
            FROM
              ${questionTable}
              INNER JOIN ${passedQuestionTable} ON ${questionTable.id} = ${passedQuestionTable.questionId}
            WHERE
              ${questionTable.id} = ${question.id}
          `);
          const usedQuestion = selectUsedQuestionResult.rows[0];

          if (usedQuestion === undefined) {
            const result = await tx.execute(sql`
              UPDATE ${questionTable}
              SET
                type = ${getDbQuestionTypeByApp(question.type)},
                content = ${question.content},
                worth = ${question.worth}
              WHERE
                ${questionTable.id} = ${question.id}
            `);
            if (result.rowCount !== 1) throw new DAOError(errorText);
          } else if (
            question.type !== usedQuestion.type ||
            question.content !== usedQuestion.content ||
            question.worth !== usedQuestion.worth
          ) {
            const updateQuestionResult = await tx.execute(sql`
              UPDATE ${questionTable}
              SET
                test_id = NULL
              WHERE
                ${questionTable.id} = ${question.id}
            `);
            if (updateQuestionResult.rowCount !== 1) throw new DAOError(errorText);

            const insertQuestionResult = await tx.execute<PostgresQuestion>(sql`
              INSERT INTO
                question (test_id, type, content, worth)
              VALUES
                (
                  ${test.id},
                  ${getDbQuestionTypeByApp(question.type)},
                  ${question.content},
                  ${question.worth}
                )
              RETURNING
                *
            `);
            if (insertQuestionResult.rows[0]?.id === undefined) throw new DAOError(errorText);

            question.id = insertQuestionResult.rows[0].id;

            if (question.type === usedQuestion.type) {
              if (question.type === QuestionType.EXTENDED) {
                const updateCorrectExtendedAnswerResult = await tx.execute(sql`
                  UPDATE ${correctExtendedAnswerTable}
                  SET
                    question_id = ${question.id}
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${oldQuestion.id}
                `);
                if (updateCorrectExtendedAnswerResult.rowCount === 0) throw new DAOError(errorText);
              } else {
                const updateAnswerOptionResult = await tx.execute(sql`
                  UPDATE ${answerOptionTable}
                  SET
                    question_id = ${question.id}
                  WHERE
                    ${answerOptionTable.questionId} = ${oldQuestion.id}
                `);
                if (updateAnswerOptionResult.rowCount === 0) throw new DAOError(errorText);
              }
            }
          }

          if (question.type === QuestionType.EXTENDED) {
            if (question.type === getAppQuestionTypeByDb(oldQuestion.type)) {
              const selectCorrectExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(
                sql`
                  SELECT
                    *
                  FROM
                    ${correctExtendedAnswerTable}
                    INNER JOIN ${passedExtendedAnswerTable} ON ${correctExtendedAnswerTable.id} = ${passedExtendedAnswerTable.correctAnswerId}
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${question.id}
                `,
              );
              const usedExtendedAnswer = selectCorrectExtendedAnswerResult.rows[0];

              if (usedExtendedAnswer === undefined) {
                const updateCorrectExtendedAnswerResult = await tx.execute(sql`
                  UPDATE ${correctExtendedAnswerTable}
                  SET
                    content = ${(question as QuestionWithExtendedAnswerToEdit).correctAnswer}
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${question.id}
                `);
                if (updateCorrectExtendedAnswerResult.rowCount !== 1) throw new DAOError(errorText);
              } else {
                const updateCorrectExtendedAnswerResult = await tx.execute(sql`
                  UPDATE ${correctExtendedAnswerTable}
                  SET
                    question_id = NULL
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${question.id}
                `);
                if (updateCorrectExtendedAnswerResult.rowCount !== 1) throw new DAOError(errorText);

                const insertCorrectExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(
                  sql`
                    INSERT INTO
                      ${correctExtendedAnswerTable} (question_id, content)
                    VALUES
                      (
                        ${question.id},
                        ${(question as QuestionWithExtendedAnswerToEdit).correctAnswer}
                      )
                    RETURNING
                      *
                  `,
                );
                if (insertCorrectExtendedAnswerResult.rows[0]?.id === undefined)
                  throw new DAOError(errorText);
              }
            } else {
              const insertCorrectExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(
                sql`
                  INSERT INTO
                    ${correctExtendedAnswerTable} (question_id, content)
                  VALUES
                    (
                      ${question.id},
                      ${(question as QuestionWithExtendedAnswerToEdit).correctAnswer}
                    )
                  RETURNING
                    *
                `,
              );
              if (insertCorrectExtendedAnswerResult.rows[0]?.id === undefined)
                throw new DAOError(errorText);

              const selectUnusedAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
                SELECT
                  *
                FROM
                  answer_option
                WHERE
                  answer_option.question_id = ${question.id}
              `);
              const unusedAnswerOptions = selectUnusedAnswerOptionsResult.rows;
              const selectPassedAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
                SELECT
                  answer_option.*
                FROM
                  answer_option
                  INNER JOIN passed_answer_option ON answer_option.id = passed_answer_option.answer_option_id
                WHERE
                  answer_option.question_id = ${question.id}
              `);
              const passedAnswerOptions = selectPassedAnswerOptionsResult.rows;

              const answerOptionsToDelete = unusedAnswerOptions.filter(
                (answerOption) =>
                  passedAnswerOptions.findIndex(
                    (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
                  ) === -1,
              );

              for (const answerOption of passedAnswerOptions) {
                const result = await tx.execute(sql`
                  UPDATE ${answerOptionTable}
                  SET
                    question_id = NULL
                  WHERE
                    ${answerOptionTable.id} = ${answerOption.id}
                `);
                if (result.rowCount !== 1) throw new DAOError(errorText);
              }

              for (const answerOption of answerOptionsToDelete) {
                const result = await tx.execute(sql`
                  DELETE FROM answer_option
                  WHERE
                    id = ${answerOption.id}
                `);
                if (result.rowCount !== 1) throw new DAOError(errorText);
              }
            }
          } else if (
            [
              QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
              QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
            ].includes(question.type)
          ) {
            if (
              [
                QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION,
                QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
              ].includes(getAppQuestionTypeByDb(oldQuestion.type))
            ) {
              const selectOldAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
                SELECT
                  *
                FROM
                  ${answerOptionTable}
                WHERE
                  ${answerOptionTable.questionId} = ${question.id}
              `);
              const oldAnswerOptions = selectOldAnswerOptionsResult.rows;
              const unusedAnswerOptions = oldAnswerOptions.filter((oldAnswerOption) => {
                return (
                  (question as QuestionWithAnswerOptionsToEdit).answerOptions.findIndex(
                    (answerOption) => answerOption.id === oldAnswerOption.id,
                  ) === -1
                );
              });
              const selectPassedAnswerOptionsResult = await tx.execute<PostgresAnswerOption>(sql`
                SELECT
                  ${answerOptionTable}.*
                FROM
                  ${answerOptionTable}
                  INNER JOIN ${passedAnswerOptionTable} ON ${answerOptionTable.id} = ${passedAnswerOptionTable.answerOptionId}
                WHERE
                  ${answerOptionTable.questionId} = ${question.id}
              `);
              const passedAnswerOptions = selectPassedAnswerOptionsResult.rows;

              const answerOptionsToDelete = unusedAnswerOptions.filter(
                (answerOption) =>
                  passedAnswerOptions.findIndex(
                    (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
                  ) === -1,
              );

              const passedAnswerOptionsToDelete = unusedAnswerOptions.filter(
                (answerOption) =>
                  passedAnswerOptions.findIndex(
                    (passedAnswerOption) => answerOption.id === passedAnswerOption.id,
                  ) !== -1,
              );

              for (const answerOption of passedAnswerOptionsToDelete) {
                const updateAnswerOptionResult = await tx.execute(sql`
                  UPDATE ${answerOptionTable}
                  SET
                    question_id = NULL
                  WHERE
                    ${answerOptionTable.id} = ${answerOption.id}
                `);
                if (updateAnswerOptionResult.rowCount !== 1) throw new DAOError(errorText);
              }

              for (const answerOption of answerOptionsToDelete) {
                const result = await tx.execute(sql`
                  DELETE FROM ${answerOptionTable}
                  WHERE
                    ${answerOptionTable.id} = ${answerOption.id}
                `);
                if (result.rowCount !== 1) throw new DAOError(errorText);
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
                    const updateAnswerOptionResult = await tx.execute(sql`
                      UPDATE ${answerOptionTable}
                      SET
                        question_id = NULL
                      WHERE
                        ${answerOptionTable.id} = ${answerOption.id}
                    `);
                    if (updateAnswerOptionResult.rowCount !== 1) throw new DAOError(errorText);

                    const insertAnswerOptionResult = await tx.execute<PostgresAnswerOption>(sql`
                      INSERT INTO
                        ${answerOptionTable} (question_id, content, is_correct)
                      VALUES
                        (
                          ${question.id},
                          ${answerOption.content},
                          ${answerOption.isCorrect}
                        )
                      RETURNING
                        *
                    `);
                    if (insertAnswerOptionResult.rows[0]?.id === undefined)
                      throw new DAOError(errorText);
                  } else {
                    const result = await tx.execute(sql`
                      UPDATE ${answerOptionTable}
                      SET
                        content = ${answerOption.content},
                        is_correct = ${answerOption.isCorrect}
                      WHERE
                        ${answerOptionTable.id} = ${answerOption.id}
                    `);
                    if (result.rowCount !== 1) throw new DAOError(errorText);
                  }
                } else {
                  const insertAnswerOptionResult = await tx.execute<PostgresAnswerOption>(sql`
                    INSERT INTO
                      ${answerOptionTable} (question_id, content, is_correct)
                    VALUES
                      (
                        ${question.id},
                        ${answerOption.content},
                        ${answerOption.isCorrect}
                      )
                    RETURNING
                      *
                  `);
                  if (insertAnswerOptionResult.rows[0]?.id === undefined)
                    throw new DAOError(errorText);
                }
              }
            } else {
              for (const answerOption of (question as QuestionWithAnswerOptionsToEdit)
                .answerOptions) {
                const insertAnswerOptionResult = await tx.execute<PostgresAnswerOption>(sql`
                  INSERT INTO
                    answer_option (question_id, content, is_correct)
                  VALUES
                    (
                      ${question.id},
                      ${answerOption.content},
                      ${answerOption.isCorrect}
                    )
                  RETURNING
                    *
                `);
                if (insertAnswerOptionResult.rows[0]?.id === undefined)
                  throw new DAOError(errorText);
              }

              const selectUnusedExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(sql`
                SELECT
                  *
                FROM
                  ${correctExtendedAnswerTable}
                  INNER JOIN ${passedExtendedAnswerTable} ON ${correctExtendedAnswerTable.id} = ${passedExtendedAnswerTable.correctAnswerId}
                WHERE
                  ${correctExtendedAnswerTable.questionId} = ${oldQuestion.id}
              `);
              const unusedExtendedAnswer = selectUnusedExtendedAnswerResult.rows[0];

              if (unusedExtendedAnswer === undefined) {
                const result = await tx.execute(sql`
                  DELETE FROM ${correctExtendedAnswerTable}
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${oldQuestion.id}
                `);
                if (result.rowCount !== 1) throw new DAOError(errorText);
              } else {
                const result = await tx.execute(sql`
                  UPDATE ${correctExtendedAnswerTable}
                  SET
                    question_id = NULL
                  WHERE
                    ${correctExtendedAnswerTable.questionId} = ${oldQuestion.id}
                `);
                if (result.rowCount !== 1) throw new DAOError(errorText);
              }
            }
          }
        } else {
          const insertQuestionResult = await tx.execute<PostgresQuestion>(sql`
            INSERT INTO
              question (test_id, type, content, worth)
            VALUES
              (
                ${test.id},
                ${question.type},
                ${question.content},
                ${question.worth}
              )
            RETURNING
              *
          `);
          const { id: questionId } = insertQuestionResult.rows[0] ?? {};
          if (questionId === undefined) throw new DAOError(errorText);

          if (question.type === QuestionType.EXTENDED) {
            const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToEdit;
            const insertCorrectExtendedAnswerResult = await tx.execute<PostgresExtendedAnswer>(sql`
              INSERT INTO
                ${correctExtendedAnswerTable} (question_id, content)
              VALUES
                (
                  ${questionId},
                  ${questionWithExtendedAnswer.correctAnswer}
                )
              RETURNING
                *
            `);
            if (insertCorrectExtendedAnswerResult.rows[0]?.id === undefined)
              throw new DAOError(errorText);
          } else {
            const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToEdit;
            for (const answerOption of questionWithAnswerOptions.answerOptions) {
              const insertAnswerOptionResult = await tx.execute<PostgresAnswerOption>(sql`
                INSERT INTO
                  ${answerOptionTable} (question_id, content, is_correct)
                VALUES
                  (
                    ${questionId},
                    ${answerOption.content},
                    ${answerOption.isCorrect}
                  )
                RETURNING
                  *
              `);
              if (insertAnswerOptionResult.rows[0]?.id === undefined) throw new DAOError(errorText);
            }
          }
        }
      }
    });
  }

  async getTestAuthor(test_id: Test["id"]): Promise<User | undefined> {
    const result = await this.db.execute<PostgresUser>(sql`
      SELECT
        ${userTable}.*
      FROM
        ${userTable}
        INNER JOIN ${testTable} ON ${userTable.id} = ${testTable.authorId}
      WHERE
        ${testTable.id} = ${test_id}
    `);
    const user = result.rows[0];

    return user && mapDbUserToApp(user);
  }

  async getBriefTests(): Promise<BriefTest[]> {
    const result = await this.db.execute<BriefTest>(sql`
      SELECT
        ${testTable.id},
        ${testTable.title},
        count(${questionTable.id}) AS "numberOfQuestions",
        sum(${questionTable.worth}) AS "grade"
      FROM
        ${testTable}
        LEFT JOIN ${questionTable} ON ${testTable.id} = ${questionTable.testId}
      GROUP BY
        ${testTable.id},
        ${testTable.title}
    `);

    return result.rows;
  }

  async getBriefTestsCreatedByUser(authorId: User["id"]): Promise<BriefTest[]> {
    const result = await this.db.execute<BriefTest>(sql`
      SELECT
        ${testTable.id},
        ${testTable.title},
        count(${questionTable.id}) AS "numberOfQuestions",
        sum(${questionTable.worth}) AS "grade"
      FROM
        ${testTable}
        LEFT JOIN ${questionTable} ON ${testTable.id} = ${questionTable.testId}
      WHERE
        ${testTable.authorId} = ${authorId}
      GROUP BY
        ${testTable.id},
        ${testTable.title}
    `);

    return result.rows;
  }

  async getBriefTestsPassedByUser(passingId: User["id"]): Promise<BriefPassedTest[]> {
    const result = await this.db.execute<BriefPassedTest>(sql`
      SELECT
        ${passedTestTable.id},
        ${testTable.title},
        (
          SELECT
            count(*)
          FROM
            ${passedQuestionTable}
          WHERE
            ${passedQuestionTable.passedTestId} = ${passedTestTable.id}
        ) AS "numberOfQuestions",
        (
          SELECT
            sum(${questionTable.worth})
          FROM
            ${passedQuestionTable}
            INNER JOIN ${questionTable} ON ${passedQuestionTable.questionId} = ${questionTable.id}
          WHERE
            ${passedQuestionTable.passedTestId} = ${passedTestTable.id}
        ) AS "grade",
        sum(
          CASE question.type
            WHEN 'EXTENDED' THEN CASE ${passedExtendedAnswerTable.content}
              WHEN ${correctExtendedAnswerTable.content} THEN ${questionTable.worth}
              ELSE 0
            END
            WHEN 'WITH_ONE_CORRECT_ANSWER_OPTION' THEN CASE (
                SELECT
                  count(*)
                FROM
                  ${passedAnswerOptionTable} AS pao
                  INNER JOIN ${answerOptionTable} AS ao ON pao.answer_option_id = ao.id
                  INNER JOIN ${passedQuestionTable} AS pq ON pao.passed_question_id = pq.id
                WHERE
                  pq.id = ${passedQuestionTable.id}
                  AND pao.is_chosen = ao.is_correct
                  AND ao.is_correct = TRUE
              )
              WHEN 1 THEN ${questionTable.worth}
              ELSE 0
            END
            WHEN 'WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS' THEN CASE
              WHEN (
                (
                  SELECT
                    count(*)
                  FROM
                    ${passedAnswerOptionTable} AS pao
                    INNER JOIN ${answerOptionTable} AS ao ON pao.answer_option_id = ao.id
                    INNER JOIN ${passedQuestionTable} AS pq ON pao.passed_question_id = pq.id
                  WHERE
                    pq.id = ${passedQuestionTable.id}
                    AND pao.is_chosen = TRUE
                    AND ao.is_correct = FALSE
                )
              ) > 0 THEN 0
              ELSE (
                cast(
                  (
                    SELECT
                      count(*)
                    FROM
                      ${passedAnswerOptionTable} AS pao
                      INNER JOIN ${answerOptionTable} AS ao ON pao.answer_option_id = ao.id
                      INNER JOIN ${passedQuestionTable} AS pq ON pao.passed_question_id = pq.id
                    WHERE
                      pq.id = ${passedQuestionTable.id}
                      AND pao.is_chosen = ao.is_correct
                      AND ao.is_correct = TRUE
                  ) AS REAL
                ) / (
                  SELECT
                    count(*)
                  FROM
                    ${passedAnswerOptionTable} AS pao
                    INNER JOIN ${answerOptionTable} AS ao ON pao.answer_option_id = ao.id
                  WHERE
                    pao.passed_question_id = ${passedQuestionTable.id}
                    AND ao.is_correct = TRUE
                )
              ) * ${questionTable.worth}
            END
          END
        ) AS "score"
      FROM
        ${passedTestTable}
        INNER JOIN ${passedQuestionTable} ON ${passedTestTable.id} = ${passedQuestionTable.passedTestId}
        LEFT JOIN ${passedExtendedAnswerTable} ON ${passedQuestionTable.id} = ${passedExtendedAnswerTable.passedQuestionId}
        INNER JOIN ${testTable} ON ${passedTestTable.testId} = ${testTable.id}
        LEFT JOIN ${questionTable} ON ${passedQuestionTable.questionId} = ${questionTable.id}
        LEFT JOIN ${correctExtendedAnswerTable} ON ${passedExtendedAnswerTable.correctAnswerId} = ${correctExtendedAnswerTable.id}
      WHERE
        ${passedTestTable.passingId} = ${passingId}
      GROUP BY
        ${passedTestTable.id},
        ${testTable.title}
    `);

    return result.rows;
  }

  async getTestToPass(id: Test["id"]): Promise<Test | undefined> {
    const selectTestResult = await this.db.execute<PostgresTest>(sql`
      SELECT
        *
      FROM
        ${testTable}
      WHERE
        ${testTable.id} = ${id}
    `);
    const test = selectTestResult.rows[0];
    if (test === undefined) return;

    const testToPass = { id: test.id, title: test.title, questions: [] } as Test;

    const selectQuestionsResult = await this.db.execute<PostgresQuestion>(sql`
      SELECT
        *
      FROM
        ${questionTable}
      WHERE
        ${questionTable.testId} = ${test.id}
    `);
    const questions = selectQuestionsResult.rows;

    for (const question of questions) {
      if (question.type === getDbQuestionTypeByApp(QuestionType.EXTENDED)) {
        testToPass.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
          content: question.content,
          worth: question.worth,
          enteredAnswer: "",
        } as QuestionWithExtendedAnswerToPass);
      } else {
        const selectAnswerOptionsResult = await this.db.execute<PostgresAnswerOption>(sql`
          SELECT
            *
          FROM
            ${answerOptionTable}
          WHERE
            ${answerOptionTable.questionId} = ${question.id}
        `);
        const answerOptions = selectAnswerOptionsResult.rows;
        testToPass.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
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

  async createPassedTest(passingId: User["id"], test: Test): Promise<Test["id"]> {
    return await this.db.transaction(async (tx) => {
      const errorText = "Failed to create test pass record.";

      const insertPassedTestResult = await tx.execute<PostgresPassedTest>(sql`
        INSERT INTO
          ${passedTestTable} (test_id, passing_id)
        VALUES
          (
            ${test.id},
            ${passingId}
          )
        RETURNING
          *
      `);
      const { id: passedTestId } = insertPassedTestResult.rows[0] ?? {};
      if (passedTestId === undefined) throw new DAOError(errorText);

      for (const question of test.questions) {
        const insertPassedQuestionResult = await tx.execute<
          typeof passedQuestionTable.$inferSelect
        >(sql`
          INSERT INTO
            ${passedQuestionTable} (passed_test_id, question_id)
          VALUES
            (
              ${passedTestId},
              ${question.id}
            )
          RETURNING
            *
        `);
        const { id: passedQuestionId } = insertPassedQuestionResult.rows[0] ?? {};
        if (passedQuestionId === undefined) throw new DAOError(errorText);

        if (question.type === QuestionType.EXTENDED) {
          const selectCorrectExtendedAnswerResult = await tx.execute<
            typeof correctExtendedAnswerTable.$inferSelect
          >(sql`
            SELECT
              *
            FROM
              ${correctExtendedAnswerTable}
            WHERE
              ${correctExtendedAnswerTable.questionId} = ${question.id}
          `);
          const correctAnswer = selectCorrectExtendedAnswerResult.rows[0];
          if (correctAnswer === undefined) throw new DAOError(errorText);

          const questionWithExtendedAnswer = question as QuestionWithExtendedAnswerToPass;
          const insertPassedExtendedAnswerResult = await tx.execute<
            typeof passedExtendedAnswerTable.$inferSelect
          >(sql`
            INSERT INTO
              ${passedExtendedAnswerTable} (passed_question_id, correct_answer_id, content)
            VALUES
              (
                ${passedQuestionId},
                ${correctAnswer.id},
                ${questionWithExtendedAnswer.enteredAnswer}
              )
            RETURNING
              *
          `);
          const { id: passedExtendedAnswerId } = insertPassedExtendedAnswerResult.rows[0] ?? {};
          if (passedExtendedAnswerId === undefined) throw new DAOError(errorText);
        } else {
          const questionWithAnswerOptions = question as QuestionWithAnswerOptionsToPass;
          for (const answerOption of questionWithAnswerOptions.answerOptions) {
            const insertPassedAnswerOptionResult = await tx.execute<
              typeof passedAnswerOptionTable.$inferSelect
            >(sql`
              INSERT INTO
                ${passedAnswerOptionTable} (passed_question_id, answer_option_id, is_chosen)
              VALUES
                (
                  ${passedQuestionId},
                  ${answerOption.id},
                  ${answerOption.isChosen}
                )
              RETURNING
                *
            `);
            const { id: passedAnswerOptionId } = insertPassedAnswerOptionResult.rows[0] ?? {};
            if (passedAnswerOptionId === undefined) throw new DAOError(errorText);
          }
        }
      }

      return passedTestId;
    });
  }

  async getPassedTest(id: Test["id"]): Promise<Test | undefined> {
    const selectAccomplishedTestResult = await this.db.execute<PostgresPassedTest>(sql`
      SELECT
        *
      FROM
        passed_test
      WHERE
        id = ${id}
    `);
    const accomplishedTest = selectAccomplishedTestResult.rows[0];
    if (accomplishedTest === undefined) return;

    const selectTestResult = await this.db.execute<PostgresTest>(sql`
      SELECT
        *
      FROM
        test
      WHERE
        id = ${accomplishedTest.test_id}
    `);
    const test = selectTestResult.rows[0];
    if (test === undefined) return;

    const passedTest = { id: accomplishedTest.id, title: test.title, questions: [] } as Test;

    const selectPassedQuestionsResult = await this.db.execute<PostgresPassedQuestion>(sql`
      SELECT
        *
      FROM
        ${passedQuestionTable}
      WHERE
        ${passedQuestionTable.passedTestId} = ${passedTest.id}
    `);
    const passedQuestions = selectPassedQuestionsResult.rows;

    for (const passedQuestion of passedQuestions) {
      const selectQuestionResult = await this.db.execute<PostgresQuestion>(sql`
        SELECT
          *
        FROM
          ${questionTable}
        WHERE
          ${questionTable.id} = ${passedQuestion.question_id}
      `);
      const question = selectQuestionResult.rows[0];
      if (question === undefined) return;

      if (question.type === getDbQuestionTypeByApp(QuestionType.EXTENDED)) {
        const selectEnteredAnswerResult = await this.db.execute<PostgresPassedExtendedAnswer>(sql`
          SELECT
            *
          FROM
            ${passedExtendedAnswerTable}
          WHERE
            ${passedExtendedAnswerTable.passedQuestionId} = ${passedQuestion.id}
        `);
        const enteredAnswer = selectEnteredAnswerResult.rows[0];
        if (enteredAnswer === undefined) return;

        const selectCorrectExtendedAnswerResult = await this.db.execute<PostgresExtendedAnswer>(sql`
          SELECT
            *
          FROM
            ${correctExtendedAnswerTable}
          WHERE
            ${correctExtendedAnswerTable.id} = ${enteredAnswer.correct_answer_id}
        `);
        const correctAnswer = selectCorrectExtendedAnswerResult.rows[0];
        if (correctAnswer === undefined) return;

        passedTest.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
          content: question.content,
          worth: question.worth,
          correctAnswer: correctAnswer.content,
          enteredAnswer: enteredAnswer.content,
        } as PassedQuestionWithExtendedAnswer);
      } else {
        const selectPassedAnswerOptionsResult = await this.db.execute<PostgresPassedAnswerOption>(
          sql`
            SELECT
              *
            FROM
              ${passedAnswerOptionTable}
            WHERE
              ${passedAnswerOptionTable.passedQuestionId} = ${passedQuestion.id}
          `,
        );
        const passedAnswerOptions = selectPassedAnswerOptionsResult.rows;

        const answerOptions: PostgresAnswerOption[] = [];
        for (const passedAnswerOption of passedAnswerOptions) {
          const selectAnswerOptionResult = await this.db.execute<PostgresAnswerOption>(sql`
            SELECT
              *
            FROM
              ${answerOptionTable}
            WHERE
              ${answerOptionTable.id} = ${passedAnswerOption.answer_option_id}
          `);
          const answerOption = selectAnswerOptionResult.rows[0];
          if (answerOption === undefined) return;

          answerOptions.push(answerOption);
        }
        passedTest.questions.push({
          id: question.id,
          type: getAppQuestionTypeByDb(question.type),
          content: question.content,
          worth: question.worth,
          answerOptions: answerOptions.map((answerOption, index) => {
            const isChosen = passedAnswerOptions[index]?.is_chosen;
            return {
              id: answerOption.id,
              content: answerOption.content,
              isCorrect: answerOption.is_correct,
              isChosen,
            } as AnswerOptionToPass;
          }),
        } as PassedQuestionWithAnswerOptions);
      }
    }

    return passedTest;
  }
}

function mapDbUserToApp(user: PostgresUser) {
  return {
    id: user.id,
    email: user.email,
    password: user.password,
    isActivated: user.is_activated,
    activationLink: user.activation_link,
  };
}

export { PostgresDAO };
