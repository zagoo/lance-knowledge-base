> Historical pre-V2.1 cross-layer notes. Not current scope, progress or acceptance criteria. Tests/binaries are excluded; retained production details are canonical in frozen L2/current contracts.

> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

# Pitfalls and unresolved discrepancies

[Orientation](../../L0-orientation.md) · [Contracts](../../L3-symbols/behavior-contracts.md) · [Cookbook](../../L4-crosscutting/cookbook.md)

Schema observations below distinguish contracts from runtime enforcement. The later core-utility section records executable control-flow observations and explicitly labels untested failure inferences.

- Wire presence is data: absent covering projection differs from an empty projection; absent seed configuration differs from creation defaults; absent code-tokenizer optional settings delegate to tokenizer defaults. (protos/ann.proto:28-41; protos/index_old.proto:29-45; protos/index_old.proto:65-74)
- A protobuf message name is not proof it is emitted today. Fragment lineage comments say current writers use inline data while also declaring gated hidden-column arms. Verify actual writer support. (protos/fragment_metadata.proto:34-81)
- Do not restore removed external lineage arms: the schema reserves their old tags/names and says no writer emitted them. ExternalFile still exists for a different use, fragment-reuse index details. (protos/fragment_metadata.proto:74-81; protos/fragment_metadata.proto:307-315)
- Overlay NULL versus absence, deletion precedence, retry restamping, and index build version comparisons are distinct correctness rules. (protos/fragment_metadata.proto:185-248)
- Fragment-tree remove-file means all matches; replace-file means first match and retains column/version metadata. Similar-looking action handlers cannot share semantics blindly. (protos/fragment_metadata.proto:428-455)
- Row-ID schema comments say MSB-first, but implementation and byte-exact fixture are LSB-first. Packed16/32/64-bit integers are LE. Treat this as a comment/code discrepancy, with historical compatibility still unverified. (protos/rowids.proto:45-104; rust/lance-table/src/rowids/bitmap.rs:67-77; rust/lance-table/src/rowids/serde.rs:174-230; rust/lance-table/src/rowids/serde.rs:436-451)
- RowDatasetVersionRun.span is a U64Segment despite a comment describing a count of consecutive rows. Its concrete semantics remain an implementation question. The U64Segment closing comment also uses the stale name RowIdSegment. (protos/rowids.proto:74-74; protos/rowids.proto:114-120)
- index_old.proto abbreviates the other package as lance.index, while index.proto actually declares lance.index.pb. Type identity must use the declaration. (protos/index_old.proto:8-13; protos/index.proto:6-6)
- IVF.centroids is described as deprecated, but the protobuf deprecated option is itself commented out. Do not assume generated code has a deprecation attribute. (protos/index.proto:59-63)
- A TODO about Lance child-plan codecs may be stale; it is not sufficient evidence to claim current codecs are missing. (protos/filtered_read.proto:108-115)
- Experimental MinHash signature procedure version and index file version are separate. Equal file versions do not establish comparable signatures. (protos/index.proto:260-310)
- Old list encoding's null formula can produce an offset equal to null_offset_adjustment, while the comment says greater-than identifies null. Its range notation also does not obviously match Rust's half-open syntax. Resolve both with decoder logic. (protos/encodings_v2_0.proto:99-149)
- New OutOfLineBitpacking prose says fixed compressed width is stored in the message, but the direct fields are original width and a nested values encoding. Do not invent a missing scalar tag. (protos/encodings_v2_1.proto:459-478)
- Flat/Variable are called transparent/uncompressed in prose while carrying optional buffer compression, which elsewhere makes parent encodings opaque. Interpret transparency conditionally and check code. (protos/encodings_v2_1.proto:385-445)
- The transaction rewrite comment says only UUID is serialized, yet the declaration also includes details, version and files. Its Update heading says no inserted rows, yet inserted_rows explicitly serves merge-insert INSERT tracking. (protos/transaction.proto:113-128; protos/transaction.proto:273-305)
- Bloom sizing defaults in comments are 8192 and 0.00057, but bare protobuf numeric fields have zero wire defaults. These comments do not prove a decoder substitutes those values. (protos/transaction.proto:231-249; protos/AGENTS.md:19-19)
- Table's listed feature bits omit the separately documented 2048 lineage bit. Neither that list nor a versioned schema filename proves the complete accepted feature set. (protos/table.proto:122-158; protos/fragment_metadata.proto:43-51)
- Covering metadata can legally outlive stored covering payload; verify the segment schema and fall back to a base take. (protos/table.proto:380-386)
- MemWAL payload-size estimates omit reader array overhead and encoded key expansion. Missing size/progress metadata is unknown, not zero or fully caught up. (protos/table.proto:584-609; protos/table.proto:628-633; protos/table.proto:716-720)

## Core utilities

- System scan fields are nullable UInt64 while persisted hidden lineage has a separate non-null contract. The root comment saying system fields are virtual must not erase the internal hidden-lineage writer facility. (rust/lance-core/src/lib.rs:35-98; protos/fragment_metadata.proto:288-305)
- RowAddress::address_range increments a u32 fragment without guarding its maximum. Constructors accept tombstones. Validate a caller's domain before assuming every wrapped address has a representable successor. (rust/lance-core/src/utils/address.rs:26-79)
- SIMD tier is dispatch policy, not a complete hardware capability list. Sse is a variant but not selected; Windows/Android aarch64 helpers return false, and raw features are empty off x86. (rust/lance-core/src/utils/cpu.rs:158-304)
- CPU sizing and IO reservation are separate LazyLocks. Environment changes after their initialization do not reset them. Malformed numeric values panic; non-Unicode values follow missing-env defaults. (rust/lance-core/src/utils/tokio.rs:12-76)
- A CPU closure must not wait for work using the same bounded pool. Single-worker configurations make nested waits especially risky. The ~100 microsecond advice is a source comment, not a measured threshold. (rust/lance-core/src/utils/tokio.rs:135-179)
- spawn_cpu documentation mentions a oneshot result round trip, but implementation returns a mapped JoinHandle to preserve panic payloads. Preserve actual behavior when revising callers. (rust/lance-core/src/utils/tokio.rs:146-147; rust/lance-core/src/utils/tokio.rs:180-208)
- Pool initialization sets its election flag before fallible/panicking runtime creation and has no reset guard. If an initialization panic is caught, later callers can remain in the yield loop. This is an untested source-derived failure path, not a reproduced issue. (rust/lance-core/src/utils/tokio.rs:78-118)
- SharedStream accepts Bounded(0), then waits for a permit before checking peer liveness. Dropping one side does not supply a permit to this zero-capacity case. Nonzero bounded sharing also requires consumers to progress together. (rust/lance-core/src/utils/futures.rs:47-80; rust/lance-core/src/utils/futures.rs:155-224; rust/lance-core/src/utils/futures.rs:254-264)
- Unbounded replay can retain all cloned items; counters are u32 although VecDeque length is usize. Underlying poll panics lose the taken inner stream; clone panics can poison the mutex after state mutation. No unwind recovery is provided here. (rust/lance-core/src/utils/futures.rs:28-38; rust/lance-core/src/utils/futures.rs:184-244)
- FinallyStream is EOF cleanup; OnDropStream is destruction cleanup. Early cancellation represented by dropping the wrapper only invokes the latter's callback. Neither callback is async or catches panics. (rust/lance-core/src/utils/futures.rs:277-370)
- The stress-sharing test asserts order of received items but not the final received count. The repeated-waker test asserts Pending, while the later FlagWaker test actually checks a wake. Do not infer stronger coverage from test names. (rust/lance-core/src/utils/futures.rs:442-453; rust/lance-core/src/utils/futures.rs:481-511; rust/lance-core/src/utils/futures.rs:622-663)
- Strict boolean-token parsing returns None for unknown input; the env helper instead maps any readable unknown value to false. Whitespace is trimmed only by the env helper. Checked assume macros must remain assertions in release. (rust/lance-core/src/utils/parse.rs:5-43; rust/lance-core/src/utils/assume.rs:4-28)

## Error and diagnostic boundaries

- Unknown commit status is not definite missing data. Its immediate Wrapped typed source forces is_not_found=false, even when the source is NotFound. Its version accessor and table-state-check message matter independently of error text. (rust/lance-core/src/error.rs:94-127; rust/lance-core/src/error.rs:601-615; rust/lance-core/src/error.rs:748-761)
- DatasetNotFound and IndexNotFound do not make is_not_found true. Plain std IO NotFound kind is boxed as IO, and the recursive helper checks typed store/Lance errors, not that IO kind or message. (rust/lance-core/src/error.rs:601-615; rust/lance-core/src/error.rs:813-822; rust/lance-core/src/error.rs:866-892)
- Direct typed accessors do not recurse through generic wrappers. DataFusion Shared with multiple Arc owners preserves source discoverability but may change direct classification compared with sole ownership. (rust/lance-core/src/error.rs:541-565; rust/lance-core/src/error.rs:753-810; rust/lance-core/src/error.rs:1013-1028)
- Arrow conversion is not universally lossless: Schema becomes Arrow SchemaError then Lance Arrow; borrowed Arrow always stringifies. Direct parser errors become IO, while DataFusion SQL wrapper becomes InvalidInput. (rust/lance-core/src/error.rs:843-864; rust/lance-core/src/error.rs:944-971; rust/lance-core/src/error.rs:1002-1007)
- CloneableError preserves selected signals, not arbitrary typed sources. Original Location/backtrace may be replaced by newly generated diagnostic data. External becomes Cloned(text), so external_source/into_external no longer recover the original. (rust/lance-core/src/error.rs:1058-1138)
- Error source recursion has no cycle guard. A user error with a pathological cyclic source chain can recurse indefinitely; this is an untested source-derived edge case. (rust/lance-core/src/error.rs:813-822)
- The backtrace capture test checks RUST_BACKTRACE readability rather than equality to 1, despite its comment. Feature-disabled zero-sized trace fields do not imply the entire Error is zero-sized. (rust/lance-core/src/error.rs:33-53; rust/lance-core/src/error.rs:1704-1731)
- Missing-field output lists ten candidates but computes edit distance against all candidates. Two DP rows are O(n), yet char collections make total auxiliary memory O(m+n); the second string determines row width. Unicode scalars are not grapheme clusters. The short-input test comment does not prohibit an exact one-character match. (rust/lance-core/src/error.rs:67-88; rust/lance-core/src/levenshtein.rs:17-89; rust/lance-core/src/levenshtein.rs:111-133)

## Datatype and field pitfalls

- Do not infer that is_blob tests a truthy metadata value: key presence suffices. Packed-struct metadata uses truthy parsing but does not check that the type is Struct. V2 descriptors can remain recognizable after losing extension metadata. (rust/lance-core/src/datatypes/field.rs:548-567; rust/lance-core/src/datatypes/field.rs:623-658; rust/lance-core/src/datatypes/field.rs:1153-1161)
- Do not substitute derived equality for compare_with_options, or reverse actual/expected in OneWay checks. Dictionary metadata equality itself depends on whether values are loaded. (rust/lance-core/src/datatypes/field.rs:134-161; rust/lance-core/src/datatypes/field.rs:411-440; rust/lance-core/src/datatypes.rs:579-593)
- Reference-order merge walks current child heads; it does not sort arbitrary inputs. Strict intersection can return success after dropping child errors. Equal-length fixed-size-list merge does not compare element types. These local behaviors require caller-level investigation before any proposed fix. (rust/lance-core/src/datatypes/field.rs:214-272; rust/lance-core/src/datatypes/field.rs:959-984; rust/lance-core/src/datatypes/field.rs:1048-1085)
- field_by_id searches descendants only. set_id treats every negative id as unassigned and requires a collision-safe seed from its caller; reset_id leaves parent IDs. Blob descriptor children may intentionally remain -1 under atomic projection. (rust/lance-core/src/datatypes/field.rs:1087-1151; rust/lance-core/src/datatypes/field.rs:2182-2220)
- Arrow map conversion checks at least two entries children, not exactly two; invalid position metadata silently falls back/drops locally. These are actual boundary behaviors despite stronger documentation, with higher-level validation still pending review. (rust/lance-core/src/datatypes/field.rs:37-56; rust/lance-core/src/datatypes/field.rs:1227-1270)

