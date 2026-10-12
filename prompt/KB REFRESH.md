# Prompt ④ — KB REFRESH (run after any `git pull` on the Lance repo)

KB REFRESH — the Lance source moved to a new commit. Re-anchor the KB; do NOT redo completed analysis.

CONTEXT
- KB root: /Users/renshaobin/Workspace/Develop/GitHub/lance-knowledge-base/
- Source:  /Users/renshaobin/Workspace/Develop/GitHub/lance
- The KB was completed under GOAL AMENDMENT V2.1 (see COMPLETION-REPORT.md). All pointers are pinned to the OLD commit recorded there. The source is now at a NEW commit (current HEAD).

STEP 1 — Diff scope (read-only)
- Record OLD commit (from COMPLETION-REPORT.md) and NEW commit (`git rev-parse HEAD`).
- Run `git diff --name-status OLD..NEW` and `git diff --stat OLD..NEW`. Classify every changed file against CORE-MANIFEST.json: excluded / mapped / key-file.
- If ALL changed files are `excluded`: no KB content changes needed — skip to STEP 5 and just re-pin the commit.

STEP 2 — Re-anchor affected pointers
- For every changed `key-file`: re-read the changed hunks in source; update its L2 doc and any affected L3 contract (behavior changes) or only the line ranges (pure drift). Mark each updated doc with the new commit.
- For every changed `mapped` file: update its Module Map entry and any navigation-index read set that references it (files renamed/moved, line ranges shifted).
- Even for files with no semantic change, fix any KB citation whose line range drifted.
- Frozen docs stay frozen: if a frozen L2 doc's file changed, do NOT rewrite the body — add a dated addendum noting the drift and, if behavior changed, flag the contract for re-verification.

STEP 3 — Scoped VERIFY (VERIFY V2.1 style, scoped to impact)
1. Navigation test: re-run ONLY the navigation tasks whose read sets touch changed files; produce KB-only plans, then open source to confirm pointers.
2. Contract test: re-answer ONLY contract questions whose underlying files changed, from KB alone; then confirm against source.
3. Accuracy spot-check: ≥ 10 random claims drawn ONLY from documents updated in STEP 2.
4. Cross-link integrity: one full scan of the KB (links + citation ranges), since line anchors may have drifted anywhere.

STEP 4 — Ledger and report updates
- Update CORE-MANIFEST.json for added/removed/renamed files (new files get classified: excluded/mapped/key-file — new non-trivial source files MUST get at least a Module Map entry; if a new file is an entry point, public API, format-critical, or transaction/commit code, it becomes a key-file candidate).
- Update COMPLETION-REPORT.md: new pinned commit, refresh date, summary of what changed, any trust-map downgrades (e.g., a deep-verified contract that changed behavior is no longer verified until re-checked).
- Append the refresh to verification-log.md with evidence.

STEP 5 — Output a REFRESH REPORT
- OLD → NEW commit, files changed by class, docs updated, verification results (4 checks), any contracts flagged as needs-re-verification, and an explicit final statement: "KB pointers now pin to commit <NEW>" — or, if anything could not be verified, exactly what remains unreliable.
- Rule: until STEP 3 passes, the KB must be treated as STALE for the affected areas; say so explicitly in the report if you finish with open issues.
