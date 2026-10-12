> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md). Refresh 2026-10-04: [current-source addendum](../../../../../../../refresh-addenda/2026-10-04-ad12ed9e.md) for `ad12ed9e15e0046688b00568d0ac1a347fb2d328`.

# rust/lance-file/src/versions/v1/encoding/plain.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a26c12e744f20c4b3fa1e22a394c8394f6186a017dfed01a245ccfcb6a881145`. Reviewed physical lines: 1-852.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-codecs.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Public frozen V1 fixed-stride encoder/decoder and private byte conversion and take-chunk helpers. Writes raw primitive buffers, packs booleans across batches, recursively flattens fixed-size lists and reconstructs arrays without stored validity. Contains nine active tests, two helpers and three entirely commented-out historical tests. (rust/lance-file/src/versions/v1/encoding/plain.rs:1-852)

## Complete range analysis

### Lines 1-31

SPDX and module prose describe fixed-stride direct storage and O(1) access. That complexity describes computing a row byte position, not total IO, recursive reconstruction or take allocation. Imports provide raw slices, Arrow arithmetic/layout/buffers/selection, async recursion, ordered streams, local Arrow extensions and Reader/Writer. (rust/lance-file/src/versions/v1/encoding/plain.rs:1-31)

### Lines 32-59

PlainEncoder stores borrowed Writer and configured DataType; new performs no validation. Static write records tell, returns that position without encoding for an empty array slice, otherwise chooses the first array type and encodes. Instance encode delegates recursively even for an empty slice and can reach an assertion. Its comment calls the return a metadata offset, but primitive implementation returns the raw values start; no separate plain metadata is emitted. (rust/lance-file/src/versions/v1/encoding/plain.rs:32-59)

### Lines 60-72

encode_internal branches only on configured FixedSizeList, delegating its item Field; every other configured type goes to encode_primitive, which reads the actual first input type. async_recursion boxes recursive calls. This distinction explains why DictionaryEncoder can configure a dictionary type while passing primitive key arrays. No general configured-vs-actual type check exists. (rust/lance-file/src/versions/v1/encoding/plain.rs:60-72)

### Lines 73-89

encode_boolean reserves summed logical length, iterates every input value, replaces None with false and appends values to one BooleanBuilder. It writes only the finished values bitmap, eliminating byte-padding gaps between short arrays. No validity bitmap is written, so null booleans read as valid false. Allocation and iteration are proportional to total input rows. (rust/lance-file/src/versions/v1/encoding/plain.rs:73-89)

### Lines 90-117

encode_primitive asserts a nonempty slice and captures writer position. Boolean inputs are downcast and packed; other inputs use the first type's byte_width for every raw buffer slice, starting at each array offset and writing len*width bytes. No endian conversion, validity, per-array type/buffer-length check, alignment padding or rollback. Unsafe from_raw_parts requires each computed span to remain inside a valid allocation across await; mixed narrower arrays can violate that safety precondition. Existing Arrow validity alone does not establish homogeneous inputs. (rust/lance-file/src/versions/v1/encoding/plain.rs:90-117)

### Lines 118-154

encode_fixed_size_list downcasts each input or returns Schema with actual type, slices its child values from value_offset(0) for len*value_length, collects shared child arrays and recurses using configured items.data_type. Parent nulls are discarded, as are child validity buffers once primitive encoding occurs. Actual list sizes and configured item type are not compared here; casts/products and recursion depth are unchecked. A failure can follow already-written data in nested/earlier operations. (rust/lance-file/src/versions/v1/encoding/plain.rs:118-154)

### Lines 155-173

PlainDecoder privately borrows Reader and DataType and stores position/length. get_byte_range maps booleans to floor(start/8)..ceil(end/8), otherwise multiplies endpoints by byte_width. All byte-offset arithmetic is unchecked. The locally defined DataTypeExt::byte_width panics when width is unavailable; FixedSizeList<Boolean> has no scalar byte width for the take planner (rust/lance-arrow/src/lib.rs:144-182). (rust/lance-file/src/versions/v1/encoding/plain.rs:155-173)

### Lines 174-201

bytes_to_array requires Arrow layout.buffers.len()==1 or returns Internal with type. FixedWidth computes (len+offset).saturating_mul(width); a short Bytes response is copied into that minimum size with zero fill, otherwise BufferExt may retain aligned Bytes or copy misaligned bytes. Non-FixedWidth layouts copy from the byte slice. The len+offset addition itself is unchecked; this helper does not reject truncation for fixed-width values. BufferExt behavior is established at rust/lance-arrow/src/lib.rs:1536-1600. (rust/lance-file/src/versions/v1/encoding/plain.rs:174-201)

### Lines 202-225

ArrayDataBuilder constructs the declared type with requested len/offset, null_count0 and one value buffer, then fallibly builds and make_array returns an ArrayRef. All restored rows are valid at this layer. Public PlainDecoder::new returns Result but unconditionally constructs Ok and does not enforce fixed stride, positive dimensions, file bounds or schema compatibility. (rust/lance-file/src/versions/v1/encoding/plain.rs:202-225)

### Lines 226-251

decode_primitive rejects only end>length, computes absolute file byte range, awaits Reader::get_range, and reconstructs with bit offset start%8 for booleans or0 otherwise. It relies on decode_range to remove empty/reversed ranges. Short fixed-width responses may be zero-padded by bytes_to_array; exact response length is not independently checked. Position additions, byte multiplication and end-start subtraction are unchecked. (rust/lance-file/src/versions/v1/encoding/plain.rs:226-251)

### Lines 252-281

Fixed-size-list decoding requires the item type satisfy local is_fixed_stride or returns Schema. It constructs a child decoder with length*list_size and requests scaled endpoints, then uses FixedSizeListArray::new with cloned item Field and parent validity None. Nested fixed lists are allowed by the predicate and recurse. Signed sizes are cast unchecked and products are unchecked; zero/negative dimensions and constructor panic behavior are not locally guarded. (rust/lance-file/src/versions/v1/encoding/plain.rs:252-281)

### Lines 282-305

Fixed-size-binary decoding treats values as UInt8 with length*stride, requests scaled endpoints, downcasts or returns Schema, then delegates to FixedSizeBinaryArrayExt::try_new_from_values. The helper sets len=values.len()/stride and builds from the value buffer without validity (rust/lance-arrow/src/lib.rs:455-463). Zero stride can reach division by zero; negative dimensions and overflow are not locally validated. (rust/lance-file/src/versions/v1/encoding/plain.rs:282-305)

### Lines 306-324

Boolean take casts reader.block_size to u32, multiplies by8 and partitions sorted selector ordinals when the next row enters a higher block than the chunk's first row. It assumes nonempty input, which public take guards. Zero/truncated block size can cause division by zero, and multiplication/ordinal casts are unchecked. Selector validity and sortedness are not examined. (rust/lance-file/src/versions/v1/encoding/plain.rs:306-324)

