---
paths: ["_bmad-output/**"]
---
Date: 2026-10-26
Reason: Story 1.2 (commit 7c11e0b) was built without the bmad-build loop and has no spec file, so its review and manual checks left no record. Epic 1 retro, action items 2 and 4.
Enforced by: `src/lib/storySpecs.test.ts` (runs in `npm run check`). It fails when a story in `sprint-status.yaml` is `review` or `done` and has no `spec-<id>-*.md`. Story 1.2 is the only grandfathered exception.

Rule: every story that reaches `review` or `done` has `_bmad-output/implementation-artifacts/spec-<epic>-<story>-<slug>.md`.

Bad: implement the story straight from epics.md, commit, set status to `review`. No spec file.
Good: write `spec-1-3-show-the-duration-in-the-details-pane.md` first, build against it, record review triage in it, then commit.
