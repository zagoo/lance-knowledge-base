> Historical pre-V2.1 cross-layer notes. Not current scope, progress or acceptance criteria. Tests/binaries are excluded; retained production details are canonical in frozen L2/current contracts.

> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Build and test landscape

**INCOMPLETE.** Cargo, Python/maturin, Java, CI workflows, feature matrices, test utilities, and fixture generators remain to be analyzed. No Lance build, test, or lint has run during this read-only knowledge extraction.

[Entry](../../README.md) · [Module](../../L1-modules/protos.md) · [Cookbook](../../L4-crosscutting/cookbook.md)

For protobuf work, maintainer policy names ci/check_proto_comments.py, the pre-commit hook, and the Protobuf lint workflow as comment-style checks. Multiline comments use block form; --fix rewrites violations. Actual script behavior and environment commands need their own analysis before execution. (protos/AGENTS.md:23-27)

Persisted schema changes require format-spec-vote, paired format documentation, and a separate implementation follow-up; the three execution-wire schemas are exempt from this persisted-format vote process. This exemption does not waive field-number compatibility. (protos/AGENTS.md:5-15)

External KB tools are separate from repository build tools: inventory.mjs records paths/hashes/classifications; render-analysis.mjs requires contiguous authored ranges before analyzed status; symbols.mjs indexes analyzed schemas and manually reviewed Rust records. These tools provide structural evidence, not compilation or runtime verification.

The [contributor-policy module](../../L1-modules/contributor-policy.md) preserves all six AGENTS.md guides. Language environment rules apply before build, test, lint, format or tooling commands; an out-of-workflow failure is first an environment-usage mistake. No build or repository mutation has been needed for the external KB scripts. (AGENTS.md:34-38)

## Reviewed core test landscape

| Surface | Assertions inspected | Gaps in this file, not claims about all repository tests | Evidence |
|---|---|---|---|
| SIMD | Snapshot tier/ARCH, host sse2 or empty feature list, FMA-tier implication, ten Display cases | No forced feature matrix or kernel execution | rust/lance-core/src/utils/cpu.rs:306-369 |
| CPU runtime | Original panic payload, numeric trim/parse/minimum handling | No fork lifecycle or initializer-panic recovery test here | rust/lance-core/src/utils/tokio.rs:210-272 |
| Shared stream | Bounded replay/backpressure, unbounded independent drains, repeated EOF, dropped peer/poller recovery, explicit wake, stress order | No Bounded(0), panic recovery or counter-overflow case; stress has no final count assertion | rust/lance-core/src/utils/futures.rs:372-511; rust/lance-core/src/utils/futures.rs:562-701 |
| Callback wrappers | OnDrop early/after EOF/unpolled cases | No FinallyStream-specific test or callback-panic case here | rust/lance-core/src/utils/futures.rs:513-560 |
| Assertion macros | Both failure arms panic for each macro | No successful-path or message-content assertions | rust/lance-core/src/utils/assume.rs:30-43 |
| Boolean parsing | Ten true, ten false, five unknown spellings | No environment/default/non-Unicode cases here | rust/lance-core/src/utils/parse.rs:45-83 |

Tests in this table were read, not executed. Runtime stress duration, CPU performance, concurrency correctness under all schedules and cross-platform compilation remain unverified. Source thresholds/timeouts are not measured execution times. (rust/lance-core/src/utils/tokio.rs:146-149; rust/lance-core/src/utils/futures.rs:481-511; rust/lance-core/src/utils/futures.rs:562-701)

The error tests add clone-accessor contracts, typed std IO/Arrow/DataFusion round trips, selected ? caller locations, unknown-commit suppression of not-found, and multi-owner Shared source discovery. DataFusion cases are feature-gated; backtrace tests have different compiled branches and one env predicate/comment discrepancy. Existing tests do not establish losslessness for every conversion or all source-chain shapes. (rust/lance-core/src/error.rs:1155-1748)

Levenshtein tests cover ASCII empty/equal/edit cases and several typo suggestions. They do not directly assert Unicode/grapheme distinctions, tie ordering, empty option lists or short exact matches. These gaps are recorded for future development recipes; no source tests are added during this read-only task. (rust/lance-core/src/levenshtein.rs:91-133)

## Reviewed core datatype tests

No tests were executed. The datatype tests cover dictionary equality symmetry/unloaded reflexivity, parseable integer-key dictionaries, early rejection of unrepresentable dictionary strings, timestamp timezone roundtrips/rejections and blob shape classification. Field tests cover Arrow conversion and view normalization, map rejection, comparison diagnostics/options, nullability direction, blob transformations and repeated projection of synthetic descriptor children. (rust/lance-core/src/datatypes.rs:632-985; rust/lance-core/src/datatypes/field.rs:1350-2220)

Useful existing test targets include test_dictionary_partial_eq_contract, test_manifest_derived_dictionary_schemas_compare_equal, test_classify_blob_v2_layout_uses_structural_contract, test_dictionary_logical_type_rejects_unparsable_value, blob_v2_logical_shapes_are_compatible, map_keys_sorted_unsupported, test_explain_difference and blob_descriptor_projection_preserves_synthetic_children. Use the repository's Rust environment before cargo test -p lance-core with a selected name; this KB extraction does not report those commands as run or passing. (rust/lance-core/src/datatypes.rs:646-768; rust/lance-core/src/datatypes.rs:850-883; rust/lance-core/src/datatypes/field.rs:1371-1437; rust/lance-core/src/datatypes/field.rs:1632-1664; rust/lance-core/src/datatypes/field.rs:1852-2027; rust/lance-core/src/datatypes/field.rs:2182-2220; rust/AGENTS.md:1-65)

## Reviewed Schema tests

The full schema test block was read without execution. Existing targets cover quoted paths, reserved lineage IDs, schema projection/intersection/exclusion, merge-ID assignment and metadata precedence, comparison, key structure/order and zero-dimensional nested fixed-size lists. test_schema_difference_subschema never enables allow_subschema and has one reordered diagnostic assertion against the earlier variable; the fixed_l fixture in test_schema_project_by_schema is a variable List. Record these limits when selecting regression tests rather than inferring coverage from names. (rust/lance-core/src/datatypes/schema.rs:1760-3225; rust/lance-core/src/datatypes/schema.rs:2180-2245; rust/lance-core/src/datatypes/schema.rs:2610-2710)
## Core containers, memory and small utilities

The additional unit/doctest cases were read, not run. They should not be reported as passing tests merely because assertions appear in source.

| File | Existing assertions | Uncovered local edge cases identified by inspection | Evidence |
|---|---|---|---|
| list | 100 pushes, 50 reverse pops, forward iteration, clear, collect, cap ten | Unequal-length prefix equality; size_hint after next; preallocated emptiness; zero/oversized capacity limits | rust/lance-core/src/container/list.rs:252-306 |
| deepsize | Primitive exact inline size; heap lower bounds; repeated batch/Arc/shared-column dedup; nested structs/derive | Poisoned locks, offset-alias accounting, exact metadata/control overhead | rust/lance-core/src/deepsize.rs:300-467 |
| hash | Doctest matching/missing retrieval and inequality; unit negative cases | No asserted persisted hash algorithm | rust/lance-core/src/utils/hash.rs:5-50 |
| bit | Positive power checks, valid alignments, bit-width comparisons over 1..16384 and large values | Zero power predicate, invalid alignment, zero width panic | rust/lance-core/src/utils/bit.rs:4-153 |
| backoff | No-jitter sequences, min/max/reset, slot membership/cap, widened product, saturated slot counter | Negative jitter, min>max, ordinary Backoff counter overflow, distribution fairness | rust/lance-core/src/utils/backoff.rs:161-291 |

For actual future Rust execution, follow the existing [Rust environment/build guidance](../../L2-files/rust/AGENTS.md.md); this analysis adds no environment setup or test command evidence. (rust/AGENTS.md:1-90)
## Deletion vectors and single-rewrite mapping

Deletion tests use rstest and a coverage-excluded module; the densest mapper fixture has 1,000 physical rows but asserts four selected outputs. Adapter Tokio tests cover default batch behavior and two-source/two-destination layout adaptation, checking error variant and text. These tests were read and not executed. (rust/lance-core/src/utils/deletion.rs:294-522; rust/lance-core/src/utils/fragment_reuse.rs:74-144)

No static source finding in this slice is reported as a runtime regression. Validation for future changes must retain the existing assertions and add the missing boundary cases called out in the [supplement](../../L1-modules/rust-lance-core-deletion-mapping.md).
## Ordered and stable-partition row mapping

