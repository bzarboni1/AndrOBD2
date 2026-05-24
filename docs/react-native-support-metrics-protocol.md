# React Native Support Metrics Protocol (SC-005)

## Objective

Track and compare support issues related to navigation confusion/discoverability before and after RN cutover.

## Taxonomy

Tag support items with one primary label:

- nav-confusion
- discoverability
- workflow-regression
- plugin-ux
- localization-ux

## Data Sources

- GitHub issues (support labels)
- Play Store reviews (manual triage)
- In-app feedback channel

## Reporting Window

- Baseline: previous release cycle (legacy UI)
- Target: first release cycle post-cutover

## Pass Criteria

- Combined nav-confusion + discoverability issues reduced by >=30%.
- Weekly trend does not show sustained week-over-week increase after week 2.
