import { describe, expect, it } from 'vitest';
import { classifyMedia, UNSUPPORTED_MEDIA_MESSAGE } from './media';

describe('classifyMedia', () => {
  it('supported video by extension, any case, any mime', () => {
    expect(classifyMedia('a.mp4', '')).toBe('supported-video');
    expect(classifyMedia('B.MOV', 'application/octet-stream')).toBe('supported-video');
  });
  it('supported audio by extension', () => {
    expect(classifyMedia('a.mp3', '')).toBe('supported-audio');
    expect(classifyMedia('a.WAV', '')).toBe('supported-audio');
  });
  it('unsupported by extension', () => {
    expect(classifyMedia('old-take.mkv', '')).toBe('unsupported-media');
    expect(classifyMedia('x.AVI', 'video/x-msvideo')).toBe('unsupported-media');
  });
  it('unsupported by MIME only', () => {
    expect(classifyMedia('clip', 'video/x-matroska')).toBe('unsupported-media');
    expect(classifyMedia('clip', 'audio/ogg')).toBe('unsupported-media');
  });
  it('supported by MIME fallback', () => {
    expect(classifyMedia('clip', 'video/mp4')).toBe('supported-video');
    expect(classifyMedia('clip', 'audio/mpeg')).toBe('supported-audio');
  });
  it('ignores MIME parameters, spaces and case', () => {
    expect(classifyMedia('clip', ' Audio/WAV; codecs=1 ')).toBe('supported-audio');
  });
  it('non-media is other', () => {
    expect(classifyMedia('notes.txt', 'text/plain')).toBe('other');
    expect(classifyMedia('photo.jpg', '')).toBe('other');
    expect(classifyMedia('README', '')).toBe('other');
  });
  it('exposes the message', () => {
    expect(UNSUPPORTED_MEDIA_MESSAGE).toBe('Format not supported for playback');
  });
});
