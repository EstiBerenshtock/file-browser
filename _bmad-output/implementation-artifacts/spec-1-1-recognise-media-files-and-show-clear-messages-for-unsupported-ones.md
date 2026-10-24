---
title: 'Recognise media files and show clear messages for unsupported ones'
type: 'feature'
created: '2026-10-25'
status: 'done'
baseline_commit: '104e0c6f40e93181a8eaa59f9382454c8e00a54f'
route: 'dispatch'
review_loop_iteration: 0
context: ['{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md']
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The app has no idea which files are audio or video. A user who selects an MKV or AVI clip gets no hint that the app cannot play that format.

**Approach:** Add a small framework-free `classifyMedia` function. Use it in the details pane so that unsupported audio/video files show "Format not supported for playback" in the preview box. Playback (Story 1.2) and Duration (Story 1.3) are not part of this story.

## Boundaries & Constraints

**Always:** Extension is the main signal, MIME is the fallback (empty MIME must work). Reuse `extensionOf` from `format.ts`. Message text lives as a constant in `media.ts`. Decide the message with no media element and no object URL. Colours only from CSS variables in `src/styles.css`. The message uses the muted `.empty` look with `role="status"`. Media rows stay in the tree with the standard file icon.

**Never:** No new runtime dependency. No media element, duration or player (Stories 1.2, 1.3). No media work in `TreeNode`. No `arrayBuffer()` or `text()` on media files. No hardcoded colours. No `.test.tsx` files (they are skipped).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Supported video | `a.mp4`, `B.MOV` (any MIME or empty) | `supported-video` | N/A |
| Supported audio | `a.mp3`, `a.wav` | `supported-audio` | N/A |
| Unsupported by extension | `old-take.mkv`, `x.avi` | `unsupported-media` | N/A |
| MIME only | `clip` with `video/x-matroska` or `audio/ogg` | `unsupported-media` | N/A |
| MIME fallback, supported | `clip` with `video/mp4` or `audio/mpeg` | supported video / audio | N/A |
| Non-media | `notes.txt`, `photo.jpg`, no extension, empty MIME | `other` | N/A |
| Select unsupported file | `old-take.mkv` | Preview box shows only the message; no Duration row | N/A |
| Select other file | supported media or non-media | Message never shown | N/A |
| Switch away | unsupported then another file | New file shows normally | N/A |

</frozen-after-approval>

## Code Map

- `src/lib/format.ts` -- has `extensionOf` and `describeType` (already labels mp3/wav/mp4/mov). Reuse; do not change.
- `src/lib/media.ts` -- NEW. `classifyMedia` and the message constant.
- `src/lib/media.test.ts` -- NEW. Vitest cases for the matrix.
- `src/components/DetailsPane.tsx` -- after `getFile()`, classify with `metadata.name` and `metadata.type`. Unsupported: render `.preview` box with the message. Existing image preview and Name/Size/Type/Modified rows stay.
- `src/styles.css` -- `.preview`, `.empty`, `.meta` already exist. Likely no change.
- `src/components/TreeNode.tsx`, `src/lib/sources.ts` -- early check done: no filter hides any file, all files get the 📄 icon. Do not change.

**Early check result:** Media files are not hidden in the tree today. There is no missing filter and no deeper cause, so no re-scoping is needed.

## Tasks & Acceptance

**Execution:**
- [x] `src/lib/media.ts` -- add `MediaKind`, `classifyMedia(name, mime)` and `UNSUPPORTED_MEDIA_MESSAGE = 'Format not supported for playback'` -- shared with Stories 1.2 and 1.3
- [x] `src/lib/media.test.ts` -- cover every matrix row, including upper-case extensions and empty MIME -- logic is the only automated check
- [x] `src/components/DetailsPane.tsx` -- show the message in the `.preview` box for `unsupported-media` only -- fulfils the user-facing requirement

**Acceptance Criteria:**
- Given a folder with MP4, MOV, MP3, WAV, MKV, AVI and text files, when it is opened, then every file is listed with the standard icon.
- Given any media file is clicked, when it is selected, then name and size show in the details pane and the app stays responsive.
- Given `old-take.mkv` is selected, then the message shows within 0.5 s, no Duration row shows, and the file is never loaded into a media element.
- Given a supported or non-media file is selected, then the message is never shown.

## Implementation Notes

## Spec Change Log

## Review Triage Log

| Finding | Verdict | Evidence / route |
|---|---|---|
| UI passed `metadata.type` (a label from `describeType`) to `classifyMedia`, so the MIME fallback never worked in the app | high | Confirmed in `metadata.ts`. Patched: classify from `file.name`/`file.type` in the load effect. |
| MIME with parameters, spaces or case (`audio/wav; codecs=1`) misclassified | medium | Patched: normalise with `split(';')[0].trim()`; test added. |
| Unlisted media extensions (ts, mxf, caf, amr...) with empty MIME give `other` | low | Real but unbounded list; `.ts` clashes with TypeScript. Rejected: fix adds complexity. |
| Stale message when switching files | false | `DetailsPane` is rendered with `key={selected.path}` in `App.tsx:99`; state starts fresh. |
| Two preview boxes when image and unsupported both true | false | Needs an image MIME/extension on an unsupported-media extension; not reachable in practice. |
| 0.5 s not measured / decided before `getFile()` | low | Local read; rejected. |
| `role="status"` on an element inserted already filled | low | The spec asked for `role="status"`; rejected. |
| Extension vs MIME conflict, dotfile names, double extensions, test-label nits | low | Extension-first is the spec's rule. Rejected. |
| Process/doc notes (sprint-status, epic context, empty logs) | false | Status values are correct for this stage; not code defects. |
| Verification-gap layer | none | "No verification gaps found." |

## Verification

**Commands:**
- `npm run check` -- expected: typecheck, lint and tests all pass

**Manual checks (if no CLI):**
- Run the app, open a folder with `.mkv`, `.avi`, `.mp4`, `.txt` files. Selecting the MKV and AVI shows the muted message in the preview box. Selecting the MP4 and the TXT does not. Switching between them works.
