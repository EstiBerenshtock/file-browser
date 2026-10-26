import { useEffect, useState } from 'react';
import { formatDate, formatSize, isImage } from '../lib/format';
import { readImageDetails, type ImageDetails } from '../lib/imageDetails';
import { classifyMedia, UNSUPPORTED_MEDIA_MESSAGE, type MediaKind } from '../lib/media';
import { MediaPlayer } from './MediaPlayer';
import { getFileMetadata } from '../lib/metadata';
import type { FileMetadata, FsEntry } from '../lib/types';

interface DetailsPaneProps {
  entry: FsEntry;
}

interface Loaded {
  previewUrl: string | null;
  metadata: FileMetadata;
  image: ImageDetails | null;
  media: MediaKind;
}

type State = { status: 'loading' } | { status: 'error'; message: string } | { status: 'ready'; loaded: Loaded };

/** Render with `key={entry.path}` so every selection starts from a fresh state. */
export function DetailsPane({ entry }: DetailsPaneProps) {
  const [state, setState] = useState<State>({ status: 'loading' });

  useEffect(() => {
    if (entry.kind !== 'file') return;
    let cancelled = false;
    let previewUrl: string | null = null;
    (async () => {
      const file = await entry.getFile();
      const image = isImage(file.name, file.type) ? await readImageDetails(file) : null;
      if (cancelled) return;
      // A temporary in-memory URL; nothing leaves the browser.
      const media = classifyMedia(file.name, file.type);
      if (image || media === 'supported-video' || media === 'supported-audio') previewUrl = URL.createObjectURL(file);
      setState({ status: 'ready', loaded: { previewUrl, metadata: getFileMetadata(file), image, media } });
    })().catch((e: unknown) => {
      if (!cancelled) setState({ status: 'error', message: e instanceof Error ? e.message : 'Could not read this file.' });
    });
    return () => {
      cancelled = true;
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [entry]);

  if (entry.kind === 'directory') {
    return (
      <div className="details-body">
        <h2 className="details-title">{entry.name}</h2>
        <dl className="meta">
          <Row label="Name" value={entry.name} />
          <Row label="Type" value="Folder" />
          <Row label="Path" value={entry.path} />
        </dl>
      </div>
    );
  }

  if (state.status === 'loading') return <p className="empty">Loading…</p>;
  if (state.status === 'error') return <p className="error">{state.message}</p>;

  const { previewUrl, metadata, image, media } = state.loaded;
  return (
    <div className="details-body">
      <h2 className="details-title">{metadata.name}</h2>
      {previewUrl && (media === 'supported-video' || media === 'supported-audio') && (
        <div className="preview">
          <MediaPlayer kind={media === 'supported-video' ? 'video' : 'audio'} url={previewUrl} name={metadata.name} />
        </div>
      )}
      {previewUrl && image && (
        <div className="preview">
          <img src={previewUrl} alt={metadata.name} />
        </div>
      )}
      {media === 'unsupported-media' && (
        <div className="preview">
          <p className="empty" role="status">
            {UNSUPPORTED_MEDIA_MESSAGE}
          </p>
        </div>
      )}
      <dl className="meta">
        <Row label="Name" value={metadata.name} />
        <Row label="Size" value={`${formatSize(metadata.size)} (${metadata.size.toLocaleString()} bytes)`} />
        <Row label="Type" value={metadata.type} />
        <Row label="Modified" value={formatDate(metadata.lastModified)} />
        {image?.info && <Row label="Dimensions" value={`${image.info.width} × ${image.info.height} px`} />}
      </dl>
      {image && (
        <>
          <h3 className="details-subtitle">EXIF</h3>
          {image.exif.length > 0 ? (
            <dl className="meta">
              {image.exif.map((item) => (
                <Row key={item.label} label={item.label} value={item.value} />
              ))}
            </dl>
          ) : (
            <p className="empty">No EXIF data in this image.</p>
          )}
        </>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </>
  );
}
