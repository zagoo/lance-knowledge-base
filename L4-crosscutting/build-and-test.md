# Development environment and validation policy

The KB goal performs no Lance build, test, lint, benchmark, code generation or dependency installation. Test implementations, fixtures, binaries and external dependencies are excluded. The following is navigation for a later implementation task, not execution evidence or a backlog for this KB.

[Contributor policy and all language guides](../L1-modules/contributor-policy.md) · [Scope](../V21-PROTOCOL.md) · [Cookbook](cookbook.md).

Before language tooling, read the matching source AGENTS.md. Follow its environment manager/toolchain exactly. Rust commands in the root guide include `cargo check --workspace --tests --benches`, targeted/workspace `cargo test`, `cargo clippy --all --tests --benches -- -D warnings`, and `cargo fmt --all`. These are maintainer commands for development, not commands executed during knowledge extraction. (AGENTS.md:24-38)

Bug fixes/features require corresponding tests under repository policy. Select cases from the behavior being changed: null/empty data, multiple fragments, concurrent commit outcomes, stable format compatibility and vector recall as applicable. This policy does not require reading excluded test implementations during KB creation. Python and Java environment commands are in their language guides; do not substitute another toolchain because one is absent. (AGENTS.md:80-110; python/AGENTS.md:1-40; java/AGENTS.md:1-35)

Protobuf changes must honor stable field numbers/presence and the maintainer's persisted-format proposal/review process. Execution-wire schemas have the guide's separate exemption; generated serialization output is excluded from analysis. (protos/AGENTS.md:5-27)

KB validation uses the single CORE-MANIFEST and V2.1 delta/milestone checks. Old inventory/analyzed-line tools and old test-coverage tables are historical evidence, not current commands. Only final milestone evidence can establish KB acceptance; it does not certify runtime behavior or performance.

## Historical link redirects

Earlier topic links remain resolvable; archived test/binary evidence is not current coverage or required work.

