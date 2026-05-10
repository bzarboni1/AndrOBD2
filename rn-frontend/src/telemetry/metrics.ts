const counters = new Map<string, number>();

export function incrementMetric(name: string, amount = 1): number {
  const nextValue = (counters.get(name) ?? 0) + amount;
  counters.set(name, nextValue);
  return nextValue;
}

export function getMetricValue(name: string): number {
  return counters.get(name) ?? 0;
}

export function resetMetric(name: string): void {
  counters.delete(name);
}
