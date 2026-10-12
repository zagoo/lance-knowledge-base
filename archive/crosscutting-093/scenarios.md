> Historical pre-V2.1 cross-layer notes. Not current scope, progress or acceptance criteria. Tests/binaries are excluded; retained production details are canonical in frozen L2/current contracts.

> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# End-to-end scenarios and KB-only acceptance

**Navigation and contract acceptance pending.** V2.1 permits implementation source reads. Scenarios must give exact ordered reading paths, while their governing contracts must be answerable from this KB.

[Orientation](../../L0-orientation.md) · [Contracts](../../L3-symbols/behavior-contracts.md) · [Cookbook](../../L4-crosscutting/cookbook.md)

## Partial scenario: distributed filtered-read serialization

1. Carry a TableIdentifier with URI plus serialized manifest for the documented fast reconstruction mode, or URI/version/ETag for manifest loading. Precedence if both forms appear is not defined here. (protos/table_identifier.proto:8-20)
2. Serialize field/system-column projection, blob mode, scan ranges, filtering bytes, threading and byte/row budgets in FilteredReadOptionsProto. The IPC schema for decoding predicates may be wider than the output projection. (protos/filtered_read.proto:15-76)
3. In plan-then-execute mode, include row-address-tree bytes and a deduplicated Substrait predicate array plus fragment-to-array-index map in the optional plan. In local mode, the executor builds its plan at execution. (protos/filtered_read.proto:79-107)
4. Carry the child execution plan separately through DataFusion PhysicalExtensionCodec traversal and decoded inputs. The comment's TODO for Lance index-input codecs remains to be compared against implementation. (protos/filtered_read.proto:108-115)

This is a wire-contract walkthrough, not a fully traced reader lifecycle. Entry methods, IO requests, validation, task spawning, cancellation and memory release are pending.

## Historical acceptance outcomes through iteration 85

| Question | KB-only result | Missing evidence |
|---|---|---|
| Dataset::write then compact_files | FAIL | Table-local metadata/publication and file composition are covered; decoder facade scheduling/materialization is covered; complete Dataset entry, concrete logical codecs, compaction/retry and cleanup are pending |
| Add scalar index | FAIL | Traits, registry, loader, query planner, writer/update paths, tests and full binding mapping |
| Exact v2 semantics/version gates | FAIL | Exact dispatch, composition, reader metadata grammar and projection are documented; all exact V2 writer lifecycles and compatibility test/generator sources are now covered; shared reader metadata/cache/projection orchestration is covered; all six lance-file binary fixture payloads are fully interpreted; encoding facade and metadata helpers are covered; complete decoder facade is now covered; concrete modern logical byte algorithms and backend IO remain pending; V1 projection, dictionary dispatch, metadata, page tables, concrete codecs and full reader/writer lifecycles are covered |
| Every Python API and Rust mapping | FAIL | Python/PyO3 source analysis and complete signatures |
| Transaction operation/commit conflicts | FAIL | All table-local operations, preparation and publication/repair are covered; full Dataset conflict/rebase/retry/outcome recovery and namespace authority remain pending |

These are historical source-replacement acceptance results. V2.1 replaces that test with contract answers plus exact, source-confirmed navigation; current milestone outcomes are recorded in verification-log.md.

## Partial state machines from schema contracts

An overlay writer emits ordered groups with committed_version zero. Commit appends the groups to each fragment's existing overlays and stamps the new version; retry must restamp. Cells resolve by greatest committed_version then latest list position, and tombstones still suppress them. This describes the schema-required state transition, not the missing operation-pair conflict matrix or atomic storage protocol. (protos/transaction.proto:370-393; protos/fragment_metadata.proto:185-237)

Shard drop state is ACTIVE → SEALED → directory deleted on commit, or SEALED → ACTIVE on rollback. SEALED denies writer claims; claims increment the writer epoch when permitted. Flush advances generation and replay watermark; recovery starts after the watermark, with WAL positions one-based. The schema supplies these invariants but does not specify the compare-and-swap sequence or recovery implementation. (protos/table.proto:494-562)

For a covering-index metadata migration, bit 13 and bit 7 must be set in both feature words; normalize every legacy suffix-form entry atomically or enable only when none declares covering. Keep the interpretation bit in derived manifests, including after the last covering index disappears, until an equally atomic reverse conversion. Query readers still inspect each segment's actual storage schema before serving covering values. (protos/table.proto:147-158; protos/table.proto:362-386)

## Partial in-memory blob projection trace

1. A v2 extension-marked Arrow field converts into logical struct with converted children and unassigned IDs; Field::set_id later replaces each existing negative ID with the current caller-supplied seed and increments that seed; it preserves existing nonnegative IDs while rebuilding parent IDs. (rust/lance-core/src/datatypes/field.rs:1204-1292; rust/lance-core/src/datatypes/field.rs:1095-1105)
2. Field::apply_projection sees a blob and treats the layout atomically: the parent ID must be selected and all children are copied. It then delegates representation selection to BlobHandling::unload_if_needed, now analyzed at rust/lance-core/src/datatypes/schema.rs:1173-1188. (rust/lance-core/src/datatypes/field.rs:274-310)
3. Field::unloaded_mut selects canonical v2 descriptor logical type, children and metadata while retaining outer identity/nullability. The extension marker disappears, but structural descriptor recognition succeeds. (rust/lance-core/src/datatypes/field.rs:623-658)
4. Re-projecting this descriptor preserves all five synthetic children despite ID -1; the integration test explicitly asserts that case. (rust/lance-core/src/datatypes/field.rs:2182-2220)

This trace stops at the reviewed Field boundary. It does not prove scan execution, IO, null-buffer encoding, external URI fetching, Dataset::write or compaction behavior. ## Local Arrow-schema import and projection trace

1. Schema::try_from(&ArrowSchema) invokes Field conversion for every root, copies metadata, then set_field_id(None) allocates after the current maximum and rebuilds ancestry IDs. (rust/lance-core/src/datatypes/schema.rs:889-902; rust/lance-core/src/datatypes/schema.rs:688-705)
2. validate checks root names, ID uniqueness/reserved negatives and every reconstructed fixed-list dimension; verify_primary_key separately enforces leaf/non-null/non-list/non-map ancestry. No dataset values are checked for uniqueness. (rust/lance-core/src/datatypes/schema.rs:328-383; rust/lance-core/src/datatypes/schema.rs:835-871; rust/lance-core/src/datatypes/schema.rs:903-907)
3. Projection::union_column adds the selected path ancestry and descendants, or toggles a recognized exact metadata flag. to_bare_schema filters the base with Field::apply_projection. That helper applies BlobHandling::unload_if_needed; the earlier partial blob trace's missing local policy implementation is now resolved. (rust/lance-core/src/datatypes/schema.rs:1276-1309; rust/lance-core/src/datatypes/schema.rs:1524-1527; rust/lance-core/src/datatypes/schema.rs:458-468; rust/lance-core/src/datatypes/field.rs:274-310; rust/lance-core/src/datatypes/schema.rs:1173-1188)
4. to_schema appends selected metadata fields in its fixed order; to_arrow_schema reconstructs Arrow fields from the resulting schema. This does not execute storage reads. (rust/lance-core/src/datatypes/schema.rs:1529-1564; rust/lance-core/src/datatypes/schema.rs:911-919)

this trace supplies core validation/materialization, not Dataset writing/compaction, index registration, complete v2 gates, Python APIs or transaction conflicts.
## Deletion vectors and single-rewrite mapping

This local trace stops before storage IO or dataset compaction:

1. Collect u32 deleted offsets into DeletionVector; Extend picks Set/Bitmap using count hints and threshold rules. (rust/lance-core/src/utils/deletion.rs:209-251; rust/lance-core/src/utils/deletion.rs:277-283)
2. Given addresses already belonging to that fragment, build_predicate strips the high32 and computes undeleted flags. Alternatively, OffsetMapper translates ascending visible ordinals to local physical offsets using deletion cardinality. (rust/lance-core/src/utils/deletion.rs:104-183)
3. For an already constructed rewrite remap, OrderedCompactionMapping retains its Arc and maps each physical address. Missing outer lookup becomes InvalidInput; inner None remains deletion. (rust/lance-core/src/utils/fragment_reuse.rs:34-73)
4. The fixture compares this adapter with its underlying remap across two old/two new fragments and checks duplicate/deleted/out-of-domain cases. It provides no independent expected-address oracle or end-to-end persisted compaction trace. (rust/lance-core/src/utils/fragment_reuse.rs:107-144)

RowAddrRemap local behavior is now documented below; FRI selection/traversal and dataset orchestration remain missing.
## Ordered and stable-partition row mapping

Ordered compaction fixture: scan fragments4 then3, retain offsets4:{0,2,4} and3:{0,1}, write destinations10(2),11(0),12(3). Fragment11 contributes no range. Retained ranks0..4 map respectively to10:0,10:1,12:0,12:1,12:2. A listed all-deleted fragment7 maps each unretained offset to deletion; an uncovered fragment remains unaffected. Plain construction cannot tell that offset4:5 exceeds an imagined physical size, so it also reports deletion. (rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:953-993)

A later remap consumes those destinations as its source addresses. The chain fixture maps source0:2 through10:1 to20:0, deletes source0:0 in the second step and source0:1 in the first, and preserves an uncovered fragment. Batch applies each step to all rows, retaining NULL positions. This is a local in-memory chain, not a verified commit/version traversal. (rust/lance-core/src/utils/row_addr_remap.rs:738-764; rust/lance-core/src/utils/row_addr_remap.rs:1107-1140)

Stable-partition example labels[0,2,NULL,2,1,1,0,2,NULL,0], m3, block4:

| Block | Physical range | Stored cumulative counts |
|---|---|---|
| 0 | [0,4) | [1,0,2] |
| 1 | [4,8) | [2,2,3] |
| 2 | [8,10) | [3,2,3] |

These cells follow the builder and the hand fixture; live total8, deleted2. For row7 (label2), previous-block count2 plus zero same-label rows in that block's exclusive prefix gives destination offset2. For row9 (label0), previous count2 plus a NULL prefix gives offset2. A sweep from block1 seeds [1,0,2] and emits (1,0),(1,1),(0,1),(2,2),NULL,(0,2). These are arithmetic deductions from the documented algorithms/fixture, not newly executed tests. (rust/lance-core/src/utils/stable_partition.rs:348-385; rust/lance-core/src/utils/stable_partition.rs:387-482; rust/lance-core/src/utils/stable_partition.rs:546-594)

Serialize the count grid as the LSPC28-byte header plus little-endian row-major counts; decode structurally, then validate cumulative budgets. Loading labels, mapping labels to fragment IDs, selecting current FRI records and committing rewritten files remain outside this analyzed trace. (rust/lance-core/src/utils/stable_partition.rs:49-60; rust/lance-core/src/utils/stable_partition.rs:191-290)
## AIMD control and object-store test instrumentation

A local rate-feedback trace starts at100 with factor0.5,increment10,window100ms. Record a throttle at t0; at t0+150ms a Success first closes that throttle window and returns50, then seeds the next window. Two further successful window closures yield60 then70. current_rate between calls only reads the stored value. These outcomes are derived from the implementation and recovery test, with no claim that a request is delayed by the controller itself. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:623-661)

For a proxy head call, invoke before policies with get_opts/location; after they succeed release the policy lock and await target.get_opts. If options.head is true, transform metadata under the lock with head, returning the first transformed error. list follows a different path: no before callback, then per-item list metadata transforms with unwrap while the stream is polled. The different failure behavior matters when injecting faults into readers. (rust/lance-core/src/utils/testing.rs:105-120; rust/lance-core/src/utils/testing.rs:186-194; rust/lance-core/src/utils/testing.rs:221-235)

