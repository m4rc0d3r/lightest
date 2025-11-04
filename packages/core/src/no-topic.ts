import type { Fn } from "./types";

function iife<T extends unknown[], U>(fn: Fn<T, U>, ...args: T): U {
  return fn(...args);
}

async function wait(time: number) {
  await new Promise((resolve) => setTimeout(resolve, time));
}

export { iife, wait };
