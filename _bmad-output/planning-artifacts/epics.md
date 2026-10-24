---
status: final
stepsCompleted: [1, 2, 3, 4]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-file-browser-2026-10-25/prd.md
  - _bmad-output/planning-artifacts/architecture/architecture-file-browser-2026-10-25/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-file-browser-2026-10-25/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-file-browser-2026-10-25/EXPERIENCE.md
---

# file-browser - Epic Breakdown

## Overview

This document breaks the file-browser v2 (Audio/Video Player and Duration) requirements into one epic with three stories. It uses the PRD, the UX design (DESIGN.md and EXPERIENCE.md) and the Architecture Spine.

## Requirements Inventory

### Functional Requirements

FR1: The app shall show audio and video files in the file tree alongside other files.
FR2: When the user clicks an audio or video file in the tree, the app shall select it and show its name and size in the details pane.
FR3: When the user selects an MP4 or MOV video file, the app shall play it in the preview pane.
FR4: When the user selects an MP3 or WAV audio file, the app shall play it in the preview pane.
FR5: While a file is playing, when the user selects a different file, the app shall stop the playing file and show the newly selected file.
FR6: When the user selects a file of a supported type, the app shall show its duration in the details pane in whole seconds, rounded down, as `m:ss`.
FR7: While the duration of a selected file is being read, the app shall show `Loading...` in place of the duration.
FR8: If the duration of a selected supported file cannot be read, or is zero or invalid, the app shall show `Unknown`.
FR9: While a supported file is selected, the app shall always show one of: its duration, `Loading...`, or `Unknown`.
FR10: When the user selects a different file while `Loading...` is showing, the app shall drop the first file's duration and show the state of the new file.
FR11: If the user selects an audio or video file of an unsupported type (e.g. MKV, AVI), the app shall, within 0.5 s, show "Format not supported for playback" in the preview pane.
FR12: For an unsupported audio or video file, the app shall show its name and size in the details pane and keep it visible and selectable in the tree.
FR13: If a supported file fails to play, the app shall, within 0.5 s, show "This file can't be played" in the preview pane.
FR14: If a supported file fails to play, the app shall show its name, size, and its duration or `Unknown` in the details pane.
FR15: The app shall show "Format not supported for playback" only for audio and video files that are not a supported type.
FR16: While an audio or video file is selected, the app shall show either the player or an explanatory message in the preview pane.
FR17: If an audio or video file cannot be shown or played, the app shall stay responsive and let the user select other files, with no crash or hang.

### NonFunctional Requirements

NFR1: Read-only and local. The app never changes or deletes a file and never sends any file or file information off the computer.
NFR2: Performance. A folder with 50+ media files of about 2 GB each shows all names in the tree within 2 seconds, and the app stays responsive while durations are read.
NFR3: Consistent look. The player and duration text match the existing look of the app. No redesign.

### Additional Requirements

- AD-1: Extend the existing `lib/` (pure `.ts`, no React) and `components/` (PascalCase) split. Add no new layers. Media code reads files only through `entry.getFile()`.
- AD-2: One classifier, `classifyMedia(name, mime)` in `src/lib/media.ts`, returns `supported-video | supported-audio | unsupported-media | other`. Supported is exactly MP4, MOV, MP3, WAV. Extension is the main signal, MIME is the fallback. Reuse `extensionOf` from `format.ts`.
- AD-3: One native `<video controls>` or `<audio controls>` per selection, `preload="metadata"`. `loadedmetadata` gives the duration, `error` gives failure. No hidden probe element. Source is `URL.createObjectURL(file)`, revoked when the selection ends. No fetch, upload or third-party player.
- AD-4: `src/lib/duration.ts` exports `DurationState` (`loading | ready | unknown`) and `formatDuration(seconds)` as `m:ss`. It floors the value. Minutes are not capped (75 min is `75:00`). Not finite, `0` or negative maps to `unknown`. Duration state starts as `loading`.
- AD-5: Render the media area with `key={entry.path}` so each selection mounts fresh. One component owns the media state. Use the `cancelled` flag pattern so late events from an old file are ignored.
- AD-6: The preview shows exactly one of: the player, "Format not supported for playback", or "This file can't be played". The messages are constants in `media.ts`. The unsupported message is decided synchronously. Errors never throw out of render.
- AD-7: `TreeNode` does no media work per row: no duration reads, object URLs or media elements. Never call `arrayBuffer()` or `text()` on a media file. A change that slows the S2 check is rejected.
- AD-8: Reuse `.meta`, `Row` and `.preview`. New colours and sizes come from CSS variables only. Native player controls.
- Tests only run for `src/**/*.test.ts`. Logic that needs a test must live in a `.ts` file.
- No new runtime dependency. React stays the only one.
- Early check (PRD section 8): confirm why media files look invisible today. If the cause is more than a missing filter, FR1 must be re-scoped before work starts.

