import { fromDirectoryHandle, fromFileList } from './sources';
import type { DirectoryEntry } from './types';

interface DirectoryPickerWindow {
  showDirectoryPicker?: (options?: {
    mode?: 'read' | 'readwrite';
  }) => Promise<FileSystemDirectoryHandle>;
}

export function supportsDirectoryPicker(): boolean {
  return typeof (window as DirectoryPickerWindow).showDirectoryPicker === 'function';
}

/** Asks for a folder with read-only access. Resolves null if the user cancels. */
export async function pickDirectory(): Promise<DirectoryEntry | null> {
  const picker = (window as DirectoryPickerWindow).showDirectoryPicker;
  if (!picker) throw new Error('This browser cannot open folders directly.');
  try {
    const handle = await picker.call(window, { mode: 'read' });
    return fromDirectoryHandle(handle);
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') return null;
    throw error;
  }
}

/** Fallback used with `<input type="file" webkitdirectory>`. */
export function directoryFromInput(files: FileList | null): DirectoryEntry | null {
  return files ? fromFileList(Array.from(files)) : null;
}
