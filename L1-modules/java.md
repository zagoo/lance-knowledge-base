# Java and JNI Module Map

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refreshed 2026-10-04 against `ad12ed9e15e0046688b00568d0ac1a347fb2d328`; changed-source pointers re-anchored. Unchanged analysis retained.

**Trust: mapped only — no deep Java/JNI contracts.** Source snapshot `ad12ed9e15e0046688b00568d0ac1a347fb2d328`. [Entry](../README.md) · [Scope](../V21-PROTOCOL.md) · [Format](../L3-symbols/format-spec.md).

Java API wrappers live in java/src/main/java/org/lance; JNI adapters live in java/lance-jni/src. Match public option objects and native signatures through the corresponding operation-named file before changing the Rust API. Follow java/AGENTS.md for Java 11, ./mvnw and option/enum conventions. No Java builds or tests were run.

## Module Map

<a id="java-lance-jni-src"></a>

### `java/lance-jni/src/`

Mapped-only JNI boundary: blocking/async Dataset/scanner, fragment/file/blob/index/transaction/update/MemWAL and runtime/error helpers. This maps ownership, not native memory/lifetime correctness.

| Source file | Production ranges | Coverage |
|---|---|---|
| `java/lance-jni/src/async_scanner.rs` | 1-396 | mapped |
| `java/lance-jni/src/blocking_blob.rs` | 1-290 | mapped |
| `java/lance-jni/src/blocking_dataset.rs` | 1-4357 | mapped |
| `java/lance-jni/src/blocking_scanner.rs` | 1-976 | mapped |
| `java/lance-jni/src/delta.rs` | 1-229 | mapped |
| `java/lance-jni/src/dispatcher.rs` | 1-163 | mapped |
| `java/lance-jni/src/error.rs` | 1-251 | mapped |
| `java/lance-jni/src/file_reader.rs` | 1-357 | mapped |
| `java/lance-jni/src/file_writer.rs` | 1-217 | mapped |
| `java/lance-jni/src/fragment.rs` | 1-1125 | mapped |
| `java/lance-jni/src/index.rs` | 1-252 | mapped |
| `java/lance-jni/src/index_progress.rs` | 1-214 | mapped |
| `java/lance-jni/src/lib.rs` | 1-210 | mapped |
| `java/lance-jni/src/mem_wal.rs` | 1-1585 | mapped |
| `java/lance-jni/src/merge_insert.rs` | 1-344 | mapped |
| `java/lance-jni/src/namespace.rs` | 1-3841 | mapped |
| `java/lance-jni/src/optimize.rs` | 1-580 | mapped |
| `java/lance-jni/src/otel.rs` | 1-474 | mapped |
| `java/lance-jni/src/schema.rs` | 1-429 | mapped |
| `java/lance-jni/src/session.rs` | 1-274 | mapped |
| `java/lance-jni/src/sql.rs` | 1-97 | mapped |
| `java/lance-jni/src/task_tracker.rs` | 1-110 | mapped |
| `java/lance-jni/src/transaction.rs` | 1-2457 | mapped |
| `java/lance-jni/src/update.rs` | 1-141 | mapped |
| `java/lance-jni/src/utils.rs` | 1-775 | mapped |
| `java/lance-jni/src/vector_trainer.rs` | 1-203 | mapped |
<a id="java-src-main-java-org-lance"></a>

### `java/src/main/java/org/lance/`

Mapped-only public Java API and supporting option/result types. Child packages identify cleanup, compaction, delta, file/fragment, index variants, IPC, MemWAL, merge, namespace, operations, telemetry, schema and update responsibilities. Keep option serialization aligned with JNI and Rust.

