/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { testContract } from "@lightest/core";

import { QuestionType } from "~/dtos/app/test/base/index.js";
import { APIError } from "~/exceptions/api-error.js";
import { tsRestServer } from "~/infra/ts-rest.js";

const testRouter: ReturnType<typeof tsRestServer.router<typeof testContract>> = tsRestServer.router(
  testContract,
  {
    create: async ({ req, body: test }) => {
      const { testService } = req.container.cradle;

      await testService.create((req as unknown as { userId: number }).userId, {
        ...test,
        questions: test.questions.map((question) => ({
          ...question,
          type: convertQuestionTypeToNativeEnum(question.type),
        })),
      });

      return {
        status: 200,
        body: {
          message: "Test created successfully.",
        },
      };
    },
    getTestToEdit: async ({ req, params: { id } }) => {
      const { testService, userService } = req.container.cradle;

      const author = await userService.getTestAuthor(id);
      if (author === undefined || author.id !== (req as unknown as { userId: number }).userId)
        throw APIError.Forbidden("You do not have permission to edit the requested test.");

      const test = await testService.getTestToEdit(id);

      return {
        status: 200,
        body: {
          message: "Test successfully found.",
          payload: {
            ...test,
            questions: test.questions.map(
              (question) =>
                ({
                  ...question,
                  type: convertQuestionTypeFromNativeEnum(question.type),
                }) as any,
            ),
          },
        },
      };
    },
    update: async ({ req, body: test }) => {
      const { testService, userService } = req.container.cradle;

      const author = await userService.getTestAuthor(test.id);

      if (author === undefined || author.id !== (req as unknown as { userId: number }).userId)
        throw APIError.Forbidden("You do not have permission to edit the requested test.");

      const updatedTest = await testService.update({
        ...test,
        questions: test.questions.map((question) => ({
          ...question,
          type: convertQuestionTypeToNativeEnum(question.type),
        })),
      });

      return {
        status: 200,
        body: {
          message: "Test updated successfully.",
          payload: {
            ...updatedTest,
            questions: updatedTest.questions.map(
              (question) =>
                ({
                  ...question,
                  type: convertQuestionTypeFromNativeEnum(question.type),
                }) as any,
            ),
          },
        },
      };
    },
    getBriefTests: async ({ req }) => {
      const { testService } = req.container.cradle;

      const briefTests = await testService.getBriefTests();

      return {
        status: 200,
        body: { message: "Brief tests retrieved successfully.", payload: briefTests },
      };
    },
    getUserCreatedTests: async ({ req }) => {
      const { testService } = req.container.cradle;

      const authorId = (req as unknown as { userId: number }).userId;
      console.log("authorId: ", authorId);
      const briefTests = await testService.getBriefTestsCreatedByUser(authorId);
      console.log(briefTests);
      console.log("\n\n\n");

      return {
        status: 200,
        body: {
          message: "Brief tests created by user received successfully.",
          payload: briefTests,
        },
      };
    },
    getTestsPassedByUser: async ({ req }) => {
      const { testService } = req.container.cradle;

      const passingId = (req as unknown as { userId: number }).userId;
      console.log("passingId: ", passingId);
      const briefTests = await testService.getBriefTestsPassedByUser(passingId);
      console.log(briefTests);
      console.log("\n\n\n");

      return {
        status: 200,
        body: { message: "Brief tests passed by user received successfully.", payload: briefTests },
      };
    },
    getTestToPass: async ({ req, params: { id } }) => {
      const { testService } = req.container.cradle;

      const test = await testService.getTestToPass(id);

      return {
        status: 200,
        body: {
          message: "Test successfully found.",
          payload: {
            ...test,
            questions: test.questions.map(
              (question) =>
                ({
                  ...question,
                  type: convertQuestionTypeFromNativeEnum(question.type),
                }) as any,
            ),
          },
        },
      };
    },
    sendTestForVerification: async ({ req, body: test }) => {
      const { testService } = req.container.cradle;

      const testId = await testService.createPassedTest(
        (req as unknown as { userId: number }).userId,
        {
          ...test,
          questions: test.questions.map((question) => ({
            ...question,
            type: convertQuestionTypeToNativeEnum(question.type),
          })),
        },
      );

      return {
        status: 200,
        body: {
          message: "Test checked successfully.",
          payload: testId,
        },
      };
    },
    getTestResult: async ({ req, params: { id } }) => {
      const { testService } = req.container.cradle;

      const test = await testService.getPassedTest(id);

      return {
        status: 200,
        body: {
          message: "Passed test successfully found.",
          payload: {
            ...test,
            questions: test.questions.map(
              (question) =>
                ({
                  ...question,
                  type: convertQuestionTypeFromNativeEnum(question.type),
                }) as any,
            ),
          },
        },
      };
    },
  },
);

type QuestionTypeUnion =
  | "EXTENDED"
  | "WITH_ONE_CORRECT_ANSWER_OPTION"
  | "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS";

function convertQuestionTypeToNativeEnum(value: QuestionTypeUnion) {
  switch (value) {
    case "EXTENDED":
      return QuestionType.EXTENDED;
    case "WITH_ONE_CORRECT_ANSWER_OPTION":
      return QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION;
    case "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS":
      return QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS;
  }
}

function convertQuestionTypeFromNativeEnum(value: QuestionType) {
  switch (value) {
    case QuestionType.EXTENDED:
      return "EXTENDED";
    case QuestionType.WITH_ONE_CORRECT_ANSWER_OPTION:
      return "WITH_ONE_CORRECT_ANSWER_OPTION";
    case QuestionType.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS:
      return "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS";
  }
}

export { testRouter };
