import { EMPTY, SLASH } from "./str";

const ROUTES = {
  home: SLASH,
  about: createPath(["about"]),
  register: createPath(["register"]),
};

function createPath(segments: string[]) {
  return [EMPTY, ...segments].join(SLASH);
}

export { ROUTES };
