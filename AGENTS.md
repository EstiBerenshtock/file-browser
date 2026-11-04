<!-- bmad:context -->
<!-- Verified 2026-10-25 against 36e0337. Managed by bmad-project-context; edits inside this block are replaced on refresh. Keep anything you want preserved outside the markers. -->

## file-browser

Browser app for browsing a local folder tree and previewing files (File System Access API, read-only). React 19, TypeScript, Vite, Vitest. Planning artifacts live in `_bmad-output/planning-artifacts/`.

## Policy

- Never add a runtime dependency to `package.json` `dependencies`. React is the only exception; use native browser APIs instead. Dev tooling is fine.
- Reply to the user in simple, easy-to-understand Hebrew.

## Where things are

- Framework-free core logic: `src/lib/`. UI: `src/components/`. CSS variables: `src/styles.css`.
- Open design question (video previews and thumbnails): `_bmad-output/planning-artifacts/open-questions.md`

## Running and verifying

- `npm run check` runs typecheck, lint and `vitest run`. Run it before every commit; the `verify-commit` skill does this and commits.
- Tests only match `src/**/*.test.ts`, so a `.test.tsx` file is silently skipped.

## Conventions that differ from defaults

- In `src/components/`: component names are PascalCase.

<!-- /bmad:context -->

## Tools and choices
- code-review-graph: in `.mcp.json` the path to the program is the full path on my computer. On another computer, change it to the right path.
- Course slides: `../RavTech · Agentic Engineering — The 8 Levels.html`. Grep it, never read it whole. Homework is on each level's Wrap-up slide.
- User is a beginner student. Explain simply, one step at a time, and say where to type each command (chat or terminal).


## Rule / command / skill / plugin / MCP choices

Pick the lightest tool that works: rule → command → skill → plugin → MCP.

- Rules (`.claude/rules/`): short fixed facts that load by path, e.g. styling with CSS variables, lessons from review bugs.
- Command: `weekly-summary`. A task I start myself once a week; no logic needed.
- Skills: `verify-commit` (check + commit), `report-change` (explain changes in Hebrew and wait for approval). Multi-step "how to" that Claude loads by description.
- Plugin: none. Nothing to share across projects yet.
- MCP (only when a tool needs outside data):
  - github: PRs and issues.
  - context7: up-to-date library docs.
  - codebase-memory-mcp + code-review-graph: code graph for reviews.
  - file-browser-server: my own server, practice for the course.