Row remap tests include representation-specific ranks, explicit old/new order, chains and a proptest against an independent Direct oracle; the property discards all-deleted cases and exercises plain compact. Hash tests assert limited low-bit distribution and composite-key equality correctness. Stable-partition tests use deterministic seeds7/42 and compare point/sweep translation to a per-label HashMap oracle, with0xBEEF at NULL positions. These are inspected coverage facts; no tests were run. (rust/lance-core/src/utils/row_addr_remap.rs:795-1325; rust/lance-core/src/utils/stable_partition.rs:484-697)

For future behavioral changes, extend existing modules with constructor failure categories, layout endpoints, destination duplicates, corrupted count budgets, validity lengths and sweep boundaries as appropriate. Follow the established Rust environment guide before invoking repository tooling. (rust/lance-core/src/utils/row_addr_remap.rs:391-470; rust/lance-core/src/utils/row_addr_remap.rs:563-605; rust/lance-core/src/utils/stable_partition.rs:191-218; rust/lance-core/src/utils/stable_partition.rs:387-482; rust/AGENTS.md:1-90)
## AIMD control and object-store test instrumentation

AIMD's rstest cases assert InvalidInput and text, while most transition tests inject explicit Instant values into a private helper rather than sleeping. The real-time within-window test assumes100 calls finish within10seconds. testing.rs has no local tests and is a publicly exported utility module. Its wrappers can inject path failures, transform metadata or count listing attempts with operation-specific limitations. (rust/lance-core/src/utils/aimd.rs:292-679; rust/lance-core/src/utils/testing.rs:27-300; rust/lance-core/src/utils.rs:22-22)

The [statistics seed corpus](../../L2-files/rust/lance-core/proptest-regressions/io/writer/statistics.txt.md) retains six records and the [mask corpus](../../L2-files/rust/lance-core/proptest-regressions/utils/mask.txt.md) two. Their standard headers describe replay-before-new-cases, but current persistence wiring/harness consumers have not been identified. Never report source seed presence as passing a regression test. (rust/lance-core/proptest-regressions/io/writer/statistics.txt:1-12; rust/lance-core/proptest-regressions/utils/mask.txt:1-9)
## Generic split-block Bloom filters

AsBytes assertions pin representative little-endian integer/float bytes, UTF-8/slice passthrough and bool0/1. SBBF assertions pin empty-string hash17241709254077376921, mask shape and positive membership, nine analytical sizing examples and a50-item serialization round trip. Tests provide a few deterministic negative samples but no empirical FPP/recall benchmark, upstream golden fixture, malformed-empty handling, intersection test, conflicting-config test or write-error injection. All tests were read only. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:94-164; rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-622)

## Cache protocol source tests

key.rs includes size, keyed-hash vector,17-field-sequence separation, namespace/type/schema/version separation, endian reference and full golden vector tests. backend_uri.rs covers basic parsing and selected error messages; registry.rs uses global serialization plus save/restore guards. These tests were read only; no cargo command was run. Concrete backend and allocation-test source analysis appears below; execution and benchmark validation remain unperformed. (rust/lance-core/src/cache/key.rs:316-476; rust/lance-core/src/cache/backend_uri.rs:173-265; rust/lance-core/src/cache/registry.rs:195-372)

## Cache codec/entry IO test evidence

Wrapper tests use synthetic Widget, foreign ids/versions and selected truncated/historical-shaped bytes. Entry IO tests assert local framing/errors,13-byte-envelope absolute alignment, multi-batch and mixed-section roundtrips. This extraction ran no Rust tests. Full IPC dependency behavior, allocation tracking, failing writers and production codec matrices remain unverified. (rust/lance-core/src/cache/codec.rs:373-553; rust/lance-core/src/cache/entry_io.rs:204-392)

## Memory backend test landscape

Moka: four parameterized zero-capacity independence cases, byte-granular weight/capacity checks, maintained/approx accounting,64-bit coarse-weight arithmetic and config/URI success/error cases. Quick: deterministic shard-size boundaries, collision-targeted fragmentation/direct insert,970/971 admission boundary, error/cancellation contenders, sequential high-level reuse and overfill/tiny-cache retention. These are read source tests only; no timings or test-pass claims. (rust/lance-core/src/cache/moka.rs:203-315; rust/lance-core/src/cache/moka.rs:368-431; rust/lance-core/src/cache/quick.rs:268-607)

## Typed cache source tests

The facade covers typed stats/clear/namespace sharing; live and expired weak handles; nested segments and schema misses; sized/unsized default string bridges; custom backend dispatch; sized wrong-type defense; Moka key weights; shared-allocation deep size on both backends; reentrant sizing; disabled sequential loading; and Moka concurrent success/error/cancellation with explicit pending handshakes. The latter have unbounded setup waits; cancellation bounds the final contender wait to five seconds. No test execution or compile evidence was produced. (rust/lance-core/src/cache/mod.rs:737-756; rust/lance-core/src/cache/mod.rs:1040-1485)

## Cache measurement targets

Cargo declares cache_keys with harness=false; Criterion registers three groups. Integration file cache_key_allocations installs a binary-global tracking allocator and contains one test withthree warmed zero-count assertions. Source inspection adds no pass/fail/timing evidence. Existing repository environment/profile rules still apply before any future execution; no build/test/benchmark was run for the offline goal. (rust/lance-core/Cargo.toml:60-65; rust/lance-core/benches/cache_keys.rs:359-365; rust/lance-core/tests/cache_key_allocations.rs:47-57; rust/lance-core/tests/cache_key_allocations.rs:125-166)

## lance-table package setup (source-only)

Cargo manifest inherits workspace pins/lints; do not infer concrete versions from it. Feature protoc adds protobuf-src and sets build-process PROTOC; docs.rs requests it. Feature dynamodb enables optional AWS dependencies and lance-io/aws. Build script compiles table/transaction/rowids schemas and maps inline row IDs to Bytes. No build, install, test or benchmark was executed. (rust/lance-table/Cargo.toml:1-87; rust/lance-table/build.rs:6-32)

The source flag tests exercise masks via supported_flags_when arguments, metadata-derived flags and pairing errors. Their presence does not establish historical release compatibility or current test success. (rust/lance-table/src/feature_flags.rs:380-820)

## Table wrapper test evidence

row_ids source tests check content-sensitive hashes, clone pointer sharing, separately allocated equal bytes, Bytes-slice reuse, length-based deep-size accounting and exact JSON/protobuf roundtrip. Transaction wrapper tests check a4MiB-tag Delete remains exempt, Overlay exemption, field-metadata update classification and conservative Overwrite/None. These tests are source evidence only; no Rust test execution or successful compilation is claimed. (rust/lance-table/src/format/row_ids.rs:168-244; rust/lance-table/src/format/transaction.rs:84-163)

## Fragment and manifest source test coverage

Fragment fixtures cover dense/sparse overlay metadata roundtrip and stable ordering, legacy nested field IDs, deletion metadata, exact versions including overlay mismatch, evolved struct projection, JSON layout and extra column acceptance. These tests create metadata, not on-disk data/overlay files. The extra-column fixture uses imported legacy format constants, so it alone does not prove execution of the non-V1 validation branch. (rust/lance-table/src/format/fragment.rs:911-1252)

Manifest fixtures cover local base/overlay clone stamping, absent-format fallback, persisted selector rejection/canonical output, mixed inference rejection,20/80 versus20/81 row-ID detachment, semver decomposition/comparison, logical ranges over10/15/20 rows, max physical/overlay field IDs, config mutation and summary counters. Missing-field metadata errors, interner promotion, lineage-carrier errors, stale/zero offsets and overflow boundaries are not tested in these two local test modules. Do not infer absence of tests repository-wide before other files are analyzed. All tests and the dictionary doctest were read, not run. (rust/lance-table/src/format/manifest.rs:601-633; rust/lance-table/src/format/manifest.rs:1184-1825; rust/lance-table/src/format/fragment.rs:911-1252)

## Metadata source-test map (iteration26)

Index tests cover run-compressed coverage, a simulated cache roundtrip, covering protobuf persistence/rejection, keyed-prefix cases and type-URL cases. Overlay tests cover required protobuf options, run compression, JSON dense/sparse empty forms, tombstoning, order checking and sparse lookup bounds. Key-existence tests cover Int32/UTF8 lists and structs, empty lists and null children. All were inspected only; no build/test/benchmark was run. (rust/lance-table/src/format/index.rs:444-707; rust/lance-table/src/format/overlay.rs:329-475; rust/lance-table/src/format/key_existence.rs:391-718)

