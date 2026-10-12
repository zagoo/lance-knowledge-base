# Lance navigation and contract knowledge base

**V2.1 complete; source refresh verified on 2026-10-04.** [Completion report and trust map](COMPLETION-REPORT.md). This KB documents design/behavior contracts and directs a coding agent to exact implementation files and ranges. Consumers have source read access. Ordinary Module Map coverage is successful; exhaustive source replacement is no longer the goal.

[Current protocol and Definition of Done](V21-PROTOCOL.md) · [Single ledger](CORE-MANIFEST.json) · [Iteration state](iteration-state.json) · [Verification log](verification-log.md)

Source target: `ad12ed9e15e0046688b00568d0ac1a347fb2d328` (scoped refresh verification passed). Frozen bodies remain pinned to `c3c8d6fb505fb437b2b673c5195e1d4b74436b2f`; the dated addendum translates affected references. Deep coverage of lance-core, lance-table, lance-file and root protos, plus partial lance-encoding coverage, is retained. The 176 current-scope L2 bodies and 9,717 symbol records are **frozen snapshot — verified through iteration 85**. [Freeze integrity record](verification/frozen-snapshot-085.json).

## Navigation

- [L0 architecture, paths and glossary](L0-orientation.md): architecture, four checked entry paths and linked glossary.
- L1 production contracts: [core](L1-modules/rust-lance-core.md), [table](L1-modules/rust-lance-table.md), [file](L1-modules/rust-lance-file.md), [encoding](L1-modules/rust-lance-encoding.md), [root schemas](L1-modules/protos.md). Module Maps: [Dataset](L1-modules/rust-lance.md), [index and index-core](L1-modules/rust-lance-index.md), [I/O](L1-modules/rust-lance-io.md), [DataFusion](L1-modules/rust-lance-datafusion.md), [Python](L1-modules/python.md). [Java](L1-modules/java.md) and [peripherals](L1-modules/peripheral-maps.md) are mapped only.
- L2: retained records under `L2-files/`; new deep docs only for selected Key Files. The ledger links each existing Key File record.
- L3: [format contract](L3-symbols/format-spec.md), [behavior contracts](L3-symbols/behavior-contracts.md), [frozen symbol index](L3-symbols/symbol-index.md).
- L4: [scenarios](L4-crosscutting/scenarios.md), [cookbook](L4-crosscutting/cookbook.md), [build context](L4-crosscutting/build-and-test.md), [pitfalls](L4-crosscutting/pitfalls.md). The ordered task index below supplies implementation reading routes.

## Trust and verification

Deep-verified records are snapshot-specific contracts, not whole-system completeness claims. Maps identify roles, key types and reading order. Mapped-only Java/peripheral areas require source reading before implementation decisions. Tests, generated plumbing, binaries and external dependency implementations are excluded.

Iteration checks are delta-only: changed links, ledger consistency and at most ten claims. Full navigation/contract/accuracy/link checks run at milestone boundaries and the end. Historical verification through iteration 85 checked 39,420 citations and 15,311 links with zero broken references and zero unresolved sampled mismatches; that evidence is retained rather than replayed every cycle.

Historical L1 material is in the [archive](L1-modules/archive/README.md). The [old MANIFEST](archive/pre-v21/MANIFEST.json) is archived and not maintained. Previous line-count percentages, transcription backlog and approximately 140-hour forecast are superseded. M1–M4 and final V2.1 acceptance passed; see the completion report for the trust map and evidence.


## Current contract routes

[Public APIs and bindings](L3-symbols/public-api.md) · [Commit/conflicts](L3-symbols/protocol-commit.md) · [Encoding/version gates](L3-symbols/protocol-encoding.md) · [I/O scheduling](L3-symbols/protocol-io.md) · [Index lifecycle](L3-symbols/protocol-index.md).

[Ordered task navigation](L4-crosscutting/navigation-index.md) links every current cookbook/scenario to its reading order; archived historical evidence is labeled separately.

Frozen text is immutable; consult [current clarifications](FROZEN-ERRATA.md) before relying on historical wording.

[Source refresh report](REFRESH-REPORT.md) · [Frozen refresh addendum](refresh-addenda/2026-10-04-ad12ed9e.md).
