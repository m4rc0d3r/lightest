import { either, function as f, json } from "fp-ts";

import { UnexpectedError } from "../error";

function setItem(storage: Storage, key: Parameters<Storage["setItem"]>[0], value: unknown) {
  return f.pipe(
    value,
    json.stringify,
    either.mapLeft((reason) => new UnexpectedError(reason)),
    either.tap((stringified) => either.right(storage.setItem(key, stringified))),
  );
}

export { setItem };
