import type { ConnectionSession, DiagnosticServiceType } from "../../../types/domain";

export interface EligibilityResult {
  eligible: boolean;
  reason?: string;
}

const SERVICE_LABELS: Record<DiagnosticServiceType, string> = {
  vehicleInfo: "Vehicle information",
  liveData: "Live data",
  freezeFrames: "Freeze frame retrieval",
  testControl: "Test controls",
  readCodes: "Read fault codes",
  clearCodes: "Clear fault codes"
};

export function checkActionEligibility(
  session: ConnectionSession | null,
  serviceType: DiagnosticServiceType
): EligibilityResult {
  if (!session || session.status !== "connected") {
    return {
      eligible: false,
      reason: "A vehicle connection is required. Please connect to your adapter first."
    };
  }

  if (
    session.vehicleCapabilities &&
    session.vehicleCapabilities.length > 0 &&
    !session.vehicleCapabilities.includes(serviceType)
  ) {
    return {
      eligible: false,
      reason: `${SERVICE_LABELS[serviceType]} is not supported by this vehicle.`
    };
  }

  return { eligible: true };
}