Unverified by these local fixtures: actual index-directory listing/HEAD avoidance; malformed timestamp panic; Any heap accounting; overlay rank/value IO and bitmap alignment; filter builder/config/protobuf/intersection behavior at concurrent commit boundaries. Full runtime qualification remains outside completed coverage.

## lance-file build and reviewed tests

protoc optionally selects vendored protobuf-src; build.rs sets PROTOC, enables proto3 optional, maps encoding types externally and compiles four shared schemas. Generated modules are included from OUT_DIR. docs.rs enables protoc; reader/schema benches disable harness. Full crate dependencies are listed in the [module guide](../../L1-modules/rust-lance-file.md). No build/compiler invocation was performed. (rust/lance-file/Cargo.toml:14-72; rust/lance-file/build.rs:1-29; rust/lance-file/src/format.rs:4-28)

Version tests pin selector/default/alias, canonical manifest rejection, numeric metadata/footer mapping and8-byte synthetic legacy recognition. Staleness tests pin version thresholds, unrelated/nested fields, sparse per-field offsets, unions and missing/present coverage. These source fixtures do not establish real file compatibility, actual query fallback or exhaustive error behavior. Tests were read only. (rust/lance-file/src/version.rs:274-430; rust/lance-table/src/format/overlay/staleness.rs:160-415)

## Row-version and hole-run source tests

version.rs has JSON marker/inline roundtrip, RLE construction, positional random access,10,000-run partial refresh, protobuf roundtrip, stable-ID lookup and cursor tests for gaps/rewind/empty/non-range spans, descending/alternating indexed seeks and one bounds error. No local direct mask/rechunk/build/full-refresh or corrupt-inline/preload/empty-VersionsIter regression is present. Other transaction tests have not yet been analyzed. (rust/lance-table/src/rowids/version.rs:849-1134)

runs.rs tests exact counts/gaps in both directions, rank/select inverses, clipped expansion, six bitmap patterns and five malformed-bound categories. Malformed tests assert a message substring, not the error variant. All these tests were read, not executed; their names supply no timing or performance qualification. (rust/lance-table/src/rowids/runs.rs:217-325)

## Row-ID primitive and codec source tests

Bitmap fixtures check debug/count/mutation/equality, valid slice count and logical iteration; properties use small boolean arrays and valid clamped slices. Encoded arrays cover exact representations, roundtrip/get/min/max and double-ended iteration/range conversion; binary search, slices, exact thresholds and malformed direct state lack local cases. (rust/lance-table/src/rowids/bitmap.rs:181-358; rust/lance-table/src/rowids/encoded_array.rs:256-400)

Codec tests assert byte-exact bitmap payload, mixed roundtrip/folding, sorted-unique property roundtrip, malformed bitmap shape/padding/reverse bounds, packed alignment, relative overflow, invalid holes/sorted arrays and aggregate length overflow. Assertions check CorruptFile and diagnostic substrings. Current-code Ranges roundtrip does not prove the comment about all historical versions. All tests were read and documented, not executed. (rust/lance-table/src/rowids/serde.rs:428-884)

## Segment source tests and gaps

Local tests cover bitmap public mutation, dense/partial expansion, five constructor forms, iterator direction/interleaving and get/position inverses, zero-span empty extrema, u64 boundary construction, large hole counts, synthetic cost saturation, append/contains and Ranges equivalence/size rejection. Several delete/mask checks compare two forms using the same implementation rather than an independent survivor oracle. (rust/lance-table/src/rowids/segment.rs:957-1624)

The hole-count test comment says every width, but its actual arrays select U32 and U16; no forced U64 holes occur in that fixture. Full-span bitmap cost test assumes64-bit usize without cfg guard. Empty-extrema fixture omits nonempty bounds with zero presence and Ranges. No local duplicate-construction, malformed masks, compressed append widening or u64MAX append test exists. Source tests were read, not executed. (rust/lance-table/src/rowids/segment.rs:1113-1135; rust/lance-table/src/rowids/segment.rs:1222-1294; rust/lance-table/src/rowids/segment.rs:1296-1624; rust/lance-table/src/rowids/encoded_array.rs:193-212)

## Row-ID sequence test evidence

The full sequence test module covers checked construction/order/duplicates, range concatenation, delete/mask encodings, valid borrowed slices and size hints, rechunk cardinality/value cases, all ReadBatchParams forms on valid inputs, selected InvalidInput bounds, overlapping bitmap set conversion, ordinary/dense cursor chunks/rewinds, and compact Ranges roundtrip. Its million-slot cursor case has correctness assertions but no elapsed-time assertion. (rust/lance-table/src/rowids.rs:1130-1730; rust/lance-table/src/rowids.rs:2119-2309)

Mask tests include deterministic small-ID fixtures, fifty seeded generated cases and multiple-bitmap finite/broad selection. The brute-force oracle still shares GroupingIterator and segment iteration/length; seeds0 and1 produce the same initial state. Missing coverage includes high32 carry ends, empty Range0..0 set conversion, malformed masks, duplicate deletion requests, invalid RangeFrom/reversed ranges, nullable index validity, trailing empty segments after exact rechunk completion, Display formatting and cursor reuse with changed source. Tests were read only. (rust/lance-table/src/rowids.rs:1731-2117; rust/lance-table/src/rowids.rs:1902-1919; rust/lance-table/src/rowids.rs:1055-1127)


## Transaction lineage test coverage

transaction/row_version.rs has direct metadata helper tests and synchronous build_manifest integration tests. Shared fixtures set stable reader flags and manifest version4, default next-ID1000, update read_version4/update_modeNone, and default build config use_stable_row_idsfalse; these are not disk/commit retry tests. Column markers/preloads are in-memory objects with empty data-file lists. Parameterized placed-inline count cases test50 success and40 failure. Run/scan efficiency comments have no operation-count assertions. No tests were executed for this read-only KB task. (rust/lance-table/src/transaction/row_version.rs:408-419; rust/lance-table/src/transaction/row_version.rs:457-703; rust/lance-table/src/transaction/row_version.rs:886-1461; rust/lance-table/src/transaction/test_support.rs:21-34; rust/lance-table/src/transaction/test_support.rs:73-124)



## Shared transaction fixture interpretation

test_support is cfg(test) and supplies metadata-only helpers. sample_manifest uses id:Int32nonnull/V2_0/fragment0; stable fixture sets reader flag, nextID1000 and version4. update_txn uses read4/modeNone with empty changed-field/index fields. default config uses current clock, stableIDsfalse and empty preloads; sample index adds random UUID/current timestamp. created/latest version helpers unwrap every lookup/load and materialize Vecs. Tagged histories assume valid even splits and bounded IDs. No storage, retry or index-query success follows from constructing them. (rust/lance-table/src/transaction.rs:41-42; rust/lance-table/src/transaction/test_support.rs:20-199)



## Local transaction equality tests

conflicts.rs has two tests: table metadata same/different key plus one replacement case, and DataOverlay same/different field plus overlay-left versus Rewrite inequality. There is no local full16-kind matrix, duplicate symmetry/permutation, upsert-key predicate, empty/schema/field overlap or durable-outcome test. Other test modules may cover these; full resolver/test analysis remains pending. Shared overlay fixture uses a legacy DataFile and version1; it validates metadata comparisons only. No tests were executed. (rust/lance-table/src/transaction/conflicts.rs:992-1042; rust/lance-table/src/transaction/test_support.rs:63-69)



## Transaction validation source tests

validate.rs defines seven test functions, one with two rstest cases. They cover original fragment count/inclusion and accepted extras; two-fragment type/nullability full versus partial rewrite; unchanged/moved-offset dictionaries; retained overlays; fresh field-ID success; i32 ID exhaustion; and Overwrite bypass of an old legacy manifest. Fixtures mix legacy DataFile metadata with V2_0 manifest labels; none creates physical data files. The stable-named overwrite fixture actually uses V1. No tests executed. (rust/lance-table/src/transaction/validate.rs:418-755)

The contextual manifest-build offset-key test updates fragment1, supplies offsets for unrelated existing fragment2, and asserts validation error. Local validate.rs lacks direct cases for absent datasets/Clone, overwrite deletions, generic modern/legacy checks, physical detector/cache sizes, duplicate IDs and extra-fragment shared-binding materialization. This is a local coverage inventory, not a claim those cases are absent from all repository tests. (rust/lance-table/src/transaction/manifest_build.rs:3643-3693; rust/lance-table/src/transaction/validate.rs:418-755)



## Transaction protobuf tests

Two local tests: transient rewrite metadata disappears; a hand-built overlay transaction decodes group7,coverage{1,4},version6. They exercise generated objects and nested bitmap serialization, without complete transaction byte IO. The transient test starts with empty groups but asserts only reuse entry None; the overlay test never encodes the outer Rust Transaction. Other modules contain lexical roundtrip call sites still pending full analysis. No source tests executed. (rust/lance-table/src/transaction/proto.rs:808-885)



