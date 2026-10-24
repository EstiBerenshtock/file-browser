---
title: "Product Brief: file-browser v2 — Audio/Video Player and Duration"
status: final
created: 2026-10-25
updated: 2026-10-25
---

# Product Brief: file-browser v2 — Audio/Video Player and Duration

_Brownfield: this brief covers only what v2 adds to the existing read-only file browser._

## Summary

file-browser lets people browse a local folder and preview files. In v2 we fully support audio and video files: they appear in the file tree, play in the preview pane, and show their length in the details pane. The goal is that someone who works with media never has to leave the app to find and check a clip.

## The Problem

Today, audio and video files are invisible in the file tree. Sarah, a video editor, opens a folder full of clips and sees none of them. She cannot select them, so she cannot even see a name or size. She leaves our app, opens the operating system's file explorer, and uses an external media player. For her workflow, the app is useless.

## Who This Serves

**Sarah, a video editor.** She works in folders with many clips. She needs to tell files apart quickly without playing each one (for example, a 2-second bad take versus a 5-minute full take, or a clip of about 15 seconds).

## What v2 Adds

1. **Visible and selectable.** Audio and video files appear in the file tree and can be selected. This is the first thing Sarah needs.
2. **Playable.** Selecting a file plays it in the preview pane. Must work for **MP4, MOV (video)** and **MP3, WAV (audio)**.
3. **Duration.** The details pane shows the length in whole seconds, like `0:15`. While it is being read it shows `Loading...`. If it cannot be read it shows `Unknown`. It is never empty.

### When a file cannot be played

| Situation | Tree | Details pane | Preview pane |
|---|---|---|---|
| Type not on the list (e.g. MKV, AVI) | Visible, selectable | Name and size | "Format not supported for playback" |
| Supported type, but fails (bad codec, damaged file) | Visible, selectable | Name, size; duration, or `Unknown` if unreadable | A different message: "This file can't be played" |

The two messages must differ. If a `.mov` showed "format not supported", Sarah would wrongly think the app does not support `.mov` at all. The preview pane must never be blank and the app must never crash.

## Constraints (non-negotiable)

- **Read-only and local.** The app never changes or deletes files, and never uploads anything.
- **Performance.** Opening a folder of large media files must not freeze or slow the app.
- **Consistent look.** The player and the duration text fit the existing design. No redesign.

## Success Criteria

1. **Workflow.** Sarah can open a folder, scan clips by duration, and preview the one she wants without using the OS file explorer or an external player.
2. **Speed.** A folder with 50 or more media files of about 2 GB each shows its names in the tree in under 2 seconds, and the app stays responsive. Durations may finish later in the background, showing `Loading...`.
3. **Errors.** Clicking an unsupported or broken file shows the correct message in under 0.5 seconds. No crash, no hang.

## Out of Scope for v2

- Video thumbnails (standard file icons only for now)
- Extra player features (speed control, etc.)
- More formats (e.g. MKV, AVI playback)
- Playlists or auto-play of the next file
- Other file info such as resolution or bitrate

## Known Limits and Open Points

- Whole-second durations mean a "15 second" search is approximate (a 15.9 s clip shows `0:15`). Accepted.
- Why media files are invisible today is not yet confirmed. The team should check this early.
- The thumbnail question in `open-questions.md` is deferred, not answered.