These local instrumentation traces do not complete dataset write/index/transaction acceptance scenarios.
## Generic split-block Bloom filters

A local membership path converts a value through AsBytes, hashes with xxHash64(seed0), selects one block using upper32 bits and ORs eight salt-derived low32 mask bits. A query repeats the same conversion/hash and returns false if any required bit is absent. Serialization emits the block words little-endian; reparsing reconstructs them and reuses the same hash rules. This ends at the generic primitive. The merge-insert key extraction and null policy are documented in the local key representation trace below; scalar-index extraction/storage and query registration remain pending. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:98-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-337; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)

## Local trace: configuring a cache backend

build_from_uri parses a compact string without registry access during parse, then build_from_config lazily installs missing built-ins, revalidates/normalizes kind and clones options. It copies the selected function pointer under the global lock, unlocks and invokes the constructor. A failed unknown kind yields InvalidInput; poisoned production registry yields Internal; constructor Result propagates. This trace ends at the constructor boundary, with Moka constructor now documented below and dataset/session integration still pending. (rust/lance-core/src/cache/backend_uri.rs:51-104; rust/lance-core/src/cache/registry.rs:91-95; rust/lance-core/src/cache/registry.rs:153-193)

The backend trait uses opaque keys and Arc-erased entries; absence of prefix/key inventory is explicit. The local typed wrapper is now traced below; dataset/session consumers still prevent a complete dataset cache lifecycle. (rust/lance-core/src/cache/backend.rs:20-31; rust/lance-core/src/cache/backend.rs:45-93)

## Local trace: serializing and decoding one cache entry

For a concrete CacheCodecImpl, from_impl selects its static id/current version and typed adapters. serialize writes the envelope, seeds body position, downcasts the erased Arc and runs its body serializer. On read, parse framing -> compare id -> reject future version -> construct body reader -> call typed decoder -> allocate erased Arc on success. A body Result failure becomes Miss(BodyError); no loader runs in this wrapper. Partial writes and panics escape its normal cache-miss policy. (rust/lance-core/src/cache/codec.rs:261-307; rust/lance-core/src/cache/codec.rs:317-370)

The local Widget body is raw length-prefixed LEu32 with exact4-byte validation; it shows no protobuf header is mandatory. The reader-version7 fixture constructs the reader directly and bypasses the version1 codec. These examples describe wrapper mechanics, not a dataset cache lifecycle or complete persistence backend. (rust/lance-core/src/cache/codec.rs:379-402; rust/lance-core/src/cache/codec.rs:539-552)

## Local trace: memory backend miss and retry

A moka://?capacity=1048576 config resolves to build_moka, which requires a usize capacity and builds weighted Moka. Nonzero load constructs a per-request miss flag and async initializer, then awaits try_get_with; only the initializer that runs sets its flag and computes the record. Success returns the entry and inverse flag, while shared failure may clone its core error. With capacity0, each request directly awaits its loader. (rust/lance-core/src/cache/moka.rs:67-81; rust/lance-core/src/cache/moka.rs:124-155; rust/lance-core/src/cache/moka.rs:317-366)

Quick misses obtain a dependency guard before awaiting loader. Success attempts insertion (return ignored) and returns entry,false. Error/cancellation drops guard; the source fixtures expect a contender to run its own loader afterward. The typed registration/downcast continuation is now documented below; production dataset/session consumers remain pending. (rust/lance-core/src/cache/quick.rs:173-190; rust/lance-core/src/cache/quick.rs:413-524)

## Local trace: one typed cached load

1. Derive a child handle sharing CacheState, then create the16-byte key from namespace,stable type,key schema and typed fields. Sized and unsized methods use the same framing. (rust/lance-core/src/cache/mod.rs:319-323; rust/lance-core/src/cache/mod.rs:553-563)
2. Build a lazy loader future retaining state. If backend selects it, await application loader, wrapT inArc, register its TypeId sizing callback and calculate declared bytes. Pass erased value/weight back to backend with the key's optional codec. (rust/lance-core/src/cache/mod.rs:230-248; rust/lance-core/src/cache/mod.rs:446-458)
3. Moka returns initialized/shared entry and per-caller bool; Quick returns guarded load/value branch. The wrapper downcastsT, records one hit or miss according to bool and returns. Loader errors record neither; a wrong type instead records miss and returns IO error. (rust/lance-core/src/cache/moka.rs:124-155; rust/lance-core/src/cache/quick.rs:173-190; rust/lance-core/src/cache/mod.rs:459-471)
4. With a weak handle, upgrade first. If already expired, compute directly and return false without backend/metrics. If alive, temporary strong state lasts through the awaited operation. (rust/lance-core/src/cache/mod.rs:643-658; rust/lance-core/src/cache/mod.rs:681-686)

This completes a local cache API trace, not Dataset::write/compact, actual index cache consumers, Python mappings or transaction commit. ## Local trace: allocation fixture

Build two namespace segments, define PageKey/path17/42 and optional UUID keys forSome/None, then prepare each once before tracking. For each separate measured closure, disable tracking, reset sharedcount, enable currentthread tracking, build canonical key and black_box it, disable tracking, readcount and assert0. Allocator instrumentation counts alloc/zeroed/realloc but no dealloc. This sequence tests key construction only and was read rather than run. It adds no persisted write/compaction/index/transaction trace. (rust/lance-core/tests/cache_key_allocations.rs:20-63; rust/lance-core/tests/cache_key_allocations.rs:125-166)

## Local manifest capability walkthrough

This is a complete local gate trace, not the still-missing dataset commit flow. Begin with existing Manifest metadata. apply checks paired8/10 before reset; content determines deletion/stable/config/base/overlay/spill flags. A row-ID inconsistency may leave reset/partial words on error. After success, covered bit7 and sticky8/10 are restored. A later explicit ensure call checks pairing and selected-word support; apply alone can mark an experimental feature unsupported by the current build. No exact external ordering is inferred here. (rust/lance-table/src/feature_flags.rs:127-215; rust/lance-table/src/feature_flags.rs:309-378)

For example, a manifest with overlays but no other requirements receives overlay64 in both words. The read/write capability masks reject64 when debug assertions are disabled and LANCE_ENABLE_UNSTABLE_DATA_OVERLAY_FILES is absent; an empty value still enables the gate. The in-memory source test covers setting the bit, and pure-policy tests cover enabled/disabled masks, not actual disk IO. (rust/lance-table/src/feature_flags.rs:184-194; rust/lance-table/src/feature_flags.rs:234-238; rust/lance-table/src/feature_flags.rs:263-307; rust/lance-table/src/feature_flags.rs:489-555)

KB-only result remains FAIL for all five full questions. These documents now explain some manifest gates, but still lack Dataset::write/compaction entry points and on-disk lifecycle, scalar traits/registration, exact v2 encoders/readers, all Python mappings, and transaction conflict/atomic-commit algorithms.

## Local row-ID metadata and transaction disposition traces

For an already available Bytes slice, construct InlineRowIds by moving the handle into Arc inner with empty memo. Cloning shares inner; first digest computes BLAKE3 and later calls reuse the reference. JSON/serde serialization presents only bytes; deserialization reconstructs a fresh memo. The local Fragment roundtrip test checks metadata preservation through generated protobuf conversion, with converter details now covered in the fragment section; dataset IO remains pending. (rust/lance-table/src/format/row_ids.rs:49-126; rust/lance-table/src/format/row_ids.rs:228-244)

For a protobuf Delete transaction, operation_may_change_schema returns false regardless of a4MiB tag; UpdateConfig returns true as soon as either field-metadata container is nonempty. Wrapping/unwrapping does not change classification or encode bytes. This supports a future commit trace, but does not identify the actual validation call sites, inline threshold, conflicts or atomic storage operations. (rust/lance-table/src/format/transaction.rs:37-108; rust/lance-table/src/format/transaction.rs:125-145)

## Decode, share, detach and clone a manifest

Given an already decoded pb::Manifest, TryFrom creates one interner, converts each base file's field/column arrays with sharing, converts and sorts overlays, maps lineage oneofs and known counts, then computes logical offsets. It checks row-ID metadata presence under the reader stable bit, resolves explicit format or infers it, converts schema, and normalizes empty optional strings. It does not open files, validate carrier columns or run capability support checks. (rust/lance-table/src/format/fragment.rs:378-461; rust/lance-table/src/format/manifest.rs:963-1056)

After decode, detach_sparse_inline_row_ids can copy small row-ID slices out of a larger fetched buffer. At total visible IDs==buffer_len/4 (tested20/80), slices stay; at20/81 they copy. Clone-on-write preserves other fragment owners, and each copied InlineRowIds starts a fresh digest memo. Actual release of the original buffer depends on remaining owners. (rust/lance-table/src/format/manifest.rs:391-419; rust/lance-table/src/format/manifest.rs:1334-1367; rust/lance-table/src/format/row_ids.rs:75-84)

In-memory shallow clone visits both base and overlay files, stamping only absent base IDs, then local deletion metadata, retains covered-index/sticky feature words, installs supplied source root in base_paths and clears index/inline transaction references. Disk copying, index-copy orchestration, transaction conflict handling and publishing the clone remain outside this trace. (rust/lance-table/src/format/manifest.rs:237-308)

For spilled lineage, inspect metadata-derived reserved IDs, resolve each carrier only among base files, reject duplicates/missing/V1 carriers, then hand actual column reading to the rowids loader, now covered in the later lookup trace; the shared reader, V1 reader and exact current reader grammar are covered; delegated modern decoder byte algorithms remain pending. Feature flag derivation's has_spilled_row_lineage is merely the OR of the three Column marker states. (rust/lance-table/src/format/fragment.rs:635-725; rust/lance-table/src/feature_flags.rs:128-215)

## Local index-list cache and overlay reload traces

1. index_metadata_codec creates callbacks for Vec<IndexMetadata>; serialize converts it to pb::IndexSection and writes one protobuf header. Core frames that body with its cache type/version envelope. (rust/lance-table/src/format/index.rs:371-415; rust/lance-core/src/cache/codec.rs:317-322)
2. Deserialize reads the section and each IndexMetadata, validates covering suffixes, and returns Arc<Vec<_>>. Any element Result failure aborts the list; timestamp expect can panic. There is no partial result or local end-of-body check. (rust/lance-table/src/format/index.rs:261-317; rust/lance-table/src/format/index.rs:398-406)
3. Fragment protobuf reload converts each DataOverlayFile, parses coverage into Arcs with data-file path context, then stable-sorts overlays by committed_version. Equal versions preserve prior position. This is metadata reconstruction, not reading values by rank. (rust/lance-table/src/format/overlay.rs:297-327; rust/lance-table/src/format/overlay.rs:215-221; rust/lance-table/src/format/fragment.rs:831-869)
4. A base replacement can call tombstone_overlay_fields: fields[3,5] replacing5 become[3,-2] with coverage slots retained, while an overlay only covering5 disappears from metadata. No file deletion follows from this helper alone. (rust/lance-table/src/format/overlay.rs:242-275; rust/lance-table/src/format/overlay.rs:406-443)

## Local merge-insert key representation trace