## Index-maintenance test surface

Thirty local metadata tests:23 main tests cover group selection, fragment order/ID assignment, schema/system/name/bitmap retention, missing rewritten-index skipping and overlay staleness; seven withdrawal tests cover transitive/direct provenance, whole live-only fallback, known/unknown history and field/bitmap exclusions. The module claim that every rule is tested exceeds the direct branch coverage: no local malformed empty-group/bounds/rollback, descendant expansion or empty-sibling retirement test. TaggedLineage has no local tests, though these withdrawal tests exercise its inline history. Tests were read, not run. (rust/lance-table/src/transaction/index_maintenance.rs:4-7; rust/lance-table/src/transaction/index_maintenance.rs:794-1639; rust/lance-table/src/system_index/frag_reuse/lineage.rs:1-140)



## Tagged gate and metadata tests

Gate has45 parameterized cases plus one migration test. They assert Admission/error category across selected operation/state pairs; only migration separately checks message content. Fixture transition assembly is constructed directly and does not exercise binding/conservation/ledger validation. Metadata file has two predicate tests; no local flag validator/clone IO test. A contextual consumer test verifies unflagged clone guard accepts a missing manifest path without read. No tests executed. (rust/lance-table/src/system_index/frag_reuse/gate.rs:308-332; rust/lance-table/src/system_index/frag_reuse/gate.rs:436-622; rust/lance-table/src/system_index/frag_reuse/metadata.rs:71-123; rust/lance/src/index/frag_reuse_reader.rs:1011-1023)



## Ledger and compatibility-remap tests

Ledger has20 test functions:35 instantiated ordinary unit/async cases plus two property tests accepting random byte vectors shorter than4096. They cover fingerprints, mixed/topological/source ordering, unknown omission, duplicate producer/consumer/cycles, ambiguous fields, malformed wire/digests, conservation, all-deleted sources, version precedence and external ranges. Callback-based legacy equivalence compares current serializer with current compact adapter in inline/external modes; it is not a released fixture or real storage read. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:588-1042)

Parent file has four test functions/six cases: compact chain tri-state behavior, invalid bitmap, three layout rejections and permissive metadata sorting roundtrip. The async conversion fixture uses invalid bitmap/nonconserving counts without invoking remap validation. No source tests were executed. (rust/lance-table/src/system_index/frag_reuse.rs:598-856)



## MemWAL metadata tests and contextual progress tests

Two local unit tests verify missing measurements stay None and measured4096/10/80 values roundtrip completely. They construct current protobuf objects; no historical files or runtime memory measurements are involved. (rust/lance-table/src/system_index/mem_wal.rs:620-660)

Selected contextual tests in the still-partial dataset adapter file verify adding/advancing two shards, lower/equal rejection, duplicate proposals, missing index, index-list position and selected unrelated fields. The lower-generation case checks UUID unchanged and generation10 retained; it does not compare the entire metadata list. These tests were read, not run, and the surrounding file remains pending. (rust/lance/src/index/mem_wal.rs:670-861)



## Manifest-builder regression landscape

All tests1944-5468 are read and annotated, not executed. They cover tagged admission/preparation, physical coverage withdrawal, CreateIndex UUID behavior, Update/Deletions and projected files, bitmap bounds, protobuf offsets, Merge lineage modes, multi-fragment overlays, replacement/tombstone/recency rules, hidden carriers, nullability codec and MemWAL accounting. Helpers construct metadata and current protobuf objects; no released historical fixtures or actual index recall/disk publication are proven. (rust/lance-table/src/transaction/manifest_build.rs:1944-5468)

Exact important matrix sizes: six projected-file cases (three modes by spilled yes/no), three in-place operation variants for preparation, two carrier layouts and two missing/V1-carrier errors. Targeted tests assert only selected metadata in many places; L2 records those limits. No local fixture proves entire prepared-gate direct call, same-version different-manifest binding, actual external-history loading, new-file row-count equality or full concurrent commit recovery. (rust/lance-table/src/transaction/manifest_build.rs:2778-3047; rust/lance-table/src/transaction/manifest_build.rs:3175-3296; rust/lance-table/src/transaction/manifest_build.rs:4652-4764; rust/lance-table/src/transaction/manifest_build.rs:5381-5468)


## Manifest/deletion IO source tests

Manifest roundtrip fixtures vary random ignored prefix and deterministic field-name length, including20MiB to cross16MiB chunks. They assert Manifest equality after body/footer/shutdown; derived Manifest equality delegates schema comparison to Schema::PartialEq, which ignores top-level schema metadata, so this is not a complete metadata oracle (rust/lance-table/src/format/manifest.rs:38-41; rust/lance-core/src/datatypes/schema.rs:874-878). A separate fixture verifies absent index section clears inherited42; legacy provider fixture checks schema metadata. A created config map in roundtrip helper is unused, so config persistence is not covered there. Known-size retry, transaction-section clearing, malformed footer and failure atomicity are not directly tested in this file. (rust/lance-table/src/io/manifest.rs:253-392; rust/lance-io/src/utils.rs:27-27)

Five deletion tests cover NoDeletions returnNone, raw Arrow/bitmap write inspection and public read roundtrips for0..100 offsets. They use one fragment and current memory-store writers, not historical fixtures or dataset delete/scan/commit. All source tests were read, not executed. (rust/lance-table/src/io/deletion.rs:218-370)


## Commit source test coverage

The commit module tests naming, migration, sorted/current lookup, hint cases, detached listing, routing and COS rejection with current memory/local fixtures. Lease cancellation tests use a writer that hangs or returns a default result without IO and release trackers; 50 ms timeouts trigger cancellation, followed by up to 100 sleeps of 10 ms. The early-stop fixture counts list metadata callbacks and expects one clean entry or two with staging junk. These are source assertions, not executed or timed results. Full remote atomicity, external identity, corruption, mixed-scheme, release-error and runtime-shutdown qualification remains absent here. (rust/lance-table/src/io/commit.rs:1749-2490)


## External manifest source-test coverage

The generic mock keys by (base URI, version), supports error-after-insertion and failed/paused index update, and uses memory objects plus a named proxy COPY failure. The identified mock keys only by version, mints counter strings, preserves token across path compaction and changes tokens in a record-only recreation. Neither is a production distributed backend. Generation-race wait is five seconds; cancelled-reservation wait is thirty seconds. These are declared test bounds, not measured runtimes. (rust/lance-table/src/io/commit/external_manifest.rs:1195-1347; rust/lance-table/src/io/commit/external_manifest.rs:1677-1779; rust/lance-table/src/io/commit/external_manifest.rs:1934-2040; rust/lance-table/src/io/commit/external_manifest.rs:2041-2239; rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)

All local tests were read, not executed. The full test matrix and untested copy/cancellation boundaries are recorded in [external commit](../../L1-modules/rust-lance-table-external-commit.md).


## DynamoDB and row-ID index source evidence

DynamoDB local tests are pure size-attribute parsing; no SDK integration or pagination fixture is present. Row-ID index fixtures cover representation choice and functional parity, including random live/deleted/moved/duplicate rows; one large Range test asserts construction under one second without being executed here. Full performance evidence requires actual prescribed benchmark execution, which this read-only task did not perform. (rust/lance-table/src/io/commit/dynamodb.rs:515-586; rust/lance-table/src/rowids/index.rs:745-1641)

row_id_index benchmark registers six workloads, optional Linux flamegraph profiling, CSV output and environment-controlled synthetic sizes. Its shot-table and bitmap-mask cases have explicit sample/warmup/measurement settings, while basic lookup comparisons use unequal units. Consult the [complete benchmark analysis](../../L2-files/rust/lance-table/benches/row_id_index.rs.md) before interpreting output. (rust/lance-table/benches/row_id_index.rs:76-115; rust/lance-table/benches/row_id_index.rs:205-277; rust/lance-table/benches/row_id_index.rs:504-626)


## Table stream tests and final three benchmarks

The stream tests assert column alignment, sparse/unsorted/repeated IDs, physical deletion offsets, read-ahead pointer sharing, zero/truncated tasks, variable-size fallback, structural schema reuse and version RLE alignment. They use ready in-memory tasks; delayed IO, unequal totals, shared-error fanout and malformed public config remain local coverage gaps. None was run. (rust/lance-table/src/utils/stream.rs:850-1887)

