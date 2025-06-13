import { Str } from ".";

type Params = {
  protocol: string;
  address: string;
  port?: number | undefined;
};
function createUrl({ protocol, address, port }: Params) {
  const portPart = typeof port === "number" ? `:${port}` : "";

  return [`${protocol}://${address}`, portPart].join(Str.EMPTY);
}

export { createUrl };
