/**
 * Legacy Recording Read Compatibility Tests (T060)
 *
 * Validates that the recordingValidation utility correctly accepts legacy-format
 * recordings and rejects corrupted or incompatible files.
 *
 * Run with: cd rn-frontend && npx jest tests/integration/legacy-recording-read-compatibility.test.ts
 */
import { validateRecording } from "../../src/features/measurements/utils/recordingValidation";

const LEGACY_VALID: unknown = {
  recordingId: "legacy-001",
  fileUri: "file:///sdcard/androbd/recordings/legacy-001.obd",
  formatVersion: "1.0",
  isLegacyFormat: true,
  recordingName: "Legacy Session 1",
  createdAt: "2024-01-15T12:00:00Z",
  sampleCount: 1200
};

const MODERN_VALID: unknown = {
  recordingId: "modern-001",
  fileUri: "file:///sdcard/androbd/recordings/modern-001.obd2",
  formatVersion: "2.0",
  isLegacyFormat: false,
  recordingName: "Modern Session 1",
  createdAt: "2026-03-01T08:30:00Z",
  sampleCount: 4800
};

const MISSING_ID: unknown = {
  fileUri: "file:///sdcard/androbd/recordings/bad.obd",
  formatVersion: "1.0"
};

const MISSING_FILE_URI: unknown = {
  recordingId: "no-uri-001",
  formatVersion: "1.0"
};

const MISSING_VERSION: unknown = {
  recordingId: "no-version-001",
  fileUri: "file:///sdcard/androbd/recordings/no-version.obd"
};

const INCOMPATIBLE_VERSION: unknown = {
  recordingId: "old-001",
  fileUri: "file:///sdcard/androbd/recordings/old.obd",
  formatVersion: "0.9"
};

const NULL_INPUT: unknown = null;
const PRIMITIVE_INPUT: unknown = "not-an-object";
const EMPTY_OBJECT: unknown = {};

describe("Legacy Recording Read Compatibility", () => {
  describe("Valid recordings", () => {
    it("accepts a valid legacy format recording (v1.0)", () => {
      const result = validateRecording(LEGACY_VALID);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.recording.recordingId).toBe("legacy-001");
        expect(result.recording.isLegacyFormat).toBe(true);
        expect(result.recording.formatVersion).toBe("1.0");
      }
    });

    it("accepts a valid modern format recording (v2.0)", () => {
      const result = validateRecording(MODERN_VALID);
      expect(result.valid).toBe(true);
      if (result.valid) {
        expect(result.recording.isLegacyFormat).toBe(false);
        expect(result.recording.sampleCount).toBe(4800);
      }
    });
  });

  describe("Corrupted or incomplete recordings", () => {
    it("rejects null input", () => {
      const result = validateRecording(NULL_INPUT);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("valid object");
      }
    });

    it("rejects primitive input", () => {
      const result = validateRecording(PRIMITIVE_INPUT);
      expect(result.valid).toBe(false);
    });

    it("rejects empty object", () => {
      const result = validateRecording(EMPTY_OBJECT);
      expect(result.valid).toBe(false);
    });

    it("rejects recording with missing recordingId", () => {
      const result = validateRecording(MISSING_ID);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("recordingId");
      }
    });

    it("rejects recording with missing fileUri", () => {
      const result = validateRecording(MISSING_FILE_URI);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("fileUri");
      }
    });

    it("rejects recording with missing formatVersion", () => {
      const result = validateRecording(MISSING_VERSION);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("formatVersion");
      }
    });
  });

  describe("Incompatible format versions", () => {
    it("rejects recordings with version below minimum (0.9 < 1.0)", () => {
      const result = validateRecording(INCOMPATIBLE_VERSION);
      expect(result.valid).toBe(false);
      if (!result.valid) {
        expect(result.reason).toContain("0.9");
        expect(result.reason).toContain("1.0");
      }
    });
  });
});
