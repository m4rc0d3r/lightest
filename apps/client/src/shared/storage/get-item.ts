import { either, function as f, json } from "fp-ts";
import type { z } from "zod";

function getItem<Schema extends z.ZodSchema>(
  storage: Storage,
  key: Parameters<Storage["getItem"]>[0],
  schema: Schema,
  fallback: z.infer<Schema>,
) {
  return f.pipe(
    storage.getItem(key),
    either.fromNullable(() => fallback),
    either.flatMap(json.parse),
    either.flatMap((value) => {
      const { success, data } = schema.safeParse(value);
      return success ? either.right(data) : either.left(fallback);
    }),
    either.orElse(() => either.right(fallback)),
    either.toUnion,
  );
}

export { getItem };
