> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/bitpacking.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `86f72ff548eba44d6307ef09ca17b935ad8ff1ec80b897ee845d3be16624666f`. Reviewed physical lines: 1-897.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Inline per-chunk native-width headers and out-of-line fixed-width FastLanes block compression/decompression. Explicit framing, raw-tail heuristic, allocation and unchecked kernel contracts are distinct from high-level selection. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:1-897)

## Complete range analysis

### Lines 1-38

SPDX/docs/imports. Intro says0..5000 needs12bits, but5000 requires13; the12bit range ends4095. Intro calls encoding transparent and associates out-of-line with full-zip, while later docs explicitly say current per-value traits cannot express it and only block interface is implemented. Imports unsigned typed arrays, Arrow native types, unsafe-uninitialized FastLanes trait, core errors, buffer/data/statistics and protobuf helpers. The containing physical module gates this file on feature bitpacking. (rust/lance-encoding/src/encodings/physical.rs:4-6) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:1-38)

### Lines 39-69

Crate-visible LOG_ELEMS_PER_CHUNK:u8=10; public ELEMS_PER_CHUNK:u64=1024. Public Debug+Default InlineBitpacking privately stores uncompressed width (derived default0). new/from_description simply store width; from_description ignores optional values compression. min_size_bytes(width) returns ceil(1024*width/8), excluding the native-width inline header; unchecked multiplication. It is a packed payload size estimate, not exact total or universal break-even validation. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:39-69)

### Lines 70-105

bitpack_chunked<T> debug-requires positive logical count, obtains owning typed buffer view, then expects Stat::BitWidth as UInt64 primitive or panics. Precompute native words per chunk=(1024*width)/data.bits_per_value and total including one header word each, all unchecked; allocate Vec<T> capacity and chunk metadata. Statistics must match ceil(logicalcount/1024), source bytes and actual maxima; this function does not verify those relations or bound widths. Normal statistics calculate unsigned OR/leading-zero widths over physical typed slices in1024 groups; caller-provided public BlockInfo can differ. (rust/lance-encoding/src/statistics.rs:89-114; rust/lance-encoding/src/statistics.rs:140-146; rust/lance-encoding/src/statistics.rs:324-335; rust/lance-encoding/src/statistics.rs:353-406; rust/lance-encoding/src/data.rs:63-77) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:70-105)

### Lines 106-129

For every stat except last, push native-width compressed-width header, pass exactly1024 typed source values and reserved packed output slice to unsafe unchecked_pack_uninit, then set_len only after kernel returns. Record byte size (header+packed words)*sizeofT asu32 and log10. Safety relies on valid widths, exact kernel slice contracts and initialization guarantee; local bounds slicing catches some malformed lengths, while stale too-small widths can silently discard high bits in kernel mask. No local full-value fit check. (rust/compression/bitpacking/src/lib.rs:61-94; rust/compression/bitpacking/src/lib.rs:182-221) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:106-129)

### Lines 130-167

Always handle one final chunk: full1024 if divisible, otherwise remainder. Allocate zero-filled1024 T values, copy source suffix starting logicalcount-lastcount, append final header and unsafe packed payload, then record log0 even for a full last chunk. clone_from_slice requires source suffix length exactlylastcount, exposing extra/short source-byte mismatch by panic. Empty logical count leads to debug assertion or arithmetic/index/slice failure rather than empty compression success. Stats empty/count mismatch likewise not validated as Result. Output is one typed allocation reinterpreted as bytes; zero padding applies to missing logical values. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:130-167)

### Lines 168-188

chunk_data asserts byte-multiple width and equality to configured width; dispatch only8/16/32/64 to unsigned native types, else unreachable. Returns InlineBitpacking descriptor with optional outer values compressionNone. All signed/float representation handling is raw native bits; no delta, zigzag or sign extension. No numeric file-version selection. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:168-188)

### Lines 189-226

unchunk<T> validates in order: enough bytes for native-width header; total length divisible by sizeofT; requested count<=1024. Violations return CorruptFile named inline_bitpacking with observed/required numbers. No IO; input is one already-separated chunk. Error order is observable for multiply-invalid inputs. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:189-226)

### Lines 227-264

Borrow typed Cow view (unaligned input copied by LanceBuffer), read first native word via as_usize and reject width>T. Require payload bytes exactly width*1024/8 using checked multiplication; trailing or missing bytes fail CorruptFile. Width0 accepts header-only payload. Cast of a u64 header through as_usize has target-width implications; no separate u64-range check before conversion is local. This verifies kernel input length before unsafe decode. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:227-264)

### Lines 265-296

Allocate capacity1024 T, call unchecked_unpack_uninit into exactly1024 spare elements, then set_len1024 using kernel initialization contract. Truncate visible length to requested count, preserving allocation capacity; output FixedWidth uses native Tbits/count/fresh BlockInfo. Discarded tail values are not checked to be zero. empty_block creates zero-length raw block at configured width with no validation. No direct allocation-size limit beyond this fixed chunk. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:265-296)

### Lines 297-340

MiniBlockCompressor ignores framing context; FixedWidth calls asserting chunk_data, other variants return InvalidInputSource with historical BitpackMiniBlockEncoder name. BlockCompressor returns InvalidInput for nonfixed or configured/input-width mismatch, then calls same chunker and extracts first/only concatenated data buffer. It does not require count<=1024 even though matching block decoder only accepts one chunk; public direct compression of>1024 is not a symmetric block round trip. Normal selection uses Inline only when count<=1024 and OutOfLine otherwise. (rust/lance-encoding/src/compression.rs:421-447) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:297-340)

### Lines 341-364

MiniBlockDecompressor asserts exactly one buffer before zero-count short-circuit. Count0 discards arbitrary supplied bytes and returns empty block without validating header or configured width. Positive count dispatches8/16/32/64, otherwise unimplemented panic. decoded_size_bytes reports checked count*configured width rounded bytes orNone on overflow; it does not enforce count<=1024 or valid width and does not include fixed1024 allocation capacity. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:341-364)

### Lines 365-383

BlockDecompressor first requires Some payload (None errors even count0). Count0 returns empty block before chunk validation, mirroring mini-block after its buffer-count guard. Positive count dispatches same native types/unchunk, unsupported width panics. Comment references issue7794 for empty-data regression; no web access or issue-status verification. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:365-383)

### Lines 384-407

Private generic bitpack_out_of_line borrows full typed payload and derives number of chunks/remainder from physical typed length, ignoring FixedWidthDataBlock.num_values. Compute ceil(1024*W/data.bits_per_value) native output words; allocate num_chunks*words capacity. If widths/counts/arithmetic are malformed, no Result validation here. This is headerless per1024 packing at one configured W. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:384-407)

### Lines 408-428

For each full physical1024 chunk, unsafe pack into exact spare slice, set_len after guaranteed initialization. If no remainder, return immediately. W0 is a valid no-payload representation for all-zero data but actual value fit is caller responsibility; kernel masking can discard nonzero data if width too small. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:408-428)

### Lines 429-459

