import { describe, expect, it } from 'vitest';
import { describeType, formatSize, isImage } from './format';
import { getFileMetadata } from './metadata';
import { fromFileList } from './sources';
import type { FsEntry } from './types';

function fileAt(path: string, content = 'x'): File {
  const file = new File([content], path.split('/').pop() ?? path, { lastModified: 1_700_000_000_000 });
  Object.defineProperty(file, 'webkitRelativePath', { value: path });
  return file;
}

describe('formatSize', () => {
  it('uses readable units', () => {
    expect(formatSize(0)).toBe('0 B');
    expect(formatSize(512)).toBe('512 B');
    expect(formatSize(1536)).toBe('1.50 KB');
    expect(formatSize(5 * 1024 * 1024)).toBe('5.00 MB');
    expect(formatSize(-1)).toBe('—');
  });
});

describe('type helpers', () => {
  it('describes types by extension, then MIME type', () => {
    expect(describeType('photo.JPG', '')).toBe('JPEG image');
    expect(describeType('data.xyz', 'application/x-custom')).toBe('application/x-custom');
    expect(describeType('data.xyz', '')).toBe('XYZ file');
    expect(describeType('README', '')).toBe('File');
  });

  it('detects images', () => {
    expect(isImage('a.png', '')).toBe(true);
    expect(isImage('a', 'image/webp')).toBe(true);
    expect(isImage('a.txt', 'text/plain')).toBe(false);
  });
});

describe('getFileMetadata', () => {
  it('returns name, size, type and modified date', () => {
    const meta = getFileMetadata(fileAt('dir/note.txt', 'hello'));
    expect(meta.name).toBe('note.txt');
    expect(meta.size).toBe(5);
    expect(meta.type).toBe('Plain text');
    expect(meta.lastModified.getTime()).toBe(1_700_000_000_000);
  });
});

describe('fromFileList', () => {
  const names = (entries: FsEntry[]) => entries.map((e) => `${e.kind}:${e.name}`);

  it('builds a sorted tree with folders first', async () => {
    const root = fromFileList([
      fileAt('root/b.txt'),
      fileAt('root/a/deep/file10.txt'),
      fileAt('root/a/deep/file2.txt'),
      fileAt('root/a/z.txt'),
      fileAt('root/C.txt'),
    ]);
    expect(root?.name).toBe('root');

    const top = await root!.getChildren();
    expect(names(top)).toEqual(['directory:a', 'file:b.txt', 'file:C.txt']);

    const a = top[0];
    if (a.kind !== 'directory') throw new Error('expected a folder');
    const inner = await a.getChildren();
    expect(names(inner)).toEqual(['directory:deep', 'file:z.txt']);

    const deep = inner[0];
    if (deep.kind !== 'directory') throw new Error('expected a folder');
    expect(names(await deep.getChildren())).toEqual(['file:file2.txt', 'file:file10.txt']);
    expect(deep.path).toBe('root/a/deep');
  });

  it('returns null for an empty selection', () => {
    expect(fromFileList([])).toBeNull();
  });
});
