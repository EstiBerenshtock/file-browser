---
name: report-change
description: Explains code changes in simple Hebrew before and after they are made, and waits for the user's approval. Use whenever the user asks to change, add, fix, edit, remove or refactor code or files in this project, even a tiny change. Do not use when the user only asks a question or asks to read or explain something.
---

# report-change

The user is a beginner who wants to stay in control and learn the project structure. Write in simple Hebrew. Nothing changes before the user approves it.

## Before the change
Stop and write:
1. **מה** ישתנה, in one simple sentence.
2. **למה** צריך את זה.
3. **איפה:** the path as a route, then the approximate line.
   Example: file-browser ← src ← components ← DetailsPane.tsx, בערך שורה 40
4. **מה הקובץ הזה בפרויקט**, in one sentence.
5. Ask: לאשר, לא לאשר, או לשנות?

Then wait. Do not edit anything until the user says yes.

## After the change
In a few lines: what was changed, in which files, using the same route format.
