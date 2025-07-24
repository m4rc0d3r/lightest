function defineMetadata(...args: Record<PropertyKey, unknown>[]) {
  return args.reduce((metadata, part) => {
    for (const key of [...Object.keys(part), ...Object.getOwnPropertySymbols(part)]) {
      metadata[key] = part[key];
    }

    return metadata;
  }, {});
}

export { defineMetadata };
