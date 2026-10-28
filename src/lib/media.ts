import { extensionOf } from './format';

export type MediaKind = 'supported-video' | 'supported-audio' | 'unsupported-media' | 'other';

export const UNSUPPORTED_MEDIA_MESSAGE = 'Format not supported for playback';

const SUPPORTED_VIDEO_EXT = new Set(['mp4', 'mov']);
const SUPPORTED_AUDIO_EXT = new Set(['mp3', 'wav']);
const UNSUPPORTED_EXT = new Set([
  'mkv', 'avi', 'webm', 'wmv', 'flv', 'm4v', 'mpg', 'mpeg', '3gp', 'ogv', 'mts', 'm2ts',
  'ogg', 'oga', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'aif', 'opus', 'mid', 'midi',
]);

const SUPPORTED_VIDEO_MIME = new Set(['video/mp4', 'video/quicktime']);
const SUPPORTED_AUDIO_MIME = new Set(['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/wave', 'audio/vnd.wave']);

/** Extension is the main signal; MIME is the fallback (it may be empty). Never touches file data. */
export function classifyMedia(name: string, mime: string): MediaKind {
  const ext = extensionOf(name);
  if (SUPPORTED_VIDEO_EXT.has(ext)) return 'supported-video';
  if (SUPPORTED_AUDIO_EXT.has(ext)) return 'supported-audio';
  if (UNSUPPORTED_EXT.has(ext)) return 'unsupported-media';

  const type = mime.split(';')[0].trim().toLowerCase();
  if (SUPPORTED_VIDEO_MIME.has(type)) return 'supported-video';
  if (SUPPORTED_AUDIO_MIME.has(type)) return 'supported-audio';
  if (type.startsWith('video/') || type.startsWith('audio/')) return 'unsupported-media';
  return 'other';
}
