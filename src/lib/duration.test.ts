import { describe, expect, it } from 'vitest';
import { applyDurationReport, durationFromElement, durationLabel, formatDuration, LOADING_LABEL, UNKNOWN_LABEL } from './duration';

describe('formatDuration', () => {
  it('floors fractions', () => expect(formatDuration(15.9)).toBe('0:15'));
  it('formats exact minutes', () => expect(formatDuration(300)).toBe('5:00'));
  it('does not cap minutes', () => expect(formatDuration(4500)).toBe('75:00'));
  it('pads seconds', () => expect(formatDuration(5)).toBe('0:05'));
});

describe('durationFromElement', () => {
  it.each([NaN, Infinity, 0, -3, 0.5])('maps %s to unknown', (v) => {
    const s = durationFromElement(v);
    expect(s.status).toBe('unknown');
    expect(durationLabel(s)).toBe(UNKNOWN_LABEL);
  });
  it('maps a valid value to ready', () => {
    const s = durationFromElement(15.9);
    expect(s.status).toBe('ready');
    expect(durationLabel(s)).toBe('0:15');
  });
  it('labels loading', () => expect(durationLabel({ status: 'loading' })).toBe(LOADING_LABEL));
});

describe('applyDurationReport', () => {
  it('loading becomes ready or unknown', () => {
    expect(applyDurationReport({ status: 'loading' }, 15.9)).toEqual({ status: 'ready', seconds: 15.9 });
    expect(applyDurationReport({ status: 'loading' }, NaN)).toEqual({ status: 'unknown' });
  });
  it('ready stays ready after a late error', () => {
    const ready = { status: 'ready', seconds: 20 } as const;
    expect(applyDurationReport(ready, NaN)).toBe(ready);
  });
});
