---
paths: ["src/components/**","_bmad-output/implementation-artifacts/**"]
---
Source: Epic 1 retrospective, action items 1, 3 and 5.

- Media playback and duration must be checked by hand in a real browser (dev mode with StrictMode, and a production build) using real MP4, MOV, MP3, WAV and one unsupported file. Record the result in the story file. Never write "verified" if the check was not run.
- `npm run check` does not test components. Vitest only runs `src/**/*.test.ts` in a node environment, so a `.test.tsx` file is skipped. Keep logic in `src/lib/` so it can be tested, and do not claim a component is tested.
- Any `useEffect` that cleans up (for example clears `src` or revokes an object URL) must still work when React StrictMode runs the effect, the cleanup, and the effect again.
- Adding a DOM test setup (for example jsdom with Testing Library) is dev tooling only, never a runtime dependency, and needs the user's approval first.
- Open decision: whether "Loading..." for duration should time out to "Unknown", and whether clips under 1 second should show 0:00. Ask the user before changing either, and update the story context.