Ordered ON columns resolve by top-level name; every selected row component must be supported and nonnull, including nested elements. The result is one KeyValue or Composite, then to_bytes allocates its representation. Builder inserts those bytes into fixed-config Sbbf and counts insertion calls. build or direct protobuf conversion snapshots the bitmap plus expected-capacity config. Later intersections compare hashes/bits under the table policy, without checking field IDs. The primary-key eligibility decision, skipped-None policy, operation conflict matrix and retry/publication protocol remain missing, so the complete transaction acceptance question still fails. (rust/lance-table/src/format/key_existence.rs:42-148; rust/lance-table/src/format/key_existence.rs:175-280; rust/lance-table/src/format/key_existence.rs:282-389)

## Exact version and stale-index metadata traces

Given request stable, resolve yields ConcreteFileVersion::V2_2. DataFile::new emits metadata(2,2); DataStorageFormat encoding emits manifest2.2. For exactV2_0, metadata emits(2,0), but to_standard_footer_numbers returns(0,3); determine_file_version parses tail LEu16 fields then accepts either(0,3) or(2,0). Exact dispatch and all four V2 writer lifecycles are now covered in the later file-runtime/write subtraces. This paragraph describes their metadata/recognition boundary. (rust/lance-file/src/version.rs:19-75; rust/lance-file/src/version.rs:187-261; rust/lance-file/src/lib.rs:45-59; rust/lance-table/src/format/fragment.rs:109-144; rust/lance-table/src/format/manifest.rs:1091-1124)

For fragment3 with overlay dataset-version9 on field3 offsets[1,2], an index segment built at1 and unknown fragment coverage yields stale fragment{3} or row map3->{1,2}. Present coverage{0} yields nothing; equal/older overlay versions contribute nothing. For outer.middle.{a,b}, an overlay on a invalidates an outer-field index but not b; overlay on middle invalidates a. Existing stale entries are unioned, and query fallback must consume these sets elsewhere. (rust/lance-table/src/format/overlay/staleness.rs:216-277; rust/lance-table/src/format/overlay/staleness.rs:341-415; rust/lance-table/src/format/overlay/staleness.rs:113-158)

this closes local version-mapping and stale-set rules, not full v2 bytes, Dataset write/compaction, index registration, Python API or transaction commit protocols.

## Local trace: refresh last-updated lineage during column rewrite

1. Receive mutable Fragment, current/previous dataset versions, updated offsets and preloaded SpilledRowLineage. Select physical_rows first, else decode inline row IDs; column row IDs without physical count are unsupported for partial refresh. No storage request occurs. (rust/lance-table/src/rowids/version.rs:713-749)
2. For positive count, allocate a u64 value vector. Column update lineage must be present in the preload map; inline decode errors become missing and use previous version. Expand at most the physical count and pad any short sequence. (rust/lance-table/src/rowids/version.rs:750-782)
3. Patch each in-range offset, ignore others, then compress all values into equal-version Range runs. Encode protobuf bytes and replace last_updated_at with Inline only at the end. Creation metadata and old files are untouched by this helper. (rust/lance-table/src/rowids/version.rs:783-815)

This trace is complete for the local helper. Operation selection, prefetch scheduling, conflict checks, retries and atomic publication remain missing from the end-to-end transaction scenario.

## Local trace: read version batches and present row-ID offsets

A default version cursor walks run lengths for forward selections, appending repeated versions. A rewind lazily builds starts; later nonadjacent requests seek through the index. Empty spans disappear; errors can follow partial output. Keep the same immutable sequence for the cursor lifetime even though Rust does not encode that binding in the struct. (rust/lance-table/src/rowids/version.rs:82-210)

HoleRuns converts present ordinal selections into numeric offsets by prefix counts, clips the end, walks intervening present gaps and appends base+offset values. This helper explains local materialization cost; complete RowIdSequence behavior is covered in the sequence trace below. Full scan and deletion-file integration remain pending. (rust/lance-table/src/rowids/runs.rs:156-215; rust/lance-table/src/rowids.rs:67-170)

## Local trace: inline row-ID encode/decode

1. write_row_ids clones the sequence. Each compact Ranges segment expands through HoleRuns::present_ranges into base-adjusted ordinary ranges; other segments convert directly. Arrays become fixed-width LE packed bytes and bitmap storage moves into protobuf. All protobuf segments are collected before encode_to_vec returns bytes. (rust/lance-table/src/rowids/serde.rs:232-344)
2. read_row_ids borrows bytes and parses outer tag1 length-delimited messages. Fast positive plain ranges accumulate; adjacency merges, disjoint ranges can compact and overlapping/reversed order flushes. Non-fast messages pass through prost and validated segment conversion. (rust/lance-table/src/rowids/serde.rs:60-86; rust/lance-table/src/rowids/serde.rs:346-426)
3. Validate nested shape/order/overflow/padding, then final aggregate length; return RowIdSequence with possibly different segmentation. This path performs no storage IO, manifest publication, stable-ID allocation or deletion-file application. Sequence and segment operations are now covered in the local traces below; dataset consumers remain pending. (rust/lance-table/src/rowids/serde.rs:98-230; rust/lance-table/src/rowids/serde.rs:376-398)

## Local trace: construct, select and mutate a segment

1. Collect distinct input IDs, compute min/max/count/nondecreasing order, choose Range/holes/bitmap/sorted array/general array using representability and estimated cost. Holes/bitmap construction scans numeric span; sparse arrays avoid that expansion. (rust/lance-table/src/rowids/segment.rs:126-299)
2. Translate ID to present ordinal through position, then get/select through variant-specific logic. Bitmap cursor retains byte/rank state for subsequent calls; full-range expansion can batch dense bytes if the caller selects that method. (rust/lance-table/src/rowids/segment.rs:389-479; rust/lance-table/src/rowids/segment.rs:770-954)
3. Slice preserves numeric IDs, while delete/mask rebuild surviving values using assumed-valid ordered inputs. Append retains/widens several representations and may allocate a full numeric gap; range-backed end arithmetic differs from constructor boundary handling. (rust/lance-table/src/rowids/segment.rs:378-387; rust/lance-table/src/rowids/segment.rs:507-746)
4. Optional bitmap-to-Ranges conversion may reduce estimated serialized range bytes. Sequence serialization expands it back to ordinary Range arms. Sequence concatenation and cursor reset are now covered below. A contextual manifest-builder snippet locates the opt-in, while complete transaction triggers and on-disk placement remain untraced. (rust/lance-table/src/rowids/segment.rs:268-289; rust/lance-table/src/rowids/serde.rs:232-255)

## Local trace: selection, deletion and rechunking

1. Build from untrusted IDs through try_from_iter: collect, reject duplicate, construct one segment while retaining input order. A table-wide duplicate check is not implemented by this method. (rust/lance-table/src/rowids.rs:221-265)
2. For sorted offset selection, public select creates a cursor and validates monotonicity lazily. At each segment boundary, cache length, translate ordinal and reset bitmap state on advance; backward internal requests reset the full cursor. (rust/lance-table/src/rowids.rs:67-170; rust/lance-table/src/rowids.rs:516-591)
3. For an ID mask, select each segment's IDs then compute their present ordinals; bitmap finite allow lists may take the cached-ID path. Preserve separate ranges at segment boundaries. (rust/lance-table/src/rowids.rs:609-798)
4. Delete by IDs through find_ids and segment reconstruction, or mask by original u32 positions; these have distinct empty cleanup and malformed-input assumptions. (rust/lance-table/src/rowids.rs:340-454)
5. Rechunk to new physical sizes by slicing/re-encoding segments and merging touching ranges. Incomplete mode emits short outputs; it never allocates the missing incremental IDs. (rust/lance-table/src/rowids.rs:946-1052)

This closes the local sequence trace. Later sections now cover the full table-local stream wrapper, lineage loading, manifest assembly and commit handlers. Complete file-reader/Dataset scheduling, cross-operation conflicts, retries and disk cleanup remain pending. (rust/lance-table/src/utils/stream.rs:407-444; rust/lance-table/src/utils/stream.rs:648-680; rust/lance-table/src/transaction/manifest_build.rs:73-122)


## Local transaction trace: allocate IDs, preserve creation, stamp update

1. A caller supplies mutable new fragments and a next-ID counter. Require physical count; retain complete/Column IDs; fill an inline prefix or create a new range, serializing Inline bytes and advancing counter per fragment. No files are written. (rust/lance-table/src/transaction/row_version.rs:332-405)
2. Resolve needed inline IDs from existing fragments sorted by fragment ID. Load supplied column preloads and decode inline metadata; prefilter by inclusive bounds, then record first source ordinal for each needed ID. Old deleted copies are not filtered. (rust/lance-table/src/transaction/row_version.rs:97-171)
3. Decode/cache creation sequences for selected source IDs; absent/corrupt inline creation is omitted, required missing Column preload errors. Writer-placed destination lineage does not require this lookup when every destination qualifies. (rust/lance-table/src/transaction/row_version.rs:173-205; rust/lance-table/src/transaction/row_version.rs:508-545)
4. Preserve/check writer-placed creation according to the metadata matrix. Otherwise expand found source creation or fallback1, use new_version for unmatched IDs, compress and serialize creation, and stamp latest metadata from physical count. A late failure does not undo earlier local mutations. (rust/lance-table/src/transaction/row_version.rs:206-295)

With source IDs10,11 created at3 and new IDs10,500,11,501 at commit5, the test requires creation[3,5,3,5] and update[5,5,5,5]. The shared fixture sets manifest.version4; contextual builder computes next version from current manifest, while transaction.read_version also happens to be4. Do not infer that read_version directly supplies the next committed version. (rust/lance-table/src/transaction/row_version.rs:1050-1102; rust/lance-table/src/transaction/test_support.rs:73-102; rust/lance-table/src/transaction/manifest_build.rs:752-752)

Complete builder analysis confirms Update assignment before resolver, cardinality filter afterward, and a second assignment. Local validation, index effects and table-level publication are covered; Dataset conflict rebasing, disk allocation and cleanup remain pending. This closes local row-version semantics; (rust/lance-table/src/transaction/manifest_build.rs:945-1002)



## Partial transaction-attempt trace

1. Construct typed Operation and TransactionBuilder; optionally set UUID/tag/properties; build moves intent into Transaction and generates UUID only if absent. No store access. (rust/lance-table/src/transaction/builder.rs:37-90)
2. Contextual prepare_indices calls the tagged gate, clones current index metadata, derives physical-column rewrites and optionally withdraws their coverage via lineage, then stores current optional manifest version and both lists. The gate and index-withdrawal algorithms are now covered in the local traces below; complete candidate assembly is now covered in the manifest-builder trace below. (rust/lance-table/src/transaction/manifest_build.rs:474-522)
3. Contextual build_manifest_prepared first requires the stored optional version equal current_manifest.version, repeats the gate, then consumes original/prepared/reuse parts. This is only a locally observed preparation boundary, not the atomic commit/retry protocol. (rust/lance-table/src/transaction/manifest_build.rs:593-611)

The operation enum, local validator, object codec, local candidate assembly and table-level metadata publication are covered in this KB. Full Dataset conflict, retry, write scheduling and cleanup remain gaps.



## Local config and metadata overlap examples

For UpdateConfig config edits deleting k on both sides, upsert_key_conflict is false. Replacing either deletion with an upsert makes it true regardless of value; one side replacing with an empty entry list still produces no keys and therefore no overlap here. These are deductions from the local predicate, not complete commit outcomes. (rust/lance-table/src/transaction/conflicts.rs:869-917; rust/lance-table/src/transaction/conflicts.rs:975-989)

For table metadata instead, two explicit deletes of k conflict, either Some replacement conflicts with any other Some map including empty, and either None prevents that category from conflicting. Two Some schema maps always conflict; a shared field ID conflicts even if inner keys differ. The local test proves only same/different table upsert keys and one replacement case in source assertions. (rust/lance-table/src/transaction/conflicts.rs:919-974; rust/lance-table/src/transaction/conflicts.rs:999-1021)

