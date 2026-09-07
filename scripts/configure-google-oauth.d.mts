export function parseEnvFile(contents: string): Record<string, string>;

export function setEnvValue(
  contents: string,
  key: string,
  value: string,
): string;
