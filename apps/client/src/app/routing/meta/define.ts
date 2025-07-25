function defineMeta(...args: Record<PropertyKey, unknown>[]) {
  return args.reduce((meta, part) => {
    for (const key of [...Object.keys(part), ...Object.getOwnPropertySymbols(part)]) {
      meta[key] = part[key];
    }

    return meta;
  }, {});
}

export { defineMeta };