| Source file | Production ranges | Coverage |
|---|---|---|
| `java/src/main/java/org/lance/BasePath.java` | 1-58 | mapped |
| `java/src/main/java/org/lance/BlobFile.java` | 1-121 | mapped |
| `java/src/main/java/org/lance/Branch.java` | 1-167 | mapped |
| `java/src/main/java/org/lance/CacheBackendConfig.java` | 1-113 | mapped |
| `java/src/main/java/org/lance/CacheStats.java` | 1-105 | mapped |
| `java/src/main/java/org/lance/CleanupOperation.java` | 1-74 | mapped |
| `java/src/main/java/org/lance/CommitBuilder.java` | 1-359 | mapped |
| `java/src/main/java/org/lance/ContextIndexBuildProgress.java` | 1-134 | mapped |
| `java/src/main/java/org/lance/DataStorageVersion.java` | 1-64 | mapped |
| `java/src/main/java/org/lance/Dataset.java` | 1-2642 | mapped |
| `java/src/main/java/org/lance/DocumentGranularity.java` | 1-34 | mapped |
| `java/src/main/java/org/lance/Fragment.java` | 1-495 | mapped |
| `java/src/main/java/org/lance/FragmentMetadata.java` | 1-184 | mapped |
| `java/src/main/java/org/lance/FragmentOperation.java` | 1-90 | mapped |
| `java/src/main/java/org/lance/FragmentStatistics.java` | 1-55 | mapped |
| `java/src/main/java/org/lance/LanceConstants.java` | 1-41 | mapped |
| `java/src/main/java/org/lance/LanceException.java` | 1-48 | mapped |
| `java/src/main/java/org/lance/LanceTimeoutException.java` | 1-28 | mapped |
| `java/src/main/java/org/lance/LockManager.java` | 1-112 | mapped |
| `java/src/main/java/org/lance/ManifestLocation.java` | 1-58 | mapped |
| `java/src/main/java/org/lance/ManifestNamingScheme.java` | 1-22 | mapped |
| `java/src/main/java/org/lance/ManifestSummary.java` | 1-115 | mapped |
| `java/src/main/java/org/lance/MetadataColumns.java` | 1-21 | mapped |
| `java/src/main/java/org/lance/OpenDatasetBuilder.java` | 1-267 | mapped |
| `java/src/main/java/org/lance/ReadOptions.java` | 1-326 | mapped |
| `java/src/main/java/org/lance/Ref.java` | 1-91 | mapped |
| `java/src/main/java/org/lance/RowAddress.java` | 1-21 | mapped |
| `java/src/main/java/org/lance/Session.java` | 1-377 | mapped |
| `java/src/main/java/org/lance/SourcedTransaction.java` | 1-168 | mapped |
| `java/src/main/java/org/lance/SqlQuery.java` | 1-80 | mapped |
| `java/src/main/java/org/lance/Tag.java` | 1-123 | mapped |
| `java/src/main/java/org/lance/Transaction.java` | 1-191 | mapped |
| `java/src/main/java/org/lance/Version.java` | 1-77 | mapped |
| `java/src/main/java/org/lance/WriteDatasetBuilder.java` | 1-611 | mapped |
| `java/src/main/java/org/lance/WriteFragmentBuilder.java` | 1-384 | mapped |
| `java/src/main/java/org/lance/WriteParams.java` | 1-323 | mapped |
| `java/src/main/java/org/lance/WriterVersion.java` | 1-57 | mapped |
| `java/src/main/java/org/lance/cleanup/CleanupCandidateFile.java` | 1-50 | mapped |
| `java/src/main/java/org/lance/cleanup/CleanupExplanation.java` | 1-72 | mapped |
| `java/src/main/java/org/lance/cleanup/CleanupFileKind.java` | 1-43 | mapped |
| `java/src/main/java/org/lance/cleanup/CleanupPolicy.java` | 1-150 | mapped |
| `java/src/main/java/org/lance/cleanup/CleanupReferencedBranch.java` | 1-39 | mapped |
| `java/src/main/java/org/lance/cleanup/RemovalStats.java` | 1-99 | mapped |
| `java/src/main/java/org/lance/compaction/Compaction.java` | 1-159 | mapped |
| `java/src/main/java/org/lance/compaction/CompactionMetrics.java` | 1-60 | mapped |
| `java/src/main/java/org/lance/compaction/CompactionMode.java` | 1-34 | mapped |
| `java/src/main/java/org/lance/compaction/CompactionOptions.java` | 1-437 | mapped |
| `java/src/main/java/org/lance/compaction/CompactionPlan.java` | 1-45 | mapped |
| `java/src/main/java/org/lance/compaction/CompactionTask.java` | 1-101 | mapped |
| `java/src/main/java/org/lance/compaction/RewriteResult.java` | 1-70 | mapped |
| `java/src/main/java/org/lance/compaction/TaskData.java` | 1-32 | mapped |
| `java/src/main/java/org/lance/delta/DatasetDelta.java` | 1-123 | mapped |
| `java/src/main/java/org/lance/delta/DatasetDeltaBuilder.java` | 1-85 | mapped |
| `java/src/main/java/org/lance/file/BlobReadMode.java` | 1-41 | mapped |
| `java/src/main/java/org/lance/file/FileReadOptions.java` | 1-59 | mapped |
| `java/src/main/java/org/lance/file/FileWriteOptions.java` | 1-80 | mapped |
| `java/src/main/java/org/lance/file/LanceFileReader.java` | 1-170 | mapped |
| `java/src/main/java/org/lance/file/LanceFileWriter.java` | 1-184 | mapped |
| `java/src/main/java/org/lance/fragment/DataFile.java` | 1-112 | mapped |
| `java/src/main/java/org/lance/fragment/DeletionFile.java` | 1-117 | mapped |
| `java/src/main/java/org/lance/fragment/DeletionFileType.java` | 1-19 | mapped |
| `java/src/main/java/org/lance/fragment/FragmentMergeResult.java` | 1-50 | mapped |
| `java/src/main/java/org/lance/fragment/FragmentUpdateResult.java` | 1-112 | mapped |
| `java/src/main/java/org/lance/fragment/RowIdMeta.java` | 1-75 | mapped |
| `java/src/main/java/org/lance/fragment/VersionMeta.java` | 1-62 | mapped |
| `java/src/main/java/org/lance/index/DistanceType.java` | 1-21 | mapped |
| `java/src/main/java/org/lance/index/Index.java` | 1-354 | mapped |
| `java/src/main/java/org/lance/index/IndexBuildProgress.java` | 1-55 | mapped |
| `java/src/main/java/org/lance/index/IndexCriteria.java` | 1-98 | mapped |
| `java/src/main/java/org/lance/index/IndexDescription.java` | 1-129 | mapped |
| `java/src/main/java/org/lance/index/IndexFile.java` | 1-61 | mapped |
| `java/src/main/java/org/lance/index/IndexOptions.java` | 1-194 | mapped |
| `java/src/main/java/org/lance/index/IndexParams.java` | 1-90 | mapped |
| `java/src/main/java/org/lance/index/IndexType.java` | 1-46 | mapped |
| `java/src/main/java/org/lance/index/OptimizeOptions.java` | 1-105 | mapped |
| `java/src/main/java/org/lance/index/scalar/BTreeIndexParams.java` | 1-96 | mapped |
| `java/src/main/java/org/lance/index/scalar/BitmapIndexParams.java` | 1-65 | mapped |
| `java/src/main/java/org/lance/index/scalar/InvertedIndexParams.java` | 1-531 | mapped |
| `java/src/main/java/org/lance/index/scalar/LabelListIndexParams.java` | 1-33 | mapped |
| `java/src/main/java/org/lance/index/scalar/NGramIndexParams.java` | 1-33 | mapped |
| `java/src/main/java/org/lance/index/scalar/ScalarIndexParams.java` | 1-98 | mapped |
| `java/src/main/java/org/lance/index/scalar/ZoneMapIndexParams.java` | 1-66 | mapped |
| `java/src/main/java/org/lance/index/scalar/ZoneStats.java` | 1-116 | mapped |
| `java/src/main/java/org/lance/index/vector/HnswBuildParams.java` | 1-115 | mapped |
| `java/src/main/java/org/lance/index/vector/IvfBuildParams.java` | 1-189 | mapped |
| `java/src/main/java/org/lance/index/vector/PQBuildParams.java` | 1-155 | mapped |
| `java/src/main/java/org/lance/index/vector/RQBuildParams.java` | 1-53 | mapped |
| `java/src/main/java/org/lance/index/vector/SQBuildParams.java` | 1-73 | mapped |
| `java/src/main/java/org/lance/index/vector/VectorIndexParams.java` | 1-282 | mapped |
| `java/src/main/java/org/lance/index/vector/VectorTrainer.java` | 1-114 | mapped |
| `java/src/main/java/org/lance/ipc/ApproxMode.java` | 1-42 | mapped |
| `java/src/main/java/org/lance/ipc/AsyncScanner.java` | 1-235 | mapped |
| `java/src/main/java/org/lance/ipc/ColumnOrdering.java` | 1-76 | mapped |
| `java/src/main/java/org/lance/ipc/DataStatistics.java` | 1-47 | mapped |
| `java/src/main/java/org/lance/ipc/FieldStatistics.java` | 1-42 | mapped |
| `java/src/main/java/org/lance/ipc/FullTextQuery.java` | 1-608 | mapped |
| `java/src/main/java/org/lance/ipc/LanceScanner.java` | 1-279 | mapped |
| `java/src/main/java/org/lance/ipc/MaterializationStyle.java` | 1-117 | mapped |
| `java/src/main/java/org/lance/ipc/Query.java` | 1-419 | mapped |
| `java/src/main/java/org/lance/ipc/ScanOptions.java` | 1-1068 | mapped |
| `java/src/main/java/org/lance/ipc/ScanStats.java` | 1-231 | mapped |
| `java/src/main/java/org/lance/memwal/CompactedSsTable.java` | 1-56 | mapped |
| `java/src/main/java/org/lance/memwal/ExecutionPlan.java` | 1-108 | mapped |
| `java/src/main/java/org/lance/memwal/InitializeMemWalParams.java` | 1-101 | mapped |
| `java/src/main/java/org/lance/memwal/LsmPointLookupPlanner.java` | 1-119 | mapped |
| `java/src/main/java/org/lance/memwal/LsmScanner.java` | 1-192 | mapped |
| `java/src/main/java/org/lance/memwal/LsmVectorSearchPlanner.java` | 1-231 | mapped |
| `java/src/main/java/org/lance/memwal/MemTableStats.java` | 1-182 | mapped |
| `java/src/main/java/org/lance/memwal/MemWalHnswParams.java` | 1-78 | mapped |
| `java/src/main/java/org/lance/memwal/MemWalIndexDetails.java` | 1-88 | mapped |
| `java/src/main/java/org/lance/memwal/ShardSnapshot.java` | 1-91 | mapped |
| `java/src/main/java/org/lance/memwal/ShardWriter.java` | 1-194 | mapped |
| `java/src/main/java/org/lance/memwal/ShardWriterConfig.java` | 1-185 | mapped |
| `java/src/main/java/org/lance/memwal/ShardingEvaluator.java` | 1-124 | mapped |
| `java/src/main/java/org/lance/memwal/ShardingField.java` | 1-96 | mapped |
| `java/src/main/java/org/lance/memwal/ShardingSpec.java` | 1-45 | mapped |
| `java/src/main/java/org/lance/memwal/SsTable.java` | 1-45 | mapped |
| `java/src/main/java/org/lance/memwal/WriteStats.java` | 1-101 | mapped |
| `java/src/main/java/org/lance/merge/MergeInsertParams.java` | 1-491 | mapped |
| `java/src/main/java/org/lance/merge/MergeInsertResult.java` | 1-34 | mapped |
| `java/src/main/java/org/lance/merge/MergeInsertStats.java` | 1-76 | mapped |
| `java/src/main/java/org/lance/namespace/DirectoryNamespace.java` | 1-932 | mapped |
| `java/src/main/java/org/lance/namespace/DynamicContextProvider.java` | 1-77 | mapped |
| `java/src/main/java/org/lance/namespace/RestAdapter.java` | 1-167 | mapped |
| `java/src/main/java/org/lance/namespace/RestNamespace.java` | 1-839 | mapped |
| `java/src/main/java/org/lance/operation/Append.java` | 1-73 | mapped |
| `java/src/main/java/org/lance/operation/Clone.java` | 1-136 | mapped |
| `java/src/main/java/org/lance/operation/CreateIndex.java` | 1-101 | mapped |
| `java/src/main/java/org/lance/operation/DataOverlay.java` | 1-219 | mapped |
| `java/src/main/java/org/lance/operation/DataReplacement.java` | 1-159 | mapped |
| `java/src/main/java/org/lance/operation/Delete.java` | 1-105 | mapped |
| `java/src/main/java/org/lance/operation/KeyExistenceFilter.java` | 1-125 | mapped |
| `java/src/main/java/org/lance/operation/Merge.java` | 1-110 | mapped |
| `java/src/main/java/org/lance/operation/Operation.java` | 1-28 | mapped |
| `java/src/main/java/org/lance/operation/Overwrite.java` | 1-157 | mapped |
| `java/src/main/java/org/lance/operation/Project.java` | 1-91 | mapped |
| `java/src/main/java/org/lance/operation/ReserveFragments.java` | 1-72 | mapped |
| `java/src/main/java/org/lance/operation/Restore.java` | 1-72 | mapped |
| `java/src/main/java/org/lance/operation/Rewrite.java` | 1-157 | mapped |
| `java/src/main/java/org/lance/operation/RewriteGroup.java` | 1-91 | mapped |
| `java/src/main/java/org/lance/operation/RewrittenIndex.java` | 1-184 | mapped |
| `java/src/main/java/org/lance/operation/SchemaOperation.java` | 1-78 | mapped |
| `java/src/main/java/org/lance/operation/Update.java` | 1-291 | mapped |
| `java/src/main/java/org/lance/operation/UpdateBases.java` | 1-92 | mapped |
| `java/src/main/java/org/lance/operation/UpdateConfig.java` | 1-394 | mapped |
| `java/src/main/java/org/lance/operation/UpdateMap.java` | 1-66 | mapped |
| `java/src/main/java/org/lance/operation/UpdateMemWalState.java` | 1-88 | mapped |
| `java/src/main/java/org/lance/otel/LanceMetrics.java` | 1-283 | mapped |
| `java/src/main/java/org/lance/otel/MetricBucket.java` | 1-33 | mapped |
| `java/src/main/java/org/lance/otel/MetricDescription.java` | 1-45 | mapped |
| `java/src/main/java/org/lance/otel/MetricPoint.java` | 1-75 | mapped |
| `java/src/main/java/org/lance/schema/ColumnAlteration.java` | 1-87 | mapped |
| `java/src/main/java/org/lance/schema/LanceField.java` | 1-307 | mapped |
| `java/src/main/java/org/lance/schema/LanceSchema.java` | 1-107 | mapped |
| `java/src/main/java/org/lance/schema/SqlExpressions.java` | 1-81 | mapped |
| `java/src/main/java/org/lance/update/UpdateParams.java` | 1-154 | mapped |
| `java/src/main/java/org/lance/update/UpdateResult.java` | 1-59 | mapped |
| `java/src/main/java/org/lance/util/Range.java` | 1-38 | mapped |

