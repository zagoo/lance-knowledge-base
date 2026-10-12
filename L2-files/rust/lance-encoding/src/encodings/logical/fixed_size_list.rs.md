> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/logical/fixed_size_list.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `87c79963c15c50f8c7a7e1c4f86ecb0c785d7ce89d75332af0db6961c9373e49`. Reviewed physical lines: 1-804.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Structural fixed-size-list wrapper: dimension-scaled scheduling/draining, rep/def validity and garbage filtering for variable-size descendants. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:1-804)

## Complete range analysis

### Lines 1-28

License/module description/imports. Documentation advertises complex Struct/Map/List children and primitive physical encoding, but current structural factory accepts immediate Struct children only; direct List/LargeList/Map and nested FSL<Struct> are rejected by core datatype conversion. Arrow arrays, take, offsets, null buffers and rep/def implement local nesting operations. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:1-28)

### Lines 29-46

Public FixedSizeListStructuralEncoder has private keep_original_array and boxed child encoder. Public constructor stores both without dtype/dimension validation or allocation of another physical column. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:29-46)

### Lines 47-69

FieldEncoder::maybe_encode downcasts to fixed-size list or Internal error; converts signed dimension to usize without local positivity check. Clones values Arc; clones null bitmap when retaining original, otherwise deep-copies only null bitmap at this layer. add_fsl records actual array length, validity and dimension before garbage filtering. Caller num_rows is not checked against array length. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:47-69)

### Lines 70-92

If a validity bitmap exists and descendants require garbage filtering, invert parent validity, expand each mask bit by dimension and filter child values. Some all-valid bitmap still traverses; None skips. Forward same collector and repdef, unchanged row_number and unchecked num_rows*dimension child count. Child values remain shared unless filtering rebuilds them. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:70-92)

### Lines 93-108

flush, num_columns and finish directly delegate to child; FSL wrapper owns no separate page or physical column and performs no local I/O. Errors/futures remain child contracts. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:93-108)

### Lines 109-147

Public Debug StructuralFixedSizeListScheduler stores child scheduler and dimension cast i32->u64 by unchecked constructor. child_ranges allocates mapped ranges with checked multiplication of both endpoints; overflow is InvalidInput including start/end, input value and dimension. It does not validate ordering, overlap, bounds or positive dimension. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:109-147)

### Lines 148-163

schedule_ranges maps child endpoints before invoking child scheduling with unchanged filter and wraps resulting job. Mapping failure prevents child scheduling. No dimension field is written to a page by this scheduler. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:148-163)

### Lines 164-183

initialize maps optional requested ranges synchronously; overflow returns ready error future without child initialization. None remains None. Async future owns optional mapped vector and borrows it for child initialize with same filter/context; no local spawn, independent I/O or cancellation guarantee. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:164-183)

### Lines 184-211

Private Debug StructuralFixedSizeListSchedulingJob owns borrowed child job and dimension. schedule_next delegates first and maps every scan line, preserving decoder messages while integer-dividing rows_scheduled by dimension. No remainder carry/divisibility assertion; nonmultiples truncate per line. Zero dimension panics only if a scan line is mapped, after child advancement. Normal factories validate positive dimensions elsewhere. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:184-211)

### Lines 212-255

Public Debug StructuralFixedSizeListDecoder stores boxed child and dtype unchecked. accept_page forwards unchanged. drain rejects non-FSL dtype with Internal, then drains unchecked num_rows*dimension child rows and wraps task with original outer count and cloned dtype. data_type returns stored reference. Child advancement is not rolled back by later task failure. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:212-255)

### Lines 256-276

Private Debug StructuralFixedSizeListDecodeTask stores child task, dtype and outer num_rows; constructor does not validate. It owns the work consumed by decode. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:256-276)

### Lines 277-306

decode consumes child task first. For FSL, unravel_fsl_validity decimates levels by dimension and yields validity for outer num_rows; FixedSizeListArray::try_new validates Arrow construction. Return new Arc array with remaining repdef and unchanged child data_size (no wrapper accounting). Wrong dtype is Internal after child decode. Dimension/count casts and no separate post-check rely on upstream invariants. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:277-306)

### Lines 307-327

Private needs_garbage_filtering returns true for List/LargeList/ListView/LargeListView/Map, recursively any eligible Struct field or FSL child, false otherwise. Predicate advertises list views although dispatch below cannot process them. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:307-327)

### Lines 328-351

filter_fsl_child_garbage debug-asserts mask length equals array length; dispatches list widths, map, nested FSL or Struct, otherwise returns original Arc. ListView and LargeListView are unimplemented panics. Fixed-size parent slots cannot be dropped; descendants under masked slots are cleared instead. Nested-FSL helper availability does not imply schema admission. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:328-351)

### Lines 352-381

filter_struct_garbage checks for any eligible descendant. None gives Arc of cloned Struct wrapper. Otherwise recursively filter only eligible columns with same supplied mask, share others and preserve fields plus original Struct validity. It does not OR Struct own nulls into mask. StructArray::new construction may panic on invalid assumptions. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:352-381)

### Lines 382-395

expand_garbage_mask repeats each bool dimension times into Vec<bool> with unchecked len*dimension capacity. fsl_validity_to_garbage_mask collects inverse validity. Allocation and integer arithmetic are not recoverable Result errors here. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:382-395)

### Lines 396-431

Generic filter_list_garbage debug-checks mask length, extracts List/LargeList value field and builds zero-based offsets, kept indices and output validity. Masked rows get repeated offset and false validity. Unmasked rows retain their entire physical child range even when own list validity is null, and preserve own validity/default true. Count/offset conversions use unchecked arithmetic/casts. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:396-431)

