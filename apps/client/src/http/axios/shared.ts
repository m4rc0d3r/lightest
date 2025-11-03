type Params = {
  address: string;
  baseUrl?: string | undefined;
  port?: number | undefined;
  protocol: string;
};

function createUrl({ protocol, address, port, baseUrl }: Params) {
  return [
    `${protocol}://${address}`,
    typeof port === "number" ? [COLON, port].join(EMPTY) : EMPTY,
    baseUrl ? [SLASH, baseUrl].join(EMPTY) : EMPTY,
  ].join(EMPTY);
}

const COLON = ":";
const EMPTY = "";
const SLASH = "/";

export { createUrl };
