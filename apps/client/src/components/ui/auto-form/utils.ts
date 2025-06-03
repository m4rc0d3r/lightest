/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-enum-comparison */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { z } from "zod";

// TODO: This should support recursive ZodEffects but TypeScript doesn't allow circular type definitions.
type ZodObjectOrWrapped = z.ZodObject<any, any> | z.ZodEffects<z.ZodObject<any, any>>;

/**
 * Beautify a camelCase string.
 * e.g. "myString" -> "My String"
 */
function beautifyObjectName(string: string) {
  // Remove bracketed indices
  // if numbers only return the string
  let output = string.replace(/\[\d+\]/g, "").replace(/([A-Z])/g, " $1");
  output = output.charAt(0).toUpperCase() + output.slice(1);
  return output;
}

/**
 * Parse string and extract the index
 * @param string
 * @returns index or undefined
 */
function getIndexIfArray(string: string) {
  const indexRegex = /\[(\d+)\]/;
  // Match the index
  const match = indexRegex.exec(string);
  // Extract the index (number)
  const index = match ? Number.parseInt(match[1]!) : undefined;
  return index;
}

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseSchema<ChildType extends z.ZodAny | z.AnyZodObject = z.ZodAny>(
  schema: ChildType | z.ZodEffects<ChildType>,
): ChildType | null {
  if (!schema) return null;
  if ("innerType" in schema._def) return getBaseSchema(schema._def.innerType as ChildType);

  if ("schema" in schema._def) return getBaseSchema(schema._def.schema);

  return schema as ChildType;
}

/**
 * Get the type name of the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
function getBaseType(schema: z.ZodAny) {
  const baseSchema = getBaseSchema(schema);
  return baseSchema ? baseSchema._def.typeName : "";
}

/**
 * Search for a "ZodDefault" in the Zod stack and return its value.
 */
function getDefaultValueInZodStack(schema: z.ZodAny): any {
  const typedSchema = schema as unknown as z.ZodDefault<z.ZodNumber | z.ZodString>;

  if (typedSchema._def.typeName === "ZodDefault") return typedSchema._def.defaultValue();

  if ("innerType" in typedSchema._def) {
    return getDefaultValueInZodStack(typedSchema._def.innerType as unknown as z.ZodAny);
  }
  if ("schema" in typedSchema._def) {
    return getDefaultValueInZodStack((typedSchema._def as any).schema as z.ZodAny);
  }

  return undefined;
}

function getObjectFormSchema(schema: ZodObjectOrWrapped): z.ZodObject<any, any> {
  if (schema?._def.typeName === "ZodEffects") {
    const typedSchema = schema as z.ZodEffects<z.ZodObject<any, any>>;
    return getObjectFormSchema(typedSchema._def.schema);
  }
  return schema as z.ZodObject<any, any>;
}

function isIndex(value: unknown): value is number {
  return Number(value) >= 0;
}
/**
 * Constructs a path with dot paths for arrays to use brackets to be compatible with vee-validate path syntax
 */
function normalizeFormPath(path: string): string {
  const pathArr = path.split(".");
  if (!pathArr.length) return "";

  let fullPath = String(pathArr[0]);
  for (let i = 1; i < pathArr.length; i++) {
    if (isIndex(pathArr[i])) {
      fullPath += `[${pathArr[i]}]`;
      continue;
    }

    fullPath += `.${pathArr[i]}`;
  }

  return fullPath;
}

type NestedRecord = Record<string, unknown> | { [k: string]: NestedRecord };
/**
 * Checks if the path opted out of nested fields using `[fieldName]` syntax
 */
function isNotNestedPath(path: string) {
  return /^\[.+\]$/.test(path);
}
function isObject(obj: unknown): obj is Record<string, unknown> {
  return obj !== null && !!obj && typeof obj === "object" && !Array.isArray(obj);
}
function isContainerValue(value: unknown): value is Record<string, unknown> {
  return isObject(value) || Array.isArray(value);
}
function cleanupNonNestedPath(path: string) {
  if (isNotNestedPath(path)) return path.replace(/\[|\]/g, "");

  return path;
}

/**
 * Gets a nested property value from an object
 */
function getFromPath<TValue = unknown>(
  object: NestedRecord | undefined,
  path: string,
): TValue | undefined;
function getFromPath<TValue = unknown, TFallback = TValue>(
  object: NestedRecord | undefined,
  path: string,
  fallback?: TFallback,
): TValue | TFallback;
function getFromPath<TValue = unknown, TFallback = TValue>(
  object: NestedRecord | undefined,
  path: string,
  fallback?: TFallback,
): TValue | TFallback | undefined {
  if (!object) return fallback;

  if (isNotNestedPath(path)) return object[cleanupNonNestedPath(path)] as TValue | undefined;

  const resolvedValue = (path || "")
    .split(/\.|\[(\d+)\]/)
    .filter(Boolean)
    .reduce((acc, propKey) => {
      if (isContainerValue(acc) && propKey in acc) return acc[propKey];

      return fallback;
    }, object as unknown);

  return resolvedValue as TValue | undefined;
}

type Booleanish = boolean | "true" | "false";

function booleanishToBoolean(value: Booleanish) {
  switch (value) {
    case "true":
    case true:
      return true;
    case "false":
    case false:
      return false;
  }
}

function maybeBooleanishToBoolean(value?: Booleanish) {
  return value ? booleanishToBoolean(value) : undefined;
}

export {
  beautifyObjectName,
  booleanishToBoolean,
  getBaseSchema,
  getBaseType,
  getDefaultValueInZodStack,
  getFromPath,
  getIndexIfArray,
  getObjectFormSchema,
  isNotNestedPath,
  maybeBooleanishToBoolean,
  normalizeFormPath,
};
export type { ZodObjectOrWrapped };
