> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-file/src/writer/structural.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9b51f75404617f9d0031f49f4b43f11134a743de11e1d7ee7cbfbb4ce1ec685d`. Reviewed physical lines: 1-1025.

[Module](../../../../../L1-modules/rust-lance-file-structural-writer.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Crate-internal structural writer mechanisms shared by exact V2_1/V2_2/V2_3 wrappers. Public declarations here are effectively crate-visible through writer::structural. StructuralFileSink owns object IO, metadata/spill and offset tables; EncodingPipeline owns schema, field encoders, runtime options and row accounting. Private spill/descriptor/nullability helpers and four local tests complete the file. (rust/lance-file/src/writer/structural.rs:1-1025)

## Complete range analysis

### Lines 1-40

SPDX/imports include panic macro, HashMap/Arc, Arrow array/struct reconstruction, BooleanBuffer, Bytes cursors/mutation, FuturesOrdered, core schema/errors/padding, encoding pages/tasks/options/out-of-line buffers and RepDefBuilder, ObjectStore/Writer, logs, path, prost Message/Any, Tokio AsyncWrite and tracing. Local file adapters supply schema protobuf and runtime constants. (rust/lance-file/src/writer/structural.rs:1-40)

### Lines 41-49

PAD_BUFFER is64 bytes each decimal72 (0x48), using PAGE_BUFFER_ALIGNMENT. MAX_PAGE_BYTES is32MiB; comment calls it best-effort memory bound because V2.1+ splits reads. DEFAULT_SPILL_BUFFER_LIMIT is256KiB serialized page metadata, not a global heap cap. Alignment declaration is rust/lance-file/src/writer.rs:24-24. (rust/lance-file/src/writer/structural.rs:41-49)

### Lines 50-74

Private PageMetadataSpill owns sidecar writer/store/path, logical position, per-column serialized byte Vecs and chunk descriptor Vecs, plus threshold. Async new creates sidecar first, then threshold=max(256KiB/max(num_columns,1),64) and empty vectors of num_columns. Many columns can exceed the nominal aggregate budget due to64 minimum, retained capacities and chunk descriptors; no column count validation or sidecar exclusivity check is local. (rust/lance-file/src/writer/structural.rs:50-74)

### Lines 75-92

append_page directly indexes the column buffer, protobuf length-delimited encodes one Page, wraps encoding failures as IO with std::io InvalidData, and flushes once buffer length reaches/exceeds threshold. It can overshoot by one whole page; index is trusted and panic-capable. No page sort or deduplication. (rust/lance-file/src/writer/structural.rs:75-92)

### Lines 93-113

flush_column returns immediately if empty; otherwise write_all current bytes, then record(position,len as u32), advance position by len as u64 and clear the Vec without releasing capacity. Casts/addition are unchecked. Failed/partial writes leave the buffer and recorded position unchanged, so retry is not guaranteed safe. shutdown_writer flushes columns sequentially, awaits ObjectWriter::shutdown, discards summary. (rust/lance-file/src/writer/structural.rs:93-113)

### Lines 114-131

decode_spilled_chunk clones Bytes handle into a cursor, repeatedly decodes length-delimited Page until no bytes remain, collecting all decoded pages in Vec. Decode errors become IO/InvalidData; earlier pages are discarded on error. Empty bytes return empty pages. It checks protobuf syntax only, not page grammar or buffer addresses. (rust/lance-file/src/writer/structural.rs:114-131)

### Lines 132-145

Private PageSpillState is Pending(store,path) or Active(PageMetadataSpill), with absence represented by outer Option. initial_column_metadata returns empty page/offset/size Vecs and encoding=None. No Drop cleanup, committed state or default page encoding here. (rust/lance-file/src/writer/structural.rs:132-145)

### Lines 146-169

StructuralFileSink owns object writer, complete column metadata Vec, u32 declared column count, user global-buffer descriptors and optional spill state. new stores writer, zero count and empty state; no IO or validation. Documentation explicitly delegates exact grammar/composition/footer ordering to callers. (rust/lance-file/src/writer/structural.rs:146-169)

### Lines 170-186

with_page_metadata_spill unconditionally replaces prior spill state with Pending. initialize_columns replaces column metadata with blank entries and updates count; initialize_with_external_metadata replaces metadata and unchecked-casts Vec length to u32. Neither resets global buffers/spill, migrates existing pages, checks state, or validates external encodings. Reconfiguring an active/populated sink can lose previously retained metadata. (rust/lance-file/src/writer/structural.rs:170-186)

### Lines 187-205

write_aligned_buffer_to writes payload then pad_bytes<64>(payload.len) copies of0x48; it aligns length, not current starting position. write_aligned_buffer delegates through object writer, and write_raw writes only payload. Empty payload requires no pad. A misaligned current position is not repaired by post-padding; both write calls may fail after partial mutation. (rust/lance-file/src/writer/structural.rs:187-205)

### Lines 206-230

write_page consumes EncodedPage data, records tell before each payload, stores unpadded length and writes with trailing alignment. After all payload bytes, prost Any-wrap Legacy or Structural description without restricting version/grammar. Construct Direct encoding Page with num_rows as length and row_number as priority, then unchecked-cast physical column index to usize. Serialization failure can follow already-written data. (rust/lance-file/src/writer/structural.rs:206-230)

### Lines 231-246

On the first page after configuring Pending, take the pending state, asynchronously create a sidecar sized to current num_columns and install Active. Failure/cancellation during creation leaves page_spill None after data was written. Active appends page; None pushes into column_metadata[column_index]; unreachable branches enforce immediately checked private states. Bounds are trusted. Pages retained before spill activation are not copied into sidecar. (rust/lance-file/src/writer/structural.rs:231-246)

### Lines 247-261

Debug-instrumented write_pages owns FuturesOrdered<EncodeTask>, polls ordered results and writes each successful page sequentially. An error drops remaining task futures and returns without the final flush; underlying spawned work is not established here. After all tasks (even none), await AsyncWriteExt::flush. Source comment says this reaps already-failed uploads without waiting for in-flight ones; actual backend poll_flush implementation remains pending, so flush is not asserted durable. (rust/lance-file/src/writer/structural.rs:247-261)

### Lines 262-278

write_column_buffer_at writes a length-padded payload at current writer position, then records the caller-supplied position and original length under column index. It never seeks or checks supplied position against tell. set_column_encoding overwrites Some(encoding) in the indexed metadata. Both trust index; metadata may be mutated only after some bytes are already written. (rust/lance-file/src/writer/structural.rs:262-278)

### Lines 279-286

add_global_buffer captures current position, writes payload with trailing0x48 padding, appends(position,unpadded length) and returns Vec length cast u32. This is a one-based user index because descriptor is inserted first later; no overflow or initial-position alignment check. Buffer may be empty. (rust/lance-file/src/writer/structural.rs:279-286)

### Lines 287-311

write_global_buffers serializes descriptor and writes it raw at current position, then returns descriptor tuple first followed by draining all user-global tuples. User global payloads were already written earlier. Descriptor has no length prefix or trailing padding. Private write_column_metadata likewise writes raw protobuf bytes at current position and returns position/length; no CRC, outer prefix or alignment. (rust/lance-file/src/writer/structural.rs:287-311)

### Lines 312-324

write_column_metadatas takes all column metadata and spill state out of self before awaits. Active spill flushes/shuts down its writer, opens sidecar for reading, and takes chunk vectors; Pending/None produce no reader. Failure loses these taken in-memory states from the sink and can leave a sidecar object. No retry/rollback guard or explicit sidecar deletion is implemented. (rust/lance-file/src/writer/structural.rs:312-324)

### Lines 325-342

For each column in order, Active spill reads every recorded chunk sequentially via unchecked usize range arithmetic, decodes all pages and accumulates one complete column Vec. Replace metadata.pages with that Vec, discarding any pages retained before spill activation/external initialization. Serialize/write whole column, push position. Peak memory still includes full-column pages and serialized bytes plus chunk descriptors; spill does not stream one page into final metadata. No sidecar cleanup after success. (rust/lance-file/src/writer/structural.rs:325-342)

### Lines 343-351

write_offset_table records start and writes every(position,len) as two LEu64 values, sixteen bytes per entry. Empty table emits nothing and returns current position. No count prefix, padding, overflow validation or bounds checks. (rust/lance-file/src/writer/structural.rs:343-351)

### Lines 352-362

write_external_buffer computes leading zero padding from current position modulo64, writes that padding then payload raw, and returns aligned start plus unpadded length. This differs from ordinary trailing0x48 padding: its ending can be unaligned. Position cast to usize and additions are unchecked. A later ordinary aligned-buffer write assumes the caller has restored an aligned starting position. (rust/lance-file/src/writer/structural.rs:352-362)

### Lines 363-380

output_mut exposes mutable dyn ObjectWriter to crate callers; tell casts backend position to u64. num_columns returns stored count even after metadata is drained. shutdown awaits ObjectWriter::shutdown and returns summary.size cast u64, discarding other summary fields. No local closed-state tracking or automatic abort. (rust/lance-file/src/writer/structural.rs:363-380)

### Lines 381-413

EncodingPipeline privately stores optional schema/ExpectedTypes, owned field encoder Vec, mapping Vec, aggregate rows, per-field rows, schema metadata map and FileWriterOptions. new initializes empty/zero state without validating options. validate_options simply delegates FileWriterOptions::validate (only explicit max_page_bytes=Some(0) rejected at rust/lance-file/src/writer.rs:56-65). (rust/lance-file/src/writer/structural.rs:381-413)

### Lines 414-432

encoding_options divides supplied data_cache_bytes by top-level schema.fields.len, truncating remainder; empty schema with a supplied budget divides by zero. Otherwise use8MiB per top-level field. Explicit max_page_bytes wins; else read LANCE_FILE_WRITER_MAX_PAGE_BYTES and parse untrimmed u64, warning on parse failure then32MiB; missing/non-Unicode env also falls back without warning. Parsed0 is accepted because explicit-options validation occurred separately. No environment memoization. (rust/lance-file/src/writer/structural.rs:414-432)

### Lines 433-455

EncodingOptions receives derived budgets, keep_original_array defaultfalse and alignment64. This differs from raw EncodingOptions::default keep_original_array=true (rust/lance-encoding/src/encoder.rs:277-285). initialize sets sink physical column count, zeroes field-row vector, moves encoder Vec/mapping, merges drained schema metadata into existing map (schema keys win), then stores schema. It does not reset rows_written or cached expected_types; normal wrappers call it once. (rust/lance-file/src/writer/structural.rs:433-455)

### Lines 456-480

is_initialized tests only schema presence, not encoders or sink state. verify_field_nullability starts recursive validation with every slot reachable. Comments explain null struct parents hide child nulls and dictionary logical nulls may exist without physical key nulls; external Arrow behavior is rationale, while the implementation below explicitly uses logical_nulls. (rust/lance-file/src/writer/structural.rs:456-480)

### Lines 481-499

Recursive nullability computes logical_nulls; absent mask means0 offending, top-level uses null_count, otherwise count((NOT validity) AND reachable). A nonnullable field with visible nulls returns InvalidInput naming the field, not the count/path. Empty field.children ends recursion. Counts/masks assume array shape consistent with field. (rust/lance-file/src/writer/structural.rs:481-499)

### Lines 500-514

For any non-StructArray with children, zip declared children with ArrayData.child_data, clone/reconstruct each child Array and recurse with reachable=None. Parent reachability is deliberately not propagated across list-like offsets. Zip ignores unmatched tails; this helper does not independently enforce child count/type. It checks all exposed child-data slots, not only referenced list positions. (rust/lance-file/src/writer/structural.rs:500-514)

### Lines 515-534

For StructArray, own validity is logical mask or all-set BooleanBuffer of parent length. Child reachability is own AND inherited mask, or own at root. Zip schema children with parent.columns and recurse in order, stopping at first error. Sliced StructArray columns already align to parent window per source comment and local test. Child-count mismatch is not checked here. (rust/lance-file/src/writer/structural.rs:515-534)

### Lines 535-545

verify_nullability_constraints zips batch.columns in supplied positional order with stored schema.fields and recursively checks each pair. It unwraps initialized schema. Unlike ExpectedTypes::check_batch and encode_batch, it does not match top-level names; reordered input can therefore be checked against a different field nullability. Extra/missing positional tails are ignored by zip; separate type/encoding stages own other validation. (rust/lance-file/src/writer/structural.rs:535-545)

### Lines 546-569

encode_columns first copies each selected field current row number into a Vec, then iterates fields in order and calls that mutable encoder maybe_encode with cloned Arc array, shared out-of-line buffer planner, fresh default RepDefBuilder, old row number and array length. Direct indexing trusts field/encoder/count coherence. Collect Result<Vec<Vec<EncodeTask>>>; later failure does not roll back earlier encoder mutations or external-buffer reservations. (rust/lance-file/src/writer/structural.rs:546-569)

### Lines 570-597

encode_batch builds field/index/ArrayRef pairs by stored schema order and batch.column_by_name. Missing field gives InvalidInput naming it before any maybe_encode call, because all lookups collect first. Extra batch columns are omitted here. The schema Option unwrap assumes initialization; ArrayRef cloning shares input data, and actual copy/retain policy is delegated to encoders. (rust/lance-file/src/writer/structural.rs:570-597)

### Lines 598-627

Debug-instrumented write_batch logs dimensions/memory estimate, expects initialized schema, lazily builds ExpectedTypes and checks types, then positional nullability. Zero rows return only after these checks. Each individual batch above u32MAX rows is rejected, despite diagnostic phrasing about whole files; cumulative count uses u64 later. An empty batch can return before missing-name detection in encode_batch. (rust/lance-file/src/writer/structural.rs:598-627)

### Lines 628-650

Start OutOfLineBuffers at sink tell/alignment64, synchronously build encoder tasks, write all reserved buffers with trailing padding, flatten tasks into FuturesOrdered. Only then checked_add aggregate u64 rows; overflow returns InvalidInput after encoder mutation and possible buffer IO. On success increment every field counter and aggregate before awaiting page writes. Page/flush failure leaves those counters advanced; no transactional retry guarantee. Per-field increments are unchecked arithmetic. (rust/lance-file/src/writer/structural.rs:628-650)

### Lines 651-677

write_column requires schema presence or InvalidInput mentioning explicit schema (a previously initialized lazy writer also satisfies actual check). Get top-level field by index with contextual bounds error; reject this array length above u32MAX before type/nullability validation. No inference from a bare array. (rust/lance-file/src/writer/structural.rs:651-677)

### Lines 678-704

Lazily build ExpectedTypes, check selected column type, then logical nullability; empty arrays return afterward. Encode singleton field with out-of-line planner, write reserved buffers, order tasks, then unchecked-add selected field count and set aggregate rows=max(old aggregate,new field total) before awaiting pages. Other fields unchanged and differing lengths permitted; no cumulative overflow check here. External-metadata initialization alone may leave encoder/count vectors empty and make a later nonempty column write panic on indexing. (rust/lance-file/src/writer/structural.rs:678-704)

### Lines 705-724

flush obtains current tell, calls every field encoder flush sequentially into a fallible task Vec, writes returned out-of-line buffers with trailing padding and drains flattened ordered tasks via sink.write_pages. It does not advance row counters or finish encoders. With zero encoders it still asks position and flushes writer through empty task drain. Partial encoder/IO state is not restored after failure. (rust/lance-file/src/writer/structural.rs:705-724)

### Lines 725-744

finish_encoders returns immediately if no encoders. Otherwise std::mem::take removes all encoders from self, then each writer.finish is awaited with a fresh OutOfLineBuffers planner. Returned external buffers are written raw, unlike batch/flush aligned writes. Planner advances virtual positions including padding but does not insert padding into buffer payloads (rust/lance-encoding/src/encoder.rs:130-159); correctness of multiple unaligned finish buffers therefore depends on producer invariants. Debug assertion compares emitted count to each encoder num_columns after IO. (rust/lance-file/src/writer/structural.rs:725-744)

### Lines 745-768

For each finished column, write final pages then set buffer_position=tell once. Each column buffer is written with trailing padding but recorded position advances only by raw buffer.len; two unaligned buffers can produce recorded offsets different from actual later starts. No seek/check or padding adjustment here. Any-wrap column encoding into Direct, set metadata, increment physical column_index. Final pages carry their own column indices; they are not rewritten to this counter. (rust/lance-file/src/writer/structural.rs:745-768)

### Lines 769-789

After all encoders, mismatching physical count panics with expected/actual even in release builds. Success does not validate row equality. add_schema_metadata replaces duplicate key. initialize_with_external_metadata drains/merges schema metadata, stores schema and rows_written only; existing encoders, expected-types cache, mapping and field counters remain unchanged. It returns unit and bypasses validation. (rust/lance-file/src/writer/structural.rs:769-789)

### Lines 790-812

make_file_descriptor errors InvalidInput if schema absent. Otherwise move accumulated metadata back into schema, recursively unload blobs in place, and call private descriptor builder with aggregate rows. This mutates schema before later IO; repeated calls can replace metadata with empty drained map. rows_written getter returns aggregate; field_id_to_column_indices borrows mapping with no consistency check. (rust/lance-file/src/writer/structural.rs:790-812)

### Lines 813-833

Private make_file_descriptor converts borrowed core Schema through FieldsWithMeta, builds Some(pb::Schema) and declared length, always Ok locally. No row reconciliation or schema validation. Public-in-crate EncodedBatchBody holds BytesMut plus threeu64 start offsets and two u32 counts for exact wrapper footer append; it carries no version. (rust/lance-file/src/writer/structural.rs:813-833)

### Lines 834-851

encode_batch_body reserves batch.data.len+1MiB with unchecked addition, copies full data into BytesMut, optionally clones batch core Schema via TryFrom<&Self>, serializes descriptor and appends it raw, recording one global entry; otherwise globals empty. No blob-unload transformation or Schema::validate is performed by this conversion (rust/lance-core/src/datatypes/schema.rs:922-927). Descriptor starts immediately after supplied bytes with no alignment repair. Column metadata start follows. (rust/lance-file/src/writer/structural.rs:834-851)

### Lines 852-883

For each page-table column in input order, record current byte position, Any-wrap each Legacy/Structural PageEncoding into Direct, copy all supplied offset/size pairs and preserve num_rows/priority. Collect pages fallibly. No version grammar, bounds, buffer-content or alignment validation and no descriptor relocation; offsets must already be relative to the unchanged data prefix. (rust/lance-file/src/writer/structural.rs:852-883)

### Lines 884-901

Copy column buffer descriptors, Any-wrap column encoding, serialize full ColumnMetadata and append raw bytes, retaining(position,length). Page-table Arc values are borrowed; page/descriptor Vecs and encoded bytes allocate copies. ColumnInfo.index is ignored; output ordering is Vec order. (rust/lance-file/src/writer/structural.rs:884-901)

### Lines 902-923

Append column offset table then global offset table using LEu64 position,length pairs; counts cast unchecked to u32. Return body with original starts and column count page_table.len. No footer, count prefix, checksum or IO here. Mini mode has no global entry and may have coincident global-table/footer start. Extra batch.top_level_columns mapping is unused. (rust/lance-file/src/writer/structural.rs:902-923)

### Lines 924-956

cfg(test) private tests import Arrow/null/schema and EncodingPipeline. analysis helper constructs nullable Boolean child with caller values under parent validity, but declared Lance schema marks changed child nonnullable and analysis parent nullable. Arrow child itself is nullable so fixture can represent invalid visible nulls. It returns ArrayRef and converted Schema; all construction unwraps. (rust/lance-file/src/writer/structural.rs:924-956)

### Lines 957-968

child_nulls_under_a_null_parent_are_writable uses four rows with parent validity true,false,true,false and child true,null,false,null; only calls recursive nullability and unwraps. It proves local hidden-null acceptance in this fixture, not actual file roundtrip or encoder success. (rust/lance-file/src/writer/structural.rs:957-968)

### Lines 969-982

child_nulls_under_a_valid_parent_are_still_rejected makes second parent valid while keeping child null; expect_err then checks message contains changed. It does not assert Error variant or count. Fourth hidden null remains present. (rust/lance-file/src/writer/structural.rs:969-982)

### Lines 983-1014

Dictionary test builds Int32 values[10,null], keys[0,1,null], parent validity[true,true,false], actual nullable code child and declared nonnullable code child. Visible key1 logical null must error; row2 physical null is masked. Assert message contains code only, not variant. It exercises helper logical_nulls, no persistence or backend IO. (rust/lance-file/src/writer/structural.rs:983-1014)

### Lines 1015-1025

Sliced-parent test uses four Boolean rows, parent validity true,false,true,true then slices offset1 length3. The first remaining null parent hides child null and helper must succeed. No nested-list, reordered-top-level-batch, spill, abort, overflow, footer or IO test in this module. (rust/lance-file/src/writer/structural.rs:1015-1025)

## Interaction and interpretation limits

All 1,025 physical lines read in ANALYZE55. Explicit source operations and deductions about ordering, padding and partial mutation are documented; no runtime failure or performance measurement is claimed. Underlying FieldEncoder/RepDef/compression algorithms and ObjectWriter backend durability/Drop/flush remain pending. There is no explicit unsafe block, local task spawn, synchronization lock or cleanup-on-drop implementation in this file. Test source was read, not executed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use core::panic;
    5 | use std::{collections::HashMap, sync::Arc};
    6 | 
    7 | use arrow_array::{Array, ArrayRef, RecordBatch, StructArray, make_array};
    8 | use arrow_buffer::BooleanBuffer;
    9 | use bytes::{Buf, Bytes, BytesMut};
   10 | use futures::{StreamExt, stream::FuturesOrdered};
   11 | use lance_core::{
   12 |     Error, Result,
   13 |     datatypes::{Field, Schema},
   14 |     utils::bit::pad_bytes,
   15 | };
   16 | use lance_encoding::{
   17 |     decoder::PageEncoding,
   18 |     encoder::{
   19 |         BatchEncoder, EncodeTask, EncodedBatch, EncodedPage, EncodingOptions, FieldEncoder,
   20 |         OutOfLineBuffers,
   21 |     },
   22 |     repdef::RepDefBuilder,
   23 | };
   24 | use lance_io::{object_store::ObjectStore, traits::Writer as ObjectWriter};
   25 | use log::{debug, warn};
   26 | use object_store::path::Path;
   27 | use prost::Message;
   28 | use prost_types::Any;
   29 | use tokio::io::{AsyncWrite, AsyncWriteExt};
   30 | use tracing::instrument;
   31 | 
   32 | use crate::{
   33 |     datatypes::FieldsWithMeta,
   34 |     format::{pb, pbfile},
   35 |     writer::{
   36 |         ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, ExpectedTypes, FileWriterOptions,
   37 |         PAGE_BUFFER_ALIGNMENT,
   38 |     },
   39 | };
   40 | 
   41 | const PAD_BUFFER: [u8; PAGE_BUFFER_ALIGNMENT] = [72; PAGE_BUFFER_ALIGNMENT];
   42 | 
   43 | // V2.1+ splits large pages on read instead of write. This write-time limit is
   44 | // retained as a best-effort memory bound and is not a grammar decision.
   45 | const MAX_PAGE_BYTES: usize = 32 * 1024 * 1024;
   46 | 
   47 | // Total in-memory budget for serialized page metadata before spill.
   48 | const DEFAULT_SPILL_BUFFER_LIMIT: usize = 256 * 1024;
   49 | 
   50 | struct PageMetadataSpill {
   51 |     writer: Box<dyn ObjectWriter>,
   52 |     object_store: Arc<ObjectStore>,
   53 |     path: Path,
   54 |     position: u64,
   55 |     column_buffers: Vec<Vec<u8>>,
   56 |     column_chunks: Vec<Vec<(u64, u32)>>,
   57 |     per_column_limit: usize,
   58 | }
   59 | 
   60 | impl PageMetadataSpill {
   61 |     async fn new(object_store: Arc<ObjectStore>, path: Path, num_columns: usize) -> Result<Self> {
   62 |         let writer = object_store.create(&path).await?;
   63 |         let per_column_limit = (DEFAULT_SPILL_BUFFER_LIMIT / num_columns.max(1)).max(64);
   64 |         Ok(Self {
   65 |             writer,
   66 |             object_store,
   67 |             path,
   68 |             position: 0,
   69 |             column_buffers: vec![Vec::new(); num_columns],
   70 |             column_chunks: vec![Vec::new(); num_columns],
   71 |             per_column_limit,
   72 |         })
   73 |     }
   74 | 
   75 |     async fn append_page(
   76 |         &mut self,
   77 |         column_index: usize,
   78 |         page: &pbfile::column_metadata::Page,
   79 |     ) -> Result<()> {
   80 |         page.encode_length_delimited(&mut self.column_buffers[column_index])
   81 |             .map_err(|error| {
   82 |                 Error::io_source(Box::new(std::io::Error::new(
   83 |                     std::io::ErrorKind::InvalidData,
   84 |                     error,
   85 |                 )))
   86 |             })?;
   87 |         if self.column_buffers[column_index].len() >= self.per_column_limit {
   88 |             self.flush_column(column_index).await?;
   89 |         }
   90 |         Ok(())
   91 |     }
   92 | 
   93 |     async fn flush_column(&mut self, column_index: usize) -> Result<()> {
   94 |         let buffer = &self.column_buffers[column_index];
   95 |         if buffer.is_empty() {
   96 |             return Ok(());
   97 |         }
   98 |         let len = buffer.len();
   99 |         self.writer.write_all(buffer).await?;
  100 |         self.column_chunks[column_index].push((self.position, len as u32));
  101 |         self.position += len as u64;
  102 |         self.column_buffers[column_index].clear();
  103 |         Ok(())
  104 |     }
  105 | 
  106 |     async fn shutdown_writer(&mut self) -> Result<()> {
  107 |         for column_index in 0..self.column_buffers.len() {
  108 |             self.flush_column(column_index).await?;
  109 |         }
  110 |         ObjectWriter::shutdown(self.writer.as_mut()).await?;
  111 |         Ok(())
  112 |     }
  113 | }
  114 | 
  115 | fn decode_spilled_chunk(data: &Bytes) -> Result<Vec<pbfile::column_metadata::Page>> {
  116 |     let mut pages = Vec::new();
  117 |     let mut cursor = data.clone();
  118 |     while cursor.has_remaining() {
  119 |         let page = pbfile::column_metadata::Page::decode_length_delimited(&mut cursor).map_err(
  120 |             |error| {
  121 |                 Error::io_source(Box::new(std::io::Error::new(
  122 |                     std::io::ErrorKind::InvalidData,
  123 |                     error,
  124 |                 )))
  125 |             },
  126 |         )?;
  127 |         pages.push(page);
  128 |     }
  129 |     Ok(pages)
  130 | }
  131 | 
  132 | enum PageSpillState {
  133 |     Pending(Arc<ObjectStore>, Path),
  134 |     Active(PageMetadataSpill),
  135 | }
  136 | 
  137 | fn initial_column_metadata() -> pbfile::ColumnMetadata {
  138 |     pbfile::ColumnMetadata {
  139 |         pages: Vec::new(),
  140 |         buffer_offsets: Vec::new(),
  141 |         buffer_sizes: Vec::new(),
  142 |         encoding: None,
  143 |     }
  144 | }
  145 | 
  146 | /// Writes the structural page and metadata representation used by v2.1+.
  147 | ///
  148 | /// This component does not choose a file version, field encoding strategy, or
  149 | /// footer identity. Exact version writers opt into this representation and own
  150 | /// the order in which its operations are invoked.
  151 | pub struct StructuralFileSink {
  152 |     writer: Box<dyn ObjectWriter>,
  153 |     column_metadata: Vec<pbfile::ColumnMetadata>,
  154 |     num_columns: u32,
  155 |     global_buffers: Vec<(u64, u64)>,
  156 |     page_spill: Option<PageSpillState>,
  157 | }
  158 | 
  159 | impl StructuralFileSink {
  160 |     pub fn new(writer: Box<dyn ObjectWriter>) -> Self {
  161 |         Self {
  162 |             writer,
  163 |             column_metadata: Vec::new(),
  164 |             num_columns: 0,
  165 |             global_buffers: Vec::new(),
  166 |             page_spill: None,
  167 |         }
  168 |     }
  169 | 
  170 |     pub fn with_page_metadata_spill(&mut self, object_store: Arc<ObjectStore>, path: Path) {
  171 |         self.page_spill = Some(PageSpillState::Pending(object_store, path));
  172 |     }
  173 | 
  174 |     pub fn initialize_columns(&mut self, num_columns: u32) {
  175 |         self.num_columns = num_columns;
  176 |         self.column_metadata = vec![initial_column_metadata(); num_columns as usize];
  177 |     }
  178 | 
  179 |     pub fn initialize_with_external_metadata(
  180 |         &mut self,
  181 |         column_metadata: Vec<pbfile::ColumnMetadata>,
  182 |     ) {
  183 |         self.num_columns = column_metadata.len() as u32;
  184 |         self.column_metadata = column_metadata;
  185 |     }
  186 | 
  187 |     async fn write_aligned_buffer_to(
  188 |         writer: &mut (impl AsyncWrite + Unpin),
  189 |         buffer: &[u8],
  190 |     ) -> Result<()> {
  191 |         writer.write_all(buffer).await?;
  192 |         let padding = pad_bytes::<PAGE_BUFFER_ALIGNMENT>(buffer.len());
  193 |         writer.write_all(&PAD_BUFFER[..padding]).await?;
  194 |         Ok(())
  195 |     }
  196 | 
  197 |     pub async fn write_aligned_buffer(&mut self, buffer: &[u8]) -> Result<()> {
  198 |         Self::write_aligned_buffer_to(&mut self.writer, buffer).await
  199 |     }
  200 | 
  201 |     pub async fn write_raw(&mut self, buffer: &[u8]) -> Result<()> {
  202 |         self.writer.write_all(buffer).await?;
  203 |         Ok(())
  204 |     }
  205 | 
  206 |     pub async fn write_page(&mut self, encoded_page: EncodedPage) -> Result<()> {
  207 |         let buffers = encoded_page.data;
  208 |         let mut buffer_offsets = Vec::with_capacity(buffers.len());
  209 |         let mut buffer_sizes = Vec::with_capacity(buffers.len());
  210 |         for buffer in buffers {
  211 |             buffer_offsets.push(self.tell().await?);
  212 |             buffer_sizes.push(buffer.len() as u64);
  213 |             self.write_aligned_buffer(&buffer).await?;
  214 |         }
  215 |         let encoded_encoding = match encoded_page.description {
  216 |             PageEncoding::Legacy(array_encoding) => Any::from_msg(&array_encoding)?.encode_to_vec(),
  217 |             PageEncoding::Structural(page_layout) => Any::from_msg(&page_layout)?.encode_to_vec(),
  218 |         };
  219 |         let page = pbfile::column_metadata::Page {
  220 |             buffer_offsets,
  221 |             buffer_sizes,
  222 |             encoding: Some(pbfile::Encoding {
  223 |                 location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
  224 |                     encoding: encoded_encoding,
  225 |                 })),
  226 |             }),
  227 |             length: encoded_page.num_rows,
  228 |             priority: encoded_page.row_number,
  229 |         };
  230 |         let column_index = encoded_page.column_idx as usize;
  231 |         if matches!(&self.page_spill, Some(PageSpillState::Pending(..))) {
  232 |             let Some(PageSpillState::Pending(store, path)) = self.page_spill.take() else {
  233 |                 unreachable!()
  234 |             };
  235 |             self.page_spill = Some(PageSpillState::Active(
  236 |                 PageMetadataSpill::new(store, path, self.num_columns as usize).await?,
  237 |             ));
  238 |         }
  239 |         match &mut self.page_spill {
  240 |             Some(PageSpillState::Active(spill)) => spill.append_page(column_index, &page).await?,
  241 |             None => self.column_metadata[column_index].pages.push(page),
  242 |             Some(PageSpillState::Pending(..)) => unreachable!(),
  243 |         }
  244 |         Ok(())
  245 |     }
  246 | 
  247 |     #[instrument(skip_all, level = "debug")]
  248 |     pub async fn write_pages(
  249 |         &mut self,
  250 |         mut encoding_tasks: FuturesOrdered<EncodeTask>,
  251 |     ) -> Result<()> {
  252 |         while let Some(encoding_task) = encoding_tasks.next().await {
  253 |             self.write_page(encoding_task?).await?;
  254 |         }
  255 |         // Reaps any upload that has already failed so the error is attributed to
  256 |         // this batch. This does not wait for in-flight uploads; see
  257 |         // `ObjectWriter::poll_flush`.
  258 |         self.writer.flush().await?;
  259 |         Ok(())
  260 |     }
  261 | 
  262 |     pub async fn write_column_buffer_at(
  263 |         &mut self,
  264 |         column_index: usize,
  265 |         position: u64,
  266 |         buffer: &[u8],
  267 |     ) -> Result<()> {
  268 |         self.write_aligned_buffer(buffer).await?;
  269 |         let metadata = &mut self.column_metadata[column_index];
  270 |         metadata.buffer_offsets.push(position);
  271 |         metadata.buffer_sizes.push(buffer.len() as u64);
  272 |         Ok(())
  273 |     }
  274 | 
  275 |     pub fn set_column_encoding(&mut self, column_index: usize, encoding: pbfile::Encoding) {
  276 |         self.column_metadata[column_index].encoding = Some(encoding);
  277 |     }
  278 | 
  279 |     pub async fn add_global_buffer(&mut self, buffer: Bytes) -> Result<u32> {
  280 |         let position = self.tell().await?;
  281 |         let len = buffer.len() as u64;
  282 |         self.write_aligned_buffer(&buffer).await?;
  283 |         self.global_buffers.push((position, len));
  284 |         Ok(self.global_buffers.len() as u32)
  285 |     }
  286 | 
  287 |     pub async fn write_global_buffers(
  288 |         &mut self,
  289 |         descriptor: pb::FileDescriptor,
  290 |     ) -> Result<Vec<(u64, u64)>> {
  291 |         let descriptor_bytes = descriptor.encode_to_vec();
  292 |         let descriptor_len = descriptor_bytes.len() as u64;
  293 |         let descriptor_position = self.tell().await?;
  294 |         self.writer.write_all(&descriptor_bytes).await?;
  295 |         let mut offsets = Vec::with_capacity(1 + self.global_buffers.len());
  296 |         offsets.push((descriptor_position, descriptor_len));
  297 |         offsets.append(&mut self.global_buffers);
  298 |         Ok(offsets)
  299 |     }
  300 | 
  301 |     async fn write_column_metadata(
  302 |         &mut self,
  303 |         metadata: pbfile::ColumnMetadata,
  304 |     ) -> Result<(u64, u64)> {
  305 |         let metadata_bytes = metadata.encode_to_vec();
  306 |         let position = self.tell().await?;
  307 |         let len = metadata_bytes.len() as u64;
  308 |         self.writer.write_all(&metadata_bytes).await?;
  309 |         Ok((position, len))
  310 |     }
  311 | 
  312 |     pub async fn write_column_metadatas(&mut self) -> Result<Vec<(u64, u64)>> {
  313 |         let metadatas = std::mem::take(&mut self.column_metadata);
  314 |         let spill_state = self.page_spill.take();
  315 |         let (spill_chunks, spill_reader) =
  316 |             if let Some(PageSpillState::Active(mut spill)) = spill_state {
  317 |                 spill.shutdown_writer().await?;
  318 |                 let reader = spill.object_store.open(&spill.path).await?;
  319 |                 let chunks = std::mem::take(&mut spill.column_chunks);
  320 |                 (chunks, Some(reader))
  321 |             } else {
  322 |                 (Vec::new(), None)
  323 |             };
  324 | 
  325 |         let mut metadata_positions = Vec::with_capacity(metadatas.len());
  326 |         for (column_index, mut metadata) in metadatas.into_iter().enumerate() {
  327 |             if let Some(reader) = &spill_reader {
  328 |                 let mut pages = Vec::new();
  329 |                 for &(offset, len) in &spill_chunks[column_index] {
  330 |                     let data = reader
  331 |                         .get_range(offset as usize..(offset as usize + len as usize))
  332 |                         .await
  333 |                         .map_err(|error| Error::io_source(Box::new(error)))?;
  334 |                     pages.extend(decode_spilled_chunk(&data)?);
  335 |                 }
  336 |                 metadata.pages = pages;
  337 |             }
  338 |             metadata_positions.push(self.write_column_metadata(metadata).await?);
  339 |         }
  340 |         Ok(metadata_positions)
  341 |     }
  342 | 
  343 |     pub async fn write_offset_table(&mut self, offsets: &[(u64, u64)]) -> Result<u64> {
  344 |         let start = self.tell().await?;
  345 |         for (position, len) in offsets {
  346 |             self.writer.write_u64_le(*position).await?;
  347 |             self.writer.write_u64_le(*len).await?;
  348 |         }
  349 |         Ok(start)
  350 |     }
  351 | 
  352 |     pub async fn write_external_buffer(&mut self, bytes: &[u8]) -> Result<(u64, u64)> {
  353 |         const ZERO_PADDING: [u8; PAGE_BUFFER_ALIGNMENT] = [0; PAGE_BUFFER_ALIGNMENT];
  354 |         let position = self.tell().await?;
  355 |         let padding = (PAGE_BUFFER_ALIGNMENT - position as usize % PAGE_BUFFER_ALIGNMENT)
  356 |             % PAGE_BUFFER_ALIGNMENT;
  357 |         self.writer.write_all(&ZERO_PADDING[..padding]).await?;
  358 |         let start = position + padding as u64;
  359 |         self.writer.write_all(bytes).await?;
  360 |         Ok((start, bytes.len() as u64))
  361 |     }
  362 | 
  363 |     pub fn output_mut(&mut self) -> &mut dyn ObjectWriter {
  364 |         self.writer.as_mut()
  365 |     }
  366 | 
  367 |     pub async fn tell(&mut self) -> Result<u64> {
  368 |         Ok(self.writer.tell().await? as u64)
  369 |     }
  370 | 
  371 |     pub fn num_columns(&self) -> u32 {
  372 |         self.num_columns
  373 |     }
  374 | 
  375 |     pub async fn shutdown(&mut self) -> Result<u64> {
  376 |         let result = ObjectWriter::shutdown(self.writer.as_mut()).await?;
  377 |         Ok(result.size as u64)
  378 |     }
  379 | }
  380 | 
  381 | /// Runs field encoders and row accounting without selecting a file grammar.
  382 | ///
  383 | /// The exact version writer constructs a [`BatchEncoder`] and supplies it when
  384 | /// a schema is initialized. This component only executes that decision.
  385 | pub struct EncodingPipeline {
  386 |     schema: Option<Schema>,
  387 |     expected_types: Option<ExpectedTypes>,
  388 |     field_encoders: Vec<Box<dyn FieldEncoder>>,
  389 |     field_id_to_column_indices: Vec<(u32, u32)>,
  390 |     rows_written: u64,
  391 |     field_rows_written: Vec<u64>,
  392 |     schema_metadata: HashMap<String, String>,
  393 |     options: FileWriterOptions,
  394 | }
  395 | 
  396 | impl EncodingPipeline {
  397 |     pub fn new(options: FileWriterOptions) -> Self {
  398 |         Self {
  399 |             schema: None,
  400 |             expected_types: None,
  401 |             field_encoders: Vec::new(),
  402 |             field_id_to_column_indices: Vec::new(),
  403 |             rows_written: 0,
  404 |             field_rows_written: Vec::new(),
  405 |             schema_metadata: HashMap::new(),
  406 |             options,
  407 |         }
  408 |     }
  409 | 
  410 |     pub(crate) fn validate_options(&self) -> Result<()> {
  411 |         self.options.validate()
  412 |     }
  413 | 
  414 |     pub fn encoding_options(&self, schema: &Schema) -> EncodingOptions {
  415 |         let cache_bytes_per_column = if let Some(data_cache_bytes) = self.options.data_cache_bytes {
  416 |             data_cache_bytes / schema.fields.len() as u64
  417 |         } else {
  418 |             8 * 1024 * 1024
  419 |         };
  420 |         let max_page_bytes = self.options.max_page_bytes.unwrap_or_else(|| {
  421 |             std::env::var(ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES)
  422 |                 .map(|value| {
  423 |                     value.parse::<u64>().unwrap_or_else(|error| {
  424 |                         warn!(
  425 |                             "Failed to parse {}: {}, using default",
  426 |                             ENV_LANCE_FILE_WRITER_MAX_PAGE_BYTES, error
  427 |                         );
  428 |                         MAX_PAGE_BYTES as u64
  429 |                     })
  430 |                 })
  431 |                 .unwrap_or(MAX_PAGE_BYTES as u64)
  432 |         });
  433 | 
  434 |         EncodingOptions {
  435 |             cache_bytes_per_column,
  436 |             max_page_bytes,
  437 |             keep_original_array: self.options.keep_original_array.unwrap_or(false),
  438 |             buffer_alignment: PAGE_BUFFER_ALIGNMENT as u64,
  439 |         }
  440 |     }
  441 | 
  442 |     pub fn initialize(
  443 |         &mut self,
  444 |         mut schema: Schema,
  445 |         encoder: BatchEncoder,
  446 |         sink: &mut StructuralFileSink,
  447 |     ) {
  448 |         sink.initialize_columns(encoder.num_columns());
  449 |         self.field_rows_written = vec![0; encoder.field_encoders.len()];
  450 |         self.field_encoders = encoder.field_encoders;
  451 |         self.field_id_to_column_indices = encoder.field_id_to_column_index;
  452 |         self.schema_metadata
  453 |             .extend(std::mem::take(&mut schema.metadata));
  454 |         self.schema = Some(schema);
  455 |     }
  456 | 
  457 |     pub fn is_initialized(&self) -> bool {
  458 |         self.schema.is_some()
  459 |     }
  460 | 
  461 |     fn verify_field_nullability(array: &dyn Array, field: &Field) -> Result<()> {
  462 |         Self::verify_field_nullability_where_reachable(array, field, None)
  463 |     }
  464 | 
  465 |     /// `reachable` marks the slots a valid parent can actually see, or `None`
  466 |     /// at the top level where every slot is reachable.
  467 |     ///
  468 |     /// A null struct slot leaves its children undefined, so a child null there
  469 |     /// says nothing about whether the child is nullable. Arrow draws the line
  470 |     /// the same way -- `StructArray::try_new` rejects only nulls in a
  471 |     /// non-nullable child that the parent's null mask does not cover -- and a
  472 |     /// reader is free to hand back nulls under a null parent for a column this
  473 |     /// writer produced with values there. Judging those would make a column
  474 |     /// unwritable after a round trip.
  475 |     ///
  476 |     /// Nulls are read through `logical_nulls`, which is what Arrow validates
  477 |     /// against. A dictionary key pointing at a null value is a null the
  478 |     /// physical validity buffer does not carry, and masking physical validity
  479 |     /// alone would let one through into a file Arrow refuses on readback.
  480 |     fn verify_field_nullability_where_reachable(
  481 |         array: &dyn Array,
  482 |         field: &Field,
  483 |         reachable: Option<&BooleanBuffer>,
  484 |     ) -> Result<()> {
  485 |         let nulls = array.logical_nulls();
  486 |         let offending = match (nulls.as_ref(), reachable) {
  487 |             (None, _) => 0,
  488 |             (Some(nulls), None) => nulls.null_count(),
  489 |             (Some(nulls), Some(reachable)) => (&!nulls.inner() & reachable).count_set_bits(),
  490 |         };
  491 |         if !field.nullable && offending > 0 {
  492 |             return Err(Error::invalid_input(format!(
  493 |                 "The field `{}` contained null values even though the field is marked non-null in the schema",
  494 |                 field.name
  495 |             )));
  496 |         }
  497 |         if field.children.is_empty() {
  498 |             return Ok(());
  499 |         }
  500 |         // Only a struct's children sit one slot per parent slot. List-like
  501 |         // children are addressed through offsets, so the parent's validity
  502 |         // does not map onto them and they are checked as before.
  503 |         let Some(parent) = array.as_any().downcast_ref::<StructArray>() else {
  504 |             for (child_field, child_array) in
  505 |                 field.children.iter().zip(array.to_data().child_data())
  506 |             {
  507 |                 Self::verify_field_nullability_where_reachable(
  508 |                     make_array(child_array.clone()).as_ref(),
  509 |                     child_field,
  510 |                     None,
  511 |                 )?;
  512 |             }
  513 |             return Ok(());
  514 |         };
  515 |         let own = nulls
  516 |             .as_ref()
  517 |             .map(|nulls| nulls.inner().clone())
  518 |             .unwrap_or_else(|| BooleanBuffer::new_set(array.len()));
  519 |         let child_reachable = match reachable {
  520 |             Some(reachable) => &own & reachable,
  521 |             None => own,
  522 |         };
  523 |         // `StructArray::columns` are already cut to the parent's window, so
  524 |         // they line up with a mask built from the parent's slots.
  525 |         for (child_field, child_array) in field.children.iter().zip(parent.columns()) {
  526 |             Self::verify_field_nullability_where_reachable(
  527 |                 child_array.as_ref(),
  528 |                 child_field,
  529 |                 Some(&child_reachable),
  530 |             )?;
  531 |         }
  532 |         Ok(())
  533 |     }
  534 | 
  535 |     fn verify_nullability_constraints(&self, batch: &RecordBatch) -> Result<()> {
  536 |         for (column, field) in batch
  537 |             .columns()
  538 |             .iter()
  539 |             .zip(self.schema.as_ref().unwrap().fields.iter())
  540 |         {
  541 |             Self::verify_field_nullability(column.as_ref(), field)?;
  542 |         }
  543 |         Ok(())
  544 |     }
  545 | 
  546 |     fn encode_columns(
  547 |         &mut self,
  548 |         fields: &[(usize, ArrayRef)],
  549 |         external_buffers: &mut OutOfLineBuffers,
  550 |     ) -> Result<Vec<Vec<EncodeTask>>> {
  551 |         let row_numbers = fields
  552 |             .iter()
  553 |             .map(|(field_index, _)| self.field_rows_written[*field_index])
  554 |             .collect::<Vec<_>>();
  555 |         fields
  556 |             .iter()
  557 |             .zip(row_numbers)
  558 |             .map(|((field_index, array), row_number)| {
  559 |                 self.field_encoders[*field_index].maybe_encode(
  560 |                     array.clone(),
  561 |                     external_buffers,
  562 |                     RepDefBuilder::default(),
  563 |                     row_number,
  564 |                     array.len() as u64,
  565 |                 )
  566 |             })
  567 |             .collect()
  568 |     }
  569 | 
  570 |     fn encode_batch(
  571 |         &mut self,
  572 |         batch: &RecordBatch,
  573 |         external_buffers: &mut OutOfLineBuffers,
  574 |     ) -> Result<Vec<Vec<EncodeTask>>> {
  575 |         let field_arrays = self
  576 |             .schema
  577 |             .as_ref()
  578 |             .unwrap()
  579 |             .fields
  580 |             .iter()
  581 |             .enumerate()
  582 |             .map(|(field_index, field)| {
  583 |                 let array = batch.column_by_name(&field.name).ok_or_else(|| {
  584 |                     Error::invalid_input_source(
  585 |                         format!(
  586 |                             "Cannot write batch.  The batch was missing the column `{}`",
  587 |                             field.name
  588 |                         )
  589 |                         .into(),
  590 |                     )
  591 |                 })?;
  592 |                 Ok((field_index, array.clone()))
  593 |             })
  594 |             .collect::<Result<Vec<_>>>()?;
  595 |         self.encode_columns(&field_arrays, external_buffers)
  596 |     }
  597 | 
  598 |     #[instrument(skip_all, level = "debug")]
  599 |     pub async fn write_batch(
  600 |         &mut self,
  601 |         batch: &RecordBatch,
  602 |         sink: &mut StructuralFileSink,
  603 |     ) -> Result<()> {
  604 |         debug!(
  605 |             "write_batch called with {} rows, {} columns, and {} bytes of data",
  606 |             batch.num_rows(),
  607 |             batch.num_columns(),
  608 |             batch.get_array_memory_size()
  609 |         );
  610 |         let schema = self
  611 |             .schema
  612 |             .as_ref()
  613 |             .expect("the pipeline is initialized before writing");
  614 |         self.expected_types
  615 |             .get_or_insert_with(|| ExpectedTypes::new(schema))
  616 |             .check_batch(batch)?;
  617 |         self.verify_nullability_constraints(batch)?;
  618 |         let num_rows = batch.num_rows() as u64;
  619 |         if num_rows == 0 {
  620 |             return Ok(());
  621 |         }
  622 |         if num_rows > u32::MAX as u64 {
  623 |             return Err(Error::invalid_input_source(
  624 |                 "cannot write Lance files with more than 2^32 rows".into(),
  625 |             ));
  626 |         }
  627 | 
  628 |         let mut external_buffers =
  629 |             OutOfLineBuffers::new(sink.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  630 |         let encoding_tasks = self.encode_batch(batch, &mut external_buffers)?;
  631 |         for external_buffer in external_buffers.take_buffers() {
  632 |             sink.write_aligned_buffer(&external_buffer).await?;
  633 |         }
  634 |         let encoding_tasks = encoding_tasks
  635 |             .into_iter()
  636 |             .flatten()
  637 |             .collect::<FuturesOrdered<_>>();
  638 | 
  639 |         if self.rows_written.checked_add(num_rows).is_none() {
  640 |             return Err(Error::invalid_input_source(format!(
  641 |                 "cannot write batch with {} rows because {} rows have already been written and Lance files cannot contain more than 2^64 rows",
  642 |                 num_rows, self.rows_written
  643 |             ).into()));
  644 |         }
  645 |         for field_rows in &mut self.field_rows_written {
  646 |             *field_rows += num_rows;
  647 |         }
  648 |         self.rows_written += num_rows;
  649 |         sink.write_pages(encoding_tasks).await
  650 |     }
  651 | 
  652 |     pub async fn write_column(
  653 |         &mut self,
  654 |         column_index: usize,
  655 |         array: ArrayRef,
  656 |         sink: &mut StructuralFileSink,
  657 |     ) -> Result<()> {
  658 |         let schema = self.schema.as_ref().ok_or_else(|| {
  659 |             Error::invalid_input_source(
  660 |                 "write_column requires the writer to be created with an explicit schema".into(),
  661 |             )
  662 |         })?;
  663 |         let field = schema.fields.get(column_index).ok_or_else(|| {
  664 |             Error::invalid_input_source(
  665 |                 format!(
  666 |                     "write_column: field index {} is out of bounds (schema has {} fields)",
  667 |                     column_index,
  668 |                     schema.fields.len()
  669 |                 )
  670 |                 .into(),
  671 |             )
  672 |         })?;
  673 |         if array.len() as u64 > u32::MAX as u64 {
  674 |             return Err(Error::invalid_input_source(
  675 |                 "cannot write Lance files with more than 2^32 rows".into(),
  676 |             ));
  677 |         }
  678 |         self.expected_types
  679 |             .get_or_insert_with(|| ExpectedTypes::new(schema))
  680 |             .check_column(column_index, &array)?;
  681 |         Self::verify_field_nullability(array.as_ref(), field)?;
  682 |         if array.is_empty() {
  683 |             return Ok(());
  684 |         }
  685 | 
  686 |         let fields = [(column_index, array)];
  687 |         let mut external_buffers =
  688 |             OutOfLineBuffers::new(sink.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  689 |         let encoding_tasks = self.encode_columns(&fields, &mut external_buffers)?;
  690 |         for external_buffer in external_buffers.take_buffers() {
  691 |             sink.write_aligned_buffer(&external_buffer).await?;
  692 |         }
  693 |         let encoding_tasks = encoding_tasks
  694 |             .into_iter()
  695 |             .flatten()
  696 |             .collect::<FuturesOrdered<_>>();
  697 |         for (field_index, array) in &fields {
  698 |             let new_total = self.field_rows_written[*field_index] + array.len() as u64;
  699 |             self.field_rows_written[*field_index] = new_total;
  700 |             self.rows_written = self.rows_written.max(new_total);
  701 |         }
  702 |         sink.write_pages(encoding_tasks).await
  703 |     }
  704 | 
  705 |     pub async fn flush(&mut self, sink: &mut StructuralFileSink) -> Result<()> {
  706 |         let mut external_buffers =
  707 |             OutOfLineBuffers::new(sink.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  708 |         let encoding_tasks = self
  709 |             .field_encoders
  710 |             .iter_mut()
  711 |             .map(|writer| writer.flush(&mut external_buffers))
  712 |             .collect::<Result<Vec<_>>>()?;
  713 |         for external_buffer in external_buffers.take_buffers() {
  714 |             sink.write_aligned_buffer(&external_buffer).await?;
  715 |         }
  716 |         sink.write_pages(
  717 |             encoding_tasks
  718 |                 .into_iter()
  719 |                 .flatten()
  720 |                 .collect::<FuturesOrdered<_>>(),
  721 |         )
  722 |         .await
  723 |     }
  724 | 
  725 |     pub async fn finish_encoders(&mut self, sink: &mut StructuralFileSink) -> Result<()> {
  726 |         if self.field_encoders.is_empty() {
  727 |             return Ok(());
  728 |         }
  729 |         let mut column_index = 0;
  730 |         for mut writer in std::mem::take(&mut self.field_encoders) {
  731 |             let mut external_buffers =
  732 |                 OutOfLineBuffers::new(sink.tell().await?, PAGE_BUFFER_ALIGNMENT as u64);
  733 |             let columns = writer.finish(&mut external_buffers).await?;
  734 |             for buffer in external_buffers.take_buffers() {
  735 |                 sink.write_raw(&buffer).await?;
  736 |             }
  737 |             debug_assert_eq!(
  738 |                 columns.len(),
  739 |                 writer.num_columns() as usize,
  740 |                 "Expected {} columns from column at index {} and got {}",
  741 |                 writer.num_columns(),
  742 |                 column_index,
  743 |                 columns.len()
  744 |             );
  745 |             for column in columns {
  746 |                 for page in column.final_pages {
  747 |                     sink.write_page(page).await?;
  748 |                 }
  749 |                 let mut buffer_position = sink.tell().await?;
  750 |                 for buffer in column.column_buffers {
  751 |                     sink.write_column_buffer_at(column_index, buffer_position, &buffer)
  752 |                         .await?;
  753 |                     buffer_position += buffer.len() as u64;
  754 |                 }
  755 |                 let encoded_encoding = Any::from_msg(&column.encoding)?.encode_to_vec();
  756 |                 sink.set_column_encoding(
  757 |                     column_index,
  758 |                     pbfile::Encoding {
  759 |                         location: Some(pbfile::encoding::Location::Direct(
  760 |                             pbfile::DirectEncoding {
  761 |                                 encoding: encoded_encoding,
  762 |                             },
  763 |                         )),
  764 |                     },
  765 |                 );
  766 |                 column_index += 1;
  767 |             }
  768 |         }
  769 |         if column_index != sink.num_columns() as usize {
  770 |             panic!(
  771 |                 "Column writers finished with {} columns but we expected {}",
  772 |                 column_index,
  773 |                 sink.num_columns()
  774 |             );
  775 |         }
  776 |         Ok(())
  777 |     }
  778 | 
  779 |     pub fn add_schema_metadata(&mut self, key: impl Into<String>, value: impl Into<String>) {
  780 |         self.schema_metadata.insert(key.into(), value.into());
  781 |     }
  782 | 
  783 |     pub fn initialize_with_external_metadata(&mut self, mut schema: Schema, rows_written: u64) {
  784 |         self.schema_metadata
  785 |             .extend(std::mem::take(&mut schema.metadata));
  786 |         self.schema = Some(schema);
  787 |         self.rows_written = rows_written;
  788 |     }
  789 | 
  790 |     pub fn make_file_descriptor(&mut self) -> Result<pb::FileDescriptor> {
  791 |         let schema = self.schema.as_mut().ok_or_else(|| {
  792 |             Error::invalid_input(
  793 |                 "No schema provided on writer open and no data provided.  Schema is unknown and file cannot be created",
  794 |             )
  795 |         })?;
  796 |         schema.metadata = std::mem::take(&mut self.schema_metadata);
  797 |         schema
  798 |             .fields
  799 |             .iter_mut()
  800 |             .for_each(|field| field.unload_blobs_recursive());
  801 |         make_file_descriptor(schema, self.rows_written)
  802 |     }
  803 | 
  804 |     pub fn rows_written(&self) -> u64 {
  805 |         self.rows_written
  806 |     }
  807 | 
  808 |     pub fn field_id_to_column_indices(&self) -> &[(u32, u32)] {
  809 |         &self.field_id_to_column_indices
  810 |     }
  811 | }
  812 | 
  813 | fn make_file_descriptor(schema: &Schema, num_rows: u64) -> Result<pb::FileDescriptor> {
  814 |     let fields_with_meta = FieldsWithMeta::from(schema);
  815 |     Ok(pb::FileDescriptor {
  816 |         schema: Some(pb::Schema {
  817 |             fields: fields_with_meta.fields.0,
  818 |             metadata: fields_with_meta.metadata,
  819 |         }),
  820 |         length: num_rows,
  821 |     })
  822 | }
  823 | 
  824 | /// Structural file body produced before an exact version appends its footer.
  825 | pub struct EncodedBatchBody {
  826 |     pub data: BytesMut,
  827 |     pub column_metadata_start: u64,
  828 |     pub column_metadata_offsets_start: u64,
  829 |     pub global_buffer_offsets_start: u64,
  830 |     pub num_global_buffers: u32,
  831 |     pub num_columns: u32,
  832 | }
  833 | 
  834 | pub fn encode_batch_body(batch: &EncodedBatch, write_schema: bool) -> Result<EncodedBatchBody> {
  835 |     use bytes::BufMut;
  836 | 
  837 |     let mut data = BytesMut::with_capacity(batch.data.len() + 1024 * 1024);
  838 |     data.extend_from_slice(&batch.data);
  839 |     let global_buffers = if write_schema {
  840 |         let schema_start = data.len() as u64;
  841 |         let schema = Schema::try_from(batch.schema.as_ref())?;
  842 |         let descriptor = make_file_descriptor(&schema, batch.num_rows)?;
  843 |         let descriptor_bytes = descriptor.encode_to_vec();
  844 |         let descriptor_len = descriptor_bytes.len() as u64;
  845 |         data.extend_from_slice(&descriptor_bytes);
  846 |         vec![(schema_start, descriptor_len)]
  847 |     } else {
  848 |         Vec::new()
  849 |     };
  850 |     let column_metadata_start = data.len() as u64;
  851 | 
  852 |     let mut column_metadata_positions = Vec::with_capacity(batch.page_table.len());
  853 |     for column in &batch.page_table {
  854 |         let position = data.len() as u64;
  855 |         let pages = column
  856 |             .page_infos
  857 |             .iter()
  858 |             .map(|page_info| {
  859 |                 let encoded_encoding = match &page_info.encoding {
  860 |                     PageEncoding::Legacy(array_encoding) => {
  861 |                         Any::from_msg(array_encoding)?.encode_to_vec()
  862 |                     }
  863 |                     PageEncoding::Structural(page_layout) => {
  864 |                         Any::from_msg(page_layout)?.encode_to_vec()
  865 |                     }
  866 |                 };
  867 |                 let (buffer_offsets, buffer_sizes): (Vec<_>, Vec<_>) =
  868 |                     page_info.buffer_offsets_and_sizes.iter().copied().unzip();
  869 |                 Ok(pbfile::column_metadata::Page {
  870 |                     buffer_offsets,
  871 |                     buffer_sizes,
  872 |                     encoding: Some(pbfile::Encoding {
  873 |                         location: Some(pbfile::encoding::Location::Direct(
  874 |                             pbfile::DirectEncoding {
  875 |                                 encoding: encoded_encoding,
  876 |                             },
  877 |                         )),
  878 |                     }),
  879 |                     length: page_info.num_rows,
  880 |                     priority: page_info.priority,
  881 |                 })
  882 |             })
  883 |             .collect::<Result<Vec<_>>>()?;
  884 |         let (buffer_offsets, buffer_sizes): (Vec<_>, Vec<_>) =
  885 |             column.buffer_offsets_and_sizes.iter().copied().unzip();
  886 |         let encoded_column_encoding = Any::from_msg(&column.encoding)?.encode_to_vec();
  887 |         let metadata = pbfile::ColumnMetadata {
  888 |             pages,
  889 |             buffer_offsets,
  890 |             buffer_sizes,
  891 |             encoding: Some(pbfile::Encoding {
  892 |                 location: Some(pbfile::encoding::Location::Direct(pbfile::DirectEncoding {
  893 |                     encoding: encoded_column_encoding,
  894 |                 })),
  895 |             }),
  896 |         };
  897 |         let metadata_bytes = metadata.encode_to_vec();
  898 |         column_metadata_positions.push((position, metadata_bytes.len() as u64));
  899 |         data.extend_from_slice(&metadata_bytes);
  900 |     }
  901 | 
  902 |     let column_metadata_offsets_start = data.len() as u64;
  903 |     for (position, len) in column_metadata_positions {
  904 |         data.put_u64_le(position);
  905 |         data.put_u64_le(len);
  906 |     }
  907 |     let global_buffer_offsets_start = data.len() as u64;
  908 |     let num_global_buffers = global_buffers.len() as u32;
  909 |     for (position, len) in global_buffers {
  910 |         data.put_u64_le(position);
  911 |         data.put_u64_le(len);
  912 |     }
  913 | 
  914 |     Ok(EncodedBatchBody {
  915 |         data,
  916 |         column_metadata_start,
  917 |         column_metadata_offsets_start,
  918 |         global_buffer_offsets_start,
  919 |         num_global_buffers,
  920 |         num_columns: batch.page_table.len() as u32,
  921 |     })
  922 | }
  923 | 
  924 | #[cfg(test)]
  925 | mod tests {
  926 |     use std::sync::Arc;
  927 | 
  928 |     use arrow_array::{ArrayRef, BooleanArray, StructArray};
  929 |     use arrow_buffer::NullBuffer;
  930 |     use arrow_schema::{DataType, Field as ArrowField, Fields, Schema as ArrowSchema};
  931 |     use lance_core::datatypes::Schema;
  932 | 
  933 |     use super::EncodingPipeline;
  934 | 
  935 |     /// `analysis: struct<changed: bool>` where the child is declared
  936 |     /// non-nullable, built with a nullable child so the array can carry the
  937 |     /// nulls a reader hands back.
  938 |     fn analysis(parent_valid: Vec<bool>, changed: Vec<Option<bool>>) -> (ArrayRef, Schema) {
  939 |         let child = Arc::new(BooleanArray::from(changed)) as ArrayRef;
  940 |         let array = Arc::new(StructArray::new(
  941 |             Fields::from(vec![ArrowField::new("changed", DataType::Boolean, true)]),
  942 |             vec![child],
  943 |             Some(NullBuffer::from(parent_valid)),
  944 |         )) as ArrayRef;
  945 |         let declared = ArrowSchema::new(vec![ArrowField::new(
  946 |             "analysis",
  947 |             DataType::Struct(Fields::from(vec![ArrowField::new(
  948 |                 "changed",
  949 |                 DataType::Boolean,
  950 |                 false,
  951 |             )])),
  952 |             true,
  953 |         )]);
  954 |         (array, Schema::try_from(&declared).unwrap())
  955 |     }
  956 | 
  957 |     #[test]
  958 |     fn child_nulls_under_a_null_parent_are_writable() {
  959 |         // A null struct slot leaves its child undefined, and a reader returns
  960 |         // null there for a column this writer stored a value in. Rejecting it
  961 |         // would make the column unwritable after a round trip.
  962 |         let (array, schema) = analysis(
  963 |             vec![true, false, true, false],
  964 |             vec![Some(true), None, Some(false), None],
  965 |         );
  966 |         EncodingPipeline::verify_field_nullability(array.as_ref(), &schema.fields[0]).unwrap();
  967 |     }
  968 | 
  969 |     #[test]
  970 |     fn child_nulls_under_a_valid_parent_are_still_rejected() {
  971 |         let (array, schema) = analysis(
  972 |             vec![true, true, true, false],
  973 |             vec![Some(true), None, Some(false), None],
  974 |         );
  975 |         let error = EncodingPipeline::verify_field_nullability(array.as_ref(), &schema.fields[0])
  976 |             .expect_err("a null the parent does not mask violates the schema");
  977 |         assert!(
  978 |             error.to_string().contains("`changed`"),
  979 |             "should name the offending child: {error}"
  980 |         );
  981 |     }
  982 | 
  983 |     /// A dictionary key can point at a null value, which the physical
  984 |     /// validity buffer does not record. Masking physical validity alone would
  985 |     /// admit that null and produce a file Arrow rejects on readback.
  986 |     #[test]
  987 |     fn a_logical_null_in_a_dictionary_child_is_rejected() {
  988 |         use arrow_array::{DictionaryArray, Int32Array};
  989 | 
  990 |         let values = Arc::new(Int32Array::from(vec![Some(10), None])) as ArrayRef;
  991 |         let keys = Int32Array::from(vec![Some(0), Some(1), None]);
  992 |         let child = Arc::new(DictionaryArray::new(keys, values)) as ArrayRef;
  993 |         let child_type = child.data_type().clone();
  994 |         // Row 2's key is physically null but the parent masks it; row 1 is a
  995 |         // logical null the parent does not mask.
  996 |         let array = Arc::new(StructArray::new(
  997 |             Fields::from(vec![ArrowField::new("code", child_type.clone(), true)]),
  998 |             vec![child],
  999 |             Some(NullBuffer::from(vec![true, true, false])),
 1000 |         )) as ArrayRef;
 1001 |         let declared = ArrowSchema::new(vec![ArrowField::new(
 1002 |             "wrapper",
 1003 |             DataType::Struct(Fields::from(vec![ArrowField::new(
 1004 |                 "code", child_type, false,
 1005 |             )])),
 1006 |             true,
 1007 |         )]);
 1008 |         let schema = Schema::try_from(&declared).unwrap();
 1009 | 
 1010 |         let error = EncodingPipeline::verify_field_nullability(array.as_ref(), &schema.fields[0])
 1011 |             .expect_err("the visible logical null at row 1 must be rejected");
 1012 |         assert!(error.to_string().contains("`code`"), "{error}");
 1013 |     }
 1014 | 
 1015 |     #[test]
 1016 |     fn a_sliced_parent_lines_up_with_its_children() {
 1017 |         let (array, schema) = analysis(
 1018 |             vec![true, false, true, true],
 1019 |             vec![Some(true), None, Some(false), Some(true)],
 1020 |         );
 1021 |         // Dropping the first row leaves the null parent at slot 0.
 1022 |         let sliced = array.slice(1, 3);
 1023 |         EncodingPipeline::verify_field_nullability(sliced.as_ref(), &schema.fields[0]).unwrap();
 1024 |     }
 1025 | }
``````
