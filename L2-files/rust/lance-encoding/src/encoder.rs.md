> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encoder.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `566acf796afafc3f487f6c259b9d0c25110372c0f99a219c28d72f54d1a6033d`. Reviewed physical lines: 1-603.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public encoding contracts, field-to-column allocation, runtime options, out-of-line address reservation and in-memory RecordBatch orchestration. (rust/lance-encoding/src/encoder.rs:1-603)

## Complete range analysis

### Lines 1-35

License, module overview and imports connect Arrow arrays, core schema/errors, DataBlock, LanceBuffer, page metadata and rep/def. ArrayFieldEncodingStrategy is publicly re-exported; structural is public. Structural strategies build encoder trees, containers collect shape, leaves emit pages; complete logical implementations remain pending. (rust/lance-encoding/src/encoder.rs:1-35)

### Lines 36-54

Public minimum page-buffer alignment is8 bytes. EncodedArray owns DataBlock plus protobuf ArrayEncoding; new stores both without validation and into_buffers consumes the data into LanceBuffers while returning unchanged encoding metadata. (rust/lance-encoding/src/encoder.rs:36-54)

### Lines 55-74

Public Debug+Send+Sync ArrayEncoder encodes one owned DataBlock with an Arrow type and mutable u32 buffer index into Result<EncodedArray>. ArrayEncodingStrategy selects a boxed encoder per page from borrowed ArrayRefs and Field; the trait imposes no default validation or implementation. (rust/lance-encoding/src/encoder.rs:55-74)

### Lines 75-98

EncodedPage exposes buffers, PageEncoding, u64 num_rows, top-level starting row_number and u32 column_idx. Row number serves scheduling priority; comments prohibit splitting a top-level row across pages and distinguish repeated items from top rows. These are producer contracts, not validation in this struct; its FSL example refers to two EncodedArray objects under one page. (rust/lance-encoding/src/encoder.rs:75-98)

### Lines 99-116

EncodedColumn holds column-scoped buffers, protobuf ColumnEncoding and finish-time final_pages. Default has empty buffers/pages and Some Values(()) encoding. EncodedColumn itself does not derive Debug. (rust/lance-encoding/src/encoder.rs:99-116)

### Lines 117-144

OutOfLineBuffers reserves positions for page-external data such as large blobs; privately stores next position, configured alignment and pending LanceBuffers. new accepts any base/alignment with no validation or base alignment adjustment. (rust/lance-encoding/src/encoder.rs:117-144)

### Lines 145-161

add_buffer returns old absolute position, advances by payload length plus pad_bytes_to(length, alignment), and retains the original unpadded buffer. It does not emit padding; the consumer must honor the reservation. Arithmetic/casts are unchecked. take_buffers consumes reservation state; reset_position changes only the position, retaining pending buffers. pad_bytes_to has only a debug power-of-two assertion. (rust/lance-core/src/utils/bit.rs:44-46) (rust/lance-encoding/src/encoder.rs:145-161)

### Lines 162-184

EncodeTask is BoxFuture<static, Result<EncodedPage>>. FieldEncoder is Send, not required Sync/Debug, and may fan one input field into multiple physical columns. Default prepare_array returns the input untouched. Documentation requires preparation across all roots before mutation so later validation cannot partially advance earlier fields; the mutable method signature alone does not enforce this discipline. (rust/lance-encoding/src/encoder.rs:162-184)

### Lines 185-211

maybe_encode accepts owned ArrayRef, mutable external buffer reservation, owned RepDefBuilder, top-level row_number and num_rows. It may buffer, return no tasks, multiple pages for a large input or multiple output columns. Original top-level count must survive flattening. It returns immediate Result<Vec<EncodeTask>>; deferred errors may arise when each task is awaited. (rust/lance-encoding/src/encoder.rs:185-211)

### Lines 212-234

flush returns pending page tasks, may run intermittently, and must run finally before finish. Within-column page order is a caller contract. finish is a borrow-scoped BoxFuture returning per-column metadata and final pages, called once after all tasks complete. num_columns reports physical column count. No lifecycle state machine is enforced by the trait itself. (rust/lance-encoding/src/encoder.rs:212-234)

### Lines 235-255

ColumnIndexSequence Default starts index0 with empty (field_id,column_idx) mapping. next_column_index increments u32 and appends a pair; duplicate IDs are not rejected. skip increments without mapping. Overflow is unchecked and neither operation supports rollback. (rust/lance-encoding/src/encoder.rs:235-255)

### Lines 256-276

EncodingOptions exposes per-column cache byte threshold, max page byte threshold, ownership/copying choice, and writer buffer alignment. Comments say false keep_original_array deeply copies cached arrays and call false the default; actual Default below is true. No field/type/range validation occurs in this struct. (rust/lance-encoding/src/encoder.rs:256-276)

### Lines 277-287

