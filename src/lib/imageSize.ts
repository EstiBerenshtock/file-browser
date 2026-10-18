import type { ImageInfo } from './types';

function ascii(bytes: Uint8Array, start: number, length: number): string {
  let text = '';
  for (let i = start; i < start + length && i < bytes.length; i++) {
    text += String.fromCharCode(bytes[i]);
  }
  return text;
}

function readJpeg(bytes: Uint8Array): ImageInfo | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 <= bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset++;
      continue;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xff) {
      offset++;
      continue;
    }
    // Standalone markers have no length field.
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = view.getUint16(offset + 2);
    const isFrame =
      marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isFrame) {
      if (offset + 9 > bytes.length) return null;
      return {
        height: view.getUint16(offset + 5),
        width: view.getUint16(offset + 7),
        format: 'JPEG',
      };
    }
    offset += 2 + length;
  }
  return null;
}

function readWebp(bytes: Uint8Array): ImageInfo | null {
  const chunk = ascii(bytes, 12, 4);
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  if (chunk === 'VP8X' && bytes.length >= 30) {
    const width = 1 + (bytes[24] | (bytes[25] << 8) | (bytes[26] << 16));
    const height = 1 + (bytes[27] | (bytes[28] << 8) | (bytes[29] << 16));
    return { width, height, format: 'WebP' };
  }
  if (chunk === 'VP8 ' && bytes.length >= 30) {
    return {
      width: view.getUint16(26, true) & 0x3fff,
      height: view.getUint16(28, true) & 0x3fff,
      format: 'WebP',
    };
  }
  if (chunk === 'VP8L' && bytes.length >= 25) {
    const bits = view.getUint32(21, true);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1, format: 'WebP' };
  }
  return null;
}

/** Reads width and height from the header bytes of PNG, JPEG, GIF, BMP and WebP files. */
export function readImageInfo(bytes: Uint8Array): ImageInfo | null {
  if (bytes.length < 12) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (bytes[0] === 0x89 && ascii(bytes, 1, 3) === 'PNG' && bytes.length >= 24) {
    return { width: view.getUint32(16), height: view.getUint32(20), format: 'PNG' };
  }
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return readJpeg(bytes);
  if (ascii(bytes, 0, 3) === 'GIF') {
    return { width: view.getUint16(6, true), height: view.getUint16(8, true), format: 'GIF' };
  }
  if (ascii(bytes, 0, 2) === 'BM' && bytes.length >= 26) {
    return {
      width: Math.abs(view.getInt32(18, true)),
      height: Math.abs(view.getInt32(22, true)),
      format: 'BMP',
    };
  }
  if (ascii(bytes, 0, 4) === 'RIFF' && ascii(bytes, 8, 4) === 'WEBP') return readWebp(bytes);
  return null;
}
