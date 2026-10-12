# M3 contract test — KB-only answers

Prepared from the current KB before navigation source confirmation. No source was opened to fill these answers. Detailed declarations remain linked so this acceptance record does not become another maintained contract layer. All five questions are interpreted under V2.1: design decisions from contracts; exact implementation through source navigation.

## Q1 — Dataset write, then compact

Dataset::write converts input into a stream/schema, configures InsertBuilder and writes fragments before publishing a manifest. Create/overwrite creates Overwrite intent; append creates Append intent with the destination read version (zero for a new table). execute_uncommitted stops with staged data/intent. CommitBuilder dispatches new, existing or detached publication; detached creation is rejected. A successful commit returns a snapshot Dataset and updates relevant caches. Data-file existence alone establishes no visible version.

Compaction plans candidate fragment groups, validates exact output version and chooses binary-copy or scan/re-encode; forced copy cannot silently fall back. No tasks means no new version. Distributed results retain their read versions; commit uses the minimum, reserves physical fragment IDs where required, and chooses eager index remapping or deferred lineage. Tagged lineage forbids eager remapping. Rewrite publication uses normal conflict/rebase handling. New files do not authorize immediate deletion of old files: older manifests can reference them. Stable IDs and physical addresses are distinct; deletion/lineage reconciliation prevents stale rewrite results from resurrecting rows.

Returned storage errors may follow successful publication. Durable protobuf transaction identity distinguishes Ours/Foreign/Absent/Unknown; Unknown must retain evidence. An operation conflict is not merely a manifest-name collision and can require recomputation.

Evidence: [write/compact traces](../L0-orientation.md), [publication and recovery](../L3-symbols/protocol-commit.md), [format](../L3-symbols/format-spec.md). PASS.

## Q2 — Add a scalar index

Choose a new implementation module under rust/lance-index/src/scalar, expose it from scalar.rs, implement the ScalarIndex interface plus plugin/trainer interfaces from lance-index-core/src/scalar.rs and lance-index/src/scalar/registry.rs, and register its exact type/aliases in lance-index/src/registry.rs. Add compatible details to protos/index.proto when required; preserve historical package/type identities in index_old.proto. The module name is an implementation choice, not an existing pointer the KB can invent.

The plugin declares supported version, query exactness, optional parser, load/cache behavior, segment compatibility, remapping and seed support. The generic training route requires BasicTrainer; its training request governs order and row identity, and CreatedIndex returns details/version/files without committing. Dataset index/scalar.rs provides stream/store orchestration; index/create.rs persists metadata and publishes CreateIndex. For Python, generic SCALAR config already forwards plugin identity and serialized parameters; a new built-in discriminator is not automatically required.

SearchResult Exact is exact, AtMost a superset requiring residual filtering, AtLeast a subset with consequences for negation. Stable IDs must not be interpreted as physical addresses. Advertised remapping requires the matching loader; the default rejects a supplied remapper. Segment compatibility defaults to acceptance, so model-sensitive implementations must override it. Seed construction does no I/O; None from seed update requests full-scan fallback. Store version, index implementation version and dataset version differ. Name reservation includes unsupported stored entries. Publication and updates must preserve exact fragment coverage and concurrent rewrite/changed-value invalidation. New algorithm implementation, persistence/registration and Dataset/API integration are separate bounded read sets.

Evidence: [index extension and lifecycle](../L3-symbols/protocol-index.md), [API mapping](../L3-symbols/public-api.md), [details schema](../L2-files/protos/index.proto.md). PASS.

## Q3 — Exact V2 semantics and gates

V2_0 has canonical manifest string 2.0, ordinary footer (0,3), embedded footer (2,0), and the older array/column grammar. V2_1 uses (2,1), dense-u16 mini-block layout and all-null constant pages; inline scalar constants, compressed constant levels and sparse pages are not admitted. V2_2 uses (2,2), is the stable/default selection, and adds gated u32 large mini-block layout, scalar constants and compressed levels; sparse remains rejected. V2_3 uses (2,3), is next/unstable and admits its newer recursive/sparse grammar. A protobuf union arm alone is never version admission.

