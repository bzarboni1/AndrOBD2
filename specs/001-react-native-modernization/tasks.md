# Tasks: React Native Frontend Modernization (Android)

**Input**: Design documents from `/specs/001-react-native-modernization/`
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: Because this feature is a one-cutover release with no runtime legacy fallback, parity and release-gate validation tasks are explicitly included.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated independently.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize React Native workspace and Android integration scaffolding.

- [X] T001 Create React Native workspace manifest in rn-frontend/package.json
- [X] T002 Configure TypeScript/Babel/Metro baseline in rn-frontend/tsconfig.json, rn-frontend/babel.config.js, rn-frontend/metro.config.js
- [X] T003 [P] Create React Native app entry points in rn-frontend/index.js and rn-frontend/src/app/App.tsx
- [X] T004 [P] Create Android host project scaffolding for RN in rn-frontend/android/settings.gradle and rn-frontend/android/app/build.gradle
- [X] T005 [P] Create initial source tree placeholders in rn-frontend/src/app/.gitkeep, rn-frontend/src/features/.gitkeep, rn-frontend/src/components/.gitkeep
- [X] T006 Add workspace scripts for Android build and run in rn-frontend/package.json

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Build shared architecture that blocks all user stories until complete.

**CRITICAL**: No user-story tasks should start before this phase is complete.

- [X] T007 Define shared domain and bridge types in rn-frontend/src/types/domain.ts
- [X] T008 [P] Implement JS-native bridge facade for connection/diagnostics APIs in rn-frontend/src/services/nativeBridge.ts
- [X] T009 [P] Implement shared app state containers for session and diagnostics status in rn-frontend/src/state/sessionStore.ts and rn-frontend/src/state/diagnosticsStore.ts
- [X] T010 Implement navigation container and root navigator shell in rn-frontend/src/app/navigation/RootNavigator.tsx
- [X] T011 [P] Implement global error and feedback presentation layer in rn-frontend/src/components/feedback/ErrorBanner.tsx and rn-frontend/src/components/feedback/ActionToast.tsx
- [X] T012 [P] Implement structured telemetry event and metric adapters in rn-frontend/src/telemetry/events.ts and rn-frontend/src/telemetry/metrics.ts
- [X] T013 Implement localization bootstrap and fallback resolution in rn-frontend/src/i18n/index.ts
- [X] T014 Wire app providers (navigation, state, i18n, telemetry) in rn-frontend/src/app/AppProviders.tsx
- [X] T015 Create bridge contract mapping documentation for implementation traceability in rn-frontend/src/services/README.bridge-contract.md

**Checkpoint**: Foundation complete; user stories can start.

## Phase 3: User Story 1 - Run Core Vehicle Diagnostics in a Modern UI (Priority: P1) MVP

**Goal**: Deliver modern connection and core diagnostics flows with parity for connect/disconnect, vehicle info, freeze frames, test controls, read codes, and clear codes.

**Independent Test**: Launch app, connect to supported adapter/demo source, run vehicle info + freeze frames + test controls + read codes + clear codes with explicit outcome messaging.

- [X] T016 [P] [US1] Implement home and connection screens in rn-frontend/src/features/connection/screens/HomeScreen.tsx and rn-frontend/src/features/connection/screens/ConnectScreen.tsx
- [X] T017 [US1] Implement transport selection and connect/disconnect actions in rn-frontend/src/features/connection/components/TransportSelector.tsx and rn-frontend/src/features/connection/hooks/useConnectionActions.ts
- [X] T018 [US1] Implement diagnostics hub navigation route in rn-frontend/src/features/diagnostics/screens/DiagnosticsHomeScreen.tsx
- [X] T019 [P] [US1] Implement diagnostic service action hooks (vehicle info/read codes/clear codes) in rn-frontend/src/features/diagnostics/hooks/useDiagnosticActions.ts
- [X] T020 [P] [US1] Implement freeze-frame retrieval flow in rn-frontend/src/features/diagnostics/hooks/useFreezeFrameActions.ts and rn-frontend/src/features/diagnostics/components/FreezeFramePanel.tsx
- [X] T021 [P] [US1] Implement test-control flow in rn-frontend/src/features/diagnostics/hooks/useTestControlActions.ts and rn-frontend/src/features/diagnostics/components/TestControlPanel.tsx
- [X] T022 [US1] Implement fault code list and detail rendering in rn-frontend/src/features/diagnostics/components/FaultCodeList.tsx
- [X] T023 [US1] Implement destructive confirmation flow for clear-codes action in rn-frontend/src/features/diagnostics/components/ClearCodesConfirmDialog.tsx
- [X] T024 [US1] Implement connected-only eligibility guards and unsupported-service messaging in rn-frontend/src/features/diagnostics/utils/actionEligibility.ts
- [X] T025 [US1] Emit connection and diagnostic telemetry events in rn-frontend/src/features/connection/hooks/useConnectionActions.ts and rn-frontend/src/features/diagnostics/hooks/useDiagnosticActions.ts

