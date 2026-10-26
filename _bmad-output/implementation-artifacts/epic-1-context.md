# Epic 1 Context: Audio and Video Preview with Duration

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Let a video editor open a local folder, select audio and video clips, see each clip's duration, and play it in the preview pane, without leaving the app or using an outside player. The app must stay fast and never freeze or crash on a bad or unsupported file. The app is read-only and local.

## Stories

- Story 1.1: Recognise media files and show clear messages for unsupported ones
- Story 1.2: Play supported audio and video in the preview box
- Story 1.3: Show the duration in the details pane

## Requirements & Constraints

- Audio and video files appear in the tree like any other file, are selectable, and show name and size in the details pane.
- Supported types are exactly MP4, MOV (video) and MP3, WAV (audio). Other audio/video types (for example MKV, AVI) are unsupported.
- Supported files play in the preview pane. Selecting another file stops the current one.
- Duration is whole seconds rounded down, shown as `m:ss`. Minutes are not capped (75 min is `75:00`). While reading it shows `Loading...` (three dots). If unreadable, zero or invalid it shows `Unknown`. A supported file always shows one of the three, never blank.
- Selecting a different file while `Loading...` shows drops the old file's duration.
- Unsupported media: within 0.5 s show "Format not supported for playback". This message is shown only for unsupported audio/video, never for supported or non-media files. No Duration row for these files.
- Supported file that fails to play: within 0.5 s show "This file can't be played". Details still show name, size, and duration or `Unknown`.
- The preview shows exactly one of: the player, the unsupported message, or the failure message. The app stays responsive after any failure.
- NFR: never modify files or send file data off the computer. A folder with 50+ media files of about 2 GB each lists all names within 2 s and stays responsive. Look and feel must match the existing app.
- Early check: confirm why media files look invisible today. If the cause is more than a missing filter, flag the first requirement for re-scoping before more work.

## Technical Decisions

- Keep the existing split: framework-free logic in `src/lib/` (pure `.ts`), UI in `src/components/` (PascalCase). Add no new layers. Read files only via `entry.getFile()`.
- `classifyMedia(name, mime)` in `src/lib/media.ts` returns `supported-video | supported-audio | unsupported-media | other`. Extension is the main signal, MIME the fallback (empty MIME must still work). Reuse `extensionOf` from `format.ts`. Message text constants live in `media.ts`.
- `src/lib/duration.ts` exports `DurationState` (`loading | ready | unknown`) and `formatDuration(seconds)`. It floors. Non-finite, `0` or negative maps to `unknown`. State starts as `loading`.
- One native `<video controls>` or `<audio controls>` per selection with `preload="metadata"`. `loadedmetadata` gives the duration, `error` signals failure. No hidden probe element. Source is `URL.createObjectURL(file)`, revoked when the selection ends. No fetch, upload or third-party player.
- Render the media area with `key={entry.path}` so each selection mounts fresh. One component owns the media state, shared by the player and the Duration row. Use the `cancelled` flag pattern so late events from an old file are ignored.
- The unsupported message is decided synchronously, and the file is never loaded into a media element. Errors never throw out of render.
- `TreeNode` does no media work per row (no duration reads, object URLs, media elements). Never call `arrayBuffer()` or `text()` on a media file.
- Reuse `.meta`, `Row` and `.preview`. New colours and sizes come only from CSS variables in `src/styles.css`.
- No new runtime dependency (React only).
- Vitest only runs `src/**/*.test.ts` in a node environment, so testable logic must live in `.ts` files. React behavior is verified by manual checks. Stories 1.2 and 1.3 each end with a manual verification list recorded in the story file.

## UX & Interaction Patterns

- Details pane order: title, preview box, then Name, Size, Type, Duration, Modified.
- The preview box reuses `.preview`. Video: `max-width: 100%`, `max-height: var(--preview-max-height)`. Audio: `width: 100%`. Media element uses `color-scheme: light dark`. Native controls, no custom skin.
- Duration is a normal `.meta` row right after Type.
- Unsupported message uses the muted (`.empty`) look. Failure message uses the error (`.error`) look. No icons or buttons.
- No autoplay. Focus stays on the tree row after selection so arrow keys keep working. The player is reachable by Tab.
- Media element's accessible name is the file name. The messages and Duration value are announced politely (`role="status"` or `aria-live="polite"`).
- No duration or icon in tree rows. Media rows use the standard file icon.

## Cross-Story Dependencies

- Story 1.1 provides `classifyMedia` and the message constants, which Stories 1.2 and 1.3 depend on.
- Story 1.2 creates the media element and its owning component. Story 1.3 adds the Duration row that reads the same shared state, so it builds on 1.2.
- Known accepted risks: some MOV codecs may not decode in some browsers (shows the failure message, no transcoding). `Loading...` may stay forever if the element never fires an event (no timeout in v2).
