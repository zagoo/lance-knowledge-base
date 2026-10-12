> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-encoding/src/encodings/logical/primitive/blob.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `716d2bd2e61345928604470c3528edd5e3d257af3f7c1e043056a7fcf0b1260d`. Reviewed physical lines: 1-552.

[Module](../../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Original binary BlobLayout descriptor-only and payload schedulers, page cache state, sharded payload I/O and binary materialization. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:1-552)

## Complete range analysis

### Lines 1-37

License/docs specify same-file out-of-line payloads and inline descriptions encoded with another structural layout. Imports connect parent-private page initialization/cache contracts, Arrow UInt64 descriptors, Bytes and rep/def. Public TARGET_SHARD_SIZE=32*1024*1024 bytes is a target, not a hard cap or benchmarked default. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:1-37)

### Lines 38-69

Parent-visible Debug BlobDescriptionPageScheduler owns boxed inner scheduler and shared outer definition meanings. Its pub new remains bounded by parent-visible type. wrap_decoder_fut awaits inner static future and creates description wrapper, preserving Result errors without extra payload I/O or task spawning. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:38-69)

### Lines 70-109

Description scheduler delegates needs_initialization, layout, initialization and try_load directly to inner. cache_view is BlobDescriptor. schedule_ranges delegates selection and maps every PageLoadTask to wrapped decoder while preserving num_rows; it does not load blob bytes. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:70-109)

### Lines 110-150

Private BlobDescriptionPageDecoder and BlobDescriptionDecodePageTask each own boxed inner object and shared meanings. drain delegates first, then wraps CPU task; num_rows forwards inner semantics. No decoded_bytes override, independent cache or validation. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:110-150)

### Lines 151-173

Description CPU decode consumes inner task then requires DataBlock::Struct and first two children FixedWidth, returning contextual Internal on missing/wrong variants. Borrows both buffers as u64 without checking declared widths, child counts, equality of physical lengths or exact two-child arity. Extra children survive in returned original data. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:151-173)

### Lines 174-193

Reserve rep/def by declared data num_values, then zip physical positions/sizes, silently limiting to shorter length. Nonzero size gives levels0/0. Zero size with position0 gives0/0; other zero-size positions decode low16 bits as rep, next16 as def and ignore upper32. No level-range validation. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:174-193)

### Lines 194-216

Keep rep only if any nonzero. Keep def unless meanings exactly[AllValidItem]; empty meanings indexes[0] and panics. RepDefUnraveler fallback count uses positions.len, not zip length or declared num_values. Return original decoded.data, discarding original inner repdef in favor of reconstructed outer levels. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:194-216)

### Lines 217-234

Private BlobCacheableState shares UInt64Array positions/sizes. DeepSizeOf delegates both arrays through same Context for allocation accounting. CachedPageData erases Arc type without cloning arrays or decoding. Cache contains descriptors, not fetched blob bytes. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:217-234)

### Lines 235-261

Parent-visible Debug BlobPageScheduler owns inner scheduler, page priority row_number, declared num_rows and outer meanings plus optional descriptor arrays. pub new only stores fields; no descriptor/range/meaning validation and cache state starts absent. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:235-261)

### Lines 262-292

create_page_load_task records loaded descriptor count as task rows and calls submit_request immediately (physical I/O timing delegated), including an empty request vector. Future awaits Bytes results, fills only def0 descriptors lacking bytes, errors on too few results via expect_ok and debug-asserts no extra result. Prefilled empties do not consume following payload results. Release builds ignore extra replies. Builds private BlobPageDecoder; no spawn/cancellation policy local. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:262-292)

### Lines 293-317

Payload scheduler inherits needs_initialization=true from parent trait, while init_layout delegates. init_from_buffers borrows self in future, clones I/O, awaits inner initialization, explicitly loads inner cache and schedules whole descriptor page[0,num_rows). Requires exactly one task or NotSupported. This eager full-descriptor read differs from descriptor-only range scheduling. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:293-317)

### Lines 318-345

