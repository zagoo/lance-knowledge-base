> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/value.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a7ffbe5bbe7f7b3c1b6b6dd684f60f4c11c310f8e34a8a9990809867d5257a4c`. Reviewed physical lines: 1-1396.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Raw fixed-width and nested fixed-size-list encoding/decompression for block, mini-block and per-value interfaces. Each interface has different buffer/count/validity conventions; this file is synchronous and does not perform IO or select exact file versions. (rust/lance-encoding/src/encodings/physical/value.rs:1-1396)

## Complete range analysis

### Lines 1-29

SPDX/imports bind Arrow bit utilities/builders, Lance buffers and compact data blocks, four compression/decompression traits and protobuf helpers. Public ValueEncoder is an empty Debug+Default struct. Its raw-storage description does not imply every path is zero-copy: nullable per-value FSL rearranges bytes. (rust/lance-encoding/src/encodings/physical/value.rs:1-29)

### Lines 30-57

Private find_log_vals_per_chunk(bytes_per_word,values_per_word)->Result<(u64,u64)> starts estimated size=2*bytes_per_word. For values_per_word1 it starts log1/count2; for8 it starts log3/count8; other inputs unreachable. Reject estimated size>=8186 with InvalidInput naming 2*values_per_word values and byte budget. Double while doubled size<8186 and doubled count<=cached MAX_MINIBLOCK_VALUES. Return largest reached power-of-two count; initial count can already exceed a configured maximum1 or small boolean limit. The8-value case starts a16-value size estimate but8-value count, deliberately record actual arithmetic rather than equating estimate with returned byte size. Docs say smaller than4KiB; actual bound is8186 and powers-of-two selection. Arithmetic unchecked. (rust/lance-encoding/src/encodings/logical/primitive/miniblock.rs:19-34) (rust/lance-encoding/src/encodings/physical/value.rs:30-57)

### Lines 58-79

chunk_data chooses (bits/8,1) when width divisible by8, else (bits,8), so full chunks do not split bytes for Boolean/FSL<Boolean>. Calculate ceil(num_values/vals_per_chunk), actual byte count bytes_per_word*(vals_per_chunk/values_per_word), narrow to u32 with unwrap and debug-assert positive. Zero bit width passes divisibility and reaches zero-byte debug assertion; dimensions/count/byte length are not validated. Original data buffer is moved without copying. (rust/lance-encoding/src/encodings/physical/value.rs:58-79)

### Lines 80-116

Emit full chunks with positive log and fixed byte size until fewer values remain. Partial last chunk uses log0 and ALL remaining buffer bytes (buffer.len minus accounted bytes), narrowed u32. If exact full chunks, final log remains positive; empty count yields no chunks but still one data buffer after earlier checks. No check that buffer length matches logical count: full-chunk descriptors may exceed bytes, or trailing bytes may remain unaccounted on exact multiples. Count/offset sums and subtraction unchecked; casts can truncate. Debug chunk-count assertion only. (rust/lance-encoding/src/encodings/physical/value.rs:80-116)

### Lines 117-140

Private Debug MiniblockFslLayer stores optional owned validity buffer and u64 dimension. Docs explain keeping nested validity outside rep/def, multiple parallel buffers, no row split between chunks and write-time validity copying/bit slicing. These are design contracts, not a runtime size proof. (rust/lance-encoding/src/encodings/physical/value.rs:117-140)

### Lines 141-150

make_fsl_encoding starts Flat(inner bits,None), wraps layers in reverse using dimension and validity presence, yielding original outer-to-inner FSL nesting. It records each actual layer dimension; descriptor construction performs no local dimension validation. (rust/lance-encoding/src/encodings/physical/value.rs:141-150)

### Lines 151-183

extract_fsl_chunk multiplies row offset and count by each layer dimension. At every nullable child layer, bit-slice validity to this chunk, append visible bytes to that layer destination and record its u32-cast length. Finally record ceil(inner_bits*expanded_count/8) as u32 via unwrap. Returns sizes ordered outer-to-inner validity then leaf data. It does not copy value data, mask/validate custom buffers itself or bound arithmetic; zero leaf bytes debug-assert. Sliced validity padding is supplied by Arrow buffer helper. (rust/lance-encoding/src/encodings/physical/value.rs:151-183)

### Lines 184-210

chunk_fsl estimates validity bytes per outer row as sum ceil(cumulative_dimension/8) for present buffers; computes leaf bits times product of dimensions. Byte-aligned rows use one row/word, otherwise eight; add estimated validity bytes scaled by word rows, then reuse chunk selector. This is a conservative per-row validity estimate, not exact chunk-wide bitmap size. No checked dimension product, positivity or budget override via context. (rust/lance-encoding/src/encodings/physical/value.rs:184-210)

### Lines 211-229

Preallocate chunk vector for ceil(rows/rows_per_chunk). Count validity buffers and reserve each Vec only ceil(cumulative_dim/8)*num_chunks bytes, although a separate debug bound multiplies by rows_per_chunk as well. Thus comment about allocating sufficient padding does not establish exact preallocation: capacities can grow later. Input validity length is compared only in debug assertion against that larger estimate. (rust/lance-encoding/src/encodings/physical/value.rs:211-229)

### Lines 230-278

Walk complete outer-row chunks, append each layer validity slice and size vector, emit positive log; emit residual rows with log0 only if nonzero. Build nested descriptor; output data vector is all concatenated validity buffers in outer-to-inner order followed by the moved original leaf buffer. num_values is outer row count. A complete final chunk keeps its positive log. Buffers are parallel across chunks, not row-major. No payload/size-total validation or IO. (rust/lance-encoding/src/encodings/physical/value.rs:230-278)

### Lines 279-310

miniblock_fsl obtains outer count through DataBlock::num_values and unwraps FSL variant. Start one layer for outer dimension, then peel at most one Nullable wrapper per child, saving its validity into current layer. Nested FSL pushes layer and starts its own dimension; terminal FixedWidth pushes final layer and calls chunk_fsl. AllNull, double Nullable or other terminal variants panic unreachable. Top-level nullable handling belongs to caller. FSL count divides child count by dimension without local zero/remainder validation. (rust/lance-encoding/src/data.rs:443-456; rust/lance-encoding/src/data.rs:1302-1314) (rust/lance-encoding/src/encodings/physical/value.rs:279-310)

### Lines 311-322

Private PerValueFslValidityIter owns LanceBuffer, bits_per_row and running bit offset. Docs introduce per-value row-major flattening with validity embedded alongside values; no Iterator trait implementation despite name. (rust/lance-encoding/src/encodings/physical/value.rs:311-322)

### Lines 323-349

fsl_to_encoding borrows nested FSL, peels one Nullable child and sets has_validity. AllNull terminal forces validity=true and Constant(None); FixedWidth becomes Flat(width,None); nested FSL recurses; unsupported variant panics naming type. Final wrapper stores current actual dimension. All-null descriptor signals no value bytes and reserved validity, but no count/type/dimension validation occurs. (rust/lance-encoding/src/encodings/physical/value.rs:323-349)

### Lines 350-380

simple_per_value_fsl builds descriptor and outer count, moves down children and returns leaf storage without copying in a fresh FixedWidthDataBlock/BlockInfo. Critical source behavior: each loop multiplies cum_dim by original outer fsl.dimension, including after entering a different nested FSL; inner.dimension is never used in this loop. For nonnullable outer2/inner3/Int32, descriptor dimensions imply192bits per outer row while output bits_per_value is128. This is a deterministic arithmetic deduction, not an executed Lance failure. Nullable arm also advances another loop but normal recursive is_nullable dispatch routes any nullable descendant elsewhere. Original row count and leaf bytes are preserved despite possible width mismatch. (rust/lance-encoding/src/data.rs:1284-1295) (rust/lance-encoding/src/encodings/physical/value.rs:350-380)

### Lines 381-414

nullable_per_value_fsl instead tracks current FSL correctly, multiplying each dimension. For each Nullable child reserve ceil(cumulative_dim/8) bytes per outer row and collect bit iterator. Nested lists continue with their own dimension. FixedWidth terminal computes data bytes per row as ceil(inner_bits/8)*cum_dim, not ceil(inner_bits*cum_dim/8); therefore it assumes byte-expanded inner items on this route. Raw bitpacked Boolean payload can violate that size expectation unless normalized by callers; complete normalization trace pending. All integer casts/products unchecked. (rust/lance-encoding/src/encodings/physical/value.rs:381-414)

### Lines 415-439

AllNull terminal synthesizes all-zero validity sized ceil(cum_dim/8)*num_rows, sets leaf byte width0 and empty data buffer. This deliberately avoids zero per-row full-zip width when positive dimensions and rows have no control bytes. If a Nullable wrapper was already collected at this same terminal layer, another validity iterator is appended while descriptor has only one has_validity flag; unusual directly constructed nested wrappers are not validated here. Unsupported children unreachable. (rust/lance-encoding/src/encodings/physical/value.rs:415-439)

### Lines 440-475

Allocate row-major output capacity bytes_per_row*num_values. For each row append each validity bit slice (byte-padded per row), advance its bit offset, then append exact leaf data slice for that row. Bounds problems panic through slicing; no Result from helper. Return Fixed per-value block with bits_per_value=bytes_per_row*8, original row count and fresh BlockInfo plus nested descriptor. per_value_fsl chooses simple only when child.is_nullable is false; that predicate recurses through nested FSL and treats AllNull as nullable. (rust/lance-encoding/src/data.rs:1284-1295) (rust/lance-encoding/src/encodings/physical/value.rs:440-475)

### Lines 476-513

BlockCompressor accepts only FixedWidth, else InvalidInput naming block. Returns Some(original data) even empty and Flat(bits,None); no size/count validation. MiniBlockCompressor ignores context, handles FixedWidth through chunk_data and FSL through miniblock_fsl, otherwise InvalidInputSource naming block. Different interfaces return errors or panics for unsupported inputs; no common validation boundary. (rust/lance-encoding/src/encodings/physical/value.rs:476-513)

### Lines 514-545

Private Debug ValueFslDesc holds dimension/has_validity. Public Debug ValueDecompressor privately stores leaf bits_per_item, full row bits_per_value including per-row validity, product items_per_value and ordered layers. Public from_flat is infallible, copies only flat.bits_per_value to both widths, sets product1 and no layers; it does not interpret optional flat.data compression or validate width. (rust/lance-encoding/src/encodings/physical/value.rs:514-545)

### Lines 546-568

from_fsl iteratively pushes each descriptor layer, multiplies cumulative dimension and adds ceil(cum_dim/8) validity bytes for each has_validity. Missing values or missing compression return distinct InvalidInput messages. No zero-dimension/overflow/nesting bound or compressed-child validation before traversal. (rust/lance-encoding/src/encodings/physical/value.rs:546-568)

### Lines 569-601

Nested FSL continues. Flat terminal records leaf bits, row width validity_bytes*8+leaf_bits*cum_dim, product and layers. ANY Constant terminal sets leaf bits0 and returns validity-only width: the optional constant scalar is not checked, so Some(non-null scalar) is also treated as the all-null signal on unzip path. Unsupported inner kind returns InvalidInput with Debug encoding. Flat optional buffer compression is ignored. Dimension/width products unchecked. (rust/lance-encoding/src/encodings/physical/value.rs:569-601)

### Lines 602-620

buffer_to_block simply pairs caller bytes/count with configured leaf width and fresh BlockInfo. BlockDecompressor requires Some payload via Flat block helper (None is InvalidInput), then returns plain FixedWidth regardless of stored FSL layers. Its assert on count is tautological because it just assigned that count; no data-length or structure validation. Default strategy can construct from_fsl for block decoding, so do not assume that trait restores lists. (rust/lance-encoding/src/compression.rs:1171-1189) (rust/lance-encoding/src/encodings/physical/value.rs:602-620)

### Lines 621-649

MiniBlockDecompressor multiplies outer count by items_per_value, takes last input buffer as leaf with unwrap, then walks descriptor layers in reverse. Pop preceding validity for each flagged layer and wrap Nullable, then FSL. Missing buffers panic; extra leading buffers are silently discarded. It always makes a FixedWidth leaf even for bits_per_item0, unlike unzip all-null handling. Final lists.num_values assertion checks derived count but not buffer byte/bit lengths; invalid dimension can divide by zero. No copy of payload bytes is required. (rust/lance-encoding/src/encodings/physical/value.rs:621-649)

### Lines 650-665

Mini-block decoded_size_bytes returns None whenever any layer has validity, otherwise checked num_values*bits_per_value rounded up to bytes; multiplication overflow gives None. It does not validate descriptor width or prove actual incoming length. Private FslDecompressorValidityBuilder stores BooleanBufferBuilder and per-row bit/byte widths. (rust/lance-encoding/src/encodings/physical/value.rs:650-665)

### Lines 666-694

has_validity scans layers. simple_decompress recomputes actual product of descriptor dimensions, debug-checks leaf width against supplied block width/product, moves bytes into leaf with count=num_rows*product, and restores FSL layers in reverse. No validity, copy or byte-length check. Supplied data.num_values is ignored; separate num_rows is authoritative. Unlike simple encoder, decoder multiplies each actual layer dimension, exposing unequal-dimension mismatch under debug assertion. (rust/lance-encoding/src/encodings/physical/value.rs:666-694)

### Lines 695-723

unzip_decompress asserts configured leaf bits are byte-aligned; nearby comment about no full-zip support is confusing because this is precisely per-value full-zip restoration. Allocate each layer bitmap builder for cumulative_dim*num_rows and sum separately rounded per-row validity bytes plus leaf item bytes. Assert input byte length exactly equals computed total. Products/casts unchecked; malformed input errors are panics, not Result. (rust/lance-encoding/src/encodings/physical/value.rs:695-723)

### Lines 724-759

Walk row-major buffer until total bytes consumed: append meaningful bits from each padded validity slice with append_packed_range, advance by its byte width, then copy leaf row bytes to one contiguous Vec. Configured leaf bits0 produces AllNull(num_items), otherwise FixedWidth with reconstructed bytes and fresh BlockInfo. Zero-width Constant without validity would use simple_decompress instead, so all-null reconstruction depends on has_validity as emitted by encoder. No control-word or file parsing here. (rust/lance-encoding/src/encodings/physical/value.rs:724-759)

### Lines 760-784

Finish validity builders, reverse buffers and layers, wrap Nullable before each FSL, and assert restored outer count. Bitmap padding between rows is removed through bit-range appending. Local payload is rebuilt, not shared, in nullable path. Missing internal builder unexpectedly panics; no rollback/error Result in helper. (rust/lance-encoding/src/encodings/physical/value.rs:760-784)

### Lines 785-807

FixedPerValueDecompressor chooses unzip if any validity, otherwise simple; both are wrapped Ok even though their assertions can panic. bits_per_value exposes precomputed row width. decoded_size_bytes mirrors mini-block count-only estimate: None with validity or multiplication overflow, else rounded bytes. It estimates visible aggregate payload, not allocation capacity of other codecs. (rust/lance-encoding/src/encodings/physical/value.rs:785-807)

### Lines 808-824

PerValueCompressor directly returns owned FixedWidth and Flat metadata, preserving block contents/statistics; FSL dispatches helper; all other block types unimplemented panic naming type. No Boolean expansion or width correction is performed here. Returns Ok only after helper completes. (rust/lance-encoding/src/encodings/physical/value.rs:808-824)

### Lines 825-859

cfg(test) private mod tests imports Arrow types/generators and shared harness. Comment calls it public and says PRIMITIVE_TYPES shared, but neither module nor constant has pub. miniblock_context returns(0,true,true). No local feature guards. (rust/lance-encoding/src/encodings/physical/value.rs:825-859)

### Lines 860-886

Private PRIMITIVE_TYPES lists21 types: Null,FixedSizeBinary2,Date32/64,Int/UInt8/16/32/64,Float16/32/64,Decimal128/256(10,10),TimestampNanosecond,None,Time32Second,Time64Nanosecond,DurationSecond. Interval is commented out with schema-parser rationale. Boolean is absent from this list. No executed support matrix is established. (rust/lance-encoding/src/encodings/physical/value.rs:860-886)

### Lines 887-920

Async simple-value test uses six Int32 items including one null, explicit ranges0..3,0..2,1..3 and indices[0,1,2],[1],[2], across structural harness modes. Simple-range test uses5000 alternating valid/null integers and default structural cases. Assertions are delegated to harness, not local codec bytes. (rust/lance-encoding/src/encodings/physical/value.rs:887-920)

### Lines 921-946

Primitive test loops21 datatypes with enumeration seed,1025rows,batch1025,page4096, expected flat and metadata compression=none. Generates one array each and delegates round trip. This plain loop is not a parameterized test; no runtime results inferred. (rust/lance-encoding/src/encodings/physical/value.rs:921-946)

### Lines 947-965

Large primitive rstest covers Array/U16/U32/Sparse x page4096/1MiB x slicingfalse/true (16 cases before harness expansion). Datatype is non-null FSL<Int32,128> and shared random-case helper. (rust/lance-encoding/src/encodings/physical/value.rs:947-965)

### Lines 966-989

Decimal128 dictionary test selects U16/U32/Sparse (3 cases), expects dictionary, cycles100 values1000times into100000 Some i128 values. Variable repeated_strings actually contains decimals. No explicit precision/scale assignment or local byte check. (rust/lance-encoding/src/encodings/physical/value.rs:966-989)

### Lines 990-1025

Mini-block stress matrix2 validity modes x4 batch sizes10/100/1500/15000 x4 page sizes1000/2000/3000/60000 x3 structural encodings=96 cases before harness expansion. Fixture100 arrays each100 i32, alternating nulls or fully valid; shared harness checks behavior. No timed budget result. (rust/lance-encoding/src/encodings/physical/value.rs:990-1025)

### Lines 1026-1057

create_simple_fsl creates three outer rows of2 inner lists, each dimension2, Int32 child12 with explicit child/list validity. Parent outer validity absent. Example has mixed inner null lists/items and includes underlying values under null parents. Both dimensions equal, so it cannot reveal unequal-dimension arithmetic in simple_per_value_fsl; it also uses nullable path. (rust/lance-encoding/src/encodings/physical/value.rs:1026-1057)

### Lines 1058-1091

Direct mini-block FSL test asserts outer count3,three buffers,one chunk,sizes[1,2,48],log0. Requires FSL descriptor, constructs decoder, decodes all returned buffers as one chunk, converts to Arrow and asserts full array equality. This is a strong local nullable fixture, read not run. (rust/lance-encoding/src/encodings/physical/value.rs:1058-1091)

### Lines 1092-1116

wide_fixed_size_binary creates four5000-byte0xAB values. wide_fixed_size_list_bool creates two outer rows with4095 Boolean values each, all false and no outer nulls. Comment calls16 values smallest unit; actual selector starts eight values but rejects based on two-word16-value estimated bytes. (rust/lance-encoding/src/encodings/physical/value.rs:1092-1116)

### Lines 1117-1144

Two named wide-value rstest cases require InvalidInput plus too wide substring and expected minimum-values text2 or16. No successful boundary8185/8186 or configured-small maximum test. Tests assert source diagnostic behavior, not overall selection fallback. (rust/lance-encoding/src/encodings/physical/value.rs:1117-1144)

### Lines 1145-1185

Direct nullable per-value FSL test asserts row width144bits,count3 and54bytes (two validity bytes+16 leaf bytes per row), requires FSL descriptor, checks decoded_size_bytes=None, decodes and compares complete Arrow array. It exercises nullable helper, not the simple unequal-dimension case. (rust/lance-encoding/src/encodings/physical/value.rs:1145-1185)

### Lines 1186-1216

Two structural harness tests cover all-null Int32 children under outer list validity, and a documented regression of two FSL<Float32,4> rows with all eight children null but no outer nulls. The latter explains why synthesized validity prevents width0/control-word-free full-zip rows. Neither forces a particular layout in its local configuration beyond structural modes. (rust/lance-encoding/src/encodings/physical/value.rs:1186-1216)

### Lines 1217-1235

regress_list_fsl uses list offsets[0,393,755,1156,1536] over1536 FSL<UInt8,16> rows of zeros; batch_size1 and structural modes target rows spanning several mini-block chunks, including all-preamble chunks. Comment typo all-premable preserved as intent, not another format term. (rust/lance-encoding/src/encodings/physical/value.rs:1217-1235)

### Lines 1236-1250

create_random_fsl builds nullable Int32 leaf, nullable inner FSL4,nullable middle FSL4,outer FSL2, with8192 outer rows. Comment says256Ki rows/~1MiB: actual leaf count is8192*2*4*4=262144; outer rows are8192. Random-null probability0.1 at leaf/two inner levels; no explicit seed here. (rust/lance-encoding/src/encodings/physical/value.rs:1236-1250)

### Lines 1251-1281

Mini-block stress encodes whole random FSL page, extracts FSL descriptor, passes concatenated output buffers directly to one decoder call with whole row count, then asserts Arrow equality. It does not independently slice chunk buffers from chunk metadata, so it does not test arbitrary per-chunk validity padding or partial-read reconstruction. (rust/lance-encoding/src/encodings/physical/value.rs:1251-1281)

### Lines 1282-1316

Per-value stress uses same random nullable FSL generator, requires Fixed output/FSL descriptor, decodes with explicit row count and asserts complete Arrow equality. Nullable descendant dispatch means its unequal dimensions2/4/4 do not exercise simple encoder loop. (rust/lance-encoding/src/encodings/physical/value.rs:1282-1316)

### Lines 1317-1355

Nullable-item matrix covers4 encoding modes. Seed0 generator creates FSL<UInt32,128> child nulls0.5 and outer null request0.2,1026rows, then supplies source slices1..513 and513..1026 (1025 rows, omitting original row0). Page4096,batch257,range510..515 and indices[0,511,512,1024] stress offsets across slices/pages. Harness owns further assertions. (rust/lance-encoding/src/encodings/physical/value.rs:1317-1355)

### Lines 1356-1386

Encoding-verification test expects flat across structural modes. Explicit none+BSS off on unique0..1000 ints; automatic fallback+BSS off on100 values i*73+19. Comments about avoiding RLE/bitpacking are selection intentions backed by expected-name assertion through harness, not standalone algorithm measurements. (rust/lance-encoding/src/encodings/physical/value.rs:1356-1386)

### Lines 1387-1396

Mixed-page validity supplies first array[1,2] all valid, second[3,null,5], page_size1 and default harness encodings (no explicit structural override here). All17 test functions and helpers were read, not executed. No local test directly covers nonnullable unequal nested dimensions, zero FSL dimension, malformed descriptor constantSome, or raw byte length/count mismatches. (rust/lance-encoding/src/encodings/physical/value.rs:1387-1396)

## Interaction and interpretation limits

Complete physical source was read during ANALYZE74 in bounded untruncated chunks. No source build/test/lint/benchmark/generator or dependency installation ran. Exact source and declarations are retained. Contextual dependency reads remain partial and do not establish whole-file coverage or measured performance. Source-derived risks are not reproduced runtime failures.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use arrow_buffer::{BooleanBufferBuilder, bit_util};
    5 | 
    6 | use crate::buffer::LanceBuffer;
    7 | use crate::compression::{
    8 |     BlockCompressor, BlockDecompressor, FixedPerValueDecompressor, MiniBlockDecompressor,
    9 |     require_block_payload,
   10 | };
   11 | use crate::data::{
   12 |     AllNullDataBlock, BlockInfo, DataBlock, FixedSizeListBlock, FixedWidthDataBlock,
   13 |     NullableDataBlock,
   14 | };
   15 | use crate::encodings::logical::primitive::fullzip::{PerValueCompressor, PerValueDataBlock};
   16 | use crate::encodings::logical::primitive::miniblock::{
   17 |     MAX_MINIBLOCK_BYTES, MAX_MINIBLOCK_VALUES, MiniBlockChunk, MiniBlockCompressed,
   18 |     MiniBlockCompressionContext, MiniBlockCompressor,
   19 | };
   20 | use crate::format::ProtobufUtils21;
   21 | use crate::format::pb21::compressive_encoding::Compression;
   22 | use crate::format::pb21::{self, CompressiveEncoding};
   23 | 
   24 | use lance_core::{Error, Result};
   25 | 
   26 | /// A compression strategy that writes fixed-width data as-is (no compression)
   27 | #[derive(Debug, Default)]
   28 | pub struct ValueEncoder {}
   29 | 
   30 | impl ValueEncoder {
   31 |     /// Use the largest chunk we can smaller than 4KiB
   32 |     fn find_log_vals_per_chunk(bytes_per_word: u64, values_per_word: u64) -> Result<(u64, u64)> {
   33 |         let mut size_bytes = 2 * bytes_per_word;
   34 |         let (mut log_num_vals, mut num_vals) = match values_per_word {
   35 |             1 => (1, 2),
   36 |             8 => (3, 8),
   37 |             _ => unreachable!(),
   38 |         };
   39 | 
   40 |         if size_bytes >= MAX_MINIBLOCK_BYTES {
   41 |             let num_values = 2 * values_per_word;
   42 |             return Err(Error::invalid_input(format!(
   43 |                 "Value is too wide for miniblock encoding: {} values require {} bytes but a \
   44 |                  miniblock chunk is limited to {} bytes.",
   45 |                 num_values, size_bytes, MAX_MINIBLOCK_BYTES
   46 |             )));
   47 |         }
   48 | 
   49 |         while 2 * size_bytes < MAX_MINIBLOCK_BYTES && 2 * num_vals <= *MAX_MINIBLOCK_VALUES {
   50 |             log_num_vals += 1;
   51 |             size_bytes *= 2;
   52 |             num_vals *= 2;
   53 |         }
   54 | 
   55 |         Ok((log_num_vals, num_vals))
   56 |     }
   57 | 
   58 |     fn chunk_data(data: FixedWidthDataBlock) -> Result<MiniBlockCompressed> {
   59 |         // Usually there are X bytes per value.  However, when working with boolean
   60 |         // or FSL<boolean> we might have some number of bits per value that isn't
   61 |         // divisible by 8.  In this case, to avoid chunking in the middle of a byte
   62 |         // we calculate how many 8-value words we can fit in a chunk.
   63 |         let (bytes_per_word, values_per_word) = if data.bits_per_value.is_multiple_of(8) {
   64 |             (data.bits_per_value / 8, 1)
   65 |         } else {
   66 |             (data.bits_per_value, 8)
   67 |         };
   68 | 
   69 |         // Aim for 4KiB chunks
   70 |         let (log_vals_per_chunk, vals_per_chunk) =
   71 |             Self::find_log_vals_per_chunk(bytes_per_word, values_per_word)?;
   72 |         let num_chunks = bit_util::ceil(data.num_values as usize, vals_per_chunk as usize);
   73 |         debug_assert_eq!(vals_per_chunk % values_per_word, 0);
   74 |         let bytes_per_chunk = bytes_per_word * (vals_per_chunk / values_per_word);
   75 |         let bytes_per_chunk = u32::try_from(bytes_per_chunk).unwrap();
   76 |         debug_assert!(bytes_per_chunk > 0);
   77 | 
   78 |         let data_buffer = data.data;
   79 | 
   80 |         let mut row_offset = 0;
   81 |         let mut chunks = Vec::with_capacity(num_chunks);
   82 | 
   83 |         let mut bytes_counter = 0;
   84 |         loop {
   85 |             if row_offset + vals_per_chunk <= data.num_values {
   86 |                 // We can make a full chunk
   87 |                 chunks.push(MiniBlockChunk {
   88 |                     log_num_values: log_vals_per_chunk as u8,
   89 |                     buffer_sizes: vec![bytes_per_chunk],
   90 |                 });
   91 |                 row_offset += vals_per_chunk;
   92 |                 bytes_counter += bytes_per_chunk as u64;
   93 |             } else if row_offset < data.num_values {
   94 |                 // Final chunk, special values
   95 |                 let num_bytes = data_buffer.len() as u64 - bytes_counter;
   96 |                 let num_bytes = u32::try_from(num_bytes).unwrap();
   97 |                 chunks.push(MiniBlockChunk {
   98 |                     log_num_values: 0,
   99 |                     buffer_sizes: vec![num_bytes],
  100 |                 });
  101 |                 break;
  102 |             } else {
  103 |                 // If we get here then all chunks were full chunks and we have no remainder chunk
  104 |                 break;
  105 |             }
  106 |         }
  107 | 
  108 |         debug_assert_eq!(chunks.len(), num_chunks);
  109 | 
  110 |         Ok(MiniBlockCompressed {
  111 |             chunks,
  112 |             data: vec![data_buffer],
  113 |             num_values: data.num_values,
  114 |         })
  115 |     }
  116 | }
  117 | 
  118 | #[derive(Debug)]
  119 | struct MiniblockFslLayer {
  120 |     validity: Option<LanceBuffer>,
  121 |     dimension: u64,
  122 | }
  123 | 
  124 | /// This impl deals with encoding FSL<FSL<...<FSL<FixedWidth>>>> data as a mini-block compressor.
  125 | /// The tricky part of FSL data is that we want to include inner validity buffers (we don't want these
  126 | /// to be part of the rep-def because that usually ends up being more expensive).
  127 | ///
  128 | /// The resulting mini-block will, instead of having a single buffer, have X + 1 buffers where X is
  129 | /// the number of FSL layers that contain validity.
  130 | ///
  131 | /// In the simple case where there is no validity inside the FSL layers, all we are doing here is flattening
  132 | /// the FSL layers into a single buffer.
  133 | ///
  134 | /// Also: We don't allow a row to be broken across chunks.  This typically isn't too big of a deal since we
  135 | /// are usually dealing with relatively small vectors if we are using mini-block.
  136 | ///
  137 | /// Note: when we do have validity we have to make copies of the validity buffers because they are bit buffers
  138 | /// and we need to bit slice them which requires copies or offsets.  Paying the price at write time to make
  139 | /// the copies is better than paying the price at read time to do the bit slicing.
  140 | impl ValueEncoder {
  141 |     fn make_fsl_encoding(layers: &[MiniblockFslLayer], bits_per_value: u64) -> CompressiveEncoding {
  142 |         let mut encoding = ProtobufUtils21::flat(bits_per_value, None);
  143 |         for layer in layers.iter().rev() {
  144 |             let has_validity = layer.validity.is_some();
  145 |             let dimension = layer.dimension;
  146 |             encoding = ProtobufUtils21::fsl(dimension, has_validity, encoding);
  147 |         }
  148 |         encoding
  149 |     }
  150 | 
  151 |     fn extract_fsl_chunk(
  152 |         data: &FixedWidthDataBlock,
  153 |         layers: &[MiniblockFslLayer],
  154 |         row_offset: usize,
  155 |         num_rows: usize,
  156 |         validity_buffers: &mut [Vec<u8>],
  157 |     ) -> Vec<u32> {
  158 |         let mut row_offset = row_offset;
  159 |         let mut num_values = num_rows;
  160 |         let mut buffer_counter = 0;
  161 |         let mut buffer_sizes = Vec::with_capacity(validity_buffers.len() + 1);
  162 |         for layer in layers {
  163 |             row_offset *= layer.dimension as usize;
  164 |             num_values *= layer.dimension as usize;
  165 |             if let Some(validity) = &layer.validity {
  166 |                 let validity_slice = validity
  167 |                     .clone()
  168 |                     .bit_slice_le_with_length(row_offset, num_values);
  169 |                 validity_buffers[buffer_counter].extend_from_slice(&validity_slice);
  170 |                 buffer_sizes.push(validity_slice.len() as u32);
  171 |                 buffer_counter += 1;
  172 |             }
  173 |         }
  174 | 
  175 |         let bits_in_chunk = data.bits_per_value * num_values as u64;
  176 |         let bytes_in_chunk = bits_in_chunk.div_ceil(8);
  177 |         let bytes_in_chunk = u32::try_from(bytes_in_chunk).unwrap();
  178 |         debug_assert!(bytes_in_chunk > 0);
  179 |         buffer_sizes.push(bytes_in_chunk);
  180 | 
  181 |         buffer_sizes
  182 |     }
  183 | 
  184 |     fn chunk_fsl(
  185 |         data: FixedWidthDataBlock,
  186 |         layers: Vec<MiniblockFslLayer>,
  187 |         num_rows: u64,
  188 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  189 |         // Count size to calculate rows per chunk
  190 |         let mut ceil_bytes_validity = 0;
  191 |         let mut cum_dim = 1;
  192 |         let mut num_validity_buffers = 0;
  193 |         for layer in &layers {
  194 |             cum_dim *= layer.dimension;
  195 |             if layer.validity.is_some() {
  196 |                 ceil_bytes_validity += cum_dim.div_ceil(8);
  197 |                 num_validity_buffers += 1;
  198 |             }
  199 |         }
  200 |         // It's an estimate because validity buffers may have some padding bits
  201 |         let cum_bits_per_value = data.bits_per_value * cum_dim;
  202 |         let (cum_bytes_per_word, vals_per_word) = if cum_bits_per_value.is_multiple_of(8) {
  203 |             (cum_bits_per_value / 8, 1)
  204 |         } else {
  205 |             (cum_bits_per_value, 8)
  206 |         };
  207 |         let est_bytes_per_word = (ceil_bytes_validity * vals_per_word) + cum_bytes_per_word;
  208 |         let (log_rows_per_chunk, rows_per_chunk) =
  209 |             Self::find_log_vals_per_chunk(est_bytes_per_word, vals_per_word)?;
  210 | 
  211 |         let num_chunks = num_rows.div_ceil(rows_per_chunk) as usize;
  212 | 
  213 |         // Allocate buffers for validity, these will be slightly bigger than the input validity buffers
  214 |         let mut chunks = Vec::with_capacity(num_chunks);
  215 |         let mut validity_buffers: Vec<Vec<u8>> = Vec::with_capacity(num_validity_buffers);
  216 |         cum_dim = 1;
  217 |         for layer in &layers {
  218 |             cum_dim *= layer.dimension;
  219 |             if let Some(validity) = &layer.validity {
  220 |                 let layer_bytes_validity = cum_dim.div_ceil(8);
  221 |                 let validity_with_padding =
  222 |                     layer_bytes_validity as usize * num_chunks * rows_per_chunk as usize;
  223 |                 debug_assert!(validity_with_padding >= validity.len());
  224 |                 validity_buffers.push(Vec::with_capacity(
  225 |                     layer_bytes_validity as usize * num_chunks,
  226 |                 ));
  227 |             }
  228 |         }
  229 | 
  230 |         // Now go through and extract validity buffers
  231 |         let mut row_offset = 0;
  232 |         while row_offset + rows_per_chunk <= num_rows {
  233 |             let buffer_sizes = Self::extract_fsl_chunk(
  234 |                 &data,
  235 |                 &layers,
  236 |                 row_offset as usize,
  237 |                 rows_per_chunk as usize,
  238 |                 &mut validity_buffers,
  239 |             );
  240 |             row_offset += rows_per_chunk;
  241 |             chunks.push(MiniBlockChunk {
  242 |                 log_num_values: log_rows_per_chunk as u8,
  243 |                 buffer_sizes,
  244 |             })
  245 |         }
  246 |         let rows_in_chunk = num_rows - row_offset;
  247 |         if rows_in_chunk > 0 {
  248 |             let buffer_sizes = Self::extract_fsl_chunk(
  249 |                 &data,
  250 |                 &layers,
  251 |                 row_offset as usize,
  252 |                 rows_in_chunk as usize,
  253 |                 &mut validity_buffers,
  254 |             );
  255 |             chunks.push(MiniBlockChunk {
  256 |                 log_num_values: 0,
  257 |                 buffer_sizes,
  258 |             });
  259 |         }
  260 | 
  261 |         let encoding = Self::make_fsl_encoding(&layers, data.bits_per_value);
  262 |         // Finally, add the data buffer
  263 |         let buffers = validity_buffers
  264 |             .into_iter()
  265 |             .map(LanceBuffer::from)
  266 |             .chain(std::iter::once(data.data))
  267 |             .collect::<Vec<_>>();
  268 | 
  269 |         Ok((
  270 |             MiniBlockCompressed {
  271 |                 chunks,
  272 |                 data: buffers,
  273 |                 num_values: num_rows,
  274 |             },
  275 |             encoding,
  276 |         ))
  277 |     }
  278 | 
  279 |     fn miniblock_fsl(data: DataBlock) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  280 |         let num_rows = data.num_values();
  281 |         let fsl = data.as_fixed_size_list().unwrap();
  282 |         let mut layers = Vec::new();
  283 |         let mut child = *fsl.child;
  284 |         let mut cur_layer = MiniblockFslLayer {
  285 |             validity: None,
  286 |             dimension: fsl.dimension,
  287 |         };
  288 |         loop {
  289 |             if let DataBlock::Nullable(nullable) = child {
  290 |                 cur_layer.validity = Some(nullable.nulls);
  291 |                 child = *nullable.data;
  292 |             }
  293 |             match child {
  294 |                 DataBlock::FixedSizeList(inner) => {
  295 |                     layers.push(cur_layer);
  296 |                     cur_layer = MiniblockFslLayer {
  297 |                         validity: None,
  298 |                         dimension: inner.dimension,
  299 |                     };
  300 |                     child = *inner.child;
  301 |                 }
  302 |                 DataBlock::FixedWidth(inner) => {
  303 |                     layers.push(cur_layer);
  304 |                     return Self::chunk_fsl(inner, layers, num_rows);
  305 |                 }
  306 |                 _ => unreachable!("Unexpected data block type in value encoder's miniblock_fsl"),
  307 |             }
  308 |         }
  309 |     }
  310 | }
  311 | 
  312 | struct PerValueFslValidityIter {
  313 |     buffer: LanceBuffer,
  314 |     bits_per_row: usize,
  315 |     offset: usize,
  316 | }
  317 | 
  318 | /// In this section we deal with per-value encoding of FSL<FSL<...<FSL<FixedWidth>>>> data.
  319 | ///
  320 | /// It's easier than mini-block.  All we need to do is flatten the FSL layers into a single buffer.
  321 | /// This includes any validity buffers we encounter on the way.
  322 | impl ValueEncoder {
  323 |     fn fsl_to_encoding(fsl: &FixedSizeListBlock) -> CompressiveEncoding {
  324 |         let mut inner = fsl.child.as_ref();
  325 |         let mut has_validity = false;
  326 |         if let DataBlock::Nullable(nullable) = inner {
  327 |             has_validity = true;
  328 |             inner = nullable.data.as_ref();
  329 |         }
  330 |         let inner_encoding = match inner {
  331 |             // All inner values are null.  Reserve validity bits (has_validity=true) so that
  332 |             // the decoder knows one validity byte per cum_dim items is stored per row.
  333 |             // constant(None) signals that every stored item decodes to null.
  334 |             DataBlock::AllNull(_) => {
  335 |                 has_validity = true;
  336 |                 ProtobufUtils21::constant(None)
  337 |             }
  338 |             DataBlock::FixedWidth(fixed_width) => {
  339 |                 ProtobufUtils21::flat(fixed_width.bits_per_value, None)
  340 |             }
  341 |             DataBlock::FixedSizeList(inner) => Self::fsl_to_encoding(inner),
  342 |             _ => unreachable!(
  343 |                 "Unexpected data block type in value encoder's fsl_to_encoding: {}",
  344 |                 inner.name()
  345 |             ),
  346 |         };
  347 |         ProtobufUtils21::fsl(fsl.dimension, has_validity, inner_encoding)
  348 |     }
  349 | 
  350 |     fn simple_per_value_fsl(fsl: FixedSizeListBlock) -> (PerValueDataBlock, CompressiveEncoding) {
  351 |         // The simple case is zero-copy, we just return the flattened inner buffer
  352 |         let encoding = Self::fsl_to_encoding(&fsl);
  353 |         let num_values = fsl.num_values();
  354 |         let mut child = *fsl.child;
  355 |         let mut cum_dim = 1;
  356 |         loop {
  357 |             cum_dim *= fsl.dimension;
  358 |             match child {
  359 |                 DataBlock::Nullable(nullable) => {
  360 |                     child = *nullable.data;
  361 |                 }
  362 |                 DataBlock::FixedSizeList(inner) => {
  363 |                     child = *inner.child;
  364 |                 }
  365 |                 DataBlock::FixedWidth(inner) => {
  366 |                     let data = FixedWidthDataBlock {
  367 |                         bits_per_value: inner.bits_per_value * cum_dim,
  368 |                         num_values,
  369 |                         data: inner.data,
  370 |                         block_info: BlockInfo::new(),
  371 |                     };
  372 |                     return (PerValueDataBlock::Fixed(data), encoding);
  373 |                 }
  374 |                 _ => unreachable!(
  375 |                     "Unexpected data block type in value encoder's simple_per_value_fsl"
  376 |                 ),
  377 |             }
  378 |         }
  379 |     }
  380 | 
  381 |     fn nullable_per_value_fsl(fsl: FixedSizeListBlock) -> (PerValueDataBlock, CompressiveEncoding) {
  382 |         // If there are nullable inner values then we need to zip the validity with the values
  383 |         let encoding = Self::fsl_to_encoding(&fsl);
  384 |         let num_values = fsl.num_values();
  385 |         let mut bytes_per_row = 0;
  386 |         let mut cum_dim = 1;
  387 |         let mut current = fsl;
  388 |         let mut validity_iters: Vec<PerValueFslValidityIter> = Vec::new();
  389 |         let data_bytes_per_row: usize;
  390 |         let data_buffer: LanceBuffer;
  391 |         loop {
  392 |             cum_dim *= current.dimension;
  393 |             let mut child = *current.child;
  394 |             if let DataBlock::Nullable(nullable) = child {
  395 |                 // Each item will need this many bytes of validity prepended to it
  396 |                 bytes_per_row += cum_dim.div_ceil(8) as usize;
  397 |                 validity_iters.push(PerValueFslValidityIter {
  398 |                     buffer: nullable.nulls,
  399 |                     bits_per_row: cum_dim as usize,
  400 |                     offset: 0,
  401 |                 });
  402 |                 child = *nullable.data;
  403 |             };
  404 |             match child {
  405 |                 DataBlock::FixedSizeList(inner) => {
  406 |                     current = inner;
  407 |                 }
  408 |                 DataBlock::FixedWidth(fixed_width) => {
  409 |                     data_bytes_per_row =
  410 |                         (fixed_width.bits_per_value.div_ceil(8) * cum_dim) as usize;
  411 |                     bytes_per_row += data_bytes_per_row;
  412 |                     data_buffer = fixed_width.data;
  413 |                     break;
  414 |                 }
  415 |                 DataBlock::AllNull(_) => {
  416 |                     // All inner values are null.  Add all-zero validity bits so that
  417 |                     // bytes_per_row > 0 and the FullZip layout doesn't write bits_per_value=0,
  418 |                     // which would crash the reader when there are also no ctrl-word bytes.
  419 |                     bytes_per_row += cum_dim.div_ceil(8) as usize;
  420 |                     validity_iters.push(PerValueFslValidityIter {
  421 |                         buffer: LanceBuffer::from(vec![
  422 |                             0u8;
  423 |                             cum_dim.div_ceil(8) as usize
  424 |                                 * num_values as usize
  425 |                         ]),
  426 |                         bits_per_row: cum_dim as usize,
  427 |                         offset: 0,
  428 |                     });
  429 |                     data_bytes_per_row = 0;
  430 |                     data_buffer = LanceBuffer::empty();
  431 |                     break;
  432 |                 }
  433 |                 _ => unreachable!(
  434 |                     "Unexpected data block type in value encoder's nullable_per_value_fsl: {:?}",
  435 |                     child
  436 |                 ),
  437 |             }
  438 |         }
  439 | 
  440 |         let bytes_needed = bytes_per_row * num_values as usize;
  441 |         let mut zipped = Vec::with_capacity(bytes_needed);
  442 |         let data_slice = &data_buffer;
  443 |         // Hopefully values are pretty large so we don't iterate this loop _too_ many times
  444 |         for i in 0..num_values as usize {
  445 |             for validity in validity_iters.iter_mut() {
  446 |                 let validity_slice = validity
  447 |                     .buffer
  448 |                     .bit_slice_le_with_length(validity.offset, validity.bits_per_row);
  449 |                 zipped.extend_from_slice(&validity_slice);
  450 |                 validity.offset += validity.bits_per_row;
  451 |             }
  452 |             let start = i * data_bytes_per_row;
  453 |             let end = start + data_bytes_per_row;
  454 |             zipped.extend_from_slice(&data_slice[start..end]);
  455 |         }
  456 | 
  457 |         let zipped = LanceBuffer::from(zipped);
  458 |         let data = PerValueDataBlock::Fixed(FixedWidthDataBlock {
  459 |             bits_per_value: bytes_per_row as u64 * 8,
  460 |             num_values,
  461 |             data: zipped,
  462 |             block_info: BlockInfo::new(),
  463 |         });
  464 |         (data, encoding)
  465 |     }
  466 | 
  467 |     fn per_value_fsl(fsl: FixedSizeListBlock) -> (PerValueDataBlock, CompressiveEncoding) {
  468 |         if !fsl.child.is_nullable() {
  469 |             Self::simple_per_value_fsl(fsl)
  470 |         } else {
  471 |             Self::nullable_per_value_fsl(fsl)
  472 |         }
  473 |     }
  474 | }
  475 | 
  476 | impl BlockCompressor for ValueEncoder {
  477 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
  478 |         let DataBlock::FixedWidth(fixed_width) = data else {
  479 |             return Err(Error::invalid_input(format!(
  480 |                 "ValueEncoder cannot compress a {} block",
  481 |                 data.name()
  482 |             )));
  483 |         };
  484 |         Ok((
  485 |             Some(fixed_width.data),
  486 |             ProtobufUtils21::flat(fixed_width.bits_per_value, None),
  487 |         ))
  488 |     }
  489 | }
  490 | 
  491 | impl MiniBlockCompressor for ValueEncoder {
  492 |     fn compress(
  493 |         &self,
  494 |         _context: MiniBlockCompressionContext,
  495 |         chunk: DataBlock,
  496 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  497 |         match chunk {
  498 |             DataBlock::FixedWidth(fixed_width) => {
  499 |                 let encoding = ProtobufUtils21::flat(fixed_width.bits_per_value, None);
  500 |                 Ok((Self::chunk_data(fixed_width)?, encoding))
  501 |             }
  502 |             DataBlock::FixedSizeList(_) => Self::miniblock_fsl(chunk),
  503 |             _ => Err(Error::invalid_input_source(
  504 |                 format!(
  505 |                     "Cannot compress a data block of type {} with ValueEncoder",
  506 |                     chunk.name()
  507 |                 )
  508 |                 .into(),
  509 |             )),
  510 |         }
  511 |     }
  512 | }
  513 | 
  514 | #[derive(Debug)]
  515 | struct ValueFslDesc {
  516 |     dimension: u64,
  517 |     has_validity: bool,
  518 | }
  519 | 
  520 | /// A decompressor for fixed-width data that has
  521 | /// been written, as-is, to disk in single contiguous array
  522 | #[derive(Debug)]
  523 | pub struct ValueDecompressor {
  524 |     /// How many bits are in each inner-most item (e.g. FSL<Int32, 100> would be 32)
  525 |     bits_per_item: u64,
  526 |     /// How many bits are in each value (e.g. FSL<Int32, 100> would be 3200)
  527 |     ///
  528 |     /// This number is a little trickier to compute because we also have to include bytes
  529 |     /// of any inner validity
  530 |     bits_per_value: u64,
  531 |     /// How many items are in each value (e.g. FSL<Int32, 100> would be 100)
  532 |     items_per_value: u64,
  533 |     layers: Vec<ValueFslDesc>,
  534 | }
  535 | 
  536 | impl ValueDecompressor {
  537 |     pub fn from_flat(description: &pb21::Flat) -> Self {
  538 |         Self {
  539 |             bits_per_item: description.bits_per_value,
  540 |             bits_per_value: description.bits_per_value,
  541 |             items_per_value: 1,
  542 |             layers: Vec::default(),
  543 |         }
  544 |     }
  545 | 
  546 |     pub fn from_fsl(mut description: &pb21::FixedSizeList) -> Result<Self> {
  547 |         let mut layers = Vec::new();
  548 |         let mut cum_dim = 1;
  549 |         let mut bytes_per_value = 0;
  550 |         loop {
  551 |             layers.push(ValueFslDesc {
  552 |                 has_validity: description.has_validity,
  553 |                 dimension: description.items_per_value,
  554 |             });
  555 |             cum_dim *= description.items_per_value;
  556 |             if description.has_validity {
  557 |                 bytes_per_value += cum_dim.div_ceil(8);
  558 |             }
  559 |             let encoding = description
  560 |                 .values
  561 |                 .as_ref()
  562 |                 .ok_or_else(|| Error::invalid_input("FSL encoding missing inner values field"))?
  563 |                 .compression
  564 |                 .as_ref()
  565 |                 .ok_or_else(|| {
  566 |                     Error::invalid_input("FSL encoding missing inner compression field")
  567 |                 })?;
  568 |             match encoding {
  569 |                 Compression::FixedSizeList(inner) => {
  570 |                     description = inner;
  571 |                 }
  572 |                 Compression::Flat(flat) => {
  573 |                     let mut bits_per_value = bytes_per_value * 8;
  574 |                     bits_per_value += flat.bits_per_value * cum_dim;
  575 |                     return Ok(Self {
  576 |                         bits_per_item: flat.bits_per_value,
  577 |                         bits_per_value,
  578 |                         items_per_value: cum_dim,
  579 |                         layers,
  580 |                     });
  581 |                 }
  582 |                 // All inner values are null: only validity bytes are stored per row.
  583 |                 // bits_per_item=0 signals unzip_decompress to emit AllNull for the values.
  584 |                 Compression::Constant(_) => {
  585 |                     return Ok(Self {
  586 |                         bits_per_item: 0,
  587 |                         bits_per_value: bytes_per_value * 8,
  588 |                         items_per_value: cum_dim,
  589 |                         layers,
  590 |                     });
  591 |                 }
  592 |                 _ => {
  593 |                     return Err(Error::invalid_input(format!(
  594 |                         "Unexpected inner encoding type in FSL descriptor: {:?}",
  595 |                         encoding
  596 |                     )));
  597 |                 }
  598 |             }
  599 |         }
  600 |     }
  601 | 
  602 |     fn buffer_to_block(&self, data: LanceBuffer, num_values: u64) -> DataBlock {
  603 |         DataBlock::FixedWidth(FixedWidthDataBlock {
  604 |             bits_per_value: self.bits_per_item,
  605 |             num_values,
  606 |             data,
  607 |             block_info: BlockInfo::new(),
  608 |         })
  609 |     }
  610 | }
  611 | 
  612 | impl BlockDecompressor for ValueDecompressor {
  613 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  614 |         let data = require_block_payload(data, "Flat block")?;
  615 |         let block = self.buffer_to_block(data, num_values);
  616 |         assert_eq!(block.num_values(), num_values);
  617 |         Ok(block)
  618 |     }
  619 | }
  620 | 
  621 | impl MiniBlockDecompressor for ValueDecompressor {
  622 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  623 |         let num_items = num_values * self.items_per_value;
  624 |         let mut buffer_iter = data.into_iter().rev();
  625 | 
  626 |         // Always at least 1 buffer
  627 |         let data_buf = buffer_iter.next().unwrap();
  628 |         let items = self.buffer_to_block(data_buf, num_items);
  629 |         let mut lists = items;
  630 | 
  631 |         for layer in self.layers.iter().rev() {
  632 |             if layer.has_validity {
  633 |                 let validity_buf = buffer_iter.next().unwrap();
  634 |                 lists = DataBlock::Nullable(NullableDataBlock {
  635 |                     data: Box::new(lists),
  636 |                     nulls: validity_buf,
  637 |                     block_info: BlockInfo::default(),
  638 |                 });
  639 |             }
  640 |             lists = DataBlock::FixedSizeList(FixedSizeListBlock {
  641 |                 child: Box::new(lists),
  642 |                 dimension: layer.dimension,
  643 |             })
  644 |         }
  645 | 
  646 |         assert_eq!(lists.num_values(), num_values);
  647 |         Ok(lists)
  648 |     }
  649 | 
  650 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
  651 |         if self.has_validity() {
  652 |             return None;
  653 |         }
  654 |         num_values
  655 |             .checked_mul(self.bits_per_value)
  656 |             .map(|bits| bits.div_ceil(8))
  657 |     }
  658 | }
  659 | 
  660 | struct FslDecompressorValidityBuilder {
  661 |     buffer: BooleanBufferBuilder,
  662 |     bits_per_row: usize,
  663 |     bytes_per_row: usize,
  664 | }
  665 | 
  666 | // Helper methods for per-value decompression
  667 | impl ValueDecompressor {
  668 |     fn has_validity(&self) -> bool {
  669 |         self.layers.iter().any(|layer| layer.has_validity)
  670 |     }
  671 | 
  672 |     // If there is no validity then decompression is zero-copy, we just need to restore any FSL layers
  673 |     fn simple_decompress(&self, data: FixedWidthDataBlock, num_rows: u64) -> DataBlock {
  674 |         let mut cum_dim = 1;
  675 |         for layer in &self.layers {
  676 |             cum_dim *= layer.dimension;
  677 |         }
  678 |         debug_assert_eq!(self.bits_per_item, data.bits_per_value / cum_dim);
  679 |         let mut block = DataBlock::FixedWidth(FixedWidthDataBlock {
  680 |             bits_per_value: self.bits_per_item,
  681 |             num_values: num_rows * cum_dim,
  682 |             data: data.data,
  683 |             block_info: BlockInfo::new(),
  684 |         });
  685 |         for layer in self.layers.iter().rev() {
  686 |             block = DataBlock::FixedSizeList(FixedSizeListBlock {
  687 |                 child: Box::new(block),
  688 |                 dimension: layer.dimension,
  689 |             });
  690 |         }
  691 |         debug_assert_eq!(num_rows, block.num_values());
  692 |         block
  693 |     }
  694 | 
  695 |     // If there is validity then it has been zipped in with the values and we must unzip it
  696 |     fn unzip_decompress(&self, data: FixedWidthDataBlock, num_rows: usize) -> DataBlock {
  697 |         // No support for full-zip on per-value encodings
  698 |         assert_eq!(self.bits_per_item % 8, 0);
  699 |         let bytes_per_item = self.bits_per_item / 8;
  700 |         let mut buffer_builders = Vec::with_capacity(self.layers.len());
  701 |         let mut cum_dim = 1;
  702 |         let mut total_size_bytes = 0;
  703 |         // First, go through the layers, setup our builders, allocate space
  704 |         for layer in &self.layers {
  705 |             cum_dim *= layer.dimension as usize;
  706 |             if layer.has_validity {
  707 |                 let validity_size_bits = cum_dim;
  708 |                 let validity_size_bytes = validity_size_bits.div_ceil(8);
  709 |                 total_size_bytes += num_rows * validity_size_bytes;
  710 |                 buffer_builders.push(FslDecompressorValidityBuilder {
  711 |                     buffer: BooleanBufferBuilder::new(validity_size_bits * num_rows),
  712 |                     bits_per_row: cum_dim,
  713 |                     bytes_per_row: validity_size_bytes,
  714 |                 })
  715 |             }
  716 |         }
  717 |         let num_items = num_rows * cum_dim;
  718 |         let data_size = num_items * bytes_per_item as usize;
  719 |         total_size_bytes += data_size;
  720 |         let mut data_buffer = Vec::with_capacity(data_size);
  721 | 
  722 |         assert_eq!(data.data.len(), total_size_bytes);
  723 | 
  724 |         let bytes_per_value = bytes_per_item as usize;
  725 |         let data_bytes_per_row = bytes_per_value * cum_dim;
  726 | 
  727 |         // Next, unzip
  728 |         let mut data_offset = 0;
  729 |         while data_offset < total_size_bytes {
  730 |             for builder in buffer_builders.iter_mut() {
  731 |                 let start = data_offset * 8;
  732 |                 let end = start + builder.bits_per_row;
  733 |                 builder.buffer.append_packed_range(start..end, &data.data);
  734 |                 data_offset += builder.bytes_per_row;
  735 |             }
  736 |             let end = data_offset + data_bytes_per_row;
  737 |             data_buffer.extend_from_slice(&data.data[data_offset..end]);
  738 |             data_offset += data_bytes_per_row;
  739 |         }
  740 | 
  741 |         // Finally, restore the structure
  742 |         //
  743 |         // bits_per_item=0 means the terminal encoding is constant-null (all inner values
  744 |         // are null and only validity bits were stored).  Use AllNull so that into_arrow
  745 |         // produces a properly typed all-null array without a zero-width data buffer.
  746 |         let mut block = if self.bits_per_item == 0 {
  747 |             debug_assert!(data_buffer.is_empty());
  748 |             DataBlock::AllNull(AllNullDataBlock {
  749 |                 num_values: num_items as u64,
  750 |             })
  751 |         } else {
  752 |             DataBlock::FixedWidth(FixedWidthDataBlock {
  753 |                 bits_per_value: self.bits_per_item,
  754 |                 num_values: num_items as u64,
  755 |                 data: LanceBuffer::from(data_buffer),
  756 |                 block_info: BlockInfo::new(),
  757 |             })
  758 |         };
  759 | 
  760 |         let mut validity_bufs = buffer_builders
  761 |             .into_iter()
  762 |             .rev()
  763 |             .map(|mut b| LanceBuffer::from(b.buffer.finish().into_inner()));
  764 |         for layer in self.layers.iter().rev() {
  765 |             if layer.has_validity {
  766 |                 let nullable = NullableDataBlock {
  767 |                     data: Box::new(block),
  768 |                     nulls: validity_bufs.next().unwrap(),
  769 |                     block_info: BlockInfo::new(),
  770 |                 };
  771 |                 block = DataBlock::Nullable(nullable);
  772 |             }
  773 |             block = DataBlock::FixedSizeList(FixedSizeListBlock {
  774 |                 child: Box::new(block),
  775 |                 dimension: layer.dimension,
  776 |             });
  777 |         }
  778 | 
  779 |         assert_eq!(num_rows, block.num_values() as usize);
  780 | 
  781 |         block
  782 |     }
  783 | }
  784 | 
  785 | impl FixedPerValueDecompressor for ValueDecompressor {
  786 |     fn decompress(&self, data: FixedWidthDataBlock, num_rows: u64) -> Result<DataBlock> {
  787 |         if self.has_validity() {
  788 |             Ok(self.unzip_decompress(data, num_rows as usize))
  789 |         } else {
  790 |             Ok(self.simple_decompress(data, num_rows))
  791 |         }
  792 |     }
  793 | 
  794 |     fn bits_per_value(&self) -> u64 {
  795 |         self.bits_per_value
  796 |     }
  797 | 
  798 |     fn decoded_size_bytes(&self, num_values: u64) -> Option<u64> {
  799 |         if self.has_validity() {
  800 |             return None;
  801 |         }
  802 |         num_values
  803 |             .checked_mul(self.bits_per_value)
  804 |             .map(|bits| bits.div_ceil(8))
  805 |     }
  806 | }
  807 | 
  808 | impl PerValueCompressor for ValueEncoder {
  809 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  810 |         let (data, encoding) = match data {
  811 |             DataBlock::FixedWidth(fixed_width) => {
  812 |                 let encoding = ProtobufUtils21::flat(fixed_width.bits_per_value, None);
  813 |                 (PerValueDataBlock::Fixed(fixed_width), encoding)
  814 |             }
  815 |             DataBlock::FixedSizeList(fixed_size_list) => Self::per_value_fsl(fixed_size_list),
  816 |             _ => unimplemented!(
  817 |                 "Cannot compress block of type {} with ValueEncoder",
  818 |                 data.name()
  819 |             ),
  820 |         };
  821 |         Ok((data, encoding))
  822 |     }
  823 | }
  824 | 
  825 | // public tests module because we share the PRIMITIVE_TYPES constant with fixed_size_list
  826 | #[cfg(test)]
  827 | mod tests {
  828 |     use std::{collections::HashMap, sync::Arc};
  829 | 
  830 |     use arrow_array::{
  831 |         Array, ArrayRef, Decimal128Array, FixedSizeListArray, Int32Array, ListArray, UInt8Array,
  832 |         make_array, new_null_array, types::UInt32Type,
  833 |     };
  834 |     use arrow_buffer::{BooleanBuffer, NullBuffer, OffsetBuffer, ScalarBuffer};
  835 |     use arrow_schema::{DataType, Field, TimeUnit};
  836 |     use lance_datagen::{ArrayGeneratorExt, Dimension, RowCount, Seed, array, gen_batch};
  837 | 
  838 |     use crate::{
  839 |         compression::{FixedPerValueDecompressor, MiniBlockDecompressor},
  840 |         data::DataBlock,
  841 |         encodings::{
  842 |             logical::primitive::{
  843 |                 fullzip::{PerValueCompressor, PerValueDataBlock},
  844 |                 miniblock::{MiniBlockCompressionContext, MiniBlockCompressor},
  845 |             },
  846 |             physical::value::ValueDecompressor,
  847 |         },
  848 |         format::pb21::compressive_encoding::Compression,
  849 |         testing::{
  850 |             TestCases, TestEncoding, check_basic_random_case, check_round_trip_encoding_of_data,
  851 |         },
  852 |     };
  853 | 
  854 |     use super::ValueEncoder;
  855 | 
  856 |     fn miniblock_context() -> MiniBlockCompressionContext {
  857 |         MiniBlockCompressionContext::new(0, true, true)
  858 |     }
  859 | 
  860 |     const PRIMITIVE_TYPES: &[DataType] = &[
  861 |         DataType::Null,
  862 |         DataType::FixedSizeBinary(2),
  863 |         DataType::Date32,
  864 |         DataType::Date64,
  865 |         DataType::Int8,
  866 |         DataType::Int16,
  867 |         DataType::Int32,
  868 |         DataType::Int64,
  869 |         DataType::UInt8,
  870 |         DataType::UInt16,
  871 |         DataType::UInt32,
  872 |         DataType::UInt64,
  873 |         DataType::Float16,
  874 |         DataType::Float32,
  875 |         DataType::Float64,
  876 |         DataType::Decimal128(10, 10),
  877 |         DataType::Decimal256(10, 10),
  878 |         DataType::Timestamp(TimeUnit::Nanosecond, None),
  879 |         DataType::Time32(TimeUnit::Second),
  880 |         DataType::Time64(TimeUnit::Nanosecond),
  881 |         DataType::Duration(TimeUnit::Second),
  882 |         // The Interval type is supported by the reader but the writer works with Lance schema
  883 |         // at the moment and Lance schema can't parse interval
  884 |         // DataType::Interval(IntervalUnit::DayTime),
  885 |     ];
  886 | 
  887 |     #[test_log::test(tokio::test)]
  888 |     async fn test_simple_value() {
  889 |         let items = Arc::new(Int32Array::from(vec![
  890 |             Some(0),
  891 |             None,
  892 |             Some(2),
  893 |             Some(3),
  894 |             Some(4),
  895 |             Some(5),
  896 |         ]));
  897 | 
  898 |         let test_cases = TestCases::default()
  899 |             .with_range(0..3)
  900 |             .with_range(0..2)
  901 |             .with_range(1..3)
  902 |             .with_indices(vec![0, 1, 2])
  903 |             .with_indices(vec![1])
  904 |             .with_indices(vec![2])
  905 |             .with_structural_encodings();
  906 | 
  907 |         check_round_trip_encoding_of_data(vec![items], &test_cases, HashMap::default()).await;
  908 |     }
  909 | 
  910 |     #[test_log::test(tokio::test)]
  911 |     async fn test_simple_range() {
  912 |         let items = Arc::new(Int32Array::from_iter(
  913 |             (0..5000).map(|i| if i % 2 == 0 { Some(i) } else { None }),
  914 |         ));
  915 | 
  916 |         let test_cases = TestCases::default().with_structural_encodings();
  917 | 
  918 |         check_round_trip_encoding_of_data(vec![items], &test_cases, HashMap::default()).await;
  919 |     }
  920 | 
  921 |     #[test_log::test(tokio::test)]
  922 |     async fn test_value_primitive() {
  923 |         const NUM_ROWS: u32 = 1025;
  924 | 
  925 |         let test_cases = TestCases::default()
  926 |             .with_batch_size(NUM_ROWS)
  927 |             .with_page_sizes(vec![4096])
  928 |             .with_expected_encoding("flat");
  929 |         let value_metadata =
  930 |             HashMap::from([("lance-encoding:compression".to_string(), "none".to_string())]);
  931 | 
  932 |         for (seed, data_type) in PRIMITIVE_TYPES.iter().enumerate() {
  933 |             log::info!("Testing encoding for {:?}", data_type);
  934 |             let data = gen_batch()
  935 |                 .with_seed(Seed::from(seed as u64))
  936 |                 .anon_col(array::rand_type(data_type))
  937 |                 .into_batch_rows(RowCount::from(NUM_ROWS as u64))
  938 |                 .unwrap()
  939 |                 .column(0)
  940 |                 .clone();
  941 | 
  942 |             check_round_trip_encoding_of_data(vec![data], &test_cases, value_metadata.clone())
  943 |                 .await;
  944 |         }
  945 |     }
  946 | 
  947 |     #[rstest::rstest]
  948 |     #[test_log::test(tokio::test)]
  949 |     async fn test_large_primitive(
  950 |         #[values(
  951 |             TestEncoding::Array,
  952 |             TestEncoding::StructuralU16,
  953 |             TestEncoding::StructuralU32,
  954 |             TestEncoding::StructuralSparse
  955 |         )]
  956 |         encoding: TestEncoding,
  957 |         #[values(4096, 1024 * 1024)] page_size: u64,
  958 |         #[values(false, true)] use_slicing: bool,
  959 |     ) {
  960 |         let data_type =
  961 |             DataType::FixedSizeList(Arc::new(Field::new("", DataType::Int32, false)), 128);
  962 |         let field = Field::new("", data_type, false);
  963 |         check_basic_random_case(field, encoding, page_size, use_slicing).await;
  964 |     }
  965 | 
  966 |     #[rstest::rstest]
  967 |     #[test_log::test(tokio::test)]
  968 |     async fn test_decimal128_dictionary_encoding(
  969 |         #[values(
  970 |             TestEncoding::StructuralU16,
  971 |             TestEncoding::StructuralU32,
  972 |             TestEncoding::StructuralSparse
  973 |         )]
  974 |         encoding: TestEncoding,
  975 |     ) {
  976 |         let test_cases = TestCases::default()
  977 |             .with_encoding(encoding)
  978 |             .with_expected_encoding("dictionary");
  979 |         let decimals: Vec<i32> = (0..100).collect();
  980 |         let repeated_strings: Vec<_> = decimals
  981 |             .iter()
  982 |             .cycle()
  983 |             .take(decimals.len() * 1000)
  984 |             .map(|&v| Some(v as i128))
  985 |             .collect();
  986 |         let decimal_array = Arc::new(Decimal128Array::from(repeated_strings)) as ArrayRef;
  987 |         check_round_trip_encoding_of_data(vec![decimal_array], &test_cases, HashMap::new()).await;
  988 |     }
  989 | 
  990 |     #[rstest::rstest]
  991 |     #[test_log::test(tokio::test)]
  992 |     async fn test_miniblock_stress(
  993 |         #[values(false, true)] mixed_validity: bool,
  994 |         #[values(10, 100, 1500, 15000)] batch_size: u32,
  995 |         #[values(1000, 2000, 3000, 60000)] page_size: u64,
  996 |         #[values(
  997 |             TestEncoding::StructuralU16,
  998 |             TestEncoding::StructuralU32,
  999 |             TestEncoding::StructuralSparse
 1000 |         )]
 1001 |         encoding: TestEncoding,
 1002 |     ) {
 1003 |         // Tests for strange page sizes and batch sizes and validity scenarios for miniblock
 1004 | 
 1005 |         // 10K integers, 100 per array, either all valid or mixed validity.
 1006 |         let data = (0..100)
 1007 |             .map(|_| {
 1008 |                 if mixed_validity {
 1009 |                     Arc::new(Int32Array::from_iter(
 1010 |                         (0..100).map(|i| if i % 2 == 0 { Some(i) } else { None }),
 1011 |                     )) as Arc<dyn Array>
 1012 |                 } else {
 1013 |                     Arc::new(Int32Array::from_iter_values(0..100)) as Arc<dyn Array>
 1014 |                 }
 1015 |             })
 1016 |             .collect::<Vec<_>>();
 1017 | 
 1018 |         let test_cases = TestCases::default()
 1019 |             .with_page_sizes(vec![page_size])
 1020 |             .with_batch_size(batch_size)
 1021 |             .with_encoding(encoding);
 1022 | 
 1023 |         check_round_trip_encoding_of_data(data, &test_cases, HashMap::new()).await;
 1024 |     }
 1025 | 
 1026 |     fn create_simple_fsl() -> FixedSizeListArray {
 1027 |         // [[0, 1], NULL], [NULL, NULL], [[8, 9], [NULL, 11]]
 1028 |         let items = Arc::new(Int32Array::from(vec![
 1029 |             Some(0),
 1030 |             Some(1),
 1031 |             Some(2),
 1032 |             Some(3),
 1033 |             None,
 1034 |             None,
 1035 |             None,
 1036 |             None,
 1037 |             Some(8),
 1038 |             Some(9),
 1039 |             None,
 1040 |             Some(11),
 1041 |         ]));
 1042 |         let items_field = Arc::new(Field::new("item", DataType::Int32, true));
 1043 |         let inner_list_nulls = BooleanBuffer::from(vec![true, false, false, false, true, true]);
 1044 |         let inner_list = Arc::new(FixedSizeListArray::new(
 1045 |             items_field.clone(),
 1046 |             2,
 1047 |             items,
 1048 |             Some(NullBuffer::new(inner_list_nulls)),
 1049 |         ));
 1050 |         let inner_list_field = Arc::new(Field::new(
 1051 |             "item",
 1052 |             DataType::FixedSizeList(items_field, 2),
 1053 |             true,
 1054 |         ));
 1055 |         FixedSizeListArray::new(inner_list_field, 2, inner_list, None)
 1056 |     }
 1057 | 
 1058 |     #[test]
 1059 |     fn test_fsl_value_compression_miniblock() {
 1060 |         let sample_list = create_simple_fsl();
 1061 | 
 1062 |         let starting_data = DataBlock::from_array(sample_list.clone());
 1063 | 
 1064 |         let encoder = ValueEncoder::default();
 1065 |         let (data, compression) =
 1066 |             MiniBlockCompressor::compress(&encoder, miniblock_context(), starting_data).unwrap();
 1067 | 
 1068 |         assert_eq!(data.num_values, 3);
 1069 |         assert_eq!(data.data.len(), 3);
 1070 |         assert_eq!(data.chunks.len(), 1);
 1071 |         assert_eq!(data.chunks[0].buffer_sizes, vec![1, 2, 48]);
 1072 |         assert_eq!(data.chunks[0].log_num_values, 0);
 1073 | 
 1074 |         let Compression::FixedSizeList(fsl) = compression.compression.unwrap() else {
 1075 |             panic!()
 1076 |         };
 1077 | 
 1078 |         let decompressor = ValueDecompressor::from_fsl(fsl.as_ref()).unwrap();
 1079 | 
 1080 |         let decompressed =
 1081 |             MiniBlockDecompressor::decompress(&decompressor, data.data, data.num_values).unwrap();
 1082 | 
 1083 |         let decompressed = make_array(
 1084 |             decompressed
 1085 |                 .into_arrow(sample_list.data_type().clone(), true)
 1086 |                 .unwrap(),
 1087 |         );
 1088 | 
 1089 |         assert_eq!(decompressed.as_ref(), &sample_list);
 1090 |     }
 1091 | 
 1092 |     fn wide_fixed_size_binary() -> ArrayRef {
 1093 |         let wide_value = vec![0xABu8; 5000];
 1094 |         Arc::new(
 1095 |             arrow_array::FixedSizeBinaryArray::try_from_sparse_iter_with_size(
 1096 |                 std::iter::repeat_n(Some(wide_value.as_slice()), 4),
 1097 |                 5000,
 1098 |             )
 1099 |             .unwrap(),
 1100 |         )
 1101 |     }
 1102 | 
 1103 |     fn wide_fixed_size_list_bool() -> ArrayRef {
 1104 |         // A wide FSL<Boolean> is sub-byte, so it chunks eight values per word and the
 1105 |         // smallest unit is 16 values rather than 2.
 1106 |         let dimension = 4095;
 1107 |         let values = arrow_array::BooleanArray::from(vec![false; dimension * 2]);
 1108 |         let field = Arc::new(Field::new("item", DataType::Boolean, true));
 1109 |         Arc::new(FixedSizeListArray::new(
 1110 |             field,
 1111 |             dimension as i32,
 1112 |             Arc::new(values),
 1113 |             None,
 1114 |         ))
 1115 |     }
 1116 | 
 1117 |     #[rstest::rstest]
 1118 |     #[case::fixed_size_binary(wide_fixed_size_binary(), 2)]
 1119 |     #[case::fixed_size_list_bool(wide_fixed_size_list_bool(), 16)]
 1120 |     fn test_wide_value_miniblock_returns_error(
 1121 |         #[case] array: ArrayRef,
 1122 |         #[case] expected_min_values: u64,
 1123 |     ) {
 1124 |         let starting_data = DataBlock::from_array(array);
 1125 | 
 1126 |         let encoder = ValueEncoder::default();
 1127 |         let result = MiniBlockCompressor::compress(&encoder, miniblock_context(), starting_data);
 1128 | 
 1129 |         let err = result.expect_err("wide values should not be encodable as miniblock");
 1130 |         assert!(
 1131 |             matches!(err, lance_core::Error::InvalidInput { .. }),
 1132 |             "expected InvalidInput, got {err:?}"
 1133 |         );
 1134 |         let msg = err.to_string();
 1135 |         assert!(
 1136 |             msg.contains("too wide for miniblock encoding"),
 1137 |             "unexpected error message: {msg}"
 1138 |         );
 1139 |         assert!(
 1140 |             msg.contains(&format!("{expected_min_values} values require")),
 1141 |             "unexpected error message: {msg}"
 1142 |         );
 1143 |     }
 1144 | 
 1145 |     #[test]
 1146 |     fn test_fsl_value_compression_per_value() {
 1147 |         let sample_list = create_simple_fsl();
 1148 | 
 1149 |         let starting_data = DataBlock::from_array(sample_list.clone());
 1150 | 
 1151 |         let encoder = ValueEncoder::default();
 1152 |         let (data, compression) = PerValueCompressor::compress(&encoder, starting_data).unwrap();
 1153 | 
 1154 |         let PerValueDataBlock::Fixed(data) = data else {
 1155 |             panic!()
 1156 |         };
 1157 | 
 1158 |         assert_eq!(data.bits_per_value, 144);
 1159 |         assert_eq!(data.num_values, 3);
 1160 |         assert_eq!(data.data.len(), 18 * 3);
 1161 | 
 1162 |         let Compression::FixedSizeList(fsl) = compression.compression.unwrap() else {
 1163 |             panic!()
 1164 |         };
 1165 | 
 1166 |         let decompressor = ValueDecompressor::from_fsl(fsl.as_ref()).unwrap();
 1167 | 
 1168 |         let num_values = data.num_values;
 1169 |         assert_eq!(
 1170 |             FixedPerValueDecompressor::decoded_size_bytes(&decompressor, num_values),
 1171 |             None,
 1172 |             "nullable FSL output uses multiple buffers and requires the fallback estimate"
 1173 |         );
 1174 |         let decompressed =
 1175 |             FixedPerValueDecompressor::decompress(&decompressor, data, num_values).unwrap();
 1176 | 
 1177 |         let decompressed = make_array(
 1178 |             decompressed
 1179 |                 .into_arrow(sample_list.data_type().clone(), true)
 1180 |                 .unwrap(),
 1181 |         );
 1182 | 
 1183 |         assert_eq!(decompressed.as_ref(), &sample_list);
 1184 |     }
 1185 | 
 1186 |     #[test_log::test(tokio::test)]
 1187 |     async fn test_fsl_all_null() {
 1188 |         let items = new_null_array(&DataType::Int32, 12);
 1189 |         let items_field = Arc::new(Field::new("item", DataType::Int32, true));
 1190 |         let list_nulls = BooleanBuffer::from(vec![true, false, false, false, true, true]);
 1191 |         let list_array =
 1192 |             FixedSizeListArray::new(items_field, 2, items, Some(NullBuffer::new(list_nulls)));
 1193 | 
 1194 |         let test_cases = TestCases::default().with_structural_encodings();
 1195 | 
 1196 |         check_round_trip_encoding_of_data(vec![Arc::new(list_array)], &test_cases, HashMap::new())
 1197 |             .await;
 1198 |     }
 1199 | 
 1200 |     // Regression: nullable_per_value_fsl wrote bits_per_value=0 when the child block was
 1201 |     // AllNull but the FSL had no outer null buffer (no ctrl-word bytes), making
 1202 |     // total_bytes_per_value=0 and crashing the reader with "per-row byte width must be > 0".
 1203 |     #[test_log::test(tokio::test)]
 1204 |     async fn test_fsl_nullable_child_all_null_no_outer_nulls() {
 1205 |         // FSL<nullable Float32, dim=4>, 2 outer rows, no outer null buffer, all 8 child
 1206 |         // Float32 values are null.  DataBlock::from_arrays returns AllNull for the child,
 1207 |         // which routes into nullable_per_value_fsl.  Without this fix the encoder writes
 1208 |         // bits_per_value=0 and the decoder errors on read.
 1209 |         let items = new_null_array(&DataType::Float32, 8);
 1210 |         let items_field = Arc::new(Field::new("item", DataType::Float32, true));
 1211 |         let fsl = FixedSizeListArray::new(items_field, 4, items, None);
 1212 | 
 1213 |         let test_cases = TestCases::default().with_structural_encodings();
 1214 |         check_round_trip_encoding_of_data(vec![Arc::new(fsl)], &test_cases, HashMap::new()).await;
 1215 |     }
 1216 | 
 1217 |     #[test_log::test(tokio::test)]
 1218 |     async fn regress_list_fsl() {
 1219 |         // This regresses a case where rows are large lists that span multiple
 1220 |         // mini-block chunks which gives us some all-premable mini-block chunks.
 1221 |         let offsets = ScalarBuffer::<i32>::from(vec![0, 393, 755, 1156, 1536]);
 1222 |         let data = UInt8Array::from(vec![0; 1536 * 16]);
 1223 |         let fsl_field = Arc::new(Field::new("item", DataType::UInt8, true));
 1224 |         let fsl = FixedSizeListArray::new(fsl_field, 16, Arc::new(data), None);
 1225 |         let list_field = Arc::new(Field::new("item", fsl.data_type().clone(), false));
 1226 |         let list_arr = ListArray::new(list_field, OffsetBuffer::new(offsets), Arc::new(fsl), None);
 1227 | 
 1228 |         let test_cases = TestCases::default()
 1229 |             .with_structural_encodings()
 1230 |             .with_batch_size(1);
 1231 | 
 1232 |         check_round_trip_encoding_of_data(vec![Arc::new(list_arr)], &test_cases, HashMap::new())
 1233 |             .await;
 1234 |     }
 1235 | 
 1236 |     fn create_random_fsl() -> Arc<dyn Array> {
 1237 |         // Several levels of def and multiple pages
 1238 |         let inner = array::rand_type(&DataType::Int32).with_random_nulls(0.1);
 1239 |         let list_one = array::cycle_vec(inner, Dimension::from(4)).with_random_nulls(0.1);
 1240 |         let list_two = array::cycle_vec(list_one, Dimension::from(4)).with_random_nulls(0.1);
 1241 |         let list_three = array::cycle_vec(list_two, Dimension::from(2));
 1242 | 
 1243 |         // Should be 256Ki rows ~ 1MiB of data
 1244 |         let batch = gen_batch()
 1245 |             .anon_col(list_three)
 1246 |             .into_batch_rows(RowCount::from(8 * 1024))
 1247 |             .unwrap();
 1248 |         batch.column(0).clone()
 1249 |     }
 1250 | 
 1251 |     #[test]
 1252 |     fn fsl_value_miniblock_stress() {
 1253 |         let sample_array = create_random_fsl();
 1254 | 
 1255 |         let starting_data = DataBlock::from_arrays(
 1256 |             std::slice::from_ref(&sample_array),
 1257 |             sample_array.len() as u64,
 1258 |         );
 1259 | 
 1260 |         let encoder = ValueEncoder::default();
 1261 |         let (data, compression) =
 1262 |             MiniBlockCompressor::compress(&encoder, miniblock_context(), starting_data).unwrap();
 1263 | 
 1264 |         let Compression::FixedSizeList(fsl) = compression.compression.unwrap() else {
 1265 |             panic!()
 1266 |         };
 1267 | 
 1268 |         let decompressor = ValueDecompressor::from_fsl(fsl.as_ref()).unwrap();
 1269 | 
 1270 |         let decompressed =
 1271 |             MiniBlockDecompressor::decompress(&decompressor, data.data, data.num_values).unwrap();
 1272 | 
 1273 |         let decompressed = make_array(
 1274 |             decompressed
 1275 |                 .into_arrow(sample_array.data_type().clone(), true)
 1276 |                 .unwrap(),
 1277 |         );
 1278 | 
 1279 |         assert_eq!(decompressed.as_ref(), sample_array.as_ref());
 1280 |     }
 1281 | 
 1282 |     #[test]
 1283 |     fn fsl_value_per_value_stress() {
 1284 |         let sample_array = create_random_fsl();
 1285 | 
 1286 |         let starting_data = DataBlock::from_arrays(
 1287 |             std::slice::from_ref(&sample_array),
 1288 |             sample_array.len() as u64,
 1289 |         );
 1290 | 
 1291 |         let encoder = ValueEncoder::default();
 1292 |         let (data, compression) = PerValueCompressor::compress(&encoder, starting_data).unwrap();
 1293 | 
 1294 |         let Compression::FixedSizeList(fsl) = compression.compression.unwrap() else {
 1295 |             panic!()
 1296 |         };
 1297 | 
 1298 |         let decompressor = ValueDecompressor::from_fsl(fsl.as_ref()).unwrap();
 1299 | 
 1300 |         let PerValueDataBlock::Fixed(data) = data else {
 1301 |             panic!()
 1302 |         };
 1303 | 
 1304 |         let num_values = data.num_values;
 1305 |         let decompressed =
 1306 |             FixedPerValueDecompressor::decompress(&decompressor, data, num_values).unwrap();
 1307 | 
 1308 |         let decompressed = make_array(
 1309 |             decompressed
 1310 |                 .into_arrow(sample_array.data_type().clone(), true)
 1311 |                 .unwrap(),
 1312 |         );
 1313 | 
 1314 |         assert_eq!(decompressed.as_ref(), sample_array.as_ref());
 1315 |     }
 1316 | 
 1317 |     #[rstest::rstest]
 1318 |     #[test_log::test(tokio::test)]
 1319 |     async fn test_fsl_nullable_items(
 1320 |         #[values(
 1321 |             TestEncoding::Array,
 1322 |             TestEncoding::StructuralU16,
 1323 |             TestEncoding::StructuralU32,
 1324 |             TestEncoding::StructuralSparse
 1325 |         )]
 1326 |         encoding: TestEncoding,
 1327 |     ) {
 1328 |         let mut generator =
 1329 |             gen_batch()
 1330 |                 .with_seed(Seed::from(0))
 1331 |                 .anon_col(array::rand_vec_nullable::<UInt32Type>(
 1332 |                     Dimension::from(128),
 1333 |                     0.5,
 1334 |                 ));
 1335 |         generator.with_random_nulls(0.2);
 1336 |         let source = generator
 1337 |             .into_batch_rows(RowCount::from(1026))
 1338 |             .unwrap()
 1339 |             .column(0)
 1340 |             .clone();
 1341 |         let test_cases = TestCases::default()
 1342 |             .with_page_sizes(vec![4096])
 1343 |             .with_encoding(encoding)
 1344 |             .with_batch_size(257)
 1345 |             .with_range(510..515)
 1346 |             .with_indices(vec![0, 511, 512, 1024]);
 1347 | 
 1348 |         check_round_trip_encoding_of_data(
 1349 |             vec![source.slice(1, 512), source.slice(513, 513)],
 1350 |             &test_cases,
 1351 |             HashMap::new(),
 1352 |         )
 1353 |         .await;
 1354 |     }
 1355 | 
 1356 |     #[test_log::test(tokio::test)]
 1357 |     async fn test_value_encoding_verification() {
 1358 |         use std::collections::HashMap;
 1359 | 
 1360 |         let test_cases = TestCases::default()
 1361 |             .with_expected_encoding("flat")
 1362 |             .with_structural_encodings();
 1363 | 
 1364 |         // Test both explicit configuration and automatic fallback scenarios
 1365 |         // 1. Test explicit "none" compression to force flat encoding
 1366 |         // Also explicitly disable BSS to ensure value encoding is tested
 1367 |         let mut metadata_explicit = HashMap::new();
 1368 |         metadata_explicit.insert("lance-encoding:compression".to_string(), "none".to_string());
 1369 |         metadata_explicit.insert("lance-encoding:bss".to_string(), "off".to_string());
 1370 | 
 1371 |         let arr_explicit =
 1372 |             Arc::new(Int32Array::from((0..1000).collect::<Vec<i32>>())) as Arc<dyn Array>;
 1373 |         check_round_trip_encoding_of_data(vec![arr_explicit], &test_cases, metadata_explicit).await;
 1374 | 
 1375 |         // 2. Test automatic fallback to flat encoding when bitpacking conditions aren't met
 1376 |         // Use unique values to avoid RLE encoding
 1377 |         // Explicitly disable BSS to ensure value encoding is tested
 1378 |         let mut metadata = HashMap::new();
 1379 |         metadata.insert("lance-encoding:bss".to_string(), "off".to_string());
 1380 | 
 1381 |         let arr_fallback = Arc::new(Int32Array::from(
 1382 |             (0..100).map(|i| i * 73 + 19).collect::<Vec<i32>>(),
 1383 |         )) as Arc<dyn Array>;
 1384 |         check_round_trip_encoding_of_data(vec![arr_fallback], &test_cases, metadata).await;
 1385 |     }
 1386 | 
 1387 |     #[test_log::test(tokio::test)]
 1388 |     async fn test_mixed_page_validity() {
 1389 |         let no_nulls = Arc::new(Int32Array::from_iter_values([1, 2]));
 1390 |         let has_nulls = Arc::new(Int32Array::from_iter([Some(3), None, Some(5)]));
 1391 | 
 1392 |         let test_cases = TestCases::default().with_page_sizes(vec![1]);
 1393 |         check_round_trip_encoding_of_data(vec![no_nulls, has_nulls], &test_cases, HashMap::new())
 1394 |             .await;
 1395 |     }
 1396 | }
``````
