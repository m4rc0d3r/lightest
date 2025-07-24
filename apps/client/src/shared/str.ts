const EMPTY = "";
type Empty = typeof EMPTY;

const SLASH = "/";
type Slash = typeof SLASH;

const SPACE = " ";
type Space = typeof SPACE;

const COMMA = ",";
type Comma = typeof COMMA;

const COMMA_WITH_SPACE = `${COMMA}${SPACE}`;
type CommaWithSpace = typeof COMMA_WITH_SPACE;

function capitalize<T extends string>(value: T) {
  return [value.charAt(0)?.toLocaleUpperCase(), value.slice(1)].join(EMPTY) as Capitalize<T>;
}

export { capitalize, COMMA, COMMA_WITH_SPACE, EMPTY, SLASH, SPACE };
export type { Comma, CommaWithSpace, Empty, Slash, Space };
