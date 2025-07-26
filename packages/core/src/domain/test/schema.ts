import z from "zod";

import { zSchema as zQuestionSchema } from "../question";
import { zSchema as zUserSchema } from "../user";

import { Description, Name, Status } from "./attributes";

import { Zod } from "~/zod";

const zSchema = z.object({
  id: z.number().int(),
  name: Name.zSchema,
  description: Description.zSchema,
  image: Zod.zUrlOrEmptyStr,
  status: Status.zSchema,
  numberOfAttemptsToPass: Zod.zNumberOfAttempts,
  questions: z.array(zQuestionSchema),
  authorId: zUserSchema.shape.id,
  createdAt: z.date(),
  updatedAt: z.date(),
});
type Schema = z.infer<typeof zSchema>;

export { zSchema };
export type { Schema };