### Lines 432-457

No kept indices uses empty child slice; otherwise convert usize indices to UInt64Array and Arrow take with expect. Eligible nonempty descendants recurse using an all-false mask, without propagating their own nulls. Always supplies Some null bitmap, including all-valid. Construct GenericListArray from new offsets/values. Memory includes O(kept values) index vector/array and Arrow take output; panics are possible instead of Result. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:432-457)

### Lines 458-487

filter_map_garbage mirrors list filtering with i32 offsets, map entry field, kept entry indices and validity. Masked parent becomes null and empty. Unmasked own-null map still contributes its physical range. Debug assertion is the only explicit mask-length guard. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:458-487)

### Lines 488-518

Map helper slices empty entries or takes selected entries with expect, recursively filters complex entries with all-false mask and requires Struct downcast. Preserves keys_sorted flag and original entry field; MapArray::try_new is followed by expect. Keeps order without sorting or deduplication; always constructs Some validity. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:488-518)

### Lines 519-546

filter_nested_fsl_garbage debug-checks mask length and extracts inner field. If descendant does not need filtering, returns Arc clone unchanged. Otherwise expands supplied mask, recursively rebuilds child and retains original FSL validity. It does not combine own FSL nulls with supplied mask. FixedSizeListArray::new and dimension casts rely on valid input. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:519-546)

### Lines 547-567

Test-only module imports datagen, Arrow builders, rstest and source roundtrip harness. Tests are compiled only under cfg(test); no production environment variable or extra version parameter is introduced by this module. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:547-567)

### Lines 568-581

Test dtype helpers build outer nullable item FSL and simple Struct with nonnullable Float64 x/y children. Dimension remains a caller argument. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:568-581)

### Lines 582-604

Nested Struct fixture contains outer Float64 and nullable inner Struct<Int32 a,b>; another contains nullable List<Int32> values. These are schema fixtures for generated arrays, not explicit numerical output assertions. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:582-604)

### Lines 605-626

Struct-with-list fixture combines id:Int32 with nullable List<Int32> or LargeList<Int64>. Their offset widths and value types differ intentionally. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:605-626)

### Lines 627-652

Additional fixtures put nullable FSL<Float32,4> or Map<Utf8 nonnull key, Int32 nullable value> alongside id in Struct. This is supported outer FSL<Struct> nesting, distinct from direct FSL<Map>. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:627-652)

### Lines 653-695

Unsupported fixtures directly place List<Int32>, LargeList<Int32> or Map under outer FSL dimension2. They target core schema conversion failure, not a later encoder panic. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:653-695)

### Lines 696-717

Fourth unsupported fixture is FSL dimension2 of inner FSL dimension4 of Struct<Int32>. This distinguishes nested FSL<Struct> from Struct containing a primitive FSL. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:696-717)

### Lines 718-752

test_fsl_struct_random has seven named shape cases with outer dimension2, metadata minblock/fullzip, U32/Sparse encoding modes, pages4096/1MiB, slicing false/true and ingest1/5/10: 336 parameter combinations before harness generation. Builds nullable Arrow field with metadata and configures TestCases::basic overrides before check_specific_random. Tests read, not executed. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:718-752)

### Lines 753-763

Four rstest cases for unsupported child shapes call core Field::try_from and assert error message contains Unsupported data type. They do not assert exact Error variant or writer/reader behavior. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:753-763)

### Lines 764-792

test_filter_nested_fsl_garbage builds six singleton lists, wraps dimension2 FSL and masks middle of three rows. Asserts resulting child validity [true,true,false,false,true,true]. Does not explicitly assert offsets, values or outer validity. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:764-792)

### Lines 793-804

test_filter_nested_fsl_no_list_child wraps Int32 values1..6 at dimension2 and masks middle parent. Despite unchanged-array comment, only asserts output length3; identity and payload equality are not checked. Four local test functions,342 parameter instances by source counting, not executed. No direct local tests for overflow, scan-line remainder, keep_original=false or list-view panic. (rust/lance-encoding/src/encodings/logical/fixed_size_list.rs:793-804)

## Interaction and interpretation limits

