> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v1/writer/mod.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `98ea565940fdda623b7b8321da3238c88f309c7c1c5076c4ad8448f3c063e0a1`. Reviewed physical lines: 1-1311.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-writer.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Frozen V1 writer and static schema-provider seam: owned writer/schema, nullability checks, batch/statistics mutation, recursive array page writes and ordered footer/shutdown. Includes seven active tests and test-only provider/statistics/whole-file helpers. (rust/lance-file/src/versions/v1/writer/mod.rs:1-1311)

## Complete range analysis

### Lines 1-34

SPDX header, private statistics child module and imports. Arrow arrays/builders/ArrayData support recursive writes and offset construction; async_recursion boxes recursion and async_trait implements the static manifest hook. Lance Schema/error, ObjectStore/Writer, legacy codecs/page tables/metadata and shared FileWriteSummary form the boundaries. No modern encoder, current-version strategy or feature/environment lookup is present. (rust/lance-file/src/versions/v1/writer/mod.rs:1-34)

### Lines 35-52

Public async_trait ManifestProvider declares static async store_schema(&mut dyn Writer,&Schema)->Result<Option<usize>>. It separates file storage from the table manifest type; docs require dictionaries already persisted and their schema offsets/lengths populated. The provider returns an optional position but this trait does not validate it or specify atomicity/cleanup. The documented table implementation uses a schema-only V1 Manifest and writes it through do_write_manifest, avoiding a second dictionary write (rust/lance-table/src/io/manifest.rs:232-250). (rust/lance-file/src/versions/v1/writer/mod.rs:35-52)

### Lines 53-65

Test-only pub(crate) empty NotSelfDescribing implements ManifestProvider and immediately returns Ok(None), without writing bytes. It is not a production export. Footer metadata serializes absence as zero through the existing metadata conversion; the reader requires an externally supplied schema in these fixtures. (rust/lance-file/src/versions/v1/writer/mod.rs:53-65)

### Lines 66-87

Public generic FileWriter requires M:ManifestProvider+Send+Sync and owns public Box<dyn Writer>, private Schema, signed next batch_id, PageTable, Metadata, optional StatisticsCollector and PhantomData<M>. The marker carries provider type without constructing provider state. No custom Drop, abort guard, closed flag or ownership-consuming finish exists. Replacing/writing the public object_writer can desynchronize existing tables/metadata. The ignored documentation example uses obsolete new/write(single batch)/shutdown syntax and missing awaits; actual API is try_new/write(slice)/finish. (rust/lance-file/src/versions/v1/writer/mod.rs:66-87)

### Lines 88-97

Public FileWriterOptions derives Debug/Clone/Default and has only collect_stats_for_fields:Option<Vec<i32>>. Default None requests all schema IDs that support statistics; Some(empty) disables the collector. Some(nonempty) is projected with include_all_children=true in the constructor, so requesting a struct parent can include descendants. No size/version/compression option or explicit unknown/duplicate/negative-ID validation exists here. (rust/lance-file/src/versions/v1/writer/mod.rs:88-97)

### Lines 98-108

Public async try_new creates the target writer before constructing Self. It owns the supplied Schema and borrows options. Store creation errors propagate; any later panic/construction failure has no local delete/abort handling. Publication, overwrite policy and backend durability belong to ObjectStore/Writer implementations, not this call. (rust/lance-file/src/versions/v1/writer/mod.rs:98-108)

### Lines 109-137

with_object_writer clones explicit stats IDs or obtains every schema field ID; nonempty IDs project a stats schema including descendants, then StatisticsCollector::try_new may still return None if no supported field exists. Empty IDs bypass projection/collector. It initializes next batch0 and default page table/metadata and retains schema/writer. No schema validation, dictionary hydration, counter limit or writer-position check occurs. Collector creation is Option, not a Result error (rust/lance-file/src/versions/v1/writer/statistics.rs:586-629); this local body always returns Ok after successful construction. (rust/lance-file/src/versions/v1/writer/mod.rs:109-137)

### Lines 138-158

schema returns a borrowed stored Schema. Private recursive verify_field_nullability rejects arr.null_count()>0 only when the corresponding stored Field is nonnullable, returning InvalidInput naming the field. It zips schema children with ArrayData child_data and recurses without applying an ancestor validity mask, slicing logical list children, checking child counts, or qualifying the name with ancestors. Extra children on either side are ignored by zip locally; earlier schema compatibility and Arrow construction supply other constraints. (rust/lance-file/src/versions/v1/writer/mod.rs:138-158)

### Lines 159-165

verify_nullability_constraints zips top-level batch columns and stored fields by position, converts each array to ArrayData, and propagates the first recursive nullability failure. It does not itself compare field count, name, type or order; public write performs schema compatibility first. (rust/lance-file/src/versions/v1/writer/mod.rs:159-165)

### Lines 166-188

write takes a slice of RecordBatch and returns success immediately for an empty slice: no schema validation, stats, bytes, flush or batch-ID change. Otherwise it validates every batch before mutating writer state: Arrow-to-Lance Schema conversion, check_compatible using default options except Ignore nullability, then actual stored-field null checks. Defaults ignore metadata, dictionary contents and field IDs, but require normal ordered field/name/logical-type compatibility; blob logical comparison retains its shared-child exception (rust/lance-core/src/datatypes/field.rs:83-103; rust/lance-core/src/datatypes/field.rs:423-440; rust/lance-core/src/datatypes/schema.rs:930-980). The comment assumes dictionary compatibility was checked elsewhere; this function neither checks nor unifies values. (rust/lance-file/src/versions/v1/writer/mod.rs:166-188)

### Lines 189-200

If a collector exists, fields_in_batches traverses scalar leaves of structs and appends one statistics row per matching field ID for the entire supplied slice. Statistics are mutated before any page writes and are not rolled back on later errors/cancellation. No stats row is collected for list descendants or other nested fields. Unsupported/missing builders are skipped; collection executes synchronously within the async write future. (rust/lance-file/src/versions/v1/writer/mod.rs:189-200)

### Lines 201-224

Clone top-level fields to avoid self borrowing, then process fields sequentially in schema order. For each field, resolve every batch column by name and collect borrowed ArrayRefs, with InvalidInput on a missing name. Call recursive write_array with the current batch_id and shared mutable page table; all supplied batches become one stored batch. There is no task spawn, field-level concurrency, transaction or rollback: earlier bytes/page entries/stats survive a later field error. (rust/lance-file/src/versions/v1/writer/mod.rs:201-224)

### Lines 225-237

After all fields succeed, cast each input row count to i32, sum unchecked, and push cumulative Metadata length. Flush underlying AsyncWrite before returning so in-flight requests keep being polled and do not time out while caller waits. Increment batch_id only after flush succeeds. A flush failure can therefore leave page entries/stats and cumulative row metadata advanced with batch_id unchanged; retry is not locally safe/idempotent. Casts, sums, cumulative offsets and batch increment have no checked overflow handling. Flush is not final shutdown/publication. (rust/lance-file/src/versions/v1/writer/mod.rs:225-237)

### Lines 238-254

add_metadata inserts owned key/value strings into stored schema metadata, replacing duplicate keys. finish_with_metadata clones/extends every provided entry (caller entries win), then invokes finish. Neither enforces a before-finish state, validates reserved keys, changes data pages, or restores metadata on finalization failure. (rust/lance-file/src/versions/v1/writer/mod.rs:238-254)

### Lines 255-272

finish borrows self mutably, writes footer, then explicitly calls Writer::shutdown on the inner writer. Its authoritative size comes from shutdown WriteResult, not tell after shutdown; it discards other WriteResult identity metadata. Row count is last signed cumulative offset or0, cast to u64. No closed marker, repeated-finish guard, automatic abort/delete, idempotent retry or Drop finalization is provided. A footer error skips shutdown; shutdown error returns failure after footer mutation/writes. (rust/lance-file/src/versions/v1/writer/mod.rs:255-272)

### Lines 273-291

len delegates Metadata::len (last cumulative offset cast to usize); is_empty is len()==0 and may be true after a zero-row stored batch. tell forwards the mutable underlying Writer cursor/error, not a durability guarantee. next_batch_id returns signed counter incremented only after successful flush. These accessors do not establish a finished state or validate overflows. (rust/lance-file/src/versions/v1/writer/mod.rs:273-291)

### Lines 292-334

Private boxed-recursive write_array asserts a nonempty array slice, dispatches on the first actual array DataType and collects dyn Array references. Null routes to payload-free page metadata, fixed-stride types to Plain, then binary-like types to VarBinary. The Arrow predicate includes Utf8View/BinaryView while BinaryEncoder supports only the four offset-based types; reaching that adapter with views is not implicit conversion (rust/lance-arrow/src/lib.rs:99-137; rust/lance-file/src/versions/v1/encoding/binary.rs:91-105). No mixed-array type preflight is local. (rust/lance-file/src/versions/v1/writer/mod.rs:292-334)

### Lines 335-366

Dictionary dispatch writes keys using the first array key type. Struct converts every array through the asserting cast helper then recursively writes child fields. Explicit FixedSizeList/FixedSizeBinary branches duplicate the earlier fixed-stride predicate and are not reached for those types under the current predicate; they do not provide broader element support. (rust/lance-file/src/versions/v1/writer/mod.rs:335-366)

### Lines 367-392

List and LargeList route to respective i32/i64 offset writers; unmatched types return Schema error naming the actual type. This differs from reader unsupported-type panic. Dispatch is based on actual array type, with encoding tags asserted later in adapters; no compression strategy or version choice is negotiated here. (rust/lance-file/src/versions/v1/writer/mod.rs:367-392)

### Lines 393-405

write_null_array sums lengths through i32 casts, awaits tell and records PageInfo at current position with logical row count, then returns. It writes no payload and does not inspect field.encoding or validity. Position may be shared with another page; table entry is enough for Null reconstruction. No checked count conversion. (rust/lance-file/src/versions/v1/writer/mod.rs:393-405)

### Lines 406-425