### Lines 325-345

For each boolean chunk, read its enclosing first..last+1 row range, subtract the first row from the UInt32 selector and invoke Arrow take. Poll ordered futures with reader.io_parallelism, collect every decoded chunk array, then concatenate. This allocates intermediate arrays plus final output, preserves chunk order and delegates nullable-index selection to Arrow after planning from raw values. No detached spawn or local cancellation guard is present. (rust/lance-file/src/versions/v1/encoding/plain.rs:325-345)

### Lines 346-373

make_chunked_requests returns ordinal ranges into a nonempty sorted index slice. Adjacent consecutive rows always stay together even if the run exceeds block_size; otherwise split only when next*width is strictly greater than first*width+block_size. The comment about limiting IO is therefore not a hard cap. It uses usize byte arithmetic but unchecked u32 previous+1 and unchecked products/sums; empty input underflows len-1. (rust/lance-file/src/versions/v1/encoding/plain.rs:346-373)

### Lines 374-392

decode delegates the full logical range. take returns an empty typed array before type checks/IO, routes Boolean specially, otherwise computes byte_width and chunks raw indices.values using reader.block_size. No sort, bound preflight, null rejection or normalization occurs. FixedSizeList<Boolean> can decode by range but its take path reaches the byte_width panic; the constructor does not prevent that combination. (rust/lance-file/src/versions/v1/encoding/plain.rs:374-392)

### Lines 393-409

For each ordinary take chunk, read enclosing first..last+1, shift its selector by the first row, run Arrow take, collect ordered buffered results and concat. Duplicates in valid sorted selectors are preserved by Arrow take; unsorted or nullable selector storage can affect the planned enclosing range before Arrow processes validity. Reads can cover intervening unselected rows and contiguous runs larger than block_size. All chunk arrays remain alive until final concatenation. (rust/lance-file/src/versions/v1/encoding/plain.rs:393-409)

### Lines 410-427

decode_range returns new_empty_array immediately for Range::is_empty, before any bounds/type validation. Thus even an empty range beyond length or a reversed range is accepted. Nonempty fixed lists/binary delegate recursive reconstruction; everything else goes to primitive. This differs from BinaryDecoder, which checks end before empty-range return. (rust/lance-file/src/versions/v1/encoding/plain.rs:410-427)

### Lines 428-441

get converts the parameter once; Range/full/to/from route to decode_range, Indices to take, and Ranges returns InvalidInput saying multiple ranges are unsupported. There is no per-selection extra type/bounds check. A RangeFrom start beyond length becomes reversed and returns empty. (rust/lance-file/src/versions/v1/encoding/plain.rs:428-441)

### Lines 442-477

cfg(test) imports assertions, random generation and local temp IO. Primitive test enumerates eight integer types, builds an i64 buffer from1..127, then makes ten arrays of each target type using the same raw bytes and fixed logical length126. Narrow integers reinterpret portions of the i64 buffer; this is not a cast preserving the mathematical sequence1..126. Every case uses the shared roundtrip oracle. (rust/lance-file/src/versions/v1/encoding/plain.rs:442-477)

### Lines 478-491

The same test generates126 random f64 values, reinterprets their bytes as Float16/32/64 arrays and runs ten-array roundtrips. It tests raw-buffer roundtrip, not equivalent numerical values across float widths, deterministic fixtures or all NaN/Infinity semantics. No runtime timing evidence was gathered. (rust/lance-file/src/versions/v1/encoding/plain.rs:478-491)

### Lines 492-522

test_round_trip writes arrays, requires returned offset0, flushes and drops writer, opens a reader, requires positive file size, decodes summed row count, compares with Arrow concat and asserts resulting length. It checks in-process local contents only, without pinned bytes, nonzero offsets, error injection or durable backend guarantees. (rust/lance-file/src/versions/v1/encoding/plain.rs:492-522)

### Lines 523-533

Boolean roundtrip uses ten length3 arrays of true values. It covers joining arrays whose lengths are not byte-aligned, but no false/null values, sliced bit offsets or boolean take. (rust/lance-file/src/versions/v1/encoding/plain.rs:523-533)

### Lines 534-561

Fixed-size-list test runs eight integer item types with list size3 and ten arrays per type, using the same reinterpreted i64 buffer and the local list constructor. Shared roundtrip checks equality and count. Parent/item nulls, sliced lists, invalid sizes and child types outside this matrix are absent. (rust/lance-file/src/versions/v1/encoding/plain.rs:534-561)

### Lines 562-574

FixedSizeBinary(3) roundtrip creates ten arrays over UInt8 values1..127 and checks them through the shared helper. It tests a positive divisible stride and no nulls, not malformed zero/negative strides or nondivisible input. (rust/lance-file/src/versions/v1/encoding/plain.rs:562-574)

### Lines 575-593

Padding fixture passes five bytes [1,0,2,0,3] to bytes_to_array(UInt16,len3,offset0), asserts values [1,2,3] and a Debug buffer substring [1,0,2,0,3,0]. This directly pins zero extension and the fixture's byte interpretation, not rejection of truncated input or portable endian conversion. (rust/lance-file/src/versions/v1/encoding/plain.rs:575-593)

### Lines 594-611

Nested fixture roundtrips ten arrays of FixedSizeList<FixedSizeList<Int64,2>,2> built from120 values. It exercises recursive encoder/decoder flattening but no nulls or slices. (rust/lance-file/src/versions/v1/encoding/plain.rs:594-611)

### Lines 612-628

The second nested fixture uses FixedSizeList<FixedSizeBinary(2),2> over120 UInt8 values with ten arrays. It confirms the fixed-binary child branch through the same full-read oracle, not boolean children or take. (rust/lance-file/src/versions/v1/encoding/plain.rs:612-628)

### Lines 629-638

Async make_array_ simply builds a len126 array of the requested type over a clone of a supplied raw buffer and unwraps; it has no await. That deliberate reinterpretation is why the primitive matrix is a buffer-roundtrip test rather than a numeric-conversion test. (rust/lance-file/src/versions/v1/encoding/plain.rs:629-638)

### Lines 639-684

Int32 range test writes [0,1,2,3,4,5], checks offset0 and positive file size, and asserts 2..4, ..4, 2.., empty2..2 and5..5 results. 3..1000 only needs some error. It does not cover empty out-of-bounds/reversed ranges, boolean offsets or error category/message. (rust/lance-file/src/versions/v1/encoding/plain.rs:639-684)

### Lines 685-716

Int32 take test writes0..100 with shutdown, then requests sorted unique [2,4,5,20,30,55,60] and asserts exact values. All are within a small file; this does not pin IO count, multi-block behavior, duplicates, null selectors or out-of-bounds errors. (rust/lance-file/src/versions/v1/encoding/plain.rs:685-716)

