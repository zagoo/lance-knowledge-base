> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f0819cf1fc358b9fd05bc10900f6ac1215146dde755f5c1b308103954bf0e647`. Reviewed physical lines: 1-4804.

[Module](../../../../L1-modules/rust-lance-file-shared-reader.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Shared current-format file reader, raw metadata and index loading, projection-scoped metadata acquisition, decode scheduling and local test oracles. Exact-version modules own grammar acceptance and projection semantics; this module coordinates their selected behavior. (rust/lance-file/src/reader.rs:1-4804)

## Complete range analysis

### Lines 1-54

SPDX and imports connect Arrow record readers/schema, asynchronous streams, little-endian byte readers, protobuf Message, cache identity/deep sizing, core schema, encoding scheduler/decoder APIs and EncodedBatch, object path, FileScheduler and batch streams. The crate-private structural submodule provides shared structural projection behavior. Imports are dependencies, not runtime registrations. (rust/lance-file/src/reader.rs:1-54)

### Lines 55-68

Public DEFAULT_READ_CHUNK_SIZE is exactly8*1024*1024 bytes. Public Debug/DeepSizeOf BufferDescriptor holds position:u64 and size:u64. The preceding comment says global buffers only hold schema and positions are for debugging; later retained user-buffer handling and public read_global_buffer make that comment stale. (rust/lance-file/src/reader.rs:55-68)

### Lines 69-101

Private BufferDescriptor::checked_range first checked_adds position+size, then rejects position>file_len and end>file_len as invalid_input_source with index/value context. position==file_len and size0 are allowed. Returns a half-open range. It does not require nonzero size, alignment, ordering, nonoverlap or placement outside metadata. (rust/lance-file/src/reader.rs:69-101)

### Lines 102-119

Public Debug FileStatistics owns Vec<ColumnStatistics>; each public ColumnStatistics exposes num_pages:usize and size_bytes:u64. Its size documentation says compressed data and metadata bytes, but statistics_from_column_metadata actually sums only page.buffer_sizes (rust/lance-file/src/reader.rs:659-685). (rust/lance-file/src/reader.rs:102-119)

### Lines 120-161

Public Debug CachedFileMetadata retains Arc core schema, original protobuf columns, Vec<Arc<ColumnInfo>>, declared row count, global descriptors, four byte-accounting counters, literal major/minor and exact version, actual object-store size, and BTreeMap<u32,Bytes> of retained user globals. Retained buffers exclude index0, are copied from the original tail window to release its backing allocation, and omit globals outside that window. TODO Caching is stale relative to callers using LanceCache; this type itself does not load or validate data. Counter comments are not exact formulas: raw full loader computes schema-to-end footer bytes and metadata-through-CMO bytes. (rust/lance-file/src/reader.rs:120-161)

### Lines 162-177

Public CachedFileMetadata::file_size returns actual file_size_bytes. Private column_metadata_deep_size sums each protobuf encoded_len()*4 plus size_of_val(the slice), an approximate decoded allocation proxy using length, not Vec capacity. Arithmetic is ordinary unchecked multiplication/addition/sum. (rust/lance-file/src/reader.rs:162-177)

### Lines 178-209

CachedFileMetadata DeepSizeOf combines schema child size, each descriptor child size, approximate protobuf metadata, column_infos Vec children and retained-map children. Descriptor iteration does not account for the file_buffers Vec allocation itself; scalar-only descriptors have no heap children. Protobuf4x is a heuristic, not a measured allocation. Shared Arc accounting is delegated to DeepSizeOf/context; this method does not reconcile accounting with physical file size. (rust/lance-file/src/reader.rs:178-209)

### Lines 210-238

Public Debug/DeepSizeOf FileMetadataIndex has crate-private Arc schema, row count, descriptors, Arc slice of(position,length) CMO entries, physical column count, exact version, actual size and retained user globals. It excludes decoded per-column metadata. Public file_size and num_columns are direct accessors; construction/validation occurs elsewhere. (rust/lance-file/src/reader.rs:210-238)

### Lines 239-251

Private CachedColumnMetadata pairs original protobuf ColumnMetadata with Arc normalized ColumnInfo. Custom deep sizing calls the same4x wire-size proxy on a one-element slice and adds ColumnInfo children; the estimate includes one inline protobuf size even though the wrapper owns that field inline. (rust/lance-file/src/reader.rs:239-251)

### Lines 252-277

Private Clone/Debug ColumnMetadataCacheKey stores physical u32 column index. CacheKey ValueType=CachedColumnMetadata; diagnostic key is owned column_metadata/N, type_name ColumnMetadata, typed schema(lance.file.column-metadata-key,1), binary key is write_u32(index). File identity must come from the surrounding cache namespace; this key contains no path/version. (rust/lance-file/src/reader.rs:252-277)

### Lines 278-350

Public CachedFileMetadata::version returns exact version. Public Clone/Debug ReaderProjection owns Arc<Schema> plus Vec<u32> physical column indices. Documentation allows different in-memory representations if decoders support them, not arbitrary guaranteed casts; schema names are documented arbitrary. V2_0 DFS includes structural nodes while V2_1 docs use leaf columns. Example mapping is V2_0[1,3,4,6,7,8] versus V2_1[0,2,4,5]; fixed-size-list/dictionary and child rules remain exact-version strategy concerns. No validation happens in this struct declaration. (rust/lance-file/src/reader.rs:278-350)

### Lines 351-362

prefers_indexed_metadata first checks projection shape through provider helper then requires saturating(column_indices.len()*4)<total_columns: strict less than25%, not <=25%. It does not select/check file version; docs require caller to choose an indexed-capable format first. (rust/lance-file/src/reader.rs:351-362)

### Lines 363-390

Public Clone/Debug FileReaderOptions contains DecoderConfig, read_chunk_size:u64 and optional approximate batch_size_bytes. Default decoder config,8MiB chunk and None byte target. Docs describe row and byte batch limits as independent upper bounds and Dataset/scanner configuration paths, whose implementations remain pending. No nonzero validation occurs in Default or field construction. (rust/lance-file/src/reader.rs:363-390)

### Lines 391-425

Crate-private PreparedProjection owns selected normalized infos and decoder projection. FileMetadataProvider is Full(Arc<CachedFileMetadata>) or Indexed(Arc<FileMetadataIndex>). Async Debug+Send+Sync ReadProjection is the exact-version seam: validate_indexed, read_length, and async prepare(provider,projection,io,cache)->(PreparedProjection,u64). Shared reader invokes this strategy rather than applying accepted grammar itself. (rust/lance-file/src/reader.rs:391-425)

### Lines 426-455

Crate-private Clone/Debug DecodeEngine shares scheduler, metadata provider, selected ReadProjection, decoder plugins and cache via Arcs, while owning base projection/options. Public ProjectedFileReader wraps private engine, fixes a projection boundary and avoids synchronous full-metadata APIs. Public FileReader keeps crate-private engine plus full metadata Arc. Clone shares metadata/scheduler/cache but clones owned projection/options. (rust/lance-file/src/reader.rs:426-455)

### Lines 456-469

Crate-private tasks_to_record_batch_stream converts core schema to Arrow, discards each ReadBatchTask wrapper except its future, polls via ordered buffered(batch_readahead as usize), and wraps in RecordBatchStreamAdapter. No nonzero readahead validation, unordered execution, retry, filtering or row-count check is added here; task futures determine errors and output. (rust/lance-file/src/reader.rs:456-469)

### Lines 470-510

Crate-private RawFileMetadataOpen separates Legacy literal versions from Current exact-version plus raw metadata. RawFileMetadata retains schema/raw protobufs/counters/footer/size/retained globals before exact-version normalization. Footer declares three u64 offsets, two u32 counts and two u16 versions; FOOTER_LEN=40 includes trailing4 magic bytes. Comments/allow(dead_code) claim no metadata projection and unused offset fields, although indexed loading below uses these fields. (rust/lance-file/src/reader.rs:470-510)

### Lines 511-533

indexed_projection_column_count recursively rejects any blob or packed struct with None, counts any childless field as1, and checked-adds child counts for ordinary nested structures. Structural parents are transparent; overflow also yields None. It reasons over core child shape without validating file version or proving every datatype decoder supports that shape. (rust/lance-file/src/reader.rs:511-533)

### Lines 534-562

normalized_column_num_rows sums page row counts with checked u64 addition. For Structural SparseLayout it uses the first layer's num_slots for Validity/List/FixedSizeList, falling back to page.num_rows when absent; other encodings/layouts use page.num_rows. It does not compare multiple columns despite the broad preceding comment. Overflow is invalid_input_source. This normalized top-level slot accounting differs from public column_num_rows raw page.length. (rust/lance-file/src/reader.rs:534-562)

### Lines 563-578

verify_uniform_lengths returns0 for no fields, otherwise requires all lengths equal the first. On mismatch formats every name=length joined with comma and returns InvalidInput explaining separate column/equal-length-group reads. It does not accept a shorter common prefix or compare against file-level declared row count. (rust/lance-file/src/reader.rs:563-578)

### Lines 579-609

FileReader internal base_projection borrows engine projection; full_projection clones the entire metadata column-info vector with supplied projection, without validating it. Internal async read_prepared_tasks delegates unchanged to engine. Public with_scheduler replaces scheduler through engine clone while retaining the same metadata Arc; it does not reopen or verify scheduler refers to the same file. (rust/lance-file/src/reader.rs:579-609)

### Lines 610-639

with_io_stats asks scheduler for a scoped replacement, using with_scheduler when supported or ordinary clone when None. Metadata is shared and no reopen occurs here. num_rows delegates to engine file-level metadata; column_num_rows documentation promises single physical-column page-sum and reports unequal columns separately. Scoped stats support/actual IO accounting depend on the IO implementation. (rust/lance-file/src/reader.rs:610-639)

### Lines 640-658

column_num_rows checked-gets the raw protobuf column, returning InvalidInput with requested index and count if absent, then ordinary-sums page.length. It has no checked overflow and does not apply normalized sparse structural slot semantics. metadata returns the full Arc by reference. (rust/lance-file/src/reader.rs:640-658)

### Lines 659-690

statistics_from_column_metadata allocates one ColumnStatistics per physical column: page count and nested sums of all page.buffer_sizes. It excludes column-level buffers, serialized protobuf metadata, padding, globals and footer, despite the size field's data-and-metadata comment. Public file_statistics computes afresh; public read_global_buffer delegates to engine. (rust/lance-file/src/reader.rs:659-690)

### Lines 691-700

read_tail awaits object size, chooses begin=max(size-reader.block_size,0) with a conditional, and submits that range at priority0. Returns Bytes plus actual size. A zero block size is not rejected here; any short/empty response is handled by later footer decoding. Object size is cast to u64. (rust/lance-file/src/reader.rs:691-700)

### Lines 701-717

read_range_from_tail_or_scheduler computes tail_end with ordinary addition; if requested bounds lie inside the tail, returns a zero-copy Bytes slice, otherwise submits the complete requested range at priority0. It does not fill only the missing prefix/suffix or explicitly reject reversed ranges; callers must supply valid coordinates. (rust/lance-file/src/reader.rs:701-717)

### Lines 718-739

retained_global_buffers_from_tail checked-adds tail end, enumerates GBOs skipping schema index0, validates each complete file range, and copies only fully contained user buffers into a BTreeMap keyed by index as u32. Partial overlaps are omitted; zero-size buffers may be retained. Copying avoids retaining the original tail allocation; no follow-up IO is made. (rust/lance-file/src/reader.rs:718-739)

### Lines 740-777

decode_footer requires at least40 bytes, reads the last40 using little-endian u64 offsets/u32 counts/u16 versions, and compares final4 bytes with MAGIC. Short input and bad magic return InvalidInput; bad-magic message prints expected MAGIC rather than actual bytes. It does not validate offset ordering/counts/alignment or dispatch version; the comment describing a returned descriptor position is stale because it returns Footer. (rust/lance-file/src/reader.rs:740-777)

### Lines 778-794

current_file_version delegates literal footer-number parsing, rejects V1 as VersionConflict retaining major/minor, accepts exact V2_0/V2_1/V2_2/V2_3. A TODO about loading only needed column metadata precedes the eager full-metadata helper; indexed loading already exists separately. (rust/lance-file/src/reader.rs:778-794)

### Lines 795-824

read_all_column_metadata treats the final16*num_columns bytes of its region as CMO, errors if region is shorter, decodes checked CMO entries, subtracts column_meta_start and slices each protobuf byte range for decode. It collects all metadata. Normalization casts/addition/slicing rely on previously validated offsets and consistent footer-region ordering; the helper itself does not prove its Bytes origin agrees with footer offsets. (rust/lance-file/src/reader.rs:795-824)

### Lines 825-862

decode_cmo_table requires exact16*num_columns length, allocates capacity for all columns, reads LE(position,length) per entry, checked-adds end, and requires position>=column_meta_start and end<=column_meta_offsets_start. Zero lengths, overlapping/unsorted entries are accepted. col_idx*16 is performed in u32 before casting; huge malformed counts can overflow. No independent footer ordering or file-size validation occurs here. (rust/lance-file/src/reader.rs:825-862)

### Lines 863-892

optimistic_tail_read checked-subtracts start_pos from file_len (invalid-input source on beyond-end), casts needed size to usize, slices an already-large-enough suffix or reads only missing prefix at priority0. It allocates/copies prefix plus old data into BytesMut then freezes. Assumes data is the true file suffix; no returned-byte-count check, narrow-target checked cast or allocation limit is added. (rust/lance-file/src/reader.rs:863-892)

### Lines 893-920

do_decode_gbo_table allocates footer-declared count and cursor-decodes repeated LE(position,size) pairs; short reads propagate, trailing bytes are ignored, descriptors are not checked here. validate_gbo_table first invokes exact-version global validation then checked_range on every descriptor. It does not enforce ordering/nonoverlap beyond version helper behavior. (rust/lance-file/src/reader.rs:893-920)

### Lines 921-941

decode_gbo_table expands the original tail back to footer.global_buff_offsets_start, decodes declared entries and validates them. The comment expects the table to fit a single tail but code supports another IO. Expansion result is local and not substituted for the original tail retained later. (rust/lance-file/src/reader.rs:921-941)

### Lines 942-953

decode_schema protobuf-decodes FileDescriptor, unwraps optional schema (panic if missing), retains descriptor.length, converts FieldsWithMeta through core Schema TryFrom and returns both. No comparison between declared rows and column pages or validation of schema presence before unwrap. (rust/lance-file/src/reader.rs:942-953)

### Lines 954-991

read_raw_metadata_for_dispatch reads tail/size/footer and parses exact version. V1 returns only literal legacy tags before any GBO/schema read. Current path reads/validates GBO; empty table is Internal error requiring schema. Uses first descriptor as schema; num_footer_bytes=file_len-schema_start via checked subtraction. Extends original tail to schema_start, slices schema_size bytes and decodes descriptor. GBO checked ranges ensure schema end is within file, but layout ordering remains assumed. (rust/lance-file/src/reader.rs:954-991)

### Lines 992-1029

Full loader slices metadata from column_meta_start-schema_start to global_buff_offsets_start-schema_start using unchecked subtractions, decodes all columns, sums descriptor sizes, sets num_data_bytes=column_meta_start-sum(global sizes), num_column_metadata_bytes=GBOstart-CMOdataStart, and retains user globals only from the original tail window. Thus num_footer_bytes counts everything from schema to EOF, and column metadata bytes include CMO; counters overlap and are not additive disjoint sections. Padding can enter data bytes. Invalid ordering/overlapping inflated GBO sizes can cause underflow/slice panic rather than a structured corruption error; no such execution is claimed. Returns raw schema/protobufs/counters/footer for exact-version decoder, preserving actual object size. (rust/lance-file/src/reader.rs:992-1029)

### Lines 1030-1092

Raw indexed open reads tail/footer, rejects legacy via current_file_version, decodes/validates GBO and requires schema descriptor even with caller-supplied schema. Some(schema,rows) is trusted unchanged; None fetches only schema range from tail or scheduler and decodes it. Fetches exact CMOstart..GBOstart range, decodes entries, retains user globals from original tail, and returns FileMetadataIndex. It does not load/normalize column protobufs or compare known schema/row count against stored descriptor. Footer-region ordering is still assumed. (rust/lance-file/src/reader.rs:1030-1092)

### Lines 1093-1116

Crate-private raw metadata-index wrappers select None versus caller-supplied Arc schema/u64 rows. Known-schema path avoids a dedicated schema fetch/decode, but the initial tail may still contain its bytes; GBO still validates schema descriptor. Public finish_metadata_index dispatch is added by separate public wrappers. (rust/lance-file/src/reader.rs:1093-1116)

### Lines 1117-1145

validate_projection rejects empty root schema, duplicate physical indices via BTreeSet, and indices>=column_infos.len() cast to u32. It does not verify schema/indices cardinality, types, field IDs, ordering, whole nested structure or base-projection subset. A nonempty schema with empty indices is not rejected here. (rust/lance-file/src/reader.rs:1117-1145)

### Lines 1146-1165

collect_columns_from_projection ignores its projection argument and clones the full column-info Vec. Its long comment discusses encoding-dependent column selection as future design; actual behavior performs no selection and is used by blocking reads. (rust/lance-file/src/reader.rs:1146-1165)

### Lines 1166-1210

do_read_range logs requested range/batch/file rows/columns, builds SchedulerDecoderConfig from provided cache/plugins/IO/decoder options and optional byte target, wraps one range in RequestedRows::Ranges and awaits schedule_and_decode with supplied physical indices/schema/filter. num_rows affects logging only. No bound/order/nonzero validation or explicit spawned task appears here. (rust/lance-file/src/reader.rs:1166-1210)

### Lines 1211-1254

do_take_rows wraps the owned u64 vector as RequestedRows::Indices and forwards all decoder settings/filter to schedule_and_decode. Debug logging indexes first/last indices with no emptiness guard, so evaluating that enabled log on empty input can panic. No sorting/deduplication or local validation. (rust/lance-file/src/reader.rs:1211-1254)

### Lines 1255-1300

do_read_ranges computes ordinary sum(end-start) for all ranges before logging, then forwards RequestedRows::Ranges and filter. Reversed ranges may underflow in this local computation; debug-enabled logging indexes first/last on an empty vector. Overlap/order/zero-length ranges are not normalized here. (rust/lance-file/src/reader.rs:1255-1300)

### Lines 1301-1338

take_rows_blocking clones all file column infos, builds config from engine cache/plugins/scheduler/options, and invokes schedule_and_decode_blocking with supplied indices/schema/filter. Debug-enabled logging requires nonempty indices but no guard is present. Decoder blocking runtime/lifetime mechanics are delegated. (rust/lance-file/src/reader.rs:1301-1338)

### Lines 1339-1378

read_ranges_blocking similarly uses all column infos and forwards ranges/filter to blocking scheduler. It ordinary-sums range lengths unconditionally and indexes first/last only inside debug logging. No local sorting, reversed-range rejection, overlap check or empty-list special case. (rust/lance-file/src/reader.rs:1339-1378)

### Lines 1379-1418

read_range_blocking uses all column infos, file-level rows for logging, one RequestedRows range, and engine config, then calls schedule_and_decode_blocking. It does not use normalized read_len except through the already-normalized input range. (rust/lance-file/src/reader.rs:1379-1418)

### Lines 1419-1447

read_prepared_blocking consumes prepared.decoder_projection but does not pass prepared.column_infos onward; private blocking helpers recollect full infos. Bounds closure rejects bound>read_len or equality when inclusive. Indices reject nulls then require each index<read_len and convert to Vec<u64>; empty indices pass this validation. Caller filter is preserved in the blocking take path. (rust/lance-file/src/reader.rs:1419-1447)

### Lines 1448-1483

Blocking Range/Ranges only check end<=read_len; starts and start<=end are not validated. RangeFrom requires start<read_len, rejecting start==EOF even for an empty suffix; RangeTo permits end==read_len, and RangeFull yields0..read_len including empty. Ranges are copied without reordering. All calls retain filter; no local batch_size validation. (rust/lance-file/src/reader.rs:1448-1483)

### Lines 1484-1531

FileReader::schema delegates to engine/provider and returns complete stored schema, not base projection. Provider version/num_rows/schema/file_buffers/retained_globals/file_size match Full versus Indexed and return stored fields; no IO or validation. (rust/lance-file/src/reader.rs:1484-1531)

### Lines 1532-1556

Provider file_statistics returns Some computed full statistics for Full and None for Indexed, without loading missing metadata. projection_matches_indexed_metadata rejects empty roots, checked-sums ordinary recursive physical-column counts and requires exact equality with supplied indices length; count overflow/blob/packed produces false. It does not itself validate indices, types or version. (rust/lance-file/src/reader.rs:1532-1556)

### Lines 1557-1584

validate_indexed_projection_structure mirrors full validation: nonempty root schema, unique indices and each<metadata_index.num_columns. It does not compare offset-table actual length, shape or base-projection subset; exact-version validate_indexed adds shape/version policy. (rust/lance-file/src/reader.rs:1557-1584)

### Lines 1585-1596

indexed_projection_error returns NotSupported describing V2.1+ ordinary structural shape with no blob/packed fields and matching physical count, including actual version/root count/index count. It constructs a diagnostic only, not a capability check. (rust/lance-file/src/reader.rs:1585-1596)

### Lines 1597-1619

column_metadata_range checked-gets CMO entry by index, reports declared num_columns on absence, checked-adds end with contextual InvalidInput, and returns range. It assumes index was constructed with file/metadata-region bounds checked earlier; it performs no IO or file-size check. (rust/lance-file/src/reader.rs:1597-1619)

### Lines 1620-1642

load_indexed_column_infos allocates result Options in projection order and checks cache sequentially per physical index. Hits reuse cached normalized Arc without revalidating version/schema/range; misses compute CMO ranges and remember result position. No single-flight insertion or cache namespace is created here; caller must supply correct file-scoped cache. (rust/lance-file/src/reader.rs:1620-1642)

### Lines 1643-1679

Sort missing metadata by byte start, submit all ranges in one EncodingsIo request priority0, zip returned bytes to missing entries, protobuf-decode then invoke exact-version callback, cache each raw+normalized pair and fill original result slot. Output remains projection order. Too few results become Internal missing-column errors after partial cache inserts; extra responses are ignored by zip. No returned-byte-length validation or transaction rollback; concurrent callers can duplicate loads. Full IO coalescing is delegated, not proven by one submit call. (rust/lance-file/src/reader.rs:1643-1679)

### Lines 1680-1712

DecodeEngine::try_new is currently infallible Ok field assembly despite Result name; it does not validate options, projections or scheduler/metadata identity. with_scheduler clones every other field, sharing cache/provider/strategies/plugins but replacing IO without verifying same underlying file. (rust/lance-file/src/reader.rs:1680-1712)

### Lines 1713-1752

Engine num_rows/schema return provider file-level values. read_global_buffer checked-gets descriptor first, then returns cloned retained bytes if present. Otherwise submits one checked full-file range at priority0 and returns first Bytes; no result is Internal, extra results ignored, short result length unchecked. Fallback bytes are not inserted into cache or retained map, so repeated off-tail reads may repeat IO. Index0 is allowed through this API despite comments saying schema is never fetched. (rust/lance-file/src/reader.rs:1713-1752)

### Lines 1753-1775

Engine read_range moves prepared infos/projection into the shared async range helper, clones IO/cache/plugins/config, forwards caller filter and byte target. File-level num_rows is supplied only for logging; projection-specific length has already been enforced upstream. (rust/lance-file/src/reader.rs:1753-1775)

### Lines 1776-1796

Engine take_rows invokes do_take_rows with FilterExpression::no_filter() unconditionally. Unlike blocking take, caller filter is not accepted by this helper, so async Indices reads discard the filter passed to read_prepared_tasks. This is observed source behavior, not an executed discrepancy test. (rust/lance-file/src/reader.rs:1776-1796)

### Lines 1797-1818

Engine read_ranges forwards prepared infos/projection, requested ranges, caller filter and settings into async helper. No sorting/merging or validation beyond upstream bounds is added. (rust/lance-file/src/reader.rs:1797-1818)

### Lines 1819-1850

Async read_prepared_tasks uses the same bound closure as blocking: inclusive bound must be<read_len, exclusive <=read_len. Indices nulls are InvalidInput, then values are cast to owned u64 and sent to take_rows, losing caller filter through that helper. Empty input passes the explicit validation; debug-logging and decoder behavior determine later handling. (rust/lance-file/src/reader.rs:1819-1850)

### Lines 1851-1887

Async Range/Ranges validate only ends, RangeFrom requires start<read_len, RangeTo permits end==read_len, and RangeFull selects0..read_len. Start/end order, start bounds for closed ranges, overlap and sorting are not checked locally. Each range variant preserves caller filter and awaits its helper; no batch-size/readahead validation here. (rust/lance-file/src/reader.rs:1851-1887)

### Lines 1888-1941

ProjectedFileReader borrows base projection, delegates prepared async tasks, replaces scheduler via cloned engine, returns provider file-level row count/schema, optional full-only statistics, cfg(test) optional indexed metadata reference, and async global buffer delegation. Its schema accessor does not project to base fields. No public blocking or scoped-IO-stats method occurs in this impl. (rust/lance-file/src/reader.rs:1888-1941)

### Lines 1942-1975

FileReader cfg(test) scheduler clones engine IO. Public try_open awaits internal dispatcher and turns a Legacy result into VersionConflict with literal major/minor; Current yields reader. The FileScheduler is consumed. (rust/lance-file/src/reader.rs:1942-1975)

### Lines 1976-2013

try_open_for_dispatch always reads raw metadata, immediately returns legacy marker when applicable, otherwise calls exact versions::finish_metadata and wraps result in Arc. Captures scheduler path and wraps scheduler in LanceEncodingsIo with configured read_chunk_size, then calls with-file-metadata factory. It does not consult a full-metadata cache before reading; outer callers may do so. (rust/lance-file/src/reader.rs:1976-2013)

### Lines 2014-2050

FileReader::try_open_with_file_metadata rejects exactV1, obtains version-selected ReadProjection, builds whole-schema default projection or validates only an explicit projection, prefixes supplied cache by path string, then assembles Full engine with same metadata Arc. Injected EncodingsIo is not rewrapped/configured for read_chunk_size. No consistency check between path/IO/metadata, literal footer versus exact version, or supplied cache parent/store identity. Default empty projection is not validated at construction. (rust/lance-file/src/reader.rs:2014-2050)

### Lines 2051-2085

Public read_all_metadata dispatches raw current metadata through exact finish_metadata and rejects legacy. read_metadata_index and with_schema call raw index loaders then versions::finish_metadata_index; supplied schema/rows retain trust boundary. version returns stored metadata version. These functions do not insert the full/index result into a cache themselves. (rust/lance-file/src/reader.rs:2051-2085)

### Lines 2086-2110

FileReader::prepare delegates requested projection/provider/IO/cache to selected strategy. Public read_tasks uses optional projection or base default, awaits prepare to obtain normalized length, then dispatches read_prepared_tasks. Base projection is a default here, with no subset validation at this entrypoint. (rust/lance-file/src/reader.rs:2086-2110)

### Lines 2111-2140

read_stream_projected captures requested schema, obtains async tasks and wraps them with ordered buffering. Blocking counterpart uses optional/base projection, full validator, clones all infos, synchronously computes strategy.read_length and passes to blocking dispatcher. Uniform-length failures therefore surface before constructing blocking reader; async stream creation also awaits prepare but later task failures remain streamed. (rust/lance-file/src/reader.rs:2111-2140)

### Lines 2141-2157

FileReader::read_stream simply calls projected stream with cloned base projection and caller params/row batch/readahead/filter. No additional validation or decode work occurs in the wrapper. (rust/lance-file/src/reader.rs:2141-2157)

### Lines 2158-2185

ProjectedFileReader::try_open requires Some base projection before IO, reads metadata index, wraps scheduler with read_chunk_size, then calls indexed factory. This direct factory does not use prefers_indexed_metadata threshold or fall back to full metadata for unsupported shape/version. (rust/lance-file/src/reader.rs:2158-2185)

### Lines 2186-2220

Indexed factory first rejectsV1 with hardcoded legacy tags0,2, then requires explicit projection, selects version strategy and calls validate_indexed. Prefixes supplied cache by path and assembles Indexed engine. It does not load requested column protobufs yet, despite construction-time loading implications in type docs; loading happens in prepare. Injected scheduler is not chunk-configured here. (rust/lance-file/src/reader.rs:2186-2220)

### Lines 2221-2258

Projected full-metadata factory rejectsV1 with stored literal tags, selects strategy, defaults to whole schema when projectionNone, validates only explicit projection, prefixes cache by path and assembles Full engine. Unlike indexed factory it allows None; no selectivity or indexed-shape gate is applied. (rust/lance-file/src/reader.rs:2221-2258)

### Lines 2259-2285

Projected version delegates provider. read_tasks chooses optional requested projection or base default, passes only that projection/provider/IO/cache to strategy.prepare, then dispatches. No comparison to stored base_projection is performed here, and prepare is not given that base; this contradicts the type comment promising all later reads stay within base projection. Full enforcement through unrelated wrapper callers must not be inferred. (rust/lance-file/src/reader.rs:2259-2285)

### Lines 2286-2334

Public describe_encoding returns diagnostic text: indirect pos/size, direct decoded Any, explicit NoEncodingDescription, MISSING STYLE or MISSING. Invalid outer Any panics via expect; recognized /lance.encodings.ArrayEncoding and /lance.encodings21.PageLayout bodies pretty-Debug on success or Unsupported(decode_err=...) on failure; other type URLs return Unrecognized. Direct bytes clone; no IO, exact-version gate or generic guarantee that malformed metadata is safe to display. (rust/lance-file/src/reader.rs:2286-2334)

### Lines 2335-2374

Public EncodedBatchReaderExt declares mini-Lance(external core schema) and self-described constructors. Mini implementation decodes footer/current version, derives whole-schema projection, directly slices column-metadata/CMO region, normalizes through exact-version decoder, and retains entire input Bytes as data. num_rows is ordinary sum of first normalized column page.num_rows or0, not uniform-length/structural slot normalization. No GBO/schema validation or full file range guard before slice; malformed offsets can panic. (rust/lance-file/src/reader.rs:2335-2374)

### Lines 2375-2400

Self-described EncodedBatch constructor decodes footer/version, directly slices from GBO offset, decodes and validates descriptors, requires nonempty GBO, checked-ranges schema and decodes it. Discards FileDescriptor declared row count and derives projection from decoded schema. Out-of-range GBO start can panic before descriptor checks; missing optional schema can still unwrap-panic in decode_schema. (rust/lance-file/src/reader.rs:2375-2400)

### Lines 2401-2423

Self-described constructor directly slices metadata region, decodes all columns/version-specific infos and builds EncodedBatch retaining all input bytes, derived column indices and Arc schema. Row count again sums first physical normalized column page.num_rows or0, ignoring descriptor length and uniformity. No IO or data decoding occurs in either constructor. (rust/lance-file/src/reader.rs:2401-2423)

### Lines 2424-2440

cfg(test) private module begins; imports collections/Pin/Arc, Arrow dictionary/list/primitive arrays/readers, null/offset/scalar buffers, schema types and Bytes for local fixtures and assertions. (rust/lance-file/src/reader.rs:2424-2440)

### Lines 2441-2467

Remaining test imports provide async collection, blob metadata, batch projection/take extension, datagen, sparse-format constants, encoder/decoder utilities, cached file size, Tokio channel, fixture writer/cache and writer alignment. Inline imports later repeat some types; no source tests were run. (rust/lance-file/src/reader.rs:2441-2467)

### Lines 2468-2475

footer_version test helper reads two LEu16 values starting8 bytes before input end with unchecked subtraction/indexing. It does not verify40-byte footer, magic or accepted version; callers pass full payload or last8 bytes. (rust/lance-file/src/reader.rs:2468-2475)

### Lines 2476-2525

V2_3 sparse roundtrip fixture explicitly marks nullable Int32 and nullable List<Int32> roots sparse. Six primitive values[10,null,30,40,null,60]; list offsets[0,2,2,2,3,3,5], items[1,null,3,4,5], parent validity[true,false,true,true,true,true], exercising null parent, empty lists and null item. Writes one batch with default options. (rust/lance-file/src/reader.rs:2476-2525)

### Lines 2526-2602

Open sparse file, require exactly2 normalized columns and every existing page Structural SparseLayout (all could be vacuous for an empty page list, though subsequent full values constrain it). Full scan equals original one batch,1..5 equals slice(1,4), indices[0,3,5] equals Arrow take. All use no_filter,batch1024,readahead1; no blocking, indexed-metadata, filter or IO-count oracle. (rust/lance-file/src/reader.rs:2526-2602)

### Lines 2603-2657

V2_2 dictionary roundtrip builds all128 nonnegative Int8 keys0..127 and distinct strings value-N, nullable field but no actual nulls. Writes and reads one batch, asserting complete RecordBatch equality. It covers full positive Int8 dictionary capacity, not negative indices or all256 byte patterns. (rust/lance-file/src/reader.rs:2603-2657)

### Lines 2658-2677

create_some_file builds random Float64 score, nullable-child struct location{x,y:Float64}, List<Utf8> categories and Binary; adds LargeBinary only forV2_0. Generates100 batches of1000 rows and delegates fixture writer. Retains WrittenFile input data via helper; random generator defaults/encoding details are not inferred here. (rust/lance-file/src/reader.rs:2658-2677)

### Lines 2678-2693

create_wide_direct_file makes num_columns step-Int32 roots cN,100 batches*1000 rows, alwaysV2_1 default writer. Materialized input retention and test cost scale with width; no timing qualification. (rust/lance-file/src/reader.rs:2678-2693)

### Lines 2694-2714

create_wide_fixed_size_list_file makes cN fixed-size lists of4 nullable Float32 items, applies0.1 random null rate,4 batches*64 rows, V2_1. Item nullability and generator-produced parent nulls are distinct; no deterministic assertion of exact null count here. (rust/lance-file/src/reader.rs:2694-2714)

### Lines 2715-2745

create_wide_structural_file emits each group as nullable random struct{x,y:Int32} and List<Int32>, both with0.5 random nulls,4 batches*64 rows,V2_1. Transformer is boxed Fn(&RecordBatch)->RecordBatch for expected projection; no Send/Sync bound. (rust/lance-file/src/reader.rs:2715-2745)

### Lines 2746-2795

verify_expected sums original rows into u32, optionally transforms each expected batch, unwraps a first expected batch, then requires each actual batch length=min(remaining,read_size). Compares full RecordBatch slices across differing input/output batch boundaries, advancing/slicing both and decrementing remaining; finally asserts0. Assumes nonempty expected input and transforms preserve row counts; empty expected batches or totals exceeding u32 are not guarded. It enforces exact batching plus values/schema, not just total rows. (rust/lance-file/src/reader.rs:2746-2795)

### Lines 2796-2807

collect_read_tasks maps futures, ordered-buffers given readahead, eagerly collects complete Vec<RecordBatch> and unwraps errors. No byte/IO/timing assertion or readahead validation. (rust/lance-file/src/reader.rs:2796-2807)

### Lines 2808-2873

read_file_with_mutated_bytes writes a fresh resolved-version file, eagerly copies all bytes, finds every window matching nonempty pattern and requires exactlyone, patches at relative offset by unchecked slice then overwrites same object. Opens default reader with unwrap, so open failure panics instead of returning test Result; only read_stream creation/collection errors propagate. Reads RangeFull1024/readahead16/no_filter. Pattern matching/patch bounds and actual default validation setting are fixture assumptions. (rust/lance-file/src/reader.rs:2808-2873)

### Lines 2874-2936

Excess mini-block-count regression writes2048 UInt64 valuesV2_1, XORs file byte0 with0xf7, reopens successfully, then accepts either stream-creation or collection failure. Requires CorruptFile and message exceeding items_in_page. It does not pin failure timing or prove all malformed layouts are rejected. (rust/lance-file/src/reader.rs:2874-2936)

### Lines 2937-2992

Variable-width corruption matrixV2_1/V2_2/V2_3 writes Arrow dictionary Int32 keys repeating0..2 for300rows, values alpha/beta/gamma. Finds LEi32 suffix[5,9,14], patches tail at+8 to100000, requires CorruptFile containing out of bounds. Comments explain leading0 variation and default validate_on_decode disabled; oracle is actual error variant/message, not a dynamic flag assertion. (rust/lance-file/src/reader.rs:2937-2992)

### Lines 2993-3050

Storage-dictionary corruption matrixsame3versions uses plain Utf8 repeated300rows, metadata dict-size-ratio0.99 and dict-values-compression none. Patches offset9 at+4 in[5,9,14] to2, requires CorruptFile containing decreases. Comment attributes protection to DataBlockBuilder append boundary; this test only observes externally returned error, with no stage instrumentation. (rust/lance-file/src/reader.rs:2993-3050)

### Lines 3051-3100

Plain-string mini-block corruption matrixsame3versions uses3 strings alpha/beta/gamma. Finds chunk-relative LEi32 offsets[16,21,25,30] and patches+12 to100000. Requires CorruptFile/out of bounds. Unique byte-pattern helper fails loudly if encoding layout changes; no V2_0 case. (rust/lance-file/src/reader.rs:3051-3100)

### Lines 3101-3163

V2_0 full roundtrip uses100000-row mixed fixture, independently reads last8 footer bytes and asserts(0,3), determine_file_versionV2_0, then opens for read sizes32/1024/1048576. Asserts cached literal(0,3), foo=bar metadata, and exact content/batch sizing via verify_expected. No historical fixture or V2_1+ version matrix here. (rust/lance-file/src/reader.rs:3101-3163)

### Lines 3164-3195

EncodedBatch roundtrip matrix contains onlyV2_0; TODO saysV2_1 currently fails, not runtime evidence in this analysis. Uses10000rows Int32x and16-byte UTF8y, V2_0 strategy,4096cache/32MiBpage/keep_original=true/64alignment. Encodes once before two serialization modes. (rust/lance-file/src/reader.rs:3164-3195)

### Lines 3196-3233

Self-described and mini encodings both assert footer(2,0), reconstruct EncodedBatch, decode with no_filter/default plugins/false flag/Array layout/None, and require full equality to input. Mini passes external schema. Distinguishes embedded identity from ordinaryV2_0 file(0,3); no nested, corruption or mismatched external schema cases. (rust/lance-file/src/reader.rs:3196-3233)

### Lines 3234-3287

Projection matrixV2_0/V2_1/V2_2 uses mixed fixture, field-ID BTreeMap and empty projection. Literal requested column lists: score;location;categories;score.x;score+categories;score+location;location+categories;score.y+location+categories. For each runs field-ID and name projection construction; primitive score dotted suffix requests are literal test inputs, not corrected to location. (rust/lance-file/src/reader.rs:3234-3287)

### Lines 3288-3325

For each projection method, build projection using exact metadata version and either projected schema+ID mapping or whole schema+names; read projected full stream with batch1024/readahead16 and verify against Arrow project_by_schema transformed originals. Full output values and batching are asserted. (rust/lance-file/src/reader.rs:3288-3325)

### Lines 3326-3372

Reopen with same base projection, read via default read_stream and compare to transformed originals. Requesting empty projection must return some error from stream creation; no variant/message asserted. This tests base-as-default, not later projection subset enforcement. (rust/lance-file/src/reader.rs:3326-3372)

### Lines 3373-3408

Explicit empty base at open and duplicate physical indices[0,0] with two-field Int32 schema must error. Only is_err asserted; no out-of-range, shape/cardinality mismatch, type mismatch or base-widening case here. (rust/lance-file/src/reader.rs:3373-3408)

### Lines 3409-3472

V2_1 lazy direct projection c10 from16-column100000-row fixture compared against eager projected full scan; row batch127/readahead16. Complete Vec<RecordBatch> equality establishes same batching/schema/values as current eager baseline, not independent original-input correctness or lower IO. (rust/lance-file/src/reader.rs:3409-3472)

### Lines 3473-3515

Lazy metadata subset test writes512direct columns, selectsc0, opens indexed reader, sums selected/all CMO lengths and requires total metadata>8*object-store block_size. Open IO occurs before counter reset and is excluded from later measurements. Requested single-column length is diagnostic, not exact IO target. (rust/lance-file/src/reader.rs:3473-3515)

### Lines 3516-3561

After reset, Range0..0 triggers metadata preparation and yields no batches; requires bytes read<half total column metadata, not exactly selected bytes or one request. Repeating same empty range after another reset requires0read_iops/0bytes, proving warm metadata reuse for this fixture. Does not cover concurrent loading, eviction, failed partial loads or changed-file identity. (rust/lance-file/src/reader.rs:3516-3561)

### Lines 3562-3617

assert_lazy_projection_matches_eager_and_reads_metadata_subset opens an eager reader with full metadata, then reads the supplied column projection over RangeFull in127-row batches. It next opens a fresh-cache indexed reader for the same supplied projection. Computes all/selected CMO bytes and requires total>8*selected. Open cost is excluded from the subsequent measured zero-row read by resetting incremental IO statistics after both opens (rust/lance-file/src/reader.rs:3618-3649). Full metadata loading does not mean the baseline data read selects all file columns. (rust/lance-file/src/reader.rs:3562-3617)

### Lines 3618-3651

Shared lazy helper resets stats, collects empty Range0..0, asserts no batches and read_bytes<total/2, then full lazy scan and exact Vec equality to eager baseline. Returns actual output for caller null checks. It does not assert a second zero-IO metadata hit, exact request count, input equality or byte limit. (rust/lance-file/src/reader.rs:3618-3651)

### Lines 3652-3670

Fixed-size-list lazy test writes512V2_1 roots and projectsc17,c509. Requires selectivity helper true for512, then invokes shared metadata-subset and eager-equality oracle. It does not explicitly assert any nulls occurred. (rust/lance-file/src/reader.rs:3652-3670)

### Lines 3671-3702

V2_0 score projection prefers_indexed_metadata(100) must returntrue, yet ProjectedFileReader indexed open must fail NotSupported. This explicitly separates shape/selectivity from version capability; no message assertion. (rust/lance-file/src/reader.rs:3671-3702)

### Lines 3703-3747

Nested lazyV2_1 fixture128groups projects s97.y,l4,s3 in that order. Requires root names[ s97,l4,s3 ], selected children1/2,4physical indices and at leastone descending adjacent pair to exercise reorder. Selectivity is called with128*4 although fixture physical leaves are two perstruct plusone perlist; this is a supplied threshold input, not an assertion of true file column count. Shared helper checks IO/eager equality; final assertion requires at leastone projected top-level array with null_count>0. (rust/lance-file/src/reader.rs:3703-3747)

### Lines 3748-3775

CMO bounds unit matrix supplies(position90,length5) before100 and(190,20) beyond200 against one-entry16byte table, requires InvalidInput. No error-message, overflow, zero length, reversed footer, table-size mismatch or overlap cases here. (rust/lance-file/src/reader.rs:3748-3775)

### Lines 3776-3832

Opaque projection matrix sets either BLOB_META_KEY or lance-encoding:packed=true on root of ordinary location.x projection. Before mutation one child and selective shape true; opening withNone must InvalidInput. After mutation selectivity false and indexed open NotSupported. Synthetic projection metadata tests shape rejection, not a blob/packed file roundtrip; error messages unchecked. (rust/lance-file/src/reader.rs:3776-3832)

### Lines 3833-3889

Unequal indexedV2_1 fixture independently writes a=[1..5] andc=[100], then closure open_indexed builds requested name projection using shared scheduler/cache. Comment places length validation in DecodeEngine, while exact-version ReadProjection prepares/computes lengths; shared engine applies row bounds. (rust/lance-file/src/reader.rs:3833-3889)

### Lines 3890-3938

Opening indexed[a,c] succeeds; read_tasks RangeFull must fail before yielding its task stream and message containa=5,c=1 (variant not checked). Opening indexed[c] then full reading must produce exactly[Some100]. Proves compacted info alignment and projection-specific length; no common-prefix range, filter, base widening orV2_2/V2_3 test. (rust/lance-file/src/reader.rs:3890-3938)

### Lines 3939-3994

test_compressing_buffer writes defaultV2_0 first, then annotates only requested score projection with lance:compression=zstd and uses field IDs as column indices. Full stream verified against projected originals with1024batch. Because metadata is added after writing and no size/encoding check exists, this does not prove stored Zstd compression or compression savings. (rust/lance-file/src/reader.rs:3939-3994)

### Lines 3995-4031

test_read_all onV2_0 mixed fixture sets row batch equal total100000, collects all and requires exactlyone batch of total rows. No content/schema comparison in this test. (rust/lance-file/src/reader.rs:3995-4031)

### Lines 4032-4073

Page-read coalescing fixtureV2_1 writes10batches*10000step-Int32 rows with64KiB data cache. Comment calls40000raw bytes40KiB (approximation); metadata assertion requires>4pages, establishing multiple pages without exact flush/pagecount. (rust/lance-file/src/reader.rs:4032-4073)

### Lines 4074-4103

Local read_all closure full-scans100000rowbatch/readahead16. First full read warms page metadata, then counters reset; second scan must total100000rows and exactly1read_iop. Warm local fixture oracle excludes open/first-read costs, does not assert values, bytes read, cold IO or every backend. (rust/lance-file/src/reader.rs:4074-4103)

### Lines 4104-4139

Take-coalescing matrixV2_0/V2_1 writes16step-Int32 roots of256rows each. Comment assumes adjacent1KiB pages and4KiB local block behavior; actual layout is not directly asserted. Opens with full metadata/default settings. (rust/lance-file/src/reader.rs:4104-4139)

### Lines 4140-4172

take closure reads one index withbatch1/readahead1/no_filter. Warm take(3), reset IO, take(200) must useexactly1read_iop and first batch16columns each firstvalue200. Does not explicitly assert total batch/rowcount or cold-read IO; no filters tested. (rust/lance-file/src/reader.rs:4140-4172)

### Lines 4173-4224

Blocking take matrixV2_0/V2_1/V2_2 uses mixed fixture and base score projection; spawn_blocking consumes reader, collectsindices[0,1,2,3,4] with huge rowbatch. Asserts one batch,5rows,1column only; no value, filter or scheduler-thread count assertion. (rust/lance-file/src/reader.rs:4173-4224)

### Lines 4225-4264

Multi-thread TokioV2_0 drop test obtains full stream withbatchtotal/10, drops FileReader, successfully reads one nonempty batch, then drops active stream. Establishes retained stream usability and non-panicking synchronous drops in test; does not wait for background termination, count cancelled IO, or prove resources fully reclaimed. (rust/lance-file/src/reader.rs:4225-4264)

### Lines 4265-4318

drop_while_scheduling is aV2_0 white-box regression: builds DecodeBatchScheduler directly from whole projection, allinfos, empty auxiliary vector,totalrows,plugins,readerIO,testcache,no_filter/defaultconfig. Comment explains background scheduling cannot be gated through public stream. (rust/lance-file/src/reader.rs:4265-4318)

### Lines 4319-4334

White-box cancellation creates unboundedchannel, drops receiver before direct schedule_range(0..total,filter,tx,IO). Oracle is return without panic; no assert, await of background completion, thread join, leak or IO cancellation counter. (rust/lance-file/src/reader.rs:4319-4334)

### Lines 4335-4386

Empty-rangeV2_0 test requires Range0..0 yield0batches and Ranges[0..1,2..2] yield1batch. Does not assert that batch contents/rows or empty range-vector behavior, EOF RangeFrom, reversed ranges, indices emptiness/nulls. (rust/lance-file/src/reader.rs:4335-4386)

### Lines 4387-4408

write_file_with_global_buffer builds explicitV2_1 schema foo nullableInt32, adds user bytes before any data, requires returned index1 and finishes. File has no row writes; buffer0 is reserved schema. (rust/lance-file/src/reader.rs:4387-4408)

### Lines 4409-4450

Test-only Copy/Clone/Debug enums select Full/Indexed metadata path and Unaligned/PastEof/Overflowing corruption. Six rstest cases cross both paths with expected message substrings not aligned/outside file/overflows. (rust/lance-file/src/reader.rs:4409-4450)

### Lines 4451-4475

Invalid-GBO test writes hello global, reads all bytes and decodes footer, then corrupts the FIRST GBO descriptor (schema index0), not user buffer1. Unaligned=(1,0), pastEOF=nextalignmentboundary withsize0, overflow=largest alignedu64 plusone alignment. Overwrites file; arithmetic here is test fixture construction. (rust/lance-file/src/reader.rs:4451-4475)

### Lines 4476-4498

Each full/indexed metadata read must fail InvalidInput with case message. expect_err text says before metadata IO, but test has no IOcounter/timing assertion and both paths necessarily read tail/GBO first. It proves structured descriptor error before successful metadata return, not zero metadata requests. (rust/lance-file/src/reader.rs:4476-4498)

### Lines 4499-4549

Global-read matrixV2_1 uses hello fitting originaltail or2*block_size bytes7 outsidewindow. Opens full reader, requires index0not retained and index1retention exactlymatchescase, resets counters, reads1 and requires full byte equality plus0or1read_iops. No byte-count, repeated fallback caching, indexed-reader or schema-buffer-read oracle. (rust/lance-file/src/reader.rs:4499-4549)

### Lines 4550-4579

OrdinaryV2_1 mixed file without user globals must expose exactlyone descriptor and empty retained map. It does not call read_global_buffer(0) or test public API rejects schema; implementation allows it. (rust/lance-file/src/reader.rs:4550-4579)

### Lines 4580-4628

Deep-size regression matrixall4V2versions opens mixed fixture and requires metadata.deep_size_of()>1024. Comments motivate eviction/memory growth, but no cache population/eviction or allocation profiler is exercised. Bound only detects suspiciously small estimates. (rust/lance-file/src/reader.rs:4580-4628)

### Lines 4629-4643

Also require nonempty protobuf columns and deep_size>num_columns*50. This is one fixture perversion, not a comparison of increasing widths and not proof of accurate scaling or4x multiplier. (rust/lance-file/src/reader.rs:4629-4643)

### Lines 4644-4675

V2_1 hello-global fixture read index2 with exactly2descriptors must fail InvalidInput and rendered message contain character2. No stronger fullmessage/index-versuscount distinction or huge index test. (rust/lance-file/src/reader.rs:4644-4675)

### Lines 4676-4716

Synthetic struct-length matrix choosesV2_0orV2_1 helper. Two nullableInt32 children: structuralindices[0,1] lengths[5,5]/[5,3],V2_0indices[0,1,2] lengths[5,5,5]/[5,5,3]. Equalreturns5;unequalmessagecontainsdiffering lengths andb. Direct projection-length walk, no file decode or errorvariant assertion. Local run closure constructs schema; struct_ty closure builds childtype. (rust/lance-file/src/reader.rs:4676-4716)

### Lines 4717-4738

V2_0 unloadedblob unit marksLargeBinary BLOB=true, callsunloaded_mut, projectionphysicalindex0 and syntheticlength3. Versionhelper mustreturn3, treating blob asopaque rather than descending unloaded representation. No blob IO/value decoding. (rust/lance-file/src/reader.rs:4717-4738)

### Lines 4739-4765

Local validate closure selectsV2_0/V2_1 synthetichelper. List<Int32> requiresV2_0[listrows5,itemcount17] return5 andstructural[5]return5, proving child-cardinality boundary notequal-row enforcement. (rust/lance-file/src/reader.rs:4739-4765)

### Lines 4766-4795

List<Struct<a,b>> requiresV2_0indices[0,1,2,3] lengths[6,6,29,29] return6 without comparing children to rootrows. Structuraltwoleaflengths[29,29]return29; this syntheticcase does not reconstructactual rootlistrowcount6 from encoded data. Comments/fixture semantics should not be generalized beyond these input lengths. (rust/lance-file/src/reader.rs:4766-4795)

### Lines 4796-4804

EmptyStruct usesonecolumn andlength9 forbothV2_0 andV2_1, bothreturn9. Closes unitfunction andprivatecfgtestmodule. No unsafe blocks occur in this file; fallible-library unwrap/expect and unchecked slice/arithmetic concerns are documented above. (rust/lance-file/src/reader.rs:4796-4804)

## Interaction and interpretation limits

All4804 physical lines were read in complete bounded outputs during ANALYZE58. Tests inspected, not executed. This file contains no unsafe blocks, but includes fallible unwrap/expect, unchecked slicing/casts/arithmetic and logging-only empty-vector indexing documented per range. IO and byte decoder lifecycles are delegated to still-pending implementations. Type/comment promises, actual code and actual test oracles are distinguished; no runtime success, performance guarantee or full compatibility qualification is claimed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{
    5 |     borrow::Cow,
    6 |     collections::{BTreeMap, BTreeSet},
    7 |     fmt::Debug,
    8 |     io::Cursor,
    9 |     ops::Range,
   10 |     pin::Pin,
   11 |     sync::Arc,
   12 | };
   13 | 
   14 | use arrow_array::RecordBatchReader;
   15 | use arrow_schema::Schema as ArrowSchema;
   16 | use async_trait::async_trait;
   17 | use byteorder::{ByteOrder, LittleEndian, ReadBytesExt};
   18 | use bytes::{Bytes, BytesMut};
   19 | use futures::{Stream, StreamExt, stream::BoxStream};
   20 | use lance_core::deepsize::{Context, DeepSizeOf};
   21 | use lance_encoding::{
   22 |     EncodingsIo,
   23 |     decoder::{
   24 |         ColumnInfo, DecoderConfig, DecoderPlugins, FilterExpression, PageEncoding, ReadBatchTask,
   25 |         RequestedRows, SchedulerDecoderConfig, schedule_and_decode, schedule_and_decode_blocking,
   26 |     },
   27 |     encoder::EncodedBatch,
   28 | };
   29 | use log::debug;
   30 | use object_store::path::Path;
   31 | use prost::Message;
   32 | 
   33 | use lance_core::{
   34 |     Error, Result,
   35 |     cache::{CacheKey, CacheKeySchema, KeyBuilder, LanceCache},
   36 |     datatypes::{Field, Schema},
   37 | };
   38 | use lance_encoding::format::pb as pbenc;
   39 | use lance_encoding::format::pb21 as pbenc21;
   40 | use lance_io::{
   41 |     ReadBatchParams,
   42 |     scheduler::FileScheduler,
   43 |     stream::{RecordBatchStream, RecordBatchStreamAdapter},
   44 | };
   45 | 
   46 | use crate::{
   47 |     datatypes::{Fields, FieldsWithMeta},
   48 |     format::{MAGIC, pb, pbfile},
   49 |     io::LanceEncodingsIo,
   50 |     version::ConcreteFileVersion,
   51 |     versions,
   52 | };
   53 | 
   54 | pub(crate) mod structural;
   55 | 
   56 | /// Default chunk size for reading large pages (8MiB)
   57 | /// Pages larger than this will be split into multiple chunks during read
   58 | pub const DEFAULT_READ_CHUNK_SIZE: u64 = 8 * 1024 * 1024;
   59 | 
   60 | // For now, we don't use global buffers for anything other than schema.  If we
   61 | // use these later we should make them lazily loaded and then cached once loaded.
   62 | //
   63 | // We store their position / length for debugging purposes
   64 | #[derive(Debug, DeepSizeOf)]
   65 | pub struct BufferDescriptor {
   66 |     pub position: u64,
   67 |     pub size: u64,
   68 | }
   69 | 
   70 | impl BufferDescriptor {
   71 |     fn checked_range(&self, buffer_index: usize, file_len: u64) -> Result<Range<u64>> {
   72 |         let end = self.position.checked_add(self.size).ok_or_else(|| {
   73 |             Error::invalid_input_source(
   74 |                 format!(
   75 |                     "Global buffer {} range overflows: position={}, size={}",
   76 |                     buffer_index, self.position, self.size
   77 |                 )
   78 |                 .into(),
   79 |             )
   80 |         })?;
   81 |         if self.position > file_len {
   82 |             return Err(Error::invalid_input_source(
   83 |                 format!(
   84 |                     "Global buffer {} position {} is outside file of size {}",
   85 |                     buffer_index, self.position, file_len
   86 |                 )
   87 |                 .into(),
   88 |             ));
   89 |         }
   90 |         if end > file_len {
   91 |             return Err(Error::invalid_input_source(
   92 |                 format!(
   93 |                     "Global buffer {} range {}..{} is outside file of size {}",
   94 |                     buffer_index, self.position, end, file_len
   95 |                 )
   96 |                 .into(),
   97 |             ));
   98 |         }
   99 |         Ok(self.position..end)
  100 |     }
  101 | }
  102 | 
  103 | /// Statistics summarize some of the file metadata for quick summary info
  104 | #[derive(Debug)]
  105 | pub struct FileStatistics {
  106 |     /// Statistics about each of the columns in the file
  107 |     pub columns: Vec<ColumnStatistics>,
  108 | }
  109 | 
  110 | /// Summary information describing a column
  111 | #[derive(Debug)]
  112 | pub struct ColumnStatistics {
  113 |     /// The number of pages in the column
  114 |     pub num_pages: usize,
  115 |     /// The total number of data & metadata bytes in the column
  116 |     ///
  117 |     /// This is the compressed on-disk size
  118 |     pub size_bytes: u64,
  119 | }
  120 | 
  121 | // TODO: Caching
  122 | #[derive(Debug)]
  123 | pub struct CachedFileMetadata {
  124 |     /// The schema of the file
  125 |     pub file_schema: Arc<Schema>,
  126 |     /// The column metadatas
  127 |     pub column_metadatas: Vec<pbfile::ColumnMetadata>,
  128 |     pub column_infos: Vec<Arc<ColumnInfo>>,
  129 |     /// The number of rows in the file
  130 |     pub num_rows: u64,
  131 |     pub file_buffers: Vec<BufferDescriptor>,
  132 |     /// The number of bytes contained in the data page section of the file
  133 |     pub num_data_bytes: u64,
  134 |     /// The number of bytes contained in the column metadata (not including buffers
  135 |     /// referenced by the metadata)
  136 |     pub num_column_metadata_bytes: u64,
  137 |     /// The number of bytes contained in global buffers
  138 |     pub num_global_buffer_bytes: u64,
  139 |     /// The number of bytes contained in the CMO and GBO tables
  140 |     pub num_footer_bytes: u64,
  141 |     /// The major version number stored in the file footer.
  142 |     pub major_version: u16,
  143 |     /// The minor version number stored in the file footer.
  144 |     pub minor_version: u16,
  145 |     pub version: ConcreteFileVersion,
  146 |     /// The actual total file size in bytes, as reported by the object store.
  147 |     pub file_size_bytes: u64,
  148 |     /// User global buffers (index >= 1) whose bytes were already captured by the
  149 |     /// tail read that `read_all_metadata` performs at open, keyed by buffer index.
  150 |     ///
  151 |     /// All global buffers are laid out contiguously starting at the schema, so on
  152 |     /// small/medium files they land inside the captured tail window. Retaining
  153 |     /// those bytes lets `read_global_buffer` serve them with zero additional I/O.
  154 |     /// The bytes are copied out of the tail (rather than sliced) so the much
  155 |     /// larger tail allocation can be dropped — we only hold what we will serve.
  156 |     ///
  157 |     /// The schema (buffer 0) is excluded: it is already decoded at open and is
  158 |     /// not fetched through `read_global_buffer`. Buffers that fall outside the
  159 |     /// window (large files) are absent here and fall back to a dedicated read.
  160 |     pub retained_global_buffers: BTreeMap<u32, Bytes>,
  161 | }
  162 | 
  163 | impl CachedFileMetadata {
  164 |     /// Total file size in bytes.
  165 |     pub fn file_size(&self) -> u64 {
  166 |         self.file_size_bytes
  167 |     }
  168 | }
  169 | 
  170 | fn column_metadata_deep_size(column_metadatas: &[pbfile::ColumnMetadata]) -> usize {
  171 |     column_metadatas
  172 |         .iter()
  173 |         .map(|cm| cm.encoded_len() * 4)
  174 |         .sum::<usize>()
  175 |         + std::mem::size_of_val(column_metadatas)
  176 | }
  177 | 
  178 | impl DeepSizeOf for CachedFileMetadata {
  179 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  180 |         let schema_size = self.file_schema.deep_size_of_children(context);
  181 | 
  182 |         let buffers_size: usize = self
  183 |             .file_buffers
  184 |             .iter()
  185 |             .map(|fb| fb.deep_size_of_children(context))
  186 |             .sum();
  187 | 
  188 |         // column_metadatas is Vec<pbfile::ColumnMetadata> (protobuf generated,
  189 |         // does not implement DeepSizeOf). We use prost::Message::encoded_len()
  190 |         // as a proxy for in-memory size. The decoded representation is typically
  191 |         // several times larger than the wire format due to heap-allocated
  192 |         // repeated/string/bytes fields, so we apply a 4x multiplier.
  193 |         let column_metadatas_size = column_metadata_deep_size(self.column_metadatas.as_slice());
  194 | 
  195 |         // column_infos is Vec<Arc<ColumnInfo>>. Each ColumnInfo contains
  196 |         // page_infos (with protobuf PageEncoding), buffer offsets, and a
  197 |         // column-level ColumnEncoding protobuf.
  198 |         let column_infos_size = self.column_infos.deep_size_of_children(context);
  199 | 
  200 |         // Global buffer bytes retained for zero-IO reads (copied out of the tail).
  201 |         let retained_buffers_size = self.retained_global_buffers.deep_size_of_children(context);
  202 | 
  203 |         schema_size
  204 |             + buffers_size
  205 |             + column_metadatas_size
  206 |             + column_infos_size
  207 |             + retained_buffers_size
  208 |     }
  209 | }
  210 | 
  211 | /// Lightweight file metadata used to locate per-column metadata on demand.
  212 | ///
  213 | /// This contains the file-level schema, row count, global buffer descriptors,
  214 | /// and column metadata offset table. Unlike [`CachedFileMetadata`], it does not
  215 | /// hold decoded metadata for every column.
  216 | #[derive(Debug, DeepSizeOf)]
  217 | pub struct FileMetadataIndex {
  218 |     pub(crate) file_schema: Arc<Schema>,
  219 |     pub(crate) num_rows: u64,
  220 |     pub(crate) file_buffers: Vec<BufferDescriptor>,
  221 |     pub(crate) column_metadata_offsets: Arc<[(u64, u64)]>,
  222 |     pub(crate) num_columns: u32,
  223 |     pub(crate) version: ConcreteFileVersion,
  224 |     pub(crate) file_size_bytes: u64,
  225 |     pub(crate) retained_global_buffers: BTreeMap<u32, Bytes>,
  226 | }
  227 | 
  228 | impl FileMetadataIndex {
  229 |     /// Returns the total size of the file in bytes.
  230 |     pub fn file_size(&self) -> u64 {
  231 |         self.file_size_bytes
  232 |     }
  233 | 
  234 |     /// Returns the number of physical columns in the file.
  235 |     pub fn num_columns(&self) -> u32 {
  236 |         self.num_columns
  237 |     }
  238 | }
  239 | 
  240 | #[derive(Debug)]
  241 | struct CachedColumnMetadata {
  242 |     column_metadata: pbfile::ColumnMetadata,
  243 |     column_info: Arc<ColumnInfo>,
  244 | }
  245 | 
  246 | impl DeepSizeOf for CachedColumnMetadata {
  247 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  248 |         column_metadata_deep_size(std::slice::from_ref(&self.column_metadata))
  249 |             + self.column_info.deep_size_of_children(context)
  250 |     }
  251 | }
  252 | 
  253 | #[derive(Debug, Clone)]
  254 | struct ColumnMetadataCacheKey {
  255 |     column_index: u32,
  256 | }
  257 | 
  258 | impl CacheKey for ColumnMetadataCacheKey {
  259 |     type ValueType = CachedColumnMetadata;
  260 | 
  261 |     fn key(&self) -> Cow<'_, str> {
  262 |         Cow::Owned(format!("column_metadata/{}", self.column_index))
  263 |     }
  264 | 
  265 |     fn type_name() -> &'static str {
  266 |         "ColumnMetadata"
  267 |     }
  268 | 
  269 |     fn schema() -> CacheKeySchema {
  270 |         CacheKeySchema::new("lance.file.column-metadata-key", 1)
  271 |     }
  272 | 
  273 |     fn write_key(&self, builder: &mut KeyBuilder) {
  274 |         builder.write_u32(self.column_index);
  275 |     }
  276 | }
  277 | 
  278 | impl CachedFileMetadata {
  279 |     pub fn version(&self) -> ConcreteFileVersion {
  280 |         self.version
  281 |     }
  282 | }
  283 | 
  284 | /// Selecting columns from a lance file requires specifying both the
  285 | /// index of the column and the data type of the column
  286 | ///
  287 | /// Partly, this is because it is not strictly required that columns
  288 | /// be read into the same type.  For example, a string column may be
  289 | /// read as a string, large_string or string_view type.
  290 | ///
  291 | /// A read will only succeed if the decoder for a column is capable
  292 | /// of decoding into the requested type.
  293 | ///
  294 | /// Note that this should generally be limited to different in-memory
  295 | /// representations of the same semantic type.  An encoding could
  296 | /// theoretically support "casting" (e.g. int to string, etc.) but
  297 | /// there is little advantage in doing so here.
  298 | ///
  299 | /// Note: in order to specify a projection the user will need some way
  300 | /// to figure out the column indices.  In the table format we do this
  301 | /// using field IDs and keeping track of the field id->column index mapping.
  302 | ///
  303 | /// If users are not using the table format then they will need to figure
  304 | /// out some way to do this themselves.
  305 | #[derive(Debug, Clone)]
  306 | pub struct ReaderProjection {
  307 |     /// The data types (schema) of the selected columns.  The names
  308 |     /// of the schema are arbitrary and ignored.
  309 |     pub schema: Arc<Schema>,
  310 |     /// The indices of the columns to load.
  311 |     ///
  312 |     /// The content of this vector depends on the file version.
  313 |     ///
  314 |     /// In Lance File Version 2.0 we need ids for structural fields as
  315 |     /// well as leaf fields:
  316 |     ///
  317 |     ///   - Primitive: the index of the column in the schema
  318 |     ///   - List: the index of the list column in the schema
  319 |     ///     followed by the column indices of the children
  320 |     ///   - FixedSizeList (of primitive): the index of the column in the schema
  321 |     ///     (this case is not nested)
  322 |     ///   - FixedSizeList (of non-primitive): not yet implemented
  323 |     ///   - Dictionary: same as primitive
  324 |     ///   - Struct: the index of the struct column in the schema
  325 |     ///     followed by the column indices of the children
  326 |     ///
  327 |     ///   In other words, this should be a DFS listing of the desired schema.
  328 |     ///
  329 |     /// In Lance File Version 2.1 we only need ids for leaf fields.  Any structural
  330 |     /// fields are completely transparent.
  331 |     ///
  332 |     /// For example, if the goal is to load:
  333 |     ///
  334 |     ///   x: int32
  335 |     ///   y: `struct<z: int32, w: string>`
  336 |     ///   z: `list<int32>`
  337 |     ///
  338 |     /// and the schema originally used to store the data was:
  339 |     ///
  340 |     ///   a: `struct<x: int32>`
  341 |     ///   b: int64
  342 |     ///   y: `struct<z: int32, c: int64, w: string>`
  343 |     ///   z: `list<int32>`
  344 |     ///
  345 |     /// Then the column_indices should be:
  346 |     ///
  347 |     /// - 2.0: [1, 3, 4, 6, 7, 8]
  348 |     /// - 2.1: [0, 2, 4, 5]
  349 |     pub column_indices: Vec<u32>,
  350 | }
  351 | 
  352 | impl ReaderProjection {
  353 |     /// Returns whether this projection is selective enough to benefit from
  354 |     /// loading column metadata through the file's metadata index.
  355 |     ///
  356 |     /// The caller must already have selected a file format that supports indexed
  357 |     /// metadata. This method only evaluates the projection shape and selectivity.
  358 |     pub fn prefers_indexed_metadata(&self, total_columns: usize) -> bool {
  359 |         FileMetadataProvider::projection_matches_indexed_metadata(self)
  360 |             && self.column_indices.len().saturating_mul(4) < total_columns
  361 |     }
  362 | }
  363 | 
  364 | /// File Reader Options that can control reading behaviors, such as whether to enable caching on repetition indices
  365 | #[derive(Clone, Debug)]
  366 | pub struct FileReaderOptions {
  367 |     pub decoder_config: DecoderConfig,
  368 |     /// Size of chunks when reading large pages. Pages larger than this
  369 |     /// will be read in multiple chunks to control memory usage.
  370 |     /// Default: 8MB (DEFAULT_READ_CHUNK_SIZE)
  371 |     pub read_chunk_size: u64,
  372 |     /// If set, the reader will produce batches whose total size in bytes
  373 |     /// is approximately this value. The row-based `batch_size` remains an
  374 |     /// independent upper bound, and the limit reached first determines the batch size.
  375 |     ///
  376 |     /// This can be set at the dataset level (via `ReadParams::file_reader_options`)
  377 |     /// to provide a default for all scans, or at the scanner level (via
  378 |     /// `Scanner::batch_size_bytes`) to override per scan.
  379 |     pub batch_size_bytes: Option<u64>,
  380 | }
  381 | 
  382 | impl Default for FileReaderOptions {
  383 |     fn default() -> Self {
  384 |         Self {
  385 |             decoder_config: DecoderConfig::default(),
  386 |             read_chunk_size: DEFAULT_READ_CHUNK_SIZE,
  387 |             batch_size_bytes: None,
  388 |         }
  389 |     }
  390 | }
  391 | 
  392 | #[derive(Debug, Clone)]
  393 | pub(crate) struct PreparedProjection {
  394 |     pub column_infos: Vec<Arc<ColumnInfo>>,
  395 |     pub decoder_projection: ReaderProjection,
  396 | }
  397 | 
  398 | #[derive(Debug, Clone)]
  399 | pub(crate) enum FileMetadataProvider {
  400 |     Full(Arc<CachedFileMetadata>),
  401 |     Indexed(Arc<FileMetadataIndex>),
  402 | }
  403 | 
  404 | /// Executable projection behavior selected by an exact file-version module.
  405 | ///
  406 | /// The shared reader invokes this behavior but never interprets a version or
  407 | /// accepted-grammar profile.
  408 | #[async_trait]
  409 | pub(crate) trait ReadProjection: Debug + Send + Sync {
  410 |     fn validate_indexed(
  411 |         &self,
  412 |         projection: &ReaderProjection,
  413 |         metadata_index: &FileMetadataIndex,
  414 |     ) -> Result<()>;
  415 | 
  416 |     fn read_length(&self, prepared: &PreparedProjection) -> Result<u64>;
  417 | 
  418 |     async fn prepare(
  419 |         &self,
  420 |         metadata_provider: &FileMetadataProvider,
  421 |         projection: &ReaderProjection,
  422 |         io: &Arc<dyn EncodingsIo>,
  423 |         cache: &Arc<LanceCache>,
  424 |     ) -> Result<(PreparedProjection, u64)>;
  425 | }
  426 | 
  427 | #[derive(Debug, Clone)]
  428 | pub(crate) struct DecodeEngine {
  429 |     pub scheduler: Arc<dyn EncodingsIo>,
  430 |     pub base_projection: ReaderProjection,
  431 |     pub metadata_provider: FileMetadataProvider,
  432 |     pub read_projection: Arc<dyn ReadProjection>,
  433 |     pub decoder_plugins: Arc<DecoderPlugins>,
  434 |     pub cache: Arc<LanceCache>,
  435 |     pub options: FileReaderOptions,
  436 | }
  437 | 
  438 | /// A projection-scoped reader for a current-format Lance file.
  439 | ///
  440 | /// This reader fixes a base projection at construction time. All later reads
  441 | /// must stay within that projection, which lets the reader load only the column
  442 | /// metadata needed by the base projection when opening from a [`FileMetadataIndex`].
  443 | /// It intentionally does not expose APIs that require synchronous access to full
  444 | /// file metadata.
  445 | #[derive(Debug, Clone)]
  446 | pub struct ProjectedFileReader {
  447 |     core: DecodeEngine,
  448 | }
  449 | 
  450 | /// A current-format Lance file reader backed by fully decoded metadata.
  451 | #[derive(Debug, Clone)]
  452 | pub struct FileReader {
  453 |     pub(crate) core: DecodeEngine,
  454 |     pub(crate) metadata: Arc<CachedFileMetadata>,
  455 | }
  456 | 
  457 | pub(crate) fn tasks_to_record_batch_stream(
  458 |     schema: Arc<Schema>,
  459 |     tasks: Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>,
  460 |     batch_readahead: u32,
  461 | ) -> Pin<Box<dyn RecordBatchStream>> {
  462 |     let arrow_schema = Arc::new(ArrowSchema::from(schema.as_ref()));
  463 |     let batches = tasks
  464 |         .map(|task| task.task)
  465 |         .buffered(batch_readahead as usize)
  466 |         .boxed();
  467 |     Box::pin(RecordBatchStreamAdapter::new(arrow_schema, batches))
  468 | }
  469 | 
  470 | pub(crate) enum RawFileMetadataOpen {
  471 |     Legacy {
  472 |         major_version: u16,
  473 |         minor_version: u16,
  474 |     },
  475 |     Current {
  476 |         version: ConcreteFileVersion,
  477 |         metadata: RawFileMetadata,
  478 |     },
  479 | }
  480 | 
  481 | pub(crate) struct RawFileMetadata {
  482 |     pub file_schema: Arc<Schema>,
  483 |     pub column_metadatas: Vec<pbfile::ColumnMetadata>,
  484 |     pub num_rows: u64,
  485 |     pub file_buffers: Vec<BufferDescriptor>,
  486 |     pub num_data_bytes: u64,
  487 |     pub num_column_metadata_bytes: u64,
  488 |     pub num_global_buffer_bytes: u64,
  489 |     pub num_footer_bytes: u64,
  490 |     pub footer: Footer,
  491 |     pub file_size_bytes: u64,
  492 |     pub retained_global_buffers: BTreeMap<u32, Bytes>,
  493 | }
  494 | 
  495 | #[derive(Debug)]
  496 | pub(crate) struct Footer {
  497 |     #[allow(dead_code)]
  498 |     pub column_meta_start: u64,
  499 |     // We don't use this today because we always load metadata for every column
  500 |     // and don't yet support "metadata projection"
  501 |     #[allow(dead_code)]
  502 |     pub column_meta_offsets_start: u64,
  503 |     pub global_buff_offsets_start: u64,
  504 |     pub num_global_buffers: u32,
  505 |     pub num_columns: u32,
  506 |     pub major_version: u16,
  507 |     pub minor_version: u16,
  508 | }
  509 | 
  510 | const FOOTER_LEN: usize = 40;
  511 | 
  512 | // Count the V2.1 physical columns required to reconstruct a projected field.
  513 | // This is the same DFS shape consumed by `ColumnInfoIter`: ordinary structural
  514 | // nodes are transparent and leaves contribute columns. Indexed metadata loading
  515 | // can therefore compact any ordinary structural projection into 0..N while
  516 | // preserving this order.
  517 | //
  518 | // Blob and packed-struct fields remain unsupported by indexed projection. Their
  519 | // opaque decode semantics are handled by the existing full-metadata reader.
  520 | fn indexed_projection_column_count(field: &Field) -> Option<usize> {
  521 |     if field.is_blob() || field.is_packed_struct() {
  522 |         return None;
  523 |     }
  524 | 
  525 |     if field.children.is_empty() {
  526 |         return Some(1);
  527 |     }
  528 | 
  529 |     field.children.iter().try_fold(0usize, |count, child| {
  530 |         count.checked_add(indexed_projection_column_count(child)?)
  531 |     })
  532 | }
  533 | 
  534 | // The reader combines a projection's columns into rectangular batches, so they
  535 | // must all have the same length.  Returns that common length, or a descriptive
  536 | // error (naming each column's length) when they differ. Ordinary files always
  537 | // pass; only files written with `FileWriter::write_column` whose columns ended up
  538 | // unequal can fail, and those must be read separately.
  539 | pub(crate) fn normalized_column_num_rows(info: &ColumnInfo) -> Result<u64> {
  540 |     info.page_infos.iter().try_fold(0_u64, |rows, page| {
  541 |         let page_rows = match &page.encoding {
  542 |             PageEncoding::Structural(layout) => match &layout.layout {
  543 |                 Some(pbenc21::page_layout::Layout::SparseLayout(sparse)) => sparse
  544 |                     .structural_layers
  545 |                     .first()
  546 |                     .and_then(|layer| layer.layer.as_ref())
  547 |                     .map_or(page.num_rows, |layer| match layer {
  548 |                         pbenc21::sparse_structural_layer::Layer::Validity(layer) => layer.num_slots,
  549 |                         pbenc21::sparse_structural_layer::Layer::List(layer) => layer.num_slots,
  550 |                         pbenc21::sparse_structural_layer::Layer::FixedSizeList(layer) => {
  551 |                             layer.num_slots
  552 |                         }
  553 |                     }),
  554 |                 _ => page.num_rows,
  555 |             },
  556 |             _ => page.num_rows,
  557 |         };
  558 |         rows.checked_add(page_rows)
  559 |             .ok_or_else(|| Error::invalid_input_source("Column row count overflows u64".into()))
  560 |     })
  561 | }
  562 | 
  563 | pub(crate) fn verify_uniform_lengths(field_lengths: &[(&str, u64)]) -> Result<u64> {
  564 |     let first = field_lengths.first().map_or(0, |&(_, len)| len);
  565 |     if field_lengths.iter().all(|&(_, len)| len == first) {
  566 |         return Ok(first);
  567 |     }
  568 |     let columns = field_lengths
  569 |         .iter()
  570 |         .map(|(name, len)| format!("{name}={len}"))
  571 |         .collect::<Vec<_>>()
  572 |         .join(", ");
  573 |     Err(Error::invalid_input(format!(
  574 |         "cannot read columns of differing lengths together ({columns}); \
  575 |          read each column (or equal-length group) separately"
  576 |     )))
  577 | }
  578 | 
  579 | impl FileReader {
  580 |     pub(crate) fn base_projection(&self) -> &ReaderProjection {
  581 |         &self.core.base_projection
  582 |     }
  583 | 
  584 |     pub(crate) fn full_projection(&self, projection: ReaderProjection) -> PreparedProjection {
  585 |         PreparedProjection {
  586 |             column_infos: self.metadata.column_infos.clone(),
  587 |             decoder_projection: projection,
  588 |         }
  589 |     }
  590 | 
  591 |     pub(crate) async fn read_prepared_tasks(
  592 |         &self,
  593 |         params: ReadBatchParams,
  594 |         batch_size: u32,
  595 |         prepared: PreparedProjection,
  596 |         read_len: u64,
  597 |         filter: FilterExpression,
  598 |     ) -> Result<Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>> {
  599 |         self.core
  600 |             .read_prepared_tasks(params, batch_size, prepared, read_len, filter)
  601 |             .await
  602 |     }
  603 | 
  604 |     pub fn with_scheduler(&self, scheduler: Arc<dyn EncodingsIo>) -> Self {
  605 |         Self {
  606 |             core: self.core.with_scheduler(scheduler),
  607 |             metadata: self.metadata.clone(),
  608 |         }
  609 |     }
  610 | 
  611 |     /// Returns a clone of this reader whose I/O is additionally recorded into
  612 |     /// `stats`, on top of the scheduler's global accounting.
  613 |     ///
  614 |     /// All cached metadata is shared with `self`, so no file is re-opened and
  615 |     /// only a few `Arc` clones are performed.  If the underlying I/O service
  616 |     /// does not support per-scope statistics (e.g. an in-memory scheduler), the
  617 |     /// returned reader is an ordinary, uninstrumented clone.
  618 |     pub fn with_io_stats(
  619 |         &self,
  620 |         stats: Arc<dyn lance_core::utils::io_stats::IoStatsRecorder>,
  621 |     ) -> Self {
  622 |         match self.core.scheduler.with_io_stats(stats) {
  623 |             Some(scheduler) => self.with_scheduler(scheduler),
  624 |             None => self.clone(),
  625 |         }
  626 |     }
  627 | 
  628 |     pub fn num_rows(&self) -> u64 {
  629 |         self.core.num_rows()
  630 |     }
  631 | 
  632 |     /// The number of rows stored in a single physical column.
  633 |     ///
  634 |     /// For ordinary (rectangular) files every column has the same length, equal
  635 |     /// to [`num_rows`](Self::num_rows). Files written with
  636 |     /// [`FileWriter::write_column`](crate::writer::FileWriter::write_column)
  637 |     /// may have columns of differing lengths; this returns the length of one
  638 |     /// such column, derived by summing its pages' row counts. Errors if
  639 |     /// `column_index` is out of bounds.
  640 |     pub fn column_num_rows(&self, column_index: usize) -> Result<u64> {
  641 |         let column = self
  642 |             .metadata
  643 |             .column_metadatas
  644 |             .get(column_index)
  645 |             .ok_or_else(|| {
  646 |                 Error::invalid_input(format!(
  647 |                     "column index {} is out of bounds (file has {} columns)",
  648 |                     column_index,
  649 |                     self.metadata.column_metadatas.len()
  650 |                 ))
  651 |             })?;
  652 |         Ok(column.pages.iter().map(|page| page.length).sum())
  653 |     }
  654 | 
  655 |     pub fn metadata(&self) -> &Arc<CachedFileMetadata> {
  656 |         &self.metadata
  657 |     }
  658 | 
  659 |     fn statistics_from_column_metadata(
  660 |         column_metadatas: &[pbfile::ColumnMetadata],
  661 |     ) -> FileStatistics {
  662 |         let column_stats = column_metadatas
  663 |             .iter()
  664 |             .map(|col_metadata| {
  665 |                 let num_pages = col_metadata.pages.len();
  666 |                 let size_bytes = col_metadata
  667 |                     .pages
  668 |                     .iter()
  669 |                     .map(|page| page.buffer_sizes.iter().sum::<u64>())
  670 |                     .sum::<u64>();
  671 |                 ColumnStatistics {
  672 |                     num_pages,
  673 |                     size_bytes,
  674 |                 }
  675 |             })
  676 |             .collect();
  677 | 
  678 |         FileStatistics {
  679 |             columns: column_stats,
  680 |         }
  681 |     }
  682 | 
  683 |     pub fn file_statistics(&self) -> FileStatistics {
  684 |         Self::statistics_from_column_metadata(&self.metadata().column_metadatas)
  685 |     }
  686 | 
  687 |     pub async fn read_global_buffer(&self, index: u32) -> Result<Bytes> {
  688 |         self.core.read_global_buffer(index).await
  689 |     }
  690 | 
  691 |     async fn read_tail(scheduler: &FileScheduler) -> Result<(Bytes, u64)> {
  692 |         let file_size = scheduler.reader().size().await? as u64;
  693 |         let begin = if file_size < scheduler.reader().block_size() as u64 {
  694 |             0
  695 |         } else {
  696 |             file_size - scheduler.reader().block_size() as u64
  697 |         };
  698 |         let tail_bytes = scheduler.submit_single(begin..file_size, 0).await?;
  699 |         Ok((tail_bytes, file_size))
  700 |     }
  701 | 
  702 |     async fn read_range_from_tail_or_scheduler(
  703 |         tail_bytes: &Bytes,
  704 |         tail_offset: u64,
  705 |         scheduler: &FileScheduler,
  706 |         range: Range<u64>,
  707 |     ) -> Result<Bytes> {
  708 |         let tail_end = tail_offset + tail_bytes.len() as u64;
  709 |         if range.start >= tail_offset && range.end <= tail_end {
  710 |             let rel_start = (range.start - tail_offset) as usize;
  711 |             let rel_end = (range.end - tail_offset) as usize;
  712 |             Ok(tail_bytes.slice(rel_start..rel_end))
  713 |         } else {
  714 |             scheduler.submit_single(range, 0).await
  715 |         }
  716 |     }
  717 | 
  718 |     fn retained_global_buffers_from_tail(
  719 |         gbo_table: &[BufferDescriptor],
  720 |         tail_bytes: &Bytes,
  721 |         tail_offset: u64,
  722 |         file_len: u64,
  723 |     ) -> Result<BTreeMap<u32, Bytes>> {
  724 |         let tail_end = tail_offset
  725 |             .checked_add(tail_bytes.len() as u64)
  726 |             .ok_or_else(|| Error::invalid_input_source("Tail byte range overflows".into()))?;
  727 |         let mut retained_buffers = BTreeMap::new();
  728 |         for (index, buffer) in gbo_table.iter().enumerate().skip(1) {
  729 |             let range = buffer.checked_range(index, file_len)?;
  730 |             if range.start >= tail_offset && range.end <= tail_end {
  731 |                 let rel_start = (range.start - tail_offset) as usize;
  732 |                 let rel_end = (range.end - tail_offset) as usize;
  733 |                 let bytes = Bytes::copy_from_slice(&tail_bytes[rel_start..rel_end]);
  734 |                 retained_buffers.insert(index as u32, bytes);
  735 |             }
  736 |         }
  737 |         Ok(retained_buffers)
  738 |     }
  739 | 
  740 |     // Checks to make sure the footer is written correctly and returns the
  741 |     // position of the file descriptor (which comes from the footer)
  742 |     fn decode_footer(footer_bytes: &Bytes) -> Result<Footer> {
  743 |         let len = footer_bytes.len();
  744 |         if len < FOOTER_LEN {
  745 |             return Err(Error::invalid_input(format!(
  746 |                 "does not have sufficient data, len: {}, bytes: {:?}",
  747 |                 len, footer_bytes
  748 |             )));
  749 |         }
  750 |         let mut cursor = Cursor::new(footer_bytes.slice(len - FOOTER_LEN..));
  751 | 
  752 |         let column_meta_start = cursor.read_u64::<LittleEndian>()?;
  753 |         let column_meta_offsets_start = cursor.read_u64::<LittleEndian>()?;
  754 |         let global_buff_offsets_start = cursor.read_u64::<LittleEndian>()?;
  755 |         let num_global_buffers = cursor.read_u32::<LittleEndian>()?;
  756 |         let num_columns = cursor.read_u32::<LittleEndian>()?;
  757 |         let major_version = cursor.read_u16::<LittleEndian>()?;
  758 |         let minor_version = cursor.read_u16::<LittleEndian>()?;
  759 | 
  760 |         let magic_bytes = footer_bytes.slice(len - 4..);
  761 |         if magic_bytes.as_ref() != MAGIC {
  762 |             return Err(Error::invalid_input(format!(
  763 |                 "file does not appear to be a Lance file (invalid magic: {:?})",
  764 |                 MAGIC
  765 |             )));
  766 |         }
  767 |         Ok(Footer {
  768 |             column_meta_start,
  769 |             column_meta_offsets_start,
  770 |             global_buff_offsets_start,
  771 |             num_global_buffers,
  772 |             num_columns,
  773 |             major_version,
  774 |             minor_version,
  775 |         })
  776 |     }
  777 | 
  778 |     fn current_file_version(footer: &Footer) -> Result<ConcreteFileVersion> {
  779 |         let version =
  780 |             ConcreteFileVersion::from_footer_numbers(footer.major_version, footer.minor_version)?;
  781 |         match version {
  782 |             ConcreteFileVersion::V1 => Err(Error::version_conflict(
  783 |                 "Attempt to use the lance v2 reader to read a legacy file".to_string(),
  784 |                 footer.major_version,
  785 |                 footer.minor_version,
  786 |             )),
  787 |             ConcreteFileVersion::V2_0
  788 |             | ConcreteFileVersion::V2_1
  789 |             | ConcreteFileVersion::V2_2
  790 |             | ConcreteFileVersion::V2_3 => Ok(version),
  791 |         }
  792 |     }
  793 | 
  794 |     // TODO: Once we have coalesced I/O we should only read the column metadatas that we need
  795 |     fn read_all_column_metadata(
  796 |         column_metadata_bytes: Bytes,
  797 |         footer: &Footer,
  798 |     ) -> Result<Vec<pbfile::ColumnMetadata>> {
  799 |         let column_metadata_start = footer.column_meta_start;
  800 |         // cmo == column_metadata_offsets
  801 |         let cmo_table_size = 16 * footer.num_columns as usize;
  802 |         if column_metadata_bytes.len() < cmo_table_size {
  803 |             return Err(Error::invalid_input(format!(
  804 |                 "column metadata region has {} bytes but CMO table needs {} bytes for {} columns",
  805 |                 column_metadata_bytes.len(),
  806 |                 cmo_table_size,
  807 |                 footer.num_columns
  808 |             )));
  809 |         }
  810 |         let cmo_table = column_metadata_bytes.slice(column_metadata_bytes.len() - cmo_table_size..);
  811 |         let column_metadata_offsets = Self::decode_cmo_table(cmo_table, footer)?;
  812 | 
  813 |         column_metadata_offsets
  814 |             .iter()
  815 |             .map(|(position, length)| {
  816 |                 let normalized_position = (*position - column_metadata_start) as usize;
  817 |                 let normalized_end = normalized_position + (*length as usize);
  818 |                 Ok(pbfile::ColumnMetadata::decode(
  819 |                     &column_metadata_bytes[normalized_position..normalized_end],
  820 |                 )?)
  821 |             })
  822 |             .collect::<Result<Vec<_>>>()
  823 |     }
  824 | 
  825 |     fn decode_cmo_table(cmo_table: Bytes, footer: &Footer) -> Result<Arc<[(u64, u64)]>> {
  826 |         let expected_size = 16 * footer.num_columns as usize;
  827 |         if cmo_table.len() != expected_size {
  828 |             return Err(Error::invalid_input(format!(
  829 |                 "column metadata offset table has {} bytes but expected {} bytes for {} columns",
  830 |                 cmo_table.len(),
  831 |                 expected_size,
  832 |                 footer.num_columns
  833 |             )));
  834 |         }
  835 | 
  836 |         let mut offsets = Vec::with_capacity(footer.num_columns as usize);
  837 |         for col_idx in 0..footer.num_columns {
  838 |             let offset = (col_idx * 16) as usize;
  839 |             let position = LittleEndian::read_u64(&cmo_table[offset..offset + 8]);
  840 |             let length = LittleEndian::read_u64(&cmo_table[offset + 8..offset + 16]);
  841 |             let end = position.checked_add(length).ok_or_else(|| {
  842 |                 Error::invalid_input(format!(
  843 |                     "column metadata range overflows for column index {}, position={}, length={}",
  844 |                     col_idx, position, length
  845 |                 ))
  846 |             })?;
  847 |             if position < footer.column_meta_start || end > footer.column_meta_offsets_start {
  848 |                 return Err(Error::invalid_input(format!(
  849 |                     "column metadata range for column index {} is outside metadata region: position={}, length={}, metadata_start={}, cmo_start={}",
  850 |                     col_idx,
  851 |                     position,
  852 |                     length,
  853 |                     footer.column_meta_start,
  854 |                     footer.column_meta_offsets_start
  855 |                 )));
  856 |             }
  857 |             offsets.push((position, length));
  858 |         }
  859 | 
  860 |         Ok(Arc::from(offsets))
  861 |     }
  862 | 
  863 |     async fn optimistic_tail_read(
  864 |         data: &Bytes,
  865 |         start_pos: u64,
  866 |         scheduler: &FileScheduler,
  867 |         file_len: u64,
  868 |     ) -> Result<Bytes> {
  869 |         let num_bytes_needed = file_len.checked_sub(start_pos).ok_or_else(|| {
  870 |             Error::invalid_input_source(
  871 |                 format!(
  872 |                     "Tail read position {} is outside file of size {}",
  873 |                     start_pos, file_len
  874 |                 )
  875 |                 .into(),
  876 |             )
  877 |         })? as usize;
  878 |         if data.len() >= num_bytes_needed {
  879 |             Ok(data.slice((data.len() - num_bytes_needed)..))
  880 |         } else {
  881 |             let num_bytes_missing = (num_bytes_needed - data.len()) as u64;
  882 |             let start = file_len - num_bytes_needed as u64;
  883 |             let missing_bytes = scheduler
  884 |                 .submit_single(start..start + num_bytes_missing, 0)
  885 |                 .await?;
  886 |             let mut combined = BytesMut::with_capacity(data.len() + num_bytes_missing as usize);
  887 |             combined.extend(missing_bytes);
  888 |             combined.extend(data);
  889 |             Ok(combined.freeze())
  890 |         }
  891 |     }
  892 | 
  893 |     fn do_decode_gbo_table(gbo_bytes: &Bytes, footer: &Footer) -> Result<Vec<BufferDescriptor>> {
  894 |         let mut global_bufs_cursor = Cursor::new(gbo_bytes);
  895 | 
  896 |         let mut global_buffers = Vec::with_capacity(footer.num_global_buffers as usize);
  897 |         for _ in 0..footer.num_global_buffers {
  898 |             let buf_pos = global_bufs_cursor.read_u64::<LittleEndian>()?;
  899 |             let buf_size = global_bufs_cursor.read_u64::<LittleEndian>()?;
  900 |             global_buffers.push(BufferDescriptor {
  901 |                 position: buf_pos,
  902 |                 size: buf_size,
  903 |             });
  904 |         }
  905 | 
  906 |         Ok(global_buffers)
  907 |     }
  908 | 
  909 |     fn validate_gbo_table(
  910 |         gbo_table: &[BufferDescriptor],
  911 |         file_len: u64,
  912 |         version: ConcreteFileVersion,
  913 |     ) -> Result<()> {
  914 |         versions::validate_global_buffers(version, gbo_table)?;
  915 |         for (buffer_index, buffer) in gbo_table.iter().enumerate() {
  916 |             buffer.checked_range(buffer_index, file_len)?;
  917 |         }
  918 |         Ok(())
  919 |     }
  920 | 
  921 |     async fn decode_gbo_table(
  922 |         tail_bytes: &Bytes,
  923 |         file_len: u64,
  924 |         scheduler: &FileScheduler,
  925 |         footer: &Footer,
  926 |         version: ConcreteFileVersion,
  927 |     ) -> Result<Vec<BufferDescriptor>> {
  928 |         // This could, in theory, trigger another IOP but the GBO table should never be large
  929 |         // enough for that to happen
  930 |         let gbo_bytes = Self::optimistic_tail_read(
  931 |             tail_bytes,
  932 |             footer.global_buff_offsets_start,
  933 |             scheduler,
  934 |             file_len,
  935 |         )
  936 |         .await?;
  937 |         let gbo_table = Self::do_decode_gbo_table(&gbo_bytes, footer)?;
  938 |         Self::validate_gbo_table(&gbo_table, file_len, version)?;
  939 |         Ok(gbo_table)
  940 |     }
  941 | 
  942 |     fn decode_schema(schema_bytes: Bytes) -> Result<(u64, lance_core::datatypes::Schema)> {
  943 |         let file_descriptor = pb::FileDescriptor::decode(schema_bytes)?;
  944 |         let pb_schema = file_descriptor.schema.unwrap();
  945 |         let num_rows = file_descriptor.length;
  946 |         let fields_with_meta = FieldsWithMeta {
  947 |             fields: Fields(pb_schema.fields),
  948 |             metadata: pb_schema.metadata,
  949 |         };
  950 |         let schema = Schema::try_from(fields_with_meta)?;
  951 |         Ok((num_rows, schema))
  952 |     }
  953 | 
  954 |     pub(crate) async fn read_raw_metadata_for_dispatch(
  955 |         scheduler: &FileScheduler,
  956 |     ) -> Result<RawFileMetadataOpen> {
  957 |         let (tail_bytes, file_len) = Self::read_tail(scheduler).await?;
  958 |         let tail_offset = file_len - tail_bytes.len() as u64;
  959 |         let footer = Self::decode_footer(&tail_bytes)?;
  960 |         let version =
  961 |             ConcreteFileVersion::from_footer_numbers(footer.major_version, footer.minor_version)?;
  962 |         if version == ConcreteFileVersion::V1 {
  963 |             return Ok(RawFileMetadataOpen::Legacy {
  964 |                 major_version: footer.major_version,
  965 |                 minor_version: footer.minor_version,
  966 |             });
  967 |         }
  968 | 
  969 |         let gbo_table =
  970 |             Self::decode_gbo_table(&tail_bytes, file_len, scheduler, &footer, version).await?;
  971 |         if gbo_table.is_empty() {
  972 |             return Err(Error::internal(
  973 |                 "File did not contain any global buffers, schema expected".to_string(),
  974 |             ));
  975 |         }
  976 |         let schema_start = gbo_table[0].position;
  977 |         let schema_size = gbo_table[0].size;
  978 |         let num_footer_bytes = file_len.checked_sub(schema_start).ok_or_else(|| {
  979 |             Error::invalid_input_source(
  980 |                 format!(
  981 |                     "Schema position {} is outside file of size {}",
  982 |                     schema_start, file_len
  983 |                 )
  984 |                 .into(),
  985 |             )
  986 |         })?;
  987 |         let all_metadata_bytes =
  988 |             Self::optimistic_tail_read(&tail_bytes, schema_start, scheduler, file_len).await?;
  989 |         let schema_bytes = all_metadata_bytes.slice(0..schema_size as usize);
  990 |         let (num_rows, schema) = Self::decode_schema(schema_bytes)?;
  991 | 
  992 |         let column_metadata_start = (footer.column_meta_start - schema_start) as usize;
  993 |         let column_metadata_end = (footer.global_buff_offsets_start - schema_start) as usize;
  994 |         let column_metadata_bytes =
  995 |             all_metadata_bytes.slice(column_metadata_start..column_metadata_end);
  996 |         let column_metadatas = Self::read_all_column_metadata(column_metadata_bytes, &footer)?;
  997 | 
  998 |         let num_global_buffer_bytes = gbo_table.iter().map(|buf| buf.size).sum::<u64>();
  999 |         let num_data_bytes = footer.column_meta_start - num_global_buffer_bytes;
 1000 |         let num_column_metadata_bytes = footer.global_buff_offsets_start - footer.column_meta_start;
 1001 |         // The tail read above already pulled in any global buffer that lives within
 1002 |         // the captured window. Copy those user buffers (index >= 1; the schema at 0
 1003 |         // is decoded above and never fetched via read_global_buffer) out of the tail
 1004 |         // so read_global_buffer can serve them without I/O. We copy rather than slice
 1005 |         // so the much larger tail allocation can be released once decoding is done.
 1006 |         let retained_global_buffers = Self::retained_global_buffers_from_tail(
 1007 |             &gbo_table,
 1008 |             &tail_bytes,
 1009 |             tail_offset,
 1010 |             file_len,
 1011 |         )?;
 1012 | 
 1013 |         Ok(RawFileMetadataOpen::Current {
 1014 |             version,
 1015 |             metadata: RawFileMetadata {
 1016 |                 file_schema: Arc::new(schema),
 1017 |                 column_metadatas,
 1018 |                 num_rows,
 1019 |                 file_buffers: gbo_table,
 1020 |                 num_data_bytes,
 1021 |                 num_column_metadata_bytes,
 1022 |                 num_global_buffer_bytes,
 1023 |                 num_footer_bytes,
 1024 |                 footer,
 1025 |                 file_size_bytes: file_len,
 1026 |                 retained_global_buffers,
 1027 |             },
 1028 |         })
 1029 |     }
 1030 | 
 1031 |     async fn read_raw_metadata_index_with_known_schema(
 1032 |         scheduler: &FileScheduler,
 1033 |         known_schema: Option<(Arc<Schema>, u64)>,
 1034 |     ) -> Result<FileMetadataIndex> {
 1035 |         let (tail_bytes, file_len) = Self::read_tail(scheduler).await?;
 1036 |         let tail_offset = file_len - tail_bytes.len() as u64;
 1037 |         let footer = Self::decode_footer(&tail_bytes)?;
 1038 | 
 1039 |         let file_version = Self::current_file_version(&footer)?;
 1040 | 
 1041 |         let gbo_table =
 1042 |             Self::decode_gbo_table(&tail_bytes, file_len, scheduler, &footer, file_version).await?;
 1043 |         if gbo_table.is_empty() {
 1044 |             return Err(Error::internal(
 1045 |                 "File did not contain any global buffers, schema expected".to_string(),
 1046 |             ));
 1047 |         }
 1048 |         let (file_schema, num_rows) = match known_schema {
 1049 |             Some((file_schema, num_rows)) => (file_schema, num_rows),
 1050 |             None => {
 1051 |                 let schema_buffer = &gbo_table[0];
 1052 |                 let schema_range = schema_buffer.checked_range(0, file_len)?;
 1053 |                 let schema_bytes = Self::read_range_from_tail_or_scheduler(
 1054 |                     &tail_bytes,
 1055 |                     tail_offset,
 1056 |                     scheduler,
 1057 |                     schema_range,
 1058 |                 )
 1059 |                 .await?;
 1060 |                 let (num_rows, schema) = Self::decode_schema(schema_bytes)?;
 1061 |                 (Arc::new(schema), num_rows)
 1062 |             }
 1063 |         };
 1064 | 
 1065 |         let cmo_table = Self::read_range_from_tail_or_scheduler(
 1066 |             &tail_bytes,
 1067 |             tail_offset,
 1068 |             scheduler,
 1069 |             footer.column_meta_offsets_start..footer.global_buff_offsets_start,
 1070 |         )
 1071 |         .await?;
 1072 |         let column_metadata_offsets = Self::decode_cmo_table(cmo_table, &footer)?;
 1073 | 
 1074 |         let retained_global_buffers = Self::retained_global_buffers_from_tail(
 1075 |             &gbo_table,
 1076 |             &tail_bytes,
 1077 |             tail_offset,
 1078 |             file_len,
 1079 |         )?;
 1080 | 
 1081 |         Ok(FileMetadataIndex {
 1082 |             file_schema,
 1083 |             num_rows,
 1084 |             file_buffers: gbo_table,
 1085 |             column_metadata_offsets,
 1086 |             num_columns: footer.num_columns,
 1087 |             version: file_version,
 1088 |             file_size_bytes: file_len,
 1089 |             retained_global_buffers,
 1090 |         })
 1091 |     }
 1092 | 
 1093 |     /// Reads the lightweight metadata index from a file.
 1094 |     ///
 1095 |     /// This reads the file schema from the schema global buffer. Use
 1096 |     /// [`Self::read_metadata_index_with_schema`] when the caller already has
 1097 |     /// the schema and row count from a higher-level metadata source.
 1098 |     pub(crate) async fn read_raw_metadata_index(
 1099 |         scheduler: &FileScheduler,
 1100 |     ) -> Result<FileMetadataIndex> {
 1101 |         Self::read_raw_metadata_index_with_known_schema(scheduler, None).await
 1102 |     }
 1103 | 
 1104 |     /// Reads the metadata index without fetching the schema global buffer.
 1105 |     ///
 1106 |     /// Use this when the caller already has the file schema and physical row
 1107 |     /// count from an enclosing metadata layer, such as a dataset manifest.
 1108 |     pub(crate) async fn read_raw_metadata_index_with_schema(
 1109 |         scheduler: &FileScheduler,
 1110 |         file_schema: Arc<Schema>,
 1111 |         num_rows: u64,
 1112 |     ) -> Result<FileMetadataIndex> {
 1113 |         Self::read_raw_metadata_index_with_known_schema(scheduler, Some((file_schema, num_rows)))
 1114 |             .await
 1115 |     }
 1116 | 
 1117 |     pub(crate) fn validate_projection(
 1118 |         projection: &ReaderProjection,
 1119 |         metadata: &CachedFileMetadata,
 1120 |     ) -> Result<()> {
 1121 |         if projection.schema.fields.is_empty() {
 1122 |             return Err(Error::invalid_input(
 1123 |                 "Attempt to read zero columns from the file, at least one column must be specified"
 1124 |                     .to_string(),
 1125 |             ));
 1126 |         }
 1127 |         let mut column_indices_seen = BTreeSet::new();
 1128 |         for column_index in &projection.column_indices {
 1129 |             if !column_indices_seen.insert(*column_index) {
 1130 |                 return Err(Error::invalid_input(format!(
 1131 |                     "The projection specified the column index {} more than once",
 1132 |                     column_index
 1133 |                 )));
 1134 |             }
 1135 |             if *column_index >= metadata.column_infos.len() as u32 {
 1136 |                 return Err(Error::invalid_input(format!(
 1137 |                     "The projection specified the column index {} but there are only {} columns in the file",
 1138 |                     column_index,
 1139 |                     metadata.column_infos.len()
 1140 |                 )));
 1141 |             }
 1142 |         }
 1143 |         Ok(())
 1144 |     }
 1145 | 
 1146 |     // The actual decoder needs all the column infos that make up a type.  In other words, if
 1147 |     // the first type in the schema is Struct<i32, i32> then the decoder will need 3 column infos.
 1148 |     //
 1149 |     // This is a file reader concern because the file reader needs to support late projection of columns
 1150 |     // and so it will need to figure this out anyways.
 1151 |     //
 1152 |     // It's a bit of a tricky process though because the number of column infos may depend on the
 1153 |     // encoding.  Considering the above example, if we wrote it with a packed encoding, then there would
 1154 |     // only be a single column in the file (and not 3).
 1155 |     //
 1156 |     // At the moment this method words because our rules are simple and we just repeat them here.  See
 1157 |     // Self::default_projection for a similar problem.  In the future this is something the encodings
 1158 |     // registry will need to figure out.
 1159 |     fn collect_columns_from_projection(
 1160 |         &self,
 1161 |         _projection: &ReaderProjection,
 1162 |     ) -> Result<Vec<Arc<ColumnInfo>>> {
 1163 |         Ok(self.metadata.column_infos.clone())
 1164 |     }
 1165 | 
 1166 |     #[allow(clippy::too_many_arguments)]
 1167 |     async fn do_read_range(
 1168 |         column_infos: Vec<Arc<ColumnInfo>>,
 1169 |         io: Arc<dyn EncodingsIo>,
 1170 |         cache: Arc<LanceCache>,
 1171 |         num_rows: u64,
 1172 |         decoder_plugins: Arc<DecoderPlugins>,
 1173 |         range: Range<u64>,
 1174 |         batch_size: u32,
 1175 |         projection: ReaderProjection,
 1176 |         filter: FilterExpression,
 1177 |         decoder_config: DecoderConfig,
 1178 |         batch_size_bytes: Option<u64>,
 1179 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1180 |         debug!(
 1181 |             "Reading range {:?} with batch_size {} from file with {} rows and {} columns into schema with {} columns",
 1182 |             range,
 1183 |             batch_size,
 1184 |             num_rows,
 1185 |             column_infos.len(),
 1186 |             projection.schema.fields.len(),
 1187 |         );
 1188 | 
 1189 |         let config = SchedulerDecoderConfig {
 1190 |             batch_size,
 1191 |             cache,
 1192 |             decoder_plugins,
 1193 |             io,
 1194 |             decoder_config,
 1195 |             batch_size_bytes,
 1196 |         };
 1197 | 
 1198 |         let requested_rows = RequestedRows::Ranges(vec![range]);
 1199 | 
 1200 |         schedule_and_decode(
 1201 |             column_infos,
 1202 |             requested_rows,
 1203 |             filter,
 1204 |             projection.column_indices,
 1205 |             projection.schema,
 1206 |             config,
 1207 |         )
 1208 |         .await
 1209 |     }
 1210 | 
 1211 |     #[allow(clippy::too_many_arguments)]
 1212 |     async fn do_take_rows(
 1213 |         column_infos: Vec<Arc<ColumnInfo>>,
 1214 |         io: Arc<dyn EncodingsIo>,
 1215 |         cache: Arc<LanceCache>,
 1216 |         decoder_plugins: Arc<DecoderPlugins>,
 1217 |         indices: Vec<u64>,
 1218 |         batch_size: u32,
 1219 |         projection: ReaderProjection,
 1220 |         filter: FilterExpression,
 1221 |         decoder_config: DecoderConfig,
 1222 |         batch_size_bytes: Option<u64>,
 1223 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1224 |         debug!(
 1225 |             "Taking {} rows spread across range {}..{} with batch_size {} from columns {:?}",
 1226 |             indices.len(),
 1227 |             indices[0],
 1228 |             indices[indices.len() - 1],
 1229 |             batch_size,
 1230 |             column_infos.iter().map(|ci| ci.index).collect::<Vec<_>>()
 1231 |         );
 1232 | 
 1233 |         let config = SchedulerDecoderConfig {
 1234 |             batch_size,
 1235 |             cache,
 1236 |             decoder_plugins,
 1237 |             io,
 1238 |             decoder_config,
 1239 |             batch_size_bytes,
 1240 |         };
 1241 | 
 1242 |         let requested_rows = RequestedRows::Indices(indices);
 1243 | 
 1244 |         schedule_and_decode(
 1245 |             column_infos,
 1246 |             requested_rows,
 1247 |             filter,
 1248 |             projection.column_indices,
 1249 |             projection.schema,
 1250 |             config,
 1251 |         )
 1252 |         .await
 1253 |     }
 1254 | 
 1255 |     #[allow(clippy::too_many_arguments)]
 1256 |     async fn do_read_ranges(
 1257 |         column_infos: Vec<Arc<ColumnInfo>>,
 1258 |         io: Arc<dyn EncodingsIo>,
 1259 |         cache: Arc<LanceCache>,
 1260 |         decoder_plugins: Arc<DecoderPlugins>,
 1261 |         ranges: Vec<Range<u64>>,
 1262 |         batch_size: u32,
 1263 |         projection: ReaderProjection,
 1264 |         filter: FilterExpression,
 1265 |         decoder_config: DecoderConfig,
 1266 |         batch_size_bytes: Option<u64>,
 1267 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1268 |         let num_rows = ranges.iter().map(|r| r.end - r.start).sum::<u64>();
 1269 |         debug!(
 1270 |             "Taking {} ranges ({} rows) spread across range {}..{} with batch_size {} from columns {:?}",
 1271 |             ranges.len(),
 1272 |             num_rows,
 1273 |             ranges[0].start,
 1274 |             ranges[ranges.len() - 1].end,
 1275 |             batch_size,
 1276 |             column_infos.iter().map(|ci| ci.index).collect::<Vec<_>>()
 1277 |         );
 1278 | 
 1279 |         let config = SchedulerDecoderConfig {
 1280 |             batch_size,
 1281 |             cache,
 1282 |             decoder_plugins,
 1283 |             io,
 1284 |             decoder_config,
 1285 |             batch_size_bytes,
 1286 |         };
 1287 | 
 1288 |         let requested_rows = RequestedRows::Ranges(ranges);
 1289 | 
 1290 |         schedule_and_decode(
 1291 |             column_infos,
 1292 |             requested_rows,
 1293 |             filter,
 1294 |             projection.column_indices,
 1295 |             projection.schema,
 1296 |             config,
 1297 |         )
 1298 |         .await
 1299 |     }
 1300 | 
 1301 |     fn take_rows_blocking(
 1302 |         &self,
 1303 |         indices: Vec<u64>,
 1304 |         batch_size: u32,
 1305 |         projection: ReaderProjection,
 1306 |         filter: FilterExpression,
 1307 |     ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 1308 |         let column_infos = self.collect_columns_from_projection(&projection)?;
 1309 |         debug!(
 1310 |             "Taking {} rows spread across range {}..{} with batch_size {} from columns {:?}",
 1311 |             indices.len(),
 1312 |             indices[0],
 1313 |             indices[indices.len() - 1],
 1314 |             batch_size,
 1315 |             column_infos.iter().map(|ci| ci.index).collect::<Vec<_>>()
 1316 |         );
 1317 | 
 1318 |         let config = SchedulerDecoderConfig {
 1319 |             batch_size,
 1320 |             cache: self.core.cache.clone(),
 1321 |             decoder_plugins: self.core.decoder_plugins.clone(),
 1322 |             io: self.core.scheduler.clone(),
 1323 |             decoder_config: self.core.options.decoder_config.clone(),
 1324 |             batch_size_bytes: self.core.options.batch_size_bytes,
 1325 |         };
 1326 | 
 1327 |         let requested_rows = RequestedRows::Indices(indices);
 1328 | 
 1329 |         schedule_and_decode_blocking(
 1330 |             column_infos,
 1331 |             requested_rows,
 1332 |             filter,
 1333 |             projection.column_indices,
 1334 |             projection.schema,
 1335 |             config,
 1336 |         )
 1337 |     }
 1338 | 
 1339 |     fn read_ranges_blocking(
 1340 |         &self,
 1341 |         ranges: Vec<Range<u64>>,
 1342 |         batch_size: u32,
 1343 |         projection: ReaderProjection,
 1344 |         filter: FilterExpression,
 1345 |     ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 1346 |         let column_infos = self.collect_columns_from_projection(&projection)?;
 1347 |         let num_rows = ranges.iter().map(|r| r.end - r.start).sum::<u64>();
 1348 |         debug!(
 1349 |             "Taking {} ranges ({} rows) spread across range {}..{} with batch_size {} from columns {:?}",
 1350 |             ranges.len(),
 1351 |             num_rows,
 1352 |             ranges[0].start,
 1353 |             ranges[ranges.len() - 1].end,
 1354 |             batch_size,
 1355 |             column_infos.iter().map(|ci| ci.index).collect::<Vec<_>>()
 1356 |         );
 1357 | 
 1358 |         let config = SchedulerDecoderConfig {
 1359 |             batch_size,
 1360 |             cache: self.core.cache.clone(),
 1361 |             decoder_plugins: self.core.decoder_plugins.clone(),
 1362 |             io: self.core.scheduler.clone(),
 1363 |             decoder_config: self.core.options.decoder_config.clone(),
 1364 |             batch_size_bytes: self.core.options.batch_size_bytes,
 1365 |         };
 1366 | 
 1367 |         let requested_rows = RequestedRows::Ranges(ranges);
 1368 | 
 1369 |         schedule_and_decode_blocking(
 1370 |             column_infos,
 1371 |             requested_rows,
 1372 |             filter,
 1373 |             projection.column_indices,
 1374 |             projection.schema,
 1375 |             config,
 1376 |         )
 1377 |     }
 1378 | 
 1379 |     fn read_range_blocking(
 1380 |         &self,
 1381 |         range: Range<u64>,
 1382 |         batch_size: u32,
 1383 |         projection: ReaderProjection,
 1384 |         filter: FilterExpression,
 1385 |     ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 1386 |         let column_infos = self.collect_columns_from_projection(&projection)?;
 1387 |         let num_rows = self.core.num_rows();
 1388 | 
 1389 |         debug!(
 1390 |             "Reading range {:?} with batch_size {} from file with {} rows and {} columns into schema with {} columns",
 1391 |             range,
 1392 |             batch_size,
 1393 |             num_rows,
 1394 |             column_infos.len(),
 1395 |             projection.schema.fields.len(),
 1396 |         );
 1397 | 
 1398 |         let config = SchedulerDecoderConfig {
 1399 |             batch_size,
 1400 |             cache: self.core.cache.clone(),
 1401 |             decoder_plugins: self.core.decoder_plugins.clone(),
 1402 |             io: self.core.scheduler.clone(),
 1403 |             decoder_config: self.core.options.decoder_config.clone(),
 1404 |             batch_size_bytes: self.core.options.batch_size_bytes,
 1405 |         };
 1406 | 
 1407 |         let requested_rows = RequestedRows::Ranges(vec![range]);
 1408 | 
 1409 |         schedule_and_decode_blocking(
 1410 |             column_infos,
 1411 |             requested_rows,
 1412 |             filter,
 1413 |             projection.column_indices,
 1414 |             projection.schema,
 1415 |             config,
 1416 |         )
 1417 |     }
 1418 | 
 1419 |     pub(crate) fn read_prepared_blocking(
 1420 |         &self,
 1421 |         params: ReadBatchParams,
 1422 |         batch_size: u32,
 1423 |         prepared: PreparedProjection,
 1424 |         read_len: u64,
 1425 |         filter: FilterExpression,
 1426 |     ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 1427 |         let projection = prepared.decoder_projection;
 1428 |         let verify_bound = |params: &ReadBatchParams, bound: u64, inclusive: bool| {
 1429 |             if bound > read_len || (bound == read_len && inclusive) {
 1430 |                 Err(Error::invalid_input(format!(
 1431 |                     "cannot read {params:?} from columns with {read_len} rows"
 1432 |                 )))
 1433 |             } else {
 1434 |                 Ok(())
 1435 |             }
 1436 |         };
 1437 |         match &params {
 1438 |             ReadBatchParams::Indices(indices) => {
 1439 |                 for index in indices {
 1440 |                     match index {
 1441 |                         None => return Err(Error::invalid_input("Null value in indices array")),
 1442 |                         Some(index) => verify_bound(&params, index as u64, true)?,
 1443 |                     }
 1444 |                 }
 1445 |                 let indices = indices.iter().map(|index| index.unwrap() as u64).collect();
 1446 |                 self.take_rows_blocking(indices, batch_size, projection, filter)
 1447 |             }
 1448 |             ReadBatchParams::Range(range) => {
 1449 |                 verify_bound(&params, range.end as u64, false)?;
 1450 |                 self.read_range_blocking(
 1451 |                     range.start as u64..range.end as u64,
 1452 |                     batch_size,
 1453 |                     projection,
 1454 |                     filter,
 1455 |                 )
 1456 |             }
 1457 |             ReadBatchParams::Ranges(ranges) => {
 1458 |                 let mut ranges_u64 = Vec::with_capacity(ranges.len());
 1459 |                 for range in ranges.as_ref() {
 1460 |                     verify_bound(&params, range.end, false)?;
 1461 |                     ranges_u64.push(range.start..range.end);
 1462 |                 }
 1463 |                 self.read_ranges_blocking(ranges_u64, batch_size, projection, filter)
 1464 |             }
 1465 |             ReadBatchParams::RangeFrom(range) => {
 1466 |                 verify_bound(&params, range.start as u64, true)?;
 1467 |                 self.read_range_blocking(
 1468 |                     range.start as u64..read_len,
 1469 |                     batch_size,
 1470 |                     projection,
 1471 |                     filter,
 1472 |                 )
 1473 |             }
 1474 |             ReadBatchParams::RangeTo(range) => {
 1475 |                 verify_bound(&params, range.end as u64, false)?;
 1476 |                 self.read_range_blocking(0..range.end as u64, batch_size, projection, filter)
 1477 |             }
 1478 |             ReadBatchParams::RangeFull => {
 1479 |                 self.read_range_blocking(0..read_len, batch_size, projection, filter)
 1480 |             }
 1481 |         }
 1482 |     }
 1483 | 
 1484 |     pub fn schema(&self) -> &Arc<Schema> {
 1485 |         self.core.schema()
 1486 |     }
 1487 | }
 1488 | 
 1489 | impl FileMetadataProvider {
 1490 |     pub(crate) fn version(&self) -> ConcreteFileVersion {
 1491 |         match self {
 1492 |             Self::Full(metadata) => metadata.version,
 1493 |             Self::Indexed(metadata_index) => metadata_index.version,
 1494 |         }
 1495 |     }
 1496 | 
 1497 |     pub(crate) fn num_rows(&self) -> u64 {
 1498 |         match self {
 1499 |             Self::Full(metadata) => metadata.num_rows,
 1500 |             Self::Indexed(metadata_index) => metadata_index.num_rows,
 1501 |         }
 1502 |     }
 1503 | 
 1504 |     pub(crate) fn schema(&self) -> &Arc<Schema> {
 1505 |         match self {
 1506 |             Self::Full(metadata) => &metadata.file_schema,
 1507 |             Self::Indexed(metadata_index) => &metadata_index.file_schema,
 1508 |         }
 1509 |     }
 1510 | 
 1511 |     pub(crate) fn file_buffers(&self) -> &Vec<BufferDescriptor> {
 1512 |         match self {
 1513 |             Self::Full(metadata) => &metadata.file_buffers,
 1514 |             Self::Indexed(metadata_index) => &metadata_index.file_buffers,
 1515 |         }
 1516 |     }
 1517 | 
 1518 |     pub(crate) fn retained_global_buffers(&self) -> &BTreeMap<u32, Bytes> {
 1519 |         match self {
 1520 |             Self::Full(metadata) => &metadata.retained_global_buffers,
 1521 |             Self::Indexed(metadata_index) => &metadata_index.retained_global_buffers,
 1522 |         }
 1523 |     }
 1524 | 
 1525 |     fn file_size(&self) -> u64 {
 1526 |         match self {
 1527 |             Self::Full(metadata) => metadata.file_size_bytes,
 1528 |             Self::Indexed(metadata_index) => metadata_index.file_size_bytes,
 1529 |         }
 1530 |     }
 1531 | 
 1532 |     pub(crate) fn file_statistics(&self) -> Option<FileStatistics> {
 1533 |         let metadata = match self {
 1534 |             Self::Full(metadata) => metadata,
 1535 |             Self::Indexed(_) => return None,
 1536 |         };
 1537 |         Some(FileReader::statistics_from_column_metadata(
 1538 |             &metadata.column_metadatas,
 1539 |         ))
 1540 |     }
 1541 | 
 1542 |     pub(crate) fn projection_matches_indexed_metadata(projection: &ReaderProjection) -> bool {
 1543 |         if projection.schema.fields.is_empty() {
 1544 |             return false;
 1545 |         }
 1546 | 
 1547 |         projection
 1548 |             .schema
 1549 |             .fields
 1550 |             .iter()
 1551 |             .try_fold(0usize, |count, field| {
 1552 |                 count.checked_add(indexed_projection_column_count(field)?)
 1553 |             })
 1554 |             == Some(projection.column_indices.len())
 1555 |     }
 1556 | 
 1557 |     pub(crate) fn validate_indexed_projection_structure(
 1558 |         projection: &ReaderProjection,
 1559 |         metadata_index: &FileMetadataIndex,
 1560 |     ) -> Result<()> {
 1561 |         if projection.schema.fields.is_empty() {
 1562 |             return Err(Error::invalid_input(
 1563 |                 "Attempt to read zero columns from the file, at least one column must be specified"
 1564 |                     .to_string(),
 1565 |             ));
 1566 |         }
 1567 |         let mut column_indices_seen = BTreeSet::new();
 1568 |         for column_index in &projection.column_indices {
 1569 |             if !column_indices_seen.insert(*column_index) {
 1570 |                 return Err(Error::invalid_input(format!(
 1571 |                     "The projection specified the column index {} more than once",
 1572 |                     column_index
 1573 |                 )));
 1574 |             }
 1575 |             if *column_index >= metadata_index.num_columns {
 1576 |                 return Err(Error::invalid_input(format!(
 1577 |                     "The projection specified the column index {} but there are only {} columns in the file",
 1578 |                     column_index, metadata_index.num_columns
 1579 |                 )));
 1580 |             }
 1581 |         }
 1582 |         Ok(())
 1583 |     }
 1584 | 
 1585 |     pub(crate) fn indexed_projection_error(
 1586 |         projection: &ReaderProjection,
 1587 |         metadata_index: &FileMetadataIndex,
 1588 |     ) -> Error {
 1589 |         Error::not_supported(format!(
 1590 |             "lazy column metadata loading requires a V2.1+ ordinary structural projection without blob or packed-struct fields whose physical-column count matches the projection; got file version {:?}, {} schema fields, and {} column indices",
 1591 |             metadata_index.version,
 1592 |             projection.schema.fields.len(),
 1593 |             projection.column_indices.len()
 1594 |         ))
 1595 |     }
 1596 | 
 1597 |     fn column_metadata_range(
 1598 |         metadata_index: &FileMetadataIndex,
 1599 |         column_index: u32,
 1600 |     ) -> Result<Range<u64>> {
 1601 |         let (position, length) = metadata_index
 1602 |             .column_metadata_offsets
 1603 |             .get(column_index as usize)
 1604 |             .copied()
 1605 |             .ok_or_else(|| {
 1606 |                 Error::invalid_input(format!(
 1607 |                     "The projection specified the column index {} but there are only {} columns in the file",
 1608 |                     column_index, metadata_index.num_columns
 1609 |                 ))
 1610 |             })?;
 1611 |         let end = position.checked_add(length).ok_or_else(|| {
 1612 |             Error::invalid_input(format!(
 1613 |                 "column metadata range overflows for column index {}, position={}, length={}",
 1614 |                 column_index, position, length
 1615 |             ))
 1616 |         })?;
 1617 |         Ok(position..end)
 1618 |     }
 1619 | 
 1620 |     pub(crate) async fn load_indexed_column_infos<F>(
 1621 |         metadata_index: &FileMetadataIndex,
 1622 |         io: &Arc<dyn EncodingsIo>,
 1623 |         cache: &Arc<LanceCache>,
 1624 |         column_indices: &[u32],
 1625 |         decode_column: F,
 1626 |     ) -> Result<Vec<Arc<ColumnInfo>>>
 1627 |     where
 1628 |         F: Fn(u32, &pbfile::ColumnMetadata) -> Result<Arc<ColumnInfo>>,
 1629 |     {
 1630 |         let mut column_infos = vec![None; column_indices.len()];
 1631 |         let mut missing_columns = Vec::new();
 1632 | 
 1633 |         for (result_index, column_index) in column_indices.iter().copied().enumerate() {
 1634 |             let cache_key = ColumnMetadataCacheKey { column_index };
 1635 |             if let Some(cached) = cache.get_with_key(&cache_key).await {
 1636 |                 column_infos[result_index] = Some(cached.column_info.clone());
 1637 |             } else {
 1638 |                 let range = Self::column_metadata_range(metadata_index, column_index)?;
 1639 |                 missing_columns.push((result_index, column_index, range));
 1640 |             }
 1641 |         }
 1642 | 
 1643 |         missing_columns.sort_by_key(|(_, _, range)| range.start);
 1644 |         if !missing_columns.is_empty() {
 1645 |             let ranges = missing_columns
 1646 |                 .iter()
 1647 |                 .map(|(_, _, range)| range.clone())
 1648 |                 .collect::<Vec<_>>();
 1649 |             let metadata_bytes = io.submit_request(ranges, 0).await?;
 1650 |             for ((result_index, column_index, _), bytes) in
 1651 |                 missing_columns.into_iter().zip(metadata_bytes)
 1652 |             {
 1653 |                 let column_metadata = pbfile::ColumnMetadata::decode(bytes)?;
 1654 |                 let column_info = decode_column(column_index, &column_metadata)?;
 1655 |                 let cached = Arc::new(CachedColumnMetadata {
 1656 |                     column_metadata,
 1657 |                     column_info: column_info.clone(),
 1658 |                 });
 1659 |                 let cache_key = ColumnMetadataCacheKey { column_index };
 1660 |                 cache.insert_with_key(&cache_key, cached).await;
 1661 |                 column_infos[result_index] = Some(column_info);
 1662 |             }
 1663 |         }
 1664 | 
 1665 |         column_infos
 1666 |             .into_iter()
 1667 |             .enumerate()
 1668 |             .map(|(idx, column_info)| {
 1669 |                 column_info.ok_or_else(|| {
 1670 |                     Error::internal(format!(
 1671 |                         "lazy metadata loader did not load requested projection column at position {}",
 1672 |                         idx
 1673 |                     ))
 1674 |                 })
 1675 |             })
 1676 |             .collect()
 1677 |     }
 1678 | }
 1679 | 
 1680 | impl DecodeEngine {
 1681 |     pub(crate) fn try_new(
 1682 |         scheduler: Arc<dyn EncodingsIo>,
 1683 |         base_projection: ReaderProjection,
 1684 |         decoder_plugins: Arc<DecoderPlugins>,
 1685 |         metadata_provider: FileMetadataProvider,
 1686 |         read_projection: Arc<dyn ReadProjection>,
 1687 |         cache: Arc<LanceCache>,
 1688 |         options: FileReaderOptions,
 1689 |     ) -> Result<Self> {
 1690 |         Ok(Self {
 1691 |             scheduler,
 1692 |             base_projection,
 1693 |             metadata_provider,
 1694 |             read_projection,
 1695 |             decoder_plugins,
 1696 |             cache,
 1697 |             options,
 1698 |         })
 1699 |     }
 1700 | 
 1701 |     pub(crate) fn with_scheduler(&self, scheduler: Arc<dyn EncodingsIo>) -> Self {
 1702 |         Self {
 1703 |             scheduler,
 1704 |             base_projection: self.base_projection.clone(),
 1705 |             metadata_provider: self.metadata_provider.clone(),
 1706 |             read_projection: self.read_projection.clone(),
 1707 |             decoder_plugins: self.decoder_plugins.clone(),
 1708 |             cache: self.cache.clone(),
 1709 |             options: self.options.clone(),
 1710 |         }
 1711 |     }
 1712 | 
 1713 |     fn num_rows(&self) -> u64 {
 1714 |         self.metadata_provider.num_rows()
 1715 |     }
 1716 | 
 1717 |     fn schema(&self) -> &Arc<Schema> {
 1718 |         self.metadata_provider.schema()
 1719 |     }
 1720 | 
 1721 |     pub(crate) async fn read_global_buffer(&self, index: u32) -> Result<Bytes> {
 1722 |         let file_buffers = self.metadata_provider.file_buffers();
 1723 |         let buffer_desc = file_buffers.get(index as usize).ok_or_else(|| {
 1724 |             Error::invalid_input(format!(
 1725 |                 "request for global buffer at index {} but there were only {} global buffers in the file",
 1726 |                 index,
 1727 |                 file_buffers.len()
 1728 |             ))
 1729 |         })?;
 1730 | 
 1731 |         if let Some(bytes) = self.metadata_provider.retained_global_buffers().get(&index) {
 1732 |             return Ok(bytes.clone());
 1733 |         }
 1734 | 
 1735 |         let bytes = self
 1736 |             .scheduler
 1737 |             .submit_request(
 1738 |                 vec![
 1739 |                     buffer_desc
 1740 |                         .checked_range(index as usize, self.metadata_provider.file_size())?,
 1741 |                 ],
 1742 |                 0,
 1743 |             )
 1744 |             .await?;
 1745 |         bytes.into_iter().next().ok_or_else(|| {
 1746 |             Error::internal(format!(
 1747 |                 "global buffer read for index {} returned no bytes",
 1748 |                 index
 1749 |             ))
 1750 |         })
 1751 |     }
 1752 | 
 1753 |     async fn read_range(
 1754 |         &self,
 1755 |         range: Range<u64>,
 1756 |         batch_size: u32,
 1757 |         prepared: PreparedProjection,
 1758 |         filter: FilterExpression,
 1759 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1760 |         FileReader::do_read_range(
 1761 |             prepared.column_infos,
 1762 |             self.scheduler.clone(),
 1763 |             self.cache.clone(),
 1764 |             self.num_rows(),
 1765 |             self.decoder_plugins.clone(),
 1766 |             range,
 1767 |             batch_size,
 1768 |             prepared.decoder_projection,
 1769 |             filter,
 1770 |             self.options.decoder_config.clone(),
 1771 |             self.options.batch_size_bytes,
 1772 |         )
 1773 |         .await
 1774 |     }
 1775 | 
 1776 |     async fn take_rows(
 1777 |         &self,
 1778 |         indices: Vec<u64>,
 1779 |         batch_size: u32,
 1780 |         prepared: PreparedProjection,
 1781 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1782 |         FileReader::do_take_rows(
 1783 |             prepared.column_infos,
 1784 |             self.scheduler.clone(),
 1785 |             self.cache.clone(),
 1786 |             self.decoder_plugins.clone(),
 1787 |             indices,
 1788 |             batch_size,
 1789 |             prepared.decoder_projection,
 1790 |             FilterExpression::no_filter(),
 1791 |             self.options.decoder_config.clone(),
 1792 |             self.options.batch_size_bytes,
 1793 |         )
 1794 |         .await
 1795 |     }
 1796 | 
 1797 |     async fn read_ranges(
 1798 |         &self,
 1799 |         ranges: Vec<Range<u64>>,
 1800 |         batch_size: u32,
 1801 |         prepared: PreparedProjection,
 1802 |         filter: FilterExpression,
 1803 |     ) -> Result<BoxStream<'static, ReadBatchTask>> {
 1804 |         FileReader::do_read_ranges(
 1805 |             prepared.column_infos,
 1806 |             self.scheduler.clone(),
 1807 |             self.cache.clone(),
 1808 |             self.decoder_plugins.clone(),
 1809 |             ranges,
 1810 |             batch_size,
 1811 |             prepared.decoder_projection,
 1812 |             filter,
 1813 |             self.options.decoder_config.clone(),
 1814 |             self.options.batch_size_bytes,
 1815 |         )
 1816 |         .await
 1817 |     }
 1818 | 
 1819 |     pub(crate) async fn read_prepared_tasks(
 1820 |         &self,
 1821 |         params: ReadBatchParams,
 1822 |         batch_size: u32,
 1823 |         prepared: PreparedProjection,
 1824 |         read_len: u64,
 1825 |         filter: FilterExpression,
 1826 |     ) -> Result<Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>> {
 1827 |         let verify_bound = |params: &ReadBatchParams, bound: u64, inclusive: bool| {
 1828 |             if bound > read_len || (bound == read_len && inclusive) {
 1829 |                 Err(Error::invalid_input(format!(
 1830 |                     "cannot read {params:?} from columns with {read_len} rows"
 1831 |                 )))
 1832 |             } else {
 1833 |                 Ok(())
 1834 |             }
 1835 |         };
 1836 |         match &params {
 1837 |             ReadBatchParams::Indices(indices) => {
 1838 |                 for idx in indices {
 1839 |                     match idx {
 1840 |                         None => {
 1841 |                             return Err(Error::invalid_input("Null value in indices array"));
 1842 |                         }
 1843 |                         Some(idx) => {
 1844 |                             verify_bound(&params, idx as u64, true)?;
 1845 |                         }
 1846 |                     }
 1847 |                 }
 1848 |                 let indices = indices.iter().map(|idx| idx.unwrap() as u64).collect();
 1849 |                 self.take_rows(indices, batch_size, prepared).await
 1850 |             }
 1851 |             ReadBatchParams::Range(range) => {
 1852 |                 verify_bound(&params, range.end as u64, false)?;
 1853 |                 self.read_range(
 1854 |                     range.start as u64..range.end as u64,
 1855 |                     batch_size,
 1856 |                     prepared,
 1857 |                     filter,
 1858 |                 )
 1859 |                 .await
 1860 |             }
 1861 |             ReadBatchParams::Ranges(ranges) => {
 1862 |                 let mut ranges_u64 = Vec::with_capacity(ranges.len());
 1863 |                 for range in ranges.as_ref() {
 1864 |                     verify_bound(&params, range.end, false)?;
 1865 |                     ranges_u64.push(range.start..range.end);
 1866 |                 }
 1867 |                 self.read_ranges(ranges_u64, batch_size, prepared, filter)
 1868 |                     .await
 1869 |             }
 1870 |             ReadBatchParams::RangeFrom(range) => {
 1871 |                 verify_bound(&params, range.start as u64, true)?;
 1872 |                 self.read_range(range.start as u64..read_len, batch_size, prepared, filter)
 1873 |                     .await
 1874 |             }
 1875 |             ReadBatchParams::RangeTo(range) => {
 1876 |                 verify_bound(&params, range.end as u64, false)?;
 1877 |                 self.read_range(0..range.end as u64, batch_size, prepared, filter)
 1878 |                     .await
 1879 |             }
 1880 |             ReadBatchParams::RangeFull => {
 1881 |                 self.read_range(0..read_len, batch_size, prepared, filter)
 1882 |                     .await
 1883 |             }
 1884 |         }
 1885 |     }
 1886 | }
 1887 | 
 1888 | impl ProjectedFileReader {
 1889 |     pub(crate) fn base_projection(&self) -> &ReaderProjection {
 1890 |         &self.core.base_projection
 1891 |     }
 1892 | 
 1893 |     pub(crate) async fn read_prepared_tasks(
 1894 |         &self,
 1895 |         params: ReadBatchParams,
 1896 |         batch_size: u32,
 1897 |         prepared: PreparedProjection,
 1898 |         read_len: u64,
 1899 |         filter: FilterExpression,
 1900 |     ) -> Result<Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>> {
 1901 |         self.core
 1902 |             .read_prepared_tasks(params, batch_size, prepared, read_len, filter)
 1903 |             .await
 1904 |     }
 1905 | 
 1906 |     /// Returns a clone of this reader using a different scheduler.
 1907 |     pub fn with_scheduler(&self, scheduler: Arc<dyn EncodingsIo>) -> Self {
 1908 |         Self {
 1909 |             core: self.core.with_scheduler(scheduler),
 1910 |         }
 1911 |     }
 1912 | 
 1913 |     /// Returns the number of rows in the file.
 1914 |     pub fn num_rows(&self) -> u64 {
 1915 |         self.core.num_rows()
 1916 |     }
 1917 | 
 1918 |     /// Returns the file schema visible to this reader.
 1919 |     pub fn schema(&self) -> &Arc<Schema> {
 1920 |         self.core.schema()
 1921 |     }
 1922 | 
 1923 |     /// Returns file statistics when this reader has full file metadata.
 1924 |     pub fn file_statistics(&self) -> Option<FileStatistics> {
 1925 |         self.core.metadata_provider.file_statistics()
 1926 |     }
 1927 | 
 1928 |     #[cfg(test)]
 1929 |     pub(crate) fn metadata_index(&self) -> Option<&Arc<FileMetadataIndex>> {
 1930 |         match &self.core.metadata_provider {
 1931 |             FileMetadataProvider::Indexed(metadata_index) => Some(metadata_index),
 1932 |             FileMetadataProvider::Full(_) => None,
 1933 |         }
 1934 |     }
 1935 | 
 1936 |     /// Reads a global buffer by index.
 1937 |     pub async fn read_global_buffer(&self, index: u32) -> Result<Bytes> {
 1938 |         self.core.read_global_buffer(index).await
 1939 |     }
 1940 | }
 1941 | 
 1942 | impl FileReader {
 1943 |     #[cfg(test)]
 1944 |     fn scheduler(&self) -> Arc<dyn EncodingsIo> {
 1945 |         self.core.scheduler.clone()
 1946 |     }
 1947 | 
 1948 |     pub async fn try_open(
 1949 |         scheduler: FileScheduler,
 1950 |         base_projection: Option<ReaderProjection>,
 1951 |         decoder_plugins: Arc<DecoderPlugins>,
 1952 |         cache: &LanceCache,
 1953 |         options: FileReaderOptions,
 1954 |     ) -> Result<Self> {
 1955 |         match Self::try_open_for_dispatch(
 1956 |             scheduler,
 1957 |             base_projection,
 1958 |             decoder_plugins,
 1959 |             cache,
 1960 |             options,
 1961 |         )
 1962 |         .await?
 1963 |         {
 1964 |             versions::OpenedFileReader::V1 {
 1965 |                 major_version,
 1966 |                 minor_version,
 1967 |             } => Err(Error::version_conflict(
 1968 |                 "Attempt to use the Lance current-format reader to read a v1 file".to_string(),
 1969 |                 major_version,
 1970 |                 minor_version,
 1971 |             )),
 1972 |             versions::OpenedFileReader::Current(reader) => Ok(reader),
 1973 |         }
 1974 |     }
 1975 | 
 1976 |     pub(crate) async fn try_open_for_dispatch(
 1977 |         scheduler: FileScheduler,
 1978 |         base_projection: Option<ReaderProjection>,
 1979 |         decoder_plugins: Arc<DecoderPlugins>,
 1980 |         cache: &LanceCache,
 1981 |         options: FileReaderOptions,
 1982 |     ) -> Result<versions::OpenedFileReader> {
 1983 |         let metadata = match Self::read_raw_metadata_for_dispatch(&scheduler).await? {
 1984 |             RawFileMetadataOpen::Legacy {
 1985 |                 major_version,
 1986 |                 minor_version,
 1987 |             } => {
 1988 |                 return Ok(versions::OpenedFileReader::V1 {
 1989 |                     major_version,
 1990 |                     minor_version,
 1991 |                 });
 1992 |             }
 1993 |             RawFileMetadataOpen::Current { version, metadata } => {
 1994 |                 Arc::new(versions::finish_metadata(version, metadata)?)
 1995 |             }
 1996 |         };
 1997 |         let path = scheduler.reader().path().clone();
 1998 |         let io = Arc::new(
 1999 |             LanceEncodingsIo::new(scheduler).with_read_chunk_size(options.read_chunk_size),
 2000 |         );
 2001 |         Self::try_open_with_file_metadata(
 2002 |             io,
 2003 |             path,
 2004 |             base_projection,
 2005 |             decoder_plugins,
 2006 |             metadata,
 2007 |             cache,
 2008 |             options,
 2009 |         )
 2010 |         .await
 2011 |         .map(versions::OpenedFileReader::Current)
 2012 |     }
 2013 | 
 2014 |     pub async fn try_open_with_file_metadata(
 2015 |         scheduler: Arc<dyn EncodingsIo>,
 2016 |         path: Path,
 2017 |         base_projection: Option<ReaderProjection>,
 2018 |         decoder_plugins: Arc<DecoderPlugins>,
 2019 |         metadata: Arc<CachedFileMetadata>,
 2020 |         cache: &LanceCache,
 2021 |         options: FileReaderOptions,
 2022 |     ) -> Result<Self> {
 2023 |         if metadata.version == ConcreteFileVersion::V1 {
 2024 |             return Err(Error::version_conflict(
 2025 |                 "Attempt to use the Lance current-format reader with v1 metadata".to_string(),
 2026 |                 metadata.major_version,
 2027 |                 metadata.minor_version,
 2028 |             ));
 2029 |         }
 2030 |         let read_projection = versions::read_projection(metadata.version)?;
 2031 |         let has_explicit_projection = base_projection.is_some();
 2032 |         let base_projection = base_projection.unwrap_or_else(|| {
 2033 |             versions::reader_projection_from_whole_schema(&metadata.file_schema, metadata.version)
 2034 |         });
 2035 |         if has_explicit_projection {
 2036 |             Self::validate_projection(&base_projection, &metadata)?;
 2037 |         }
 2038 |         let cache = Arc::new(cache.with_key_prefix(path.as_ref()));
 2039 |         let core = DecodeEngine::try_new(
 2040 |             scheduler,
 2041 |             base_projection,
 2042 |             decoder_plugins,
 2043 |             FileMetadataProvider::Full(metadata.clone()),
 2044 |             read_projection,
 2045 |             cache,
 2046 |             options,
 2047 |         )?;
 2048 |         Ok(Self { core, metadata })
 2049 |     }
 2050 | 
 2051 |     pub async fn read_all_metadata(scheduler: &FileScheduler) -> Result<CachedFileMetadata> {
 2052 |         match Self::read_raw_metadata_for_dispatch(scheduler).await? {
 2053 |             RawFileMetadataOpen::Legacy {
 2054 |                 major_version,
 2055 |                 minor_version,
 2056 |             } => Err(Error::version_conflict(
 2057 |                 "Attempt to use the Lance current-format reader to read v1 metadata".to_string(),
 2058 |                 major_version,
 2059 |                 minor_version,
 2060 |             )),
 2061 |             RawFileMetadataOpen::Current { version, metadata } => {
 2062 |                 versions::finish_metadata(version, metadata)
 2063 |             }
 2064 |         }
 2065 |     }
 2066 | 
 2067 |     pub async fn read_metadata_index(scheduler: &FileScheduler) -> Result<FileMetadataIndex> {
 2068 |         let index = Self::read_raw_metadata_index(scheduler).await?;
 2069 |         versions::finish_metadata_index(index)
 2070 |     }
 2071 | 
 2072 |     pub async fn read_metadata_index_with_schema(
 2073 |         scheduler: &FileScheduler,
 2074 |         file_schema: Arc<Schema>,
 2075 |         num_rows: u64,
 2076 |     ) -> Result<FileMetadataIndex> {
 2077 |         let index =
 2078 |             Self::read_raw_metadata_index_with_schema(scheduler, file_schema, num_rows).await?;
 2079 |         versions::finish_metadata_index(index)
 2080 |     }
 2081 | 
 2082 |     pub fn version(&self) -> ConcreteFileVersion {
 2083 |         self.metadata.version
 2084 |     }
 2085 | 
 2086 |     async fn prepare(&self, projection: ReaderProjection) -> Result<(PreparedProjection, u64)> {
 2087 |         self.core
 2088 |             .read_projection
 2089 |             .prepare(
 2090 |                 &self.core.metadata_provider,
 2091 |                 &projection,
 2092 |                 &self.core.scheduler,
 2093 |                 &self.core.cache,
 2094 |             )
 2095 |             .await
 2096 |     }
 2097 | 
 2098 |     pub async fn read_tasks(
 2099 |         &self,
 2100 |         params: ReadBatchParams,
 2101 |         batch_size: u32,
 2102 |         projection: Option<ReaderProjection>,
 2103 |         filter: FilterExpression,
 2104 |     ) -> Result<Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>> {
 2105 |         let projection = projection.unwrap_or_else(|| self.base_projection().clone());
 2106 |         let (prepared, read_len) = self.prepare(projection).await?;
 2107 |         self.read_prepared_tasks(params, batch_size, prepared, read_len, filter)
 2108 |             .await
 2109 |     }
 2110 | 
 2111 |     pub async fn read_stream_projected(
 2112 |         &self,
 2113 |         params: ReadBatchParams,
 2114 |         batch_size: u32,
 2115 |         batch_readahead: u32,
 2116 |         projection: ReaderProjection,
 2117 |         filter: FilterExpression,
 2118 |     ) -> Result<Pin<Box<dyn RecordBatchStream>>> {
 2119 |         let schema = projection.schema.clone();
 2120 |         let tasks = self
 2121 |             .read_tasks(params, batch_size, Some(projection), filter)
 2122 |             .await?;
 2123 |         Ok(tasks_to_record_batch_stream(schema, tasks, batch_readahead))
 2124 |     }
 2125 | 
 2126 |     pub fn read_stream_projected_blocking(
 2127 |         &self,
 2128 |         params: ReadBatchParams,
 2129 |         batch_size: u32,
 2130 |         projection: Option<ReaderProjection>,
 2131 |         filter: FilterExpression,
 2132 |     ) -> Result<Box<dyn RecordBatchReader + Send + 'static>> {
 2133 |         let projection = projection.unwrap_or_else(|| self.base_projection().clone());
 2134 |         Self::validate_projection(&projection, self.metadata())?;
 2135 |         let prepared = self.full_projection(projection);
 2136 |         let read_len = self.core.read_projection.read_length(&prepared)?;
 2137 |         self.read_prepared_blocking(params, batch_size, prepared, read_len, filter)
 2138 |     }
 2139 | 
 2140 |     pub async fn read_stream(
 2141 |         &self,
 2142 |         params: ReadBatchParams,
 2143 |         batch_size: u32,
 2144 |         batch_readahead: u32,
 2145 |         filter: FilterExpression,
 2146 |     ) -> Result<Pin<Box<dyn RecordBatchStream>>> {
 2147 |         self.read_stream_projected(
 2148 |             params,
 2149 |             batch_size,
 2150 |             batch_readahead,
 2151 |             self.base_projection().clone(),
 2152 |             filter,
 2153 |         )
 2154 |         .await
 2155 |     }
 2156 | }
 2157 | 
 2158 | impl ProjectedFileReader {
 2159 |     pub async fn try_open(
 2160 |         scheduler: FileScheduler,
 2161 |         base_projection: Option<ReaderProjection>,
 2162 |         decoder_plugins: Arc<DecoderPlugins>,
 2163 |         cache: &LanceCache,
 2164 |         options: FileReaderOptions,
 2165 |     ) -> Result<Self> {
 2166 |         let base_projection = base_projection.ok_or_else(|| {
 2167 |             Error::invalid_input("ProjectedReader requires an explicit base projection")
 2168 |         })?;
 2169 |         let metadata_index = Arc::new(FileReader::read_metadata_index(&scheduler).await?);
 2170 |         let path = scheduler.reader().path().clone();
 2171 |         let io = Arc::new(
 2172 |             LanceEncodingsIo::new(scheduler).with_read_chunk_size(options.read_chunk_size),
 2173 |         );
 2174 |         Self::try_open_with_metadata_index(
 2175 |             io,
 2176 |             path,
 2177 |             Some(base_projection),
 2178 |             decoder_plugins,
 2179 |             metadata_index,
 2180 |             cache,
 2181 |             options,
 2182 |         )
 2183 |         .await
 2184 |     }
 2185 | 
 2186 |     pub async fn try_open_with_metadata_index(
 2187 |         scheduler: Arc<dyn EncodingsIo>,
 2188 |         path: Path,
 2189 |         base_projection: Option<ReaderProjection>,
 2190 |         decoder_plugins: Arc<DecoderPlugins>,
 2191 |         metadata_index: Arc<FileMetadataIndex>,
 2192 |         cache: &LanceCache,
 2193 |         options: FileReaderOptions,
 2194 |     ) -> Result<Self> {
 2195 |         if metadata_index.version == ConcreteFileVersion::V1 {
 2196 |             return Err(Error::version_conflict(
 2197 |                 "Attempt to use the Lance projected current-format reader with v1 metadata"
 2198 |                     .to_string(),
 2199 |                 0,
 2200 |                 2,
 2201 |             ));
 2202 |         }
 2203 |         let base_projection = base_projection.ok_or_else(|| {
 2204 |             Error::invalid_input("ProjectedReader requires an explicit base projection")
 2205 |         })?;
 2206 |         let read_projection = versions::read_projection(metadata_index.version)?;
 2207 |         read_projection.validate_indexed(&base_projection, &metadata_index)?;
 2208 |         let cache = Arc::new(cache.with_key_prefix(path.as_ref()));
 2209 |         let core = DecodeEngine::try_new(
 2210 |             scheduler,
 2211 |             base_projection,
 2212 |             decoder_plugins,
 2213 |             FileMetadataProvider::Indexed(metadata_index),
 2214 |             read_projection,
 2215 |             cache,
 2216 |             options,
 2217 |         )?;
 2218 |         Ok(Self { core })
 2219 |     }
 2220 | 
 2221 |     pub async fn try_open_with_file_metadata(
 2222 |         scheduler: Arc<dyn EncodingsIo>,
 2223 |         path: Path,
 2224 |         base_projection: Option<ReaderProjection>,
 2225 |         decoder_plugins: Arc<DecoderPlugins>,
 2226 |         metadata: Arc<CachedFileMetadata>,
 2227 |         cache: &LanceCache,
 2228 |         options: FileReaderOptions,
 2229 |     ) -> Result<Self> {
 2230 |         if metadata.version == ConcreteFileVersion::V1 {
 2231 |             return Err(Error::version_conflict(
 2232 |                 "Attempt to use the Lance projected current-format reader with v1 metadata"
 2233 |                     .to_string(),
 2234 |                 metadata.major_version,
 2235 |                 metadata.minor_version,
 2236 |             ));
 2237 |         }
 2238 |         let read_projection = versions::read_projection(metadata.version)?;
 2239 |         let has_explicit_projection = base_projection.is_some();
 2240 |         let base_projection = base_projection.unwrap_or_else(|| {
 2241 |             versions::reader_projection_from_whole_schema(&metadata.file_schema, metadata.version)
 2242 |         });
 2243 |         if has_explicit_projection {
 2244 |             FileReader::validate_projection(&base_projection, &metadata)?;
 2245 |         }
 2246 |         let cache = Arc::new(cache.with_key_prefix(path.as_ref()));
 2247 |         let core = DecodeEngine::try_new(
 2248 |             scheduler,
 2249 |             base_projection,
 2250 |             decoder_plugins,
 2251 |             FileMetadataProvider::Full(metadata),
 2252 |             read_projection,
 2253 |             cache,
 2254 |             options,
 2255 |         )?;
 2256 |         Ok(Self { core })
 2257 |     }
 2258 | 
 2259 |     pub fn version(&self) -> ConcreteFileVersion {
 2260 |         self.core.metadata_provider.version()
 2261 |     }
 2262 | 
 2263 |     pub async fn read_tasks(
 2264 |         &self,
 2265 |         params: ReadBatchParams,
 2266 |         batch_size: u32,
 2267 |         projection: Option<ReaderProjection>,
 2268 |         filter: FilterExpression,
 2269 |     ) -> Result<Pin<Box<dyn Stream<Item = ReadBatchTask> + Send>>> {
 2270 |         let projection = projection.unwrap_or_else(|| self.base_projection().clone());
 2271 |         let (prepared, read_len) = self
 2272 |             .core
 2273 |             .read_projection
 2274 |             .prepare(
 2275 |                 &self.core.metadata_provider,
 2276 |                 &projection,
 2277 |                 &self.core.scheduler,
 2278 |                 &self.core.cache,
 2279 |             )
 2280 |             .await?;
 2281 |         self.read_prepared_tasks(params, batch_size, prepared, read_len, filter)
 2282 |             .await
 2283 |     }
 2284 | }
 2285 | 
 2286 | /// Inspects a page and returns a String describing the page's encoding
 2287 | pub fn describe_encoding(page: &pbfile::column_metadata::Page) -> String {
 2288 |     if let Some(encoding) = &page.encoding {
 2289 |         if let Some(style) = &encoding.location {
 2290 |             match style {
 2291 |                 pbfile::encoding::Location::Indirect(indirect) => {
 2292 |                     format!(
 2293 |                         "IndirectEncoding(pos={},size={})",
 2294 |                         indirect.buffer_location, indirect.buffer_length
 2295 |                     )
 2296 |                 }
 2297 |                 pbfile::encoding::Location::Direct(direct) => {
 2298 |                     let encoding_any =
 2299 |                         prost_types::Any::decode(Bytes::from(direct.encoding.clone()))
 2300 |                             .expect("failed to deserialize encoding as protobuf");
 2301 |                     if encoding_any.type_url == "/lance.encodings.ArrayEncoding" {
 2302 |                         let encoding = encoding_any.to_msg::<pbenc::ArrayEncoding>();
 2303 |                         match encoding {
 2304 |                             Ok(encoding) => {
 2305 |                                 format!("{:#?}", encoding)
 2306 |                             }
 2307 |                             Err(err) => {
 2308 |                                 format!("Unsupported(decode_err={})", err)
 2309 |                             }
 2310 |                         }
 2311 |                     } else if encoding_any.type_url == "/lance.encodings21.PageLayout" {
 2312 |                         let encoding = encoding_any.to_msg::<pbenc21::PageLayout>();
 2313 |                         match encoding {
 2314 |                             Ok(encoding) => {
 2315 |                                 format!("{:#?}", encoding)
 2316 |                             }
 2317 |                             Err(err) => {
 2318 |                                 format!("Unsupported(decode_err={})", err)
 2319 |                             }
 2320 |                         }
 2321 |                     } else {
 2322 |                         format!("Unrecognized(type_url={})", encoding_any.type_url)
 2323 |                     }
 2324 |                 }
 2325 |                 pbfile::encoding::Location::None(_) => "NoEncodingDescription".to_string(),
 2326 |             }
 2327 |         } else {
 2328 |             "MISSING STYLE".to_string()
 2329 |         }
 2330 |     } else {
 2331 |         "MISSING".to_string()
 2332 |     }
 2333 | }
 2334 | 
 2335 | pub trait EncodedBatchReaderExt {
 2336 |     fn try_from_mini_lance(bytes: Bytes, schema: &Schema) -> Result<Self>
 2337 |     where
 2338 |         Self: Sized;
 2339 |     fn try_from_self_described_lance(bytes: Bytes) -> Result<Self>
 2340 |     where
 2341 |         Self: Sized;
 2342 | }
 2343 | 
 2344 | impl EncodedBatchReaderExt for EncodedBatch {
 2345 |     fn try_from_mini_lance(bytes: Bytes, schema: &Schema) -> Result<Self>
 2346 |     where
 2347 |         Self: Sized,
 2348 |     {
 2349 |         let footer = FileReader::decode_footer(&bytes)?;
 2350 |         let file_version = FileReader::current_file_version(&footer)?;
 2351 |         let projection = versions::reader_projection_from_whole_schema(schema, file_version);
 2352 | 
 2353 |         // Next, read the metadata for the columns
 2354 |         // This is both the column metadata and the CMO table
 2355 |         let column_metadata_start = footer.column_meta_start as usize;
 2356 |         let column_metadata_end = footer.global_buff_offsets_start as usize;
 2357 |         let column_metadata_bytes = bytes.slice(column_metadata_start..column_metadata_end);
 2358 |         let column_metadatas =
 2359 |             FileReader::read_all_column_metadata(column_metadata_bytes, &footer)?;
 2360 | 
 2361 |         let page_table = versions::decode_column_metadata(file_version, &column_metadatas)?;
 2362 | 
 2363 |         Ok(Self {
 2364 |             data: bytes,
 2365 |             num_rows: page_table
 2366 |                 .first()
 2367 |                 .map(|col| col.page_infos.iter().map(|page| page.num_rows).sum::<u64>())
 2368 |                 .unwrap_or(0),
 2369 |             page_table,
 2370 |             top_level_columns: projection.column_indices,
 2371 |             schema: Arc::new(schema.clone()),
 2372 |         })
 2373 |     }
 2374 | 
 2375 |     fn try_from_self_described_lance(bytes: Bytes) -> Result<Self>
 2376 |     where
 2377 |         Self: Sized,
 2378 |     {
 2379 |         let footer = FileReader::decode_footer(&bytes)?;
 2380 |         let file_version = FileReader::current_file_version(&footer)?;
 2381 | 
 2382 |         let file_len = bytes.len() as u64;
 2383 |         let gbo_table = FileReader::do_decode_gbo_table(
 2384 |             &bytes.slice(footer.global_buff_offsets_start as usize..),
 2385 |             &footer,
 2386 |         )?;
 2387 |         FileReader::validate_gbo_table(&gbo_table, file_len, file_version)?;
 2388 |         if gbo_table.is_empty() {
 2389 |             return Err(Error::internal(
 2390 |                 "File did not contain any global buffers, schema expected".to_string(),
 2391 |             ));
 2392 |         }
 2393 |         let schema_range = gbo_table[0].checked_range(0, file_len)?;
 2394 |         let schema_start = schema_range.start as usize;
 2395 |         let schema_end = schema_range.end as usize;
 2396 | 
 2397 |         let schema_bytes = bytes.slice(schema_start..schema_end);
 2398 |         let (_, schema) = FileReader::decode_schema(schema_bytes)?;
 2399 |         let projection = versions::reader_projection_from_whole_schema(&schema, file_version);
 2400 | 
 2401 |         // Next, read the metadata for the columns
 2402 |         // This is both the column metadata and the CMO table
 2403 |         let column_metadata_start = footer.column_meta_start as usize;
 2404 |         let column_metadata_end = footer.global_buff_offsets_start as usize;
 2405 |         let column_metadata_bytes = bytes.slice(column_metadata_start..column_metadata_end);
 2406 |         let column_metadatas =
 2407 |             FileReader::read_all_column_metadata(column_metadata_bytes, &footer)?;
 2408 | 
 2409 |         let page_table = versions::decode_column_metadata(file_version, &column_metadatas)?;
 2410 | 
 2411 |         Ok(Self {
 2412 |             data: bytes,
 2413 |             num_rows: page_table
 2414 |                 .first()
 2415 |                 .map(|col| col.page_infos.iter().map(|page| page.num_rows).sum::<u64>())
 2416 |                 .unwrap_or(0),
 2417 |             page_table,
 2418 |             top_level_columns: projection.column_indices,
 2419 |             schema: Arc::new(schema),
 2420 |         })
 2421 |     }
 2422 | }
 2423 | 
 2424 | #[cfg(test)]
 2425 | mod tests {
 2426 |     use std::{
 2427 |         collections::{BTreeMap, HashMap},
 2428 |         pin::Pin,
 2429 |         sync::Arc,
 2430 |     };
 2431 | 
 2432 |     use arrow_array::{
 2433 |         DictionaryArray, Int8Array, Int32Array, ListArray, RecordBatch, RecordBatchIterator,
 2434 |         StringArray, UInt32Array,
 2435 |         cast::AsArray,
 2436 |         types::{Float64Type, Int8Type, Int32Type},
 2437 |     };
 2438 |     use arrow_buffer::{NullBuffer, OffsetBuffer, ScalarBuffer};
 2439 |     use arrow_schema::{DataType, Field, Fields, Schema as ArrowSchema};
 2440 |     use bytes::Bytes;
 2441 |     use futures::{StreamExt, prelude::stream::TryStreamExt};
 2442 |     use lance_arrow::{BLOB_META_KEY, RecordBatchExt};
 2443 |     use lance_core::{ArrowResult, datatypes::Schema};
 2444 |     use lance_datagen::{ArrayGeneratorExt, BatchCount, ByteCount, RowCount, array, gen_batch};
 2445 |     use lance_encoding::{
 2446 |         constants::{STRUCTURAL_ENCODING_META_KEY, STRUCTURAL_ENCODING_SPARSE},
 2447 |         decoder::{
 2448 |             DecodeBatchScheduler, DecoderPlugins, EncodedBatchLayout, FilterExpression,
 2449 |             PageEncoding, ReadBatchTask, decode_batch,
 2450 |         },
 2451 |         encoder::{EncodedBatch, EncodingOptions, encode_batch},
 2452 |         format::pb21,
 2453 |     };
 2454 |     use lance_io::{stream::RecordBatchStream, utils::CachedFileSize};
 2455 |     use log::debug;
 2456 |     use rstest::rstest;
 2457 |     use tokio::sync::mpsc;
 2458 | 
 2459 |     use crate::reader::{
 2460 |         EncodedBatchReaderExt, FileReader, FileReaderOptions, ProjectedFileReader, ReaderProjection,
 2461 |     };
 2462 |     use crate::testing::{FsFixture, WrittenFile, test_cache, write_lance_file};
 2463 |     use crate::version::{ConcreteFileVersion, LanceFileVersion};
 2464 |     use crate::versions;
 2465 |     use crate::writer::{FileWriterOptions, PAGE_BUFFER_ALIGNMENT};
 2466 |     use lance_encoding::decoder::DecoderConfig;
 2467 | 
 2468 |     fn footer_version(bytes: &[u8]) -> (u16, u16) {
 2469 |         let version_start = bytes.len() - 8;
 2470 |         (
 2471 |             u16::from_le_bytes([bytes[version_start], bytes[version_start + 1]]),
 2472 |             u16::from_le_bytes([bytes[version_start + 2], bytes[version_start + 3]]),
 2473 |         )
 2474 |     }
 2475 | 
 2476 |     #[tokio::test]
 2477 |     async fn sparse_file_writer_reader_scan_range_and_take_roundtrip() {
 2478 |         let fs = FsFixture::default();
 2479 |         let sparse_metadata = HashMap::from([(
 2480 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
 2481 |             STRUCTURAL_ENCODING_SPARSE.to_string(),
 2482 |         )]);
 2483 |         let value_field =
 2484 |             Field::new("values", DataType::Int32, true).with_metadata(sparse_metadata.clone());
 2485 |         let item_field = Arc::new(Field::new("item", DataType::Int32, true));
 2486 |         let list_field = Field::new("items", DataType::List(item_field.clone()), true)
 2487 |             .with_metadata(sparse_metadata);
 2488 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![value_field, list_field]));
 2489 |         let list = ListArray::try_new(
 2490 |             item_field,
 2491 |             OffsetBuffer::new(ScalarBuffer::from(vec![0_i32, 2, 2, 2, 3, 3, 5])),
 2492 |             Arc::new(Int32Array::from(vec![
 2493 |                 Some(1),
 2494 |                 None,
 2495 |                 Some(3),
 2496 |                 Some(4),
 2497 |                 Some(5),
 2498 |             ])),
 2499 |             Some(NullBuffer::from(vec![true, false, true, true, true, true])),
 2500 |         )
 2501 |         .unwrap();
 2502 |         let batch = RecordBatch::try_new(
 2503 |             arrow_schema.clone(),
 2504 |             vec![
 2505 |                 Arc::new(Int32Array::from(vec![
 2506 |                     Some(10),
 2507 |                     None,
 2508 |                     Some(30),
 2509 |                     Some(40),
 2510 |                     None,
 2511 |                     Some(60),
 2512 |                 ])),
 2513 |                 Arc::new(list),
 2514 |             ],
 2515 |         )
 2516 |         .unwrap();
 2517 |         let input = RecordBatchIterator::new(vec![Ok(batch.clone())], arrow_schema);
 2518 |         write_lance_file(
 2519 |             input,
 2520 |             &fs,
 2521 |             ConcreteFileVersion::V2_3,
 2522 |             FileWriterOptions::default(),
 2523 |         )
 2524 |         .await;
 2525 | 
 2526 |         let file_scheduler = fs
 2527 |             .scheduler
 2528 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 2529 |             .await
 2530 |             .unwrap();
 2531 |         let file_reader = FileReader::try_open(
 2532 |             file_scheduler,
 2533 |             None,
 2534 |             Arc::<DecoderPlugins>::default(),
 2535 |             &test_cache(),
 2536 |             FileReaderOptions::default(),
 2537 |         )
 2538 |         .await
 2539 |         .unwrap();
 2540 |         assert_eq!(file_reader.metadata().column_infos.len(), 2);
 2541 |         assert!(
 2542 |             file_reader
 2543 |                 .metadata()
 2544 |                 .column_infos
 2545 |                 .iter()
 2546 |                 .flat_map(|column| column.page_infos.iter())
 2547 |                 .all(|page| {
 2548 |                     matches!(
 2549 |                         &page.encoding,
 2550 |                         PageEncoding::Structural(layout)
 2551 |                             if matches!(
 2552 |                                 layout.layout,
 2553 |                                 Some(pb21::page_layout::Layout::SparseLayout(_))
 2554 |                             )
 2555 |                     )
 2556 |                 })
 2557 |         );
 2558 | 
 2559 |         let scan = file_reader
 2560 |             .read_stream(
 2561 |                 lance_io::ReadBatchParams::RangeFull,
 2562 |                 1024,
 2563 |                 1,
 2564 |                 FilterExpression::no_filter(),
 2565 |             )
 2566 |             .await
 2567 |             .unwrap()
 2568 |             .try_collect::<Vec<_>>()
 2569 |             .await
 2570 |             .unwrap();
 2571 |         assert_eq!(scan, vec![batch.clone()]);
 2572 | 
 2573 |         let range = file_reader
 2574 |             .read_stream(
 2575 |                 lance_io::ReadBatchParams::Range(1..5),
 2576 |                 1024,
 2577 |                 1,
 2578 |                 FilterExpression::no_filter(),
 2579 |             )
 2580 |             .await
 2581 |             .unwrap()
 2582 |             .try_collect::<Vec<_>>()
 2583 |             .await
 2584 |             .unwrap();
 2585 |         assert_eq!(range, vec![batch.slice(1, 4)]);
 2586 | 
 2587 |         let indices = UInt32Array::from(vec![0, 3, 5]);
 2588 |         let take = file_reader
 2589 |             .read_stream(
 2590 |                 lance_io::ReadBatchParams::Indices(indices.clone()),
 2591 |                 1024,
 2592 |                 1,
 2593 |                 FilterExpression::no_filter(),
 2594 |             )
 2595 |             .await
 2596 |             .unwrap()
 2597 |             .try_collect::<Vec<_>>()
 2598 |             .await
 2599 |             .unwrap();
 2600 |         assert_eq!(take, vec![batch.take(&indices).unwrap()]);
 2601 |     }
 2602 | 
 2603 |     #[tokio::test]
 2604 |     async fn full_int8_dictionary_v2_2_roundtrip() {
 2605 |         let fs = FsFixture::default();
 2606 |         let values = Arc::new(StringArray::from(
 2607 |             (0..=i8::MAX)
 2608 |                 .map(|value| format!("value-{value}"))
 2609 |                 .collect::<Vec<_>>(),
 2610 |         ));
 2611 |         let keys = Int8Array::from((0..=i8::MAX).collect::<Vec<_>>());
 2612 |         let dictionary = Arc::new(DictionaryArray::<Int8Type>::new(keys, values));
 2613 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
 2614 |             "dictionary",
 2615 |             DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Utf8)),
 2616 |             true,
 2617 |         )]));
 2618 |         let batch = RecordBatch::try_new(arrow_schema.clone(), vec![dictionary]).unwrap();
 2619 | 
 2620 |         write_lance_file(
 2621 |             RecordBatchIterator::new([Ok(batch.clone())], arrow_schema),
 2622 |             &fs,
 2623 |             ConcreteFileVersion::V2_2,
 2624 |             FileWriterOptions::default(),
 2625 |         )
 2626 |         .await;
 2627 | 
 2628 |         let file_scheduler = fs
 2629 |             .scheduler
 2630 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 2631 |             .await
 2632 |             .unwrap();
 2633 |         let file_reader = FileReader::try_open(
 2634 |             file_scheduler,
 2635 |             None,
 2636 |             Arc::<DecoderPlugins>::default(),
 2637 |             &test_cache(),
 2638 |             FileReaderOptions::default(),
 2639 |         )
 2640 |         .await
 2641 |         .unwrap();
 2642 |         let actual = file_reader
 2643 |             .read_stream(
 2644 |                 lance_io::ReadBatchParams::RangeFull,
 2645 |                 1024,
 2646 |                 1,
 2647 |                 FilterExpression::no_filter(),
 2648 |             )
 2649 |             .await
 2650 |             .unwrap()
 2651 |             .try_collect::<Vec<_>>()
 2652 |             .await
 2653 |             .unwrap();
 2654 | 
 2655 |         assert_eq!(actual, vec![batch]);
 2656 |     }
 2657 | 
 2658 |     async fn create_some_file(fs: &FsFixture, version: ConcreteFileVersion) -> WrittenFile {
 2659 |         let location_type = DataType::Struct(Fields::from(vec![
 2660 |             Field::new("x", DataType::Float64, true),
 2661 |             Field::new("y", DataType::Float64, true),
 2662 |         ]));
 2663 |         let categories_type = DataType::List(Arc::new(Field::new("item", DataType::Utf8, true)));
 2664 | 
 2665 |         let mut reader = gen_batch()
 2666 |             .col("score", array::rand::<Float64Type>())
 2667 |             .col("location", array::rand_type(&location_type))
 2668 |             .col("categories", array::rand_type(&categories_type))
 2669 |             .col("binary", array::rand_type(&DataType::Binary));
 2670 |         if version == ConcreteFileVersion::V2_0 {
 2671 |             reader = reader.col("large_bin", array::rand_type(&DataType::LargeBinary));
 2672 |         }
 2673 |         let reader = reader.into_reader_rows(RowCount::from(1000), BatchCount::from(100));
 2674 | 
 2675 |         write_lance_file(reader, fs, version, FileWriterOptions::default()).await
 2676 |     }
 2677 | 
 2678 |     async fn create_wide_direct_file(fs: &FsFixture, num_columns: usize) -> WrittenFile {
 2679 |         let mut reader = gen_batch();
 2680 |         for column_idx in 0..num_columns {
 2681 |             reader = reader.col(format!("c{column_idx}"), array::step::<Int32Type>());
 2682 |         }
 2683 |         let reader = reader.into_reader_rows(RowCount::from(1000), BatchCount::from(100));
 2684 | 
 2685 |         write_lance_file(
 2686 |             reader,
 2687 |             fs,
 2688 |             ConcreteFileVersion::V2_1,
 2689 |             FileWriterOptions::default(),
 2690 |         )
 2691 |         .await
 2692 |     }
 2693 | 
 2694 |     async fn create_wide_fixed_size_list_file(fs: &FsFixture, num_columns: usize) -> WrittenFile {
 2695 |         let data_type =
 2696 |             DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), 4);
 2697 |         let mut reader = gen_batch();
 2698 |         for column_idx in 0..num_columns {
 2699 |             reader = reader.col(
 2700 |                 format!("c{column_idx}"),
 2701 |                 array::rand_type(&data_type).with_random_nulls(0.1),
 2702 |             );
 2703 |         }
 2704 |         let reader = reader.into_reader_rows(RowCount::from(64), BatchCount::from(4));
 2705 | 
 2706 |         write_lance_file(
 2707 |             reader,
 2708 |             fs,
 2709 |             ConcreteFileVersion::V2_1,
 2710 |             FileWriterOptions::default(),
 2711 |         )
 2712 |         .await
 2713 |     }
 2714 | 
 2715 |     async fn create_wide_structural_file(fs: &FsFixture, num_groups: usize) -> WrittenFile {
 2716 |         let struct_type = DataType::Struct(Fields::from(vec![
 2717 |             Field::new("x", DataType::Int32, true),
 2718 |             Field::new("y", DataType::Int32, true),
 2719 |         ]));
 2720 |         let list_type = DataType::List(Arc::new(Field::new("item", DataType::Int32, true)));
 2721 |         let mut reader = gen_batch();
 2722 |         for group_idx in 0..num_groups {
 2723 |             reader = reader
 2724 |                 .col(
 2725 |                     format!("s{group_idx}"),
 2726 |                     array::rand_type(&struct_type).with_random_nulls(0.5),
 2727 |                 )
 2728 |                 .col(
 2729 |                     format!("l{group_idx}"),
 2730 |                     array::rand_type(&list_type).with_random_nulls(0.5),
 2731 |                 );
 2732 |         }
 2733 |         let reader = reader.into_reader_rows(RowCount::from(64), BatchCount::from(4));
 2734 | 
 2735 |         write_lance_file(
 2736 |             reader,
 2737 |             fs,
 2738 |             ConcreteFileVersion::V2_1,
 2739 |             FileWriterOptions::default(),
 2740 |         )
 2741 |         .await
 2742 |     }
 2743 | 
 2744 |     type Transformer = Box<dyn Fn(&RecordBatch) -> RecordBatch>;
 2745 | 
 2746 |     async fn verify_expected(
 2747 |         expected: &[RecordBatch],
 2748 |         mut actual: Pin<Box<dyn RecordBatchStream>>,
 2749 |         read_size: u32,
 2750 |         transform: Option<Transformer>,
 2751 |     ) {
 2752 |         let mut remaining = expected.iter().map(|batch| batch.num_rows()).sum::<usize>() as u32;
 2753 |         let mut expected_iter = expected.iter().map(|batch| {
 2754 |             if let Some(transform) = &transform {
 2755 |                 transform(batch)
 2756 |             } else {
 2757 |                 batch.clone()
 2758 |             }
 2759 |         });
 2760 |         let mut next_expected = expected_iter.next().unwrap().clone();
 2761 |         while let Some(actual) = actual.next().await {
 2762 |             let mut actual = actual.unwrap();
 2763 |             let mut rows_to_verify = actual.num_rows() as u32;
 2764 |             let expected_length = remaining.min(read_size);
 2765 |             assert_eq!(expected_length, rows_to_verify);
 2766 | 
 2767 |             while rows_to_verify > 0 {
 2768 |                 let next_slice_len = (next_expected.num_rows() as u32).min(rows_to_verify);
 2769 |                 assert_eq!(
 2770 |                     next_expected.slice(0, next_slice_len as usize),
 2771 |                     actual.slice(0, next_slice_len as usize)
 2772 |                 );
 2773 |                 remaining -= next_slice_len;
 2774 |                 rows_to_verify -= next_slice_len;
 2775 |                 if remaining > 0 {
 2776 |                     if next_slice_len == next_expected.num_rows() as u32 {
 2777 |                         next_expected = expected_iter.next().unwrap().clone();
 2778 |                     } else {
 2779 |                         next_expected = next_expected.slice(
 2780 |                             next_slice_len as usize,
 2781 |                             next_expected.num_rows() - next_slice_len as usize,
 2782 |                         );
 2783 |                     }
 2784 |                 }
 2785 |                 if rows_to_verify > 0 {
 2786 |                     actual = actual.slice(
 2787 |                         next_slice_len as usize,
 2788 |                         actual.num_rows() - next_slice_len as usize,
 2789 |                     );
 2790 |                 }
 2791 |             }
 2792 |         }
 2793 |         assert_eq!(remaining, 0);
 2794 |     }
 2795 | 
 2796 |     async fn collect_read_tasks(
 2797 |         tasks: Pin<Box<dyn futures::Stream<Item = ReadBatchTask> + Send>>,
 2798 |         readahead: usize,
 2799 |     ) -> Vec<RecordBatch> {
 2800 |         tasks
 2801 |             .map(|task| task.task)
 2802 |             .buffered(readahead)
 2803 |             .try_collect::<Vec<_>>()
 2804 |             .await
 2805 |             .unwrap()
 2806 |     }
 2807 | 
 2808 |     /// Writes `batch` to a fresh file, overwrites `patch` bytes at `patch_offset`
 2809 |     /// into the single occurrence of `pattern`, and reads the file back with the
 2810 |     /// default reader configuration.
 2811 |     async fn read_file_with_mutated_bytes(
 2812 |         version: LanceFileVersion,
 2813 |         batch: RecordBatch,
 2814 |         pattern: &[u8],
 2815 |         patch_offset: usize,
 2816 |         patch: &[u8],
 2817 |     ) -> lance_core::Result<Vec<RecordBatch>> {
 2818 |         let fs = FsFixture::default();
 2819 |         let schema = batch.schema();
 2820 |         write_lance_file(
 2821 |             RecordBatchIterator::new(vec![Ok(batch)], schema),
 2822 |             &fs,
 2823 |             version.resolve(),
 2824 |             FileWriterOptions::default(),
 2825 |         )
 2826 |         .await;
 2827 | 
 2828 |         let mut bytes = fs
 2829 |             .object_store
 2830 |             .read_one_all(&fs.tmp_path)
 2831 |             .await
 2832 |             .unwrap()
 2833 |             .to_vec();
 2834 |         let matches = bytes
 2835 |             .windows(pattern.len())
 2836 |             .enumerate()
 2837 |             .filter_map(|(position, window)| (window == pattern).then_some(position))
 2838 |             .collect::<Vec<_>>();
 2839 |         assert_eq!(
 2840 |             matches.len(),
 2841 |             1,
 2842 |             "expected the byte pattern to appear exactly once in the file"
 2843 |         );
 2844 |         let patch_start = matches[0] + patch_offset;
 2845 |         bytes[patch_start..patch_start + patch.len()].copy_from_slice(patch);
 2846 |         fs.object_store.put(&fs.tmp_path, &bytes).await.unwrap();
 2847 | 
 2848 |         let file_scheduler = fs
 2849 |             .scheduler
 2850 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 2851 |             .await
 2852 |             .unwrap();
 2853 |         let file_reader = FileReader::try_open(
 2854 |             file_scheduler,
 2855 |             None,
 2856 |             Arc::<DecoderPlugins>::default(),
 2857 |             &test_cache(),
 2858 |             FileReaderOptions::default(),
 2859 |         )
 2860 |         .await
 2861 |         .unwrap();
 2862 |         file_reader
 2863 |             .read_stream(
 2864 |                 lance_io::ReadBatchParams::RangeFull,
 2865 |                 1024,
 2866 |                 16,
 2867 |                 FilterExpression::no_filter(),
 2868 |             )
 2869 |             .await?
 2870 |             .try_collect::<Vec<_>>()
 2871 |             .await
 2872 |     }
 2873 | 
 2874 |     #[tokio::test]
 2875 |     async fn test_reader_rejects_excess_miniblock_row_counts() {
 2876 |         let batch =
 2877 |             arrow_array::record_batch!(("id", UInt64, (0..2048_u64).collect::<Vec<_>>())).unwrap();
 2878 |         let fs = FsFixture::default();
 2879 |         write_lance_file(
 2880 |             RecordBatchIterator::new(vec![Ok(batch.clone())], batch.schema()),
 2881 |             &fs,
 2882 |             ConcreteFileVersion::V2_1,
 2883 |             FileWriterOptions::default(),
 2884 |         )
 2885 |         .await;
 2886 | 
 2887 |         let mut bytes = fs
 2888 |             .object_store
 2889 |             .read_one_all(&fs.tmp_path)
 2890 |             .await
 2891 |             .unwrap()
 2892 |             .to_vec();
 2893 |         // V2.1 places this column's first mini-block metadata word at byte zero.
 2894 |         // The issue's mutation makes its non-final item count exceed the page total.
 2895 |         bytes[0] ^= 0xf7;
 2896 |         fs.object_store.put(&fs.tmp_path, &bytes).await.unwrap();
 2897 | 
 2898 |         let file_scheduler = fs
 2899 |             .scheduler
 2900 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 2901 |             .await
 2902 |             .unwrap();
 2903 |         let file_reader = FileReader::try_open(
 2904 |             file_scheduler,
 2905 |             None,
 2906 |             Arc::<DecoderPlugins>::default(),
 2907 |             &test_cache(),
 2908 |             FileReaderOptions::default(),
 2909 |         )
 2910 |         .await
 2911 |         .unwrap();
 2912 |         let result = file_reader
 2913 |             .read_stream(
 2914 |                 lance_io::ReadBatchParams::RangeFull,
 2915 |                 1024,
 2916 |                 16,
 2917 |                 FilterExpression::no_filter(),
 2918 |             )
 2919 |             .await;
 2920 |         let error = match result {
 2921 |             Ok(stream) => stream
 2922 |                 .try_collect::<Vec<_>>()
 2923 |                 .await
 2924 |                 .expect_err("excess mini-block row counts must fail the read"),
 2925 |             Err(error) => error,
 2926 |         };
 2927 |         assert!(
 2928 |             matches!(error, lance_core::Error::CorruptFile { .. }),
 2929 |             "expected CorruptFile, got: {error}"
 2930 |         );
 2931 |         assert!(
 2932 |             error.to_string().contains("exceeding items_in_page"),
 2933 |             "unexpected message: {error}"
 2934 |         );
 2935 |     }
 2936 | 
 2937 |     /// A corrupt file whose variable-width offsets point outside the value bytes
 2938 |     /// must fail with a typed error under the default reader configuration
 2939 |     /// (`validate_on_decode` disabled) instead of materializing values outside
 2940 |     /// the data buffer.
 2941 |     ///
 2942 |     /// Uses a dictionary-encoded string column because its values page stores
 2943 |     /// the offsets verbatim, so flipping the tail offset in the file reaches the
 2944 |     /// Arrow conversion boundary without being rejected by an intermediate
 2945 |     /// decompressor.
 2946 |     #[rstest]
 2947 |     #[tokio::test]
 2948 |     async fn test_default_reader_rejects_out_of_bounds_variable_width_offsets(
 2949 |         #[values(LanceFileVersion::V2_1, LanceFileVersion::V2_2, LanceFileVersion::V2_3)]
 2950 |         version: LanceFileVersion,
 2951 |     ) {
 2952 |         use arrow_array::{Array, DictionaryArray, Int32Array, StringArray};
 2953 | 
 2954 |         let values = StringArray::from(vec!["alpha", "beta", "gamma"]);
 2955 |         let indices = Int32Array::from((0..300).map(|i| i % 3).collect::<Vec<i32>>());
 2956 |         let dictionary = DictionaryArray::new(indices, Arc::new(values));
 2957 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
 2958 |             "category",
 2959 |             dictionary.data_type().clone(),
 2960 |             false,
 2961 |         )]));
 2962 |         let batch = RecordBatch::try_new(arrow_schema, vec![Arc::new(dictionary)]).unwrap();
 2963 | 
 2964 |         // The dictionary values page stores the value offsets as plain
 2965 |         // little-endian i32s ending with [5, 9, 14] (2.1 also stores the leading
 2966 |         // zero, 2.2+ omits it).  If a future encoding change stops storing these
 2967 |         // offsets verbatim this lookup fails loudly and the test needs a new
 2968 |         // byte pattern.  The patch rewrites the tail offset so it points far
 2969 |         // beyond the value bytes.
 2970 |         let offsets_tail_pattern = [5_i32, 9, 14]
 2971 |             .iter()
 2972 |             .flat_map(|value| value.to_le_bytes())
 2973 |             .collect::<Vec<u8>>();
 2974 |         let error = read_file_with_mutated_bytes(
 2975 |             version,
 2976 |             batch,
 2977 |             &offsets_tail_pattern,
 2978 |             8,
 2979 |             &100_000_i32.to_le_bytes(),
 2980 |         )
 2981 |         .await
 2982 |         .expect_err("out-of-bounds offsets must fail the read");
 2983 |         assert!(
 2984 |             matches!(error, lance_core::Error::CorruptFile { .. }),
 2985 |             "expected CorruptFile, got: {error}"
 2986 |         );
 2987 |         assert!(
 2988 |             error.to_string().contains("out of bounds"),
 2989 |             "unexpected message: {error}"
 2990 |         );
 2991 |     }
 2992 | 
 2993 |     /// Storage dictionaries expand their values through `DataBlockBuilder`
 2994 |     /// before the final Arrow layout validation.  Corrupt dictionary offsets
 2995 |     /// must therefore fail at the append boundary instead of reaching a slice
 2996 |     /// operation with a decreasing range.
 2997 |     #[rstest]
 2998 |     #[tokio::test]
 2999 |     async fn test_default_reader_rejects_non_monotonic_storage_dictionary_offsets(
 3000 |         #[values(LanceFileVersion::V2_1, LanceFileVersion::V2_2, LanceFileVersion::V2_3)]
 3001 |         version: LanceFileVersion,
 3002 |     ) {
 3003 |         use arrow_array::StringArray;
 3004 | 
 3005 |         let metadata = HashMap::from([
 3006 |             (
 3007 |                 "lance-encoding:dict-size-ratio".to_string(),
 3008 |                 "0.99".to_string(),
 3009 |             ),
 3010 |             (
 3011 |                 "lance-encoding:dict-values-compression".to_string(),
 3012 |                 "none".to_string(),
 3013 |             ),
 3014 |         ]);
 3015 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 3016 |             Field::new("category", DataType::Utf8, false).with_metadata(metadata),
 3017 |         ]));
 3018 |         let values = (0..300)
 3019 |             .map(|index| match index % 3 {
 3020 |                 0 => "alpha",
 3021 |                 1 => "beta",
 3022 |                 _ => "gamma",
 3023 |             })
 3024 |             .collect::<Vec<_>>();
 3025 |         let batch =
 3026 |             RecordBatch::try_new(arrow_schema, vec![Arc::new(StringArray::from(values))]).unwrap();
 3027 | 
 3028 |         let offsets_tail_pattern = [5_i32, 9, 14]
 3029 |             .iter()
 3030 |             .flat_map(|value| value.to_le_bytes())
 3031 |             .collect::<Vec<u8>>();
 3032 |         let error = read_file_with_mutated_bytes(
 3033 |             version,
 3034 |             batch,
 3035 |             &offsets_tail_pattern,
 3036 |             4,
 3037 |             &2_i32.to_le_bytes(),
 3038 |         )
 3039 |         .await
 3040 |         .expect_err("non-monotonic dictionary offsets must fail the read");
 3041 |         assert!(
 3042 |             matches!(error, lance_core::Error::CorruptFile { .. }),
 3043 |             "expected CorruptFile, got: {error}"
 3044 |         );
 3045 |         assert!(
 3046 |             error.to_string().contains("decreases"),
 3047 |             "unexpected message: {error}"
 3048 |         );
 3049 |     }
 3050 | 
 3051 |     /// Same contract as the test above, but for a plain (non-dictionary) string
 3052 |     /// column: the mini-block chunk stores chunk-relative value offsets that are
 3053 |     /// used to slice the chunk, so a corrupt tail offset must surface as a typed
 3054 |     /// error from the chunk decompressor instead of a panic in the decode task.
 3055 |     #[rstest]
 3056 |     #[tokio::test]
 3057 |     async fn test_default_reader_rejects_out_of_bounds_miniblock_offsets(
 3058 |         #[values(LanceFileVersion::V2_1, LanceFileVersion::V2_2, LanceFileVersion::V2_3)]
 3059 |         version: LanceFileVersion,
 3060 |     ) {
 3061 |         use arrow_array::StringArray;
 3062 | 
 3063 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
 3064 |             "strings",
 3065 |             DataType::Utf8,
 3066 |             false,
 3067 |         )]));
 3068 |         let batch = RecordBatch::try_new(
 3069 |             arrow_schema,
 3070 |             vec![Arc::new(StringArray::from(vec!["alpha", "beta", "gamma"]))],
 3071 |         )
 3072 |         .unwrap();
 3073 | 
 3074 |         // For ["alpha", "beta", "gamma"] the chunk stores LE i32 offsets
 3075 |         // [16, 21, 25, 30] (chunk-relative: a 16-byte offsets region precedes
 3076 |         // the value bytes).  The patch rewrites the tail offset to point far
 3077 |         // past the chunk.
 3078 |         let chunk_offsets_pattern = [16_i32, 21, 25, 30]
 3079 |             .iter()
 3080 |             .flat_map(|value| value.to_le_bytes())
 3081 |             .collect::<Vec<u8>>();
 3082 |         let error = read_file_with_mutated_bytes(
 3083 |             version,
 3084 |             batch,
 3085 |             &chunk_offsets_pattern,
 3086 |             12,
 3087 |             &100_000_i32.to_le_bytes(),
 3088 |         )
 3089 |         .await
 3090 |         .expect_err("an out-of-bounds chunk offset must fail the read");
 3091 |         assert!(
 3092 |             matches!(error, lance_core::Error::CorruptFile { .. }),
 3093 |             "expected CorruptFile, got: {error}"
 3094 |         );
 3095 |         assert!(
 3096 |             error.to_string().contains("out of bounds"),
 3097 |             "unexpected message: {error}"
 3098 |         );
 3099 |     }
 3100 | 
 3101 |     #[tokio::test]
 3102 |     async fn test_round_trip() {
 3103 |         let fs = FsFixture::default();
 3104 | 
 3105 |         let WrittenFile { data, .. } = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 3106 | 
 3107 |         let file_size = fs.object_store.size(&fs.tmp_path).await.unwrap() as usize;
 3108 |         let footer = fs
 3109 |             .object_store
 3110 |             .open(&fs.tmp_path)
 3111 |             .await
 3112 |             .unwrap()
 3113 |             .get_range(file_size - 8..file_size)
 3114 |             .await
 3115 |             .unwrap();
 3116 |         assert_eq!(footer_version(&footer), (0, 3));
 3117 |         assert_eq!(
 3118 |             crate::determine_file_version(&fs.object_store, &fs.tmp_path, Some(file_size))
 3119 |                 .await
 3120 |                 .unwrap(),
 3121 |             ConcreteFileVersion::V2_0
 3122 |         );
 3123 | 
 3124 |         for read_size in [32, 1024, 1024 * 1024] {
 3125 |             let file_scheduler = fs
 3126 |                 .scheduler
 3127 |                 .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3128 |                 .await
 3129 |                 .unwrap();
 3130 |             let file_reader = FileReader::try_open(
 3131 |                 file_scheduler,
 3132 |                 None,
 3133 |                 Arc::<DecoderPlugins>::default(),
 3134 |                 &test_cache(),
 3135 |                 FileReaderOptions::default(),
 3136 |             )
 3137 |             .await
 3138 |             .unwrap();
 3139 | 
 3140 |             assert_eq!(
 3141 |                 (
 3142 |                     file_reader.metadata().major_version,
 3143 |                     file_reader.metadata().minor_version
 3144 |                 ),
 3145 |                 (0, 3)
 3146 |             );
 3147 |             let schema = file_reader.schema();
 3148 |             assert_eq!(schema.metadata.get("foo").unwrap(), "bar");
 3149 | 
 3150 |             let batch_stream = file_reader
 3151 |                 .read_stream(
 3152 |                     lance_io::ReadBatchParams::RangeFull,
 3153 |                     read_size,
 3154 |                     16,
 3155 |                     FilterExpression::no_filter(),
 3156 |                 )
 3157 |                 .await
 3158 |                 .unwrap();
 3159 | 
 3160 |             verify_expected(&data, batch_stream, read_size, None).await;
 3161 |         }
 3162 |     }
 3163 | 
 3164 |     #[rstest]
 3165 |     #[test_log::test(tokio::test)]
 3166 |     async fn test_encoded_batch_round_trip(
 3167 |         // TODO: Add V2_1 (currently fails)
 3168 |         #[values(ConcreteFileVersion::V2_0)] version: ConcreteFileVersion,
 3169 |     ) {
 3170 |         let data = gen_batch()
 3171 |             .col("x", array::rand::<Int32Type>())
 3172 |             .col("y", array::rand_utf8(ByteCount::from(16), false))
 3173 |             .into_batch_rows(RowCount::from(10000))
 3174 |             .unwrap();
 3175 | 
 3176 |         let lance_schema = Arc::new(Schema::try_from(data.schema().as_ref()).unwrap());
 3177 | 
 3178 |         let encoding_options = EncodingOptions {
 3179 |             cache_bytes_per_column: 4096,
 3180 |             max_page_bytes: 32 * 1024 * 1024,
 3181 |             keep_original_array: true,
 3182 |             buffer_alignment: 64,
 3183 |         };
 3184 | 
 3185 |         let encoding_strategy = crate::versions::v2_0::encoding_strategy();
 3186 | 
 3187 |         let encoded_batch = encode_batch(
 3188 |             &data,
 3189 |             lance_schema.clone(),
 3190 |             encoding_strategy.as_ref(),
 3191 |             &encoding_options,
 3192 |         )
 3193 |         .await
 3194 |         .unwrap();
 3195 | 
 3196 |         // Test self described
 3197 |         let bytes = versions::encode_self_described_batch(version, &encoded_batch).unwrap();
 3198 |         assert_eq!(footer_version(&bytes), (2, 0));
 3199 | 
 3200 |         let decoded_batch = EncodedBatch::try_from_self_described_lance(bytes).unwrap();
 3201 | 
 3202 |         let decoded = decode_batch(
 3203 |             &decoded_batch,
 3204 |             &FilterExpression::no_filter(),
 3205 |             Arc::<DecoderPlugins>::default(),
 3206 |             false,
 3207 |             EncodedBatchLayout::Array,
 3208 |             None,
 3209 |         )
 3210 |         .await
 3211 |         .unwrap();
 3212 | 
 3213 |         assert_eq!(data, decoded);
 3214 | 
 3215 |         // Test mini
 3216 |         let bytes = versions::encode_mini_batch(version, &encoded_batch).unwrap();
 3217 |         assert_eq!(footer_version(&bytes), (2, 0));
 3218 |         let decoded_batch =
 3219 |             EncodedBatch::try_from_mini_lance(bytes, lance_schema.as_ref()).unwrap();
 3220 |         let decoded = decode_batch(
 3221 |             &decoded_batch,
 3222 |             &FilterExpression::no_filter(),
 3223 |             Arc::<DecoderPlugins>::default(),
 3224 |             false,
 3225 |             EncodedBatchLayout::Array,
 3226 |             None,
 3227 |         )
 3228 |         .await
 3229 |         .unwrap();
 3230 | 
 3231 |         assert_eq!(data, decoded);
 3232 |     }
 3233 | 
 3234 |     #[rstest]
 3235 |     #[test_log::test(tokio::test)]
 3236 |     async fn test_projection(
 3237 |         #[values(
 3238 |             ConcreteFileVersion::V2_0,
 3239 |             ConcreteFileVersion::V2_1,
 3240 |             ConcreteFileVersion::V2_2
 3241 |         )]
 3242 |         version: ConcreteFileVersion,
 3243 |     ) {
 3244 |         let fs = FsFixture::default();
 3245 | 
 3246 |         let written_file = create_some_file(&fs, version).await;
 3247 |         let file_scheduler = fs
 3248 |             .scheduler
 3249 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3250 |             .await
 3251 |             .unwrap();
 3252 | 
 3253 |         let field_id_mapping = written_file
 3254 |             .field_id_mapping
 3255 |             .iter()
 3256 |             .copied()
 3257 |             .collect::<BTreeMap<_, _>>();
 3258 | 
 3259 |         let empty_projection = ReaderProjection {
 3260 |             column_indices: Vec::default(),
 3261 |             schema: Arc::new(Schema::default()),
 3262 |         };
 3263 | 
 3264 |         for columns in [
 3265 |             vec!["score"],
 3266 |             vec!["location"],
 3267 |             vec!["categories"],
 3268 |             vec!["score.x"],
 3269 |             vec!["score", "categories"],
 3270 |             vec!["score", "location"],
 3271 |             vec!["location", "categories"],
 3272 |             vec!["score.y", "location", "categories"],
 3273 |         ] {
 3274 |             debug!("Testing round trip with projection {:?}", columns);
 3275 |             for use_field_ids in [true, false] {
 3276 |                 // We can specify the projection as part of the read operation via read_stream_projected
 3277 |                 let file_reader = FileReader::try_open(
 3278 |                     file_scheduler.clone(),
 3279 |                     None,
 3280 |                     Arc::<DecoderPlugins>::default(),
 3281 |                     &test_cache(),
 3282 |                     FileReaderOptions::default(),
 3283 |                 )
 3284 |                 .await
 3285 |                 .unwrap();
 3286 | 
 3287 |                 let projected_schema = written_file.schema.project(&columns).unwrap();
 3288 |                 let projection = if use_field_ids {
 3289 |                     versions::reader_projection_from_field_ids(
 3290 |                         file_reader.metadata().version(),
 3291 |                         &projected_schema,
 3292 |                         &field_id_mapping,
 3293 |                     )
 3294 |                     .unwrap()
 3295 |                 } else {
 3296 |                     versions::reader_projection_from_column_names(
 3297 |                         file_reader.metadata().version(),
 3298 |                         &written_file.schema,
 3299 |                         &columns,
 3300 |                     )
 3301 |                     .unwrap()
 3302 |                 };
 3303 | 
 3304 |                 let batch_stream = file_reader
 3305 |                     .read_stream_projected(
 3306 |                         lance_io::ReadBatchParams::RangeFull,
 3307 |                         1024,
 3308 |                         16,
 3309 |                         projection.clone(),
 3310 |                         FilterExpression::no_filter(),
 3311 |                     )
 3312 |                     .await
 3313 |                     .unwrap();
 3314 | 
 3315 |                 let projection_arrow = ArrowSchema::from(projection.schema.as_ref());
 3316 |                 verify_expected(
 3317 |                     &written_file.data,
 3318 |                     batch_stream,
 3319 |                     1024,
 3320 |                     Some(Box::new(move |batch: &RecordBatch| {
 3321 |                         batch.project_by_schema(&projection_arrow).unwrap()
 3322 |                     })),
 3323 |                 )
 3324 |                 .await;
 3325 | 
 3326 |                 // We can also specify the projection as a base projection when we open the file
 3327 |                 let file_reader = FileReader::try_open(
 3328 |                     file_scheduler.clone(),
 3329 |                     Some(projection.clone()),
 3330 |                     Arc::<DecoderPlugins>::default(),
 3331 |                     &test_cache(),
 3332 |                     FileReaderOptions::default(),
 3333 |                 )
 3334 |                 .await
 3335 |                 .unwrap();
 3336 | 
 3337 |                 let batch_stream = file_reader
 3338 |                     .read_stream(
 3339 |                         lance_io::ReadBatchParams::RangeFull,
 3340 |                         1024,
 3341 |                         16,
 3342 |                         FilterExpression::no_filter(),
 3343 |                     )
 3344 |                     .await
 3345 |                     .unwrap();
 3346 | 
 3347 |                 let projection_arrow = ArrowSchema::from(projection.schema.as_ref());
 3348 |                 verify_expected(
 3349 |                     &written_file.data,
 3350 |                     batch_stream,
 3351 |                     1024,
 3352 |                     Some(Box::new(move |batch: &RecordBatch| {
 3353 |                         batch.project_by_schema(&projection_arrow).unwrap()
 3354 |                     })),
 3355 |                 )
 3356 |                 .await;
 3357 | 
 3358 |                 assert!(
 3359 |                     file_reader
 3360 |                         .read_stream_projected(
 3361 |                             lance_io::ReadBatchParams::RangeFull,
 3362 |                             1024,
 3363 |                             16,
 3364 |                             empty_projection.clone(),
 3365 |                             FilterExpression::no_filter(),
 3366 |                         )
 3367 |                         .await
 3368 |                         .is_err()
 3369 |                 );
 3370 |             }
 3371 |         }
 3372 | 
 3373 |         assert!(
 3374 |             FileReader::try_open(
 3375 |                 file_scheduler.clone(),
 3376 |                 Some(empty_projection),
 3377 |                 Arc::<DecoderPlugins>::default(),
 3378 |                 &test_cache(),
 3379 |                 FileReaderOptions::default(),
 3380 |             )
 3381 |             .await
 3382 |             .is_err()
 3383 |         );
 3384 | 
 3385 |         let arrow_schema = ArrowSchema::new(vec![
 3386 |             Field::new("x", DataType::Int32, true),
 3387 |             Field::new("y", DataType::Int32, true),
 3388 |         ]);
 3389 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 3390 | 
 3391 |         let projection_with_dupes = ReaderProjection {
 3392 |             column_indices: vec![0, 0],
 3393 |             schema: Arc::new(schema),
 3394 |         };
 3395 | 
 3396 |         assert!(
 3397 |             FileReader::try_open(
 3398 |                 file_scheduler.clone(),
 3399 |                 Some(projection_with_dupes),
 3400 |                 Arc::<DecoderPlugins>::default(),
 3401 |                 &test_cache(),
 3402 |                 FileReaderOptions::default(),
 3403 |             )
 3404 |             .await
 3405 |             .is_err()
 3406 |         );
 3407 |     }
 3408 | 
 3409 |     #[tokio::test]
 3410 |     async fn test_lazy_reader_direct_projection_matches_eager_reader() {
 3411 |         let fs = FsFixture::default();
 3412 |         let written_file = create_wide_direct_file(&fs, 16).await;
 3413 | 
 3414 |         let file_scheduler = fs
 3415 |             .scheduler
 3416 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3417 |             .await
 3418 |             .unwrap();
 3419 |         let projection = versions::reader_projection_from_column_names(
 3420 |             ConcreteFileVersion::V2_1,
 3421 |             &written_file.schema,
 3422 |             &["c10"],
 3423 |         )
 3424 |         .unwrap();
 3425 | 
 3426 |         let eager_reader = FileReader::try_open(
 3427 |             file_scheduler.clone(),
 3428 |             None,
 3429 |             Arc::<DecoderPlugins>::default(),
 3430 |             &test_cache(),
 3431 |             FileReaderOptions::default(),
 3432 |         )
 3433 |         .await
 3434 |         .unwrap();
 3435 |         let expected = eager_reader
 3436 |             .read_stream_projected(
 3437 |                 lance_io::ReadBatchParams::RangeFull,
 3438 |                 127,
 3439 |                 16,
 3440 |                 projection.clone(),
 3441 |                 FilterExpression::no_filter(),
 3442 |             )
 3443 |             .await
 3444 |             .unwrap()
 3445 |             .try_collect::<Vec<_>>()
 3446 |             .await
 3447 |             .unwrap();
 3448 | 
 3449 |         let cache = test_cache();
 3450 |         let lazy_reader = ProjectedFileReader::try_open(
 3451 |             file_scheduler,
 3452 |             Some(projection.clone()),
 3453 |             Arc::<DecoderPlugins>::default(),
 3454 |             &cache,
 3455 |             FileReaderOptions::default(),
 3456 |         )
 3457 |         .await
 3458 |         .unwrap();
 3459 |         let tasks = lazy_reader
 3460 |             .read_tasks(
 3461 |                 lance_io::ReadBatchParams::RangeFull,
 3462 |                 127,
 3463 |                 None,
 3464 |                 FilterExpression::no_filter(),
 3465 |             )
 3466 |             .await
 3467 |             .unwrap();
 3468 |         let actual = collect_read_tasks(tasks, 16).await;
 3469 | 
 3470 |         assert_eq!(expected, actual);
 3471 |     }
 3472 | 
 3473 |     #[tokio::test]
 3474 |     async fn test_lazy_reader_loads_only_requested_column_metadata() {
 3475 |         let fs = FsFixture::default();
 3476 |         let written_file = create_wide_direct_file(&fs, 512).await;
 3477 | 
 3478 |         let projection = versions::reader_projection_from_column_names(
 3479 |             ConcreteFileVersion::V2_1,
 3480 |             &written_file.schema,
 3481 |             &["c0"],
 3482 |         )
 3483 |         .unwrap();
 3484 |         let file_scheduler = fs
 3485 |             .scheduler
 3486 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3487 |             .await
 3488 |             .unwrap();
 3489 |         let lazy_reader = ProjectedFileReader::try_open(
 3490 |             file_scheduler,
 3491 |             Some(projection.clone()),
 3492 |             Arc::<DecoderPlugins>::default(),
 3493 |             &test_cache(),
 3494 |             FileReaderOptions::default(),
 3495 |         )
 3496 |         .await
 3497 |         .unwrap();
 3498 |         let selected_column = projection.column_indices[0] as usize;
 3499 |         let requested_metadata_bytes = lazy_reader
 3500 |             .metadata_index()
 3501 |             .unwrap()
 3502 |             .column_metadata_offsets[selected_column]
 3503 |             .1;
 3504 |         let total_metadata_bytes = lazy_reader
 3505 |             .metadata_index()
 3506 |             .unwrap()
 3507 |             .column_metadata_offsets
 3508 |             .iter()
 3509 |             .map(|(_, length)| *length)
 3510 |             .sum::<u64>();
 3511 |         assert!(
 3512 |             total_metadata_bytes > 8 * fs.object_store.block_size() as u64,
 3513 |             "test file metadata is too small to prove lazy loading: {total_metadata_bytes} bytes"
 3514 |         );
 3515 | 
 3516 |         fs.object_store.io_stats_incremental();
 3517 |         let tasks = lazy_reader
 3518 |             .read_tasks(
 3519 |                 lance_io::ReadBatchParams::Range(0..0),
 3520 |                 1024,
 3521 |                 Some(projection.clone()),
 3522 |                 FilterExpression::no_filter(),
 3523 |             )
 3524 |             .await
 3525 |             .unwrap();
 3526 |         let batches = collect_read_tasks(tasks, 1).await;
 3527 |         assert!(batches.is_empty());
 3528 | 
 3529 |         let stats = fs.object_store.io_stats_incremental();
 3530 |         assert!(
 3531 |             stats.read_bytes < total_metadata_bytes / 2,
 3532 |             "lazy read fetched too much metadata: read {} bytes, requested column metadata is {} bytes, total column metadata is {} bytes",
 3533 |             stats.read_bytes,
 3534 |             requested_metadata_bytes,
 3535 |             total_metadata_bytes
 3536 |         );
 3537 | 
 3538 |         fs.object_store.io_stats_incremental();
 3539 |         let tasks = lazy_reader
 3540 |             .read_tasks(
 3541 |                 lance_io::ReadBatchParams::Range(0..0),
 3542 |                 1024,
 3543 |                 Some(projection),
 3544 |                 FilterExpression::no_filter(),
 3545 |             )
 3546 |             .await
 3547 |             .unwrap();
 3548 |         let batches = collect_read_tasks(tasks, 1).await;
 3549 |         assert!(batches.is_empty());
 3550 | 
 3551 |         let stats = fs.object_store.io_stats_incremental();
 3552 |         assert_eq!(
 3553 |             stats.read_iops, 0,
 3554 |             "cached column metadata should avoid repeat metadata I/O"
 3555 |         );
 3556 |         assert_eq!(
 3557 |             stats.read_bytes, 0,
 3558 |             "cached column metadata should avoid repeat metadata reads"
 3559 |         );
 3560 |     }
 3561 | 
 3562 |     async fn assert_lazy_projection_matches_eager_and_reads_metadata_subset(
 3563 |         fs: &FsFixture,
 3564 |         projection: ReaderProjection,
 3565 |         shape: &str,
 3566 |     ) -> Vec<RecordBatch> {
 3567 |         let file_scheduler = fs
 3568 |             .scheduler
 3569 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3570 |             .await
 3571 |             .unwrap();
 3572 |         let eager_reader = FileReader::try_open(
 3573 |             file_scheduler.clone(),
 3574 |             None,
 3575 |             Arc::<DecoderPlugins>::default(),
 3576 |             &test_cache(),
 3577 |             FileReaderOptions::default(),
 3578 |         )
 3579 |         .await
 3580 |         .unwrap();
 3581 |         let expected = eager_reader
 3582 |             .read_stream_projected(
 3583 |                 lance_io::ReadBatchParams::RangeFull,
 3584 |                 127,
 3585 |                 16,
 3586 |                 projection.clone(),
 3587 |                 FilterExpression::no_filter(),
 3588 |             )
 3589 |             .await
 3590 |             .unwrap()
 3591 |             .try_collect::<Vec<_>>()
 3592 |             .await
 3593 |             .unwrap();
 3594 | 
 3595 |         let cache = test_cache();
 3596 |         let lazy_reader = ProjectedFileReader::try_open(
 3597 |             file_scheduler,
 3598 |             Some(projection.clone()),
 3599 |             Arc::<DecoderPlugins>::default(),
 3600 |             &cache,
 3601 |             FileReaderOptions::default(),
 3602 |         )
 3603 |         .await
 3604 |         .unwrap();
 3605 |         let metadata_index = lazy_reader.metadata_index().unwrap();
 3606 |         let requested_metadata_bytes = projection
 3607 |             .column_indices
 3608 |             .iter()
 3609 |             .map(|column_index| metadata_index.column_metadata_offsets[*column_index as usize].1)
 3610 |             .sum::<u64>();
 3611 |         let total_metadata_bytes = metadata_index
 3612 |             .column_metadata_offsets
 3613 |             .iter()
 3614 |             .map(|(_, length)| *length)
 3615 |             .sum::<u64>();
 3616 |         assert!(total_metadata_bytes > requested_metadata_bytes * 8);
 3617 | 
 3618 |         fs.object_store.io_stats_incremental();
 3619 |         let tasks = lazy_reader
 3620 |             .read_tasks(
 3621 |                 lance_io::ReadBatchParams::Range(0..0),
 3622 |                 127,
 3623 |                 None,
 3624 |                 FilterExpression::no_filter(),
 3625 |             )
 3626 |             .await
 3627 |             .unwrap();
 3628 |         assert!(collect_read_tasks(tasks, 1).await.is_empty());
 3629 |         let metadata_stats = fs.object_store.io_stats_incremental();
 3630 |         assert!(
 3631 |             metadata_stats.read_bytes < total_metadata_bytes / 2,
 3632 |             "lazy {shape} read fetched too much metadata: read {} bytes, requested column metadata is {} bytes, total column metadata is {} bytes",
 3633 |             metadata_stats.read_bytes,
 3634 |             requested_metadata_bytes,
 3635 |             total_metadata_bytes
 3636 |         );
 3637 | 
 3638 |         let tasks = lazy_reader
 3639 |             .read_tasks(
 3640 |                 lance_io::ReadBatchParams::RangeFull,
 3641 |                 127,
 3642 |                 None,
 3643 |                 FilterExpression::no_filter(),
 3644 |             )
 3645 |             .await
 3646 |             .unwrap();
 3647 |         let actual = collect_read_tasks(tasks, 16).await;
 3648 |         assert_eq!(expected, actual);
 3649 |         actual
 3650 |     }
 3651 | 
 3652 |     #[tokio::test]
 3653 |     async fn test_lazy_reader_fixed_size_list_projection_matches_eager_reader() {
 3654 |         let fs = FsFixture::default();
 3655 |         let written_file = create_wide_fixed_size_list_file(&fs, 512).await;
 3656 |         let projection = versions::reader_projection_from_column_names(
 3657 |             ConcreteFileVersion::V2_1,
 3658 |             &written_file.schema,
 3659 |             &["c17", "c509"],
 3660 |         )
 3661 |         .unwrap();
 3662 |         assert!(projection.prefers_indexed_metadata(512));
 3663 |         assert_lazy_projection_matches_eager_and_reads_metadata_subset(
 3664 |             &fs,
 3665 |             projection,
 3666 |             "fixed-size-list",
 3667 |         )
 3668 |         .await;
 3669 |     }
 3670 | 
 3671 |     #[tokio::test]
 3672 |     async fn test_v2_0_rejects_indexed_metadata_reader() {
 3673 |         let fs = FsFixture::default();
 3674 |         let written_file = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 3675 |         let projection = versions::reader_projection_from_column_names(
 3676 |             ConcreteFileVersion::V2_0,
 3677 |             &written_file.schema,
 3678 |             &["score"],
 3679 |         )
 3680 |         .unwrap();
 3681 |         assert!(projection.prefers_indexed_metadata(100));
 3682 | 
 3683 |         let file_scheduler = fs
 3684 |             .scheduler
 3685 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3686 |             .await
 3687 |             .unwrap();
 3688 |         let err = ProjectedFileReader::try_open(
 3689 |             file_scheduler,
 3690 |             Some(projection),
 3691 |             Arc::<DecoderPlugins>::default(),
 3692 |             &test_cache(),
 3693 |             FileReaderOptions::default(),
 3694 |         )
 3695 |         .await
 3696 |         .unwrap_err();
 3697 |         assert!(
 3698 |             matches!(err, lance_core::Error::NotSupported { .. }),
 3699 |             "expected V2.0 indexed metadata open to fail, got {err:?}"
 3700 |         );
 3701 |     }
 3702 | 
 3703 |     #[tokio::test]
 3704 |     async fn test_lazy_reader_nested_projection_compacts_physical_columns() {
 3705 |         let fs = FsFixture::default();
 3706 |         let written_file = create_wide_structural_file(&fs, 128).await;
 3707 |         let projection = versions::reader_projection_from_column_names(
 3708 |             ConcreteFileVersion::V2_1,
 3709 |             &written_file.schema,
 3710 |             &["s97.y", "l4", "s3"],
 3711 |         )
 3712 |         .unwrap();
 3713 | 
 3714 |         assert_eq!(
 3715 |             projection
 3716 |                 .schema
 3717 |                 .fields
 3718 |                 .iter()
 3719 |                 .map(|field| field.name.as_str())
 3720 |                 .collect::<Vec<_>>(),
 3721 |             vec!["s97", "l4", "s3"]
 3722 |         );
 3723 |         assert_eq!(projection.schema.fields[0].children.len(), 1);
 3724 |         assert_eq!(projection.schema.fields[0].children[0].name, "y");
 3725 |         assert_eq!(projection.schema.fields[2].children.len(), 2);
 3726 |         assert_eq!(projection.column_indices.len(), 4);
 3727 |         assert!(
 3728 |             projection
 3729 |                 .column_indices
 3730 |                 .windows(2)
 3731 |                 .any(|indices| indices[0] > indices[1]),
 3732 |             "the projection must reorder physical columns to exercise compact remapping"
 3733 |         );
 3734 |         assert!(projection.prefers_indexed_metadata(128 * 4));
 3735 |         let actual = assert_lazy_projection_matches_eager_and_reads_metadata_subset(
 3736 |             &fs, projection, "nested",
 3737 |         )
 3738 |         .await;
 3739 |         assert!(
 3740 |             actual
 3741 |                 .iter()
 3742 |                 .flat_map(|batch| batch.columns())
 3743 |                 .any(|column| column.null_count() > 0),
 3744 |             "the structural projection must exercise nullable arrays"
 3745 |         );
 3746 |     }
 3747 | 
 3748 |     #[rstest]
 3749 |     #[case::before_metadata_region(90, 5)]
 3750 |     #[case::after_metadata_region(190, 20)]
 3751 |     fn test_decode_cmo_table_rejects_out_of_range_offsets(
 3752 |         #[case] position: u64,
 3753 |         #[case] length: u64,
 3754 |     ) {
 3755 |         let mut cmo_table = [0; 16];
 3756 |         cmo_table[0..8].copy_from_slice(&position.to_le_bytes());
 3757 |         cmo_table[8..16].copy_from_slice(&length.to_le_bytes());
 3758 |         let footer = super::Footer {
 3759 |             column_meta_start: 100,
 3760 |             column_meta_offsets_start: 200,
 3761 |             global_buff_offsets_start: 200,
 3762 |             num_global_buffers: 0,
 3763 |             num_columns: 1,
 3764 |             major_version: 2,
 3765 |             minor_version: 1,
 3766 |         };
 3767 | 
 3768 |         let err = FileReader::decode_cmo_table(Bytes::copy_from_slice(&cmo_table), &footer)
 3769 |             .expect_err("out-of-range CMO entries must be rejected");
 3770 |         assert!(
 3771 |             matches!(err, lance_core::Error::InvalidInput { .. }),
 3772 |             "expected InvalidInput, got {err:?}"
 3773 |         );
 3774 |     }
 3775 | 
 3776 |     #[rstest]
 3777 |     #[case::blob(BLOB_META_KEY)]
 3778 |     #[case::packed_struct("lance-encoding:packed")]
 3779 |     #[tokio::test]
 3780 |     async fn test_lazy_reader_rejects_opaque_projection(#[case] metadata_key: &str) {
 3781 |         let fs = FsFixture::default();
 3782 |         let written_file = create_some_file(&fs, ConcreteFileVersion::V2_1).await;
 3783 | 
 3784 |         let ordinary_projection = versions::reader_projection_from_column_names(
 3785 |             ConcreteFileVersion::V2_1,
 3786 |             &written_file.schema,
 3787 |             &["location.x"],
 3788 |         )
 3789 |         .unwrap();
 3790 |         assert_eq!(ordinary_projection.schema.fields[0].children.len(), 1);
 3791 |         assert!(ordinary_projection.prefers_indexed_metadata(100));
 3792 | 
 3793 |         let file_scheduler = fs
 3794 |             .scheduler
 3795 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3796 |             .await
 3797 |             .unwrap();
 3798 |         let err = ProjectedFileReader::try_open(
 3799 |             file_scheduler.clone(),
 3800 |             None,
 3801 |             Arc::<DecoderPlugins>::default(),
 3802 |             &test_cache(),
 3803 |             FileReaderOptions::default(),
 3804 |         )
 3805 |         .await
 3806 |         .unwrap_err();
 3807 |         assert!(
 3808 |             matches!(err, lance_core::Error::InvalidInput { .. }),
 3809 |             "expected InvalidInput, got {err:?}"
 3810 |         );
 3811 | 
 3812 |         let mut projection = ordinary_projection;
 3813 |         Arc::make_mut(&mut projection.schema).fields[0]
 3814 |             .metadata
 3815 |             .insert(metadata_key.to_string(), "true".to_string());
 3816 |         assert!(!projection.prefers_indexed_metadata(100));
 3817 | 
 3818 |         let err = ProjectedFileReader::try_open(
 3819 |             file_scheduler,
 3820 |             Some(projection),
 3821 |             Arc::<DecoderPlugins>::default(),
 3822 |             &test_cache(),
 3823 |             FileReaderOptions::default(),
 3824 |         )
 3825 |         .await
 3826 |         .unwrap_err();
 3827 |         assert!(
 3828 |             matches!(err, lance_core::Error::NotSupported { .. }),
 3829 |             "expected NotSupported for {metadata_key}, got {err:?}"
 3830 |         );
 3831 |     }
 3832 | 
 3833 |     // The projection-length validation lives in `DecodeEngine`, shared by the
 3834 |     // eager and the lazy (indexed) metadata providers. The indexed provider loads
 3835 |     // only the projected columns and renumbers them 0..N, so this checks that the
 3836 |     // renumbered `column_infos`/`column_indices` still line up for the length
 3837 |     // check: a mismatched-length projection is rejected through
 3838 |     // `ProjectedFileReader`, and a single short column resolves to its own length.
 3839 |     #[tokio::test]
 3840 |     async fn test_lazy_reader_validates_unequal_length_projection() {
 3841 |         use arrow_array::Int32Array;
 3842 |         use lance_io::ReadBatchParams;
 3843 | 
 3844 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 3845 |             Field::new("a", DataType::Int32, true),
 3846 |             Field::new("c", DataType::Int32, true),
 3847 |         ]));
 3848 |         let lance_schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
 3849 | 
 3850 |         let fs = FsFixture::default();
 3851 |         let mut writer = versions::v2_1::create_writer(
 3852 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
 3853 |             lance_schema.clone(),
 3854 |             FileWriterOptions::default(),
 3855 |         )
 3856 |         .unwrap();
 3857 |         // "a" has 5 rows, "c" has 1 -- an unequal-length file.
 3858 |         writer
 3859 |             .write_column(0, Arc::new(Int32Array::from(vec![1, 2, 3, 4, 5])))
 3860 |             .await
 3861 |             .unwrap();
 3862 |         writer
 3863 |             .write_column(1, Arc::new(Int32Array::from(vec![100])))
 3864 |             .await
 3865 |             .unwrap();
 3866 |         writer.finish().await.unwrap();
 3867 | 
 3868 |         let file_scheduler = fs
 3869 |             .scheduler
 3870 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3871 |             .await
 3872 |             .unwrap();
 3873 |         let cache = test_cache();
 3874 |         let open_indexed = |names: &[&str]| {
 3875 |             let projection = versions::reader_projection_from_column_names(
 3876 |                 ConcreteFileVersion::V2_1,
 3877 |                 &lance_schema,
 3878 |                 names,
 3879 |             )
 3880 |             .unwrap();
 3881 |             ProjectedFileReader::try_open(
 3882 |                 file_scheduler.clone(),
 3883 |                 Some(projection),
 3884 |                 Arc::<DecoderPlugins>::default(),
 3885 |                 &cache,
 3886 |                 FileReaderOptions::default(),
 3887 |             )
 3888 |         };
 3889 | 
 3890 |         // A mismatched-length projection [a, c] (5 vs 1) is rejected at read time,
 3891 |         // through the indexed provider's renumbered column infos.
 3892 |         let lazy = open_indexed(&["a", "c"]).await.unwrap();
 3893 |         // (`read_tasks` yields a stream, which is not `Debug`, so match rather
 3894 |         // than `unwrap_err`.)
 3895 |         let err = match lazy
 3896 |             .read_tasks(
 3897 |                 ReadBatchParams::RangeFull,
 3898 |                 1024,
 3899 |                 None,
 3900 |                 FilterExpression::no_filter(),
 3901 |             )
 3902 |             .await
 3903 |         {
 3904 |             Ok(_) => panic!("expected the mismatched-length projection to be rejected"),
 3905 |             Err(e) => e.to_string(),
 3906 |         };
 3907 |         assert!(
 3908 |             err.contains("a=5") && err.contains("c=1"),
 3909 |             "error should name each column's length, got: {err}"
 3910 |         );
 3911 | 
 3912 |         // A single short column resolves to its own length (1), not the file's
 3913 |         // longest column.
 3914 |         let lazy = open_indexed(&["c"]).await.unwrap();
 3915 |         let tasks = lazy
 3916 |             .read_tasks(
 3917 |                 ReadBatchParams::RangeFull,
 3918 |                 1024,
 3919 |                 None,
 3920 |                 FilterExpression::no_filter(),
 3921 |             )
 3922 |             .await
 3923 |             .unwrap();
 3924 |         let batches = collect_read_tasks(tasks, 16).await;
 3925 |         let values: Vec<Option<i32>> = batches
 3926 |             .iter()
 3927 |             .flat_map(|b| {
 3928 |                 b.column(0)
 3929 |                     .as_any()
 3930 |                     .downcast_ref::<Int32Array>()
 3931 |                     .unwrap()
 3932 |                     .iter()
 3933 |                     .collect::<Vec<_>>()
 3934 |             })
 3935 |             .collect();
 3936 |         assert_eq!(values, vec![Some(100)]);
 3937 |     }
 3938 | 
 3939 |     #[test_log::test(tokio::test)]
 3940 |     async fn test_compressing_buffer() {
 3941 |         let fs = FsFixture::default();
 3942 | 
 3943 |         let written_file = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 3944 |         let file_scheduler = fs
 3945 |             .scheduler
 3946 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 3947 |             .await
 3948 |             .unwrap();
 3949 | 
 3950 |         // We can specify the projection as part of the read operation via read_stream_projected
 3951 |         let file_reader = FileReader::try_open(
 3952 |             file_scheduler.clone(),
 3953 |             None,
 3954 |             Arc::<DecoderPlugins>::default(),
 3955 |             &test_cache(),
 3956 |             FileReaderOptions::default(),
 3957 |         )
 3958 |         .await
 3959 |         .unwrap();
 3960 | 
 3961 |         let mut projection = written_file.schema.project(&["score"]).unwrap();
 3962 |         for field in projection.fields.iter_mut() {
 3963 |             field
 3964 |                 .metadata
 3965 |                 .insert("lance:compression".to_string(), "zstd".to_string());
 3966 |         }
 3967 |         let projection = ReaderProjection {
 3968 |             column_indices: projection.fields.iter().map(|f| f.id as u32).collect(),
 3969 |             schema: Arc::new(projection),
 3970 |         };
 3971 | 
 3972 |         let batch_stream = file_reader
 3973 |             .read_stream_projected(
 3974 |                 lance_io::ReadBatchParams::RangeFull,
 3975 |                 1024,
 3976 |                 16,
 3977 |                 projection.clone(),
 3978 |                 FilterExpression::no_filter(),
 3979 |             )
 3980 |             .await
 3981 |             .unwrap();
 3982 | 
 3983 |         let projection_arrow = Arc::new(ArrowSchema::from(projection.schema.as_ref()));
 3984 |         verify_expected(
 3985 |             &written_file.data,
 3986 |             batch_stream,
 3987 |             1024,
 3988 |             Some(Box::new(move |batch: &RecordBatch| {
 3989 |                 batch.project_by_schema(&projection_arrow).unwrap()
 3990 |             })),
 3991 |         )
 3992 |         .await;
 3993 |     }
 3994 | 
 3995 |     #[tokio::test]
 3996 |     async fn test_read_all() {
 3997 |         let fs = FsFixture::default();
 3998 |         let WrittenFile { data, .. } = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 3999 |         let total_rows = data.iter().map(|batch| batch.num_rows()).sum::<usize>();
 4000 | 
 4001 |         let file_scheduler = fs
 4002 |             .scheduler
 4003 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4004 |             .await
 4005 |             .unwrap();
 4006 |         let file_reader = FileReader::try_open(
 4007 |             file_scheduler.clone(),
 4008 |             None,
 4009 |             Arc::<DecoderPlugins>::default(),
 4010 |             &test_cache(),
 4011 |             FileReaderOptions::default(),
 4012 |         )
 4013 |         .await
 4014 |         .unwrap();
 4015 | 
 4016 |         let batches = file_reader
 4017 |             .read_stream(
 4018 |                 lance_io::ReadBatchParams::RangeFull,
 4019 |                 total_rows as u32,
 4020 |                 16,
 4021 |                 FilterExpression::no_filter(),
 4022 |             )
 4023 |             .await
 4024 |             .unwrap()
 4025 |             .try_collect::<Vec<_>>()
 4026 |             .await
 4027 |             .unwrap();
 4028 |         assert_eq!(batches.len(), 1);
 4029 |         assert_eq!(batches[0].num_rows(), total_rows);
 4030 |     }
 4031 | 
 4032 |     /// The writer cuts a column into many small pages when its buffer is
 4033 |     /// small (or, for nested columns, when the rep/def levels of a page hit
 4034 |     /// the mini-block budget). Reading them must not cost one request per page.
 4035 |     #[tokio::test]
 4036 |     async fn test_read_batches_page_reads_into_one_request() {
 4037 |         let fs = FsFixture::default();
 4038 |         // Every batch is 40 KiB of values, so the 64 KiB buffer flushes a page
 4039 |         // after every second batch.
 4040 |         let reader = gen_batch()
 4041 |             .col("x", array::step::<Int32Type>())
 4042 |             .into_reader_rows(RowCount::from(10_000), BatchCount::from(10));
 4043 |         write_lance_file(
 4044 |             reader,
 4045 |             &fs,
 4046 |             ConcreteFileVersion::V2_1,
 4047 |             FileWriterOptions {
 4048 |                 data_cache_bytes: Some(64 * 1024),
 4049 |                 ..Default::default()
 4050 |             },
 4051 |         )
 4052 |         .await;
 4053 | 
 4054 |         let file_scheduler = fs
 4055 |             .scheduler
 4056 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4057 |             .await
 4058 |             .unwrap();
 4059 |         let file_reader = FileReader::try_open(
 4060 |             file_scheduler,
 4061 |             None,
 4062 |             Arc::<DecoderPlugins>::default(),
 4063 |             &test_cache(),
 4064 |             FileReaderOptions::default(),
 4065 |         )
 4066 |         .await
 4067 |         .unwrap();
 4068 |         let num_pages = file_reader.metadata().column_infos[0].page_infos.len();
 4069 |         assert!(
 4070 |             num_pages > 4,
 4071 |             "the writer must cut several pages, got {num_pages}"
 4072 |         );
 4073 | 
 4074 |         let read_all = || async {
 4075 |             file_reader
 4076 |                 .read_stream(
 4077 |                     lance_io::ReadBatchParams::RangeFull,
 4078 |                     100_000,
 4079 |                     16,
 4080 |                     FilterExpression::no_filter(),
 4081 |                 )
 4082 |                 .await
 4083 |                 .unwrap()
 4084 |                 .try_collect::<Vec<_>>()
 4085 |                 .await
 4086 |                 .unwrap()
 4087 |         };
 4088 |         // The first read also initializes the page metadata; the cache keeps
 4089 |         // it, so the second read is data I/O only.
 4090 |         read_all().await;
 4091 |         fs.object_store.io_stats_incremental();
 4092 |         let batches = read_all().await;
 4093 |         assert_eq!(
 4094 |             batches.iter().map(|batch| batch.num_rows()).sum::<usize>(),
 4095 |             100_000
 4096 |         );
 4097 |         let stats = fs.object_store.io_stats_incremental();
 4098 |         assert_eq!(
 4099 |             stats.read_iops, 1,
 4100 |             "{num_pages} adjacent pages must be read together, not one request each"
 4101 |         );
 4102 |     }
 4103 | 
 4104 |     #[rstest]
 4105 |     #[tokio::test]
 4106 |     async fn test_take_batches_column_reads_into_one_request(
 4107 |         #[values(ConcreteFileVersion::V2_0, ConcreteFileVersion::V2_1)]
 4108 |         version: ConcreteFileVersion,
 4109 |     ) {
 4110 |         let fs = FsFixture::default();
 4111 |         // 16 int32 columns of 256 rows: one 1 KiB page each, written back to
 4112 |         // back, so one row's reads sit within the local 4 KiB block size.
 4113 |         let mut generator = gen_batch();
 4114 |         for i in 0..16 {
 4115 |             generator = generator.col(format!("c{i}"), array::step::<Int32Type>());
 4116 |         }
 4117 |         write_lance_file(
 4118 |             generator.into_reader_rows(RowCount::from(256), BatchCount::from(1)),
 4119 |             &fs,
 4120 |             version,
 4121 |             FileWriterOptions::default(),
 4122 |         )
 4123 |         .await;
 4124 | 
 4125 |         let file_scheduler = fs
 4126 |             .scheduler
 4127 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4128 |             .await
 4129 |             .unwrap();
 4130 |         let file_reader = FileReader::try_open(
 4131 |             file_scheduler,
 4132 |             None,
 4133 |             Arc::<DecoderPlugins>::default(),
 4134 |             &test_cache(),
 4135 |             FileReaderOptions::default(),
 4136 |         )
 4137 |         .await
 4138 |         .unwrap();
 4139 | 
 4140 |         let take = |row: u32| {
 4141 |             let file_reader = &file_reader;
 4142 |             async move {
 4143 |                 file_reader
 4144 |                     .read_stream(
 4145 |                         lance_io::ReadBatchParams::Indices(UInt32Array::from(vec![row])),
 4146 |                         1,
 4147 |                         1,
 4148 |                         FilterExpression::no_filter(),
 4149 |                     )
 4150 |                     .await
 4151 |                     .unwrap()
 4152 |                     .try_collect::<Vec<_>>()
 4153 |                     .await
 4154 |                     .unwrap()
 4155 |             }
 4156 |         };
 4157 |         // The first take also initializes the page metadata; the cache keeps
 4158 |         // it, so the second take is data I/O only.
 4159 |         take(3).await;
 4160 |         fs.object_store.io_stats_incremental();
 4161 |         let batches = take(200).await;
 4162 |         let stats = fs.object_store.io_stats_incremental();
 4163 |         assert_eq!(
 4164 |             stats.read_iops, 1,
 4165 |             "one row across 16 adjacent column pages must be one request, not one per column"
 4166 |         );
 4167 |         assert_eq!(batches[0].num_columns(), 16);
 4168 |         for column in batches[0].columns() {
 4169 |             assert_eq!(column.as_primitive::<Int32Type>().value(0), 200);
 4170 |         }
 4171 |     }
 4172 | 
 4173 |     #[rstest]
 4174 |     #[tokio::test]
 4175 |     async fn test_blocking_take(
 4176 |         #[values(
 4177 |             ConcreteFileVersion::V2_0,
 4178 |             ConcreteFileVersion::V2_1,
 4179 |             ConcreteFileVersion::V2_2
 4180 |         )]
 4181 |         version: ConcreteFileVersion,
 4182 |     ) {
 4183 |         let fs = FsFixture::default();
 4184 |         let WrittenFile { data, schema, .. } = create_some_file(&fs, version).await;
 4185 |         let total_rows = data.iter().map(|batch| batch.num_rows()).sum::<usize>();
 4186 | 
 4187 |         let file_scheduler = fs
 4188 |             .scheduler
 4189 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4190 |             .await
 4191 |             .unwrap();
 4192 |         let file_reader = FileReader::try_open(
 4193 |             file_scheduler.clone(),
 4194 |             Some(
 4195 |                 versions::reader_projection_from_column_names(version, &schema, &["score"])
 4196 |                     .unwrap(),
 4197 |             ),
 4198 |             Arc::<DecoderPlugins>::default(),
 4199 |             &test_cache(),
 4200 |             FileReaderOptions::default(),
 4201 |         )
 4202 |         .await
 4203 |         .unwrap();
 4204 | 
 4205 |         let batches = tokio::task::spawn_blocking(move || {
 4206 |             file_reader
 4207 |                 .read_stream_projected_blocking(
 4208 |                     lance_io::ReadBatchParams::Indices(UInt32Array::from(vec![0, 1, 2, 3, 4])),
 4209 |                     total_rows as u32,
 4210 |                     None,
 4211 |                     FilterExpression::no_filter(),
 4212 |                 )
 4213 |                 .unwrap()
 4214 |                 .collect::<ArrowResult<Vec<_>>>()
 4215 |                 .unwrap()
 4216 |         })
 4217 |         .await
 4218 |         .unwrap();
 4219 | 
 4220 |         assert_eq!(batches.len(), 1);
 4221 |         assert_eq!(batches[0].num_rows(), 5);
 4222 |         assert_eq!(batches[0].num_columns(), 1);
 4223 |     }
 4224 | 
 4225 |     #[tokio::test(flavor = "multi_thread")]
 4226 |     async fn test_drop_in_progress() {
 4227 |         let fs = FsFixture::default();
 4228 |         let WrittenFile { data, .. } = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 4229 |         let total_rows = data.iter().map(|batch| batch.num_rows()).sum::<usize>();
 4230 | 
 4231 |         let file_scheduler = fs
 4232 |             .scheduler
 4233 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4234 |             .await
 4235 |             .unwrap();
 4236 |         let file_reader = FileReader::try_open(
 4237 |             file_scheduler.clone(),
 4238 |             None,
 4239 |             Arc::<DecoderPlugins>::default(),
 4240 |             &test_cache(),
 4241 |             FileReaderOptions::default(),
 4242 |         )
 4243 |         .await
 4244 |         .unwrap();
 4245 | 
 4246 |         let mut batches = file_reader
 4247 |             .read_stream(
 4248 |                 lance_io::ReadBatchParams::RangeFull,
 4249 |                 (total_rows / 10) as u32,
 4250 |                 16,
 4251 |                 FilterExpression::no_filter(),
 4252 |             )
 4253 |             .await
 4254 |             .unwrap();
 4255 | 
 4256 |         drop(file_reader);
 4257 | 
 4258 |         let batch = batches.next().await.unwrap().unwrap();
 4259 |         assert!(batch.num_rows() > 0);
 4260 | 
 4261 |         // Drop in-progress scan
 4262 |         drop(batches);
 4263 |     }
 4264 | 
 4265 |     #[tokio::test]
 4266 |     async fn drop_while_scheduling() {
 4267 |         // This is a bit of a white-box test, pokes at the internals.  We want to
 4268 |         // test the case where the read stream is dropped before the scheduling
 4269 |         // thread finishes.  We can't do that in a black-box fashion because the
 4270 |         // scheduling thread runs in the background and there is no easy way to
 4271 |         // pause / gate it.
 4272 | 
 4273 |         // It's a regression for a bug where the scheduling thread would panic
 4274 |         // if the stream was dropped before it finished.
 4275 | 
 4276 |         let fs = FsFixture::default();
 4277 |         let written_file = create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 4278 |         let total_rows = written_file
 4279 |             .data
 4280 |             .iter()
 4281 |             .map(|batch| batch.num_rows())
 4282 |             .sum::<usize>();
 4283 | 
 4284 |         let file_scheduler = fs
 4285 |             .scheduler
 4286 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4287 |             .await
 4288 |             .unwrap();
 4289 |         let file_reader = FileReader::try_open(
 4290 |             file_scheduler.clone(),
 4291 |             None,
 4292 |             Arc::<DecoderPlugins>::default(),
 4293 |             &test_cache(),
 4294 |             FileReaderOptions::default(),
 4295 |         )
 4296 |         .await
 4297 |         .unwrap();
 4298 | 
 4299 |         let projection = versions::reader_projection_from_whole_schema(
 4300 |             &written_file.schema,
 4301 |             ConcreteFileVersion::V2_0,
 4302 |         );
 4303 |         let column_infos = file_reader.metadata().column_infos.clone();
 4304 |         let mut decode_scheduler = DecodeBatchScheduler::try_new(
 4305 |             &projection.schema,
 4306 |             &projection.column_indices,
 4307 |             &column_infos,
 4308 |             &vec![],
 4309 |             total_rows as u64,
 4310 |             Arc::<DecoderPlugins>::default(),
 4311 |             file_reader.scheduler(),
 4312 |             test_cache(),
 4313 |             &FilterExpression::no_filter(),
 4314 |             &DecoderConfig::default(),
 4315 |         )
 4316 |         .await
 4317 |         .unwrap();
 4318 | 
 4319 |         let range = 0..total_rows as u64;
 4320 | 
 4321 |         let (tx, rx) = mpsc::unbounded_channel();
 4322 | 
 4323 |         // Simulate the stream / decoder being dropped
 4324 |         drop(rx);
 4325 | 
 4326 |         // Scheduling should not panic
 4327 |         decode_scheduler.schedule_range(
 4328 |             range,
 4329 |             &FilterExpression::no_filter(),
 4330 |             tx,
 4331 |             file_reader.scheduler(),
 4332 |         )
 4333 |     }
 4334 | 
 4335 |     #[tokio::test]
 4336 |     async fn test_read_empty_range() {
 4337 |         let fs = FsFixture::default();
 4338 |         create_some_file(&fs, ConcreteFileVersion::V2_0).await;
 4339 | 
 4340 |         let file_scheduler = fs
 4341 |             .scheduler
 4342 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4343 |             .await
 4344 |             .unwrap();
 4345 |         let file_reader = FileReader::try_open(
 4346 |             file_scheduler.clone(),
 4347 |             None,
 4348 |             Arc::<DecoderPlugins>::default(),
 4349 |             &test_cache(),
 4350 |             FileReaderOptions::default(),
 4351 |         )
 4352 |         .await
 4353 |         .unwrap();
 4354 | 
 4355 |         // All ranges empty, no data
 4356 |         let batches = file_reader
 4357 |             .read_stream(
 4358 |                 lance_io::ReadBatchParams::Range(0..0),
 4359 |                 1024,
 4360 |                 16,
 4361 |                 FilterExpression::no_filter(),
 4362 |             )
 4363 |             .await
 4364 |             .unwrap()
 4365 |             .try_collect::<Vec<_>>()
 4366 |             .await
 4367 |             .unwrap();
 4368 | 
 4369 |         assert_eq!(batches.len(), 0);
 4370 | 
 4371 |         // Some ranges empty
 4372 |         let batches = file_reader
 4373 |             .read_stream(
 4374 |                 lance_io::ReadBatchParams::Ranges(Arc::new([0..1, 2..2])),
 4375 |                 1024,
 4376 |                 16,
 4377 |                 FilterExpression::no_filter(),
 4378 |             )
 4379 |             .await
 4380 |             .unwrap()
 4381 |             .try_collect::<Vec<_>>()
 4382 |             .await
 4383 |             .unwrap();
 4384 |         assert_eq!(batches.len(), 1);
 4385 |     }
 4386 | 
 4387 |     async fn write_file_with_global_buffer(fs: &FsFixture, buffer: Bytes) {
 4388 |         let lance_schema =
 4389 |             lance_core::datatypes::Schema::try_from(&ArrowSchema::new(vec![Field::new(
 4390 |                 "foo",
 4391 |                 DataType::Int32,
 4392 |                 true,
 4393 |             )]))
 4394 |             .unwrap();
 4395 | 
 4396 |         let mut file_writer = versions::v2_1::create_writer(
 4397 |             fs.object_store.create(&fs.tmp_path).await.unwrap(),
 4398 |             lance_schema,
 4399 |             FileWriterOptions::default(),
 4400 |         )
 4401 |         .unwrap();
 4402 | 
 4403 |         let buf_index = file_writer.add_global_buffer(buffer).await.unwrap();
 4404 |         assert_eq!(buf_index, 1);
 4405 | 
 4406 |         file_writer.finish().await.unwrap();
 4407 |     }
 4408 | 
 4409 |     #[derive(Clone, Copy, Debug)]
 4410 |     enum MetadataReadPath {
 4411 |         Full,
 4412 |         Indexed,
 4413 |     }
 4414 | 
 4415 |     #[derive(Clone, Copy, Debug)]
 4416 |     enum InvalidGboDescriptor {
 4417 |         Unaligned,
 4418 |         PastEof,
 4419 |         Overflowing,
 4420 |     }
 4421 | 
 4422 |     #[rstest]
 4423 |     #[case::full_unaligned(MetadataReadPath::Full, InvalidGboDescriptor::Unaligned, "not aligned")]
 4424 |     #[case::full_past_eof(MetadataReadPath::Full, InvalidGboDescriptor::PastEof, "outside file")]
 4425 |     #[case::full_overflowing(
 4426 |         MetadataReadPath::Full,
 4427 |         InvalidGboDescriptor::Overflowing,
 4428 |         "overflows"
 4429 |     )]
 4430 |     #[case::indexed_unaligned(
 4431 |         MetadataReadPath::Indexed,
 4432 |         InvalidGboDescriptor::Unaligned,
 4433 |         "not aligned"
 4434 |     )]
 4435 |     #[case::indexed_past_eof(
 4436 |         MetadataReadPath::Indexed,
 4437 |         InvalidGboDescriptor::PastEof,
 4438 |         "outside file"
 4439 |     )]
 4440 |     #[case::indexed_overflowing(
 4441 |         MetadataReadPath::Indexed,
 4442 |         InvalidGboDescriptor::Overflowing,
 4443 |         "overflows"
 4444 |     )]
 4445 |     #[tokio::test]
 4446 |     async fn test_metadata_rejects_invalid_gbo_descriptor(
 4447 |         #[case] read_path: MetadataReadPath,
 4448 |         #[case] invalid_descriptor: InvalidGboDescriptor,
 4449 |         #[case] expected_message: &str,
 4450 |     ) {
 4451 |         let fs = FsFixture::default();
 4452 |         write_file_with_global_buffer(&fs, Bytes::from_static(b"hello")).await;
 4453 | 
 4454 |         let mut file_bytes = fs
 4455 |             .object_store
 4456 |             .read_one_all(&fs.tmp_path)
 4457 |             .await
 4458 |             .unwrap()
 4459 |             .to_vec();
 4460 |         let file_len = file_bytes.len() as u64;
 4461 |         let footer = FileReader::decode_footer(&Bytes::copy_from_slice(&file_bytes)).unwrap();
 4462 |         let gbo_table_start = usize::try_from(footer.global_buff_offsets_start).unwrap();
 4463 |         let alignment = PAGE_BUFFER_ALIGNMENT as u64;
 4464 |         let (position, size) = match invalid_descriptor {
 4465 |             InvalidGboDescriptor::Unaligned => (1, 0),
 4466 |             InvalidGboDescriptor::PastEof => (((file_len + alignment) / alignment) * alignment, 0),
 4467 |             InvalidGboDescriptor::Overflowing => (u64::MAX - (u64::MAX % alignment), alignment),
 4468 |         };
 4469 |         file_bytes[gbo_table_start..gbo_table_start + 8].copy_from_slice(&position.to_le_bytes());
 4470 |         file_bytes[gbo_table_start + 8..gbo_table_start + 16].copy_from_slice(&size.to_le_bytes());
 4471 |         fs.object_store
 4472 |             .put(&fs.tmp_path, &file_bytes)
 4473 |             .await
 4474 |             .unwrap();
 4475 | 
 4476 |         let scheduler = fs
 4477 |             .scheduler
 4478 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4479 |             .await
 4480 |             .unwrap();
 4481 |         let error = match read_path {
 4482 |             MetadataReadPath::Full => FileReader::read_all_metadata(&scheduler).await.map(|_| ()),
 4483 |             MetadataReadPath::Indexed => FileReader::read_metadata_index(&scheduler)
 4484 |                 .await
 4485 |                 .map(|_| ()),
 4486 |         }
 4487 |         .expect_err("invalid GBO descriptor must fail before metadata I/O");
 4488 | 
 4489 |         assert!(
 4490 |             matches!(error, lance_core::Error::InvalidInput { .. }),
 4491 |             "expected InvalidInput, got {error:?}"
 4492 |         );
 4493 |         assert!(
 4494 |             error.to_string().contains(expected_message),
 4495 |             "unexpected error: {error}"
 4496 |         );
 4497 |     }
 4498 | 
 4499 |     /// A global buffer that fits inside the tail region captured at open is served
 4500 |     /// from memory with no additional I/O.  A buffer larger than that window cannot
 4501 |     /// fit and falls back to a dedicated read.  Both must round-trip correctly.
 4502 |     #[rstest]
 4503 |     #[case::within_tail_window(true)]
 4504 |     #[case::outside_tail_window(false)]
 4505 |     #[tokio::test]
 4506 |     async fn test_read_global_buffer(#[case] within_window: bool) {
 4507 |         let fs = FsFixture::default();
 4508 | 
 4509 |         let block_size = fs.object_store.block_size();
 4510 |         let buffer = if within_window {
 4511 |             Bytes::from_static(b"hello")
 4512 |         } else {
 4513 |             Bytes::from(vec![7u8; 2 * block_size])
 4514 |         };
 4515 |         let expected_read_iops = if within_window { 0 } else { 1 };
 4516 | 
 4517 |         write_file_with_global_buffer(&fs, buffer.clone()).await;
 4518 | 
 4519 |         let file_scheduler = fs
 4520 |             .scheduler
 4521 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4522 |             .await
 4523 |             .unwrap();
 4524 |         let file_reader = FileReader::try_open(
 4525 |             file_scheduler,
 4526 |             None,
 4527 |             Arc::<DecoderPlugins>::default(),
 4528 |             &test_cache(),
 4529 |             FileReaderOptions::default(),
 4530 |         )
 4531 |         .await
 4532 |         .unwrap();
 4533 | 
 4534 |         // The user buffer should be retained only when it fits the tail window, and
 4535 |         // the schema (buffer 0) is never retained.
 4536 |         let retained = &file_reader.metadata().retained_global_buffers;
 4537 |         assert!(!retained.contains_key(&0), "schema must not be retained");
 4538 |         assert_eq!(retained.contains_key(&1), within_window);
 4539 | 
 4540 |         // Reset the IO counters so we only measure the read_global_buffer call.
 4541 |         fs.object_store.io_stats_incremental();
 4542 | 
 4543 |         let buf = file_reader.read_global_buffer(1).await.unwrap();
 4544 |         assert_eq!(buf, buffer);
 4545 | 
 4546 |         let stats = fs.object_store.io_stats_incremental();
 4547 |         assert_eq!(stats.read_iops, expected_read_iops);
 4548 |     }
 4549 | 
 4550 |     /// A file whose only global buffer is the schema (i.e. a plain data file, the
 4551 |     /// common case) must retain nothing — there is no user buffer to serve.
 4552 |     #[tokio::test]
 4553 |     async fn test_read_global_buffer_no_user_buffers() {
 4554 |         let fs = FsFixture::default();
 4555 |         create_some_file(&fs, ConcreteFileVersion::V2_1).await;
 4556 | 
 4557 |         let file_scheduler = fs
 4558 |             .scheduler
 4559 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4560 |             .await
 4561 |             .unwrap();
 4562 |         let file_reader = FileReader::try_open(
 4563 |             file_scheduler,
 4564 |             None,
 4565 |             Arc::<DecoderPlugins>::default(),
 4566 |             &test_cache(),
 4567 |             FileReaderOptions::default(),
 4568 |         )
 4569 |         .await
 4570 |         .unwrap();
 4571 | 
 4572 |         let metadata = file_reader.metadata();
 4573 |         assert_eq!(metadata.file_buffers.len(), 1, "expected only the schema");
 4574 |         assert!(
 4575 |             metadata.retained_global_buffers.is_empty(),
 4576 |             "a file with no user global buffers must retain nothing"
 4577 |         );
 4578 |     }
 4579 | 
 4580 |     #[rstest]
 4581 |     #[tokio::test]
 4582 |     async fn test_deep_size_of_includes_column_metadata(
 4583 |         #[values(
 4584 |             ConcreteFileVersion::V2_0,
 4585 |             ConcreteFileVersion::V2_1,
 4586 |             ConcreteFileVersion::V2_2,
 4587 |             ConcreteFileVersion::V2_3
 4588 |         )]
 4589 |         version: ConcreteFileVersion,
 4590 |     ) {
 4591 |         // Regression test: CachedFileMetadata::deep_size_of must account for
 4592 |         // column_metadatas and column_infos, otherwise the moka cache weigher
 4593 |         // dramatically underestimates entry sizes and never evicts, causing
 4594 |         // unbounded memory growth on random-access workloads.
 4595 |         use lance_core::deepsize::DeepSizeOf;
 4596 | 
 4597 |         let fs = FsFixture::default();
 4598 |         let _written = create_some_file(&fs, version).await;
 4599 |         let cache = test_cache();
 4600 |         let file_scheduler = fs
 4601 |             .scheduler
 4602 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4603 |             .await
 4604 |             .unwrap();
 4605 |         let file_reader = FileReader::try_open(
 4606 |             file_scheduler,
 4607 |             None,
 4608 |             Arc::<DecoderPlugins>::default(),
 4609 |             &cache,
 4610 |             FileReaderOptions::default(),
 4611 |         )
 4612 |         .await
 4613 |         .unwrap();
 4614 | 
 4615 |         let metadata = file_reader.metadata();
 4616 |         let deep_size = metadata.deep_size_of();
 4617 | 
 4618 |         // The file has multiple columns (score, location, categories, binary,
 4619 |         // maybe large_bin). The deep_size_of must be substantially more than
 4620 |         // just the schema — it should include column_metadatas + column_infos.
 4621 |         // A naive implementation that ignores these fields reports < 1 KB;
 4622 |         // a correct one should report at least several KB for this test file.
 4623 |         assert!(
 4624 |             deep_size > 1024,
 4625 |             "deep_size_of ({deep_size}) is suspiciously small — \
 4626 |              column_metadatas and column_infos may not be accounted for"
 4627 |         );
 4628 | 
 4629 |         // Verify column_metadatas is non-empty (sanity check).
 4630 |         assert!(
 4631 |             !metadata.column_metadatas.is_empty(),
 4632 |             "Expected non-empty column_metadatas"
 4633 |         );
 4634 | 
 4635 |         // Verify the size scales with the number of columns: a file with more
 4636 |         // columns should have a larger deep_size_of.
 4637 |         let num_columns = metadata.column_metadatas.len();
 4638 |         assert!(
 4639 |             deep_size > num_columns * 50,
 4640 |             "deep_size_of ({deep_size}) should scale with column count ({num_columns})"
 4641 |         );
 4642 |     }
 4643 | 
 4644 |     #[tokio::test]
 4645 |     async fn test_read_global_buffer_out_of_range() {
 4646 |         let fs = FsFixture::default();
 4647 | 
 4648 |         write_file_with_global_buffer(&fs, Bytes::from_static(b"hello")).await;
 4649 | 
 4650 |         let file_scheduler = fs
 4651 |             .scheduler
 4652 |             .open_file(&fs.tmp_path, &CachedFileSize::unknown())
 4653 |             .await
 4654 |             .unwrap();
 4655 |         let file_reader = FileReader::try_open(
 4656 |             file_scheduler,
 4657 |             None,
 4658 |             Arc::<DecoderPlugins>::default(),
 4659 |             &test_cache(),
 4660 |             FileReaderOptions::default(),
 4661 |         )
 4662 |         .await
 4663 |         .unwrap();
 4664 | 
 4665 |         // The file has two global buffers (schema at 0, "hello" at 1); index 2 is
 4666 |         // out of range and must surface a descriptive error rather than panicking.
 4667 |         let err = file_reader.read_global_buffer(2).await.unwrap_err();
 4668 |         assert!(
 4669 |             matches!(err, lance_core::Error::InvalidInput { .. }),
 4670 |             "expected InvalidInput, got: {err:?}"
 4671 |         );
 4672 |         let msg = err.to_string();
 4673 |         assert!(msg.contains('2'), "error should mention the index: {msg}");
 4674 |     }
 4675 | 
 4676 |     // Exercises the projection length-validation walk in isolation, feeding
 4677 |     // synthetic per-column lengths so we can reach cases no current writer can
 4678 |     // actually produce -- in particular a struct whose children diverge in
 4679 |     // length, which the decoders would otherwise panic on or misread.
 4680 |     #[rstest]
 4681 |     fn test_validate_struct_child_lengths(#[values(false, true)] is_structural: bool) {
 4682 |         let run = |dt: DataType, indices: &[u32], lengths: Vec<u64>| -> lance_core::Result<u64> {
 4683 |             let arrow = ArrowSchema::new(vec![Field::new("s", dt, true)]);
 4684 |             let schema = Schema::try_from(&arrow).unwrap();
 4685 |             if is_structural {
 4686 |                 versions::v2_1::test_projection_length(&schema, indices, &lengths)
 4687 |             } else {
 4688 |                 versions::v2_0::test_projection_length(&schema, indices, &lengths)
 4689 |             }
 4690 |         };
 4691 | 
 4692 |         let struct_ty = || {
 4693 |             DataType::Struct(Fields::from(vec![
 4694 |                 Field::new("a", DataType::Int32, true),
 4695 |                 Field::new("b", DataType::Int32, true),
 4696 |             ]))
 4697 |         };
 4698 | 
 4699 |         // In 2.1 a struct contributes no column of its own (just its two leaves);
 4700 |         // in 2.0 it also has its own column first.
 4701 |         let (indices, equal, unequal): (&[u32], Vec<u64>, Vec<u64>) = if is_structural {
 4702 |             (&[0, 1], vec![5, 5], vec![5, 3])
 4703 |         } else {
 4704 |             (&[0, 1, 2], vec![5, 5, 5], vec![5, 5, 3])
 4705 |         };
 4706 | 
 4707 |         assert_eq!(run(struct_ty(), indices, equal).unwrap(), 5);
 4708 | 
 4709 |         let err = run(struct_ty(), indices, unequal).unwrap_err();
 4710 |         let msg = err.to_string();
 4711 |         assert!(
 4712 |             msg.contains("differing lengths") && msg.contains('b'),
 4713 |             "expected a child-length error naming 'b', got: {msg}"
 4714 |         );
 4715 |     }
 4716 | 
 4717 |     #[test]
 4718 |     fn test_validate_v2_0_unloaded_blob_projection_is_opaque() {
 4719 |         let metadata = HashMap::from([(BLOB_META_KEY.to_string(), "true".to_string())]);
 4720 |         let arrow = ArrowSchema::new(vec![
 4721 |             Field::new("blob", DataType::LargeBinary, true).with_metadata(metadata),
 4722 |         ]);
 4723 |         let mut schema = Schema::try_from(&arrow).unwrap();
 4724 |         schema.fields[0].unloaded_mut();
 4725 |         let projection = ReaderProjection {
 4726 |             schema: Arc::new(schema),
 4727 |             column_indices: vec![0],
 4728 |         };
 4729 |         let rows = versions::v2_0::test_projection_length(
 4730 |             &projection.schema,
 4731 |             &projection.column_indices,
 4732 |             &[3],
 4733 |         )
 4734 |         .unwrap();
 4735 | 
 4736 |         assert_eq!(rows, 3);
 4737 |     }
 4738 | 
 4739 |     #[test]
 4740 |     fn test_validate_length_list_and_empty_struct() {
 4741 |         let validate = |dt: DataType,
 4742 |                         is_structural: bool,
 4743 |                         indices: &[u32],
 4744 |                         lengths: Vec<u64>|
 4745 |          -> lance_core::Result<u64> {
 4746 |             let arrow = ArrowSchema::new(vec![Field::new("f", dt, true)]);
 4747 |             let schema = Schema::try_from(&arrow).unwrap();
 4748 |             if is_structural {
 4749 |                 versions::v2_1::test_projection_length(&schema, indices, &lengths)
 4750 |             } else {
 4751 |                 versions::v2_0::test_projection_length(&schema, indices, &lengths)
 4752 |             }
 4753 |         };
 4754 | 
 4755 |         // A list's items have a different cardinality than its rows; that gap
 4756 |         // must not be flagged as a mismatch. In 2.0 the list is an offsets column
 4757 |         // (rows) plus an items column (item count); in 2.1 it is a single column
 4758 |         // whose page rows are the top-level row count.
 4759 |         let list_ty = DataType::List(Arc::new(Field::new("item", DataType::Int32, true)));
 4760 |         assert_eq!(
 4761 |             validate(list_ty.clone(), false, &[0, 1], vec![5, 17]).unwrap(),
 4762 |             5
 4763 |         );
 4764 |         assert_eq!(validate(list_ty, true, &[0], vec![5]).unwrap(), 5);
 4765 | 
 4766 |         // A list of structs: the struct's children sit below the list boundary, so
 4767 |         // their (item-count) lengths must NOT be compared against the list's row
 4768 |         // count. In 2.0 each field has a column [list, struct, a, b] = [6, 6, 29,
 4769 |         // 29]; the list resolves to its own row count (6) and the struct's longer
 4770 |         // children are not flagged. (Regression: this previously errored because
 4771 |         // the nested struct's children were checked against the struct's count.)
 4772 |         let list_of_struct = DataType::List(Arc::new(Field::new(
 4773 |             "item",
 4774 |             DataType::Struct(Fields::from(vec![
 4775 |                 Field::new("a", DataType::Int32, true),
 4776 |                 Field::new("b", DataType::Int32, true),
 4777 |             ])),
 4778 |             true,
 4779 |         )));
 4780 |         assert_eq!(
 4781 |             validate(
 4782 |                 list_of_struct.clone(),
 4783 |                 false,
 4784 |                 &[0, 1, 2, 3],
 4785 |                 vec![6, 6, 29, 29]
 4786 |             )
 4787 |             .unwrap(),
 4788 |             6
 4789 |         );
 4790 |         // In 2.1 only the two leaves carry columns; still no false mismatch.
 4791 |         assert_eq!(
 4792 |             validate(list_of_struct, true, &[0, 1], vec![29, 29]).unwrap(),
 4793 |             29
 4794 |         );
 4795 | 
 4796 |         // An empty struct contributes a single column and validates to its length.
 4797 |         let empty_struct = DataType::Struct(Fields::empty());
 4798 |         assert_eq!(
 4799 |             validate(empty_struct.clone(), false, &[0], vec![9]).unwrap(),
 4800 |             9
 4801 |         );
 4802 |         assert_eq!(validate(empty_struct, true, &[0], vec![9]).unwrap(), 9);
 4803 |     }
 4804 | }
``````
