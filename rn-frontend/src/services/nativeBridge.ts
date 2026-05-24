import type {
  ConnectionSession,
  DiagnosticServiceAction,
  DiagnosticServiceType,
  ExtensionModuleState,
  MeasurementRecording,
  LiveDataSample,
  PluginActionResult,
  TransportType,
  UserPreferenceProfile
} from "../types/domain";

import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_KEY = "androbd.preferences";

const liveStreams = new Map<string, { sessionId: string; selectedPids: string[] }>();
const recordings = new Map<string, MeasurementRecording>();

let activeSession: ConnectionSession | null = null;

const defaultPreferences: UserPreferenceProfile = {
  profileId: "default",
  themeMode: "system",
  defaultHomeScreen: "Home",
  preferredDataView: "table",
  locale: "en",
  updatedAt: new Date().toISOString()
};

const demoFaultCodes = [
  { code: "P0301", description: "Cylinder 1 misfire detected", status: "stored" },
  { code: "P0420", description: "Catalyst system efficiency below threshold", status: "pending" }
];

const demoFreezeFrames = [
  { pid: "0C", label: "Engine RPM", value: 845, unit: "rpm" },
  { pid: "0D", label: "Vehicle Speed", value: 0, unit: "km/h" },
  { pid: "05", label: "Coolant Temp", value: 82, unit: "C" }
];

const demoTestControls = [
  { id: "o2-heater", label: "O2 Heater Test", status: "available" },
  { id: "evap-purge", label: "EVAP Purge Test", status: "available" }
];

function createId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function ensureConnectedSession(sessionId: string): void {
  if (!activeSession || activeSession.sessionId !== sessionId || activeSession.status !== "connected") {
    throw new Error("No active connected session.");
  }
}

function nowIso(): string {
  return new Date().toISOString();
}

async function readPreferences(): Promise<UserPreferenceProfile> {
  try {
    const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
    if (!raw) return defaultPreferences;
    const parsed = JSON.parse(raw) as Partial<UserPreferenceProfile>;
    return {
      ...defaultPreferences,
      ...parsed,
      updatedAt: typeof parsed.updatedAt === "string" ? parsed.updatedAt : nowIso()
    };
  } catch {
    return defaultPreferences;
  }
}

async function writePreferences(next: UserPreferenceProfile): Promise<void> {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
}

function buildAction(
  sessionId: string,
  serviceType: DiagnosticServiceType,
  resultStatus: DiagnosticServiceAction["resultStatus"],
  resultPayload?: unknown,
  errorMessage?: string
): DiagnosticServiceAction {
  return {
    actionId: createId("action"),
    sessionId,
    serviceType,
    requestedAt: nowIso(),
    completedAt: nowIso(),
    resultStatus,
    resultPayload,
    errorMessage
  };
}

function buildDemoRecording(recordingId: string, sourceSessionId?: string): MeasurementRecording {
  return {
    recordingId,
    createdAt: nowIso(),
    sourceSessionId,
    recordingName: `Demo Recording ${new Date().toLocaleTimeString()}`,
    formatVersion: "2.0",
    isLegacyFormat: true,
    sampleCount: 42,
    fileUri: `recordings/${recordingId}.obd`
  };
}

export function buildDemoSamples(): LiveDataSample[] {
  const timestamp = nowIso();
  return [
    { pid: "0C", label: "Engine RPM", value: 820, unit: "rpm", timestamp },
    { pid: "0D", label: "Vehicle Speed", value: 0, unit: "km/h", timestamp },
    { pid: "11", label: "Throttle Position", value: 13, unit: "%", timestamp },
    { pid: "05", label: "Coolant Temp", value: 84, unit: "C", timestamp }
  ];
}

