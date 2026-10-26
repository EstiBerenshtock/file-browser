# PRD Quality Review — file-browser v2 Audio/Video Player and Duration

## Overall verdict
Good for a small hobby/course project. It is faithful to the brief, readable by non-engineers (no library or component names), and the error-message split (FR-10 vs FR-11) is the strongest part. The risks are: the two headline numbers (under 2 s, under 0.5 s) live only in the metrics table and not in any FR/NFR, a contradiction between FR-6 and FR-10 about showing length, a tension between "scan clips by length" and length appearing only after selecting a file, and several FRs that are not valid EARS (FR-5, FR-6, FR-9, FR-12, FR-14).

## Decision-readiness — adequate
Known limits (approximate whole seconds, thumbnails deferred, supported list fixed) are stated as decisions with "Accepted" / "Confirmed". The open point "why media files are invisible today is not confirmed" is honest, but the PRD does not say what changes if the cause is bigger than expected (FR-1 may become much larger work). The biggest unsurfaced trade-off: length shows only in the details pane (Known Limits), yet the Vision/Problem say Sarah should "scan clips by length". With 50+ files she must click each one to see a length. That undercuts S1 and is only accepted implicitly.

### Findings
- **high** Scan-by-length vs details-pane-only (§3, §4 S1, §8) — "tell clips apart without playing each one" and "scan clips by length" cannot be done from the tree; she must select each file. *Fix:* Say so as a named trade-off in §8 (and note it as a [NOTE FOR PM]), or soften S1 wording to "check a clip's length by selecting it".
- **medium** Early-check open point has no consequence (§8) — *Fix:* Add one line: if the cause is not just a missing file filter, re-scope FR-1 before planning.

## Substance over theater — strong
One persona who drives every decision. No innovation or vision theater. NFRs are mostly product-specific (read-only, local, large files). NFR-3 "match the existing look" is thin but fair for brownfield.

### Findings
- **low** NFR-2 "stay responsive" is an adjective (§6) — see Done-ness.

## Strategic coherence — strong
Clear thesis: never leave the app to check a clip. Features follow from it in order of need. Counter-metric (speed must not be traded for features) is a real one.

### Findings
- **low** S1 target "Works end to end" is not a measurable target (§4). *Fix:* "Sarah completes the open-scan-preview flow with no outside tool, in one test run."

## Done-ness clarity — thin
Most FRs have a testable outcome. But the brief's only numbers are not carried into requirements: nothing in FR-10, FR-11 or NFR-2 says "within 0.5 seconds" or "names in under 2 seconds". Only the metrics table does, so a story writer working from FRs will miss them. "Responsive", "keep working normally" (FR-14) and "works end to end" are adjectives.

### Findings
- **high** Timing targets not in any FR/NFR (§5.4, §6) — S2/S3 hold "under 2 seconds" and "under 0.5 seconds"; FR-10, FR-11, NFR-2 have none. *Fix:* Add to FR-10/FR-11 "within 0.5 seconds", and to NFR-2 "show all file names within 2 seconds for 50 or more files of about 2 GB each".
- **high** FR-6 contradicts FR-10 (§5.3 vs §5.4) — FR-6 says length is shown for any selected audio/video file; the brief and FR-10 show only name and size for an unsupported type. *Fix:* Limit FR-6 to supported types, or state in FR-10 whether length is shown.
- **medium** "Never freeze/hang" lost (§5, §6) — Brief says no crash, no hang, and folder opening must not freeze. FR-14 says "keep working normally" (vague) and only S3 mentions no hang. *Fix:* In FR-14 say "shall not crash or stop responding".
- **medium** Background length loading unclear (§4 note, FR-6, FR-7) — The S2 note says lengths "finish loading later in the background" for a whole folder, but FR-6 reads length only on selection. Which is it? *Fix:* State exactly when length reading starts.
- **medium** Missing cases (§5.3) — what if the length is read but is zero or invalid? What if the file is selected, then another is selected while Loading... (FR-5 covers playing only). *Fix:* One line each, or accept as out of scope.

## Scope honesty — adequate
Out of Scope list matches the brief exactly. Two additions are tagged "Confirmed by the product owner". But the header says points added beyond the brief were confirmed without saying which. FR-5 (stop the first file), FR-9 and FR-13 (restatements), and the counter-metric are not in the brief and are not marked. No [ASSUMPTION] tags. Open-item density is low and fine for the stakes.

### Findings
- **medium** Unmarked additions beyond the brief (§5.2 FR-5, §4 counter-metric) — *Fix:* Mark them "(added, confirmed by product owner)" or tag [ASSUMPTION].
- **low** No Assumptions index; acceptable at this scale if the line above is fixed.

