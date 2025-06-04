import z from "zod";

const QUESTION_DISCRIMINATOR_KEY = "type";

const zQuestionType = z.enum(["SHORT_ANSWER", "MULTIPLE_CHOICE"]);
const QUESTION_TYPE = zQuestionType.Values;
type QuestionType = z.infer<typeof zQuestionType>;

const zBasicQuestion = z.object({
  text: z.string().trim().nonempty(),
  points: z.coerce.number().int().positive(),
});
type BasicQuestion = z.infer<typeof zBasicQuestion>;

const zShortAnswerQuestion = zBasicQuestion.extend({
  [QUESTION_DISCRIMINATOR_KEY]: z.literal(QUESTION_TYPE.SHORT_ANSWER),
  answer: z.string().trim().nonempty(),
});
type ShortAnswerQuestion = z.infer<typeof zShortAnswerQuestion>;

const zOneAnswerOption = z.object({
  text: z.string().trim().nonempty(),
});
type OneAnswerOption = z.infer<typeof zOneAnswerOption>;

const zSeveralAnswerOption = zOneAnswerOption.extend({
  isCorrect: z.boolean(),
});
type SeveralAnswerOption = z.infer<typeof zSeveralAnswerOption>;

const zMultipleChoiceQuestionType = z.enum(["ONE", "SEVERAL"]);
const MULTIPLE_CHOICE_QUESTION_TYPE = zMultipleChoiceQuestionType.Values;
type MultipleChoiceQuestionType = z.infer<typeof zMultipleChoiceQuestionType>;

const zMultipleChoiceQuestion = zBasicQuestion.extend({
  [QUESTION_DISCRIMINATOR_KEY]: z.literal(QUESTION_TYPE.MULTIPLE_CHOICE),
  options: z.discriminatedUnion("numberOfCorrect", [
    z.object({
      numberOfCorrect: z.literal(MULTIPLE_CHOICE_QUESTION_TYPE.ONE),
      indexOfCorrect: z.number().int().nonnegative(),
      values: z.array(zOneAnswerOption),
    }),
    z.object({
      numberOfCorrect: z.literal(MULTIPLE_CHOICE_QUESTION_TYPE.SEVERAL),
      values: z.array(zSeveralAnswerOption),
    }),
  ]),
});
type MultipleChoiceQuestion = z.infer<typeof zMultipleChoiceQuestion>;

const zQuestion = z.discriminatedUnion(QUESTION_DISCRIMINATOR_KEY, [
  zShortAnswerQuestion,
  zMultipleChoiceQuestion,
]);
type Question = z.infer<typeof zQuestion>;

const zTest = z.object({
  name: z.string().trim().nonempty(),
  questions: z.array(zQuestion),
});
type Test = z.infer<typeof zTest>;

export {
  MULTIPLE_CHOICE_QUESTION_TYPE,
  QUESTION_DISCRIMINATOR_KEY,
  QUESTION_TYPE,
  zBasicQuestion,
  zMultipleChoiceQuestion,
  zOneAnswerOption,
  zQuestion,
  zQuestionType,
  zSeveralAnswerOption,
  zShortAnswerQuestion,
  zTest,
};
export type {
  BasicQuestion,
  MultipleChoiceQuestion,
  MultipleChoiceQuestionType,
  OneAnswerOption,
  Question,
  QuestionType,
  SeveralAnswerOption,
  ShortAnswerQuestion,
  Test,
};
