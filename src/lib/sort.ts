import type { FsEntry } from './types';

const collator = new Intl.Collator(undefined, { numeric: true, sensitivity: 'base' });

/** Folders first, then names in natural order (file2 before file10). */
export function compareEntries(a: FsEntry, b: FsEntry): number {
  if (a.kind !== b.kind) return a.kind === 'directory' ? -1 : 1;
  return collator.compare(a.name, b.name);
}

export function sortEntries(entries: FsEntry[]): FsEntry[] {
  return [...entries].sort(compareEntries);
}
