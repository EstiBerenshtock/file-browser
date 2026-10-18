export interface FileEntry {
  kind: 'file';
  name: string;
  /** Path relative to the chosen folder, including the folder's own name. */
  path: string;
  getFile: () => Promise<File>;
}

export interface DirectoryEntry {
  kind: 'directory';
  name: string;
  path: string;
  getChildren: () => Promise<FsEntry[]>;
}

export type FsEntry = FileEntry | DirectoryEntry;

export interface FileMetadata {
  name: string;
  size: number;
  type: string;
  lastModified: Date;
}

export interface ExifEntry {
  label: string;
  value: string;
}

export interface ImageInfo {
  width: number;
  height: number;
  format: string;
}
