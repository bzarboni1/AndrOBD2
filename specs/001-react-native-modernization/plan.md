# Implementation Plan: React Native Frontend Modernization (Android)

**Branch**: `[001-run-feature-workflow]` | **Date**: 2026-05-10 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-react-native-modernization/spec.md`


## Summary

Replace the legacy Android XML/Activity-driven frontend with a React Native frontend for Android while preserving diagnostic parity, measurement workflows, plugin behavior, localization, and one-cutover release constraints. The plan uses a brownfield integration approach so existing OBD/service and plugin logic remains authoritative while UI/state/navigation are modernized in React Native.

## Technical Context

**Language/Version**: TypeScript 5.x + React Native (current stable), existing Java/Kotlin Android modules retained for domain logic  
**Primary Dependencies**: React Native, React Navigation (stack + tabs/drawer as needed), React Native Gesture Handler, React Native Reanimated, safe-area-context, AsyncStorage (nav state persistence), existing AndrOBD library/plugin modules  
**Storage**: Existing measurement files (legacy-compatible read + export), existing Android preference/data stores, React Native local persistence for UI/navigation state  
**Testing**: Jest + React Native Testing Library (component/integration), Detox (critical E2E), existing Gradle tests for retained native modules  
**Target Platform**: Android only (parity-first release scope)  
**Project Type**: Mobile app (brownfield React Native frontend migration)  
**Performance Goals**: 60fps interactions on primary flows, no regression in connect/diagnostics workflow timings, crash-free sessions metric captured at launch  
**Constraints**: One-cutover release with no runtime legacy fallback; full parity required before release; plugin behavior compatibility at launch; structured logs + core reliability metrics mandatory  
**Scale/Scope**: Migration of all primary user journeys (connect, diagnostics, live data views, record/save/load/export, settings, plugin manager) and associated navigation hierarchy

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The constitution file currently contains template placeholders and no enforceable project-specific governance rules.

Pre-Phase 0 gate result: **PASS (No enforceable gates defined)**

- Gate A (Constitution principles present and actionable): PASS (not defined)
- Gate B (Mandatory workflow constraints): PASS (not defined)
- Gate C (Non-negotiable quality/security rules): PASS (not defined)

Post-Phase 1 re-check result: **PASS (No enforceable gates defined)**

- Research and design artifacts complete for this phase.
- No unresolved clarification markers in feature specification.
- No constitution violations detected because no enforceable clauses are defined.

## Project Structure

### Documentation (this feature)

```text
specs/001-react-native-modernization/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
androbd/
├── src/main/java/com/fr3ts0n/...      # Existing Android-native app logic
├── src/main/res/...                    # Legacy XML/UI resources (to be retired after cutover)
└── src/test/...                        # Existing native tests

library/
├── src/main/java/com/...               # Shared OBD/domain modules retained
└── src/test/java/com/...               # Shared module tests

rn-frontend/                            # New React Native frontend workspace
├── package.json
├── android/                            # RN Android host app integration
├── src/
│   ├── app/                            # Navigation container, root providers
│   ├── screens/                        # Top-level feature screens
│   ├── components/                     # Reusable UI components
│   ├── features/
│   │   ├── connection/
│   │   ├── diagnostics/
│   │   ├── live-data/
│   │   ├── measurements/
│   │   ├── settings/
│   │   └── plugins/
│   ├── services/                       # Bridge facades and domain adapters
│   ├── state/                          # App/global state stores
│   ├── i18n/                           # Localization resources + mapping
│   └── telemetry/                      # Structured logging + metrics wrappers
└── tests/
  ├── unit/
  ├── integration/
  └── e2e/
```

**Structure Decision**: Mobile app brownfield structure. Existing native/domain modules in `androbd/` and `library/` remain in place while the new UI/navigation/state surface is implemented in `rn-frontend/` and connected via a stable bridge contract.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |
