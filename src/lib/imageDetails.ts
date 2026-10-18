import { readExif } from './exif';
import { readImageInfo } from './imageSize';
import type { ExifEntry, ImageInfo } from './types';

/** Image headers and EXIF blocks live at the start of a file, so only that part is read. */
const HEADER_BYTES = 1024 * 1024;

export interface ImageDetails {
  info: ImageInfo | null;
  exif: ExifEntry[];
}

export async function readImageDetails(file: File): Promise<ImageDetails> {
  const bytes = new Uint8Array(await file.slice(0, HEADER_BYTES).arrayBuffer());
  return { info: readImageInfo(bytes), exif: readExif(bytes) };
}
