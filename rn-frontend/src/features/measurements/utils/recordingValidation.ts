import { MeasurementRecording } from "../../../types/domain";

export type ValidationResult =
  | { valid: true; recording: MeasurementRecording }
  | { valid: false; reason: string };

const MIN_FORMAT_VERSION = "1.0";

export function validateRecording(candidate: unknown): ValidationResult {
  if (typeof candidate !== "object" || candidate === null) {
    return { valid: false, reason: "Recording data is not a valid object." };
  }

  const obj = candidate as Record<string, unknown>;

  if (typeof obj.recordingId !== "string" || obj.recordingId.trim() === "") {
    return { valid: false, reason: "Recording is missing a valid recordingId." };
  }
  if (typeof obj.fileUri !== "string" || obj.fileUri.trim() === "") {
    return { valid: false, reason: "Recording is missing a fileUri." };
  }
  if (typeof obj.formatVersion !== "string") {
    return { valid: false, reason: "Recording is missing formatVersion." };
  }

  if (!isVersionCompatible(obj.formatVersion as string, MIN_FORMAT_VERSION)) {
    return {
      valid: false,
      reason: `Recording format version ${obj.formatVersion} is not supported. Minimum required: ${MIN_FORMAT_VERSION}.`
    };
  }

  return {
    valid: true,
    recording: {
      recordingId: obj.recordingId as string,
      createdAt: (obj.createdAt as string | undefined) ?? new Date().toISOString(),
      sourceSessionId: obj.sourceSessionId as string | undefined,
      recordingName: (obj.recordingName as string | undefined) ?? obj.recordingId as string,
      formatVersion: obj.formatVersion as string,
      isLegacyFormat: Boolean(obj.isLegacyFormat),
      sampleCount: typeof obj.sampleCount === "number" ? obj.sampleCount : 0,
      fileUri: obj.fileUri as string
    }
  };
}

function isVersionCompatible(version: string, minimum: string): boolean {
  const [maj, min] = version.split(".").map(Number);
  const [minMaj, minMin] = minimum.split(".").map(Number);
  if (maj !== minMaj) return maj > minMaj;
  return min >= minMin;
}
