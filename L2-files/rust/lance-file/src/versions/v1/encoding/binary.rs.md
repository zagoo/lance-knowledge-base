> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/encoding/binary.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `59d6669e6d95aeeee009a518e037843fb7ab58f7fb19fa3bc3823f594fea8047`. Reviewed physical lines: 1-710.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-codecs.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Public frozen V1 variable-length binary encoder and generic decoder, plus a private take-chunk planner. Persists payload bytes followed by absolute Int64 positions, reconstructs optional validity from zero lengths and performs range/chunked take IO. Contains eight active tests and two test helpers. (rust/lance-file/src/versions/v1/encoding/binary.rs:1-710)

## Complete range analysis

### Lines 1-37

SPDX and variable-length module header; dependencies provide Arrow arithmetic/casts/builders and byte-array types, buffers, Bytes, ordered futures streams, alignment-aware BufferExt, async Writer/Reader and PlainDecoder for the position array. No current-format registration or version selection occurs here. (rust/lance-file/src/versions/v1/encoding/binary.rs:1-37)

### Lines 38-47

Public BinaryEncoder holds a private exclusive borrowed Writer. new only stores that reference; it does not validate writer position, initialize a header or allocate a page. The caller retains writer lifecycle responsibility. (rust/lance-file/src/versions/v1/encoding/binary.rs:38-47)

### Lines 48-64

Private generic encode_typed_arr sums logical lengths, reserves N+1 Int64 positions, records current writer position as the first absolute offset, then downcasts every input to the chosen GenericByteArray<T> with unwrap. It uses each sliced array's first and final offsets. Mixed input types can panic after earlier arrays have already been written; lengths, arithmetic and usize-to-i64 conversion are unchecked. (rust/lance-file/src/versions/v1/encoding/binary.rs:48-64)

### Lines 65-80

Unsafe from_raw_parts borrows exactly the sliced value-buffer span start..end, writes it, then appends rebased absolute positions for every logical element. Safety relies on valid Arrow offsets/buffers and homogeneous generic arrays; no local check or SAFETY comment enforces the pointer span. Original validity is not serialized or consulted. Null slots with nonzero payload spans therefore cannot be reconstructed as null solely from this output. Each successful write precedes updating local last_offset; later failure has no rollback. (rust/lance-file/src/versions/v1/encoding/binary.rs:65-80)

### Lines 81-106

After all payloads, capture positions_offset, write the Int64 values buffer directly and return that table position. No explicit endian conversion, alignment, page header, framing or validity bitmap is emitted. encode asserts a nonempty slice, dispatches solely from the first array to Utf8/Binary/LargeUtf8/LargeBinary and returns InvalidInput with type for all others, including views. A nonempty slice of empty arrays still writes one position; an empty slice panics. (rust/lance-file/src/versions/v1/encoding/binary.rs:81-106)

### Lines 107-151

Public BinaryDecoder<T> privately borrows Reader and stores position, logical length, nullable and PhantomData<T>. new is infallible and performs no bounds/type/offset validation. The constructor doc mistakenly links BinaryEncoder and calls position the batch start; the implementation expects the position-table location returned by BinaryEncoder. The example constructs an Utf8 decoder over a local reader but does not execute a read. (rust/lance-file/src/versions/v1/encoding/binary.rs:107-151)

### Lines 152-164

get_positions constructs a PlainDecoder<Int64> with length+1, requests index.start..index.end+1 and returns an Arc of the cloned primitive array. Position bounds are delegated to PlainDecoder, and additions are unchecked. This obtains both endpoints for the selected logical range; the complete first-to-last take position span is read at once. (rust/lance-file/src/versions/v1/encoding/binary.rs:152-164)

### Lines 165-183

count_nulls allocates validity for offsets.len()-1 elements. Adjacent equal offsets clear validity and increment null count; unequal offsets set it. If none are null the bitmap is discarded. This intentionally conflates empty values with null when nullable=true; nullable=false callers never invoke it. It does not distinguish equal offsets caused by an originally valid empty value. (rust/lance-file/src/versions/v1/encoding/binary.rs:165-183)

### Lines 184-212

get_range indexes absolute start/end, slices range.len()+1 positions, subtracts start and casts to Int32 for small-offset byte types; large types retain Int64. It skips payload IO for start>=end, otherwise requests the absolute byte range. The assertion positions.len()>=range.end is weaker than the final endpoint access, which needs range.end<len; private callers must supply that extra endpoint. Negative, nonmonotone, oversized and arithmetic-overflow positions have no explicit local validation; arithmetic/casts/array building may fail later. (rust/lance-file/src/versions/v1/encoding/binary.rs:184-212)

### Lines 213-235

Build the requested GenericByteArray with row count, normalized offsets and payload Bytes converted through BufferExt(alignment1). When nullable, validity comes from equal original position pairs. The fallible ArrayDataBuilder::build is the final delegated validation boundary; no local short-response or UTF8 check is separately implemented. Return a new Arc array, potentially sharing the reader-returned payload allocation through BufferExt. (rust/lance-file/src/versions/v1/encoding/binary.rs:213-235)

### Lines 236-258

Private Debug TakeChunksPlan holds relative UInt32 indices plus is_contiguous. Planner documentation promises either contiguous nonrepeating indices or nearby values. It subtracts the first input index with Arrow arithmetic, initializes start_idx=0, last_idx=-1 and contiguous=true. Empty input would panic at value(0); public take guards emptiness first. No sort, null rejection or monotonicity validation occurs here. (rust/lance-file/src/versions/v1/encoding/binary.rs:236-258)

### Lines 259-285

