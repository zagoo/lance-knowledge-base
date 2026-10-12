> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/logical/primitive/constant.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ae3ed04c52d483d101980d5024440e1706415371a07fd09747ddbce8b30e79f9`. Reviewed physical lines: 1-522.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Structural constant-page encoding, scalar/level initialization and cache loading, selected-row level extraction and Arrow materialization. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:1-522)

## Complete range analysis

### Lines 1-29

Imports connect scalar helpers, rep/def serialization, DataBlock materialization, three-slot initialization and parent-private structural page contracts. This module is public, but most implementation types and methods are private or crate-internal. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:1-29)

### Lines 30-51

crate-internal encode_constant_page accepts scalar, serialized levels and page identity. try_inline_value decides inline bytes; otherwise encode_scalar_value_buffer frames scalar buffers. Metadata records definition meanings and optional inline bytes. Validation of scalar shape is delegated; local row/count/type consistency is not checked. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:30-51)

### Lines 52-78

If either level Option is Some, even an empty buffer, output reserves both repetition and definition slots, using empty bytes for the absent one. External scalar gives [value,rep,def], inline gives [rep,def]. With neither level, external gives [value], inline gives no buffers. Levels clone u16 storage then reinterpret bytes. EncodedPage carries supplied counts and Structural encoding. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:52-78)

### Lines 79-99

CachedConstantState holds scalar ArrayRef and optional u16 repetition/definition buffers. DeepSizeOf adds Arrow reported buffer memory and two bytes per level, ignoring the Context and shared-allocation deduplication/capacity. Erased Arc conversion returns self. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:79-99)

### Lines 100-116

ScalarSource is Inline(Vec<u8>) or ValueBuffer(index). ConstantBufferLayout stores scalar source and optional rep/def byte ranges, defining a single consistent buffer-slot interpretation. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:100-116)

### Lines 117-146

ConstantPageScheduler stores type, meanings, maximum repetition/visible levels, buffer layout and optional cache state. Constructor counts list meanings then casts to u16; max_visible_level is delegated. Inline bytes are copied. Positions plus sizes form ranges using unchecked addition. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:117-146)

### Lines 147-180

Accepted layouts: inline with zero buffers, inline with two rep/def buffers, external with one value buffer, external with three value/rep/def buffers. Inline with other counts is InvalidInput. Zero-sized rep/def buffers become None; external value buffer remains a required scalar range even when empty. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:147-180)

### Lines 181-207

No-inline zero buffers is missing scalar InvalidInput; two is ambiguous InvalidInput; other unexpected counts rejected. Constructor stores state with no cached data. It does not decode/validate inline bytes, array length, level counts/values, alignment or file bounds. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:181-207)

### Lines 208-237

StructuralPageScheduler init_layout returns exactly three optional semantic slots: scalar, repetition, definition. init_from_buffers returns a boxed future with the trait method borrow lifetime, checks three-slot conversion and matches scalar source with supplied scalar buffer. Inline requires no scalar buffer; external requires one; mismatches are Internal. I/O argument is unused. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:208-237)

### Lines 238-260

Initialization decodes inline scalar or framed external scalar, maps provided rep/def Bytes through LanceBuffer alignment2 into u16 buffers, and returns Arc<CachedConstantState>. No local level-size/count/meaning validation. This future does no additional I/O and does not install returned cache state into the scheduler. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:238-260)

### Lines 261-281

try_load downcasts erased cached data to exact CachedConstantState, rejecting other types as InvalidInput. It checks scalar Arrow data type equals scheduler type, with both types in the error, then stores state. It does not revalidate scalar length, levels, meanings or cache-key identity. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:261-281)

### Lines 282-307

schedule_ranges sums unchecked end-start, unwraps cached state and constructs one ready PageLoadTask with cloned shared scalar/levels, owned range queue and zero row/level cursors. Calling before try_load panics. Empty ranges still produce a task. I/O argument is unused; all data was initialized earlier. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:282-307)

### Lines 308-340

ConstantPageDecoder owns range queue, row/level cursors, original scheduled row count and shared cached arrays. drain_ranges removes or splits queue fronts until requested rows collected. Over-drain unwraps empty queue; reversed ranges underflow. Zero-row drain returns empty. Mutation is eager with no rollback. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:308-340)

### Lines 341-376

take_row with repetition requires cursor in bounds and rep[cursor]==max_rep, else Internal; scans until next max_rep or EOF. Without repetition it uses one level. With definitions it counts entries <=max_visible_level, directly slicing corresponding levels (short buffers can panic); otherwise all positions visible. Other repetition values are not range-checked. Successful call advances both cursors. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:341-376)

### Lines 377-384

skip_to_row advances only forward by parsing each skipped row. Decreasing or overlapping ranges are not rejected or rewound, so correct scheduling requires sorted nonoverlapping row ranges. Cost includes skipped levels from cursor to next range. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:377-384)

### Lines 385-422

drain first consumes queue ranges, then skips/parses rows, accumulates visible leaf values and merges adjacent selected level spans. Errors can leave queue and cursors partly advanced. It returns a task sharing scalar/levels and owning span list. num_rows reports original scheduled count, not remaining count. decoded_bytes is not overridden, so parent trait default applies. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:385-422)

### Lines 423-448

DecodeConstantTask holds source scalar/levels, selected spans, level meanings and visible count. slice_levels allocates exact summed selected lengths and copies each selected segment; absent levels remain absent. Sum and slice bounds are unchecked. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:423-448)

### Lines 449-471

materialize_values returns typed empty array for zero values. Empty Struct is special-cased to new_empty_fields. Other values allocate num_values UInt64 zero indices and Arrow take of scalar index0; memory cost includes eight bytes per index plus output, so constant encoding does not imply constant-memory decoding. num_values casts to usize and scalar length assumptions remain. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:449-471)

### Lines 472-494

Decode task copies selected repetition/definition levels, recomputes visible count from copied definitions when present, materializes scalar values, creates DataBlock through from_array and RepDefUnraveler with meanings/count. Parent reconstruction applies null/nested structure. No direct decode validation flag is accepted here. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:472-494)

### Lines 495-522

One local test constructs UInt8 scheduler using empty inline bytes without decoding them, then passes Boolean cached scalar and asserts InvalidInput mentions both types. No local complete constant roundtrip, range ordering, pre-load scheduling, empty/all-null or repetition corruption test. Empty-Struct decoder branch alone does not prove current writer emits it. No local unsafe blocks. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:495-522)

## Interaction and interpretation limits

Every physical line read in bounded untruncated outputs. Source-only analysis; no repository build/test/runtime. Parent primitive and Arrow scalar modules read only in specified contextual ranges. Caller invariants and possible panics are source deductions, not reproduced failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{any::Any, collections::VecDeque, ops::Range, sync::Arc};
    5 | 
    6 | use arrow_array::{Array, ArrayRef, new_empty_array};
    7 | use arrow_buffer::ScalarBuffer;
    8 | use arrow_schema::DataType;
    9 | use bytes::Bytes;
   10 | use futures::FutureExt;
   11 | use futures::future::BoxFuture;
   12 | 
   13 | use lance_core::{
   14 |     Error, Result,
   15 |     cache::{Context, DeepSizeOf},
   16 | };
   17 | 
   18 | use crate::{
   19 |     EncodingsIo,
   20 |     buffer::LanceBuffer,
   21 |     decoder::PageEncoding,
   22 |     encoder::EncodedPage,
   23 |     encodings::logical::primitive::{
   24 |         CachedPageData, PageInitialization, PageInitializationBuffers, PageLoadTask,
   25 |     },
   26 |     format::ProtobufUtils21,
   27 |     repdef::{DefinitionInterpretation, RepDefUnraveler, max_visible_level},
   28 | };
   29 | 
   30 | pub(crate) fn encode_constant_page(
   31 |     column_idx: u32,
   32 |     scalar: ArrayRef,
   33 |     repdef: crate::repdef::SerializedRepDefs,
   34 |     row_number: u64,
   35 |     num_rows: u64,
   36 | ) -> Result<EncodedPage> {
   37 |     let inline_value = lance_arrow::scalar::try_inline_value(&scalar);
   38 |     let value_buffer = if inline_value.is_some() {
   39 |         None
   40 |     } else {
   41 |         Some(LanceBuffer::from(
   42 |             lance_arrow::scalar::encode_scalar_value_buffer(&scalar)?,
   43 |         ))
   44 |     };
   45 | 
   46 |     let description = ProtobufUtils21::constant_layout(&repdef.def_meaning, inline_value);
   47 | 
   48 |     let has_repdef = repdef.repetition_levels.is_some() || repdef.definition_levels.is_some();
   49 | 
   50 |     let data = if !has_repdef {
   51 |         value_buffer.into_iter().collect::<Vec<_>>()
   52 |     } else {
   53 |         let rep_bytes = repdef
   54 |             .repetition_levels
   55 |             .as_ref()
   56 |             .map(|rep| LanceBuffer::reinterpret_slice(rep.clone()))
   57 |             .unwrap_or_else(LanceBuffer::empty);
   58 |         let def_bytes = repdef
   59 |             .definition_levels
   60 |             .as_ref()
   61 |             .map(|def| LanceBuffer::reinterpret_slice(def.clone()))
   62 |             .unwrap_or_else(LanceBuffer::empty);
   63 | 
   64 |         match value_buffer {
   65 |             Some(value_buffer) => vec![value_buffer, rep_bytes, def_bytes],
   66 |             None => vec![rep_bytes, def_bytes],
   67 |         }
   68 |     };
   69 | 
   70 |     Ok(EncodedPage {
   71 |         column_idx,
   72 |         data,
   73 |         description: PageEncoding::Structural(description),
   74 |         num_rows,
   75 |         row_number,
   76 |     })
   77 | }
   78 | 
   79 | #[derive(Debug)]
   80 | struct CachedConstantState {
   81 |     scalar: ArrayRef,
   82 |     rep: Option<ScalarBuffer<u16>>,
   83 |     def: Option<ScalarBuffer<u16>>,
   84 | }
   85 | 
   86 | impl DeepSizeOf for CachedConstantState {
   87 |     fn deep_size_of_children(&self, _ctx: &mut Context) -> usize {
   88 |         self.scalar.get_buffer_memory_size()
   89 |             + self.rep.as_ref().map(|buf| buf.len() * 2).unwrap_or(0)
   90 |             + self.def.as_ref().map(|buf| buf.len() * 2).unwrap_or(0)
   91 |     }
   92 | }
   93 | 
   94 | impl CachedPageData for CachedConstantState {
   95 |     fn as_arc_any(self: Arc<Self>) -> Arc<dyn Any + Send + Sync + 'static> {
   96 |         self
   97 |     }
   98 | }
   99 | 
  100 | #[derive(Debug, Clone)]
  101 | enum ScalarSource {
  102 |     Inline(Vec<u8>),
  103 |     ValueBuffer(usize),
  104 | }
  105 | 
  106 | /// The (scalar, rep, def) file ranges a constant page reads, in the order
  107 | /// `init_layout` declares and `init_from_buffers` consumes them.  Any field is
  108 | /// `None` when that buffer is absent. Computed once at construction so the two
  109 | /// halves share one source of truth and their buffer order cannot drift.
  110 | #[derive(Debug)]
  111 | struct ConstantBufferLayout {
  112 |     scalar: Option<Range<u64>>,
  113 |     rep: Option<Range<u64>>,
  114 |     def: Option<Range<u64>>,
  115 | }
  116 | 
  117 | #[derive(Debug)]
  118 | pub struct ConstantPageScheduler {
  119 |     scalar_source: ScalarSource,
  120 |     data_type: DataType,
  121 |     def_meaning: Arc<[DefinitionInterpretation]>,
  122 |     max_rep: u16,
  123 |     max_visible_def: u16,
  124 |     layout: ConstantBufferLayout,
  125 |     repdef: Option<Arc<CachedConstantState>>,
  126 | }
  127 | 
  128 | impl ConstantPageScheduler {
  129 |     pub fn try_new(
  130 |         buffer_offsets_and_sizes: Arc<[(u64, u64)]>,
  131 |         inline_value: Option<Bytes>,
  132 |         data_type: DataType,
  133 |         def_meaning: Arc<[DefinitionInterpretation]>,
  134 |     ) -> Result<Self> {
  135 |         let max_rep = def_meaning.iter().filter(|d| d.is_list()).count() as u16;
  136 |         let max_visible_def = max_visible_level(&def_meaning);
  137 | 
  138 |         let (scalar_source, rep_buf_idx, def_buf_idx) =
  139 |             match (inline_value, buffer_offsets_and_sizes.len()) {
  140 |                 (Some(inline), 0) => (ScalarSource::Inline(inline.to_vec()), None, None),
  141 |                 (Some(inline), 2) => (ScalarSource::Inline(inline.to_vec()), Some(0), Some(1)),
  142 |                 (None, 1) => (ScalarSource::ValueBuffer(0), None, None),
  143 |                 (None, 3) => (ScalarSource::ValueBuffer(0), Some(1), Some(2)),
  144 |                 (Some(_inline), 1) => {
  145 |                     return Err(Error::invalid_input(format!(
  146 |                         "Invalid constant layout: inline_value present with {} buffers",
  147 |                         1
  148 |                     )));
  149 |                 }
  150 |                 (Some(_inline), 3) => {
  151 |                     return Err(Error::invalid_input(
  152 |                         "Invalid constant layout: inline_value present with 3 buffers",
  153 |                     ));
  154 |                 }
  155 |                 (None, 0) => {
  156 |                     return Err(Error::invalid_input(
  157 |                         "Invalid constant layout: missing scalar source",
  158 |                     ));
  159 |                 }
  160 |                 (None, 2) => {
  161 |                     return Err(Error::invalid_input(
  162 |                         "Invalid constant layout: ambiguous (2 buffers and no inline_value)",
  163 |                     ));
  164 |                 }
  165 |                 (Some(_), n) => {
  166 |                     return Err(Error::invalid_input(format!(
  167 |                         "Invalid constant layout: inline_value present with {} buffers",
  168 |                         n
  169 |                     )));
  170 |                 }
  171 |                 (None, n) => {
  172 |                     return Err(Error::invalid_input(format!(
  173 |                         "Invalid constant layout: unexpected buffer count {}",
  174 |                         n
  175 |                     )));
  176 |                 }
  177 |             };
  178 | 
  179 |         let range_of = |idx: usize| {
  180 |             let (pos, len) = buffer_offsets_and_sizes[idx];
  181 |             pos..pos + len
  182 |         };
  183 |         let layout = ConstantBufferLayout {
  184 |             scalar: match &scalar_source {
  185 |                 ScalarSource::ValueBuffer(idx) => Some(range_of(*idx)),
  186 |                 ScalarSource::Inline(_) => None,
  187 |             },
  188 |             rep: rep_buf_idx
  189 |                 .filter(|&idx| buffer_offsets_and_sizes[idx].1 > 0)
  190 |                 .map(range_of),
  191 |             def: def_buf_idx
  192 |                 .filter(|&idx| buffer_offsets_and_sizes[idx].1 > 0)
  193 |                 .map(range_of),
  194 |         };
  195 | 
  196 |         Ok(Self {
  197 |             scalar_source,
  198 |             data_type,
  199 |             def_meaning,
  200 |             max_rep,
  201 |             max_visible_def,
  202 |             layout,
  203 |             repdef: None,
  204 |         })
  205 |     }
  206 | }
  207 | 
  208 | impl crate::encodings::logical::primitive::StructuralPageScheduler for ConstantPageScheduler {
  209 |     fn init_layout(&self) -> Result<PageInitialization> {
  210 |         // Order must match `init_from_buffers`' consumption: scalar, rep, def.
  211 |         Ok(PageInitialization::new([
  212 |             self.layout.scalar.clone(),
  213 |             self.layout.rep.clone(),
  214 |             self.layout.def.clone(),
  215 |         ]))
  216 |     }
  217 | 
  218 |     fn init_from_buffers<'a>(
  219 |         &'a mut self,
  220 |         buffers: PageInitializationBuffers,
  221 |         _io: &Arc<dyn EncodingsIo>,
  222 |     ) -> BoxFuture<'a, Result<Arc<dyn CachedPageData>>> {
  223 |         // Consume `buffers` in the same scalar, rep, def order `init_layout`
  224 |         // declared them, using the shared layout's presence flags.
  225 |         let scalar_source = self.scalar_source.clone();
  226 |         let data_type = self.data_type.clone();
  227 |         async move {
  228 |             let [scalar_buffer, rep_buffer, def_buffer] = buffers.try_into_array("constant")?;
  229 | 
  230 |             let scalar = match (scalar_source, scalar_buffer) {
  231 |                 (ScalarSource::Inline(inline), None) => {
  232 |                     lance_arrow::scalar::decode_scalar_from_inline_value(&data_type, &inline)?
  233 |                 }
  234 |                 (ScalarSource::ValueBuffer(_), Some(bytes)) => {
  235 |                     let buf = LanceBuffer::from_bytes(bytes, 1);
  236 |                     lance_arrow::scalar::decode_scalar_from_value_buffer(&data_type, buf.as_ref())?
  237 |                 }
  238 |                 _ => {
  239 |                     return Err(Error::internal(
  240 |                         "Constant page scalar buffer does not match its initialization layout",
  241 |                     ));
  242 |                 }
  243 |             };
  244 | 
  245 |             let rep = rep_buffer.map(|rep| {
  246 |                 let rep = LanceBuffer::from_bytes(rep, 2);
  247 |                 rep.borrow_to_typed_slice::<u16>()
  248 |             });
  249 | 
  250 |             let def = def_buffer.map(|def| {
  251 |                 let def = LanceBuffer::from_bytes(def, 2);
  252 |                 def.borrow_to_typed_slice::<u16>()
  253 |             });
  254 | 
  255 |             let cached = Arc::new(CachedConstantState { scalar, rep, def });
  256 |             Ok(cached as Arc<dyn CachedPageData>)
  257 |         }
  258 |         .boxed()
  259 |     }
  260 | 
  261 |     fn try_load(&mut self, data: &Arc<dyn CachedPageData>) -> Result<()> {
  262 |         let cached: Arc<CachedConstantState> =
  263 |             data.clone().as_arc_any().downcast().map_err(|_| {
  264 |                 Error::invalid_input_source(
  265 |                     "Cached constant page data has an unexpected type".into(),
  266 |                 )
  267 |             })?;
  268 |         if cached.scalar.data_type() != &self.data_type {
  269 |             return Err(Error::invalid_input_source(
  270 |                 format!(
  271 |                     "Cached constant page scalar has data type {:?}, expected {:?}",
  272 |                     cached.scalar.data_type(),
  273 |                     self.data_type
  274 |                 )
  275 |                 .into(),
  276 |             ));
  277 |         }
  278 |         self.repdef = Some(cached);
  279 |         Ok(())
  280 |     }
  281 | 
  282 |     fn schedule_ranges(
  283 |         &self,
  284 |         ranges: &[Range<u64>],
  285 |         _io: &Arc<dyn EncodingsIo>,
  286 |     ) -> Result<Vec<PageLoadTask>> {
  287 |         let num_rows = ranges.iter().map(|r| r.end - r.start).sum::<u64>();
  288 |         let decoder = Box::new(ConstantPageDecoder {
  289 |             ranges: VecDeque::from_iter(ranges.iter().cloned()),
  290 |             scalar: self.repdef.as_ref().unwrap().scalar.clone(),
  291 |             rep: self.repdef.as_ref().unwrap().rep.clone(),
  292 |             def: self.repdef.as_ref().unwrap().def.clone(),
  293 |             def_meaning: self.def_meaning.clone(),
  294 |             max_rep: self.max_rep,
  295 |             max_visible_def: self.max_visible_def,
  296 |             cursor_row: 0,
  297 |             cursor_level: 0,
  298 |             num_rows,
  299 |         })
  300 |             as Box<dyn crate::encodings::logical::primitive::StructuralPageDecoder>;
  301 |         Ok(vec![PageLoadTask {
  302 |             decoder_fut: std::future::ready(Ok(decoder)).boxed(),
  303 |             num_rows,
  304 |         }])
  305 |     }
  306 | }
  307 | 
  308 | #[derive(Debug)]
  309 | struct ConstantPageDecoder {
  310 |     ranges: VecDeque<Range<u64>>,
  311 |     scalar: ArrayRef,
  312 |     rep: Option<ScalarBuffer<u16>>,
  313 |     def: Option<ScalarBuffer<u16>>,
  314 |     def_meaning: Arc<[DefinitionInterpretation]>,
  315 |     max_rep: u16,
  316 |     max_visible_def: u16,
  317 |     cursor_row: u64,
  318 |     cursor_level: usize,
  319 |     num_rows: u64,
  320 | }
  321 | 
  322 | impl ConstantPageDecoder {
  323 |     fn drain_ranges(&mut self, num_rows: u64) -> Vec<Range<u64>> {
  324 |         let mut rows_desired = num_rows;
  325 |         let mut ranges = Vec::with_capacity(self.ranges.len());
  326 |         while rows_desired > 0 {
  327 |             let front = self.ranges.front_mut().unwrap();
  328 |             let avail = front.end - front.start;
  329 |             if avail > rows_desired {
  330 |                 ranges.push(front.start..front.start + rows_desired);
  331 |                 front.start += rows_desired;
  332 |                 rows_desired = 0;
  333 |             } else {
  334 |                 ranges.push(self.ranges.pop_front().unwrap());
  335 |                 rows_desired -= avail;
  336 |             }
  337 |         }
  338 |         ranges
  339 |     }
  340 | 
  341 |     fn take_row(&mut self) -> Result<(Range<usize>, u64)> {
  342 |         let start = self.cursor_level;
  343 |         let end = if let Some(rep) = &self.rep {
  344 |             if start >= rep.len() {
  345 |                 return Err(Error::internal(
  346 |                     "Invalid constant layout: repetition buffer too short",
  347 |                 ));
  348 |             }
  349 |             if rep[start] != self.max_rep {
  350 |                 return Err(Error::internal(
  351 |                     "Invalid constant layout: row did not start at max_rep",
  352 |                 ));
  353 |             }
  354 |             let mut end = start + 1;
  355 |             while end < rep.len() && rep[end] != self.max_rep {
  356 |                 end += 1;
  357 |             }
  358 |             end
  359 |         } else {
  360 |             start + 1
  361 |         };
  362 | 
  363 |         let visible = if let Some(def) = &self.def {
  364 |             def[start..end]
  365 |                 .iter()
  366 |                 .filter(|d| **d <= self.max_visible_def)
  367 |                 .count() as u64
  368 |         } else {
  369 |             (end - start) as u64
  370 |         };
  371 | 
  372 |         self.cursor_level = end;
  373 |         self.cursor_row += 1;
  374 |         Ok((start..end, visible))
  375 |     }
  376 | 
  377 |     fn skip_to_row(&mut self, target_row: u64) -> Result<()> {
  378 |         while self.cursor_row < target_row {
  379 |             self.take_row()?;
  380 |         }
  381 |         Ok(())
  382 |     }
  383 | }
  384 | 
  385 | impl crate::encodings::logical::primitive::StructuralPageDecoder for ConstantPageDecoder {
  386 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn crate::decoder::DecodePageTask>> {
  387 |         let drained_ranges = self.drain_ranges(num_rows);
  388 | 
  389 |         let mut level_slices: Vec<Range<usize>> = Vec::new();
  390 |         let mut visible_items_total: u64 = 0;
  391 | 
  392 |         for range in drained_ranges {
  393 |             self.skip_to_row(range.start)?;
  394 |             for _ in range.start..range.end {
  395 |                 let (level_range, visible) = self.take_row()?;
  396 |                 visible_items_total += visible;
  397 |                 if let Some(last) = level_slices.last_mut()
  398 |                     && last.end == level_range.start
  399 |                 {
  400 |                     last.end = level_range.end;
  401 |                     continue;
  402 |                 }
  403 |                 level_slices.push(level_range);
  404 |             }
  405 |         }
  406 | 
  407 |         Ok(Box::new(DecodeConstantTask {
  408 |             scalar: self.scalar.clone(),
  409 |             rep: self.rep.clone(),
  410 |             def: self.def.clone(),
  411 |             level_slices,
  412 |             visible_items_total,
  413 |             def_meaning: self.def_meaning.clone(),
  414 |             max_visible_def: self.max_visible_def,
  415 |         }))
  416 |     }
  417 | 
  418 |     fn num_rows(&self) -> u64 {
  419 |         self.num_rows
  420 |     }
  421 | }
  422 | 
  423 | #[derive(Debug)]
  424 | struct DecodeConstantTask {
  425 |     scalar: ArrayRef,
  426 |     rep: Option<ScalarBuffer<u16>>,
  427 |     def: Option<ScalarBuffer<u16>>,
  428 |     level_slices: Vec<Range<usize>>,
  429 |     visible_items_total: u64,
  430 |     def_meaning: Arc<[DefinitionInterpretation]>,
  431 |     max_visible_def: u16,
  432 | }
  433 | 
  434 | impl DecodeConstantTask {
  435 |     fn slice_levels(
  436 |         levels: &Option<ScalarBuffer<u16>>,
  437 |         slices: &[Range<usize>],
  438 |     ) -> Option<Vec<u16>> {
  439 |         levels.as_ref().map(|levels| {
  440 |             let total = slices.iter().map(|r| r.end - r.start).sum();
  441 |             let mut out = Vec::with_capacity(total);
  442 |             for r in slices {
  443 |                 out.extend(levels[r.start..r.end].iter().copied());
  444 |             }
  445 |             out
  446 |         })
  447 |     }
  448 | 
  449 |     fn materialize_values(&self, num_values: u64) -> Result<ArrayRef> {
  450 |         if num_values == 0 {
  451 |             return Ok(new_empty_array(self.scalar.data_type()));
  452 |         }
  453 | 
  454 |         if let DataType::Struct(fields) = self.scalar.data_type()
  455 |             && fields.is_empty()
  456 |         {
  457 |             return Ok(Arc::new(arrow_array::StructArray::new_empty_fields(
  458 |                 num_values as usize,
  459 |                 None,
  460 |             )) as ArrayRef);
  461 |         }
  462 | 
  463 |         let indices = arrow_array::UInt64Array::from(vec![0u64; num_values as usize]);
  464 |         Ok(arrow_select::take::take(
  465 |             self.scalar.as_ref(),
  466 |             &indices,
  467 |             None,
  468 |         )?)
  469 |     }
  470 | }
  471 | 
  472 | impl crate::decoder::DecodePageTask for DecodeConstantTask {
  473 |     fn decode(self: Box<Self>) -> Result<crate::decoder::DecodedPage> {
  474 |         let rep = Self::slice_levels(&self.rep, &self.level_slices);
  475 |         let def = Self::slice_levels(&self.def, &self.level_slices);
  476 | 
  477 |         let visible_items_total = if let Some(def) = &def {
  478 |             def.iter().filter(|d| **d <= self.max_visible_def).count() as u64
  479 |         } else {
  480 |             self.visible_items_total
  481 |         };
  482 | 
  483 |         let values = self.materialize_values(visible_items_total)?;
  484 |         let data = crate::data::DataBlock::from_array(values);
  485 |         let unraveler =
  486 |             RepDefUnraveler::new(rep, def, self.def_meaning.clone(), visible_items_total);
  487 | 
  488 |         Ok(crate::decoder::DecodedPage {
  489 |             data,
  490 |             repdef: unraveler,
  491 |         })
  492 |     }
  493 | }
  494 | 
  495 | #[cfg(test)]
  496 | mod tests {
  497 |     use arrow_array::BooleanArray;
  498 | 
  499 |     use super::*;
  500 |     use crate::encodings::logical::primitive::StructuralPageScheduler;
  501 | 
  502 |     #[test]
  503 |     fn rejects_cached_scalar_with_different_data_type() {
  504 |         let mut scheduler = ConstantPageScheduler::try_new(
  505 |             Arc::from([]),
  506 |             Some(Bytes::new()),
  507 |             DataType::UInt8,
  508 |             Arc::from([DefinitionInterpretation::AllValidItem]),
  509 |         )
  510 |         .unwrap();
  511 |         let cached: Arc<dyn CachedPageData> = Arc::new(CachedConstantState {
  512 |             scalar: Arc::new(BooleanArray::from(vec![true])),
  513 |             rep: None,
  514 |             def: None,
  515 |         });
  516 | 
  517 |         let error = scheduler.try_load(&cached).unwrap_err();
  518 |         assert!(matches!(error, Error::InvalidInput { .. }));
  519 |         assert!(error.to_string().contains("Boolean"));
  520 |         assert!(error.to_string().contains("UInt8"));
  521 |     }
  522 | }
``````