Operation equality, local validation, candidate assembly and table-level publication are covered; full Dataset cross-operation conflict handling, retries and cleanup remain pending.



## Local pre-commit validation trace

1. Contextual CommitBuilder::execute wraps execute_inner with optional timeout; execute_inner has a deep-clone guard before the reviewed destination/validation section. Dataset loading can occur before validation. Full intervening setup remains pending. (rust/lance/src/dataset/write/commit.rs:294-334; rust/lance/src/dataset/write/commit.rs:395-425)
2. Pass current manifest when a dataset exists, otherwise None. Overwrite rejects deletion descriptors and checks nonempty base-file field lists; Merge protects old fragment inclusion/counts and field bindings before format-specific validation. No file is opened inside these helpers. (rust/lance/src/dataset/write/commit.rs:419-425; rust/lance-table/src/transaction/validate.rs:18-174; rust/lance-table/src/transaction/validate.rs:202-416)
3. For RewriteColumns Update, after updated/new fragment schema checks, reject any offset-map key outside updated IDs. A contextual test builds fragments1/2, updates only1 but supplies offsets for2, and requires key-presence error. Bitmap bound checks and final stamping are later concerns. (rust/lance-table/src/transaction/validate.rs:67-95; rust/lance-table/src/transaction/manifest_build.rs:3643-3693)

This supplies the local validator and contextual caller boundary; complete publication, conflict retry and cleanup still prevent all five complete KB-only acceptance answers.



## Local transaction protobuf trace

1. Borrow Transaction and match all16 Operation variants, cloning/converting owned protobuf fields. Strip transient rewrite reuse metadata, leave old writer fields empty, preserve ordered UpdateMap edits. This constructs a protobuf object without publishing bytes. (rust/lance-table/src/transaction/proto.rs:492-806)
2. Decode an owned protobuf by operation, applying legacy fallbacks and optional-empty normalization. Decode nested fragment/schema/index/bitmap payloads; report missing operation as Internal. Update SSTable conversion can panic on missing shard UUID because it unwraps, whereas UpdateMemWalState returns the error. (rust/lance-table/src/transaction/proto.rs:83-426; rust/lance-table/src/system_index/mem_wal.rs:125-139)
3. A valid field10 bitmap-map presence suppresses all old field9 data; zero-byte values disappear but encoded empty bitmaps remain. New writes filter all empty bitmap values, so repeated decode/encode can change map presence. No runtime regression was executed. (rust/lance-table/src/transaction/proto.rs:252-283; rust/lance-table/src/transaction/proto.rs:624-640)

Local codec and validation are covered. Full write/compaction, scalar-index registration, all v2 behavior, Python mapping and end-to-end commit questions still fail because their consumer/lifecycle paths remain missing.



## Local index invalidation and rewrite trace

1. Classify changed physical columns from Update, Merge or DataReplacement. With tagged lineage, expand descendants and withdraw direct/reaching retired coverage; without it the wrapper performs direct exact-field pruning. (rust/lance-table/src/transaction/index_maintenance.rs:106-217)
2. If retired withdrawal leaves only live IDs that known history does not mention, clear the segment. Retire emptied metadata only when a same-name sibling retains known/unknown coverage. Actual cleanup and query fallback are outside these helpers. (rust/lance-table/src/transaction/index_maintenance.rs:259-393)
3. Rewrite fragment metadata by contiguous splice or noncontiguous remove-and-append, assigning zero placeholder IDs. Manifest-builder context then selects ordered groups and handles stable-row-ID bitmap recalculation or address-domain dropping; without stable IDs it applies rewritten-index UUID/files. Finally this caller invokes overlay-stale coverage pruning. The complete local candidate builder is now covered in the manifest-build module supplement; Dataset orchestration remains pending. (rust/lance-table/src/transaction/index_maintenance.rs:632-789; rust/lance-table/src/transaction/manifest_build.rs:1039-1118)
4. Final retention treats unknown coverage conservatively and preserves tagged provenance; otherwise uses effective live coverage to choose segments. It does not mutate stored bitmaps or delete physical files. (rust/lance-table/src/transaction/index_maintenance.rs:517-625)

Narrow conflict-resolver snippets show shared withdrawal in Update, Merge and DataReplacement branches. Full branch preconditions and retry ordering are not yet analyzed; this is not an end-to-end commit proof. (rust/lance/src/io/commit/conflict_resolver.rs:924-974; rust/lance/src/io/commit/conflict_resolver.rs:1006-1062; rust/lance/src/io/commit/conflict_resolver.rs:1172-1208)



## Gate and clone-guard boundaries

prepare_indices runs classify before cloning/withdrawing index metadata. The reviewed builder rejects stale prepared manifest version then rechecks classify on original indices and settled reuse update before destructuring prepared state. This confirms two local choke points; full entrance/retry coverage is pending. (rust/lance-table/src/transaction/manifest_build.rs:474-522; rust/lance-table/src/transaction/manifest_build.rs:593-611)

ensure_clone_supported returns immediately without reader bit10; otherwise awaits index list and rejects any name/nonzero-version tagged entry. Contextual dataset clone calls it after source checkout/write-capability check and before path collection; contextual commit Clone calls it after loading/checking source manifest. A sticky flag with no tagged entry passes this helper. Source-store selection, complete clone lifecycle and physical relocation are not fully analyzed. (rust/lance-table/src/system_index/frag_reuse/metadata.rs:54-69; rust/lance/src/dataset.rs:3336-3345; rust/lance/src/io/commit.rs:435-455)



## Decode one fragment-reuse history

1. Validate version and Any envelope. Inline uses contained bytes; external callback reads exact described range and decoder verifies returned size. Contextual query load_ledger resolves index directory/UUID/file path, opens the index's object store and requests offset..end; the complete query/caching lifecycle remains pending. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:125-169; rust/lance/src/index/frag_reuse_reader.rs:449-476)
2. Lift legacy groups and decode supported tagged transitions. Omit unknown transition records with unsupported flag; retain original Any elsewhere if forwarding unchanged. Validate digests, row conservation and known mapping metadata. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:173-233; rust/lance-table/src/system_index/frag_reuse/ledger.rs:357-450)
3. Topologically order known transitions and build lookup maps. TaggedLineage rejects the usable ledger view when unsupported flag is set, so shared invalidation gets conservative unknown answers. Stable map labels remain unopened here. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:234-291; rust/lance-table/src/system_index/frag_reuse/ledger.rs:452-515; rust/lance-table/src/system_index/frag_reuse/lineage.rs:36-43)

This closes metadata decoding, not commit assembly, full query translation, physical compaction or all five complete KB-only acceptance questions.



## Local MemWAL generation publication preparation

1. A manifest-builder Update or UpdateMemWalState supplies progress and candidate dataset version to the helper. Empty progress leaves metadata untouched. (rust/lance-table/src/transaction/manifest_build.rs:1009-1017; rust/lance-table/src/transaction/manifest_build.rs:1554-1564; rust/lance-table/src/system_index/mem_wal.rs:531-538)
2. Reject duplicate proposed shards and missing system index, then decode a copy. For each shard, require strict advancement from the first stored marker or append a new one. A later failure discards earlier local updates. (rust/lance-table/src/system_index/mem_wal.rs:540-585)
3. Serialize new details into a fresh index UUID and replace the same position. The dataset opening path later builds a cache key from that UUID and optional FRI UUID, checks cache, loads metadata on miss and invokes synchronous open; actual metadata-load/store commit lifecycle remains pending. (rust/lance-table/src/system_index/mem_wal.rs:587-618; rust/lance/src/index.rs:3802-3832)

This traces an in-memory dependency, not atomic storage publication, shard claim/replay or the complete Dataset::write/compact_files lifecycle. ## Complete local manifest assembly and immediate IO handoff

1. Dataset IO prepare_attempt loads indices, conditionally decodes tagged history, then prepares coverage against the attempt's current manifest. Convenience wrappers have no prefetched ledger/settled FRI intent. (rust/lance/src/io/commit.rs:1470-1513; rust/lance-table/src/transaction/manifest_build.rs:453-577)
2. Check prepared numeric version and gate; choose schema/base/high-water and stable-ID state; snapshot original MemWAL identities; apply operation-specific fragment/index rules. Delete preserves current nondeletion state, Update reconciles overlays/files/lineage, Rewrite splices settled history, and overlays stamp candidate version. (rust/lance-table/src/transaction/manifest_build.rs:580-1570)
3. Sort/prune/validate metadata, derive catchup, promote blob schema, construct Manifest and flags, update config/key/base state and watermarks. Return candidate. [Dispatch and full API](../../L1-modules/rust-lance-table-manifest-build.md). (rust/lance-table/src/transaction/manifest_build.rs:1571-1919)
4. Contextual normal path resets target version, migrates manifest, fixes schema, checks storage/fragment IDs, migrates indices and withdraws invalidated catchup before write_manifest_file. Detached does analogous work with random high-bit version and no read proof. Restore skips preparation and returns historical indices before these callers continue. (rust/lance/src/io/commit.rs:1242-1315; rust/lance/src/io/commit.rs:1699-1782)

The immediate boundary and table transaction/manifest byte writers are now established. Full Dataset retry/conflict decisions, data-file creation, cleanup and recovery remain pending. this trace does not claim an end-to-end Dataset::write/compact_files account.


## Manifest body write/read and deletion-object trace

1. Candidate assembly returns Manifest/indices; low-level write_manifest first handles V1 dictionaries, writes index and inline transaction sections (or clears offsets), then writes length-prefixed manifest. (rust/lance-table/src/transaction/manifest_build.rs:1904-1919; rust/lance-table/src/io/manifest.rs:177-230)
2. Contextual canonical writer appends footer, awaits shutdown and logs create. Commit ownership/CAS/retries are not established by this function alone. (rust/lance-table/src/io/commit.rs:213-230)
3. Reader obtains size, tail and body chunks; verifies body length, decodes/interns metadata, then copies sparse inline row IDs out of shared backing when below threshold. Separate index read follows recorded offset and narrowly retries cached size. (rust/lance-table/src/io/manifest.rs:32-175; rust/lance-table/src/format/manifest.rs:391-419)
4. Deletion write serializes caller vector to one object and returns metadata. Contextual fragment mutation stores that metadata; a later transaction/manifest must make it durable to readers. Dataset cache wrapper resolves external directory/store and caches Arc vector after full-object read. (rust/lance-table/src/io/deletion.rs:61-216; rust/lance/src/dataset/fragment.rs:3004-3035; rust/lance/src/io/deletion.rs:11-43)

Full Dataset::write/compact_files traces still require writer scheduling, concrete backend integration and Dataset recovery, index mutation/query and cleanup. These IO traces add real byte boundaries but do not complete any of the five acceptance questions.


## Single-attempt conditional and locked commit traces

1. A caller supplies a candidate Manifest, optional indices/inline transaction and writer callback. The handler computes a final manifest path before callback execution. (rust/lance-table/src/io/commit.rs:983-992; rust/lance-table/src/io/commit.rs:1634-1644)
2. ConditionalPut creates a fresh memory store, serializes through the callback at dummy, reads all bytes and calculates size. Manifest offset mutations may already have happened. (rust/lance-table/src/io/commit.rs:1634-1647; rust/lance-table/src/io/manifest.rs:177-209)
3. It issues Create at the real path. Two conflict errors return CommitConflict; other errors remain ambiguous to the caller. Success writes the best-effort hint and returns put ETag with no external identity. (rust/lance-table/src/io/commit.rs:1648-1676)
4. The lock alternative acquires a lease, HEADs under it, writes directly if missing, releases with writer success, then writes the hint. Any release failure can replace the preceding result. Cancellation with a held lease spawns release(false) if a runtime is available. (rust/lance-table/src/io/commit.rs:1389-1502)
5. A later reader resolves through local directory scan, verified hint or listing, then reads metadata bytes. Exact-version fallback locations themselves do not prove existence. (rust/lance-table/src/io/commit.rs:298-313; rust/lance-table/src/io/commit.rs:1057-1102; rust/lance-table/src/io/manifest.rs:32-128)

