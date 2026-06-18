export function logInfo(event: string, meta: Record<string, unknown> = {}): void {
  console.log(JSON.stringify({ level: 'info', time: new Date().toISOString(), event, ...meta }));
}

export function logError(event: string, meta: Record<string, unknown> = {}): void {
  console.error(JSON.stringify({ level: 'error', time: new Date().toISOString(), event, ...meta }));
}