**Checkpoint**: US1 is independently functional and parity-testable.

## Phase 4: User Story 2 - Monitor, Visualize, and Export Measurement Data (Priority: P2)

**Goal**: Deliver live-data visualization modes plus recording/save/load/export workflows with legacy-compatible reads/exports.

**Independent Test**: Start live data, switch views (table/chart/dashboard/HUD), record session, save/load recording, export legacy-compatible output.

- [X] T026 [P] [US2] Implement live-data route and screen shell in rn-frontend/src/features/live-data/screens/LiveDataScreen.tsx
- [X] T027 [P] [US2] Implement table and chart presenters in rn-frontend/src/features/live-data/components/LiveDataTable.tsx and rn-frontend/src/features/live-data/components/LiveDataChart.tsx
- [X] T028 [P] [US2] Implement dashboard and HUD presenters in rn-frontend/src/features/live-data/components/LiveDataDashboard.tsx and rn-frontend/src/features/live-data/components/LiveDataHud.tsx
- [X] T029 [US2] Implement stream subscription and reconnect behavior in rn-frontend/src/features/live-data/hooks/useLiveDataStream.ts
- [X] T030 [US2] Implement recording lifecycle actions (start/stop/save) in rn-frontend/src/features/measurements/hooks/useRecordingActions.ts
- [X] T031 [US2] Implement recording library load/list flow in rn-frontend/src/features/measurements/screens/RecordingLibraryScreen.tsx
- [X] T032 [US2] Implement legacy-compatible export flow in rn-frontend/src/features/measurements/hooks/useRecordingExport.ts
- [X] T033 [US2] Handle corrupted/incompatible file load errors in rn-frontend/src/features/measurements/utils/recordingValidation.ts
- [X] T034 [US2] Emit measurement and export telemetry metrics in rn-frontend/src/features/measurements/hooks/useRecordingActions.ts and rn-frontend/src/features/measurements/hooks/useRecordingExport.ts

**Checkpoint**: US2 is independently functional and parity-testable.

## Phase 5: User Story 3 - Configure Experience, Extensions, and Personalization (Priority: P3)

**Goal**: Deliver settings, preferences persistence, plugin manager compatibility, and reset-preselections flows.

**Independent Test**: Update preferences and relaunch, manage plugins, execute plugin actions, reset preselections, verify persisted behavior.

- [X] T035 [P] [US3] Implement settings route and screen shell in rn-frontend/src/features/settings/screens/SettingsScreen.tsx
- [X] T036 [US3] Implement preference load/update persistence hooks for theme, preferred data view, default home behavior, and locale in rn-frontend/src/features/settings/hooks/usePreferences.ts
- [X] T037 [US3] Implement day/night/system theme controls in rn-frontend/src/features/settings/components/ThemeModeSelector.tsx
- [X] T038 [P] [US3] Implement plugin manager list and status UI in rn-frontend/src/features/plugins/screens/PluginManagerScreen.tsx
- [X] T039 [US3] Implement plugin action invocation and failure feedback in rn-frontend/src/features/plugins/hooks/usePluginActions.ts
- [X] T040 [US3] Implement reset-preselections flow with confirmation in rn-frontend/src/features/settings/components/ResetPreselectionsAction.tsx
- [X] T041 [US3] Implement localization fallback handling for missing keys in rn-frontend/src/i18n/fallbackResolver.ts
- [X] T042 [US3] Emit plugin initialization/action telemetry in rn-frontend/src/features/plugins/hooks/usePluginActions.ts
- [X] T056 [US3] Implement migration mapping from existing Android translation resources to RN locale bundles in rn-frontend/src/i18n/resources/index.ts
- [X] T060 [P] [US2] Create legacy recording read compatibility validation corpus and pass criteria in rn-frontend/tests/integration/legacy-recording-read-compatibility.test.ts and docs/react-native-legacy-read-compatibility-matrix.md

