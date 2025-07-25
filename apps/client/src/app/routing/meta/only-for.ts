import type { RouteMeta } from "vue-router";
import { z } from "zod";

const zOnlyFor = z.enum(["AUTHENTICATED", "UNAUTHENTICATED"]);
const OnlyFor = zOnlyFor.Enum;
type OnlyFor = z.infer<typeof zOnlyFor>;

const ONLY_FOR_KEY = Symbol("ONLY_FOR_KEY");

function onlyFor(value: OnlyFor) {
  return {
    [ONLY_FOR_KEY]: value,
  };
}

function getOnlyFor({ meta }: { meta: RouteMeta }) {
  return (
    meta as Partial<{
      [ONLY_FOR_KEY]: OnlyFor;
    }>
  )[ONLY_FOR_KEY];
}

export { getOnlyFor, OnlyFor, onlyFor };
