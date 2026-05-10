# Release Parity Contract

## Scope

This contract defines release gates for one-cutover migration to React Native UI on Android with no runtime legacy fallback.

## Mandatory Release Gates

1. Core diagnostics parity
   - Connect/disconnect
   - Vehicle info
   - Live data
   - Read/clear codes
2. Measurement parity
   - Start/stop recording
   - Save/load recording
   - Export legacy-compatible output
3. Plugin parity
   - All currently supported plugin behaviors execute or fail with explicit user feedback
4. Localization parity
   - Existing translated resources resolve with fallback behavior where translations are missing
5. Observability readiness
   - Structured logs enabled
   - Core metrics visible in launch dashboards

## Exit Criteria

- All P1/P2 acceptance scenarios from spec pass on Android release candidates.
- No unresolved blocker defects in parity-critical journeys.
- Launch dashboards confirm collection of required metrics in staging and production canary.