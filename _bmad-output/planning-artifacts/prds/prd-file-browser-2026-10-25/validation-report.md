# Validation Report — file-browser v2 Audio/Video Player and Duration

- **PRD:** `prd.md`
- **Rubric:** `.claude/skills/bmad-prd/assets/prd-validation-checklist.md`
- **Run at:** 2026-10-25
- **Grade:** Fair (the rubric gives Fair to any PRD with a high finding)

## Overall verdict
Good for a small project. The PRD is faithful to the brief and readable by non-engineers, and the split between the two error messages is its strongest part. The risks: the two timing targets live only in the metrics table, FR-6 contradicts FR-10, "scan by length" does not match a details-pane-only length, and six FRs are not clean EARS.

## Dimension verdicts
- Decision-readiness — adequate
- Substance over theater — strong
- Strategic coherence — strong
- Done-ness clarity — thin
- Scope honesty — adequate
- Downstream usability — adequate
- Shape fit — strong

## Findings by severity

### Critical (0)

### High (3)
**[Done-ness]** — Timing targets not in any FR/NFR (§5.4, §6). "Under 2 seconds" and "under 0.5 seconds" appear only in S2/S3.
Fix: add "within 0.5 seconds" to FR-10/FR-11; add the 2-second / 50-files rule to NFR-2.

**[Done-ness]** — FR-6 contradicts FR-10 (§5.3 vs §5.4). FR-6 shows length for any media file; the brief shows only name and size for unsupported types.
Fix: limit FR-6 to supported types.

**[Decision-readiness]** — Scan-by-length vs details-pane-only (§3, §4 S1, §8). Sarah must click each file to see its length.
Fix: name this as a trade-off in §8, or soften S1 to "check a clip's length by selecting it".

### Medium (6)
- **[Done-ness]** "Never hang" lost; FR-14 "keep working normally" is vague. Fix: "shall not crash or stop responding".
- **[Done-ness]** Unclear when background length reading starts (S2 note vs FR-6). Fix: state it exactly.
- **[Done-ness]** Missing cases: length zero/invalid; new selection while `Loading...`. Fix: one line each, or accept.
- **[Decision-readiness]** The "why are media files invisible" check has no consequence. Fix: if the cause is bigger than a missing filter, re-scope FR-1.
- **[Scope honesty]** Additions beyond the brief (FR-5, FR-9, FR-13, counter-metric) are not marked. Fix: mark "added, confirmed by product owner".
- **[Downstream]** "Duration" (title, brief) vs "length" (body); no glossary. Fix: pick one term, add a 4-line glossary.

### Low (4)
- NFR-2 "stay responsive" is an adjective.
- S1 "Works end to end" is not measurable.
- No assumptions index (fine at this scale once additions are marked).
- FR-9, FR-12, FR-13 depend on other FRs.

## EARS check
Pass: FR-1, 2, 3, 4, 7, 8, 10, 11 (FR-10/11 are weak: several outputs, no timing).
Fail: FR-5 (wrong order), FR-6 (explanation text inside), FR-9 and FR-13 (negative "never" rules repeating other FRs), FR-12 (not a system response; refers to FRs by number), FR-14 (vague). A rewrite for each is in `review-rubric.md`.

## Mechanical notes
- IDs S1–S3, FR-1..14, NFR-1..3 are contiguous and unique.
- Header says "built only from the brief", which conflicts with FR-5/9/13.

## Reviewer files
- `review-rubric.md`
