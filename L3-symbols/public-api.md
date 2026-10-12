# Public API contracts and cross-language routes

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers and contracts checked in this refresh.

**V2.1 scope:** contracts for the engine's public families, exact declaration/argument navigation for all direct-source public entries in the five newly mapped subsystems, and retained deep API records for completed crates. The consumer has source access. A declared documentation contract is labeled separately from a behavior checked against implementation. Java and designated peripherals remain mapped only. [Architecture](../L0-orientation.md) · [Python map](../L1-modules/python.md) · [Dataset map](../L1-modules/rust-lance.md).

## Complete declaration routes without a second symbol ledger

| Surface | Contract/signature directory | Decision contract |
|---|---|---|
| Dataset and engine builders/execution extensions | [Rust lance declarations](api-reference/lance.md) | Snapshot/read/write rules below; [commit](protocol-commit.md), [index lifecycle](protocol-index.md) |
| Scalar/vector/FTS index implementations and plugin seams | [lance-index](api-reference/lance-index.md), [lance-index-core](api-reference/lance-index-core.md) | [Plugin, certainty, training, update and query contracts](protocol-index.md) |
| Reader/Writer/ObjectStore/scheduling interfaces | [lance-io](api-reference/lance-io.md) | [I/O ownership and admission](protocol-io.md) |
| Planner, execution, serialization and expression interfaces | [lance-datafusion](api-reference/lance-datafusion.md) | Query plan and integration rules below |
| Python root/package classes, functions, methods, constructors | [Python declarations and root exports](api-reference/python.md) | Facade/native/engine mapping below |
| Core types, schema, errors, memory/cache/identity | [Completed core API catalog](../L1-modules/rust-lance-core.md) | [Frozen production behaviors](behavior-contracts.md), linked L2 records |
| Manifest, operations, commit handlers, row IDs | [Completed table API catalog](../L1-modules/rust-lance-table.md) | [Format](format-spec.md), [transaction orchestration](protocol-commit.md) |
| File readers/writers, exact versions | [Completed file API catalog](../L1-modules/rust-lance-file.md) | [Format gates](format-spec.md) |
| Encoding strategies/codecs/structural types | [Encoding catalog](../L1-modules/rust-lance-encoding.md), [residual map](../L1-modules/peripheral-maps.md) | [Encoding selection](protocol-encoding.md), retained checked ranges |
| Protobuf messages and fields | [Complete schema directory](format-spec.md#complete-field-directory) | Declared wire/persistence contract plus exact runtime gates |
| Java | [Java Module Map](../L1-modules/java.md) | Mapped only; no deep JNI/ABI guarantee |
| Namespaces, numerical/tokenizer/geo helpers, tools and other peripherals | [Peripheral maps](../L1-modules/peripheral-maps.md) | Mapped only; source required for implementation beyond the stated interface |

The six new declaration directories are **navigation artifacts referenced by these contracts**, not additions to frozen `symbols.json`. They retain source-authored first-paragraph documentation and source ranges. Rust `pub` under private/cfg modules is a declaration locator, not a compiler-certified external export; trait members/enum variants are reached through their owner. Python inventories local definitions, not inherited Arrow/Pandas APIs. Undocumented entries explicitly lack a standalone documentation summary; use the family's rules and exact source range instead of inventing behavior. No excluded tests/generated code or dependency implementation was used.

## Dataset ownership, version and mutation

A Dataset represents a checked-out manifest snapshot. `Dataset::open(uri)` loads through DatasetBuilder. Numeric checkout stays on the current branch; a named tag resolves its recorded branch/version. Checkout returns a new Dataset, while `checkout_latest(&mut self)` replaces manifest and derived fragment bitmap; it clears base-store caches if base paths changed. `main` is the default-branch alias in reference contexts. (rust/lance/src/dataset.rs:521-589)

Restore creates a **new** transaction based on the latest version, pointing at the currently checked-out historical version. It is not an in-place rewrite of that historical manifest. Detached commits do not become latest and do not join ordinary history; the builder also enforces existing-dataset/v2-manifest-path requirements. Public commit entry points accept operation/read version/store/handler/session parameters and delegate to the common path. (rust/lance/src/dataset.rs:1460-1475; rust/lance/src/dataset.rs:1621-1670; rust/lance/src/dataset/write/commit.rs:469-524)

Mutation methods have distinct handle effects: Rust builders commonly return a new Dataset/result; `&mut Dataset` convenience methods replace their state after success. Python native delete/update/restore/compaction/index methods replace the internal Arc after successful execution; an existing independently checked-out handle remains its own snapshot. Do not describe every Python method as returning a new Dataset: delete/update return count dictionaries, create_index returns the facade, and uncommitted index creation does not update the snapshot. (python/src/dataset.rs:2020-2112; python/src/dataset.rs:2283-2297; python/src/dataset.rs:2876-2893; python/src/dataset/optimize.rs:509-523; python/python/lance/dataset.py:4609-4640)

Storage mutation is not atomic merely because the public function returns Result: data files can exist before commit, and a storage error can follow successful publication. Use the [commit outcome contract](protocol-commit.md#errors-retries-and-ambiguous-success) before retrying or cleaning files. Cleanup of old versions is separately destructive: removed versions cannot be checked out/restored and their unique data can be lost. The explanation path computes a cleanup plan without deleting files. (rust/lance/src/dataset.rs:1478-1484; python/src/dataset.rs:2300-2347)

## Dataset open reference resolution

When a named branch is requested through an unmanaged store, DatasetBuilder marks checkout as delayed. Numeric-only version references remain relative to the URI chain. (rust/lance/src/dataset/builder.rs:734-744)

For delayed checkout, the initial load_by_uri now receives None and loads the URI chain's latest version; it must not require the target branch's requested version number to exist on that initial chain. Non-delayed loading still passes the requested version number. This is a source-verified behavior change in the refresh. (rust/lance/src/dataset/builder.rs:807-828)

After that initial load, delayed tag lookup resolves its branch/version on the loaded Dataset, and differing branch/version triggers checkout_version. The new initial-load rule preserves this later checkout stage rather than changing file-format gates or transaction conflict rules. (rust/lance/src/dataset/builder.rs:844-866)

[Ordered reference-open route](../L4-crosscutting/navigation-index.md#dataset-open) · [Java mapped interface notes](../L1-modules/java.md#refresh-reference-based-opening-and-value-identity--mapped-only). Python declarations themselves did not change; its open/version family uses the shared DatasetBuilder boundary.

## Read/query contracts

Rust `Dataset::scan()` creates a Scanner. `try_into_stream` builds a physical plan and executes it; collecting batches is a separate operation. Plan order is source → filter → sort → limit/offset → late take/projection as required. Source selection and index use depend on search and prefilter options. Invalid combinations fail validation, and requesting projected constants alone is not automatically a supported row-count source. (rust/lance/src/dataset.rs:1688-1705; rust/lance/src/dataset/scanner.rs:2999-3042; rust/lance/src/dataset/scanner.rs:3633-3801)

`take` selects logical row positions; `take_rows` selects internal row IDs. IDs and encoded physical addresses are separate when stable IDs are enabled. Unfiltered count sums fragment counts; a filtered count uses a scanner with empty user projection plus row ID. Python's Arrow-expression count uses its scanner directly, whereas string/None count goes through the native Dataset count method. (rust/lance/src/dataset.rs:1706-1779; python/python/lance/dataset.py:2618-2624; python/src/dataset.rs:1670-1699)

Python scanner defaults are applied before explicit non-None options. The final builder forwards options to the native scanner. Projection by names and projection by SQL transforms are mutually exclusive; string and Substrait filters are also mutually exclusive at the binding. Row-ID/address flags are separate; row-address prefilter bytes use the shared RowAddrMask decoder. FTS phrases cannot target multiple columns in the native dict-query route. (python/python/lance/dataset.py:1498-1567; python/python/lance/dataset.py:7403-7440; python/src/dataset.rs:1244-1449)

`LanceScanner.to_table` materializes the entire reader; `to_batches` iterates it. The native LanceReader owns a background stream producer, cancellation channel and bounded output channel. It terminates on first stream error/end or caller/channel cancellation; an unexpectedly closed producer channel becomes an error rather than silent EOF. Retaining all yielded batches can consume unbounded caller memory even though the channel is bounded. (python/python/lance/dataset.py:7454-7464; python/src/reader.rs:48-123)

DataFusion integration parses/qualifies identifiers according to planner options: exact field-name matching precedes ASCII case-insensitive matching; relation qualification is disabled by default and otherwise dots can represent nested access. The Dataset TableProvider translates projection/filter/limit into Scanner and declares Exact filter pushdown. Multiple output partitions are merged preserving known ordering, otherwise coalesced; a single partition executes directly. Preserve declared pushdown exactness when adding expressions. (rust/lance-datafusion/src/planner.rs:280-350; rust/lance/src/datafusion/dataframe.rs:132-197; rust/lance-datafusion/src/exec.rs:721-761)

## Write, update and index contracts

`Dataset::write` accepts an iterator/stream conversion and InsertBuilder writes fragments before CommitBuilder publishes an Overwrite or Append operation. `execute_uncommitted` returns staged intent/data, not a visible new version. Python `write_dataset` validates/converts its input and destination, then native `_write_dataset` converts a native Scanner or Arrow stream and calls Rust Dataset::write. The binding recognizes case-insensitive create/append/overwrite and rejects other modes. (rust/lance/src/dataset.rs:951-980; rust/lance/src/dataset/write/insert.rs:108-183; rust/lance/src/dataset/write/insert.rs:219-320; python/python/lance/dataset.py:8405-8432; python/src/dataset.rs:4920-4959)

Python delete/update accept SQL or serialize Arrow expressions as Substrait. The native layer rejects predicates of other types, configures retry parameters, and delegates to DeleteBuilder/UpdateBuilder. Update assignments are strings parsed by the Rust builder; input/build errors map to ValueError and operation execution errors to IOError in this route. Returned keys are `num_deleted_rows` and `num_rows_updated`. The [conflict protocol](protocol-commit.md) determines whether operation recomputation is required. (python/python/lance/dataset.py:2940-2945; python/python/lance/dataset.py:3149-3160; python/src/dataset.rs:2020-2112)

Python native index creation uppercases a supported high-level type discriminator. Generic `SCALAR` requires a config carrying its plugin type and serialized parameters, so custom plugin names need not be added as new built-in discriminators. Named FTS parameters are checked against an allowlist. Missing replace/train flags default true here. If fragment_ids are present, native creation uses execute_uncommitted and does not update the Dataset; ordinary creation publishes then replaces the handle. The Python scalar facade explicitly directs distributed forms that require it to create_index_uncommitted. (python/src/dataset.rs:2625-2828; python/src/dataset.rs:2843-2893; python/python/lance/dataset.py:3926-3953)

Compaction has plan → execute tasks → commit phases for distributed use; the convenience execute path performs the whole operation and updates the Python handle. Commit may use a subset of completed task results. Preserve original read versions and deletion/rewrite reconciliation; [L0 compaction](../L0-orientation.md) and [commit lineage](protocol-commit.md#index-coverage-and-rewrite-lineage) explain why the driver must not substitute its newer snapshot for task intent. OptimizeIndices similarly delegates options to DatasetIndexExt and updates the native snapshot after success. (python/src/dataset/optimize.rs:479-523; python/src/dataset/optimize.rs:559-606; python/src/dataset.rs:2596-2622; rust/lance/src/dataset/optimize.rs:3227-3337)

## Python-to-Rust ordered read maps

Each row is an ordered set, normally three to five unique files. The declaration directory contains every local public method and its exact range, including ancillary families. For a concrete method start there, then follow its family route; do not open the entire package.

| Family / public entry | Facade → native binding → engine / canonical rule |
|---|---|
| Open, as-of, versions, checkout | `python/python/lance/__init__.py:137-344` → `python/python/lance/dataset.py:859-947,3284-3318` → `python/src/dataset.rs:942-1082,2283-2288` → `rust/lance/src/dataset.rs:521-589,1460-1475`; as-of selection uses timestamps strictly **before** cutoff when explicit version is absent |
| scanner, to_table, to_batches | `python/python/lance/dataset.py:1498-1567,7403-7464` → `python/src/dataset.rs:1244-1449` → `python/src/scanner.rs:34-49` → `python/src/reader.rs:48-123` → `rust/lance/src/dataset/scanner.rs:2999-3042,3633-3801` |
| take/count | `python/python/lance/dataset.py:2306-2312,2618-2624` → `python/src/dataset.rs:1670-1699` → `rust/lance/src/dataset.rs:1706-1779`; projection transform and name-list choices stay mutually exclusive |
| write_dataset / insert | `python/python/lance/dataset.py:8093-8432` → `python/src/dataset.rs:4920-4959` → `rust/lance/src/dataset.rs:951-980` → `rust/lance/src/dataset/write/insert.rs:108-183,219-320` → [commit protocol](protocol-commit.md) |
| delete/update | `python/python/lance/dataset.py:2940-2945,3149-3160` → `python/src/dataset.rs:2020-2112` → `rust/lance/src/dataset/write/delete.rs` or `rust/lance/src/dataset/write/update.rs` via the [declaration directory](api-reference/lance.md) → [conflict contract](protocol-commit.md) |
| create scalar/vector index | `python/python/lance/dataset.py:3926-3953,4609-4640` → `python/src/dataset.rs:2625-2893` → `rust/lance/src/index/create.rs:176-251,667-743` → selected scalar/vector build set in [index protocol](protocol-index.md) |
| compact_files / distributed Compaction | `python/python/lance/dataset.py:7645-7811` → `python/src/dataset/optimize.rs:479-608` → `rust/lance/src/dataset/optimize.rs:1028-1152,3227-3337,3662-3693` |
| optimize_indices | `python/python/lance/dataset.py:7813-7844` → `python/src/dataset.rs:2596-2622` → `rust/lance/src/index.rs:3233-3404` → scalar/vector branch in `rust/lance/src/index/append.rs:530-766,1052-1437` |
| cleanup/explain | `python/python/lance/dataset.py:3387-3520` → `python/src/dataset.rs:2300-2347` → Dataset cleanup API and cleanup/policy entries in [Rust directory](api-reference/lance.md); explain and execute have distinct side effects |
| commit/commit_batch/LanceOperation/Transaction | `python/python/lance/dataset.py:4929-5248,6102-6108,6217-6814` → `python/src/dataset.rs:3100-3331` → CommitBuilder and [frozen operation/codec/application](../L1-modules/rust-lance-table.md) → [commit protocol](protocol-commit.md) |

Other direct-source public families are explicitly reachable through the [Python directory](api-reference/python.md) and [Python Module Map](../L1-modules/python.md): fragment/schema evolution and UDFs; blob descriptors/read/write/sidecars; low-level file Reader/Writer/Session; SQL and DatasetDelta; tags/branches/base paths/storage options; query objects and index configs; statistics/progress/tracing; MemWal sharding/writers/scanners/planners; Torch/TF/Ray integrations and namespace adapters. Their declared interfaces and ownership file are recorded; runtime semantics outside checked contract ranges retain mapped trust. The root export list and native registration lists are separate: imported Session and module-level native classes need not all appear in `__all__`. (python/python/lance/__init__.py:10-134; python/src/lib.rs:255-330)

## Change discipline

Preserve public signatures; deprecate/add rather than silently breaking callers. Keep validation/business logic in Rust and parameter names consistent across Rust/Python/Java. An API extension normally changes the Python declaration/argument forwarding, PyO3 signature/conversion, Rust builder/validation and documentation together. Mutually exclusive modes should use a mode/enum rather than new boolean combinations. (AGENTS.md:52-57; python/AGENTS.md:33-36)

For a new scanner option, the first five files are `python/python/lance/dataset.py:1225-1567,7403-7440`, `python/src/dataset.rs:1244-1449`, `rust/lance/src/dataset/scanner.rs:3633-3801` plus its setter in [Rust declarations](api-reference/lance.md), `rust/lance-datafusion/src/planner.rs:280-350` only for expression semantics, and the selected execution node from the [Dataset map](../L1-modules/rust-lance.md). Changes to Java follow its mapped-only JNI route as a separate subtask. No external Arrow/Pandas/PyO3 implementation is part of this KB.

## Refresh: selected API deltas

The [query/API delta](refresh-2026-10-07.md#query-and-public-api-changes) adds public schema projection and Python deprecation/fragment-write clarifications. [Index extension changes](refresh-2026-10-07.md#scalarvector-extension-changes) and [remapping contracts](refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency) define the added plugin version parameter and remapping surfaces. No frozen symbol catalog expansion is required.

## Refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Current contract amendments](refresh-2026-10-09.md) cover indexed counting and public apis. The JSON target-type declaration is ahead of the constructors at this pin: current constructors still emit Unspecified. Do not infer implemented preservation from the proto comments.

## Current delta — 2026-10-11

[Current refresh contracts](refresh-2026-10-11.md) supersede changed field-ID/transaction, unstable encoding, cache, API, MemWAL and index-coverage statements at the new pin. Follow the task index for bounded source reading.
