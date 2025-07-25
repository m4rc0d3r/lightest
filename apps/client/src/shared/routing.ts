import { Str } from "@lightest/core";

const ROUTES = {
  home: Str.SLASH,
  about: createPath(["about"]),
  register: createPath(["register"]),
  login: createPath(["login"]),
};

function createPath(segments: string[]) {
  return [Str.EMPTY, ...segments].join(Str.SLASH);
}

export { ROUTES };
