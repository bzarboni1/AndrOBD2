/**
 * i18n fallback resolver (T041)
 *
 * Provides graceful degradation when a translation key is missing for a locale.
 * Resolution order: requested locale → 'en' (default) → raw key
 */
import { t } from "./index";

/**
 * Resolve a translation key with explicit fallback chain.
 *
 * @param key - The translation key to look up.
 * @param locale - The requested locale (e.g. "de", "fr", "ja").
 * @param fallbackLocale - Locale to fall back to before using the raw key. Defaults to "en".
 * @returns The resolved translation string.
 */
export function resolveWithFallback(
  key: string,
  locale?: string,
  fallbackLocale = "en"
): string {
  // First try the requested locale via the shared t() function
  const primary = t(key, locale);
  if (primary !== key) {
    // t() returns the key itself when not found; any other result is a real translation
    return primary;
  }

  // Fall back to the explicit fallback locale
  if (fallbackLocale && fallbackLocale !== locale) {
    const fallback = t(key, fallbackLocale);
    if (fallback !== key) {
      return fallback;
    }
  }

  // Nothing found — return the raw key so the UI stays functional
  return key;
}
