<!-- bmad:context -->
<!-- Verified 2026-10-25 against 36e0337. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## file-browser

Browser app for browsing a local folder tree and previewing files (File System Access API, read-only). React 19, TypeScript, Vite, Vitest. Planning artifacts live in `_bmad-output/planning-artifacts/`.

## Policy

- Never add a runtime dependency to `package.json` `dependencies`. React is the only exception; use native browser APIs instead. Dev tooling is fine.
- Reply to the user in simple, easy-to-understand English.

## Where things are

- Framework-free core logic: `src/lib/`. UI: `src/components/`. CSS variables: `src/styles.css`.
- Open design question (video previews and thumbnails): `_bmad-output/planning-artifacts/open-questions.md`

## Running and verifying

- `npm run check` runs typecheck, lint and `vitest run`. Run it before every commit; the `verify-commit` skill does this and commits.
- Tests only match `src/**/*.test.ts`, so a `.test.tsx` file is silently skipped.

## Conventions that differ from defaults

- In `src/components/`: component names are PascalCase.

<!-- /bmad:context -->