[Benchmark contracts](../../L1-modules/archive/rust-lance-table-benchmarks.md) document BENCH_NUM_FRAGMENTS, BENCH_SYSTEM_ROWS/BATCH_SIZE/VARIABLE_BATCHES and BENCH_VERSION_ROWS/BATCH_SIZE. Fragment benchmarks measure conversion of decoded messages and graph estimates; direct version timing covers one batch while stream timing covers all rows. System/version groups collect all outputs and request ten samples, one-second warmup and three-second measurement. No timing or RSS result is claimed. Use repository release-with-debug policy for actual benchmark work. (rust/lance-table/benches/manifest_intern.rs:20-263; rust/lance-table/benches/system_columns.rs:92-172; rust/lance-table/benches/version_columns.rs:80-160; AGENTS.md:19-31)


## File runtime boundary tests read in iteration52

Seven datatype tests cover assigned flattened IDs, schema equality roundtrip,4096 wide roots,1024 deep nesting,missing parent,duplicate-ID tie-break and clustering metadata positions. The metadata roundtrip equality ignores schema-level metadata; its name overstates that oracle. Two source doctests assert a reconstructed root name and an owner metadata value. (rust/lance-file/src/datatypes.rs:139-156; rust/lance-file/src/datatypes.rs:254-269; rust/lance-file/src/datatypes.rs:370-565; rust/lance-core/src/datatypes/schema.rs:874-878)

The dispatch module locally tests only V1 rejection by both embedded batch encoders. IO and field_types have no local test modules; writer.rs points to writer_tests.rs, now fully analyzed in the later complete test catalog. No builds, tests, benchmarks or toolchain installations were run. Therefore these are coverage observations, not runtime qualification. (rust/lance-file/src/versions/mod.rs:403-428; rust/lance-file/src/io.rs:1-148; rust/lance-file/src/writer/field_types.rs:1-193; rust/lance-file/src/writer.rs:292-294)

## Composition and structural-reader test boundary

The four composition and three compression policy modules contain no inline tests. V2_0/V2_1 expose exact reader test_projection_length under cfg(test); shared structural test_projection_length is a synthetic-length helper, with missing index errors but no fixture/assertion itself. Policy source inspection is not runtime validation, compatibility qualification or a measured performance result. (rust/lance-file/src/versions/v2_0/mod.rs:24-25; rust/lance-file/src/versions/v2_1/mod.rs:40-41; rust/lance-file/src/reader/structural.rs:434-445)

## Exact reader grammar fixtures

V2_1 rejects VariablePackedStruct nested under General/FullZip by error text; V2_2 rejects Dictionary-index RLE with Flat16 lengths; V2_3 accepts the same nested shape. These cover visitor traversal rather than encoded file data. V2_0 synthetic projection helper omits surplus-index validation that production performs; the shared/V2_1 helper includes it. Tests were read, not executed. Missing local sparse/identity/descriptor matrices must not be inferred covered by these three cases; separate writer/compatibility suites remain pending. (rust/lance-file/src/versions/v2_0/reader.rs:279-310; rust/lance-file/src/versions/v2_0/reader.rs:397-415; rust/lance-file/src/versions/v2_1/reader.rs:260-304; rust/lance-file/src/versions/v2_2/reader.rs:262-308; rust/lance-file/src/versions/v2_3/reader.rs:300-341)

## Structural writer helper tests

Four local tests exercise nullability only: hidden child nulls, visible child null rejection, dictionary logical null rejection and sliced parent alignment. Rejection assertions check offending field text, not Error variants. They do not execute spill, footer, lifecycle, abort or object IO. The now fully analyzed writer_tests.rs includes V2_0/V2_1 unequal-length integration cases, plus separate JSON/preparation, compression, large-value and spill fixtures cataloged below; none of these tests was run. (rust/lance-file/src/writer/structural.rs:924-1025; rust/lance-file/src/writer_tests.rs:1084-1176) [Implementation](../../L1-modules/rust-lance-file-structural-writer.md).

## Exact-version compatibility harness and fixture generation

The private compatibility_tests module has three stable-current parameter cases, one embeddedV2_0 case, one same-revisionV2_3 case and one legacyV1 case. It checks exact bytes, footer mappings and data roundtrip for a deterministic4097-row fixture; embedded forms use two fields/257rows. At least one column must be multipage. No test was run during KB analysis. (rust/lance-file/src/compatibility_tests.rs:36-98; rust/lance-file/src/compatibility_tests.rs:318-524)

README pins commit3a72f8a61e14613f517dded6816d4bfc77817c93 and six hashes. datagen.py checks clean exact HEAD, temporarily copies baseline-compatible Rust example, runs two processes with separate outputs/shared isolated target and compares files. It never supplies --locked or --offline; --write updates per file and is not atomic across the set. Rust generator references historical APIs and must run in that baseline, not be silently rewritten for current APIs. The documented regeneration commands were read only. (rust/lance-file/test_data/exact_versions/README.md:3-41; rust/lance-file/test_data/exact_versions/datagen.py:32-125; rust/lance-file/test_data/exact_versions/datagen.rs:12-35; rust/lance-file/test_data/exact_versions/datagen.rs:102-228) [Provenance/failure details](../../L1-modules/rust-lance-file-v20-compatibility.md).

## Complete writer_tests.rs landscape

The file defines27 named tests and10 function helpers inside writer::writer_tests::tests, plus four significant local closures. Unequal-length/nested/blocking cases use only V2_0/V2_1; JSON/type mismatches span all four V2 versions; spill/compression/large-read cases use V2_1. [Exact matrix and signatures](../../L1-modules/archive/rust-lance-file-writer-tests.md). (rust/lance-file/src/writer_tests.rs:1-1976; rust/lance-file/src/writer.rs:292-294)

Success-only smoke/empty and metadata-only compression tests must not be reported as decoded-value coverage. Spill baseline equality does not prove threshold crossing or fault cleanup. Environment test globally mutates the cap unsafely without restoring prior state or serializing the process.40MiB payload and10x500x100 spill fixtures have no runtime measurement here. Tests were read, not run. (rust/lance-file/src/writer_tests.rs:72-154; rust/lance-file/src/writer_tests.rs:1382-1792; rust/lance-file/src/writer_tests.rs:1794-1976)

## Shared-reader test evidence

The complete reader file adds33test functions plus local fixtures/helpers. SparseV2_3 and dictionaryV2_2 assert full values; three corruption matrices use unique byte patterns and typed errors. Lazy direct/FSL/nested tests compare eager baselines; metadata IO checks exclude opening, and page/column IO grouping asserts one request only after warmup. Drop tests establish usability/no panic, not background completion. Deep-size tests check lower bounds without cache eviction or measured allocations. Exact fixtures and version matrices are in the [shared-reader guide](../../L1-modules/rust-lance-file-shared-reader.md). All were read, not executed. (rust/lance-file/src/reader.rs:2476-2656; rust/lance-file/src/reader.rs:2808-3100; rust/lance-file/src/reader.rs:3409-3937; rust/lance-file/src/reader.rs:4032-4804)

## Encoded concatenation test landscape

concat.rs has seven Tokio test functions, including one four-version rstest matrix, plus two local helpers. Tests assert output metadata/reuse, schema key preservation, version/legacy rejection, in-memory incomplete metadata and unused-lease overlap. No local concatenated payload equality or Blob descriptor/null/container/abort/cancellation tests exist. The corrupt-input is_err oracle alone cannot prove the factory was uncalled because the factory also returns Err. Tests were inspected, not executed. (rust/lance-file/src/concat.rs:1183-1587) [Exact test catalog](../../L1-modules/rust-lance-file-concat.md).

## V1 foundation test oracles

Metadata contains two synchronous tests: one two-batch index group and four valid range splits. PageTable contains one set/get test and two Tokio tests: a sparse local-file matrix with14zero cells, and empty-write/min-field/reversed-field-range errors checked by category/message. Roundtrip expected starts from actual.clone, so populated values lack an independent oracle. These tests were read only, with no timings or runtime results claimed. (rust/lance-file/src/versions/v1/format/metadata.rs:209-255) (rust/lance-file/src/versions/v1/page_table.rs:162-287)

The V1 facade, dictionary dispatch and four-line format namespace have no local test modules. Missing local tests include dictionary type/presence/partial-failure, projection duplicate/negative IDs, metadata None-vs0 and schema-metadata loss, unsorted/out-of-bounds indices, empty/reversed ranges, negative/zero-batch page tables, overflow and partial IO. This is a local test inventory, not a claim that no other repository tests exist. (rust/lance-file/src/versions/v1/mod.rs:1-116) (rust/lance-file/src/versions/v1/encoding.rs:1-192) (rust/lance-file/src/versions/v1/format/mod.rs:1-4) [Exact limits](../../L1-modules/rust-lance-file-v1-foundation.md).