### UX Design Requirements

UX-DR1: Details pane order for a media file: title, preview box, then Name, Size, Type, Duration, Modified.
UX-DR2: The preview box reuses the existing `.preview` box. It holds exactly one of a `<video controls>`, an `<audio controls>`, or a message. Video uses `max-width: 100%` and `max-height: var(--preview-max-height)`. Audio uses `width: 100%`.
UX-DR3: The Duration row is a normal `.meta` row placed right after Type. It always holds one of `m:ss`, `Loading...` (three dots, not `…`) or `Unknown`. It is not shown for unsupported media files.
UX-DR4: "Format not supported for playback" uses the muted style (the existing `.empty` look). "This file can't be played" uses the error colour (the existing `.error` look). No icons or buttons.
UX-DR5: No autoplay. Focus stays on the tree row after selection, so the arrow keys keep working. The player is reachable by Tab.
UX-DR6: The media element has an accessible name, which is the file name. The message and the Duration value are announced politely (`role="status"` or `aria-live="polite"`).
UX-DR7: The media element gets `color-scheme: light dark`. Add no new colour, size or radius variables. No custom player skin. No duration or icon in tree rows.

### FR Coverage Map

FR1: Epic 1, Story 1.1
FR2: Epic 1, Story 1.1
FR3: Epic 1, Story 1.2
FR4: Epic 1, Story 1.2
FR5: Epic 1, Story 1.2
FR6: Epic 1, Story 1.3
FR7: Epic 1, Story 1.3
FR8: Epic 1, Story 1.3
FR9: Epic 1, Story 1.3
FR10: Epic 1, Story 1.3
FR11: Epic 1, Story 1.1
FR12: Epic 1, Story 1.1
FR13: Epic 1, Story 1.2
FR14: Epic 1, Story 1.3
FR15: Epic 1, Story 1.1
FR16: Epic 1, Stories 1.1 and 1.2
FR17: Epic 1, Stories 1.1 and 1.2
NFR1: Epic 1, Story 1.2 (and checked in every story)
NFR2: Epic 1, Stories 1.1 and 1.3
NFR3: Epic 1, Stories 1.1, 1.2 and 1.3

## Epic List

1. Epic 1: Audio and Video Preview with Duration

## Epic 1: Audio and Video Preview with Duration

Sarah, a video editor, can open a folder of clips, select them, see each clip's duration, and watch or listen to it in the app. She never needs the operating system's file explorer or an outside player. The app stays fast and never freezes on a bad file.

### Story 1.1: Recognise media files and show clear messages for unsupported ones

As Sarah, a video editor,
I want audio and video files to appear in the tree, be selectable, and tell me clearly when a format cannot be played,
So that I can see all my clips and know right away which ones the app can open.

**Acceptance Criteria:**

**Given** a folder containing MP4, MOV, MP3, WAV, MKV, AVI and non-media files
**When** the user opens the folder
**Then** every file is listed in the tree with the standard file icon
**And** media rows are never hidden or disabled
**And** the cause of any "invisible media" problem is checked first. If it is more than a missing filter, FR1 is flagged for re-scoping before more work is done

**Given** `src/lib/media.ts` exists
**When** `classifyMedia(name, mime)` is called
**Then** MP4 and MOV return `supported-video`, and MP3 and WAV return `supported-audio`
**And** any other audio or video type (for example MKV, AVI) returns `unsupported-media`
**And** a non-media file returns `other`
**And** the extension is the main signal, and an empty MIME type still gives the right answer
**And** the logic is covered by `media.test.ts`

**Given** the user clicks any audio or video file in the tree
**When** the file is selected
**Then** its name and size show in the details pane in the order from UX-DR1
**And** the app stays responsive

**Given** the user selects an unsupported audio or video file such as `old-take.mkv`
**When** the file is selected
**Then** within 0.5 seconds the preview box shows "Format not supported for playback" in the muted style
**And** the file is never loaded into a media element
**And** the Duration row is not shown
**And** the file stays visible and selectable in the tree

**Given** a file that is supported or not media at all
**When** it is selected
**Then** "Format not supported for playback" is never shown