## Schema and path pitfalls

- Schema equality ignores top-level metadata. Configurable comparison/explanation can disagree on malformed duplicate-name inputs because slow comparison maps the last occurrence and explanation maps the first. Missing-name diagnostic order comes from HashSet iteration. (rust/lance-core/src/datatypes/schema.rs:874-878; rust/lance-core/src/datatypes/schema.rs:930-1076)
- Schema::merge does not actually assign the new IDs its summary prose anticipates; tests call set_field_id afterward. extend leaves appended fields in place on duplicate-name error. validate and verify_primary_key are distinct operations. (rust/lance-core/src/datatypes/schema.rs:711-766; rust/lance-core/src/datatypes/schema.rs:835-905; rust/lance-core/src/datatypes/schema.rs:2370-2413)
- Resolver doc examples using double quotes do not match its backtick-only parser. field_paths is unescaped diagnostic text, while field_path_minimal is intended for valid segment roundtrips. Empty formatter inputs and SQL reserved words need separate caller consideration. (rust/lance-core/src/datatypes/schema.rs:224-257; rust/lance-core/src/datatypes/schema.rs:417-436; rust/lance-core/src/datatypes/schema.rs:1567-1758)
- Primary-key ordering casts positive u32 positions to i32; structural validation does not check ordering position ranges or uniqueness. Primitive-element FixedSizeList can be a leaf and has no explicit primary-key rejection arm. (rust/lance-core/src/datatypes/schema.rs:136-158; rust/lance-core/src/datatypes/schema.rs:835-871; rust/lance-core/src/datatypes/field.rs:1163-1168)
## Core containers, memory and small utilities

- A list can have zero values while is_empty returns false because it checks LinkedList blocks. FromIterator of an empty sequence creates a block too. Its equality treats empty as equal to any list, and both iterator hints stop reflecting remaining values after the first yield. Treat these as source-derived edge findings; runtime impact is unverified. (rust/lance-core/src/container/list.rs:33-41; rust/lance-core/src/container/list.rs:101-108; rust/lance-core/src/container/list.rs:144-242)
- DeepSizeOf is approximate: lock poisoning hides children; hash/B-tree overhead uses formulas; Arc/Bytes/Arrow dedup depends on pointer identity; separate top-level calls have separate Contexts. Do not use these values as exact allocator measurements without additional instrumentation. (rust/lance-core/src/deepsize.rs:38-44; rust/lance-core/src/deepsize.rs:89-98; rust/lance-core/src/deepsize.rs:130-145; rust/lance-core/src/deepsize.rs:175-299)
- is_pwr_two(0) is not safely false; padding helpers only debug-assert alignment, and log_2_ceil is bit width. Do not replace it with mathematical ceiling based on its name. (rust/lance-core/src/utils/bit.rs:15-110)
- Backoff builders accept negative jitter and inconsistent min/max, then use arithmetic/RNG/clamp paths that can panic. Its attempt increment is ordinary arithmetic; only SlotBackoff saturates the counter. No sleep is performed by either generator. (rust/lance-core/src/utils/backoff.rs:39-78; rust/lance-core/src/utils/backoff.rs:139-160)
- TempObjFile and TempStdPath reserve a unique parent and unopened leaf, whereas TempFile owns a NamedTempFile. Keep the wrapper alive; cloning a path or String does not retain the resource. Windows slash replacement is a temporary-path workaround, not URL encoding. (rust/lance-core/src/utils/tempfile.rs:4-15; rust/lance-core/src/utils/tempfile.rs:55-89; rust/lance-core/src/utils/tempfile.rs:125-172; rust/lance-core/src/utils/tempfile.rs:197-343)
## Deletion vectors and single-rewrite mapping

- Set range-cardinality loops over every candidate offset, so small deletion cardinality does not imply cheap OffsetMapper queries at large physical offsets. (rust/lance-core/src/utils/deletion.rs:63-69; rust/lance-core/src/utils/deletion.rs:155-181)
- Empty variants have different equality and predicate outcomes. Exact-size and unknown-size streams at 5000 can produce different variants, and Extend does not restore old state after an unwind past mem::take. (rust/lance-core/src/utils/deletion.rs:104-124; rust/lance-core/src/utils/deletion.rs:194-251)
- MappingReader's row_id names refer to physical addresses. Preserve the difference between a deleted in-domain row and invalid input; a batch failure returns no partial Vec. (rust/lance-core/src/utils/fragment_reuse.rs:14-33; rust/lance-core/src/utils/fragment_reuse.rs:47-73)
- The adapter test uses the remap implementation as its expected-result oracle. Passing that test alone would not establish remap rank/layout correctness. (rust/lance-core/src/utils/fragment_reuse.rs:107-129)
## Ordered and stable-partition row mapping

- Do not sort fragment IDs to normalize a RowAddrRemap: caller old/new order determines exact new row identity. The insertion-order test checks only fragment sets/proofs, not equivalent mappings. (rust/lance-core/src/utils/row_addr_remap.rs:391-485; rust/lance-core/src/utils/row_addr_remap.rs:1202-1230)
- Compact metadata is not all of compact memory; sparse/dense rank payloads scale with retained count/universe. A four-times-smaller Roaring heuristic is a selection policy, not a benchmark guarantee. (rust/lance-core/src/utils/row_addr_remap.rs:195-287)
- Fully deleted proofs are conservative. Direct partial maps with only None entries still cannot prove an entire fragment deleted; chained affected sets may contain intermediate fragments. (rust/lance-core/src/utils/row_addr_remap.rs:158-163; rust/lance-core/src/utils/row_addr_remap.rs:770-787; rust/lance-core/src/utils/row_addr_remap.rs:1041-1060)
- Stable partition requires relative source order within every label. Parallel output arrival order is insufficient unless restored to that order. (rust/lance-core/src/utils/stable_partition.rs:18-32)
- decode success is not semantic matrix validity. validate is separate; accessors and point translation otherwise assume valid count arithmetic. Validity buffer length and label/count correspondence are caller responsibilities. (rust/lance-core/src/utils/stable_partition.rs:185-218; rust/lance-core/src/utils/stable_partition.rs:237-290; rust/lance-core/src/utils/stable_partition.rs:387-444)
- Builder checks per-destination overflow, but SweepTranslator does not check increment overflow or remaining input length. An empty matrix still permits a start0 sweep. (rust/lance-core/src/utils/stable_partition.rs:348-371; rust/lance-core/src/utils/stable_partition.rs:453-482)
## AIMD control and object-store test instrumentation

- An AIMD rate read cannot close a window; the next recorded outcome does so, and the new outcome belongs to the next window. The strict > threshold rule differs from one test comment's >= wording. (rust/lance-core/src/utils/aimd.rs:238-290; rust/lance-core/src/utils/aimd.rs:595-621)
- Finite config validation does not guarantee unbounded subsequent rate arithmetic stays finite or counts cannot overflow. Mutex poison can also panic during Debug because it reads current_rate. (rust/lance-core/src/utils/aimd.rs:102-123; rust/lance-core/src/utils/aimd.rs:213-289)
- Proxy callbacks run under a synchronous mutex in unspecified map order. Recursive policy mutation can deadlock; listing transform errors panic and can poison the mutex, while head transforms return errors. (rust/lance-core/src/utils/testing.rs:105-120; rust/lance-core/src/utils/testing.rs:186-194; rust/lance-core/src/utils/testing.rs:221-235)
- list_with_delimiter bypasses proxy policies; multipart's returned handle is unwrapped; copy/rename expose only the source to before callbacks. Counted list attempts need not have completed or yielded any object. (rust/lance-core/src/utils/testing.rs:177-184; rust/lance-core/src/utils/testing.rs:238-250; rust/lance-core/src/utils/testing.rs:287-295)
## Generic split-block Bloom filters

- Raw Sbbf::new accepts zero bytes; querying/inserting then panics. Public sizing constructors always allocate at least32bytes, so their behavior does not establish raw-parser safety. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:243-317)
- Explicit builder size ignores simultaneous ndv/fpp, including invalid fpp; exponent clamping means requested probability is not an unconditional guarantee. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:271-287; rust/lance-core/src/utils/bloomfilter/sbbf.rs:462-473)
- Float signed zero/NaN payloads and cross-type raw bytes need caller-level canonicalization rules; this generic helper supplies none. Changing seed/salts/endian rules changes persisted membership. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92; rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:419-425)
- Intersection uses any common bit, while element membership requires all eight lane bits. Raw byte intersection validates only equal lengths and may allocate a full filter copy through might_intersect_bytes. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:143-151; rust/lance-core/src/utils/bloomfilter/sbbf.rs:354-416)

## Cache key/configuration boundaries

Do not interpret approximate count0 as proof of emptiness; default means unavailable. Do not rely on prefix invalidation or enumerate logical keys from opaque digests. Do not assume URI options and fluent options share duplicate policy, or that plus becomes space. Avoid leaking full supplied URI errors into public logs without considering embedded credentials. These are direct local interface/parser consequences; no application logging path has been reviewed yet. (rust/lance-core/src/cache/backend.rs:20-31; rust/lance-core/src/cache/backend.rs:104-118; rust/lance-core/src/cache/registry.rs:45-49; rust/lance-core/src/cache/backend_uri.rs:70-104; rust/lance-core/src/cache/backend_uri.rs:137-159)

## Cache codec limits

Never treat has_cache_envelope=true as complete validation, deserialize's never-fails prose as panic containment, or Ok body decode as proof all bytes were consumed. Treat writer errors as potentially partial output. Public reader new accepts an invalid offset that body() can later panic on; header reads use checked bounds. Whole-entry streaming still buffers the protobuf header, and zero-copy buffers do not imply no message/vector allocation. (rust/lance-core/src/cache/codec.rs:62-70; rust/lance-core/src/cache/codec.rs:120-138; rust/lance-core/src/cache/codec.rs:261-268; rust/lance-core/src/cache/codec.rs:317-369; rust/lance-core/src/cache/entry_io.rs:62-70; rust/lance-core/src/cache/entry_io.rs:131-137; rust/lance-core/src/cache/entry_io.rs:154-201)

## Concrete backend pitfalls

Capacity is declared eviction weight, not a process heap budget. Moka rounds units aboveu32::MAX and its approximate counters do not flush maintenance. Quick Single still enforces hot-admission limits; an ignored guard insertion result means a returned loaded value may not be retained. A high hit flag can mean the caller waited for another loader, not that the value existed at invocation. Both memory backends ignore codecs, so adding a codec does not itself persist anything. (rust/lance-core/src/cache/moka.rs:34-47; rust/lance-core/src/cache/moka.rs:108-154; rust/lance-core/src/cache/moka.rs:176-184; rust/lance-core/src/cache/quick.rs:101-106; rust/lance-core/src/cache/quick.rs:157-190)

## Typed cache integration pitfalls

Prefix handles isolate keys, not metrics/capacity/clear. Rewrapping one backend can isolate counters while still colliding at the same root keys. Loader errors do not increment miss counters; was_cached=true includes coalescing. Sized/unsized keys have no extra discriminator, and wrong types are not automatically evicted. Weak insert true is not an admission acknowledgment. Deep size excludes state/backend/allocator metadata and cannot establish leak freedom. (rust/lance-core/src/cache/mod.rs:273-358; rust/lance-core/src/cache/mod.rs:375-471; rust/lance-core/src/cache/mod.rs:509-563; rust/lance-core/src/cache/mod.rs:607-618)