This establishes local publication and resolver mechanics; predecessor-capable external authority is covered in the next trace. Dataset conflict rebasing, retries, uncertain-outcome interpretation, namespace authority and cleanup still prevent a complete transaction acceptance answer.


## External publication, repair and conditioned history

1. Ordinary commit writes a unique staging object through ManifestWriter, then default put atomically reserves its path with ETag None. A lost response can still leave a selected row. (rust/lance-table/src/io/commit/external_manifest.rs:216-261; rust/lance-table/src/io/commit/external_manifest.rs:963-1011)
2. Finalization copies those selected bytes to canonical storage, HEADs to check size/obtain ETag, updates the external row and deletes staging. Index-update failure returns success while retaining staging; a later reader can repeat the selected immutable copy and repair the row. (rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:434-485; rust/lance-table/src/io/commit/external_manifest.rs:1604-1779)
3. An ordinary publication error becomes CommitConflict after path-based loser cleanup or retention. A later read may finish the selected write. Complete transaction readback/rebase/retry remains pending. (rust/lance-table/src/io/commit/external_manifest.rs:1123-1149; rust/lance-table/src/io/commit/external_manifest.rs:1780-1817)
4. For conditioned publication, read predecessor token, write a unique object, then atomically verify that token while inserting the new record. Success leaves the unique object as final; no shared canonical path is written. Changed predecessor refuses publication and attempts object deletion. (rust/lance-table/src/io/commit/external_manifest.rs:1030-1121)
5. Identified readers/history use external records. Record retirement compares the token so stale cleanup cannot remove a replacement record. Cancellation before reservation can leave an unlisted-as-version orphan; listing all raw objects still sees it. (rust/lance-table/src/io/commit/external_manifest.rs:907-961; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162; rust/lance-table/src/io/commit/external_manifest.rs:2438-2505)

See [external commit module](../../L1-modules/rust-lance-table-external-commit.md) for exact APIs and branch-specific errors. These traces do not yet establish the full Dataset write/compact or operation-pair conflict acceptance answers.


## DynamoDB generic commit and stable-ID lookup traces

The parent factory builds a configured DynamoDB client/store, whose name-only cache may skip schema validation. Generic external commit writes staging, conditionally inserts its five-field row, copies selected bytes to canonical storage, then conditionally replaces the existing row and cleans staging. SDK failures first become IO; generic put handling/repair then decides conflict or successful canonical recovery. DynamoDB adds no predecessor-conditioned protocol. (rust/lance-table/src/io/commit.rs:1139-1169; rust/lance-table/src/io/commit/dynamodb.rs:162-265; rust/lance-table/src/io/commit/dynamodb.rs:423-484; rust/lance-table/src/io/commit/external_manifest.rs:35-102; rust/lance-table/src/io/commit/external_manifest.rs:963-1011)

Given already loaded fragment ID sequences/deletions, RowIdIndex builds sidecars and envelopes, sorts fragments and selects merged or probe representation. Merged decomposition keeps original physical offsets while filtering tombstones; probe resolves position then checks the deletion vector. get_many sorts a working input copy and restores requested order. This closes the local ID-to-address lookup, not data-file reads or cache invalidation across Dataset versions. (rust/lance-table/src/rowids/index.rs:62-183; rust/lance-table/src/rowids/index.rs:276-435; rust/lance-table/src/rowids/index.rs:502-743)

these additions do not replace pending Dataset writer/compaction, index registration, full format or binding analysis.


## Scheduled batches to visible rows

1. Fragment call sites obtain per-file task streams, align them with merge_streams, then merge overlays before configuring system-column wrapping. Only these local call sites are inspected; complete fragment scheduling and overlay IO remain pending. (rust/lance/src/dataset/fragment.rs:3680-3719; rust/lance/src/dataset/fragment.rs:3872-3916)
2. Pulling each wrapped task assigns its selected-position offset and eagerly expands stable IDs/multi-run versions with private cursors. Returned futures hold those arrays/Results while payload reads can proceed concurrently. (rust/lance-table/src/utils/stream.rs:692-848)
3. On successful payload completion, build missing address/version arrays, append requested fields and use physical-address deletion predicates. Filter mode drops rows across all columns; null mode preserves row alignment and only nulls ID/address. Projection reordering follows in the contextual caller. (rust/lance-table/src/utils/stream.rs:489-641; rust/lance/src/dataset/fragment.rs:3709-3719)

This closes the local table stream boundary. Full write/compaction disk effects, scalar registration, V2 encoding layout, bindings and operation-pair commit rules still fail the five complete acceptance questions.


## File runtime entry paths (local, not complete Dataset write)

1. Caller resolves policy to ConcreteFileVersion; versions::create_writer routes schema/options/object writer to one exact V2 module, returning boxed FileWriter. V1 requires its separate manifest-provider writer. (rust/lance-file/src/version.rs:59-75; rust/lance-file/src/versions/mod.rs:328-372)
2. The runtime facade awaits write_batch per input in order. Contextual concrete pipelines invoke ExpectedTypes; it compares schema field types/extensions and retains the last accepted schema. Encoding, page IO and durability remain delegated and incompletely analyzed. (rust/lance-file/src/writer.rs:160-189; rust/lance-file/src/writer/field_types.rs:87-128; rust/lance-file/src/writer/structural.rs:610-630; rust/lance-file/src/versions/v2_0/writer.rs:458-477)
3. On reading, decode_schema reconstructs FieldsWithMeta from protobuf; exact projection dispatch selects per-version layout. Eligible V2_1/2/3 projected opening may use an indexed opener; V2_0 uses full metadata. (rust/lance-file/src/reader.rs:942-952; rust/lance-file/src/versions/mod.rs:151-198; rust/lance-file/src/versions/mod.rs:279-326)
4. Encoding IO splits and submits requests, awaits scheduler bytes, restores empties and copies multi-chunk results. This does not complete scheduler cancellation, decoder lifetime or Dataset scan orchestration. (rust/lance-file/src/io.rs:51-148)

All five full acceptance questions remain open. [Runtime supplement](../../L1-modules/rust-lance-file-runtime.md) provides exact local contracts.

## Structural projection subtrace

Exact version supplies DecodeColumn to StructuralReadProjection. Full provider validates then shares column infos; indexed provider validates, loads selected infos via IO/cache and compacts indices0..N. Recursive length consumes columns in leaf order; page normalization accounts for sparse outer slots and checked sum, top-level lengths must agree. Errors can occur after indexed metadata IO. This is only the metadata/preparation portion; page scheduling/materialization and Dataset scan remain pending. (rust/lance-file/src/reader/structural.rs:319-431; rust/lance-file/src/reader.rs:539-577) [Full local detail](../../L1-modules/rust-lance-file-composition.md).

## Metadata finishing subtrace

Raw metadata enters the exact reader: footer pair gate, then structural global alignment (V2_0 none), serial per-column/page syntax/grammar/descriptor normalization, cache object retaining raw and decoded forms. Indexed finish checks identity/alignment without loading columns; V2_0 later refuses indexed preparation. Normalized length is separate from declared raw row count. These local steps do not cover the preceding tail/metadata reads or subsequent decoder IO. (rust/lance-file/src/versions/v2_0/reader.rs:150-175; rust/lance-file/src/versions/v2_0/reader.rs:350-395; rust/lance-file/src/versions/v2_1/reader.rs:161-258; rust/lance-file/src/versions/v2_2/reader.rs:163-260; rust/lance-file/src/versions/v2_3/reader.rs:201-298)

## Current structural file write subtrace

1. Exact writer validates explicit options, resolves runtime budgets, validates schema and creates its BatchEncoder. Pipeline captures per-field encoders/mapping and initializes physical metadata slots. (rust/lance-file/src/versions/v2_1/writer.rs:78-94; rust/lance-file/src/writer/structural.rs:414-455)
2. For each batch, check types/nullability, build encoding tasks and external-buffer reservations, write reserved buffers, advance counters, then drain ordered pages into sink. These stages can fail after mutation; a returned error is not rollback. (rust/lance-file/src/writer/structural.rs:598-650; rust/lance-file/src/writer/structural.rs:206-259)
3. Finish flushes buffered encoders, consumes their final columns, builds unloaded-schema descriptor, writes column metadata/tables/footer and awaits object shutdown. Spill, if configured, rebuilds column metadata from a sidecar without deleting that sidecar here. (rust/lance-file/src/writer/structural.rs:312-340; rust/lance-file/src/writer/structural.rs:705-801; rust/lance-file/src/versions/v2_2/writer.rs:152-186)

This closes the local V2_1/V2_2/V2_3 writer subtrace. Dataset::write/compact_files, full backend durability, encoder byte algorithms, scalar registry, bindings and complete conflict/retry behavior still prevent all five full acceptance answers. [Writer supplement](../../L1-modules/rust-lance-file-structural-writer.md).

## V2_0 file-write and stable-fixture subtraces

1. Initialize explicit or first-batch schema, resolve options, create field encoders and physical metadata. Name-select and prepare every batch field before empty-batch return. (rust/lance-file/src/versions/v2_0/writer.rs:326-400; rust/lance-file/src/versions/v2_0/writer.rs:451-476)
2. Encode using previous per-field offsets, write out-of-line buffers, advance rows, then drain ordered pages. Finish consumes encoders, writes descriptor/metadata/tables/footer(0,3), and awaits object shutdown. Caller still owns sidecar and failure cleanup. (rust/lance-file/src/versions/v2_0/writer.rs:477-506; rust/lance-file/src/versions/v2_0/writer.rs:597-630; rust/lance-file/src/versions/v2_0/writer.rs:711-834)
3. In the stable test harness, five input writes represent4097rows. Compare all current bytes to pinned fixture, then read pinned bytes and check normalized identity, some multipage column, schemas, nulls and values. V1 uses its separate expected-null transformation. (rust/lance-file/src/compatibility_tests.rs:100-135; rust/lance-file/src/compatibility_tests.rs:232-294; rust/lance-file/src/compatibility_tests.rs:318-399; rust/lance-file/src/compatibility_tests.rs:467-524)

This subtrace is source-derived and unexecuted. Dataset/compaction/retry, index registration, full encoding algorithms and bindings remain incomplete. [Details](../../L1-modules/rust-lance-file-v20-compatibility.md).

## Test-derived unequal-root and rejection-recovery traces

1. Write roots independently to lengths5,1,0; finish reports max5 and metadata preserves each length. Read each populated root independently or take increasing indices from the long root. (rust/lance-file/src/writer_tests.rs:190-295)
2. Project roots with equal lengths for a rectangular stream. Even a shared prefix of unequal roots rejects; open-ended single-root selections resolve against its own length. The async collecting test does not isolate failure timing. (rust/lance-file/src/writer_tests.rs:297-448)
3. For V2_0 reordered input, reject a selected null struct, then write a valid batch on the same writer. The reopened id projection contains only the valid batch's4,5,6. This does not establish rollback for arbitrary encoding/IO errors. (rust/lance-file/src/writer_tests.rs:731-815)

