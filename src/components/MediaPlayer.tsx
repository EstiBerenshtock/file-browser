import { useEffect, useRef, useState } from 'react';

export const PLAYBACK_ERROR_MESSAGE = "This file can't be played";

interface MediaPlayerProps {
  kind: 'video' | 'audio';
  url: string;
  name: string;
  /** Reports the element's duration in seconds, or NaN when playback fails. */
  onDuration: (seconds: number) => void;
}

/** One native media element per selection. Parent renders it with a key so state never leaks between files. */
export function MediaPlayer({ kind, url, name, onDuration }: MediaPlayerProps) {
  const [failed, setFailed] = useState(false);
  const ref = useRef<HTMLVideoElement & HTMLAudioElement>(null);
  const activeUrl = useRef(url);

  useEffect(() => {
    activeUrl.current = url;
    const el = ref.current;
    // StrictMode re-runs this effect after cleanup; cleanup removes src, so restore it.
    if (el && el.getAttribute('src') !== url) el.setAttribute('src', url);
    return () => {
      // Stop sound and picture at once, before the URL is released.
      activeUrl.current = '';
      if (el) {
        el.pause();
        el.removeAttribute('src');
        el.load();
      }
    };
  }, [url]);

  // Ignore late events from a previous selection.
  const onError = () => {
    if (activeUrl.current !== url) return;
    setFailed(true);
    onDuration(NaN);
  };

  const onLoadedMetadata = () => {
    if (activeUrl.current === url && ref.current) onDuration(ref.current.duration);
  };

  if (failed) {
    return (
      <p className="error" role="status">
        {PLAYBACK_ERROR_MESSAGE}
      </p>
    );
  }
  return kind === 'video' ? (
    <video ref={ref} className="media-video" src={url} controls preload="metadata" aria-label={name} onError={onError} onLoadedMetadata={onLoadedMetadata} />
  ) : (
    <audio ref={ref} className="media-audio" src={url} controls preload="metadata" aria-label={name} onError={onError} onLoadedMetadata={onLoadedMetadata} />
  );
}