write_fixed_stride_array asserts field.encoding==Some(Plain) and nonempty arrays, then PlainEncoder using first actual DataType. Only after encode success does it sum i32 logical row lengths and set/overwrite (field.id,batch_id) PageInfo with returned offset. The length is elements, not bytes; encoding failure may already have written bytes without a page entry. No separate validity buffer is written by this adapter. (rust/lance-file/src/versions/v1/writer/mod.rs:406-425)

### Lines 426-442

write_binary_array asserts VarBinary, invokes BinaryEncoder and records returned position plus summed i32 logical element count. Binary returned position points to absolute i64 offsets after value bytes, not the beginning of payload. This wrapper performs no validity write, mixed-type check, row limit check or rollback. (rust/lance-file/src/versions/v1/writer/mod.rs:426-442)

### Lines 443-461

write_dictionary_arr asserts Dictionary, encodes keys only via DictionaryEncoder with supplied key DataType and stores key-byte offset plus logical key count. Dictionary values are not pulled from batches, compared, merged or stored here; footer uses the separate stored schema dictionaries. A missing or stale schema dictionary can therefore fail at finalization or disagree with already emitted keys. (rust/lance-file/src/versions/v1/writer/mod.rs:443-461)

### Lines 462-490

write_struct_array asserts every StructArray has exactly field.children.len columns, then walks child schema order. Resolve each batch child by name, return Schema error with child name and actual struct DataType if absent, and recursively write collected child arrays sequentially. No parent page or struct-parent validity is persisted; child bytes can precede a later error. Async recursion boxes nested calls, without spawning tasks. (rust/lance-file/src/versions/v1/writer/mod.rs:462-490)

### Lines 491-524

write_list_array allocates an i32 positions builder with capacity equal to total logical rows (although it appends rows+1 positions), a retained Vec of sliced child arrays and initial0. For every list, assert offsets nonempty; slice child values from first through final offset, normalize each subsequent offset by subtracting that list start and adding accumulated last_offset, then append via unchecked i32 casts. It ignores list validity and keeps every child value in the selected span, including storage behind null lists. Arithmetic and offset/index conversions are unchecked; sliced tails outside the selected span are not encoded. (rust/lance-file/src/versions/v1/writer/mod.rs:491-524)

### Lines 525-538

Write normalized positions first through the Plain adapter using the list parent Field, so that parent page length is total list rows+1. Then gather retained child slices and recursively write children[0] at the same batch ID. Missing child panics at indexing; a child failure can leave parent position bytes/table entry. No separate list validity, child-name metadata rewrite or parent null mask is persisted. (rust/lance-file/src/versions/v1/writer/mod.rs:525-538)

### Lines 539-573

write_large_list_array mirrors List with an Int64 positions builder and unchecked i64 casts, but uses usize start/end/accumulation internally. Initial0 plus normalized per-array offsets concatenate logical lists and selected child spans. No list validity or offset-overflow validation; builder capacity again omits the terminal extra slot. (rust/lance-file/src/versions/v1/writer/mod.rs:539-573)

### Lines 574-587

LargeList writes the i64 parent positions page first, gathers retained values, then recursively writes the first schema child at the same batch ID. Its parent page length includes terminal offset. Error/cancellation after positions has no local undo; zero logical rows still have one position if the outer supplied batch slice is nonempty. (rust/lance-file/src/versions/v1/writer/mod.rs:574-587)

### Lines 588-625

write_statistics mutably finishes the optional collector. A nonempty successful stats batch has a debug-only row-count equality with next_batch_id; convert its Arrow schema to fresh Lance Schema and call schema.field_ids for leaf_field_ids despite that accessor including all preorder IDs, including struct roots (rust/lance-core/src/datatypes/schema.rs:600-604). Write each stats root recursively at batch0 using a separate page table, then serialize that table from field ID0. Return schema, all IDs and table offset. Propagate collector/write errors; absent collector or zero stats rows yields None. Collector builders are finished before these writes, so a later failure does not preserve unconsumed stats for retry (rust/lance-file/src/versions/v1/writer/statistics.rs:635-670). (rust/lance-file/src/versions/v1/writer/mod.rs:588-625)

### Lines 626-638

write_footer first unwraps minimum ID across all stored schema fields, including parents, then serializes the ordinary page table and stores its position. Empty schema panics before page-table write; nonempty schema without any page entries gets the page-table empty InvalidInput (rust/lance-file/src/versions/v1/page_table.rs:94-113). Next write statistics and replace stats_metadata. No staging/footer commit marker or rollback is installed. (rust/lance-file/src/versions/v1/writer/mod.rs:626-638)

### Lines 639-653

Footer then persists stored schema dictionary values, mutating offsets/lengths, calls static M::store_schema and records its optional position, writes framed Metadata, and emits metadata position plus shared major0/minor2/LANC tail. Provider offsets are trusted, and provider errors occur after previous data/table/stats/dictionary side effects. WriteExt framing is u32 LE size then protobuf; tail is i64 LE position, i16 LE major/minor and magic bytes (rust/lance-io/src/traits.rs:83-106; rust/lance-file/src/format.rs:30-33). No alignment padding or v2 footer is added here. End of generic implementation. (rust/lance-file/src/versions/v1/writer/mod.rs:639-653)

### Lines 654-671

Private fields_in_batches requires a nonempty batch slice (indexes batches[0]) and initially pairs schema roots with per-position arrays across all batches using zip. It allocates a Vec of borrowed arrays per visited field; mismatched count/order is not checked locally. Public write validates first and returns early on empty input. (rust/lance-file/src/versions/v1/writer/mod.rs:654-671)

### Lines 672-693

Iterator uses a LIFO work stack: roots are initially pushed in forward order, then popped in reverse; structs push children in forward order and likewise visit reverse. Struct nodes themselves are not emitted. Other nested types are skipped entirely, including their descendants; scalar leaves return field plus array references. Traversal does not combine ancestor null masks with child validity, and collection order differs from the collector BTreeMap output ordering. (rust/lance-file/src/versions/v1/writer/mod.rs:672-693)

### Lines 694-714

Test-only module imports Arrow temporal/decimal/dictionary/nested arrays, timezone types, concat, Arc and the V1 FileReader. Seven active Tokio tests and local fixture helpers follow; no source test is executed by this knowledge-base analysis. (rust/lance-file/src/versions/v1/writer/mod.rs:694-714)

### Lines 715-792

test_write_file builds a 19-root Arrow schema covering Null, Boolean, Int64, Float32, Utf8, Decimal128/256(7,3), four Duration units, UInt32-key UTF8 dictionary, FixedSizeList<Float32,16>, FixedSizeBinary8, List/LargeList<UTF8>, List/LargeList<dictionary>, and Struct<Int64,UTF8>. Nullability varies but no non-Null-type null entries are constructed later. The schema is explicitly supplied on read, so this is not self-describing discovery coverage. (rust/lance-file/src/versions/v1/writer/mod.rs:715-792)

### Lines 793-832

Broad roundtrip fixture creates 100 dictionary values cycling a/b/c, a 1600-value Float32 buffer grouped16, 800 bytes all123 grouped8, and 100 two-element lists with 200 string/dictionary children for each offset width. Values are nonnull and list offsets start0; it does not exercise sliced/null lists or changed dictionaries across batches. (rust/lance-file/src/versions/v1/writer/mod.rs:793-832)

### Lines 833-879

The 19 columns each have100 rows: Null length100; Boolean mod3; Int64/Float32 and decimal values0..99; decimal precision7/scale3; Duration values0..99; prepared dictionary/fixed/list arrays; and a struct whose Int64 child is100..199 and string child0..99. RecordBatch construction unwraps Arrow validation. These exact values/types form the equality oracle rather than a performance measurement. (rust/lance-file/src/versions/v1/writer/mod.rs:833-879)

### Lines 880-902

Attach dictionary values into the Lance schema before constructing NotSelfDescribing memory writer; write one batch, finish, reopen with original hydrated schema and compare complete batch equality. No shutdown size, schema-only manifest, IO count, cancellation or failed-write assertion is made. (rust/lance-file/src/versions/v1/writer/mod.rs:880-902)

### Lines 903-939

Dictionary-first-field fixture puts a UInt32/UTF8 dictionary in sole column d with100 cyclic a/b/c values, preloads schema dictionary, writes/finishes and reopens using that schema. Exact equality covers dictionary at field0, not remapping, evolving dictionary contents, null keys or dictionary hydration from file. (rust/lance-file/src/versions/v1/writer/mod.rs:903-939)

### Lines 940-984

Temporal fixture writes two rows of TimestampSecond without timezone [11111111,22222222] and TimestampMicrosecond with America/Los_Angeles [3333333,4444444]. Reopen with supplied schema and assert whole-batch equality. It proves those metadata/unit/value combinations only, not timezone conversion or all temporal types. (rust/lance-file/src/versions/v1/writer/mod.rs:940-984)

### Lines 985-1015

Empty nonnullable UTF8 fixture writes a nonempty outer slice containing a zero-row RecordBatch, finishes, asserts summary.num_rows==0, reopens batch0 and asserts zero rows. It does not test write(&[]), finishing before any write, empty schema, size bytes or the number of stored batches. This differs from the empty-slice no-op. (rust/lance-file/src/versions/v1/writer/mod.rs:985-1015)

### Lines 1016-1053

Statistics fixture declares Int64 i/i2, List<Int32> l, and struct s(si:Int64,sb:UTF8), then explicitly selects IDs[0,1,5,6]. Its comments claim requested-only, struct traversal and list omission coverage, but no supported scalar is omitted from the request and the list itself is not requested; it does not isolate all those policies. (rust/lance-file/src/versions/v1/writer/mod.rs:1016-1053)

### Lines 1054-1102

Write two separate stored batches. First has3 rows: i=[1,2,3],i2=[4,5,6], list[1,2,3]/[4,5]/[],si=[1,2,3],sb=[a,b,c]. Second has2 rows: i=[5,6],i2=[10,11], list[1,2,3]/[],si=[4,5],sb=[d,e]. All statistics-target values are nonnull; empty lists are present but not statistics targets. (rust/lance-file/src/versions/v1/writer/mod.rs:1054-1102)

### Lines 1103-1151

