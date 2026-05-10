type LogLevel = "info" | "warn" | "error";

interface LogEvent {
  event: string;
  level: LogLevel;
  correlationId?: string;
  payload?: Record<string, unknown>;
}

export function emitStructuredLog(logEvent: LogEvent): void {
  const timestamp = new Date().toISOString();
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
