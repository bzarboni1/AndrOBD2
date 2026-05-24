# React Native Performance Baseline Notes

## Profiling Snapshot

Date: 2026-05-10

## Critical Flows

1. Home -> Connect -> connected state update
2. Home -> Diagnostics -> Read Codes
3. Home -> Live Data -> switch presenter modes

## Observations

- Navigation transitions are immediate in simulator baseline.
- Diagnostics action buttons remain responsive under mocked bridge latency.
- LiveData mode switching is cheap (view-level conditional render only).

## Risks

- Real stream throughput/perf under high PID counts not yet profiled with native bridge payloads.
- Chart/HUD presenters may require memoization once continuous sample updates are wired.