Do not implement CacheCodecImpl by copying the ignored module example: its two method signatures and omitted constants disagree with the current trait. The test HashMapBackend likewise lacks concurrent deduplication and key-weight accounting, so it is only a fixture. (rust/lance-core/src/cache/mod.rs:15-29; rust/lance-core/src/cache/codec.rs:209-228; rust/lance-core/src/cache/mod.rs:937-996)

## Table entry-point pitfalls

- An empty/0-valued environment variable enables overlays or spilled lineage because only presence is tested; stable-ID FRI has no override. (rust/lance-table/src/feature_flags.rs:234-252)
- Flag derivation is not support checking, and failure can leave partial mutation. Only mixed8/tagged-FRI10 are validated as paired; covered7 can be normalized from one word. (rust/lance-table/src/feature_flags.rs:127-215; rust/lance-table/src/feature_flags.rs:353-378)
- A nonempty base-path map, even one entry, derives bit4; the name/comment does not imply a length>1 condition. (rust/lance-table/src/feature_flags.rs:178-182; rust/lance-table/src/feature_flags.rs:650-700)
- Public format types may come through reexports of private modules; the deprecated Index alias is retained. README still disclaims external crate use. (rust/lance-table/src/format.rs:7-37; rust/lance-table/README.md:3-6)
- ExactSize trusts size and does not clear it on early None; do not use it to validate iterator cardinality. (rust/lance-table/src/utils.rs:12-49)

## Wrapper interpretation pitfalls

- The row-ID memo shares an Arc with the Bytes handle, while payload backing storage may be a retained slice of a larger buffer. The visible-length deep-size estimate cannot establish retained heap bytes. (rust/lance-table/src/format/row_ids.rs:49-59; rust/lance-table/src/format/row_ids.rs:128-139; rust/lance-core/src/deepsize.rs:90-98)
- TryFrom<RowIdSequence> does not validate its bytes/column reference; its Result type does not imply an implemented error branch. (rust/lance-table/src/format/row_ids.rs:157-166)
- format::Transaction is publicly reexported despite crate-local doc wording, and From conversion does not serialize despite the write-boundary comment. (rust/lance-table/src/format.rs:30-30; rust/lance-table/src/format/transaction.rs:4-22; rust/lance-table/src/format/transaction.rs:71-82)

## Metadata caveats established by implementation

- replace_field_metadata errors on missing ID despite its no-op comment; set_timestamp accepts raw u128 despite DateTime wording. (rust/lance-table/src/format/manifest.rs:321-324; rust/lance-table/src/format/manifest.rs:369-389)
- Fragment num_rows subtracts without checking deletion<=physical; unknown counts feed zero into offsets, while summary counts only available values. Protobuf zero loses Some(0). (rust/lance-table/src/format/fragment.rs:573-586; rust/lance-table/src/format/fragment.rs:831-909; rust/lance-table/src/format/manifest.rs:117-128; rust/lance-table/src/format/manifest.rs:564-598)
- Manifest summary omits overlays from file count/size; max_field_id and shallow_clone include overlays through referenced_lance_files. Do not substitute summary for complete storage accounting. (rust/lance-table/src/format/manifest.rs:249-268; rust/lance-table/src/format/manifest.rs:466-485; rust/lance-table/src/format/manifest.rs:564-598)
- update_max_fragment_id panics if a fragment ID exceeds u32, and fragments_since cannot track rewritten/recycled IDs. Source constructors do not enforce the documented sorted fragment order or keep private offsets synchronized after public field replacement. (rust/lance-table/src/format/manifest.rs:52-88; rust/lance-table/src/format/manifest.rs:173-235; rust/lance-table/src/format/manifest.rs:421-540)
- BasePath DeepSizeOf doubles path children and adds an inline bool; detachment copies based on visible length rather than retained allocation. Neither value is a direct RSS measurement. (rust/lance-table/src/format/manifest.rs:391-419; rust/lance-table/src/format/manifest.rs:670-676)

## Metadata-specific traps

Do not treat IndexMetadata::files None as known-zero storage, total_size_bytes as deduplicated, keyed_fields as validation, or type_url classification as proof of index payload validity. Invalid chrono timestamps may panic during TryFrom despite its Result signature. Any memory is omitted from this type's heap estimate. (rust/lance-table/src/format/index.rs:96-179; rust/lance-table/src/format/index.rs:245-317)

Do not use live-row ordinals for overlay coverage or delete tombstoned positions from only one aligned list. Shared coverage lookup accepts an arbitrary field index, so a successful lookup alone proves neither field existence nor readability. (rust/lance-table/src/format/overlay.rs:4-34; rust/lance-table/src/format/overlay.rs:199-212; rust/lance-table/src/format/overlay.rs:252-275)

Key filter len is insertion count, persisted number_of_items is expected capacity, mixed filters intersect even when empty, and ExactSet compares hashes rather than original keys. Missing protobuf data silently becomes empty ExactSet; this is current behavior, not an endorsement for new format design. (rust/lance-table/src/format/key_existence.rs:89-148; rust/lance-table/src/format/key_existence.rs:175-212; rust/lance-table/src/format/key_existence.rs:246-279)

## Exact identity and stale-set traps

Do not serialize a caller selector directly as a manifest format string: stable/next are valid selector serde but rejected persisted identities. V2_0 metadata(2,0) and standard footer(0,3) intentionally differ; identity decoding is not a complete file-integrity check. (rust/lance-file/src/version.rs:109-127; rust/lance-file/src/version.rs:172-261; rust/lance-file/src/lib.rs:25-60)

IndexMetadata.index_version is not the build snapshot used by staleness; use dataset_version. Ancestor changes can invalidate child-field indices and child changes can invalidate ancestor-field indices. None coverage must remain conservative. The helper returns physical offsets including deleted rows and performs no query/value comparison; dropping those distinctions can leave stale index values visible. (rust/lance-table/src/format/overlay/staleness.rs:24-94; rust/lance-table/src/format/overlay/staleness.rs:113-158)

## Row-version and hole-run pitfalls

- A span's numeric values are not its concatenated sequence positions; overlapping coordinates are used in tests. (rust/lance-table/src/rowids/version.rs:272-299; rust/lance-table/src/rowids/version.rs:890-914)
- VersionsIter and cursor disagree for an empty run reached after a nonempty run. The counterexample is source-derived and unexecuted. (rust/lance-table/src/rowids/version.rs:147-165; rust/lance-table/src/rowids/version.rs:375-389)
- Partial refresh's name/test description does not imply constant-memory streaming: it holds one u64 per physical row plus runs and serialization buffers. Corrupt inline version metadata is silently defaulted. (rust/lance-table/src/rowids/version.rs:750-812)
- allow_incomplete affects too-few input only; trailing empty input still fails the final peek. (rust/lance-table/src/rowids/version.rs:597-609; rust/lance-table/src/rowids/version.rs:644-648)
- HoleRuns validates run bounds but not caller-supplied base arithmetic. A u64 exclusive endpoint may overflow even when its last desired value is representable. (rust/lance-table/src/rowids/runs.rs:192-215)

## Row-ID codec pitfalls

- General protobuf tolerance does not describe read_row_ids: its outer parser rejects unknown tags/wire types. Plain-range success bypasses validate_range, while fallback uses it. (rust/lance-table/src/rowids/serde.rs:19-30; rust/lance-table/src/rowids/serde.rs:346-426)
- Array min can differ from actual minimum for decoded noncanonical relative offsets. Empty Vec becomes U64, empty Range becomes U16; identical values need not imply structural equality. (rust/lance-table/src/rowids/encoded_array.rs:69-87; rust/lance-table/src/rowids/encoded_array.rs:193-238; rust/lance-table/src/rowids/serde.rs:174-214)
- Result-returning version metadata construction still reaches standalone Ranges panic. Sequence writer has the needed flattening path, but direct segment/version writer does not. (rust/lance-table/src/rowids/version.rs:463-469; rust/lance-table/src/rowids/version.rs:520-535; rust/lance-table/src/rowids/serde.rs:232-299)

## Segment pitfalls

- Sorted does not establish distinctness: constructor[0,0,2] can become Range0..3. This source-only example violates the documented distinct-input precondition. (rust/lance-table/src/rowids/segment.rs:16-19; rust/lance-table/src/rowids/segment.rs:115-121; rust/lance-table/src/rowids/segment.rs:144-209)
- An all-zero bitmap with bounds0..8 has len0 but rangeSome0..=7; bounds are not present extrema despite doc wording. (rust/lance-table/src/rowids/segment.rs:330-376)
- Equal mask cardinality clears all even for duplicate indices; partial masks also assume ordered unique in-bounds positions. (rust/lance-table/src/rowids/segment.rs:694-745)
- from_slice safely handles u64MAX by choosing an array, but range-backed with_new_high still uses val+1 unchecked. (rust/lance-table/src/rowids/segment.rs:196-235; rust/lance-table/src/rowids/segment.rs:520-580)
- Grouping decoded ranges and optimizing a bitmap use different admission rules; neither checks dataset opt-in here. (rust/lance-table/src/rowids/segment.rs:245-289; rust/lance-table/src/rowids/serde.rs:79-96)

## Sequence boundary hazards

- is_empty checks segment count, so deleting every row can leave len0/is_empty false; mask-all removes empty segments. Equality also compares representation. (rust/lance-table/src/rowids.rs:51-52; rust/lance-table/src/rowids.rs:267-277; rust/lance-table/src/rowids.rs:340-396; rust/lance-table/src/rowids.rs:1229-1231)
- Display writes its first up-to11 values without commas. Treat it as current diagnostic behavior, not a reliable sequence serialization. (rust/lance-table/src/rowids.rs:173-206)
- Plain-range mask end reconstruction uses OR after low32+1; singleton ID8589934591 gives end4294967296 and underflows ordinal subtraction. Empty Range0..0 also reaches a dependency insert_range that includes0. These deductions are unexecuted and need independent regressions. (rust/lance-table/src/rowids.rs:621-646; rust/lance-table/src/rowids.rs:865-905; rust/lance-select/src/mask.rs:545-588; rust/lance-select/src/mask.rs:801-810)
- Result-returning mask has no Err branch; select_row_ids does not fully validate reversed or excessive RangeFrom bounds, and reads index values without Arrow validity checks. (rust/lance-table/src/rowids.rs:367-396; rust/lance-table/src/rowids.rs:1055-1127)
- Rechunking an entire plain range still materializes/reselects its values, and a leftover empty segment can fail total-cardinality-equivalent input. (rust/lance-table/src/rowids.rs:988-1052; rust/lance-table/src/rowids/segment.rs:378-387)


## Transaction row-version pitfalls

- Cached creation sequences still use linear run lookup per row; source row IDs may be fully decoded before a bounding-range skip. Missing Column row preload fails even for a fragment later found unrelated. (rust/lance-table/src/transaction/row_version.rs:134-171; rust/lance-table/src/transaction/row_version.rs:173-205; rust/lance-table/src/rowids/version.rs:272-282)
- has_writer_placed_lineage does not include last-update Column and proves no provenance. Creation Column can bypass inline row-ID decoding; ordinary inline/inline creation is overwritten. (rust/lance-table/src/transaction/row_version.rs:73-79; rust/lance-table/src/transaction/row_version.rs:206-255)
- Unknown or zero physical count, malformed inline IDs and direct resolver calls without assigned IDs differ from successful manifest fixture behavior. Some invalid combinations panic through build_version_meta despite Result signatures; debug-only count assertions do not validate release inputs. (rust/lance-table/src/transaction/row_version.rs:258-295; rust/lance-table/src/rowids/version.rs:655-678)
- The pure-rewrite name overstates a count-only test when called after filling inserted IDs. Record caller ordering before changing index coverage; no complete index defect is established by this observation. (rust/lance-table/src/transaction/row_version.rs:300-330; rust/lance-table/src/transaction/manifest_build.rs:945-994)
- Tests named for caching/prefilter correctness assert values, not operation counts. A comment calls the out-of-range fragment1 while the actual fixture uses2. (rust/lance-table/src/transaction/row_version.rs:1218-1287; rust/lance-table/src/transaction/row_version.rs:1335-1392)



