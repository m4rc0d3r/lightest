type ParamsDictionary = Record<string, string>;

type ParsedQs = {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
};

export type { ParamsDictionary, ParsedQs };
