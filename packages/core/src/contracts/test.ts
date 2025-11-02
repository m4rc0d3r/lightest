import { initContract } from "@ts-rest/core";
import { z } from "zod";

const QUESTION_DISCRIMINATOR_KEY = "type";

const zQuestionType = z.enum([
  "EXTENDED",
  "WITH_ONE_CORRECT_ANSWER_OPTION",
  "WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS",
]);
const QUESTION_TYPES = zQuestionType.Values;

const zBasicQuestion = z.object({
  id: z.number(),
  content: z.string(),
  worth: z.number(),
});

const zOpenQuestion = zBasicQuestion.extend({
  [QUESTION_DISCRIMINATOR_KEY]: z.literal(QUESTION_TYPES.EXTENDED),
  correctAnswer: z.string(),
});

const zAnswerOption = z.object({
  id: z.number(),
  content: z.string(),
  isCorrect: z.boolean(),
});

const zChoiceQuestion = zBasicQuestion.extend({
  [QUESTION_DISCRIMINATOR_KEY]: z.enum([
    QUESTION_TYPES.WITH_ONE_CORRECT_ANSWER_OPTION,
    QUESTION_TYPES.WITH_MULTIPLE_CORRECT_ANSWER_OPTIONS,
  ]),
  answerOptions: z.array(zAnswerOption),
});

const zTest = z.object({
  id: z.number(),
  title: z.string(),
});

const zBriefTest = z.object({
  id: z.number(),
  title: z.string(),
  numberOfQuestions: z.number(),
  grade: z.number(),
});
const zBriefTests = z.array(zBriefTest);

const zBriefPassedTest = zBriefTest.extend({
  score: z.number(),
});

const zResSuccessfulBody = z.object({
  message: z.string(),
});

const zFullTest = zTest.extend({
  questions: z.array(
    z.discriminatedUnion(QUESTION_DISCRIMINATOR_KEY, [zOpenQuestion, zChoiceQuestion]),
  ),
});

const zGetTestToEditResSuccessfulBody = zResSuccessfulBody.extend({
  payload: zFullTest,
});

const zServerErrorSchema = z.object({
  code: z.literal("GENERAL"),
  message: z.string(),
});

const zTestIdAsPathParam = z.coerce.number().pipe(zTest.shape.id);

const c = initContract();
const testContract = c.router(
  {
    create: {
      method: "POST",
      path: "/create",
      body: zFullTest,
      responses: {
        200: zResSuccessfulBody,
        500: zServerErrorSchema,
      },
    },
    getTestToEdit: {
      method: "GET",
      path: "/test-to-edit/:id",
      pathParams: z.object({
        id: zTestIdAsPathParam,
      }),
      responses: {
        200: zGetTestToEditResSuccessfulBody,
        403: z.object({
          code: z.literal("FORBIDDEN"),
          message: z.string(),
        }),
        500: zServerErrorSchema,
      },
    },
    update: {
      method: "POST",
      path: "/edit",
      body: zTest.extend({
        questions: z.array(
          z.discriminatedUnion(QUESTION_DISCRIMINATOR_KEY, [zOpenQuestion, zChoiceQuestion]),
        ),
      }),
      responses: {
        200: zGetTestToEditResSuccessfulBody,
        500: zServerErrorSchema,
      },
    },
    getBriefTests: {
      method: "GET",
      path: "/brief-tests",
      responses: {
        200: zResSuccessfulBody.extend({
          payload: zBriefTests,
        }),
        500: zServerErrorSchema,
      },
    },
    getUserCreatedTests: {
      method: "GET",
      path: "/created-by-user",
      responses: {
        200: zResSuccessfulBody.extend({
          payload: zBriefTests,
        }),
        500: zServerErrorSchema,
      },
    },
    getTestsPassedByUser: {
      method: "GET",
      path: "/passed-by-user",
      responses: {
        200: zResSuccessfulBody.extend({
          payload: z.array(zBriefPassedTest),
        }),
        500: zServerErrorSchema,
      },
    },
    getTestToPass: {
      method: "GET",
      path: "/test-to-pass/:id",
      pathParams: z.object({
        id: zTestIdAsPathParam,
      }),
      responses: {
        200: zGetTestToEditResSuccessfulBody,
        401: z.object({
          code: z.literal("UNAUTHORIZED"),
          message: z.string(),
        }),
        500: zServerErrorSchema,
      },
    },
    sendTestForVerification: {
      method: "POST",
      path: "/create-passed",
      body: zTest.extend({
        questions: z.array(
          z.discriminatedUnion(QUESTION_DISCRIMINATOR_KEY, [
            zOpenQuestion
              .omit({
                correctAnswer: true,
              })
              .extend({
                enteredAnswer: zOpenQuestion.shape.correctAnswer,
              }),
            zChoiceQuestion
              .omit({
                answerOptions: true,
              })
              .extend({
                answerOptions: z.array(
                  zAnswerOption
                    .omit({
                      isCorrect: true,
                    })
                    .extend({
                      isChosen: z.boolean(),
                    }),
                ),
              }),
          ]),
        ),
      }),
      responses: {
        200: zResSuccessfulBody.extend({
          payload: zTest.shape.id,
        }),
        500: zServerErrorSchema,
      },
    },
    getTestResult: {
      method: "GET",
      path: "/passed/:id",
      pathParams: zTest.pick({
        id: true,
      }),
      responses: {
        200: zResSuccessfulBody.extend({
          payload: zTest.extend({
            questions: z.array(
              z.discriminatedUnion(QUESTION_DISCRIMINATOR_KEY, [
                zOpenQuestion.extend({
                  enteredAnswer: zOpenQuestion.shape.correctAnswer,
                }),
                zChoiceQuestion
                  .omit({
                    answerOptions: true,
                  })
                  .extend({
                    answerOptions: z.array(
                      zAnswerOption.extend({
                        isChosen: z.boolean(),
                      }),
                    ),
                  }),
              ]),
            ),
          }),
        }),
        401: z.object({
          code: z.literal("UNAUTHORIZED"),
          message: z.string(),
        }),
        500: zServerErrorSchema,
      },
    },
  },
  {
    pathPrefix: "/api/tests",
  },
);

export { testContract };
