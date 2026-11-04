---
paths: ["src/components/**","src/lib/**"]
---
Date: 2026-10-26
Reason: Story 1.1 review finding (high), fixed in commit 7aac536. The UI passed `metadata.type`, a display label from `describeType`, to `classifyMedia`, so the MIME fallback never worked in the app.

Rule: logic that needs a MIME type or extension reads the raw `file.type` and `file.name`. Never use a label made for display (`metadata.type`, `describeType(...)`) as input to logic.

Bad: `classifyMedia(file.name, metadata.type)  // metadata.type is "MP4 video", not "video/mp4"`
Good: `classifyMedia(file.name, file.type)`
