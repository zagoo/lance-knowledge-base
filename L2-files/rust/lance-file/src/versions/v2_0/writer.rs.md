> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/versions/v2_0/writer.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `f5b4f4d4b02103b1a011e35b79e6ddc20798f241a5361626358dd9283692f319`. Reviewed physical lines: 1-952.

[Module](../../../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public V2_0 concrete Writer reexported from the exact version parent. It independently owns ArrayFieldEncodingStrategy, field encoders, row accounting, object IO and optional metadata spill. Standard finish writes literal footer(0,3); concat_lance_footer produces embedded(2,0). The latter is public inside a private child and reached through parent self-described/mini helpers. (rust/lance-file/src/versions/v2_0/writer.rs:1-952)

## Complete range analysis

### Lines 1-40

SPDX/imports connect panic, HashMap/Arc, Arrow arrays/batches, Bytes cursors/mutation, FuturesOrdered, core Schema/padding/errors, encoding strategies/tasks/pages/RepDef, object IO/store/path, logs, prost Any, Tokio async writes, tracing and file protobuf/options/type checks. This implementation does not compose the shared structural sink/pipeline. (rust/lance-file/src/versions/v2_0/writer.rs:1-40)

### Lines 41-51

PAD_BUFFER is64 bytes of decimal72/0x48. MAX_PAGE_BYTES is32MiB, with comments motivating historical V2_0 reader regressions and saying the write-time limit is not applied in2.1. This is commentary about encoder policy: the shared structural writer still resolves a32MiB max-page option (rust/lance-file/src/writer/structural.rs:414-439). DEFAULT_SPILL_BUFFER_LIMIT is256KiB; per-column floor means it is not a strict aggregate cap. (rust/lance-file/src/versions/v2_0/writer.rs:41-51)

### Lines 52-76

Private PageMetadataSpill owns writer/store/path, u64 position, per-column serialized-byte Vecs, per-column chunk(offset:u64,length:u32) Vecs and usize limit. Sidecar is interleaved chunks of length-delimited Page protobufs, with ownership/order supplied by the in-memory chunk index, not a persisted directory. Capacities and chunk vectors remain resident. (rust/lance-file/src/versions/v2_0/writer.rs:52-76)

### Lines 77-91

new creates sidecar before calculating max(256KiB/max(num_columns,1),64), then allocates two empty vectors per column. Zero columns avoids division by zero; high column counts can exceed the nominal aggregate floor budget. IO errors propagate; no cleanup operation is local. (rust/lance-file/src/versions/v2_0/writer.rs:77-91)

### Lines 92-109

append_page trusts column index, length-delimited-encodes into its existing buffer, maps protobuf encoding failure to IO with std InvalidData, and flushes at len>=limit. A whole message may overshoot threshold; no page semantic validation or checked indexing. (rust/lance-file/src/versions/v2_0/writer.rs:92-109)

### Lines 110-131

flush_column skips empty; write_all precedes appending(offset,len as u32), unchecked position addition and Vec.clear. A partial write failure retains buffer and old position, so replaying blindly is not rollback-safe. clear retains capacity. shutdown_writer flushes columns sequentially, awaits ObjectWriter::shutdown and discards its summary; stops on first error. (rust/lance-file/src/versions/v2_0/writer.rs:110-131)

### Lines 132-152

decode_spilled_chunk clones the Bytes handle/cursor and repeatedly decodes length-delimited Page messages into Vec until exhaustion; empty succeeds, decode failure becomes IO InvalidData. It performs syntax decoding only. Private PageSpillState stores either Pending(store,path) or Active(spill), with no failed/closed state. (rust/lance-file/src/versions/v2_0/writer.rs:132-152)

### Lines 153-174

Writer privately owns object writer, optional schema/type cache, field encoders, physical column metadata/mapping/count, aggregate/per-field row counts, global descriptors, schema map, boxed strategy, options and optional spill. Comments distinguish top-level field counts from physical columns and permit unequal field lengths. No derive or local Drop. (rust/lance-file/src/versions/v2_0/writer.rs:153-174)

### Lines 175-195

initial_column_metadata returns empty page/buffer vectors and absent encoding. try_new constructs lazy state then initialize(schema); failure drops the local writer without awaiting explicit abort. Public Writer construction returns Result. (rust/lance-file/src/versions/v2_0/writer.rs:175-195)

### Lines 196-218

new_lazy is infallible: stores object/options, initializes all counters/maps/vectors empty, schema/type cache/spill absent, and boxes ArrayFieldEncodingStrategy::new. It performs no schema/options validation or IO. Documentation says no arriving data makes finish fail; an empty batch can nevertheless initialize schema. (rust/lance-file/src/versions/v2_0/writer.rs:196-218)

### Lines 219-237

with_page_metadata_spill overwrites spill with Pending and returns owned self without a timing guard or migrating already retained pages; docs explicitly assign path cleanup to caller. do_write_buffer writes payload then 0x48 padding based on payload length to64, not current position. It cannot repair an already unaligned starting offset. (rust/lance-file/src/versions/v2_0/writer.rs:219-237)

### Lines 238-262

write_page consumes each buffer, records current tell/actual payload length, writes padded payload, then Any-wraps either Legacy or Structural description into Direct Page metadata with length=num_rows and priority=row_number. Description construction follows IO and performs no V2_0 grammar gate. column_idx casts directly to usize. (rust/lance-file/src/versions/v2_0/writer.rs:238-262)

### Lines 263-278

If Pending, take state then await sidecar creation; failure/cancellation leaves page_spill=None after payload IO. Active appends serialized page, None pushes into indexed column metadata, remaining Pending is unreachable. Indexing is trusted; configuring spill late does not migrate prior pages. (rust/lance-file/src/versions/v2_0/writer.rs:263-278)

### Lines 279-301

Instrumented write_pages polls FuturesOrdered results in insertion order and writes each returned page sequentially. First task/page error drops remaining local futures; spawned work cancellation is not established. Always flush object writer afterward, even with no tasks. Comment says flush observes already-failed uploads without waiting in-flight uploads; actual backend implementation remains pending. (rust/lance-file/src/versions/v2_0/writer.rs:279-301)

### Lines 302-325

write_batches awaits write_batch sequentially for borrowed iterator items and stops first error; empty iterator does nothing. prepare_field_arrays consumes indexed ArrayRefs and calls each selected encoder prepare_array before collect succeeds; earlier preparation is not locally rolled back on later error. FieldEncoder documentation requests preparation before state mutation, but its &mut API cannot itself enforce that (rust/lance-encoding/src/encoder.rs:175-183). (rust/lance-file/src/versions/v2_0/writer.rs:302-325)

### Lines 326-347

initialize first validates explicit options, divides supplied data_cache_bytes by top-level schema field count or defaults8MiB, then resolves explicit max_page_bytes before env parse/untrimmed u64/default32MiB. Invalid parse warns; missing/non-Unicode env silently defaults; env0 is not rejected by explicit-option validation. Supplied cache budget plus empty schema divides by zero before schema validation. (rust/lance-file/src/versions/v2_0/writer.rs:326-347)

### Lines 348-370

Validate schema, resolve keep_original_array defaultfalse, set alignment64 and create BatchEncoder with stored strategy. Install physical count, zero field counters, encoders, blank column metadata and mapping; drain schema metadata into existing map, then store schema. Schema entries overwrite existing duplicate keys. Existing aggregate rows, type cache, globals and spill are not reset by this private function; normal lazy initialization runs once. (rust/lance-file/src/versions/v2_0/writer.rs:348-370)

### Lines 371-401

ensure_initialized converts batch Arrow schema only when schema absent, calls initialize, then unwraps stored schema. field_arrays enumerates desired schema fields and finds each batch column by name, clones Arc and collects; missing field InvalidInput names it, extra columns ignored. Entire field selection completes before prepare/encode. No positional field selection. (rust/lance-file/src/versions/v2_0/writer.rs:371-401)

### Lines 402-433

encode_columns first snapshots each chosen field row offset, then calls maybe_encode for each array with Arc clone, fresh RepDefBuilder, old offset and array.len as u64. Direct vector indexing assumes coherent state. Result<Vec<Vec<EncodeTask>>> may fail after earlier encoder mutation; no rollback. Task output page ordering is separately enforced by write_pages. (rust/lance-file/src/versions/v2_0/writer.rs:402-433)

### Lines 434-446

advance_columns unchecked-adds each selected prepared array length to its own field count and sets aggregate to max(previous aggregate,new total). It does not inspect other fields or guard overflow. Comments say after written; actual call occurs before awaiting page tasks. (rust/lance-file/src/versions/v2_0/writer.rs:434-446)

### Lines 447-476

write_batch logs shape/memory, ensures schema, lazily checks ExpectedTypes by name, collects desired fields then calls every prepare_array before zero-row and single-batch u32MAX checks. No separate recursive nullability helper here; preparation delegates encoder validation. Empty batches still require all desired fields and successful preparation. The error text describes whole files, but this guard limits one batch. (rust/lance-file/src/versions/v2_0/writer.rs:447-476)

### Lines 477-506

Create out-of-line planner at current tell/alignment64, maybe_encode all fields, then write external buffers with trailing padding and collect ordered tasks. Check aggregate u64 addition only after encoder/IO effects; advance every field by original batch.num_rows and aggregate likewise, then await write_pages. Page/flush failure leaves counters advanced. Prepared-array length is assumed consistent with batch length; no equality check here. (rust/lance-file/src/versions/v2_0/writer.rs:477-506)

### Lines 507-537

Public write_column documentation describes top-level logical index, append behavior, unequal root-field lengths, zero-length unwritten fields and explicit-schema requirement; Rust doctest writes lengths3 and1 through facade FileWriter. The actual presence check also accepts a previously initialized lazy writer. This is documentation, not an executed test or blanket read guarantee. (rust/lance-file/src/versions/v2_0/writer.rs:507-537)

### Lines 538-562

write_column requires schema, rejects out-of-range top-level index with counts, then rejects input array length>u32MAX. Lazily check type, call chosen encoder prepare_array and replace local array with result. No recheck of prepared output length/type or dedicated writer nullability check; external-only initializer can leave encoder vector empty and panic here. (rust/lance-file/src/versions/v2_0/writer.rs:538-562)

### Lines 563-585

Return if prepared array empty; otherwise encode singleton using old field offset, write external buffers padded, collect ordered tasks, advance selected field by prepared length then await page write/flush. No aggregate overflow check; failures can leave preparation, encoding, IO or row state changed. Other fields remain unchanged. (rust/lance-file/src/versions/v2_0/writer.rs:563-585)

### Lines 586-596

write_column_metadata serializes whole ColumnMetadata into Vec, records tell/length and writes raw bytes without length prefix or padding; returns descriptor. Serialization allocation coexists with owned metadata until return. (rust/lance-file/src/versions/v2_0/writer.rs:586-596)

### Lines 597-613

write_column_metadatas takes all metadata then spill state before awaited work. Active spill flushes/shuts down, reopens and moves chunk index; Pending/None yield no reader. Error after take does not restore either state. Comment delegates sidecar deletion to caller; no deletion is executed here. (rust/lance-file/src/versions/v2_0/writer.rs:597-613)

### Lines 614-632

For each column in order, sequentially read all indexed chunks with unchecked u64-to-usize and offset+length, map range errors to IO, decode/collect all pages and replace metadata.pages. Thus late spill drops preexisting retained page descriptions. Then serialize whole column and append descriptor. Memory holds a full column page vector plus serialized bytes and chunk lists; this is not bounded streaming replay. (rust/lance-file/src/versions/v2_0/writer.rs:614-632)

### Lines 633-646

make_file_descriptor converts borrowed core Schema through FieldsWithMeta into Some protobuf Schema plus num_rows length. It returns Ok locally, without schema or row consistency validation. (rust/lance-file/src/versions/v2_0/writer.rs:633-646)

### Lines 647-666

write_global_buffers rejects missing schema, takes schema_metadata into it, recursively unloads blobs in place, builds/serializes descriptor and writes raw bytes at current position. Global table entry0 is descriptor, followed by drained prior user-global descriptors. Schema mutation precedes IO; no length prefix/padding. Repeated invocation can replace metadata with an empty map. (rust/lance-file/src/versions/v2_0/writer.rs:647-666)

### Lines 667-697

add_schema_metadata inserts/replaces key/value without enforcing documented before-finish timing. initialize_with_external_metadata drains schema metadata into map, stores schema, sets num_columns by unchecked len as u32, replaces column metadata and sets aggregate rows. It does not validate buffers/schema/options or recreate encoders, type cache, mapping, field counts, globals or spill. Caller coherence is required. (rust/lance-file/src/versions/v2_0/writer.rs:667-697)

### Lines 698-710

add_global_buffer gets tell, writes payload padded, records position/raw length and returns descriptor Vec len as u32, so user indices begin1 before descriptor0 is emitted. No schema requirement, empty-buffer rejection, checked count cast or starting-alignment repair. (rust/lance-file/src/versions/v2_0/writer.rs:698-710)

### Lines 711-727

finish_writers removes all encoders with mem::take, then awaits each finish with fresh planner. External buffers are written raw although planner positions include padding (rust/lance-encoding/src/encoder.rs:130-159); multiple unaligned buffers depend on producer invariants. Debug assertion checks returned column count after those writes. Failures lose removed encoders. (rust/lance-file/src/versions/v2_0/writer.rs:711-727)

### Lines 728-760

Write every final page, borrow indexed metadata and record tell once, then write each column buffer padded while incrementing recorded buffer_pos only by raw length. Multiple unaligned buffers can have incorrect later recorded offsets; this is a deduction, not a reproduced producer case. Encoding is Any-wrapped Direct; count advances per returned physical column. Final total mismatch unconditionally panics, including release builds. No equal-field-row check. (rust/lance-file/src/versions/v2_0/writer.rs:728-760)

### Lines 761-789

finish borrows mutably, obtains tell, flushes all encoders into task vectors, writes external buffers padded and drains ordered pages/flush even if empty. Only call finish_writers if encoders remain, enabling external-metadata-only path to skip its count check. Docs promise close on success; backend semantics still delegated. (rust/lance-file/src/versions/v2_0/writer.rs:761-789)

### Lines 790-811

After field finishing, write descriptor/globals, record column-metadata start and consume/write column metadata. Append column offset table then global offset table, each pair two LEu64 without prefix; global count len as u32 unchecked. Every failure propagates with prior effects retained. (rust/lance-file/src/versions/v2_0/writer.rs:790-811)

### Lines 812-830

Append40-byte footer: three LEu64 starts(column metadata,column offsets,global offsets), two LEu32 counts(globals,columns), literal LEu16(0,3), then LANC. Await ObjectWriter shutdown; return aggregate num_rows and size from write result. No checksum, finished flag, idempotency, count validation or additional alignment. This historical standard V2_0 identity differs from embedded(2,0). (rust/lance-file/src/versions/v2_0/writer.rs:812-830)

### Lines 831-851

abort is empty async body; comment refers to ObjectWriter Drop but call does not drop or abort it. tell casts current position to u64. write_external_buffer writes raw at current tell with no leading/trailing alignment, returning start/raw len, unlike structural external writes. Mapping getter borrows stored pairs unchanged. (rust/lance-file/src/versions/v2_0/writer.rs:831-851)

### Lines 852-874

concat_lance_footer reserves input length+1MiB, copies full batch.data and optionally clones batch core Schema through TryFrom<&Self>, builds descriptor and appends raw bytes; mini mode has no globals. No schema validation/blob unloading/alignment repair. Column metadata begins afterward. The Schema conversion here clones existing core schema (rust/lance-core/src/datatypes/schema.rs:922-927). (rust/lance-file/src/versions/v2_0/writer.rs:852-874)

### Lines 875-910

For each page-table column in vector order, build pages preserving descriptors,num_rows,priority and Any-wrapping both Legacy/Structural encoding variants. Collect fallibly. No exact-version gate, relocation or descriptor bounds validation; supplied offsets must match copied prefix. (rust/lance-file/src/versions/v2_0/writer.rs:875-910)

### Lines 911-927

Copy column-level descriptors and Any-wrap column encoding; serialize whole metadata and append it raw with(position,length). ColumnInfo.index is unused, as is batch.top_level_columns; ordering is page_table order. Temporary metadata and bytes allocate. (rust/lance-file/src/versions/v2_0/writer.rs:911-927)

### Lines 928-952

Append column and global offset tables as LEu64 pairs, then same40-byte shape with unchecked counts and literal(2,0), not standard writer(0,3). Freeze BytesMut into Bytes. No IO, data decode, checksum or suffix validation. (rust/lance-file/src/versions/v2_0/writer.rs:928-952)

## Interaction and interpretation limits

All952 physical lines read in ANALYZE56; no source execution or modification. No local test module, unsafe, mutex, task spawn or Drop implementation. FieldEncoder implementations and backend durability/cancellation remain pending; local IO order and non-rollback behavior do not prove current producers exercise every problematic shape. Compatibility tests are separately analyzed; no test pass is claimed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use core::panic;
    5 | use std::collections::HashMap;
    6 | use std::sync::Arc;
    7 | 
    8 | use arrow_array::{ArrayRef, RecordBatch};
    9 | use bytes::{Buf, BufMut, Bytes, BytesMut};
   10 | use futures::StreamExt;
   11 | use futures::stream::FuturesOrdered;
   12 | use lance_core::datatypes::Schema as LanceSchema;
   13 | use lance_core::utils::bit::pad_bytes;
   14 | use lance_core::{Error, Result};
   15 | use lance_encoding::decoder::PageEncoding;
   16 | use lance_encoding::encoder::{
   17 |     ArrayFieldEncodingStrategy, BatchEncoder, EncodeTask, EncodedBatch, EncodedPage,
   18 |     EncodingOptions, FieldEncoder, FieldEncodingStrategy, OutOfLineBuffers,
   19 | };
   20 | use lance_encoding::repdef::RepDefBuilder;
   21 | use lance_io::object_store::ObjectStore;
   22 | use lance_io::traits::Writer as ObjectWriter;
   23 | use log::{debug, warn};
   24 | use object_store::path::Path;
   25 | use prost::Message;
   26 | use prost_types::Any;
   27 | use tokio::io::AsyncWrite;
   28 | use tokio::io::AsyncWriteExt;
   29 | use tracing::instrument;
   30 | 
   31 | use crate::datatypes::FieldsWithMeta;
   32 | use crate::format::MAGIC;
   33 | use crate::format::pb;
   34 | use crate::format::pbfile;
   35 | use crate::format::pbfile::DirectEncoding;
   36 | use crate::writer::{
   37 |     ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, ExpectedTypes, FileWriteSummary, FileWriterOptions,
   38 |     PAGE_BUFFER_ALIGNMENT,
   39 | };
   40 | 
   41 | const PAD_BUFFER: [u8; PAGE_BUFFER_ALIGNMENT] = [72; PAGE_BUFFER_ALIGNMENT];
   42 | // In 2.1+, we split large pages on read instead of write to avoid empty pages
   43 | // and small pages issues. However, we keep the write-time limit at 32MB to avoid
   44 | // potential regressions in 2.0 format readers.
   45 | //
   46 | // This limit is not applied in the 2.1 writer
   47 | const MAX_PAGE_BYTES: usize = 32 * 1024 * 1024;
   48 | // Total in-memory budget for buffering serialized page metadata before flushing
   49 | // to the spill file. Divided evenly across columns (with a floor of 64 bytes).
   50 | const DEFAULT_SPILL_BUFFER_LIMIT: usize = 256 * 1024;
   51 | 
   52 | /// Spills serialized page metadata to a temporary file to bound memory usage.
   53 | ///
   54 | /// The spill file is an unstructured sequence of "chunks". Each chunk is a
   55 | /// contiguous run of length-delimited protobuf `Page` messages belonging to a
   56 | /// single column. Chunks from different columns are interleaved in the order
   57 | /// they are flushed (i.e. whenever a column's in-memory buffer exceeds
   58 | /// `per_column_limit`). The `column_chunks` index records the (offset, length)
   59 | /// of every chunk so each column's pages can be read back and reassembled in
   60 | /// order.
   61 | struct PageMetadataSpill {
   62 |     writer: Box<dyn ObjectWriter>,
   63 |     object_store: Arc<ObjectStore>,
   64 |     path: Path,
   65 |     /// Current write position in the spill file.
   66 |     position: u64,
   67 |     /// Per-column buffer of serialized (length-delimited protobuf) page metadata
   68 |     /// that has not yet been flushed to the spill file.
   69 |     column_buffers: Vec<Vec<u8>>,
   70 |     /// Per-column list of chunks that have been flushed to the spill file.
   71 |     /// Each entry is (offset, length) pointing into the spill file.
   72 |     column_chunks: Vec<Vec<(u64, u32)>>,
   73 |     /// Maximum bytes to buffer per column before flushing to the spill file.
   74 |     per_column_limit: usize,
   75 | }
   76 | 
   77 | impl PageMetadataSpill {
   78 |     async fn new(object_store: Arc<ObjectStore>, path: Path, num_columns: usize) -> Result<Self> {
   79 |         let writer = object_store.create(&path).await?;
   80 |         let per_column_limit = (DEFAULT_SPILL_BUFFER_LIMIT / num_columns.max(1)).max(64);
   81 |         Ok(Self {
   82 |             writer,
   83 |             object_store,
   84 |             path,
   85 |             position: 0,
   86 |             column_buffers: vec![Vec::new(); num_columns],
   87 |             column_chunks: vec![Vec::new(); num_columns],
   88 |             per_column_limit,
   89 |         })
   90 |     }
   91 | 
   92 |     async fn append_page(
   93 |         &mut self,
   94 |         column_idx: usize,
   95 |         page: &pbfile::column_metadata::Page,
   96 |     ) -> Result<()> {
   97 |         page.encode_length_delimited(&mut self.column_buffers[column_idx])
   98 |             .map_err(|e| {
   99 |                 Error::io_source(Box::new(std::io::Error::new(
  100 |                     std::io::ErrorKind::InvalidData,
  101 |                     e,
  102 |                 )))
  103 |             })?;
  104 |         if self.column_buffers[column_idx].len() >= self.per_column_limit {
  105 |             self.flush_column(column_idx).await?;
  106 |         }
  107 |         Ok(())
  108 |     }
  109 | 
  110 |     async fn flush_column(&mut self, column_idx: usize) -> Result<()> {
  111 |         let buf = &self.column_buffers[column_idx];
  112 |         if buf.is_empty() {
  113 |             return Ok(());
  114 |         }
  115 |         let len = buf.len();
  116 |         self.writer.write_all(buf).await?;
  117 |         self.column_chunks[column_idx].push((self.position, len as u32));
  118 |         self.position += len as u64;
  119 |         self.column_buffers[column_idx].clear();
  120 |         Ok(())
  121 |     }
  122 | 
  123 |     async fn shutdown_writer(&mut self) -> Result<()> {
  124 |         for col_idx in 0..self.column_buffers.len() {
  125 |             self.flush_column(col_idx).await?;
  126 |         }
  127 |         ObjectWriter::shutdown(self.writer.as_mut()).await?;
  128 |         Ok(())
  129 |     }
  130 | }
  131 | 
  132 | fn decode_spilled_chunk(data: &Bytes) -> Result<Vec<pbfile::column_metadata::Page>> {
  133 |     let mut pages = Vec::new();
  134 |     let mut cursor = data.clone();
  135 |     while cursor.has_remaining() {
  136 |         let page =
  137 |             pbfile::column_metadata::Page::decode_length_delimited(&mut cursor).map_err(|e| {
  138 |                 Error::io_source(Box::new(std::io::Error::new(
  139 |                     std::io::ErrorKind::InvalidData,
  140 |                     e,
  141 |                 )))
  142 |             })?;
  143 |         pages.push(page);
  144 |     }
  145 |     Ok(pages)
  146 | }
  147 | 
  148 | enum PageSpillState {
  149 |     Pending(Arc<ObjectStore>, Path),
  150 |     Active(PageMetadataSpill),
  151 | }
  152 | 
  153 | /// A writer for the Lance v2.0 file grammar.
  154 | pub struct Writer {
  155 |     writer: Box<dyn ObjectWriter>,
  156 |     schema: Option<LanceSchema>,
  157 |     expected_types: Option<ExpectedTypes>,
  158 |     column_writers: Vec<Box<dyn FieldEncoder>>,
  159 |     column_metadata: Vec<pbfile::ColumnMetadata>,
  160 |     field_id_to_column_indices: Vec<(u32, u32)>,
  161 |     num_columns: u32,
  162 |     rows_written: u64,
  163 |     // The number of rows written for each top-level field (i.e. each entry in
  164 |     // `column_writers`). With `write_batch` every field advances together and
  165 |     // these are all equal, but `write_column` advances one field at a time, so
  166 |     // a single file may end up with columns of differing item counts.
  167 |     field_rows_written: Vec<u64>,
  168 |     global_buffers: Vec<(u64, u64)>,
  169 |     schema_metadata: HashMap<String, String>,
  170 |     encoding_strategy: Box<dyn FieldEncodingStrategy>,
  171 |     options: FileWriterOptions,
  172 |     page_spill: Option<PageSpillState>,
  173 | }
  174 | 
  175 | fn initial_column_metadata() -> pbfile::ColumnMetadata {
  176 |     pbfile::ColumnMetadata {
  177 |         pages: Vec::new(),
  178 |         buffer_offsets: Vec::new(),
  179 |         buffer_sizes: Vec::new(),
  180 |         encoding: None,
  181 |     }
  182 | }
  183 | 
  184 | impl Writer {
  185 |     /// Create a new v2.0 writer with a desired output schema.
  186 |     pub fn try_new(
  187 |         object_writer: Box<dyn ObjectWriter>,
  188 |         schema: LanceSchema,
  189 |         options: FileWriterOptions,
  190 |     ) -> Result<Self> {
  191 |         let mut writer = Self::new_lazy(object_writer, options);
  192 |         writer.initialize(schema)?;
  193 |         Ok(writer)
  194 |     }
  195 | 
  196 |     /// Create a new v2.0 writer without a desired output schema.
  197 |     ///
  198 |     /// The output schema will be set based on the first batch of data to arrive.
  199 |     /// If no data arrives and the writer is finished then the write will fail.
  200 |     pub fn new_lazy(object_writer: Box<dyn ObjectWriter>, options: FileWriterOptions) -> Self {
  201 |         Self {
  202 |             writer: object_writer,
  203 |             schema: None,
  204 |             expected_types: None,
  205 |             column_writers: Vec::new(),
  206 |             column_metadata: Vec::new(),
  207 |             num_columns: 0,
  208 |             rows_written: 0,
  209 |             field_rows_written: Vec::new(),
  210 |             field_id_to_column_indices: Vec::new(),
  211 |             global_buffers: Vec::new(),
  212 |             schema_metadata: HashMap::new(),
  213 |             page_spill: None,
  214 |             encoding_strategy: Box::new(ArrayFieldEncodingStrategy::new()),
  215 |             options,
  216 |         }
  217 |     }
  218 | 
  219 |     /// Spill page metadata to a sidecar file instead of accumulating in memory.
  220 |     ///
  221 |     /// This can dramatically reduce memory usage when many writers are open
  222 |     /// concurrently (e.g. IVF shuffle with thousands of partition writers).
  223 |     /// The sidecar file is created lazily on the first page write. The caller
  224 |     /// is responsible for cleaning up `path` (e.g. by placing it in a temp
  225 |     /// directory that is removed via RAII).
  226 |     pub fn with_page_metadata_spill(mut self, object_store: Arc<ObjectStore>, path: Path) -> Self {
  227 |         self.page_spill = Some(PageSpillState::Pending(object_store, path));
  228 |         self
  229 |     }
  230 | 
  231 |     async fn do_write_buffer(writer: &mut (impl AsyncWrite + Unpin), buf: &[u8]) -> Result<()> {
  232 |         writer.write_all(buf).await?;
  233 |         let pad_bytes = pad_bytes::<PAGE_BUFFER_ALIGNMENT>(buf.len());
  234 |         writer.write_all(&PAD_BUFFER[..pad_bytes]).await?;
  235 |         Ok(())
  236 |     }
  237 | 
  238 |     async fn write_page(&mut self, encoded_page: EncodedPage) -> Result<()> {
  239 |         let buffers = encoded_page.data;
  240 |         let mut buffer_offsets = Vec::with_capacity(buffers.len());
  241 |         let mut buffer_sizes = Vec::with_capacity(buffers.len());
  242 |         for buffer in buffers {
  243 |             buffer_offsets.push(self.writer.tell().await? as u64);
  244 |             buffer_sizes.push(buffer.len() as u64);
  245 |             Self::do_write_buffer(&mut self.writer, &buffer).await?;
  246 |         }
  247 |         let encoded_encoding = match encoded_page.description {
  248 |             PageEncoding::Legacy(array_encoding) => Any::from_msg(&array_encoding)?.encode_to_vec(),
  249 |             PageEncoding::Structural(page_layout) => Any::from_msg(&page_layout)?.encode_to_vec(),
  250 |         };
  251 |         let page = pbfile::column_metadata::Page {
  252 |             buffer_offsets,
  253 |             buffer_sizes,
  254 |             encoding: Some(pbfile::Encoding {
  255 |                 location: Some(pbfile::encoding::Location::Direct(DirectEncoding {
  256 |                     encoding: encoded_encoding,
  257 |                 })),
  258 |             }),
  259 |             length: encoded_page.num_rows,
  260 |             priority: encoded_page.row_number,
  261 |         };
  262 |         let col_idx = encoded_page.column_idx as usize;
  263 |         if matches!(&self.page_spill, Some(PageSpillState::Pending(..))) {
  264 |             let Some(PageSpillState::Pending(store, path)) = self.page_spill.take() else {
  265 |                 unreachable!()
  266 |             };
  267 |             self.page_spill = Some(PageSpillState::Active(
  268 |                 PageMetadataSpill::new(store, path, self.num_columns as usize).await?,
  269 |             ));
  270 |         }
  271 |         match &mut self.page_spill {
  272 |             Some(PageSpillState::Active(spill)) => spill.append_page(col_idx, &page).await?,
  273 |             None => self.column_metadata[col_idx].pages.push(page),
  274 |             Some(PageSpillState::Pending(..)) => unreachable!(),
  275 |         }
  276 |         Ok(())
  277 |     }
  278 | 
  279 |     #[instrument(skip_all, level = "debug")]
  280 |     async fn write_pages(&mut self, mut encoding_tasks: FuturesOrdered<EncodeTask>) -> Result<()> {
  281 |         // As soon as an encoding task is done we write it.  There is no parallelism
  282 |         // needed here because "writing" is really just submitting the buffer to the
  283 |         // underlying write scheduler (either the OS or object_store's scheduler for
  284 |         // cloud writes).  The only time we might truly await on write_page is if the
  285 |         // scheduler's write queue is full.
  286 |         //
  287 |         // Also, there is no point in trying to make write_page parallel anyways
  288 |         // because we wouldn't want buffers getting mixed up across pages.
  289 |         while let Some(encoding_task) = encoding_tasks.next().await {
  290 |             let encoded_page = encoding_task?;
  291 |             self.write_page(encoded_page).await?;
  292 |         }
  293 |         // Flushing here reaps any upload that has already failed, so the error
  294 |         // is attributed to this batch rather than to whichever later batch or
  295 |         // the shutdown happens to poll the writer next. It does not wait for
  296 |         // in-flight uploads: those are spawned tasks the runtime drives on its
  297 |         // own, and blocking on them would stall the next batch behind them.
  298 |         self.writer.flush().await?;
  299 |         Ok(())
  300 |     }
  301 | 
  302 |     /// Schedule batches of data to be written to the file
  303 |     pub async fn write_batches(
  304 |         &mut self,
  305 |         batches: impl Iterator<Item = &RecordBatch>,
  306 |     ) -> Result<()> {
  307 |         for batch in batches {
  308 |             self.write_batch(batch).await?;
  309 |         }
  310 |         Ok(())
  311 |     }
  312 | 
  313 |     fn prepare_field_arrays(
  314 |         &mut self,
  315 |         field_arrays: Vec<(usize, ArrayRef)>,
  316 |     ) -> Result<Vec<(usize, ArrayRef)>> {
  317 |         field_arrays
  318 |             .into_iter()
  319 |             .map(|(field_idx, array)| {
  320 |                 let array = self.column_writers[field_idx].prepare_array(array)?;
  321 |                 Ok((field_idx, array))
  322 |             })
  323 |             .collect()
  324 |     }
  325 | 
  326 |     fn initialize(&mut self, mut schema: LanceSchema) -> Result<()> {
  327 |         self.options.validate()?;
  328 |         let cache_bytes_per_column = if let Some(data_cache_bytes) = self.options.data_cache_bytes {
  329 |             data_cache_bytes / schema.fields.len() as u64
  330 |         } else {
  331 |             8 * 1024 * 1024
  332 |         };
  333 | 
  334 |         let max_page_bytes = self.options.max_page_bytes.unwrap_or_else(|| {
  335 |             std::env::var(ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES)
  336 |                 .map(|s| {
  337 |                     s.parse::<u64>().unwrap_or_else(|e| {
  338 |                         warn!(
  339 |                             "Failed to parse {}: {}, using default",
  340 |                             ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, e
  341 |                         );
  342 |                         MAX_PAGE_BYTES as u64
  343 |                     })
  344 |                 })
  345 |                 .unwrap_or(MAX_PAGE_BYTES as u64)
  346 |         });
  347 | 
  348 |         schema.validate()?;
  349 | 
  350 |         let keep_original_array = self.options.keep_original_array.unwrap_or(false);
  351 |         let encoding_options = EncodingOptions {
  352 |             cache_bytes_per_column,
  353 |             max_page_bytes,
  354 |             keep_original_array,
  355 |             buffer_alignment: PAGE_BUFFER_ALIGNMENT as u64,
  356 |         };
  357 |         let encoder =
  358 |             BatchEncoder::try_new(&schema, self.encoding_strategy.as_ref(), &encoding_options)?;
  359 |         self.num_columns = encoder.num_columns();
  360 | 
  361 |         self.field_rows_written = vec![0; encoder.field_encoders.len()];
  362 |         self.column_writers = encoder.field_encoders;
  363 |         self.column_metadata = vec![initial_column_metadata(); self.num_columns as usize];
  364 |         self.field_id_to_column_indices = encoder.field_id_to_column_index;
  365 |         self.schema_metadata
  366 |             .extend(std::mem::take(&mut schema.metadata));
  367 |         self.schema = Some(schema);
  368 |         Ok(())
  369 |     }
  370 | 
  371 |     fn ensure_initialized(&mut self, batch: &RecordBatch) -> Result<&LanceSchema> {
  372 |         if self.schema.is_none() {
  373 |             let schema = LanceSchema::try_from(batch.schema().as_ref())?;
  374 |             self.initialize(schema)?;
  375 |         }
  376 |         Ok(self.schema.as_ref().unwrap())
  377 |     }
  378 | 
  379 |     fn field_arrays(&self, batch: &RecordBatch) -> Result<Vec<(usize, ArrayRef)>> {
  380 |         self.schema
  381 |             .as_ref()
  382 |             .unwrap()
  383 |             .fields
  384 |             .iter()
  385 |             .enumerate()
  386 |             .map(|(field_idx, field)| {
  387 |                 let array =
  388 |                     batch
  389 |                         .column_by_name(&field.name)
  390 |                         .ok_or(Error::invalid_input_source(
  391 |                             format!(
  392 |                                 "Cannot write batch.  The batch was missing the column `{}`",
  393 |                                 field.name
  394 |                             )
  395 |                             .into(),
  396 |                         ))?;
  397 |                 Ok((field_idx, array.clone()))
  398 |             })
  399 |             .collect()
  400 |     }
  401 | 
  402 |     // Encode a set of `(field index, array)` pairs, each advancing only its own
  403 |     // column. Each task captures its field's current row offset at encode time,
  404 |     // so `advance_columns` must run after this call (never before); the order of
  405 |     // the returned tasks relative to `write_pages` does not matter.
  406 |     fn encode_columns(
  407 |         &mut self,
  408 |         field_arrays: &[(usize, ArrayRef)],
  409 |         external_buffers: &mut OutOfLineBuffers,
  410 |     ) -> Result<Vec<Vec<EncodeTask>>> {
  411 |         // Snapshot the starting row number of each field before borrowing the
  412 |         // column writers mutably below.
  413 |         let row_numbers = field_arrays
  414 |             .iter()
  415 |             .map(|(field_idx, _)| self.field_rows_written[*field_idx])
  416 |             .collect::<Vec<_>>();
  417 |         field_arrays
  418 |             .iter()
  419 |             .zip(row_numbers)
  420 |             .map(|((field_idx, array), row_number)| {
  421 |                 let repdef = RepDefBuilder::default();
  422 |                 let num_rows = array.len() as u64;
  423 |                 self.column_writers[*field_idx].maybe_encode(
  424 |                     array.clone(),
  425 |                     external_buffers,
  426 |                     repdef,
  427 |                     row_number,
  428 |                     num_rows,
  429 |                 )
  430 |             })
  431 |             .collect::<Result<Vec<_>>>()
  432 |     }
  433 | 
  434 |     // Advance the per-field row counters after a set of columns has been
  435 |     // written, keeping `rows_written` (the file's logical length) in sync as the
  436 |     // longest column. Only the written fields move, so their new totals fold into
  437 |     // `rows_written` directly without rescanning every field. (`write_batch`
  438 |     // advances every field uniformly and tracks this inline instead.)
  439 |     fn advance_columns(&mut self, field_arrays: &[(usize, ArrayRef)]) {
  440 |         for (field_idx, array) in field_arrays {
  441 |             let new_total = self.field_rows_written[*field_idx] + array.len() as u64;
  442 |             self.field_rows_written[*field_idx] = new_total;
  443 |             self.rows_written = self.rows_written.max(new_total);
  444 |         }
  445 |     }
  446 | 
  447 |     /// Schedule a batch of data to be written to the file
  448 |     ///
  449 |     /// Note: the future returned by this method may complete before the data has been fully
  450 |     /// flushed to the file (some data may be in the data cache or the I/O cache)
  451 |     pub async fn write_batch(&mut self, batch: &RecordBatch) -> Result<()> {
  452 |         debug!(
  453 |             "write_batch called with {} rows, {} columns, and {} bytes of data",
  454 |             batch.num_rows(),
  455 |             batch.num_columns(),
  456 |             batch.get_array_memory_size()
  457 |         );
  458 |         self.ensure_initialized(batch)?;
  459 |         let schema = self
  460 |             .schema
  461 |             .as_ref()
  462 |             .expect("ensure_initialized sets the schema");
  463 |         self.expected_types
  464 |             .get_or_insert_with(|| ExpectedTypes::new(schema))
  465 |             .check_batch(batch)?;
  466 |         let field_arrays = self.field_arrays(batch)?;
  467 |         let field_arrays = self.prepare_field_arrays(field_arrays)?;
  468 |         let num_rows = batch.num_rows() as u64;
  469 |         if num_rows == 0 {
  470 |             return Ok(());
  471 |         }
  472 |         if num_rows > u32::MAX as u64 {
  473 |             return Err(Error::invalid_input_source(
  474 |                 "cannot write Lance files with more than 2^32 rows".into(),
  475 |             ));
  476 |         }
  477 |         // First we push each array into its column writer.  This may or may not generate enough
  478 |         // data to trigger an encoding task.  We collect any encoding tasks into a queue.
  479 |         let mut external_buffers =
  480 |             OutOfLineBuffers::new(self.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  481 |         let encoding_tasks = self.encode_columns(&field_arrays, &mut external_buffers)?;
  482 |         // Next, write external buffers
  483 |         for external_buffer in external_buffers.take_buffers() {
  484 |             Self::do_write_buffer(&mut self.writer, &external_buffer).await?;
  485 |         }
  486 | 
  487 |         let encoding_tasks = encoding_tasks
  488 |             .into_iter()
  489 |             .flatten()
  490 |             .collect::<FuturesOrdered<_>>();
  491 | 
  492 |         // `write_batch` advances every field by the same amount, so the longest
  493 |         // column simply grows by `num_rows`. Guard against overflowing the row
  494 |         // counter.
  495 |         if self.rows_written.checked_add(num_rows).is_none() {
  496 |             return Err(Error::invalid_input_source(format!("cannot write batch with {} rows because {} rows have already been written and Lance files cannot contain more than 2^64 rows", num_rows, self.rows_written).into()));
  497 |         }
  498 |         for field_rows in self.field_rows_written.iter_mut() {
  499 |             *field_rows += num_rows;
  500 |         }
  501 |         self.rows_written += num_rows;
  502 | 
  503 |         self.write_pages(encoding_tasks).await?;
  504 | 
  505 |         Ok(())
  506 |     }
  507 | 
  508 |     /// Write a single column, advancing only that column's row counter.
  509 |     ///
  510 |     /// Unlike [`write_batch`](Self::write_batch), which advances every column
  511 |     /// from a single shared row counter, this method advances one column
  512 |     /// independently. Used across calls it produces a single file whose columns
  513 |     /// may have different item counts.
  514 |     ///
  515 |     /// `column_index` refers to a top-level field in the writer's schema (the
  516 |     /// same order as the schema's fields); a nested child cannot be targeted on
  517 |     /// its own. Because each call writes the whole field from a single array, the
  518 |     /// children of a struct field always advance together and stay equal-length;
  519 |     /// only different top-level fields can diverge in length. A column may be
  520 |     /// written across multiple calls; its values are appended. A field that is
  521 |     /// never written ends up as a zero-length column. The writer must have been
  522 |     /// created with an explicit schema (via [`try_new`](Self::try_new)); a lazy
  523 |     /// schema cannot be inferred here because individual calls need not cover
  524 |     /// every field.
  525 |     ///
  526 |     /// ```
  527 |     /// # use arrow_array::{ArrayRef, Int32Array};
  528 |     /// # use std::sync::Arc;
  529 |     /// # use lance_file::writer::FileWriter;
  530 |     /// # async fn example(writer: &mut FileWriter) -> lance_core::Result<()> {
  531 |     /// // Field 0 gets three values, field 1 gets one — a non-rectangular file.
  532 |     /// writer.write_column(0, Arc::new(Int32Array::from(vec![1, 2, 3]))).await?;
  533 |     /// writer.write_column(1, Arc::new(Int32Array::from(vec![10]))).await?;
  534 |     /// # Ok(())
  535 |     /// # }
  536 |     /// ```
  537 |     pub async fn write_column(&mut self, column_index: usize, array: ArrayRef) -> Result<()> {
  538 |         let schema = self.schema.as_ref().ok_or_else(|| {
  539 |             Error::invalid_input_source(
  540 |                 "write_column requires the writer to be created with an explicit schema".into(),
  541 |             )
  542 |         })?;
  543 |         if column_index >= schema.fields.len() {
  544 |             return Err(Error::invalid_input_source(
  545 |                 format!(
  546 |                     "write_column: field index {} is out of bounds (schema has {} fields)",
  547 |                     column_index,
  548 |                     schema.fields.len()
  549 |                 )
  550 |                 .into(),
  551 |             ));
  552 |         }
  553 |         if array.len() as u64 > u32::MAX as u64 {
  554 |             return Err(Error::invalid_input_source(
  555 |                 "cannot write Lance files with more than 2^32 rows".into(),
  556 |             ));
  557 |         }
  558 |         self.expected_types
  559 |             .get_or_insert_with(|| ExpectedTypes::new(schema))
  560 |             .check_column(column_index, &array)?;
  561 |         let array = self.column_writers[column_index].prepare_array(array)?;
  562 | 
  563 |         // A never-advanced field simply remains a zero-length column, which the
  564 |         // encoders handle at `finish` time.
  565 |         if array.is_empty() {
  566 |             return Ok(());
  567 |         }
  568 | 
  569 |         let columns = [(column_index, array)];
  570 |         let mut external_buffers =
  571 |             OutOfLineBuffers::new(self.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  572 |         let encoding_tasks = self.encode_columns(&columns, &mut external_buffers)?;
  573 |         for external_buffer in external_buffers.take_buffers() {
  574 |             Self::do_write_buffer(&mut self.writer, &external_buffer).await?;
  575 |         }
  576 |         let encoding_tasks = encoding_tasks
  577 |             .into_iter()
  578 |             .flatten()
  579 |             .collect::<FuturesOrdered<_>>();
  580 | 
  581 |         self.advance_columns(&columns);
  582 |         self.write_pages(encoding_tasks).await?;
  583 |         Ok(())
  584 |     }
  585 | 
  586 |     async fn write_column_metadata(
  587 |         &mut self,
  588 |         metadata: pbfile::ColumnMetadata,
  589 |     ) -> Result<(u64, u64)> {
  590 |         let metadata_bytes = metadata.encode_to_vec();
  591 |         let position = self.writer.tell().await? as u64;
  592 |         let len = metadata_bytes.len() as u64;
  593 |         self.writer.write_all(&metadata_bytes).await?;
  594 |         Ok((position, len))
  595 |     }
  596 | 
  597 |     async fn write_column_metadatas(&mut self) -> Result<Vec<(u64, u64)>> {
  598 |         let metadatas = std::mem::take(&mut self.column_metadata);
  599 | 
  600 |         // If spilling, finalize the spill writer and reopen for reading.
  601 |         // The spill file itself is cleaned up by the caller (it lives in a
  602 |         // temp directory managed by the caller's RAII guard).
  603 |         let spill_state = self.page_spill.take();
  604 |         let (spill_chunks, spill_reader) =
  605 |             if let Some(PageSpillState::Active(mut spill)) = spill_state {
  606 |                 spill.shutdown_writer().await?;
  607 |                 let reader = spill.object_store.open(&spill.path).await?;
  608 |                 let chunks = std::mem::take(&mut spill.column_chunks);
  609 |                 (chunks, Some(reader))
  610 |             } else {
  611 |                 (Vec::new(), None)
  612 |             };
  613 | 
  614 |         let mut metadata_positions = Vec::with_capacity(metadatas.len());
  615 |         for (col_idx, mut metadata) in metadatas.into_iter().enumerate() {
  616 |             if let Some(reader) = &spill_reader {
  617 |                 let mut pages = Vec::new();
  618 |                 for &(offset, len) in &spill_chunks[col_idx] {
  619 |                     let data = reader
  620 |                         .get_range(offset as usize..(offset as usize + len as usize))
  621 |                         .await
  622 |                         .map_err(|e| Error::io_source(Box::new(e)))?;
  623 |                     pages.extend(decode_spilled_chunk(&data)?);
  624 |                 }
  625 |                 metadata.pages = pages;
  626 |             }
  627 |             metadata_positions.push(self.write_column_metadata(metadata).await?);
  628 |         }
  629 | 
  630 |         Ok(metadata_positions)
  631 |     }
  632 | 
  633 |     fn make_file_descriptor(
  634 |         schema: &lance_core::datatypes::Schema,
  635 |         num_rows: u64,
  636 |     ) -> Result<pb::FileDescriptor> {
  637 |         let fields_with_meta = FieldsWithMeta::from(schema);
  638 |         Ok(pb::FileDescriptor {
  639 |             schema: Some(pb::Schema {
  640 |                 fields: fields_with_meta.fields.0,
  641 |                 metadata: fields_with_meta.metadata,
  642 |             }),
  643 |             length: num_rows,
  644 |         })
  645 |     }
  646 | 
  647 |     async fn write_global_buffers(&mut self) -> Result<Vec<(u64, u64)>> {
  648 |         let schema = self.schema.as_mut().ok_or(Error::invalid_input("No schema provided on writer open and no data provided.  Schema is unknown and file cannot be created"))?;
  649 |         schema.metadata = std::mem::take(&mut self.schema_metadata);
  650 |         // Use descriptor layout for blob v2 fields in the footer to avoid exposing logical child fields.
  651 |         schema
  652 |             .fields
  653 |             .iter_mut()
  654 |             .for_each(|f| f.unload_blobs_recursive());
  655 | 
  656 |         let file_descriptor = Self::make_file_descriptor(schema, self.rows_written)?;
  657 |         let file_descriptor_bytes = file_descriptor.encode_to_vec();
  658 |         let file_descriptor_len = file_descriptor_bytes.len() as u64;
  659 |         let file_descriptor_position = self.writer.tell().await? as u64;
  660 |         self.writer.write_all(&file_descriptor_bytes).await?;
  661 |         let mut gbo_table = Vec::with_capacity(1 + self.global_buffers.len());
  662 |         gbo_table.push((file_descriptor_position, file_descriptor_len));
  663 |         gbo_table.append(&mut self.global_buffers);
  664 |         Ok(gbo_table)
  665 |     }
  666 | 
  667 |     /// Add a metadata entry to the schema
  668 |     ///
  669 |     /// This method is useful because sometimes the metadata is not known until after the
  670 |     /// data has been written.  This method allows you to alter the schema metadata.  It
  671 |     /// must be called before `finish` is called.
  672 |     pub fn add_schema_metadata(&mut self, key: impl Into<String>, value: impl Into<String>) {
  673 |         self.schema_metadata.insert(key.into(), value.into());
  674 |     }
  675 | 
  676 |     /// Prepare the writer when column data and metadata were produced externally.
  677 |     ///
  678 |     /// This is useful for flows that copy already-encoded pages (e.g., binary copy
  679 |     /// during compaction) where the column buffers have been written directly and we
  680 |     /// only need to write the footer and schema metadata. The provided
  681 |     /// `column_metadata` must describe the buffers already persisted by the
  682 |     /// underlying `ObjectWriter`, and `rows_written` should reflect the total number
  683 |     /// of rows in those buffers.
  684 |     pub fn initialize_with_external_metadata(
  685 |         &mut self,
  686 |         mut schema: lance_core::datatypes::Schema,
  687 |         column_metadata: Vec<pbfile::ColumnMetadata>,
  688 |         rows_written: u64,
  689 |     ) {
  690 |         self.schema_metadata
  691 |             .extend(std::mem::take(&mut schema.metadata));
  692 |         self.schema = Some(schema);
  693 |         self.num_columns = column_metadata.len() as u32;
  694 |         self.column_metadata = column_metadata;
  695 |         self.rows_written = rows_written;
  696 |     }
  697 | 
  698 |     /// Adds a global buffer to the file
  699 |     ///
  700 |     /// The global buffer can contain any arbitrary bytes.  It will be written to the disk
  701 |     /// immediately.  This method returns the index of the global buffer (this will always
  702 |     /// start at 1 and increment by 1 each time this method is called)
  703 |     pub async fn add_global_buffer(&mut self, buffer: Bytes) -> Result<u32> {
  704 |         let position = self.writer.tell().await? as u64;
  705 |         let len = buffer.len() as u64;
  706 |         Self::do_write_buffer(&mut self.writer, &buffer).await?;
  707 |         self.global_buffers.push((position, len));
  708 |         Ok(self.global_buffers.len() as u32)
  709 |     }
  710 | 
  711 |     async fn finish_writers(&mut self) -> Result<()> {
  712 |         let mut col_idx = 0;
  713 |         for mut writer in std::mem::take(&mut self.column_writers) {
  714 |             let mut external_buffers =
  715 |                 OutOfLineBuffers::new(self.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  716 |             let columns = writer.finish(&mut external_buffers).await?;
  717 |             for buffer in external_buffers.take_buffers() {
  718 |                 self.writer.write_all(&buffer).await?;
  719 |             }
  720 |             debug_assert_eq!(
  721 |                 columns.len(),
  722 |                 writer.num_columns() as usize,
  723 |                 "Expected {} columns from column at index {} and got {}",
  724 |                 writer.num_columns(),
  725 |                 col_idx,
  726 |                 columns.len()
  727 |             );
  728 |             for column in columns {
  729 |                 for page in column.final_pages {
  730 |                     self.write_page(page).await?;
  731 |                 }
  732 |                 let column_metadata = &mut self.column_metadata[col_idx];
  733 |                 let mut buffer_pos = self.writer.tell().await? as u64;
  734 |                 for buffer in column.column_buffers {
  735 |                     column_metadata.buffer_offsets.push(buffer_pos);
  736 |                     let mut size = 0;
  737 |                     Self::do_write_buffer(&mut self.writer, &buffer).await?;
  738 |                     size += buffer.len() as u64;
  739 |                     buffer_pos += size;
  740 |                     column_metadata.buffer_sizes.push(size);
  741 |                 }
  742 |                 let encoded_encoding = Any::from_msg(&column.encoding)?.encode_to_vec();
  743 |                 column_metadata.encoding = Some(pbfile::Encoding {
  744 |                     location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
  745 |                         encoding: encoded_encoding,
  746 |                     })),
  747 |                 });
  748 |                 col_idx += 1;
  749 |             }
  750 |         }
  751 |         if col_idx != self.column_metadata.len() {
  752 |             panic!(
  753 |                 "Column writers finished with {} columns but we expected {}",
  754 |                 col_idx,
  755 |                 self.column_metadata.len()
  756 |             );
  757 |         }
  758 |         Ok(())
  759 |     }
  760 | 
  761 |     /// Finishes writing the file
  762 |     ///
  763 |     /// This method will wait until all data has been flushed to the file.  Then it
  764 |     /// will write the file metadata and the footer.  It will not return until all
  765 |     /// data has been flushed and the file has been closed.
  766 |     ///
  767 |     /// Returns a summary of the completed file write.
  768 |     pub async fn finish(&mut self) -> Result<FileWriteSummary> {
  769 |         // 1. flush any remaining data and write out those pages
  770 |         let mut external_buffers =
  771 |             OutOfLineBuffers::new(self.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  772 |         let encoding_tasks = self
  773 |             .column_writers
  774 |             .iter_mut()
  775 |             .map(|writer| writer.flush(&mut external_buffers))
  776 |             .collect::<Result<Vec<_>>>()?;
  777 |         for external_buffer in external_buffers.take_buffers() {
  778 |             Self::do_write_buffer(&mut self.writer, &external_buffer).await?;
  779 |         }
  780 |         let encoding_tasks = encoding_tasks
  781 |             .into_iter()
  782 |             .flatten()
  783 |             .collect::<FuturesOrdered<_>>();
  784 |         self.write_pages(encoding_tasks).await?;
  785 | 
  786 |         if !self.column_writers.is_empty() {
  787 |             self.finish_writers().await?;
  788 |         }
  789 | 
  790 |         // 3. write global buffers (we write the schema here)
  791 |         let global_buffer_offsets = self.write_global_buffers().await?;
  792 |         let num_global_buffers = global_buffer_offsets.len() as u32;
  793 | 
  794 |         // 4. write the column metadatas
  795 |         let column_metadata_start = self.writer.tell().await? as u64;
  796 |         let metadata_positions = self.write_column_metadatas().await?;
  797 | 
  798 |         // 5. write the column metadata offset table
  799 |         let cmo_table_start = self.writer.tell().await? as u64;
  800 |         for (meta_pos, meta_len) in metadata_positions {
  801 |             self.writer.write_u64_le(meta_pos).await?;
  802 |             self.writer.write_u64_le(meta_len).await?;
  803 |         }
  804 | 
  805 |         // 6. write global buffers offset table
  806 |         let gbo_table_start = self.writer.tell().await? as u64;
  807 |         for (gbo_pos, gbo_len) in global_buffer_offsets {
  808 |             self.writer.write_u64_le(gbo_pos).await?;
  809 |             self.writer.write_u64_le(gbo_len).await?;
  810 |         }
  811 | 
  812 |         // 7. write the footer
  813 |         self.writer.write_u64_le(column_metadata_start).await?;
  814 |         self.writer.write_u64_le(cmo_table_start).await?;
  815 |         self.writer.write_u64_le(gbo_table_start).await?;
  816 |         self.writer.write_u32_le(num_global_buffers).await?;
  817 |         self.writer.write_u32_le(self.num_columns).await?;
  818 |         self.writer.write_u16_le(0).await?;
  819 |         self.writer.write_u16_le(3).await?;
  820 |         self.writer.write_all(MAGIC).await?;
  821 | 
  822 |         // 7. close the writer
  823 |         let write_result = ObjectWriter::shutdown(self.writer.as_mut()).await?;
  824 | 
  825 |         Ok(FileWriteSummary {
  826 |             num_rows: self.rows_written,
  827 |             size_bytes: write_result.size as u64,
  828 |         })
  829 |     }
  830 | 
  831 |     pub async fn abort(&mut self) {
  832 |         // For multipart uploads, ObjectWriter's Drop impl will abort
  833 |         // the upload when the writer is dropped.
  834 |     }
  835 | 
  836 |     pub async fn tell(&mut self) -> Result<u64> {
  837 |         Ok(self.writer.tell().await? as u64)
  838 |     }
  839 | 
  840 |     /// Append a buffer whose metadata is supplied by the caller.
  841 |     pub async fn write_external_buffer(&mut self, bytes: &[u8]) -> Result<(u64, u64)> {
  842 |         let start = self.tell().await?;
  843 |         self.writer.write_all(bytes).await?;
  844 |         Ok((start, bytes.len() as u64))
  845 |     }
  846 | 
  847 |     pub fn field_id_to_column_indices(&self) -> &[(u32, u32)] {
  848 |         &self.field_id_to_column_indices
  849 |     }
  850 | }
  851 | 
  852 | // Creates a lance footer and appends it to the encoded data
  853 | //
  854 | // The logic here is very similar to logic in the FileWriter except we
  855 | // are using BufMut (put_xyz) instead of AsyncWrite (write_xyz).
  856 | pub fn concat_lance_footer(batch: &EncodedBatch, write_schema: bool) -> Result<Bytes> {
  857 |     // Estimating 1MiB for file footer
  858 |     let mut data = BytesMut::with_capacity(batch.data.len() + 1024 * 1024);
  859 |     data.put(batch.data.clone());
  860 |     // write global buffers (we write the schema here)
  861 |     let global_buffers = if write_schema {
  862 |         let schema_start = data.len() as u64;
  863 |         let lance_schema = lance_core::datatypes::Schema::try_from(batch.schema.as_ref())?;
  864 |         let descriptor = Writer::make_file_descriptor(&lance_schema, batch.num_rows)?;
  865 |         let descriptor_bytes = descriptor.encode_to_vec();
  866 |         let descriptor_len = descriptor_bytes.len() as u64;
  867 |         data.put(descriptor_bytes.as_slice());
  868 | 
  869 |         vec![(schema_start, descriptor_len)]
  870 |     } else {
  871 |         vec![]
  872 |     };
  873 |     let col_metadata_start = data.len() as u64;
  874 | 
  875 |     let mut col_metadata_positions = Vec::new();
  876 |     // Write column metadata
  877 |     for col in &batch.page_table {
  878 |         let position = data.len() as u64;
  879 |         let pages = col
  880 |             .page_infos
  881 |             .iter()
  882 |             .map(|page_info| {
  883 |                 let encoded_encoding = match &page_info.encoding {
  884 |                     PageEncoding::Legacy(array_encoding) => {
  885 |                         Any::from_msg(array_encoding)?.encode_to_vec()
  886 |                     }
  887 |                     PageEncoding::Structural(page_layout) => {
  888 |                         Any::from_msg(page_layout)?.encode_to_vec()
  889 |                     }
  890 |                 };
  891 |                 let (buffer_offsets, buffer_sizes): (Vec<_>, Vec<_>) = page_info
  892 |                     .buffer_offsets_and_sizes
  893 |                     .as_ref()
  894 |                     .iter()
  895 |                     .cloned()
  896 |                     .unzip();
  897 |                 Ok(pbfile::column_metadata::Page {
  898 |                     buffer_offsets,
  899 |                     buffer_sizes,
  900 |                     encoding: Some(pbfile::Encoding {
  901 |                         location: Some(pbfile::encoding::Location::Direct(DirectEncoding {
  902 |                             encoding: encoded_encoding,
  903 |                         })),
  904 |                     }),
  905 |                     length: page_info.num_rows,
  906 |                     priority: page_info.priority,
  907 |                 })
  908 |             })
  909 |             .collect::<Result<Vec<_>>>()?;
  910 |         let (buffer_offsets, buffer_sizes): (Vec<_>, Vec<_>) =
  911 |             col.buffer_offsets_and_sizes.iter().cloned().unzip();
  912 |         let encoded_col_encoding = Any::from_msg(&col.encoding)?.encode_to_vec();
  913 |         let column = pbfile::ColumnMetadata {
  914 |             pages,
  915 |             buffer_offsets,
  916 |             buffer_sizes,
  917 |             encoding: Some(pbfile::Encoding {
  918 |                 location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
  919 |                     encoding: encoded_col_encoding,
  920 |                 })),
  921 |             }),
  922 |         };
  923 |         let column_bytes = column.encode_to_vec();
  924 |         col_metadata_positions.push((position, column_bytes.len() as u64));
  925 |         data.put(column_bytes.as_slice());
  926 |     }
  927 |     // Write column metadata offsets table
  928 |     let cmo_table_start = data.len() as u64;
  929 |     for (meta_pos, meta_len) in col_metadata_positions {
  930 |         data.put_u64_le(meta_pos);
  931 |         data.put_u64_le(meta_len);
  932 |     }
  933 |     // Write global buffers offsets table
  934 |     let gbo_table_start = data.len() as u64;
  935 |     let num_global_buffers = global_buffers.len() as u32;
  936 |     for (gbo_pos, gbo_len) in global_buffers {
  937 |         data.put_u64_le(gbo_pos);
  938 |         data.put_u64_le(gbo_len);
  939 |     }
  940 | 
  941 |     // write the footer
  942 |     data.put_u64_le(col_metadata_start);
  943 |     data.put_u64_le(cmo_table_start);
  944 |     data.put_u64_le(gbo_table_start);
  945 |     data.put_u32_le(num_global_buffers);
  946 |     data.put_u32_le(batch.page_table.len() as u32);
  947 |     data.put_u16_le(2);
  948 |     data.put_u16_le(0);
  949 |     data.put(MAGIC.as_slice());
  950 | 
  951 |     Ok(data.freeze())
  952 | }
``````
