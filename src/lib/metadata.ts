import { describeType } from './format';
import type { FileMetadata } from './types';

export function getFileMetadata(file: File): FileMetadata {
  return {
    name: file.name,
    size: file.size,
    type: describeType(file.name, file.type),
    lastModified: new Date(file.lastModified),
  };
}