### Lines 717-747

Entirely commented-out boolean-slice test is historical text, not compiled/executed coverage. It describes ten12-row slices and whole-file readback after a FileReader/FileWriter migration. No tracking URL or active test attribute exists; the old API snippet is preserved only as evidence. (rust/lance-file/src/versions/v1/encoding/plain.rs:717-747)

### Lines 748-763

The disabled boolean test's second half expects [true,false,None] to read [true,false,false], matching current BooleanEncoder's null-to-false implementation. This comment is not a live regression assertion. (rust/lance-file/src/versions/v1/encoding/plain.rs:748-763)

### Lines 764-798

Entirely disabled fixed-list-slice test describes1600 Int32 values grouped by16, writing four-row slices and comparing full readback. It supplies no current executable coverage or proof that its old FileWriter signature remains valid. (rust/lance-file/src/versions/v1/encoding/plain.rs:764-798)

### Lines 799-832

Entirely disabled boolean-take test describes120 modulo5 values and selected indices [2,4,5,8,63,64,65], expecting [false,false,true,false,false,false,true]. It is a historical intended oracle only; this exact codec-local regression is inactive. A separate active reader test uses5000 Boolean values, block_size256 and indices[2,4,5,8,4555], asserting false,false,true,false,true across chunks (rust/lance-file/src/versions/v1/reader.rs:1459-1504). (rust/lance-file/src/versions/v1/encoding/plain.rs:799-832)

### Lines 833-852

The ninth active test uses width4096 and block65536 with row indices producing byte offsets above u32::MAX, asserting six exact ordinal chunks [(0..2),(2..3),(3..4),(4..5),(5..6),(6..7)]. This protects usize byte arithmetic on a sufficiently wide host, not checked overflow or u32::MAX row indices. The file ends with no active null, boolean-take, malformed-size, mixed-type unsafe-span or failure/cancellation tests. (rust/lance-file/src/versions/v1/encoding/plain.rs:833-852)

## Interaction and interpretation limits

