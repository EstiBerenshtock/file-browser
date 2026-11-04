export type DurationState = { status: 'loading' } | { status: 'ready'; seconds: number } | { status: 'unknown' };

export const LOADING_LABEL = 'Loading...';
export const UNKNOWN_LABEL = 'Unknown';

/** Whole seconds, rounded down, as m:ss. Minutes are not capped. */
export function formatDuration(seconds: number): string {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/** Maps a media element's duration value to a state. NaN, Infinity, zero, negative and under 1 s are unknown. */
export function durationFromElement(value: number): DurationState {
  if (!Number.isFinite(value) || Math.floor(value) <= 0) return { status: 'unknown' };
  return { status: 'ready', seconds: value };
}

export function durationLabel(state: DurationState): string {
  if (state.status === 'loading') return LOADING_LABEL;
  if (state.status === 'unknown') return UNKNOWN_LABEL;
  return formatDuration(state.seconds);
}

/** First report wins: a late error must not erase a duration already read. */
export function applyDurationReport(prev: DurationState, value: number): DurationState {
  return prev.status === 'loading' ? durationFromElement(value) : prev;
}
