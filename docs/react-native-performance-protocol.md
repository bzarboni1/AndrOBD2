# React Native Performance Protocol (SC-003)

## Objective

Validate that median time for core diagnostics flow (connect -> read codes -> home) is improved by >=25% versus legacy baseline.

## Test Environment

- Android physical devices: low, mid, high tier.
- Same adapter and vehicle simulator profile for each run.
- Fresh app launch for each trial.

## Procedure

1. Start at Home screen.
2. Connect using configured transport.
3. Navigate to Diagnostics and run read fault codes.
4. Return to Home.
5. Record total elapsed time.

Run 30 trials per device tier in both legacy and RN builds.

## Metrics

- Median elapsed time per build.
- P95 elapsed time.
- Regression notes for outliers.

## Pass Criteria

- RN median <= legacy median * 0.75.
- No critical regression in P95 (>10% slowdown).