## Definition and fixture traps

- FragReuseUpdate is non_exhaustive; Operation/UpdateMode are exhaustive. PreparedIndices private fields restrict external construction but crate new performs no validation; TaggedRewriteAssembly public fields allow bypassing its limited u32 source check. (rust/lance-table/src/transaction/prepare.rs:26-73; rust/lance-table/src/transaction/operation.rs:37-39; rust/lance-table/src/transaction/operation.rs:250-261; rust/lance-table/src/transaction/operation.rs:309-360)
- Replacement edits skip deletions after clearing, so insert-then-delete of one key leaves the insertion. Incremental mode removes it. Entry equality is order-sensitive despite HashMap translators having unspecified iteration order. (rust/lance-table/src/transaction/update_map.rs:49-128)
- RewriteGroup duplicate-bearing equality can be asymmetric; UpdatedFragmentOffsets sizing omits container costs and RewrittenIndex sizing omits new_index_files. These source-level findings are not executed regressions. (rust/lance-table/src/transaction/operation.rs:270-277; rust/lance-table/src/transaction/operation.rs:374-397)
- tagged_entry divides by destination count, drops a remainder, materializes every moved row address and narrows lineage IDs unchecked. Empty destinations or invalid IDs are not robust fixture inputs. It generates dataset_version0/index_version1 metadata; callers must adapt it to the tested attempt. (rust/lance-table/src/transaction/test_support.rs:47-60; rust/lance-table/src/transaction/test_support.rs:127-199)



## Conflict helper interpretation

- Operation equality is not commit compatibility. Different kinds compare false even when the resolver can rebase them. Most vectors ignore order by membership, but Overwrite.initial_bases and UpdateMap entries remain ordered; overlay group order and inner overlay order differ. (rust/lance-table/src/transaction/conflicts.rs:18-203; rust/lance-table/src/transaction/conflicts.rs:774-777; rust/lance-table/src/transaction/conflicts.rs:863-864; rust/lance-table/src/transaction/operation.rs:31-35)
- Config key extraction ignores replace and includes every syntactic edit, even overwritten ones; implicit clears are invisible. Metadata categories use different presence/ID/key rules. No complete production conflict bug is asserted without full caller/global-check analysis. (rust/lance-table/src/transaction/conflicts.rs:869-989)
- Retry-identity module prose is broader than the inspected outcome implementation, which compares protobuf forms. Transient frag-reuse entries can make in-memory operations unequal while durable forms agree. (rust/lance-table/src/transaction/conflicts.rs:4-13; rust/lance-table/src/transaction/conflicts.rs:97-112; rust/lance/src/io/commit.rs:246-283)



## Validation wording versus enforced checks

- The modern schema helper ignores schema and overlays, so empty fragment files or nonempty arbitrary field IDs can pass locally. Append's all-fields comment does not describe modern enforcement. (rust/lance-table/src/transaction/validate.rs:44-46; rust/lance-table/src/transaction/validate.rs:120-174)
- Merge fragment docs say one-to-one, but extras are accepted and duplicate IDs collapse. Shared-field rewrite docs say every proposed fragment, while the proof visits only originals; fresh-ID remaps do check every proposed fragment. These are local discrepancies, not established end-to-end corruption cases without all callers. (rust/lance-table/src/transaction/validate.rs:202-279; rust/lance-table/src/transaction/validate.rs:329-389)
- The legacy-to-stable regression fixture explicitly constructs V1 metadata despite its stable name/comments. Its assertion establishes old-manifest bypass, not actual modern-file compatibility. (rust/lance-table/src/transaction/validate.rs:691-755)
- Base-file ordering changes count as physical rewrite; cache-size, overlay and deletion changes alone do not. Schema-binding rewrite proof uses a different base_id+path identity. Keep both predicates distinct. (rust/lance-table/src/transaction/validate.rs:176-200; rust/lance-table/src/transaction/validate.rs:360-389)



## Transaction codec edge cases

- Update unwraps malformed CompactedSsTable errors; UpdateMemWalState propagates the same converter. The public outer TryFrom Result does not guarantee panic-free malformed input. (rust/lance-table/src/transaction/proto.rs:239-242; rust/lance-table/src/transaction/proto.rs:383-390; rust/lance-table/src/system_index/mem_wal.rs:125-139)
- Empty Rewrite groups decode as one empty legacy group; the transient-entry test does not assert this shape. Unknown update modes silently become row rewrites. (rust/lance-table/src/transaction/proto.rs:151-184; rust/lance-table/src/transaction/proto.rs:244-248; rust/lance-table/src/transaction/proto.rs:814-840)
- Field10 map presence suppresses field9 even when every new value is empty bytes. Valid encoded empty bitmaps are retained on read but removed on write. (rust/lance-table/src/transaction/proto.rs:252-283; rust/lance-table/src/transaction/proto.rs:624-640)
- Overwrite/Merge schema metadata is ignored/empty, and Fields reconstruction also leaves Project schema-level metadata empty. Field-level metadata has its own converter contract; do not conflate both levels. (rust/lance-table/src/transaction/proto.rs:121-147; rust/lance-table/src/transaction/proto.rs:198-213; rust/lance-table/src/transaction/proto.rs:285-293; rust/lance-file/src/datatypes.rs:240-243; rust/lance-file/src/datatypes.rs:292-300)



## Index provenance and rewrite assumptions

- Unknown bitmap coverage is retained; a known empty definition can also remain. Tagged retention does not intersect away retired provenance and still filters invalid schema fields first. (rust/lance-table/src/transaction/index_maintenance.rs:517-625)
- The no-lineage wrapper directly prunes exact fields; direct withdraw_rewritten_coverage(None) conservatively withdraws retired IDs. Those call forms have different semantics. (rust/lance-table/src/transaction/index_maintenance.rs:155-179; rust/lance-table/src/transaction/index_maintenance.rs:259-348)
- Merge path comparison ignores base_id and file metadata differences. Overlay pruning compares exact raw field IDs, whereas tagged rewrite classification expands descendants. (rust/lance-table/src/transaction/index_maintenance.rs:185-217; rust/lance-table/src/transaction/index_maintenance.rs:425-515)
- Fragment replacement can panic for empty old lists or out-of-bounds contiguous candidates. Noncontiguous fallback can tolerate absent later old IDs. Earlier index/group changes survive later errors; caller ownership/retry safeguards remain to be established. (rust/lance-table/src/transaction/index_maintenance.rs:691-789)
- Destination walking allocates on every call; nested withdrawal loops repeat walks. No performance measurement has been run. (rust/lance-table/src/transaction/index_maintenance.rs:275-300; rust/lance-table/src/system_index/frag_reuse/lineage.rs:121-139)



## Gate reasons are narrower than lifecycle guarantees

MovesNoRows prose says no column rewrite, yet its match accepts Update/Merge/DataReplacement. Untagged can be returned on sticky-flag-only tables. Appended-transition and bare-uncovered rewrite acceptance precede migration rejection; empty inner old lists can satisfy the nonempty-outer-group gate. No assembly payload validation occurs here. These source-level distinctions must survive any refactor of branch order. (rust/lance-table/src/system_index/frag_reuse/gate.rs:21-224)



## Decoder and adapter boundaries

- Unsupported index version errors before envelope/IO, while unknown outer transition fields omit only that record and mark incomplete. Lookup absence in that partial graph is not proof no real consumer exists. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:134-155; rust/lance-table/src/system_index/frag_reuse/ledger.rs:196-291)
- decode_inline external None does not validate ExternalFile body/range; full decode does. Stable-partition reference validation does not open labels. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:139-168; rust/lance-table/src/system_index/frag_reuse/ledger.rs:430-440)
- Legacy batch/array adapters differ on input nulls and deletion output shape. Both rely on concrete UInt64; batch adds a two-column assertion. Source deductions require caller-specific runtime validation before reporting a production defect. (rust/lance-table/src/system_index/frag_reuse.rs:447-502)
- Public legacy details can drift from private compact remap after mutation; construction checks differ from unified ledger. Keep compatibility surfaces frozen. (rust/lance-table/src/system_index/frag_reuse.rs:318-389; AGENTS.md:13-18)



## MemWAL metadata traps

- Payload bytes exclude reader array overhead; absent measurement means unknown. Do not budget an unmeasured SSTable as zero, or interpret total primary-key bytes as bytes per row. (rust/lance-table/src/system_index/mem_wal.rs:36-54)
- Returning the maximum stored generation while accepting stale row mutations breaks the documented rows/progress pairing. Existing-marker comparison is strictly greater; all proposals validate before replacement. (rust/lance-table/src/system_index/mem_wal.rs:518-590)
- Opening details is synchronous metadata parsing, whereas the dataset's open path performs async cache/metadata work. The explicit type-url suffix check is followed by dependency Any::to_msg validation; it is not proof every suffix match is accepted. (rust/lance-table/src/system_index/mem_wal.rs:493-516; rust/lance/src/index.rs:3802-3832)
- ShardStatus unknown values become Active; next_version does ordinary+1. Neither helper proves safe future-state handling, gap-free allocation or actual writer fencing. (rust/lance-table/src/system_index/mem_wal.rs:194-266)



## Candidate-builder traps

- Comments saying publishes refer to returned metadata; actual write_manifest_file is downstream. Config disabling transaction file does not make candidate.transaction_file None. (rust/lance-table/src/transaction/manifest_build.rs:580-611; rust/lance-table/src/transaction/manifest_build.rs:1904-1919; rust/lance/src/io/commit.rs:1766-1782)
- Existing stable flags keep row-ID allocation active with default config, but RewriteRows index reuse still requires explicit config.use_stable_row_ids. Migration option and use_stable flag are independently branched. (rust/lance-table/src/transaction/manifest_build.rs:612-642; rust/lance-table/src/transaction/manifest_build.rs:720-740; rust/lance-table/src/transaction/manifest_build.rs:960-996)
- Update absent prior latest metadata skips partial stamping; DataOverlay initializes uncovered rows with baseline1. They must not be conflated. (rust/lance-table/src/transaction/manifest_build.rs:861-928; rust/lance-table/src/transaction/manifest_build.rs:1507-1540)
- UpdateBases compares optional names directly, so two unnamed bases conflict; explicit nonzero ID can overwrite a different existing ID if name/path checks pass. This is observed local behavior, not a reproduced end-to-end defect. (rust/lance-table/src/transaction/manifest_build.rs:1872-1903)
- Test names can exceed assertions: prepared gate test calls prepare_indices/build_manifest, external-history test removes Any instead of supplying ExternalFile, and never-lowered catchup is subject to committed cap. Read the fixtures before borrowing their claimed coverage. (rust/lance-table/src/transaction/manifest_build.rs:2900-2940; rust/lance-table/src/transaction/manifest_build.rs:3008-3047; rust/lance-table/src/transaction/manifest_build.rs:5066-5090)


## Metadata IO pitfalls

