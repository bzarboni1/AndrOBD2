/**
 * i18n resource index (T056)
 *
 * Migration mapping from Android translation resources (res/values-STAR/strings.xml)
 * to RN locale bundles.
 *
 * Conventions:
 * - Each locale key matches the Android resource qualifier (BCP-47 derived).
 * - Bundle values are flat string maps keyed by string resource name.
 * - Extend this file as additional strings are migrated from Android resources.
 */
export type LocaleBundle = Record<string, string>;
export type LocaleRegistry = Record<string, LocaleBundle>;

/** English — canonical base bundle. All other bundles fall back to this. */
const en: LocaleBundle = {
  app_name: "AndrOBD",
  connect: "Connect",
  disconnect: "Disconnect",
  diagnostics: "Diagnostics",
  live_data: "Live Data",
  measurements: "Measurements",
  settings: "Settings",
  plugins: "Plugins",
  vehicle_info: "Vehicle Information",
  read_codes: "Read Fault Codes",
  clear_codes: "Clear Fault Codes",
  freeze_frames: "Freeze Frames",
  test_controls: "Test Controls",
  recording_start: "Start Recording",
  recording_stop: "Stop Recording",
  export_recording: "Export Recording",
  theme_day: "Day",
  theme_night: "Night",
  theme_system: "System",
  connection_required: "A vehicle connection is required.",
  unsupported_service: "This service is not supported by your vehicle.",
  clear_codes_confirm_title: "Clear Fault Codes?",
  clear_codes_confirm_message:
    "This will erase all stored fault codes from the vehicle ECU. This action cannot be undone.",
  reset_preselections: "Reset Preselections",
  no_recordings: "No recordings loaded.",
  no_plugins: "No plugins installed."
};

const de: LocaleBundle = {
  app_name: "AndrOBD",
  connect: "Verbinden",
  disconnect: "Trennen",
  diagnostics: "Diagnose",
  live_data: "Live-Daten",
  measurements: "Messungen",
  settings: "Einstellungen",
  plugins: "Plugins",
  vehicle_info: "Fahrzeuginformationen",
  read_codes: "Fehlercodes lesen",
  clear_codes: "Fehlercodes löschen",
  freeze_frames: "Freeze Frames",
  test_controls: "Teststeuerung",
  recording_start: "Aufnahme starten",
  recording_stop: "Aufnahme stoppen",
  export_recording: "Aufnahme exportieren",
  theme_day: "Hell",
  theme_night: "Dunkel",
  theme_system: "System",
  connection_required: "Eine Fahrzeugverbindung ist erforderlich.",
  clear_codes_confirm_title: "Fehlercodes löschen?",
  reset_preselections: "Vorauswahl zurücksetzen"
};

const fr: LocaleBundle = {
  app_name: "AndrOBD",
  connect: "Connecter",
  disconnect: "Déconnecter",
  diagnostics: "Diagnostic",
  live_data: "Données en direct",
  measurements: "Mesures",
  settings: "Paramètres",
  plugins: "Extensions",
  vehicle_info: "Informations véhicule",
  read_codes: "Lire les codes défauts",
  clear_codes: "Effacer les codes défauts",
  freeze_frames: "Freeze Frames",
  test_controls: "Contrôles de test",
  recording_start: "Démarrer l'enregistrement",
  recording_stop: "Arrêter l'enregistrement",
  export_recording: "Exporter l'enregistrement",
  theme_day: "Jour",
  theme_night: "Nuit",
  theme_system: "Système",
  connection_required: "Une connexion véhicule est requise.",
  clear_codes_confirm_title: "Effacer les codes défauts?",
  reset_preselections: "Réinitialiser les présélections"
};

/**
 * Locale registry — maps locale tags to their string bundles.
 * Add additional locales here as Android resource XML files are migrated.
 *
 * Android resource directory → locale tag mapping (examples):
 *   values/       → "en"
 *   values-de/    → "de"
 *   values-fr/    → "fr"
 *   values-pt-rBR → "pt-BR"
 *   values-zh-rCN → "zh-CN"
 */
export const localeRegistry: LocaleRegistry = {
  en,
  de,
  fr
};

/**
 * Resolve a string key for a given locale, falling back to English.
 * Used by the i18n/index.ts t() function.
 */
export function getBundle(locale: string): LocaleBundle {
  // Exact match
  if (localeRegistry[locale]) return localeRegistry[locale];
  // Language-only match (e.g. "de-AT" → "de")
  const lang = locale.split("-")[0];
  if (localeRegistry[lang]) return localeRegistry[lang];
  return localeRegistry["en"];
}
