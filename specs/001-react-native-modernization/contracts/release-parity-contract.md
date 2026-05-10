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

## Validation Checklist (T052)

| Gate | Validation Artifact | Status |
|---|---|---|
| Core diagnostics parity | rn-frontend/tests/e2e/diagnostics-parity.e2e.ts | Implemented |
| Measurement parity | rn-frontend/tests/e2e/measurements-parity.e2e.ts | Implemented |
| Plugin parity | docs/react-native-plugin-parity-matrix.md | Implemented |
| Localization parity | docs/react-native-localization-coverage.md | Implemented |
| Observability readiness | rn-frontend/src/telemetry/events.ts + rn-frontend/src/telemetry/metrics.ts | Implemented |