- A64KiB prefetch and chunked Buf avoid full concatenation but still accumulate the complete body; cross-chunk fields and sparse row-ID detachment may copy. Source throughput claims are not measurements from this KB run. (rust/lance-table/src/io/manifest.rs:46-127; rust/lance-io/src/utils.rs:47-159)
- Corrupt footer pointers are not fully guarded by the short-tail check. Known-size retry is neither a catch-all decode fallback nor generic retry for GET failures. (rust/lance-table/src/io/manifest.rs:52-128)
- Serialization is stateful: an index write can update the borrowed manifest before a later transaction/body write fails. Footer and close are caller work. (rust/lance-table/src/io/manifest.rs:177-230)
- Empty Set/Bitmap is not NoDeletions; path functions ignore base_id and local read does not verify num_deleted_rows. The row_id Arrow column is UInt32 physical offsets. (rust/lance-table/src/io/deletion.rs:25-216)


## Commit and listing pitfalls

- Module-level default-handler comments are stale: S3 routes to ConditionalPut, and local Windows differs from other platforms. COS rejects default writes. (rust/lance-table/src/io/commit.rs:12-19; rust/lance-table/src/io/commit.rs:1171-1263; rust/lance-table/src/io/commit.rs:1685-1715)
- Returned ManifestLocation may be only a guessed fallback path; ETag and external identity have different meanings. (rust/lance-table/src/io/commit.rs:232-264; rust/lance-table/src/io/commit.rs:1057-1102)
- ConditionalPut buffers the full manifest. Rename cleanup is narrower than its comment, and lease release failure can follow a landed write. (rust/lance-table/src/io/commit.rs:1484-1489; rust/lance-table/src/io/commit.rs:1566-1601; rust/lance-table/src/io/commit.rs:1636-1664)
- Hints are nonmonotonic, assume gap-free upward history and use a process-cached environment setting. A lexical V2 fast path skips later scheme validation. (rust/lance-table/src/io/commit.rs:321-571; rust/lance-table/src/io/commit.rs:594-618)


## External-store pitfalls

- ETag is neither a record incarnation nor content hash. Equivalent finalizer copies can change it; generic index updates clear it. (rust/lance-table/src/io/commit/external_manifest.rs:144-161; rust/lance-table/src/io/commit/external_manifest.rs:1677-1779)
- An identity-bearing known-size location can be returned without HEAD; generic location validation is stronger but also has an unchecked parent fallback. (rust/lance-table/src/io/commit/external_manifest.rs:568-622; rust/lance-table/src/io/commit/external_manifest.rs:1151-1162)
- CommitConflict can follow successful reservation or a failed copy of a selected winner. Retention preserves repairability; it does not prove the caller lost. (rust/lance-table/src/io/commit/external_manifest.rs:1123-1149; rust/lance-table/src/io/commit/external_manifest.rs:1780-1817; rust/lance-table/src/io/commit/external_manifest.rs:1934-2040)
- The 100 MiB part buffer is not a total-memory ceiling, and explicit abort-on-error does not handle cancellation. Exact 5 GiB dispatches to streaming rewrite. (rust/lance-table/src/io/commit/external_manifest.rs:384-558)
- Unique final objects and cancelled orphans share staging-shaped names; external records determine identified history. Raw object listing and valid manifest listing are different. (rust/lance-table/src/io/commit/external_manifest.rs:1049-1090; rust/lance-table/src/io/commit/external_manifest.rs:2324-2359; rust/lance-table/src/io/commit/external_manifest.rs:2438-2474)


## Coordinator and lookup pitfalls

- DynamoDB schema-cache hits are name-only and can skip validation for another same-named endpoint/account/table incarnation. Schema validation checks roles/names but not string/number types. (rust/lance-table/src/io/commit/dynamodb.rs:162-242)
- DynamoDB delete is one query plus sequential unconditional deletes; success is not proof all pages/concurrent rows were removed. (rust/lance-table/src/io/commit/dynamodb.rs:486-513)
- RowIdIndex's tombstone-return comment is stale. Actual lookup filters supplied deletions; physical sequence holes and tombstoned offsets have different address effects. (rust/lance-table/src/rowids/index.rs:29-36; rust/lance-table/src/rowids/index.rs:391-408; rust/lance-table/src/rowids/index.rs:1101-1231)
- get_many's O(F+N) wording excludes sorting/segment work and does not describe the probe-mode loop. Probe setup also scans arrays/bitmap bytes. (rust/lance-table/src/rowids/index.rs:131-183; rust/lance-table/src/rowids/index.rs:306-338)
- Benchmark labels80% and RowIdIndex size do not mean80% tombstones or retained index bytes. Basic GetHashMap and GetIndex time different operation counts per iteration. (rust/lance-table/benches/row_id_index.rs:40-70; rust/lance-table/benches/row_id_index.rs:142-186; rust/lance-table/benches/row_id_index.rs:205-277)


## Stream metadata trust and benchmark units

A 65,536-row read-ahead target is not a global retained-memory bound. One-run version lookup still allocates output and does not validate its span. Null-deletion mode preserves version/payload values, and a caller omitting ID/address fields receives no tombstone marker. Unwrapped selection errors and unchecked advertised counts remain preconditions despite Result-returning APIs. (rust/lance-table/src/utils/stream.rs:218-315; rust/lance-table/src/utils/stream.rs:407-463; rust/lance-table/src/utils/stream.rs:692-798)

Never compare direct and stream version durations as equal work: one times one batch and skips a short tail; the other includes the full stream and tail. Interning memory output is a DeepSizeOf estimate labeled MB with a MiB divisor, not peak process allocation. (rust/lance-table/benches/version_columns.rs:99-157; rust/lance-table/benches/manifest_intern.rs:206-244)


## File runtime boundary pitfalls

- A metadata roundtrip test can pass after losing all top-level schema metadata because Schema::PartialEq compares only fields. Assert the metadata map separately. (rust/lance-file/src/datatypes.rs:394-410; rust/lance-core/src/datatypes/schema.rs:874-878)
- Valid unique-ID reconstruction is fast; duplicate parent references trigger whole-arena DFS. Iterative decoding does not remove recursive serialization or destruction depth. (rust/lance-file/src/datatypes.rs:102-245)
- A read chunk target is not a hard maximum. Zero may panic, reversed bounds subtract unchecked, and splitting overlapping ranges can produce descending chunk starts that the scheduler rejects. These are source-derived edge cases, not reproduced failures. (rust/lance-file/src/io.rs:67-98; rust/lance-io/src/scheduler.rs:1204-1215)
- Missing input columns are intentionally skipped by ExpectedTypes. Its accepted cache records schema equality, not pointer identity or values; nullability, encoder presence checks and completion are separate. (rust/lance-file/src/writer/field_types.rs:87-128)
- Indexed-open errors propagate; only None falls back. V1 success in validate_global_buffers is a no-op and does not establish current-format support. (rust/lance-file/src/versions/mod.rs:138-149; rust/lance-file/src/versions/mod.rs:285-313)
- Expected Blob-v2 Struct/Struct skips recursive type checks after extension handling. Bare arrays suppress the outer extension check, and Map sortedness is ignored; other datatype equality can be stricter. (rust/lance-file/src/writer/field_types.rs:115-193)

## Composition and structural metadata pitfalls

- V2_1 oversized metadata minichunk logs using default but clearing an override can retain a nondefault configured value. Block selection still computes unused params and can log. (rust/lance-file/src/versions/v2_1/compression.rs:29-46; rust/lance-file/src/versions/v2_1/compression.rs:109-128)
- A successful syntax decode is not grammar validation; a normalized ColumnInfo is not proof of page-count equality, bounds or column-buffer alignment. (rust/lance-file/src/reader/structural.rs:29-171)
- Missing field-ID mapping omits a column without pruning schema. Duplicate IDs collapse in BTreeMap; mapper casts negative IDs. (rust/lance-file/src/reader/structural.rs:214-259)
- Descendant struct lengths are not compared once a nonstruct ancestor disables comparability. Do not replace this with unconditional equality without understanding normalized list semantics. (rust/lance-file/src/reader/structural.rs:274-317)
- V2_3 warning happens once at wrapper construction, even if construction fails, and is absent from direct strategy/footer helpers. It is not a complete audit of all writes. (rust/lance-file/src/versions/v2_3/mod.rs:129-200)

## Exact-reader pitfalls

- Metadata-index acceptance does not imply projection support: V2_0 accepts its index identity but always refuses indexed preparation after structural checks. (rust/lance-file/src/versions/v2_0/reader.rs:150-175; rust/lance-file/src/versions/v2_0/reader.rs:384-395)
- V2_0 compares struct children against the parent header, unlike leaf layout first-child inference; the error text alone obscures this distinction. Its test helper also omits the production surplus-index check. (rust/lance-file/src/versions/v2_0/reader.rs:238-310; rust/lance-file/src/versions/v2_0/reader.rs:397-415)
- V2_3 sparse visitor accepts absent optional sets/oneofs and zero layers; it validates explicit encodings, not every semantic constraint. Missing layer variants do error. (rust/lance-file/src/versions/v2_3/reader.rs:91-146)
- Flat/InlineBitpacking/Constant leaves bypass numeric validation; grammar success cannot certify data decode. (rust/lance-file/src/versions/v2_1/reader.rs:26-32; rust/lance-file/src/versions/v2_2/reader.rs:26-32; rust/lance-file/src/versions/v2_3/reader.rs:26-32)

## Structural writer assumptions to preserve

- Calling abort does nothing locally; it does not drop the owned object writer. Backend drop semantics remain separate. (rust/lance-file/src/versions/v2_1/writer.rs:188-191; rust/lance-file/src/versions/v2_2/writer.rs:188-191; rust/lance-file/src/versions/v2_3/writer.rs:188-191)
- Named type/encoding selection and positional nullability checks differ for reordered top-level batch columns. (rust/lance-file/src/writer/field_types.rs:87-112; rust/lance-file/src/writer/structural.rs:535-543; rust/lance-file/src/writer/structural.rs:570-595)
- Spill limits buffered serialized pages, not complete finalization memory. Late activation replaces rather than merges existing page lists, and no local sidecar deletion occurs. (rust/lance-file/src/writer/structural.rs:61-112; rust/lance-file/src/writer/structural.rs:231-243; rust/lance-file/src/writer/structural.rs:312-340)
- Ordinary alignment pads length after payload; external writes align position before payload. Finish raw external writes and raw-length column position increments require producer alignment invariants. (rust/lance-file/src/writer/structural.rs:187-198; rust/lance-file/src/writer/structural.rs:352-360; rust/lance-file/src/writer/structural.rs:725-765; rust/lance-encoding/src/encoder.rs:145-154)
- Some(0) explicit max-page option is rejected, but environment0 passes the resolver; a supplied cache budget with empty schema divides by zero before schema validation. (rust/lance-file/src/writer.rs:56-65; rust/lance-file/src/writer/structural.rs:414-439; rust/lance-file/src/versions/v2_1/writer.rs:78-84)

These are source-level contracts and deductions, not executed bug reproductions. [Writer detail](../../L1-modules/rust-lance-file-structural-writer.md).

## V2_0 and fixture pitfalls

- StandardV2_0 and embeddedV2_0 have different footer pairs; normalized version equality is weaker than compatibility byte equality. (rust/lance-file/src/versions/v2_0/writer.rs:812-820; rust/lance-file/src/versions/v2_0/writer.rs:941-949; rust/lance-file/src/compatibility_tests.rs:391-419)
- V2_0 write_external_buffer applies no alignment; structural external writes prepend zero padding. Do not transfer one path's offset guarantee to the other. (rust/lance-file/src/versions/v2_0/writer.rs:840-845; rust/lance-file/src/writer/structural.rs:352-360)
- Fixture --write can replace earlier outputs before detecting a later mismatch. Generator cleanup does not cover failures before entering its try/finally or restore arbitrary Cargo side effects. (rust/lance-file/test_data/exact_versions/datagen.py:32-62; rust/lance-file/test_data/exact_versions/datagen.py:109-125)
- The public test count helper fully reads and collects data and requires foo=bar metadata; it is not a production metadata count. (rust/lance-file/src/testing.rs:102-123)