**Given** an unsupported file is selected
**When** the user selects another file
**Then** the new file shows normally and nothing crashes or hangs

**Given** a folder with 50 or more media files of about 2 GB each
**When** the user opens it
**Then** all names show in the tree within 2 seconds
**And** `TreeNode` does no new per-row media work (no duration reads, object URLs or media elements)
**And** the new message and exact text constants live in `media.ts`, with no new colours or dependencies

### Story 1.2: Play supported audio and video in the preview box

As Sarah, a video editor,
I want to play a selected MP4, MOV, MP3 or WAV file in the preview box,
So that I can watch or listen to a clip without leaving the app.

**Acceptance Criteria:**

**Given** the user selects an MP4 or MOV file
**When** the file is selected
**Then** the preview box shows one native `<video controls preload="metadata">`
**And** the video does not autoplay
**And** it keeps its shape, within `max-width: 100%` and `--preview-max-height`

**Given** the user selects an MP3 or WAV file
**When** the file is selected
**Then** the preview box shows one native `<audio controls preload="metadata">` at `width: 100%`
**And** the audio does not autoplay

**Given** a supported file is selected
**When** the player is created
**Then** there is exactly one media element for that selection and no hidden probe element
**And** its source is `URL.createObjectURL(file)`, created from `entry.getFile()`
**And** the app makes no network request, upload or write, and adds no runtime dependency
**And** the element has the file name as its accessible name and can be reached with Tab
**And** focus stays on the tree row after selection

**Given** a file is playing
**When** the user selects a different file
**Then** the old file stops at once and its object URL is released
**And** the new file is shown

**Given** a late event from a previously selected file
**When** it arrives after the selection has changed
**Then** it is ignored and does not change the new file's state

**Given** a supported file such as a damaged MP4 fails to play
**When** the element reports an error
**Then** within 0.5 seconds the preview box shows "This file can't be played" in the error colour
**And** the message has the exact text, including the apostrophe
**And** the message is announced politely (`role="status"` or `aria-live="polite"`)
**And** the error never throws out of render

**Given** a file failed to play
**When** the user selects another file
**Then** the new file loads normally and the app does not crash or hang

**Given** the player is shown in light or dark mode
**When** the page renders
**Then** it sits in the existing `.preview` box with the media element set to `color-scheme: light dark`
**And** no new colours, sizes or radii are added

### Story 1.3: Show the duration in the details pane

As Sarah, a video editor,
I want to see how long each selected clip is,
So that I can tell a 2-second bad take from a 5-minute full take without playing each one.

**Acceptance Criteria:**

**Given** `src/lib/duration.ts` exists
**When** `formatDuration(seconds)` is called
**Then** it returns whole seconds rounded down as `m:ss` (15.9 gives `0:15`, 300 gives `5:00`, 4500 gives `75:00`)
**And** minutes are not capped at 59
**And** `NaN`, `Infinity`, `0` and negative values map to the `unknown` state through the element-duration mapping
**And** the logic is covered by `duration.test.ts`

**Given** the user selects a supported file
**When** the file is selected
**Then** the details pane shows a Duration row right after Type
**And** the row starts as `Loading...` (three dots)

**Given** the media element fires `loadedmetadata` with a valid duration
**When** the duration is read
**Then** the row shows the formatted value, for example `0:15`

**Given** the duration cannot be read, or is zero or invalid
**When** the media element reports it
**Then** the row shows `Unknown`

**Given** a supported file is selected in any state
**When** the user looks at the details pane
**Then** the Duration row is present and shows exactly one of `m:ss`, `Loading...` or `Unknown`
**And** it is never blank

**Given** `Loading...` is showing for file A
**When** the user selects file B
**Then** file A's duration is dropped
**And** the row shows file B's own state

**Given** a supported file fails to play
**When** the failure is shown
**Then** the details pane still shows its name, size, and the duration or `Unknown`

**Given** the Duration row and the player both need the duration
**When** the page renders
**Then** both read one shared state owned by one component per selection (no second copy)
**And** the row is announced politely when its value changes

**Given** an unsupported audio or video file is selected
**When** the details pane shows
**Then** no Duration row is shown

**Given** a folder with 50 or more media files of about 2 GB each
**When** the user selects clips one after another
**Then** the app stays responsive while durations are read
**And** reading starts only on selection, and the tree does no duration work
**And** the row uses the existing `.meta` styling (label muted, value normal) with no new colours
