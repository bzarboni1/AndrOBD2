import type {
  ConnectionSession,
  DiagnosticServiceAction,
  DiagnosticServiceType,
  ExtensionModuleState,
  MeasurementRecording,
  TransportType,
  UserPreferenceProfile
} from "../types/domain";

function notImplemented(methodName: string): never {
  throw new Error(`nativeBridge.${methodName} is not implemented yet.`);
}

export const nativeBridge = {
  async connect(
    _transportType: TransportType,
    _options?: Record<string, unknown>
  ): Promise<ConnectionSession> {
    return Promise.reject(notImplemented("connect"));
  },

  async disconnect(_sessionId: string): Promise<{ status: string }> {
    return Promise.reject(notImplemented("disconnect"));
  },

  async getConnectionState(): Promise<ConnectionSession> {
    return Promise.reject(notImplemented("getConnectionState"));
  },

  async runDiagnosticAction(
    _sessionId: string,
    _serviceType: DiagnosticServiceType,
    _params?: Record<string, unknown>
  ): Promise<DiagnosticServiceAction> {
    return Promise.reject(notImplemented("runDiagnosticAction"));
  },

  async clearFaultCodes(
    _sessionId: string,
    _confirmationToken: string
  ): Promise<DiagnosticServiceAction> {
    return Promise.reject(notImplemented("clearFaultCodes"));
  },

  async startLiveData(
    _sessionId: string,
    _selectedPids: string[]
  ): Promise<{ streamId: string }> {
    return Promise.reject(notImplemented("startLiveData"));
  },

  async stopLiveData(_streamId: string): Promise<{ status: string }> {
    return Promise.reject(notImplemented("stopLiveData"));
  },

  async startRecording(
    _streamId: string,
    _metadata?: Record<string, unknown>
  ): Promise<{ recordingId: string }> {
    return Promise.reject(notImplemented("startRecording"));
  },

  async stopRecording(_recordingId: string): Promise<MeasurementRecording> {
    return Promise.reject(notImplemented("stopRecording"));
  },

  async loadRecording(_fileUri: string): Promise<MeasurementRecording> {
    return Promise.reject(notImplemented("loadRecording"));
  },

  async exportRecording(
    _recordingId: string,
    _format: "legacy" = "legacy"
  ): Promise<{ fileUri: string }> {
    return Promise.reject(notImplemented("exportRecording"));
  },

  async getPreferences(): Promise<UserPreferenceProfile> {
    return Promise.reject(notImplemented("getPreferences"));
  },

  async setPreference(_key: string, _value: unknown): Promise<{ status: string }> {
    return Promise.reject(notImplemented("setPreference"));
  },

  async listPlugins(): Promise<ExtensionModuleState[]> {
    return Promise.reject(notImplemented("listPlugins"));
  },

  async invokePluginAction(
    _moduleId: string,
    _action: string,
    _payload?: unknown
  ): Promise<{ status: string; data?: unknown }> {
    return Promise.reject(notImplemented("invokePluginAction"));
  }
};
