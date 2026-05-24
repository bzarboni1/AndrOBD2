# Phase 0 Research: React Native Frontend Modernization

## Decision 1: Use Brownfield React Native Migration Instead of Rewriting Domain Logic

- Decision: Keep existing native OBD/domain/plugin logic in current Android/library modules and replace only frontend presentation and navigation with React Native.
- Rationale: This minimizes protocol risk, accelerates parity, and aligns with one-cutover/no-fallback constraints.
- Alternatives considered:
  - Full rewrite of UI + domain stack in JavaScript/TypeScript: rejected due to high regression risk for diagnostics and plugin behavior.
  - Keep legacy UI with incremental RN screens only: rejected because scope requires full frontend modernization.

## Decision 2: Navigation Stack with React Navigation

- Decision: Use React Navigation as top-level navigation system with `NavigationContainer`, typed route definitions, deep-link configuration, and persisted navigation state where useful.
- Rationale: Official docs cover Android back-button integration, deep linking, and state persistence patterns that map directly to modernized menu/navigation goals.
- Alternatives considered:
  - Custom navigation framework: rejected due to higher maintenance and testing cost.
  - Keep Android-native navigation components only: rejected because UI target is React Native frontend.

## Decision 3: Performance Baseline with Hermes + Native Profiling

- Decision: Enable standard RN Android runtime path and validate UI performance using Android Studio System Tracing and RN perf monitor in development.
- Rationale: RN docs emphasize native tooling for reliable jank analysis and frame-budget profiling.
- Alternatives considered:
  - JavaScript-only timing instrumentation: rejected because it misses native/UI-thread bottlenecks.
  - Performance validation only after launch: rejected due to no-fallback cutover requirement.

## Decision 4: Measurement File Compatibility Strategy

- Decision: Maintain backward-compatible reads for existing measurement recordings and allow new internal format only if export to legacy-compatible format is always available.
- Rationale: Preserves historical user data access while allowing internal evolution.
- Alternatives considered:
  - Legacy-only storage forever: rejected as too restrictive for future format improvements.
  - New format only: rejected due to migration friction and risk to existing users.

## Decision 5: Plugin Compatibility at Launch

- Decision: Preserve all currently supported plugin behaviors at launch; add explicit error surfaces for plugin init/exec failures.
- Rationale: Existing ecosystem usage and clarified requirement mandate full launch compatibility.
- Alternatives considered:
  - Core-plugin-only support: rejected because requirement explicitly asks for all currently supported behaviors.
  - Defer plugin support: rejected due to parity commitments.

## Decision 6: Observability Baseline Required at Launch

- Decision: Introduce structured logs and core production metrics for connection success rate, diagnostic action failure rate, and crash-free sessions.
- Rationale: Required by clarified scope and needed for confidence during one-cutover release.
- Alternatives considered:
  - Error logs only: rejected as insufficient for release confidence.
  - Full distributed tracing pre-launch: rejected as disproportionate to scope.

## Decision 7: Platform Scope

- Decision: Android-only React Native migration in this feature.
- Rationale: Explicitly clarified by user and consistent with parity-first delivery.
- Alternatives considered:
  - Android + iOS in one milestone: rejected as delivery risk.
  - iOS-first or parallel unknown scope: rejected as misaligned to current product base.

## Documentation Sources Consulted

- React Native docs (`/facebook/react-native-website`): architecture notes, profiling and debugging guidance for Android performance validation.
- React Navigation docs (`/react-navigation/react-navigation.github.io`): `NavigationContainer`, deep linking, and state persistence guidance.