# Development hazards and contract routes

This page routes to canonical production contracts instead of repeating their details. All source deductions retain their stated uncertainty; no runtime or platform qualification is claimed. [Navigation](navigation-index.md) · [Scope/trust](../V21-PROTOCOL.md).

| Hazard | Decision rule and authoritative detail |
|---|---|
| Error after publication | Reconcile Ours/Foreign/Absent/Unknown before retry or cleanup; [commit outcomes](../L3-symbols/protocol-commit.md#errors-retries-and-ambiguous-success). |
| Retrying stale intent | Publication collision, retryable operation conflict and incompatible intent are different; [directional rules](../L3-symbols/protocol-commit.md#directional-operation-rules). |
| Reintroducing retired rows | Keep original read-version intent separate from current attempt assembly and preserve deletion/index filters; [lineage](../L3-symbols/protocol-commit.md#index-coverage-and-rewrite-lineage), [index maintenance](../L3-symbols/protocol-index.md#update-merge-and-rebuild). |
| Hardening the wrong memory limit | Admission budgets intentionally allow progress exceptions; [I/O contract](../L3-symbols/protocol-io.md). |
| Confusing identities | Logical row IDs, physical addresses, file versions, dataset versions and index versions differ; [public API contract](../L3-symbols/public-api.md), [format](../L3-symbols/format-spec.md). |
| Enabling a codec without a reader | Exact version composition and exact reader grammar must agree; [encoding/version admission](../L3-symbols/protocol-encoding.md). |
| Inferring validation from a constructor | Many local structures trust counts, offsets, validity, alignment or schema supplied by callers; [retained behavior contracts](../L3-symbols/behavior-contracts.md). |
| Promising cancellation/rollback | Dropping a stream, cancelling scheduler tasks, returning an error and aborting durable writes have different boundaries; [I/O](../L3-symbols/protocol-io.md), [commit](../L3-symbols/protocol-commit.md). |
| Breaking a wrapper's API | Keep signature/default/error/handle effects and Rust/Python/Java parameter naming consistent; [API mapping](../L3-symbols/public-api.md). |
| Using legacy code for new features | Preserve stable read contracts; implement new work in current writers; [format policy](../L3-symbols/format-spec.md#how-to-use-this-contract). |

For a low-level cache, datatype, row-ID or codec hazard, select its named section in [behavior-contracts](../L3-symbols/behavior-contracts.md) and open the frozen L2 record linked there. The archive preserves previous cross-layer wording; the current contracts resolve scope and later corrections.

## Historical link redirects

Earlier topic links remain resolvable; archived test/binary evidence is not current coverage or required work.

<a id="core-utilities"></a>
[Historical Core utilities](../archive/crosscutting-093/pitfalls.md#core-utilities).

<a id="error-and-diagnostic-boundaries"></a>
[Historical Error and diagnostic boundaries](../archive/crosscutting-093/pitfalls.md#error-and-diagnostic-boundaries).

<a id="datatype-and-field-pitfalls"></a>
[Historical Datatype and field pitfalls](../archive/crosscutting-093/pitfalls.md#datatype-and-field-pitfalls).

<a id="schema-and-path-pitfalls"></a>
[Historical Schema and path pitfalls](../archive/crosscutting-093/pitfalls.md#schema-and-path-pitfalls).

<a id="core-containers-memory-and-small-utilities"></a>
[Historical Core containers, memory and small utilities](../archive/crosscutting-093/pitfalls.md#core-containers-memory-and-small-utilities).

<a id="deletion-vectors-and-single-rewrite-mapping"></a>
[Historical Deletion vectors and single-rewrite mapping](../archive/crosscutting-093/pitfalls.md#deletion-vectors-and-single-rewrite-mapping).

<a id="ordered-and-stable-partition-row-mapping"></a>
[Historical Ordered and stable-partition row mapping](../archive/crosscutting-093/pitfalls.md#ordered-and-stable-partition-row-mapping).

<a id="aimd-control-and-object-store-test-instrumentation"></a>
[Historical AIMD control and object-store test instrumentation](../archive/crosscutting-093/pitfalls.md#aimd-control-and-object-store-test-instrumentation).

<a id="generic-split-block-bloom-filters"></a>
[Historical Generic split-block Bloom filters](../archive/crosscutting-093/pitfalls.md#generic-split-block-bloom-filters).

<a id="cache-keyconfiguration-boundaries"></a>
[Historical Cache key/configuration boundaries](../archive/crosscutting-093/pitfalls.md#cache-keyconfiguration-boundaries).

<a id="cache-codec-limits"></a>
[Historical Cache codec limits](../archive/crosscutting-093/pitfalls.md#cache-codec-limits).

<a id="concrete-backend-pitfalls"></a>
[Historical Concrete backend pitfalls](../archive/crosscutting-093/pitfalls.md#concrete-backend-pitfalls).

<a id="typed-cache-integration-pitfalls"></a>
[Historical Typed cache integration pitfalls](../archive/crosscutting-093/pitfalls.md#typed-cache-integration-pitfalls).

<a id="table-entry-point-pitfalls"></a>
[Historical Table entry-point pitfalls](../archive/crosscutting-093/pitfalls.md#table-entry-point-pitfalls).

<a id="wrapper-interpretation-pitfalls"></a>
[Historical Wrapper interpretation pitfalls](../archive/crosscutting-093/pitfalls.md#wrapper-interpretation-pitfalls).

<a id="metadata-caveats-established-by-implementation"></a>
[Historical Metadata caveats established by implementation](../archive/crosscutting-093/pitfalls.md#metadata-caveats-established-by-implementation).

<a id="metadata-specific-traps"></a>
[Historical Metadata-specific traps](../archive/crosscutting-093/pitfalls.md#metadata-specific-traps).

<a id="exact-identity-and-stale-set-traps"></a>
[Historical Exact identity and stale-set traps](../archive/crosscutting-093/pitfalls.md#exact-identity-and-stale-set-traps).

<a id="row-version-and-hole-run-pitfalls"></a>
[Historical Row-version and hole-run pitfalls](../archive/crosscutting-093/pitfalls.md#row-version-and-hole-run-pitfalls).

<a id="row-id-codec-pitfalls"></a>
[Historical Row-ID codec pitfalls](../archive/crosscutting-093/pitfalls.md#row-id-codec-pitfalls).

<a id="segment-pitfalls"></a>
[Historical Segment pitfalls](../archive/crosscutting-093/pitfalls.md#segment-pitfalls).

<a id="sequence-boundary-hazards"></a>
[Historical Sequence boundary hazards](../archive/crosscutting-093/pitfalls.md#sequence-boundary-hazards).

<a id="transaction-row-version-pitfalls"></a>
[Historical Transaction row-version pitfalls](../archive/crosscutting-093/pitfalls.md#transaction-row-version-pitfalls).

<a id="definition-and-fixture-traps"></a>
[Historical Definition and fixture traps](../archive/crosscutting-093/pitfalls.md#definition-and-fixture-traps).

<a id="conflict-helper-interpretation"></a>
[Historical Conflict helper interpretation](../archive/crosscutting-093/pitfalls.md#conflict-helper-interpretation).

<a id="validation-wording-versus-enforced-checks"></a>
[Historical Validation wording versus enforced checks](../archive/crosscutting-093/pitfalls.md#validation-wording-versus-enforced-checks).

<a id="transaction-codec-edge-cases"></a>
[Historical Transaction codec edge cases](../archive/crosscutting-093/pitfalls.md#transaction-codec-edge-cases).

<a id="index-provenance-and-rewrite-assumptions"></a>
[Historical Index provenance and rewrite assumptions](../archive/crosscutting-093/pitfalls.md#index-provenance-and-rewrite-assumptions).

<a id="gate-reasons-are-narrower-than-lifecycle-guarantees"></a>
[Historical Gate reasons are narrower than lifecycle guarantees](../archive/crosscutting-093/pitfalls.md#gate-reasons-are-narrower-than-lifecycle-guarantees).

<a id="decoder-and-adapter-boundaries"></a>
[Historical Decoder and adapter boundaries](../archive/crosscutting-093/pitfalls.md#decoder-and-adapter-boundaries).

<a id="memwal-metadata-traps"></a>
[Historical MemWAL metadata traps](../archive/crosscutting-093/pitfalls.md#memwal-metadata-traps).

<a id="candidate-builder-traps"></a>
[Historical Candidate-builder traps](../archive/crosscutting-093/pitfalls.md#candidate-builder-traps).

<a id="metadata-io-pitfalls"></a>
[Historical Metadata IO pitfalls](../archive/crosscutting-093/pitfalls.md#metadata-io-pitfalls).

<a id="commit-and-listing-pitfalls"></a>
[Historical Commit and listing pitfalls](../archive/crosscutting-093/pitfalls.md#commit-and-listing-pitfalls).

<a id="external-store-pitfalls"></a>
[Historical External-store pitfalls](../archive/crosscutting-093/pitfalls.md#external-store-pitfalls).

<a id="coordinator-and-lookup-pitfalls"></a>
[Historical Coordinator and lookup pitfalls](../archive/crosscutting-093/pitfalls.md#coordinator-and-lookup-pitfalls).

<a id="stream-metadata-trust-and-benchmark-units"></a>
[Historical Stream metadata trust and benchmark units](../archive/crosscutting-093/pitfalls.md#stream-metadata-trust-and-benchmark-units).

<a id="file-runtime-boundary-pitfalls"></a>
[Historical File runtime boundary pitfalls](../archive/crosscutting-093/pitfalls.md#file-runtime-boundary-pitfalls).

<a id="composition-and-structural-metadata-pitfalls"></a>
[Historical Composition and structural metadata pitfalls](../archive/crosscutting-093/pitfalls.md#composition-and-structural-metadata-pitfalls).

<a id="exact-reader-pitfalls"></a>
[Historical Exact-reader pitfalls](../archive/crosscutting-093/pitfalls.md#exact-reader-pitfalls).

<a id="structural-writer-assumptions-to-preserve"></a>
[Historical Structural writer assumptions to preserve](../archive/crosscutting-093/pitfalls.md#structural-writer-assumptions-to-preserve).

<a id="v2_0-and-fixture-pitfalls"></a>
[Historical V2_0 and fixture pitfalls](../archive/crosscutting-093/pitfalls.md#v2_0-and-fixture-pitfalls).

<a id="writer-test-comments-and-assertions-differ"></a>
[Historical Writer test comments and assertions differ](../archive/crosscutting-093/pitfalls.md#writer-test-comments-and-assertions-differ).

<a id="shared-reader-assumptions-and-misleading-oracles"></a>
[Historical Shared-reader assumptions and misleading oracles](../archive/crosscutting-093/pitfalls.md#shared-reader-assumptions-and-misleading-oracles).

<a id="encoded-assembly-pitfalls"></a>
[Historical Encoded assembly pitfalls](../archive/crosscutting-093/pitfalls.md#encoded-assembly-pitfalls).

<a id="legacy-helpers-are-not-modern-validators"></a>
[Historical Legacy helpers are not modern validators](../archive/crosscutting-093/pitfalls.md#legacy-helpers-are-not-modern-validators).

<a id="v1-codec-assumptions-that-are-not-general-guarantees"></a>
[Historical V1 codec assumptions that are not general guarantees](../archive/crosscutting-093/pitfalls.md#v1-codec-assumptions-that-are-not-general-guarantees).

<a id="v1-reader-assumptions"></a>
[Historical V1 reader assumptions](../archive/crosscutting-093/pitfalls.md#v1-reader-assumptions).

<a id="v1-write-state-and-test-interpretation-pitfalls"></a>
[Historical V1 write-state and test interpretation pitfalls](../archive/crosscutting-093/pitfalls.md#v1-write-state-and-test-interpretation-pitfalls).

<a id="historical-statistics-pitfalls"></a>
[Historical Historical statistics pitfalls](../archive/crosscutting-093/pitfalls.md#historical-statistics-pitfalls).

<a id="file-benchmark-interpretation-pitfalls"></a>
[Historical File benchmark interpretation pitfalls](../archive/crosscutting-093/pitfalls.md#file-benchmark-interpretation-pitfalls).

<a id="pinned-v1-artifact-traps"></a>
[Historical Pinned V1 artifact traps](../archive/crosscutting-093/pitfalls.md#pinned-v1-artifact-traps).

<a id="embedded-v2_0-traps"></a>
[Historical Embedded V2_0 traps](../archive/crosscutting-093/pitfalls.md#embedded-v2_0-traps).

<a id="standard-v2_0-traps"></a>
[Historical Standard V2_0 traps](../archive/crosscutting-093/pitfalls.md#standard-v2_0-traps).

<a id="v2_1-mini-block-traps"></a>
[Historical V2_1 mini-block traps](../archive/crosscutting-093/pitfalls.md#v2_1-mini-block-traps).

<a id="v2_2-fixture-traps"></a>
[Historical V2_2 fixture traps](../archive/crosscutting-093/pitfalls.md#v2_2-fixture-traps).

<a id="encoding-facade-traps"></a>
[Historical Encoding facade traps](../archive/crosscutting-093/pitfalls.md#encoding-facade-traps).

<a id="configuration-and-compression-pitfalls"></a>
[Historical Configuration and compression pitfalls](../archive/crosscutting-093/pitfalls.md#configuration-and-compression-pitfalls).

<a id="buffer-and-chunk-pitfalls"></a>
[Historical Buffer and chunk pitfalls](../archive/crosscutting-093/pitfalls.md#buffer-and-chunk-pitfalls).

<a id="value-and-bitpacking-pitfalls"></a>
[Historical Value and bitpacking pitfalls](../archive/crosscutting-093/pitfalls.md#value-and-bitpacking-pitfalls).

<a id="variable-fsst-and-bss-pitfalls"></a>
[Historical Variable, FSST and BSS pitfalls](../archive/crosscutting-093/pitfalls.md#variable-fsst-and-bss-pitfalls).

<a id="packedstatistics-pitfalls"></a>
[Historical Packed/statistics pitfalls](../archive/crosscutting-093/pitfalls.md#packedstatistics-pitfalls).

<a id="compression-policy-pitfalls"></a>
[Historical Compression policy pitfalls](../archive/crosscutting-093/pitfalls.md#compression-policy-pitfalls).

<a id="physical-rle-pitfalls"></a>
[Historical Physical RLE pitfalls](../archive/crosscutting-093/pitfalls.md#physical-rle-pitfalls).

<a id="datablock-pitfalls"></a>
[Historical DataBlock pitfalls](../archive/crosscutting-093/pitfalls.md#datablock-pitfalls).

<a id="repdef-pitfalls"></a>
[Historical Rep/def pitfalls](../archive/crosscutting-093/pitfalls.md#repdef-pitfalls).

<a id="encoder-facade-pitfalls"></a>
[Historical Encoder facade pitfalls](../archive/crosscutting-093/pitfalls.md#encoder-facade-pitfalls).

<a id="decoder-assumptions-and-source-deductions"></a>
[Historical Decoder assumptions and source deductions](../archive/crosscutting-093/pitfalls.md#decoder-assumptions-and-source-deductions).

<a id="primitive-helper-assumptions"></a>
[Historical Primitive helper assumptions](../archive/crosscutting-093/pitfalls.md#primitive-helper-assumptions).

<a id="blob-boundary-pitfalls"></a>
[Historical Blob boundary pitfalls](../archive/crosscutting-093/pitfalls.md#blob-boundary-pitfalls).

<a id="nested-wrapper-pitfalls"></a>
[Historical Nested-wrapper pitfalls](../archive/crosscutting-093/pitfalls.md#nested-wrapper-pitfalls).
