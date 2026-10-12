> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `daa82faf7751e95afb035a1107febd7446d6b9e1fa8f1d2bdd1eb5a24a55956d`. Reviewed physical lines: 1-1562.

[Module](../../../../../../L1-modules/rust-lance-file-v1-reader.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Frozen V1 file reader: public constructors, metadata/page-table cache keys, batch/range/take/statistics/stream APIs and private recursive Arrow reconstruction. Stores caller schema and dictionary values; no automatic schema discovery, row-ID synthesis or current-format grammar negotiation. Includes12 active tests and four helpers. (rust/lance-file/src/versions/v1/reader.rs:1-1562)

## Complete range analysis

### Lines 1-40

SPDX and legacy data-file-reader module heading. Imports combine Arrow primitive/struct/list construction and arithmetic, concat, boxed recursive async functions, ordered futures streams, cache key/size traits, field/schema definitions, Reader/ObjectStore, metadata framing helpers, tracing, V1 codecs and page-table metadata. No current-format version dispatch or writer is defined in production here. (rust/lance-file/src/versions/v1/reader.rs:1-40)

### Lines 41-58

Public FileReader derives Clone and DeepSizeOf. object_reader is a public Arc<dyn Reader>; metadata and ordinary page table are private Arcs, schema is owned, fragment_id is private u64, and statistics is an Arc<Option<PageTable>>. Cloning shares reader/tables/metadata and clones Schema according to its own Clone semantics, including shared dictionary arrays. Public replacement of object_reader does not refresh any stored metadata/schema/table. There is no custom Drop. (rust/lance-file/src/versions/v1/reader.rs:41-58)

### Lines 59-67

Debug prints only fragment ID and object_reader.path; it does not dump schema, metadata, dictionaries or page tables. fragment_id is otherwise only set and retained in this file: no row-ID column or bitwise address construction occurs here despite later constructor documentation. (rust/lance-file/src/versions/v1/reader.rs:59-67)

### Lines 68-82

Private generic StringCacheKey borrows a string and carries PhantomData<T>. new only stores both. The key does not own path bytes or include fragment ID, schema, field-ID bounds, supplied metadata, object-store identity, file version or ETag. Any additional namespace isolation belongs to the supplied cache. (rust/lance-file/src/versions/v1/reader.rs:68-82)

### Lines 83-98

Private StableStringCacheValue requires static lifetime and a stable string ID. Implementations pin Metadata to lance.file.previous.Metadata, PageTable to lance.file.previous.PageTable, and Option<PageTable> to lance.file.previous.OptionalPageTable. These are three separate cache value identities, preserving the historical previous spelling rather than deriving identity from Rust type names. (rust/lance-file/src/versions/v1/reader.rs:83-98)

### Lines 99-123

StringCacheKey<T> implements CacheKey with associated ValueType=T. key returns borrowed Cow text; type_name retains compiler-derived diagnostic name, stable_type_id uses the trait constant, schema is lance.file.previous.string-key version1, and write_key feeds one string to KeyBuilder. Type scoping distinguishes the three value families even when path text matches; changing stable IDs/schema/write_key changes physical cache identity. (rust/lance-file/src/versions/v1/reader.rs:99-123)

### Lines 124-164

Public traced try_new_with_fragment_id opens the ObjectStore path, loads metadata, then forwards the supplied Schema, u32 fragment ID, signed min/max field bounds and optional LanceCache to try_new_from_reader with Some(metadata). No schema/dictionary hydration is performed here. Docs mention an optional manifest and row-ID high bits, but the actual signature requires Schema and this file emits no row IDs. IO/cache errors propagate before reader construction. (rust/lance-file/src/versions/v1/reader.rs:124-164)

### Lines 165-180

Public try_new_from_reader accepts an arbitrary Arc<dyn Reader>, separate Path, optional Arc<Metadata>, supplied Schema and cache/bounds. Some metadata is trusted directly; None calls read_metadata. No equality check relates the separate path to object_reader.path, the metadata to the file, bounds to schema, or the schema dictionary values to file contents. (rust/lance-file/src/versions/v1/reader.rs:165-180)

### Lines 181-209

Ordinary PageTable loading uses the separately supplied path string as cache key and metadata.page_table_position, signed field bounds and num_batches cast to i32. Statistics loading uses object_reader and its own path. try_join polls both table futures concurrently; first error prevents constructing Self, with no local task spawn/abort or rollback. Statistics loading calls read_metadata independently, so a supplied metadata Arc does not eliminate that read; without cache the ordinary open path can load metadata twice. Successful construction retains all supplied/shared values and widens fragment ID to u64. (rust/lance-file/src/versions/v1/reader.rs:181-209)

### Lines 210-235

Public read_metadata caches by object_reader.path string. On miss: await size, read min(size,block_size) tail, decode the metadata position, then either read_struct at an earlier location or slice the tail and decode in memory. It does not validate footer magic/version or schema here. read_metadata_offset only checks tail length>=16 and extracts LEu64; read_struct_from_buf trusts the u32 length while slicing. Out-of-file offsets, short/malformed tail bodies and arithmetic are not locally guarded and can panic before structured decoding errors (rust/lance-io/src/utils.rs:221-231; rust/lance-io/src/utils.rs:248-263). Earlier-position read_struct uses its separate framed IO path. (rust/lance-file/src/versions/v1/reader.rs:210-235)

### Lines 236-269

Private read_stats_page_table caches Option<PageTable> under reader.path joined with stats, including None. Its loader obtains metadata again and, when stats_metadata exists, loads one batch with field bounds0..max(leaf_field_ids). Empty leaf IDs panic at max().unwrap; no schema/presence/table consistency validation is added. Statistics and ordinary tables use distinct value types in addition to different path strings. (rust/lance-file/src/versions/v1/reader.rs:236-269)

### Lines 270-289

Generic async load_from_cache requires DeepSizeOf+Send+Sync+StableStringCacheValue and a Send+Sync Fn loader returning a Send future. Some cache delegates get_or_insert_with_key using borrowed StringCacheKey; no-cache awaits the loader and wraps the result in Arc. The owned key String remains alive through the await. No local expiration, persistence codec, invalidation, file identity verification or duplicate-load policy is added beyond the chosen cache implementation. (rust/lance-file/src/versions/v1/reader.rs:270-289)

### Lines 290-300

Public convenience try_new assumes the supplied schema describes the file, derives max_field_id or0, sets fragment/min ID to0 and disables cache. It does not discover a schema from disk. Private io_parallelism returns the Reader policy unchanged, with no zero-value clamp or local override. (rust/lance-file/src/versions/v1/reader.rs:290-300)

### Lines 301-323

schema returns the stored supplied Schema by reference, not the projection later passed to a read. num_batches, len and is_empty delegate metadata; num_rows_in_batch delegates get_batch_length, substitutes0 for None and casts signed length to usize. These accessors do not validate malformed signed offsets or batch IDs; a missing batch length is not an error here. (rust/lance-file/src/versions/v1/reader.rs:301-323)

### Lines 324-336

Public instrumented method read_batch converts params to ReadBatchParams then calls the free read_batch with the explicit projection. Its doc says returned schema is FileReader::schema(), but actual output follows the projection argument; there is no subset/type/field-ID validation against self.schema at this boundary. (rust/lance-file/src/versions/v1/reader.rs:324-336)

### Lines 337-365

Public read_range returns a typed empty RecordBatch for every Range::is_empty before metadata/bounds checks, including reversed or beyond-end empty ranges. Nonempty ranges use metadata.range_to_batches, read batches with ordered buffered(reader parallelism), and collect all into Vec. A single batch returns a cheap clone; multiple batches concatenate in spawn_blocking with JoinError and Arrow error propagated. The code indexes batches[0] without guarding an unexpectedly empty split. No abort-on-drop handle is retained for blocking work. (rust/lance-file/src/versions/v1/reader.rs:337-365)

### Lines 366-397

Public take documents sorted indices, but metadata.group_indices_to_batches clones and sorts them, retaining duplicates and discarding original unsorted order (rust/lance-file/src/versions/v1/format/metadata.rs:128-163). Grouping happens before validation and assumes valid cumulative metadata. Each group rejects batch_id>=num_batches, then compares last local offset strictly greater than whole-file len cast to u32, not the selected batch length; codec checks supply additional bounds. Nonempty groups are assumed by expect. Ordered buffered reads collect all batches, then spawn_blocking concat even for zero/one group using the requested schema. No output reorder restores caller order; empty take performs no per-column read. (rust/lance-file/src/versions/v1/reader.rs:366-397)

### Lines 398-415

page_stats_schema returns None only when stats metadata is absent. Otherwise parse each root statistics field name as i32, retain roots whose parsed data-field ID occurs in requested IDs, append that root ID plus immediate child IDs, then project_by_ids(include children=true). Unparseable names and missing requested IDs are silently skipped; results follow statistics schema order, not caller order, with linear contains lookup. An existing stats schema can yield Some(empty schema). (rust/lance-file/src/versions/v1/reader.rs:398-415)

### Lines 416-447

read_page_stats returns None when the cached optional statistics table is absent. If present, it unwraps page_stats_schema, returns None for an empty projection, otherwise reads selected root fields at batch0/RangeFull using the stats table with ordered buffered parallelism. It collects every array and constructs one RecordBatch. A supplied-metadata versus independently loaded stats-table disagreement can make the unwrap panic; statistics fields are not cross-validated here. (rust/lance-file/src/versions/v1/reader.rs:416-447)

### Lines 448-484

Public batches_stream consumes FileReader, Schema and a mutable Send+Sync static batch-ID predicate. It snapshots num_batches as i32, lazily filters IDs in increasing order, retains reader/projection in Arcs and reads whole batches with fixed buffered(2), independent of Reader io_parallelism for this outer layer. The stream adapter advertises the supplied projection schema; each batch may still perform parallel field reads. No Tokio task is spawned here despite thread-sharing comments; dropping the stream drops pending local futures, without a backend cancellation guarantee. (rust/lance-file/src/versions/v1/reader.rs:448-484)

### Lines 485-508

Public free read_batch rejects an empty schema with InvalidInput no fields requested. Its comment about with_row_id and panic is stale: no such flag or row-ID synthesis exists. Nonempty roots are read concurrently via ordered buffered(reader parallelism), collected, then RecordBatch::try_new checks assembled arrays against converted explicit schema. No upfront batch-ID validation occurs; missing page errors or codec errors emerge during reads. (rust/lance-file/src/versions/v1/reader.rs:485-508)

### Lines 509-545

Private async-recursive read_array reconstructs field.data_type and first routes is_fixed_stride to plain decoding. Otherwise handles Null, four binary/string families, Struct, Dictionary, List<Int32 offsets> and LargeList<Int64 offsets>. Other types panic via unimplemented rather than returning NotSupported. In the locally read predicate every FSL is fixed-stride, regardless of child; Interval has byte_width support but is absent from is_fixed_stride, so predicate/type-dispatch differences matter (rust/lance-arrow/src/lib.rs:111-181). No field.encoding tag drives this dispatch. (rust/lance-file/src/versions/v1/reader.rs:509-545)

### Lines 546-558

get_page_info looks up exact signed field.id and batch_id in the provided PageTable. Missing entry becomes InvalidInput with field name, field ID and batch ID. It performs no file-bound or length validation on the returned PageInfo. (rust/lance-file/src/versions/v1/reader.rs:546-558)

### Lines 559-577

_read_fixed_stride_array fetches page info from its supplied table, reconstructs field DataType and forwards position, length and cloned selector to the V1 facade. It passes neither field.nullable nor a separate validity bitmap; plain codec semantics govern primitive/fixed-array null handling. (rust/lance-file/src/versions/v1/reader.rs:559-577)

### Lines 578-600

read_null_array obtains page info but performs no payload IO. Empty Indices produces0; nonempty raw indices.values determines maximum, rejecting max>=page length, then uses indices.len. Index validity is ignored, so null selector backing values participate in bounds checks and every selector slot counts as a Null output row. (rust/lance-file/src/versions/v1/reader.rs:578-600)

### Lines 601-624

For null ranges, derive start/end for Range/full/to/from, reject only end>page length, then subtract start from end unchecked. Reversed ranges or RangeFrom beyond length can underflow rather than following PlainDecoder empty-range behavior. Ranges reaches unreachable!, not InvalidInput. Finally allocate a NullArray of the computed count. The inline wrap comment adds no behavior. (rust/lance-file/src/versions/v1/reader.rs:601-624)

### Lines 625-644

Binary adapter gets page info and forwards actual field DataType, field.nullable, position/length and borrowed selector to the V1 binary facade. Nullable controls equal-offset-to-null reconstruction; no independent validity is fetched here. Missing-page errors precede binary selector validation. (rust/lance-file/src/versions/v1/reader.rs:625-644)

### Lines 645-670

Dictionary adapter gets page info, reconstructs DataType and unwraps field.dictionary plus its loaded values before constructing DictionaryDecoder. It clones the values Arc, then forwards cloned selector. Missing/unhydrated dictionaries panic, even for a selector whose key decoder might otherwise return empty; this layer does not hydrate or validate dictionary values. (rust/lance-file/src/versions/v1/reader.rs:645-670)

### Lines 671-688

Struct adapter walks field.children sequentially, recursively reading each with the same table/batch/selector, then creates StructArray from FieldRef/ArrayRef pairs. It never reads a page or validity bitmap for the struct parent, so original parent nullness is not reconstructed. Child failures short-circuit after any earlier IO; there is no parallel child scheduling or parent-level row-count validation here. (rust/lance-file/src/versions/v1/reader.rs:671-688)

### Lines 689-710

Generic take_list_array expects a nonempty sorted UInt32 selector. It subtracts the first selector from every raw selector value and indexes the already fetched position span to create per-list child ranges. Null selector validity is ignored, and unsigned subtraction, positions and first-child existence are unchecked. It clones the Field and accumulates arrays rather than streaming child values. (rust/lance-file/src/versions/v1/reader.rs:689-710)

### Lines 711-740

For each selected list range, await read_array on children[0] sequentially, so repeated indices cause repeated child reads at this layer. Retain all arrays, build offsets from summed range lengths with unchecked addition/conversion, concatenate all values, and build a generic list. No separate list validity is restored; the helper creates an all-valid List/LargeList with child named item and nullable=true from the actual value type (rust/lance-arrow/src/lib.rs:202-229). This does not preserve arbitrary original child metadata or nullability. (rust/lance-file/src/versions/v1/reader.rs:711-740)

### Lines 741-760

read_list_array expands Range end and RangeTo end by1 for the terminal offset; Indices reads the entire first..last+2 position interval. RangeFull/from pass through unchanged. Empty direct Indices panics at first/last access before page lookup; no sorting or validity checks are local. Arithmetic is unchecked. Multiple Ranges is initially passed through to fixed-stride decoding. (rust/lance-file/src/versions/v1/reader.rs:741-760)

### Lines 761-773

List position lookup deliberately uses reader.page_table rather than the page_table argument, then reads T::DATA_TYPE (Int32/Int64) with the PageInfo position and length. Children later use the supplied table. This distinction matters if invoked with a statistics or other alternate table; no local assertion ensures equality. The position result is downcast to the generic primitive type. (rust/lance-file/src/versions/v1/reader.rs:761-773)

### Lines 774-794

Map logical list selectors to child rows: Range uses first and range-length endpoint; To uses0..positions[end]; From uses first position..child end; Full uses first..last position; Indices returns take_list_array. Ranges has an Internal error branch, but ordinary fixed-stride decoding rejects that selector earlier. Position access, range subtraction and child bounds are delegated/unchecked rather than preflighted. (rust/lance-file/src/versions/v1/reader.rs:774-794)

### Lines 795-809

Subtract first absolute position from all offsets with Arrow arithmetic, recursively read children[0] over derived child selector using the supplied page table, and call try_new_generic_list_array. Parent validity and original child field metadata are not passed. Arrow arithmetic/building errors propagate; no local offset monotonicity, nonnegativity or payload-length check precedes them. (rust/lance-file/src/versions/v1/reader.rs:795-809)

### Lines 810-826

Single cfg(test) module imports the frozen NotSelfDescribing writer, Arrow builders/types/casts and ObjectStoreParams. All fixtures use in-memory stores. Twelve active tests and four helper functions are present, including one nested helper; tests were read, not executed. (rust/lance-file/src/versions/v1/reader.rs:810-826)

### Lines 827-854

Cache discriminator test pins the three literal stable IDs and separately expects legacy diagnostic names equal std::any::type_name. It does not assert schema version, write_key bytes, physical key equality/isolation, cache hits, invalidation or concurrency. (rust/lance-file/src/versions/v1/reader.rs:827-854)

### Lines 855-894

test_take prepares ten10-row batches over Int64, Float32, Utf8 and UInt8-key dictionary with shared seven strings. schema.set_dictionary loads values from the first batch before opening the reader. Int64 is declared nullable but every generated element is valid; other fields are nonnullable. (rust/lance-file/src/versions/v1/reader.rs:855-894)

### Lines 895-935

Writes each of ten batches separately, finishes, opens with the prepared schema and takes [1,15,20,25,30,48,90]. Exact batch equality checks numeric/string values and dictionary keys [1,1,6,4,2,6,6] with the supplied values. This covers multi-batch file selection, not multiple fragments, nulls, unsorted/duplicate/empty input, out-of-range error timing or IO counts. (rust/lance-file/src/versions/v1/reader.rs:895-935)

### Lines 936-975

test_write_null_string_in_struct helper constructs one nullable parent struct containing Utf8 with configurable field nullability and values a,empty,b, all originally valid. It writes/finishes and reads one whole batch. There is no parent null bitmap, so it cannot prove preservation of null parents. (rust/lance-file/src/versions/v1/reader.rs:936-975)

### Lines 976-996

For nullable child, assert a,null,b; for nonnullable child, assert whole batch equality with the original empty string. The active read_nullable_string_in_struct test invokes both variants. This explicitly pins empty-vs-null legacy binary behavior controlled by the field schema, rather than demonstrating arbitrary null validity roundtrip. (rust/lance-file/src/versions/v1/reader.rs:976-996)

### Lines 997-1029

Struct-of-list roundtrip creates three input batches, each ten rows with ten values/list, passes all three together to one writer.write call, reads stored batch0 and compares to concatenation. It covers combined-input List<Int32>, List<Utf8> and LargeList<Int32> inside a struct, with all values and parent lists valid. It is not a three-stored-batch or three-fragment test. (rust/lance-file/src/versions/v1/reader.rs:997-1029)

### Lines 1030-1076

Struct-of-list slice fixture writes three rows with ten items each, constructs expected row1 by slicing every struct child, then reads batch0 Range(1..2) and asserts equality. Despite scan in its name it calls read_batch directly, with no scanner, filtering, multi-batch range or null case. (rust/lance-file/src/versions/v1/reader.rs:1030-1076)

### Lines 1077-1100

make_schema_of_list_array returns one nullable struct s with nullable li List<Int32>, nullable ls List<Utf8> and nonnullable ll LargeList<Int32>. Every nested item field is named item and nullable=true, matching the reconstruction helper defaults; custom child metadata/name/nullability are not covered. (rust/lance-file/src/versions/v1/reader.rs:1077-1100)

### Lines 1101-1145

make_struct_of_list_array fills all three list builders with rows*num_items entries, numeric values i*10+j and strings str-(i*10+j), appending true validity for every row. The stride is hardcoded10 rather than num_items. It reconstructs the same three Arrow fields and returns a StructArray without parent validity. (rust/lance-file/src/versions/v1/reader.rs:1101-1145)

### Lines 1146-1190

test_read_nullable_arrays writes100 rows with a nonnullable Int64 and a Null column. Its nested async read_array_w_params directly invokes private read_array for field1/batch0 and unwraps. Thus later null cases exercise the null adapter rather than the public concatenating range/take path. (rust/lance-file/src/versions/v1/reader.rs:1146-1190)

### Lines 1191-1218

Null fixture asserts datatype Null plus lengths100/full,15/10..25,40/60..,25/..25 and4/indices[1,9,30,72]. It checks length/type, not an encoded null bitmap or IO counter; the null adapter does not read payload bytes. (rust/lance-file/src/versions/v1/reader.rs:1191-1218)

### Lines 1219-1241

Null indices ending100 and RangeTo(..107) only assert is_err. They do not pin error variant/message, empty/null indices, reversed/from-beyond-end ranges, Ranges panic, malformed page lengths or error timing. (rust/lance-file/src/versions/v1/reader.rs:1219-1241)

### Lines 1242-1277

test_take_lists constructs List and LargeList of nullable Int32 item fields, ten valid lists each containing ten consecutive values0..100. Both outer fields are nonnullable. Shared source values and no null/empty list slots simplify expected offsets. (rust/lance-file/src/versions/v1/reader.rs:1242-1277)

### Lines 1278-1320

Writes one batch, finishes, takes sorted[1,3,5,9] and builds the expected four ten-value lists. Independently asserts both output columns equal the expected List and LargeList arrays. No schema equality, repeated/unsorted/empty/null indices, differing list lengths, nested lists or IO batching assertion. (rust/lance-file/src/versions/v1/reader.rs:1278-1320)

### Lines 1321-1357

List-offset test constructs List and LargeList with three rows then slices to row1, whose values are [3,4] and [12,13]; the excluded final row has2000 values. The two retained rows form a one-row RecordBatch with default item metadata/validity. (rust/lance-file/src/versions/v1/reader.rs:1321-1357)

### Lines 1358-1381

Writes the sliced batch, finishes, asserts total file size<1000, then full-read batch equality. The size guard verifies the huge excluded list payload was not retained in this fixture; it is not a precise byte-layout, memory or IO-count guarantee. Both32/64-bit list offset paths are exercised. (rust/lance-file/src/versions/v1/reader.rs:1358-1381)

### Lines 1382-1412

test_read_ranges writes one Int64 column0..100, reads7..25 and asserts exact values. The comment claiming a null column is stale. It covers a single stored batch only, not the read_range concat branch, empty/out-of-bounds/reversed input or metadata corruption. (rust/lance-file/src/versions/v1/reader.rs:1382-1412)

### Lines 1413-1458

batches_stream fixture writes ten separate10-row Int32 batches, keeps even batch IDs, collects and asserts five batches with exact increasing ranges0..10,20..30,...,80..90. It pins predicate filtering and output order, not concurrency2, read-ahead, cancellation, cache or memory bounds. (rust/lance-file/src/versions/v1/reader.rs:1413-1458)

### Lines 1459-1505

Boolean take fixture configures a memory store block_size256, writes5000 modulo5 Boolean values in one batch and takes[2,4,5,8,4555]. Exact result false,false,true,false,true exercises separated Boolean chunks across the nominal2048-bit block boundary. Unlike disabled codec-local Boolean-take text, this is active reader-level coverage; it still makes no request-count, null/duplicate or cancellation assertion. (rust/lance-file/src/versions/v1/reader.rs:1459-1505)

### Lines 1506-1542

Projection fixture builds100 Int32 fields, projects f50 retaining its field ID, writes only that projected field with15 zeros and finishes. The comment names field_offset/num_fields, but the current constructor takes field_id_offset/max_field_id. The file itself is narrow; it is not reading one field from a physically100-column file. (rust/lance-file/src/versions/v1/reader.rs:1506-1542)

### Lines 1543-1562

Opens the narrow file with the full100-field Schema but both page-table bounds equal f50 ID, then reads with the partial schema and asserts original batch equality. This establishes that stored reader.schema can exceed available physical columns and explicit per-call projection controls successful reads. It does not validate arbitrary schema/file mismatch or cached page-table reuse across differing field bounds. End of module/file. (rust/lance-file/src/versions/v1/reader.rs:1543-1562)

## Interaction and interpretation limits

Every physical line was read in six bounded source outputs during ANALYZE62. Tests were inspected, not run. No internet, source edits, source builds/tests/benchmarks, fixture generators or installations. All six binary fixtures are interpreted; complete modern encodings/backends and Dataset lifecycle remain pending. Contextual Arrow/IO and Dataset snippets only establish cited local interactions; they do not promote those files to analyzed. Source-derived panic/cancellation/cache-identity risks are not executed reproductions. Preserve frozen legacy compatibility; new features belong in current-format paths (AGENTS.md:13-18).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Lance Data File Reader
    5 | 
    6 | // Standard
    7 | use std::ops::{Range, RangeTo};
    8 | use std::sync::Arc;
    9 | 
   10 | use arrow_arith::numeric::sub;
   11 | use arrow_array::{
   12 |     ArrayRef, ArrowNativeTypeOp, ArrowNumericType, NullArray, OffsetSizeTrait, PrimitiveArray,
   13 |     RecordBatch, StructArray, UInt32Array,
   14 |     builder::PrimitiveBuilder,
   15 |     cast::AsArray,
   16 |     types::{Int32Type, Int64Type},
   17 | };
   18 | use arrow_buffer::ArrowNativeType;
   19 | use arrow_schema::{DataType, FieldRef, Schema as ArrowSchema};
   20 | use arrow_select::concat::{self, concat_batches};
   21 | use async_recursion::async_recursion;
   22 | use futures::{Future, FutureExt, StreamExt, TryStreamExt, stream};
   23 | use lance_arrow::*;
   24 | use lance_core::cache::{CacheKey, CacheKeySchema, KeyBuilder, LanceCache};
   25 | use lance_core::datatypes::{Field, Schema};
   26 | use lance_core::deepsize::DeepSizeOf;
   27 | use lance_core::{Error, Result};
   28 | use lance_io::stream::{RecordBatchStream, RecordBatchStreamAdapter};
   29 | use lance_io::traits::Reader;
   30 | use lance_io::utils::{read_metadata_offset, read_struct, read_struct_from_buf};
   31 | use lance_io::{ReadBatchParams, object_store::ObjectStore};
   32 | use std::borrow::Cow;
   33 | 
   34 | use object_store::path::Path;
   35 | use tracing::instrument;
   36 | 
   37 | use crate::versions::v1::encoding::{dictionary::DictionaryDecoder, read_fixed_stride_array};
   38 | use crate::versions::v1::format::metadata::Metadata;
   39 | use crate::versions::v1::page_table::{PageInfo, PageTable};
   40 | 
   41 | /// Lance File Reader.
   42 | ///
   43 | /// It reads arrow data from one data file.
   44 | #[derive(Clone, DeepSizeOf)]
   45 | pub struct FileReader {
   46 |     pub object_reader: Arc<dyn Reader>,
   47 |     metadata: Arc<Metadata>,
   48 |     page_table: Arc<PageTable>,
   49 |     schema: Schema,
   50 | 
   51 |     /// The id of the fragment which this file belong to.
   52 |     /// For simple file access, this can just be zero.
   53 |     fragment_id: u64,
   54 | 
   55 |     /// Page table for statistics
   56 |     stats_page_table: Arc<Option<PageTable>>,
   57 | }
   58 | 
   59 | impl std::fmt::Debug for FileReader {
   60 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   61 |         f.debug_struct("FileReader")
   62 |             .field("fragment", &self.fragment_id)
   63 |             .field("path", &self.object_reader.path())
   64 |             .finish()
   65 |     }
   66 | }
   67 | 
   68 | // Generic cache key for string-based keys
   69 | struct StringCacheKey<'a, T> {
   70 |     key: &'a str,
   71 |     _phantom: std::marker::PhantomData<T>,
   72 | }
   73 | 
   74 | impl<'a, T> StringCacheKey<'a, T> {
   75 |     fn new(key: &'a str) -> Self {
   76 |         Self {
   77 |             key,
   78 |             _phantom: std::marker::PhantomData,
   79 |         }
   80 |     }
   81 | }
   82 | 
   83 | trait StableStringCacheValue: 'static {
   84 |     const STABLE_TYPE_ID: &'static str;
   85 | }
   86 | 
   87 | impl StableStringCacheValue for Metadata {
   88 |     const STABLE_TYPE_ID: &'static str = "lance.file.previous.Metadata";
   89 | }
   90 | 
   91 | impl StableStringCacheValue for PageTable {
   92 |     const STABLE_TYPE_ID: &'static str = "lance.file.previous.PageTable";
   93 | }
   94 | 
   95 | impl StableStringCacheValue for Option<PageTable> {
   96 |     const STABLE_TYPE_ID: &'static str = "lance.file.previous.OptionalPageTable";
   97 | }
   98 | 
   99 | impl<T: StableStringCacheValue> CacheKey for StringCacheKey<'_, T> {
  100 |     type ValueType = T;
  101 | 
  102 |     fn key(&self) -> Cow<'_, str> {
  103 |         self.key.into()
  104 |     }
  105 | 
  106 |     fn type_name() -> &'static str {
  107 |         // Keep the legacy diagnostic name for compatibility. `stable_type_id`
  108 |         // provides the compiler-independent identity used by physical keys.
  109 |         std::any::type_name::<T>()
  110 |     }
  111 | 
  112 |     fn stable_type_id() -> &'static str {
  113 |         T::STABLE_TYPE_ID
  114 |     }
  115 | 
  116 |     fn schema() -> CacheKeySchema {
  117 |         CacheKeySchema::new("lance.file.previous.string-key", 1)
  118 |     }
  119 | 
  120 |     fn write_key(&self, builder: &mut KeyBuilder) {
  121 |         builder.write_str(self.key);
  122 |     }
  123 | }
  124 | 
  125 | impl FileReader {
  126 |     /// Open file reader
  127 |     ///
  128 |     /// Open the file at the given path using the provided object store.
  129 |     ///
  130 |     /// The passed fragment ID determines the first 32-bits of the row IDs.
  131 |     ///
  132 |     /// If a manifest is passed in, it will be used to load the schema and dictionary.
  133 |     /// This is typically done if the file is part of a dataset fragment. If no manifest
  134 |     /// is passed in, then it is read from the file itself.
  135 |     ///
  136 |     /// The session passed in is used to cache metadata about the file. If no session
  137 |     /// is passed in, there will be no caching.
  138 |     #[instrument(level = "debug", skip(object_store, schema, session))]
  139 |     pub async fn try_new_with_fragment_id(
  140 |         object_store: &ObjectStore,
  141 |         path: &Path,
  142 |         schema: Schema,
  143 |         fragment_id: u32,
  144 |         field_id_offset: i32,
  145 |         max_field_id: i32,
  146 |         session: Option<&LanceCache>,
  147 |     ) -> Result<Self> {
  148 |         let object_reader = object_store.open(path).await?;
  149 | 
  150 |         let metadata = Self::read_metadata(object_reader.as_ref(), session).await?;
  151 | 
  152 |         Self::try_new_from_reader(
  153 |             path,
  154 |             object_reader.into(),
  155 |             Some(metadata),
  156 |             schema,
  157 |             fragment_id,
  158 |             field_id_offset,
  159 |             max_field_id,
  160 |             session,
  161 |         )
  162 |         .await
  163 |     }
  164 | 
  165 |     #[allow(clippy::too_many_arguments)]
  166 |     pub async fn try_new_from_reader(
  167 |         path: &Path,
  168 |         object_reader: Arc<dyn Reader>,
  169 |         metadata: Option<Arc<Metadata>>,
  170 |         schema: Schema,
  171 |         fragment_id: u32,
  172 |         field_id_offset: i32,
  173 |         max_field_id: i32,
  174 |         session: Option<&LanceCache>,
  175 |     ) -> Result<Self> {
  176 |         let metadata = match metadata {
  177 |             Some(metadata) => metadata,
  178 |             None => Self::read_metadata(object_reader.as_ref(), session).await?,
  179 |         };
  180 | 
  181 |         let page_table = async {
  182 |             Self::load_from_cache(session, path.to_string(), |_| async {
  183 |                 PageTable::load(
  184 |                     object_reader.as_ref(),
  185 |                     metadata.page_table_position,
  186 |                     field_id_offset,
  187 |                     max_field_id,
  188 |                     metadata.num_batches() as i32,
  189 |                 )
  190 |                 .await
  191 |             })
  192 |             .await
  193 |         };
  194 | 
  195 |         let stats_page_table = Self::read_stats_page_table(object_reader.as_ref(), session);
  196 | 
  197 |         // Can concurrently load page tables
  198 |         let (page_table, stats_page_table) = futures::try_join!(page_table, stats_page_table)?;
  199 | 
  200 |         Ok(Self {
  201 |             object_reader,
  202 |             metadata,
  203 |             schema,
  204 |             page_table,
  205 |             fragment_id: fragment_id as u64,
  206 |             stats_page_table,
  207 |         })
  208 |     }
  209 | 
  210 |     pub async fn read_metadata(
  211 |         object_reader: &dyn Reader,
  212 |         cache: Option<&LanceCache>,
  213 |     ) -> Result<Arc<Metadata>> {
  214 |         Self::load_from_cache(cache, object_reader.path().to_string(), |_| async {
  215 |             let file_size = object_reader.size().await?;
  216 |             let begin = if file_size < object_reader.block_size() {
  217 |                 0
  218 |             } else {
  219 |                 file_size - object_reader.block_size()
  220 |             };
  221 |             let tail_bytes = object_reader.get_range(begin..file_size).await?;
  222 |             let metadata_pos = read_metadata_offset(&tail_bytes)?;
  223 | 
  224 |             let metadata: Metadata = if metadata_pos < file_size - tail_bytes.len() {
  225 |                 // We have not read the metadata bytes yet.
  226 |                 read_struct(object_reader, metadata_pos).await?
  227 |             } else {
  228 |                 let offset = tail_bytes.len() - (file_size - metadata_pos);
  229 |                 read_struct_from_buf(&tail_bytes.slice(offset..))?
  230 |             };
  231 |             Ok(metadata)
  232 |         })
  233 |         .await
  234 |     }
  235 | 
  236 |     /// Get the statistics page table. This will read the metadata if it is not cached.
  237 |     ///
  238 |     /// The page table is cached.
  239 |     async fn read_stats_page_table(
  240 |         reader: &dyn Reader,
  241 |         cache: Option<&LanceCache>,
  242 |     ) -> Result<Arc<Option<PageTable>>> {
  243 |         // To prevent collisions, we cache this at a child path
  244 |         Self::load_from_cache(
  245 |             cache,
  246 |             reader.path().clone().join("stats").to_string(),
  247 |             |_| async {
  248 |                 let metadata = Self::read_metadata(reader, cache).await?;
  249 | 
  250 |                 if let Some(stats_meta) = metadata.stats_metadata.as_ref() {
  251 |                     Ok(Some(
  252 |                         PageTable::load(
  253 |                             reader,
  254 |                             stats_meta.page_table_position,
  255 |                             /*min_field_id=*/ 0,
  256 |                             /*max_field_id=*/
  257 |                             *stats_meta.leaf_field_ids.iter().max().unwrap(),
  258 |                             /*num_batches=*/ 1,
  259 |                         )
  260 |                         .await?,
  261 |                     ))
  262 |                 } else {
  263 |                     Ok(None)
  264 |                 }
  265 |             },
  266 |         )
  267 |         .await
  268 |     }
  269 | 
  270 |     /// Load some metadata about the fragment from the cache, if there is one.
  271 |     async fn load_from_cache<T: DeepSizeOf + Send + Sync + StableStringCacheValue, F, Fut>(
  272 |         cache: Option<&LanceCache>,
  273 |         key: String,
  274 |         loader: F,
  275 |     ) -> Result<Arc<T>>
  276 |     where
  277 |         F: Fn(&str) -> Fut + Send + Sync,
  278 |         Fut: Future<Output = Result<T>> + Send,
  279 |     {
  280 |         if let Some(cache) = cache {
  281 |             let cache_key = StringCacheKey::<T>::new(key.as_str());
  282 |             cache
  283 |                 .get_or_insert_with_key(cache_key, || loader(key.as_str()))
  284 |                 .await
  285 |         } else {
  286 |             Ok(Arc::new(loader(key.as_str()).await?))
  287 |         }
  288 |     }
  289 | 
  290 |     /// Open one Lance data file for read.
  291 |     pub async fn try_new(object_store: &ObjectStore, path: &Path, schema: Schema) -> Result<Self> {
  292 |         // If just reading a lance data file we assume the schema is the schema of the data file
  293 |         let max_field_id = schema.max_field_id().unwrap_or_default();
  294 |         Self::try_new_with_fragment_id(object_store, path, schema, 0, 0, max_field_id, None).await
  295 |     }
  296 | 
  297 |     fn io_parallelism(&self) -> usize {
  298 |         self.object_reader.io_parallelism()
  299 |     }
  300 | 
  301 |     /// Requested projection of the data in this file, excluding the row id column.
  302 |     pub fn schema(&self) -> &Schema {
  303 |         &self.schema
  304 |     }
  305 | 
  306 |     pub fn num_batches(&self) -> usize {
  307 |         self.metadata.num_batches()
  308 |     }
  309 | 
  310 |     /// Get the number of rows in this batch
  311 |     pub fn num_rows_in_batch(&self, batch_id: i32) -> usize {
  312 |         self.metadata.get_batch_length(batch_id).unwrap_or_default() as usize
  313 |     }
  314 | 
  315 |     /// Count the number of rows in this file.
  316 |     pub fn len(&self) -> usize {
  317 |         self.metadata.len()
  318 |     }
  319 | 
  320 |     pub fn is_empty(&self) -> bool {
  321 |         self.metadata.is_empty()
  322 |     }
  323 | 
  324 |     /// Read a batch of data from the file.
  325 |     ///
  326 |     /// The schema of the returned [RecordBatch] is set by [`FileReader::schema()`].
  327 |     #[instrument(level = "debug", skip(self, params, projection))]
  328 |     pub async fn read_batch(
  329 |         &self,
  330 |         batch_id: i32,
  331 |         params: impl Into<ReadBatchParams>,
  332 |         projection: &Schema,
  333 |     ) -> Result<RecordBatch> {
  334 |         read_batch(self, &params.into(), projection, batch_id).await
  335 |     }
  336 | 
  337 |     /// Read a range of records into one batch.
  338 |     ///
  339 |     /// Note that it might call concat if the range is crossing multiple batches, which
  340 |     /// makes it less efficient than [`FileReader::read_batch()`].
  341 |     #[instrument(level = "debug", skip(self, projection))]
  342 |     pub async fn read_range(
  343 |         &self,
  344 |         range: Range<usize>,
  345 |         projection: &Schema,
  346 |     ) -> Result<RecordBatch> {
  347 |         if range.is_empty() {
  348 |             return Ok(RecordBatch::new_empty(Arc::new(projection.into())));
  349 |         }
  350 |         let range_in_batches = self.metadata.range_to_batches(range)?;
  351 |         let batches =
  352 |             stream::iter(range_in_batches)
  353 |                 .map(|(batch_id, range)| async move {
  354 |                     self.read_batch(batch_id, range, projection).await
  355 |                 })
  356 |                 .buffered(self.io_parallelism())
  357 |                 .try_collect::<Vec<_>>()
  358 |                 .await?;
  359 |         if batches.len() == 1 {
  360 |             return Ok(batches[0].clone());
  361 |         }
  362 |         let schema = batches[0].schema();
  363 |         Ok(tokio::task::spawn_blocking(move || concat_batches(&schema, &batches)).await??)
  364 |     }
  365 | 
  366 |     /// Take by records by indices within the file.
  367 |     ///
  368 |     /// The indices must be sorted.
  369 |     #[instrument(level = "debug", skip_all)]
  370 |     pub async fn take(&self, indices: &[u32], projection: &Schema) -> Result<RecordBatch> {
  371 |         let num_batches = self.num_batches();
  372 |         let num_rows = self.len() as u32;
  373 |         let indices_in_batches = self.metadata.group_indices_to_batches(indices);
  374 |         let batches = stream::iter(indices_in_batches)
  375 |             .map(|batch| async move {
  376 |                 if batch.batch_id >= num_batches as i32 {
  377 |                     Err(Error::invalid_input_source(
  378 |                         format!("batch_id: {} out of bounds", batch.batch_id).into(),
  379 |                     ))
  380 |                 } else if *batch.offsets.last().expect("got empty batch") > num_rows {
  381 |                     Err(Error::invalid_input_source(
  382 |                         format!("indices: {:?} out of bounds", batch.offsets).into(),
  383 |                     ))
  384 |                 } else {
  385 |                     self.read_batch(batch.batch_id, batch.offsets.as_slice(), projection)
  386 |                         .await
  387 |                 }
  388 |             })
  389 |             .buffered(self.io_parallelism())
  390 |             .try_collect::<Vec<_>>()
  391 |             .await?;
  392 | 
  393 |         let schema = Arc::new(ArrowSchema::from(projection));
  394 | 
  395 |         Ok(tokio::task::spawn_blocking(move || concat_batches(&schema, &batches)).await??)
  396 |     }
  397 | 
  398 |     /// Get the schema of the statistics page table, for the given data field ids.
  399 |     pub fn page_stats_schema(&self, field_ids: &[i32]) -> Option<Schema> {
  400 |         self.metadata.stats_metadata.as_ref().map(|meta| {
  401 |             let mut stats_field_ids = vec![];
  402 |             for stats_field in &meta.schema.fields {
  403 |                 if let Ok(stats_field_id) = stats_field.name.parse::<i32>()
  404 |                     && field_ids.contains(&stats_field_id)
  405 |                 {
  406 |                     stats_field_ids.push(stats_field.id);
  407 |                     for child in &stats_field.children {
  408 |                         stats_field_ids.push(child.id);
  409 |                     }
  410 |                 }
  411 |             }
  412 |             meta.schema.project_by_ids(&stats_field_ids, true)
  413 |         })
  414 |     }
  415 | 
  416 |     /// Get the page statistics for the given data field ids.
  417 |     pub async fn read_page_stats(&self, field_ids: &[i32]) -> Result<Option<RecordBatch>> {
  418 |         if let Some(stats_page_table) = self.stats_page_table.as_ref() {
  419 |             let projection = self.page_stats_schema(field_ids).unwrap();
  420 |             // It's possible none of the requested fields have stats.
  421 |             if projection.fields.is_empty() {
  422 |                 return Ok(None);
  423 |             }
  424 |             let arrays = futures::stream::iter(projection.fields.iter().cloned())
  425 |                 .map(|field| async move {
  426 |                     read_array(
  427 |                         self,
  428 |                         &field,
  429 |                         0,
  430 |                         stats_page_table,
  431 |                         &ReadBatchParams::RangeFull,
  432 |                     )
  433 |                     .await
  434 |                 })
  435 |                 .buffered(self.io_parallelism())
  436 |                 .try_collect::<Vec<_>>()
  437 |                 .await?;
  438 | 
  439 |             let schema = ArrowSchema::from(&projection);
  440 |             let batch = RecordBatch::try_new(Arc::new(schema), arrays)?;
  441 |             Ok(Some(batch))
  442 |         } else {
  443 |             Ok(None)
  444 |         }
  445 |     }
  446 | }
  447 | 
  448 | /// Stream desired full batches from the file.
  449 | ///
  450 | /// Parameters:
  451 | /// - **reader**: An opened file reader.
  452 | /// - **projection**: The schema of the returning [RecordBatch].
  453 | /// - **predicate**: A function that takes a batch ID and returns true if the batch should be
  454 | ///   returned.
  455 | ///
  456 | /// Returns:
  457 | /// - A stream of [RecordBatch]s, each one corresponding to one full batch in the file.
  458 | pub fn batches_stream(
  459 |     reader: FileReader,
  460 |     projection: Schema,
  461 |     predicate: impl FnMut(&i32) -> bool + Send + Sync + 'static,
  462 | ) -> impl RecordBatchStream {
  463 |     // Make projection an Arc so we can clone it and pass between threads.
  464 |     let projection = Arc::new(projection);
  465 |     let arrow_schema = ArrowSchema::from(projection.as_ref());
  466 | 
  467 |     let total_batches = reader.num_batches() as i32;
  468 |     let batches = (0..total_batches).filter(predicate);
  469 |     // Make another copy of self so we can clone it and pass between threads.
  470 |     let this = Arc::new(reader);
  471 |     let inner = stream::iter(batches)
  472 |         .zip(stream::repeat_with(move || {
  473 |             (this.clone(), projection.clone())
  474 |         }))
  475 |         .map(move |(batch_id, (reader, projection))| async move {
  476 |             reader
  477 |                 .read_batch(batch_id, ReadBatchParams::RangeFull, &projection)
  478 |                 .await
  479 |         })
  480 |         .buffered(2)
  481 |         .boxed();
  482 |     RecordBatchStreamAdapter::new(Arc::new(arrow_schema), inner)
  483 | }
  484 | 
  485 | /// Read a batch.
  486 | ///
  487 | /// `schema` may only be empty if `with_row_id` is also true. This function
  488 | /// panics otherwise.
  489 | pub async fn read_batch(
  490 |     reader: &FileReader,
  491 |     params: &ReadBatchParams,
  492 |     schema: &Schema,
  493 |     batch_id: i32,
  494 | ) -> Result<RecordBatch> {
  495 |     if !schema.fields.is_empty() {
  496 |         // We box this because otherwise we get a higher-order lifetime error.
  497 |         let arrs = stream::iter(&schema.fields)
  498 |             .map(|f| async { read_array(reader, f, batch_id, &reader.page_table, params).await })
  499 |             .buffered(reader.io_parallelism())
  500 |             .try_collect::<Vec<_>>()
  501 |             .boxed();
  502 |         let arrs = arrs.await?;
  503 |         Ok(RecordBatch::try_new(Arc::new(schema.into()), arrs)?)
  504 |     } else {
  505 |         Err(Error::invalid_input("no fields requested"))
  506 |     }
  507 | }
  508 | 
  509 | #[async_recursion]
  510 | async fn read_array(
  511 |     reader: &FileReader,
  512 |     field: &Field,
  513 |     batch_id: i32,
  514 |     page_table: &PageTable,
  515 |     params: &ReadBatchParams,
  516 | ) -> Result<ArrayRef> {
  517 |     let data_type = field.data_type();
  518 | 
  519 |     use DataType::*;
  520 | 
  521 |     if data_type.is_fixed_stride() {
  522 |         _read_fixed_stride_array(reader, field, batch_id, page_table, params).await
  523 |     } else {
  524 |         match data_type {
  525 |             Null => read_null_array(field, batch_id, page_table, params),
  526 |             Utf8 | LargeUtf8 | Binary | LargeBinary => {
  527 |                 read_binary_array(reader, field, batch_id, page_table, params).await
  528 |             }
  529 |             Struct(_) => read_struct_array(reader, field, batch_id, page_table, params).await,
  530 |             Dictionary(_, _) => {
  531 |                 read_dictionary_array(reader, field, batch_id, page_table, params).await
  532 |             }
  533 |             List(_) => {
  534 |                 read_list_array::<Int32Type>(reader, field, batch_id, page_table, params).await
  535 |             }
  536 |             LargeList(_) => {
  537 |                 read_list_array::<Int64Type>(reader, field, batch_id, page_table, params).await
  538 |             }
  539 |             _ => {
  540 |                 unimplemented!("{}", format!("No support for {data_type} yet"));
  541 |             }
  542 |         }
  543 |     }
  544 | }
  545 | 
  546 | fn get_page_info<'a>(
  547 |     page_table: &'a PageTable,
  548 |     field: &'a Field,
  549 |     batch_id: i32,
  550 | ) -> Result<&'a PageInfo> {
  551 |     page_table.get(field.id, batch_id).ok_or_else(|| {
  552 |         Error::invalid_input(format!(
  553 |             "No page info found for field: {}, field_id={} batch={}",
  554 |             field.name, field.id, batch_id
  555 |         ))
  556 |     })
  557 | }
  558 | 
  559 | /// Read primitive array for batch `batch_idx`.
  560 | async fn _read_fixed_stride_array(
  561 |     reader: &FileReader,
  562 |     field: &Field,
  563 |     batch_id: i32,
  564 |     page_table: &PageTable,
  565 |     params: &ReadBatchParams,
  566 | ) -> Result<ArrayRef> {
  567 |     let page_info = get_page_info(page_table, field, batch_id)?;
  568 |     read_fixed_stride_array(
  569 |         reader.object_reader.as_ref(),
  570 |         &field.data_type(),
  571 |         page_info.position,
  572 |         page_info.length,
  573 |         params.clone(),
  574 |     )
  575 |     .await
  576 | }
  577 | 
  578 | fn read_null_array(
  579 |     field: &Field,
  580 |     batch_id: i32,
  581 |     page_table: &PageTable,
  582 |     params: &ReadBatchParams,
  583 | ) -> Result<ArrayRef> {
  584 |     let page_info = get_page_info(page_table, field, batch_id)?;
  585 | 
  586 |     let length_output = match params {
  587 |         ReadBatchParams::Indices(indices) => {
  588 |             if indices.is_empty() {
  589 |                 0
  590 |             } else {
  591 |                 let idx_max = *indices.values().iter().max().unwrap() as u64;
  592 |                 if idx_max >= page_info.length as u64 {
  593 |                     return Err(Error::invalid_input(format!(
  594 |                         "NullArray Reader: request([{}]) out of range: [0..{}]",
  595 |                         idx_max, page_info.length
  596 |                     )));
  597 |                 }
  598 |                 indices.len()
  599 |             }
  600 |         }
  601 |         _ => {
  602 |             let (idx_start, idx_end) = match params {
  603 |                 ReadBatchParams::Range(r) => (r.start, r.end),
  604 |                 ReadBatchParams::RangeFull => (0, page_info.length),
  605 |                 ReadBatchParams::RangeTo(r) => (0, r.end),
  606 |                 ReadBatchParams::RangeFrom(r) => (r.start, page_info.length),
  607 |                 _ => unreachable!(),
  608 |             };
  609 |             if idx_end > page_info.length {
  610 |                 return Err(Error::invalid_input(format!(
  611 |                     "NullArray Reader: request([{}..{}]) out of range: [0..{}]",
  612 |                     // and wrap it in here.
  613 |                     idx_start,
  614 |                     idx_end,
  615 |                     page_info.length
  616 |                 )));
  617 |             }
  618 |             idx_end - idx_start
  619 |         }
  620 |     };
  621 | 
  622 |     Ok(Arc::new(NullArray::new(length_output)))
  623 | }
  624 | 
  625 | async fn read_binary_array(
  626 |     reader: &FileReader,
  627 |     field: &Field,
  628 |     batch_id: i32,
  629 |     page_table: &PageTable,
  630 |     params: &ReadBatchParams,
  631 | ) -> Result<ArrayRef> {
  632 |     let page_info = get_page_info(page_table, field, batch_id)?;
  633 | 
  634 |     crate::versions::v1::encoding::read_binary_array(
  635 |         reader.object_reader.as_ref(),
  636 |         &field.data_type(),
  637 |         field.nullable,
  638 |         page_info.position,
  639 |         page_info.length,
  640 |         params,
  641 |     )
  642 |     .await
  643 | }
  644 | 
  645 | async fn read_dictionary_array(
  646 |     reader: &FileReader,
  647 |     field: &Field,
  648 |     batch_id: i32,
  649 |     page_table: &PageTable,
  650 |     params: &ReadBatchParams,
  651 | ) -> Result<ArrayRef> {
  652 |     let page_info = get_page_info(page_table, field, batch_id)?;
  653 |     let data_type = field.data_type();
  654 |     let decoder = DictionaryDecoder::new(
  655 |         reader.object_reader.as_ref(),
  656 |         page_info.position,
  657 |         page_info.length,
  658 |         &data_type,
  659 |         field
  660 |             .dictionary
  661 |             .as_ref()
  662 |             .unwrap()
  663 |             .values
  664 |             .as_ref()
  665 |             .unwrap()
  666 |             .clone(),
  667 |     );
  668 |     decoder.get(params.clone()).await
  669 | }
  670 | 
  671 | async fn read_struct_array(
  672 |     reader: &FileReader,
  673 |     field: &Field,
  674 |     batch_id: i32,
  675 |     page_table: &PageTable,
  676 |     params: &ReadBatchParams,
  677 | ) -> Result<ArrayRef> {
  678 |     // TODO: use tokio to make the reads in parallel.
  679 |     let mut sub_arrays: Vec<(FieldRef, ArrayRef)> = vec![];
  680 | 
  681 |     for child in field.children.as_slice() {
  682 |         let arr = read_array(reader, child, batch_id, page_table, params).await?;
  683 |         sub_arrays.push((Arc::new(child.into()), arr));
  684 |     }
  685 | 
  686 |     Ok(Arc::new(StructArray::from(sub_arrays)))
  687 | }
  688 | 
  689 | async fn take_list_array<T: ArrowNumericType>(
  690 |     reader: &FileReader,
  691 |     field: &Field,
  692 |     batch_id: i32,
  693 |     page_table: &PageTable,
  694 |     positions: &PrimitiveArray<T>,
  695 |     indices: &UInt32Array,
  696 | ) -> Result<ArrayRef>
  697 | where
  698 |     T::Native: ArrowNativeTypeOp + OffsetSizeTrait,
  699 | {
  700 |     let first_idx = indices.value(0);
  701 |     // Range of values for each index
  702 |     let ranges = indices
  703 |         .values()
  704 |         .iter()
  705 |         .map(|i| (*i - first_idx).as_usize())
  706 |         .map(|idx| positions.value(idx).as_usize()..positions.value(idx + 1).as_usize())
  707 |         .collect::<Vec<_>>();
  708 |     let field = field.clone();
  709 |     let mut list_values: Vec<ArrayRef> = vec![];
  710 |     // TODO: read them in parallel.
  711 |     for range in ranges.iter() {
  712 |         list_values.push(
  713 |             read_array(
  714 |                 reader,
  715 |                 &field.children[0],
  716 |                 batch_id,
  717 |                 page_table,
  718 |                 &(range.clone()).into(),
  719 |             )
  720 |             .await?,
  721 |         );
  722 |     }
  723 | 
  724 |     let value_refs = list_values
  725 |         .iter()
  726 |         .map(|arr| arr.as_ref())
  727 |         .collect::<Vec<_>>();
  728 |     let mut offsets_builder = PrimitiveBuilder::<T>::new();
  729 |     offsets_builder.append_value(T::Native::usize_as(0));
  730 |     let mut off = 0_usize;
  731 |     for range in ranges {
  732 |         off += range.len();
  733 |         offsets_builder.append_value(T::Native::usize_as(off));
  734 |     }
  735 |     let all_values = concat::concat(value_refs.as_slice())?;
  736 |     let offset_arr = offsets_builder.finish();
  737 |     let arr = try_new_generic_list_array(all_values, &offset_arr)?;
  738 |     Ok(Arc::new(arr) as ArrayRef)
  739 | }
  740 | 
  741 | async fn read_list_array<T: ArrowNumericType>(
  742 |     reader: &FileReader,
  743 |     field: &Field,
  744 |     batch_id: i32,
  745 |     page_table: &PageTable,
  746 |     params: &ReadBatchParams,
  747 | ) -> Result<ArrayRef>
  748 | where
  749 |     T::Native: ArrowNativeTypeOp + OffsetSizeTrait,
  750 | {
  751 |     // Offset the position array by 1 in order to include the upper bound of the last element
  752 |     let positions_params = match params {
  753 |         ReadBatchParams::Range(range) => ReadBatchParams::from(range.start..(range.end + 1)),
  754 |         ReadBatchParams::RangeTo(range) => ReadBatchParams::from(..range.end + 1),
  755 |         ReadBatchParams::Indices(indices) => {
  756 |             (indices.value(0).as_usize()..indices.value(indices.len() - 1).as_usize() + 2).into()
  757 |         }
  758 |         p => p.clone(),
  759 |     };
  760 | 
  761 |     let page_info = get_page_info(&reader.page_table, field, batch_id)?;
  762 |     let position_arr = read_fixed_stride_array(
  763 |         reader.object_reader.as_ref(),
  764 |         &T::DATA_TYPE,
  765 |         page_info.position,
  766 |         page_info.length,
  767 |         positions_params,
  768 |     )
  769 |     .await?;
  770 | 
  771 |     let positions: &PrimitiveArray<T> = position_arr.as_primitive();
  772 | 
  773 |     // Recompute params so they align with the offset array
  774 |     let value_params = match params {
  775 |         ReadBatchParams::Range(range) => ReadBatchParams::from(
  776 |             positions.value(0).as_usize()..positions.value(range.end - range.start).as_usize(),
  777 |         ),
  778 |         ReadBatchParams::Ranges(_) => {
  779 |             return Err(Error::internal(
  780 |                 "ReadBatchParams::Ranges should not be used in v1 files".to_string(),
  781 |             ));
  782 |         }
  783 |         ReadBatchParams::RangeTo(RangeTo { end }) => {
  784 |             ReadBatchParams::from(..positions.value(*end).as_usize())
  785 |         }
  786 |         ReadBatchParams::RangeFrom(_) => ReadBatchParams::from(positions.value(0).as_usize()..),
  787 |         ReadBatchParams::RangeFull => ReadBatchParams::from(
  788 |             positions.value(0).as_usize()..positions.value(positions.len() - 1).as_usize(),
  789 |         ),
  790 |         ReadBatchParams::Indices(indices) => {
  791 |             return take_list_array(reader, field, batch_id, page_table, positions, indices).await;
  792 |         }
  793 |     };
  794 | 
  795 |     let start_position = PrimitiveArray::<T>::new_scalar(positions.value(0));
  796 |     let offset_arr = sub(positions, &start_position)?;
  797 |     let offset_arr_ref = offset_arr.as_primitive::<T>();
  798 |     let value_arrs = read_array(
  799 |         reader,
  800 |         &field.children[0],
  801 |         batch_id,
  802 |         page_table,
  803 |         &value_params,
  804 |     )
  805 |     .await?;
  806 |     let arr = try_new_generic_list_array(value_arrs, offset_arr_ref)?;
  807 |     Ok(Arc::new(arr) as ArrayRef)
  808 | }
  809 | 
  810 | #[cfg(test)]
  811 | mod tests {
  812 |     use crate::versions::v1::writer::{FileWriter as V1FileWriter, NotSelfDescribing};
  813 | 
  814 |     use super::*;
  815 | 
  816 |     use arrow_array::{
  817 |         Array, DictionaryArray, Float32Array, Int64Array, LargeListArray, ListArray, StringArray,
  818 |         UInt8Array,
  819 |         builder::{Int32Builder, LargeListBuilder, ListBuilder, StringBuilder},
  820 |         cast::{as_string_array, as_struct_array},
  821 |         types::UInt8Type,
  822 |     };
  823 |     use arrow_array::{BooleanArray, Int32Array};
  824 |     use arrow_schema::{Field as ArrowField, Fields as ArrowFields, Schema as ArrowSchema};
  825 |     use lance_io::object_store::ObjectStoreParams;
  826 | 
  827 |     #[test]
  828 |     fn string_cache_key_discriminators_are_stable_and_type_scoped() {
  829 |         assert_eq!(
  830 |             [
  831 |                 <StringCacheKey<'static, Metadata> as CacheKey>::stable_type_id(),
  832 |                 <StringCacheKey<'static, PageTable> as CacheKey>::stable_type_id(),
  833 |                 <StringCacheKey<'static, Option<PageTable>> as CacheKey>::stable_type_id(),
  834 |             ],
  835 |             [
  836 |                 "lance.file.previous.Metadata",
  837 |                 "lance.file.previous.PageTable",
  838 |                 "lance.file.previous.OptionalPageTable",
  839 |             ]
  840 |         );
  841 |         assert_eq!(
  842 |             [
  843 |                 <StringCacheKey<'static, Metadata> as CacheKey>::type_name(),
  844 |                 <StringCacheKey<'static, PageTable> as CacheKey>::type_name(),
  845 |                 <StringCacheKey<'static, Option<PageTable>> as CacheKey>::type_name(),
  846 |             ],
  847 |             [
  848 |                 std::any::type_name::<Metadata>(),
  849 |                 std::any::type_name::<PageTable>(),
  850 |                 std::any::type_name::<Option<PageTable>>(),
  851 |             ]
  852 |         );
  853 |     }
  854 | 
  855 |     #[tokio::test]
  856 |     async fn test_take() {
  857 |         let arrow_schema = ArrowSchema::new(vec![
  858 |             ArrowField::new("i", DataType::Int64, true),
  859 |             ArrowField::new("f", DataType::Float32, false),
  860 |             ArrowField::new("s", DataType::Utf8, false),
  861 |             ArrowField::new(
  862 |                 "d",
  863 |                 DataType::Dictionary(Box::new(DataType::UInt8), Box::new(DataType::Utf8)),
  864 |                 false,
  865 |             ),
  866 |         ]);
  867 |         let mut schema = Schema::try_from(&arrow_schema).unwrap();
  868 | 
  869 |         let store = ObjectStore::memory();
  870 |         let path = Path::from("/take_test");
  871 | 
  872 |         // Write 10 batches.
  873 |         let values = StringArray::from_iter_values(["a", "b", "c", "d", "e", "f", "g"]);
  874 |         let values_ref = Arc::new(values);
  875 |         let mut batches = vec![];
  876 |         for batch_id in 0..10 {
  877 |             let value_range: Range<i64> = batch_id * 10..batch_id * 10 + 10;
  878 |             let keys = UInt8Array::from_iter_values(value_range.clone().map(|v| (v % 7) as u8));
  879 |             let columns: Vec<ArrayRef> = vec![
  880 |                 Arc::new(Int64Array::from_iter(
  881 |                     value_range.clone().collect::<Vec<_>>(),
  882 |                 )),
  883 |                 Arc::new(Float32Array::from_iter(
  884 |                     value_range.clone().map(|n| n as f32).collect::<Vec<_>>(),
  885 |                 )),
  886 |                 Arc::new(StringArray::from_iter_values(
  887 |                     value_range.clone().map(|n| format!("str-{}", n)),
  888 |                 )),
  889 |                 Arc::new(DictionaryArray::<UInt8Type>::try_new(keys, values_ref.clone()).unwrap()),
  890 |             ];
  891 |             batches.push(RecordBatch::try_new(Arc::new(arrow_schema.clone()), columns).unwrap());
  892 |         }
  893 |         schema.set_dictionary(&batches[0]).unwrap();
  894 | 
  895 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
  896 |             &store,
  897 |             &path,
  898 |             schema.clone(),
  899 |             &Default::default(),
  900 |         )
  901 |         .await
  902 |         .unwrap();
  903 |         for batch in batches.iter() {
  904 |             file_writer
  905 |                 .write(std::slice::from_ref(batch))
  906 |                 .await
  907 |                 .unwrap();
  908 |         }
  909 |         file_writer.finish().await.unwrap();
  910 | 
  911 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
  912 |         let batch = reader
  913 |             .take(&[1, 15, 20, 25, 30, 48, 90], reader.schema())
  914 |             .await
  915 |             .unwrap();
  916 |         let dict_keys = UInt8Array::from_iter_values([1, 1, 6, 4, 2, 6, 6]);
  917 |         assert_eq!(
  918 |             batch,
  919 |             RecordBatch::try_new(
  920 |                 batch.schema(),
  921 |                 vec![
  922 |                     Arc::new(Int64Array::from_iter_values([1, 15, 20, 25, 30, 48, 90])),
  923 |                     Arc::new(Float32Array::from_iter_values([
  924 |                         1.0, 15.0, 20.0, 25.0, 30.0, 48.0, 90.0
  925 |                     ])),
  926 |                     Arc::new(StringArray::from_iter_values([
  927 |                         "str-1", "str-15", "str-20", "str-25", "str-30", "str-48", "str-90"
  928 |                     ])),
  929 |                     Arc::new(DictionaryArray::try_new(dict_keys, values_ref.clone()).unwrap()),
  930 |                 ]
  931 |             )
  932 |             .unwrap()
  933 |         );
  934 |     }
  935 | 
  936 |     async fn test_write_null_string_in_struct(field_nullable: bool) {
  937 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
  938 |             "parent",
  939 |             DataType::Struct(ArrowFields::from(vec![ArrowField::new(
  940 |                 "str",
  941 |                 DataType::Utf8,
  942 |                 field_nullable,
  943 |             )])),
  944 |             true,
  945 |         )]));
  946 | 
  947 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  948 | 
  949 |         let store = ObjectStore::memory();
  950 |         let path = Path::from("/null_strings");
  951 | 
  952 |         let string_arr = Arc::new(StringArray::from_iter([Some("a"), Some(""), Some("b")]));
  953 |         let struct_arr = Arc::new(StructArray::from(vec![(
  954 |             Arc::new(ArrowField::new("str", DataType::Utf8, field_nullable)),
  955 |             string_arr.clone() as ArrayRef,
  956 |         )]));
  957 |         let batch = RecordBatch::try_new(arrow_schema.clone(), vec![struct_arr]).unwrap();
  958 | 
  959 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
  960 |             &store,
  961 |             &path,
  962 |             schema.clone(),
  963 |             &Default::default(),
  964 |         )
  965 |         .await
  966 |         .unwrap();
  967 |         file_writer
  968 |             .write(std::slice::from_ref(&batch))
  969 |             .await
  970 |             .unwrap();
  971 |         file_writer.finish().await.unwrap();
  972 | 
  973 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
  974 |         let actual_batch = reader.read_batch(0, .., reader.schema()).await.unwrap();
  975 | 
  976 |         if field_nullable {
  977 |             assert_eq!(
  978 |                 &StringArray::from_iter(vec![Some("a"), None, Some("b")]),
  979 |                 as_string_array(
  980 |                     as_struct_array(actual_batch.column_by_name("parent").unwrap().as_ref())
  981 |                         .column_by_name("str")
  982 |                         .unwrap()
  983 |                         .as_ref()
  984 |                 )
  985 |             );
  986 |         } else {
  987 |             assert_eq!(actual_batch, batch);
  988 |         }
  989 |     }
  990 | 
  991 |     #[tokio::test]
  992 |     async fn read_nullable_string_in_struct() {
  993 |         test_write_null_string_in_struct(true).await;
  994 |         test_write_null_string_in_struct(false).await;
  995 |     }
  996 | 
  997 |     #[tokio::test]
  998 |     async fn test_read_struct_of_list_arrays() {
  999 |         let store = ObjectStore::memory();
 1000 |         let path = Path::from("/null_strings");
 1001 | 
 1002 |         let arrow_schema = make_schema_of_list_array();
 1003 |         let schema: Schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
 1004 | 
 1005 |         let batches = (0..3)
 1006 |             .map(|_| {
 1007 |                 let struct_array = make_struct_of_list_array(10, 10);
 1008 |                 RecordBatch::try_new(arrow_schema.clone(), vec![struct_array]).unwrap()
 1009 |             })
 1010 |             .collect::<Vec<_>>();
 1011 |         let batches_ref = batches.iter().collect::<Vec<_>>();
 1012 | 
 1013 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1014 |             &store,
 1015 |             &path,
 1016 |             schema.clone(),
 1017 |             &Default::default(),
 1018 |         )
 1019 |         .await
 1020 |         .unwrap();
 1021 |         file_writer.write(&batches).await.unwrap();
 1022 |         file_writer.finish().await.unwrap();
 1023 | 
 1024 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1025 |         let actual_batch = reader.read_batch(0, .., reader.schema()).await.unwrap();
 1026 |         let expected = concat_batches(&arrow_schema, batches_ref).unwrap();
 1027 |         assert_eq!(expected, actual_batch);
 1028 |     }
 1029 | 
 1030 |     #[tokio::test]
 1031 |     async fn test_scan_struct_of_list_arrays() {
 1032 |         let store = ObjectStore::memory();
 1033 |         let path = Path::from("/null_strings");
 1034 | 
 1035 |         let arrow_schema = make_schema_of_list_array();
 1036 |         let struct_array = make_struct_of_list_array(3, 10);
 1037 |         let schema: Schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
 1038 |         let batch = RecordBatch::try_new(arrow_schema.clone(), vec![struct_array.clone()]).unwrap();
 1039 | 
 1040 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1041 |             &store,
 1042 |             &path,
 1043 |             schema.clone(),
 1044 |             &Default::default(),
 1045 |         )
 1046 |         .await
 1047 |         .unwrap();
 1048 |         file_writer.write(&[batch]).await.unwrap();
 1049 |         file_writer.finish().await.unwrap();
 1050 | 
 1051 |         let mut expected_columns: Vec<ArrayRef> = Vec::new();
 1052 |         for c in struct_array.columns().iter() {
 1053 |             expected_columns.push(c.slice(1, 1));
 1054 |         }
 1055 | 
 1056 |         let expected_struct = match arrow_schema.fields[0].data_type() {
 1057 |             DataType::Struct(subfields) => subfields
 1058 |                 .iter()
 1059 |                 .zip(expected_columns)
 1060 |                 .map(|(f, d)| (f.clone(), d))
 1061 |                 .collect::<Vec<_>>(),
 1062 |             _ => panic!("unexpected field"),
 1063 |         };
 1064 | 
 1065 |         let expected_struct_array = StructArray::from(expected_struct);
 1066 |         let expected_batch = RecordBatch::from(&StructArray::from(vec![(
 1067 |             Arc::new(arrow_schema.fields[0].as_ref().clone()),
 1068 |             Arc::new(expected_struct_array) as ArrayRef,
 1069 |         )]));
 1070 | 
 1071 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1072 |         let params = ReadBatchParams::Range(1..2);
 1073 |         let slice_of_batch = reader.read_batch(0, params, reader.schema()).await.unwrap();
 1074 |         assert_eq!(expected_batch, slice_of_batch);
 1075 |     }
 1076 | 
 1077 |     fn make_schema_of_list_array() -> Arc<arrow_schema::Schema> {
 1078 |         Arc::new(ArrowSchema::new(vec![ArrowField::new(
 1079 |             "s",
 1080 |             DataType::Struct(ArrowFields::from(vec![
 1081 |                 ArrowField::new(
 1082 |                     "li",
 1083 |                     DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1084 |                     true,
 1085 |                 ),
 1086 |                 ArrowField::new(
 1087 |                     "ls",
 1088 |                     DataType::List(Arc::new(ArrowField::new("item", DataType::Utf8, true))),
 1089 |                     true,
 1090 |                 ),
 1091 |                 ArrowField::new(
 1092 |                     "ll",
 1093 |                     DataType::LargeList(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1094 |                     false,
 1095 |                 ),
 1096 |             ])),
 1097 |             true,
 1098 |         )]))
 1099 |     }
 1100 | 
 1101 |     fn make_struct_of_list_array(rows: i32, num_items: i32) -> Arc<StructArray> {
 1102 |         let mut li_builder = ListBuilder::new(Int32Builder::new());
 1103 |         let mut ls_builder = ListBuilder::new(StringBuilder::new());
 1104 |         let ll_value_builder = Int32Builder::new();
 1105 |         let mut large_list_builder = LargeListBuilder::new(ll_value_builder);
 1106 |         for i in 0..rows {
 1107 |             for j in 0..num_items {
 1108 |                 li_builder.values().append_value(i * 10 + j);
 1109 |                 ls_builder
 1110 |                     .values()
 1111 |                     .append_value(format!("str-{}", i * 10 + j));
 1112 |                 large_list_builder.values().append_value(i * 10 + j);
 1113 |             }
 1114 |             li_builder.append(true);
 1115 |             ls_builder.append(true);
 1116 |             large_list_builder.append(true);
 1117 |         }
 1118 |         Arc::new(StructArray::from(vec![
 1119 |             (
 1120 |                 Arc::new(ArrowField::new(
 1121 |                     "li",
 1122 |                     DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1123 |                     true,
 1124 |                 )),
 1125 |                 Arc::new(li_builder.finish()) as ArrayRef,
 1126 |             ),
 1127 |             (
 1128 |                 Arc::new(ArrowField::new(
 1129 |                     "ls",
 1130 |                     DataType::List(Arc::new(ArrowField::new("item", DataType::Utf8, true))),
 1131 |                     true,
 1132 |                 )),
 1133 |                 Arc::new(ls_builder.finish()) as ArrayRef,
 1134 |             ),
 1135 |             (
 1136 |                 Arc::new(ArrowField::new(
 1137 |                     "ll",
 1138 |                     DataType::LargeList(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1139 |                     false,
 1140 |                 )),
 1141 |                 Arc::new(large_list_builder.finish()) as ArrayRef,
 1142 |             ),
 1143 |         ]))
 1144 |     }
 1145 | 
 1146 |     #[tokio::test]
 1147 |     async fn test_read_nullable_arrays() {
 1148 |         use arrow_array::Array;
 1149 | 
 1150 |         // create a record batch with a null array column
 1151 |         let arrow_schema = ArrowSchema::new(vec![
 1152 |             ArrowField::new("i", DataType::Int64, false),
 1153 |             ArrowField::new("n", DataType::Null, true),
 1154 |         ]);
 1155 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1156 |         let columns: Vec<ArrayRef> = vec![
 1157 |             Arc::new(Int64Array::from_iter_values(0..100)),
 1158 |             Arc::new(NullArray::new(100)),
 1159 |         ];
 1160 |         let batch = RecordBatch::try_new(Arc::new(arrow_schema), columns).unwrap();
 1161 | 
 1162 |         // write to a lance file
 1163 |         let store = ObjectStore::memory();
 1164 |         let path = Path::from("/takes");
 1165 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1166 |             &store,
 1167 |             &path,
 1168 |             schema.clone(),
 1169 |             &Default::default(),
 1170 |         )
 1171 |         .await
 1172 |         .unwrap();
 1173 |         file_writer.write(&[batch]).await.unwrap();
 1174 |         file_writer.finish().await.unwrap();
 1175 | 
 1176 |         // read the file back
 1177 |         let reader = FileReader::try_new(&store, &path, schema.clone())
 1178 |             .await
 1179 |             .unwrap();
 1180 | 
 1181 |         async fn read_array_w_params(
 1182 |             reader: &FileReader,
 1183 |             field: &Field,
 1184 |             params: ReadBatchParams,
 1185 |         ) -> ArrayRef {
 1186 |             read_array(reader, field, 0, reader.page_table.as_ref(), &params)
 1187 |                 .await
 1188 |                 .expect("Error reading back the null array from file") as _
 1189 |         }
 1190 | 
 1191 |         let arr = read_array_w_params(&reader, &schema.fields[1], ReadBatchParams::RangeFull).await;
 1192 |         assert_eq!(100, arr.len());
 1193 |         assert_eq!(arr.data_type(), &DataType::Null);
 1194 | 
 1195 |         let arr =
 1196 |             read_array_w_params(&reader, &schema.fields[1], ReadBatchParams::Range(10..25)).await;
 1197 |         assert_eq!(15, arr.len());
 1198 |         assert_eq!(arr.data_type(), &DataType::Null);
 1199 | 
 1200 |         let arr =
 1201 |             read_array_w_params(&reader, &schema.fields[1], ReadBatchParams::RangeFrom(60..)).await;
 1202 |         assert_eq!(40, arr.len());
 1203 |         assert_eq!(arr.data_type(), &DataType::Null);
 1204 | 
 1205 |         let arr =
 1206 |             read_array_w_params(&reader, &schema.fields[1], ReadBatchParams::RangeTo(..25)).await;
 1207 |         assert_eq!(25, arr.len());
 1208 |         assert_eq!(arr.data_type(), &DataType::Null);
 1209 | 
 1210 |         let arr = read_array_w_params(
 1211 |             &reader,
 1212 |             &schema.fields[1],
 1213 |             ReadBatchParams::Indices(UInt32Array::from(vec![1, 9, 30, 72])),
 1214 |         )
 1215 |         .await;
 1216 |         assert_eq!(4, arr.len());
 1217 |         assert_eq!(arr.data_type(), &DataType::Null);
 1218 | 
 1219 |         // raise error if take indices are out of bounds
 1220 |         let params = ReadBatchParams::Indices(UInt32Array::from(vec![1, 9, 30, 72, 100]));
 1221 |         let arr = read_array(
 1222 |             &reader,
 1223 |             &schema.fields[1],
 1224 |             0,
 1225 |             reader.page_table.as_ref(),
 1226 |             &params,
 1227 |         );
 1228 |         assert!(arr.await.is_err());
 1229 | 
 1230 |         // raise error if range indices are out of bounds
 1231 |         let params = ReadBatchParams::RangeTo(..107);
 1232 |         let arr = read_array(
 1233 |             &reader,
 1234 |             &schema.fields[1],
 1235 |             0,
 1236 |             reader.page_table.as_ref(),
 1237 |             &params,
 1238 |         );
 1239 |         assert!(arr.await.is_err());
 1240 |     }
 1241 | 
 1242 |     #[tokio::test]
 1243 |     async fn test_take_lists() {
 1244 |         let arrow_schema = ArrowSchema::new(vec![
 1245 |             ArrowField::new(
 1246 |                 "l",
 1247 |                 DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1248 |                 false,
 1249 |             ),
 1250 |             ArrowField::new(
 1251 |                 "ll",
 1252 |                 DataType::LargeList(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1253 |                 false,
 1254 |             ),
 1255 |         ]);
 1256 | 
 1257 |         let value_builder = Int32Builder::new();
 1258 |         let mut list_builder = ListBuilder::new(value_builder);
 1259 |         let ll_value_builder = Int32Builder::new();
 1260 |         let mut large_list_builder = LargeListBuilder::new(ll_value_builder);
 1261 |         for i in 0..100 {
 1262 |             list_builder.values().append_value(i);
 1263 |             large_list_builder.values().append_value(i);
 1264 |             if (i + 1) % 10 == 0 {
 1265 |                 list_builder.append(true);
 1266 |                 large_list_builder.append(true);
 1267 |             }
 1268 |         }
 1269 |         let list_arr = Arc::new(list_builder.finish());
 1270 |         let large_list_arr = Arc::new(large_list_builder.finish());
 1271 | 
 1272 |         let batch = RecordBatch::try_new(
 1273 |             Arc::new(arrow_schema.clone()),
 1274 |             vec![list_arr as ArrayRef, large_list_arr as ArrayRef],
 1275 |         )
 1276 |         .unwrap();
 1277 | 
 1278 |         // write to a lance file
 1279 |         let store = ObjectStore::memory();
 1280 |         let path = Path::from("/take_list");
 1281 |         let schema: Schema = (&arrow_schema).try_into().unwrap();
 1282 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1283 |             &store,
 1284 |             &path,
 1285 |             schema.clone(),
 1286 |             &Default::default(),
 1287 |         )
 1288 |         .await
 1289 |         .unwrap();
 1290 |         file_writer.write(&[batch]).await.unwrap();
 1291 |         file_writer.finish().await.unwrap();
 1292 | 
 1293 |         // read the file back
 1294 |         let reader = FileReader::try_new(&store, &path, schema.clone())
 1295 |             .await
 1296 |             .unwrap();
 1297 |         let actual = reader.take(&[1, 3, 5, 9], &schema).await.unwrap();
 1298 | 
 1299 |         let value_builder = Int32Builder::new();
 1300 |         let mut list_builder = ListBuilder::new(value_builder);
 1301 |         let ll_value_builder = Int32Builder::new();
 1302 |         let mut large_list_builder = LargeListBuilder::new(ll_value_builder);
 1303 |         for i in [1, 3, 5, 9] {
 1304 |             for j in 0..10 {
 1305 |                 list_builder.values().append_value(i * 10 + j);
 1306 |                 large_list_builder.values().append_value(i * 10 + j);
 1307 |             }
 1308 |             list_builder.append(true);
 1309 |             large_list_builder.append(true);
 1310 |         }
 1311 |         let expected_list = list_builder.finish();
 1312 |         let expected_large_list = large_list_builder.finish();
 1313 | 
 1314 |         assert_eq!(actual.column_by_name("l").unwrap().as_ref(), &expected_list);
 1315 |         assert_eq!(
 1316 |             actual.column_by_name("ll").unwrap().as_ref(),
 1317 |             &expected_large_list
 1318 |         );
 1319 |     }
 1320 | 
 1321 |     #[tokio::test]
 1322 |     async fn test_list_array_with_offsets() {
 1323 |         let arrow_schema = ArrowSchema::new(vec![
 1324 |             ArrowField::new(
 1325 |                 "l",
 1326 |                 DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1327 |                 false,
 1328 |             ),
 1329 |             ArrowField::new(
 1330 |                 "ll",
 1331 |                 DataType::LargeList(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1332 |                 false,
 1333 |             ),
 1334 |         ]);
 1335 | 
 1336 |         let store = ObjectStore::memory();
 1337 |         let path = Path::from("/lists");
 1338 | 
 1339 |         let list_array = ListArray::from_iter_primitive::<Int32Type, _, _>(vec![
 1340 |             Some(vec![Some(1), Some(2)]),
 1341 |             Some(vec![Some(3), Some(4)]),
 1342 |             Some((0..2_000).map(Some).collect::<Vec<_>>()),
 1343 |         ])
 1344 |         .slice(1, 1);
 1345 |         let large_list_array = LargeListArray::from_iter_primitive::<Int32Type, _, _>(vec![
 1346 |             Some(vec![Some(10), Some(11)]),
 1347 |             Some(vec![Some(12), Some(13)]),
 1348 |             Some((0..2_000).map(Some).collect::<Vec<_>>()),
 1349 |         ])
 1350 |         .slice(1, 1);
 1351 | 
 1352 |         let batch = RecordBatch::try_new(
 1353 |             Arc::new(arrow_schema.clone()),
 1354 |             vec![Arc::new(list_array), Arc::new(large_list_array)],
 1355 |         )
 1356 |         .unwrap();
 1357 | 
 1358 |         let schema: Schema = (&arrow_schema).try_into().unwrap();
 1359 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1360 |             &store,
 1361 |             &path,
 1362 |             schema.clone(),
 1363 |             &Default::default(),
 1364 |         )
 1365 |         .await
 1366 |         .unwrap();
 1367 |         file_writer
 1368 |             .write(std::slice::from_ref(&batch))
 1369 |             .await
 1370 |             .unwrap();
 1371 |         file_writer.finish().await.unwrap();
 1372 | 
 1373 |         // Make sure the big array was not written to the file
 1374 |         let file_size_bytes = store.size(&path).await.unwrap();
 1375 |         assert!(file_size_bytes < 1_000);
 1376 | 
 1377 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1378 |         let actual_batch = reader.read_batch(0, .., reader.schema()).await.unwrap();
 1379 |         assert_eq!(batch, actual_batch);
 1380 |     }
 1381 | 
 1382 |     #[tokio::test]
 1383 |     async fn test_read_ranges() {
 1384 |         // create a record batch with a null array column
 1385 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("i", DataType::Int64, false)]);
 1386 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1387 |         let columns: Vec<ArrayRef> = vec![Arc::new(Int64Array::from_iter_values(0..100))];
 1388 |         let batch = RecordBatch::try_new(Arc::new(arrow_schema), columns).unwrap();
 1389 | 
 1390 |         // write to a lance file
 1391 |         let store = ObjectStore::memory();
 1392 |         let path = Path::from("/read_range");
 1393 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1394 |             &store,
 1395 |             &path,
 1396 |             schema.clone(),
 1397 |             &Default::default(),
 1398 |         )
 1399 |         .await
 1400 |         .unwrap();
 1401 |         file_writer.write(&[batch]).await.unwrap();
 1402 |         file_writer.finish().await.unwrap();
 1403 | 
 1404 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1405 |         let actual_batch = reader.read_range(7..25, reader.schema()).await.unwrap();
 1406 | 
 1407 |         assert_eq!(
 1408 |             actual_batch.column_by_name("i").unwrap().as_ref(),
 1409 |             &Int64Array::from_iter_values(7..25)
 1410 |         );
 1411 |     }
 1412 | 
 1413 |     #[tokio::test]
 1414 |     async fn test_batches_stream() {
 1415 |         let store = ObjectStore::memory();
 1416 |         let path = Path::from("/batch_stream");
 1417 | 
 1418 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new("i", DataType::Int32, true)]);
 1419 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1420 |         let mut writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1421 |             &store,
 1422 |             &path,
 1423 |             schema.clone(),
 1424 |             &Default::default(),
 1425 |         )
 1426 |         .await
 1427 |         .unwrap();
 1428 |         for i in 0..10 {
 1429 |             let batch = RecordBatch::try_new(
 1430 |                 Arc::new(arrow_schema.clone()),
 1431 |                 vec![Arc::new(Int32Array::from_iter_values(i * 10..(i + 1) * 10))],
 1432 |             )
 1433 |             .unwrap();
 1434 |             writer.write(&[batch]).await.unwrap();
 1435 |         }
 1436 |         writer.finish().await.unwrap();
 1437 | 
 1438 |         let reader = FileReader::try_new(&store, &path, schema.clone())
 1439 |             .await
 1440 |             .unwrap();
 1441 |         let stream = batches_stream(reader, schema, |id| id % 2 == 0);
 1442 |         let batches = stream.try_collect::<Vec<_>>().await.unwrap();
 1443 | 
 1444 |         assert_eq!(batches.len(), 5);
 1445 |         for (i, batch) in batches.iter().enumerate() {
 1446 |             assert_eq!(
 1447 |                 batch,
 1448 |                 &RecordBatch::try_new(
 1449 |                     Arc::new(arrow_schema.clone()),
 1450 |                     vec![Arc::new(Int32Array::from_iter_values(
 1451 |                         i as i32 * 2 * 10..(i as i32 * 2 + 1) * 10
 1452 |                     ))],
 1453 |                 )
 1454 |                 .unwrap()
 1455 |             )
 1456 |         }
 1457 |     }
 1458 | 
 1459 |     #[tokio::test]
 1460 |     async fn test_take_boolean_beyond_chunk() {
 1461 |         let store = ObjectStore::from_uri_and_params(
 1462 |             Arc::new(Default::default()),
 1463 |             "memory://",
 1464 |             &ObjectStoreParams {
 1465 |                 block_size: Some(256),
 1466 |                 ..Default::default()
 1467 |             },
 1468 |         )
 1469 |         .await
 1470 |         .unwrap()
 1471 |         .0;
 1472 |         let path = Path::from("/take_bools");
 1473 | 
 1474 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
 1475 |             "b",
 1476 |             DataType::Boolean,
 1477 |             false,
 1478 |         )]));
 1479 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
 1480 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1481 |             &store,
 1482 |             &path,
 1483 |             schema.clone(),
 1484 |             &Default::default(),
 1485 |         )
 1486 |         .await
 1487 |         .unwrap();
 1488 | 
 1489 |         let array = BooleanArray::from((0..5000).map(|v| v % 5 == 0).collect::<Vec<_>>());
 1490 |         let batch =
 1491 |             RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(array.clone())]).unwrap();
 1492 |         file_writer.write(&[batch]).await.unwrap();
 1493 |         file_writer.finish().await.unwrap();
 1494 | 
 1495 |         let reader = FileReader::try_new(&store, &path, schema.clone())
 1496 |             .await
 1497 |             .unwrap();
 1498 |         let actual = reader.take(&[2, 4, 5, 8, 4555], &schema).await.unwrap();
 1499 | 
 1500 |         assert_eq!(
 1501 |             actual.column_by_name("b").unwrap().as_ref(),
 1502 |             &BooleanArray::from(vec![false, false, true, false, true])
 1503 |         );
 1504 |     }
 1505 | 
 1506 |     #[tokio::test]
 1507 |     async fn test_read_projection() {
 1508 |         // The dataset schema may be very large.  The file reader should support reading
 1509 |         // a small projection of that schema (this just tests the field_offset / num_fields
 1510 |         // parameters)
 1511 |         let store = ObjectStore::memory();
 1512 |         let path = Path::from("/partial_read");
 1513 | 
 1514 |         // Create a large schema
 1515 |         let mut fields = vec![];
 1516 |         for i in 0..100 {
 1517 |             fields.push(ArrowField::new(format!("f{}", i), DataType::Int32, false));
 1518 |         }
 1519 |         let arrow_schema = ArrowSchema::new(fields);
 1520 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1521 | 
 1522 |         let partial_schema = schema.project(&["f50"]).unwrap();
 1523 |         let partial_arrow: ArrowSchema = (&partial_schema).into();
 1524 | 
 1525 |         let mut file_writer = V1FileWriter::<NotSelfDescribing>::try_new(
 1526 |             &store,
 1527 |             &path,
 1528 |             partial_schema.clone(),
 1529 |             &Default::default(),
 1530 |         )
 1531 |         .await
 1532 |         .unwrap();
 1533 | 
 1534 |         let array = Int32Array::from(vec![0; 15]);
 1535 |         let batch =
 1536 |             RecordBatch::try_new(Arc::new(partial_arrow), vec![Arc::new(array.clone())]).unwrap();
 1537 |         file_writer
 1538 |             .write(std::slice::from_ref(&batch))
 1539 |             .await
 1540 |             .unwrap();
 1541 |         file_writer.finish().await.unwrap();
 1542 | 
 1543 |         let field_id = partial_schema.fields.first().unwrap().id;
 1544 |         let reader = FileReader::try_new_with_fragment_id(
 1545 |             &store,
 1546 |             &path,
 1547 |             schema.clone(),
 1548 |             0,
 1549 |             /*min_field_id=*/ field_id,
 1550 |             /*max_field_id=*/ field_id,
 1551 |             None,
 1552 |         )
 1553 |         .await
 1554 |         .unwrap();
 1555 |         let actual = reader
 1556 |             .read_batch(0, ReadBatchParams::RangeFull, &partial_schema)
 1557 |             .await
 1558 |             .unwrap();
 1559 | 
 1560 |         assert_eq!(actual, batch);
 1561 |     }
 1562 | }
``````