For each relative current index, curr_contiguous is current==start_idx OR current-last_idx==1. A noncontiguous item starts a new chunk only when its byte position is strictly more than min_io_size from the current chunk's first index. Otherwise AND the contiguous flag; always update last_idx and finally append the remainder. Continuous runs can exceed the IO threshold. start_idx is an ordinal, so its comparison with a relative row index can classify repeats as contiguous: normalized [0,0] retains true. This is a source-derived discrepancy with the nonrepeating comment, not a runtime reproduction. (rust/lance-file/src/versions/v1/encoding/binary.rs:259-285)

### Lines 286-308

decode delegates get(..). Public take documents sorted indices, returns a typed empty array before IO for empty input, otherwise uses first/last values to request the full position span. MIN_IO_SIZE is fixed at 64*1024 bytes; TODOs leave it nonconfigurable and position reads unchunked. end+1 uses u32 arithmetic before conversion. Unsorted, nullable or out-of-bounds indices are not validated here. (rust/lance-file/src/versions/v1/encoding/binary.rs:286-308)

### Lines 309-328

Compute exact intended payload capacity by iterating every index, unwrapping its validity and summing adjacent position differences relative to the first index. Null indices panic here. Allocate payload and (N+1)*offset-width buffers, initialize zero offset using unchecked push. The safety comment relies on sufficient precomputed capacity; length/product/difference overflow and negative persisted positions remain unchecked. Duplicate indices contribute their payload lengths repeatedly to capacity. (rust/lance-file/src/versions/v1/encoding/binary.rs:309-328)

### Lines 329-367

Plan chunks, issue each enclosing byte-array range through get_range and poll with ordered buffered(reader.io_parallelism()). A contiguous chunk copies value_data once, while a noncontiguous chunk copies each requested value. Both append a cumulative offset per requested index with unsafe push_unchecked under the capacity assumption. Repeated-leading [k,k] with a nonempty value becomes a contiguous [0,0] chunk: only one value span is copied but two offsets are accumulated. Ordered buffering preserves planned output order; it does not spawn detached tasks or add error/cancellation cleanup. (rust/lance-file/src/versions/v1/encoding/binary.rs:329-367)

### Lines 368-393

After IO, build output offsets and debug-assert copied payload bytes equal the precomputed capacity. The repeated-leading nonempty-value trace violates that assertion in debug builds; without it, inconsistent final offsets reach fallible array building. When nullable, equal output offsets again determine validity. Return a new materialized payload array. No guarantee is claimed for malformed inputs or release behavior beyond the observed builder call. (rust/lance-file/src/versions/v1/encoding/binary.rs:368-393)

### Lines 394-415

decode_range checks end>logical length first and returns contextual InvalidInput, then accepts any Range::is_empty as a typed empty array. Thus out-of-bounds equal endpoints fail when end is too large, while reversed ranges whose end is in bounds return empty. Otherwise read N+1 positions through PlainDecoder and decode local 0..N. RangeFrom beyond length becomes an empty reversed range after get expands it. (rust/lance-file/src/versions/v1/encoding/binary.rs:394-415)

### Lines 416-430

Public get converts ReadBatchParams once: Range, full, to and from become decode_range; Indices delegates take; Ranges returns InvalidInput stating multiple ranges are unsupported. There is no inclusive-range arm, fallback or automatic sorting here. (rust/lance-file/src/versions/v1/encoding/binary.rs:416-430)

### Lines 431-456

The cfg(test) module imports string/binary types, concat and local temp-file IO. write_test_data creates/truncates a file, writes four garbage prefix bytes, encodes provided strings and explicitly shuts down before returning table offset. It tests nonzero absolute positions but is a helper, not an independent assertion oracle. (rust/lance-file/src/versions/v1/encoding/binary.rs:431-456)

### Lines 457-484

Generic test_round_trips writes strings, opens a 1024-byte-block local reader, decodes nullable=true using summed rows and compares the typed result with Arrow concat of the original arrays. It covers the arrays supplied by callers only; no byte-layout, failure-timing or backend durability assertion is present. (rust/lance-file/src/versions/v1/encoding/binary.rs:457-484)

### Lines 485-510

test_write_binary_data runs six Utf8/LargeUtf8 fixtures: basic nonempty values, nullable values and multiple arrays. Nullable examples use None rather than valid empty strings; they do not distinguish empty values from null, cover views, or exercise LargeBinary. All compare decoded contents through the shared helper. (rust/lance-file/src/versions/v1/encoding/binary.rs:485-510)

### Lines 511-516

The offset test slices [d,e] to the one-element e view, then runs the string roundtrip helper. It specifically exercises nonzero Arrow value offsets, not arbitrary malformed offsets or multiple sliced inputs. (rust/lance-file/src/versions/v1/encoding/binary.rs:511-516)

### Lines 517-564

Range fixture encodes a..g after a four-byte prefix with nullable=false. It asserts decode/full, 2..5, ..5, 4.. and empty 2..2 exact results; 100..100 is only required to return some error. It does not check the error category/message, reversed ranges or a RangeFrom beyond length. (rust/lance-file/src/versions/v1/encoding/binary.rs:517-564)

### Lines 565-586

Basic take fixture decodes sorted unique indices [1,2,5] from a..g and requires [b,c,f]. No duplicate, null-index, unsorted or out-of-bounds behavior is tested. (rust/lance-file/src/versions/v1/encoding/binary.rs:565-586)

### Lines 587-615

Sparse fixture builds one million strings, checks that a plan for indices [1,999998] yields two relative singleton chunks [0] and [999997], then checks actual decoded values. The planner receives a positions excerpt beginning at1; decoder.take obtains its own endpoints. This is a large source fixture, not evidence of subsecond runtime or measured IO count. (rust/lance-file/src/versions/v1/encoding/binary.rs:587-615)

### Lines 616-656