All observations are unexecuted source analysis. [Details](../../L1-modules/rust-lance-file-v20-compatibility.md).

## Writer test comments and assertions differ

Do not infer common-prefix reads of unequal roots from the test's introductory comment: its explicit assertion rejects them. Do not infer compression data integrity or file-size improvement from end_to_end naming: only metadata and first-page descriptions are checked there. The baseline called no_compression uses defaults and is not compared. (rust/lance-file/src/writer_tests.rs:297-420; rust/lance-file/src/writer_tests.rs:1448-1618)

Current-thread Tokio does not prove process-wide safety for environment mutation. The cap test resets to empty only on normal completion, preserving neither the old value nor absence. Many-column spill fixture comments also do not prove a mid-write flush because no threshold event is asserted. These are source observations, not executed failures. (rust/lance-file/src/writer_tests.rs:1382-1446; rust/lance-file/src/writer_tests.rs:1965-1976) [Limits](../../L1-modules/archive/rust-lance-file-writer-tests.md).

## Shared-reader assumptions and misleading oracles

Do not treat footer/deep-size/statistics counters as exact disjoint byte totals; do not treat projected reader schema as the base projection; and do not assume base-subset enforcement or async/blocking filtered-take equivalence from API names. Some malformed metadata reaches unchecked arithmetic, slicing or unwraps. describe_encoding is not panic-free for arbitrary bytes. These are source observations, not reproduced incidents. (rust/lance-file/src/reader.rs:170-251; rust/lance-file/src/reader.rs:659-685; rust/lance-file/src/reader.rs:942-1028; rust/lance-file/src/reader.rs:1419-1482; rust/lance-file/src/reader.rs:1776-1885; rust/lance-file/src/reader.rs:2263-2333)

Warm local one-IO assertions do not establish cold/cloud performance. Eager/lazy equality can share defects. Global descriptor test text says before metadata IO but does not measure requests, and drop tests do not await full cleanup. [Evidence and limits](../../L1-modules/rust-lance-file-shared-reader.md). (rust/lance-file/src/reader.rs:3409-3650; rust/lance-file/src/reader.rs:4032-4171; rust/lance-file/src/reader.rs:4225-4333; rust/lance-file/src/reader.rs:4422-4497)

## Encoded assembly pitfalls

Do not equate compatibility with payload validation, target-ID equality with storage authority, or a16MiB batch threshold with a hard memory cap. Blob part open can read metadata twice; assembly trusts retained metadata and immutable source objects. A lease is compared even when unused by non-Blob data, and a part always rewrites rather than using the ordinary Reused result. (rust/lance-file/src/concat.rs:157-159; rust/lance-file/src/concat.rs:354-377; rust/lance-file/src/concat.rs:795-856; rust/lance-file/src/concat.rs:942-955; rust/lance-file/src/concat.rs:1138-1180)

Descriptor validation ignores External contents, allows empty Inline, and traverses only Struct/List/LargeList containers. The explicit abort does not cover cancellation or factory/construction failures. Local test names can overstate evidence: metadata relocation tests never decode output values, and the corrupt-input case lacks a factory-call counter. [Detailed limits](../../L1-modules/rust-lance-file-concat.md). (rust/lance-file/src/concat.rs:408-498; rust/lance-file/src/concat.rs:952-1035; rust/lance-file/src/concat.rs:1231-1294; rust/lance-file/src/concat.rs:1574-1585)

## Legacy helpers are not modern validators

V1 mapping may silently omit IDs or repeat overwritten physical indices; grouping sorts indices despite its precondition comment, and malformed offsets can panic or produce terminal batches. Metadata None and wire0 are not symmetric Rust representations. Dictionary write/read predicates differ, and binary-view acceptance by is_binary_like does not imply decoder support. (rust/lance-file/src/versions/v1/mod.rs:25-116) (rust/lance-file/src/versions/v1/format/metadata.rs:34-194) (rust/lance-file/src/versions/v1/encoding.rs:35-192) (rust/lance-arrow/src/lib.rs:99-142)

Page-table extrema amplify sparse IDs into a dense matrix. Loaded zero-batch maps can reach a write unwrap; the builder reserves half the value count. The roundtrip test compares against a modified clone of actual, validating missing-cell zeros but not original populated values independently. None of these source observations was executed as a bug reproduction, and they do not authorize source changes in this read-only goal. (rust/lance-file/src/versions/v1/page_table.rs:67-145) (rust/lance-file/src/versions/v1/page_table.rs:222-246) [Context](../../L1-modules/rust-lance-file-v1-foundation.md).

## V1 codec assumptions that are not general guarantees

- Do not assume nullable binary preserves empty values, or that null primitive/key slots always reconstruct zero independently of their input backing bytes. (rust/lance-file/src/versions/v1/encoding/binary.rs:65-86; rust/lance-file/src/versions/v1/encoding/binary.rs:165-181; rust/lance-file/src/versions/v1/encoding/plain.rs:90-115)
- Do not equate sorted indices with safe contiguous classification: leading repeats can hit the binary fast-path discrepancy. (rust/lance-file/src/versions/v1/encoding/binary.rs:251-284; rust/lance-file/src/versions/v1/encoding/binary.rs:329-388)
- Reader block size is not a hard cap for continuous plain runs; the binary positions span remains unchunked. (rust/lance-file/src/versions/v1/encoding/plain.rs:346-372; rust/lance-file/src/versions/v1/encoding/binary.rs:300-308)
- A Result-returning PlainDecoder constructor does not validate, and its fixed-width byte adapter can pad truncation instead of rejecting it. (rust/lance-file/src/versions/v1/encoding/plain.rs:174-224)
- Disabled historical tests and decoder-only dictionary fixtures do not prove the corresponding live writer/take paths. (rust/lance-file/src/versions/v1/encoding/plain.rs:717-832; rust/lance-file/src/versions/v1/encoding/dictionary.rs:209-252)

[Full caveats and unsafe preconditions](../../L1-modules/rust-lance-file-v1-codecs.md).

## V1 reader assumptions

- Do not infer schema discovery or row-ID generation from obsolete constructor comments; supplied schema and hydrated dictionary values are required by this layer. (rust/lance-file/src/versions/v1/reader.rs:126-163; rust/lance-file/src/versions/v1/reader.rs:645-668)
- Do not equate cached path identity with schema/bounds/ETag validation. Supplying metadata does not bypass statistics metadata loading. (rust/lance-file/src/versions/v1/reader.rs:68-288)
- Empty selectors differ by entry/type: public empty take skips array reads, direct empty list Indices panics, Null reversed ranges can underflow, and null/ordinary codec Ranges failures differ. (rust/lance-file/src/versions/v1/reader.rs:370-396; rust/lance-file/src/versions/v1/reader.rs:578-623; rust/lance-file/src/versions/v1/reader.rs:741-793)
- take sorts rather than restoring arbitrary caller order; list takes read each child range sequentially and may repeat IO. Collection/blocking concat is not a bounded-memory stream or an abort guarantee. (rust/lance-file/src/versions/v1/reader.rs:370-396; rust/lance-file/src/versions/v1/reader.rs:689-739; rust/lance-file/src/versions/v1/format/metadata.rs:128-163)
- Struct/list parent validity and original list item metadata are not reconstructed. A supplied alternate table does not control list position lookup. (rust/lance-file/src/versions/v1/reader.rs:671-807; rust/lance-arrow/src/lib.rs:202-229)

[Complete reader analysis](../../L1-modules/rust-lance-file-v1-reader.md).

## V1 write-state and test interpretation pitfalls

- Empty input slice and a zero-row stored batch have different effects; finishing with no pages can fail even though a zero-row UTF8 batch roundtrips. (rust/lance-file/src/versions/v1/writer/mod.rs:170-173; rust/lance-file/src/versions/v1/writer/mod.rs:627-633; rust/lance-file/src/versions/v1/writer/mod.rs:985-1014; rust/lance-file/src/versions/v1/page_table.rs:103-106)
- Stats mutate before pages; cumulative rows mutate before flush; batch ID increments afterward. There is no local rollback, abort guard or completed flag. (rust/lance-file/src/versions/v1/writer/mod.rs:79-87; rust/lance-file/src/versions/v1/writer/mod.rs:189-236; rust/lance-file/src/versions/v1/writer/mod.rs:255-270)
- Declared nullability is ignored during schema comparison but actual nonnullable-field null counts are checked recursively without ancestor masks. Dictionary contents remain unchecked here. (rust/lance-file/src/versions/v1/writer/mod.rs:144-187)
- List parent page length includes the terminal offset, whereas plain/binary/dictionary lengths count elements. No struct/list parent validity is written. (rust/lance-file/src/versions/v1/writer/mod.rs:406-586)
- The hole test checks in-memory entries after finish, not a reopened serialized table. The statistics string oracle uses exact maxima c/e despite its historical FIXME. [Full boundaries](../../L1-modules/rust-lance-file-v1-writer.md). (rust/lance-file/src/versions/v1/writer/mod.rs:1139-1149; rust/lance-file/src/versions/v1/writer/mod.rs:1266-1311)

## Historical statistics pitfalls

- Dispatcher support does not imply automatic collection or builder append support. (rust/lance-file/src/versions/v1/writer/statistics.rs:550-609) (rust/lance-file/src/versions/v1/writer/statistics.rs:869-929)
- Dictionary null counts concern values arrays, not keys/decoded rows; shared values may be counted repeatedly. (rust/lance-file/src/versions/v1/writer/statistics.rs:484-513)
- Any long string/binary input can widen a short maximum. UTF8 successor is not binary carry, and truncation may scan a long suffix. (rust/lance-file/src/versions/v1/writer/statistics.rs:176-387)
- Empty/all-null numeric and Boolean bounds are present sentinels, whereas empty string/binary bounds are absent. NaNs are not nulls. (rust/lance-file/src/versions/v1/writer/statistics.rs:47-161) (rust/lance-file/src/versions/v1/writer/statistics.rs:241-482)
- Finish resets builders before final length validation. Wrong-variant row handling differs across primitive/Boolean/binary appenders. (rust/lance-file/src/versions/v1/writer/statistics.rs:635-670) (rust/lance-file/src/versions/v1/writer/statistics.rs:718-867)

[Statistics contracts and test caveats](../../L1-modules/rust-lance-file-v1-statistics.md) retain the literal fixed-binary width discrepancy without asserting an unexecuted runtime failure. (rust/lance-file/src/versions/v1/writer/statistics.rs:446-450) (rust/lance-file/src/versions/v1/writer/statistics.rs:1573-1588)

## File benchmark interpretation pitfalls

- Nocache is a non-Linux no-op and Linux advisory eviction, while Lance caches/readers remain. (rust/lance-file/benches/reader.rs:128-149) (rust/lance-file/benches/reader.rs:403-448)
- Strided selectors are split with floor division;100-row groups can drop another tail, and per-chunk row assertions do not detect that loss. (rust/lance-file/benches/reader.rs:225-247) (rust/lance-file/benches/reader.rs:292-352)
- Static cached readers do not own TempDir, key omits directory/options, and filename includes only version despite its comment. (rust/lance-file/benches/reader.rs:156-205) (rust/lance-file/benches/reader.rs:255-263)
- Raw Int32 sums ignore validity and are only black_boxed. No decoded-value equality is asserted. (rust/lance-file/benches/reader.rs:95-121) (rust/lance-file/benches/reader.rs:311-334)
- Schema throughput counts root+leaf protobuf entries, whereas labels count leaves. [Full denominator table](../../L1-modules/archive/rust-lance-file-benchmarks.md). (rust/lance-file/benches/schema.rs:20-69)

## Pinned V1 artifact traps

