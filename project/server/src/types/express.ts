export type ParamsDictionary = {
  [key: string]: string;
};

export type ParsedQs = {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
};