Default is8MiB cache per column,32MiB max page, keep_original_array=true and64-byte buffer alignment. This contradicts the false-default field documentation above; implementation is authoritative for construction. (rust/lance-encoding/src/encoder.rs:277-287)

### Lines 288-312

FieldEncodingStrategy is Send+Sync+Debug, selected once for a field before data rather than per page. validate_array defaults Ok and create_field_encoder takes Field, mutable global column sequence and shared FieldEncodingContext. The strategy can dispatch from type/metadata. Neither BatchEncoder::try_new nor encode_batch directly calls validate_array. (rust/lance-encoding/src/encoder.rs:288-312)

### Lines 313-330

FieldEncodingContext borrows the complete recursive strategy composition, runtime options and metadata of the top-level root field. BatchEncoder publicly owns root boxed encoders and field-id-to-column pairs; these fields can be externally manipulated without invariants being checked here. (rust/lance-encoding/src/encoder.rs:313-330)

### Lines 331-359

BatchEncoder::try_new walks schema roots in order with one default column sequence and a new context borrowing each root metadata. create_field_encoder failures short-circuit/drop partially built encoders. A local col_idx sums num_columns but is never used to validate mapping or output; returned mapping is exactly sequence.mapping. Alignment/schema shape are not independently checked here. (rust/lance-encoding/src/encoder.rs:331-359)

### Lines 360-367

BatchEncoder::num_columns sums each encoder-reported u32 count, with ordinary unchecked arithmetic. It does not derive count from mapping; custom strategies must keep allocation and reporting consistent. (rust/lance-encoding/src/encoder.rs:360-367)

### Lines 368-379

EncodedBatch publicly owns immutable Bytes payload, Arc ColumnInfo page table, Arc Schema, Vec<u32> top_level_columns and u64 row count. The name top_level_columns does not itself filter root IDs; helper construction later copies all sequence mapping indices. (rust/lance-encoding/src/encoder.rs:368-379)

### Lines 380-397

Private write_page_to_data_buffer appends each page buffer contiguously, recording absolute offset and actual payload size with no padding/alignment. PageInfo retains PageEncoding,num_rows and priority=row_number. This helper does not include column index; caller buckets pages separately by that index. (rust/lance-encoding/src/encoder.rs:380-397)

### Lines 398-418

Public async encode_batch is a memory helper primarily for tests/benchmarks/IPC, not a complete Lance file serializer. It rejects non-power-of-two or alignment<8 via InvalidInput. The is_pwr_two call executes first: n-1 underflows for0 with overflow checks enabled, so zero can panic before the intended Result; without overflow checks the subsequent minimum test rejects it. (rust/lance-core/src/utils/bit.rs:15-16) (rust/lance-encoding/src/encoder.rs:398-418)

### Lines 419-434

Derive encoding schema from batch.schema(), force keep_original_array=true regardless of supplied option, construct encoders, then prepare all root arrays before maybe_encode. Preparation errors return before any maybe_encode, subject to custom prepare implementations honoring no-mutation. Supplied Arc<Schema> is not used for dispatch or checked for agreement; it is returned later unchanged. (rust/lance-encoding/src/encoder.rs:419-434)

### Lines 435-454

Process roots sequentially. Start external reservation at current byte length, use fresh RepDefBuilder and row_number0, maybe_encode then flush before awaiting any task. Append external payload buffers without their reserved padding; await tasks in vector order and bucket PageInfo by encoded_page.column_idx. This helper introduces no concurrent task polling or spawn, although tasks may encapsulate work already dispatched by encoders. (rust/lance-encoding/src/encoder.rs:435-454)

### Lines 455-470

After all tasks for a root complete, create fresh external reservation, await finish, append returned external buffers unpadded, then serialize each column-scoped buffer unpadded while recording offsets/actual sizes. Column enumeration uses cumulative count of previous finish results, not returned mapping or encoder.num_columns. (rust/lance-encoding/src/encoder.rs:455-470)

### Lines 471-488

Append each EncodedColumn.final_pages to the bucket identified by each page column_idx, then remove pages for current enumerated physical column into ColumnInfo. Missing bucket yields empty pages. Buckets with unreported indices or pages arriving after their column was removed can remain discarded at root-loop end. Correct ordering/index membership is an implicit strategy contract, not validated. (rust/lance-encoding/src/encoder.rs:471-488)

### Lines 489-502

top_level_columns collects every allocated mapping index and discards field IDs, including nested leaf allocations; it is not necessarily one index per schema root. Freeze Bytes and return supplied schema plus batch row count. All intermediate Result errors propagate; no partial EncodedBatch is returned. Dropping the future drops its local state and unawaited task futures; behavior of already spawned codec work is outside this helper. (rust/lance-encoding/src/encoder.rs:489-502)

### Lines 503-517

One private cfg(test) module imports array construction and test strategies. rstest test_nested_variable_width_offsets_are_validated_before_dispatch has a2x2 matrix: Array or StructuralU32 strategy and Utf8 or LargeUtf8 child type. (rust/lance-encoding/src/encoder.rs:503-517)

