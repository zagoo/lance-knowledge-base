# Lance KB — Goal Amendment V2.1

Authority: the user's amendment following the iteration-86 status report. This replaces the source-replacement mission, exhaustive line/file coverage, L2/L3 expansion, ledger rules and Definition of Done wherever they conflict. The approximately 140-hour forecast is cancelled, not a new deadline.

## Purpose and standing boundaries

The KB is a **navigation and contract layer**. Consumers have source read access. They make design/modification decisions from contracts and reach implementation details through at most two navigation hops and approximately five ordered files per task. More files require an explicit subtask/read set, not an unbounded directory search.

Work stays offline, the Lance checkout stays read-only, and output stays in this KB directory. No source builds/tests/lint/benchmarks/generators, dependency installations or binary inspection/reconstruction. Tests, fixture setup, generated code, external dependency implementations and binaries remain excluded. Handwritten schemas and production compatibility contracts remain relevant.

Existing deep coverage of lance-core, lance-table, lance-file and root protos, plus existing encoding coverage, is retained without re-analysis. The 176 current-scope L2 bodies and 9,717-record symbol catalog are frozen through iteration 85. Snapshot notices are separate metadata; verified body text remains unchanged. Historical out-of-scope documents are archival evidence, not future obligations.

## Layer responsibilities

- L0: concise architecture, executable read/write/compact/index traces and full engine/API glossary.
- L1: contracts and Module Maps: directory responsibilities, key types/traits with paths, and Key Files with three-to-eight-line role descriptions. Avoid duplicating symbol catalogs.
- L2: frozen records plus new deep records only for explicitly selected Key Files. Ordinary files succeed through Module Maps.
- L3: complete synthesized format and public API/critical protocol contracts. Preserve the frozen catalog; new symbol descriptions are limited to those referenced by contracts/maps.
- L4: recipes/scenarios and ordered source/L2 read maps in navigation-index.md. Java/peripheral routes carry mapped-only trust.

## Single ledger

CORE-MANIFEST.json is the only maintained ledger. archive/pre-v21/MANIFEST.json is immutable history and must not be regenerated or used for current progress.

| Completed status | Required evidence |
|---|---|
| excluded | Specific reason: tests/generated material or standing exclusions such as binaries, external code and non-source context |
| key-file | Existing deep L2 document; frozen records identify their verified snapshot |
| mapped | Module Map path/anchor covering the file's role, with appropriate trust label |

A null status during migration means unclassified, not excluded/mapped. It prevents the 100% gate from passing; it is not an additional completed status. Never mark a path mapped merely because it is listed in the ledger. Hashes/ranges are identity/navigation metadata, not orders to reread every line. Done requires 100% classified and every non-excluded entry mapped or key-file.

The old 833-file deep-analysis denominator and 657-file transcription backlog are cancelled. Previously summary-only production utilities receive maps, not deep analysis.

## Milestones in order

**Step 0 — iteration 86 only:** mark/preserve frozen material; consolidate the ledger; archive historical/out-of-scope L1 material; sweep stale scope claims. Repair metadata/navigation without redoing verified contracts. Record one delta verification; never repeat migration each cycle.

**M1:** complete format-spec.md through synthesis of existing schema/file/table/encoding evidence. Complete L0 architecture, executable read/write/compact/index traces and glossary. Targeted source reads may establish missing top-level pointers; the cancelled per-file backlog does not resume.

**M2:** exactly five uncovered deep-contract subsystem guides with Module Maps: Dataset API (rust/lance); indexing (lance-index plus lance-index-core); lance-io; lance-datafusion; Python. Java gets a Module Map ONLY, explicitly mapped only. Previously summary-only peripherals may get maps only. Deep L2 is limited to selected Key Files.

**M3:** public API contracts in the deep-contract scope plus commit/transaction/conflict resolution, encoding selection, I/O scheduling, version gates, index build/update protocols. Create L4-crosscutting/navigation-index.md with ordered files/ranges for every recipe/scenario. Completed crates link directly to frozen L2. Java/peripherals keep mapped-only trust.

**M4:** final full VERIFY V2.1 and COMPLETION-REPORT.md with trust map/exclusions. All M1–M4 deliverables and all final gates must pass before completion.

## VERIFY V2.1

Each iteration: changed artifacts only; links, ledger consistency and at most ten changed/new claims. Do not resample old verified source claims or scan the full KB. Scope/relocation changes are verified against the amendment and snapshot records without reopening unchanged implementations.

At each milestone boundary and at the end:

1. Ledger at 100% classification, every non-excluded entry mapped/key-file with actual evidence.
2. Navigation: using only the KB, produce ordered files/ranges for the five original questions plus five realistic development tasks. Then open source to confirm pointers are correct/sufficient; fix and log failures.
3. Contracts: answer contract portions of the original questions from the KB alone. Unsupported answers or source-assisted guessing fail.
4. Accuracy: at least twenty randomly selected current KB claims against cited source; retain seed and fix/log mismatches.
5. Full cross-link integrity: only at milestone boundaries/end. Link/metadata checks do not authorize reading excluded binaries or re-analyzing tests.

Original questions: write then compact; add scalar index; exact v2 semantics/version gates; primary Python-to-Rust API mapping; transaction operation/conflict extension. Fix five additional realistic tasks before the first milestone navigation test and reuse them for comparability.

Milestone reports expose later-milestone gaps rather than inventing early passes. Only final acceptance can declare global success. Step 0's one-time scope sweep is not full semantic re-verification.

## Trust map and Definition of Done

- Deep-verified: frozen L2 contracts at the recorded snapshot, or newly verified Key Files.
- Contract-verified and mapped: synthesized contracts plus checked navigation, without exhaustive implementation transcription.
- Mapped only: Java and designated peripherals; source reading is required beyond documented boundaries.
- Excluded: explicit reason; no implementation completeness guarantee.

Success requires M1–M4 complete, final full verification passing, ledger at 100%, and a completion report with trust map/exclusions. Ordinary mapped files are successful coverage. Old full-line/source-replacement failures are historical, not current acceptance gates.
