const EMPTY = "";
type Empty = typeof EMPTY;

const SLASH = "/";
type Slash = typeof SLASH;

function capitalize<T extends string>(value: T) {
  return [value.charAt(0)?.toLocaleUpperCase(), value.slice(1)].join(EMPTY) as Capitalize<T>;
}

export { capitalize, EMPTY, SLASH };
export type { Empty, Slash };