these file-local oracles do not fill Dataset/compaction/retry, complete encoding algorithms, scalar registry or language bindings. [Test catalog](../../L1-modules/archive/rust-lance-file-writer-tests.md).

## Shared reader open, prepare and consume

1. Full open reads tail/footer, handles legacy identity or validates current GBO, decodes schema and all CMO-referenced columns, then calls exact-version normalization. Indexed open fetches schema or trusts enclosing schema/rows plus CMO; no column protobufs load yet. (rust/lance-file/src/reader.rs:954-1115; rust/lance-file/src/reader.rs:1976-2080)
2. Factories select ReadProjection and path-prefix cache; indexed factory validates eligibility, not selectivity threshold. prepare loads cache misses and compacts physical indices before computing uniform selected length. (rust/lance-file/src/reader.rs:1620-1677; rust/lance-file/src/reader.rs:2186-2219; rust/lance-file/src/reader/structural.rs:393-431)
3. Row selectors undergo local bounds checks and become RequestedRows plus SchedulerDecoderConfig. Async tasks are converted through ordered buffered futures; blocking calls return RecordBatchReader. Async take drops the supplied filter; other listed paths retain it. (rust/lance-file/src/reader.rs:457-468; rust/lance-file/src/reader.rs:1166-1482; rust/lance-file/src/reader.rs:1753-1885)
4. Global reads use copied tail buffers or fallback IO; fallback results are not cached here. Full Dataset/encoding scheduler/backend lifetime and cancellation remain incomplete. [Reader walkthrough](../../L1-modules/rust-lance-file-shared-reader.md). (rust/lance-file/src/reader.rs:1721-1751; rust/lance-file/src/reader.rs:4225-4333)

## Local encoded-concatenation trace

1. Ordinary inputs concurrently read raw metadata, reject legacy then finish exact metadata. Blob parts instead open/validate descriptors and retain runtime lease/target state before assembly. (rust/lance-file/src/concat.rs:140-225; rust/lance-file/src/concat.rs:1078-1118)
2. Check target IDs/lease overlap for parts, then per-input schema/version/rectangularity and buffer/encoding compatibility. Checked-sum rows; ordinary single-input result is Reused without factory call. (rust/lance-file/src/concat.rs:684-793; rust/lance-file/src/concat.rs:928-951; rust/lance-file/src/concat.rs:1138-1170)
3. Create the output writer, copy batches of whole pages, relocate buffers/priorities, normalize exact-version structural columns, align schema and finish. Returned write errors trigger explicit abort; cancellation lacks a local guard. (rust/lance-file/src/concat.rs:795-1035)

This is a local assembly trace, not a completed Dataset::write/compact_files scenario. The [concat supplement](../../L1-modules/rust-lance-file-concat.md) records narrow Dataset call sites and their unresolved authority/lifecycle boundaries. ## Frozen V1 local metadata subtrace

1. Derive full physical mapping in schema preorder, stopping under Blob/packed nodes; a projected schema retains original physical slot references. (rust/lance-file/src/versions/v1/mod.rs:25-116)
2. Narrow observed writer calls create PageInfo from encoded position and logical array length, then set signed field/batch key. Footer writes data table, statistics, schema dictionaries/provider schema, Metadata and magics. The full local lifecycle is now covered in the V1 writer supplement; complete Dataset write/compaction remains pending. (rust/lance-file/src/versions/v1/writer/mod.rs:393-459; rust/lance-file/src/versions/v1/writer/mod.rs:627-651)
3. PageTable writes every field/batch cell across supplied min and observed maxima, inserting0/0 for holes; metadata stores locations and cumulative rows. (rust/lance-file/src/versions/v1/page_table.rs:94-145) (rust/lance-file/src/versions/v1/format/metadata.rs:14-78)
4. Observed reader loads ordinary table using schema min/max and metadata.num_batches, plus a statistics table with one batch; helper load decodes full Int64 values and expands maps. (rust/lance-file/src/versions/v1/reader.rs:165-206; rust/lance-file/src/versions/v1/reader.rs:240-267) (rust/lance-file/src/versions/v1/page_table.rs:53-92)
5. read_range skips empty ranges before metadata splitting; take groups sorted indices then checks resulting batch IDs. Per-page decoding and the local cache/cancellation boundaries are now covered in the V1 reader supplement; full Dataset behavior remains pending. (rust/lance-file/src/versions/v1/reader.rs:342-396)

[Foundation supplement](../../L1-modules/rust-lance-file-v1-foundation.md) supplies exact signatures and edge cases. These historical subtraces do not complete any of the five repository-wide KB-only acceptance answers.

## Frozen V1 value roundtrip subtrace

1. A page adapter selects the legacy codec and stores returned position plus logical row count. Binary position means the table after payload; plain/dictionary position means value/key bytes. (rust/lance-file/src/versions/v1/writer/mod.rs:406-459; rust/lance-file/src/versions/v1/encoding/binary.rs:48-105; rust/lance-file/src/versions/v1/encoding/plain.rs:90-115)
2. The binary reader uses field.nullable, fetches positions through PlainDecoder and reads the enclosing payload range. Equal endpoints reconstruct null; original validity was not stored. (rust/lance-file/src/versions/v1/reader.rs:625-642; rust/lance-file/src/versions/v1/encoding/binary.rs:153-232)
3. Dictionary reading unwraps loaded schema values, reads plain keys and combines them with the shared ArrayRef. This does not merge dictionaries or load values at the key-decoder layer. (rust/lance-file/src/versions/v1/reader.rs:645-668; rust/lance-file/src/versions/v1/encoding/dictionary.rs:122-159)

This closes concrete codec subtraces only. The full V1 reader is now covered; modern codec algorithms, Dataset write/compaction, index registration, bindings and commit retry/conflict handling still prevent all five complete KB-only acceptance answers. [Codec supplement](../../L1-modules/rust-lance-file-v1-codecs.md).

## Frozen V1 full local read trace

1. The caller supplies schema/dictionaries or invokes table SelfDescribingFileReader to load them from the embedded manifest. (rust/lance-table/src/format/manifest.rs:1156-1182)
2. Open Reader, load tail Metadata, then concurrently obtain the ordinary and optional statistics tables. Cache keys use stable typed path identity; no-cache statistics loading rereads metadata. (rust/lance-file/src/versions/v1/reader.rs:139-288)
3. Select explicit projection and batch/range/indices. File take sorts into stored batches; stream predicates filter ascending full-batch IDs with outer concurrency2. (rust/lance-file/src/versions/v1/reader.rs:324-507; rust/lance-file/src/versions/v1/format/metadata.rs:128-163)
4. Read roots concurrently, struct children sequentially and list takes one child range at a time. Type dispatch selects frozen codecs; dictionaries require loaded values. (rust/lance-file/src/versions/v1/reader.rs:509-808)
5. Build RecordBatch with requested schema, retaining all selected arrays; concatenate cross-batch range/take results in spawn_blocking. No local row-ID or deletion materialization occurs. (rust/lance-file/src/versions/v1/reader.rs:342-396; rust/lance-file/src/versions/v1/reader.rs:489-507)

[This reader trace](../../L1-modules/rust-lance-file-v1-reader.md) does not complete Dataset write/compaction, modern codec algorithms, index registration, bindings or commit conflict/retry handling. The original source-replacement acceptance outcomes are historical. V2.1 contract answers and ordered source navigation remain milestone deliverables.

## Complete local V1 write-to-read trace

1. The contextual Dataset open_v1_writer prepares a path, creates the generic V1 writer with ManifestDescribing and default statistics options, then wraps its path/base ID. Full Dataset scheduling and version selection remain pending. (rust/lance/src/dataset/write.rs:2299-2327)
2. write validates every batch using stored schema nullability, collects one stats row per selected supported scalar field across the slice, and recursively writes every root at one batch ID. List position pages include a terminal offset and precede child pages; no struct/list parent validity is emitted. (rust/lance-file/src/versions/v1/writer/mod.rs:166-224; rust/lance-file/src/versions/v1/writer/mod.rs:462-586)
3. Append cumulative i32 logical length, flush in-flight writer requests, then increment batch ID. Failure before that increment can still leave advanced metadata, stats and page bytes. (rust/lance-file/src/versions/v1/writer/mod.rs:225-236)
4. Finish writes ordinary table, optional stats/table, dictionaries and the provider schema manifest, then Metadata and the 0.2 footer. ManifestDescribing calls the internal manifest-body writer directly so it does not duplicate dictionary writes. (rust/lance-file/src/versions/v1/writer/mod.rs:588-651; rust/lance-table/src/io/manifest.rs:232-250)
5. Writer::shutdown supplies authoritative size. V1WriterAdapter returns cast row count and a legacy DataFile describing schema fields/path/size/base. Existing V1 reader traces explain metadata/page tables and reconstruction; full Dataset commit, compaction and backend durability remain unresolved. (rust/lance-file/src/versions/v1/writer/mod.rs:255-270; rust/lance/src/dataset/write.rs:2066-2077)

[Writer supplement](../../L1-modules/rust-lance-file-v1-writer.md) supplies exact signatures, errors and seven test oracles.

## Local V1 statistics trace

1. Writer options select schema IDs, then collector traverses only roots/struct children and filters the eligibility whitelist. BTreeMap output order is numeric ID, regardless of writer visitation order. (rust/lance-file/src/versions/v1/writer/mod.rs:109-137) (rust/lance-file/src/versions/v1/writer/statistics.rs:619-686)
2. A nonempty write slice supplies borrowed arrays for each selected field, synchronously reduces them and appends one row before writing pages. Numeric/Boolean defaults differ from absent string/binary bounds. (rust/lance-file/src/versions/v1/writer/mod.rs:189-199) (rust/lance-file/src/versions/v1/writer/statistics.rs:47-482)
3. At footer time finish drains builders into ID-named structs; RecordBatch failure loses old collected rows. Writer serializes the resulting statistics batch and table if nonempty. No rollback or backend durability guarantee follows from this collector. (rust/lance-file/src/versions/v1/writer/statistics.rs:635-670) (rust/lance-file/src/versions/v1/writer/mod.rs:588-651)

[Statistics supplement](../../L1-modules/rust-lance-file-v1-statistics.md) closes this local trace; complete Dataset write/compaction and current encoding byte algorithms remain pending.

## Benchmark-only read scenario

Untimed fixture creation writes and finishes one exact-version file. Full-scan iterations reopen scheduler/reader and consume tasks; indexed iterations reuse warmed readers and dispatch blocking worker calls that run local async reads. Optional cache advice touches only the OS path on Linux and does nothing on other platforms. This is a local synthetic workload, not the Dataset write/compaction scenario required for full acceptance. [Trace and denominators](../../L1-modules/archive/rust-lance-file-benchmarks.md). (rust/lance-file/benches/reader.rs:30-149) (rust/lance-file/benches/reader.rs:173-290) (rust/lance-file/benches/reader.rs:354-477)

## Offline interpretation of the V1 historical fixture

1. Read footer[387117,387133): version(0,2), magicLANC, metadata pointer387096. Read the UInt32 length17 and following metadata. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:387096-387133)
2. Use metadata's six cumulative batch offsets to obtain five batches; use external schema's six physical fields to size the table at386572 as480 bytes. Decode field-major(position,length) pairs. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:386572-387117; rust/lance-file/test_data/exact_versions/datagen.rs:73-100)
3. Follow each field's representation: fixed-width values, absolute name/blob positions, relative list positions/child values and Int8 dictionary keys. Dictionary strings lie after the table; provide them through the external schema. (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387096; rust/lance-file/src/versions/v1/writer/mod.rs:407-537)
4. Compare with the explicit V1 expected-null transformation, not the original nullable input unchanged. [All4097 decoded rows](../../evidence/binary/v1-decoded-rows.json) and [full byte map](../../L1-modules/archive/rust-lance-file-binary-fixtures.md) supply reproducible static evidence. Full Dataset write/compaction remains outside this local scenario. (rust/lance-file/src/compatibility_tests.rs:100-135; rust/lance-file/src/compatibility_tests.rs:467-524)

