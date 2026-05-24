# Legacy Recording Read Compatibility Matrix

**Purpose**: Document format compatibility guarantees for measurement recordings (FR-007a, FR-007b).
**Last Updated**: 2026-05-10

## Format Version Compatibility

| Format Version | Status         | Read Support | Write Support | Notes |
|----------------|----------------|-------------|---------------|-------|
| 0.9 and below  | Incompatible   | ✗ No        | ✗ No          | Pre-release format; not supported |
| 1.0            | Legacy         | ✓ Yes       | ✗ No (read-only) | Original AndrOBD format |
| 1.x            | Legacy         | ✓ Yes       | ✗ No (read-only) | Minor revisions to v1.0 |
| 2.0+           | Modern         | ✓ Yes       | ✓ Yes         | New format written by RN frontend |

## Validation Pass Criteria

| Test Case | Expected Result | Test File |
|-----------|----------------|-----------|
| Valid legacy v1.0 recording | PASS (valid: true) | `legacy-recording-read-compatibility.test.ts` |
| Valid modern v2.0 recording | PASS (valid: true) | `legacy-recording-read-compatibility.test.ts` |
| Null input | FAIL (valid: false, reason: "valid object") | `legacy-recording-read-compatibility.test.ts` |
| Primitive input | FAIL (valid: false) | `legacy-recording-read-compatibility.test.ts` |
| Empty object | FAIL (valid: false) | `legacy-recording-read-compatibility.test.ts` |
| Missing recordingId | FAIL (valid: false, reason contains "recordingId") | `legacy-recording-read-compatibility.test.ts` |
| Missing fileUri | FAIL (valid: false, reason contains "fileUri") | `legacy-recording-read-compatibility.test.ts` |
| Missing formatVersion | FAIL (valid: false, reason contains "formatVersion") | `legacy-recording-read-compatibility.test.ts` |
| Version 0.9 (below minimum) | FAIL (valid: false, reason contains "0.9") | `legacy-recording-read-compatibility.test.ts` |

## Implementation Notes

- `validateRecording()` in `src/features/measurements/utils/recordingValidation.ts` enforces these rules.
- Minimum supported format version: **1.0**
- Legacy files are read-only; users who want to archive them in the new format must export via `useRecordingExport` (FR-007b).
- Corrupted file errors surface as `{ valid: false, reason: "..." }` and are shown to the user in `RecordingLibraryScreen`.