A raw hash proves byte identity, not schema meaning or runtime compatibility. This file has no embedded schema; the dictionary block is not self-linked to a named field. Name/blob page positions point to absolute offsets, while list offsets are relative and countN+1. There are no parent-list, child-integer or dictionary-key validity buffers: original nulls normalize as empty/zero/green. Blob metadata in the external schema does not make this V1 payload a modern external blob. [Detailed evidence](../../L1-modules/archive/rust-lance-file-binary-fixtures.md). (rust/lance-file/test_data/exact_versions/v1.lance@bytes:0-387133; rust/lance-file/test_data/exact_versions/datagen.rs:25-100; rust/lance-file/src/compatibility_tests.rs:100-135)

## Embedded V2_0 traps

Do not impose standard-writer padding on these embedded artifacts or equate max_page_bytes with actual page payload size. Buffer-memory estimates can retain a larger source allocation, while the page append helper does no alignment. Raw binary offsets may decrease after a null marker; normalize first. All priorities are0, yet there are146 pages. Mini's empty GBO points to footer start and means external schema, not empty rows. Self-described adds100+16 bytes and leaves data/column-metadata bytes identical. Scalar schema protobuf type0 and deprecated encoding tags1/2 are observed serialized fields, not permission to replace page encodings with legacy decoding. [Full evidence](../../L1-modules/archive/rust-lance-file-embedded-fixtures.md). (rust/lance-encoding/src/array_encoding/logical/primitive.rs:479-549; rust/lance-encoding/src/array_encoding/physical/binary.rs:60-107; rust/lance-encoding/src/encoder.rs:380-395; rust/lance-file/src/datatypes.rs:65-91; rust/lance-file/test_data/exact_versions/v2_0_self_described.lance@bytes:0-23077)

## Standard V2_0 traps

Physical column3 counts children, not Dataset rows. Raw list/name offsets can decrease after a null marker; normalize before subtraction. Dictionary nulls have no key bitmap and the last nonnull-only page still stores a null dictionary item. The nullable child envelope remains SomeNull even on all-valid pages. Name payload compression is explicit none, while dictionary payload compression metadata is absent. Blob descriptor sizes exclude padding, and position0 is a valid nonempty blob, distinct from empty(0,0) and null(1,0). Schema type0 and deprecated encoding tags must not replace actual page encodings. [Byte evidence](../../L1-modules/archive/rust-lance-file-standard-v20-fixture.md). (rust/lance-encoding/src/data.rs:1703-1778; rust/lance-encoding/src/array_encoding/logical/blob.rs:308-350; rust/lance-file/test_data/exact_versions/v2_0.lance@bytes:0-706157)

## V2_1 mini-block traps

Do not interpret num_levels0 as zero values, require final log0, equate MiniBlock.num_items with invisible-marker-inclusive level length, read FastLanes as sequential input-order bits, or treat every short packed tail as raw. Dictionary and name offset bases differ. Null-key backing0 is a real key whose validity comes from def levels; blob position0 with size31 is nonempty. The final list page retains a two-byte inline width0 definition header and NullableList interpretation despite containing one valid list. [Exact examples](../../L1-modules/archive/rust-lance-file-standard-v21-fixture.md). (rust/lance-encoding/src/encodings/physical/value.rs:83-111; rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-536; rust/lance-encoding/src/repdef.rs:518-644; rust/lance-file/test_data/exact_versions/v2_1.lance@bytes:0-501167)

## V2_2 fixture traps

has_large_chunk widens two framing categories, not every integer. Constant pages can have zero buffers (inline) or one buffer (framed scalar) without being null. A32-byte string is not automatically inline because its Arrow representation also has offsets. Scalar-frame offsets, Variable mini-block offsets and dictionary-block offsets have distinct bases. A version supporting VariablePackedStruct does not mean this fixture uses it; blob descriptions here remain PackedStruct Flat128. [Exact bytes](../../L1-modules/archive/rust-lance-file-standard-v22-fixture.md). (rust/lance-arrow/src/scalar.rs:61-191; protos/encodings_v2_1.proto:568-603; rust/lance-file/test_data/exact_versions/v2_2.lance@bytes:0-500987)

## Encoding facade traps

- A boxed future need not defer work: BufferScheduler slices eagerly before returning it. Its u64 endpoints use unchecked usize casts; invalid slicing is not converted to a Lance Result error. (rust/lance-encoding/src/lib.rs:117-132)
- submit_single does not validate exactly one returned buffer; it panics on zero and returns the last on surplus success. An implementation must honor the multi-range trait contract. (rust/lance-encoding/src/lib.rs:40-76)
- BufferCompression absence and runtime CompressionScheme::None are different. The structural converter rejects None/Fsst, while older helpers stringify those variants. (rust/lance-encoding/src/format.rs:101-120; rust/lance-encoding/src/format.rs:221-237; rust/lance-encoding/src/format.rs:406-431; rust/lance-encoding/src/encodings/physical/block.rs:82-121)
- The mini-block helper alone asserts nonempty layer meanings. Full-zip/blob/constant helpers can construct empty layers or inconsistent counts; successful construction does not prove a valid page. Unknown rep/def codes and code 0 panic. (rust/lance-encoding/src/format.rs:502-716)
- A grammar named pb21 contains later variants. Exact reader rules and stable-format policy must be audited independently; constructor names contain no version guarantee. (rust/lance-encoding/src/format.rs:19-33; rust/lance-file/src/versions/v2_1/reader.rs:93-142; rust/lance-file/src/versions/v2_2/reader.rs:93-144)

[Complete local signatures and exceptions](../../L1-modules/rust-lance-encoding.md).

## Configuration and compression pitfalls

- Exact empty column entries suppress wildcard overlays; overlapping wildcards have no stable specificity order. None retains inherited fields, including compression levels from a different scheme. (rust/lance-encoding/src/compression_config.rs:84-169)
- A memory budget is crossed before flushing and the triggering array is retained without copying. Top-level row count is caller-supplied; u64::MAX is also the first-row sentinel. (rust/lance-encoding/src/utils/accumulation.rs:24-105)
- Zero byte packing deliberately discards arbitrary values. Checked append uses chosen width; trusted append can truncate when debug assertions are disabled. Decoder truncation is a panic, not Result. (rust/lance-encoding/src/utils/bytepack.rs:92-224)
- Zstd format detection's comment and mask disagree; size prefixes are not allocation limits and prefix decode ignores actual written count. Codec errors can leave output modified. (rust/lance-encoding/src/encodings/physical/block.rs:203-290; rust/lance-encoding/src/encodings/physical/block.rs:310-359)
- GeneralBlockDecompressor and CompressedBufferEncoder::BlockDecompressor have different inner behavior. Only the former is descriptor-composed; the latter always expects the binary variable-block representation. (rust/lance-encoding/src/encodings/physical/block.rs:433-460; rust/lance-encoding/src/encodings/physical/block.rs:666-675)
- Config defaults differ from encoder defaults; a no-op codec does not create a legal General wrapper. Whole-block descriptor levels preserve selection while per-value levels use runtime normalization. (rust/lance-encoding/src/encodings/physical/block.rs:65-110; rust/lance-encoding/src/encodings/physical/block.rs:471-509; rust/lance-encoding/src/encodings/physical/block.rs:586-594; rust/lance-encoding/src/encodings/physical/block.rs:657-663)

[Exact declarations, errors and scope limits](../../L1-modules/rust-lance-encoding.md).

## Buffer and chunk pitfalls

- Safe signature does not establish zipper safety: byte alignment is checked, lengths and arithmetic are not. No unsafe failure was executed here. (rust/lance-encoding/src/buffer.rs:226-260)
- A typed ScalarBuffer return is owned, whereas aligned Cow is borrowed. from_bytes copying through Vec<u8> does not explicitly guarantee the requested alignment. (rust/lance-encoding/src/buffer.rs:78-203)
- Environment parser clamps and caches once; non-power-of-two limits are accepted. Chunk log0 is a residual sentinel, not one value. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-43; rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:95-126)
- Mini-block context carries private hints with no observed field reads; do not treat its booleans as implemented policy. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:57-78; [lexical inventory](../../analysis/iteration-073-lexical-use-sites.json))
- General compression only wraps buffer0, compares aggregate chunk totals, and can bypass factory errors on small data. Individual chunks may grow in an accepted page. (rust/lance-encoding/src/encodings/physical/general.rs:39-115)
- Whole-block constants reject even empty present payloads; fixed-per-value constants ignore supplied data. General test helper names overstate value equality and automatic registration coverage. (rust/lance-encoding/src/encodings/physical/constant.rs:26-62; rust/lance-encoding/src/encodings/physical/general.rs:261-408; rust/lance-encoding/src/encodings/physical/general.rs:527-683)

## Value and bitpacking pitfalls

- A correct nested FSL descriptor does not establish correct flattened width: the simple encoder repeats the outer dimension. Nullable descendants take a different helper. (rust/lance-encoding/src/encodings/physical/value.rs:323-473)
- Byte-aligned per-row validity layout differs from chunk-wide validity; do not interchange mini-block and per-value buffers. Whole-block ValueDecompressor does not restore FSL layers. (rust/lance-encoding/src/encodings/physical/value.rs:141-309; rust/lance-encoding/src/encodings/physical/value.rs:381-465; rust/lance-encoding/src/encodings/physical/value.rs:612-619)
- Inline min_size_bytes excludes the header; count0 bypasses width and byte validation only after required payload/buffer presence checks. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:61-68; rust/lance-encoding/src/encodings/physical/bitpacking.rs:341-382)
- OOL's strict tail-size comparison is a decoding contract. Extra bytes are not always rejected and can change the raw-tail interpretation. Its physical input count can disagree with DataBlock's logical count. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:389-529)
- FastLanes transposes even at full native width; its masks can silently discard high bits if a direct caller supplies too small a width. Tests were inspected, not run, and introductory comments are not byte specifications. (rust/compression/bitpacking/src/lib.rs:74-174; rust/lance-encoding/src/encodings/physical/bitpacking.rs:532-555)

## Variable, FSST and BSS pitfalls

- Binary target size is not an enforced cap; final-tail and doubled-candidate checks interact differently with maximum values. Negative parsed environment targets are accepted. (rust/lance-encoding/src/encodings/physical/binary.rs:35-246)
- Raw mini payload copy validates offsets before slicing; raw block decoding shares buffers and defers general offset checks to Arrow conversion. Disabling the internal validation flag does not bypass variable Arrow checks. (rust/lance-encoding/src/encodings/physical/binary.rs:331-441; rust/lance-encoding/src/encodings/physical/binary.rs:564-714; rust/lance-encoding/src/data.rs:735-962)
- FSST encode and decode use different IO error conversion; table-size InvalidInput is not CorruptFile. Eightfold decode reservation and offset truncation are not a count validator. (rust/lance-encoding/src/encodings/physical/fsst.rs:36-133; rust/lance-encoding/src/encodings/physical/fsst.rs:215-386; rust/compression/fsst/src/fsst.rs:1263-1345)
- BSS is per chunk and length-preserving. An aggregate inverse can satisfy byte-count checks and still scramble multi-chunk input. Missing stats Option differs from entirely uninitialized statistics, which panic. (rust/lance-encoding/src/encodings/physical/byte_stream_split.rs:109-324; rust/lance-encoding/src/statistics.rs:311-354)

## Packed/statistics pitfalls

