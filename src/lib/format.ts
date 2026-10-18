const UNITS = ['B', 'KB', 'MB', 'GB', 'TB'];

export function formatSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—';
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < UNITS.length - 1) {
    value /= 1024;
    unit++;
  }
  const text = unit === 0 ? String(value) : value.toFixed(value < 10 ? 2 : 1);
  return `${text} ${UNITS[unit]}`;
}

export function formatDate(date: Date): string {
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}

const EXTENSION_TYPES: Record<string, string> = {
  jpg: 'JPEG image',
  jpeg: 'JPEG image',
  png: 'PNG image',
  gif: 'GIF image',
  webp: 'WebP image',
  bmp: 'BMP image',
  svg: 'SVG image',
  heic: 'HEIC image',
  tif: 'TIFF image',
  tiff: 'TIFF image',
  pdf: 'PDF document',
  txt: 'Plain text',
  md: 'Markdown document',
  json: 'JSON file',
  csv: 'CSV file',
  html: 'HTML document',
  css: 'CSS stylesheet',
  js: 'JavaScript file',
  ts: 'TypeScript file',
  zip: 'ZIP archive',
  mp3: 'MP3 audio',
  wav: 'WAV audio',
  mp4: 'MP4 video',
  mov: 'QuickTime video',
};

export function extensionOf(name: string): string {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot + 1).toLowerCase() : '';
}

/** A readable type label, from the file extension or MIME type. */
export function describeType(name: string, mime: string): string {
  const ext = extensionOf(name);
  if (EXTENSION_TYPES[ext]) return EXTENSION_TYPES[ext];
  if (mime) return mime;
  return ext ? `${ext.toUpperCase()} file` : 'File';
}

export function isImage(name: string, mime: string): boolean {
  return mime.startsWith('image/') || /^(jpe?g|png|gif|webp|bmp|svg)$/.test(extensionOf(name));
}
