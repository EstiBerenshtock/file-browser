---
title: "PRD: file-browser v2 — Audio/Video Player and Duration"
status: final
created: 2026-10-25
updated: 2026-10-25
---

# PRD: file-browser v2 — Audio/Video Player and Duration

_Small project. Built from the product brief. A few points were added beyond the brief; they are marked "(added, confirmed by the product owner)" and listed in section 9._

## 1. Vision

file-browser lets people browse a local folder and preview files. v2 adds full support for audio and video files, so people who work with media never need to leave the app to find and check a clip.

## 2. The Problem

Audio and video files are invisible in the file tree today. Sarah, a video editor, opens a folder full of clips and sees none of them. She cannot select a clip or see its name or size. She has to switch to the operating system's file explorer and an outside media player, so the app is useless for her work.

## 3. Who This Serves

**Sarah, a video editor.** She works in folders with many clips. She needs to tell clips apart without playing each one, for example a 2-second bad take versus a 5-minute full take.

### A good day for Sarah

Sarah opens a folder of media files in the app. She selects clips and checks the duration in the details pane until she finds the one she needs, about 15 seconds long. She watches it in the preview pane right there and goes straight to editing. She never switches to the operating system's file explorer or an outside player.

## 4. Glossary

- **Duration:** how long an audio or video file runs, shown in whole seconds, like `0:15`.
- **Details pane:** the area that shows a selected file's name, size and duration.
- **Preview pane:** the area where a selected file is played or a message is shown.
- **Supported type:** MP4 and MOV (video), MP3 and WAV (audio). Any other audio or video type is not supported.

## 5. Success Metrics

| # | Metric | Target |
|---|---|---|
| S1 | Sarah can open a folder, check clips' durations by selecting them, and preview one without using the file explorer or an outside player | She completes this whole flow in one test run with no outside tool |
| S2 | A folder with 50 or more media files of about 2 GB each shows all file names in the tree | In under 2 seconds, and the app stays responsive |
| S3 | Clicking an unsupported or broken file shows the correct message | In under 0.5 seconds, with no crash and no hang |

**Counter-metric** (added, confirmed by the product owner): speed must not be traded for features. If showing durations slows the app or makes it hang, the feature has failed, even if every duration is correct.

## 6. Functional Requirements

Each requirement uses EARS syntax: *When / While / If … then … the app shall …*, or *The app shall …* for always-true rules.

### 6.1 Visible and selectable

- **FR-1** The app shall show audio and video files in the file tree alongside other files.
- **FR-2** When the user clicks an audio or video file in the tree, the app shall select it and show its name and size in the details pane.

### 6.2 Playable

- **FR-3** When the user selects an MP4 or MOV video file, the app shall play it in the preview pane.
- **FR-4** When the user selects an MP3 or WAV audio file, the app shall play it in the preview pane.
- **FR-5** While a file is playing, when the user selects a different file, the app shall stop the playing file and show the newly selected file. _(Added, confirmed by the product owner.)_

### 6.3 Duration

- **FR-6** When the user selects a file of a supported type, the app shall show its duration in the details pane in whole seconds, rounded down, in the form `m:ss`.
- **FR-7** While the duration of a selected file is being read, the app shall show `Loading...` in place of the duration.
- **FR-8** If the duration of a selected file of a supported type cannot be read, or is zero or invalid, then the app shall show `Unknown` in place of the duration.
- **FR-9** While a file of a supported type is selected, the app shall always show in the details pane one of: its duration, `Loading...`, or `Unknown`.
- **FR-10** When the user selects a different file while `Loading...` is showing, the app shall drop the first file's duration and show the duration state of the newly selected file.

_Note: rounding down means a 15.9-second clip shows `0:15`._
_Note: the app starts reading a duration when the file is selected. Reading never blocks browsing._

### 6.4 Files that cannot be played

- **FR-11** If the user selects an audio or video file whose type is not a supported type (for example MKV or AVI), then the app shall, within 0.5 seconds, show the message "Format not supported for playback" in the preview pane.
- **FR-12** If the user selects an audio or video file whose type is not a supported type, then the app shall show its name and size in the details pane and shall keep the file visible and selectable in the tree.
- **FR-13** If a file of a supported type fails to play (for example a damaged file or an unsupported encoding), then the app shall, within 0.5 seconds, show the message "This file can't be played" in the preview pane.
- **FR-14** If a file of a supported type fails to play, then the app shall show its name and size, and its duration or `Unknown`, in the details pane.
- **FR-15** The app shall show the message "Format not supported for playback" only for audio and video files that are not a supported type.
- **FR-16** While an audio or video file is selected, the app shall show either the player or an explanatory message in the preview pane.
- **FR-17** If an audio or video file cannot be shown or played, then the app shall remain responsive and allow the user to select other files, without crashing or stopping responding.

## 7. Non-Functional Requirements

- **NFR-1 Read-only and local.** The app shall never change or delete a file and shall never send any file or file information off the user's computer.
- **NFR-2 Performance.** When the user opens a folder with 50 or more media files of about 2 GB each, the app shall show all file names in the tree within 2 seconds and shall remain responsive while durations are read.
- **NFR-3 Consistent look.** The player and the duration text shall match the existing look of the app. There is no redesign.

## 8. Out of Scope, Limits and Open Points

**Out of scope for v2**
- Video thumbnails (standard file icons only)
- Extra player features such as speed control
- More formats, such as MKV or AVI playback
- Playlists or automatic play of the next file
- Other file information such as resolution or bitrate

**Known limits and trade-offs**
- **Duration shows only after selecting a file.** The duration appears in the details pane, not in the tree. Sarah must select a clip to check its duration, so with many clips she checks them one by one. This is a deliberate trade-off, accepted by the product owner.
- **Whole-second durations are approximate.** A 15.9-second clip shows `0:15`, so looking for "15 seconds" is not exact. Accepted.
- **Why media files are invisible today is not confirmed.** The team should check this early, before planning the work. If the cause is more than a simple missing file filter, FR-1 must be re-scoped before work starts.
- **Thumbnails are deferred, not answered.** See `open-questions.md`.

## 9. Additions Beyond the Brief

All confirmed by the product owner:
- FR-5: choosing a new file stops the one that is playing.
- The supported list is exactly MP4, MOV, MP3 and WAV.
- Duration shows only in the details pane.
- Rounding down, not up.
- FR-9, FR-10, FR-16 and the zero or invalid duration case in FR-8: written to make the brief's "never empty" and "never blank" rules testable.
- The counter-metric in section 5.
