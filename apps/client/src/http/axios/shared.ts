function createUrl(protocol: string, address: string, port: number, baseUrl: string) {
  return `${protocol}://${address}:${port}/${baseUrl}`;
}

export { createUrl };