## Read either pinned embedded V2_0 fixture

1. Read the final40 bytes: require LANC and interpret(2,0) as V2_0. Read two CMO entries; for self-described only, read GBO0=(10124,100) to obtain schema and row count257. Mini receives that schema externally. (rust/lance-file/src/compatibility_tests.rs:417-448; rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:22889-22961; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:22989-23077)
2. Decode direct Any metadata, then read17 id pages and129 name pages in column order. Sum page lengths to257 rather than using priority0 as a row address. Flat32 yields IDs; Flat64 indices and Flat8 string payloads yield names using page-local null adjustments33/65. All buffers are unpadded and all37 nulls are preserved. (rust/lance-file/test_data/exact_versions/v2_0_mini.lance@bytes:0-22889; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107)
3. Compare complete schema and values with the projected deterministic batch as the existing test specifies. The KB has performed offline data comparisons; the Rust test remains unexecuted. This local scenario does not establish Dataset write/compaction behavior. [Full byte contracts](../../L1-modules/archive/rust-lance-file-embedded-fixtures.md). (rust/lance-file/src/compatibility_tests.rs:401-449)

## Decode the pinned standard V2_0 file

1. Read40-byte footer(0,3), six CMO entries and one GBO. Decode327-byte FileDescriptor with4097 rows and flattened field IDs0..5; reconstruct List(item) using parent_id2. (rust/lance-file/src/version.rs:200-262; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:619328-706157)
2. Decode each direct Any page tree. Use metadata unpadded buffer sizes and cumulative lengths; skip0x48 alignment. Normalize name/list ends by A; decode child validity and connect11172 children to3724 valid lists; map dictionary key3 to null. (rust/lance-encoding/src/array_encoding/logical/list.rs:1116-1243; rust/lance-encoding/src/data.rs:1703-1778; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)
3. Unpack4097 blob(position,size) pairs and fetch31 bytes per payload from batch-relative64-byte records. Compare all five logical fields with the [documented deterministic input](../../L1-modules/archive/rust-lance-file-standard-v20-fixture.md). Offline comparison is complete; actual Lance reader execution remains untested and the end-to-end Dataset/compaction question remains open. (rust/lance-encoding/src/array_encoding/logical/blob.rs:308-399; rust/lance-file/test_data/exact_versions/datagen.rs:37-99; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

## Decode the pinned standard V2_1 artifact

1. Resolve footer(2,1), five CMO entries and descriptor global0. Map six schema IDs into five physical columns; use page row lengths and priorities for the five batches. (protos/file2.proto:40-93; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:498240-501167)
2. Parse UInt16 chunk words, conditional headers and 8-byte component padding. Decode FastLanes values and levels, use visible-slot chunk counts and repetition indices, then rebuild null lists/children. [All73 chunks](../../L1-modules/archive/rust-lance-file-standard-v21-fixture.md) retain actual stream lengths and widths. (rust/lance-encoding/src/encodings/logical/primitive.rs:704-803; rust/lance-encoding/src/encodings/logical/primitive.rs:5751-6062; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)
3. Resolve Variable name offsets and dictionary key/null semantics; fetch each31-byte blob through its packed position/size pair. The KB-side parser compares every resulting row with the documented deterministic input. Lance runtime and full write/compaction lifecycle remain unverified. (rust/lance-encoding/src/encodings/physical/binary.rs:30-154; rust/lance-encoding/src/encodings/physical/binary.rs:457-537; rust/lance-encoding/src/encodings/logical/blob.rs:105-203; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)

## Decode the pinned standard V2_2 file

1. Resolve footer(2,2), five column entries and schema global0; page priorities identify batches. (protos/file2.proto:40-93; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:498048-500987)
2. Decode23 mini-block pages using UInt32 chunk words/value lengths and UInt16 level fields,8-byte0xFE component padding and64-byte0x48 buffer padding. Apply FastLanes, visible-slot level slicing, dictionary offsets and repetition indices as detailed in the [full contract](../../L1-modules/archive/rust-lance-file-standard-v22-fixture.md). (rust/lance-encoding/src/encodings/logical/primitive.rs:5751-6062; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:0-500987)
3. Decode final id from inline Int32 bytes and final name from its typed scalar frame, then use packed blob descriptions for31-byte payloads. All4097 row objects are checked offline; current Lance runtime and full Dataset write/compaction remain unexecuted. (rust/lance-arrow/src/scalar.rs:61-191; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:219-259; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:0-500987)

## Local metadata and IO handoff

This trace covers reviewed boundaries only; it does not complete Dataset write/query or the full encoder/decoder lifecycle. [Encoding module and exact APIs](../../L1-modules/rust-lance-encoding.md).

1. Build generation compiles the two encoding schemas and uses Bytes for bytes fields; format.rs includes their generated modules. (rust/lance-encoding/build.rs:15-20; rust/lance-encoding/src/format.rs:4-33)
2. A helper constructs a compression tree and page layout. Optional children, numeric widths/counts and layer order are mostly copied; mini-block's nonempty-layer assertion is not full validation. (rust/lance-encoding/src/format.rs:312-773)
3. The exact reader checks schema subsets such as variable packed fields and mini-block header width. A descriptor accepted by a helper can still be rejected by that reader. (rust/lance-file/src/versions/v2_1/reader.rs:93-142; rust/lance-file/src/versions/v2_2/reader.rs:93-144)
4. EncodingsIo represents byte requests for one file. The complete lance-file adapter splits, counts and reassembles physical requests; the complete BufferScheduler implementation slices an existing buffer eagerly. These are alternative implementations of the seam, not sequential IO stages. (rust/lance-encoding/src/lib.rs:33-134; rust/lance-file/src/io.rs:17-148)
5. The inspected decode_batch prefix uses BufferScheduler over batch.data and selects a provided cache or a new 128 MiB cache. Its remaining scheduler/task lifecycle still requires whole-file analysis. (rust/lance-encoding/src/decoder.rs:3412-3440)

## Local configuration-to-buffer trace

This is a reviewed subtrace; the complete Dataset write/compact path remains unavailable. [Encoding contracts](../../L1-modules/rust-lance-encoding.md).

1. Merge an exact type record, then exact column or one matching pattern; V2.2 Strategy overlays parsed field metadata. Invalid metadata fields can leave inherited values intact. (rust/lance-encoding/src/compression_config.rs:84-141; rust/lance-file/src/versions/v2_2/compression.rs:27-38; rust/lance-encoding/src/compression.rs:554-585)
2. A structural field encoder extracts validity and accumulates rep/def alongside arrays. Queue threshold/drain returns first row plus summed top-level rows; encoder moves both groups into do_flush. Complete do_flush orchestration remains pending. (rust/lance-encoding/src/utils/accumulation.rs:37-105; rust/lance-encoding/src/encodings/logical/primitive.rs:7976-8007)
3. When a selected block compressor is CompressedBufferEncoder, fixed data becomes Flat inner metadata or variable data delegates to VariableEncoder; generic codec appends one compressed buffer and selected configuration wraps the inner descriptor. (rust/lance-encoding/src/encodings/physical/block.rs:628-664)
4. A General descriptor is resolved recursively to an inner decoder; the outer GeneralBlockDecompressor requires payload, decompresses to fresh memory and passes unchanged num_values inward. File scheduling/page persistence are separate, still incomplete traces. (rust/lance-encoding/src/compression.rs:1213-1231; rust/lance-encoding/src/encodings/physical/block.rs:433-460)

## General mini-block subtrace

This local trace does not complete the Dataset write/compact scenario. [Encoding module](../../L1-modules/rust-lance-encoding.md).

1. A reviewed policy helper leaves absent/none/fsst settings as inner-only and wraps other parsed schemes; binary selection similarly keeps FSST separate. Whole policy file remains pending. (rust/lance-encoding/src/compression.rs:511-525; rust/lance-encoding/src/compression.rs:672-697)
2. Inner compression owns the page; wrapper waits for its buffers/chunk metadata and checks first-buffer4096 threshold. (rust/lance-encoding/src/encodings/physical/general.rs:39-55)
3. Compress first-buffer chunks independently, rewrite their first sizes, and preserve other buffers. Reject aggregate non-savings and retain original descriptor; otherwise wrap selected configuration. (rust/lance-encoding/src/encodings/physical/general.rs:56-115)
4. Default strategy recursively resolves General inner metadata; outer decoder then expands one chunk's first buffer and invokes that inner decoder with unchanged count. Scheduling and page serialization are external to this slice. (rust/lance-encoding/src/compression.rs:1054-1075; rust/lance-encoding/src/encodings/physical/general.rs:131-145)

## Raw FSL and bitpacking codec subtraces

These local traces do not complete Dataset::write or compaction. For FSL per-value data, reviewed policy selects ValueEncoder; recursive nullability selects zero-copy simple flattening or copied validity/value row interleaving. The nested descriptor is parsed into dimensions/validity/leaf width; fixed-per-value decode either moves the leaf buffer or validates and unzips each row. Keep the nonnullable unequal-dimension arithmetic discrepancy in mind; it is not reproduced end-to-end. (rust/lance-encoding/src/compression.rs:705-735; rust/lance-encoding/src/encodings/physical/value.rs:323-473; rust/lance-encoding/src/encodings/physical/value.rs:536-806)

For integer bitpacking, statistics use OR per unsigned native chunk to obtain required widths. Selection compares compressed estimates with raw size, chooses Inline for <=1024 values or OOL above it in whole-block mode, and passes metadata to matching strategy arms on read. Inline validates a single chunk before unpacking; OOL uses external count and the strict residual-length convention. Missing statistics, custom direct codec use and malformed buffers have different failure boundaries from normal strategy-selected input. (rust/lance-encoding/src/statistics.rs:353-406; rust/lance-encoding/src/compression.rs:333-451; rust/lance-encoding/src/compression.rs:979-1043; rust/lance-encoding/src/compression.rs:1159-1215; rust/lance-encoding/src/encodings/physical/bitpacking.rs:189-283; rust/lance-encoding/src/encodings/physical/bitpacking.rs:465-529)

## Variable and BSS codec subtraces

These traces stop at reviewed local interfaces and do not complete Dataset write/compaction. Variable mini selection validates width, reads stats, chooses raw or FSST, optionally wraps General compression, and records nested metadata. FSST first transforms strings, then raw binary partitions transformed offsets/data into chunks. Read strategy recursively reconstructs mini decoders; binary checks chunk offsets, FSST expands bytes and Arrow conversion later enforces complete variable-width type/offset/string validity. Per-value FSST uses a different default reconstruction that ignores the nested descriptor. (rust/lance-encoding/src/compression.rs:655-696; rust/lance-encoding/src/compression.rs:998-1055; rust/lance-encoding/src/compression.rs:1110-1128; rust/lance-encoding/src/encodings/physical/fsst.rs:147-168; rust/lance-encoding/src/encodings/physical/fsst.rs:317-386; rust/lance-encoding/src/data.rs:735-962)

For BSS, precomputed first64-row byte entropy feeds width/mode selection, but the policy needs explicit non-none compression too. The transform emits one concatenated buffer with per-chunk sizes; downstream framing must preserve these boundaries. Decode inverse operates on one supplied chunk and reconstructs raw fixed data with fresh statistics. No compression-ratio or throughput measurements were run. (rust/lance-encoding/src/statistics.rs:500-551; rust/lance-encoding/src/compression.rs:148-185; rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:109-324)

## Packed and statistics subtraces

Arrow conversion normally builds the payload and calls ComputeStat before nullable wrapping. Fixed stats include bit widths/runs/entropy; variable stats omit lazy cardinality until requested. Struct statistics require initialized children. Packed mini encoding reads struct DataSize for reservation; per-value encoding instead validates structure and materializes row bytes. Variable packing recursively compresses children, records child layout/codec, writes length-prefixed rows and chooses outer offset width. Decoder reconstructs field buffers before child decompression, preserving counts using placeholders for empty rows. These are local subtraces; Dataset write/compaction and full rep/def lifecycles remain incomplete. (rust/lance-encoding/src/data.rs:2020-2030; rust/lance-encoding/src/statistics.rs:73-137; rust/lance-encoding/src/statistics.rs:187-214; rust/lance-encoding/src/statistics.rs:579-594; rust/lance-encoding/src/encodings/physical/packed.rs:40-103; rust/lance-encoding/src/encodings/physical/packed.rs:298-417; rust/lance-encoding/src/encodings/physical/packed.rs:606-866)

## Compression policy subtrace

Production version strategy merges field parameters, tries ordered selectors and finalizes eligible general wrapping. V2.3 fixed mini order is explicit none, BSS, child-aware RLE, bitpacking, then raw; variable, packed and list cases follow. Shared per-value policy can fall back raw for small general requests. On read, the structural interface selects a default factory, which validates some descriptors and trusts others; RLE child construction rejects cyclic count dependence. This is the local encoding subtrace; complete Dataset scheduling/commit and structural encoder lifecycles remain pending. (rust/lance-file/src/versions/v2_3/compression.rs:31-99; rust/lance-encoding/src/compression.rs:588-724; rust/lance-encoding/src/compression.rs:799-840; rust/lance-encoding/src/compression.rs:988-1389)

## RLE local write/read trace

Selection statistics estimate candidate run widths; mini encoding then chooses bounded prefixes, emits raw runs, constructs child alternatives and chooses a compatible pair. Structural framing consumes chunk sizes/logs. On read, a count-independent child establishes run count for a packed peer; eager expansion allocates logical output, while u16 level decoding can retain strict RleRuns and pass them to the primitive lazy retention planner. Whole-block writing bypasses mini chunking/child selection and writes the size header directly. The complete structural scheduler/encoder and Dataset path remain pending. (rust/lance-encoding/src/encodings/physical/rle.rs:142-328; rust/lance-encoding/src/encodings/physical/rle.rs:385-634; rust/lance-encoding/src/encodings/physical/rle.rs:727-1151; rust/lance-encoding/src/encodings/physical/rle.rs:1471-1632; rust/lance-encoding/src/encodings/physical/rle.rs:1921-1944; rust/lance-encoding/src/encodings/logical/primitive.rs:1302-1380)

## Arrow array to physical block and back

The current structural primitive flush rebuilds empty dictionary chunks, calls DataBlock::validate_arrays, counts actual values and starts repdef/page planning. Public from_arrays itself assumes that validation has occurred: it collects logical nulls, normalizes physical buffers, recursively builds children, computes statistics and adds a nullable wrapper unless dictionary nulls were moved into items. Codec transformations operate on these blocks; final into_arrow reconstructs a requested Arrow type with mandatory checks, including nested variable offsets/UTF-8. The full page planner and Dataset path remain pending. (rust/lance-encoding/src/encodings/logical/primitive.rs:7575-7600; rust/lance-encoding/src/data.rs:1795-2037; rust/lance-encoding/src/data.rs:728-956; rust/lance-encoding/src/data.rs:1185-1209)

## Structural utility trace

1. Gather per-batch outer-to-inner layers, filter child garbage when add_offsets signals it and preserve equal shape across builders. (rust/lance-encoding/src/repdef.rs:1251-1396)
2. Concatenate layers, serialize dense buffers and classify structural overhead. Primitive page planning consumes relative row/level/value ranges or retains an oversized-row marker; full fallback selection remains pending. (rust/lance-encoding/src/repdef.rs:958-1230; rust/lance-encoding/src/repdef.rs:1409-1589; rust/lance-encoding/src/encodings/logical/primitive.rs:7118-7162; rust/lance-encoding/src/encodings/logical/primitive.rs:7709-7729)
3. Slice by visible count with final slice_rest, or append full-zip words and act on the three distinct flags. (rust/lance-encoding/src/repdef.rs:510-590; rust/lance-encoding/src/repdef.rs:2143-2548)
4. Parse words with explicit byte advancement, then reconstruct leaf-to-root across page-specific unravelers. Sparse sibling compatibility and root exhaustion are separate from dense compaction. (rust/lance-encoding/src/repdef.rs:1615-2140; rust/lance-encoding/src/repdef.rs:2550-2840; rust/lance-encoding/src/encodings/logical/struct.rs:438-460)

## In-memory batch encoding trace

1. Check alignment, derive schema from the batch and force retention of original arrays. Build root encoders with a global column sequence and per-root context. (rust/lance-encoding/src/encoder.rs:331-358; rust/lance-encoding/src/encoder.rs:402-425)
2. Prepare all roots before data dispatch, then for each root create external reservations and fresh rep/def; call maybe_encode and flush. (rust/lance-encoding/src/encoder.rs:426-442)
3. Append external payloads, await page tasks in order and collect pages by column ID. Await finish only after all tasks for the root finish, append its external/column payloads and final pages, then construct ColumnInfo in finish-result order. No padding is inserted. (rust/lance-encoding/src/encoder.rs:443-488)
4. Freeze bytes, collect every allocated mapping index and return the caller-supplied schema. This is not the complete Dataset::write path. The real writer's reviewed context separately preflights fields, writes external buffers via do_write_buffer and collects tasks into FuturesOrdered. (rust/lance-encoding/src/encoder.rs:489-501; rust/lance-file/src/versions/v2_0/writer.rs:453-505)

## Schedule and decode trace

1. Count requested rows; zero returns empty. For nonzero input, trim ranges, classify first column, select structural CPU mode and create channel/stream. Validate/coalesce indices. (rust/lance-encoding/src/decoder.rs:2202-2262; rust/lance-encoding/src/decoder.rs:2466-2507; rust/lance-encoding/src/decoder.rs:2558-2589)
2. Build root scheduler with original field IDs, requested-range initialization, empty convenience file buffers and supplied cache/config. Await initialization before choosing inline or spawned range scheduling. (rust/lance-encoding/src/decoder.rs:1211-1285; rust/lance-encoding/src/decoder.rs:2508-2542)
3. Schedule row-major scan lines, flush aggregated I/O and send cumulative messages. Receiver drop stops channel scheduling; errors are emitted once. (rust/lance-encoding/src/decoder.rs:1300-1539)
4. Stream selects row count, loads/accepts pages, drains a CPU task and advances counters. Array uses i32 budget; structural byte feedback influences later task sizes. Consumer polling/readahead controls when task futures execute. (rust/lance-encoding/src/decoder.rs:1636-1734; rust/lance-encoding/src/decoder.rs:2089-2199)
5. Structural tasks check rep/def exhaustion, root becomes RecordBatch, and reported payload size supplies feedback/diagnostics. On stream EOF the spawned scheduler join is awaited; drop aborts its handle and releases retained I/O. This is not a complete Dataset::scan path until Dataset/execution modules are reviewed. (rust/lance-encoding/src/decoder.rs:2322-2353; rust/lance-encoding/src/decoder.rs:2577-2589; rust/lance-encoding/src/decoder.rs:3221-3262)

## Constant page selection and dictionary validity trace

1. Current constant writer requires Dense input with values, declines all-null and empty Struct, detects scalar and serializes page plus levels. (rust/lance-encoding/src/encodings/logical/primitive.rs:7929-7974; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:30-77)
2. Reader identifies scalar-present constant, constructs layout, requests required scalar/level buffers, restores three optional slots, decodes cached scalar/levels and explicitly loads cache into scheduler. (rust/lance-encoding/src/encodings/logical/primitive.rs:131-195; rust/lance-encoding/src/encodings/logical/primitive.rs:4543-4572; rust/lance-encoding/src/encodings/logical/primitive/constant.rs:129-280)
3. Scheduling needs no new I/O. Forward range drain parses/skips top-level rows and collects selected level spans. CPU task copies levels, repeats scalar and produces DataBlock plus RepDefUnraveler; parent reconstructs hierarchy. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:282-492)
4. For Arrow dictionary input, parent normalizes null dictionary values, repairs invalid hidden null-key slots, then extracts validity; empty dictionaries retain validity. Opportunistic dictionary compression later receives a caller budget and can return None for fallback. These are reviewed local steps, not a complete Dataset write path. (rust/lance-encoding/src/encodings/logical/primitive.rs:7410-7457; rust/lance-encoding/src/encodings/logical/primitive.rs:7650-7688; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-170)

