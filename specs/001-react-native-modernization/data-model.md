# Phase 1 Data Model

## 1. ConnectionSession

- Purpose: Tracks adapter connectivity lifecycle and capabilities.
- Fields:
  - `sessionId` (string, required)
  - `transportType` (enum: `bluetooth` | `usb` | `wifi` | `demo`, required)
  - `status` (enum: `disconnected` | `connecting` | `connected` | `error`, required)
  - `connectedAt` (datetime, optional)
  - `lastError` (string, optional)
  - `vehicleCapabilities` (string[], optional)
- Validation:
  - `connectedAt` required when `status=connected`.
  - `vehicleCapabilities` can only be populated when `status=connected`.
- State transitions:
  - `disconnected -> connecting -> connected`
  - `connecting -> error`
  - `connected -> disconnected`

## 2. DiagnosticServiceAction

- Purpose: Represents one user-triggered diagnostic operation.
- Fields:
  - `actionId` (string, required)
  - `sessionId` (string, required, FK to ConnectionSession)
  - `serviceType` (enum: `vehicleInfo` | `liveData` | `freezeFrames` | `testControl` | `readCodes` | `clearCodes`, required)
  - `requestedAt` (datetime, required)
  - `completedAt` (datetime, optional)
  - `resultStatus` (enum: `success` | `failure` | `unsupported`, required)
  - `resultPayload` (object, optional)
  - `errorMessage` (string, optional)
- Validation:
  - `sessionId` must reference an active or recently active session.
  - `resultPayload` required when `resultStatus=success`.
  - `errorMessage` required when `resultStatus=failure`.

## 3. MeasurementStream

- Purpose: Live telemetry feed for table/chart/dashboard/HUD views.
- Fields:
  - `streamId` (string, required)
  - `sessionId` (string, required)
  - `metricKey` (string, required)
  - `sampleTimestamp` (datetime, required)
  - `sampleValue` (number|string, required)
  - `unit` (string, optional)
  - `qualityFlag` (enum: `ok` | `stale` | `invalid`, required)
- Validation:
  - `sampleTimestamp` must be monotonic per `(streamId, metricKey)`.
  - `qualityFlag=invalid` requires client-safe fallback rendering.

## 4. MeasurementRecording

- Purpose: Persisted telemetry session for reload/export.
- Fields:
  - `recordingId` (string, required)
  - `createdAt` (datetime, required)
  - `sourceSessionId` (string, optional)
  - `recordingName` (string, required)
  - `formatVersion` (string, required)
  - `isLegacyFormat` (boolean, required)
  - `sampleCount` (integer, required)
  - `fileUri` (string, required)
- Validation:
  - `sampleCount >= 0`.
  - `fileUri` must resolve to readable file before load operations.

## 5. UserPreferenceProfile

- Purpose: Persisted user UI and behavior preferences.
- Fields:
  - `profileId` (string, required)
  - `themeMode` (enum: `day` | `night` | `system`, required)
  - `defaultHomeScreen` (string, optional)
  - `preferredDataView` (enum: `table` | `chart` | `dashboard` | `hud`, optional)
  - `locale` (string, required)
  - `updatedAt` (datetime, required)
- Validation:
  - `locale` must map to supported locale set or fallback chain.

## 6. ExtensionModuleState

- Purpose: Runtime plugin compatibility and health state.
- Fields:
  - `moduleId` (string, required)
  - `displayName` (string, required)
  - `isInstalled` (boolean, required)
  - `isEnabled` (boolean, required)
  - `compatibilityStatus` (enum: `compatible` | `degraded` | `incompatible`, required)
  - `lastInitializationResult` (enum: `ok` | `failed` | `notRun`, required)
  - `lastError` (string, optional)
- Validation:
  - `lastError` required when `lastInitializationResult=failed`.
  - `isEnabled=true` requires `isInstalled=true`.

## Relationships

- `ConnectionSession 1:N DiagnosticServiceAction`
- `ConnectionSession 1:N MeasurementStream`
- `MeasurementRecording N:1 ConnectionSession` (optional source link)
- `UserPreferenceProfile` applies globally to UI composition/state restore.
- `ExtensionModuleState` affects available feature behavior and diagnostics workflow outcomes.