<a id="reviewed-core-test-landscape"></a>
[Historical Reviewed core test landscape](../archive/crosscutting-093/build-and-test.md#reviewed-core-test-landscape).

<a id="reviewed-core-datatype-tests"></a>
[Historical Reviewed core datatype tests](../archive/crosscutting-093/build-and-test.md#reviewed-core-datatype-tests).

<a id="reviewed-schema-tests"></a>
[Historical Reviewed Schema tests](../archive/crosscutting-093/build-and-test.md#reviewed-schema-tests).

<a id="core-containers-memory-and-small-utilities"></a>
[Historical Core containers, memory and small utilities](../archive/crosscutting-093/build-and-test.md#core-containers-memory-and-small-utilities).

<a id="deletion-vectors-and-single-rewrite-mapping"></a>
[Historical Deletion vectors and single-rewrite mapping](../archive/crosscutting-093/build-and-test.md#deletion-vectors-and-single-rewrite-mapping).

<a id="ordered-and-stable-partition-row-mapping"></a>
[Historical Ordered and stable-partition row mapping](../archive/crosscutting-093/build-and-test.md#ordered-and-stable-partition-row-mapping).

<a id="aimd-control-and-object-store-test-instrumentation"></a>
[Historical AIMD control and object-store test instrumentation](../archive/crosscutting-093/build-and-test.md#aimd-control-and-object-store-test-instrumentation).

<a id="generic-split-block-bloom-filters"></a>
[Historical Generic split-block Bloom filters](../archive/crosscutting-093/build-and-test.md#generic-split-block-bloom-filters).

<a id="cache-protocol-source-tests"></a>
[Historical Cache protocol source tests](../archive/crosscutting-093/build-and-test.md#cache-protocol-source-tests).

<a id="cache-codecentry-io-test-evidence"></a>
[Historical Cache codec/entry IO test evidence](../archive/crosscutting-093/build-and-test.md#cache-codecentry-io-test-evidence).

<a id="memory-backend-test-landscape"></a>
[Historical Memory backend test landscape](../archive/crosscutting-093/build-and-test.md#memory-backend-test-landscape).

<a id="typed-cache-source-tests"></a>
[Historical Typed cache source tests](../archive/crosscutting-093/build-and-test.md#typed-cache-source-tests).

<a id="cache-measurement-targets"></a>
[Historical Cache measurement targets](../archive/crosscutting-093/build-and-test.md#cache-measurement-targets).

<a id="lance-table-package-setup-source-only"></a>
[Historical lance-table package setup (source-only)](../archive/crosscutting-093/build-and-test.md#lance-table-package-setup-source-only).

<a id="table-wrapper-test-evidence"></a>
[Historical Table wrapper test evidence](../archive/crosscutting-093/build-and-test.md#table-wrapper-test-evidence).

<a id="fragment-and-manifest-source-test-coverage"></a>
[Historical Fragment and manifest source test coverage](../archive/crosscutting-093/build-and-test.md#fragment-and-manifest-source-test-coverage).

<a id="metadata-source-test-map-iteration26"></a>
[Historical Metadata source-test map (iteration26)](../archive/crosscutting-093/build-and-test.md#metadata-source-test-map-iteration26).

<a id="lance-file-build-and-reviewed-tests"></a>
[Historical lance-file build and reviewed tests](../archive/crosscutting-093/build-and-test.md#lance-file-build-and-reviewed-tests).

<a id="row-version-and-hole-run-source-tests"></a>
[Historical Row-version and hole-run source tests](../archive/crosscutting-093/build-and-test.md#row-version-and-hole-run-source-tests).

<a id="row-id-primitive-and-codec-source-tests"></a>
[Historical Row-ID primitive and codec source tests](../archive/crosscutting-093/build-and-test.md#row-id-primitive-and-codec-source-tests).

<a id="segment-source-tests-and-gaps"></a>
[Historical Segment source tests and gaps](../archive/crosscutting-093/build-and-test.md#segment-source-tests-and-gaps).

<a id="row-id-sequence-test-evidence"></a>
[Historical Row-ID sequence test evidence](../archive/crosscutting-093/build-and-test.md#row-id-sequence-test-evidence).

<a id="transaction-lineage-test-coverage"></a>
[Historical Transaction lineage test coverage](../archive/crosscutting-093/build-and-test.md#transaction-lineage-test-coverage).

<a id="shared-transaction-fixture-interpretation"></a>
[Historical Shared transaction fixture interpretation](../archive/crosscutting-093/build-and-test.md#shared-transaction-fixture-interpretation).

<a id="local-transaction-equality-tests"></a>
[Historical Local transaction equality tests](../archive/crosscutting-093/build-and-test.md#local-transaction-equality-tests).

<a id="transaction-validation-source-tests"></a>
[Historical Transaction validation source tests](../archive/crosscutting-093/build-and-test.md#transaction-validation-source-tests).

<a id="transaction-protobuf-tests"></a>
[Historical Transaction protobuf tests](../archive/crosscutting-093/build-and-test.md#transaction-protobuf-tests).

<a id="index-maintenance-test-surface"></a>
[Historical Index-maintenance test surface](../archive/crosscutting-093/build-and-test.md#index-maintenance-test-surface).

<a id="tagged-gate-and-metadata-tests"></a>
[Historical Tagged gate and metadata tests](../archive/crosscutting-093/build-and-test.md#tagged-gate-and-metadata-tests).

<a id="ledger-and-compatibility-remap-tests"></a>
[Historical Ledger and compatibility-remap tests](../archive/crosscutting-093/build-and-test.md#ledger-and-compatibility-remap-tests).

<a id="memwal-metadata-tests-and-contextual-progress-tests"></a>
[Historical MemWAL metadata tests and contextual progress tests](../archive/crosscutting-093/build-and-test.md#memwal-metadata-tests-and-contextual-progress-tests).

<a id="manifest-builder-regression-landscape"></a>
[Historical Manifest-builder regression landscape](../archive/crosscutting-093/build-and-test.md#manifest-builder-regression-landscape).

<a id="manifestdeletion-io-source-tests"></a>
[Historical Manifest/deletion IO source tests](../archive/crosscutting-093/build-and-test.md#manifestdeletion-io-source-tests).

<a id="commit-source-test-coverage"></a>
[Historical Commit source test coverage](../archive/crosscutting-093/build-and-test.md#commit-source-test-coverage).

<a id="external-manifest-source-test-coverage"></a>
[Historical External manifest source-test coverage](../archive/crosscutting-093/build-and-test.md#external-manifest-source-test-coverage).

<a id="dynamodb-and-row-id-index-source-evidence"></a>
[Historical DynamoDB and row-ID index source evidence](../archive/crosscutting-093/build-and-test.md#dynamodb-and-row-id-index-source-evidence).

<a id="table-stream-tests-and-final-three-benchmarks"></a>
[Historical Table stream tests and final three benchmarks](../archive/crosscutting-093/build-and-test.md#table-stream-tests-and-final-three-benchmarks).

<a id="file-runtime-boundary-tests-read-in-iteration52"></a>
[Historical File runtime boundary tests read in iteration52](../archive/crosscutting-093/build-and-test.md#file-runtime-boundary-tests-read-in-iteration52).

<a id="composition-and-structural-reader-test-boundary"></a>
[Historical Composition and structural-reader test boundary](../archive/crosscutting-093/build-and-test.md#composition-and-structural-reader-test-boundary).

<a id="exact-reader-grammar-fixtures"></a>
[Historical Exact reader grammar fixtures](../archive/crosscutting-093/build-and-test.md#exact-reader-grammar-fixtures).

<a id="structural-writer-helper-tests"></a>
[Historical Structural writer helper tests](../archive/crosscutting-093/build-and-test.md#structural-writer-helper-tests).

<a id="exact-version-compatibility-harness-and-fixture-generation"></a>
[Historical Exact-version compatibility harness and fixture generation](../archive/crosscutting-093/build-and-test.md#exact-version-compatibility-harness-and-fixture-generation).

<a id="complete-writer_testsrs-landscape"></a>
[Historical Complete writer_tests.rs landscape](../archive/crosscutting-093/build-and-test.md#complete-writer_testsrs-landscape).

<a id="shared-reader-test-evidence"></a>
[Historical Shared-reader test evidence](../archive/crosscutting-093/build-and-test.md#shared-reader-test-evidence).

<a id="encoded-concatenation-test-landscape"></a>
[Historical Encoded concatenation test landscape](../archive/crosscutting-093/build-and-test.md#encoded-concatenation-test-landscape).

<a id="v1-foundation-test-oracles"></a>
[Historical V1 foundation test oracles](../archive/crosscutting-093/build-and-test.md#v1-foundation-test-oracles).

<a id="v1-concrete-codec-test-coverage"></a>
[Historical V1 concrete codec test coverage](../archive/crosscutting-093/build-and-test.md#v1-concrete-codec-test-coverage).

<a id="v1-reader-test-landscape"></a>
[Historical V1 reader test landscape](../archive/crosscutting-093/build-and-test.md#v1-reader-test-landscape).

<a id="frozen-v1-writer-tests"></a>
[Historical Frozen V1 writer tests](../archive/crosscutting-093/build-and-test.md#frozen-v1-writer-tests).

<a id="v1-statistics-source-test-catalog"></a>
[Historical V1 statistics source-test catalog](../archive/crosscutting-093/build-and-test.md#v1-statistics-source-test-catalog).

<a id="lance-file-benchmark-executables"></a>
[Historical Lance-file benchmark executables](../archive/crosscutting-093/build-and-test.md#lance-file-benchmark-executables).

<a id="binary-fixture-inspection-evidence"></a>
[Historical Binary fixture inspection evidence](../archive/crosscutting-093/build-and-test.md#binary-fixture-inspection-evidence).

<a id="embedded-v2_0-fixture-evidence"></a>
[Historical Embedded V2_0 fixture evidence](../archive/crosscutting-093/build-and-test.md#embedded-v2_0-fixture-evidence).

<a id="standard-v2_0-fixture-evidence"></a>
[Historical Standard V2_0 fixture evidence](../archive/crosscutting-093/build-and-test.md#standard-v2_0-fixture-evidence).

<a id="v2_1-artifact-validation"></a>
[Historical V2_1 artifact validation](../archive/crosscutting-093/build-and-test.md#v2_1-artifact-validation).

<a id="complete-local-fixture-inventory-runtime-still-untested"></a>
[Historical Complete local fixture inventory, runtime still untested](../archive/crosscutting-093/build-and-test.md#complete-local-fixture-inventory-runtime-still-untested).

<a id="lance-encoding-crate-configuration-and-generation"></a>
[Historical lance-encoding crate configuration and generation](../archive/crosscutting-093/build-and-test.md#lance-encoding-crate-configuration-and-generation).

<a id="reviewed-encoding-configuration-and-utility-tests"></a>
[Historical Reviewed encoding configuration and utility tests](../archive/crosscutting-093/build-and-test.md#reviewed-encoding-configuration-and-utility-tests).

<a id="buffer-and-mini-block-test-evidence-limits"></a>
[Historical Buffer and mini-block test evidence limits](../archive/crosscutting-093/build-and-test.md#buffer-and-mini-block-test-evidence-limits).

<a id="value-and-bitpacking-test-coverage"></a>
[Historical Value and bitpacking test coverage](../archive/crosscutting-093/build-and-test.md#value-and-bitpacking-test-coverage).

<a id="binary-fsst-and-bss-test-evidence"></a>
[Historical Binary, FSST and BSS test evidence](../archive/crosscutting-093/build-and-test.md#binary-fsst-and-bss-test-evidence).

<a id="packedstatistics-test-landscape"></a>
[Historical Packed/statistics test landscape](../archive/crosscutting-093/build-and-test.md#packedstatistics-test-landscape).

<a id="shared-compression-tests-and-feature-concern"></a>
[Historical Shared compression tests and feature concern](../archive/crosscutting-093/build-and-test.md#shared-compression-tests-and-feature-concern).

<a id="physical-rle-test-evidence-and-gaps"></a>
[Historical Physical RLE test evidence and gaps](../archive/crosscutting-093/build-and-test.md#physical-rle-test-evidence-and-gaps).

<a id="datablock-test-coverage"></a>
[Historical DataBlock test coverage](../archive/crosscutting-093/build-and-test.md#datablock-test-coverage).

<a id="repdef-source-test-coverage"></a>
[Historical Rep/def source-test coverage](../archive/crosscutting-093/build-and-test.md#repdef-source-test-coverage).

<a id="encoder-facade-source-test-coverage"></a>
[Historical Encoder facade source-test coverage](../archive/crosscutting-093/build-and-test.md#encoder-facade-source-test-coverage).

<a id="decoder-source-test-evidence"></a>
[Historical Decoder source-test evidence](../archive/crosscutting-093/build-and-test.md#decoder-source-test-evidence).

<a id="primitive-helper-source-tests"></a>
[Historical Primitive helper source tests](../archive/crosscutting-093/build-and-test.md#primitive-helper-source-tests).

<a id="blob-source-test-coverage"></a>
[Historical Blob source-test coverage](../archive/crosscutting-093/build-and-test.md#blob-source-test-coverage).

<a id="nested-wrapper-source-test-inventory"></a>
[Historical Nested-wrapper source-test inventory](../archive/crosscutting-093/build-and-test.md#nested-wrapper-source-test-inventory).