## Key types and files

### Dataset

`java/src/main/java/org/lance/Dataset.java` — read `1-2642`.

Start at the Java Dataset facade for caller-visible signatures.  
Follow the operation-named JNI adapter for native linkage.  
Read option/result classes in the same package when changing arguments.  
Mapped only: verify lifetime and error details in source before implementation.

### Dataset JNI adapter

`java/lance-jni/src/blocking_dataset.rs` — read `1-4357`.

Maps blocking Java Dataset operations into the Rust boundary.  
Coordinate Java declarations and JNI entry names as one change.  
Use dedicated scanner/file/index modules for those API families.  
Mapped only: this record makes no deep binding or unsafe-code claim.

## Contracts and extension boundaries


## Scanner option change route — mapped only

For a Java scanner option such as batch size, start at `java/src/main/java/org/lance/ipc/ScanOptions.java:369-378,618-752`, then `java/src/main/java/org/lance/ipc/LanceScanner.java:57-132`, then `java/lance-jni/src/blocking_scanner.rs:283-414,633-774`, then the Rust Scanner method selected by that adapter. Dataset.newScan dispatch is at java/src/main/java/org/lance/Dataset.java:834-858. This is a declaration/call-site map only; it does not claim native lifetime or validation equivalence.

## Refresh: reference-based opening and value identity — mapped only

