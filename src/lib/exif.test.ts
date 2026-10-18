import { describe, expect, it } from 'vitest';
import { readExif } from './exif';
import { readImageInfo } from './imageSize';

/** Builds a minimal little-endian JPEG that carries a hand-made EXIF block. */
function buildJpegWithExif(): Uint8Array {
  const tiff = new DataView(new ArrayBuffer(114));
  let p = 0;
  const u16 = (v: number) => { tiff.setUint16(p, v, true); p += 2; };
  const u32 = (v: number) => { tiff.setUint32(p, v, true); p += 4; };
  const entry = (tag: number, type: number, count: number, value: number) => {
    u16(tag); u16(type); u32(count); u32(value);
  };

  tiff.setUint16(0, 0x4949); // "II"
  tiff.setUint16(2, 42, true);
  tiff.setUint32(4, 8, true);
  p = 8;
  u16(3); // IFD0: three entries
  entry(0x010f, 2, 6, 92); // Make -> "Canon\0" stored at 92
  entry(0x0112, 3, 1, 6); // Orientation = 6
  entry(0x8769, 4, 1, 50); // pointer to the Exif IFD
  u32(0);
  u16(3); // Exif IFD: three entries
  entry(0x829a, 5, 1, 98); // ExposureTime -> 1/250
  entry(0x829d, 5, 1, 106); // FNumber -> 28/10
  entry(0x8827, 3, 1, 200); // ISO
  u32(0);
  for (const [i, c] of [...'Canon'].entries()) tiff.setUint8(92 + i, c.charCodeAt(0));
  tiff.setUint32(98, 1, true);
  tiff.setUint32(102, 250, true);
  tiff.setUint32(106, 28, true);
  tiff.setUint32(110, 10, true);

  const body = new Uint8Array(tiff.buffer);
  const segmentLength = 2 + 6 + body.length;
  const out = new Uint8Array(2 + 2 + segmentLength + 2);
  out.set([0xff, 0xd8, 0xff, 0xe1, segmentLength >> 8, segmentLength & 0xff]);
  out.set([0x45, 0x78, 0x69, 0x66, 0, 0], 6);
  out.set(body, 12);
  out.set([0xff, 0xd9], 12 + body.length);
  return out;
}

describe('readExif', () => {
  it('reads camera, orientation and exposure fields', () => {
    const result = Object.fromEntries(readExif(buildJpegWithExif()).map((e) => [e.label, e.value]));
    expect(result['Camera make']).toBe('Canon');
    expect(result['Orientation']).toBe('Rotated 90° CW');
    expect(result['Exposure']).toBe('1/250 s');
    expect(result['Aperture']).toBe('f/2.8');
    expect(result['ISO']).toBe('200');
  });

  it('returns nothing for data without EXIF', () => {
    expect(readExif(new Uint8Array([0xff, 0xd8, 0xff, 0xd9]))).toEqual([]);
    expect(readExif(new Uint8Array([1, 2, 3]))).toEqual([]);
  });

  it('does not throw on truncated EXIF', () => {
    const jpeg = buildJpegWithExif();
    expect(() => readExif(jpeg.slice(0, 40))).not.toThrow();
  });
});

describe('readImageInfo', () => {
  it('reads PNG dimensions', () => {
    const png = new Uint8Array(33);
    png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const view = new DataView(png.buffer);
    view.setUint32(16, 640);
    view.setUint32(20, 480);
    expect(readImageInfo(png)).toEqual({ width: 640, height: 480, format: 'PNG' });
  });

  it('reads GIF dimensions', () => {
    const gif = new Uint8Array(13);
    gif.set([0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 10, 0, 20, 0]);
    expect(readImageInfo(gif)).toEqual({ width: 10, height: 20, format: 'GIF' });
  });

  it('reads JPEG dimensions after the EXIF segment', () => {
    const exif = buildJpegWithExif();
    const sof = [0xff, 0xc0, 0, 17, 8, 0x01, 0xe0, 0x02, 0x80, 3, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1];
    const jpeg = new Uint8Array(exif.length - 2 + sof.length);
    jpeg.set(exif.subarray(0, exif.length - 2));
    jpeg.set(sof, exif.length - 2);
    expect(readImageInfo(jpeg)).toEqual({ width: 640, height: 480, format: 'JPEG' });
  });

  it('returns null for unknown data', () => {
    expect(readImageInfo(new Uint8Array(40))).toBeNull();
  });
});
