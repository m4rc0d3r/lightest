import type { Fn } from "./types";

function iife<T extends unknown[], U>(fn: Fn<T, U>, ...args: T): U {
  return fn(...args);
}

export { iife };