These notes summarize changed interface hunks only. Java remains mapped only; they do not certify native lifetimes, the whole binding or runtime execution.

- ReadOptions carries an optional Ref and exposes it through getRef, alongside the existing optional numeric version. (java/src/main/java/org/lance/ReadOptions.java:24-60)
- Builder.setRef rejects null before storing the reference. (java/src/main/java/org/lance/ReadOptions.java:170-173)
- Builder.build rejects simultaneous version and ref with IllegalArgumentException. (java/src/main/java/org/lance/ReadOptions.java:308-316)
- Builder.build also rejects serializedManifest together with ref; the manifest already chooses the opened version. (java/src/main/java/org/lance/ReadOptions.java:316-323)
- OpenDatasetBuilder copies getRef into the options it forwards, just as it copies the existing numeric version. (java/src/main/java/org/lance/OpenDatasetBuilder.java:231-247)
- Dataset.openNative's Java call and native declaration both now include Optional<Ref> after Optional<Long> version. Update these boundary arguments together. (java/src/main/java/org/lance/Dataset.java:458-499)
- The JNI conversion combines the decoded optional Ref with version.map(Ref::from) using Option::or, so a present Ref wins. This is value precedence, not lazy numeric-version conversion. (java/lance-jni/src/blocking_dataset.rs:1743-1748) Java builder validation rejects both options. (java/src/main/java/org/lance/ReadOptions.java:308-316)
- BlockingDataset.open dispatches numeric/default-chain versions to with_version, a named branch to with_branch, and a tag to with_tag; no reference keeps the ordinary builder. (java/lance-jni/src/blocking_dataset.rs:255-267)
- Default-branch references at open are documented as URI-chain-relative. Opening a branch-directory URI can therefore differ from Dataset.checkout's default-branch interpretation; start from the dataset root for explicit branch selection. (java/src/main/java/org/lance/ReadOptions.java:137-153)
- DataFile equality now includes baseId; hashCode combines path, major/minor version, size, baseId and both array contents. (java/src/main/java/org/lance/fragment/DataFile.java:78-98)
- DeletionFile equality includes baseId, and hashCode uses id, readVersion, numDeletedRows, fileType and baseId. (java/src/main/java/org/lance/fragment/DeletionFile.java:90-105)
- DataOverlayFile.hashCode now delegates through its DataFile object together with coverage and committedVersion, matching the fields compared by equals. (java/src/main/java/org/lance/operation/DataOverlay.java:152-165)