- check_struct_validity checks variant/field count/row counts, not NULL validity; has_variable_width_child treats every non-FixedWidth direct child as variable. (rust/lance-encoding/src/encodings/physical/packed.rs:298-325; rust/lance-encoding/src/data.rs:1037-1041)
- Empty packed row placeholders and zero-row blocks follow different paths; uninitialized builders panic at finish. Fixed accumulator width0 passes alignment but underlying fixed builder divides by zero. Source deductions, not reproduced failures. (rust/lance-encoding/src/encodings/physical/packed.rs:531-866; rust/lance-encoding/src/data.rs:344-377; rust/lance-encoding/src/data.rs:2113-2116)
- Missing statistic may be None or a panic depending whether the map is initialized. Nullable and list wrappers change the meaning of statistics; cached cardinality is approximate and may outlive a fixed payload mutation. (rust/lance-encoding/src/statistics.rs:89-114; rust/lance-encoding/src/statistics.rs:161-229; rust/lance-encoding/src/statistics.rs:324-439; rust/lance-encoding/src/data.rs:63-85)
- File version and test mode are separate axes: u32 structural fixed-packed tests do not establish production V2.2 fixed full-zip behavior. (rust/lance-encoding/src/testing.rs:162-181; rust/lance-file/src/versions/v2_2/compression.rs:77-93; rust/lance-file/src/versions/v2_3/compression.rs:77-92)

## Compression policy pitfalls

- The0.5 RLE constant is not an automatic ratio limit; an explicit threshold is required for the strict fraction check. (rust/lance-encoding/src/compression.rs:174-198; rust/lance-encoding/src/compression.rs:278-322)
- Explicit codec strings are not universally honored: small variable per-value general requests become raw; large non-zstd requests can become the feature-dependent default codec. (rust/lance-encoding/src/compression.rs:799-840; rust/lance-encoding/src/encodings/physical/block.rs:471-489)
- Returning Result from a factory does not mean malformed descriptors never panic: top-level unwrap, nested unwrap/assert and unsupported todo arms remain. Mini VariablePackedStruct is unsupported even though variable per-value supports it. (rust/lance-encoding/src/compression.rs:988-1236)
- A custom nested decoder sees FSST/RLE mini children, but General recursion first stays within the default strategy. RLE grammar is validated before injected block dispatch. (rust/lance-encoding/src/compression.rs:1020-1077; rust/lance-encoding/src/compression.rs:1291-1389)

## Physical RLE pitfalls

- A run value is not globally unique, and coalesced run count does not equal stored entry count. Width splitting can repeat adjacent values. (rust/lance-encoding/src/encodings/physical/rle.rs:693-725; rust/lance-encoding/src/encodings/physical/rle.rs:1793-1918)
- A smaller aggregate child payload can contain an expanded chunk. Current selection does not recheck each mini byte budget. selected_payload_size allocates and performs codec work. (rust/lance-encoding/src/encodings/physical/rle.rs:745-813; rust/lance-encoding/src/encodings/physical/rle.rs:992-1118)
- Eager zero-count shortcuts bypass checks that strict lazy decoding performs. A valid empty whole-block still needs its header. (rust/lance-encoding/src/encodings/physical/rle.rs:1313-1345; rust/lance-encoding/src/encodings/physical/rle.rs:1647-1709; rust/lance-encoding/src/encodings/physical/rle.rs:1793-1877)
- Roundtrip test names do not prove exact-value assertions: the generic helper and largest local fixture check only length. Stale2048/50% comments are not current implementation limits. (rust/lance-encoding/src/encodings/physical/rle.rs:29-55; rust/lance-encoding/src/encodings/physical/rle.rs:2620-2654; rust/lance-encoding/src/encodings/physical/rle.rs:3099-3172; rust/lance-encoding/src/encodings/physical/rle.rs:3383-3414; rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-34; rust/lance-encoding/src/compression.rs:174-198)

## DataBlock pitfalls

- validate=false does not disable public reconstruction checks. In contrast, from_arrays is infallible and does not call the pre-encoding validator. (rust/lance-encoding/src/data.rs:196-199; rust/lance-encoding/src/data.rs:735-756; rust/lance-encoding/src/data.rs:1190-1192; rust/lance-encoding/src/data.rs:1884-1908)
- finish is not legal before initializing a builder; append errors do not promise unchanged state. Public mutable casts can leave shared statistics stale. (rust/lance-encoding/src/data.rs:391-419; rust/lance-encoding/src/data.rs:584-611; rust/lance-encoding/src/data.rs:1453-1491; rust/lance-encoding/src/data.rs:2071-2117)
- is_nullable ignores Struct parent validity, has_variable_width_child tests direct kind rather than recursive width, and into_buffers omits that parent bitmap. (rust/lance-encoding/src/data.rs:1030-1048; rust/lance-encoding/src/data.rs:1284-1296)
- Dictionary expansion visits physical keys, while zero declared keys bypass decoding. Normalization can preserve duplicate dictionary items and widen keys to UInt32. (rust/lance-encoding/src/data.rs:1061-1097; rust/lance-encoding/src/data.rs:1630-1778; rust/lance-encoding/src/data.rs:2377-2405)
- Cloning is not a deep copy, data_size is not retained allocation size, and flatten_as_fixed does not apply fixed-list dimensions. Several comments describe obsolete APIs or stronger invariants than validation enforces. (rust/lance-encoding/src/data.rs:483-489; rust/lance-encoding/src/data.rs:797-866; rust/lance-encoding/src/data.rs:1229-1250; rust/lance-encoding/src/data.rs:1335-1365)

## Rep/def pitfalls

- Dense entries differ from leaf values; final slicing must retain invisible tails. (rust/lance-encoding/src/repdef.rs:426-451; rust/lance-encoding/src/repdef.rs:546-590)
- WithinBudget has policy exemptions; SingleRowOverBudget neither errors nor chooses fallback. (rust/lance-encoding/src/repdef.rs:958-1144)
- Errors may follow mutation; dense exhaustion is unchecked; Unary16 exhaustion panics. (rust/lance-encoding/src/repdef.rs:1678-1683; rust/lance-encoding/src/repdef.rs:1720-1876; rust/lance-encoding/src/repdef.rs:2245-2258)
- max_lists is an upper bound, append_next returns a descriptor Option, and the opening example's final repetition0 conflicts with its stated outer-list start. Use exact implementation and tests to resolve stale prose. (rust/lance-encoding/src/repdef.rs:28-39; rust/lance-encoding/src/repdef.rs:1696-1714; rust/lance-encoding/src/repdef.rs:2342-2356)

## Encoder facade pitfalls

- keep_original_array defaults true despite the false-default comment; memory encoding always forces true. (rust/lance-encoding/src/encoder.rs:265-285; rust/lance-encoding/src/encoder.rs:419-425)
- Reserved out-of-line positions include padding; returned buffers do not. The memory helper appends them unpadded. Base positions are not rounded up, and reset_position retains queued buffers. (rust/lance-encoding/src/encoder.rs:137-159; rust/lance-encoding/src/encoder.rs:435-469)
- Batch schema controls encoding, supplied schema controls returned metadata, and top_level_columns copies all mapping indices. (rust/lance-encoding/src/encoder.rs:420-425; rust/lance-encoding/src/encoder.rs:489-499)
- None means builder did not recognize a field; Err can occur after column allocation. Map checks at least two fields, not exact arity, and direct FSL<Struct> recognition does not recurse through FSL wrappers. (rust/lance-encoding/src/encoder/structural.rs:112-129; rust/lance-encoding/src/encoder/structural.rs:189-258)

## Decoder assumptions and source deductions

- Empty columns, wrong message/encoding variants, unsupported types and malformed mapping can panic in otherwise Result-returning APIs. Range counts are computed before reversed ranges are trimmed. (rust/lance-encoding/src/decoder.rs:424-631; rust/lance-encoding/src/decoder.rs:878-1123; rust/lance-encoding/src/decoder.rs:2202-2262; rust/lance-encoding/src/decoder.rs:2466-2478; rust/lance-encoding/src/decoder.rs:3268-3298)
- Legacy dummy root uses modulo for the final page and u64::MAX for nonfinal pages; exactly u32::MAX rows gives a zero-row page and larger inputs create multiple pages rejected by simple-struct checks. This is a source deduction, not a runtime reproduction. (rust/lance-encoding/src/decoder.rs:770-780; rust/lance-encoding/src/decoder.rs:1071-1154)
- DecoderConfig cache defaulttrue differs from CoreFieldDecoderStrategy defaultfalse. Environment settings have different first-use/per-call lifetimes. (rust/lance-encoding/src/decoder.rs:392-415; rust/lance-encoding/src/decoder.rs:655-685; rust/lance-encoding/src/decoder.rs:2296-2304; rust/lance-encoding/src/decoder.rs:2466-2490)
- Byte targets can overshoot; minimumone permits oversized estimates. Tokio spawn here does not mean a blocking CPU pool. Stream planning errors fuse, CPU future errors do not; blocking iterator errors always fuse. (rust/lance-encoding/src/decoder.rs:1636-1951; rust/lance-encoding/src/decoder.rs:2089-2199)
- RequestBatch does not merge ranges, enforce a per-request8MiB cap or omit dropped readers. ScopedSchedulerContext has explicit pop and no RAII pop. (rust/lance-encoding/src/decoder.rs:2863-3151)

## Primitive helper assumptions

- Pub declarations inside private chunk_index do not create a public module API. Compact representation constructors trust count/width agreement; debug assertions do not validate release data. Duplicate row starts can select zero-width chunks. (rust/lance-encoding/src/encodings/logical/primitive.rs:96-105; rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:32-138; rust/lance-encoding/src/encodings/logical/primitive/chunk_index.rs:231-323)
- Returned initialized cache is not installed state. Constant scheduling before try_load unwraps None; range drain errors can consume state. Scalar compression saves encoded repetition of values but output materialization still allocates. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:218-492)
- Dictionary values with nulls and null dictionary keys require different normalization steps. Empty dictionary cannot substitute index0. Fixed64/128 equality is raw bits, and size budget is not peak-memory bound. (rust/lance-encoding/src/encodings/logical/primitive/dict.rs:30-170; rust/lance-encoding/src/encodings/logical/primitive/dict.rs:172-427)

## Blob boundary pitfalls

- External buffers here reserve same-file storage; they are not automatically remote objects. Blob-v2 sidecar/URI descriptors use a distinct representation and ordinary parent validity. (rust/lance-encoding/src/encoder.rs:117-160; rust/lance-encoding/src/encodings/logical/blob.rs:146-199; rust/lance-encoding/src/encodings/logical/blob.rs:323-420)
- Empty payload must not consume a reply belonging to the next blob.32MiB only counts nonempty payload sizes and flushes after a row; zero-byte rows and oversized values defeat a hard memory-cap interpretation. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:262-290; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:363-432)
- Payload initialization decodes the whole descriptor page and requires one task; it does not merely retain inner metadata. Output binary copying adds allocation beyond loaded Bytes. Empty meanings, mismatched descriptor lengths and over-drain retain unchecked assumptions. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:151-214; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:293-344; rust/lance-encoding/src/encodings/logical/primitive/blob.rs:473-552)
- Valid parent with null kind emits a valid placeholder, and required per-kind child nulls are not rejected locally. Treat these as unverified upstream invariants, not implicit validation. (rust/lance-encoding/src/encodings/logical/blob.rs:323-420)

## Nested-wrapper pitfalls

- Checked scheduler endpoint multiplication does not imply checked encode/drain row multiplication. Per-scan-line integer division also assumes child granularity; no remainder is retained. Normal dimension guards belong in any reachability analysis. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:84-91; rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:127-209; rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:233-249; rust/lance-encoding/src/decoder.rs:878-884)
- A recursive garbage-filter predicate recognizing list views does not mean its dispatcher supports them; those arms panic. Supplied masks are not automatically combined with Struct/FSL own nulls. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:313-380; rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:519-545)
- Map task errors may occur after child decode and offset unraveling. Its keep_original test covers true only, and extreme-size fixture means100 entries, not the i32 limit. (rust/lance-encoding/src/encodings/logical/map.rs:192-237; rust/lance-encoding/src/encodings/logical/map.rs:675-759; rust/lance-encoding/src/testing.rs:1098-1148)