For tail R, compute savings=(T-W).saturating_sub semantics through T.saturating_sub(W), padding_cost=W*(1024-R), tail_savings=saturating((T-W)*R); debug-assert R>0 and positive savings. Pack a zero-padded1024 tail only if padding_cost<tail_savings; equality uses raw T values. This is equivalent to comparing packed1024W with rawRT for valid arithmetic. Raw append may reallocate; padded tail uses reserved words. W>=T on a runt tail violates debug assertion even though constructor accepts it. No tail marker is written. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:429-459)

### Lines 460-483

unpack_out_of_line computes words per chunk from W and supplied native-width field, obtains typed compressed slice, and derives full/tail counts from requested num_values. Raw tail recognized only when R>0 and total compressed word count==full_words+R; otherwise assume padded packed tail. This length rule is essential at equal-size tie because raw native layout differs from FastLanes transpose. Allocate num_values.saturating_add(1024) T capacity. Arithmetic before allocation remains largely unchecked. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:460-483)

### Lines 484-530

Unsafe-unpack each full chunk from bounds-checked slice into1024 spare outputs, set_len afterward. Raw tail copies R words; packed tail reads one packed chunk, decodes1024 and truncates to R. Debug output length equality, then FixedWidth with original native-width field/requested count/fresh stats. No exact total-payload length validation, no padded-tail-zero check: too-short slices panic; surplus words can be ignored or alter raw-vs-packed classification. Zero requested values allocates capacity1024 and ignores all typed input after divisibility conversion. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:484-530)

### Lines 531-570

Public Debug OutOfLineBitpacking stores private compressed/uncompressed u64 widths; new accepts any pair without validation. Docs explain fixed-width1024 blocks and why bits_per_value*i is not direct item address; illustrative ignored doctest sketches chunk arithmetic but omits actual FastLanes lane permutation. No PerValueCompressor implementation exists here. Full exact lane formula comes from local kernel macros, not this sketch. (rust/compression/bitpacking/src/lib.rs:23-172) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:531-570)

### Lines 571-605

BlockCompressor requires FixedWidth and exact configured native width or contextual InvalidInput. Supports native8/16/32/64, otherwise InvalidInput listing actual width. Configured compressed width is cast usize and forwarded unchecked; it is not validated<=native or against values. Return Some buffer, even empty, with OutOfLine descriptor storing native width and nested Flat(W,None). Logical count not included in payload; enclosing caller carries it. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:571-605)

### Lines 606-651

BlockDecompressor requires Some, selects native word size or panics, debug-checks byte divisibility then builds a temporary block with num_values=physical native word count. Typed borrow later checks divisibility unconditionally. Dispatch generic unpack using external requested count and configured W; caststo usize unchecked. It does not implement MiniBlockDecompressor, per-value decoder, infer_num_values override or exact-size override. Default strategy obtains W only from nested Flat and errors for other kinds, but unwraps missing fields and adds no width-range validation. (rust/lance-encoding/src/compression.rs:1171-1211) (rust/lance-encoding/src/encodings/physical/bitpacking.rs:606-651)

### Lines 652-710

cfg(test) private mod test imports unsigned kernel APIs, Arrow/harness, rstest. Two empty-decode tests each parameterize8/16/32/64 and assert returned FixedWidth,width,count0,bytes0 for mini-block [empty] or block Some(empty). They do not cover None payload, extra buffers, nonempty ignored bytes or invalid configured width with count0. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:652-710)

### Lines 711-751

roundtrip_unchunk pads values to1024, allocates initialized native header/payload, calls unsafe compatibility pack and private unchunk, then compares all decoded typed values. assert_corrupt_unchunk requires CorruptFile variant and expected message substring. These are local helpers, not independent external-fixture or production-writer verification. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:711-751)

### Lines 752-763

Two local typed round trips:500 u32 values(i*7)%4096 atW12 (tail), and1024 u64 values(i*3)%2^23 atW23 (full). Width need not be minimum; test only lossless result for chosen data. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:752-763)

### Lines 764-781

Five named u32 rejection cases:3-byte short header,5-byte nonmultiple size,1025values,headerW12 with no payload,headerW33 exceeding32. Assertions cover error kind and substring through helper; no adversarial allocation, invalid native width, 32-bit usize header conversion or corrupt padding checks. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:764-781)

### Lines 782-815

Async structural harness test supplies Int8 full chunks of100,1,16,-1 then one5; then loops Int16/32/64 with seven1024-value arrays3,8,16,100,512,1000,2000 and ten-1 values, casting from Int64. Signed negatives retain unsigned raw width. No local expected-encoding assertion in this test; selection may choose other algorithms. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:782-815)

### Lines 816-840

Encoding-verification harness requires inline_bitpacking for2048 Int32 values i%16 across structural modes, with BSS off. RLE avoidance is a comment-based fixture intent; actual expected-name check is delegated. No outer full block concatenation/decode regression here. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:816-840)

### Lines 841-865

Zero-chunk selection fixture uses1024zero i32 then1024 i%16, expects inline_bitpacking with BSS off and RLE threshold0. Demonstrates intended per-chunkW0 selection through harness; no standalone invalid-width test. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:841-865)

### Lines 866-897

Raw-tail roundtrip directly packs1025 u32 values i%200 atW8/native32, asserts compressed word count256+1, unpacks using original count and compares all values. Does not call public OutOfLine trait methods or test padded tails/equal-size threshold, W0, full-width runt, extra bytes or logical/physical count mismatch. Nine local test functions (19 named cases before async harness expansion) were read, not run. (rust/lance-encoding/src/encodings/physical/bitpacking.rs:866-897)

## Interaction and interpretation limits