[Ordered Java open route](../L4-crosscutting/navigation-index.md#java-open) · [Rust delayed-checkout contract](../L3-symbols/public-api.md#dataset-open-reference-resolution).

## Source refresh — 2026-10-07

Pinned `84d1681e07af565837f2d97e72ff1b8b040cd15c`. The entries below have updated source ranges. Their directory responsibilities remain as mapped; behavior changes are governed by [current delta contracts](../L3-symbols/refresh-2026-10-07.md). Ordinary files remain mapped, and Java/peripherals remain mapped only.

- `java/lance-jni/src/transaction.rs`

## Source refresh — 2026-10-09

Pin `db684d1f0726c00b6defb7963a604a7719e82b5a`. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) cover affected behavior. The following entries have current production ranges; unchanged directory responsibilities and mapped-only limits remain.

- `java/lance-jni/src/blocking_dataset.rs`
- `java/src/main/java/org/lance/Dataset.java`

<a id="java-src-main-java-org-lance-ipc"></a>

### `java/src/main/java/org/lance/ipc/`

| Source | Production reading ranges | Status |
|---|---|---|
| `java/src/main/java/org/lance/ipc/FragmentSlice.java` | 1-96 | mapped |

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `java/lance-jni/src/async_scanner.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `AsyncScanner` (java/lance-jni/src/async_scanner.rs:22-22), `create` (java/lance-jni/src/async_scanner.rs:58-58), `start_scan_with_scanner` (java/lance-jni/src/async_scanner.rs:65-65).

### `java/lance-jni/src/blocking_scanner.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `BlockingScanner` (java/lance-jni/src/blocking_scanner.rs:43-43), `create` (java/lance-jni/src/blocking_scanner.rs:49-49), `open_stream` (java/lance-jni/src/blocking_scanner.rs:71-71), `schema` (java/lance-jni/src/blocking_scanner.rs:77-77), `count_rows` (java/lance-jni/src/blocking_scanner.rs:82-82), `get_stats` (java/lance-jni/src/blocking_scanner.rs:87-87), `build_full_text_search_query` (java/lance-jni/src/blocking_scanner.rs:98-98), `ScannerOptions` (java/lance-jni/src/blocking_scanner.rs:286-286).