export const nativeBridge = {
  async connect(
    transportType: TransportType,
    _options?: Record<string, unknown>
  ): Promise<ConnectionSession> {
    const session: ConnectionSession = {
      sessionId: createId("session"),
      transportType,
      status: "connected",
      connectedAt: nowIso(),
      vehicleCapabilities: [
        "vehicleInfo",
        "readCodes",
        "clearCodes",
        "freezeFrames",
        "testControl",
        "liveData"
      ]
    };
    activeSession = session;
    return session;
  },

  async disconnect(sessionId: string): Promise<{ status: string }> {
    ensureConnectedSession(sessionId);
    activeSession = { ...activeSession!, status: "disconnected" };
    return { status: "disconnected" };
  },

  async getConnectionState(): Promise<ConnectionSession> {
    return (
      activeSession ?? {
        sessionId: "",
        transportType: "demo",
        status: "disconnected"
      }
    );
  },

  async runDiagnosticAction(
    sessionId: string,
    serviceType: DiagnosticServiceType,
    _params?: Record<string, unknown>
  ): Promise<DiagnosticServiceAction> {
    ensureConnectedSession(sessionId);
    switch (serviceType) {
      case "vehicleInfo":
        return buildAction(sessionId, serviceType, "success", {
          vin: "WVWZZZ1JZXW000001",
          ecuName: "Demo ECU",
          protocol: "ISO 15765-4 CAN"
        });
      case "readCodes":
        return buildAction(sessionId, serviceType, "success", demoFaultCodes);
      case "freezeFrames":
        return buildAction(sessionId, serviceType, "success", demoFreezeFrames);
      case "testControl":
        return buildAction(sessionId, serviceType, "success", demoTestControls);
      case "liveData":
        return buildAction(sessionId, serviceType, "success", buildDemoSamples());
      case "clearCodes":
        return buildAction(sessionId, serviceType, "success", { cleared: true });
      default:
        return buildAction(sessionId, serviceType, "unsupported", undefined, "Unsupported service");
    }
  },

  async clearFaultCodes(
    sessionId: string,
    confirmationToken: string
  ): Promise<DiagnosticServiceAction> {
    ensureConnectedSession(sessionId);
    if (!confirmationToken.startsWith("clear-")) {
      return buildAction(sessionId, "clearCodes", "failure", undefined, "Invalid confirmation token");
    }
    return buildAction(sessionId, "clearCodes", "success", { cleared: true });
  },

  async startLiveData(
    sessionId: string,
    selectedPids: string[]
  ): Promise<{ streamId: string }> {
    ensureConnectedSession(sessionId);
    const streamId = createId("stream");
    liveStreams.set(streamId, { sessionId, selectedPids });
    return { streamId };
  },

  async stopLiveData(streamId: string): Promise<{ status: string }> {
    liveStreams.delete(streamId);
    return { status: "stopped" };
  },

  async startRecording(
    streamId: string,
    _metadata?: Record<string, unknown>
  ): Promise<{ recordingId: string }> {
    if (!liveStreams.has(streamId)) {
      throw new Error("Live data stream must be active before recording.");
    }
    const recordingId = createId("recording");
    return { recordingId };
  },

  async stopRecording(recordingId: string): Promise<MeasurementRecording> {
    const recording = buildDemoRecording(recordingId, activeSession?.sessionId);
    recordings.set(recordingId, recording);
    return recording;
  },

  async loadRecording(fileUri: string): Promise<MeasurementRecording> {
    if (fileUri === "user-picker") {
      const recordingId = createId("recording");
      const recording = buildDemoRecording(recordingId, activeSession?.sessionId);
      recordings.set(recordingId, recording);
      return recording;
    }
    const matched = Array.from(recordings.values()).find((entry) => entry.fileUri === fileUri);
    if (matched) return matched;
    throw new Error("Recording file not found or unsupported.");
  },

  async exportRecording(
    recordingId: string,
    _format: "legacy" = "legacy"
  ): Promise<{ fileUri: string }> {
    const recording = recordings.get(recordingId);
    if (!recording) {
      throw new Error("Recording does not exist.");
    }
    return { fileUri: `exports/${recording.recordingName.replace(/\s+/g, "_")}.csv` };
  },

  async getPreferences(): Promise<UserPreferenceProfile> {
    return readPreferences();
  },

  async setPreference(key: string, value: unknown): Promise<{ status: string }> {
    const current = await readPreferences();
    const next = {
      ...current,
      [key]: value,
      updatedAt: nowIso()
    } as UserPreferenceProfile;
    await writePreferences(next);
    return { status: "ok" };
  },

  async listPlugins(): Promise<ExtensionModuleState[]> {
    return [
      {
        moduleId: "mqtt",
        displayName: "MQTT Publisher",
        isInstalled: true,
        isEnabled: true,
        compatibilityStatus: "compatible",
        lastInitializationResult: "ok"
      },
      {
        moduleId: "gps",
        displayName: "GPS Provider",
        isInstalled: true,
        isEnabled: false,
        compatibilityStatus: "compatible",
        lastInitializationResult: "notRun"
      }
    ];
  },

  async invokePluginAction(
    moduleId: string,
    action: string,
    payload?: unknown
  ): Promise<PluginActionResult> {
    return {
      status: "ok",
      data: {
        moduleId,
        action,
        payload,
        executedAt: nowIso()
      }
    };
  }
};
