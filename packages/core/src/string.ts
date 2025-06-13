const EMPTY = "";
type Empty = typeof EMPTY;

const SLASH = "/";
type Slash = typeof SLASH;

const BITS_PER_CHARACTER_BASE64 = 6;
const BITS_PER_BYTE = 8;

function getNumberOfBytesToStoreBase64(length: number) {
  return (length * BITS_PER_CHARACTER_BASE64) / BITS_PER_BYTE;
}

export { BITS_PER_BYTE, BITS_PER_CHARACTER_BASE64, EMPTY, getNumberOfBytesToStoreBase64, SLASH };
export type { Empty, Slash };