**Checkpoint**: US3 is independently functional and parity-testable.

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Complete release gates, parity validation, and production cutover readiness.

- [X] T043 [P] Create automated parity E2E suite for P1 flows in rn-frontend/tests/e2e/diagnostics-parity.e2e.ts
- [X] T044 [P] Create automated parity E2E suite for P2 flows in rn-frontend/tests/e2e/measurements-parity.e2e.ts
- [X] T045 [P] Create plugin parity matrix verification checklist in docs/react-native-plugin-parity-matrix.md
- [X] T046 [P] Create localization migration and coverage verification checklist in docs/react-native-localization-coverage.md
- [X] T047 Define usability measurement protocol for SC-002 and SC-004 in docs/react-native-usability-protocol.md
- [X] T048 Define performance baseline protocol for SC-003 in docs/react-native-performance-protocol.md
- [X] T049 Define support-issue taxonomy tracking for SC-005 in docs/react-native-support-metrics-protocol.md
- [X] T050 [P] Document final navigation map and screen parity matrix in docs/react-native-navigation-map.md
- [X] T051 [P] Profile critical UI flows and record performance notes in docs/react-native-performance-baseline.md
- [X] T052 Validate release parity gates from specs/001-react-native-modernization/contracts/release-parity-contract.md in specs/001-react-native-modernization/contracts/release-parity-contract.md
- [X] T053 Verify structured logs and launch metrics wiring in rn-frontend/src/telemetry/events.ts and rn-frontend/src/telemetry/metrics.ts
- [X] T054 Execute quickstart validation checklist updates in specs/001-react-native-modernization/quickstart.md
- [X] T055 Prepare cutover release checklist with no-legacy-fallback confirmation in docs/react-native-cutover-checklist.md
- [X] T057 Execute SC-002 and SC-004 usability protocol and capture results in docs/react-native-usability-results.md
- [X] T058 Execute SC-003 diagnostics timing baseline protocol and capture pass/fail evidence in docs/react-native-performance-results.md
- [X] T059 Execute SC-005 support-issue taxonomy reporting and capture release-cycle baseline in docs/react-native-support-metrics-report.md

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): starts immediately.
- Foundational (Phase 2): depends on Setup completion and blocks all user stories.
- User Stories (Phases 3-5): depend on Foundational completion.
- Polish (Phase 6): depends on completion of required user stories.

### User Story Dependencies

- US1 (P1): starts after Phase 2 and is the MVP slice.
- US2 (P2): starts after Phase 2; depends on shared connection/session state from Phase 2, not on US1 implementation tasks.
- US3 (P3): starts after Phase 2; depends on shared settings/plugin bridge primitives from Phase 2, not on US1/US2 implementation tasks.

### Within Each User Story

- Screen shells before user actions.
- Action hooks before telemetry and error-surface tasks.
- Eligibility/error handling before parity checkpoint.

## Parallel Execution Examples

### User Story 1

- Run T016 and T019 in parallel (different files and concerns).
- Run T020 and T021 in parallel (freeze-frame and test-control implementations).

### User Story 2

- Run T027 and T028 in parallel (independent presenters).
- Run T030 and T033 in parallel (record lifecycle and validation utilities).

### User Story 3

- Run T035 and T038 in parallel (settings and plugin manager screens).
- Run T037 and T041 in parallel (theme selector and localization fallback).

## Implementation Strategy

### MVP First (US1)

1. Complete Phase 1 and Phase 2.
2. Deliver Phase 3 (US1) fully.
3. Validate US1 independently against acceptance scenarios.
4. Demonstrate MVP before expanding scope.

### Incremental Delivery

1. Add US2 after US1 validation.
2. Add US3 after US2 validation.
3. Execute Phase 6 release gates for one-cutover readiness.

### Parallel Team Strategy

1. Team completes Setup + Foundational together.
2. After Phase 2:
   - Developer A: US1
   - Developer B: US2
   - Developer C: US3
3. Merge at phase checkpoints and validate parity contract before release.

## Notes

- [P] indicates tasks that can be worked in parallel with no file/dependency conflict.
- [US1]/[US2]/[US3] tags map directly to spec user stories.
- Commit per completed task or small logical group to preserve traceability.
- No runtime fallback to legacy UI is permitted at release; parity gates are mandatory.
