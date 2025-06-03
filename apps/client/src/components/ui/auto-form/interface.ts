/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Component, InputHTMLAttributes } from "vue";
import type { ZodAny } from "zod";
import { z } from "zod";

import type { INPUT_COMPONENTS } from "./constant";

type FieldProps = {
  fieldName: string;
  label?: string;
  required?: boolean;
  config?: ConfigItem;
  disabled?: boolean;
};

type Shape = {
  type: string;
  default?: any;
  required?: boolean;
  options?: string[];
  schema?: ZodAny;
};

type InputComponents = {
  date: Component;
  select: Component;
  radio: Component;
  checkbox: Component;
  switch: Component;
  textarea: Component;
  number: Component;
  string: Component;
  file: Component;
  array: Component;
  object: Component;
};

type ConfigItem = {
  /** Value for the `FormLabel` */
  label?: string;
  /** Value for the `FormDescription` */
  description?: string;
  /** Pick which component to be rendered. */
  component?: keyof typeof INPUT_COMPONENTS | Component;
  /** Hide `FormLabel`. */
  hideLabel?: boolean;
  inputProps?: InputHTMLAttributes;
};

// Define a type to unwrap an array
type UnwrapArray<T> = T extends (infer U)[] ? U : never;

type Config<SchemaType extends object> = {
  // If SchemaType.key is an object, create a nested Config, otherwise ConfigItem
  [Key in keyof SchemaType]?: SchemaType[Key] extends any[]
    ? UnwrapArray<Config<SchemaType[Key]>>
    : SchemaType[Key] extends object
      ? Config<SchemaType[Key]>
      : ConfigItem;
};

const DISABLES = "DISABLES";
const REQUIRES = "REQUIRES";
const HIDES = "HIDES";
const SETS_OPTIONS = "SETS_OPTIONS";

const zDependencyType = z.enum([DISABLES, REQUIRES, HIDES, SETS_OPTIONS]);
const DEPENDENCY_TYPE = zDependencyType.Values;
type DependencyType = z.infer<typeof zDependencyType>;

type BaseDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> = {
  sourceField: keyof SchemaType;
  type: DependencyType;
  targetField: keyof SchemaType;
  when: (sourceFieldValue: any, targetFieldValue: any) => boolean;
};

type ValueDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> =
  BaseDependency<SchemaType> & {
    type: Extract<DependencyType, typeof DISABLES | typeof REQUIRES | typeof HIDES>;
  };

type EnumValues = readonly [string, ...string[]];

type OptionsDependency<SchemaType extends z.infer<z.ZodObject<any, any>>> =
  BaseDependency<SchemaType> & {
    type: typeof SETS_OPTIONS;

    // Partial array of values from sourceField that will trigger the dependency
    options: EnumValues;
  };

type Dependency<SchemaType extends z.infer<z.ZodObject<any, any>>> =
  | ValueDependency<SchemaType>
  | OptionsDependency<SchemaType>;

export { DEPENDENCY_TYPE };
export type {
  Config,
  ConfigItem,
  Dependency,
  DependencyType,
  EnumValues,
  FieldProps,
  InputComponents,
  OptionsDependency,
  Shape,
  ValueDependency,
};
