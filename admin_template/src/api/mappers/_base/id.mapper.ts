export function toNumericId(id: string | number | null | undefined): number {
  if (id === null || id === undefined) return 0;
  if (typeof id === 'number') return id;
  // Handle formats like 'rec-001' or 'u-pat-102' -> extract digits or hash
  const match = id.match(/\d+/);
  if (match) return parseInt(match[0], 10);
  const parsed = parseInt(id, 10);
  return isNaN(parsed) ? 0 : parsed;
}

export function toStringId(id: string | number | null | undefined): string {
  if (id === null || id === undefined) return '';
  return String(id);
}
