const translations: Record<string, Record<string, string>> = {
  en: {
    appTitle: "AndrOBD Modern",
    bootstrapMessage: "Modern frontend foundation ready"
  }
};

const DEFAULT_LOCALE = "en";

export function getSupportedLocales(): string[] {
  return Object.keys(translations);
}

export function translate(key: string, locale = DEFAULT_LOCALE): string {
  const selected = translations[locale] ?? translations[DEFAULT_LOCALE];
  return selected[key] ?? translations[DEFAULT_LOCALE][key] ?? key;
}
