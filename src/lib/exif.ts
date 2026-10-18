import type { ExifEntry } from './types';

type TagValue = string | number[];
type TagMap = Map<number, TagValue>;

const TYPE_SIZES: Record<number, number> = {
  1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 6: 1, 7: 1, 8: 2, 9: 4, 10: 8, 11: 4, 12: 8,
};

const ORIENTATIONS: Record<number, string> = {
  1: 'Normal',
  2: 'Mirrored horizontally',
  3: 'Rotated 180°',
  4: 'Mirrored vertically',
  5: 'Mirrored, rotated 90° CCW',
  6: 'Rotated 90° CW',
  7: 'Mirrored, rotated 90° CW',
  8: 'Rotated 90° CCW',
};

const IFD_POINTER_EXIF = 0x8769;
const IFD_POINTER_GPS = 0x8825;

function readValue(view: DataView, tiff: number, entry: number, little: boolean): TagValue | null {
  const type = view.getUint16(entry + 2, little);
  const count = view.getUint32(entry + 4, little);
  const unit = TYPE_SIZES[type];
  if (!unit || count > 0xffff) return null;
  const total = unit * count;
  const start = total > 4 ? tiff + view.getUint32(entry + 8, little) : entry + 8;
  if (start < 0 || start + total > view.byteLength) return null;

  if (type === 2) {
    let text = '';
    for (let i = 0; i < count; i++) {
      const code = view.getUint8(start + i);
      if (code === 0) break;
      text += String.fromCharCode(code);
    }
    return text.trim();
  }

  const values: number[] = [];
  for (let i = 0; i < count; i++) {
    const at = start + i * unit;
    switch (type) {
      case 1:
      case 7:
        values.push(view.getUint8(at));
        break;
      case 6:
        values.push(view.getInt8(at));
        break;
      case 3:
        values.push(view.getUint16(at, little));
        break;
      case 8:
        values.push(view.getInt16(at, little));
        break;
      case 4:
        values.push(view.getUint32(at, little));
        break;
      case 9:
        values.push(view.getInt32(at, little));
        break;
      case 5: {
        const den = view.getUint32(at + 4, little);
        values.push(den === 0 ? 0 : view.getUint32(at, little) / den);
        break;
      }
      case 10: {
        const den = view.getInt32(at + 4, little);
        values.push(den === 0 ? 0 : view.getInt32(at, little) / den);
        break;
      }
      case 11:
        values.push(view.getFloat32(at, little));
        break;
      default:
        values.push(view.getFloat64(at, little));
    }
  }
  return values;
}

function readIfd(view: DataView, tiff: number, offset: number, little: boolean): TagMap {
  const tags: TagMap = new Map();
  const start = tiff + offset;
  if (start + 2 > view.byteLength) return tags;
  const count = view.getUint16(start, little);
  for (let i = 0; i < count; i++) {
    const entry = start + 2 + i * 12;
    if (entry + 12 > view.byteLength) break;
    const value = readValue(view, tiff, entry, little);
    if (value !== null) tags.set(view.getUint16(entry, little), value);
  }
  return tags;
}

function findExifSegment(bytes: Uint8Array): number | null {
  if (bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  let offset = 2;
  while (offset + 4 <= bytes.length && bytes[offset] === 0xff) {
    const marker = bytes[offset + 1];
    if (marker === 0xda || marker === 0xd9) break;
    const length = view.getUint16(offset + 2);
    const isExif =
      marker === 0xe1 &&
      bytes[offset + 4] === 0x45 && // E
      bytes[offset + 5] === 0x78 && // x
      bytes[offset + 6] === 0x69 && // i
      bytes[offset + 7] === 0x66 && // f
      bytes[offset + 8] === 0 &&
      bytes[offset + 9] === 0;
    if (isExif) return offset + 10;
    offset += 2 + length;
  }
  return null;
}

const first = (value: TagValue | undefined): number | undefined =>
  Array.isArray(value) ? value[0] : undefined;

const text = (value: TagValue | undefined): string | undefined =>
  typeof value === 'string' && value ? value : undefined;

function formatExposure(seconds: number): string {
  if (seconds <= 0) return '0 s';
  if (seconds >= 1) return `${Number(seconds.toFixed(1))} s`;
  return `1/${Math.round(1 / seconds)} s`;
}

function formatCoordinate(parts: TagValue | undefined, ref: TagValue | undefined): number | null {
  if (!Array.isArray(parts) || parts.length < 3) return null;
  const degrees = parts[0] + parts[1] / 60 + parts[2] / 3600;
  return ref === 'S' || ref === 'W' ? -degrees : degrees;
}

function formatFlash(flash: number): string {
  return flash & 1 ? 'Fired' : 'Did not fire';
}

/** Reads the most useful EXIF fields from a JPEG. Returns [] when there is no EXIF data. */
export function readExif(bytes: Uint8Array): ExifEntry[] {
  try {
    const tiff = findExifSegment(bytes);
    if (tiff === null) return [];
    const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    const byteOrder = view.getUint16(tiff);
    if (byteOrder !== 0x4949 && byteOrder !== 0x4d4d) return [];
    const little = byteOrder === 0x4949;
    if (view.getUint16(tiff + 2, little) !== 42) return [];

    const main = readIfd(view, tiff, view.getUint32(tiff + 4, little), little);
    const exifPointer = first(main.get(IFD_POINTER_EXIF));
    const gpsPointer = first(main.get(IFD_POINTER_GPS));
    const exif = exifPointer === undefined ? new Map() : readIfd(view, tiff, exifPointer, little);
    const gps = gpsPointer === undefined ? new Map() : readIfd(view, tiff, gpsPointer, little);

    const entries: ExifEntry[] = [];
    const add = (label: string, value: string | undefined) => {
      if (value) entries.push({ label, value });
    };

    add('Camera make', text(main.get(0x010f)));
    add('Camera model', text(main.get(0x0110)));
    add('Lens', text(exif.get(0xa434)));
    add('Date taken', text(exif.get(0x9003)) ?? text(main.get(0x0132)));

    const exposure = first(exif.get(0x829a));
    if (exposure !== undefined) add('Exposure', formatExposure(exposure));
    const aperture = first(exif.get(0x829d));
    if (aperture !== undefined) add('Aperture', `f/${Number(aperture.toFixed(1))}`);
    const iso = first(exif.get(0x8827));
    if (iso !== undefined) add('ISO', String(iso));
    const focal = first(exif.get(0x920a));
    if (focal !== undefined) add('Focal length', `${Number(focal.toFixed(1))} mm`);
    const flash = first(exif.get(0x9209));
    if (flash !== undefined) add('Flash', formatFlash(flash));
    const orientation = first(main.get(0x0112));
    if (orientation !== undefined) add('Orientation', ORIENTATIONS[orientation] ?? String(orientation));
    add('Software', text(main.get(0x0131)));

    const lat = formatCoordinate(gps.get(2), gps.get(1));
    const lon = formatCoordinate(gps.get(4), gps.get(3));
    if (lat !== null && lon !== null) add('GPS', `${lat.toFixed(5)}, ${lon.toFixed(5)}`);

    return entries;
  } catch {
    // Truncated or corrupt EXIF data: treat as "no EXIF".
    return [];
  }
}
