# React Native Localization Coverage

## Locale Migration Mapping

| Android resource dir | RN locale key | Status |
|---|---|---|
| values/ | en | Migrated baseline |
| values-de/ | de | Core keys migrated |
| values-fr/ | fr | Core keys migrated |
| values-pt-rBR/ | pt-BR | Planned |
| values-zh-rCN/ | zh-CN | Planned |
| values-zh-rTW/ | zh-TW | Planned |

## Fallback Strategy

1. Resolve requested locale bundle.
2. If missing, resolve language-only fallback (e.g. de-AT -> de).
3. Fall back to en bundle.
4. If key is still missing, return raw key.

## Coverage Checklist

- [x] English baseline keys included.
- [x] German and French core navigation/diagnostics keys included.
- [x] Fallback resolver implemented.
- [ ] Full key migration from all Android locales completed.
- [ ] Snapshot checks for all locale bundles.