All physical lines read in bounded untruncated primary-source outputs; no repository tests/builds executed. Local assumptions and factory validation are distinguished. Contextual snippets remain partial coverage.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Encoding support for complex FixedSizeList types (FSL with non-primitive children).
    5 | //!
    6 | //! Primitive FSL (e.g., `FixedSizeList<Int32>`) is handled in the physical encoding layer.
    7 | //! This module handles FSL with complex children (Struct, Map, List) which require
    8 | //! structural encoding.
    9 | 
   10 | use std::{ops::Range, sync::Arc};
   11 | 
   12 | use arrow_array::{Array, ArrayRef, GenericListArray, OffsetSizeTrait, StructArray, cast::AsArray};
   13 | use arrow_buffer::{BooleanBufferBuilder, NullBuffer, OffsetBuffer, ScalarBuffer};
   14 | use arrow_schema::DataType;
   15 | use futures::{FutureExt, future::BoxFuture};
   16 | use lance_arrow::deepcopy::deep_copy_nulls;
   17 | use lance_core::{Error, Result};
   18 | 
   19 | use crate::{
   20 |     decoder::{
   21 |         DecodedArray, FilterExpression, ScheduledScanLine, SchedulerContext,
   22 |         StructuralDecodeArrayTask, StructuralFieldDecoder, StructuralFieldScheduler,
   23 |         StructuralSchedulingJob,
   24 |     },
   25 |     encoder::{EncodeTask, FieldEncoder, OutOfLineBuffers},
   26 |     repdef::RepDefBuilder,
   27 | };
   28 | 
   29 | /// A structural encoder for complex fixed-size list fields
   30 | ///
   31 | /// The FSL's validity is added to the rep/def builder along with the dimension
   32 | /// and the FSL array's values are passed to the child encoder.
   33 | pub struct FixedSizeListStructuralEncoder {
   34 |     keep_original_array: bool,
   35 |     child: Box<dyn FieldEncoder>,
   36 | }
   37 | 
   38 | impl FixedSizeListStructuralEncoder {
   39 |     pub fn new(keep_original_array: bool, child: Box<dyn FieldEncoder>) -> Self {
   40 |         Self {
   41 |             keep_original_array,
   42 |             child,
   43 |         }
   44 |     }
   45 | }
   46 | 
   47 | impl FieldEncoder for FixedSizeListStructuralEncoder {
   48 |     fn maybe_encode(
   49 |         &mut self,
   50 |         array: ArrayRef,
   51 |         external_buffers: &mut OutOfLineBuffers,
   52 |         mut repdef: RepDefBuilder,
   53 |         row_number: u64,
   54 |         num_rows: u64,
   55 |     ) -> Result<Vec<EncodeTask>> {
   56 |         let fsl_arr = array.as_fixed_size_list_opt().ok_or_else(|| {
   57 |             Error::internal("FixedSizeList encoder used for non-fixed-size-list data".to_string())
   58 |         })?;
   59 | 
   60 |         let dimension = fsl_arr.value_length() as usize;
   61 |         let values = fsl_arr.values().clone();
   62 | 
   63 |         let validity = if self.keep_original_array {
   64 |             array.nulls().cloned()
   65 |         } else {
   66 |             deep_copy_nulls(array.nulls())
   67 |         };
   68 |         repdef.add_fsl(validity.clone(), dimension, fsl_arr.len());
   69 | 
   70 |         // FSL forces child elements to exist even under null rows. Normalize any
   71 |         // nested lists under null FSL rows to null empty lists.
   72 |         let values = if let Some(ref fsl_validity) = validity {
   73 |             if needs_garbage_filtering(values.data_type()) {
   74 |                 let is_garbage =
   75 |                     expand_garbage_mask(&fsl_validity_to_garbage_mask(fsl_validity), dimension);
   76 |                 filter_fsl_child_garbage(values, &is_garbage)
   77 |             } else {
   78 |                 values
   79 |             }
   80 |         } else {
   81 |             values
   82 |         };
   83 | 
   84 |         self.child.maybe_encode(
   85 |             values,
   86 |             external_buffers,
   87 |             repdef,
   88 |             row_number,
   89 |             num_rows * dimension as u64,
   90 |         )
   91 |     }
   92 | 
   93 |     fn flush(&mut self, external_buffers: &mut OutOfLineBuffers) -> Result<Vec<EncodeTask>> {
   94 |         self.child.flush(external_buffers)
   95 |     }
   96 | 
   97 |     fn num_columns(&self) -> u32 {
   98 |         self.child.num_columns()
   99 |     }
  100 | 
  101 |     fn finish(
  102 |         &mut self,
  103 |         external_buffers: &mut OutOfLineBuffers,
  104 |     ) -> BoxFuture<'_, Result<Vec<crate::encoder::EncodedColumn>>> {
  105 |         self.child.finish(external_buffers)
  106 |     }
  107 | }
  108 | 
  109 | /// A scheduler for complex fixed-size list fields
  110 | ///
  111 | /// Scales row ranges by the FSL dimension when scheduling child rows,
  112 | /// and scales scheduled rows back when reporting to the parent.
  113 | #[derive(Debug)]
  114 | pub struct StructuralFixedSizeListScheduler {
  115 |     child: Box<dyn StructuralFieldScheduler>,
  116 |     dimension: u64,
  117 | }
  118 | 
  119 | impl StructuralFixedSizeListScheduler {
  120 |     pub fn new(child: Box<dyn StructuralFieldScheduler>, dimension: i32) -> Self {
  121 |         Self {
  122 |             child,
  123 |             dimension: dimension as u64,
  124 |         }
  125 |     }
  126 | 
  127 |     fn child_ranges(&self, ranges: &[Range<u64>]) -> Result<Vec<Range<u64>>> {
  128 |         ranges
  129 |             .iter()
  130 |             .map(|range| {
  131 |                 let start = range.start.checked_mul(self.dimension).ok_or_else(|| {
  132 |                     Error::invalid_input(format!(
  133 |                         "fixed-size-list child range start overflowed: {} * {}",
  134 |                         range.start, self.dimension
  135 |                     ))
  136 |                 })?;
  137 |                 let end = range.end.checked_mul(self.dimension).ok_or_else(|| {
  138 |                     Error::invalid_input(format!(
  139 |                         "fixed-size-list child range end overflowed: {} * {}",
  140 |                         range.end, self.dimension
  141 |                     ))
  142 |                 })?;
  143 |                 Ok(start..end)
  144 |             })
  145 |             .collect()
  146 |     }
  147 | }
  148 | 
  149 | impl StructuralFieldScheduler for StructuralFixedSizeListScheduler {
  150 |     fn schedule_ranges<'a>(
  151 |         &'a self,
  152 |         ranges: &[Range<u64>],
  153 |         filter: &FilterExpression,
  154 |     ) -> Result<Box<dyn StructuralSchedulingJob + 'a>> {
  155 |         // Scale ranges by dimension for the child - each FSL row becomes `dimension` child rows
  156 |         let child_ranges = self.child_ranges(ranges)?;
  157 |         let child = self.child.schedule_ranges(&child_ranges, filter)?;
  158 |         Ok(Box::new(StructuralFixedSizeListSchedulingJob::new(
  159 |             child,
  160 |             self.dimension,
  161 |         )))
  162 |     }
  163 | 
  164 |     fn initialize<'a>(
  165 |         &'a mut self,
  166 |         requested_ranges: Option<&'a [Range<u64>]>,
  167 |         filter: &'a FilterExpression,
  168 |         context: &'a SchedulerContext,
  169 |     ) -> BoxFuture<'a, Result<()>> {
  170 |         let child_ranges = match requested_ranges.map(|ranges| self.child_ranges(ranges)) {
  171 |             Some(Ok(child_ranges)) => Some(child_ranges),
  172 |             Some(Err(error)) => return std::future::ready(Err(error)).boxed(),
  173 |             None => None,
  174 |         };
  175 |         async move {
  176 |             self.child
  177 |                 .initialize(child_ranges.as_deref(), filter, context)
  178 |                 .await
  179 |         }
  180 |         .boxed()
  181 |     }
  182 | }
  183 | 
  184 | #[derive(Debug)]
  185 | struct StructuralFixedSizeListSchedulingJob<'a> {
  186 |     child: Box<dyn StructuralSchedulingJob + 'a>,
  187 |     dimension: u64,
  188 | }
  189 | 
  190 | impl<'a> StructuralFixedSizeListSchedulingJob<'a> {
  191 |     fn new(child: Box<dyn StructuralSchedulingJob + 'a>, dimension: u64) -> Self {
  192 |         Self { child, dimension }
  193 |     }
  194 | }
  195 | 
  196 | impl StructuralSchedulingJob for StructuralFixedSizeListSchedulingJob<'_> {
  197 |     fn schedule_next(&mut self, context: &mut SchedulerContext) -> Result<Vec<ScheduledScanLine>> {
  198 |         // Get the child's scan lines (scheduled in terms of child struct rows)
  199 |         let child_scan_lines = self.child.schedule_next(context)?;
  200 | 
  201 |         // Scale down rows_scheduled by dimension to convert from child rows to FSL rows
  202 |         Ok(child_scan_lines
  203 |             .into_iter()
  204 |             .map(|scan_line| ScheduledScanLine {
  205 |                 decoders: scan_line.decoders,
  206 |                 rows_scheduled: scan_line.rows_scheduled / self.dimension,
  207 |             })
  208 |             .collect())
  209 |     }
  210 | }
  211 | 
  212 | /// A decoder for complex fixed-size list fields
  213 | ///
  214 | /// Drains `num_rows * dimension` from the child decoder and reconstructs
  215 | /// the FSL array with validity from the rep/def information.
  216 | #[derive(Debug)]
  217 | pub struct StructuralFixedSizeListDecoder {
  218 |     child: Box<dyn StructuralFieldDecoder>,
  219 |     data_type: DataType,
  220 | }
  221 | 
  222 | impl StructuralFixedSizeListDecoder {
  223 |     pub fn new(child: Box<dyn StructuralFieldDecoder>, data_type: DataType) -> Self {
  224 |         Self { child, data_type }
  225 |     }
  226 | }
  227 | 
  228 | impl StructuralFieldDecoder for StructuralFixedSizeListDecoder {
  229 |     fn accept_page(&mut self, child: crate::decoder::LoadedPageShard) -> Result<()> {
  230 |         self.child.accept_page(child)
  231 |     }
  232 | 
  233 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn StructuralDecodeArrayTask>> {
  234 |         // For FixedSizeList, we need to drain num_rows * dimension from the child
  235 |         let dimension = match &self.data_type {
  236 |             DataType::FixedSizeList(_, d) => *d as u64,
  237 |             _ => {
  238 |                 return Err(Error::internal(
  239 |                     "FixedSizeListDecoder has non-FSL data type".to_string(),
  240 |                 ));
  241 |             }
  242 |         };
  243 |         let child_task = self.child.drain(num_rows * dimension)?;
  244 |         Ok(Box::new(StructuralFixedSizeListDecodeTask::new(
  245 |             child_task,
  246 |             self.data_type.clone(),
  247 |             num_rows,
  248 |         )))
  249 |     }
  250 | 
  251 |     fn data_type(&self) -> &DataType {
  252 |         &self.data_type
  253 |     }
  254 | }
  255 | 
  256 | #[derive(Debug)]
  257 | struct StructuralFixedSizeListDecodeTask {
  258 |     child_task: Box<dyn StructuralDecodeArrayTask>,
  259 |     data_type: DataType,
  260 |     num_rows: u64,
  261 | }
  262 | 
  263 | impl StructuralFixedSizeListDecodeTask {
  264 |     fn new(
  265 |         child_task: Box<dyn StructuralDecodeArrayTask>,
  266 |         data_type: DataType,
  267 |         num_rows: u64,
  268 |     ) -> Self {
  269 |         Self {
  270 |             child_task,
  271 |             data_type,
  272 |             num_rows,
  273 |         }
  274 |     }
  275 | }
  276 | 
  277 | impl StructuralDecodeArrayTask for StructuralFixedSizeListDecodeTask {
  278 |     fn decode(self: Box<Self>) -> Result<DecodedArray> {
  279 |         let DecodedArray {
  280 |             array,
  281 |             mut repdef,
  282 |             data_size,
  283 |         } = self.child_task.decode()?;
  284 |         match &self.data_type {
  285 |             DataType::FixedSizeList(child_field, dimension) => {
  286 |                 let num_rows = self.num_rows as usize;
  287 |                 let validity = repdef.unravel_fsl_validity(num_rows, *dimension as usize)?;
  288 |                 let fsl_array = arrow_array::FixedSizeListArray::try_new(
  289 |                     child_field.clone(),
  290 |                     *dimension,
  291 |                     array,
  292 |                     validity,
  293 |                 )?;
  294 |                 Ok(DecodedArray {
  295 |                     array: Arc::new(fsl_array),
  296 |                     repdef,
  297 |                     data_size,
  298 |                 })
  299 |             }
  300 |             _ => Err(Error::internal(
  301 |                 "FixedSizeList decoder did not have a fixed-size list field".to_string(),
  302 |             )),
  303 |         }
  304 |     }
  305 | }
  306 | 
  307 | // =======================
  308 | // Garbage filtering
  309 | // =======================
  310 | 
  311 | /// Returns true if the data type contains any variable-length list-like types
  312 | /// (List, LargeList, ListView, LargeListView, Map) that need garbage filtering.
  313 | fn needs_garbage_filtering(data_type: &DataType) -> bool {
  314 |     match data_type {
  315 |         DataType::List(_)
  316 |         | DataType::LargeList(_)
  317 |         | DataType::ListView(_)
  318 |         | DataType::LargeListView(_)
  319 |         | DataType::Map(_, _) => true,
  320 |         DataType::Struct(fields) => fields
  321 |             .iter()
  322 |             .any(|f| needs_garbage_filtering(f.data_type())),
  323 |         DataType::FixedSizeList(field, _) => needs_garbage_filtering(field.data_type()),
  324 |         _ => false,
  325 |     }
  326 | }
  327 | 
  328 | /// Filters garbage (undefined data under null FSL rows) from nested list-like types.
  329 | /// Unlike variable-length lists which can remove null children entirely, FSL children
  330 | /// always exist, so we must clean any nested lists before encoding.
  331 | ///
  332 | /// NB: Nested FSL is currently precluded at a higher level in our system. However, this code
  333 | /// supports and tests it.
  334 | fn filter_fsl_child_garbage(array: ArrayRef, is_garbage: &[bool]) -> ArrayRef {
  335 |     debug_assert_eq!(array.len(), is_garbage.len());
  336 | 
  337 |     match array.data_type() {
  338 |         DataType::List(_) => filter_list_garbage(array.as_list::<i32>(), is_garbage),
  339 |         DataType::LargeList(_) => filter_list_garbage(array.as_list::<i64>(), is_garbage),
  340 |         DataType::ListView(_) | DataType::LargeListView(_) => {
  341 |             unimplemented!("ListView inside complex FSL is not yet supported")
  342 |         }
  343 |         DataType::Map(_, _) => filter_map_garbage(array.as_map(), is_garbage),
  344 |         DataType::FixedSizeList(_, dim) => {
  345 |             filter_nested_fsl_garbage(array.as_fixed_size_list(), is_garbage, *dim as usize)
  346 |         }
  347 |         DataType::Struct(_) => filter_struct_garbage(array.as_struct(), is_garbage),
  348 |         _ => array,
  349 |     }
  350 | }
  351 | 
  352 | fn filter_struct_garbage(struct_arr: &StructArray, is_garbage: &[bool]) -> ArrayRef {
  353 |     let needs_filtering = struct_arr
  354 |         .fields()
  355 |         .iter()
  356 |         .any(|f| needs_garbage_filtering(f.data_type()));
  357 | 
  358 |     if !needs_filtering {
  359 |         return Arc::new(struct_arr.clone());
  360 |     }
  361 | 
  362 |     let new_columns: Vec<ArrayRef> = struct_arr
  363 |         .columns()
  364 |         .iter()
  365 |         .zip(struct_arr.fields().iter())
  366 |         .map(|(col, field)| {
  367 |             if needs_garbage_filtering(field.data_type()) {
  368 |                 filter_fsl_child_garbage(col.clone(), is_garbage)
  369 |             } else {
  370 |                 col.clone()
  371 |             }
  372 |         })
  373 |         .collect();
  374 | 
  375 |     Arc::new(StructArray::new(
  376 |         struct_arr.fields().clone(),
  377 |         new_columns,
  378 |         struct_arr.nulls().cloned(),
  379 |     ))
  380 | }
  381 | 
  382 | fn expand_garbage_mask(is_garbage: &[bool], dimension: usize) -> Vec<bool> {
  383 |     let mut expanded = Vec::with_capacity(is_garbage.len() * dimension);
  384 |     for &garbage in is_garbage {
  385 |         for _ in 0..dimension {
  386 |             expanded.push(garbage);
  387 |         }
  388 |     }
  389 |     expanded
  390 | }
  391 | 
  392 | fn fsl_validity_to_garbage_mask(fsl_validity: &NullBuffer) -> Vec<bool> {
  393 |     fsl_validity.iter().map(|valid| !valid).collect()
  394 | }
  395 | 
  396 | fn filter_list_garbage<O: OffsetSizeTrait>(
  397 |     list_arr: &GenericListArray<O>,
  398 |     is_garbage: &[bool],
  399 | ) -> ArrayRef {
  400 |     debug_assert_eq!(
  401 |         list_arr.len(),
  402 |         is_garbage.len(),
  403 |         "list length must match garbage mask length"
  404 |     );
  405 | 
  406 |     let old_offsets = list_arr.offsets();
  407 |     let value_field = match list_arr.data_type() {
  408 |         DataType::List(f) | DataType::LargeList(f) => f.clone(),
  409 |         _ => unreachable!(),
  410 |     };
  411 | 
  412 |     let mut new_offsets: Vec<O> = Vec::with_capacity(list_arr.len() + 1);
  413 |     let mut values_to_keep: Vec<usize> = Vec::new();
  414 |     let mut validity_builder = BooleanBufferBuilder::new(list_arr.len());
  415 |     let mut current_offset = O::usize_as(0);
  416 |     new_offsets.push(current_offset);
  417 |     let old_validity = list_arr.nulls();
  418 | 
  419 |     for (i, &garbage) in is_garbage.iter().enumerate() {
  420 |         if garbage {
  421 |             new_offsets.push(current_offset);
  422 |             validity_builder.append(false);
  423 |         } else {
  424 |             let start = old_offsets[i].as_usize();
  425 |             let end = old_offsets[i + 1].as_usize();
  426 |             values_to_keep.extend(start..end);
  427 |             current_offset += O::usize_as(end - start);
  428 |             new_offsets.push(current_offset);
  429 |             validity_builder.append(old_validity.map(|v| v.is_valid(i)).unwrap_or(true));
  430 |         }
  431 |     }
  432 | 
  433 |     let new_values = if values_to_keep.is_empty() {
  434 |         list_arr.values().slice(0, 0)
  435 |     } else {
  436 |         let indices =
  437 |             arrow_array::UInt64Array::from_iter_values(values_to_keep.iter().map(|&i| i as u64));
  438 |         arrow_select::take::take(list_arr.values().as_ref(), &indices, None)
  439 |             .expect("take should succeed")
  440 |     };
  441 | 
  442 |     let new_values = if needs_garbage_filtering(value_field.data_type()) && !new_values.is_empty() {
  443 |         let len = new_values.len();
  444 |         filter_fsl_child_garbage(new_values, &vec![false; len])
  445 |     } else {
  446 |         new_values
  447 |     };
  448 | 
  449 |     let new_validity = NullBuffer::new(validity_builder.finish());
  450 |     Arc::new(GenericListArray::new(
  451 |         value_field,
  452 |         OffsetBuffer::new(ScalarBuffer::from(new_offsets)),
  453 |         new_values,
  454 |         Some(new_validity),
  455 |     ))
  456 | }
  457 | 
  458 | fn filter_map_garbage(map_arr: &arrow_array::MapArray, is_garbage: &[bool]) -> ArrayRef {
  459 |     debug_assert_eq!(map_arr.len(), is_garbage.len());
  460 | 
  461 |     let old_offsets = map_arr.offsets();
  462 |     let entries_field = match map_arr.data_type() {
  463 |         DataType::Map(field, _) => field.clone(),
  464 |         _ => unreachable!(),
  465 |     };
  466 | 
  467 |     let mut new_offsets: Vec<i32> = Vec::with_capacity(map_arr.len() + 1);
  468 |     let mut values_to_keep: Vec<usize> = Vec::new();
  469 |     let mut validity_builder = BooleanBufferBuilder::new(map_arr.len());
  470 |     let mut current_offset: i32 = 0;
  471 |     new_offsets.push(current_offset);
  472 |     let old_validity = map_arr.nulls();
  473 | 
  474 |     for (i, &garbage) in is_garbage.iter().enumerate() {
  475 |         if garbage {
  476 |             new_offsets.push(current_offset);
  477 |             validity_builder.append(false);
  478 |         } else {
  479 |             let start = old_offsets[i] as usize;
  480 |             let end = old_offsets[i + 1] as usize;
  481 |             values_to_keep.extend(start..end);
  482 |             current_offset += (end - start) as i32;
  483 |             new_offsets.push(current_offset);
  484 |             validity_builder.append(old_validity.map(|v| v.is_valid(i)).unwrap_or(true));
  485 |         }
  486 |     }
  487 | 
  488 |     let new_entries: ArrayRef = if values_to_keep.is_empty() {
  489 |         Arc::new(map_arr.entries().slice(0, 0))
  490 |     } else {
  491 |         let indices =
  492 |             arrow_array::UInt64Array::from_iter_values(values_to_keep.iter().map(|&i| i as u64));
  493 |         arrow_select::take::take(map_arr.entries(), &indices, None).expect("take should succeed")
  494 |     };
  495 | 
  496 |     let new_entries =
  497 |         if needs_garbage_filtering(entries_field.data_type()) && !new_entries.is_empty() {
  498 |             let len = new_entries.len();
  499 |             filter_fsl_child_garbage(new_entries, &vec![false; len])
  500 |         } else {
  501 |             new_entries
  502 |         };
  503 | 
  504 |     let new_validity = NullBuffer::new(validity_builder.finish());
  505 |     let keys_sorted = matches!(map_arr.data_type(), DataType::Map(_, true));
  506 | 
  507 |     Arc::new(
  508 |         arrow_array::MapArray::try_new(
  509 |             entries_field,
  510 |             OffsetBuffer::new(ScalarBuffer::from(new_offsets)),
  511 |             new_entries.as_struct().clone(),
  512 |             Some(new_validity),
  513 |             keys_sorted,
  514 |         )
  515 |         .expect("MapArray construction should succeed"),
  516 |     )
  517 | }
  518 | 
  519 | /// Filters garbage from nested FSL arrays that contain list-like children.
  520 | fn filter_nested_fsl_garbage(
  521 |     fsl_arr: &arrow_array::FixedSizeListArray,
  522 |     is_garbage: &[bool],
  523 |     dimension: usize,
  524 | ) -> ArrayRef {
  525 |     debug_assert_eq!(fsl_arr.len(), is_garbage.len());
  526 | 
  527 |     let child_field = match fsl_arr.data_type() {
  528 |         DataType::FixedSizeList(field, _) => field.clone(),
  529 |         _ => unreachable!(),
  530 |     };
  531 | 
  532 |     if !needs_garbage_filtering(child_field.data_type()) {
  533 |         return Arc::new(fsl_arr.clone());
  534 |     }
  535 | 
  536 |     let child_garbage = expand_garbage_mask(is_garbage, dimension);
  537 |     let new_values = filter_fsl_child_garbage(fsl_arr.values().clone(), &child_garbage);
  538 | 
  539 |     Arc::new(arrow_array::FixedSizeListArray::new(
  540 |         child_field,
  541 |         dimension as i32,
  542 |         new_values,
  543 |         fsl_arr.nulls().cloned(),
  544 |     ))
  545 | }
  546 | 
  547 | #[cfg(test)]
  548 | mod tests {
  549 |     use std::{collections::HashMap, sync::Arc};
  550 | 
  551 |     use arrow_array::{
  552 |         Array, FixedSizeListArray,
  553 |         builder::{Int32Builder, ListBuilder},
  554 |         cast::AsArray,
  555 |     };
  556 |     use arrow_schema::{DataType, Field, Fields};
  557 |     use rstest::rstest;
  558 | 
  559 |     use super::filter_nested_fsl_garbage;
  560 |     use crate::{
  561 |         constants::{
  562 |             STRUCTURAL_ENCODING_FULLZIP, STRUCTURAL_ENCODING_META_KEY,
  563 |             STRUCTURAL_ENCODING_MINIBLOCK,
  564 |         },
  565 |         testing::{TestCases, TestEncoding, check_specific_random},
  566 |     };
  567 | 
  568 |     fn make_fsl_struct_type(struct_fields: Fields, dimension: i32) -> DataType {
  569 |         DataType::FixedSizeList(
  570 |             Arc::new(Field::new("item", DataType::Struct(struct_fields), true)),
  571 |             dimension,
  572 |         )
  573 |     }
  574 | 
  575 |     fn simple_struct_fields() -> Fields {
  576 |         Fields::from(vec![
  577 |             Field::new("x", DataType::Float64, false),
  578 |             Field::new("y", DataType::Float64, false),
  579 |         ])
  580 |     }
  581 | 
  582 |     fn nested_struct_fields() -> Fields {
  583 |         let inner = Fields::from(vec![
  584 |             Field::new("a", DataType::Int32, false),
  585 |             Field::new("b", DataType::Int32, false),
  586 |         ]);
  587 |         Fields::from(vec![
  588 |             Field::new("outer_val", DataType::Float64, false),
  589 |             Field::new("inner", DataType::Struct(inner), true),
  590 |         ])
  591 |     }
  592 | 
  593 |     fn nested_struct_with_list_fields() -> Fields {
  594 |         let inner = Fields::from(vec![Field::new(
  595 |             "values",
  596 |             DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
  597 |             true,
  598 |         )]);
  599 |         Fields::from(vec![
  600 |             Field::new("id", DataType::Int32, false),
  601 |             Field::new("inner", DataType::Struct(inner), true),
  602 |         ])
  603 |     }
  604 | 
  605 |     fn struct_with_list_fields() -> Fields {
  606 |         Fields::from(vec![
  607 |             Field::new("id", DataType::Int32, false),
  608 |             Field::new(
  609 |                 "values",
  610 |                 DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
  611 |                 true,
  612 |             ),
  613 |         ])
  614 |     }
  615 | 
  616 |     fn struct_with_large_list_fields() -> Fields {
  617 |         Fields::from(vec![
  618 |             Field::new("id", DataType::Int32, false),
  619 |             Field::new(
  620 |                 "values",
  621 |                 DataType::LargeList(Arc::new(Field::new("item", DataType::Int64, true))),
  622 |                 true,
  623 |             ),
  624 |         ])
  625 |     }
  626 | 
  627 |     fn struct_with_nested_fsl_fields() -> Fields {
  628 |         Fields::from(vec![
  629 |             Field::new("id", DataType::Int32, false),
  630 |             Field::new(
  631 |                 "vectors",
  632 |                 DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Float32, true)), 4),
  633 |                 true,
  634 |             ),
  635 |         ])
  636 |     }
  637 | 
  638 |     fn struct_with_map_fields() -> Fields {
  639 |         let entries_field = Arc::new(Field::new(
  640 |             "entries",
  641 |             DataType::Struct(Fields::from(vec![
  642 |                 Field::new("keys", DataType::Utf8, false),
  643 |                 Field::new("values", DataType::Int32, true),
  644 |             ])),
  645 |             false,
  646 |         ));
  647 |         Fields::from(vec![
  648 |             Field::new("id", DataType::Int32, false),
  649 |             Field::new("props", DataType::Map(entries_field, false), true),
  650 |         ])
  651 |     }
  652 | 
  653 |     fn make_fsl_of_list() -> DataType {
  654 |         DataType::FixedSizeList(
  655 |             Arc::new(Field::new(
  656 |                 "item",
  657 |                 DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
  658 |                 true,
  659 |             )),
  660 |             2,
  661 |         )
  662 |     }
  663 | 
  664 |     fn make_fsl_of_large_list() -> DataType {
  665 |         DataType::FixedSizeList(
  666 |             Arc::new(Field::new(
  667 |                 "item",
  668 |                 DataType::LargeList(Arc::new(Field::new("item", DataType::Int32, true))),
  669 |                 true,
  670 |             )),
  671 |             2,
  672 |         )
  673 |     }
  674 | 
  675 |     fn make_fsl_of_map() -> DataType {
  676 |         DataType::FixedSizeList(
  677 |             Arc::new(Field::new(
  678 |                 "item",
  679 |                 DataType::Map(
  680 |                     Arc::new(Field::new(
  681 |                         "entries",
  682 |                         DataType::Struct(Fields::from(vec![
  683 |                             Field::new("key", DataType::Utf8, false),
  684 |                             Field::new("value", DataType::Int32, true),
  685 |                         ])),
  686 |                         false,
  687 |                     )),
  688 |                     false,
  689 |                 ),
  690 |                 true,
  691 |             )),
  692 |             2,
  693 |         )
  694 |     }
  695 | 
  696 |     fn make_fsl_of_nested_fsl_struct() -> DataType {
  697 |         DataType::FixedSizeList(
  698 |             Arc::new(Field::new(
  699 |                 "item",
  700 |                 DataType::FixedSizeList(
  701 |                     Arc::new(Field::new(
  702 |                         "item",
  703 |                         DataType::Struct(Fields::from(vec![Field::new(
  704 |                             "x",
  705 |                             DataType::Int32,
  706 |                             true,
  707 |                         )])),
  708 |                         true,
  709 |                     )),
  710 |                     4,
  711 |                 ),
  712 |                 true,
  713 |             )),
  714 |             2,
  715 |         )
  716 |     }
  717 | 
  718 |     #[rstest]
  719 |     #[case::simple(simple_struct_fields(), 2)]
  720 |     #[case::nested_struct(nested_struct_fields(), 2)]
  721 |     #[case::struct_with_list(struct_with_list_fields(), 2)]
  722 |     #[case::struct_with_large_list(struct_with_large_list_fields(), 2)]
  723 |     #[case::nested_struct_with_list(nested_struct_with_list_fields(), 2)]
  724 |     #[case::struct_with_nested_fsl(struct_with_nested_fsl_fields(), 2)]
  725 |     #[case::struct_with_map(struct_with_map_fields(), 2)]
  726 |     #[test_log::test(tokio::test)]
  727 |     async fn test_fsl_struct_random(
  728 |         #[case] struct_fields: Fields,
  729 |         #[case] dimension: i32,
  730 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  731 |         structural_encoding: &str,
  732 |         #[values(TestEncoding::StructuralU32, TestEncoding::StructuralSparse)]
  733 |         encoding: TestEncoding,
  734 |         #[values(4096, 1024 * 1024)] page_size: u64,
  735 |         #[values(false, true)] use_slicing: bool,
  736 |         #[values(1, 5, 10)] ingest_batch_count: u32,
  737 |     ) {
  738 |         let data_type = make_fsl_struct_type(struct_fields, dimension);
  739 |         let mut field_metadata = HashMap::new();
  740 |         field_metadata.insert(
  741 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  742 |             structural_encoding.into(),
  743 |         );
  744 |         let field = Field::new("", data_type, true).with_metadata(field_metadata);
  745 |         let test_cases = TestCases::basic()
  746 |             .with_encoding(encoding)
  747 |             .with_page_sizes(vec![page_size])
  748 |             .with_slicing_modes([use_slicing])
  749 |             .with_ingest_batch_counts([ingest_batch_count]);
  750 |         check_specific_random(field, test_cases).await;
  751 |     }
  752 | 
  753 |     #[rstest]
  754 |     #[case::list(make_fsl_of_list())]
  755 |     #[case::large_list(make_fsl_of_large_list())]
  756 |     #[case::map(make_fsl_of_map())]
  757 |     #[case::nested_fsl_struct(make_fsl_of_nested_fsl_struct())]
  758 |     fn test_unsupported_fsl_child_types_return_error(#[case] data_type: DataType) {
  759 |         let arrow_field = Field::new("test", data_type, true);
  760 |         let err = lance_core::datatypes::Field::try_from(&arrow_field).unwrap_err();
  761 |         assert!(err.to_string().contains("Unsupported data type"));
  762 |     }
  763 | 
  764 |     #[test]
  765 |     fn test_filter_nested_fsl_garbage() {
  766 |         // Create FSL<List<Int32>> with dimension 2: [[[1], [2]], [[3], [4]], [[5], [6]]]
  767 |         let mut list_builder = ListBuilder::new(Int32Builder::new());
  768 |         for i in 1..=6 {
  769 |             list_builder.values().append_value(i);
  770 |             list_builder.append(true);
  771 |         }
  772 |         let list_arr = list_builder.finish();
  773 | 
  774 |         let fsl_field = Arc::new(Field::new(
  775 |             "item",
  776 |             DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
  777 |             true,
  778 |         ));
  779 |         let fsl = FixedSizeListArray::new(fsl_field, 2, Arc::new(list_arr), None);
  780 | 
  781 |         // Mark second FSL row as garbage
  782 |         let result = filter_nested_fsl_garbage(&fsl, &[false, true, false], 2);
  783 |         let result = result.as_fixed_size_list();
  784 | 
  785 |         // Child lists at positions 2,3 (garbage row 1) should be filtered to null
  786 |         let child_list = result.values().as_list::<i32>();
  787 |         assert_eq!(
  788 |             (0..6).map(|i| child_list.is_valid(i)).collect::<Vec<_>>(),
  789 |             vec![true, true, false, false, true, true]
  790 |         );
  791 |     }
  792 | 
  793 |     #[test]
  794 |     fn test_filter_nested_fsl_no_list_child() {
  795 |         // FSL<Int32> - no list child, should return unchanged
  796 |         let fsl_field = Arc::new(Field::new("item", DataType::Int32, true));
  797 |         let values = arrow_array::Int32Array::from(vec![1, 2, 3, 4, 5, 6]);
  798 |         let fsl = FixedSizeListArray::new(fsl_field, 2, Arc::new(values), None);
  799 | 
  800 |         let result = filter_nested_fsl_garbage(&fsl, &[false, true, false], 2);
  801 |         // Should return the same array unchanged
  802 |         assert_eq!(result.len(), 3);
  803 |     }
  804 | }
``````
