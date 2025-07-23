import { EMPTY, SLASH } from "./str";

const ROUTES = {
  home: SLASH,
  about: createPath(["about"]),
};

function createPath(segments: string[]) {
  return [EMPTY, ...segments].join(SLASH);
}

export { ROUTES };
