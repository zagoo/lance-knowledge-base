# Prompt ② — GOAL AMENDMENT V2.1 (the amendment under which the KB was completed)

GOAL AMENDMENT V2.1 — The KB is a Navigation & Contract Layer, not a source replacement.
Issued after the iteration-86 status report. Supersedes the original Goal's §1 (coverage requirement), §4 (L2/L3 definitions), §6, §9 wherever they conflict. Loop Me continues under the new Definition of Done below.

## Ground truth accepted from the status report
- KEPT, not redone: complete deep coverage of rust/lance-core, rust/lance-table, rust/lance-file, root protos; 60% of lance-encoding; 176 L2 docs; 9,717 symbol records; 39,420 citations verified with 0 broken links and 0 unresolved mismatches.
- CANCELLED: the projected ~140 additional active hours of per-file line-by-line analysis (657 files / 380,740 lines).
- Measured bottleneck: re-verifying the accumulated KB every cycle + maintaining cross-layer duplication. This protocol is designed to eliminate both.
- Known defects to repair: two parallel ledgers (MANIFEST.json + CORE-MANIFEST.json); 43 L1 docs mixing current and historical out-of-scope material; headings/coverage statements still describing the pre-exclusion scope.

## New Philosophy
The KB lets a coding agent (a) make correct design and modification decisions from contracts alone, and (b) locate the exact source files and line ranges to read for implementation details — at most 2 hops, at most ~5 files per task. The consuming agent HAS source read access. Exhaustive transcription is no longer the goal.

## STOP immediately
1. No new per-file L2 docs for ordinary files; no MANIFEST advancement under old rules; no symbol-index expansion beyond what contracts and Module Maps reference.
2. No full-KB re-verification per iteration (see VERIFY V2.1).
3. No rework of completed crates.

## STEP 0 — Consolidate & repair (exactly one iteration, do first)
1. Freeze the 176 existing L2 docs and the symbol index as-is; mark them "frozen snapshot — verified through iteration 85".
2. Adopt CORE-MANIFEST.json as the single ledger of record; archive MANIFEST.json (do not maintain both).
3. Move historical/out-of-scope L1 material to `L1-modules/archive/`; top level keeps current-scope docs only.
4. Sweep every KB document for stale scope statements (headings, coverage claims describing the pre-exclusion scope) and correct them. This is a consumer-trust correctness task, not cosmetics.

## Milestones (in order)
M1 — Complete `L3-symbols/format-spec.md` in full (protos + lance-file are already 100% analyzed — this is synthesis, not new analysis). Complete L0: engine architecture, the four paths (read/write/compact/index) as executable traces, full glossary.
M2 — L1 docs WITH Module Maps for exactly these five uncovered subsystems: `rust/lance` (top-level Dataset API), `rust/lance-index` + `lance-index-core`, `rust/lance-io`, `rust/lance-datafusion`, `python`. Each Module Map: directory → one-paragraph responsibility; key types/traits → file paths; Key Files list with 3–8 line role descriptions. Deep L2 docs only for Key Files. **Java: Module Map ONLY — explicitly declared `mapped only`, no deep docs.** Same standing permission for already-summary-only peripherals (lance-geo, lance-tokenizer, lance-linalg, namespaces, etc.).
M3 — L3 behavior contracts: all public API + the five critical internal protocols (commit/transaction & conflict resolution, encoding selection, IO scheduling, version gates, index build/update paths). Then `L4-crosscutting/navigation-index.md`: ordered read maps (files + line ranges) for every cookbook recipe and scenario; for the four completed crates, deep-link into the frozen L2 docs.
M4 — Final full VERIFY V2.1 + `COMPLETION-REPORT.md` including the **trust map** (deep-verified vs mapped-only areas) and all declared exclusions.

## MANIFEST V2.1 (single ledger: CORE-MANIFEST.json)
Statuses: `excluded` (test/generated, with reason) / `key-file` (deep L2 doc exists — the 176 frozen docs count where their files are Key Files) / `mapped` (covered by a Module Map). Done = 100% classified; 100% of non-excluded files `mapped` or `key-file`.

## VERIFY V2.1 — delta-based, milestone-gated
EVERY iteration (cheap): check only artifacts changed this iteration — links resolve, ≤10-claim spot-check, ledger consistency. NO full-KB re-scans.
AT EACH MILESTONE boundary AND once at the end (full):
1. MANIFEST V2.1 at 100%.
2. Navigation test: the 5 original self-sufficiency questions + 5 new realistic dev tasks you invent. Using ONLY the KB, produce exact file lists and reading order; then OPEN the source to confirm pointers are correct and sufficient. Wrong/missing pointer → fix KB, log in verification-log.md.
3. Contract test: answer the contract parts of the original 5 questions (v2 semantics, conflict rules, API mapping, version gates) from the KB alone — no source. Any guessing → failure.
4. Accuracy spot-check ≥ 20 random KB claims against cited source; fix and log.
5. Cross-link integrity over the full KB (the ONLY full scan; milestones only).

## Definition of Done V2.1
M1–M4 complete; final full VERIFY V2.1 passes; CORE-MANIFEST.json at 100%; COMPLETION-REPORT.md written with trust map and declared exclusions. It is a SUCCESS, not a failure, that ordinary files have Module Map coverage instead of per-file docs.
