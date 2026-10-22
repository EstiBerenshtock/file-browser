import { describe, expect, it } from 'vitest';
import { formatSummary, summarizeEntries } from './summary';
import type { FsEntry } from './types';

const file = (name: string): FsEntry => ({
  kind: 'file',
  name,
  path: name,
  getFile: async () => new File([], name),
});

describe('folder summary', () => {
  it('counts files and images, ignoring subfolders', () => {
    const dir: FsEntry = { kind: 'directory', name: 'd', path: 'd', getChildren: async () => [] };
    const summary = summarizeEntries([file('a.png'), file('b.txt'), file('c.JPG'), dir]);
    expect(summary).toEqual({ files: 3, images: 2 });
    expect(formatSummary(summary)).toBe('3 files · 2 images');
  });

  it('handles empty and singular cases', () => {
    expect(formatSummary(summarizeEntries([]))).toBe('0 files · 0 images');
    expect(formatSummary(summarizeEntries([file('a.png')]))).toBe('1 file · 1 image');
  });
});
