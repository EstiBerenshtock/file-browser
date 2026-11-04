import { describe, expect, it } from 'vitest';

// Rule: .claude/rules/story-spec-required.md (added 2026-10-26, after Story 1.2 shipped without a spec).
const files = import.meta.glob('/_bmad-output/implementation-artifacts/*', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

// Story 1.2 (commit 7c11e0b) predates this rule. Never add new entries here.
const GRANDFATHERED = new Set(['1-2']);

const specNames = Object.keys(files).map((path) => path.split('/').pop() ?? '');
const status = Object.entries(files).find(([path]) => path.endsWith('sprint-status.yaml'))?.[1] ?? '';
const startedStories = [...status.matchAll(/^\s+(\d+-\d+)-[\w-]+:\s*(review|done)\s*$/gm)].map((m) => m[1]);

describe('story spec files', () => {
  it('finds the sprint status file and at least one started story', () => {
    expect(startedStories.length).toBeGreaterThan(0);
  });

  it.each(startedStories.filter((id) => !GRANDFATHERED.has(id)))(
    'story %s has a spec file',
    (id) => {
      expect(specNames.some((n) => n.startsWith(`spec-${id}-`) && n.endsWith('.md'))).toBe(true);
    },
  );
});