## V1 concrete codec test coverage

The three codec files contain 18 active tests and five helpers: eight binary, nine plain and one dictionary test dispatching eight key types. Three plain test bodies are entirely commented out. Tests were read, not executed. Binary sparse/dense fixtures allocate a million strings; no runtime-duration claim is made. (rust/lance-file/src/versions/v1/encoding/binary.rs:431-710; rust/lance-file/src/versions/v1/encoding/plain.rs:442-852; rust/lance-file/src/versions/v1/encoding/dictionary.rs:177-253)

The dictionary fixture uses PlainEncoder directly and therefore supplies no DictionaryEncoder regression. Plain padding intentionally expects zero extension; narrow primitive/float fixtures reinterpret raw wider buffers. Leading binary repeats, disabled Boolean take/slice paths, mixed-type unsafe spans and failure/cancellation remain local test gaps. (rust/lance-file/src/versions/v1/encoding/dictionary.rs:209-238; rust/lance-file/src/versions/v1/encoding/plain.rs:456-490; rust/lance-file/src/versions/v1/encoding/plain.rs:575-592; rust/lance-file/src/versions/v1/encoding/plain.rs:717-832; rust/lance-file/src/versions/v1/encoding/binary.rs:616-662) [Detailed oracles](../../L1-modules/rust-lance-file-v1-codecs.md).

## V1 reader test landscape

Twelve active tests plus four helpers cover stable key discriminator strings, numeric/string/dictionary multi-batch take, nullable empty-string behavior, struct/list full and slice reads, Null length/type and weak error checks, List/LargeList take, sliced-list file-size/equality, one-batch range, even-batch stream order, Boolean take across a256-byte block and a narrow file with wider supplied schema. No test was executed. [Full oracle catalog](../../L1-modules/rust-lance-file-v1-reader.md). (rust/lance-file/src/versions/v1/reader.rs:827-1562)

The active5000-row Boolean test supplements the commented-out codec-local take test. It checks exact selected values, not request count. Tests do not establish cache hit/invalidation, metadata corruption handling, cancellation, arbitrary item metadata, parent null preservation or multiple fragments. (rust/lance-file/src/versions/v1/reader.rs:1459-1504; rust/lance-file/src/versions/v1/encoding/plain.rs:799-832)

## Frozen V1 writer tests

Seven active Tokio tests cover a 19-root/100-row complete roundtrip, sole dictionary field0, two timezone/unit timestamp combinations, one zero-row nonnullable UTF8 batch, exact two-batch statistics for four IDs, 250 slices from a shared1000-row Int32 buffer with size<16000, and in-memory page entries for schema IDs0/2. All were read, not run. No local fault/cancellation, provider-error, repeated-finish, overflow or nullability-rejection oracle is present. The statistics test does not request the list or omit a supported scalar, and its UTF8 bounds c/e contradict the implication of its stale increment FIXME. [Test catalog](../../L1-modules/rust-lance-file-v1-writer.md). (rust/lance-file/src/versions/v1/writer/mod.rs:715-1150; rust/lance-file/src/versions/v1/writer/mod.rs:1229-1311)

## V1 statistics source-test catalog

Fourteen test entry points cover empty outer panic/typed empty arrays,24 primitive cases, float extrema/NaN/zeros,13 binary/string/fixed-binary cases, two dictionary examples, collector failure plus exact output schema/data,19 constant values with/without null, timestamp timezone/unit sampling, float ordering, three string/binary/fixed-binary ordering generators and Boolean multi-array null totals. Tests were read, not run. Binary generators exclude0xFF; deterministic overflow fixtures supplement them. A width71 fixed-binary fixture expects an absent maximum tagged64 while production constructs71; equality/runtime status is unverified. [Full catalog](../../L1-modules/rust-lance-file-v1-statistics.md). (rust/lance-file/src/versions/v1/writer/statistics.rs:932-2249) (rust/lance-file/src/versions/v1/writer/statistics.rs:446-450)

## Lance-file benchmark executables

The [complete benchmark catalog](../../L1-modules/archive/rust-lance-file-benchmarks.md) covers reader.rs477 and schema.rs73 lines. Cargo registers both with harness=false. Reader has three scan cases and nominal32 take cases, sample_size10/significance0.1 and Linux-only profiler; schema has four wide-schema sizes and Criterion defaults. Exact symbols, fixture sizes, timed/setup boundaries and runtime/cache settings are retained. Nothing was executed. (rust/lance-file/benches/reader.rs:30-477) (rust/lance-file/benches/schema.rs:1-73) (rust/lance-file/Cargo.toml:63-69)

Use the repository release-with-debug profile when benchmark execution is intended: cargo bench -p lance-file --bench reader --profile release-with-debug or --bench schema. These command forms are derived, not validated invocations here. Random-access source requests a2000MiB Int32 payload plus validity/encoding overhead. Nocache does not establish actual cache residency, and throughput can exceed rows really consumed because remainder chunks are discarded. (AGENTS.md:19-31) (rust/lance-file/benches/reader.rs:207-247) (rust/lance-file/benches/reader.rs:337-352) (rust/lance-file/benches/reader.rs:384-454)

## Binary fixture inspection evidence

The [KB-side V1 parser](../../tools/inspect-v1-fixture.mjs) reads the pinned file without importing or running repository code. It checks every row, offset, page cell, dictionary byte and framing field, recording78 contiguous regions and zero uninterpreted bytes in the [report](../../analysis/iteration-066-v1-fixture.json). Exact bytes and decoded rows are preserved in the KB. This is static data validation; the Rust compatibility test and pinned baseline regeneration remain unexecuted. The source test's actual required assertions are byte equality, footer identity, five batches and normalized decoded values. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387133; rust/lance-file/src/compatibility_tests.rs:467-524; rust/lance-file/test_data/exact_versions/README.md:10-41)

The coverage ledger records binary line_count=null and separate read_byte_ranges/analyzed_byte_ranges. The verifier checks contiguous annotated byte regions, original-byte identity and per-region hashes; these structural checks supplement manual meaning review. Binary claims participate in random sampling, and explicit byte citations are bounds-checked.

## Embedded V2_0 fixture evidence

The [mini](../../L2-files/rust/lance-file/test_data/exact_versions/v2_0_mini.lance.md) and [self-described](../../L2-files/rust/lance-file/test_data/exact_versions/v2_0_self_described.lance.md) maps cover every byte of both fixtures. The [semantic parser](../../tools/analyze-embedded-fixtures.mjs) checks every data value and offset; the separate [expected-byte assembler](../../tools/verify-embedded-reconstruction.mjs) builds complete files from documented row formulas/page partitions/protobuf tags and compares source/preserved bytes and all decoded rows during VERIFY. No source runtime, test, generator or build is invoked. The actual Rust acceptance test still requires current writer byte equality, footer identity and both decoded batch equalities. (rust/lance-file/src/compatibility_tests.rs:401-449; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-22961; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:0-23077)

## Standard V2_0 fixture evidence

The [full fixture map](../../L1-modules/archive/rust-lance-file-standard-v20-fixture.md) documents976 pages,1010 regions and4097 rows. The [semantic decoder](../../tools/analyze-standard-v20-fixture.mjs) checks all payloads, offsets, keys, validity and padding. A separate [expected-byte assembler](../../tools/verify-standard-v20-reconstruction.mjs) builds the entire file from formulas/partitions/protobuf tags before opening source evidence during VERIFY. These checks execute KB JavaScript only. The existing Rust stable-file compatibility test requires current-writer byte equality, footer identity and decoded batch equality; it has not run in this goal. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

## V2_1 artifact validation

The [semantic decoder](../../tools/analyze-standard-v21-fixture.mjs) checks all501,167 bytes and4097 rows against exact layouts, formulas and padding/tail rules. The independent [expected-byte assembler](../../tools/verify-standard-v21-reconstruction.mjs) constructs all bytes without reading decoder output or source until final comparison; it uses bit-by-bit lane packing and row identities to derive repetition-index entries. [Full contract](../../L1-modules/archive/rust-lance-file-standard-v21-fixture.md). These are KB JavaScript checks; current Rust compatibility tests remain unexecuted. (rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)

## Complete local fixture inventory, runtime still untested

