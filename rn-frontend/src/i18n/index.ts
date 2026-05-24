import { getBundle, localeRegistry } from "./resources";

export const DEFAULT_LOCALE = "en";

export function getSupportedLocales(): string[] {
  return Object.keys(localeRegistry);
}

export function translate(key: string, locale = DEFAULT_LOCALE): string {
  const bundle = getBundle(locale);
  const defaultBundle = getBundle(DEFAULT_LOCALE);
  return bundle[key] ?? defaultBundle[key] ?? key;
}

// Alias used by feature code to keep naming concise.
export const t = translate;
