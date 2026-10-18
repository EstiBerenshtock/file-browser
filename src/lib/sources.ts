import { sortEntries } from './sort';
import type { DirectoryEntry, FsEntry } from './types';

/** Wraps a directory handle (File System Access API). Only reads, never writes. */
export function fromDirectoryHandle(
  handle: FileSystemDirectoryHandle,
  parentPath = '',
): DirectoryEntry {
  const path = parentPath ? `${parentPath}/${handle.name}` : handle.name;
  return {
    kind: 'directory',
    name: handle.name,
    path,
    getChildren: async () => {
      const children: FsEntry[] = [];
      for await (const child of handle.values()) {
        if (child.kind === 'directory') {
          children.push(fromDirectoryHandle(child as FileSystemDirectoryHandle, path));
        } else {
          const fileHandle = child as FileSystemFileHandle;
          children.push({
            kind: 'file',
            name: fileHandle.name,
            path: `${path}/${fileHandle.name}`,
            getFile: () => fileHandle.getFile(),
          });
        }
      }
      return sortEntries(children);
    },
  };
}

interface MutableDir {
  name: string;
  path: string;
  dirs: Map<string, MutableDir>;
  files: Map<string, File>;
}

function newDir(name: string, path: string): MutableDir {
  return { name, path, dirs: new Map(), files: new Map() };
}

function toEntry(dir: MutableDir): DirectoryEntry {
  return {
    kind: 'directory',
    name: dir.name,
    path: dir.path,
    getChildren: async () => {
      const children: FsEntry[] = [];
      for (const sub of dir.dirs.values()) children.push(toEntry(sub));
      for (const [name, file] of dir.files) {
        children.push({
          kind: 'file',
          name,
          path: `${dir.path}/${name}`,
          getFile: async () => file,
        });
      }
      return sortEntries(children);
    },
  };
}

/**
 * Fallback for browsers without showDirectoryPicker: builds a tree from the
 * flat file list of `<input webkitdirectory>`. Returns null for an empty list.
 */
export function fromFileList(files: Iterable<File>): DirectoryEntry | null {
  let root: MutableDir | null = null;
  for (const file of files) {
    const parts = (file.webkitRelativePath || file.name).split('/').filter(Boolean);
    if (parts.length === 0) continue;
    root ??= newDir(parts.length > 1 ? parts[0] : '', parts.length > 1 ? parts[0] : '');
    let dir = root;
    for (const part of parts.slice(1, -1)) {
      let next = dir.dirs.get(part);
      if (!next) {
        next = newDir(part, `${dir.path}/${part}`);
        dir.dirs.set(part, next);
      }
      dir = next;
    }
    dir.files.set(parts[parts.length - 1], file);
  }
  return root ? toEntry(root) : null;
}