All six checked-in lance-file binaries now have preserved bytes, deterministic row reconstruction and complete L2 byte maps. V2_2's [decoder](../../tools/analyze-standard-v22-fixture.mjs) covers both constant forms and all71 mini-blocks; the [independent assembler](../../tools/verify-standard-v22-reconstruction.mjs) constructs expected bytes before loading actual source/evidence. Full coverage of these artifacts does not execute or replace the repository's current/historical compatibility tests, nor prove baseline release provenance. (rust/lance-file/test_data/exact_versions/README.md:3-41; rust/lance-file/src/compatibility_tests.rs:232-295; rust/lance-file/src/compatibility_tests.rs:352-399; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:0-500987)

## lance-encoding crate configuration and generation

[Complete crate configuration and APIs](../../L1-modules/rust-lance-encoding.md). Defaults enable lz4, zstd and bitpacking; protoc is opt-in and also requested by docs.rs metadata. decoder, encoder and buffer benches disable the standard harness. Package toolchain fields and lint settings are inherited rather than specified locally. No build, generator, benchmark or test was executed. (rust/lance-encoding/Cargo.toml:1-12; rust/lance-encoding/Cargo.toml:54-85)

The build script sets PROTOC unsafely only with the protoc feature, enables experimental proto3 optional syntax and prost type names, and maps all bytes fields to Bytes. It compiles V2.0 then V2.1 schemas via the local protos symlink; a later failure does not undo earlier outputs. Generated modules are included through OUT_DIR. Non-little-endian targets fail compilation explicitly. These are source-defined build behaviors, not a successful build report. (rust/lance-encoding/build.rs:6-23; rust/lance-encoding/src/format.rs:4-33; rust/lance-encoding/src/lib.rs:27-31)

Facade and format files have no local tests; the full child test matrix, conditional codec support and per-feature compilation results remain unreviewed/unexecuted. The .gitignore proptest-regressions entry changes Git ignore behavior only, not this KB's inventory exclusions. (rust/lance-encoding/src/lib.rs:1-134; rust/lance-encoding/src/format.rs:1-773)

## Reviewed encoding configuration and utility tests

Four compression-configuration tests cover simple patterns, Some-only merging, type defaults and exact-name priority. Two byte-pack tests cover exact LE bytes/round trips for four widths and checked overflow plus Zero omission. AccumulationQueue has no local tests. Block tests include parsing, Zstd prefixed/raw and appended frames, LZ4 basic round trip and24 async matrix cases before harness expansion. These are source-defined tests, not pass results. (rust/lance-encoding/src/compression_config.rs:171-299; rust/lance-encoding/src/utils/bytepack.rs:226-306; rust/lance-encoding/src/utils/accumulation.rs:1-105; rust/lance-encoding/src/encodings/physical/block.rs:678-884)

The block test module imports zstd::ZstdBufferCompressor without its own feature guard although the module is gated; a no-zstd test-build concern is unverified. LZ4 integration test requests lz4 metadata but expects the literal zstd encoding name; do not count this as evidence of selected codec correctness without tracing the remaining harness/strategy. No feature matrix or repository test ran. (rust/lance-encoding/src/encodings/physical/block.rs:147-148; rust/lance-encoding/src/encodings/physical/block.rs:678-703; rust/lance-encoding/src/encodings/physical/block.rs:829-884)

## Buffer and mini-block test evidence limits

Eight buffer tests cover equality, native LE reinterpretation, consuming concatenation, valid8/16/32-bit interleave, uppercase hex, invalid typed length, alignment sharing/copy and bit slices. No test here checks invalid zipper source lengths/overflow or Cow typed views. Three sparse-selection tests cover candidate laziness and explicit settings; the test mentioning2.2 never passes a version. Six environment-parser tests call the parser directly with serial attributes; they neither validate LazyLock behavior nor restore prior environment values. (rust/lance-encoding/src/buffer.rs:380-503; rust/lance-encoding/src/encodings/logical/primitive/layout.rs:26-72; rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:146-201)

Constant has one no-payload test. General has seven test functions and a five-case fixture loop, but round-trip helper checks byte length rather than decoded value equality, accepts some expected-compressed cases without General, guesses value width from num_values, and permits any error for empty input. The RLE wrapper test manually constructs the wrapper; it is not a registration test. These gaps constrain what the KB can infer. No tests/builds ran. (rust/lance-encoding/src/encodings/physical/constant.rs:64-81; rust/lance-encoding/src/encodings/physical/general.rs:173-236; rust/lance-encoding/src/encodings/physical/general.rs:261-408; rust/lance-encoding/src/encodings/physical/general.rs:410-683)

## Value and bitpacking test coverage

Value has17 test functions plus helpers. Coverage includes21 primitive types, mixed-page validity, direct FSL buffer sizes/Arrow equality, all-null child regressions, wide-value errors, nullable slicing/ranges/takes, and structural mode matrices. The primitive list omits Boolean and comments out Interval. Direct simple FSL uses equal dimensions; randomized unequal-dimension lists are nullable and take the separate complex per-value path. Mini-block stress supplies concatenated buffers in one decode call, so that direct test does not independently verify chunk separation. No source tests were run. (rust/lance-encoding/src/encodings/physical/value.rs:827-1396)

Bitpacking has9 test functions and19 named parameter cases before harness expansion: four native widths for each empty decode interface, two direct positive round trips, five corrupt-u32 cases, structural integer/selection cases and a1025-value OOL raw-tail round trip asserting257 compressed u32 words and complete value equality. No direct OOL padded-tail/tie/zero-width/malformed-extra test, empty encode test or >1024 inline-block round trip appears here. Unsafe initialization is reasoned from kernel contracts; no malformed unsafe probe was executed. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:653-897; rust/compression/bitpacking/src/lib.rs:175-278)

## Binary, FSST and BSS test evidence

Binary has18 test functions (17active,oneignored) covering string/binary and large-offset types, layout/version matrices, nulls/empties/slicing, oversized values and uneven pages, dictionary selection, forced compression, unaligned input, corrupt mini offsets and block structure. Four corrupt-block cases deliberately decode successfully then fail mandatory Arrow conversion. The >4GiB jumbo fixture is ignored without issue URL and uses no_validation; this is not proof of large-allocation support. Misalignment tests compare only meaningful payload prefixes, leaving selected zero suffixes unchecked. (rust/lance-encoding/src/encodings/physical/binary.rs:718-1436)

FSST has one six-case harness test and one direct kernel corruption/error-map test; symbol length9 must become CorruptFile. BSS has three tests: single-chunk32/64 float roundtrips and empty input. Float equality does not establish signed-zero bit preservation or NaN handling; multi-chunk boundaries and selector/error paths are not directly tested here. All tests were read, not run. (rust/lance-encoding/src/encodings/physical/fsst.rs:390-469; rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:327-456)

## Packed/statistics test landscape

Nine packed test functions cover Utf8/LargeUtf8 and multiple variable children, direct fixed roundtrip, a forced full-zip harness, pre-V2.2 rejection, fixed encoder variable-child rejection and one empty middle row with exact expected child buffers. They do not directly cover zero-row decode, zero-width children, malformed descriptors/offsets/prefixes or local mini-block symmetry. Test StructuralU32 uses all-packed policy, so fixed full-zip tests must not be attributed to production V2.2 support. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1571; rust/lance-encoding/src/testing.rs:162-181; rust/lance-file/src/versions/v2_2/compression.rs:77-93)

Ten statistics tests cover payload sizes, signed/unsigned bit-width boundaries,1024-value chunk splits, missing variable BitWidth, small HLL estimates, MaxLength, RunCount and lazy-cardinality cache insertion. No direct entropy,128-bit randomized estimate, concurrent cache, poisoned lock, stale recomputation or invalid-scalar test occurs locally. All19 tests inspected, none executed. (rust/lance-encoding/src/statistics.rs:598-1269)

## Shared compression tests and feature concern

Forty test functions cover parameter/metadata selection, automatic Binary versus Utf8 FSST, explicit FSST, large zstd level, bitpacking zero segments/full-width rejection, RLE cost/header/child choices and version modes, general block roundtrip and persisted level optionality. One test has two rstest cases. Many tests assert debug names or descriptor kinds rather than decoded bytes; exact roundtrips occur for the general24-bit block and sparse70000-value RLE block. No repository test was executed. Local gaps include malformed decoder metadata, custom strategy recursion, invalid stats, parameter bounds and per-value fallback edge cases. (rust/lance-encoding/src/compression.rs:1615-2821)

Feature annotations protect mini inline dispatch and estimation, but block selector and block read arms name bitpacking types imported only under cfg(bitpacking). This is a source-derived configuration concern requiring a future permitted compile check; it is not a verified compiler failure. (rust/lance-encoding/src/compression.rs:19-74; rust/lance-encoding/src/compression.rs:372-510; rust/lance-encoding/src/compression.rs:988-1019; rust/lance-encoding/src/compression.rs:1171-1209)

