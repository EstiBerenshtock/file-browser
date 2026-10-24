---
name: file-browser
status: final
updated: 2026-10-25
sources:
  - _bmad-output/planning-artifacts/prds/prd-file-browser-2026-10-25/prd.md
  - src/styles.css
description: Visual spec for the v2 audio/video player and duration text. It adds NO new tokens. Everything reuses the existing variables in src/styles.css.
colors:
  # All values are the existing :root variables. Nothing is added or changed.
  bg: '#ffffff'
  preview-bg: '#f3f4f6'
  border: '#d4d7dd'
  text: '#1f2328'
  text-muted: '#667085'
  error: '#b42318'
  bg-dark: '#1b1d21'
  preview-bg-dark: '#23262b'
  border-dark: '#3a3f47'
  text-dark: '#e6e8eb'
  text-muted-dark: '#9aa3b0'
  error-dark: '#ff8a80'
typography:
  body:
    fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif'
    fontSize: 14px
  small:
    fontSize: 12px
  title:
    fontSize: 18px
rounded:
  DEFAULT: 6px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
components:
  media-preview:
    background: '{colors.preview-bg}'
    border: '1px solid {colors.border}'
    radius: '{rounded.DEFAULT}'
    padding: '{spacing.3}'
    margin-bottom: '{spacing.4}'
  media-element:
    max-width: '100%'
    max-height: 'var(--preview-max-height)'
  duration-row:
    label-color: '{colors.text-muted}'
    value-color: '{colors.text}'
  preview-message-info:
    foreground: '{colors.text-muted}'
  preview-message-error:
    foreground: '{colors.error}'
---

## Brand & Style

file-browser is a plain, quiet utility: a grey sidebar, a white details area, one blue accent used only on the main button and the selected row. The v2 player must look like it was always there. It is a guest in the existing `.preview` box, not a new surface. **No redesign** (NFR-3): no new colors, no new fonts, no new radii, no custom player skin.

## Colors

No new colors. The player sits on the existing preview box.

- **Preview box:** `{colors.preview-bg}` with a 1px `{colors.border}` border. This is the same box that already holds image previews.
- **Duration label:** `{colors.text-muted}` (the existing `.meta dt` style). **Duration value:** `{colors.text}` (the existing `.meta dd`).
- **"Format not supported for playback":** muted text. It is information, not a fault. The file is fine; we just do not play it.
- **"This file can't be played":** `{colors.error}`. Something is wrong with this file.
- The blue accent is not used by the player. The browser's own controls bring their own colors.

Dark mode is automatic: every value above already has a dark variable in `src/styles.css`. The media element gets `color-scheme: light dark` so the browser's controls follow the same setting.

## Typography

Reuse the existing sizes. Duration text is body size (14px), because it is just another row in the `.meta` list. Messages in the preview box are body size. No bold, no monospace. `m:ss` is plain text.

## Layout & Spacing

The details pane keeps its order. Only two things are added:

1. **Preview box** (top, under the title): holds the player or a message. Same padding (`{spacing.3}`), same bottom margin (`{spacing.4}`), same centered content as image previews.
2. **Duration row:** one new entry in the existing `.meta` grid, placed right after **Type**. Same 120px label column, same gap.

Sizing inside the preview box:

- **Video:** `max-width: 100%`, `max-height: var(--preview-max-height)` (320px), keeps its shape. Same rule images already use.
- **Audio:** `width: 100%`. The native audio bar is one thin row, so the box shrinks to fit it.
- **Message:** one line of text, wrapping when narrow. Same `--preview-max-height` ceiling.

The file tree does not change. Video thumbnails are out of scope, and there is no duration in the tree.

## Elevation & Depth

None. The app is flat: borders and tonal fills only. The player gets no shadow, no overlay, no floating bar.

## Shapes

One radius, `{rounded.DEFAULT}` (6px), on the preview box only. The native controls keep their own shapes.

## Components

**media-preview.** The existing `.preview` box, reused as is. It holds exactly one of: a `<video controls>`, an `<audio controls>`, or a message.

**media-element.** The browser's native player controls, with no custom skin. This adds no dependency, gives play/pause/seek/volume/fullscreen for free, and follows light/dark mode. The video shows its first frame; no thumbnail work.

**duration-row.** A normal `.meta` row. Label `Duration`. The value is exactly one of three texts:

| State | Text |
|---|---|
| Ready | `m:ss`, rounded down. A 15.9 s clip is `0:15`. A 5-minute clip is `5:00`. |
| Reading | `Loading...` |
| Failed, zero or invalid | `Unknown` |

**preview-message-info / preview-message-error.** Plain text in the preview box. Info uses the existing `.empty` look (muted). Error uses the existing `.error` color. Neither has an icon or a button.

## Do's and Don'ts

**Do**
- Reuse `.preview` and `.meta`. Add only the smallest CSS rules needed (media sizing, `color-scheme`).
- Use only existing `var(--...)` values. If a new value feels necessary, stop and ask.
- Keep the duration row in the same place for every supported file.

**Don't**
- Don't add new color, size or radius variables.
- Don't build a custom player skin or buttons.
- Don't add icons, badges or duration text to tree rows.
- Don't use the red error color for "Format not supported for playback".
- Don't add any runtime dependency (project policy).