Dense planner fixture uses one million strings and indices [2,3,4,1001,1001,1002,2001,2002,2004,3004,3005] with a 1024-byte threshold. It asserts four exact relative chunks and flags true,false,false,true, distinguishing repeats in the later chunk and gaps. The manually supplied positions begin at1 although the first requested index is2; this fixture's asserted grouping is not a general origin-validation test. Leading repeats such as [2,2] are absent. (rust/lance-file/src/versions/v1/encoding/binary.rs:616-656)

### Lines 657-663

The dense fixture separately calls decoder.take with its normal fixed 64KiB planner threshold and checks exact values including the repeated string-1001. That successful oracle does not establish that the preceding 1024-byte plan is used by take, nor cover the leading-repeat fast-path discrepancy. (rust/lance-file/src/versions/v1/encoding/binary.rs:657-663)

### Lines 664-676

Write-slice test emits ten slices of ten ten-byte strings and checks only returned positions: i*(8*11)+(i+1)*(10*10). This pins payload-first layout and N+1 Int64 table spacing across repeated calls. It does not read back, shut down explicitly or test nullable slices. (rust/lance-file/src/versions/v1/encoding/binary.rs:664-676)

### Lines 677-710

Binary-null take fixture constructs 60000 values, with every fourth null and all others eight bytes. After prefixed write/shutdown it takes [0,5,59996] and requires [None,abcdefgh,None]. A commented debugging fragment has no behavior. The file ends after eight active tests; malformed positions, leading duplicates, empty-vs-null, mixed-array types, partial writes and cancellation lack local tests. (rust/lance-file/src/versions/v1/encoding/binary.rs:677-710)

## Interaction and interpretation limits