Finish and read stats for the same four IDs; require Some and exact schema equality with Int64 fields0/1/5 and Utf8 field6. Assert two-row stats: null counts all0; minima [1,5],[4,10],[1,4],[a,d]; maxima [3,6],[6,11],[3,5],[c,e]. The linked FIXME says maxima should not be incremented, but actual expected UTF8 maxima equal observed maxima c/e; do not infer incremented output from that stale comment. (rust/lance-file/src/versions/v1/writer/mod.rs:1103-1151)

### Lines 1152-1172

stats_schema helper creates one nonnullable Struct root per input (field_id, DataType) pair, named by that decimal field ID, with nonnullable Int64 null_count and nullable min_value/max_value using supplied DataType. It preserves caller field iteration order and supplies no root metadata. (rust/lance-file/src/versions/v1/writer/mod.rs:1152-1172)

### Lines 1173-1207

Private test Stats stores field_id, null-count Vec and min/max ArrayRefs. stats_batch derives root types from minima, builds child fields matching stats_schema, clones count values and array Arcs, creates all-valid structs, then unwraps RecordBatch construction. It performs no independent max-type or length validation before Arrow constructors. (rust/lance-file/src/versions/v1/writer/mod.rs:1173-1207)

### Lines 1208-1228

read_file_as_one_batch opens with supplied Schema, reads all stored batches sequentially, retains them all in Vec and concatenates using reader schema. Unwraps every step; this is a test convenience, not a streaming production path or memory bound. (rust/lance-file/src/versions/v1/writer/mod.rs:1208-1228)

### Lines 1229-1265

Shared-buffer test slices one Int32 array0..1000 into250 four-row writes, finishes and asserts object size strictly below16000 bytes. Read all batches via helper and compare column i exactly to original array. This catches repeated whole-buffer storage for this scalar case; it does not assert exact file size, request count, memory usage, null handling or zero-copy execution. (rust/lance-file/src/versions/v1/writer/mod.rs:1229-1265)

### Lines 1266-1295

Schema-hole fixture constructs two Int32 fields explicitly assigned IDs0 and2, with missing1, and ten-row arrays a=0..9,b=10..19. Arrow batch schema names/types match while Arrow conversion may assign different IDs; the public writer default comparison ignores field IDs. (rust/lance-file/src/versions/v1/writer/mod.rs:1266-1295)

### Lines 1296-1311

Write and finish the hole fixture, move out in-memory page_table, and assert entries(0,0) and(2,0) exist. No reopen, disk page-table decode, missing-ID1 assertion or full data equality is made here; serialized hole representation is covered separately by page-table tests. End of tests and file. (rust/lance-file/src/versions/v1/writer/mod.rs:1296-1311)

## Interaction and interpretation limits

