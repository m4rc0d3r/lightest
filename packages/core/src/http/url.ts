import { Str } from "~/str";

type Params = {
  protocol: string;
  address: string;
  port?: number | undefined;
};
function create({ protocol, address, port }: Params) {
  const portPart = typeof port === "number" ? `:${port}` : "";

  return [`${protocol}://${address}`, portPart].join(Str.EMPTY);
}

export { create };