## Downstream usability — adequate
IDs (S1-S3, FR-1..14, NFR-1..3) are contiguous and unique. One protagonist, named. No glossary, and the term drifts: the title and brief say "duration", the body says "length" throughout.

### Findings
- **medium** Duration vs length drift (title, §3-§5) — *Fix:* Pick one term (suggest "length", or "duration" to match the brief) and use it everywhere, including the title. Add a 4-line glossary: length, details pane, preview pane, supported type.
- **low** FR-12 and FR-9/FR-13 depend on other FRs, so they cannot be pulled out alone. See EARS section.

## Shape fit — strong
Capability-spec shape with a single persona and a short journey fits a hobby brownfield project. Not over-formalized. Plain English throughout; formats (MP4, MOV, MP3, WAV) are user-facing, not technical detail, so they are fine.

## Brief-to-PRD coverage
Kept: problem, Sarah, three adds, both error messages and the table, constraints, three success criteria, out of scope (all 5), all 3 known limits.
Changed or dropped:
- "Under 2 seconds" and "under 0.5 seconds" kept only in S2/S3, not in FRs/NFRs (see above).
- "Never crash" kept only in S3 and weakly in FR-14. "Never hang" is gone from FRs.
- "Must not freeze or slow the app" became NFR-2 "stay responsive" (adjective).
- Brief's "duration" became "length" (term change).
- Details-pane rows: brief shows no length for unsupported types; PRD FR-6 implies it does (conflict).
- New beyond brief: FR-5, FR-9, FR-13, counter-metric, and two "Confirmed" limits (length only in details pane; supported list exactly four).
- "Sarah scans clips by duration" kept, but the details-pane-only decision weakens it.

## EARS check
| FR | Pattern | Result | Fix |
|---|---|---|---|
| FR-1 | Ubiquitous | PASS | None. |
| FR-2 | Event-driven (When) | PASS | None. |
| FR-3 | Event-driven | PASS | None. |
| FR-4 | Event-driven | PASS | None. |
| FR-5 | Mixed state + event | FAIL | Order is wrong for complex EARS. Use: "While a file is playing, when the user selects a different file, the app shall stop the playing file and show the newly selected file." |
| FR-6 | Event-driven | FAIL | Second and third sentences are explanation, not requirement. Use: "When the user selects a supported audio or video file, the app shall show its length in the details pane in whole seconds, rounded down, in the form m:ss." Put the 15.9 to 0:15 example in a note. Also fix the FR-10 conflict. |
| FR-7 | State-driven (While) | PASS | None. |
| FR-8 | Unwanted behavior (If-then) | PASS | None. |
| FR-9 | Ubiquitous, negative | FAIL | Redundant with FR-7/FR-8, and "never" is hard to test. Merge into FR-7/FR-8 as "shall always show either the length, Loading..., or Unknown", or drop. |
| FR-10 | Unwanted behavior | PASS (weak) | Valid. Compound (3 outputs); consider splitting. Add "within 0.5 seconds". |
| FR-11 | Unwanted behavior | PASS (weak) | Valid. "If ... fails to play" is fine. Add "within 0.5 seconds"; split the length part. |
| FR-12 | None | FAIL | Not a system response. It is a constraint on FR-10/11 and refers to them by number. Use: "The app shall show the 'Format not supported for playback' message only for types not on the supported list." |
| FR-13 | Ubiquitous, negative | FAIL (minor) | Restates FR-10/11. Use: "While an audio or video file is selected, the app shall show either the player or an explanatory message in the preview pane." |
| FR-14 | Unwanted behavior | FAIL (minor) | "Keep working normally" is vague. Use: "If an audio or video file cannot be shown or played, then the app shall remain responsive and allow the user to select other files, without crashing."|

Result: 7 pass (FR-1,2,3,4,7,8 clean; 10-11 pass with weakness), 5 fail (FR-5, 6, 9, 12, 13, 14 counted: 6 minor-to-moderate fails). Precisely: pass = FR-1,2,3,4,7,8,10,11; fail = FR-5,6,9,12,13,14.

## Mechanical notes
- Glossary: none; drift "duration" (title, brief) vs "length" (body).
- IDs: S1-S3, FR-1..14, NFR-1..3 contiguous, no duplicates. FR-12 cross-refers to FR-10/11 by number (resolves). NFR-2 refers to S2 (resolves).
- Assumptions: no [ASSUMPTION] tags and no index; only "Confirmed by the product owner" lines.
- Sections: all needed sections present for the stakes. Non-Goals exists as "Out of Scope".
- Header claim "Built only from the product brief" conflicts with the added FR-5/9/13 (partly explained by the next sentence).

## Severity counts
critical 0, high 3, medium 6, low 4.