Every physical line was read during ANALYZE61, including disabled test bodies. Tests were inspected, not run. Source remains offline and read-only: no build, test, benchmark, generator or installation was executed. These frozen V1 codecs are historical compatibility surfaces, not extension points for new format capabilities. Full V1 reader is now analyzed; backend lifecycle remains pending; narrow helper/caller reads are separately recorded. Malformed-input consequences and the repeated-leading-index trace are source deductions, not executed reproductions. No local feature flag, environment variable, global mutable state, task spawning, shutdown or cancellation cleanup is introduced by these codec implementations.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Var-length binary encoding.
    5 | //!
    6 | 
    7 | use std::marker::PhantomData;
    8 | use std::ops::Range;
    9 | use std::sync::Arc;
   10 | 
   11 | use arrow_arith::numeric::sub;
   12 | use arrow_array::{
   13 |     Array, ArrayRef, GenericByteArray, Int64Array, OffsetSizeTrait, UInt32Array,
   14 |     builder::{ArrayBuilder, PrimitiveBuilder},
   15 |     cast::AsArray,
   16 |     cast::as_primitive_array,
   17 |     new_empty_array,
   18 |     types::{
   19 |         BinaryType, ByteArrayType, Int64Type, LargeBinaryType, LargeUtf8Type, UInt32Type, Utf8Type,
   20 |     },
   21 | };
   22 | use arrow_buffer::{ArrowNativeType, Buffer, MutableBuffer, ScalarBuffer, bit_util};
   23 | use arrow_cast::cast::cast;
   24 | use arrow_data::ArrayDataBuilder;
   25 | use arrow_schema::DataType;
   26 | use bytes::Bytes;
   27 | use futures::{StreamExt, TryStreamExt};
   28 | use lance_arrow::BufferExt;
   29 | use tokio::io::AsyncWriteExt;
   30 | 
   31 | use super::plain::PlainDecoder;
   32 | use lance_core::Result;
   33 | use lance_io::{
   34 |     ReadBatchParams,
   35 |     traits::{Reader, Writer},
   36 | };
   37 | 
   38 | /// Encoder for Var-binary encoding.
   39 | pub struct BinaryEncoder<'a> {
   40 |     writer: &'a mut dyn Writer,
   41 | }
   42 | 
   43 | impl<'a> BinaryEncoder<'a> {
   44 |     pub fn new(writer: &'a mut dyn Writer) -> Self {
   45 |         Self { writer }
   46 |     }
   47 | 
   48 |     async fn encode_typed_arr<T: ByteArrayType>(&mut self, arrs: &[&dyn Array]) -> Result<usize> {
   49 |         let capacity: usize = arrs.iter().map(|a| a.len()).sum();
   50 |         let mut pos_builder: PrimitiveBuilder<Int64Type> =
   51 |             PrimitiveBuilder::with_capacity(capacity + 1);
   52 | 
   53 |         let mut last_offset: usize = self.writer.tell().await?;
   54 |         pos_builder.append_value(last_offset as i64);
   55 |         for array in arrs.iter() {
   56 |             let arr = array
   57 |                 .as_any()
   58 |                 .downcast_ref::<GenericByteArray<T>>()
   59 |                 .unwrap();
   60 | 
   61 |             let offsets = arr.value_offsets();
   62 | 
   63 |             let start = offsets[0].as_usize();
   64 |             let end = offsets[offsets.len() - 1].as_usize();
   65 |             let b = unsafe {
   66 |                 std::slice::from_raw_parts(
   67 |                     arr.to_data().buffers()[1].as_ptr().add(start),
   68 |                     end - start,
   69 |                 )
   70 |             };
   71 |             self.writer.write_all(b).await?;
   72 | 
   73 |             let start_offset = offsets[0].as_usize();
   74 |             offsets
   75 |                 .iter()
   76 |                 .skip(1)
   77 |                 .map(|b| b.as_usize() - start_offset + last_offset)
   78 |                 .for_each(|o| pos_builder.append_value(o as i64));
   79 |             last_offset = pos_builder.values_slice()[pos_builder.len() - 1] as usize;
   80 |         }
   81 | 
   82 |         let positions_offset = self.writer.tell().await?;
   83 |         let pos_array = pos_builder.finish();
   84 |         self.writer
   85 |             .write_all(pos_array.to_data().buffers()[0].as_slice())
   86 |             .await?;
   87 |         Ok(positions_offset)
   88 |     }
   89 | }
   90 | 
   91 | impl BinaryEncoder<'_> {
   92 |     pub async fn encode(&mut self, arrs: &[&dyn Array]) -> Result<usize> {
   93 |         assert!(!arrs.is_empty());
   94 |         let data_type = arrs[0].data_type();
   95 |         match data_type {
   96 |             DataType::Utf8 => self.encode_typed_arr::<Utf8Type>(arrs).await,
   97 |             DataType::Binary => self.encode_typed_arr::<BinaryType>(arrs).await,
   98 |             DataType::LargeUtf8 => self.encode_typed_arr::<LargeUtf8Type>(arrs).await,
   99 |             DataType::LargeBinary => self.encode_typed_arr::<LargeBinaryType>(arrs).await,
  100 |             _ => Err(lance_core::Error::invalid_input(format!(
  101 |                 "Unsupported data type for binary encoding: {}",
  102 |                 data_type
  103 |             ))),
  104 |         }
  105 |     }
  106 | }
  107 | 
  108 | /// Var-binary encoding decoder.
  109 | pub struct BinaryDecoder<'a, T: ByteArrayType> {
  110 |     reader: &'a dyn Reader,
  111 | 
  112 |     position: usize,
  113 | 
  114 |     length: usize,
  115 | 
  116 |     nullable: bool,
  117 | 
  118 |     phantom: PhantomData<T>,
  119 | }
  120 | 
  121 | /// Var-length Binary Decoder
  122 | ///
  123 | impl<'a, T: ByteArrayType> BinaryDecoder<'a, T> {
  124 |     /// Create a [BinaryEncoder] to decode one batch.
  125 |     ///
  126 |     ///  - `position`, file position where this batch starts.
  127 |     ///  - `length`, the number of records in this batch.
  128 |     ///  - `nullable`, whether this batch contains nullable value.
  129 |     ///
  130 |     /// ## Example
  131 |     ///
  132 |     /// ```rust
  133 |     /// use arrow_array::types::Utf8Type;
  134 |     /// use object_store::path::Path;
  135 |     /// use lance_file::versions::v1::encoding::binary::BinaryDecoder;
  136 |     /// use lance_io::{local::LocalObjectReader, traits::Reader};
  137 |     ///
  138 |     /// async {
  139 |     ///     let reader = LocalObjectReader::open_local_path("/tmp/foo.lance", 2048, None).await.unwrap();
  140 |     ///     let string_decoder = BinaryDecoder::<Utf8Type>::new(reader.as_ref(), 100, 1024, true);
  141 |     /// };
  142 |     /// ```
  143 |     pub fn new(reader: &'a dyn Reader, position: usize, length: usize, nullable: bool) -> Self {
  144 |         Self {
  145 |             reader,
  146 |             position,
  147 |             length,
  148 |             nullable,
  149 |             phantom: PhantomData,
  150 |         }
  151 |     }
  152 | 
  153 |     /// Get the position array for the batch.
  154 |     async fn get_positions(&self, index: Range<usize>) -> Result<Arc<Int64Array>> {
  155 |         let position_decoder = PlainDecoder::new(
  156 |             self.reader,
  157 |             &DataType::Int64,
  158 |             self.position,
  159 |             self.length + 1,
  160 |         )?;
  161 |         let values = position_decoder.get(index.start..index.end + 1).await?;
  162 |         Ok(Arc::new(as_primitive_array(&values).clone()))
  163 |     }
  164 | 
  165 |     fn count_nulls<O: OffsetSizeTrait>(offsets: &ScalarBuffer<O>) -> (usize, Option<Buffer>) {
  166 |         let mut null_count = 0;
  167 |         let mut null_buf = MutableBuffer::new_null(offsets.len() - 1);
  168 |         offsets.windows(2).enumerate().for_each(|(idx, w)| {
  169 |             if w[0] == w[1] {
  170 |                 bit_util::unset_bit(null_buf.as_mut(), idx);
  171 |                 null_count += 1;
  172 |             } else {
  173 |                 bit_util::set_bit(null_buf.as_mut(), idx);
  174 |             }
  175 |         });
  176 |         let null_buf = if null_count > 0 {
  177 |             Some(null_buf.into())
  178 |         } else {
  179 |             None
  180 |         };
  181 |         (null_count, null_buf)
  182 |     }
  183 | 
  184 |     /// Read the array with batch positions and range.
  185 |     ///
  186 |     /// Parameters
  187 |     ///
  188 |     ///  - *positions*: position array for the batch.
  189 |     ///  - *range*: range of rows to read.
  190 |     async fn get_range(&self, positions: &Int64Array, range: Range<usize>) -> Result<ArrayRef> {
  191 |         assert!(positions.len() >= range.end);
  192 |         let start = positions.value(range.start);
  193 |         let end = positions.value(range.end);
  194 | 
  195 |         let start_scalar = Int64Array::new_scalar(start);
  196 | 
  197 |         let slice = positions.slice(range.start, range.len() + 1);
  198 |         let offset_data = if T::Offset::IS_LARGE {
  199 |             sub(&slice, &start_scalar)?.into_data()
  200 |         } else {
  201 |             cast(
  202 |                 &(Arc::new(sub(&slice, &start_scalar)?) as ArrayRef),
  203 |                 &DataType::Int32,
  204 |             )?
  205 |             .into_data()
  206 |         };
  207 | 
  208 |         let bytes: Bytes = if start >= end {
  209 |             Bytes::new()
  210 |         } else {
  211 |             self.reader.get_range(start as usize..end as usize).await?
  212 |         };
  213 | 
  214 |         let mut data_builder = ArrayDataBuilder::new(T::DATA_TYPE)
  215 |             .len(range.len())
  216 |             .null_count(0);
  217 | 
  218 |         // Count nulls
  219 |         if self.nullable {
  220 |             let (null_count, null_buf) = Self::count_nulls(slice.values());
  221 |             data_builder = data_builder
  222 |                 .null_count(null_count)
  223 |                 .null_bit_buffer(null_buf);
  224 |         }
  225 | 
  226 |         let buf = Buffer::from_bytes_bytes(bytes, /*bytes_per_value=*/ 1);
  227 |         let array_data = data_builder
  228 |             .add_buffer(offset_data.buffers()[0].clone())
  229 |             .add_buffer(buf)
  230 |             .build()?;
  231 | 
  232 |         Ok(Arc::new(GenericByteArray::<T>::from(array_data)))
  233 |     }
  234 | }
  235 | 
  236 | #[derive(Debug)]
  237 | struct TakeChunksPlan {
  238 |     indices: UInt32Array,
  239 |     is_contiguous: bool,
  240 | }
  241 | 
  242 | /// Group the indices into chunks, such that either:
  243 | /// 1. the indices are contiguous (and non-repeating)
  244 | /// 2. the values are within `min_io_size` of each other (and thus are worth
  245 | ///    grabbing in a single request)
  246 | fn plan_take_chunks(
  247 |     positions: &Int64Array,
  248 |     indices: &UInt32Array,
  249 |     min_io_size: i64,
  250 | ) -> Result<Vec<TakeChunksPlan>> {
  251 |     let start = indices.value(0);
  252 |     let indices = sub(indices, &UInt32Array::new_scalar(start))?;
  253 |     let indices_ref = indices.as_primitive::<UInt32Type>();
  254 | 
  255 |     let mut chunks: Vec<TakeChunksPlan> = vec![];
  256 |     let mut start_idx = 0;
  257 |     let mut last_idx: i64 = -1;
  258 |     let mut is_contiguous = true;
  259 |     for i in 0..indices.len() {
  260 |         let current = indices_ref.value(i) as usize;
  261 |         let curr_contiguous = current == start_idx || current as i64 - last_idx == 1;
  262 | 
  263 |         if !curr_contiguous
  264 |             && positions.value(current) - positions.value(indices_ref.value(start_idx) as usize)
  265 |                 > min_io_size
  266 |         {
  267 |             chunks.push(TakeChunksPlan {
  268 |                 indices: as_primitive_array(&indices.slice(start_idx, i - start_idx)).clone(),
  269 |                 is_contiguous,
  270 |             });
  271 |             start_idx = i;
  272 |             is_contiguous = true;
  273 |         } else {
  274 |             is_contiguous &= curr_contiguous;
  275 |         }
  276 | 
  277 |         last_idx = current as i64;
  278 |     }
  279 |     chunks.push(TakeChunksPlan {
  280 |         indices: as_primitive_array(&indices.slice(start_idx, indices.len() - start_idx)).clone(),
  281 |         is_contiguous,
  282 |     });
  283 | 
  284 |     Ok(chunks)
  285 | }
  286 | 
  287 | impl<T: ByteArrayType> BinaryDecoder<'_, T> {
  288 |     pub async fn decode(&self) -> Result<ArrayRef> {
  289 |         self.get(..).await
  290 |     }
  291 | 
  292 |     /// Take the values at the given indices.
  293 |     ///
  294 |     /// This function assumes indices are sorted.
  295 |     pub async fn take(&self, indices: &UInt32Array) -> Result<ArrayRef> {
  296 |         if indices.is_empty() {
  297 |             return Ok(new_empty_array(&T::DATA_TYPE));
  298 |         }
  299 | 
  300 |         let start = indices.value(0);
  301 |         let end = indices.value(indices.len() - 1);
  302 | 
  303 |         // TODO: make min batch size configurable.
  304 |         // TODO: make reading positions in chunks too.
  305 |         const MIN_IO_SIZE: i64 = 64 * 1024; // 64KB
  306 |         let positions = self
  307 |             .get_positions(start as usize..(end + 1) as usize)
  308 |             .await?;
  309 |         // Use indices and positions to pre-allocate an exact-size buffer
  310 |         let capacity = indices
  311 |             .iter()
  312 |             .map(|i| {
  313 |                 let relative_index = (i.unwrap() - start) as usize;
  314 |                 let start = positions.value(relative_index) as usize;
  315 |                 let end = positions.value(relative_index + 1) as usize;
  316 |                 end - start
  317 |             })
  318 |             .sum();
  319 |         let mut buffer = MutableBuffer::with_capacity(capacity);
  320 | 
  321 |         let offsets_capacity = std::mem::size_of::<T::Offset>() * (indices.len() + 1);
  322 |         let mut offsets = MutableBuffer::with_capacity(offsets_capacity);
  323 |         let mut offset = T::Offset::from_usize(0).unwrap();
  324 |         // Safety: We allocated appropriate capacity just above.
  325 |         unsafe {
  326 |             offsets.push_unchecked(offset);
  327 |         }
  328 | 
  329 |         let chunks = plan_take_chunks(&positions, indices, MIN_IO_SIZE)?;
  330 | 
  331 |         let positions_ref = positions.as_ref();
  332 |         futures::stream::iter(chunks)
  333 |             .map(|chunk| async move {
  334 |                 let chunk_offset = chunk.indices.value(0);
  335 |                 let chunk_end = chunk.indices.value(chunk.indices.len() - 1);
  336 |                 let array = self
  337 |                     .get_range(positions_ref, chunk_offset as usize..chunk_end as usize + 1)
  338 |                     .await?;
  339 |                 Result::Ok((chunk, chunk_offset, array))
  340 |             })
  341 |             .buffered(self.reader.io_parallelism())
  342 |             .try_for_each(|(chunk, chunk_offset, array)| {
  343 |                 let array: &GenericByteArray<T> = array.as_bytes();
  344 | 
  345 |                 // Faster to do one large memcpy than O(n) small ones.
  346 |                 if chunk.is_contiguous {
  347 |                     buffer.extend_from_slice(array.value_data());
  348 |                 }
  349 | 
  350 |                 // Append each value to the buffer in the correct order
  351 |                 for index in chunk.indices.values() {
  352 |                     if !chunk.is_contiguous {
  353 |                         let value = array.value((index - chunk_offset) as usize);
  354 |                         let value_ref: &[u8] = value.as_ref();
  355 |                         buffer.extend_from_slice(value_ref);
  356 |                     }
  357 | 
  358 |                     offset += array.value_length((index - chunk_offset) as usize);
  359 |                     // Append next offset
  360 |                     // Safety: We allocated appropriate capacity on initialization
  361 |                     unsafe {
  362 |                         offsets.push_unchecked(offset);
  363 |                     }
  364 |                 }
  365 |                 futures::future::ready(Ok(()))
  366 |             })
  367 |             .await?;
  368 | 
  369 |         let mut data_builder = ArrayDataBuilder::new(T::DATA_TYPE)
  370 |             .len(indices.len())
  371 |             .null_count(0);
  372 | 
  373 |         let offsets: ScalarBuffer<T::Offset> = ScalarBuffer::from(Buffer::from(offsets));
  374 | 
  375 |         // We should have pre-sized perfectly.
  376 |         debug_assert_eq!(buffer.len(), capacity);
  377 | 
  378 |         if self.nullable {
  379 |             let (null_count, null_buf) = Self::count_nulls(&offsets);
  380 |             data_builder = data_builder
  381 |                 .null_count(null_count)
  382 |                 .null_bit_buffer(null_buf);
  383 |         }
  384 | 
  385 |         let array_data = data_builder
  386 |             .add_buffer(offsets.into_inner())
  387 |             .add_buffer(buffer.into())
  388 |             .build()?;
  389 | 
  390 |         Ok(Arc::new(GenericByteArray::<T>::from(array_data)))
  391 |     }
  392 | }
  393 | 
  394 | impl<T: ByteArrayType> BinaryDecoder<'_, T> {
  395 |     async fn decode_range(&self, index: Range<usize>) -> Result<ArrayRef> {
  396 |         if index.end > self.length {
  397 |             return Err(lance_core::Error::invalid_input(format!(
  398 |                 "v1 binary row range {}..{} exceeds length {}",
  399 |                 index.start, index.end, self.length
  400 |             )));
  401 |         }
  402 |         if index.is_empty() {
  403 |             return Ok(new_empty_array(&T::DATA_TYPE));
  404 |         }
  405 |         let position_decoder = PlainDecoder::new(
  406 |             self.reader,
  407 |             &DataType::Int64,
  408 |             self.position,
  409 |             self.length + 1,
  410 |         )?;
  411 |         let positions = position_decoder.get(index.start..index.end + 1).await?;
  412 |         let int64_positions: &Int64Array = as_primitive_array(&positions);
  413 | 
  414 |         self.get_range(int64_positions, 0..index.len()).await
  415 |     }
  416 | 
  417 |     pub async fn get(&self, params: impl Into<ReadBatchParams>) -> Result<ArrayRef> {
  418 |         match params.into() {
  419 |             ReadBatchParams::Range(range) => self.decode_range(range).await,
  420 |             ReadBatchParams::Ranges(_) => Err(lance_core::Error::invalid_input(
  421 |                 "multiple ranges are not supported by v1 binary encoding",
  422 |             )),
  423 |             ReadBatchParams::RangeFull => self.decode_range(0..self.length).await,
  424 |             ReadBatchParams::RangeTo(range) => self.decode_range(0..range.end).await,
  425 |             ReadBatchParams::RangeFrom(range) => self.decode_range(range.start..self.length).await,
  426 |             ReadBatchParams::Indices(indices) => self.take(&indices).await,
  427 |         }
  428 |     }
  429 | }
  430 | 
  431 | #[cfg(test)]
  432 | mod tests {
  433 |     use super::*;
  434 | 
  435 |     use arrow_array::{
  436 |         BinaryArray, GenericStringArray, LargeStringArray, StringArray, types::GenericStringType,
  437 |     };
  438 |     use arrow_select::concat::concat;
  439 |     use lance_core::utils::tempfile::TempStdFile;
  440 | 
  441 |     use lance_io::local::LocalObjectReader;
  442 | 
  443 |     async fn write_test_data<O: OffsetSizeTrait>(
  444 |         path: impl AsRef<std::path::Path>,
  445 |         arr: &[&GenericStringArray<O>],
  446 |     ) -> Result<usize> {
  447 |         let mut writer = tokio::fs::File::create(path).await?;
  448 |         // Write some garbage to reset "tell()".
  449 |         writer.write_all(b"1234").await.unwrap();
  450 |         let mut encoder = BinaryEncoder::new(&mut writer);
  451 | 
  452 |         let arrs = arr.iter().map(|a| a as &dyn Array).collect::<Vec<_>>();
  453 |         let pos = encoder.encode(arrs.as_slice()).await.unwrap();
  454 |         AsyncWriteExt::shutdown(&mut writer).await.unwrap();
  455 |         Ok(pos)
  456 |     }
  457 | 
  458 |     async fn test_round_trips<O: OffsetSizeTrait>(arrs: &[&GenericStringArray<O>]) {
  459 |         let path = TempStdFile::default();
  460 | 
  461 |         let pos = write_test_data(&path, arrs).await.unwrap();
  462 | 
  463 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  464 |             .await
  465 |             .unwrap();
  466 |         let read_len = arrs.iter().map(|a| a.len()).sum();
  467 |         let decoder =
  468 |             BinaryDecoder::<GenericStringType<O>>::new(reader.as_ref(), pos, read_len, true);
  469 |         let actual_arr = decoder.decode().await.unwrap();
  470 | 
  471 |         let arrs_ref = arrs.iter().map(|a| a as &dyn Array).collect::<Vec<_>>();
  472 |         let expected = concat(arrs_ref.as_slice()).unwrap();
  473 |         assert_eq!(
  474 |             actual_arr
  475 |                 .as_any()
  476 |                 .downcast_ref::<GenericStringArray<O>>()
  477 |                 .unwrap(),
  478 |             expected
  479 |                 .as_any()
  480 |                 .downcast_ref::<GenericStringArray<O>>()
  481 |                 .unwrap(),
  482 |         );
  483 |     }
  484 | 
  485 |     #[tokio::test]
  486 |     async fn test_write_binary_data() {
  487 |         test_round_trips(&[&StringArray::from(vec!["a", "b", "cd", "efg"])]).await;
  488 |         test_round_trips(&[&StringArray::from(vec![Some("a"), None, Some("cd"), None])]).await;
  489 |         test_round_trips(&[
  490 |             &StringArray::from(vec![Some("a"), None, Some("cd"), None]),
  491 |             &StringArray::from(vec![Some("f"), None, Some("gh"), None]),
  492 |             &StringArray::from(vec![Some("t"), None, Some("uv"), None]),
  493 |         ])
  494 |         .await;
  495 |         test_round_trips(&[&LargeStringArray::from(vec!["a", "b", "cd", "efg"])]).await;
  496 |         test_round_trips(&[&LargeStringArray::from(vec![
  497 |             Some("a"),
  498 |             None,
  499 |             Some("cd"),
  500 |             None,
  501 |         ])])
  502 |         .await;
  503 |         test_round_trips(&[
  504 |             &LargeStringArray::from(vec![Some("a"), Some("b")]),
  505 |             &LargeStringArray::from(vec![Some("c")]),
  506 |             &LargeStringArray::from(vec![Some("d"), Some("e")]),
  507 |         ])
  508 |         .await;
  509 |     }
  510 | 
  511 |     #[tokio::test]
  512 |     async fn test_write_binary_data_with_offset() {
  513 |         let array: StringArray = StringArray::from(vec![Some("d"), Some("e")]).slice(1, 1);
  514 |         test_round_trips(&[&array]).await;
  515 |     }
  516 | 
  517 |     #[tokio::test]
  518 |     async fn test_range_query() {
  519 |         let data = StringArray::from_iter_values(["a", "b", "c", "d", "e", "f", "g"]);
  520 | 
  521 |         let path = TempStdFile::default();
  522 |         let mut object_writer = tokio::fs::File::create(&path).await.unwrap();
  523 | 
  524 |         // Write some garbage to reset "tell()".
  525 |         object_writer.write_all(b"1234").await.unwrap();
  526 |         let mut encoder = BinaryEncoder::new(&mut object_writer);
  527 |         let pos = encoder.encode(&[&data]).await.unwrap();
  528 |         AsyncWriteExt::shutdown(&mut object_writer).await.unwrap();
  529 | 
  530 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  531 |             .await
  532 |             .unwrap();
  533 |         let decoder = BinaryDecoder::<Utf8Type>::new(reader.as_ref(), pos, data.len(), false);
  534 |         assert_eq!(
  535 |             decoder.decode().await.unwrap().as_ref(),
  536 |             &StringArray::from_iter_values(["a", "b", "c", "d", "e", "f", "g"])
  537 |         );
  538 | 
  539 |         assert_eq!(
  540 |             decoder.get(..).await.unwrap().as_ref(),
  541 |             &StringArray::from_iter_values(["a", "b", "c", "d", "e", "f", "g"])
  542 |         );
  543 | 
  544 |         assert_eq!(
  545 |             decoder.get(2..5).await.unwrap().as_ref(),
  546 |             &StringArray::from_iter_values(["c", "d", "e"])
  547 |         );
  548 | 
  549 |         assert_eq!(
  550 |             decoder.get(..5).await.unwrap().as_ref(),
  551 |             &StringArray::from_iter_values(["a", "b", "c", "d", "e"])
  552 |         );
  553 | 
  554 |         assert_eq!(
  555 |             decoder.get(4..).await.unwrap().as_ref(),
  556 |             &StringArray::from_iter_values(["e", "f", "g"])
  557 |         );
  558 |         assert_eq!(
  559 |             decoder.get(2..2).await.unwrap().as_ref(),
  560 |             &new_empty_array(&DataType::Utf8)
  561 |         );
  562 |         assert!(decoder.get(100..100).await.is_err());
  563 |     }
  564 | 
  565 |     #[tokio::test]
  566 |     async fn test_take() {
  567 |         let data = StringArray::from_iter_values(["a", "b", "c", "d", "e", "f", "g"]);
  568 | 
  569 |         let path = TempStdFile::default();
  570 | 
  571 |         let pos = write_test_data(&path, &[&data]).await.unwrap();
  572 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  573 |             .await
  574 |             .unwrap();
  575 |         let decoder = BinaryDecoder::<Utf8Type>::new(reader.as_ref(), pos, data.len(), false);
  576 | 
  577 |         let actual = decoder
  578 |             .take(&UInt32Array::from_iter_values([1, 2, 5]))
  579 |             .await
  580 |             .unwrap();
  581 |         assert_eq!(
  582 |             actual.as_ref(),
  583 |             &StringArray::from_iter_values(["b", "c", "f"])
  584 |         );
  585 |     }
  586 | 
  587 |     #[tokio::test]
  588 |     async fn test_take_sparse_indices() {
  589 |         let data = StringArray::from_iter_values((0..1000000).map(|v| format!("string-{v}")));
  590 | 
  591 |         let path = TempStdFile::default();
  592 |         let pos = write_test_data(&path, &[&data]).await.unwrap();
  593 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  594 |             .await
  595 |             .unwrap();
  596 |         let decoder = BinaryDecoder::<Utf8Type>::new(reader.as_ref(), pos, data.len(), false);
  597 | 
  598 |         let positions = decoder.get_positions(1..999998).await.unwrap();
  599 |         let indices = UInt32Array::from_iter_values([1, 999998]);
  600 |         let chunks = plan_take_chunks(positions.as_ref(), &indices, 64 * 1024).unwrap();
  601 |         // Relative offset within the positions.
  602 |         assert_eq!(chunks.len(), 2);
  603 |         assert_eq!(chunks[0].indices, UInt32Array::from_iter_values([0]),);
  604 |         assert_eq!(chunks[1].indices, UInt32Array::from_iter_values([999997]),);
  605 | 
  606 |         let actual = decoder
  607 |             .take(&UInt32Array::from_iter_values([1, 999998]))
  608 |             .await
  609 |             .unwrap();
  610 |         assert_eq!(
  611 |             actual.as_ref(),
  612 |             &StringArray::from_iter_values(["string-1", "string-999998"])
  613 |         );
  614 |     }
  615 | 
  616 |     #[tokio::test]
  617 |     async fn test_take_dense_indices() {
  618 |         let data = StringArray::from_iter_values((0..1000000).map(|v| format!("string-{v}")));
  619 | 
  620 |         let path = TempStdFile::default();
  621 |         let pos = write_test_data(&path, &[&data]).await.unwrap();
  622 | 
  623 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  624 |             .await
  625 |             .unwrap();
  626 |         let decoder = BinaryDecoder::<Utf8Type>::new(reader.as_ref(), pos, data.len(), false);
  627 | 
  628 |         let positions = decoder.get_positions(1..999998).await.unwrap();
  629 |         let indices = UInt32Array::from_iter_values([
  630 |             2, 3, 4, 1001, 1001, 1002, 2001, 2002, 2004, 3004, 3005,
  631 |         ]);
  632 | 
  633 |         let chunks = plan_take_chunks(positions.as_ref(), &indices, 1024).unwrap();
  634 |         assert_eq!(chunks.len(), 4);
  635 |         // A contiguous range.
  636 |         assert_eq!(chunks[0].indices, UInt32Array::from_iter_values(0..3));
  637 |         assert!(chunks[0].is_contiguous);
  638 |         // Not contiguous because of repeats
  639 |         assert_eq!(
  640 |             chunks[1].indices,
  641 |             UInt32Array::from_iter_values([999, 999, 1000])
  642 |         );
  643 |         assert!(!chunks[1].is_contiguous);
  644 |         // Not contiguous because of gaps
  645 |         assert_eq!(
  646 |             chunks[2].indices,
  647 |             UInt32Array::from_iter_values([1999, 2000, 2002])
  648 |         );
  649 |         assert!(!chunks[2].is_contiguous);
  650 |         // Another contiguous range, this time after non-contiguous ones
  651 |         assert_eq!(
  652 |             chunks[3].indices,
  653 |             UInt32Array::from_iter_values([3002, 3003])
  654 |         );
  655 |         assert!(chunks[3].is_contiguous);
  656 | 
  657 |         let actual = decoder.take(&indices).await.unwrap();
  658 |         assert_eq!(
  659 |             actual.as_ref(),
  660 |             &StringArray::from_iter_values(indices.values().iter().map(|v| format!("string-{v}")))
  661 |         );
  662 |     }
  663 | 
  664 |     #[tokio::test]
  665 |     async fn test_write_slice() {
  666 |         let path = TempStdFile::default();
  667 |         let data = StringArray::from_iter_values((0..100).map(|v| format!("abcdef-{v:#03}")));
  668 | 
  669 |         let mut object_writer = tokio::fs::File::create(&path).await.unwrap();
  670 |         let mut encoder = BinaryEncoder::new(&mut object_writer);
  671 |         for i in 0..10 {
  672 |             let pos = encoder.encode(&[&data.slice(i * 10, 10)]).await.unwrap();
  673 |             assert_eq!(pos, (i * (8 * 11) /* offset array */ + (i + 1) * (10 * 10)));
  674 |         }
  675 |     }
  676 | 
  677 |     #[tokio::test]
  678 |     async fn test_write_binary_with_nulls() {
  679 |         let data = BinaryArray::from_iter((0..60000).map(|v| {
  680 |             if v % 4 != 0 {
  681 |                 Some::<&[u8]>(b"abcdefgh")
  682 |             } else {
  683 |                 None
  684 |             }
  685 |         }));
  686 |         let path = TempStdFile::default();
  687 | 
  688 |         let pos = {
  689 |             let mut object_writer = tokio::fs::File::create(&path).await.unwrap();
  690 | 
  691 |             // Write some garbage to reset "tell()".
  692 |             object_writer.write_all(b"1234").await.unwrap();
  693 |             let mut encoder = BinaryEncoder::new(&mut object_writer);
  694 | 
  695 |             // let arrs = arr.iter().map(|a| a as &dyn Array).collect::<Vec<_>>();
  696 |             let pos = encoder.encode(&[&data]).await.unwrap();
  697 |             AsyncWriteExt::shutdown(&mut object_writer).await.unwrap();
  698 |             pos
  699 |         };
  700 | 
  701 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  702 |             .await
  703 |             .unwrap();
  704 |         let decoder = BinaryDecoder::<BinaryType>::new(reader.as_ref(), pos, data.len(), true);
  705 |         let idx = UInt32Array::from(vec![0_u32, 5_u32, 59996_u32]);
  706 |         let actual = decoder.take(&idx).await.unwrap();
  707 |         let values: Vec<Option<&[u8]>> = vec![None, Some(b"abcdefgh"), None];
  708 |         assert_eq!(actual.as_binary::<i32>(), &BinaryArray::from(values));
  709 |     }
  710 | }
``````