### `java/lance-jni/src/transaction.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `convert_to_java_transaction` (java/lance-jni/src/transaction.rs:836-836), `convert_to_java_operation` (java/lance-jni/src/transaction.rs:868-868), `convert_to_java_schema` (java/lance-jni/src/transaction.rs:1228-1228).

### `java/lance-jni/src/utils.rs`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

Key declarations: `extract_storage_options` (java/lance-jni/src/utils.rs:33-33), `extract_base_store_params` (java/lance-jni/src/utils.rs:42-42), `parse_approx_mode` (java/lance-jni/src/utils.rs:80-80), `extract_file_writer_options` (java/lance-jni/src/utils.rs:92-92), `extract_write_params` (java/lance-jni/src/utils.rs:112-112), `build_compaction_options` (java/lance-jni/src/utils.rs:203-203), `get_query` (java/lance-jni/src/utils.rs:290-290), `get_vector_index_params` (java/lance-jni/src/utils.rs:346-346).

### `java/src/main/java/org/lance/ipc/AsyncScanner.java`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `java/src/main/java/org/lance/ipc/FragmentSlice.java`

Immutable Java physical fragment slice value and validation; JNI conversion routes to Rust.

| Source | Production reading ranges | Status |
|---|---|---|
| `java/src/main/java/org/lance/ipc/FragmentSlice.java` | 1-96 | mapped |

### `java/src/main/java/org/lance/ipc/LanceScanner.java`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `java/src/main/java/org/lance/ipc/Query.java`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `java/src/main/java/org/lance/ipc/ScanOptions.java`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `java/src/main/java/org/lance/operation/SchemaOperation.java`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