### Lines 518-538

Test deliberately constructs malformed offsets[0,2,1,3] over abc via unsafe ArrayData::build_unchecked, then wraps child in FixedSizeList size1 length3. Unsafe bypass is fixture-only; production code in these two reviewed files has no unsafe block. (rust/lance-encoding/src/encoder.rs:518-538)

### Lines 539-566

Build payload Field, strategy and encoder with cache0, invoke maybe_encode directly rather than prepare_array, and require InvalidInput plus payload field and non-monotonic offset position2 in message. This verifies source-level intended nested validation before dispatch; no runtime test was executed. (rust/lance-encoding/src/encoder.rs:539-566)

### Lines 567-603

Second test constructs nullable FSL dimension2 of nullable Struct<x:Int32 nullable>, uses StructuralU16 test strategy, and requires encoder construction failure with selected-format FSL<Struct> message. It tests rejection associated with v2.1, not v2.2 success or arbitrary nested FSL cases. No local alignment, padding, schema disagreement, custom column mapping, cancellation or finish-order tests are defined. (rust/lance-encoding/src/encoder.rs:567-603)

## Interaction and interpretation limits

All603 lines read in two complete bounded source outputs. Source analysis only; no Lance execution. Helper behavior is not a durable file writer guarantee. Logical codec bodies and decoder remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! The top-level encoding module for Lance files.
    5 | //!
    6 | //! Lance files are encoded using a [`FieldEncodingStrategy`] which choose
    7 | //! what encoder to use for each field.
    8 | //!
    9 | //! Structural strategies build a tree of encoders for each field from the
   10 | //! version-free builders in [`structural`]. Struct and list encoders collect
   11 | //! validity and offsets; primitive leaf encoders accumulate values and emit
   12 | //! miniblock or full-zip pages.
   13 | 
   14 | use std::{collections::HashMap, sync::Arc};
   15 | 
   16 | use arrow_array::{Array, ArrayRef, RecordBatch};
   17 | use bytes::{Bytes, BytesMut};
   18 | use futures::future::BoxFuture;
   19 | use lance_core::datatypes::{Field, Schema};
   20 | use lance_core::utils::bit::{is_pwr_two, pad_bytes_to};
   21 | use lance_core::{Error, Result};
   22 | 
   23 | use crate::buffer::LanceBuffer;
   24 | use crate::data::DataBlock;
   25 | use crate::decoder::PageEncoding;
   26 | use crate::repdef::RepDefBuilder;
   27 | use crate::{
   28 |     decoder::{ColumnInfo, PageInfo},
   29 |     format::pb,
   30 | };
   31 | 
   32 | pub use crate::array_encoding::ArrayFieldEncodingStrategy;
   33 | 
   34 | pub mod structural;
   35 | 
   36 | /// The minimum alignment for a page buffer.  Writers must respect this.
   37 | pub const MIN_PAGE_BUFFER_ALIGNMENT: u64 = 8;
   38 | 
   39 | /// An array encoded with the `pb::ArrayEncoding` grammar.
   40 | #[derive(Debug)]
   41 | pub struct EncodedArray {
   42 |     pub data: DataBlock,
   43 |     pub encoding: pb::ArrayEncoding,
   44 | }
   45 | 
   46 | impl EncodedArray {
   47 |     pub fn new(data: DataBlock, encoding: pb::ArrayEncoding) -> Self {
   48 |         Self { data, encoding }
   49 |     }
   50 | 
   51 |     pub fn into_buffers(self) -> (Vec<LanceBuffer>, pb::ArrayEncoding) {
   52 |         (self.data.into_buffers(), self.encoding)
   53 |     }
   54 | }
   55 | 
   56 | /// Encodes one data block and describes it with `pb::ArrayEncoding`.
   57 | pub trait ArrayEncoder: std::fmt::Debug + Send + Sync {
   58 |     fn encode(
   59 |         &self,
   60 |         data: DataBlock,
   61 |         data_type: &arrow_schema::DataType,
   62 |         buffer_index: &mut u32,
   63 |     ) -> Result<EncodedArray>;
   64 | }
   65 | 
   66 | /// Selects an `ArrayEncoder` for one page.
   67 | pub trait ArrayEncodingStrategy: Send + Sync + std::fmt::Debug {
   68 |     fn create_array_encoder(
   69 |         &self,
   70 |         arrays: &[ArrayRef],
   71 |         field: &Field,
   72 |     ) -> Result<Box<dyn ArrayEncoder>>;
   73 | }
   74 | 
   75 | /// An encoded page of data
   76 | ///
   77 | /// Maps to a top-level array
   78 | ///
   79 | /// For example, `FixedSizeList<Int32>` will have two EncodedArray instances and one EncodedPage
   80 | #[derive(Debug)]
   81 | pub struct EncodedPage {
   82 |     // The encoded page buffers
   83 |     pub data: Vec<LanceBuffer>,
   84 |     // A description of the encoding used to encode the page
   85 |     pub description: PageEncoding,
   86 |     /// The number of rows in the encoded page
   87 |     pub num_rows: u64,
   88 |     /// The top-level row number of the first row in the page
   89 |     ///
   90 |     /// Generally the number of "top-level" rows and the number of rows are the same.  However,
   91 |     /// when there is repetition (list/fixed-size-list) there will be more or less items than rows.
   92 |     ///
   93 |     /// A top-level row can never be split across a page boundary.
   94 |     pub row_number: u64,
   95 |     /// The index of the column
   96 |     pub column_idx: u32,
   97 | }
   98 | 
   99 | pub struct EncodedColumn {
  100 |     pub column_buffers: Vec<LanceBuffer>,
  101 |     pub encoding: pb::ColumnEncoding,
  102 |     pub final_pages: Vec<EncodedPage>,
  103 | }
  104 | 
  105 | impl Default for EncodedColumn {
  106 |     fn default() -> Self {
  107 |         Self {
  108 |             column_buffers: Default::default(),
  109 |             encoding: pb::ColumnEncoding {
  110 |                 column_encoding: Some(pb::column_encoding::ColumnEncoding::Values(())),
  111 |             },
  112 |             final_pages: Default::default(),
  113 |         }
  114 |     }
  115 | }
  116 | 
  117 | /// A tool to reserve space for buffers that are not in-line with the data
  118 | ///
  119 | /// In most cases, buffers are stored in the page and referred to in the encoding
  120 | /// metadata by their index in the page.  This keeps all buffers within a page together.
  121 | /// As a result, most encoders should not need to use this structure.
  122 | ///
  123 | /// In some cases (currently only the large binary encoding) there is a need to access
  124 | /// buffers that are not in the page (because storing the position / offset of every page
  125 | /// in the page metadata would be too expensive).
  126 | ///
  127 | /// To do this you can add a buffer with `add_buffer` and then use the returned position
  128 | /// in some way (in the large binary encoding the returned position is stored in the page
  129 | /// data as a position / size array).
  130 | pub struct OutOfLineBuffers {
  131 |     position: u64,
  132 |     buffer_alignment: u64,
  133 |     buffers: Vec<LanceBuffer>,
  134 | }
  135 | 
  136 | impl OutOfLineBuffers {
  137 |     pub fn new(base_position: u64, buffer_alignment: u64) -> Self {
  138 |         Self {
  139 |             position: base_position,
  140 |             buffer_alignment,
  141 |             buffers: Vec::new(),
  142 |         }
  143 |     }
  144 | 
  145 |     pub fn add_buffer(&mut self, buffer: LanceBuffer) -> u64 {
  146 |         let position = self.position;
  147 |         self.position += buffer.len() as u64;
  148 |         self.position += pad_bytes_to(buffer.len(), self.buffer_alignment as usize) as u64;
  149 |         self.buffers.push(buffer);
  150 |         position
  151 |     }
  152 | 
  153 |     pub fn take_buffers(self) -> Vec<LanceBuffer> {
  154 |         self.buffers
  155 |     }
  156 | 
  157 |     pub fn reset_position(&mut self, position: u64) {
  158 |         self.position = position;
  159 |     }
  160 | }
  161 | 
  162 | /// A task to create a page of data
  163 | pub type EncodeTask = BoxFuture<'static, Result<EncodedPage>>;
  164 | 
  165 | /// Top level encoding trait to code any Arrow array type into one or more pages.
  166 | ///
  167 | /// The field encoder implements buffering and encoding of a single input column
  168 | /// but it may map to multiple output columns.  For example, a list array or struct
  169 | /// array will be encoded into multiple columns.
  170 | ///
  171 | /// Also, fields may be encoded at different speeds.  For example, given a struct
  172 | /// column with three fields (a boolean field, an int32 field, and a 4096-dimension
  173 | /// tensor field) the tensor field is likely to emit encoded pages much more frequently
  174 | /// than the boolean field.
  175 | pub trait FieldEncoder: Send {
  176 |     /// Validate and prepare an array before any encoder state is mutated.
  177 |     ///
  178 |     /// Batch-oriented callers invoke this for every root field before calling
  179 |     /// [`Self::maybe_encode`], so a later validation failure cannot leave an
  180 |     /// earlier field encoder partially advanced.
  181 |     fn prepare_array(&mut self, array: ArrayRef) -> Result<ArrayRef> {
  182 |         Ok(array)
  183 |     }
  184 | 
  185 |     /// Buffer the data and, if there is enough data in the buffer to form a page, return
  186 |     /// an encoding task to encode the data.
  187 |     ///
  188 |     /// This may return more than one task because a single column may be mapped to multiple
  189 |     /// output columns.  For example, if encoding a struct column with three children then
  190 |     /// up to three tasks may be returned from each call to maybe_encode.
  191 |     ///
  192 |     /// It may also return multiple tasks for a single column if the input array is larger
  193 |     /// than a single disk page.
  194 |     ///
  195 |     /// It could also return an empty Vec if there is not enough data yet to encode any pages.
  196 |     ///
  197 |     /// The `row_number` must be passed which is the top-level row number currently being encoded
  198 |     /// This is stored in any pages produced by this call so that we can know the priority of the
  199 |     /// page.
  200 |     ///
  201 |     /// The `num_rows` is the number of top level rows.  It is initially the same as `array.len()`
  202 |     /// however it is passed seprately because array will become flattened over time (if there is
  203 |     /// repetition) and we need to know the original number of rows for various purposes.
  204 |     fn maybe_encode(
  205 |         &mut self,
  206 |         array: ArrayRef,
  207 |         external_buffers: &mut OutOfLineBuffers,
  208 |         repdef: RepDefBuilder,
  209 |         row_number: u64,
  210 |         num_rows: u64,
  211 |     ) -> Result<Vec<EncodeTask>>;
  212 |     /// Flush any remaining data from the buffers into encoding tasks
  213 |     ///
  214 |     /// Each encode task produces a single page.  The order of these pages will be maintained
  215 |     /// in the file (we do not worry about order between columns but all pages in the same
  216 |     /// column should maintain order)
  217 |     ///
  218 |     /// This may be called intermittently throughout encoding but will always be called
  219 |     /// once at the end of encoding just before calling finish
  220 |     fn flush(&mut self, external_buffers: &mut OutOfLineBuffers) -> Result<Vec<EncodeTask>>;
  221 |     /// Finish encoding and return column metadata
  222 |     ///
  223 |     /// This is called only once, after all encode tasks have completed
  224 |     ///
  225 |     /// This returns a Vec because a single field may have created multiple columns
  226 |     fn finish(
  227 |         &mut self,
  228 |         external_buffers: &mut OutOfLineBuffers,
  229 |     ) -> BoxFuture<'_, Result<Vec<EncodedColumn>>>;
  230 | 
  231 |     /// The number of output columns this encoding will create
  232 |     fn num_columns(&self) -> u32;
  233 | }
  234 | 
  235 | /// Keeps track of the current column index and makes a mapping
  236 | /// from field id to column index
  237 | #[derive(Debug, Default)]
  238 | pub struct ColumnIndexSequence {
  239 |     current_index: u32,
  240 |     mapping: Vec<(u32, u32)>,
  241 | }
  242 | 
  243 | impl ColumnIndexSequence {
  244 |     pub fn next_column_index(&mut self, field_id: u32) -> u32 {
  245 |         let idx = self.current_index;
  246 |         self.current_index += 1;
  247 |         self.mapping.push((field_id, idx));
  248 |         idx
  249 |     }
  250 | 
  251 |     pub fn skip(&mut self) {
  252 |         self.current_index += 1;
  253 |     }
  254 | }
  255 | 
  256 | /// Options that control the encoding process
  257 | pub struct EncodingOptions {
  258 |     /// How much data (in bytes) to cache in-memory before writing a page
  259 |     ///
  260 |     /// This cache is applied on a per-column basis
  261 |     pub cache_bytes_per_column: u64,
  262 |     /// The maximum size of a page in bytes, if a single array would create
  263 |     /// a page larger than this then it will be split into multiple pages
  264 |     pub max_page_bytes: u64,
  265 |     /// If false (the default) then arrays will be copied (deeply) before
  266 |     /// being cached.  This ensures any data kept alive by the array can
  267 |     /// be discarded safely and helps avoid writer accumulation.  However,
  268 |     /// there is an associated cost.
  269 |     pub keep_original_array: bool,
  270 |     /// The alignment that the writer is applying to buffers
  271 |     ///
  272 |     /// The encoder needs to know this so it figures the position of out-of-line
  273 |     /// buffers correctly
  274 |     pub buffer_alignment: u64,
  275 | }
  276 | 
  277 | impl Default for EncodingOptions {
  278 |     fn default() -> Self {
  279 |         Self {
  280 |             cache_bytes_per_column: 8 * 1024 * 1024,
  281 |             max_page_bytes: 32 * 1024 * 1024,
  282 |             keep_original_array: true,
  283 |             buffer_alignment: 64,
  284 |         }
  285 |     }
  286 | }
  287 | 
  288 | /// A trait to pick which kind of field encoding to use for a field
  289 | ///
  290 | /// Unlike the ArrayEncodingStrategy, the field encoding strategy is
  291 | /// chosen before any data is generated and the same field encoder is
  292 | /// used for all data in the field.
  293 | pub trait FieldEncodingStrategy: Send + Sync + std::fmt::Debug {
  294 |     /// Validate one top-level array before any field encoder state is mutated.
  295 |     fn validate_array(&self, _array: &dyn Array, _field: &Field) -> Result<()> {
  296 |         Ok(())
  297 |     }
  298 | 
  299 |     /// Choose and create an appropriate field encoder for the given
  300 |     /// field.
  301 |     ///
  302 |     /// The field encoder can be chosen on the data type as well as
  303 |     /// any metadata that is attached to the field.
  304 |     ///
  305 |     fn create_field_encoder(
  306 |         &self,
  307 |         field: &Field,
  308 |         column_index: &mut ColumnIndexSequence,
  309 |         context: &FieldEncodingContext<'_>,
  310 |     ) -> Result<Box<dyn FieldEncoder>>;
  311 | }
  312 | 
  313 | /// Context shared while one top-level field and all of its children are mapped
  314 | /// to concrete field encoders.
  315 | pub struct FieldEncodingContext<'a> {
  316 |     /// The complete strategy composition used for recursive child fields.
  317 |     pub strategy: &'a dyn FieldEncodingStrategy,
  318 |     /// Runtime-only writer options.
  319 |     pub options: &'a EncodingOptions,
  320 |     /// Metadata inherited from the top-level field.
  321 |     pub root_field_metadata: &'a HashMap<String, String>,
  322 | }
  323 | 
  324 | /// A batch encoder that encodes RecordBatch objects by delegating
  325 | /// to field encoders for each top-level field in the batch.
  326 | pub struct BatchEncoder {
  327 |     pub field_encoders: Vec<Box<dyn FieldEncoder>>,
  328 |     pub field_id_to_column_index: Vec<(u32, u32)>,
  329 | }
  330 | 
  331 | impl BatchEncoder {
  332 |     pub fn try_new(
  333 |         schema: &Schema,
  334 |         strategy: &dyn FieldEncodingStrategy,
  335 |         options: &EncodingOptions,
  336 |     ) -> Result<Self> {
  337 |         let mut col_idx = 0;
  338 |         let mut col_idx_sequence = ColumnIndexSequence::default();
  339 |         let field_encoders = schema
  340 |             .fields
  341 |             .iter()
  342 |             .map(|field| {
  343 |                 let context = FieldEncodingContext {
  344 |                     strategy,
  345 |                     options,
  346 |                     root_field_metadata: &field.metadata,
  347 |                 };
  348 |                 let encoder =
  349 |                     strategy.create_field_encoder(field, &mut col_idx_sequence, &context)?;
  350 |                 col_idx += encoder.as_ref().num_columns();
  351 |                 Ok(encoder)
  352 |             })
  353 |             .collect::<Result<Vec<_>>>()?;
  354 |         Ok(Self {
  355 |             field_encoders,
  356 |             field_id_to_column_index: col_idx_sequence.mapping,
  357 |         })
  358 |     }
  359 | 
  360 |     pub fn num_columns(&self) -> u32 {
  361 |         self.field_encoders
  362 |             .iter()
  363 |             .map(|field_encoder| field_encoder.num_columns())
  364 |             .sum::<u32>()
  365 |     }
  366 | }
  367 | 
  368 | /// An encoded batch of data and a page table describing it
  369 | ///
  370 | /// This is returned by [`crate::encoder::encode_batch`]
  371 | #[derive(Debug)]
  372 | pub struct EncodedBatch {
  373 |     pub data: Bytes,
  374 |     pub page_table: Vec<Arc<ColumnInfo>>,
  375 |     pub schema: Arc<Schema>,
  376 |     pub top_level_columns: Vec<u32>,
  377 |     pub num_rows: u64,
  378 | }
  379 | 
  380 | fn write_page_to_data_buffer(page: EncodedPage, data_buffer: &mut BytesMut) -> PageInfo {
  381 |     let buffers = page.data;
  382 |     let mut buffer_offsets_and_sizes = Vec::with_capacity(buffers.len());
  383 |     for buffer in buffers {
  384 |         let buffer_offset = data_buffer.len() as u64;
  385 |         data_buffer.extend_from_slice(&buffer);
  386 |         let size = data_buffer.len() as u64 - buffer_offset;
  387 |         buffer_offsets_and_sizes.push((buffer_offset, size));
  388 |     }
  389 | 
  390 |     PageInfo {
  391 |         buffer_offsets_and_sizes: Arc::from(buffer_offsets_and_sizes),
  392 |         encoding: page.description,
  393 |         num_rows: page.num_rows,
  394 |         priority: page.row_number,
  395 |     }
  396 | }
  397 | 
  398 | /// Helper method to encode a batch of data into memory
  399 | ///
  400 | /// This is primarily for testing and benchmarking but could be useful in other
  401 | /// niche situations like IPC.
  402 | pub async fn encode_batch(
  403 |     batch: &RecordBatch,
  404 |     schema: Arc<Schema>,
  405 |     encoding_strategy: &dyn FieldEncodingStrategy,
  406 |     options: &EncodingOptions,
  407 | ) -> Result<EncodedBatch> {
  408 |     if !is_pwr_two(options.buffer_alignment) || options.buffer_alignment < MIN_PAGE_BUFFER_ALIGNMENT
  409 |     {
  410 |         return Err(Error::invalid_input_source(
  411 |             format!(
  412 |                 "buffer_alignment must be a power of two and at least {}",
  413 |                 MIN_PAGE_BUFFER_ALIGNMENT
  414 |             )
  415 |             .into(),
  416 |         ));
  417 |     }
  418 | 
  419 |     let mut data_buffer = BytesMut::new();
  420 |     let lance_schema = Schema::try_from(batch.schema().as_ref())?;
  421 |     let options = EncodingOptions {
  422 |         keep_original_array: true,
  423 |         ..*options
  424 |     };
  425 |     let mut batch_encoder = BatchEncoder::try_new(&lance_schema, encoding_strategy, &options)?;
  426 |     let arrays = batch
  427 |         .columns()
  428 |         .iter()
  429 |         .cloned()
  430 |         .zip(batch_encoder.field_encoders.iter_mut())
  431 |         .map(|(array, encoder)| encoder.prepare_array(array))
  432 |         .collect::<Result<Vec<_>>>()?;
  433 |     let mut page_table = Vec::new();
  434 |     let mut col_idx_offset = 0;
  435 |     for (arr, mut encoder) in arrays.into_iter().zip(batch_encoder.field_encoders) {
  436 |         let mut external_buffers =
  437 |             OutOfLineBuffers::new(data_buffer.len() as u64, options.buffer_alignment);
  438 |         let repdef = RepDefBuilder::default();
  439 |         let encoder = encoder.as_mut();
  440 |         let num_rows = arr.len() as u64;
  441 |         let mut tasks = encoder.maybe_encode(arr, &mut external_buffers, repdef, 0, num_rows)?;
  442 |         tasks.extend(encoder.flush(&mut external_buffers)?);
  443 |         for buffer in external_buffers.take_buffers() {
  444 |             data_buffer.extend_from_slice(&buffer);
  445 |         }
  446 |         let mut pages = HashMap::<u32, Vec<PageInfo>>::new();
  447 |         for task in tasks {
  448 |             let encoded_page = task.await?;
  449 |             // Write external buffers first
  450 |             pages
  451 |                 .entry(encoded_page.column_idx)
  452 |                 .or_default()
  453 |                 .push(write_page_to_data_buffer(encoded_page, &mut data_buffer));
  454 |         }
  455 |         let mut external_buffers =
  456 |             OutOfLineBuffers::new(data_buffer.len() as u64, options.buffer_alignment);
  457 |         let encoded_columns = encoder.finish(&mut external_buffers).await?;
  458 |         for buffer in external_buffers.take_buffers() {
  459 |             data_buffer.extend_from_slice(&buffer);
  460 |         }
  461 |         let num_columns = encoded_columns.len();
  462 |         for (col_idx, encoded_column) in encoded_columns.into_iter().enumerate() {
  463 |             let col_idx = col_idx + col_idx_offset;
  464 |             let mut col_buffer_offsets_and_sizes = Vec::new();
  465 |             for buffer in encoded_column.column_buffers {
  466 |                 let buffer_offset = data_buffer.len() as u64;
  467 |                 data_buffer.extend_from_slice(&buffer);
  468 |                 let size = data_buffer.len() as u64 - buffer_offset;
  469 |                 col_buffer_offsets_and_sizes.push((buffer_offset, size));
  470 |             }
  471 |             for page in encoded_column.final_pages {
  472 |                 pages
  473 |                     .entry(page.column_idx)
  474 |                     .or_default()
  475 |                     .push(write_page_to_data_buffer(page, &mut data_buffer));
  476 |             }
  477 |             let col_pages = std::mem::take(pages.entry(col_idx as u32).or_default());
  478 |             page_table.push(Arc::new(ColumnInfo {
  479 |                 index: col_idx as u32,
  480 |                 buffer_offsets_and_sizes: Arc::from(
  481 |                     col_buffer_offsets_and_sizes.into_boxed_slice(),
  482 |                 ),
  483 |                 page_infos: Arc::from(col_pages.into_boxed_slice()),
  484 |                 encoding: encoded_column.encoding,
  485 |             }))
  486 |         }
  487 |         col_idx_offset += num_columns;
  488 |     }
  489 |     let top_level_columns = batch_encoder
  490 |         .field_id_to_column_index
  491 |         .iter()
  492 |         .map(|(_, idx)| *idx)
  493 |         .collect();
  494 |     Ok(EncodedBatch {
  495 |         data: data_buffer.freeze(),
  496 |         top_level_columns,
  497 |         page_table,
  498 |         schema,
  499 |         num_rows: batch.num_rows() as u64,
  500 |     })
  501 | }
  502 | 
  503 | #[cfg(test)]
  504 | mod tests {
  505 |     use super::*;
  506 |     use crate::testing::{TestEncoding, create_test_field_encoder, test_encoding_strategy};
  507 |     use arrow_array::make_array;
  508 |     use arrow_buffer::Buffer;
  509 |     use arrow_data::ArrayData;
  510 |     use arrow_schema::{DataType as ArrowDataType, Field as ArrowField, Fields as ArrowFields};
  511 |     use rstest::rstest;
  512 | 
  513 |     #[rstest]
  514 |     fn test_nested_variable_width_offsets_are_validated_before_dispatch(
  515 |         #[values(TestEncoding::Array, TestEncoding::StructuralU32)] encoding: TestEncoding,
  516 |         #[values(ArrowDataType::Utf8, ArrowDataType::LargeUtf8)] item_type: ArrowDataType,
  517 |     ) {
  518 |         let offsets = match &item_type {
  519 |             ArrowDataType::Utf8 => Buffer::from_slice_ref([0_i32, 2, 1, 3]),
  520 |             ArrowDataType::LargeUtf8 => Buffer::from_slice_ref([0_i64, 2, 1, 3]),
  521 |             _ => unreachable!(),
  522 |         };
  523 |         let child_data = unsafe {
  524 |             ArrayData::builder(item_type.clone())
  525 |                 .len(3)
  526 |                 .add_buffer(offsets)
  527 |                 .add_buffer(Buffer::from(b"abc"))
  528 |                 .build_unchecked()
  529 |         };
  530 |         let item_field = Arc::new(ArrowField::new("item", item_type, false));
  531 |         let data_type = ArrowDataType::FixedSizeList(item_field, 1);
  532 |         let array_data = unsafe {
  533 |             ArrayData::builder(data_type.clone())
  534 |                 .len(3)
  535 |                 .add_child_data(child_data)
  536 |                 .build_unchecked()
  537 |         };
  538 |         let array = make_array(array_data);
  539 |         let field = Field::try_from(&ArrowField::new("payload", data_type, false)).unwrap();
  540 |         let strategy = test_encoding_strategy(encoding);
  541 |         let mut column_index = ColumnIndexSequence::default();
  542 |         let options = EncodingOptions {
  543 |             cache_bytes_per_column: 0,
  544 |             ..Default::default()
  545 |         };
  546 |         let mut encoder =
  547 |             create_test_field_encoder(strategy.as_ref(), &field, &mut column_index, &options)
  548 |                 .unwrap();
  549 |         let mut external_buffers = OutOfLineBuffers::new(0, MIN_PAGE_BUFFER_ALIGNMENT);
  550 | 
  551 |         let error = encoder
  552 |             .maybe_encode(array, &mut external_buffers, RepDefBuilder::default(), 0, 3)
  553 |             .err()
  554 |             .expect("malformed nested offsets should fail before task dispatch");
  555 | 
  556 |         assert!(matches!(error, Error::InvalidInput { .. }));
  557 |         let message = error.to_string();
  558 |         assert!(
  559 |             message.contains("field 'payload'"),
  560 |             "unexpected message: {message}"
  561 |         );
  562 |         assert!(
  563 |             message.contains("non-monotonic offset at position 2"),
  564 |             "unexpected message: {message}"
  565 |         );
  566 |     }
  567 | 
  568 |     #[test]
  569 |     fn test_fixed_size_list_struct_requires_v2_2() {
  570 |         let list_item = ArrowField::new(
  571 |             "item",
  572 |             ArrowDataType::Struct(ArrowFields::from(vec![ArrowField::new(
  573 |                 "x",
  574 |                 ArrowDataType::Int32,
  575 |                 true,
  576 |             )])),
  577 |             true,
  578 |         );
  579 |         let arrow_field = ArrowField::new(
  580 |             "list_struct",
  581 |             ArrowDataType::FixedSizeList(Arc::new(list_item), 2),
  582 |             true,
  583 |         );
  584 |         let field = Field::try_from(&arrow_field).unwrap();
  585 | 
  586 |         let strategy = test_encoding_strategy(TestEncoding::StructuralU16);
  587 |         let mut column_index = ColumnIndexSequence::default();
  588 |         let options = EncodingOptions::default();
  589 | 
  590 |         let result =
  591 |             create_test_field_encoder(strategy.as_ref(), &field, &mut column_index, &options);
  592 |         assert!(
  593 |             result.is_err(),
  594 |             "FixedSizeList<Struct> should be rejected for file version 2.1"
  595 |         );
  596 |         let err = result.err().unwrap();
  597 | 
  598 |         assert!(
  599 |             err.to_string()
  600 |                 .contains("FixedSizeList<Struct> is not enabled by the selected file format")
  601 |         );
  602 |     }
  603 | }
``````
