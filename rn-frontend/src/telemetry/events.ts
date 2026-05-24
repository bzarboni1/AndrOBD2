type LogLevel = "info" | "warn" | "error";

interface LogEvent {
  event: string;
  level: LogLevel;
  correlationId?: string;
  payload?: Record<string, unknown>;
}

const emittedEventNames = new Set<string>();

export const REQUIRED_LAUNCH_EVENTS = [
  "connection.attempt",
  "connection.success",
  "connection.failure",
  "diagnostic.action.start",
  "diagnostic.action.complete",
  "diagnostic.action.error",
  "plugins.load.start",
  "plugins.load.complete",
  "plugins.load.error"
] as const;

export function emitStructuredLog(logEvent: LogEvent): void {
  const timestamp = new Date().toISOString();
  emittedEventNames.add(logEvent.event);
  // Placeholder sink; later phases can route to production telemetry backends.
  console.log(JSON.stringify({ timestamp, ...logEvent }));
}

export function emitDiagnosticEvent(
  event: string,
  payload?: Record<string, unknown>,
  correlationId?: string
): void {
  emitStructuredLog({ event, level: "info", payload, correlationId });
}

export function getObservabilityVerificationStatus(): {
  allRequiredEventsSeen: boolean;
  missingEvents: string[];
} {
  const missingEvents = REQUIRED_LAUNCH_EVENTS.filter((name) => !emittedEventNames.has(name));
  return {
    allRequiredEventsSeen: missingEvents.length === 0,
    missingEvents: [...missingEvents]
  };
}