Await the single descriptor future, drain its reported num_rows, decode synchronously inside initialization async body, and convert DataBlock into BLOB_DESC_TYPE with argumenttrue. Cast Struct and downcast two UInt64 children with unwrap. Clone array wrappers into Arc and return BlobCacheableState; outer positions/sizes remain unset until try_load. Inner repdef is not applied here. No local check returned descriptor count equals scheduler num_rows. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:318-345)

### Lines 346-362

try_load downcasts exact BlobCacheableState or InvalidInput and clones both descriptor Arcs; it does not validate counts/nulls/meanings. cache_view=BlobPayload keeps this state separate from descriptor view. Parent key additionally includes target dtype. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:346-362)

### Lines 363-385

schedule_ranges sums unchecked end-start, requires descriptor Options via expect_ok, reserves request/LoadedBlob vectors using summed count as usize, and iterates caller ranges/order. First row in shard plus page row_number supplies priority. Arrow value(row as usize) assumes in-bounds and ignores null validity; unsorted/duplicate selections are not locally rejected. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:363-385)

### Lines 386-405

Zero-size descriptor decodes rep/def from position; def0 becomes prefilled Bytes::new and schedules no I/O, including rep!=0. Nonzero size ignores packed levels, creates0/0 placeholder and queues position..position+size with unchecked addition. bytes_so_far also adds unchecked. No EOF, overlap, range or payload-length validation. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:386-405)

### Lines 406-434

After each row, flush shard when accumulated nonempty payload sizes >=32MiB, taking vectors, preserving first-row priority and resetting counter. One large blob can exceed target; null/empty rows consume no byte budget and can accumulate without a row bound. Flush final nonempty descriptor vector, even with zero read ranges. Empty selection emits no tasks after requiring cache. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:406-434)

### Lines 435-472

LoadedBlob stores optional shared Bytes and u16 levels; constructors/setter unchecked. BlobPageDecoder converts Vec to VecDeque, caches initial length as num_rows and shares meanings. No memory size guard or per-blob expected-length record retained. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:435-472)

### Lines 473-498

BlobPageDecoder drain removes first requested rows with VecDeque::drain and collects owned Vec; out-of-bounds drain panics, u64 casts to usize unchecked. num_rows remains original total. Private BlobDecodePageTask owns drained blobs and meanings. No rollback or decoded-byte estimate implementation. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:473-498)

### Lines 499-533

CPU decode sums actual loaded Bytes lengths, reserves contiguous output plus u64 offsets and rep/def, copies every payload and repeats offset for absent bytes. Builds VariableWidthBlock(bits_per_offset64,num_values=descriptor count, fresh BlockInfo). It trusts actual reply lengths, not descriptor sizes, and ordinary arithmetic can overflow. Final output is copied, not a zero-copy concatenation; loaded bytes coexist during allocation/copy. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:499-533)

### Lines 534-552

Drop all-zero rep; keep def unless meanings exactly[AllValidItem], with empty-meanings indexing panic. Return DataBlock and RepDefUnraveler using all descriptor count, no local nested visibility/count validation. No inline tests, unsafe blocks, feature gates, environment reads or version parameters in this552-line file; parent/version layers determine applicability. (rust/lance-encoding/src/encodings/logical/primitive/blob.rs:534-552)

## Interaction and interpretation limits

