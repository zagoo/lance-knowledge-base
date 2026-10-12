# Lance KB — Completion Report V2.1

**2026-10-12 refresh COMPLETE; all four scoped checks pass.** Baseline completed at iteration 95. This is a Navigation & Contract Layer for agents with source access.

Pinned snapshot: `011953c22097b67b699595adbe99e7f0155d83e4` (previous `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`). [Refresh report](REFRESH-REPORT.md) · [Protocol](V21-PROTOCOL.md) · [Navigation](L4-crosscutting/navigation-index.md) · [Previous completion](verification/refresh-011953c2/COMPLETION-REPORT.txt).

## Refresh and coverage

30 changed paths: 2 key-file, 11 mapped, 17 excluded. MemWAL field-ID preservation, namespace insert response metadata, and spilled-lineage stability correction. [Results](verification/refresh-011953c2/results.json) · [Classifications](verification/refresh-011953c2/scope.json).

| Single-ledger status | Files | Share |
|---|---:|---:|
| Key File | 195 | 9.12% |
| Mapped | 831 | 38.89% |
| Excluded | 1,111 | 51.99% |
| Unclassified | 0 | 0% |
| Total | 2,137 | 100% |

[CORE-MANIFEST.json](CORE-MANIFEST.json) covers 100% of the 1,026 non-excluded files. Production reading intervals total 546,206 lines, not exhaustive deep coverage. 195 current L2 records comprise 176 frozen and 19 selected contract-range records; historical out-of-scope records confer no current credit. The 9,717-record machine catalog is frozen.

## Trust map

| Area | Trust boundary |
|---|---|
| lance-core, lance-table, lance-file, root protos | Retained deep baseline; changed contracts require the current dated addendum. Frozen bodies remain at iteration-85 pin. |
| lance-encoding | Retained partial deep coverage plus selected sequence contract; other mechanisms mapped. Unstable 2.3 changed grammar supersedes frozen descriptions only in the dated contract. Stable reader boundaries rechecked. |
| Dataset / transactions / index / IO / DataFusion / Python | Family contracts checked, with selected L2 ranges and ordinary Module Maps. This is not deep verification of every implementation body. |
| MemWAL | New plugin boundary and concurrency/flush contract checked; helper algorithms mapped. |
| Local lance-jsonb | Entry-point/layout declaration checked; local algorithms mapped only. No upstream implementation audit. |
| Java, geo, tokenizer, linalg, namespaces, CLI and other peripherals | Mapped only; open source before implementation decisions. |

All changed contract re-verification flags are closed. No permanent trust downgrades remain; mapped-only areas retain their previous limits. [Current behavior changes](L3-symbols/refresh-2026-10-12.md) · [Frozen coordinate addendum](refresh-addenda/2026-10-12-011953c2.md).

## Verification and retained milestones

Original M1–M4 completion and five VERIFY V2.1 gates remain recorded in [iteration 95](verification/milestone-final-095.json) and the [previous report](verification/refresh-011953c2/COMPLETION-REPORT.txt); their analysis was not redone. This refresh checks only affected navigation/contracts, 20 random updated claims, and one complete cross-link/range pass. [Verification log](verification-log.md).

Scoped checks: navigation 21 affected routes, four affected contract questions, 12 random accuracy claims PASS. Full integrity PASS: 372 Markdown documents, 17,689 links and 52,773 citation ranges, zero issues; all 177 frozen bodies and the catalog unchanged. No open refresh failures. Spilled lineage is unstable; prior stable wording corrected. Remaining trust boundaries unchanged.

## Declared exclusions

514 test/benchmark/fixture files; 4 generated/dependency artifacts; 9 mechanical binding/serialization helpers; 302 binaries/symlinks; 282 supporting files. Embedded tests, external dependency implementations and runtime/platform behavior are excluded. No source changes, builds, tests, lint, benchmarks or binary inspection occurred. Navigation/static source evidence is not runtime qualification.

Start at [L0](L0-orientation.md), choose a [task reading set](L4-crosscutting/navigation-index.md), read its contract, then open source. At most five files describes each named initial read set; composite implementation work uses separate subtasks.