Complete physical source was read during ANALYZE74 in bounded untruncated chunks. No source build/test/lint/benchmark/generator or dependency installation ran. Exact source and declarations are retained. Contextual dependency reads remain partial and do not establish whole-file coverage or measured performance. Source-derived risks are not reproduced runtime failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Bitpacking encodings
    5 | //!
    6 | //! These encodings look for unused higher order bits and discard them.  For example, if we
    7 | //! have a u32 array and all values are between 0 and 5000 then we only need 12 bits to store
    8 | //! each value.  The encoding will discard the upper 20 bits and only store 12 bits.
    9 | //!
   10 | //! This is a simple encoding that works well for data that has a small range.
   11 | //!
   12 | //! In order to decode the values we need to know the bit width of the values.  This can be stored
   13 | //! inline with the data (miniblock) or in the encoding description, out of line (full zip).
   14 | //!
   15 | //! The encoding is transparent because the output has a fixed width (just like the input) and
   16 | //! we can easily jump to the correct value.
   17 | 
   18 | use arrow_array::types::UInt64Type;
   19 | use arrow_array::{Array, PrimitiveArray};
   20 | use arrow_buffer::ArrowNativeType;
   21 | use lance_bitpacking::BitPackingUninit;
   22 | 
   23 | use lance_core::{Error, Result};
   24 | 
   25 | use crate::buffer::LanceBuffer;
   26 | use crate::compression::{
   27 |     BlockCompressor, BlockDecompressor, MiniBlockDecompressor, require_block_payload,
   28 | };
   29 | use crate::data::BlockInfo;
   30 | use crate::data::{DataBlock, FixedWidthDataBlock};
   31 | use crate::encodings::logical::primitive::miniblock::{
   32 |     MiniBlockChunk, MiniBlockCompressed, MiniBlockCompressionContext, MiniBlockCompressor,
   33 | };
   34 | use crate::format::pb21::CompressiveEncoding;
   35 | use crate::format::{ProtobufUtils21, pb21};
   36 | use crate::statistics::{GetStat, Stat};
   37 | use bytemuck::Pod;
   38 | 
   39 | pub(crate) const LOG_ELEMS_PER_CHUNK: u8 = 10;
   40 | /// Number of values encoded in each inline bitpacking chunk.
   41 | pub const ELEMS_PER_CHUNK: u64 = 1 << LOG_ELEMS_PER_CHUNK;
   42 | 
   43 | #[derive(Debug, Default)]
   44 | pub struct InlineBitpacking {
   45 |     uncompressed_bit_width: u64,
   46 | }
   47 | 
   48 | impl InlineBitpacking {
   49 |     pub fn new(uncompressed_bit_width: u64) -> Self {
   50 |         Self {
   51 |             uncompressed_bit_width,
   52 |         }
   53 |     }
   54 | 
   55 |     pub fn from_description(description: &pb21::InlineBitpacking) -> Self {
   56 |         Self {
   57 |             uncompressed_bit_width: description.uncompressed_bits_per_value,
   58 |         }
   59 |     }
   60 | 
   61 |     /// The minimum number of bytes required to actually get compression
   62 |     ///
   63 |     /// We have to compress in blocks of 1024 values.  For example, we can compress 500 2-byte (1000 bytes)
   64 |     /// values into 1024 2-bit values (256 bytes) for a win but we don't want to compress 10 2-byte values
   65 |     /// into 1024 2-bit values because that's not a win.
   66 |     pub fn min_size_bytes(compressed_bit_width: u64) -> u64 {
   67 |         (ELEMS_PER_CHUNK * compressed_bit_width).div_ceil(8)
   68 |     }
   69 | 
   70 |     /// Bitpacks a FixedWidthDataBlock into compressed chunks of 1024 values
   71 |     ///
   72 |     /// Each chunk can have a different bit width
   73 |     ///
   74 |     /// Each chunk has the compressed bit width stored inline in the chunk itself.
   75 |     fn bitpack_chunked<T: ArrowNativeType + BitPackingUninit>(
   76 |         data: FixedWidthDataBlock,
   77 |     ) -> MiniBlockCompressed {
   78 |         debug_assert!(data.num_values > 0);
   79 |         let data_buffer = data.data.borrow_to_typed_slice::<T>();
   80 |         let data_buffer = data_buffer.as_ref();
   81 | 
   82 |         let bit_widths = data.expect_stat(Stat::BitWidth);
   83 |         let bit_widths_array = bit_widths
   84 |             .as_any()
   85 |             .downcast_ref::<PrimitiveArray<UInt64Type>>()
   86 |             .unwrap();
   87 | 
   88 |         let (packed_chunk_sizes, total_size) = bit_widths_array
   89 |             .values()
   90 |             .iter()
   91 |             .map(|&bit_width| {
   92 |                 let chunk_size = ((1024 * bit_width) / data.bits_per_value) as usize;
   93 |                 (chunk_size, chunk_size + 1)
   94 |             })
   95 |             .fold(
   96 |                 (Vec::with_capacity(bit_widths_array.len()), 0),
   97 |                 |(mut sizes, total), (size, inc)| {
   98 |                     sizes.push(size);
   99 |                     (sizes, total + inc)
  100 |                 },
  101 |             );
  102 | 
  103 |         let mut output: Vec<T> = Vec::with_capacity(total_size);
  104 |         let mut chunks = Vec::with_capacity(bit_widths_array.len());
  105 | 
  106 |         for (i, packed_chunk_size) in packed_chunk_sizes
  107 |             .iter()
  108 |             .enumerate()
  109 |             .take(bit_widths_array.len() - 1)
  110 |         {
  111 |             let start_elem = i * ELEMS_PER_CHUNK as usize;
  112 |             let bit_width = bit_widths_array.value(i) as usize;
  113 |             output.push(T::from_usize(bit_width).unwrap());
  114 |             let output_len = output.len();
  115 |             unsafe {
  116 |                 BitPackingUninit::unchecked_pack_uninit(
  117 |                     bit_width,
  118 |                     &data_buffer[start_elem..][..ELEMS_PER_CHUNK as usize],
  119 |                     &mut output.spare_capacity_mut()[..*packed_chunk_size],
  120 |                 );
  121 |                 // The bitpacking kernel initialized every reserved output word.
  122 |                 output.set_len(output_len + *packed_chunk_size);
  123 |             }
  124 |             chunks.push(MiniBlockChunk {
  125 |                 buffer_sizes: vec![((1 + *packed_chunk_size) * std::mem::size_of::<T>()) as u32],
  126 |                 log_num_values: LOG_ELEMS_PER_CHUNK,
  127 |             });
  128 |         }
  129 | 
  130 |         // Handle the last chunk
  131 |         let last_chunk_elem_num = if data.num_values.is_multiple_of(ELEMS_PER_CHUNK) {
  132 |             ELEMS_PER_CHUNK
  133 |         } else {
  134 |             data.num_values % ELEMS_PER_CHUNK
  135 |         };
  136 |         let mut last_chunk: Vec<T> = vec![T::from_usize(0).unwrap(); ELEMS_PER_CHUNK as usize];
  137 |         last_chunk[..last_chunk_elem_num as usize].clone_from_slice(
  138 |             &data_buffer[data.num_values as usize - last_chunk_elem_num as usize..],
  139 |         );
  140 |         let bit_width = bit_widths_array.value(bit_widths_array.len() - 1) as usize;
  141 |         output.push(T::from_usize(bit_width).unwrap());
  142 |         let output_len = output.len();
  143 |         let packed_chunk_size = packed_chunk_sizes[bit_widths_array.len() - 1];
  144 |         unsafe {
  145 |             BitPackingUninit::unchecked_pack_uninit(
  146 |                 bit_width,
  147 |                 &last_chunk,
  148 |                 &mut output.spare_capacity_mut()[..packed_chunk_size],
  149 |             );
  150 |             // The bitpacking kernel initialized every reserved output word.
  151 |             output.set_len(output_len + packed_chunk_size);
  152 |         }
  153 |         chunks.push(MiniBlockChunk {
  154 |             buffer_sizes: vec![
  155 |                 ((1 + packed_chunk_sizes[bit_widths_array.len() - 1]) * std::mem::size_of::<T>())
  156 |                     as u32,
  157 |             ],
  158 |             log_num_values: 0,
  159 |         });
  160 | 
  161 |         MiniBlockCompressed {
  162 |             data: vec![LanceBuffer::reinterpret_vec(output)],
  163 |             chunks,
  164 |             num_values: data.num_values,
  165 |         }
  166 |     }
  167 | 
  168 |     fn chunk_data(&self, data: FixedWidthDataBlock) -> (MiniBlockCompressed, CompressiveEncoding) {
  169 |         assert!(data.bits_per_value.is_multiple_of(8));
  170 |         assert_eq!(data.bits_per_value, self.uncompressed_bit_width);
  171 |         let bits_per_value = data.bits_per_value;
  172 |         let compressed = match bits_per_value {
  173 |             8 => Self::bitpack_chunked::<u8>(data),
  174 |             16 => Self::bitpack_chunked::<u16>(data),
  175 |             32 => Self::bitpack_chunked::<u32>(data),
  176 |             64 => Self::bitpack_chunked::<u64>(data),
  177 |             _ => unreachable!(),
  178 |         };
  179 |         (
  180 |             compressed,
  181 |             ProtobufUtils21::inline_bitpacking(
  182 |                 bits_per_value,
  183 |                 // TODO: Could potentially compress the data here
  184 |                 None,
  185 |             ),
  186 |         )
  187 |     }
  188 | 
  189 |     fn unchunk<T: ArrowNativeType + BitPackingUninit + Pod>(
  190 |         data: LanceBuffer,
  191 |         num_values: u64,
  192 |     ) -> Result<DataBlock> {
  193 |         // This macro decompresses a chunk(1024 values) of bitpacked values.
  194 |         let uncompressed_bit_width = std::mem::size_of::<T>() * 8;
  195 |         let word_size = std::mem::size_of::<T>();
  196 | 
  197 |         if data.len() < word_size {
  198 |             return Err(Error::corrupt_file_named(
  199 |                 "inline_bitpacking",
  200 |                 format!(
  201 |                     "Inline bitpacking chunk is too small for {}-byte header: {} bytes",
  202 |                     word_size,
  203 |                     data.len()
  204 |                 ),
  205 |             ));
  206 |         }
  207 |         if !data.len().is_multiple_of(word_size) {
  208 |             return Err(Error::corrupt_file_named(
  209 |                 "inline_bitpacking",
  210 |                 format!(
  211 |                     "Inline bitpacking chunk size must be a multiple of {} bytes, got {} bytes",
  212 |                     word_size,
  213 |                     data.len()
  214 |                 ),
  215 |             ));
  216 |         }
  217 |         if num_values > ELEMS_PER_CHUNK {
  218 |             return Err(Error::corrupt_file_named(
  219 |                 "inline_bitpacking",
  220 |                 format!(
  221 |                     "Inline bitpacking chunk has {} values, expected at most {}",
  222 |                     num_values, ELEMS_PER_CHUNK
  223 |                 ),
  224 |             ));
  225 |         }
  226 | 
  227 |         let chunk_words = data.borrow_to_typed_view::<T>();
  228 |         let bit_width_value = chunk_words[0].as_usize();
  229 |         if bit_width_value > uncompressed_bit_width {
  230 |             return Err(Error::corrupt_file_named(
  231 |                 "inline_bitpacking",
  232 |                 format!(
  233 |                     "Inline bitpacking width {} exceeds {}-bit values",
  234 |                     bit_width_value, uncompressed_bit_width
  235 |                 ),
  236 |             ));
  237 |         }
  238 |         let chunk = &chunk_words[1..];
  239 |         // bit_width_value has already been verified to be <= uncompressed_bit_width
  240 |         // (8/16/32/64), so bit_width_value * ELEMS_PER_CHUNK (1024) can never
  241 |         // overflow usize on supported targets. Keep checked_mul as defense in depth.
  242 |         let expected_num_bits = bit_width_value
  243 |             .checked_mul(ELEMS_PER_CHUNK as usize)
  244 |             .ok_or_else(|| {
  245 |                 Error::corrupt_file_named(
  246 |                     "inline_bitpacking",
  247 |                     format!(
  248 |                         "Inline bitpacking width {} overflows chunk bit count",
  249 |                         bit_width_value
  250 |                     ),
  251 |                 )
  252 |             })?;
  253 |         let expected_num_bytes = expected_num_bits / 8;
  254 |         let actual_num_bytes = std::mem::size_of_val(chunk);
  255 |         if actual_num_bytes != expected_num_bytes {
  256 |             return Err(Error::corrupt_file_named(
  257 |                 "inline_bitpacking",
  258 |                 format!(
  259 |                     "Inline bitpacking payload has {} bytes, expected {} bytes for bit width {}",
  260 |                     actual_num_bytes, expected_num_bytes, bit_width_value
  261 |                 ),
  262 |             ));
  263 |         }
  264 | 
  265 |         let mut decompressed = Vec::with_capacity(ELEMS_PER_CHUNK as usize);
  266 |         unsafe {
  267 |             BitPackingUninit::unchecked_unpack_uninit(
  268 |                 bit_width_value,
  269 |                 chunk,
  270 |                 &mut decompressed.spare_capacity_mut()[..ELEMS_PER_CHUNK as usize],
  271 |             );
  272 |             // The bitpacking kernel initialized all 1024 decoded values.
  273 |             decompressed.set_len(ELEMS_PER_CHUNK as usize);
  274 |         }
  275 | 
  276 |         decompressed.truncate(num_values as usize);
  277 |         Ok(DataBlock::FixedWidth(FixedWidthDataBlock {
  278 |             data: LanceBuffer::reinterpret_vec(decompressed),
  279 |             bits_per_value: uncompressed_bit_width as u64,
  280 |             num_values,
  281 |             block_info: BlockInfo::new(),
  282 |         }))
  283 |     }
  284 | 
  285 |     /// An empty fixed-width block, used for the `num_values == 0` short-circuit in
  286 |     /// both decompressor entry points so empty blocks skip chunk validation entirely.
  287 |     fn empty_block(&self) -> DataBlock {
  288 |         DataBlock::FixedWidth(FixedWidthDataBlock {
  289 |             data: LanceBuffer::empty(),
  290 |             bits_per_value: self.uncompressed_bit_width,
  291 |             num_values: 0,
  292 |             block_info: BlockInfo::new(),
  293 |         })
  294 |     }
  295 | }
  296 | 
  297 | impl MiniBlockCompressor for InlineBitpacking {
  298 |     fn compress(
  299 |         &self,
  300 |         _context: MiniBlockCompressionContext,
  301 |         chunk: DataBlock,
  302 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  303 |         match chunk {
  304 |             DataBlock::FixedWidth(fixed_width) => Ok(self.chunk_data(fixed_width)),
  305 |             _ => Err(Error::invalid_input_source(
  306 |                 format!(
  307 |                     "Cannot compress a data block of type {} with BitpackMiniBlockEncoder",
  308 |                     chunk.name()
  309 |                 )
  310 |                 .into(),
  311 |             )),
  312 |         }
  313 |     }
  314 | }
  315 | 
  316 | impl BlockCompressor for InlineBitpacking {
  317 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
  318 |         let DataBlock::FixedWidth(fixed_width) = data else {
  319 |             return Err(Error::invalid_input(
  320 |                 "Inline bitpacking requires fixed-width data",
  321 |             ));
  322 |         };
  323 |         if fixed_width.bits_per_value != self.uncompressed_bit_width {
  324 |             return Err(Error::invalid_input(format!(
  325 |                 "Inline bitpacking expects {}-bit values, got {}",
  326 |                 self.uncompressed_bit_width, fixed_width.bits_per_value
  327 |             )));
  328 |         }
  329 |         let (chunked, _) = self.chunk_data(fixed_width);
  330 |         let payload =
  331 |             chunked.data.into_iter().next().ok_or_else(|| {
  332 |                 Error::internal("Inline bitpacking produced no payload".to_string())
  333 |             })?;
  334 |         Ok((
  335 |             Some(payload),
  336 |             ProtobufUtils21::inline_bitpacking(self.uncompressed_bit_width, None),
  337 |         ))
  338 |     }
  339 | }
  340 | 
  341 | impl MiniBlockDecompressor for InlineBitpacking {
  342 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  343 |         assert_eq!(data.len(), 1);
  344 |         let data = data.into_iter().next().unwrap();
  345 |         if num_values == 0 {
  346 |             // Empty mini-blocks have no inline bit-width header to decode.
  347 |             return Ok(self.empty_block());
  348 |         }
  349 |         match self.uncompressed_bit_width {
  350 |             8 => Self::unchunk::<u8>(data, num_values),
  351 |             16 => Self::unchunk::<u16>(data, num_values),
  352 |             32 => Self::unchunk::<u32>(data, num_values),
  353 |             64 => Self::unchunk::<u64>(data, num_values),
  354 |             _ => unimplemented!("Bitpacking word size must be 8, 16, 32, or 64"),
  355 |         }
  356 |     }
  357 | 
  358 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
  359 |         num_values
  360 |             .checked_mul(self.uncompressed_bit_width)
  361 |             .map(|bits| bits.div_ceil(8))
  362 |     }
  363 | }
  364 | 
  365 | impl BlockDecompressor for InlineBitpacking {
  366 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  367 |         let data = require_block_payload(data, "Inline bitpacking")?;
  368 |         if num_values == 0 {
  369 |             // Empty blocks carry no inline bit-width header to decode; avoid
  370 |             // spurious "too small for header" corrupt-file errors and mirror
  371 |             // the MiniBlockDecompressor path. See #7794.
  372 |             return Ok(self.empty_block());
  373 |         }
  374 |         match self.uncompressed_bit_width {
  375 |             8 => Self::unchunk::<u8>(data, num_values),
  376 |             16 => Self::unchunk::<u16>(data, num_values),
  377 |             32 => Self::unchunk::<u32>(data, num_values),
  378 |             64 => Self::unchunk::<u64>(data, num_values),
  379 |             _ => unimplemented!("Bitpacking word size must be 8, 16, 32, or 64"),
  380 |         }
  381 |     }
  382 | }
  383 | 
  384 | /// Bitpacks a FixedWidthDataBlock with a given bit width.
  385 | ///
  386 | /// Each chunk of 1024 values is packed with a constant bit width. For the tail we compare the
  387 | /// cost of padding and packing against storing the raw values: if padding yields a smaller
  388 | /// representation we pack; otherwise we append the raw tail.
  389 | fn bitpack_out_of_line<T: ArrowNativeType + BitPackingUninit>(
  390 |     data: FixedWidthDataBlock,
  391 |     compressed_bits_per_value: usize,
  392 | ) -> LanceBuffer {
  393 |     let data_buffer = data.data.borrow_to_typed_slice::<T>();
  394 |     let data_buffer = data_buffer.as_ref();
  395 | 
  396 |     let num_chunks = data_buffer.len().div_ceil(ELEMS_PER_CHUNK as usize);
  397 |     let last_chunk_is_runt = data_buffer.len() % ELEMS_PER_CHUNK as usize != 0;
  398 |     let words_per_chunk = (ELEMS_PER_CHUNK as usize * compressed_bits_per_value)
  399 |         .div_ceil(data.bits_per_value as usize);
  400 |     let mut output: Vec<T> = Vec::with_capacity(num_chunks * words_per_chunk);
  401 | 
  402 |     let num_whole_chunks = if last_chunk_is_runt {
  403 |         num_chunks - 1
  404 |     } else {
  405 |         num_chunks
  406 |     };
  407 | 
  408 |     // Simple case for complete chunks
  409 |     for i in 0..num_whole_chunks {
  410 |         let input_start = i * ELEMS_PER_CHUNK as usize;
  411 |         let input_end = input_start + ELEMS_PER_CHUNK as usize;
  412 |         let output_start = output.len();
  413 |         unsafe {
  414 |             BitPackingUninit::unchecked_pack_uninit(
  415 |                 compressed_bits_per_value,
  416 |                 &data_buffer[input_start..input_end],
  417 |                 &mut output.spare_capacity_mut()[..words_per_chunk],
  418 |             );
  419 |             // The bitpacking kernel initialized this complete packed chunk.
  420 |             output.set_len(output_start + words_per_chunk);
  421 |         }
  422 |     }
  423 | 
  424 |     if !last_chunk_is_runt {
  425 |         return LanceBuffer::reinterpret_vec(output);
  426 |     }
  427 | 
  428 |     let last_chunk_start = num_whole_chunks * ELEMS_PER_CHUNK as usize;
  429 |     let remaining_items = data_buffer.len() - last_chunk_start;
  430 | 
  431 |     let uncompressed_bits = data.bits_per_value as usize;
  432 |     let tail_bit_savings = uncompressed_bits.saturating_sub(compressed_bits_per_value);
  433 |     let padding_cost = compressed_bits_per_value * (ELEMS_PER_CHUNK as usize - remaining_items);
  434 |     let tail_pack_savings = tail_bit_savings.saturating_mul(remaining_items);
  435 |     debug_assert!(remaining_items > 0, "remaining_items must be non-zero");
  436 |     debug_assert!(tail_bit_savings > 0, "tail_bit_savings must be non-zero");
  437 | 
  438 |     if padding_cost < tail_pack_savings {
  439 |         // Padding buys us more than it costs: pad to 1024 values and pack them as a normal chunk.
  440 |         let mut last_chunk: Vec<T> = vec![T::from_usize(0).unwrap(); ELEMS_PER_CHUNK as usize];
  441 |         last_chunk[..remaining_items].copy_from_slice(&data_buffer[last_chunk_start..]);
  442 |         let start = output.len();
  443 |         unsafe {
  444 |             BitPackingUninit::unchecked_pack_uninit(
  445 |                 compressed_bits_per_value,
  446 |                 &last_chunk,
  447 |                 &mut output.spare_capacity_mut()[..words_per_chunk],
  448 |             );
  449 |             // The bitpacking kernel initialized the padded tail chunk.
  450 |             output.set_len(start + words_per_chunk);
  451 |         }
  452 |     } else {
  453 |         // Padding would waste space; append tail values as-is.
  454 |         output.extend_from_slice(&data_buffer[last_chunk_start..]);
  455 |     }
  456 | 
  457 |     LanceBuffer::reinterpret_vec(output)
  458 | }
  459 | 
  460 | /// Unpacks a FixedWidthDataBlock that has been bitpacked with a constant bit width.
  461 | ///
  462 | /// The compressed bit width is provided while the uncompressed width comes from `T`.
  463 | /// Depending on the encoding decision the final chunk may be fully packed (with padding)
  464 | /// or stored as raw tail values. We infer the layout from the buffer length.
  465 | fn unpack_out_of_line<T: ArrowNativeType + BitPackingUninit>(
  466 |     data: FixedWidthDataBlock,
  467 |     num_values: usize,
  468 |     compressed_bits_per_value: usize,
  469 | ) -> FixedWidthDataBlock {
  470 |     let words_per_chunk = (ELEMS_PER_CHUNK as usize * compressed_bits_per_value)
  471 |         .div_ceil(data.bits_per_value as usize);
  472 |     let compressed_words = data.data.borrow_to_typed_slice::<T>();
  473 | 
  474 |     let num_whole_chunks = num_values / ELEMS_PER_CHUNK as usize;
  475 |     let tail_values = num_values % ELEMS_PER_CHUNK as usize;
  476 |     let expected_full_words = num_whole_chunks * words_per_chunk;
  477 |     let expected_new_len = expected_full_words + tail_values;
  478 |     let tail_is_raw = tail_values > 0 && compressed_words.len() == expected_new_len;
  479 | 
  480 |     let extra_tail_capacity = ELEMS_PER_CHUNK as usize;
  481 |     let mut decompressed: Vec<T> =
  482 |         Vec::with_capacity(num_values.saturating_add(extra_tail_capacity));
  483 | 
  484 |     for chunk_idx in 0..num_whole_chunks {
  485 |         let input_start = chunk_idx * words_per_chunk;
  486 |         let input_end = input_start + words_per_chunk;
  487 |         let output_start = decompressed.len();
  488 |         unsafe {
  489 |             BitPackingUninit::unchecked_unpack_uninit(
  490 |                 compressed_bits_per_value,
  491 |                 &compressed_words[input_start..input_end],
  492 |                 &mut decompressed.spare_capacity_mut()[..ELEMS_PER_CHUNK as usize],
  493 |             );
  494 |             // The bitpacking kernel initialized this complete decoded chunk.
  495 |             decompressed.set_len(output_start + ELEMS_PER_CHUNK as usize);
  496 |         }
  497 |     }
  498 | 
  499 |     if tail_values > 0 {
  500 |         // The tail might be padded and bit packed or it might be appended raw.  We infer the
  501 |         // layout from the buffer length to decode appropriately.
  502 |         if tail_is_raw {
  503 |             let tail_start = expected_full_words;
  504 |             decompressed.extend_from_slice(&compressed_words[tail_start..tail_start + tail_values]);
  505 |         } else {
  506 |             let tail_start = expected_full_words;
  507 |             let output_start = decompressed.len();
  508 |             unsafe {
  509 |                 BitPackingUninit::unchecked_unpack_uninit(
  510 |                     compressed_bits_per_value,
  511 |                     &compressed_words[tail_start..tail_start + words_per_chunk],
  512 |                     &mut decompressed.spare_capacity_mut()[..ELEMS_PER_CHUNK as usize],
  513 |                 );
  514 |                 // The kernel initialized a full chunk; only the requested tail stays visible.
  515 |                 decompressed.set_len(output_start + ELEMS_PER_CHUNK as usize);
  516 |             }
  517 |             decompressed.truncate(output_start + tail_values);
  518 |         }
  519 |     }
  520 | 
  521 |     debug_assert_eq!(decompressed.len(), num_values);
  522 | 
  523 |     FixedWidthDataBlock {
  524 |         data: LanceBuffer::reinterpret_vec(decompressed),
  525 |         bits_per_value: data.bits_per_value,
  526 |         num_values: num_values as u64,
  527 |         block_info: BlockInfo::new(),
  528 |     }
  529 | }
  530 | 
  531 | /// A transparent compressor that bit packs data
  532 | ///
  533 | /// In order for the encoding to be transparent we must have a fixed bit width
  534 | /// across the entire array.  Chunking within the buffer is not supported.  This
  535 | /// means that we will be slightly less efficient than something like the mini-block
  536 | /// approach.
  537 | ///
  538 | /// This was an interesting experiment but it can't be used as a per-value compressor
  539 | /// at the moment.  The resulting data IS transparent but it's not quite so simple.  We
  540 | /// compress in blocks of 1024 and each block has a fixed size but also has some padding.
  541 | ///
  542 | /// We do use this as a block compressor currently.
  543 | ///
  544 | /// In other words, if we try the simple math to access the item at index `i` we will be
  545 | /// out of luck because `bits_per_value * i` is not the location.  What we need is something
  546 | /// like:
  547 | ///
  548 | /// ```ignore
  549 | /// let chunk_idx = i / 1024;
  550 | /// let chunk_offset = i % 1024;
  551 | /// bits_per_chunk * chunk_idx + bits_per_value * chunk_offset
  552 | /// ```
  553 | ///
  554 | /// However, this logic isn't expressible with the per-value traits we have today.  We can
  555 | /// enhance these traits should we need to support it at some point in the future.
  556 | #[derive(Debug)]
  557 | pub struct OutOfLineBitpacking {
  558 |     compressed_bit_width: u64,
  559 |     uncompressed_bit_width: u64,
  560 | }
  561 | 
  562 | impl OutOfLineBitpacking {
  563 |     pub fn new(compressed_bit_width: u64, uncompressed_bit_width: u64) -> Self {
  564 |         Self {
  565 |             compressed_bit_width,
  566 |             uncompressed_bit_width,
  567 |         }
  568 |     }
  569 | }
  570 | 
  571 | impl BlockCompressor for OutOfLineBitpacking {
  572 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
  573 |         let DataBlock::FixedWidth(fixed_width) = data else {
  574 |             return Err(Error::invalid_input(
  575 |                 "Out-of-line bitpacking requires fixed-width data",
  576 |             ));
  577 |         };
  578 |         if fixed_width.bits_per_value != self.uncompressed_bit_width {
  579 |             return Err(Error::invalid_input(format!(
  580 |                 "Out-of-line bitpacking expects {}-bit values, got {}",
  581 |                 self.uncompressed_bit_width, fixed_width.bits_per_value
  582 |             )));
  583 |         }
  584 |         let compressed = match fixed_width.bits_per_value {
  585 |             8 => bitpack_out_of_line::<u8>(fixed_width, self.compressed_bit_width as usize),
  586 |             16 => bitpack_out_of_line::<u16>(fixed_width, self.compressed_bit_width as usize),
  587 |             32 => bitpack_out_of_line::<u32>(fixed_width, self.compressed_bit_width as usize),
  588 |             64 => bitpack_out_of_line::<u64>(fixed_width, self.compressed_bit_width as usize),
  589 |             _ => {
  590 |                 return Err(Error::invalid_input(format!(
  591 |                     "Bitpacking word size must be 8, 16, 32, or 64, got {}",
  592 |                     fixed_width.bits_per_value
  593 |                 )));
  594 |             }
  595 |         };
  596 |         Ok((
  597 |             Some(compressed),
  598 |             ProtobufUtils21::out_of_line_bitpacking(
  599 |                 self.uncompressed_bit_width,
  600 |                 ProtobufUtils21::flat(self.compressed_bit_width, None),
  601 |             ),
  602 |         ))
  603 |     }
  604 | }
  605 | 
  606 | impl BlockDecompressor for OutOfLineBitpacking {
  607 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  608 |         let data = require_block_payload(data, "Out-of-line bitpacking")?;
  609 |         let word_size = match self.uncompressed_bit_width {
  610 |             8 => std::mem::size_of::<u8>(),
  611 |             16 => std::mem::size_of::<u16>(),
  612 |             32 => std::mem::size_of::<u32>(),
  613 |             64 => std::mem::size_of::<u64>(),
  614 |             _ => panic!("Bitpacking word size must be 8,16,32,64"),
  615 |         };
  616 |         debug_assert_eq!(data.len() % word_size, 0);
  617 |         let total_words = (data.len() / word_size) as u64;
  618 |         let block = FixedWidthDataBlock {
  619 |             data,
  620 |             bits_per_value: self.uncompressed_bit_width,
  621 |             num_values: total_words,
  622 |             block_info: BlockInfo::new(),
  623 |         };
  624 | 
  625 |         let unpacked = match self.uncompressed_bit_width {
  626 |             8 => unpack_out_of_line::<u8>(
  627 |                 block,
  628 |                 num_values as usize,
  629 |                 self.compressed_bit_width as usize,
  630 |             ),
  631 |             16 => unpack_out_of_line::<u16>(
  632 |                 block,
  633 |                 num_values as usize,
  634 |                 self.compressed_bit_width as usize,
  635 |             ),
  636 |             32 => unpack_out_of_line::<u32>(
  637 |                 block,
  638 |                 num_values as usize,
  639 |                 self.compressed_bit_width as usize,
  640 |             ),
  641 |             64 => unpack_out_of_line::<u64>(
  642 |                 block,
  643 |                 num_values as usize,
  644 |                 self.compressed_bit_width as usize,
  645 |             ),
  646 |             _ => unreachable!(),
  647 |         };
  648 |         Ok(DataBlock::FixedWidth(unpacked))
  649 |     }
  650 | }
  651 | 
  652 | #[cfg(test)]
  653 | mod test {
  654 |     use std::{collections::HashMap, sync::Arc};
  655 | 
  656 |     use arrow_array::{Array, Int8Array, Int64Array};
  657 |     use arrow_buffer::ArrowNativeType;
  658 |     use arrow_schema::DataType;
  659 |     use bytemuck::Pod;
  660 |     use lance_bitpacking::{BitPacking, BitPackingUninit};
  661 |     use rstest::rstest;
  662 | 
  663 |     use super::{ELEMS_PER_CHUNK, InlineBitpacking, bitpack_out_of_line, unpack_out_of_line};
  664 |     use crate::{
  665 |         buffer::LanceBuffer,
  666 |         compression::{BlockDecompressor, MiniBlockDecompressor},
  667 |         data::{BlockInfo, DataBlock, FixedWidthDataBlock},
  668 |         testing::{TestCases, check_round_trip_encoding_of_data},
  669 |     };
  670 | 
  671 |     #[rstest]
  672 |     #[case::u8(8)]
  673 |     #[case::u16(16)]
  674 |     #[case::u32(32)]
  675 |     #[case::u64(64)]
  676 |     fn test_inline_bitpacking_decompress_empty_miniblock(#[case] bit_width: u64) {
  677 |         let decompressor = InlineBitpacking::new(bit_width);
  678 |         let decompressed =
  679 |             MiniBlockDecompressor::decompress(&decompressor, vec![LanceBuffer::empty()], 0)
  680 |                 .unwrap();
  681 | 
  682 |         let DataBlock::FixedWidth(block) = decompressed else {
  683 |             panic!("Expected FixedWidth block");
  684 |         };
  685 |         assert_eq!(block.bits_per_value, bit_width);
  686 |         assert_eq!(block.num_values, 0);
  687 |         assert_eq!(block.data.len(), 0);
  688 |     }
  689 | 
  690 |     // Regression test for #7794: the block-level decompressor must short-circuit
  691 |     // on num_values == 0 the same way the mini-block decompressor does, instead
  692 |     // of reporting a spurious "too small for header" corrupt-file error.
  693 |     #[rstest]
  694 |     #[case::u8(8)]
  695 |     #[case::u16(16)]
  696 |     #[case::u32(32)]
  697 |     #[case::u64(64)]
  698 |     fn test_inline_bitpacking_decompress_empty_block(#[case] bit_width: u64) {
  699 |         let decompressor = InlineBitpacking::new(bit_width);
  700 |         let decompressed =
  701 |             BlockDecompressor::decompress(&decompressor, Some(LanceBuffer::empty()), 0).unwrap();
  702 | 
  703 |         let DataBlock::FixedWidth(block) = decompressed else {
  704 |             panic!("Expected FixedWidth block");
  705 |         };
  706 |         assert_eq!(block.bits_per_value, bit_width);
  707 |         assert_eq!(block.num_values, 0);
  708 |         assert_eq!(block.data.len(), 0);
  709 |     }
  710 | 
  711 |     fn roundtrip_unchunk<T>(values: &[T], bit_width: usize)
  712 |     where
  713 |         T: ArrowNativeType + BitPackingUninit + Pod,
  714 |     {
  715 |         assert!(values.len() <= ELEMS_PER_CHUNK as usize);
  716 |         let num_values = values.len() as u64;
  717 | 
  718 |         let mut padded = vec![T::from_usize(0).unwrap(); ELEMS_PER_CHUNK as usize];
  719 |         padded[..values.len()].copy_from_slice(values);
  720 | 
  721 |         let packed_words = ELEMS_PER_CHUNK as usize * bit_width / (std::mem::size_of::<T>() * 8);
  722 |         let mut chunk: Vec<T> = Vec::with_capacity(1 + packed_words);
  723 |         chunk.push(T::from_usize(bit_width).unwrap());
  724 |         let out_len = chunk.len();
  725 |         chunk.resize(out_len + packed_words, T::from_usize(0).unwrap());
  726 |         unsafe {
  727 |             BitPacking::unchecked_pack(bit_width, &padded, &mut chunk[out_len..]);
  728 |         }
  729 | 
  730 |         let data = LanceBuffer::reinterpret_vec(chunk);
  731 |         let decoded = InlineBitpacking::unchunk::<T>(data, num_values).unwrap();
  732 |         let DataBlock::FixedWidth(fixed) = decoded else {
  733 |             panic!("expected FixedWidth DataBlock");
  734 |         };
  735 |         let decoded_values = fixed.data.borrow_to_typed_view::<T>();
  736 |         assert_eq!(decoded_values.as_ref(), values);
  737 |     }
  738 | 
  739 |     fn assert_corrupt_unchunk<T>(data: LanceBuffer, num_values: u64, expected_message: &str)
  740 |     where
  741 |         T: ArrowNativeType + BitPackingUninit + Pod,
  742 |     {
  743 |         let err = InlineBitpacking::unchunk::<T>(data, num_values).unwrap_err();
  744 |         assert!(matches!(err, lance_core::Error::CorruptFile { .. }));
  745 |         let err = err.to_string();
  746 |         assert!(
  747 |             err.contains(expected_message),
  748 |             "expected error containing {expected_message:?}, got {err:?}"
  749 |         );
  750 |     }
  751 | 
  752 |     #[test]
  753 |     fn unchunk_u32_bw12_tail() {
  754 |         let values: Vec<u32> = (0..500).map(|i| ((i * 7) % (1 << 12)) as u32).collect();
  755 |         roundtrip_unchunk(&values, 12);
  756 |     }
  757 | 
  758 |     #[test]
  759 |     fn unchunk_u64_bw23_full() {
  760 |         let values: Vec<u64> = (0..1024).map(|i| ((i * 3) % (1 << 23)) as u64).collect();
  761 |         roundtrip_unchunk(&values, 23);
  762 |     }
  763 | 
  764 |     #[rstest]
  765 |     #[case::too_small_header(LanceBuffer::from(vec![1, 2, 3]), 1, "too small")]
  766 |     #[case::misaligned_chunk_size(LanceBuffer::from(vec![0, 0, 0, 0, 0]), 1, "multiple")]
  767 |     #[case::too_many_values(
  768 |         LanceBuffer::reinterpret_vec(vec![0_u32]),
  769 |         ELEMS_PER_CHUNK + 1,
  770 |         "expected at most"
  771 |     )]
  772 |     #[case::payload_size_mismatch(LanceBuffer::reinterpret_vec(vec![12_u32]), 1, "payload")]
  773 |     #[case::invalid_bit_width(LanceBuffer::reinterpret_vec(vec![33_u32]), 1, "exceeds")]
  774 |     fn unchunk_rejects(
  775 |         #[case] data: LanceBuffer,
  776 |         #[case] num_values: u64,
  777 |         #[case] expected_message: &str,
  778 |     ) {
  779 |         assert_corrupt_unchunk::<u32>(data, num_values, expected_message);
  780 |     }
  781 | 
  782 |     #[test_log::test(tokio::test)]
  783 |     async fn test_miniblock_bitpack() {
  784 |         let test_cases = TestCases::default().with_structural_encodings();
  785 | 
  786 |         let arrays = vec![
  787 |             Arc::new(Int8Array::from(vec![100; 1024])) as Arc<dyn Array>,
  788 |             Arc::new(Int8Array::from(vec![1; 1024])) as Arc<dyn Array>,
  789 |             Arc::new(Int8Array::from(vec![16; 1024])) as Arc<dyn Array>,
  790 |             Arc::new(Int8Array::from(vec![-1; 1024])) as Arc<dyn Array>,
  791 |             Arc::new(Int8Array::from(vec![5; 1])) as Arc<dyn Array>,
  792 |         ];
  793 |         check_round_trip_encoding_of_data(arrays, &test_cases, HashMap::new()).await;
  794 | 
  795 |         for data_type in [DataType::Int16, DataType::Int32, DataType::Int64] {
  796 |             let int64_arrays = vec![
  797 |                 Int64Array::from(vec![3; 1024]),
  798 |                 Int64Array::from(vec![8; 1024]),
  799 |                 Int64Array::from(vec![16; 1024]),
  800 |                 Int64Array::from(vec![100; 1024]),
  801 |                 Int64Array::from(vec![512; 1024]),
  802 |                 Int64Array::from(vec![1000; 1024]),
  803 |                 Int64Array::from(vec![2000; 1024]),
  804 |                 Int64Array::from(vec![-1; 10]),
  805 |             ];
  806 | 
  807 |             let mut arrays = vec![];
  808 |             for int64_array in int64_arrays {
  809 |                 arrays.push(arrow_cast::cast(&int64_array, &data_type).unwrap());
  810 |             }
  811 | 
  812 |             check_round_trip_encoding_of_data(arrays, &test_cases, HashMap::new()).await;
  813 |         }
  814 |     }
  815 | 
  816 |     #[test_log::test(tokio::test)]
  817 |     async fn test_bitpack_encoding_verification() {
  818 |         use arrow_array::Int32Array;
  819 | 
  820 |         // Test bitpacking encoding verification with varied small values that should trigger bitpacking
  821 |         let test_cases = TestCases::default()
  822 |             .with_expected_encoding("inline_bitpacking")
  823 |             .with_structural_encodings();
  824 | 
  825 |         // Generate data with varied small values to avoid RLE
  826 |         // Mix different values but keep them small to trigger bitpacking
  827 |         let mut values = Vec::new();
  828 |         for i in 0..2048 {
  829 |             values.push(i % 16); // Values 0-15, varied enough to avoid RLE
  830 |         }
  831 | 
  832 |         let arrays = vec![Arc::new(Int32Array::from(values)) as Arc<dyn Array>];
  833 | 
  834 |         // Explicitly disable BSS to ensure bitpacking is tested
  835 |         let mut metadata = HashMap::new();
  836 |         metadata.insert("lance-encoding:bss".to_string(), "off".to_string());
  837 | 
  838 |         check_round_trip_encoding_of_data(arrays, &test_cases, metadata.clone()).await;
  839 |     }
  840 | 
  841 |     #[test_log::test(tokio::test)]
  842 |     async fn test_miniblock_bitpack_zero_chunk_selection() {
  843 |         use arrow_array::Int32Array;
  844 | 
  845 |         let test_cases = TestCases::default()
  846 |             .with_expected_encoding("inline_bitpacking")
  847 |             .with_structural_encodings();
  848 | 
  849 |         // Build 2048 values: first 1024 all zeros (bit_width=0),
  850 |         // next 1024 small varied values to avoid RLE and trigger bitpacking.
  851 |         let mut vals = vec![0i32; 1024];
  852 |         for i in 0..1024 {
  853 |             vals.push(i % 16);
  854 |         }
  855 | 
  856 |         let arrays = vec![Arc::new(Int32Array::from(vals)) as Arc<dyn Array>];
  857 | 
  858 |         // Disable BSS and RLE to prefer bitpacking in selection
  859 |         let mut metadata = HashMap::new();
  860 |         metadata.insert("lance-encoding:bss".to_string(), "off".to_string());
  861 |         metadata.insert("lance-encoding:rle-threshold".to_string(), "0".to_string());
  862 | 
  863 |         check_round_trip_encoding_of_data(arrays, &test_cases, metadata).await;
  864 |     }
  865 | 
  866 |     #[test]
  867 |     fn test_out_of_line_bitpack_raw_tail_roundtrip() {
  868 |         let bit_width = 8usize;
  869 |         let word_bits = std::mem::size_of::<u32>() as u64 * 8;
  870 |         let values: Vec<u32> = (0..1025).map(|i| (i % 200) as u32).collect();
  871 |         let input = FixedWidthDataBlock {
  872 |             data: LanceBuffer::reinterpret_vec(values.clone()),
  873 |             bits_per_value: word_bits,
  874 |             num_values: values.len() as u64,
  875 |             block_info: BlockInfo::new(),
  876 |         };
  877 | 
  878 |         let compressed = bitpack_out_of_line::<u32>(input, bit_width);
  879 |         let compressed_words = compressed.borrow_to_typed_slice::<u32>().to_vec();
  880 |         let words_per_chunk = (ELEMS_PER_CHUNK as usize * bit_width).div_ceil(word_bits as usize);
  881 |         assert_eq!(
  882 |             compressed_words.len(),
  883 |             words_per_chunk + (values.len() - ELEMS_PER_CHUNK as usize),
  884 |         );
  885 | 
  886 |         let compressed_block = FixedWidthDataBlock {
  887 |             data: LanceBuffer::reinterpret_vec(compressed_words.clone()),
  888 |             bits_per_value: word_bits,
  889 |             num_values: compressed_words.len() as u64,
  890 |             block_info: BlockInfo::new(),
  891 |         };
  892 | 
  893 |         let decoded = unpack_out_of_line::<u32>(compressed_block, values.len(), bit_width);
  894 |         let decoded_values = decoded.data.borrow_to_typed_slice::<u32>();
  895 |         assert_eq!(decoded_values.as_ref(), values.as_slice());
  896 |     }
  897 | }
``````
