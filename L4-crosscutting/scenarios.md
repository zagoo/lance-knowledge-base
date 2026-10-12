# Engine and storage scenarios

**Current V2.1 navigation guidance.** Choose a task, read its canonical contract, then follow the ordered source set. The source remains available. Frozen compatibility mechanisms are maintenance references, not foundations for new format features. Historical test/fixture/binary walkthroughs are archived and do not create new obligations.

[Primary tasks and all reading routes](navigation-index.md) · [Public APIs](../L3-symbols/public-api.md) · [Build policy](build-and-test.md) · [Pitfalls](pitfalls.md)

## Dataset lifecycle: create → append → delete → compact → index → query

1. Follow [write](navigation-index.md#write) with Create or Append: stage fragments, build intent and publish a manifest. An uncommitted result is not visible Dataset state.
2. Follow the [delete API and conflict rules](../L3-symbols/public-api.md#write-update-and-index-contracts): select rows, build deletion/update metadata and commit against the read snapshot. Keep row identity and conflict-retry semantics explicit.
3. Follow [compaction](navigation-index.md#compact): plan fragments, rewrite/copy, preserve original task read versions and publish the Rewrite. For concurrent writes choose [distributed-compaction safety](navigation-index.md#distributed-compaction).
4. Follow [index build/update](navigation-index.md#index): build physical files, commit declared coverage, and keep unindexed/fallback rows visible.
5. Follow [read](navigation-index.md#read): build Scanner plan, execute and consume batches. Projection/filter/search/limit and I/O scheduling have distinct responsibilities.

Each step has its own bounded read set and canonical contract; the complete lifecycle is a sequence of tasks, not an instruction to open every file simultaneously. The four Rust entry traces and their source evidence are in [L0](../L0-orientation.md).


<a id="partial-scenario-distributed-filtered-read-serialization"></a>

## Distributed filtered-read serialization

Use the [ordered read set](navigation-index.md#scenario-01) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="partial-state-machines-from-schema-contracts"></a>

## State machines from schema contracts

Use the [ordered read set](navigation-index.md#scenario-03) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="partial-in-memory-blob-projection-trace"></a>

## In-memory blob projection trace

Use the [ordered read set](navigation-index.md#scenario-04) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="deletion-vectors-and-single-rewrite-mapping"></a>

## Deletion vectors and single-rewrite mapping

Use the [ordered read set](navigation-index.md#scenario-05) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="ordered-and-stable-partition-row-mapping"></a>

## Ordered and stable-partition row mapping

Use the [ordered read set](navigation-index.md#scenario-06) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="aimd-control-and-object-store-test-instrumentation"></a>

## AIMD control

Use the [ordered read set](navigation-index.md#scenario-07) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="generic-split-block-bloom-filters"></a>

## Generic split-block Bloom filters

Use the [ordered read set](navigation-index.md#scenario-08) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-configuring-a-cache-backend"></a>

## Configuring a cache backend

Use the [ordered read set](navigation-index.md#scenario-09) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-serializing-and-decoding-one-cache-entry"></a>

## Serializing and decoding one cache entry

Use the [ordered read set](navigation-index.md#scenario-10) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-memory-backend-miss-and-retry"></a>

## Memory backend miss and retry

Use the [ordered read set](navigation-index.md#scenario-11) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-one-typed-cached-load"></a>

## One typed cached load

Use the [ordered read set](navigation-index.md#scenario-12) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-manifest-capability-walkthrough"></a>

## Local manifest capability walkthrough

Use the [ordered read set](navigation-index.md#scenario-13) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-row-id-metadata-and-transaction-disposition-traces"></a>

## Local row-ID metadata and transaction disposition traces

Use the [ordered read set](navigation-index.md#scenario-14) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="decode-share-detach-and-clone-a-manifest"></a>

## Decode, share, detach and clone a manifest

Use the [ordered read set](navigation-index.md#scenario-15) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-index-list-cache-and-overlay-reload-traces"></a>

## Local index-list cache and overlay reload traces

Use the [ordered read set](navigation-index.md#scenario-16) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-merge-insert-key-representation-trace"></a>

## Local merge-insert key representation trace

Use the [ordered read set](navigation-index.md#scenario-17) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="exact-version-and-stale-index-metadata-traces"></a>

## Exact version and stale-index metadata traces

Use the [ordered read set](navigation-index.md#scenario-18) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-refresh-last-updated-lineage-during-column-rewrite"></a>

## Refresh last-updated lineage during column rewrite

Use the [ordered read set](navigation-index.md#scenario-19) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-read-version-batches-and-present-row-id-offsets"></a>

## Read version batches and present row-ID offsets

Use the [ordered read set](navigation-index.md#scenario-20) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-inline-row-id-encodedecode"></a>

## Inline row-ID encode/decode

Use the [ordered read set](navigation-index.md#scenario-21) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-construct-select-and-mutate-a-segment"></a>

## Construct, select and mutate a segment

Use the [ordered read set](navigation-index.md#scenario-22) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-trace-selection-deletion-and-rechunking"></a>

## Selection, deletion and rechunking

Use the [ordered read set](navigation-index.md#scenario-23) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-transaction-trace-allocate-ids-preserve-creation-stamp-update"></a>

## Local transaction trace: allocate IDs, preserve creation, stamp update

Use the [ordered read set](navigation-index.md#scenario-24) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="partial-transaction-attempt-trace"></a>

## Transaction-attempt trace

Use the [ordered read set](navigation-index.md#scenario-25) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-config-and-metadata-overlap-examples"></a>

## Local config and metadata overlap examples

Use the [ordered read set](navigation-index.md#scenario-26) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-pre-commit-validation-trace"></a>

## Local pre-commit validation trace

Use the [ordered read set](navigation-index.md#scenario-27) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-transaction-protobuf-trace"></a>

## Local transaction protobuf trace

Use the [ordered read set](navigation-index.md#scenario-28) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-index-invalidation-and-rewrite-trace"></a>

## Local index invalidation and rewrite trace

Use the [ordered read set](navigation-index.md#scenario-29) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="gate-and-clone-guard-boundaries"></a>

## Gate and clone-guard boundaries

Use the [ordered read set](navigation-index.md#scenario-30) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="decode-one-fragment-reuse-history"></a>

## Decode one fragment-reuse history

Use the [ordered read set](navigation-index.md#scenario-31) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-memwal-generation-publication-preparation"></a>

## Local MemWAL generation publication preparation

Use the [ordered read set](navigation-index.md#scenario-32) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="manifest-body-writeread-and-deletion-object-trace"></a>

## Manifest body write/read and deletion-object trace

Use the [ordered read set](navigation-index.md#scenario-33) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="single-attempt-conditional-and-locked-commit-traces"></a>

## Single-attempt conditional and locked commit traces

Use the [ordered read set](navigation-index.md#scenario-34) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="external-publication-repair-and-conditioned-history"></a>

## External publication, repair and conditioned history

Use the [ordered read set](navigation-index.md#scenario-35) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="dynamodb-generic-commit-and-stable-id-lookup-traces"></a>

## DynamoDB generic commit and stable-ID lookup traces

Use the [ordered read set](navigation-index.md#scenario-36) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="scheduled-batches-to-visible-rows"></a>

## Scheduled batches to visible rows

Use the [ordered read set](navigation-index.md#scenario-37) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="file-runtime-entry-paths-local-not-complete-dataset-write"></a>

## File runtime entry paths

Use the [ordered read set](navigation-index.md#scenario-38) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="structural-projection-subtrace"></a>

## Structural projection subtrace

Use the [ordered read set](navigation-index.md#scenario-39) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="metadata-finishing-subtrace"></a>

## Metadata finishing subtrace

Use the [ordered read set](navigation-index.md#scenario-40) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="current-structural-file-write-subtrace"></a>

## Current structural file write subtrace

Use the [ordered read set](navigation-index.md#scenario-41) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="shared-reader-open-prepare-and-consume"></a>

## Shared reader open, prepare and consume

Use the [ordered read set](navigation-index.md#scenario-44) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-encoded-concatenation-trace"></a>

## Local encoded-concatenation trace

Use the [ordered read set](navigation-index.md#scenario-45) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="frozen-v1-value-roundtrip-subtrace"></a>

## Frozen V1 value roundtrip subtrace

Use the [ordered read set](navigation-index.md#scenario-46) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="frozen-v1-full-local-read-trace"></a>

## Frozen V1 full local read trace

Use the [ordered read set](navigation-index.md#scenario-47) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="complete-local-v1-write-to-read-trace"></a>

## Complete local V1 write-to-read trace

Use the [ordered read set](navigation-index.md#scenario-48) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-v1-statistics-trace"></a>

## Local V1 statistics trace

Use the [ordered read set](navigation-index.md#scenario-49) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="decode-the-pinned-standard-v2_0-file"></a>

## Read stable V2_0 through production code

Use the [ordered read set](navigation-index.md#scenario-53) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="decode-the-pinned-standard-v2_2-file"></a>

## Read stable V2_2 through production code

Use the [ordered read set](navigation-index.md#scenario-55) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-metadata-and-io-handoff"></a>

## Local metadata and IO handoff

Use the [ordered read set](navigation-index.md#scenario-56) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="local-configuration-to-buffer-trace"></a>

## Local configuration-to-buffer trace

Use the [ordered read set](navigation-index.md#scenario-57) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="general-mini-block-subtrace"></a>

## General mini-block subtrace

Use the [ordered read set](navigation-index.md#scenario-58) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="raw-fsl-and-bitpacking-codec-subtraces"></a>

## Raw FSL and bitpacking codec subtraces

Use the [ordered read set](navigation-index.md#scenario-59) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="variable-and-bss-codec-subtraces"></a>

## Variable and BSS codec subtraces

Use the [ordered read set](navigation-index.md#scenario-60) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="packed-and-statistics-subtraces"></a>

## Packed and statistics subtraces

Use the [ordered read set](navigation-index.md#scenario-61) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="compression-policy-subtrace"></a>

## Compression policy subtrace

Use the [ordered read set](navigation-index.md#scenario-62) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="rle-local-writeread-trace"></a>

## RLE local write/read trace

Use the [ordered read set](navigation-index.md#scenario-63) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="arrow-array-to-physical-block-and-back"></a>

## Arrow array to physical block and back

Use the [ordered read set](navigation-index.md#scenario-64) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="structural-utility-trace"></a>

## Structural utility trace

Use the [ordered read set](navigation-index.md#scenario-65) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="in-memory-batch-encoding-trace"></a>

## In-memory batch encoding trace

Use the [ordered read set](navigation-index.md#scenario-66) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="schedule-and-decode-trace"></a>

## Schedule and decode trace

Use the [ordered read set](navigation-index.md#scenario-67) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="constant-page-selection-and-dictionary-validity-trace"></a>

## Constant page selection and dictionary validity trace

Use the [ordered read set](navigation-index.md#scenario-68) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="original-blob-encoderead-subtrace"></a>

## Original Blob encode/read subtrace

Use the [ordered read set](navigation-index.md#scenario-69) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

<a id="nested-fslmap-encode-decode-subtrace"></a>

## Nested FSL/Map encode-decode subtrace

Use the [ordered read set](navigation-index.md#scenario-70) and its linked contract. The retained production details are in the frozen file records; source-only implementation work beyond those contracts follows the cited ranges.

## Historical link redirects

These links preserve old citations without treating excluded evidence as current guidance.

<a id="historical-acceptance-outcomes-through-iteration-85"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#historical-acceptance-outcomes-through-iteration-85).

<a id="v2_0-file-write-and-stable-fixture-subtraces"></a>
The production writer/reader route is [stable V2_0](navigation-index.md#file-v20); only the fixture interpretation is [archived](../archive/crosscutting-093/scenarios.md#v2_0-file-write-and-stable-fixture-subtraces).

<a id="test-derived-unequal-root-and-rejection-recovery-traces"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#test-derived-unequal-root-and-rejection-recovery-traces).

<a id="benchmark-only-read-scenario"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#benchmark-only-read-scenario).

<a id="offline-interpretation-of-the-v1-historical-fixture"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#offline-interpretation-of-the-v1-historical-fixture).

<a id="read-either-pinned-embedded-v2_0-fixture"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#read-either-pinned-embedded-v2_0-fixture).

<a id="decode-the-pinned-standard-v2_1-artifact"></a>
Historical reference moved to [archive](../archive/crosscutting-093/scenarios.md#decode-the-pinned-standard-v2_1-artifact).

