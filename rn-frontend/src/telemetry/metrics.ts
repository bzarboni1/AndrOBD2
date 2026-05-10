const counters = new Map<string, number>();

export const REQUIRED_LAUNCH_METRICS = [
  "connection.attempted",
  "connection.succeeded",
  "diagnostic.attempted",
  "diagnostic.failed",
  "session.started",
  "session.crashfree"
] as const;

export function incrementMetric(name: string, amount = 1): number {
  const nextValue = (counters.get(name) ?? 0) + amount;
  counters.set(name, nextValue);
  return nextValue;
}

export function markSessionStart(): void {
  incrementMetric("session.started");
}

export function markCrashFreeSession(): void {
  incrementMetric("session.crashfree");
}

export function recordConnectionAttempt(): void {
  incrementMetric("connection.attempted");
}

export function recordConnectionSuccess(): void {
  incrementMetric("connection.succeeded");
}

export function recordDiagnosticFailure(): void {
  incrementMetric("diagnostic.failed");
}

export function recordDiagnosticAttempt(): void {
  incrementMetric("diagnostic.attempted");
}

export function getMetricValue(name: string): number {
  return counters.get(name) ?? 0;
}

export function getLaunchMetricsSnapshot(): Record<string, number> {
  return REQUIRED_LAUNCH_METRICS.reduce<Record<string, number>>((acc, metricName) => {
    acc[metricName] = getMetricValue(metricName);
    return acc;
  }, {});
}

export function getConnectionSuccessRate(): number {
  const attempts = getMetricValue("connection.attempted");
  if (attempts === 0) return 0;
  return getMetricValue("connection.succeeded") / attempts;
}

export function getDiagnosticFailureRate(): number {
  const failed = getMetricValue("diagnostic.failed");
  const attempts = getMetricValue("diagnostic.attempted");
  if (attempts === 0) return 0;
  return failed / attempts;
}

export function getCrashFreeSessionRate(): number {
  const started = getMetricValue("session.started");
  if (started === 0) return 0;
  return getMetricValue("session.crashfree") / started;
}

export function resetMetric(name: string): void {
  counters.delete(name);
}