## Physical RLE test evidence and gaps

Thirty-eight test functions include two rstest matrices (four invalid-coverage cases and three run widths) plus an async structural roundtrip harness. Coverage includes raw/General/bitpacked children, pair selection, multiple chunks, strict lazy versus eager behavior, header bounds, legacy count inference and checkpoint clamping. Exact-value comparisons exist for many focused cases. The generic all-types helper and million-value regression only check decoded byte length; test_general_compression is a codec-choice helper despite its name. No repository tests ran. (rust/lance-encoding/src/encodings/physical/rle.rs:1945-3414)

Future targeted tests should address zero-count malformed input, surplus/short mini bytes, unsupported widths, candidate construction failures, expanded individual General chunks, width ties, custom-child wrong type/count and retained-memory accounting. Several fixtures assume the default lazy chunk cap. The custom test generator ignores requested RowCount/RNG, emits10000 cyclic values and panics for an empty pattern. Use the prescribed Rust environment for any later executable verification. (rust/lance-encoding/src/encodings/physical/rle.rs:385-500; rust/lance-encoding/src/encodings/physical/rle.rs:745-1118; rust/lance-encoding/src/encodings/physical/rle.rs:1242-1276; rust/lance-encoding/src/encodings/physical/rle.rs:1754-1776; rust/lance-encoding/src/encodings/physical/rle.rs:3261-3303; rust/AGENTS.md:1-90)

## DataBlock test coverage

Twenty-one test functions cover sliced integer/string arrays, view normalization, explicit ArrayData offsets, pre-encoding rejection, dictionary concatenation/null insertion/key widening, all-null shortcuts, visible-byte accounting, mandatory layout checks, malformed variable builders and valid four-type roundtrips. Five rstest matrices contain2,2,3,11 and4 cases respectively. Tests using unsafe malformed ArrayData deliberately exercise validation boundaries. No repository test was executed. (rust/lance-encoding/src/data.rs:2119-2898)

Missing local regressions include builder rollback/partial state, Struct parent validity, empty Struct, FSL dimension mismatches, mutable shared statistics, zero-width fixed blocks, malformed bitmap inputs, count disagreement and physical dictionary keys beyond the declared count. Existing UInt16 slice test checks length/count, not exact numeric values. Preserve prescribed Rust environment and require focused regression coverage before implementation changes. (rust/lance-encoding/src/data.rs:337-443; rust/lance-encoding/src/data.rs:444-612; rust/lance-encoding/src/data.rs:1051-1097; rust/lance-encoding/src/data.rs:1298-1333; rust/lance-encoding/src/data.rs:2052-2117; rust/lance-encoding/src/data.rs:2147-2164; rust/AGENTS.md:1-90)

## Rep/def source-test coverage

Tests cover visibility, sparse sibling rejection, normalization, null/empty/struct masking, FSL validity/zero-dimension rejection, mixed pages, multi-builder equivalence, exact words and zero-byte NIL. The slicer test calls rep_slicer twice. Unary16 exhaustion, binary32 roundtrip, parser descriptor equivalence, width16 masks, empty composite offsets and budget planning have no direct local tests. Broader structural tests remain pending. No repository tests were executed; follow the Rust guide before eventual execution. (rust/lance-encoding/src/repdef.rs:2843-4083; rust/AGENTS.md:1-90)

## Encoder facade source-test coverage

The2x2 nested-offset fixture constructs deliberately invalid Utf8/LargeUtf8 offsets inside FSL size1 using unsafe test-only builders, then checks direct maybe_encode returns InvalidInput and contextual message for Array/StructuralU32. A second test rejects direct FSL<Struct> under StructuralU16 with the selected-format message. structural.rs has no local tests. Alignment0, unpadded external reservations, supplied-schema disagreement and custom finish-column ordering need dedicated regressions if changed; broader tests remain pending. No repository tests were executed. (rust/lance-encoding/src/encoder.rs:503-603; rust/lance-encoding/src/encoder/structural.rs:1-285; rust/AGENTS.md:1-90)

## Decoder source-test evidence

Seventeen local test functions cover array i32 budget spanning/splitting/oversized estimated rows, checked indices and coalescing, error variant preservation, invalid FSL dimensions, malformed legacy List encoding, both stream load-error fusion paths, selected schema byte estimates, structural fixed-width byte sizing, no-target row sizing, row-cap precedence and string feedback. The helper awaits each decoded batch sequentially; it does not validate concurrent feedback. The convergence test checks second/third row sizes only when at leastthree batches exist. None were executed. (rust/lance-encoding/src/decoder.rs:3465-4203)

Potential future focused regressions include zero row caps, reversed/overlapping/out-of-bounds ranges, mapping/grammar mismatch, request sort/restoration and exact8MiB boundary, dropped readers, panic propagation, decoder-task error behavior, and dummy legacy root counts around u32::MAX. These are gaps in this file's local tests, not claims that no repository tests exist. Follow Rust environment rules before any future execution; this knowledge task prohibits it. (rust/lance-encoding/src/decoder.rs:1127-1154; rust/lance-encoding/src/decoder.rs:2322-2353; rust/lance-encoding/src/decoder.rs:2863-3064; rust/AGENTS.md:1-90)

## Primitive helper source tests

Twelve local test functions: four chunk-index tests (U32/U64 selection, duplicate lookup and four repetition sequences compared to same-formula reference); one constant-cache dtype rejection; seven dictionary tests (128-bit benefit/rejection, variable benefit/rejection, unsupported16-bit offsets and byte/entry limits). They were read, not run. Dictionary success checks verify counts/types rather than exact IDs/roundtrip. Parser comparison is not an independent semantic oracle. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:433-536; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:495-522; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:429-632)

Local gaps include malformed prefix/stride/counts, exact budget equality, fixed64-bit dictionaries, normalization and hidden invalid null keys, constant row-range ordering, pre-load schedule, over-drain and inconsistent level lengths. These are per-file gaps; parent and broader tests remain pending. Follow Rust instructions for any later implementation task, but this KB task executes no repository tests. (rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:433-536; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:495-522; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:429-632; rust/AGENTS.md:1-90)

## Blob source-test coverage

The logical encoder file has ten test functions; primitive Blob scheduler file has none. Constructor and logical-layout rejection tests are narrow. The simple async encode test does not await its page futures. Original roundtrip covers payload/null sizes, empty-before-payload reply assignment and input-array nullability transitions. V2 tests compare descriptor fields for Inline/External, Dedicated, ranged External and Packed; they do not fetch literal file/S3/memory URI objects. All tests read, none executed. (rust/lance-encoding/src/encodings/logical/blob.rs:439-904; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:1-552)

U32 structural test helper includes StructuralU32 and StructuralSparse; array-and-U16 helper selects those two exact modes. TestCases default has batch100,page sizes4096/1MiB,slicingfalse/true,ingest counts1/5/10 and all test encodings. Full harness behavior remains pending, so method names alone do not prove production file-version qualification. Useful future focused cases: cache view separation, empty request vector,32MiB equality/oversize, malformed descriptors, null kind under valid parent, null required children, collector mutation before failure and direct Binary-versus-LargeBinary boundary. (rust/lance-encoding/src/testing.rs:750-835; rust/lance-encoding/src/encodings/logical/blob.rs:105-125; rust/lance-encoding/src/encodings/logical/blob.rs:323-420; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:262-432)

## Nested-wrapper source-test inventory

FSL has four test functions: generated seven-shape matrix (336 parameter combinations), four unsupported-type cases, nested FSL/list garbage validity and primitive-child length check. Total342 parameter instances is source arithmetic, not executed test output. Last helper test asserts only length despite comment claiming unchanged array. Map has thirteen functions: eleven async roundtrips, malformed sparse entries and V2.1 write rejection. Roundtrips cover null/empty maps, null values, Struct/null-Struct/List nesting, Map values, Int32 keys,100-entry plus empty, all-null parents and retained originals. All were read; none run. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:718-804; rust/lance-encoding/src/encodings/logical/map.rs:296-801)

The map keep_original_array test does not toggle the option; reviewed roundtrip harness fixes it true. False-branch coverage cannot be inferred from its name. Current local tests also do not directly assert scheduler endpoint overflow, scan-line divisibility, invalid helper dimension, decode after child failure, list-view dispatch or exact peak allocation. Test additions should target real contracts with small fixtures and follow Rust environment requirements. (rust/lance-encoding/src/encodings/logical/map.rs:723-759; rust/lance-encoding/src/testing.rs:679-710; rust/lance-encoding/src/testing.rs:1098-1148; rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:127-209; rust/AGENTS.md:1-90)