## Original Blob encode/read subtrace

1. Version strategy selects binary Blob factory and reserves a column. Encoder serializes levels, flushes before interpretation changes, collects same-file payload buffers and schedules packed position/size descriptors. Futures add BlobLayout metadata. (rust/lance-encoding/src/encoder/structural.rs:133-147; rust/lance-encoding/src/encodings/logical/blob.rs:43-227)
2. Parent read dispatch chooses Struct description or binary payload view. Payload initialization loads every descriptor through one inner task and returns cached UInt64 positions/sizes; explicit try_load attaches them. Descriptor view delegates initialization and selected-range scheduling. (rust/lance-encoding/src/encodings/logical/primitive.rs:4583-4611; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:70-109; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:293-361)
3. Payload requests skip zero sizes, preserve empty placeholders, split after reaching32MiB and map replies only to missing valid bytes. Drain CPU copies values into contiguous binary storage with reconstructed repdef. Descriptor CPU returns original Struct data plus reconstructed repdef without fetching payload. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:151-214; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:262-290; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:363-552)
4. For Blob v2, use prepared-record conversion and ordinary descriptor encoding instead. Packed/dedicated file creation and URI resolution are outside these helpers; this is not a full Dataset Blob lifecycle. (rust/lance-encoding/src/encodings/logical/blob.rs:255-437)

## Nested FSL/Map encode-decode subtrace

1. Core schema conversion and exact version factories validate shape. FSL immediate Struct child or Map entries child is recursively encoded; no wrapper column is reserved. (rust/lance-core/src/datatypes.rs:296-305; rust/lance-core/src/datatypes/field.rs:1222-1257; rust/lance-encoding/src/encoder/structural.rs:189-258)
2. FSL adds dimension/validity and clears variable descendant garbage under null fixed slots; Map adds normalized offset/validity levels and filters/trim entries. Child encoding consumes resulting arrays and levels. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:48-91; rust/lance-encoding/src/encodings/logical/map.rs:43-73)
3. FSL scheduler scales ranges and divides scheduled row counts; Map forwards top-row coordinates. accept_page goes directly to children. FSL drain multiplies count; Map drain keeps it. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:127-253; rust/lance-encoding/src/encodings/logical/map.rs:102-173)
4. CPU tasks consume child result, unravel outer structure and invoke Arrow constructors, returning remaining rep/def and child data_size. Full Struct/list/primitive scheduling and Dataset lifecycle remain pending beyond these local subtraces. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:278-304; rust/lance-encoding/src/encodings/logical/map.rs:192-237)
