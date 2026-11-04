---
name: file-browser
status: final
updated: 2026-10-25
sources:
  - _bmad-output/planning-artifacts/prds/prd-file-browser-2026-10-25/prd.md
  - _bmad-output/planning-artifacts/ux-designs/ux-file-browser-2026-10-25/DESIGN.md
---

# file-browser v2 — Experience Spine

> Delta spec. It describes only what v2 adds: audio/video rows, the player, and the duration row. Everything else in the app behaves as it does today. FR/NFR numbers point to the PRD. Visual specs are in `DESIGN.md`. `[ASSUMPTION]` marks choices the PRD did not state.

## Foundation

Single-surface desktop web app (File System Access API, read-only). React 19, no UI library, one stylesheet. `DESIGN.md` is the visual reference. v2 keeps the current two-pane layout (tree on the left, details pane on the right) and changes neither.

## Information Architecture

No new screens. Two existing places get new content.

| Place | What v2 adds |
|---|---|
| File tree | Audio/video files show as normal rows, with name and size like any other file (FR-1, FR-2). |
| Details pane | A preview box (player or message) and a **Duration** row (FR-3 to FR-16). |

Details pane order for a media file: title, preview box, then Name, Size, Type, **Duration**, Modified.

## Voice and Tone

Short, plain, no blame, no exclamation marks. The texts are fixed by the PRD. Do not reword.

| Situation | Exact text |
|---|---|
| Duration ready | `0:15` |
| Duration being read | `Loading...` |
| Duration not available | `Unknown` |
| Type is not MP4, MOV, MP3 or WAV | `Format not supported for playback` |
| Supported type fails to play | `This file can't be played` |

_Note for build:_ the PRD writes `Loading...` with three dots, but the app's existing loading text uses the single character `…`. The PRD wins, so use three dots for the Duration row.

## Component Patterns

| Component | Behavioral rules |
|---|---|
| Tree row (media) | Same as any file row: click selects, keyboard works as today. Never hidden or disabled, even for unsupported types (FR-12). |
| Player | Native controls. `<video>` for MP4/MOV, `<audio>` for MP3/WAV. `[ASSUMPTION]` No autoplay: the user presses play. This avoids sudden sound while browsing with the arrow keys. |
| Duration row | Always present for a selected supported file, and always holds one of the three texts (FR-9). Never blank. |
| Preview message | Replaces the player. Shown within 0.5 s of selection (unsupported) or of the failure (FR-11, FR-13). |

## State Patterns

| State | Preview box | Duration row |
|---|---|---|
| Supported file selected, duration being read | Player | `Loading...` (FR-7) |
| Supported file, duration read | Player | `m:ss` (FR-6) |
| Supported file, duration zero, invalid or unreadable | Player | `Unknown` (FR-8) |
| Supported file fails to play | `This file can't be played` (error color) | `m:ss` or `Unknown` (FR-14) |
| Unsupported audio/video (e.g. MKV, AVI) | `Format not supported for playback` (muted) | Row not shown `[ASSUMPTION]`: the PRD asks for duration only for supported types (FR-6) |
| Another file selected while one plays | Old file stops, new file shown (FR-5) | Old value dropped; shows the new file's state (FR-10) |
| Very large file (existing LARGE tag) | Same as any supported file. Selecting must not freeze the app (NFR-2). | Same |

Name and size always show in the details pane for every media file, in every state above (FR-2, FR-12, FR-14). A failure in one file never blocks selecting the next (FR-17).

## Interaction Primitives

- **Select:** click a row, or arrow keys and Enter as today. Selection starts the duration read. Reading never blocks browsing.
- **Play, pause, seek, volume:** only through the native controls. `[ASSUMPTION]` Focus stays on the tree row after selection, so the arrow keys keep moving through the tree. The user Tabs into the player when they want it.
- **Switching files:** playback stops at once, the old media is released, then the new file appears.
- **Nothing is written.** No play position or volume is saved (NFR-1).

## Accessibility Floor

- The player is reachable by Tab and fully usable by keyboard through the native controls.
- The media element has an accessible name: the file name.
- The preview message and the Duration value are announced politely when they change (`role="status"` or `aria-live="polite"`), so screen reader users hear `Loading...` and then the result.
- Message and duration text use the existing text, muted and error colors, which already work in light and dark mode. Errors are not shown by color alone: the words say it.
- No auto-playing sound.

## Key Flows

### Sarah finds her 15-second clip

1. Sarah opens a folder with 50+ big clips. All names appear in the tree in under 2 seconds (S2). The app stays responsive.
2. She clicks the first clip. The preview box shows the player, and Duration reads `Loading...`, then `5:00`.
3. She presses Down arrow and Enter. The next clip replaces the first. Duration shows `0:02`.
4. She keeps going, clip by clip.
5. **Climax:** a clip shows `0:15`. She presses play in the preview box and watches it right there, with no file explorer and no outside player (S1).
6. She goes to editing.

### Sarah hits a file that will not play

1. She clicks `old-take.mkv`. In under 0.5 s the preview box says `Format not supported for playback`. Name and size are in the details pane.
2. She clicks the next clip. It loads normally. The app never froze.
3. **Climax:** a damaged `take7.mp4` shows `This file can't be played`, with its name, size and `Unknown`. She moves on with one click.
