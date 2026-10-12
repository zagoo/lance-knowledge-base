# Lance KB refresh — 2026-10-12

**COMPLETE — all four scoped checks pass.** Source target `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` → `011953c22097b67b699595adbe99e7f0155d83e4`.

## Scope

30 changed paths: **2 key-file / 11 mapped / 17 excluded**. 29 modifications and one excluded documentation addition; no removals or renames. Diff: 904 insertions / 188 deletions, including excluded material. [Every path and classification](verification/refresh-011953c2/scope.json) · [Diff statistics](verification/refresh-011953c2/diff-stat.txt).

The single ledger contains **2,137 files: 195 Key Files, 831 mapped, 1,111 excluded; 100% classified**. All 1,026 non-excluded files remain covered. Production navigation ranges total 546,206 lines; this is not exhaustive deep analysis. No new source file requires a Key File candidacy decision.

## Updates

37 KB Markdown artifacts updated; [exact inventory](verification/refresh-011953c2/updated-documents.json). Maps, declaration directories, active citations, InsertBuilder L2, contracts and navigation were refreshed. Frozen bodies remain immutable with [dated addendum](refresh-addenda/2026-10-12-011953c2.md). Completed analysis was retained.

MemWAL generation writes now preserve base-table field IDs through insert, version dispatch, schema preparation and publication. Ordinary callers retain reassignment. Namespace inserts report input row count and written version. REST/fragment-reuse files with test-only changes receive metadata updates, without test analysis.

**Correction:** the previous October 11 E06 claim called spilled row lineage stable. Source confirms bit 11 is still unstable and supported only in debug builds or with the opt-in environment variable present. Both feature words remain required. This was a documentation accuracy defect, now repaired; no protobuf field or wire encoding changed. [Current contracts](L3-symbols/refresh-2026-10-12.md).

## Verification

| Check | Result |
|---|---|
| Navigation | PASS: 21 affected routes, 99 source pointers opened after KB-only plans; 158 unaffected routes skipped. Each named set uses at most five files. |
| Contracts | PASS: Q1 write/compact, Q3 format/gates, Q4 Python mapping, Q5 transactions. Q2 unchanged and skipped. |
| Accuracy | PASS: 12 seeded random claims from the updated contract document; source excerpts retained. |
| Full links and citation ranges | PASS: 372 Markdown documents, 17,689 links, 52,773 ranges; zero issues. All 177 frozen bodies and catalog unchanged. |

[KB-only plans](verification/refresh-011953c2/navigation-plan.json) · [Source confirmation](verification/refresh-011953c2/navigation-source.json) · [Contract answers](verification/refresh-011953c2/contract-answers.md) · [Accuracy evidence](verification/refresh-011953c2/accuracy.json) · [Results](verification/refresh-011953c2/results.json).

## Trust and limits

Affected areas are verified; temporary STALE flags are cleared. No contracts remain flagged for re-verification. The corrected lineage stability claim must not be used to assert a released stable capability. Namespace/peripheral coverage remains mapped-only except the explicitly checked boundary claims. No source modifications, builds, tests, external dependency analysis or binary inspection occurred. Frozen snapshot bodies retain their historical pins; current addenda govern changed pointers and claims.

Exclusions: 514 test/benchmark/fixture identities, 4 generated/dependency artifacts, 9 mechanical helpers, 302 binary/symlink identities and 282 supporting files. Embedded tests also excluded.

KB pointers now pin to commit 011953c22097b67b699595adbe99e7f0155d83e4. Frozen bodies retain historical pins with dated translations.
