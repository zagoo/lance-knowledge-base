# Ordered development navigation

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

Use one task/read set at a time. Each set contains at most five unique source files, ordered from contract/definition toward mechanism. A broad change spanning multiple mechanisms is split into named subtasks. These are implementation reading routes, not guarantees that a future patch touches only these files. Source ranges refer to the pinned ledger snapshot. Completed crates link directly to frozen L2; ordinary files remain mapped.

[Public APIs](../L3-symbols/public-api.md) · [Format](../L3-symbols/format-spec.md) · [Cookbook](cookbook.md) · [Scenarios](scenarios.md) · [Trust/scope](../V21-PROTOCOL.md)

## Primary task routes

The explicit engine/API routes above the retained local mechanisms are supplied in the task table below. Read a route's canonical contract before opening its listed files.

<a id="read"></a>
### Read and execute a query

[Contract and executable trace](../L0-orientation.md#read-path). Read in this order:

1. `rust/lance/src/dataset.rs:1688-1705` — construct snapshot Scanner.
2. `rust/lance/src/dataset/scanner.rs:2999-3042,3633-3801` — validate, choose source, build/execute plan.
3. `rust/lance-datafusion/src/exec.rs:721-761` — partition/order handling.
4. [Frozen reader](../L2-files/rust/lance-file/src/reader.rs.md) → `rust/lance-file/src/reader.rs:732-1020` — persisted metadata to prepared file reads.

<a id="write"></a>
### Create or append a dataset

[Write contract](../L0-orientation.md#write-path) and [ambiguous outcomes](../L3-symbols/protocol-commit.md#errors-retries-and-ambiguous-success).

1. `rust/lance/src/dataset.rs:951-980` — public entry.
2. `rust/lance/src/dataset/write/insert.rs:108-320` — write/stage versus commit, operation intent.
3. `rust/lance/src/dataset/write.rs:1734-1816` — fragment-writer handoff.
4. `rust/lance/src/dataset/write/commit.rs:310-582` — new/existing/detached dispatch and returned snapshot.
5. `rust/lance/src/io/commit.rs:1691-2087` — existing-table publication and recovery. For a low-level byte change choose the separate format/encoding route.

<a id="compact"></a>
### Compact files after writing

[Compaction trace](../L0-orientation.md#compaction-path) and [lineage contract](../L3-symbols/protocol-commit.md#index-coverage-and-rewrite-lineage).

1. `rust/lance/src/dataset/optimize.rs:1028-1152,2494-2569,3227-3337,3662-3693` — plan, select copy/re-encode, reserve/commit Rewrite.
2. `rust/lance/src/io/commit.rs:1691-1950` — rebase and fresh candidate assembly.
3. `rust/lance/src/io/commit/conflict_resolver.rs:1546-1813,2973-3229` — directional rewrite checks and original-versus-current lineage.
4. [Frozen operation application](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → `rust/lance-table/src/transaction/manifest_build.rs:1059-1144` — fragment liveness/application contract.

<a id="index"></a>
### Build or update an index

[Index lifecycle contract](../L3-symbols/protocol-index.md). First choose one subtask:

**Build:** `rust/lance/src/index/create.rs:176-251,667-743` → `rust/lance/src/index/scalar.rs:349-453` for scalar, **or** `rust/lance/src/index/vector.rs:1199-1325` → `rust/lance/src/index/vector/builder.rs:553-594,729-830` for IVF-PQ. Maximum three files after choosing the branch.

**Update:** `rust/lance/src/index.rs:3233-3404` → `rust/lance/src/index/append.rs:530-766,1052-1437` → `rust/lance-index-core/src/scalar.rs:531-564,628-762` for scalar filtering → `rust/lance/src/io/commit/conflict_resolver.rs:1071-1813` for concurrent coverage changes.

<a id="new-index"></a>
### Add a scalar index plugin

[Complete extension contract and separate persistence subtask](../L3-symbols/protocol-index.md#adding-a-scalar-index-bounded-subtasks).

1. `rust/lance-index-core/src/scalar.rs:398-762` — result certainty, identity, training/update/filter obligations.
2. `rust/lance-index/src/scalar/registry.rs:29-367` — plugin/trainer/parser/remapping/cache/seed interfaces.
3. `rust/lance-index/src/registry.rs:26-177` — exact type identity and built-in registration.
4. `rust/lance-index/src/scalar.rs:38-56` — implementation module exposure.
5. [Frozen index schema](../L2-files/protos/index.proto.md) — new details and stable tag/package contract. Choose the new implementation's path only after this contract set; do not modify every existing algorithm.

<a id="new-encoding"></a>
### Add an encoding or change structural selection

[Encoding selection contract](../L3-symbols/protocol-encoding.md). Choose the structural task here or its separate compression-policy set in that contract.

1. [Frozen structural builders](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → `rust/lance-encoding/src/encoder/structural.rs:24-288`.
2. `rust/lance-encoding/src/encodings/logical/primitive.rs:5410-5480,7690-7928` — ordered behaviors and explicit/automatic layout paths.
3. [Frozen V2_3 composition](../L2-files/rust/lance-file/src/versions/v2_3/mod.rs.md) → `rust/lance-file/src/versions/v2_3/mod.rs:103-139`.
4. [Frozen exact V2_3 reader](../L2-files/rust/lance-file/src/versions/v2_3/reader.rs.md) → `rust/lance-file/src/versions/v2_3/reader.rs:149-265` — matching grammar admission.
5. [Frozen structural schema](../L2-files/protos/encodings_v2_1.proto.md) — descriptor tags and framing. Stable V2_1/V2_2 are not automatically opted into a new mechanism.

<a id="new-operation"></a>
### Add a transaction operation

[Directional conflict and publication contract](../L3-symbols/protocol-commit.md). Two distinct subtasks:

**Definition/application:** `rust/lance-table/src/transaction/operation.rs:37-262` → `rust/lance-table/src/transaction/proto.rs:83-424,490-731` → `rust/lance-table/src/transaction/validate.rs:377-698` → `rust/lance-table/src/transaction/manifest_build.rs:598-779` → `protos/transaction.proto:410-434`. Retained records: [operation](../L2-files/rust/lance-table/src/transaction/operation.rs.md) → [protobuf conversion](../L2-files/rust/lance-table/src/transaction/proto.rs.md) → [validation](../L2-files/rust/lance-table/src/transaction/validate.rs.md) → [manifest application](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → [transaction schema](../L2-files/protos/transaction.proto.md). Each record supplies exact ranges. Index-affecting payloads additionally select the separate retained “Modify index coverage during a transaction” recipe below before implementation.

**Orchestration:** `rust/lance/src/dataset/write/commit.rs:310-582` → `rust/lance/src/io/commit.rs:1548-2087` → `rust/lance/src/io/commit/conflict_resolver.rs:637-704,2538-2583` and the operation's directional row in the canonical contract. Also check the reverse direction in existing operations. These three files are a separate publication subtask.

<a id="expression"></a>
### Extend expression parsing or filter pushdown

[Query integration contract](../L3-symbols/public-api.md#readquery-contracts).

1. `rust/lance-datafusion/src/planner.rs:280-350` — identifier resolution and qualification.
2. `rust/lance/src/datafusion/dataframe.rs:132-197` — Exact TableProvider pushdown claim and scanner translation.
3. `rust/lance/src/dataset/scanner.rs:3633-3801` — eligibility, residual filter and plan stage order.
4. `rust/lance-datafusion/src/exec.rs:721-761` — output partition/order contract.

<a id="python"></a>
### Extend a Python API or trace its Rust implementation

[API families and all local declarations](../L3-symbols/public-api.md#python-to-rust-ordered-read-maps). Concrete scanner-option task:

1. `python/python/lance/dataset.py:1225-1567,7403-7440` — public argument/default and forwarding path.
2. `python/src/dataset.rs:1244-1449` — PyO3 signature, conversion and builder call.
3. `rust/lance/src/dataset/scanner.rs:3633-3801` plus the selected setter from the [declaration directory](../L3-symbols/api-reference/lance.md) — validation/planning.
4. `python/src/scanner.rs:34-49` → `python/src/reader.rs:48-123` only if result streaming/lifetime changes. That expands to five unique files.

<a id="java"></a>
### Extend Java scanner options — mapped only

[Java Module Map and JNI route](../L1-modules/java.md). Navigation confirmation does not upgrade Java to deep verification.

1. `java/src/main/java/org/lance/Dataset.java:834-858`.
2. `java/src/main/java/org/lance/ipc/ScanOptions.java:369-378,618-747`.
3. `java/src/main/java/org/lance/ipc/LanceScanner.java:57-102`.
4. `java/lance-jni/src/blocking_scanner.rs:352-414,633-774`.

<a id="io"></a>
### Tune I/O scheduling without stalling dependent reads

[I/O admission and ownership contract](../L3-symbols/protocol-io.md).

1. `rust/lance-io/src/scheduler.rs:217-368,816-919,1181-1352` — priorities, refunds, configuration and bypass.
2. `rust/lance-io/src/scheduler/lite.rs:354-388,541-715` — alternate polling/drop semantics.
3. [Frozen decoder](../L2-files/rust/lance-encoding/src/decoder.rs.md) → `rust/lance-encoding/src/decoder.rs:2863-3064` — upstream aggregation/flush.
4. `rust/lance-io/src/traits.rs:136-177` — Reader range contract.

<a id="object-store"></a>
### Add an object-store provider — interface route

[I/O contract](../L3-symbols/protocol-io.md) and [I/O Module Map](../L1-modules/rust-lance-io.md). Platform/backend implementation is mapped only; external SDKs remain excluded.

1. `rust/lance-io/src/object_store/providers.rs:42-84,244-291,415-424` — provider and registry interfaces.
2. `rust/lance-io/src/traits.rs:24-43,136-177` — Writer/Reader obligations.
3. `rust/lance-io/src/object_store.rs` at the selected constructor/options declaration in the [API directory](../L3-symbols/api-reference/lance-io.md) — store integration.
4. [Frozen CommitHandler contract](../L2-files/rust/lance-table/src/io/commit.rs.md) — choose publication semantics separately from byte access.

<a id="namespace"></a>
### Add a namespace implementation — mapped only

[Peripheral namespace maps](../L1-modules/peripheral-maps.md). This route locates direct-source interfaces; it does not promise server/dependency behavior.

1. `rust/lance-namespace/src/namespace.rs:62-160` — LanceNamespace entry methods and request/response boundary.
2. `rust/lance-namespace/src/lib.rs:1-41` — exports/model dependency boundary.
3. `rust/lance-namespace-impls/src/connect.rs:177-219` — implementation selection.
4. `rust/lance/src/dataset/builder.rs:139-187` — namespace-backed Dataset entry; select the matching provider file through the Module Map before adding a concrete implementation.

<a id="version"></a>
### Change or interpret exact version gates

[Authoritative format matrix](../L3-symbols/format-spec.md#exact-file-identity-and-acceptance).

1. [Frozen version identity/parser](../L2-files/rust/lance-file/src/version.rs.md) → `rust/lance-file/src/version.rs:25-262`.
2. [V2_1 reader](../L2-files/rust/lance-file/src/versions/v2_1/reader.rs.md) → `rust/lance-file/src/versions/v2_1/reader.rs:99-171`.
3. [V2_2 reader](../L2-files/rust/lance-file/src/versions/v2_2/reader.rs.md) → `rust/lance-file/src/versions/v2_2/reader.rs:99-169`.
4. [V2_3 reader](../L2-files/rust/lance-file/src/versions/v2_3/reader.rs.md) → `rust/lance-file/src/versions/v2_3/reader.rs:149-265` — unstable grammar.
5. [Frozen table feature flags](../L2-files/rust/lance-table/src/feature_flags.rs.md) → `rust/lance-table/src/feature_flags.rs:98-126,323-432` — independent reader/writer capability words, including managed blobs.

<a id="distributed-compaction"></a>
### Avoid resurrecting concurrently deleted rows during distributed compaction

[Compaction intent and directional conflict contract](../L3-symbols/protocol-commit.md#index-coverage-and-rewrite-lineage).

1. `rust/lance/src/dataset/optimize.rs:3227-3337,3662-3693` — minimum task read-version and commit intent.
2. `rust/lance/src/io/commit/conflict_resolver.rs:1546-1813,2973-3229` — overlapping changes and original-read-version transition ownership.
3. `rust/lance/src/io/commit.rs:1548-1623,1691-1950` — current-state preparation per attempt.
4. [Frozen manifest application](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) — liveness/fragment replacement validation.

<a id="file-v20"></a>
### Preserve the stable V2_0 writer/reader contract

This retains the production portion of the historical mixed writer/fixture scenario; binary fixture interpretation is archived.

1. [Frozen V2_0 composition](../L2-files/rust/lance-file/src/versions/v2_0/mod.rs.md).
2. [Frozen V2_0 writer](../L2-files/rust/lance-file/src/versions/v2_0/writer.rs.md).
3. [Frozen shared reader](../L2-files/rust/lance-file/src/reader.rs.md).
4. [Frozen V2_0 schema](../L2-files/protos/encodings_v2_0.proto.md).

<a id="dataset-open"></a>
### Open a named branch or tag

[Reference-resolution contract](../L3-symbols/public-api.md#dataset-open-reference-resolution). Source order:

1. `rust/lance/src/dataset/builder.rs:240-255,734-866` — reference selection, initial load and delayed checkout.
2. `rust/lance/src/dataset.rs:521-589` — Dataset open/checkout facade and snapshot ownership.

<a id="java-open"></a>
### Open a Java dataset at a reference — mapped only

[Changed Java interfaces](../L1-modules/java.md#refresh-reference-based-opening-and-value-identity--mapped-only). Keep Java boundary and Rust resolution as separate bounded subtasks.

**Java forwarding (four files):** `java/src/main/java/org/lance/ReadOptions.java:137-173,308-324` → `java/src/main/java/org/lance/OpenDatasetBuilder.java:231-247` → `java/src/main/java/org/lance/Dataset.java:458-499` → `java/lance-jni/src/blocking_dataset.rs:205-279,1727-1788`.

**Shared reference resolution (two files):** `java/lance-jni/src/blocking_dataset.rs:255-267` → `rust/lance/src/dataset/builder.rs:734-866`. Main/default-chain open semantics are URI-relative; use the canonical contract before treating open as equivalent to checkout.

## Retained production recipe and scenario routes

<a id="recipe-01"></a>

### Adding index metadata

[Recipe](cookbook.md#adding-index-metadata-established-first-steps) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [Frozen current details schema](../L2-files/protos/index.proto.md) → protos/index.proto:17-383 — choose an existing detail shape or introduce a compatible new message. Historical namespace identities remain frozen; do not move old messages.
2. [Frozen manifest index envelope](../L2-files/protos/table.proto.md) → protos/table.proto:319-434 — locate index metadata in the complete numbered declaration record.
3. [Frozen metadata conversion](../L2-files/rust/lance-table/src/format/index.rs.md) → rust/lance-table/src/format/index.rs:21-95, rust/lance-table/src/format/index.rs:161-377 — identity, coverage, optional details and wire conversion.
4. `rust/lance-index/src/scalar/registry.rs:29-367` — type-specific metadata load/validation; use [index extension](../L3-symbols/protocol-index.md#adding-a-scalar-index-bounded-subtasks) for a new algorithm rather than treating the metadata change as sufficient.

<a id="recipe-03"></a>

### Extend a logical type

[Recipe](cookbook.md#local-recipe-extend-a-logical-type-incomplete-whole-system-recipe) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes.rs.md) → rust/lance-core/src/datatypes.rs:51-194, rust/lance-core/src/datatypes.rs:302-565.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:170-195, rust/lance-core/src/datatypes/field.rs:1225-1369.

<a id="recipe-04"></a>

### Extend schema validation or selection

[Recipe](cookbook.md#extend-schema-validation-or-selection) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/schema.rs.md) → rust/lance-core/src/datatypes/schema.rs:351-406, rust/lance-core/src/datatypes/schema.rs:883-919, rust/lance-core/src/datatypes/schema.rs:937-956, rust/lance-core/src/datatypes/schema.rs:1324-1545, rust/lance-core/src/datatypes/schema.rs:1577-1612.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:274-310.

<a id="recipe-05"></a>

### Core containers, memory and small utilities

[Recipe](cookbook.md#core-containers-memory-and-small-utilities) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/container/list.rs.md) → rust/lance-core/src/container/list.rs:33-108, rust/lance-core/src/container/list.rs:157-252.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/deepsize.rs.md) → rust/lance-core/src/deepsize.rs:38-44, rust/lance-core/src/deepsize.rs:111-199, rust/lance-core/src/deepsize.rs:300-300.
3. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/tempfile.rs.md) → rust/lance-core/src/utils/tempfile.rs:45-89, rust/lance-core/src/utils/tempfile.rs:197-343.

<a id="recipe-06"></a>

### Deletion vectors and single-rewrite mapping

[Recipe](cookbook.md#deletion-vectors-and-single-rewrite-mapping) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) → rust/lance-core/src/utils/fragment_reuse.rs:14-73.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/deletion.rs.md) → rust/lance-core/src/utils/deletion.rs:63-294.

<a id="recipe-07"></a>

### Ordered and stable-partition row mapping

[Recipe](cookbook.md#ordered-and-stable-partition-row-mapping) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/row_addr_remap.rs.md) → rust/lance-core/src/utils/row_addr_remap.rs:175-193, rust/lance-core/src/utils/row_addr_remap.rs:606-625.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/stable_partition.rs.md) → rust/lance-core/src/utils/stable_partition.rs:18-32, rust/lance-core/src/utils/stable_partition.rs:88-159, rust/lance-core/src/utils/stable_partition.rs:191-290, rust/lance-core/src/utils/stable_partition.rs:387-482.

<a id="recipe-08"></a>

### AIMD control

[Recipe](cookbook.md#aimd-control-and-object-store-test-instrumentation) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/aimd.rs.md) → rust/lance-core/src/utils/aimd.rs:102-184, rust/lance-core/src/utils/aimd.rs:247-289.

<a id="recipe-09"></a>

### Generic split-block Bloom filters

[Recipe](cookbook.md#generic-split-block-bloom-filters) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/bloomfilter/as_bytes.rs.md) → rust/lance-core/src/utils/bloomfilter/as_bytes.rs:9-93.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/bloomfilter/sbbf.rs.md) → rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151, rust/lance-core/src/utils/bloomfilter/sbbf.rs:296-317, rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-337, rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425.

<a id="recipe-10"></a>

### Custom cache backend

[Recipe](cookbook.md#local-extension-seam-custom-cache-backend) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/backend.rs.md) → rust/lance-core/src/cache/backend.rs:11-18, rust/lance-core/src/cache/backend.rs:62-173, rust/lance-core/src/cache/backend.rs:197-215.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/registry.rs.md) → rust/lance-core/src/cache/registry.rs:80-84, rust/lance-core/src/cache/registry.rs:104-171.
3. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/backend_uri.rs.md) → rust/lance-core/src/cache/backend_uri.rs:59-104.

<a id="recipe-11"></a>

### A serializable cache value

[Recipe](cookbook.md#local-extension-seam-a-serializable-cache-value) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/codec.rs.md) → rust/lance-core/src/cache/codec.rs:202-273, rust/lance-core/src/cache/codec.rs:343-383, rust/lance-core/src/cache/codec.rs:499-523.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/entry_io.rs.md) → rust/lance-core/src/cache/entry_io.rs:100-114.

<a id="recipe-12"></a>

### Memory-backend selection and testing seam

[Recipe](cookbook.md#memory-backend-selection-and-testing-seam) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/quick.rs.md) → rust/lance-core/src/cache/quick.rs:46-56, rust/lance-core/src/cache/quick.rs:67-194.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/moka.rs.md) → rust/lance-core/src/cache/moka.rs:34-47, rust/lance-core/src/cache/moka.rs:134-165.

<a id="recipe-13"></a>

### Typed cache key/value extension seam

[Recipe](cookbook.md#typed-cache-keyvalue-extension-seam) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/mod.rs.md) → rust/lance-core/src/cache/mod.rs:107-191, rust/lance-core/src/cache/mod.rs:197-256, rust/lance-core/src/cache/mod.rs:556-633, rust/lance-core/src/cache/mod.rs:635-665.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/codec.rs.md) → rust/lance-core/src/cache/codec.rs:220-273.

<a id="recipe-15"></a>

### Interpreting an existing manifest feature word

[Recipe](cookbook.md#interpreting-an-existing-manifest-feature-word) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/feature_flags.rs.md) → rust/lance-table/src/feature_flags.rs:152-189, rust/lance-table/src/feature_flags.rs:323-432.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format.rs.md) → rust/lance-table/src/format.rs:52-55.

<a id="recipe-16"></a>

### Reading row-ID and transaction metadata without conflating layers

[Recipe](cookbook.md#reading-row-id-and-transaction-metadata-without-conflating-layers) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/row_ids.rs.md) → rust/lance-table/src/format/row_ids.rs:27-98, rust/lance-table/src/format/row_ids.rs:141-166.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/transaction.rs.md) → rust/lance-table/src/format/transaction.rs:30-82.

<a id="recipe-17"></a>

### Extending metadata consumers conservatively

[Recipe](cookbook.md#extending-metadata-consumers-conservatively) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/fragment.rs.md) → rust/lance-table/src/format/fragment.rs:253-279, rust/lance-table/src/format/fragment.rs:589-670, rust/lance-table/src/format/fragment.rs:700-725.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:260-279, rust/lance-table/src/format/manifest.rs:478-502, rust/lance-table/src/format/manifest.rs:638-670, rust/lance-table/src/format/manifest.rs:875-966, rust/lance-table/src/format/manifest.rs:1030-1044, rust/lance-table/src/format/manifest.rs:1064-1079, rust/lance-table/src/format/manifest.rs:1219-1246.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/feature_flags.rs.md) → rust/lance-table/src/feature_flags.rs:333-429.

<a id="recipe-18"></a>

### Local metadata extension checklist

[Recipe](cookbook.md#local-metadata-extension-checklist-incomplete-end-to-end-recipe) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/index.rs.md) → rust/lance-table/src/format/index.rs:160-247.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/overlay.rs.md) → rust/lance-table/src/format/overlay.rs:192-327.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/key_existence.rs.md) → rust/lance-table/src/format/key_existence.rs:30-65, rust/lance-table/src/format/key_existence.rs:175-280, rust/lance-table/src/format/key_existence.rs:311-390.

<a id="recipe-19"></a>

### File-version and overlay-staleness extension seams

[Recipe](cookbook.md#file-version-and-overlay-staleness-extension-seams) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/version.rs.md) → rust/lance-file/src/version.rs:13-272.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/overlay/staleness.rs.md) → rust/lance-table/src/format/overlay/staleness.rs:35-176.

<a id="recipe-20"></a>

### Row-version metadata and selections

[Recipe](cookbook.md#local-extension-seam-row-version-metadata-and-selections) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/version.rs.md) → rust/lance-table/src/rowids/version.rs:82-95, rust/lance-table/src/rowids/version.rs:343-390, rust/lance-table/src/rowids/version.rs:561-652, rust/lance-table/src/rowids/version.rs:654-815.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/runs.rs.md) → rust/lance-table/src/rowids/runs.rs:36-215, rust/lance-table/src/rowids/runs.rs:217-217.

<a id="recipe-21"></a>

### Row-ID wire payloads

[Recipe](cookbook.md#local-extension-seam-row-id-wire-payloads) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/protos/rowids.proto.md) → protos/rowids.proto:20-104.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/bitmap.rs.md) → rust/lance-table/src/rowids/bitmap.rs:67-77.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/serde.rs.md) → rust/lance-table/src/rowids/serde.rs:232-344, rust/lance-table/src/rowids/serde.rs:346-426.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/version.rs.md) → rust/lance-table/src/rowids/version.rs:520-535.
5. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/encoded_array.rs.md) → rust/lance-table/src/rowids/encoded_array.rs:193-254.

<a id="recipe-22"></a>

### Segment representation or cursor behavior

[Recipe](cookbook.md#local-extension-seam-segment-representation-or-cursor-behavior) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/segment.rs.md) → rust/lance-table/src/rowids/segment.rs:40-954.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/serde.rs.md) → rust/lance-table/src/rowids/serde.rs:232-338.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/version.rs.md) → rust/lance-table/src/rowids/version.rs:520-559.

<a id="recipe-23"></a>

### Row-ID sequence operations

[Recipe](cookbook.md#local-extension-seam-row-id-sequence-operations) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids.rs.md) → rust/lance-table/src/rowids.rs:67-170, rust/lance-table/src/rowids.rs:237-1127.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/segment.rs.md) → rust/lance-table/src/rowids/segment.rs:40-954.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/serde.rs.md) → rust/lance-table/src/rowids/serde.rs:98-426.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/utils/stream.rs.md) → rust/lance-table/src/utils/stream.rs:407-444, rust/lance-table/src/utils/stream.rs:648-680.
5. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:74-123.

<a id="recipe-24"></a>

### Change transaction row lineage

[Recipe](cookbook.md#local-recipe-change-transaction-row-lineage) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/row_version.rs.md) → rust/lance-table/src/transaction/row_version.rs:39-52, rust/lance-table/src/transaction/row_version.rs:73-295, rust/lance-table/src/transaction/row_version.rs:298-405.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction.rs.md) → rust/lance-table/src/transaction.rs:51-51.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:965-1022.

<a id="recipe-25"></a>

### New operation: definition and application

[Recipe](cookbook.md#new-operation-known-definition-side-touch-points) · [Decision contract](../L3-symbols/protocol-commit.md)

**Local subtask 1: operation, builder, conflicts, transaction, update_map.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/operation.rs.md) → rust/lance-table/src/transaction/operation.rs:37-262, rust/lance-table/src/transaction/operation.rs:293-315, rust/lance-table/src/transaction/operation.rs:353-412, rust/lance-table/src/transaction/operation.rs:414-436.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/builder.rs.md) → rust/lance-table/src/transaction/builder.rs:16-25.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) → rust/lance-table/src/transaction/conflicts.rs:18-29.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction.rs.md) → rust/lance-table/src/transaction.rs:15-27, rust/lance-table/src/transaction.rs:44-59, rust/lance-table/src/transaction.rs:90-106.
5. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/update_map.rs.md) → rust/lance-table/src/transaction/update_map.rs:58-81.

**Local subtask 2: prepare.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/prepare.rs.md) → rust/lance-table/src/transaction/prepare.rs:44-100.

<a id="recipe-26"></a>

### Extend transaction equality and metadata predicates

[Recipe](cookbook.md#extend-transaction-equality-and-metadata-predicates) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) → rust/lance-table/src/transaction/conflicts.rs:18-29, rust/lance-table/src/transaction/conflicts.rs:200-869, rust/lance-table/src/transaction/conflicts.rs:871-993.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/operation.rs.md) → rust/lance-table/src/transaction/operation.rs:293-315, rust/lance-table/src/transaction/operation.rs:414-436.
3. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/commit.rs:261-301.
4. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io-commit) → rust/lance/src/io/commit/conflict_resolver.rs:1814-1865, rust/lance/src/io/commit/conflict_resolver.rs:2320-2384.

<a id="recipe-27"></a>

### Change validation or add an operation guard

[Recipe](cookbook.md#change-validation-or-add-an-operation-guard) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/validate.rs.md) → rust/lance-table/src/transaction/validate.rs:377-623, rust/lance-table/src/transaction/validate.rs:676-698, rust/lance-table/src/transaction/validate.rs:726-1044.

<a id="recipe-28"></a>

### Extend a transaction payload through its codec

[Recipe](cookbook.md#extend-a-transaction-payload-through-its-codec) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/proto.rs.md) → rust/lance-table/src/transaction/proto.rs:83-424, rust/lance-table/src/transaction/proto.rs:490-731.
2. [frozen/Key File contract](../L2-files/protos/transaction.proto.md) → protos/transaction.proto:410-434.

<a id="recipe-29"></a>

### Modify index coverage during a transaction

[Recipe](cookbook.md#modify-index-coverage-during-a-transaction) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) → rust/lance-table/src/transaction/index_maintenance.rs:106-643, rust/lance-table/src/transaction/index_maintenance.rs:650-807.

<a id="recipe-30"></a>

### Extend tagged-history operation policy

[Recipe](cookbook.md#extend-tagged-history-operation-policy) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/gate.rs.md) → rust/lance-table/src/system_index/frag_reuse/gate.rs:22-330.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) → rust/lance-table/src/system_index/frag_reuse/metadata.rs:37-86.

<a id="recipe-31"></a>

### Extend supported fragment-reuse mappings

[Recipe](cookbook.md#extend-supported-fragment-reuse-mappings) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) → rust/lance-table/src/system_index/frag_reuse/ledger.rs:182-255, rust/lance-table/src/system_index/frag_reuse/ledger.rs:340-543.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse.rs.md) → rust/lance-table/src/system_index/frag_reuse.rs:186-210.

<a id="recipe-32"></a>

### Modify MemWAL metadata or progress rules

[Recipe](cookbook.md#modify-memwal-metadata-or-progress-rules) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/mem_wal.rs.md) → rust/lance-table/src/system_index/mem_wal.rs:31-193, rust/lance-table/src/system_index/mem_wal.rs:391-618.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:1029-1037, rust/lance-table/src/transaction/manifest_build.rs:1610-1620.

<a id="recipe-33"></a>

### Change candidate assembly safely

[Recipe](cookbook.md#change-candidate-assembly-safely) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction.rs.md) → rust/lance-table/src/transaction.rs:30-40, rust/lance-table/src/transaction.rs:43-62.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/operation.rs.md) → rust/lance-table/src/transaction/operation.rs:37-262.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:220-535, rust/lance-table/src/transaction/manifest_build.rs:593-2025.
4. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/commit.rs:1895-1932.

<a id="recipe-34"></a>

### Modify manifest or deletion IO

[Recipe](cookbook.md#modify-manifest-or-deletion-io) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/manifest.rs.md) → rust/lance-table/src/io/manifest.rs:32-251.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/deletion.rs.md) → rust/lance-table/src/io/deletion.rs:25-216.
3. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/deletion.rs:11-43.
4. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset) → rust/lance/src/dataset/fragment.rs:3005-3036.

<a id="recipe-35"></a>

### Add or change a commit handler

[Recipe](cookbook.md#add-or-change-a-commit-handler) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit.rs.md) → rust/lance-table/src/io/commit.rs:868-1055, rust/lance-table/src/io/commit.rs:1171-1263, rust/lance-table/src/io/commit.rs:1359-1502.

<a id="recipe-36"></a>

### Implement an external manifest store

[Recipe](cookbook.md#implement-an-external-manifest-store) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/external_manifest.rs.md) → rust/lance-table/src/io/commit/external_manifest.rs:162-368, rust/lance-table/src/io/commit/external_manifest.rs:384-558, rust/lance-table/src/io/commit/external_manifest.rs:623-705, rust/lance-table/src/io/commit/external_manifest.rs:734-961, rust/lance-table/src/io/commit/external_manifest.rs:1019-1121.

<a id="recipe-37"></a>

### Modify DynamoDB coordination or row-ID lookup

[Recipe](cookbook.md#modify-dynamodb-coordination-or-row-id-lookup) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) → rust/lance-table/src/io/commit/dynamodb.rs:162-513.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/external_manifest.rs.md) → rust/lance-table/src/io/commit/external_manifest.rs:286-335.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/index.rs.md) → rust/lance-table/src/rowids/index.rs:62-183, rust/lance-table/src/rowids/index.rs:306-500, rust/lance-table/src/rowids/index.rs:502-752.

<a id="recipe-38"></a>

### Change task alignment or system-column materialization

[Recipe](cookbook.md#change-task-alignment-or-system-column-materialization) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/utils/stream.rs.md) → rust/lance-table/src/utils/stream.rs:30-216, rust/lance-table/src/utils/stream.rs:266-848.

<a id="recipe-39"></a>

### File-level extension prerequisites

[Recipe](cookbook.md#file-level-extension-prerequisites) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: version, mod, writer, field, field_types.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/version.rs.md) → rust/lance-file/src/version.rs:128-262.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/mod.rs.md) → rust/lance-file/src/versions/mod.rs:38-401.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer.rs.md) → rust/lance-file/src/writer.rs:67-289.
4. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:1348-1368.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer/field_types.rs.md) → rust/lance-file/src/writer/field_types.rs:87-199.

**Local subtask 2: schema, io, lib, scheduler.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/schema.rs.md) → rust/lance-core/src/datatypes/schema.rs:922-926.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/io.rs.md) → rust/lance-file/src/io.rs:19-148.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/lib.rs.md) → rust/lance-encoding/src/lib.rs:40-104.
4. [frozen/Key File contract](../L2-files/rust/lance-io/src/scheduler.rs.md) → rust/lance-io/src/scheduler.rs:1195-1313.

<a id="recipe-40"></a>

### Current-format mechanism change: resolved local seams

[Recipe](cookbook.md#current-format-mechanism-change-resolved-local-seams) · [Decision contract](../L3-symbols/behavior-contracts.md)

**Local subtask 1: mod, mod, mod, compression, compression.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/mod.rs.md) → rust/lance-file/src/versions/v2_1/mod.rs:69-134.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/mod.rs.md) → rust/lance-file/src/versions/v2_2/mod.rs:67-131.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/mod.rs.md) → rust/lance-file/src/versions/v2_3/mod.rs:75-139.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/compression.rs.md) → rust/lance-file/src/versions/v2_1/compression.rs:29-129.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/compression.rs.md) → rust/lance-file/src/versions/v2_2/compression.rs:32-129.

**Local subtask 2: compression, structural, reader.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md) → rust/lance-file/src/versions/v2_3/compression.rs:32-130.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader/structural.rs.md) → rust/lance-file/src/reader/structural.rs:173-357, rust/lance-file/src/reader/structural.rs:409-433.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader.rs.md) → rust/lance-file/src/reader.rs:512-569.

<a id="recipe-41"></a>

### Extending exact reader grammar: local touch set

[Recipe](cookbook.md#extending-exact-reader-grammar-local-touch-set) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/reader.rs.md) → rust/lance-file/src/versions/v2_1/reader.rs:18-268, rust/lance-file/src/versions/v2_1/reader.rs:26-108.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/reader.rs.md) → rust/lance-file/src/versions/v2_2/reader.rs:18-270.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/reader.rs.md) → rust/lance-file/src/versions/v2_3/reader.rs:20-347.

<a id="recipe-42"></a>

### Extend a current structural writer mechanism

[Recipe](cookbook.md#extend-a-current-structural-writer-mechanism) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/writer.rs.md) → rust/lance-file/src/versions/v2_1/writer.rs:78-186.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer/structural.rs.md) → rust/lance-file/src/writer/structural.rs:546-776, rust/lance-file/src/writer/structural.rs:783-921.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder.rs.md) → rust/lance-encoding/src/encoder.rs:130-159.

<a id="recipe-43"></a>

### V2_0 persistence persistence contract

[Recipe](cookbook.md#local-change-map-v2_0-persistence-and-compatibility-oracles) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_0/writer.rs.md) → rust/lance-file/src/versions/v2_0/writer.rs:313-324, rust/lance-file/src/versions/v2_0/writer.rs:451-584, rust/lance-file/src/versions/v2_0/writer.rs:768-952.

<a id="recipe-45"></a>

### Reader projection, metadata and selector changes

[Recipe](cookbook.md#reader-projection-metadata-and-selector-changes) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader.rs.md) → rust/lance-file/src/reader.rs:1023-1107, rust/lance-file/src/reader.rs:1411-1474, rust/lance-file/src/reader.rs:1534-1669, rust/lance-file/src/reader.rs:1768-1877, rust/lance-file/src/reader.rs:1968-2249, rust/lance-file/src/reader.rs:2255-2275.

<a id="recipe-46"></a>

### Changing encoded concatenation

[Recipe](cookbook.md#changing-encoded-concatenation) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/concat.rs.md) → rust/lance-file/src/concat.rs:569-685, rust/lance-file/src/concat.rs:697-806, rust/lance-file/src/concat.rs:808-1048.
2. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset) → rust/lance/src/dataset/write.rs:308-334.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/mod.rs.md) → rust/lance-file/src/versions/mod.rs:230-276.

<a id="recipe-47"></a>

### Preserve frozen V1 boundaries during current-format work

[Recipe](cookbook.md#preserve-frozen-v1-boundaries-during-current-format-work) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) → rust/lance-file/src/versions/v1/mod.rs:25-116.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) → rust/lance-file/src/versions/v1/encoding.rs:92-192.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) → rust/lance-file/src/versions/v1/format/metadata.rs:34-194.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) → rust/lance-file/src/versions/v1/page_table.rs:36-159.

<a id="recipe-48"></a>

### Separately authorized V1 codec repair

[Recipe](cookbook.md#separately-authorized-v1-codec-repair) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding/binary.rs.md) → rust/lance-file/src/versions/v1/encoding/binary.rs:251-284.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding.rs.md) → rust/lance-file/src/versions/v1/encoding.rs:92-192.

<a id="recipe-49"></a>

### Separately authorized V1 reader repair

[Recipe](cookbook.md#separately-authorized-v1-reader-repair) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) → rust/lance-file/src/versions/v1/reader.rs:68-294, rust/lance-file/src/versions/v1/reader.rs:324-445.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:1220-1246.

<a id="recipe-50"></a>

### Investigating a frozen V1 write regression

[Recipe](cookbook.md#investigating-a-frozen-v1-write-regression) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:166-270, rust/lance-file/src/versions/v1/writer/mod.rs:393-651.

<a id="recipe-51"></a>

### Investigating historical statistics regressions

[Recipe](cookbook.md#investigating-historical-statistics-regressions) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:109-199.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/statistics.rs.md) → rust/lance-file/src/versions/v1/writer/statistics.rs:47-929.

<a id="recipe-54"></a>

### Embedded V2_0 compatibility reader behavior

[Recipe](cookbook.md#diagnose-an-embedded-v2_0-byte-mismatch) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding-src-array-encoding) → rust/lance-encoding/src/array_encoding/logical/primitive.rs:511-549.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder.rs.md) → rust/lance-encoding/src/encoder.rs:380-395.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_0/writer.rs.md) → rust/lance-file/src/versions/v2_0/writer.rs:852-951.

<a id="recipe-58"></a>

### Encoding change: constructor and IO seam portion only

[Recipe](cookbook.md#encoding-change-constructor-and-io-seam-portion-only) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/format.rs.md) → rust/lance-encoding/src/format.rs:50-827.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/reader.rs.md) → rust/lance-file/src/versions/v2_1/reader.rs:99-151.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/reader.rs.md) → rust/lance-file/src/versions/v2_2/reader.rs:99-153.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/lib.rs.md) → rust/lance-encoding/src/lib.rs:33-134.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/io.rs.md) → rust/lance-file/src/io.rs:17-148.

<a id="recipe-59"></a>

### Extending compression policy or a general codec: known touch points

[Recipe](cookbook.md#extending-compression-policy-or-a-general-codec-known-touch-points) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/constants.rs.md) → rust/lance-encoding/src/constants.rs:9-65.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression_config.rs.md) → rust/lance-encoding/src/compression_config.rs:55-169.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:560-591.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/compression.rs.md) → rust/lance-file/src/versions/v2_2/compression.rs:27-38.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/block.rs.md) → rust/lance-encoding/src/encodings/physical/block.rs:42-162, rust/lance-encoding/src/encodings/physical/block.rs:256-496, rust/lance-encoding/src/encodings/physical/block.rs:538-653, rust/lance-encoding/src/encodings/physical/block.rs:656-819.

<a id="recipe-60"></a>

### Changing a buffer operation or mini-block codec

[Recipe](cookbook.md#changing-a-buffer-operation-or-mini-block-codec) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: buffer, packed_struct, miniblock, compression, general.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/buffer.rs.md) → rust/lance-encoding/src/buffer.rs:78-260.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding-src-array-encoding) → rust/lance-encoding/src/array_encoding/physical/packed_struct.rs:172-249.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:45-156.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:936-954.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/general.rs.md) → rust/lance-encoding/src/encodings/physical/general.rs:112-229.

**Local subtask 2: layout, mod, mod.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/layout.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/layout.rs:8-24.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/mod.rs.md) → rust/lance-file/src/versions/v2_2/mod.rs:121-131.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/mod.rs.md) → rust/lance-file/src/versions/v2_3/mod.rs:129-139.

<a id="recipe-61"></a>

### Modifying current value or bitpacking codecs

[Recipe](cookbook.md#modifying-current-value-or-bitpacking-codecs) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/value.rs.md) → rust/lance-encoding/src/encodings/physical/value.rs:323-455, rust/lance-encoding/src/encodings/physical/value.rs:516-869.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-compression-bitpacking) → rust/compression/bitpacking/src/lib.rs:1-278.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/bitpacking.rs.md) → rust/lance-encoding/src/encodings/physical/bitpacking.rs:106-692.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:339-457, rust/lance-encoding/src/compression.rs:1025-1109, rust/lance-encoding/src/compression.rs:1273-1337.

<a id="recipe-62"></a>

### Changing variable, FSST or BSS behavior

[Recipe](cookbook.md#changing-variable-fsst-or-bss-behavior) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: binary, data, compression, fsst, byte_stream_split.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/binary.rs.md) → rust/lance-encoding/src/encodings/physical/binary.rs:89-1149.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:742-969.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:154-191, rust/lance-encoding/src/compression.rs:661-736, rust/lance-encoding/src/compression.rs:837-881, rust/lance-encoding/src/compression.rs:1061-1134, rust/lance-encoding/src/compression.rs:1213-1242.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/fsst.rs.md) → rust/lance-encoding/src/encodings/physical/fsst.rs:36-392.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/byte_stream_split.rs.md) → rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:83-325.

**Local subtask 2: statistics.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:500-551.

<a id="recipe-63"></a>

### Extending packed structures or statistics

[Recipe](cookbook.md#extending-packed-structures-or-statistics) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: packed, compression, compression, compression, data.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/packed.rs.md) → rust/lance-encoding/src/encodings/physical/packed.rs:71-218, rust/lance-encoding/src/encodings/physical/packed.rs:329-525, rust/lance-encoding/src/encodings/physical/packed.rs:562-897.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:738-835, rust/lance-encoding/src/compression.rs:1241-1279.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/compression.rs.md) → rust/lance-file/src/versions/v2_2/compression.rs:77-93.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md) → rust/lance-file/src/versions/v2_3/compression.rs:79-94.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:63-85, rust/lance-encoding/src/data.rs:2078-2123.

**Local subtask 2: statistics, byte_stream_split.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:19-594.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/byte_stream_split.rs.md) → rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:277-324.

<a id="recipe-64"></a>

### Changing a structural compression policy

[Recipe](cookbook.md#changing-a-structural-compression-policy) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:92-145, rust/lance-encoding/src/compression.rs:180-516, rust/lance-encoding/src/compression.rs:936-1928.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/compression.rs.md) → rust/lance-file/src/versions/v2_1/compression.rs:51-104.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/compression.rs.md) → rust/lance-file/src/versions/v2_2/compression.rs:41-99.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md) → rust/lance-file/src/versions/v2_3/compression.rs:41-101.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/rle.rs.md) → rust/lance-encoding/src/encodings/physical/rle.rs:1013-1039.

<a id="recipe-65"></a>

### Modifying modern RLE behavior

[Recipe](cookbook.md#modifying-modern-rle-behavior) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:180-273, rust/lance-encoding/src/compression.rs:1757-1928.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/rle.rs.md) → rust/lance-encoding/src/encodings/physical/rle.rs:142-328, rust/lance-encoding/src/encodings/physical/rle.rs:385-725, rust/lance-encoding/src/encodings/physical/rle.rs:727-1151, rust/lance-encoding/src/encodings/physical/rle.rs:1471-1948.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md) → rust/lance-file/src/versions/v2_3/compression.rs:41-101.

<a id="recipe-66"></a>

### Extending DataBlock or its conversion boundary

[Recipe](cookbook.md#extending-datablock-or-its-conversion-boundary) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:61-86, rust/lance-encoding/src/data.rs:226-450, rust/lance-encoding/src/data.rs:576-619, rust/lance-encoding/src/data.rs:663-982, rust/lance-encoding/src/data.rs:1025-1055, rust/lance-encoding/src/data.rs:1179-1498, rust/lance-encoding/src/data.rs:1832-2057, rust/lance-encoding/src/data.rs:2059-2124.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:51-71, rust/lance-encoding/src/statistics.rs:579-596.
3. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:7575-7600.
4. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding-src-array-encoding) → rust/lance-encoding/src/array_encoding/logical/primitive.rs:511-514.

<a id="recipe-67"></a>

### Changing rep/def or control words

[Recipe](cookbook.md#changing-repdef-or-control-words) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/repdef.rs.md) → rust/lance-encoding/src/repdef.rs:127-152, rust/lance-encoding/src/repdef.rs:342-451, rust/lance-encoding/src/repdef.rs:561-645, rust/lance-encoding/src/repdef.rs:707-948, rust/lance-encoding/src/repdef.rs:958-1230, rust/lance-encoding/src/repdef.rs:1617-1967, rust/lance-encoding/src/repdef.rs:2016-2140, rust/lance-encoding/src/repdef.rs:2143-2840.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:7118-7162, rust/lance-encoding/src/encodings/logical/primitive.rs:7709-7729.

<a id="recipe-68"></a>

### Extending a current field-encoding mechanism

[Recipe](cookbook.md#extending-a-current-field-encoding-mechanism) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder.rs.md) → rust/lance-encoding/src/encoder.rs:175-233, rust/lance-encoding/src/encoder.rs:380-501.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → rust/lance-encoding/src/encoder/structural.rs:93-288.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/mod.rs.md) → rust/lance-file/src/versions/v2_1/mod.rs:69-122.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/mod.rs.md) → rust/lance-file/src/versions/v2_2/mod.rs:67-131.

<a id="recipe-69"></a>

### Extending current decode planning

[Recipe](cookbook.md#extending-current-decode-planning) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/decoder.rs.md) → rust/lance-encoding/src/decoder.rs:267-388, rust/lance-encoding/src/decoder.rs:577-651, rust/lance-encoding/src/decoder.rs:878-1123, rust/lance-encoding/src/decoder.rs:1968-2199, rust/lance-encoding/src/decoder.rs:2356-2671, rust/lance-encoding/src/decoder.rs:2863-3151, rust/lance-encoding/src/decoder.rs:3201-3397, rust/lance-encoding/src/decoder.rs:3412-3464.

<a id="recipe-70"></a>

### Changing primitive helper behavior

[Recipe](cookbook.md#changing-primitive-helper-behavior) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:32-343, rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:387-432.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/constant.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/constant.rs:30-492.
3. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-arrow) → rust/lance-arrow/src/scalar.rs:1-190.
4. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:4543-4572, rust/lance-encoding/src/encodings/logical/primitive.rs:7410-7457, rust/lance-encoding/src/encodings/logical/primitive.rs:7650-7688, rust/lance-encoding/src/encodings/logical/primitive.rs:7927-7972.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/dict.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-427.

<a id="recipe-71"></a>

### Changing Blob encoding or loading

[Recipe](cookbook.md#changing-blob-encoding-or-loading) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → rust/lance-encoding/src/encoder/structural.rs:136-168.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/blob.rs.md) → rust/lance-encoding/src/encodings/logical/blob.rs:43-125, rust/lance-encoding/src/encodings/logical/blob.rs:127-214, rust/lance-encoding/src/encodings/logical/blob.rs:234-465.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/blob.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/blob.rs:70-552.
4. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:4583-4616.

<a id="recipe-72"></a>

### Extending nested structural shapes

[Recipe](cookbook.md#extending-nested-structural-shapes) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: datatypes, field, schema, structural, decoder.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes.rs.md) → rust/lance-core/src/datatypes.rs:302-311.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:1243-1278.
3. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/schema.rs.md) → rust/lance-core/src/datatypes/schema.rs:128-138.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → rust/lance-encoding/src/encoder/structural.rs:192-261.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/decoder.rs.md) → rust/lance-encoding/src/decoder.rs:878-884, rust/lance-encoding/src/decoder.rs:959-981.

**Local subtask 2: struct, mod, mod, mod, fixed_size_list.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/struct.rs:291-319.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/mod.rs.md) → rust/lance-file/src/versions/v2_1/mod.rs:95-122.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/mod.rs.md) → rust/lance-file/src/versions/v2_2/mod.rs:95-118.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/mod.rs.md) → rust/lance-file/src/versions/v2_3/mod.rs:103-126.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/fixed_size_list.rs.md) → rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:307-545.

**Local subtask 3: repdef, map.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/repdef.rs.md) → rust/lance-encoding/src/repdef.rs:1299-1396, rust/lance-encoding/src/repdef.rs:2078-2140.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/map.rs.md) → rust/lance-encoding/src/encodings/logical/map.rs:192-238.

<a id="scenario-01"></a>

### Distributed filtered-read serialization

[Scenario](scenarios.md#partial-scenario-distributed-filtered-read-serialization) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/protos/table_identifier.proto.md) → protos/table_identifier.proto:8-20.
2. [frozen/Key File contract](../L2-files/protos/filtered_read.proto.md) → protos/filtered_read.proto:15-76, protos/filtered_read.proto:89-125.

<a id="scenario-03"></a>

### State machines from schema contracts

[Scenario](scenarios.md#partial-state-machines-from-schema-contracts) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/protos/transaction.proto.md) → protos/transaction.proto:370-393.
2. [frozen/Key File contract](../L2-files/protos/fragment_metadata.proto.md) → protos/fragment_metadata.proto:185-237.
3. [frozen/Key File contract](../L2-files/protos/table.proto.md) → protos/table.proto:147-158, protos/table.proto:391-415, protos/table.proto:523-591.

<a id="scenario-04"></a>

### In-memory blob projection trace

[Scenario](scenarios.md#partial-in-memory-blob-projection-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:274-310, rust/lance-core/src/datatypes/field.rs:623-658, rust/lance-core/src/datatypes/field.rs:1095-1105, rust/lance-core/src/datatypes/field.rs:1225-1313.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/schema.rs.md) → rust/lance-core/src/datatypes/schema.rs:351-406, rust/lance-core/src/datatypes/schema.rs:481-491, rust/lance-core/src/datatypes/schema.rs:711-728, rust/lance-core/src/datatypes/schema.rs:883-919, rust/lance-core/src/datatypes/schema.rs:937-955, rust/lance-core/src/datatypes/schema.rs:959-967, rust/lance-core/src/datatypes/schema.rs:1221-1236, rust/lance-core/src/datatypes/schema.rs:1324-1357, rust/lance-core/src/datatypes/schema.rs:1572-1575, rust/lance-core/src/datatypes/schema.rs:1577-1612.

<a id="scenario-05"></a>

### Deletion vectors and single-rewrite mapping

[Scenario](scenarios.md#deletion-vectors-and-single-rewrite-mapping) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/deletion.rs.md) → rust/lance-core/src/utils/deletion.rs:104-183, rust/lance-core/src/utils/deletion.rs:209-251, rust/lance-core/src/utils/deletion.rs:277-283.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/fragment_reuse.rs.md) → rust/lance-core/src/utils/fragment_reuse.rs:34-73.

<a id="scenario-06"></a>

### Ordered and stable-partition row mapping

[Scenario](scenarios.md#ordered-and-stable-partition-row-mapping) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/row_addr_remap.rs.md) → rust/lance-core/src/utils/row_addr_remap.rs:391-485, rust/lance-core/src/utils/row_addr_remap.rs:738-764.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/stable_partition.rs.md) → rust/lance-core/src/utils/stable_partition.rs:49-60, rust/lance-core/src/utils/stable_partition.rs:191-290, rust/lance-core/src/utils/stable_partition.rs:348-385, rust/lance-core/src/utils/stable_partition.rs:387-482.

<a id="scenario-07"></a>

### AIMD control

[Scenario](scenarios.md#aimd-control-and-object-store-test-instrumentation) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/aimd.rs.md) → rust/lance-core/src/utils/aimd.rs:238-290.

<a id="scenario-08"></a>

### Generic split-block Bloom filters

[Scenario](scenarios.md#generic-split-block-bloom-filters) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/bloomfilter/as_bytes.rs.md) → rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/utils/bloomfilter/sbbf.rs.md) → rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151, rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-337, rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425.

<a id="scenario-09"></a>

### Configuring a cache backend

[Scenario](scenarios.md#local-trace-configuring-a-cache-backend) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/backend_uri.rs.md) → rust/lance-core/src/cache/backend_uri.rs:51-104.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/registry.rs.md) → rust/lance-core/src/cache/registry.rs:91-95, rust/lance-core/src/cache/registry.rs:153-193.
3. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/backend.rs.md) → rust/lance-core/src/cache/backend.rs:20-31, rust/lance-core/src/cache/backend.rs:45-163.

<a id="scenario-10"></a>

### Serializing and decoding one cache entry

[Scenario](scenarios.md#local-trace-serializing-and-decoding-one-cache-entry) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/codec.rs.md) → rust/lance-core/src/cache/codec.rs:319-383, rust/lance-core/src/cache/codec.rs:415-524.

<a id="scenario-11"></a>

### Memory backend miss and retry

[Scenario](scenarios.md#local-trace-memory-backend-miss-and-retry) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/moka.rs.md) → rust/lance-core/src/cache/moka.rs:67-81, rust/lance-core/src/cache/moka.rs:134-165, rust/lance-core/src/cache/moka.rs:327-376.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/quick.rs.md) → rust/lance-core/src/cache/quick.rs:263-296.

<a id="scenario-12"></a>

### One typed cached load

[Scenario](scenarios.md#local-trace-one-typed-cached-load) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/mod.rs.md) → rust/lance-core/src/cache/mod.rs:238-256, rust/lance-core/src/cache/mod.rs:327-331, rust/lance-core/src/cache/mod.rs:528-553, rust/lance-core/src/cache/mod.rs:635-645, rust/lance-core/src/cache/mod.rs:784-799, rust/lance-core/src/cache/mod.rs:822-827.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/moka.rs.md) → rust/lance-core/src/cache/moka.rs:134-165.
3. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/quick.rs.md) → rust/lance-core/src/cache/quick.rs:263-296.

<a id="scenario-13"></a>

### Local manifest capability walkthrough

[Scenario](scenarios.md#local-manifest-capability-walkthrough) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/feature_flags.rs.md) → rust/lance-table/src/feature_flags.rs:140-237, rust/lance-table/src/feature_flags.rs:256-260, rust/lance-table/src/feature_flags.rs:285-329, rust/lance-table/src/feature_flags.rs:331-432.

<a id="scenario-14"></a>

### Local row-ID metadata and transaction disposition traces

[Scenario](scenarios.md#local-row-id-metadata-and-transaction-disposition-traces) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/row_ids.rs.md) → rust/lance-table/src/format/row_ids.rs:49-126.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/transaction.rs.md) → rust/lance-table/src/format/transaction.rs:37-83.

<a id="scenario-15"></a>

### Decode, share, detach and clone a manifest

[Scenario](scenarios.md#decode-share-detach-and-clone-a-manifest) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/fragment.rs.md) → rust/lance-table/src/format/fragment.rs:378-461, rust/lance-table/src/format/fragment.rs:635-725.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:248-320, rust/lance-table/src/format/manifest.rs:403-431, rust/lance-table/src/format/manifest.rs:1021-1118.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/row_ids.rs.md) → rust/lance-table/src/format/row_ids.rs:75-84.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/feature_flags.rs.md) → rust/lance-table/src/feature_flags.rs:141-237.

<a id="scenario-16"></a>

### Local index-list cache and overlay reload traces

[Scenario](scenarios.md#local-index-list-cache-and-overlay-reload-traces) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/index.rs.md) → rust/lance-table/src/format/index.rs:278-334, rust/lance-table/src/format/index.rs:388-432.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/cache/codec.rs.md) → rust/lance-core/src/cache/codec.rs:415-420.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/overlay.rs.md) → rust/lance-table/src/format/overlay.rs:215-221, rust/lance-table/src/format/overlay.rs:242-275, rust/lance-table/src/format/overlay.rs:297-327.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/fragment.rs.md) → rust/lance-table/src/format/fragment.rs:831-869.

<a id="scenario-17"></a>

### Local merge-insert key representation trace

[Scenario](scenarios.md#local-merge-insert-key-representation-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/key_existence.rs.md) → rust/lance-table/src/format/key_existence.rs:42-148, rust/lance-table/src/format/key_existence.rs:175-280, rust/lance-table/src/format/key_existence.rs:282-389.

<a id="scenario-18"></a>

### Exact version and stale-index metadata traces

[Scenario](scenarios.md#exact-version-and-stale-index-metadata-traces) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/version.rs.md) → rust/lance-file/src/version.rs:19-75, rust/lance-file/src/version.rs:187-261.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/lib.rs.md) → rust/lance-file/src/lib.rs:45-59.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/fragment.rs.md) → rust/lance-table/src/format/fragment.rs:109-144.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:1153-1188.
5. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/overlay/staleness.rs.md) → rust/lance-table/src/format/overlay/staleness.rs:131-176.

<a id="scenario-19"></a>

### Refresh last-updated lineage during column rewrite

[Scenario](scenarios.md#local-trace-refresh-last-updated-lineage-during-column-rewrite) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/version.rs.md) → rust/lance-table/src/rowids/version.rs:713-815.

<a id="scenario-20"></a>

### Read version batches and present row-ID offsets

[Scenario](scenarios.md#local-trace-read-version-batches-and-present-row-id-offsets) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/version.rs.md) → rust/lance-table/src/rowids/version.rs:82-95.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/runs.rs.md) → rust/lance-table/src/rowids/runs.rs:156-215.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids.rs.md) → rust/lance-table/src/rowids.rs:67-170.

<a id="scenario-21"></a>

### Inline row-ID encode/decode

[Scenario](scenarios.md#local-trace-inline-row-id-encodedecode) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/serde.rs.md) → rust/lance-table/src/rowids/serde.rs:60-86, rust/lance-table/src/rowids/serde.rs:98-230, rust/lance-table/src/rowids/serde.rs:232-344, rust/lance-table/src/rowids/serde.rs:346-426.

<a id="scenario-22"></a>

### Construct, select and mutate a segment

[Scenario](scenarios.md#local-trace-construct-select-and-mutate-a-segment) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/segment.rs.md) → rust/lance-table/src/rowids/segment.rs:126-299, rust/lance-table/src/rowids/segment.rs:378-387, rust/lance-table/src/rowids/segment.rs:389-479, rust/lance-table/src/rowids/segment.rs:507-746, rust/lance-table/src/rowids/segment.rs:770-954.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/serde.rs.md) → rust/lance-table/src/rowids/serde.rs:232-255.

<a id="scenario-23"></a>

### Selection, deletion and rechunking

[Scenario](scenarios.md#local-trace-selection-deletion-and-rechunking) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids.rs.md) → rust/lance-table/src/rowids.rs:67-170, rust/lance-table/src/rowids.rs:221-265, rust/lance-table/src/rowids.rs:340-454, rust/lance-table/src/rowids.rs:516-591, rust/lance-table/src/rowids.rs:609-798, rust/lance-table/src/rowids.rs:946-1052.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/utils/stream.rs.md) → rust/lance-table/src/utils/stream.rs:407-444, rust/lance-table/src/utils/stream.rs:648-680.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:74-123.

<a id="scenario-24"></a>

### Local transaction trace: allocate IDs, preserve creation, stamp update

[Scenario](scenarios.md#local-transaction-trace-allocate-ids-preserve-creation-stamp-update) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/row_version.rs.md) → rust/lance-table/src/transaction/row_version.rs:97-171, rust/lance-table/src/transaction/row_version.rs:173-295, rust/lance-table/src/transaction/row_version.rs:332-405.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:765-765, rust/lance-table/src/transaction/manifest_build.rs:965-1022.

<a id="scenario-25"></a>

### Transaction-attempt trace

[Scenario](scenarios.md#partial-transaction-attempt-trace) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/builder.rs.md) → rust/lance-table/src/transaction/builder.rs:37-90.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:487-535, rust/lance-table/src/transaction/manifest_build.rs:606-624.

<a id="scenario-26"></a>

### Local config and metadata overlap examples

[Scenario](scenarios.md#local-config-and-metadata-overlap-examples) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/conflicts.rs.md) → rust/lance-table/src/transaction/conflicts.rs:871-919, rust/lance-table/src/transaction/conflicts.rs:921-991.

<a id="scenario-27"></a>

### Local pre-commit validation trace

[Scenario](scenarios.md#local-pre-commit-validation-trace) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset-write) → rust/lance/src/dataset/write/commit.rs:310-350, rust/lance/src/dataset/write/commit.rs:411-434.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/validate.rs.md) → rust/lance-table/src/transaction/validate.rs:377-698, rust/lance-table/src/transaction/validate.rs:726-1044.

<a id="scenario-28"></a>

### Local transaction protobuf trace

[Scenario](scenarios.md#local-transaction-protobuf-trace) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/proto.rs.md) → rust/lance-table/src/transaction/proto.rs:83-424, rust/lance-table/src/transaction/proto.rs:490-814.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/mem_wal.rs.md) → rust/lance-table/src/system_index/mem_wal.rs:125-139.

<a id="scenario-29"></a>

### Local index invalidation and rewrite trace

[Scenario](scenarios.md#local-index-invalidation-and-rewrite-trace) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/index_maintenance.rs.md) → rust/lance-table/src/transaction/index_maintenance.rs:106-217, rust/lance-table/src/transaction/index_maintenance.rs:259-393, rust/lance-table/src/transaction/index_maintenance.rs:535-643, rust/lance-table/src/transaction/index_maintenance.rs:650-807.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:1059-1144.
3. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io-commit) → rust/lance/src/io/commit/conflict_resolver.rs:1186-1254, rust/lance/src/io/commit/conflict_resolver.rs:1286-1342, rust/lance/src/io/commit/conflict_resolver.rs:1472-1508.

<a id="scenario-30"></a>

### Gate and clone-guard boundaries

The standalone guard is deprecated. Dataset clone now relocates tagged references through commit orchestration; it does not call this old guard. Read the [current clone contract](../L3-symbols/refresh-2026-10-07.md#clone-and-garbage-collection).

[Scenario](scenarios.md#gate-and-clone-guard-boundaries) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:487-535, rust/lance-table/src/transaction/manifest_build.rs:606-624.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/metadata.rs.md) → rust/lance-table/src/system_index/frag_reuse/metadata.rs:70-85.
3. [frozen/Key File contract](../L2-files/rust/lance/src/dataset.rs.md) → rust/lance/src/dataset.rs:3345-3395,3449-3473.
4. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/commit.rs:469-545.

<a id="scenario-31"></a>

### Decode one fragment-reuse history

[Scenario](scenarios.md#decode-one-fragment-reuse-history) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/ledger.rs.md) → rust/lance-table/src/system_index/frag_reuse/ledger.rs:134-178, rust/lance-table/src/system_index/frag_reuse/ledger.rs:182-315, rust/lance-table/src/system_index/frag_reuse/ledger.rs:381-478, rust/lance-table/src/system_index/frag_reuse/ledger.rs:480-543.
2. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-index) → rust/lance/src/index/frag_reuse_reader.rs:464-464, rust/lance/src/index/frag_reuse_reader.rs:467-491.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/frag_reuse/lineage.rs.md) → rust/lance-table/src/system_index/frag_reuse/lineage.rs:36-43.

<a id="scenario-32"></a>

### Local MemWAL generation publication preparation

[Scenario](scenarios.md#local-memwal-generation-publication-preparation) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:466-590, rust/lance-table/src/transaction/manifest_build.rs:593-2025.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/system_index/mem_wal.rs.md) → rust/lance-table/src/system_index/mem_wal.rs:531-538, rust/lance-table/src/system_index/mem_wal.rs:540-585, rust/lance-table/src/system_index/mem_wal.rs:587-618.
3. [Module Map](../L1-modules/rust-lance.md#rust-lance-src) → rust/lance/src/index.rs:4713-4743.
4. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/commit.rs:1342-1420, rust/lance/src/io/commit.rs:1579-1623, rust/lance/src/io/commit.rs:1841-1932.

<a id="scenario-33"></a>

### Manifest body write/read and deletion-object trace

[Scenario](scenarios.md#manifest-body-writeread-and-deletion-object-trace) · [Decision contract](../L3-symbols/protocol-commit.md)

**Local subtask 1: manifest_build, manifest, commit, manifest, deletion.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/transaction/manifest_build.rs.md) → rust/lance-table/src/transaction/manifest_build.rs:2008-2025.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/manifest.rs.md) → rust/lance-table/src/io/manifest.rs:32-175, rust/lance-table/src/io/manifest.rs:177-230.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit.rs.md) → rust/lance-table/src/io/commit.rs:213-230.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:403-431.
5. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/deletion.rs.md) → rust/lance-table/src/io/deletion.rs:61-216.

**Local subtask 2: fragment, deletion.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset) → rust/lance/src/dataset/fragment.rs:3005-3036.
2. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-io) → rust/lance/src/io/deletion.rs:11-43.

<a id="scenario-34"></a>

### Single-attempt conditional and locked commit traces

[Scenario](scenarios.md#single-attempt-conditional-and-locked-commit-traces) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit.rs.md) → rust/lance-table/src/io/commit.rs:298-313, rust/lance-table/src/io/commit.rs:983-992, rust/lance-table/src/io/commit.rs:1057-1102, rust/lance-table/src/io/commit.rs:1389-1502, rust/lance-table/src/io/commit.rs:1634-1676.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/manifest.rs.md) → rust/lance-table/src/io/manifest.rs:32-128, rust/lance-table/src/io/manifest.rs:177-209.

<a id="scenario-35"></a>

### External publication, repair and conditioned history

[Scenario](scenarios.md#external-publication-repair-and-conditioned-history) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/external_manifest.rs.md) → rust/lance-table/src/io/commit/external_manifest.rs:35-102, rust/lance-table/src/io/commit/external_manifest.rs:216-261, rust/lance-table/src/io/commit/external_manifest.rs:434-485, rust/lance-table/src/io/commit/external_manifest.rs:907-961, rust/lance-table/src/io/commit/external_manifest.rs:963-1011, rust/lance-table/src/io/commit/external_manifest.rs:1030-1121, rust/lance-table/src/io/commit/external_manifest.rs:1123-1149, rust/lance-table/src/io/commit/external_manifest.rs:1151-1162.

<a id="scenario-36"></a>

### DynamoDB generic commit and stable-ID lookup traces

[Scenario](scenarios.md#dynamodb-generic-commit-and-stable-id-lookup-traces) · [Decision contract](../L3-symbols/protocol-commit.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit.rs.md) → rust/lance-table/src/io/commit.rs:1139-1169.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/dynamodb.rs.md) → rust/lance-table/src/io/commit/dynamodb.rs:162-265, rust/lance-table/src/io/commit/dynamodb.rs:423-484.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/commit/external_manifest.rs.md) → rust/lance-table/src/io/commit/external_manifest.rs:35-102, rust/lance-table/src/io/commit/external_manifest.rs:963-1011.
4. [frozen/Key File contract](../L2-files/rust/lance-table/src/rowids/index.rs.md) → rust/lance-table/src/rowids/index.rs:62-183, rust/lance-table/src/rowids/index.rs:276-435, rust/lance-table/src/rowids/index.rs:502-752.

<a id="scenario-37"></a>

### Scheduled batches to visible rows

[Scenario](scenarios.md#scheduled-batches-to-visible-rows) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset) → rust/lance/src/dataset/fragment.rs:3681-3720, rust/lance/src/dataset/fragment.rs:3873-3917.
2. [frozen/Key File contract](../L2-files/rust/lance-table/src/utils/stream.rs.md) → rust/lance-table/src/utils/stream.rs:489-641, rust/lance-table/src/utils/stream.rs:692-848.

<a id="scenario-38"></a>

### File runtime entry paths

[Scenario](scenarios.md#file-runtime-entry-paths-local-not-complete-dataset-write) · [Decision contract](../L3-symbols/behavior-contracts.md)

**Local subtask 1: version, mod, writer, field_types, structural.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/version.rs.md) → rust/lance-file/src/version.rs:59-75.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/mod.rs.md) → rust/lance-file/src/versions/mod.rs:151-198, rust/lance-file/src/versions/mod.rs:279-326, rust/lance-file/src/versions/mod.rs:328-372.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer.rs.md) → rust/lance-file/src/writer.rs:160-189.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer/field_types.rs.md) → rust/lance-file/src/writer/field_types.rs:87-128.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer/structural.rs.md) → rust/lance-file/src/writer/structural.rs:610-630.

**Local subtask 2: writer, reader, io.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_0/writer.rs.md) → rust/lance-file/src/versions/v2_0/writer.rs:458-477.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader.rs.md) → rust/lance-file/src/reader.rs:934-944.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/io.rs.md) → rust/lance-file/src/io.rs:51-148.

<a id="scenario-39"></a>

### Structural projection subtrace

[Scenario](scenarios.md#structural-projection-subtrace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader/structural.rs.md) → rust/lance-file/src/reader/structural.rs:319-431.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader.rs.md) → rust/lance-file/src/reader.rs:539-569.

<a id="scenario-40"></a>

### Metadata finishing subtrace

[Scenario](scenarios.md#metadata-finishing-subtrace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_0/reader.rs.md) → rust/lance-file/src/versions/v2_0/reader.rs:150-175, rust/lance-file/src/versions/v2_0/reader.rs:350-395.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/reader.rs.md) → rust/lance-file/src/versions/v2_1/reader.rs:170-267.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/reader.rs.md) → rust/lance-file/src/versions/v2_2/reader.rs:172-269.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/reader.rs.md) → rust/lance-file/src/versions/v2_3/reader.rs:249-346.

<a id="scenario-41"></a>

### Current structural file write subtrace

[Scenario](scenarios.md#current-structural-file-write-subtrace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/writer.rs.md) → rust/lance-file/src/versions/v2_1/writer.rs:78-94.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/writer/structural.rs.md) → rust/lance-file/src/writer/structural.rs:206-259, rust/lance-file/src/writer/structural.rs:312-340, rust/lance-file/src/writer/structural.rs:414-455, rust/lance-file/src/writer/structural.rs:598-650, rust/lance-file/src/writer/structural.rs:705-801.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/writer.rs.md) → rust/lance-file/src/versions/v2_2/writer.rs:152-186.

<a id="scenario-44"></a>

### Shared reader open, prepare and consume

[Scenario](scenarios.md#shared-reader-open-prepare-and-consume) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader.rs.md) → rust/lance-file/src/reader.rs:457-468, rust/lance-file/src/reader.rs:946-1107, rust/lance-file/src/reader.rs:1158-1474, rust/lance-file/src/reader.rs:1612-1669, rust/lance-file/src/reader.rs:1713-1743, rust/lance-file/src/reader.rs:1745-1877, rust/lance-file/src/reader.rs:1968-2072, rust/lance-file/src/reader.rs:2178-2211.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/reader/structural.rs.md) → rust/lance-file/src/reader/structural.rs:393-431.

<a id="scenario-45"></a>

### Local encoded-concatenation trace

[Scenario](scenarios.md#local-encoded-concatenation-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

**Local subtask 1: concat, mod, mod, page_table, metadata.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/concat.rs.md) → rust/lance-file/src/concat.rs:140-225, rust/lance-file/src/concat.rs:697-806, rust/lance-file/src/concat.rs:808-1048, rust/lance-file/src/concat.rs:1091-1131, rust/lance-file/src/concat.rs:1151-1183.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/mod.rs.md) → rust/lance-file/src/versions/v1/mod.rs:25-116.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:393-459, rust/lance-file/src/versions/v1/writer/mod.rs:627-651.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/page_table.rs.md) → rust/lance-file/src/versions/v1/page_table.rs:53-92, rust/lance-file/src/versions/v1/page_table.rs:94-145.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) → rust/lance-file/src/versions/v1/format/metadata.rs:14-78.

**Local subtask 2: reader.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) → rust/lance-file/src/versions/v1/reader.rs:165-206, rust/lance-file/src/versions/v1/reader.rs:240-267, rust/lance-file/src/versions/v1/reader.rs:342-396.

<a id="scenario-46"></a>

### Frozen V1 value roundtrip subtrace

[Scenario](scenarios.md#frozen-v1-value-roundtrip-subtrace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:406-459.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding/binary.rs.md) → rust/lance-file/src/versions/v1/encoding/binary.rs:48-105, rust/lance-file/src/versions/v1/encoding/binary.rs:153-232.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding/plain.rs.md) → rust/lance-file/src/versions/v1/encoding/plain.rs:90-115.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) → rust/lance-file/src/versions/v1/reader.rs:625-642, rust/lance-file/src/versions/v1/reader.rs:645-668.
5. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/encoding/dictionary.rs.md) → rust/lance-file/src/versions/v1/encoding/dictionary.rs:122-159.

<a id="scenario-47"></a>

### Frozen V1 full local read trace

[Scenario](scenarios.md#frozen-v1-full-local-read-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-table/src/format/manifest.rs.md) → rust/lance-table/src/format/manifest.rs:1220-1246.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/reader.rs.md) → rust/lance-file/src/versions/v1/reader.rs:139-288, rust/lance-file/src/versions/v1/reader.rs:324-507, rust/lance-file/src/versions/v1/reader.rs:509-808.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/format/metadata.rs.md) → rust/lance-file/src/versions/v1/format/metadata.rs:128-163.

<a id="scenario-48"></a>

### Complete local V1 write-to-read trace

[Scenario](scenarios.md#complete-local-v1-write-to-read-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [Module Map](../L1-modules/rust-lance.md#rust-lance-src-dataset) → rust/lance/src/dataset/write.rs:2084-2095, rust/lance/src/dataset/write.rs:2317-2345.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:166-236, rust/lance-file/src/versions/v1/writer/mod.rs:255-270, rust/lance-file/src/versions/v1/writer/mod.rs:462-586, rust/lance-file/src/versions/v1/writer/mod.rs:588-651.
3. [frozen/Key File contract](../L2-files/rust/lance-table/src/io/manifest.rs.md) → rust/lance-table/src/io/manifest.rs:232-250.

<a id="scenario-49"></a>

### Local V1 statistics trace

[Scenario](scenarios.md#local-v1-statistics-trace) · [Decision contract](../L3-symbols/behavior-contracts.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/mod.rs.md) → rust/lance-file/src/versions/v1/writer/mod.rs:109-137, rust/lance-file/src/versions/v1/writer/mod.rs:189-199, rust/lance-file/src/versions/v1/writer/mod.rs:588-651.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v1/writer/statistics.rs.md) → rust/lance-file/src/versions/v1/writer/statistics.rs:47-482, rust/lance-file/src/versions/v1/writer/statistics.rs:619-686.

<a id="scenario-53"></a>

### Read stable V2_0 through production code

[Scenario](scenarios.md#decode-the-pinned-standard-v2_0-file) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/version.rs.md) → rust/lance-file/src/version.rs:200-262.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding-src-array-encoding) → rust/lance-encoding/src/array_encoding/logical/list.rs:1116-1243.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:1710-1785.
4. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding-src-array-encoding) → rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399.

<a id="scenario-55"></a>

### Read stable V2_2 through production code

[Scenario](scenarios.md#decode-the-pinned-standard-v2_2-file) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/protos/file2.proto.md) → protos/file2.proto:40-93.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:5751-6062.
3. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-arrow) → rust/lance-arrow/src/scalar.rs:61-191.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/constant.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/constant.rs:219-259.

<a id="scenario-56"></a>

### Local metadata and IO handoff

[Scenario](scenarios.md#local-metadata-and-io-handoff) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: build, format, reader, reader, lib.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/build.rs:15-20.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/format.rs.md) → rust/lance-encoding/src/format.rs:4-33, rust/lance-encoding/src/format.rs:312-827.
3. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_1/reader.rs.md) → rust/lance-file/src/versions/v2_1/reader.rs:99-151.
4. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/reader.rs.md) → rust/lance-file/src/versions/v2_2/reader.rs:99-153.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/lib.rs.md) → rust/lance-encoding/src/lib.rs:33-134.

**Local subtask 2: io, decoder.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/io.rs.md) → rust/lance-file/src/io.rs:17-148.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/decoder.rs.md) → rust/lance-encoding/src/decoder.rs:3412-3440.

<a id="scenario-57"></a>

### Local configuration-to-buffer trace

[Scenario](scenarios.md#local-configuration-to-buffer-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

**Local subtask 1: compression_config, compression, compression, accumulation, primitive.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression_config.rs.md) → rust/lance-encoding/src/compression_config.rs:84-141.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_2/compression.rs.md) → rust/lance-file/src/versions/v2_2/compression.rs:27-38.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:560-591, rust/lance-encoding/src/compression.rs:1335-1353.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/utils/accumulation.rs.md) → rust/lance-encoding/src/utils/accumulation.rs:37-105.
5. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:7974-8005.

**Local subtask 2: block.** Select this set only when changing those mechanisms; the other sets are separate subproblems.

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/block.rs.md) → rust/lance-encoding/src/encodings/physical/block.rs:577-604, rust/lance-encoding/src/encodings/physical/block.rs:772-808.

<a id="scenario-58"></a>

### General mini-block subtrace

[Scenario](scenarios.md#general-mini-block-subtrace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:517-531, rust/lance-encoding/src/compression.rs:699-737, rust/lance-encoding/src/compression.rs:1133-1154.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/general.rs.md) → rust/lance-encoding/src/encodings/physical/general.rs:112-188, rust/lance-encoding/src/encodings/physical/general.rs:204-229.

<a id="scenario-59"></a>

### Raw FSL and bitpacking codec subtraces

[Scenario](scenarios.md#raw-fsl-and-bitpacking-codec-subtraces) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:339-457, rust/lance-encoding/src/compression.rs:745-775, rust/lance-encoding/src/compression.rs:1025-1109, rust/lance-encoding/src/compression.rs:1273-1337.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/value.rs.md) → rust/lance-encoding/src/encodings/physical/value.rs:323-455, rust/lance-encoding/src/encodings/physical/value.rs:516-852.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:353-406.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/bitpacking.rs.md) → rust/lance-encoding/src/encodings/physical/bitpacking.rs:220-314, rust/lance-encoding/src/encodings/physical/bitpacking.rs:500-564.

<a id="scenario-60"></a>

### Variable and BSS codec subtraces

[Scenario](scenarios.md#variable-and-bss-codec-subtraces) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:154-191, rust/lance-encoding/src/compression.rs:661-736, rust/lance-encoding/src/compression.rs:1061-1134, rust/lance-encoding/src/compression.rs:1213-1242.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/fsst.rs.md) → rust/lance-encoding/src/encodings/physical/fsst.rs:147-168, rust/lance-encoding/src/encodings/physical/fsst.rs:317-390.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:742-969.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:500-551.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/byte_stream_split.rs.md) → rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:109-324.

<a id="scenario-61"></a>

### Packed and statistics subtraces

[Scenario](scenarios.md#packed-and-statistics-subtraces) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:2027-2037.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/statistics.rs.md) → rust/lance-encoding/src/statistics.rs:73-137, rust/lance-encoding/src/statistics.rs:187-214, rust/lance-encoding/src/statistics.rs:579-594.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/packed.rs.md) → rust/lance-encoding/src/encodings/physical/packed.rs:40-103, rust/lance-encoding/src/encodings/physical/packed.rs:329-448, rust/lance-encoding/src/encodings/physical/packed.rs:637-897.

<a id="scenario-62"></a>

### Compression policy subtrace

[Scenario](scenarios.md#compression-policy-subtrace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_3/compression.rs.md) → rust/lance-file/src/versions/v2_3/compression.rs:31-101.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/compression.rs.md) → rust/lance-encoding/src/compression.rs:594-764, rust/lance-encoding/src/compression.rs:839-880, rust/lance-encoding/src/compression.rs:1034-1908.

<a id="scenario-63"></a>

### RLE local write/read trace

[Scenario](scenarios.md#rle-local-writeread-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/physical/rle.rs.md) → rust/lance-encoding/src/encodings/physical/rle.rs:142-328, rust/lance-encoding/src/encodings/physical/rle.rs:385-634, rust/lance-encoding/src/encodings/physical/rle.rs:727-1151, rust/lance-encoding/src/encodings/physical/rle.rs:1471-1632, rust/lance-encoding/src/encodings/physical/rle.rs:1925-1948.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:1302-1380.

<a id="scenario-64"></a>

### Arrow array to physical block and back

[Scenario](scenarios.md#arrow-array-to-physical-block-and-back) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:7575-7600.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/data.rs.md) → rust/lance-encoding/src/data.rs:735-963, rust/lance-encoding/src/data.rs:1192-1216, rust/lance-encoding/src/data.rs:1802-2044.

<a id="scenario-65"></a>

### Structural utility trace

[Scenario](scenarios.md#structural-utility-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/repdef.rs.md) → rust/lance-encoding/src/repdef.rs:510-590, rust/lance-encoding/src/repdef.rs:958-1230, rust/lance-encoding/src/repdef.rs:1251-1396, rust/lance-encoding/src/repdef.rs:1409-1589, rust/lance-encoding/src/repdef.rs:1615-2140, rust/lance-encoding/src/repdef.rs:2143-2548, rust/lance-encoding/src/repdef.rs:2550-2840.
2. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:7118-7162, rust/lance-encoding/src/encodings/logical/primitive.rs:7709-7729.
3. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/struct.rs:438-460.

<a id="scenario-66"></a>

### In-memory batch encoding trace

[Scenario](scenarios.md#in-memory-batch-encoding-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder.rs.md) → rust/lance-encoding/src/encoder.rs:331-358, rust/lance-encoding/src/encoder.rs:402-501.
2. [frozen/Key File contract](../L2-files/rust/lance-file/src/versions/v2_0/writer.rs.md) → rust/lance-file/src/versions/v2_0/writer.rs:453-505.

<a id="scenario-67"></a>

### Schedule and decode trace

[Scenario](scenarios.md#schedule-and-decode-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/decoder.rs.md) → rust/lance-encoding/src/decoder.rs:1211-1285, rust/lance-encoding/src/decoder.rs:1300-1539, rust/lance-encoding/src/decoder.rs:1636-1734, rust/lance-encoding/src/decoder.rs:2089-2199, rust/lance-encoding/src/decoder.rs:2202-2262, rust/lance-encoding/src/decoder.rs:2322-2353, rust/lance-encoding/src/decoder.rs:2466-2542, rust/lance-encoding/src/decoder.rs:2558-2589, rust/lance-encoding/src/decoder.rs:3221-3262.

<a id="scenario-68"></a>

### Constant page selection and dictionary validity trace

[Scenario](scenarios.md#constant-page-selection-and-dictionary-validity-trace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:131-195, rust/lance-encoding/src/encodings/logical/primitive.rs:4543-4572, rust/lance-encoding/src/encodings/logical/primitive.rs:7410-7457, rust/lance-encoding/src/encodings/logical/primitive.rs:7650-7688, rust/lance-encoding/src/encodings/logical/primitive.rs:7927-7972.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/constant.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/constant.rs:30-77, rust/lance-encoding/src/encodings/logical/primitive/constant.rs:129-280, rust/lance-encoding/src/encodings/logical/primitive/constant.rs:282-492.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/dict.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-170.

<a id="scenario-69"></a>

### Original Blob encode/read subtrace

[Scenario](scenarios.md#original-blob-encoderead-subtrace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → rust/lance-encoding/src/encoder/structural.rs:136-150.
2. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/blob.rs.md) → rust/lance-encoding/src/encodings/logical/blob.rs:43-227, rust/lance-encoding/src/encodings/logical/blob.rs:255-465.
3. [Module Map](../L1-modules/peripheral-maps.md#rust-lance-encoding) → rust/lance-encoding/src/encodings/logical/primitive.rs:4583-4611.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/primitive/blob.rs.md) → rust/lance-encoding/src/encodings/logical/primitive/blob.rs:70-109, rust/lance-encoding/src/encodings/logical/primitive/blob.rs:151-214, rust/lance-encoding/src/encodings/logical/primitive/blob.rs:262-290, rust/lance-encoding/src/encodings/logical/primitive/blob.rs:293-361, rust/lance-encoding/src/encodings/logical/primitive/blob.rs:363-552.

<a id="scenario-70"></a>

### Nested FSL/Map encode-decode subtrace

[Scenario](scenarios.md#nested-fslmap-encode-decode-subtrace) · [Decision contract](../L3-symbols/protocol-encoding.md)

1. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes.rs.md) → rust/lance-core/src/datatypes.rs:302-311.
2. [frozen/Key File contract](../L2-files/rust/lance-core/src/datatypes/field.rs.md) → rust/lance-core/src/datatypes/field.rs:1243-1278.
3. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encoder/structural.rs.md) → rust/lance-encoding/src/encoder/structural.rs:192-261.
4. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/fixed_size_list.rs.md) → rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:48-91, rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:127-253, rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:278-304.
5. [frozen/Key File contract](../L2-files/rust/lance-encoding/src/encodings/logical/map.rs.md) → rust/lance-encoding/src/encodings/logical/map.rs:43-73, rust/lance-encoding/src/encodings/logical/map.rs:102-173, rust/lance-encoding/src/encodings/logical/map.rs:192-237.

## Refresh-specific routes

### Deep clone managed blob objects

[Contract](../L3-symbols/refresh-2026-10-07.md#clone-and-garbage-collection). Read in order: `rust/lance/src/dataset.rs:3345-3395,3464-3473` → `rust/lance/src/io/commit.rs:427-629` → [selected helper](../L2-files/rust/lance/src/dataset/blob/clone.rs.md) → `rust/lance/src/dataset/blob/clone.rs:1-259` → `rust/lance/src/dataset/blob.rs:5281-5437`. For tagged metadata relocation, use the next separate route.

### Relocate tagged FRI during clone

[Contract](../L3-symbols/refresh-2026-10-07.md#clone-and-garbage-collection). Read `rust/lance/src/io/commit.rs:427-629` → `rust/lance/src/index/frag_reuse.rs:2185-2415` → `rust/lance-table/src/system_index/frag_reuse/ledger.rs:108-255`.

### Trim or prune tagged fragment-reuse history

[Contract](../L3-symbols/refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency). Read `rust/lance/src/dataset/index/frag_reuse.rs:355-450,650-895` → `rust/lance/src/io/commit/conflict_resolver.rs:2840-2910` → `rust/lance-table/src/system_index/frag_reuse/gate.rs:85-140` → `rust/lance-table/src/system_index/frag_reuse/ledger.rs:108-255`.

### Stream index remapping across tagged transitions

[Contract](../L3-symbols/refresh-2026-10-07.md#fragment-reuse-remapping-and-concurrency). Read `rust/lance/src/dataset/optimize/remapping.rs:486-604,864-1100` → `rust/lance-index-core/src/remapping.rs:92-218,259-362` → `rust/lance-index-core/src/scalar.rs:666-723` → `rust/lance-index/src/scalar/registry.rs:169-209`.

### Evolve transaction history without blocking dataset opens

[Contract](../L3-symbols/refresh-2026-10-07.md#manifest-transaction-compatibility). Read `protos/table.proto:194-211` → `rust/lance-table/src/format/manifest.rs:1102-1105,1184-1185` → `rust/lance-table/src/transaction/proto.rs:404-406,709-715` → `rust/lance/src/io/commit/conflict_resolver.rs:458-463,638-704,2466-2512`. New write operations must still follow the separate operation-registration route.

### Extend public schema projection or count pushdown

[Contract](../L3-symbols/refresh-2026-10-07.md#query-and-public-api-changes). Read `rust/lance/src/dataset/scanner.rs:1864-1867,3144-3174` → `rust/lance-datafusion/src/projection.rs:311-315,351-355` → `rust/lance/src/io/exec/count_pushdown.rs:394-423` → `rust/lance/src/io/exec/filtered_read.rs:3535-3552`.

## October 9 implementation routes

### Count with selected scalar index segments

[Contract](../L3-symbols/refresh-2026-10-09.md#indexed-counting-and-public-apis). Read `rust/lance/src/dataset/scanner.rs:1447-1656,3444-3496` → `rust/lance/src/io/exec/scalar_index.rs:1-300` → `rust/lance/src/index/scalar_logical.rs:270-425`. For Java forwarding, add `java/src/main/java/org/lance/Dataset.java:1485-1559` and `java/lance-jni/src/blocking_dataset.rs:4016-4142`; the native count methods parse UUIDs and delegate to Rust. Java remains mapped only.

### Add or customize top-k late materialization

[Selected Key File](../L2-files/rust/lance/src/io/exec/topk_late_materialization.rs.md). Read `rust/lance/src/io/exec/topk_late_materialization.rs:69-446` → `rust/lance/src/io/exec/filtered_read.rs:2847-2892` → `rust/lance/src/io/exec/take.rs:574-623,697-701`. The filter-read projection helper is included in this route; do not infer that this rule is automatically registered.

### Evolve a MemWAL writer schema

[Contract](../L3-symbols/refresh-2026-10-09.md#memwal-schema-ownership-and-reads). Read `rust/lance/src/dataset/mem_wal/api.rs:857-926` → `rust/lance/src/dataset/mem_wal/write.rs:1867-1903,1991-2013,3895-3999` → `rust/lance/src/dataset/mem_wal/scanner/generation_read.rs:84-158,410-448` → `rust/lance/src/dataset/schema_evolution.rs:491-531,851-874`. WAL replay is a separate subtask: `rust/lance/src/dataset/mem_wal/wal.rs:44-62,1117-1125` → `rust/lance/src/dataset/mem_wal/write.rs:1522-1550`.

### Preserve deleted physical rows during column updates

[Contract](../L3-symbols/refresh-2026-10-09.md#updater-and-cleanup). Read `rust/lance/src/dataset/updater.rs:116-210,272-460,572-600,759-796` → `rust/lance/src/dataset/updater/blanks.rs:24-65,293-354,458-499,875-1059`.

### Change managed cleanup scanning or cascade throttling

[Contract](../L3-symbols/refresh-2026-10-09.md#updater-and-cleanup). Read `rust/lance/src/dataset/cleanup.rs:313-339,594-681,1073-1085,1584-1595,1920-1928` → `rust/lance/src/dataset/blob.rs:5281-5346` → `rust/lance/src/dataset/blob/clone.rs:227-244`.

### Extend streaming coreset training

[Contract and mapped-only boundary](../L3-symbols/refresh-2026-10-09.md#vector-training-maps). Read `rust/lance/src/index/vector/ivf.rs:3837-3877,5033-5058` → `rust/lance/src/index/vector/ivf/coreset_algo/mod.rs:1-92` → choose `rust/lance/src/index/vector/ivf/coreset_algo/float_coreset.rs:1-174` or `rust/lance/src/index/vector/ivf/coreset_algo/hamming_coreset.rs:1-140`. For Hamming details, read `rust/lance/src/index/vector/ivf/streaming_hamming.rs:1-180,423-492,714-854` → `rust/lance/src/index/vector/ivf/streaming_hamming/counter.rs:1-120`. Float and Hamming are separate branches, each at most five files.

### Retrieve current Python version summary

[Contract](../L3-symbols/refresh-2026-10-09.md#indexed-counting-and-public-apis). Read `python/python/lance/dataset.py:3165-3194,6135-6143` → `python/src/dataset.rs:924-934,2141-2153` → the retained Dataset version contract in [Dataset map](../L1-modules/rust-lance.md).

## October 11 implementation routes

### Activate non-reusable field IDs

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/dataset.rs:3300-3343` → `rust/lance-table/src/transaction/manifest_build.rs:190-204` → `protos/table.proto:167-174,281-292` → `rust/lance-table/src/feature_flags.rs:102-114,405-427` → `rust/lance-table/src/format/manifest.rs:478-522`.

### Canonicalize transaction identities

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-table/src/transaction/validate.rs:20-139,196-243,303-375` → `rust/lance/src/io/commit.rs:1812-1828` → `rust/lance-table/src/transaction/validate.rs:477-623,826-986`.

### Resolve deferred compaction index conflicts

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/io/commit/conflict_resolver.rs:564-635,1226-1243,1355-1402,3300-3384` → `rust/lance/src/io/commit.rs:1767-1797`.

### Extend unstable sequence encoding

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-encoding/src/compression.rs:1375-1754` → `rust/lance-encoding/src/encodings/physical/sequence/decoder.rs:33-117` → `rust/lance-encoding/src/encodings/physical/sequence.rs:78-277` → `rust/lance-encoding/src/encodings/physical/binary.rs:446-508,594-698`.

### Keep stable encoding readers isolated

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-file/src/versions/v2_1/reader.rs:25-108` → `rust/lance-file/src/versions/v2_2/reader.rs:25-114` → `rust/lance-file/src/versions/v2_3/compression.rs:51-65` → `rust/lance-file/src/versions/v2_3/reader.rs:28-186`.

### Implement physical fragment slices

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/dataset/fragment_slice.rs:11-92` → `rust/lance/src/dataset/scanner.rs:1929-1993` → `rust/lance/src/dataset/scanner.rs:1934-1942,3412-3429` → `protos/filtered_read.proto:77-86` → `rust/lance/src/io/exec/topk_late_materialization.rs:163-178`.

### Tune adaptive vector search effort

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-index/src/vector.rs:107-144,176-185,224-235` → `rust/lance/src/dataset/scanner.rs:2457-2555` → `rust/lance/src/io/exec/knn/adaptive_probe.rs:44-103,189-224` → `protos/ann.proto:71-75`.

### Preserve Python schema provenance

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `python/src/dataset.rs:3163-3285` → `python/src/schema.rs:130-143` → `python/src/blob.rs:240-272`.

### Forward Python search effort and delta bounds

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `python/python/lance/dataset.py:5521-5530,7205-7265,8790-8833` → `python/src/dataset.rs:5803-5831,5962-5966`.

### Implement a MemWAL index plugin

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/dataset/mem_wal/index/plugin.rs:437-575,578-706` → `rust/lance/src/dataset/mem_wal/index/plugin.rs:296-436` → `rust/lance/src/dataset/mem_wal/index/query.rs:128-180`.

### Configure MemWAL plugin overrides

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/dataset/mem_wal/write.rs:217-240,418-446` → `rust/lance/src/dataset/mem_wal/api.rs:955-975,1032-1149`.

### Preserve index coverage evidence

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/index.rs:157-165,333-404,428-517,519-750`.

### Extend cache priority and visibility

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-core/src/cache/backend.rs:48-124` → `rust/lance-core/src/cache/moka.rs:108-116` → `rust/lance-core/src/cache/quick.rs:209-238` → `rust/lance-core/src/cache/mod.rs:143-146,376-463` → `rust/lance-core/src/cache/quick.rs:157-194,244-307` → `rust/lance-core/src/cache/priority.rs:27-98`.

### Decode cached row selections

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-core/src/cache/codec.rs:191-253,385-475`.

### Resolve cloud credential option precedence

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-io/src/object_store.rs:1692-1749` → `rust/lance-io/src/object_store/providers/aws.rs:614-646`.

### Change scan byte estimates

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance/src/io/exec/utils.rs:1074-1122,1185-1257`.

### Enter the local JSONB implementation

[Current contract](../L3-symbols/refresh-2026-10-11.md). Read `rust/lance-jsonb/src/lib.rs:6-103`.


## October 12 implementation routes

### Preserve MemWAL generation column identities

[Contract](../L3-symbols/refresh-2026-10-12.md). Read `rust/lance/src/dataset/write/insert.rs:54-91` → `rust/lance/src/dataset/write/insert.rs:245-263` → `rust/lance/src/dataset/write.rs:1833-1880` → `rust/lance/src/dataset/versions/mod.rs:137-180` → `rust/lance/src/dataset/mem_wal/memtable/flush.rs:469-480`.

### Publish a generation with preserved field IDs

[Contract](../L3-symbols/refresh-2026-10-12.md). Read `rust/lance/src/dataset/write/insert.rs:107-183` → `rust/lance/src/dataset/write/commit.rs:57-89,303-308,498-519` → `rust/lance/src/io/commit.rs:427-450,788-805`.

### Return namespace insert counts and versions

[Contract](../L3-symbols/refresh-2026-10-12.md). Read `rust/lance-namespace-impls/src/dir.rs:5149-5188` → `rust/lance-namespace-impls/src/dir.rs:5159-5187` → `python/python/lance/namespace.py:552-573,1151-1172` → `rust/lance-namespace/src/namespace.rs:179-187`.

### Interpret spilled-lineage stability and gating

[Contract](../L3-symbols/refresh-2026-10-12.md). Read `protos/fragment_metadata.proto:289-305` → `rust/lance-table/src/feature_flags.rs:68-81,214-221,262-267`.
