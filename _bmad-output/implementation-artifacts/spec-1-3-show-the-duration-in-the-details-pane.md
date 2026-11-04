---
title: 'Show the duration in the details pane'
type: 'feature'
created: '2026-10-26'
status: 'done'
baseline_commit: '7c11e0b312e4591440f57a760a72b78c845b798b'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** A video editor cannot tell a 2-second take from a 5-minute take without playing each clip. The details pane shows no duration.

**Approach:** Add a pure `duration.ts` (state type, `formatDuration`, element-duration mapping). The existing media element's `loadedmetadata` event feeds one shared duration state owned by `DetailsPane` (one per selection). It renders a Duration row right after Type for supported audio/video only.

## Boundaries & Constraints

**Always:** Duration is whole seconds, rounded down, as `m:ss`; minutes uncapped (4500 s is `75:00`). Row shows exactly one of `m:ss`, `Loading...` (three plain dots), `Unknown`; never blank. `NaN`, `Infinity`, `0`, negative map to unknown. Reuse the one existing media element (no hidden probe). Ignore late events from an old file (cancelled/active-url pattern). Row uses existing `.meta`/`Row`, no new colours; value announced politely (`aria-live="polite"`). Playback failure keeps name, size and the duration or `Unknown`; if still loading when `error` fires, becomes `Unknown`.

**Never:** No new runtime dependency. No duration row for unsupported or non-media files and directories. No duration work in `TreeNode`. No second media element or copy of the duration state. No `.test.tsx` files. No `arrayBuffer()`/`text()` on media.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Fractional | `formatDuration(15.9)` | `0:15` | N/A |
| Exact minutes | `300` | `5:00` | N/A |
| Over an hour | `4500` | `75:00` | N/A |
| Under 10 s | `5` | `0:05` | N/A |
| Invalid | `NaN`, `Infinity`, `0`, `-3`, `0.5` | mapping gives `unknown` | label `Unknown` |
| Valid element value | `durationFromElement(15.9)` | ready, label `0:15` | N/A |
| Select supported file | MP4/MOV/MP3/WAV | Row after Type: `Loading...`, then value | `Unknown` on error/invalid |
| Switch A to B while loading | A loading, select B | B's own state only | late A events ignored |
| Unsupported / other file | MKV, txt | No Duration row | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/duration.ts` -- NEW. `DurationState`, `formatDuration`, `durationFromElement`, `durationLabel`, `LOADING_LABEL`, `UNKNOWN_LABEL`.
- `src/lib/duration.test.ts` -- NEW. Vitest for the matrix.
- `src/components/MediaPlayer.tsx` -- add `onDuration(seconds)` prop; call on `loadedmetadata` (reads `el.duration`) and call `onDuration(NaN)` on error. Keep existing stop/cleanup and `activeUrl` guard.
- `src/components/DetailsPane.tsx` -- hold `useState<DurationState>({status:'loading'})` (component is keyed by path, so fresh per selection). Pass callback to `MediaPlayer`; add Duration `Row` right after Type only for supported media; `Row` gets optional polite live flag.
- `src/lib/media.ts`, `src/lib/format.ts`, `src/components/TreeNode.tsx` -- do not change.

## Tasks & Acceptance

**Execution:**
- [ ] `src/lib/duration.ts` -- add pure logic above -- shared state and formatting
- [ ] `src/lib/duration.test.ts` -- cover every matrix row of the logic
- [ ] `src/components/MediaPlayer.tsx` -- report duration/error to parent -- single media element
- [ ] `src/components/DetailsPane.tsx` -- own the state, render the row -- user-facing requirement

**Acceptance Criteria:**
- Given a supported file is selected, then a Duration row sits right after Type, starts `Loading...`, then shows `m:ss` or `Unknown`, never blank.
- Given A is loading and B is selected, then only B's state shows.
- Given an unsupported file is selected, then no Duration row.
- Given playback fails, then name, size and duration or `Unknown` still show.

## Implementation Notes

Manual checks M1-M8 NOT run (no browser/media files available to the agent); a human must run them.

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence / route |
|---|---|---|
| Story 1.2: StrictMode re-runs effect, cleanup removed `src`, dev player left empty (MediaPlayer.tsx) | high | Real, in 1.2 code. Patched: effect restores `src` if missing. |
| First-report-wins reducer untested (verification gap) | medium | Patched: extracted `applyDurationReport` to duration.ts with tests. |
| Duplicated supported-media condition in DetailsPane | low | Patched: `hasPlayer` variable. |
| Duration stays `Loading...` if no event fires | low | Accepted risk in epics Known Risks; no timeout in v2. Rejected. |
| `durationchange` after Infinity | low | Spec maps Infinity to unknown; added complexity. Rejected. |
| Late error after metadata keeps duration | false | Spec: failure still shows the duration or Unknown. |
| `loadedmetadata` before handler attached | false | React attaches handlers at element creation; events fire async. |
| No h:mm:ss format | false | Spec requires uncapped minutes (`75:00`). |
| Sub-second clips Unknown | low | Deliberate, in spec matrix. Rejected. |
| Stale duration without key | false | DetailsPane keyed by path in App.tsx. |
| aria-live on dd, onDuration recreated, required prop | low | Spec asks for polite announce; cosmetic. Rejected. |
| Component wiring has no automated test | medium | Known Risk (node-only vitest); covered by manual list, not run. Deferred-noted. |

## Verification

**Commands:**
- `npm run check` -- expected: typecheck, lint and tests pass

**Manual checks (if no CLI):**
- Epic manual list M1-M8 cannot be run by an agent without a browser and media files; recorded as not run.
