---
paths: ["_bmad-output/**","src/**"]
---
Source: Epic 1 retrospective (_bmad-output/implementation-artifacts/epic-1-retro-2026-10-26.md), action items 2 and 4.

- Build every story with the full bmad-build loop: write the spec file, implement, run the independent parallel review, fix, verify. Do not skip steps because a story looks small.
- Every story must have its own spec file in `_bmad-output/implementation-artifacts/`. If a step is skipped, write down which one and why in that spec.
- Commit with the `verify-commit` skill, not plain `git commit`.
- Do not mark a story `done` until its review has passed.