Every physical line was read during ANALYZE61, including disabled test bodies. Tests were inspected, not run. Source remains offline and read-only: no build, test, benchmark, generator or installation was executed. These frozen V1 codecs are historical compatibility surfaces, not extension points for new format capabilities. Full V1 reader is now analyzed; backend lifecycle remains pending; narrow helper/caller reads are separately recorded. Malformed-input consequences and the repeated-leading-index trace are source deductions, not executed reproductions. No local feature flag, environment variable, global mutable state, task spawning, shutdown or cancellation cleanup is introduced by these codec implementations.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Plain encoding
    5 | //!
    6 | //! Plain encoding works with fixed stride types, i.e., `boolean`, `i8...i64`, `f16...f64`,
    7 | //! it stores the array directly in the file. It offers O(1) read access.
    8 | 
    9 | use std::ops::Range;
   10 | use std::slice::from_raw_parts;
   11 | use std::sync::Arc;
   12 | 
   13 | use arrow_arith::numeric::sub;
   14 | use arrow_array::{
   15 |     Array, ArrayRef, BooleanArray, FixedSizeBinaryArray, FixedSizeListArray, UInt8Array,
   16 |     UInt32Array, builder::BooleanBuilder, cast::AsArray, make_array, new_empty_array,
   17 | };
   18 | use arrow_buffer::{Buffer, bit_util};
   19 | use arrow_data::{ArrayDataBuilder, BufferSpec, layout};
   20 | use arrow_schema::{DataType, Field};
   21 | use arrow_select::{concat::concat, take::take};
   22 | use async_recursion::async_recursion;
   23 | use futures::stream::{self, StreamExt, TryStreamExt};
   24 | use lance_arrow::*;
   25 | use lance_core::{Error, Result};
   26 | use lance_io::{
   27 |     ReadBatchParams,
   28 |     traits::{Reader, Writer},
   29 | };
   30 | use tokio::io::AsyncWriteExt;
   31 | 
   32 | /// Encoder for plain encoding.
   33 | ///
   34 | pub struct PlainEncoder<'a> {
   35 |     writer: &'a mut dyn Writer,
   36 |     data_type: &'a DataType,
   37 | }
   38 | 
   39 | impl<'a> PlainEncoder<'a> {
   40 |     pub fn new(writer: &'a mut dyn Writer, data_type: &'a DataType) -> Self {
   41 |         PlainEncoder { writer, data_type }
   42 |     }
   43 | 
   44 |     /// Write an continuous plain-encoded array to the writer.
   45 |     pub async fn write(writer: &'a mut dyn Writer, arrays: &[&'a dyn Array]) -> Result<usize> {
   46 |         let pos = writer.tell().await?;
   47 |         if !arrays.is_empty() {
   48 |             let mut encoder = Self::new(writer, arrays[0].data_type());
   49 |             encoder.encode(arrays).await?;
   50 |         }
   51 |         Ok(pos)
   52 |     }
   53 | 
   54 |     /// Encode an slice of an Array of a batch.
   55 |     /// Returns the offset of the metadata
   56 |     pub async fn encode(&mut self, arrays: &[&dyn Array]) -> Result<usize> {
   57 |         self.encode_internal(arrays, self.data_type).await
   58 |     }
   59 | 
   60 |     #[async_recursion]
   61 |     async fn encode_internal(
   62 |         &mut self,
   63 |         array: &[&dyn Array],
   64 |         data_type: &DataType,
   65 |     ) -> Result<usize> {
   66 |         if let DataType::FixedSizeList(items, _) = data_type {
   67 |             self.encode_fixed_size_list(array, items).await
   68 |         } else {
   69 |             self.encode_primitive(array).await
   70 |         }
   71 |     }
   72 | 
   73 |     async fn encode_boolean(&mut self, arrays: &[&BooleanArray]) -> Result<()> {
   74 |         let capacity: usize = arrays.iter().map(|a| a.len()).sum();
   75 |         let mut builder = BooleanBuilder::with_capacity(capacity);
   76 | 
   77 |         for array in arrays {
   78 |             for val in array.iter() {
   79 |                 builder.append_value(val.unwrap_or_default());
   80 |             }
   81 |         }
   82 | 
   83 |         let boolean_array = builder.finish();
   84 |         self.writer
   85 |             .write_all(boolean_array.into_data().buffers()[0].as_slice())
   86 |             .await?;
   87 |         Ok(())
   88 |     }
   89 | 
   90 |     /// Encode array of primitive values.
   91 |     async fn encode_primitive(&mut self, arrays: &[&dyn Array]) -> Result<usize> {
   92 |         assert!(!arrays.is_empty());
   93 |         let data_type = arrays[0].data_type();
   94 |         let offset = self.writer.tell().await?;
   95 | 
   96 |         if matches!(data_type, DataType::Boolean) {
   97 |             let boolean_arr = arrays
   98 |                 .iter()
   99 |                 .map(|a| a.as_boolean())
  100 |                 .collect::<Vec<&BooleanArray>>();
  101 |             self.encode_boolean(boolean_arr.as_slice()).await?;
  102 |         } else {
  103 |             let byte_width = data_type.byte_width();
  104 |             for a in arrays.iter() {
  105 |                 let data = a.to_data();
  106 |                 let slice = unsafe {
  107 |                     from_raw_parts(
  108 |                         data.buffers()[0].as_ptr().add(a.offset() * byte_width),
  109 |                         a.len() * byte_width,
  110 |                     )
  111 |                 };
  112 |                 self.writer.write_all(slice).await?;
  113 |             }
  114 |         }
  115 |         Ok(offset)
  116 |     }
  117 | 
  118 |     /// Encode fixed size list.
  119 |     async fn encode_fixed_size_list(
  120 |         &mut self,
  121 |         arrays: &[&dyn Array],
  122 |         items: &Field,
  123 |     ) -> Result<usize> {
  124 |         let mut value_arrs: Vec<ArrayRef> = Vec::new();
  125 | 
  126 |         for array in arrays {
  127 |             let list_array = array
  128 |                 .as_any()
  129 |                 .downcast_ref::<FixedSizeListArray>()
  130 |                 .ok_or_else(|| {
  131 |                     Error::schema(format!(
  132 |                         "Needed a FixedSizeListArray but got {}",
  133 |                         array.data_type()
  134 |                     ))
  135 |                 })?;
  136 |             let offset = list_array.value_offset(0) as usize;
  137 |             let length = list_array.len();
  138 |             let value_length = list_array.value_length() as usize;
  139 |             let value_array = list_array.values().slice(offset, length * value_length);
  140 |             value_arrs.push(value_array);
  141 |         }
  142 | 
  143 |         self.encode_internal(
  144 |             value_arrs
  145 |                 .iter()
  146 |                 .map(|a| a.as_ref())
  147 |                 .collect::<Vec<_>>()
  148 |                 .as_slice(),
  149 |             items.data_type(),
  150 |         )
  151 |         .await
  152 |     }
  153 | }
  154 | 
  155 | /// Decoder for plain encoding.
  156 | pub struct PlainDecoder<'a> {
  157 |     reader: &'a dyn Reader,
  158 |     data_type: &'a DataType,
  159 |     /// The start position of the batch in the file.
  160 |     position: usize,
  161 |     /// Number of the rows in this batch.
  162 |     length: usize,
  163 | }
  164 | 
  165 | /// Get byte range from the row offset range.
  166 | #[inline]
  167 | fn get_byte_range(data_type: &DataType, row_range: Range<usize>) -> Range<usize> {
  168 |     match data_type {
  169 |         DataType::Boolean => row_range.start / 8..bit_util::ceil(row_range.end, 8),
  170 |         _ => row_range.start * data_type.byte_width()..row_range.end * data_type.byte_width(),
  171 |     }
  172 | }
  173 | 
  174 | fn bytes_to_array(
  175 |     data_type: &DataType,
  176 |     bytes: bytes::Bytes,
  177 |     len: usize,
  178 |     offset: usize,
  179 | ) -> Result<ArrayRef> {
  180 |     let layout = layout(data_type);
  181 |     if layout.buffers.len() != 1 {
  182 |         return Err(Error::internal(format!(
  183 |             "v1 plain encoding requires one value buffer, found {data_type}"
  184 |         )));
  185 |     }
  186 | 
  187 |     let buffer = if let BufferSpec::FixedWidth {
  188 |         byte_width,
  189 |         alignment,
  190 |     } = &layout.buffers[0]
  191 |     {
  192 |         let min_buffer_size = (len + offset).saturating_mul(*byte_width);
  193 |         if bytes.len() < min_buffer_size {
  194 |             Buffer::copy_bytes_bytes(bytes, min_buffer_size)
  195 |         } else {
  196 |             Buffer::from_bytes_bytes(bytes, *alignment as u64)
  197 |         }
  198 |     } else {
  199 |         Buffer::from_slice_ref(bytes)
  200 |     };
  201 | 
  202 |     let data = ArrayDataBuilder::new(data_type.clone())
  203 |         .len(len)
  204 |         .offset(offset)
  205 |         .null_count(0)
  206 |         .add_buffer(buffer)
  207 |         .build()?;
  208 |     Ok(make_array(data))
  209 | }
  210 | 
  211 | impl<'a> PlainDecoder<'a> {
  212 |     pub fn new(
  213 |         reader: &'a dyn Reader,
  214 |         data_type: &'a DataType,
  215 |         position: usize,
  216 |         length: usize,
  217 |     ) -> Result<Self> {
  218 |         Ok(PlainDecoder {
  219 |             reader,
  220 |             data_type,
  221 |             position,
  222 |             length,
  223 |         })
  224 |     }
  225 | 
  226 |     /// Decode primitive values, from "offset" to "offset + length".
  227 |     ///
  228 |     async fn decode_primitive(&self, start: usize, end: usize) -> Result<ArrayRef> {
  229 |         if end > self.length {
  230 |             return Err(Error::invalid_input(format!(
  231 |                 "PlainDecoder: request([{}..{}]) out of range: [0..{}]",
  232 |                 start, end, self.length
  233 |             )));
  234 |         }
  235 |         let byte_range = get_byte_range(self.data_type, start..end);
  236 |         let range = Range {
  237 |             start: self.position + byte_range.start,
  238 |             end: self.position + byte_range.end,
  239 |         };
  240 | 
  241 |         let data = self.reader.get_range(range).await?;
  242 |         // booleans are bitpacked, so we need an offset to provide the exact
  243 |         // requested range.
  244 |         let offset = if self.data_type == &DataType::Boolean {
  245 |             start % 8
  246 |         } else {
  247 |             0
  248 |         };
  249 |         bytes_to_array(self.data_type, data, end - start, offset)
  250 |     }
  251 | 
  252 |     async fn decode_fixed_size_list(
  253 |         &self,
  254 |         items: &Field,
  255 |         list_size: i32,
  256 |         start: usize,
  257 |         end: usize,
  258 |     ) -> Result<ArrayRef> {
  259 |         if !items.data_type().is_fixed_stride() {
  260 |             return Err(Error::schema(format!(
  261 |                 "Items for fixed size list should be primitives but found {}",
  262 |                 items.data_type()
  263 |             )));
  264 |         };
  265 |         let item_decoder = PlainDecoder::new(
  266 |             self.reader,
  267 |             items.data_type(),
  268 |             self.position,
  269 |             self.length * list_size as usize,
  270 |         )?;
  271 |         let item_array = item_decoder
  272 |             .get(start * list_size as usize..end * list_size as usize)
  273 |             .await?;
  274 |         Ok(Arc::new(FixedSizeListArray::new(
  275 |             Arc::new(items.clone()),
  276 |             list_size,
  277 |             item_array,
  278 |             None,
  279 |         )) as ArrayRef)
  280 |     }
  281 | 
  282 |     async fn decode_fixed_size_binary(
  283 |         &self,
  284 |         stride: i32,
  285 |         start: usize,
  286 |         end: usize,
  287 |     ) -> Result<ArrayRef> {
  288 |         let bytes_decoder = PlainDecoder::new(
  289 |             self.reader,
  290 |             &DataType::UInt8,
  291 |             self.position,
  292 |             self.length * stride as usize,
  293 |         )?;
  294 |         let bytes_array = bytes_decoder
  295 |             .get(start * stride as usize..end * stride as usize)
  296 |             .await?;
  297 |         let values = bytes_array
  298 |             .as_any()
  299 |             .downcast_ref::<UInt8Array>()
  300 |             .ok_or_else(|| {
  301 |                 Error::schema("Could not cast to UInt8Array for FixedSizeBinary".to_string())
  302 |             })?;
  303 |         Ok(Arc::new(FixedSizeBinaryArray::try_new_from_values(values, stride)?) as ArrayRef)
  304 |     }
  305 | 
  306 |     async fn take_boolean(&self, indices: &UInt32Array) -> Result<ArrayRef> {
  307 |         let block_size = self.reader.block_size() as u32;
  308 |         let boolean_block_size = block_size * 8;
  309 | 
  310 |         let mut chunk_ranges = vec![];
  311 |         let mut start: u32 = 0;
  312 |         for j in 0..(indices.len() - 1) as u32 {
  313 |             if (indices.value(j as usize + 1) / boolean_block_size)
  314 |                 > (indices.value(start as usize) / boolean_block_size)
  315 |             {
  316 |                 let next_start = j + 1;
  317 |                 chunk_ranges.push(start..next_start);
  318 |                 start = next_start;
  319 |             }
  320 |         }
  321 |         // Remaining
  322 |         chunk_ranges.push(start..indices.len() as u32);
  323 | 
  324 |         let arrays = stream::iter(chunk_ranges)
  325 |             .map(|cr| async move {
  326 |                 let request = indices.slice(cr.start as usize, cr.len());
  327 |                 // request contains the array indices we are retrieving in this chunk.
  328 | 
  329 |                 // Get the starting index
  330 |                 let start = request.value(0);
  331 |                 // Final index is the last value
  332 |                 let end = request.value(request.len() - 1);
  333 |                 let array = self.get(start as usize..end as usize + 1).await?;
  334 | 
  335 |                 let shifted_indices = sub(&request, &UInt32Array::new_scalar(start))?;
  336 |                 Ok::<ArrayRef, Error>(take(&array, &shifted_indices, None)?)
  337 |             })
  338 |             .buffered(self.reader.io_parallelism())
  339 |             .try_collect::<Vec<_>>()
  340 |             .await?;
  341 |         let references = arrays.iter().map(|a| a.as_ref()).collect::<Vec<_>>();
  342 |         Ok(concat(&references)?)
  343 |     }
  344 | }
  345 | 
  346 | fn make_chunked_requests(
  347 |     indices: &[u32],
  348 |     byte_width: usize,
  349 |     block_size: usize,
  350 | ) -> Vec<Range<usize>> {
  351 |     let mut chunked_ranges = vec![];
  352 |     let mut start: usize = 0;
  353 |     // Note: limit the I/O size to the block size.
  354 |     //
  355 |     // Another option could be checking whether `indices[i]` and `indices[i+1]` are not
  356 |     // farther way than the block size:
  357 |     //    indices[i] * byte_width + block_size < indices[i+1] * byte_width
  358 |     // It might allow slightly larger sequential reads.
  359 |     for i in 0..indices.len() - 1 {
  360 |         // If contiguous, continue
  361 |         if indices[i + 1] == indices[i] + 1 {
  362 |             continue;
  363 |         }
  364 |         if indices[i + 1] as usize * byte_width > indices[start] as usize * byte_width + block_size
  365 |         {
  366 |             chunked_ranges.push(start..i + 1);
  367 |             start = i + 1;
  368 |         }
  369 |     }
  370 |     chunked_ranges.push(start..indices.len());
  371 |     chunked_ranges
  372 | }
  373 | 
  374 | impl PlainDecoder<'_> {
  375 |     pub async fn decode(&self) -> Result<ArrayRef> {
  376 |         self.get(0..self.length).await
  377 |     }
  378 | 
  379 |     pub async fn take(&self, indices: &UInt32Array) -> Result<ArrayRef> {
  380 |         if indices.is_empty() {
  381 |             return Ok(new_empty_array(self.data_type));
  382 |         }
  383 | 
  384 |         if matches!(self.data_type, DataType::Boolean) {
  385 |             return self.take_boolean(indices).await;
  386 |         }
  387 | 
  388 |         let block_size = self.reader.block_size();
  389 |         let byte_width = self.data_type.byte_width();
  390 | 
  391 |         let chunked_ranges = make_chunked_requests(indices.values(), byte_width, block_size);
  392 | 
  393 |         let arrays = stream::iter(chunked_ranges)
  394 |             .map(|cr| async move {
  395 |                 let request = indices.slice(cr.start, cr.len());
  396 | 
  397 |                 let start = request.value(0);
  398 |                 let end = request.value(request.len() - 1);
  399 |                 let array = self.get(start as usize..end as usize + 1).await?;
  400 |                 let adjusted_offsets = sub(&request, &UInt32Array::new_scalar(start))?;
  401 |                 Ok::<ArrayRef, Error>(take(&array, &adjusted_offsets, None)?)
  402 |             })
  403 |             .buffered(self.reader.io_parallelism())
  404 |             .try_collect::<Vec<_>>()
  405 |             .await?;
  406 |         let references = arrays.iter().map(|a| a.as_ref()).collect::<Vec<_>>();
  407 |         Ok(concat(&references)?)
  408 |     }
  409 | 
  410 |     #[async_recursion]
  411 |     async fn decode_range(&self, index: Range<usize>) -> Result<ArrayRef> {
  412 |         if index.is_empty() {
  413 |             return Ok(new_empty_array(self.data_type));
  414 |         }
  415 |         match self.data_type {
  416 |             DataType::FixedSizeList(items, list_size) => {
  417 |                 self.decode_fixed_size_list(items, *list_size, index.start, index.end)
  418 |                     .await
  419 |             }
  420 |             DataType::FixedSizeBinary(stride) => {
  421 |                 self.decode_fixed_size_binary(*stride, index.start, index.end)
  422 |                     .await
  423 |             }
  424 |             _ => self.decode_primitive(index.start, index.end).await,
  425 |         }
  426 |     }
  427 | 
  428 |     pub async fn get(&self, params: impl Into<ReadBatchParams>) -> Result<ArrayRef> {
  429 |         match params.into() {
  430 |             ReadBatchParams::Range(range) => self.decode_range(range).await,
  431 |             ReadBatchParams::Ranges(_) => Err(Error::invalid_input(
  432 |                 "multiple ranges are not supported by v1 plain encoding",
  433 |             )),
  434 |             ReadBatchParams::RangeFull => self.decode_range(0..self.length).await,
  435 |             ReadBatchParams::RangeTo(range) => self.decode_range(0..range.end).await,
  436 |             ReadBatchParams::RangeFrom(range) => self.decode_range(range.start..self.length).await,
  437 |             ReadBatchParams::Indices(indices) => self.take(&indices).await,
  438 |         }
  439 |     }
  440 | }
  441 | 
  442 | #[cfg(test)]
  443 | mod tests {
  444 |     use std::ops::Deref;
  445 | 
  446 |     use arrow_array::*;
  447 |     use arrow_buffer::Buffer;
  448 |     use arrow_data::ArrayDataBuilder;
  449 |     use bytes::Bytes;
  450 |     use lance_core::utils::tempfile::TempStdFile;
  451 |     use lance_io::local::LocalObjectReader;
  452 |     use rand::prelude::*;
  453 | 
  454 |     use super::*;
  455 | 
  456 |     #[tokio::test]
  457 |     async fn test_encode_decode_primitive_array() {
  458 |         let int_types = vec![
  459 |             DataType::Int8,
  460 |             DataType::Int16,
  461 |             DataType::Int32,
  462 |             DataType::Int64,
  463 |             DataType::UInt8,
  464 |             DataType::UInt16,
  465 |             DataType::UInt32,
  466 |             DataType::UInt64,
  467 |         ];
  468 |         let input: Vec<i64> = Vec::from_iter(1..127_i64);
  469 |         for t in int_types {
  470 |             let buffer = Buffer::from_slice_ref(input.as_slice());
  471 |             let mut arrs: Vec<ArrayRef> = Vec::new();
  472 |             for _ in 0..10 {
  473 |                 arrs.push(Arc::new(make_array_(&t, &buffer).await));
  474 |             }
  475 |             test_round_trip(arrs.as_slice(), t).await;
  476 |         }
  477 | 
  478 |         let float_types = vec![DataType::Float16, DataType::Float32, DataType::Float64];
  479 |         let mut rng = rand::rng();
  480 |         let input: Vec<f64> = (1..127).map(|_| rng.random()).collect();
  481 |         for t in float_types {
  482 |             let buffer = Buffer::from_slice_ref(input.as_slice());
  483 |             let mut arrs: Vec<ArrayRef> = Vec::new();
  484 | 
  485 |             for _ in 0..10 {
  486 |                 arrs.push(Arc::new(make_array_(&t, &buffer).await));
  487 |             }
  488 |             test_round_trip(arrs.as_slice(), t).await;
  489 |         }
  490 |     }
  491 | 
  492 |     async fn test_round_trip(expected: &[ArrayRef], data_type: DataType) {
  493 |         let path = TempStdFile::default();
  494 | 
  495 |         let expected_as_array = expected
  496 |             .iter()
  497 |             .map(|e| e.as_ref())
  498 |             .collect::<Vec<&dyn Array>>();
  499 |         {
  500 |             let mut writer = tokio::fs::File::create(&path).await.unwrap();
  501 |             let mut encoder = PlainEncoder::new(&mut writer, &data_type);
  502 |             assert_eq!(
  503 |                 encoder.encode(expected_as_array.as_slice()).await.unwrap(),
  504 |                 0
  505 |             );
  506 |             writer.flush().await.unwrap();
  507 |         }
  508 | 
  509 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  510 |             .await
  511 |             .unwrap();
  512 |         assert!(reader.size().await.unwrap() > 0);
  513 |         // Expected size is the total of all arrays
  514 |         let expected_size = expected.iter().map(|e| e.len()).sum();
  515 |         let decoder = PlainDecoder::new(reader.as_ref(), &data_type, 0, expected_size).unwrap();
  516 |         let arr = decoder.decode().await.unwrap();
  517 |         let actual = arr.as_ref();
  518 |         let expected_merged = concat(expected_as_array.as_slice()).unwrap();
  519 |         assert_eq!(expected_merged.deref(), actual);
  520 |         assert_eq!(expected_size, actual.len());
  521 |     }
  522 | 
  523 |     #[tokio::test]
  524 |     async fn test_encode_decode_bool_array() {
  525 |         let mut arrs: Vec<ArrayRef> = Vec::new();
  526 | 
  527 |         for _ in 0..10 {
  528 |             // It is important that the boolean array length is < 8 so we can test if the Arrays are merged correctly
  529 |             arrs.push(Arc::new(BooleanArray::from(vec![true, true, true])) as ArrayRef);
  530 |         }
  531 |         test_round_trip(arrs.as_slice(), DataType::Boolean).await;
  532 |     }
  533 | 
  534 |     #[tokio::test]
  535 |     async fn test_encode_decode_fixed_size_list_array() {
  536 |         let int_types = vec![
  537 |             DataType::Int8,
  538 |             DataType::Int16,
  539 |             DataType::Int32,
  540 |             DataType::Int64,
  541 |             DataType::UInt8,
  542 |             DataType::UInt16,
  543 |             DataType::UInt32,
  544 |             DataType::UInt64,
  545 |         ];
  546 |         let input = Vec::from_iter(1..127_i64);
  547 |         for t in int_types {
  548 |             let buffer = Buffer::from_slice_ref(input.as_slice());
  549 |             let list_type =
  550 |                 DataType::FixedSizeList(Arc::new(Field::new("item", t.clone(), true)), 3);
  551 |             let mut arrs: Vec<ArrayRef> = Vec::new();
  552 | 
  553 |             for _ in 0..10 {
  554 |                 let items = make_array_(&t.clone(), &buffer).await;
  555 |                 let arr = FixedSizeListArray::try_new_from_values(items, 3).unwrap();
  556 |                 arrs.push(Arc::new(arr) as ArrayRef);
  557 |             }
  558 |             test_round_trip(arrs.as_slice(), list_type).await;
  559 |         }
  560 |     }
  561 | 
  562 |     #[tokio::test]
  563 |     async fn test_encode_decode_fixed_size_binary_array() {
  564 |         let t = DataType::FixedSizeBinary(3);
  565 |         let mut arrs: Vec<ArrayRef> = Vec::new();
  566 | 
  567 |         for _ in 0..10 {
  568 |             let values = UInt8Array::from(Vec::from_iter(1..127_u8));
  569 |             let arr = FixedSizeBinaryArray::try_new_from_values(&values, 3).unwrap();
  570 |             arrs.push(Arc::new(arr) as ArrayRef);
  571 |         }
  572 |         test_round_trip(arrs.as_slice(), t).await;
  573 |     }
  574 | 
  575 |     #[tokio::test]
  576 |     async fn test_bytes_to_array_padding() {
  577 |         let bytes = Bytes::from_static(&[0x01, 0x00, 0x02, 0x00, 0x03]);
  578 |         let arr = bytes_to_array(&DataType::UInt16, bytes, 3, 0).unwrap();
  579 | 
  580 |         let expected = UInt16Array::from(vec![1, 2, 3]);
  581 |         assert_eq!(arr.as_ref(), &expected);
  582 | 
  583 |         // Underlying data is padded to the nearest multiple of two bytes (for u16).
  584 |         let data = arr.to_data();
  585 |         let buf = &data.buffers()[0];
  586 |         let repr = format!("{:?}", buf);
  587 |         assert!(
  588 |             repr.contains("[1, 0, 2, 0, 3, 0]"),
  589 |             "Underlying buffer contains unexpected data: {}",
  590 |             repr
  591 |         );
  592 |     }
  593 | 
  594 |     #[tokio::test]
  595 |     async fn test_encode_decode_nested_fixed_size_list() {
  596 |         // FixedSizeList of FixedSizeList
  597 |         let inner = DataType::FixedSizeList(Arc::new(Field::new("item", DataType::Int64, true)), 2);
  598 |         let t = DataType::FixedSizeList(Arc::new(Field::new("item", inner, true)), 2);
  599 |         let mut arrs: Vec<ArrayRef> = Vec::new();
  600 | 
  601 |         for _ in 0..10 {
  602 |             let values = Int64Array::from_iter_values(1..=120_i64);
  603 |             let arr = FixedSizeListArray::try_new_from_values(
  604 |                 FixedSizeListArray::try_new_from_values(values, 2).unwrap(),
  605 |                 2,
  606 |             )
  607 |             .unwrap();
  608 |             arrs.push(Arc::new(arr) as ArrayRef);
  609 |         }
  610 |         test_round_trip(arrs.as_slice(), t).await;
  611 | 
  612 |         // FixedSizeList of FixedSizeBinary
  613 |         let inner = DataType::FixedSizeBinary(2);
  614 |         let t = DataType::FixedSizeList(Arc::new(Field::new("item", inner, true)), 2);
  615 |         let mut arrs: Vec<ArrayRef> = Vec::new();
  616 | 
  617 |         for _ in 0..10 {
  618 |             let values = UInt8Array::from_iter_values(1..=120_u8);
  619 |             let arr = FixedSizeListArray::try_new_from_values(
  620 |                 FixedSizeBinaryArray::try_new_from_values(&values, 2).unwrap(),
  621 |                 2,
  622 |             )
  623 |             .unwrap();
  624 |             arrs.push(Arc::new(arr) as ArrayRef);
  625 |         }
  626 |         test_round_trip(arrs.as_slice(), t).await;
  627 |     }
  628 | 
  629 |     async fn make_array_(data_type: &DataType, buffer: &Buffer) -> ArrayRef {
  630 |         arrow_array::make_array(
  631 |             ArrayDataBuilder::new(data_type.clone())
  632 |                 .len(126)
  633 |                 .add_buffer(buffer.clone())
  634 |                 .build()
  635 |                 .unwrap(),
  636 |         )
  637 |     }
  638 | 
  639 |     #[tokio::test]
  640 |     async fn test_decode_by_range() {
  641 |         let path = TempStdFile::default();
  642 | 
  643 |         let array = Int32Array::from_iter_values([0, 1, 2, 3, 4, 5]);
  644 |         {
  645 |             let mut writer = tokio::fs::File::create(&path).await.unwrap();
  646 |             let mut encoder = PlainEncoder::new(&mut writer, array.data_type());
  647 |             assert_eq!(encoder.encode(&[&array]).await.unwrap(), 0);
  648 |             writer.flush().await.unwrap();
  649 |         }
  650 | 
  651 |         let reader = LocalObjectReader::open_local_path(&path, 2048, None)
  652 |             .await
  653 |             .unwrap();
  654 |         assert!(reader.size().await.unwrap() > 0);
  655 |         let decoder =
  656 |             PlainDecoder::new(reader.as_ref(), array.data_type(), 0, array.len()).unwrap();
  657 |         assert_eq!(
  658 |             decoder.get(2..4).await.unwrap().as_ref(),
  659 |             &Int32Array::from_iter_values([2, 3])
  660 |         );
  661 | 
  662 |         assert_eq!(
  663 |             decoder.get(..4).await.unwrap().as_ref(),
  664 |             &Int32Array::from_iter_values([0, 1, 2, 3])
  665 |         );
  666 | 
  667 |         assert_eq!(
  668 |             decoder.get(2..).await.unwrap().as_ref(),
  669 |             &Int32Array::from_iter_values([2, 3, 4, 5])
  670 |         );
  671 | 
  672 |         assert_eq!(
  673 |             &decoder.get(2..2).await.unwrap(),
  674 |             &new_empty_array(&DataType::Int32)
  675 |         );
  676 | 
  677 |         assert_eq!(
  678 |             &decoder.get(5..5).await.unwrap(),
  679 |             &new_empty_array(&DataType::Int32)
  680 |         );
  681 | 
  682 |         assert!(decoder.get(3..1000).await.is_err());
  683 |     }
  684 | 
  685 |     #[tokio::test]
  686 |     async fn test_take() {
  687 |         let path = TempStdFile::default();
  688 | 
  689 |         let array = Int32Array::from_iter_values(0..100);
  690 | 
  691 |         {
  692 |             let mut writer = tokio::fs::File::create(&path).await.unwrap();
  693 |             let mut encoder = PlainEncoder::new(&mut writer, array.data_type());
  694 |             assert_eq!(encoder.encode(&[&array]).await.unwrap(), 0);
  695 |             AsyncWriteExt::shutdown(&mut writer).await.unwrap();
  696 |         }
  697 | 
  698 |         let reader = LocalObjectReader::open_local_path(&path, 2048, None)
  699 |             .await
  700 |             .unwrap();
  701 |         assert!(reader.size().await.unwrap() > 0);
  702 |         let decoder =
  703 |             PlainDecoder::new(reader.as_ref(), array.data_type(), 0, array.len()).unwrap();
  704 | 
  705 |         let results = decoder
  706 |             .take(&UInt32Array::from_iter(
  707 |                 [2, 4, 5, 20, 30, 55, 60].iter().map(|i| *i as u32),
  708 |             ))
  709 |             .await
  710 |             .unwrap();
  711 |         assert_eq!(
  712 |             results.as_ref(),
  713 |             &Int32Array::from_iter_values([2, 4, 5, 20, 30, 55, 60])
  714 |         );
  715 |     }
  716 | 
  717 |     // Re-enable the following tests once the Lance FileReader / FileWrite is migrated.
  718 | 
  719 |     // #[tokio::test]
  720 |     // async fn test_boolean_slice() {
  721 |     //     let store = ObjectStore::memory();
  722 |     //     let path = Path::from("/bool_slice");
  723 |     //
  724 |     //     let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
  725 |     //         "b",
  726 |     //         DataType::Boolean,
  727 |     //         true,
  728 |     //     )]));
  729 |     //     let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  730 |     //     let mut file_writer =
  731 |     //         FileWriter::try_new(&store, &path, schema.clone(), &Default::default())
  732 |     //             .await
  733 |     //             .unwrap();
  734 |     //
  735 |     //     let array = BooleanArray::from((0..120).map(|v| v % 5 == 0).collect::<Vec<_>>());
  736 |     //     for i in 0..10 {
  737 |     //         let data = array.slice(i * 12, 12); // one and half byte
  738 |     //         file_writer
  739 |     //             .write(&[RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(data)]).unwrap()])
  740 |     //             .await
  741 |     //             .unwrap();
  742 |     //     }
  743 |     //     file_writer.finish().await.unwrap();
  744 |     //
  745 |     //     let batch = read_file_as_one_batch(&store, &path).await;
  746 |     //     assert_eq!(batch.column_by_name("b").unwrap().as_ref(), &array);
  747 |     //
  748 |     //     let array = BooleanArray::from(vec![Some(true), Some(false), None]);
  749 |     //     let mut file_writer = FileWriter::try_new(&store, &path, schema, &Default::default())
  750 |     //         .await
  751 |     //         .unwrap();
  752 |     //     file_writer
  753 |     //         .write(&[RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(array)]).unwrap()])
  754 |     //         .await
  755 |     //         .unwrap();
  756 |     //     file_writer.finish().await.unwrap();
  757 |     //     let batch = read_file_as_one_batch(&store, &path).await;
  758 |     //
  759 |     //     // None default to Some(false), since we don't support null values yet.
  760 |     //     let expected = BooleanArray::from(vec![Some(true), Some(false), Some(false)]);
  761 |     //     assert_eq!(batch.column_by_name("b").unwrap().as_ref(), &expected);
  762 |     // }
  763 |     //
  764 |     // #[tokio::test]
  765 |     // async fn test_encode_fixed_size_list_slice() {
  766 |     //     let store = ObjectStore::memory();
  767 |     //     let path = Path::from("/shared_slice");
  768 |     //
  769 |     //     let array = Int32Array::from_iter_values(0..1600);
  770 |     //     let fixed_size_list = FixedSizeListArray::try_new_from_values(array, 16).unwrap();
  771 |     //     let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
  772 |     //         "fl",
  773 |     //         fixed_size_list.data_type().clone(),
  774 |     //         false,
  775 |     //     )]));
  776 |     //     let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  777 |     //     let mut file_writer = FileWriter::try_new(&store, &path, schema, &Default::default())
  778 |     //         .await
  779 |     //         .unwrap();
  780 |     //
  781 |     //     for i in (0..100).step_by(4) {
  782 |     //         let slice: FixedSizeListArray = fixed_size_list.slice(i, 4);
  783 |     //         file_writer
  784 |     //             .write(&[
  785 |     //                 RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(slice)]).unwrap(),
  786 |     //             ])
  787 |     //             .await
  788 |     //             .unwrap();
  789 |     //     }
  790 |     //     file_writer.finish().await.unwrap();
  791 |     //
  792 |     //     let batch = read_file_as_one_batch(&store, &path).await;
  793 |     //     assert_eq!(
  794 |     //         batch.column_by_name("fl").unwrap().as_ref(),
  795 |     //         &fixed_size_list
  796 |     //     );
  797 |     // }
  798 |     //
  799 |     // #[tokio::test]
  800 |     // async fn test_take_boolean() {
  801 |     //     let temp_dir = tempfile::tempdir().unwrap();
  802 |     //     let path = temp_dir.join("/bool_take");
  803 |     //
  804 |     //     let arrow_schema = Arc::new(ArrowSchema::new(vec![Field::new(
  805 |     //         "b",
  806 |     //         DataType::Boolean,
  807 |     //         false,
  808 |     //     )]));
  809 |     //     let schema = Schema::try_from(arrow_schema.as_ref()).unwrap();
  810 |     //     let mut file_writer =
  811 |     //         FileWriter::try_new(&store, &path, schema.clone(), &Default::default())
  812 |     //             .await
  813 |     //             .unwrap();
  814 |     //
  815 |     //     let array = BooleanArray::from((0..120).map(|v| v % 5 == 0).collect::<Vec<_>>());
  816 |     //     let batch =
  817 |     //         RecordBatch::try_new(arrow_schema.clone(), vec![Arc::new(array.clone())]).unwrap();
  818 |     //     file_writer.write(&[batch]).await.unwrap();
  819 |     //     file_writer.finish().await.unwrap();
  820 |     //
  821 |     //     let reader = FileReader::try_new(&store, &path).await.unwrap();
  822 |     //     let actual = reader
  823 |     //         .take(&[2, 4, 5, 8, 63, 64, 65], &schema)
  824 |     //         .await
  825 |     //         .unwrap();
  826 |     //
  827 |     //     assert_eq!(
  828 |     //         actual.column_by_name("b").unwrap().as_ref(),
  829 |     //         &BooleanArray::from(vec![false, false, true, false, false, false, true])
  830 |     //     );
  831 |     // }
  832 | 
  833 |     #[test]
  834 |     fn test_make_chunked_request() {
  835 |         let byte_width: usize = 4096; // 4K
  836 |         let prefetch_size: usize = 64 * 1024; // 64KB.
  837 |         let u32_overflow: usize = u32::MAX as usize + 10;
  838 | 
  839 |         let indices: Vec<u32> = vec![
  840 |             1,
  841 |             10,
  842 |             20,
  843 |             100,
  844 |             120,
  845 |             (u32_overflow / byte_width) as u32, // Two overflow offsets
  846 |             (u32_overflow / byte_width) as u32 + 100,
  847 |         ];
  848 |         let chunks = make_chunked_requests(&indices, byte_width, prefetch_size);
  849 |         assert_eq!(chunks.len(), 6, "got chunks: {:?}", chunks);
  850 |         assert_eq!(chunks, vec![(0..2), (2..3), (3..4), (4..5), (5..6), (6..7)])
  851 |     }
  852 | }
``````
