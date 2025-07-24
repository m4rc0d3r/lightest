type ComponentProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends abstract new (...args: any) => {
    $props: unknown;
  },
> = InstanceType<T>["$props"];

export type { ComponentProps };
