export type TransportType = "bluetooth" | "usb" | "wifi" | "demo";

export type ConnectionStatus = "disconnected" | "connecting" | "connected" | "error";

export type DiagnosticServiceType =
  | "vehicleInfo"
  | "liveData"
  | "freezeFrames"
  | "testControl"
  | "readCodes"
  | "clearCodes";

export interface ConnectionSession {
  sessionId: string;
  transportType: TransportType;
  status: ConnectionStatus;
  connectedAt?: string;
  lastError?: string;
  vehicleCapabilities?: DiagnosticServiceType[];
}

export interface DiagnosticServiceAction {
  actionId: string;
  sessionId: string;
  serviceType: DiagnosticServiceType;
  requestedAt: string;
  completedAt?: string;
  resultStatus: "success" | "failure" | "unsupported";
  resultPayload?: unknown;
  errorMessage?: string;
}

export interface LiveDataSample {
  pid: string;
  label: string;
  value: number;
  unit: string;
  timestamp: string;
}

export interface MeasurementRecording {
  recordingId: string;
  createdAt: string;
  sourceSessionId?: string;
  recordingName: string;
  formatVersion: string;
  isLegacyFormat: boolean;
  sampleCount: number;
  fileUri: string;
}

export interface UserPreferenceProfile {
  profileId: string;
  themeMode: "day" | "night" | "system";
  defaultHomeScreen?: string;
  preferredDataView?: "table" | "chart" | "dashboard" | "hud";
  locale: string;
  updatedAt: string;
}

export interface ExtensionModuleState {
  moduleId: string;
  displayName: string;
  isInstalled: boolean;
  isEnabled: boolean;
  compatibilityStatus: "compatible" | "degraded" | "incompatible";
  lastInitializationResult: "ok" | "failed" | "notRun";
  lastError?: string;
}

export interface PluginActionResult {
  status: string;
  data?: unknown;
}
