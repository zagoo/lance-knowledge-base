> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# Scope clarification — 2026-10-04

The user's clarification in the current conversation overrides the original objective wherever they differ.

The deliverable remains a self-contained knowledge base for secondary development without original source access. Analysis is limited to Lance's own direct source code in the repository, including its owned implementation, bindings, tests and protocol definitions. External dependency implementations, third-party library internals, and all binary files are excluded. Do not inspect, reconstruct, decompile or reverse-engineer binaries in further ANALYZE or VERIFY cycles. Document dependency interactions only as expressed by Lance's own source. Supporting repository text may provide context; it does not expand the task into external dependency analysis.

The existing inventory and verification history predate this clarification. Binary fixtures must no longer contribute to the completion denominator or block acceptance. Historical evidence is retained as history, not as a requirement to repeat binary verification. Reconcile the inventory and verification tooling to these exclusions before the next verification cycle; inspect any ambiguous third-party ownership from repository text only.

At this clarification, completed source-classified coverage is 177 / 1,135 files and 121,796 / 904,015 lines (15.59% of files; 13.47% of lines). Including repository test and proto classifications yields 194 / 1,403 files and 126,437 / 1,039,806 lines (12.16% of lines). These are estimates based on existing classifications, prior to a detailed ownership/exclusion reconciliation. Reading in the unfinished cycle 86 is not counted as completed analysis.

Earlier work interpreted six checked-in .lance data fixtures totaling 2,141,482 bytes. These were serialized test data, not compiled executable/library decompilation. That work is outside the clarified future scope. No external dependency source analysis is part of the ongoing task.

Core Lance analysis remains incomplete, and the five complete KB-only acceptance answers have not passed. The clarification does not waive source analysis or self-sufficiency requirements.

Superseded later on 2026-10-04 by [CORE-SCOPE.md](CORE-SCOPE.md): tests and benchmarks are now excluded too; only core production and primary APIs require exhaustive coverage.