All 1311 physical lines were read in five complete bounded source outputs during ANALYZE63. No source code, tests, benchmarks, fixture generators, build/lint/install commands or internet were executed. Writer/statistics.rs is now fully analyzed in its own L2 and L1 supplement; all2249 lines and fourteen test entry points are covered. Contextual Dataset adapter/open, Arrow predicates and IO framing establish local calls only; full Dataset/backend lifecycle remains pending. Source-derived partial-write, overflow, parent-validity and repeated-finish risks were not runtime-reproduced. Preserve frozen legacy behavior and implement new capabilities in current-format paths (AGENTS.md:13-18).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | mod statistics;
    5 | 
    6 | use std::collections::HashMap;
    7 | use std::marker::PhantomData;
    8 | 
    9 | use arrow_array::builder::{ArrayBuilder, PrimitiveBuilder};
   10 | use arrow_array::cast::{as_large_list_array, as_list_array, as_struct_array};
   11 | use arrow_array::types::{Int32Type, Int64Type};
   12 | use arrow_array::{Array, ArrayRef, RecordBatch, StructArray};
   13 | use arrow_buffer::ArrowNativeType;
   14 | use arrow_data::ArrayData;
   15 | use arrow_schema::DataType;
   16 | use async_recursion::async_recursion;
   17 | use async_trait::async_trait;
   18 | use lance_arrow::*;
   19 | use lance_core::datatypes::{Encoding, Field, NullabilityComparison, Schema, SchemaCompareOptions};
   20 | use lance_core::{Error, Result};
   21 | use lance_io::object_store::ObjectStore;
   22 | use lance_io::traits::{WriteExt, Writer};
   23 | use object_store::path::Path;
   24 | use tokio::io::AsyncWriteExt;
   25 | 
   26 | use crate::format::{MAGIC, MAJOR_VERSION, MINOR_VERSION};
   27 | use crate::versions::v1::encoding::{
   28 |     binary::BinaryEncoder, dictionary::DictionaryEncoder, plain::PlainEncoder,
   29 |     write_schema_dictionaries,
   30 | };
   31 | use crate::versions::v1::format::metadata::{Metadata, StatisticsMetadata};
   32 | use crate::versions::v1::page_table::{PageInfo, PageTable};
   33 | use crate::writer::FileWriteSummary;
   34 | 
   35 | /// The file format currently includes a "manifest" where it stores the schema for
   36 | /// self-describing files.  Historically this has been a table format manifest that
   37 | /// is empty except for the schema field.
   38 | ///
   39 | /// Since this crate is not aware of the table format we need this to be provided
   40 | /// externally.  You should always use lance_table::io::manifest::ManifestDescribing
   41 | /// for this today.
   42 | #[async_trait]
   43 | pub trait ManifestProvider {
   44 |     /// Store the schema in the file
   45 |     ///
   46 |     /// This should just require writing the schema (or a manifest wrapper) as a proto struct
   47 |     ///
   48 |     /// Note: the dictionaries have already been written by this point and the schema should
   49 |     /// be populated with the dictionary lengths/offsets
   50 |     async fn store_schema(object_writer: &mut dyn Writer, schema: &Schema)
   51 |     -> Result<Option<usize>>;
   52 | }
   53 | 
   54 | /// Implementation of ManifestProvider that does not store the schema
   55 | #[cfg(test)]
   56 | pub(crate) struct NotSelfDescribing {}
   57 | 
   58 | #[cfg(test)]
   59 | #[async_trait]
   60 | impl ManifestProvider for NotSelfDescribing {
   61 |     async fn store_schema(_: &mut dyn Writer, _: &Schema) -> Result<Option<usize>> {
   62 |         Ok(None)
   63 |     }
   64 | }
   65 | 
   66 | /// [FileWriter] writes Arrow [RecordBatch] to one Lance file.
   67 | ///
   68 | /// ```ignored
   69 | /// use lance::io::FileWriter;
   70 | /// use futures::stream::Stream;
   71 | ///
   72 | /// let mut file_writer = FileWriter::new(object_store, &path, &schema);
   73 | /// while let Ok(batch) = stream.next().await {
   74 | ///     file_writer.write(&batch).unwrap();
   75 | /// }
   76 | /// // Need to close file writer to flush buffer and footer.
   77 | /// file_writer.shutdown();
   78 | /// ```
   79 | pub struct FileWriter<M: ManifestProvider + Send + Sync> {
   80 |     pub object_writer: Box<dyn Writer>,
   81 |     schema: Schema,
   82 |     batch_id: i32,
   83 |     page_table: PageTable,
   84 |     metadata: Metadata,
   85 |     stats_collector: Option<statistics::StatisticsCollector>,
   86 |     manifest_provider: PhantomData<M>,
   87 | }
   88 | 
   89 | #[derive(Debug, Clone, Default)]
   90 | pub struct FileWriterOptions {
   91 |     /// The field ids to collect statistics for.
   92 |     ///
   93 |     /// If None, will collect for all fields in the schema (that support stats).
   94 |     /// If an empty vector, will not collect any statistics.
   95 |     pub collect_stats_for_fields: Option<Vec<i32>>,
   96 | }
   97 | 
   98 | impl<M: ManifestProvider + Send + Sync> FileWriter<M> {
   99 |     pub async fn try_new(
  100 |         object_store: &ObjectStore,
  101 |         path: &Path,
  102 |         schema: Schema,
  103 |         options: &FileWriterOptions,
  104 |     ) -> Result<Self> {
  105 |         let object_writer = object_store.create(path).await?;
  106 |         Self::with_object_writer(object_writer, schema, options)
  107 |     }
  108 | 
  109 |     pub fn with_object_writer(
  110 |         object_writer: Box<dyn Writer>,
  111 |         schema: Schema,
  112 |         options: &FileWriterOptions,
  113 |     ) -> Result<Self> {
  114 |         let collect_stats_for_fields = if let Some(stats_fields) = &options.collect_stats_for_fields
  115 |         {
  116 |             stats_fields.clone()
  117 |         } else {
  118 |             schema.field_ids()
  119 |         };
  120 | 
  121 |         let stats_collector = if !collect_stats_for_fields.is_empty() {
  122 |             let stats_schema = schema.project_by_ids(&collect_stats_for_fields, true);
  123 |             statistics::StatisticsCollector::try_new(&stats_schema)
  124 |         } else {
  125 |             None
  126 |         };
  127 | 
  128 |         Ok(Self {
  129 |             object_writer,
  130 |             schema,
  131 |             batch_id: 0,
  132 |             page_table: PageTable::default(),
  133 |             metadata: Metadata::default(),
  134 |             stats_collector,
  135 |             manifest_provider: PhantomData,
  136 |         })
  137 |     }
  138 | 
  139 |     /// Return the schema of the file writer.
  140 |     pub fn schema(&self) -> &Schema {
  141 |         &self.schema
  142 |     }
  143 | 
  144 |     fn verify_field_nullability(arr: &ArrayData, field: &Field) -> Result<()> {
  145 |         if !field.nullable && arr.null_count() > 0 {
  146 |             return Err(Error::invalid_input(format!(
  147 |                 "The field `{}` contained null values even though the field is marked non-null in the schema",
  148 |                 field.name
  149 |             )));
  150 |         }
  151 | 
  152 |         for (child_field, child_arr) in field.children.iter().zip(arr.child_data()) {
  153 |             Self::verify_field_nullability(child_arr, child_field)?;
  154 |         }
  155 | 
  156 |         Ok(())
  157 |     }
  158 | 
  159 |     fn verify_nullability_constraints(&self, batch: &RecordBatch) -> Result<()> {
  160 |         for (col, field) in batch.columns().iter().zip(self.schema.fields.iter()) {
  161 |             Self::verify_field_nullability(&col.to_data(), field)?;
  162 |         }
  163 |         Ok(())
  164 |     }
  165 | 
  166 |     /// Write a [RecordBatch] to the open file.
  167 |     /// All RecordBatch will be treated as one RecordBatch on disk
  168 |     ///
  169 |     /// Returns [Err] if the schema does not match with the batch.
  170 |     pub async fn write(&mut self, batches: &[RecordBatch]) -> Result<()> {
  171 |         if batches.is_empty() {
  172 |             return Ok(());
  173 |         }
  174 | 
  175 |         for batch in batches {
  176 |             // Compare, ignore metadata and dictionary
  177 |             //   dictionary should have been checked earlier and could be an expensive check
  178 |             let schema = Schema::try_from(batch.schema().as_ref())?;
  179 |             schema.check_compatible(
  180 |                 &self.schema,
  181 |                 &SchemaCompareOptions {
  182 |                     compare_nullability: NullabilityComparison::Ignore,
  183 |                     ..Default::default()
  184 |                 },
  185 |             )?;
  186 |             self.verify_nullability_constraints(batch)?;
  187 |         }
  188 | 
  189 |         // If we are collecting stats for this column, collect them.
  190 |         // Statistics need to traverse nested arrays, so it's a separate loop
  191 |         // from writing which is done on top-level arrays.
  192 |         if let Some(stats_collector) = &mut self.stats_collector {
  193 |             for (field, arrays) in fields_in_batches(batches, &self.schema) {
  194 |                 if let Some(stats_builder) = stats_collector.get_builder(field.id) {
  195 |                     let stats_row = statistics::collect_statistics(&arrays);
  196 |                     stats_builder.append(stats_row);
  197 |                 }
  198 |             }
  199 |         }
  200 | 
  201 |         // Copy a list of fields to avoid borrow checker error.
  202 |         let fields = self.schema.fields.clone();
  203 |         for field in fields.iter() {
  204 |             let arrs = batches
  205 |                 .iter()
  206 |                 .map(|batch| {
  207 |                     batch.column_by_name(&field.name).ok_or_else(|| {
  208 |                         Error::invalid_input(format!(
  209 |                             "FileWriter::write: Field '{}' not found",
  210 |                             field.name
  211 |                         ))
  212 |                     })
  213 |                 })
  214 |                 .collect::<Result<Vec<_>>>()?;
  215 | 
  216 |             Self::write_array(
  217 |                 self.object_writer.as_mut(),
  218 |                 field,
  219 |                 &arrs,
  220 |                 self.batch_id,
  221 |                 &mut self.page_table,
  222 |             )
  223 |             .await?;
  224 |         }
  225 |         let batch_length = batches.iter().map(|b| b.num_rows() as i32).sum();
  226 |         self.metadata.push_batch_length(batch_length);
  227 | 
  228 |         // It's imperative we complete any in-flight requests, since we are
  229 |         // returning control to the caller. If the caller takes a long time to
  230 |         // write the next batch, the in-flight requests will not be polled and
  231 |         // may time out.
  232 |         self.object_writer.flush().await?;
  233 | 
  234 |         self.batch_id += 1;
  235 |         Ok(())
  236 |     }
  237 | 
  238 |     /// Add schema metadata, as (key, value) pair to the file.
  239 |     pub fn add_metadata(&mut self, key: &str, value: &str) {
  240 |         self.schema
  241 |             .metadata
  242 |             .insert(key.to_string(), value.to_string());
  243 |     }
  244 | 
  245 |     pub async fn finish_with_metadata(
  246 |         &mut self,
  247 |         metadata: &HashMap<String, String>,
  248 |     ) -> Result<FileWriteSummary> {
  249 |         self.schema
  250 |             .metadata
  251 |             .extend(metadata.iter().map(|(k, y)| (k.clone(), y.clone())));
  252 |         self.finish().await
  253 |     }
  254 | 
  255 |     pub async fn finish(&mut self) -> Result<FileWriteSummary> {
  256 |         self.write_footer().await?;
  257 |         // `shutdown` flushes the footer and reports the authoritative on-disk
  258 |         // byte count, so the size is sourced here instead of via a later
  259 |         // `tell()` that would rely on the cursor surviving shutdown.
  260 |         let write_result = Writer::shutdown(self.object_writer.as_mut()).await?;
  261 |         let num_rows = self
  262 |             .metadata
  263 |             .batch_offsets
  264 |             .last()
  265 |             .cloned()
  266 |             .unwrap_or_default();
  267 |         Ok(FileWriteSummary {
  268 |             num_rows: num_rows as u64,
  269 |             size_bytes: write_result.size as u64,
  270 |         })
  271 |     }
  272 | 
  273 |     /// Total records written in this file.
  274 |     pub fn len(&self) -> usize {
  275 |         self.metadata.len()
  276 |     }
  277 | 
  278 |     /// Total bytes written so far
  279 |     pub async fn tell(&mut self) -> Result<usize> {
  280 |         self.object_writer.tell().await
  281 |     }
  282 | 
  283 |     /// Return the id of the next batch to be written.
  284 |     pub fn next_batch_id(&self) -> i32 {
  285 |         self.batch_id
  286 |     }
  287 | 
  288 |     pub fn is_empty(&self) -> bool {
  289 |         self.len() == 0
  290 |     }
  291 | 
  292 |     #[async_recursion]
  293 |     async fn write_array(
  294 |         object_writer: &mut dyn Writer,
  295 |         field: &Field,
  296 |         arrs: &[&ArrayRef],
  297 |         batch_id: i32,
  298 |         page_table: &mut PageTable,
  299 |     ) -> Result<()> {
  300 |         assert!(!arrs.is_empty());
  301 |         let data_type = arrs[0].data_type();
  302 |         let arrs_ref = arrs.iter().map(|a| a.as_ref()).collect::<Vec<_>>();
  303 | 
  304 |         match data_type {
  305 |             DataType::Null => {
  306 |                 Self::write_null_array(
  307 |                     object_writer,
  308 |                     field,
  309 |                     arrs_ref.as_slice(),
  310 |                     batch_id,
  311 |                     page_table,
  312 |                 )
  313 |                 .await
  314 |             }
  315 |             dt if dt.is_fixed_stride() => {
  316 |                 Self::write_fixed_stride_array(
  317 |                     object_writer,
  318 |                     field,
  319 |                     arrs_ref.as_slice(),
  320 |                     batch_id,
  321 |                     page_table,
  322 |                 )
  323 |                 .await
  324 |             }
  325 |             dt if dt.is_binary_like() => {
  326 |                 Self::write_binary_array(
  327 |                     object_writer,
  328 |                     field,
  329 |                     arrs_ref.as_slice(),
  330 |                     batch_id,
  331 |                     page_table,
  332 |                 )
  333 |                 .await
  334 |             }
  335 |             DataType::Dictionary(key_type, _) => {
  336 |                 Self::write_dictionary_arr(
  337 |                     object_writer,
  338 |                     field,
  339 |                     arrs_ref.as_slice(),
  340 |                     key_type,
  341 |                     batch_id,
  342 |                     page_table,
  343 |                 )
  344 |                 .await
  345 |             }
  346 |             dt if dt.is_struct() => {
  347 |                 let struct_arrays = arrs.iter().map(|a| as_struct_array(a)).collect::<Vec<_>>();
  348 |                 Self::write_struct_array(
  349 |                     object_writer,
  350 |                     field,
  351 |                     struct_arrays.as_slice(),
  352 |                     batch_id,
  353 |                     page_table,
  354 |                 )
  355 |                 .await
  356 |             }
  357 |             DataType::FixedSizeList(_, _) | DataType::FixedSizeBinary(_) => {
  358 |                 Self::write_fixed_stride_array(
  359 |                     object_writer,
  360 |                     field,
  361 |                     arrs_ref.as_slice(),
  362 |                     batch_id,
  363 |                     page_table,
  364 |                 )
  365 |                 .await
  366 |             }
  367 |             DataType::List(_) => {
  368 |                 Self::write_list_array(
  369 |                     object_writer,
  370 |                     field,
  371 |                     arrs_ref.as_slice(),
  372 |                     batch_id,
  373 |                     page_table,
  374 |                 )
  375 |                 .await
  376 |             }
  377 |             DataType::LargeList(_) => {
  378 |                 Self::write_large_list_array(
  379 |                     object_writer,
  380 |                     field,
  381 |                     arrs_ref.as_slice(),
  382 |                     batch_id,
  383 |                     page_table,
  384 |                 )
  385 |                 .await
  386 |             }
  387 |             _ => Err(Error::schema(format!(
  388 |                 "FileWriter::write: unsupported data type: {data_type}"
  389 |             ))),
  390 |         }
  391 |     }
  392 | 
  393 |     async fn write_null_array(
  394 |         object_writer: &mut dyn Writer,
  395 |         field: &Field,
  396 |         arrs: &[&dyn Array],
  397 |         batch_id: i32,
  398 |         page_table: &mut PageTable,
  399 |     ) -> Result<()> {
  400 |         let arrs_length: i32 = arrs.iter().map(|a| a.len() as i32).sum();
  401 |         let page_info = PageInfo::new(object_writer.tell().await?, arrs_length as usize);
  402 |         page_table.set(field.id, batch_id, page_info);
  403 |         Ok(())
  404 |     }
  405 | 
  406 |     /// Write fixed size array, including, primtiives, fixed size binary, and fixed size list.
  407 |     async fn write_fixed_stride_array(
  408 |         object_writer: &mut dyn Writer,
  409 |         field: &Field,
  410 |         arrs: &[&dyn Array],
  411 |         batch_id: i32,
  412 |         page_table: &mut PageTable,
  413 |     ) -> Result<()> {
  414 |         assert_eq!(field.encoding, Some(Encoding::Plain));
  415 |         assert!(!arrs.is_empty());
  416 |         let data_type = arrs[0].data_type();
  417 | 
  418 |         let mut encoder = PlainEncoder::new(object_writer, data_type);
  419 |         let pos = encoder.encode(arrs).await?;
  420 |         let arrs_length: i32 = arrs.iter().map(|a| a.len() as i32).sum();
  421 |         let page_info = PageInfo::new(pos, arrs_length as usize);
  422 |         page_table.set(field.id, batch_id, page_info);
  423 |         Ok(())
  424 |     }
  425 | 
  426 |     /// Write var-length binary arrays.
  427 |     async fn write_binary_array(
  428 |         object_writer: &mut dyn Writer,
  429 |         field: &Field,
  430 |         arrs: &[&dyn Array],
  431 |         batch_id: i32,
  432 |         page_table: &mut PageTable,
  433 |     ) -> Result<()> {
  434 |         assert_eq!(field.encoding, Some(Encoding::VarBinary));
  435 |         let mut encoder = BinaryEncoder::new(object_writer);
  436 |         let pos = encoder.encode(arrs).await?;
  437 |         let arrs_length: i32 = arrs.iter().map(|a| a.len() as i32).sum();
  438 |         let page_info = PageInfo::new(pos, arrs_length as usize);
  439 |         page_table.set(field.id, batch_id, page_info);
  440 |         Ok(())
  441 |     }
  442 | 
  443 |     async fn write_dictionary_arr(
  444 |         object_writer: &mut dyn Writer,
  445 |         field: &Field,
  446 |         arrs: &[&dyn Array],
  447 |         key_type: &DataType,
  448 |         batch_id: i32,
  449 |         page_table: &mut PageTable,
  450 |     ) -> Result<()> {
  451 |         assert_eq!(field.encoding, Some(Encoding::Dictionary));
  452 | 
  453 |         // Write the dictionary keys.
  454 |         let mut encoder = DictionaryEncoder::new(object_writer, key_type);
  455 |         let pos = encoder.encode(arrs).await?;
  456 |         let arrs_length: i32 = arrs.iter().map(|a| a.len() as i32).sum();
  457 |         let page_info = PageInfo::new(pos, arrs_length as usize);
  458 |         page_table.set(field.id, batch_id, page_info);
  459 |         Ok(())
  460 |     }
  461 | 
  462 |     #[async_recursion]
  463 |     async fn write_struct_array(
  464 |         object_writer: &mut dyn Writer,
  465 |         field: &Field,
  466 |         arrays: &[&StructArray],
  467 |         batch_id: i32,
  468 |         page_table: &mut PageTable,
  469 |     ) -> Result<()> {
  470 |         arrays
  471 |             .iter()
  472 |             .for_each(|a| assert_eq!(a.num_columns(), field.children.len()));
  473 | 
  474 |         for child in &field.children {
  475 |             let mut arrs: Vec<&ArrayRef> = Vec::new();
  476 |             for struct_array in arrays {
  477 |                 let arr = struct_array
  478 |                     .column_by_name(&child.name)
  479 |                     .ok_or(Error::schema(format!(
  480 |                         "FileWriter: schema mismatch: column {} does not exist in array: {:?}",
  481 |                         child.name,
  482 |                         struct_array.data_type()
  483 |                     )))?;
  484 |                 arrs.push(arr);
  485 |             }
  486 |             Self::write_array(object_writer, child, arrs.as_slice(), batch_id, page_table).await?;
  487 |         }
  488 |         Ok(())
  489 |     }
  490 | 
  491 |     async fn write_list_array(
  492 |         object_writer: &mut dyn Writer,
  493 |         field: &Field,
  494 |         arrs: &[&dyn Array],
  495 |         batch_id: i32,
  496 |         page_table: &mut PageTable,
  497 |     ) -> Result<()> {
  498 |         let capacity: usize = arrs.iter().map(|a| a.len()).sum();
  499 |         let mut list_arrs: Vec<ArrayRef> = Vec::new();
  500 |         let mut pos_builder: PrimitiveBuilder<Int32Type> =
  501 |             PrimitiveBuilder::with_capacity(capacity);
  502 | 
  503 |         let mut last_offset: usize = 0;
  504 |         pos_builder.append_value(last_offset as i32);
  505 |         for array in arrs.iter() {
  506 |             let list_arr = as_list_array(*array);
  507 |             let offsets = list_arr.value_offsets();
  508 | 
  509 |             assert!(!offsets.is_empty());
  510 |             let start_offset = offsets[0].as_usize();
  511 |             let end_offset = offsets[offsets.len() - 1].as_usize();
  512 | 
  513 |             let list_values = list_arr.values();
  514 |             let sliced_values = list_values.slice(start_offset, end_offset - start_offset);
  515 |             list_arrs.push(sliced_values);
  516 | 
  517 |             offsets
  518 |                 .iter()
  519 |                 .skip(1)
  520 |                 .map(|b| b.as_usize() - start_offset + last_offset)
  521 |                 .for_each(|o| pos_builder.append_value(o as i32));
  522 |             last_offset = pos_builder.values_slice()[pos_builder.len() - 1_usize] as usize;
  523 |         }
  524 | 
  525 |         let positions: &dyn Array = &pos_builder.finish();
  526 |         Self::write_fixed_stride_array(object_writer, field, &[positions], batch_id, page_table)
  527 |             .await?;
  528 |         let arrs = list_arrs.iter().collect::<Vec<_>>();
  529 |         Self::write_array(
  530 |             object_writer,
  531 |             &field.children[0],
  532 |             arrs.as_slice(),
  533 |             batch_id,
  534 |             page_table,
  535 |         )
  536 |         .await
  537 |     }
  538 | 
  539 |     async fn write_large_list_array(
  540 |         object_writer: &mut dyn Writer,
  541 |         field: &Field,
  542 |         arrs: &[&dyn Array],
  543 |         batch_id: i32,
  544 |         page_table: &mut PageTable,
  545 |     ) -> Result<()> {
  546 |         let capacity: usize = arrs.iter().map(|a| a.len()).sum();
  547 |         let mut list_arrs: Vec<ArrayRef> = Vec::new();
  548 |         let mut pos_builder: PrimitiveBuilder<Int64Type> =
  549 |             PrimitiveBuilder::with_capacity(capacity);
  550 | 
  551 |         let mut last_offset: usize = 0;
  552 |         pos_builder.append_value(last_offset as i64);
  553 |         for array in arrs.iter() {
  554 |             let list_arr = as_large_list_array(*array);
  555 |             let offsets = list_arr.value_offsets();
  556 | 
  557 |             assert!(!offsets.is_empty());
  558 |             let start_offset = offsets[0].as_usize();
  559 |             let end_offset = offsets[offsets.len() - 1].as_usize();
  560 | 
  561 |             let sliced_values = list_arr
  562 |                 .values()
  563 |                 .slice(start_offset, end_offset - start_offset);
  564 |             list_arrs.push(sliced_values);
  565 | 
  566 |             offsets
  567 |                 .iter()
  568 |                 .skip(1)
  569 |                 .map(|b| b.as_usize() - start_offset + last_offset)
  570 |                 .for_each(|o| pos_builder.append_value(o as i64));
  571 |             last_offset = pos_builder.values_slice()[pos_builder.len() - 1_usize] as usize;
  572 |         }
  573 | 
  574 |         let positions: &dyn Array = &pos_builder.finish();
  575 |         Self::write_fixed_stride_array(object_writer, field, &[positions], batch_id, page_table)
  576 |             .await?;
  577 |         let arrs = list_arrs.iter().collect::<Vec<_>>();
  578 |         Self::write_array(
  579 |             object_writer,
  580 |             &field.children[0],
  581 |             arrs.as_slice(),
  582 |             batch_id,
  583 |             page_table,
  584 |         )
  585 |         .await
  586 |     }
  587 | 
  588 |     async fn write_statistics(&mut self) -> Result<Option<StatisticsMetadata>> {
  589 |         let statistics = self
  590 |             .stats_collector
  591 |             .as_mut()
  592 |             .map(|collector| collector.finish());
  593 | 
  594 |         match statistics {
  595 |             Some(Ok(stats_batch)) if stats_batch.num_rows() > 0 => {
  596 |                 debug_assert_eq!(self.next_batch_id() as usize, stats_batch.num_rows());
  597 |                 let schema = Schema::try_from(stats_batch.schema().as_ref())?;
  598 |                 let leaf_field_ids = schema.field_ids();
  599 | 
  600 |                 let mut stats_page_table = PageTable::default();
  601 |                 for (i, field) in schema.fields.iter().enumerate() {
  602 |                     Self::write_array(
  603 |                         self.object_writer.as_mut(),
  604 |                         field,
  605 |                         &[stats_batch.column(i)],
  606 |                         0, // Only one batch for statistics.
  607 |                         &mut stats_page_table,
  608 |                     )
  609 |                     .await?;
  610 |                 }
  611 | 
  612 |                 let page_table_position = stats_page_table
  613 |                     .write(self.object_writer.as_mut(), 0)
  614 |                     .await?;
  615 | 
  616 |                 Ok(Some(StatisticsMetadata {
  617 |                     schema,
  618 |                     leaf_field_ids,
  619 |                     page_table_position,
  620 |                 }))
  621 |             }
  622 |             Some(Err(e)) => Err(e),
  623 |             _ => Ok(None),
  624 |         }
  625 |     }
  626 | 
  627 |     async fn write_footer(&mut self) -> Result<()> {
  628 |         // Step 1. Write page table.
  629 |         let field_id_offset = *self.schema.field_ids().iter().min().unwrap();
  630 |         let pos = self
  631 |             .page_table
  632 |             .write(self.object_writer.as_mut(), field_id_offset)
  633 |             .await?;
  634 |         self.metadata.page_table_position = pos;
  635 | 
  636 |         // Step 2. Write statistics.
  637 |         self.metadata.stats_metadata = self.write_statistics().await?;
  638 | 
  639 |         // Step 3. Write manifest and dictionary values.
  640 |         write_schema_dictionaries(self.object_writer.as_mut(), &mut self.schema).await?;
  641 |         let pos = M::store_schema(self.object_writer.as_mut(), &self.schema).await?;
  642 | 
  643 |         // Step 4. Write metadata.
  644 |         self.metadata.manifest_position = pos;
  645 |         let pos = self.object_writer.write_struct(&self.metadata).await?;
  646 | 
  647 |         // Step 5. Write magics.
  648 |         self.object_writer
  649 |             .write_magics(pos, MAJOR_VERSION, MINOR_VERSION, MAGIC)
  650 |             .await
  651 |     }
  652 | }
  653 | 
  654 | /// Walk through the schema and return arrays with their Lance field.
  655 | ///
  656 | /// This skips over nested arrays and fields within list arrays. It does walk
  657 | /// over the children of structs.
  658 | fn fields_in_batches<'a>(
  659 |     batches: &'a [RecordBatch],
  660 |     schema: &'a Schema,
  661 | ) -> impl Iterator<Item = (&'a Field, Vec<&'a ArrayRef>)> {
  662 |     let num_columns = batches[0].num_columns();
  663 |     let array_iters = (0..num_columns).map(|col_i| {
  664 |         batches
  665 |             .iter()
  666 |             .map(|batch| batch.column(col_i))
  667 |             .collect::<Vec<_>>()
  668 |     });
  669 |     let mut to_visit: Vec<(&'a Field, Vec<&'a ArrayRef>)> =
  670 |         schema.fields.iter().zip(array_iters).collect();
  671 | 
  672 |     std::iter::from_fn(move || {
  673 |         loop {
  674 |             let (field, arrays): (_, Vec<&'a ArrayRef>) = to_visit.pop()?;
  675 |             match field.data_type() {
  676 |                 DataType::Struct(_) => {
  677 |                     for (i, child_field) in field.children.iter().enumerate() {
  678 |                         let child_arrays = arrays
  679 |                             .iter()
  680 |                             .map(|arr| as_struct_array(*arr).column(i))
  681 |                             .collect::<Vec<&'a ArrayRef>>();
  682 |                         to_visit.push((child_field, child_arrays));
  683 |                     }
  684 |                     continue;
  685 |                 }
  686 |                 // We only walk structs right now.
  687 |                 _ if field.data_type().is_nested() => continue,
  688 |                 _ => return Some((field, arrays)),
  689 |             }
  690 |         }
  691 |     })
  692 | }
  693 | 
  694 | #[cfg(test)]
  695 | mod tests {
  696 |     use super::*;
  697 | 
  698 |     use std::sync::Arc;
  699 | 
  700 |     use arrow_array::{
  701 |         BooleanArray, Decimal128Array, Decimal256Array, DictionaryArray, DurationMicrosecondArray,
  702 |         DurationMillisecondArray, DurationNanosecondArray, DurationSecondArray,
  703 |         FixedSizeBinaryArray, FixedSizeListArray, Float32Array, Int32Array, Int64Array, ListArray,
  704 |         NullArray, StringArray, TimestampMicrosecondArray, TimestampSecondArray, UInt8Array,
  705 |         types::UInt32Type,
  706 |     };
  707 |     use arrow_buffer::i256;
  708 |     use arrow_schema::{
  709 |         Field as ArrowField, Fields as ArrowFields, Schema as ArrowSchema, TimeUnit,
  710 |     };
  711 |     use arrow_select::concat::concat_batches;
  712 | 
  713 |     use crate::versions::v1::reader::FileReader;
  714 | 
  715 |     #[tokio::test]
  716 |     async fn test_write_file() {
  717 |         let arrow_schema = ArrowSchema::new(vec![
  718 |             ArrowField::new("null", DataType::Null, true),
  719 |             ArrowField::new("bool", DataType::Boolean, true),
  720 |             ArrowField::new("i", DataType::Int64, true),
  721 |             ArrowField::new("f", DataType::Float32, false),
  722 |             ArrowField::new("b", DataType::Utf8, true),
  723 |             ArrowField::new("decimal128", DataType::Decimal128(7, 3), false),
  724 |             ArrowField::new("decimal256", DataType::Decimal256(7, 3), false),
  725 |             ArrowField::new("duration_sec", DataType::Duration(TimeUnit::Second), false),
  726 |             ArrowField::new(
  727 |                 "duration_msec",
  728 |                 DataType::Duration(TimeUnit::Millisecond),
  729 |                 false,
  730 |             ),
  731 |             ArrowField::new(
  732 |                 "duration_usec",
  733 |                 DataType::Duration(TimeUnit::Microsecond),
  734 |                 false,
  735 |             ),
  736 |             ArrowField::new(
  737 |                 "duration_nsec",
  738 |                 DataType::Duration(TimeUnit::Nanosecond),
  739 |                 false,
  740 |             ),
  741 |             ArrowField::new(
  742 |                 "d",
  743 |                 DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  744 |                 true,
  745 |             ),
  746 |             ArrowField::new(
  747 |                 "fixed_size_list",
  748 |                 DataType::FixedSizeList(
  749 |                     Arc::new(ArrowField::new("item", DataType::Float32, true)),
  750 |                     16,
  751 |                 ),
  752 |                 true,
  753 |             ),
  754 |             ArrowField::new("fixed_size_binary", DataType::FixedSizeBinary(8), true),
  755 |             ArrowField::new(
  756 |                 "l",
  757 |                 DataType::List(Arc::new(ArrowField::new("item", DataType::Utf8, true))),
  758 |                 true,
  759 |             ),
  760 |             ArrowField::new(
  761 |                 "large_l",
  762 |                 DataType::LargeList(Arc::new(ArrowField::new("item", DataType::Utf8, true))),
  763 |                 true,
  764 |             ),
  765 |             ArrowField::new(
  766 |                 "l_dict",
  767 |                 DataType::List(Arc::new(ArrowField::new(
  768 |                     "item",
  769 |                     DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  770 |                     true,
  771 |                 ))),
  772 |                 true,
  773 |             ),
  774 |             ArrowField::new(
  775 |                 "large_l_dict",
  776 |                 DataType::LargeList(Arc::new(ArrowField::new(
  777 |                     "item",
  778 |                     DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  779 |                     true,
  780 |                 ))),
  781 |                 true,
  782 |             ),
  783 |             ArrowField::new(
  784 |                 "s",
  785 |                 DataType::Struct(ArrowFields::from(vec![
  786 |                     ArrowField::new("si", DataType::Int64, true),
  787 |                     ArrowField::new("sb", DataType::Utf8, true),
  788 |                 ])),
  789 |                 true,
  790 |             ),
  791 |         ]);
  792 |         let mut schema = Schema::try_from(&arrow_schema).unwrap();
  793 | 
  794 |         let dict_vec = (0..100).map(|n| ["a", "b", "c"][n % 3]).collect::<Vec<_>>();
  795 |         let dict_arr: DictionaryArray<UInt32Type> = dict_vec.into_iter().collect();
  796 | 
  797 |         let fixed_size_list_arr = FixedSizeListArray::try_new_from_values(
  798 |             Float32Array::from_iter((0..1600).map(|n| n as f32).collect::<Vec<_>>()),
  799 |             16,
  800 |         )
  801 |         .unwrap();
  802 | 
  803 |         let binary_data: [u8; 800] = [123; 800];
  804 |         let fixed_size_binary_arr =
  805 |             FixedSizeBinaryArray::try_new_from_values(&UInt8Array::from_iter(binary_data), 8)
  806 |                 .unwrap();
  807 | 
  808 |         let list_offsets: Int32Array = (0..202).step_by(2).collect();
  809 |         let list_values =
  810 |             StringArray::from((0..200).map(|n| format!("str-{}", n)).collect::<Vec<_>>());
  811 |         let list_arr: arrow_array::GenericListArray<i32> =
  812 |             try_new_generic_list_array(list_values, &list_offsets).unwrap();
  813 | 
  814 |         let large_list_offsets: Int64Array = (0..202).step_by(2).collect();
  815 |         let large_list_values =
  816 |             StringArray::from((0..200).map(|n| format!("str-{}", n)).collect::<Vec<_>>());
  817 |         let large_list_arr: arrow_array::GenericListArray<i64> =
  818 |             try_new_generic_list_array(large_list_values, &large_list_offsets).unwrap();
  819 | 
  820 |         let list_dict_offsets: Int32Array = (0..202).step_by(2).collect();
  821 |         let list_dict_vec = (0..200).map(|n| ["a", "b", "c"][n % 3]).collect::<Vec<_>>();
  822 |         let list_dict_arr: DictionaryArray<UInt32Type> = list_dict_vec.into_iter().collect();
  823 |         let list_dict_arr: arrow_array::GenericListArray<i32> =
  824 |             try_new_generic_list_array(list_dict_arr, &list_dict_offsets).unwrap();
  825 | 
  826 |         let large_list_dict_offsets: Int64Array = (0..202).step_by(2).collect();
  827 |         let large_list_dict_vec = (0..200).map(|n| ["a", "b", "c"][n % 3]).collect::<Vec<_>>();
  828 |         let large_list_dict_arr: DictionaryArray<UInt32Type> =
  829 |             large_list_dict_vec.into_iter().collect();
  830 |         let large_list_dict_arr: arrow_array::GenericListArray<i64> =
  831 |             try_new_generic_list_array(large_list_dict_arr, &large_list_dict_offsets).unwrap();
  832 | 
  833 |         let columns: Vec<ArrayRef> = vec![
  834 |             Arc::new(NullArray::new(100)),
  835 |             Arc::new(BooleanArray::from_iter(
  836 |                 (0..100).map(|f| Some(f % 3 == 0)).collect::<Vec<_>>(),
  837 |             )),
  838 |             Arc::new(Int64Array::from_iter((0..100).collect::<Vec<_>>())),
  839 |             Arc::new(Float32Array::from_iter(
  840 |                 (0..100).map(|n| n as f32).collect::<Vec<_>>(),
  841 |             )),
  842 |             Arc::new(StringArray::from(
  843 |                 (0..100).map(|n| n.to_string()).collect::<Vec<_>>(),
  844 |             )),
  845 |             Arc::new(
  846 |                 Decimal128Array::from_iter_values(0..100)
  847 |                     .with_precision_and_scale(7, 3)
  848 |                     .unwrap(),
  849 |             ),
  850 |             Arc::new(
  851 |                 Decimal256Array::from_iter_values((0..100).map(|v| i256::from_i128(v as i128)))
  852 |                     .with_precision_and_scale(7, 3)
  853 |                     .unwrap(),
  854 |             ),
  855 |             Arc::new(DurationSecondArray::from_iter_values(0..100)),
  856 |             Arc::new(DurationMillisecondArray::from_iter_values(0..100)),
  857 |             Arc::new(DurationMicrosecondArray::from_iter_values(0..100)),
  858 |             Arc::new(DurationNanosecondArray::from_iter_values(0..100)),
  859 |             Arc::new(dict_arr),
  860 |             Arc::new(fixed_size_list_arr),
  861 |             Arc::new(fixed_size_binary_arr),
  862 |             Arc::new(list_arr),
  863 |             Arc::new(large_list_arr),
  864 |             Arc::new(list_dict_arr),
  865 |             Arc::new(large_list_dict_arr),
  866 |             Arc::new(StructArray::from(vec![
  867 |                 (
  868 |                     Arc::new(ArrowField::new("si", DataType::Int64, true)),
  869 |                     Arc::new(Int64Array::from_iter((100..200).collect::<Vec<_>>())) as ArrayRef,
  870 |                 ),
  871 |                 (
  872 |                     Arc::new(ArrowField::new("sb", DataType::Utf8, true)),
  873 |                     Arc::new(StringArray::from(
  874 |                         (0..100).map(|n| n.to_string()).collect::<Vec<_>>(),
  875 |                     )) as ArrayRef,
  876 |                 ),
  877 |             ])),
  878 |         ];
  879 |         let batch = RecordBatch::try_new(Arc::new(arrow_schema), columns).unwrap();
  880 |         schema.set_dictionary(&batch).unwrap();
  881 | 
  882 |         let store = ObjectStore::memory();
  883 |         let path = Path::from("/foo");
  884 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
  885 |             &store,
  886 |             &path,
  887 |             schema.clone(),
  888 |             &Default::default(),
  889 |         )
  890 |         .await
  891 |         .unwrap();
  892 |         file_writer
  893 |             .write(std::slice::from_ref(&batch))
  894 |             .await
  895 |             .unwrap();
  896 |         file_writer.finish().await.unwrap();
  897 | 
  898 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
  899 |         let actual = reader.read_batch(0, .., reader.schema()).await.unwrap();
  900 |         assert_eq!(actual, batch);
  901 |     }
  902 | 
  903 |     #[tokio::test]
  904 |     async fn test_dictionary_first_element_file() {
  905 |         let arrow_schema = ArrowSchema::new(vec![ArrowField::new(
  906 |             "d",
  907 |             DataType::Dictionary(Box::new(DataType::UInt32), Box::new(DataType::Utf8)),
  908 |             true,
  909 |         )]);
  910 |         let mut schema = Schema::try_from(&arrow_schema).unwrap();
  911 | 
  912 |         let dict_vec = (0..100).map(|n| ["a", "b", "c"][n % 3]).collect::<Vec<_>>();
  913 |         let dict_arr: DictionaryArray<UInt32Type> = dict_vec.into_iter().collect();
  914 | 
  915 |         let columns: Vec<ArrayRef> = vec![Arc::new(dict_arr)];
  916 |         let batch = RecordBatch::try_new(Arc::new(arrow_schema), columns).unwrap();
  917 |         schema.set_dictionary(&batch).unwrap();
  918 | 
  919 |         let store = ObjectStore::memory();
  920 |         let path = Path::from("/foo");
  921 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
  922 |             &store,
  923 |             &path,
  924 |             schema.clone(),
  925 |             &Default::default(),
  926 |         )
  927 |         .await
  928 |         .unwrap();
  929 |         file_writer
  930 |             .write(std::slice::from_ref(&batch))
  931 |             .await
  932 |             .unwrap();
  933 |         file_writer.finish().await.unwrap();
  934 | 
  935 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
  936 |         let actual = reader.read_batch(0, .., reader.schema()).await.unwrap();
  937 |         assert_eq!(actual, batch);
  938 |     }
  939 | 
  940 |     #[tokio::test]
  941 |     async fn test_write_temporal_types() {
  942 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
  943 |             ArrowField::new(
  944 |                 "ts_notz",
  945 |                 DataType::Timestamp(TimeUnit::Second, None),
  946 |                 false,
  947 |             ),
  948 |             ArrowField::new(
  949 |                 "ts_tz",
  950 |                 DataType::Timestamp(TimeUnit::Microsecond, Some("America/Los_Angeles".into())),
  951 |                 false,
  952 |             ),
  953 |         ]));
  954 |         let columns: Vec<ArrayRef> = vec![
  955 |             Arc::new(TimestampSecondArray::from(vec![11111111, 22222222])),
  956 |             Arc::new(
  957 |                 TimestampMicrosecondArray::from(vec![3333333, 4444444])
  958 |                     .with_timezone("America/Los_Angeles"),
  959 |             ),
  960 |         ];
  961 |         let batch = RecordBatch::try_new(arrow_schema.clone(), columns).unwrap();
  962 | 
  963 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  964 |         let store = ObjectStore::memory();
  965 |         let path = Path::from("/foo");
  966 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
  967 |             &store,
  968 |             &path,
  969 |             schema.clone(),
  970 |             &Default::default(),
  971 |         )
  972 |         .await
  973 |         .unwrap();
  974 |         file_writer
  975 |             .write(std::slice::from_ref(&batch))
  976 |             .await
  977 |             .unwrap();
  978 |         file_writer.finish().await.unwrap();
  979 | 
  980 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
  981 |         let actual = reader.read_batch(0, .., reader.schema()).await.unwrap();
  982 |         assert_eq!(actual, batch);
  983 |     }
  984 | 
  985 |     #[tokio::test]
  986 |     async fn test_write_empty_non_nullable_string() {
  987 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
  988 |             "value",
  989 |             DataType::Utf8,
  990 |             false,
  991 |         )]));
  992 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  993 |         let store = ObjectStore::memory();
  994 |         let path = Path::from("/empty");
  995 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
  996 |             &store,
  997 |             &path,
  998 |             schema.clone(),
  999 |             &Default::default(),
 1000 |         )
 1001 |         .await
 1002 |         .unwrap();
 1003 | 
 1004 |         file_writer
 1005 |             .write(&[RecordBatch::new_empty(arrow_schema)])
 1006 |             .await
 1007 |             .unwrap();
 1008 |         let summary = file_writer.finish().await.unwrap();
 1009 |         assert_eq!(summary.num_rows, 0);
 1010 | 
 1011 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1012 |         let actual = reader.read_batch(0, .., reader.schema()).await.unwrap();
 1013 |         assert_eq!(actual.num_rows(), 0);
 1014 |     }
 1015 | 
 1016 |     #[tokio::test]
 1017 |     async fn test_collect_stats() {
 1018 |         // Validate:
 1019 |         // Only collects stats for requested columns
 1020 |         // Can collect stats in nested structs
 1021 |         // Won't collect stats for list columns (for now)
 1022 | 
 1023 |         let arrow_schema = ArrowSchema::new(vec![
 1024 |             ArrowField::new("i", DataType::Int64, true),
 1025 |             ArrowField::new("i2", DataType::Int64, true),
 1026 |             ArrowField::new(
 1027 |                 "l",
 1028 |                 DataType::List(Arc::new(ArrowField::new("item", DataType::Int32, true))),
 1029 |                 true,
 1030 |             ),
 1031 |             ArrowField::new(
 1032 |                 "s",
 1033 |                 DataType::Struct(ArrowFields::from(vec![
 1034 |                     ArrowField::new("si", DataType::Int64, true),
 1035 |                     ArrowField::new("sb", DataType::Utf8, true),
 1036 |                 ])),
 1037 |                 true,
 1038 |             ),
 1039 |         ]);
 1040 | 
 1041 |         let schema = Schema::try_from(&arrow_schema).unwrap();
 1042 | 
 1043 |         let store = ObjectStore::memory();
 1044 |         let path = Path::from("/foo");
 1045 | 
 1046 |         let options = FileWriterOptions {
 1047 |             collect_stats_for_fields: Some(vec![0, 1, 5, 6]),
 1048 |         };
 1049 |         let mut file_writer =
 1050 |             FileWriter::<NotSelfDescribing>::try_new(&store, &path, schema.clone(), &options)
 1051 |                 .await
 1052 |                 .unwrap();
 1053 | 
 1054 |         let batch1 = RecordBatch::try_new(
 1055 |             Arc::new(arrow_schema.clone()),
 1056 |             vec![
 1057 |                 Arc::new(Int64Array::from(vec![1, 2, 3])),
 1058 |                 Arc::new(Int64Array::from(vec![4, 5, 6])),
 1059 |                 Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(vec![
 1060 |                     Some(vec![Some(1i32), Some(2), Some(3)]),
 1061 |                     Some(vec![Some(4), Some(5)]),
 1062 |                     Some(vec![]),
 1063 |                 ])),
 1064 |                 Arc::new(StructArray::from(vec![
 1065 |                     (
 1066 |                         Arc::new(ArrowField::new("si", DataType::Int64, true)),
 1067 |                         Arc::new(Int64Array::from(vec![1, 2, 3])) as ArrayRef,
 1068 |                     ),
 1069 |                     (
 1070 |                         Arc::new(ArrowField::new("sb", DataType::Utf8, true)),
 1071 |                         Arc::new(StringArray::from(vec!["a", "b", "c"])) as ArrayRef,
 1072 |                     ),
 1073 |                 ])),
 1074 |             ],
 1075 |         )
 1076 |         .unwrap();
 1077 |         file_writer.write(&[batch1]).await.unwrap();
 1078 | 
 1079 |         let batch2 = RecordBatch::try_new(
 1080 |             Arc::new(arrow_schema.clone()),
 1081 |             vec![
 1082 |                 Arc::new(Int64Array::from(vec![5, 6])),
 1083 |                 Arc::new(Int64Array::from(vec![10, 11])),
 1084 |                 Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(vec![
 1085 |                     Some(vec![Some(1i32), Some(2), Some(3)]),
 1086 |                     Some(vec![]),
 1087 |                 ])),
 1088 |                 Arc::new(StructArray::from(vec![
 1089 |                     (
 1090 |                         Arc::new(ArrowField::new("si", DataType::Int64, true)),
 1091 |                         Arc::new(Int64Array::from(vec![4, 5])) as ArrayRef,
 1092 |                     ),
 1093 |                     (
 1094 |                         Arc::new(ArrowField::new("sb", DataType::Utf8, true)),
 1095 |                         Arc::new(StringArray::from(vec!["d", "e"])) as ArrayRef,
 1096 |                     ),
 1097 |                 ])),
 1098 |             ],
 1099 |         )
 1100 |         .unwrap();
 1101 |         file_writer.write(&[batch2]).await.unwrap();
 1102 | 
 1103 |         file_writer.finish().await.unwrap();
 1104 | 
 1105 |         let reader = FileReader::try_new(&store, &path, schema).await.unwrap();
 1106 | 
 1107 |         let read_stats = reader.read_page_stats(&[0, 1, 5, 6]).await.unwrap();
 1108 |         assert!(read_stats.is_some());
 1109 |         let read_stats = read_stats.unwrap();
 1110 | 
 1111 |         let expected_stats_schema = stats_schema([
 1112 |             (0, DataType::Int64),
 1113 |             (1, DataType::Int64),
 1114 |             (5, DataType::Int64),
 1115 |             (6, DataType::Utf8),
 1116 |         ]);
 1117 | 
 1118 |         assert_eq!(read_stats.schema().as_ref(), &expected_stats_schema);
 1119 | 
 1120 |         let expected_stats = stats_batch(&[
 1121 |             Stats {
 1122 |                 field_id: 0,
 1123 |                 null_counts: vec![0, 0],
 1124 |                 min_values: Arc::new(Int64Array::from(vec![1, 5])),
 1125 |                 max_values: Arc::new(Int64Array::from(vec![3, 6])),
 1126 |             },
 1127 |             Stats {
 1128 |                 field_id: 1,
 1129 |                 null_counts: vec![0, 0],
 1130 |                 min_values: Arc::new(Int64Array::from(vec![4, 10])),
 1131 |                 max_values: Arc::new(Int64Array::from(vec![6, 11])),
 1132 |             },
 1133 |             Stats {
 1134 |                 field_id: 5,
 1135 |                 null_counts: vec![0, 0],
 1136 |                 min_values: Arc::new(Int64Array::from(vec![1, 4])),
 1137 |                 max_values: Arc::new(Int64Array::from(vec![3, 5])),
 1138 |             },
 1139 |             // FIXME: these max values shouldn't be incremented
 1140 |             // https://github.com/lancedb/lance/issues/1517
 1141 |             Stats {
 1142 |                 field_id: 6,
 1143 |                 null_counts: vec![0, 0],
 1144 |                 min_values: Arc::new(StringArray::from(vec!["a", "d"])),
 1145 |                 max_values: Arc::new(StringArray::from(vec!["c", "e"])),
 1146 |             },
 1147 |         ]);
 1148 | 
 1149 |         assert_eq!(read_stats, expected_stats);
 1150 |     }
 1151 | 
 1152 |     fn stats_schema(data_fields: impl IntoIterator<Item = (i32, DataType)>) -> ArrowSchema {
 1153 |         let fields = data_fields
 1154 |             .into_iter()
 1155 |             .map(|(field_id, data_type)| {
 1156 |                 Arc::new(ArrowField::new(
 1157 |                     format!("{}", field_id),
 1158 |                     DataType::Struct(
 1159 |                         vec![
 1160 |                             Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1161 |                             Arc::new(ArrowField::new("min_value", data_type.clone(), true)),
 1162 |                             Arc::new(ArrowField::new("max_value", data_type, true)),
 1163 |                         ]
 1164 |                         .into(),
 1165 |                     ),
 1166 |                     false,
 1167 |                 ))
 1168 |             })
 1169 |             .collect::<Vec<_>>();
 1170 |         ArrowSchema::new(fields)
 1171 |     }
 1172 | 
 1173 |     struct Stats {
 1174 |         field_id: i32,
 1175 |         null_counts: Vec<i64>,
 1176 |         min_values: ArrayRef,
 1177 |         max_values: ArrayRef,
 1178 |     }
 1179 | 
 1180 |     fn stats_batch(stats: &[Stats]) -> RecordBatch {
 1181 |         let schema = stats_schema(
 1182 |             stats
 1183 |                 .iter()
 1184 |                 .map(|s| (s.field_id, s.min_values.data_type().clone())),
 1185 |         );
 1186 | 
 1187 |         let columns = stats
 1188 |             .iter()
 1189 |             .map(|s| {
 1190 |                 let data_type = s.min_values.data_type().clone();
 1191 |                 let fields = vec![
 1192 |                     Arc::new(ArrowField::new("null_count", DataType::Int64, false)),
 1193 |                     Arc::new(ArrowField::new("min_value", data_type.clone(), true)),
 1194 |                     Arc::new(ArrowField::new("max_value", data_type, true)),
 1195 |                 ];
 1196 |                 let arrays = vec![
 1197 |                     Arc::new(Int64Array::from(s.null_counts.clone())),
 1198 |                     s.min_values.clone(),
 1199 |                     s.max_values.clone(),
 1200 |                 ];
 1201 |                 Arc::new(StructArray::new(fields.into(), arrays, None)) as ArrayRef
 1202 |             })
 1203 |             .collect();
 1204 | 
 1205 |         RecordBatch::try_new(Arc::new(schema), columns).unwrap()
 1206 |     }
 1207 | 
 1208 |     async fn read_file_as_one_batch(
 1209 |         object_store: &ObjectStore,
 1210 |         path: &Path,
 1211 |         schema: Schema,
 1212 |     ) -> RecordBatch {
 1213 |         let reader = FileReader::try_new(object_store, path, schema)
 1214 |             .await
 1215 |             .unwrap();
 1216 |         let mut batches = vec![];
 1217 |         for i in 0..reader.num_batches() {
 1218 |             batches.push(
 1219 |                 reader
 1220 |                     .read_batch(i as i32, .., reader.schema())
 1221 |                     .await
 1222 |                     .unwrap(),
 1223 |             );
 1224 |         }
 1225 |         let arrow_schema = Arc::new(reader.schema().into());
 1226 |         concat_batches(&arrow_schema, &batches).unwrap()
 1227 |     }
 1228 | 
 1229 |     /// Test encoding arrays that share the same underneath buffer.
 1230 |     #[tokio::test]
 1231 |     async fn test_encode_slice() {
 1232 |         let store = ObjectStore::memory();
 1233 |         let path = Path::from("/shared_slice");
 1234 | 
 1235 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![ArrowField::new(
 1236 |             "i",
 1237 |             DataType::Int32,
 1238 |             false,
 1239 |         )]));
 1240 |         let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
 1241 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
 1242 |             &store,
 1243 |             &path,
 1244 |             schema.clone(),
 1245 |             &Default::default(),
 1246 |         )
 1247 |         .await
 1248 |         .unwrap();
 1249 | 
 1250 |         let array = Int32Array::from_iter_values(0..1000);
 1251 | 
 1252 |         for i in (0..1000).step_by(4) {
 1253 |             let data = array.slice(i, 4);
 1254 |             file_writer
 1255 |                 .write(&[RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(data)]).unwrap()])
 1256 |                 .await
 1257 |                 .unwrap();
 1258 |         }
 1259 |         file_writer.finish().await.unwrap();
 1260 |         assert!(store.size(&path).await.unwrap() < 2 * 8 * 1000);
 1261 | 
 1262 |         let batch = read_file_as_one_batch(&store, &path, schema).await;
 1263 |         assert_eq!(batch.column_by_name("i").unwrap().as_ref(), &array);
 1264 |     }
 1265 | 
 1266 |     #[tokio::test]
 1267 |     async fn test_write_schema_with_holes() {
 1268 |         let store = ObjectStore::memory();
 1269 |         let path = Path::from("test");
 1270 | 
 1271 |         let mut field0 = Field::try_from(&ArrowField::new("a", DataType::Int32, true)).unwrap();
 1272 |         field0.set_id(-1, &mut 0);
 1273 |         assert_eq!(field0.id, 0);
 1274 |         let mut field2 = Field::try_from(&ArrowField::new("b", DataType::Int32, true)).unwrap();
 1275 |         field2.set_id(-1, &mut 2);
 1276 |         assert_eq!(field2.id, 2);
 1277 |         // There is a hole at field id 1.
 1278 |         let schema = Schema {
 1279 |             fields: vec![field0, field2],
 1280 |             metadata: Default::default(),
 1281 |         };
 1282 | 
 1283 |         let arrow_schema = Arc::new(ArrowSchema::new(vec![
 1284 |             ArrowField::new("a", DataType::Int32, true),
 1285 |             ArrowField::new("b", DataType::Int32, true),
 1286 |         ]));
 1287 |         let data = RecordBatch::try_new(
 1288 |             arrow_schema.clone(),
 1289 |             vec![
 1290 |                 Arc::new(Int32Array::from_iter_values(0..10)),
 1291 |                 Arc::new(Int32Array::from_iter_values(10..20)),
 1292 |             ],
 1293 |         )
 1294 |         .unwrap();
 1295 | 
 1296 |         let mut file_writer = FileWriter::<NotSelfDescribing>::try_new(
 1297 |             &store,
 1298 |             &path,
 1299 |             schema.clone(),
 1300 |             &Default::default(),
 1301 |         )
 1302 |         .await
 1303 |         .unwrap();
 1304 |         file_writer.write(&[data]).await.unwrap();
 1305 |         file_writer.finish().await.unwrap();
 1306 | 
 1307 |         let page_table = file_writer.page_table;
 1308 |         assert!(page_table.get(0, 0).is_some());
 1309 |         assert!(page_table.get(2, 0).is_some());
 1310 |     }
 1311 | }
``````