The V2 footer is 40 bytes with three u64 offsets, two u32 counts, two u16 version numbers and LANC magic, all numeric fields little-endian. Offset tables contain raw u64 position/size pairs. Embedded representation can require an external schema. Exact reader/writer composition controls grammar and alignment; corruption validation is not universally exhaustive. Public aliases lowercase without trimming; canonical persisted parsing is stricter. Dataset versions, exact file versions, row lineage versions and index versions are separate domains. Table reader/writer capability words are separate from exact file grammar; mixed-version and tagged-FRI flags are paired/sticky. Unsupported reader or writer capability bits block the relevant operation.

Stable contracts require backward and forward compatibility. Frozen legacy production read behavior remains supported; new features belong in current writers. Earlier unstable revisions are not compatibility constraints. Individual message fields/tags/oneofs/reserved ranges are defined by the thirteen frozen schema records incorporated into the format directory.

Evidence: [format contract and complete field directory](../L3-symbols/format-spec.md), [encoding/version selection](../L3-symbols/protocol-encoding.md). PASS.

## Q4 — Python APIs and Rust mapping

The explicit root __all__ contains 52 names, listed exactly in the [Python declaration directory](../L3-symbols/api-reference/python.md#explicit-root-exports). Families cover dataset open/write, Dataset/Scanner/Fragment, operations/transactions/merge insert, blobs, cleanup/statistics/index metadata, IO/counters/logging/SIMD/tokenization/schema helpers, DataFusion execution and MemWAL/LSM/sharding. The directory also gives local class/method signatures outside the root list; inherited Arrow/Pandas implementation is excluded.

The ordinary route is python/python/lance facade → python/src PyO3 binding → Rust Dataset/Scanner/builders. Open/as-of uses __init__.py and native Dataset construction; as-of means strictly before cutoff when an explicit version is absent. Scans use dataset.py → native dataset.rs/scanner.rs/reader.rs → Rust scanner.rs. to_table collects, to_batches iterates; the native reader has bounded producer delivery and cancellation/error semantics. Write uses write_dataset → _write_dataset → Dataset::write. Delete/update route to Rust builders and return count dictionaries; successful native mutation replaces the internal snapshot. Index creation routes to CreateIndexBuilder; supplied fragment_ids use uncommitted execution. Compaction exposes plan/task/commit, including partial result commits; optimize-index delegates DatasetIndexExt. Rust/core logic owns validation; names remain consistent across languages and existing signatures require deprecation before replacement.

No guess is needed about an individual local declaration: the directory supplies its exact signature/source range and family route. This does not certify every wrapper body or external inherited API. Java remains mapped only.

Evidence: [public family contracts and ordered mapping table](../L3-symbols/public-api.md), [Python Module Map](../L1-modules/python.md). PASS.

## Q5 — New transaction operation and conflicts

Definition/application changes start in lance-table transaction/operation.rs, proto.rs, validate.rs, manifest_build.rs and protos/transaction.proto; select the separate index-maintenance subtask for an index-affecting payload. Preserve persistent tags and distinguish intent from attempt-local prepared state. Orchestration uses Dataset CommitBuilder, io/commit.rs and io/commit/conflict_resolver.rs. Add the directional dispatch and finish handling, and decide both our-new-operation-versus-existing and existing-versus-new-operation behavior; a one-sided matcher is insufficient.

Existing publication keeps original read intent, catches up sorted intervening transactions, checks writer capabilities, runs resolver checks/finish, then rebuilds current-attempt index state and candidate manifest. Retry attempts number max(num_retries,1). Strict Overwrite with zero retries avoids automatic rebase. Publication collision retry differs from resolver retryable conflict (recompute operation) and incompatible conflict (reject stale intent). Global guards include nullability changes versus value suppliers, and effective metadata updates versus Merge/Restore. The canonical directional matrix covers all sixteen operations; examples: Append versus Overwrite/Restore/MemWal is incompatible, overlapping rewrites are retryable except tagged double-consumption is incompatible, and a partial index/rewrite coverage overlap can require fallback or retry. Comment wording does not override the documented actual tagged error branch.

Delete/update reconciliation requires affected-row evidence and same data-file identity; current deletions intersecting our affected rows force retry, otherwise union deletion metadata and advance read version. Tagged rewrite proposals belong to their original read version; diff original intent, then assemble against current state per attempt. Never replace original intent with prepared output. Recovery compares durable protobuf transactions; Unknown is not definitive absence and forbids destructive cleanup. A confirmed commit can still propagate a handler-requested error.

Evidence: [complete commit contract and directional matrix](../L3-symbols/protocol-commit.md), [frozen table operation records](../L1-modules/rust-lance-table.md). PASS.