Every physical line read in bounded untruncated primary-source outputs. No repository execution. Potential panic/invalid-input behavior is source deduction; contextual parent/testing snippets do not count as full-file analysis. Original binary Blob and five-field Blob-v2 representations are kept distinct.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Routines for decoding blob data
    5 | //!
    6 | //! The blob structural encoding is a structural encoding where the values (blobs) are stored
    7 | //! out-of-line in the file.  The page contains the descriptions, encoded using some other layout.
    8 | 
    9 | use std::{collections::VecDeque, ops::Range, sync::Arc};
   10 | 
   11 | use arrow_array::{Array, UInt64Array, cast::AsArray, make_array};
   12 | use bytes::Bytes;
   13 | use futures::{FutureExt, future::BoxFuture};
   14 | 
   15 | use lance_core::{
   16 |     Error, Result, cache::DeepSizeOf, datatypes::BLOB_DESC_TYPE, error::LanceOptionExt,
   17 | };
   18 | 
   19 | use crate::{
   20 |     EncodingsIo,
   21 |     buffer::LanceBuffer,
   22 |     data::{BlockInfo, DataBlock, VariableWidthBlock},
   23 |     decoder::{DecodePageTask, DecodedPage, StructuralPageDecoder},
   24 |     encodings::logical::primitive::{
   25 |         CachedPageData, PageCacheView, PageInitialization, PageInitializationBuffers, PageLoadTask,
   26 |         StructuralPageScheduler,
   27 |     },
   28 |     repdef::{DefinitionInterpretation, RepDefUnraveler},
   29 | };
   30 | 
   31 | /// How many bytes to target in each unloaded / loaded shard.  A larger value means
   32 | /// we buffer more data in memory / make bigger requests to the I/O scheduler while
   33 | /// a smaller value means more requests to the I/O scheduler.
   34 | ///
   35 | /// This is probably a reasonable default for most cases.
   36 | pub const TARGET_SHARD_SIZE: u64 = 32 * 1024 * 1024;
   37 | 
   38 | #[derive(Debug)]
   39 | pub(super) struct BlobDescriptionPageScheduler {
   40 |     inner_scheduler: Box<dyn StructuralPageScheduler>,
   41 |     def_meaning: Arc<[DefinitionInterpretation]>,
   42 | }
   43 | 
   44 | impl BlobDescriptionPageScheduler {
   45 |     pub fn new(
   46 |         inner_scheduler: Box<dyn StructuralPageScheduler>,
   47 |         def_meaning: Arc<[DefinitionInterpretation]>,
   48 |     ) -> Self {
   49 |         Self {
   50 |             inner_scheduler,
   51 |             def_meaning,
   52 |         }
   53 |     }
   54 | 
   55 |     fn wrap_decoder_fut(
   56 |         decoder_fut: BoxFuture<'static, Result<Box<dyn StructuralPageDecoder>>>,
   57 |         def_meaning: Arc<[DefinitionInterpretation]>,
   58 |     ) -> BoxFuture<'static, Result<Box<dyn StructuralPageDecoder>>> {
   59 |         async move {
   60 |             let decoder = decoder_fut.await?;
   61 |             Ok(
   62 |                 Box::new(BlobDescriptionPageDecoder::new(decoder, def_meaning))
   63 |                     as Box<dyn StructuralPageDecoder>,
   64 |             )
   65 |         }
   66 |         .boxed()
   67 |     }
   68 | }
   69 | 
   70 | impl StructuralPageScheduler for BlobDescriptionPageScheduler {
   71 |     fn needs_initialization(&self) -> bool {
   72 |         self.inner_scheduler.needs_initialization()
   73 |     }
   74 | 
   75 |     fn init_layout(&self) -> Result<PageInitialization> {
   76 |         self.inner_scheduler.init_layout()
   77 |     }
   78 | 
   79 |     fn init_from_buffers<'a>(
   80 |         &'a mut self,
   81 |         buffers: PageInitializationBuffers,
   82 |         io: &Arc<dyn EncodingsIo>,
   83 |     ) -> BoxFuture<'a, Result<Arc<dyn CachedPageData>>> {
   84 |         self.inner_scheduler.init_from_buffers(buffers, io)
   85 |     }
   86 | 
   87 |     fn try_load(&mut self, data: &Arc<dyn CachedPageData>) -> Result<()> {
   88 |         self.inner_scheduler.try_load(data)
   89 |     }
   90 | 
   91 |     fn cache_view(&self) -> PageCacheView {
   92 |         PageCacheView::BlobDescriptor
   93 |     }
   94 | 
   95 |     fn schedule_ranges(
   96 |         &self,
   97 |         ranges: &[Range<u64>],
   98 |         io: &Arc<dyn EncodingsIo>,
   99 |     ) -> Result<Vec<PageLoadTask>> {
  100 |         let tasks = self.inner_scheduler.schedule_ranges(ranges, io)?;
  101 |         Ok(tasks
  102 |             .into_iter()
  103 |             .map(|task| PageLoadTask {
  104 |                 decoder_fut: Self::wrap_decoder_fut(task.decoder_fut, self.def_meaning.clone()),
  105 |                 num_rows: task.num_rows,
  106 |             })
  107 |             .collect())
  108 |     }
  109 | }
  110 | 
  111 | #[derive(Debug)]
  112 | struct BlobDescriptionPageDecoder {
  113 |     inner: Box<dyn StructuralPageDecoder>,
  114 |     def_meaning: Arc<[DefinitionInterpretation]>,
  115 | }
  116 | 
  117 | impl BlobDescriptionPageDecoder {
  118 |     fn new(
  119 |         inner: Box<dyn StructuralPageDecoder>,
  120 |         def_meaning: Arc<[DefinitionInterpretation]>,
  121 |     ) -> Self {
  122 |         Self { inner, def_meaning }
  123 |     }
  124 | }
  125 | 
  126 | impl StructuralPageDecoder for BlobDescriptionPageDecoder {
  127 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn DecodePageTask>> {
  128 |         Ok(Box::new(BlobDescriptionDecodePageTask::new(
  129 |             self.inner.drain(num_rows)?,
  130 |             self.def_meaning.clone(),
  131 |         )))
  132 |     }
  133 | 
  134 |     fn num_rows(&self) -> u64 {
  135 |         self.inner.num_rows()
  136 |     }
  137 | }
  138 | 
  139 | #[derive(Debug)]
  140 | struct BlobDescriptionDecodePageTask {
  141 |     inner: Box<dyn DecodePageTask>,
  142 |     def_meaning: Arc<[DefinitionInterpretation]>,
  143 | }
  144 | 
  145 | impl BlobDescriptionDecodePageTask {
  146 |     fn new(inner: Box<dyn DecodePageTask>, def_meaning: Arc<[DefinitionInterpretation]>) -> Self {
  147 |         Self { inner, def_meaning }
  148 |     }
  149 | }
  150 | 
  151 | impl DecodePageTask for BlobDescriptionDecodePageTask {
  152 |     fn decode(self: Box<Self>) -> Result<DecodedPage> {
  153 |         let decoded = self.inner.decode()?;
  154 |         let num_values = decoded.data.num_values();
  155 | 
  156 |         // Need to extract out the repdef information
  157 |         let DataBlock::Struct(descriptions) = &decoded.data else {
  158 |             return Err(Error::internal(
  159 |                 "Expected struct data block for descriptions",
  160 |             ));
  161 |         };
  162 |         let mut description_children = descriptions.children.iter();
  163 |         let DataBlock::FixedWidth(positions) = description_children.next().expect_ok()? else {
  164 |             return Err(Error::internal(
  165 |                 "Expected fixed width data block for positions",
  166 |             ));
  167 |         };
  168 |         let DataBlock::FixedWidth(sizes) = description_children.next().expect_ok()? else {
  169 |             return Err(Error::internal("Expected fixed width data block for sizes"));
  170 |         };
  171 |         let positions = positions.data.borrow_to_typed_slice::<u64>();
  172 |         let sizes = sizes.data.borrow_to_typed_slice::<u64>();
  173 | 
  174 |         let mut rep = Vec::with_capacity(num_values as usize);
  175 |         let mut def = Vec::with_capacity(num_values as usize);
  176 | 
  177 |         for (position, size) in positions.iter().copied().zip(sizes.iter().copied()) {
  178 |             if size == 0 {
  179 |                 if position == 0 {
  180 |                     rep.push(0);
  181 |                     def.push(0);
  182 |                 } else {
  183 |                     let repval = (position & 0xFFFF) as u16;
  184 |                     let defval = ((position >> 16) & 0xFFFF) as u16;
  185 |                     rep.push(repval);
  186 |                     def.push(defval);
  187 |                 }
  188 |             } else {
  189 |                 rep.push(0);
  190 |                 def.push(0);
  191 |             }
  192 |         }
  193 | 
  194 |         let rep = if rep.iter().any(|r| *r != 0) {
  195 |             Some(rep)
  196 |         } else {
  197 |             None
  198 |         };
  199 |         let def = if self.def_meaning.len() > 1
  200 |             || self.def_meaning[0] != DefinitionInterpretation::AllValidItem
  201 |         {
  202 |             Some(def)
  203 |         } else {
  204 |             None
  205 |         };
  206 | 
  207 |         let repdef =
  208 |             RepDefUnraveler::new(rep, def, self.def_meaning.clone(), positions.len() as u64);
  209 | 
  210 |         Ok(DecodedPage {
  211 |             data: decoded.data,
  212 |             repdef,
  213 |         })
  214 |     }
  215 | }
  216 | 
  217 | struct BlobCacheableState {
  218 |     positions: Arc<UInt64Array>,
  219 |     sizes: Arc<UInt64Array>,
  220 | }
  221 | 
  222 | impl DeepSizeOf for BlobCacheableState {
  223 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  224 |         (self.positions.as_ref() as &dyn arrow_array::Array).deep_size_of_children(context)
  225 |             + (self.sizes.as_ref() as &dyn arrow_array::Array).deep_size_of_children(context)
  226 |     }
  227 | }
  228 | 
  229 | impl CachedPageData for BlobCacheableState {
  230 |     fn as_arc_any(self: Arc<Self>) -> Arc<dyn std::any::Any + Send + Sync + 'static> {
  231 |         self
  232 |     }
  233 | }
  234 | 
  235 | #[derive(Debug)]
  236 | pub(super) struct BlobPageScheduler {
  237 |     inner_scheduler: Box<dyn StructuralPageScheduler>,
  238 |     row_number: u64,
  239 |     num_rows: u64,
  240 |     def_meaning: Arc<[DefinitionInterpretation]>,
  241 |     positions: Option<Arc<UInt64Array>>,
  242 |     sizes: Option<Arc<UInt64Array>>,
  243 | }
  244 | 
  245 | impl BlobPageScheduler {
  246 |     pub fn new(
  247 |         inner_scheduler: Box<dyn StructuralPageScheduler>,
  248 |         row_number: u64,
  249 |         num_rows: u64,
  250 |         def_meaning: Arc<[DefinitionInterpretation]>,
  251 |     ) -> Self {
  252 |         Self {
  253 |             inner_scheduler,
  254 |             row_number,
  255 |             num_rows,
  256 |             def_meaning,
  257 |             positions: None,
  258 |             sizes: None,
  259 |         }
  260 |     }
  261 | 
  262 |     fn create_page_load_task(
  263 |         ranges_to_read: Vec<Range<u64>>,
  264 |         mut loaded_blobs: Vec<LoadedBlob>,
  265 |         first_row_number: u64,
  266 |         io: &dyn EncodingsIo,
  267 |         def_meaning: Arc<[DefinitionInterpretation]>,
  268 |     ) -> Result<PageLoadTask> {
  269 |         let num_rows = loaded_blobs.len() as u64;
  270 |         let read_fut = io.submit_request(ranges_to_read, first_row_number);
  271 |         let decoder_fut = async move {
  272 |             let bytes = read_fut.await?;
  273 |             let mut bytes_iter = bytes.into_iter();
  274 |             for blob in loaded_blobs.iter_mut() {
  275 |                 // Empty values have def == 0 too but scheduled no read; their
  276 |                 // bytes were set at scheduling time.
  277 |                 if blob.def == 0 && blob.bytes.is_none() {
  278 |                     blob.set_bytes(bytes_iter.next().expect_ok()?);
  279 |                 }
  280 |             }
  281 |             debug_assert!(bytes_iter.next().is_none());
  282 |             Ok(Box::new(BlobPageDecoder::new(loaded_blobs, def_meaning))
  283 |                 as Box<dyn StructuralPageDecoder>)
  284 |         }
  285 |         .boxed();
  286 |         Ok(PageLoadTask {
  287 |             decoder_fut,
  288 |             num_rows,
  289 |         })
  290 |     }
  291 | }
  292 | 
  293 | impl StructuralPageScheduler for BlobPageScheduler {
  294 |     fn init_layout(&self) -> Result<PageInitialization> {
  295 |         self.inner_scheduler.init_layout()
  296 |     }
  297 | 
  298 |     fn init_from_buffers<'a>(
  299 |         &'a mut self,
  300 |         buffers: PageInitializationBuffers,
  301 |         io: &Arc<dyn EncodingsIo>,
  302 |     ) -> BoxFuture<'a, Result<Arc<dyn CachedPageData>>> {
  303 |         let io = io.clone();
  304 |         let num_rows = self.num_rows;
  305 |         async move {
  306 |             let cached = self.inner_scheduler.init_from_buffers(buffers, &io).await?;
  307 |             self.inner_scheduler.try_load(&cached)?;
  308 |             let mut desc_decoders = self.inner_scheduler.schedule_ranges(&[0..num_rows], &io)?;
  309 |             if desc_decoders.len() != 1 {
  310 |                 // This can't happen yet today so being a little lazy but if it did happen we just
  311 |                 // need to concatenate the descriptions.  I'm guessing by then we might be doing something
  312 |                 // different than "load all descriptors in initialize" anyways.
  313 |                 return Err(Error::not_supported_source(
  314 |                     "Expected exactly one descriptor decoder".into(),
  315 |                 ));
  316 |             }
  317 |             let desc_decoder_task = desc_decoders.pop().unwrap();
  318 |             let mut desc_decoder = desc_decoder_task.decoder_fut.await?;
  319 | 
  320 |             let descs = desc_decoder.drain(desc_decoder_task.num_rows)?;
  321 |             let descs = descs.decode()?;
  322 |             let descs = make_array(descs.data.into_arrow(BLOB_DESC_TYPE.clone(), true)?);
  323 |             let descs = descs.as_struct();
  324 |             let positions = Arc::new(
  325 |                 descs
  326 |                     .column(0)
  327 |                     .as_any()
  328 |                     .downcast_ref::<UInt64Array>()
  329 |                     .unwrap()
  330 |                     .clone(),
  331 |             );
  332 |             let sizes = Arc::new(
  333 |                 descs
  334 |                     .column(1)
  335 |                     .as_any()
  336 |                     .downcast_ref::<UInt64Array>()
  337 |                     .unwrap()
  338 |                     .clone(),
  339 |             );
  340 |             let state = Arc::new(BlobCacheableState { positions, sizes });
  341 |             Ok(state as Arc<dyn CachedPageData>)
  342 |         }
  343 |         .boxed()
  344 |     }
  345 | 
  346 |     fn try_load(&mut self, data: &Arc<dyn CachedPageData>) -> Result<()> {
  347 |         let blob_state = data
  348 |             .clone()
  349 |             .as_arc_any()
  350 |             .downcast::<BlobCacheableState>()
  351 |             .map_err(|_| {
  352 |                 Error::invalid_input_source("Cached blob page data has an unexpected type".into())
  353 |             })?;
  354 |         self.positions = Some(blob_state.positions.clone());
  355 |         self.sizes = Some(blob_state.sizes.clone());
  356 |         Ok(())
  357 |     }
  358 | 
  359 |     fn cache_view(&self) -> PageCacheView {
  360 |         PageCacheView::BlobPayload
  361 |     }
  362 | 
  363 |     fn schedule_ranges(
  364 |         &self,
  365 |         ranges: &[Range<u64>],
  366 |         io: &Arc<dyn EncodingsIo>,
  367 |     ) -> Result<Vec<PageLoadTask>> {
  368 |         let num_rows: u64 = ranges.iter().map(|r| r.end - r.start).sum();
  369 | 
  370 |         let positions = self.positions.as_ref().expect_ok()?;
  371 |         let sizes = self.sizes.as_ref().expect_ok()?;
  372 | 
  373 |         let mut page_load_tasks = Vec::new();
  374 |         let mut bytes_so_far = 0;
  375 |         let mut ranges_to_read = Vec::with_capacity(num_rows as usize);
  376 |         let mut loaded_blobs = Vec::with_capacity(num_rows as usize);
  377 |         let mut first_row_number = None;
  378 |         for range in ranges {
  379 |             for row in range.start..range.end {
  380 |                 if first_row_number.is_none() {
  381 |                     first_row_number = Some(row + self.row_number);
  382 |                 }
  383 |                 let position = positions.value(row as usize);
  384 |                 let size = sizes.value(row as usize);
  385 | 
  386 |                 if size == 0 {
  387 |                     let rep = (position & 0xFFFF) as u16;
  388 |                     let def = ((position >> 16) & 0xFFFF) as u16;
  389 |                     let mut blob = LoadedBlob::new(rep, def);
  390 |                     if def == 0 {
  391 |                         // A size-0 descriptor with definition level 0 is a
  392 |                         // valid, empty value (nulls carry their non-zero
  393 |                         // packed rep/def levels in `position`). No read is
  394 |                         // scheduled for it, so it gets its zero-length bytes
  395 |                         // here rather than consuming another blob's read
  396 |                         // result in the load task.
  397 |                         blob.set_bytes(Bytes::new());
  398 |                     }
  399 |                     loaded_blobs.push(blob);
  400 |                 } else {
  401 |                     loaded_blobs.push(LoadedBlob::new(0, 0));
  402 |                     ranges_to_read.push(position..(position + size));
  403 |                     bytes_so_far += size;
  404 |                 }
  405 | 
  406 |                 if bytes_so_far >= TARGET_SHARD_SIZE {
  407 |                     let page_load_task = Self::create_page_load_task(
  408 |                         std::mem::take(&mut ranges_to_read),
  409 |                         std::mem::take(&mut loaded_blobs),
  410 |                         first_row_number.unwrap(),
  411 |                         io.as_ref(),
  412 |                         self.def_meaning.clone(),
  413 |                     )?;
  414 |                     page_load_tasks.push(page_load_task);
  415 |                     bytes_so_far = 0;
  416 |                     first_row_number = None;
  417 |                 }
  418 |             }
  419 |         }
  420 |         if !loaded_blobs.is_empty() {
  421 |             let page_load_task = Self::create_page_load_task(
  422 |                 std::mem::take(&mut ranges_to_read),
  423 |                 std::mem::take(&mut loaded_blobs),
  424 |                 first_row_number.unwrap(),
  425 |                 io.as_ref(),
  426 |                 self.def_meaning.clone(),
  427 |             )?;
  428 |             page_load_tasks.push(page_load_task);
  429 |         }
  430 | 
  431 |         Ok(page_load_tasks)
  432 |     }
  433 | }
  434 | 
  435 | #[derive(Debug)]
  436 | struct LoadedBlob {
  437 |     bytes: Option<Bytes>,
  438 |     rep: u16,
  439 |     def: u16,
  440 | }
  441 | 
  442 | impl LoadedBlob {
  443 |     fn new(rep: u16, def: u16) -> Self {
  444 |         Self {
  445 |             bytes: None,
  446 |             rep,
  447 |             def,
  448 |         }
  449 |     }
  450 | 
  451 |     fn set_bytes(&mut self, bytes: Bytes) {
  452 |         self.bytes = Some(bytes);
  453 |     }
  454 | }
  455 | 
  456 | #[derive(Debug)]
  457 | struct BlobPageDecoder {
  458 |     blobs: VecDeque<LoadedBlob>,
  459 |     def_meaning: Arc<[DefinitionInterpretation]>,
  460 |     num_rows: u64,
  461 | }
  462 | 
  463 | impl BlobPageDecoder {
  464 |     fn new(blobs: Vec<LoadedBlob>, def_meaning: Arc<[DefinitionInterpretation]>) -> Self {
  465 |         Self {
  466 |             num_rows: blobs.len() as u64,
  467 |             blobs: blobs.into_iter().collect(),
  468 |             def_meaning,
  469 |         }
  470 |     }
  471 | }
  472 | 
  473 | impl StructuralPageDecoder for BlobPageDecoder {
  474 |     fn drain(&mut self, num_rows: u64) -> Result<Box<dyn DecodePageTask>> {
  475 |         let blobs = self.blobs.drain(0..num_rows as usize).collect::<Vec<_>>();
  476 |         Ok(Box::new(BlobDecodePageTask::new(
  477 |             blobs,
  478 |             self.def_meaning.clone(),
  479 |         )))
  480 |     }
  481 | 
  482 |     fn num_rows(&self) -> u64 {
  483 |         self.num_rows
  484 |     }
  485 | }
  486 | 
  487 | #[derive(Debug)]
  488 | struct BlobDecodePageTask {
  489 |     blobs: Vec<LoadedBlob>,
  490 |     def_meaning: Arc<[DefinitionInterpretation]>,
  491 | }
  492 | 
  493 | impl BlobDecodePageTask {
  494 |     fn new(blobs: Vec<LoadedBlob>, def_meaning: Arc<[DefinitionInterpretation]>) -> Self {
  495 |         Self { blobs, def_meaning }
  496 |     }
  497 | }
  498 | 
  499 | impl DecodePageTask for BlobDecodePageTask {
  500 |     fn decode(self: Box<Self>) -> Result<DecodedPage> {
  501 |         let num_values = self.blobs.len() as u64;
  502 |         let num_bytes = self
  503 |             .blobs
  504 |             .iter()
  505 |             .filter_map(|b| b.bytes.as_ref())
  506 |             .map(|b| b.len())
  507 |             .sum::<usize>();
  508 |         let mut buffer = Vec::with_capacity(num_bytes);
  509 |         let mut offsets = Vec::with_capacity(num_values as usize + 1);
  510 |         let mut rep = Vec::with_capacity(num_values as usize);
  511 |         let mut def = Vec::with_capacity(num_values as usize);
  512 |         offsets.push(0_u64);
  513 |         for blob in self.blobs {
  514 |             rep.push(blob.rep);
  515 |             def.push(blob.def);
  516 |             if let Some(bytes) = blob.bytes {
  517 |                 offsets.push(offsets.last().unwrap() + bytes.len() as u64);
  518 |                 buffer.extend_from_slice(&bytes);
  519 |             } else {
  520 |                 // Null / emptyvalue
  521 |                 offsets.push(*offsets.last().unwrap());
  522 |             }
  523 |         }
  524 |         let offsets = LanceBuffer::reinterpret_vec(offsets);
  525 |         let data = LanceBuffer::from(buffer);
  526 |         let data_block = DataBlock::VariableWidth(VariableWidthBlock {
  527 |             data,
  528 |             offsets,
  529 |             bits_per_offset: 64,
  530 |             num_values,
  531 |             block_info: BlockInfo::new(),
  532 |         });
  533 | 
  534 |         let rep = if rep.iter().any(|r| *r != 0) {
  535 |             Some(rep)
  536 |         } else {
  537 |             None
  538 |         };
  539 |         let def = if self.def_meaning.len() > 1
  540 |             || self.def_meaning[0] != DefinitionInterpretation::AllValidItem
  541 |         {
  542 |             Some(def)
  543 |         } else {
  544 |             None
  545 |         };
  546 | 
  547 |         Ok(DecodedPage {
  548 |             data: data_block,
  549 |             repdef: RepDefUnraveler::new(rep, def, self.def_meaning, num_values),
  550 |         })
  551 |     }
  552 | }
``````
