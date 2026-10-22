import { isImage } from './format';
import type { FsEntry } from './types';

export interface FolderSummary {
  files: number;
  images: number;
}

/** Counts the files directly inside a folder, and how many of them are images. */
export function summarizeEntries(entries: FsEntry[]): FolderSummary {
  const files = entries.filter((entry) => entry.kind === 'file');
  return { files: files.length, images: files.filter((f) => isImage(f.name, '')).length };
}

export function formatSummary({ files, images }: FolderSummary): string {
  return `${files} ${files === 1 ? 'file' : 'files'} · ${images} ${images === 1 ? 'image' : 'images'}`;
}
