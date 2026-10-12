> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/binary.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `0071d330e5ded535e94b421fecdee7dd3641e24ff6d61ccbf54f7ac892bc950d`. Reviewed physical lines: 1-1436.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Current variable-width mini-block, block and per-value encoders/decoders, offset validation and tests. No IO or local unsafe; the block decoder retains a frozen old-header read branch. (rust/lance-encoding/src/encodings/physical/binary.rs:1-1436)

## Complete range analysis

### Lines 1-34

SPDX and imports connect Arrow offsets/types/builders, Lance buffers/monotonicity, BlockInfo, compression traits, MAX_MINIBLOCK_VALUES and protobuf helpers. Intro describes transparent binary encoding; nested Flat offset width still supplies necessary metadata. This module does not select file versions or own nullability. (rust/lance-encoding/src/encodings/physical/binary.rs:1-34)

### Lines 35-56

Public Debug BinaryMiniBlockEncoder has private i64 minichunk_size. Default dereferences public LazyLock AIM_MINICHUNK_SIZE. Private DEFAULT_AIM_MINICHUNK_SIZE=4096; environment LANCE_BINARY_MINIBLOCK_CHUNK_SIZE missing/non-Unicode uses default string, failed i64 parsing falls back4096. Parsed zero or negative sizes are accepted; cached once process-wide. (rust/lance-encoding/src/encodings/physical/binary.rs:35-56)

### Lines 57-80

Private generic chunk_offsets receives offsets, data, alignment and target size, and defines local Debug ChunkInfo(chunk_start_offset_in_orig_idx,chunk_last_offset_in_orig_idx,bytes_start_offset,padded_chunk_size). Number of values comes from offsets.len()-1, independently of DataBlock.num_values. Empty offset vector underflows; malformed signed/nonmonotone indices are not validated here. (rust/lance-encoding/src/encodings/physical/binary.rs:57-80)

### Lines 81-113

Repeatedly choose next boundary using search_next_offset_idx, compute header bytes=(values+1)*sizeofN and referenced data span, align total size. Final chunk log0; others trailing_zeros(count), so positive logs denote powers of two. Record u32-cast size and aggregate output capacity; arithmetic and narrowing unchecked. Offsets with only one entry produce a zero-value chunk. (rust/lance-encoding/src/encodings/physical/binary.rs:81-113)

### Lines 114-152

For each chunk allocate adjusted offset vector, subtract its initial offset and add header byte count. Append native typed offsets, then referenced original data range, then pad_to alignment using local PAD_BYTE=72(0x48). Return one concatenated LanceBuffer and chunk descriptors. Offsets point into the complete chunk including offset table; encoder copies payload and offsets. 32-bit chunks use alignment4,64-bit chunks8, contrary to uniform8-byte comments. (rust/lance-encoding/src/encodings/physical/binary.rs:114-152)

### Lines 153-170

search_next_offset_idx is private generic and takes last position and i64 budget. Remaining<=1 returns offsets.len()-1. Otherwise initialize accepted count2 and candidate4; one-value nonfinal chunks cannot be represented because log0 denotes the final chunk. Budget is an aim, not a hard bound: the initial two values need not fit. (rust/lance-encoding/src/encodings/physical/binary.rs:153-170)

### Lines 171-203

If candidate reaches/passes end, return full remainder when its data plus offset table fits; otherwise keep last accepted power of two. This tail-fit branch bypasses MAX_MINIBLOCK_VALUES. For a fitting normal candidate, check candidate*2>cached maximum BEFORE accepting candidate. Thus normal cap4096 can stop at2048; a fitting tail can exceed cap, and initial2 exceeds cap1. Alignment padding is outside the budget estimate; negative target still permits initial2. No Result validation or overflow guard. (rust/lance-encoding/src/encodings/physical/binary.rs:171-203)

### Lines 204-247

new accepts Option<i64>, uses unwrap_or(*AIM_MINICHUNK_SIZE) so the lazy default is evaluated even for Some; no validation. chunk_data borrows signed i32/i64 offsets for width32/64 and calls chunk_offsets with alignment4/8. Other widths panic. Return original logical num_values, concatenated bytes/chunks and Variable(Flat(offsetwidth,None)) metadata; stats are ignored. Count/offset consistency is unchecked. (rust/lance-encoding/src/encodings/physical/binary.rs:204-247)

### Lines 248-267

MiniBlockCompressor ignores context, accepts VariableWidth only, otherwise InvalidInputSource naming unexpected data. Encoding descriptor has raw offsets and no values compression. No asynchronous work or IO. (rust/lance-encoding/src/encodings/physical/binary.rs:248-267)

### Lines 268-296

Public Debug BinaryMiniBlockDecompressor stores private u8 bits_per_offset. new asserts32or64. from_variable unwraps nested offsets/compression, requires Flat else panic, casts flat width u64 to u8 directly and does not call new. It ignores nested Flat optional data compression and Variable values compression; invalid or truncated widths may survive this alternative constructor. (rust/lance-encoding/src/encodings/physical/binary.rs:268-296)

### Lines 297-319

Private chunk_offset_violation_error assumes nonempty unsigned offsets. First descending adjacent pair produces CorruptFile with mini-block name, position and values; otherwise report final offset beyond chunk bytes. The decoder checks first/table overlap separately. (rust/lance-encoding/src/encodings/physical/binary.rs:297-319)

### Lines 320-364

Mini decode asserts exactly one buffer and unwraps it. Compute bytes_per_offset from configured width and reject nonmultiple total length as CorruptFile; malformed from_variable widths can cause zero divisor. Convert num_values to usize before checked add1, then require enough native words for requested offsets. A 32-bit target could truncate count before the check. Offset table count is external, not embedded. (rust/lance-encoding/src/encodings/physical/binary.rs:320-364)

### Lines 365-410

64-bit branch borrows the entire chunk as u64, slices requested num_values+1 offsets, and requires first>=requested table bytes. Lower bound rather than equality permits decoding a prefix of a full chunk. Allocate rebased offsets with wrapping subtraction and use branchless monotonic scan; check final offset cast to usize<=chunk length. Invalid ordering/bounds returns contextual CorruptFile. Unrequested trailing offsets are not validated. (rust/lance-encoding/src/encodings/physical/binary.rs:365-410)

### Lines 411-443

Every non64 width takes the32-bit branch. Same table-overlap, monotonicity and bounds checks precede slicing payload. Copy referenced bytes and new offsets into fresh VariableWidth block, correct branch width/count and empty BlockInfo. No UTF-8 validation, padding-byte validation or decoded_size override; zero requested rows still require one offset.64-bit offset-to-usize casts assume sufficiently wide platform. (rust/lance-encoding/src/encodings/physical/binary.rs:411-443)

### Lines 444-465

Public Debug Default VariableEncoder is a unit-like empty struct for Variable block and per-value encoding. Block compress accepts VariableWidth else InvalidInput with BinaryBlockEncoder name; derives offset width from input. Comments describe self-contained metadata prefix. (rust/lance-encoding/src/encodings/physical/binary.rs:444-465)

### Lines 466-492

32-bit block path borrows offsets as u32, reserves 8+offset bytes+all value bytes, writes u32LE32 and u32LE bytes_start=8+offset bytes, then original offset bytes and entire data buffer. Does not rebase offsets or reconcile num_values, offset count and payload length. Casts and size arithmetic unchecked. (rust/lance-encoding/src/encodings/physical/binary.rs:466-492)

### Lines 493-535

64-bit path writes u64LE64 and u64LE bytes_start=16+offset bytes, followed by unchanged offsets/data in new owned allocation. Other widths InvalidInput. Return Some(buffer) and Variable(Flat(width,None)); empty logical data still needs valid offset/header representation for decode. (rust/lance-encoding/src/encodings/physical/binary.rs:493-535)

### Lines 536-559

PerValueCompressor moves VariableWidth input unchanged into PerValueDataBlock with Variable(Flat(width,None)); unsupported variant panics, and no width/count/offset validation occurs. Public Debug Default VariableDecoder implements VariablePerValueDecompressor as an Ok passthrough, retaining buffers/stats unchanged. (rust/lance-encoding/src/encodings/physical/binary.rs:536-559)

### Lines 560-593

Public Debug Default BinaryBlockDecompressor requires Some data even for zero count. Fewer than4 bytes CorruptFile. Any nonzero byte among positions1,2,3 selects frozen old format; otherwise standard format. The heuristic can misclassify old counts with low24bits zero. Legacy branch is a preserved read surface, not a basis for new feature design. (rust/lance-encoding/src/encodings/physical/binary.rs:560-593)

### Lines 594-629

Old32 header length9: byte0 width32,u32LE encoded count1..5 (debug equality with external count asu32),u32LE bytes_start5..9,offsets start9. Old64 length17: byte0 width64,u64LE count1..9 debug-check,u64LE bytes_start9..17,offsets start17. Short headers CorruptFile; unsupported width InvalidInputSource. External count controls release behavior. (rust/lance-encoding/src/encodings/physical/binary.rs:594-629)

### Lines 630-683

Standard path reads low32 width word and casts tou8;32 requires8 bytes with u32 data start,64 requires16 bytes with u64 data start. High bytes4..8 of the64-bit width word are not checked. Validate checked(count+1)*bytes_per_offset and that bytes_start is between offsets_start and total length, otherwise CorruptFile. (rust/lance-encoding/src/encodings/physical/binary.rs:630-683)

### Lines 684-715

Require offset bytes exactly match expected count and first offset exactly zero, then return zero-copy shared offset/data slices with external count/fresh stats. Does not validate remaining offset monotonicity, terminal bounds or UTF-8 here. Those checks occur at mandatory VariableWidthBlock into_arrow conversion. Thus block decode success is not full Arrow validity. (rust/lance-encoding/src/data.rs:735-962; rust/lance-encoding/src/data.rs:1186-1227) (rust/lance-encoding/src/encodings/physical/binary.rs:684-715)

### Lines 716-741

Private cfg(test) module imports async/rstest harness, four encoding modes, binary/String arrays, encoding strategy and datagen. Tests are source evidence, not run by this KB task. (rust/lance-encoding/src/encodings/physical/binary.rs:716-741)

### Lines 742-764

test_utf8_binary parameterizes3 structural modes,2 page maxima and2 slicing choices:12 configurations of nonnullable UTF-8. Uses harness to validate generic IO/ranges/takes, not a standalone mini-block byte fixture. (rust/lance-encoding/src/encodings/physical/binary.rs:742-764)

### Lines 765-790

test_binary parameterizes forced mini/full layout, Utf8/Binary,4 modes,2 page limits,2 slicing choices:64 configurations with nullable data. Broad roundtrip coverage does not prove direct invalid-input behavior. (rust/lance-encoding/src/encodings/physical/binary.rs:765-790)

### Lines 791-820

test_binary_fsst adds forced fsst for2layouts*2normaltypes*3modes*2pages*2slice=48 configurations. Nullable test uses default TestCases and references issue4783 TODO; no external issue status verified. (rust/lance-encoding/src/encodings/physical/binary.rs:791-820)

### Lines 821-852

test_fsst_large_binary similarly uses LargeBinary/LargeUtf8 across48 combinations, with basic test cases. Expected FSST metadata/strategy goes through harness; does not cover malformed symbol tables here. (rust/lance-encoding/src/encodings/physical/binary.rs:821-852)

### Lines 853-870

test_large_binary_types spans2types*4modes*2pages*2slice=32 configurations with nullable generated arrays and default cases. (rust/lance-encoding/src/encodings/physical/binary.rs:853-870)

### Lines 871-904

test_small_strings builds user_ counter strings, parameterizes2layouts*4modes*2pages*2slice=32, and validates through harness. Explicit field metadata forces layout when requested. (rust/lance-encoding/src/encodings/physical/binary.rs:871-904)

### Lines 905-933

test_simple_binary spans2layouts*2types, data abc,null,pqr,null,m. Adds ranges0..2,0..3,1..3 and take0,1,3,4. Covers nullable interior/end placement, not direct offset header corruption. (rust/lance-encoding/src/encodings/physical/binary.rs:905-933)

### Lines 934-950

test_sliced_utf8 constructs abc,de,null,fgh and slices(1,3), exercising nonzero source offset/nullable strings with three ranges. (rust/lance-encoding/src/encodings/physical/binary.rs:934-950)

### Lines 951-984

Oversized-value test places a2MiB string among four small/null values with1MiB page limit across4 modes. Verifies a value larger than max page target is handled by harness, not a hard allocation ceiling. (rust/lance-encoding/src/encodings/physical/binary.rs:951-984)

### Lines 985-1010

Nondivisible page test makes90 values of45000 bytes, splits into4 source parts and uses1MiB page size across4 modes. Targets row partition/remainder handling rather than compression efficiency. (rust/lance-encoding/src/encodings/physical/binary.rs:985-1010)

### Lines 1011-1051

Empty-string test checks three permutations of abc,empty,null with takes0,1,2 and single-position takes, then repeats with batch size1. Also tests empty,null,empty with ranges/takes under default and batch1; empty values and nulls are distinct. (rust/lance-encoding/src/encodings/physical/binary.rs:1011-1051)

### Lines 1052-1071

Ignored jumbo test creates5000 strings of1MiB in LargeString (>4GiB), uses no_validation harness. #[ignore] has no issue URL. Comment about lists of lists disagrees with actual string fixture. It is not active runtime evidence or established >4GiB correctness. (rust/lance-encoding/src/encodings/physical/binary.rs:1052-1071)

### Lines 1072-1099

Dictionary test parameterizes nullability and dictionary sizes100,500,35000 (six cases),70000 rows and nullable every7th item, then exercises structural-mode harness. This is dictionary selection integration, not a local dictionary implementation. (rust/lance-encoding/src/encodings/physical/binary.rs:1072-1099)

### Lines 1100-1129

Encoding verification requires variable encoding automatically for1000 random10-byte UTF-8 strings, and explicitly disables compression for2000 random50-byte strings. Uses structural cases and expected encoding name. (rust/lance-encoding/src/encodings/physical/binary.rs:1100-1129)

### Lines 1130-1192

Misaligned32-bit decoder fixture prefixes1 byte, offsets12,15,20 and payloadABCXYZ plus two zeros. Assert pointer misalignment, decode2rows, and compare first6 bytes only. Does not assert full offsets or prove padding excluded; terminal20 includes the two trailing zero bytes in visible values. (rust/lance-encoding/src/encodings/physical/binary.rs:1130-1192)

### Lines 1193-1245

Misaligned64 fixture prefixes3bytes, offsets24,29,40 and HelloWorld plus6zeros. Assert misalignment, rows2 and first10 bytes only. Entire visible decoded payload also includes zero padding selected by terminal40. Tests LanceBuffer typed-borrow alignment fallback indirectly. (rust/lance-encoding/src/encodings/physical/binary.rs:1193-1245)

### Lines 1246-1305

Corrupt-mini test local chunk_u32 builds offset bytes/payload padded to8.32-bit cases terminal out-of-bounds, descending offsets, table overlap, insufficient offset count and nonmultiple total size; each requires CorruptFile and message substring. Valid alpha,beta,gamma case asserts entire payload and rebased offsets0,5,9,14. (rust/lance-encoding/src/encodings/physical/binary.rs:1246-1305)

### Lines 1306-1345

Same test local chunk_u64 pads to8 and covers64-bit out-of-bounds and table overlap errors. Does not add64-bit descending, insufficient-table or nonmultiple cases here. (rust/lance-encoding/src/encodings/physical/binary.rs:1306-1345)

### Lines 1346-1368

Private test helper encoded_binary_block accepts32/64, builds offsets0,5,9,14 for alphabetagamma count3 and returns output of VariableEncoder block compression. Other widths unreachable. (rust/lance-encoding/src/encodings/physical/binary.rs:1346-1368)

### Lines 1369-1404

Four named parameter cases corrupt terminal32 to100000,terminal64 to15,or middle offset to4 for either width. BinaryBlockDecompressor must succeed; converting to Binary/LargeBinary Arrow with false still must return CorruptFile and expected substring. This explicitly locates full offset validation after block decompression. (rust/lance-encoding/src/encodings/physical/binary.rs:1369-1404)

### Lines 1405-1436

Structure test rejects nonzero first offset5,external count4 against3-row data,and2-byte header, checking CorruptFile/message. Overall18 test functions,17 active and one ignored, plus helpers. No direct search budget/cap tests, zero-row decode, prefix decode, invalid from_variable widths or old-header regression appears locally; tests inspected only. (rust/lance-encoding/src/encodings/physical/binary.rs:1405-1436)

## Interaction and interpretation limits

Every physical source line read in bounded untruncated ANALYZE75 outputs. No source build/test/lint/benchmark/generator or installation ran. Contextual dependencies remain partially read; potential failure paths are source deductions, not runtime reproductions.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Basic encodings for variable width data
    5 | //!
    6 | //! These are not compression but represent the "leaf" encodings for variable length data
    7 | //! where we simply match the data with the rules of the structural encoding.
    8 | //!
    9 | //! These encodings are transparent since we aren't actually doing any compression.  No information
   10 | //! is needed in the encoding description.
   11 | 
   12 | use arrow_array::OffsetSizeTrait;
   13 | use byteorder::{ByteOrder, LittleEndian};
   14 | use core::panic;
   15 | 
   16 | use crate::compression::{
   17 |     BlockCompressor, BlockDecompressor, MiniBlockDecompressor, VariablePerValueDecompressor,
   18 |     require_block_payload,
   19 | };
   20 | 
   21 | use crate::buffer::LanceBuffer;
   22 | use crate::data::{BlockInfo, DataBlock, VariableWidthBlock};
   23 | use crate::encodings::logical::primitive::fullzip::{PerValueCompressor, PerValueDataBlock};
   24 | use crate::encodings::logical::primitive::miniblock::{
   25 |     MAX_MINIBLOCK_VALUES, MiniBlockChunk, MiniBlockCompressed, MiniBlockCompressionContext,
   26 |     MiniBlockCompressor,
   27 | };
   28 | use crate::format::pb21::CompressiveEncoding;
   29 | use crate::format::pb21::compressive_encoding::Compression;
   30 | use crate::format::{ProtobufUtils21, pb21};
   31 | 
   32 | use lance_core::utils::bit::pad_bytes_to;
   33 | use lance_core::{Error, Result};
   34 | 
   35 | #[derive(Debug)]
   36 | pub struct BinaryMiniBlockEncoder {
   37 |     minichunk_size: i64,
   38 | }
   39 | 
   40 | impl Default for BinaryMiniBlockEncoder {
   41 |     fn default() -> Self {
   42 |         Self {
   43 |             minichunk_size: *AIM_MINICHUNK_SIZE,
   44 |         }
   45 |     }
   46 | }
   47 | 
   48 | const DEFAULT_AIM_MINICHUNK_SIZE: i64 = 4 * 1024;
   49 | 
   50 | pub static AIM_MINICHUNK_SIZE: std::sync::LazyLock<i64> = std::sync::LazyLock::new(|| {
   51 |     std::env::var("LANCE_BINARY_MINIBLOCK_CHUNK_SIZE")
   52 |         .unwrap_or_else(|_| DEFAULT_AIM_MINICHUNK_SIZE.to_string())
   53 |         .parse::<i64>()
   54 |         .unwrap_or(DEFAULT_AIM_MINICHUNK_SIZE)
   55 | });
   56 | 
   57 | // Make it to support both u32 and u64
   58 | fn chunk_offsets<N: OffsetSizeTrait>(
   59 |     offsets: &[N],
   60 |     data: &[u8],
   61 |     alignment: usize,
   62 |     minichunk_size: i64,
   63 | ) -> (Vec<LanceBuffer>, Vec<MiniBlockChunk>) {
   64 |     #[derive(Debug)]
   65 |     struct ChunkInfo {
   66 |         chunk_start_offset_in_orig_idx: usize,
   67 |         chunk_last_offset_in_orig_idx: usize,
   68 |         // the bytes in every chunk starts at `chunk.bytes_start_offset`
   69 |         bytes_start_offset: usize,
   70 |         // every chunk is padded to 8 bytes.
   71 |         // we need to interpret every chunk as &[u32] so we need it to padded at least to 4 bytes,
   72 |         // this field can actually be eliminated and I can use `num_bytes` in `MiniBlockChunk` to compute
   73 |         // the `output_total_bytes`.
   74 |         padded_chunk_size: usize,
   75 |     }
   76 | 
   77 |     let byte_width: usize = N::get_byte_width();
   78 |     let mut chunks_info = vec![];
   79 |     let mut chunks = vec![];
   80 |     let mut last_offset_in_orig_idx = 0;
   81 |     loop {
   82 |         let this_last_offset_in_orig_idx =
   83 |             search_next_offset_idx(offsets, last_offset_in_orig_idx, minichunk_size);
   84 | 
   85 |         let num_values_in_this_chunk = this_last_offset_in_orig_idx - last_offset_in_orig_idx;
   86 |         let chunk_bytes = offsets[this_last_offset_in_orig_idx] - offsets[last_offset_in_orig_idx];
   87 |         let this_chunk_size =
   88 |             (num_values_in_this_chunk + 1) * byte_width + chunk_bytes.to_usize().unwrap();
   89 | 
   90 |         let padded_chunk_size = this_chunk_size.next_multiple_of(alignment);
   91 |         debug_assert!(padded_chunk_size > 0);
   92 | 
   93 |         let this_chunk_bytes_start_offset = (num_values_in_this_chunk + 1) * byte_width;
   94 |         chunks_info.push(ChunkInfo {
   95 |             chunk_start_offset_in_orig_idx: last_offset_in_orig_idx,
   96 |             chunk_last_offset_in_orig_idx: this_last_offset_in_orig_idx,
   97 |             bytes_start_offset: this_chunk_bytes_start_offset,
   98 |             padded_chunk_size,
   99 |         });
  100 |         chunks.push(MiniBlockChunk {
  101 |             log_num_values: if this_last_offset_in_orig_idx == offsets.len() - 1 {
  102 |                 0
  103 |             } else {
  104 |                 num_values_in_this_chunk.trailing_zeros() as u8
  105 |             },
  106 |             buffer_sizes: vec![padded_chunk_size as u32],
  107 |         });
  108 |         if this_last_offset_in_orig_idx == offsets.len() - 1 {
  109 |             break;
  110 |         }
  111 |         last_offset_in_orig_idx = this_last_offset_in_orig_idx;
  112 |     }
  113 | 
  114 |     let output_total_bytes = chunks_info
  115 |         .iter()
  116 |         .map(|chunk_info| chunk_info.padded_chunk_size)
  117 |         .sum::<usize>();
  118 | 
  119 |     let mut output: Vec<u8> = Vec::with_capacity(output_total_bytes);
  120 | 
  121 |     for chunk in chunks_info {
  122 |         let this_chunk_offsets: Vec<N> = offsets
  123 |             [chunk.chunk_start_offset_in_orig_idx..=chunk.chunk_last_offset_in_orig_idx]
  124 |             .iter()
  125 |             .map(|offset| {
  126 |                 *offset - offsets[chunk.chunk_start_offset_in_orig_idx]
  127 |                     + N::from_usize(chunk.bytes_start_offset).unwrap()
  128 |             })
  129 |             .collect();
  130 | 
  131 |         let this_chunk_offsets = LanceBuffer::reinterpret_vec(this_chunk_offsets);
  132 |         output.extend_from_slice(&this_chunk_offsets);
  133 | 
  134 |         let start_in_orig = offsets[chunk.chunk_start_offset_in_orig_idx]
  135 |             .to_usize()
  136 |             .unwrap();
  137 |         let end_in_orig = offsets[chunk.chunk_last_offset_in_orig_idx]
  138 |             .to_usize()
  139 |             .unwrap();
  140 |         output.extend_from_slice(&data[start_in_orig..end_in_orig]);
  141 | 
  142 |         // pad this chunk to make it align to desired bytes.
  143 |         const PAD_BYTE: u8 = 72;
  144 |         let pad_len = pad_bytes_to(output.len(), alignment);
  145 | 
  146 |         // Compare with usize literal to avoid type mismatch with N
  147 |         if pad_len > 0_usize {
  148 |             output.extend(std::iter::repeat_n(PAD_BYTE, pad_len));
  149 |         }
  150 |     }
  151 |     (vec![LanceBuffer::reinterpret_vec(output)], chunks)
  152 | }
  153 | 
  154 | // search for the next offset index to cut the values into a chunk.
  155 | // this function incrementally peek the number of values in a chunk,
  156 | // each time multiplies the number of values by 2.
  157 | // It returns the offset_idx in `offsets` that belongs to this chunk.
  158 | fn search_next_offset_idx<N: OffsetSizeTrait>(
  159 |     offsets: &[N],
  160 |     last_offset_idx: usize,
  161 |     minichunk_size: i64,
  162 | ) -> usize {
  163 |     // MiniBlockChunk uses `log_num_values == 0` as a sentinel for the final chunk. This means we
  164 |     // must avoid creating 1-value chunks except for the final chunk, even if the configured
  165 |     // `minichunk_size` is too small to fit more than one value.
  166 |     let remaining_values = offsets.len().saturating_sub(last_offset_idx + 1);
  167 |     if remaining_values <= 1 {
  168 |         return offsets.len() - 1;
  169 |     }
  170 | 
  171 |     let mut num_values = 2;
  172 |     let mut new_num_values = num_values * 2;
  173 |     loop {
  174 |         if last_offset_idx + new_num_values >= offsets.len() {
  175 |             let existing_bytes = offsets[offsets.len() - 1] - offsets[last_offset_idx];
  176 |             // existing bytes plus the new offset size
  177 |             let new_size = existing_bytes
  178 |                 + N::from_usize((offsets.len() - last_offset_idx) * N::get_byte_width()).unwrap();
  179 |             if new_size.to_i64().unwrap() <= minichunk_size {
  180 |                 // case 1: can fit the rest of all data into a miniblock
  181 |                 return offsets.len() - 1;
  182 |             } else {
  183 |                 // case 2: can only fit the last tried `num_values` into a miniblock
  184 |                 return last_offset_idx + num_values;
  185 |             }
  186 |         }
  187 |         let existing_bytes = offsets[last_offset_idx + new_num_values] - offsets[last_offset_idx];
  188 |         let new_size =
  189 |             existing_bytes + N::from_usize((new_num_values + 1) * N::get_byte_width()).unwrap();
  190 |         if new_size.to_i64().unwrap() <= minichunk_size {
  191 |             if new_num_values * 2 > *MAX_MINIBLOCK_VALUES as usize {
  192 |                 // hit the max number of values limit
  193 |                 break;
  194 |             }
  195 |             num_values = new_num_values;
  196 |             new_num_values *= 2;
  197 |         } else {
  198 |             break;
  199 |         }
  200 |     }
  201 |     last_offset_idx + num_values
  202 | }
  203 | 
  204 | impl BinaryMiniBlockEncoder {
  205 |     pub fn new(minichunk_size: Option<i64>) -> Self {
  206 |         Self {
  207 |             minichunk_size: minichunk_size.unwrap_or(*AIM_MINICHUNK_SIZE),
  208 |         }
  209 |     }
  210 | 
  211 |     // put binary data into chunks, every chunk is less than or equal to `minichunk_size`.
  212 |     // In each chunk, offsets are put first then followed by binary bytes data, each chunk is padded to 8 bytes.
  213 |     // the offsets in the chunk points to the bytes offset in this chunk.
  214 |     fn chunk_data(&self, data: VariableWidthBlock) -> (MiniBlockCompressed, CompressiveEncoding) {
  215 |         // TODO: Support compression of offsets
  216 |         // TODO: Support general compression of data
  217 |         match data.bits_per_offset {
  218 |             32 => {
  219 |                 let offsets = data.offsets.borrow_to_typed_slice::<i32>();
  220 |                 let (buffers, chunks) =
  221 |                     chunk_offsets(offsets.as_ref(), &data.data, 4, self.minichunk_size);
  222 |                 (
  223 |                     MiniBlockCompressed {
  224 |                         data: buffers,
  225 |                         chunks,
  226 |                         num_values: data.num_values,
  227 |                     },
  228 |                     ProtobufUtils21::variable(ProtobufUtils21::flat(32, None), None),
  229 |                 )
  230 |             }
  231 |             64 => {
  232 |                 let offsets = data.offsets.borrow_to_typed_slice::<i64>();
  233 |                 let (buffers, chunks) =
  234 |                     chunk_offsets(offsets.as_ref(), &data.data, 8, self.minichunk_size);
  235 |                 (
  236 |                     MiniBlockCompressed {
  237 |                         data: buffers,
  238 |                         chunks,
  239 |                         num_values: data.num_values,
  240 |                     },
  241 |                     ProtobufUtils21::variable(ProtobufUtils21::flat(64, None), None),
  242 |                 )
  243 |             }
  244 |             _ => panic!("Unsupported bits_per_offset={}", data.bits_per_offset),
  245 |         }
  246 |     }
  247 | }
  248 | 
  249 | impl MiniBlockCompressor for BinaryMiniBlockEncoder {
  250 |     fn compress(
  251 |         &self,
  252 |         _context: MiniBlockCompressionContext,
  253 |         data: DataBlock,
  254 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
  255 |         match data {
  256 |             DataBlock::VariableWidth(variable_width) => Ok(self.chunk_data(variable_width)),
  257 |             _ => Err(Error::invalid_input_source(
  258 |                 format!(
  259 |                     "Cannot compress a data block of type {} with BinaryMiniBlockEncoder",
  260 |                     data.name()
  261 |                 )
  262 |                 .into(),
  263 |             )),
  264 |         }
  265 |     }
  266 | }
  267 | 
  268 | #[derive(Debug)]
  269 | pub struct BinaryMiniBlockDecompressor {
  270 |     bits_per_offset: u8,
  271 | }
  272 | 
  273 | impl BinaryMiniBlockDecompressor {
  274 |     pub fn new(bits_per_offset: u8) -> Self {
  275 |         assert!(bits_per_offset == 32 || bits_per_offset == 64);
  276 |         Self { bits_per_offset }
  277 |     }
  278 | 
  279 |     pub fn from_variable(variable: &pb21::Variable) -> Self {
  280 |         if let Compression::Flat(flat) = variable
  281 |             .offsets
  282 |             .as_ref()
  283 |             .unwrap()
  284 |             .compression
  285 |             .as_ref()
  286 |             .unwrap()
  287 |         {
  288 |             Self {
  289 |                 bits_per_offset: flat.bits_per_value as u8,
  290 |             }
  291 |         } else {
  292 |             panic!("Unsupported offsets compression: {:?}", variable.offsets);
  293 |         }
  294 |     }
  295 | }
  296 | 
  297 | /// Cold path: pinpoint why the chunk-relative offsets of a binary mini-block
  298 | /// chunk failed validation.
  299 | fn chunk_offset_violation_error<T: Copy + Into<u64>>(offsets: &[T], chunk_len: usize) -> Error {
  300 |     let mut previous: u64 = offsets[0].into();
  301 |     for (position, &offset) in offsets.iter().enumerate().skip(1) {
  302 |         let offset: u64 = offset.into();
  303 |         if offset < previous {
  304 |             return Error::corrupt_file_named(
  305 |                 "binary mini-block",
  306 |                 format!(
  307 |                     "value offset at position {position} decreases: {offset} < {previous} \
  308 |                      (chunk is {chunk_len} bytes)"
  309 |                 ),
  310 |             );
  311 |         }
  312 |         previous = offset;
  313 |     }
  314 |     Error::corrupt_file_named(
  315 |         "binary mini-block",
  316 |         format!("value offset {previous} is out of bounds for a chunk of {chunk_len} bytes"),
  317 |     )
  318 | }
  319 | 
  320 | impl MiniBlockDecompressor for BinaryMiniBlockDecompressor {
  321 |     // decompress a MiniBlock of binary data, the num_values must be less than or equal
  322 |     // to the number of values this MiniBlock has, BinaryMiniBlock doesn't store `the number of values`
  323 |     // it has so assertion can not be done here and the caller of `decompress` must ensure
  324 |     // `num_values` <= number of values in the chunk.
  325 |     //
  326 |     // The chunk-relative value offsets at the front of the chunk come straight
  327 |     // from the file and are used to slice the chunk buffer, so corrupt values
  328 |     // must surface as a typed error instead of a panic or an out-of-bounds
  329 |     // read.  The monotonicity check rides along the existing rebase loop (the
  330 |     // `&=` accumulation keeps it branchless) so validation adds no extra pass.
  331 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  332 |         assert_eq!(data.len(), 1);
  333 |         let data = data.into_iter().next().unwrap();
  334 | 
  335 |         let bytes_per_offset = self.bits_per_offset as usize / 8;
  336 |         if !data.len().is_multiple_of(bytes_per_offset) {
  337 |             return Err(Error::corrupt_file_named(
  338 |                 "binary mini-block",
  339 |                 format!(
  340 |                     "chunk size {} is not a multiple of the {}-byte offset width",
  341 |                     data.len(),
  342 |                     bytes_per_offset
  343 |                 ),
  344 |             ));
  345 |         }
  346 |         let num_offsets = (num_values as usize).checked_add(1).ok_or_else(|| {
  347 |             Error::corrupt_file_named(
  348 |                 "binary mini-block",
  349 |                 format!("cannot decode {num_values} values from a single chunk"),
  350 |             )
  351 |         })?;
  352 |         if data.len() / bytes_per_offset < num_offsets {
  353 |             return Err(Error::corrupt_file_named(
  354 |                 "binary mini-block",
  355 |                 format!(
  356 |                     "chunk of {} bytes holds {} offsets but decoding {} values requires {}",
  357 |                     data.len(),
  358 |                     data.len() / bytes_per_offset,
  359 |                     num_values,
  360 |                     num_offsets
  361 |                 ),
  362 |             ));
  363 |         }
  364 | 
  365 |         // The value region must start past the offsets being decoded, otherwise
  366 |         // the offset table itself aliases into the value bytes.  A lower bound
  367 |         // (not equality) because a prefix read of the chunk legitimately leaves
  368 |         // unrequested offsets between the requested prefix and the values.
  369 |         let min_value_region_start = num_offsets * bytes_per_offset;
  370 |         let value_region_overlap_error = |first: u64| {
  371 |             Error::corrupt_file_named(
  372 |                 "binary mini-block",
  373 |                 format!(
  374 |                     "value region starts at offset {first} which overlaps the {num_offsets} \
  375 |                      requested offsets ({min_value_region_start} bytes)"
  376 |                 ),
  377 |             )
  378 |         };
  379 | 
  380 |         if self.bits_per_offset == 64 {
  381 |             let offsets_buffer = data.borrow_to_typed_slice::<u64>();
  382 |             let offsets = &offsets_buffer.as_ref()[..num_offsets];
  383 | 
  384 |             let first = offsets[0];
  385 |             if first < min_value_region_start as u64 {
  386 |                 return Err(value_region_overlap_error(first));
  387 |             }
  388 |             let mut previous = first;
  389 |             let mut is_monotonic = true;
  390 |             let result_offsets = offsets
  391 |                 .iter()
  392 |                 .map(|&offset| {
  393 |                     is_monotonic &= previous <= offset;
  394 |                     previous = offset;
  395 |                     offset.wrapping_sub(first)
  396 |                 })
  397 |                 .collect::<Vec<u64>>();
  398 |             let last = offsets[num_offsets - 1];
  399 |             if !is_monotonic || last as usize > data.len() {
  400 |                 return Err(chunk_offset_violation_error(offsets, data.len()));
  401 |             }
  402 | 
  403 |             Ok(DataBlock::VariableWidth(VariableWidthBlock {
  404 |                 data: LanceBuffer::from(data[first as usize..last as usize].to_vec()),
  405 |                 offsets: LanceBuffer::reinterpret_vec(result_offsets),
  406 |                 bits_per_offset: 64,
  407 |                 num_values,
  408 |                 block_info: BlockInfo::new(),
  409 |             }))
  410 |         } else {
  411 |             let offsets_buffer = data.borrow_to_typed_slice::<u32>();
  412 |             let offsets = &offsets_buffer.as_ref()[..num_offsets];
  413 | 
  414 |             let first = offsets[0];
  415 |             if (first as u64) < min_value_region_start as u64 {
  416 |                 return Err(value_region_overlap_error(first as u64));
  417 |             }
  418 |             let mut previous = first;
  419 |             let mut is_monotonic = true;
  420 |             let result_offsets = offsets
  421 |                 .iter()
  422 |                 .map(|&offset| {
  423 |                     is_monotonic &= previous <= offset;
  424 |                     previous = offset;
  425 |                     offset.wrapping_sub(first)
  426 |                 })
  427 |                 .collect::<Vec<u32>>();
  428 |             let last = offsets[num_offsets - 1];
  429 |             if !is_monotonic || last as usize > data.len() {
  430 |                 return Err(chunk_offset_violation_error(offsets, data.len()));
  431 |             }
  432 | 
  433 |             Ok(DataBlock::VariableWidth(VariableWidthBlock {
  434 |                 data: LanceBuffer::from(data[first as usize..last as usize].to_vec()),
  435 |                 offsets: LanceBuffer::reinterpret_vec(result_offsets),
  436 |                 bits_per_offset: 32,
  437 |                 num_values,
  438 |                 block_info: BlockInfo::new(),
  439 |             }))
  440 |         }
  441 |     }
  442 | }
  443 | 
  444 | /// Most basic encoding for variable-width data which does no compression at all
  445 | /// The DataBlock memory layout looks like below:
  446 | ///
  447 | /// | bits_per_offset           | bytes_start_offset        | offsets data | bytes data |
  448 | /// | ------------------------- | ------------------------- | ------------ | ---------- |
  449 | /// | <bits_per_offset>/8 bytes | <bits_per_offset>/8 bytes | offsets_len  | data_len   |
  450 | ///
  451 | /// It's used in VariableEncoder and BinaryBlockDecompressor
  452 | ///
  453 | #[derive(Debug, Default)]
  454 | pub struct VariableEncoder {}
  455 | 
  456 | impl BlockCompressor for VariableEncoder {
  457 |     fn compress(&self, mut data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
  458 |         let bits_per_offset = match &data {
  459 |             DataBlock::VariableWidth(data) => data.bits_per_offset,
  460 |             _ => {
  461 |                 return Err(Error::invalid_input(
  462 |                     "BinaryBlockEncoder requires a variable-width block",
  463 |                 ));
  464 |             }
  465 |         };
  466 |         match data {
  467 |             DataBlock::VariableWidth(ref mut variable_width_data) => {
  468 |                 match variable_width_data.bits_per_offset {
  469 |                     32 => {
  470 |                         let offsets = variable_width_data.offsets.borrow_to_typed_slice::<u32>();
  471 |                         let offsets = offsets.as_ref();
  472 |                         // The first 4 bytes store the bits per offset, the next 4 bytes store the start
  473 |                         // offset of the bytes data, then offsets data, then bytes data.
  474 |                         let bytes_start_offset = 4 + 4 + std::mem::size_of_val(offsets) as u32;
  475 | 
  476 |                         let output_total_bytes =
  477 |                             bytes_start_offset as usize + variable_width_data.data.len();
  478 |                         let mut output: Vec<u8> = Vec::with_capacity(output_total_bytes);
  479 | 
  480 |                         // Store bit_per_offset info
  481 |                         output.extend_from_slice(&(32_u32).to_le_bytes());
  482 | 
  483 |                         // store `bytes_start_offset` in the next 4 bytes of output buffer
  484 |                         output.extend_from_slice(&(bytes_start_offset).to_le_bytes());
  485 | 
  486 |                         // store offsets
  487 |                         output.extend_from_slice(&variable_width_data.offsets);
  488 | 
  489 |                         // store bytes
  490 |                         output.extend_from_slice(&variable_width_data.data);
  491 |                         Ok(LanceBuffer::from(output))
  492 |                     }
  493 |                     64 => {
  494 |                         let offsets = variable_width_data.offsets.borrow_to_typed_slice::<u64>();
  495 |                         let offsets = offsets.as_ref();
  496 |                         // The first 8 bytes store the bits per offset, the next 8 bytes store the start
  497 |                         // offset of the bytes data, then offsets data, then bytes data.
  498 |                         let bytes_start_offset = 8 + 8 + std::mem::size_of_val(offsets) as u64;
  499 | 
  500 |                         let output_total_bytes =
  501 |                             bytes_start_offset as usize + variable_width_data.data.len();
  502 |                         let mut output: Vec<u8> = Vec::with_capacity(output_total_bytes);
  503 | 
  504 |                         // Store bit_per_offset info
  505 |                         output.extend_from_slice(&(64_u64).to_le_bytes());
  506 | 
  507 |                         // store `bytes_start_offset` in the next 8 bytes of output buffer
  508 |                         output.extend_from_slice(&(bytes_start_offset).to_le_bytes());
  509 | 
  510 |                         // store offsets
  511 |                         output.extend_from_slice(&variable_width_data.offsets);
  512 | 
  513 |                         // store bytes
  514 |                         output.extend_from_slice(&variable_width_data.data);
  515 |                         Ok(LanceBuffer::from(output))
  516 |                     }
  517 |                     _ => Err(Error::invalid_input(format!(
  518 |                         "BinaryBlockEncoder does not support {}-bit offsets",
  519 |                         variable_width_data.bits_per_offset
  520 |                     ))),
  521 |                 }
  522 |             }
  523 |             _ => unreachable!("variable-width input was validated above"),
  524 |         }
  525 |         .map(|payload| {
  526 |             (
  527 |                 Some(payload),
  528 |                 ProtobufUtils21::variable(
  529 |                     ProtobufUtils21::flat(bits_per_offset as u64, None),
  530 |                     None,
  531 |                 ),
  532 |             )
  533 |         })
  534 |     }
  535 | }
  536 | 
  537 | impl PerValueCompressor for VariableEncoder {
  538 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  539 |         let DataBlock::VariableWidth(variable) = data else {
  540 |             panic!("BinaryPerValueCompressor can only work with Variable Width DataBlock.");
  541 |         };
  542 | 
  543 |         let encoding = ProtobufUtils21::variable(
  544 |             ProtobufUtils21::flat(variable.bits_per_offset as u64, None),
  545 |             None,
  546 |         );
  547 |         Ok((PerValueDataBlock::Variable(variable), encoding))
  548 |     }
  549 | }
  550 | 
  551 | #[derive(Debug, Default)]
  552 | pub struct VariableDecoder {}
  553 | 
  554 | impl VariablePerValueDecompressor for VariableDecoder {
  555 |     fn decompress(&self, data: VariableWidthBlock) -> Result<DataBlock> {
  556 |         Ok(DataBlock::VariableWidth(data))
  557 |     }
  558 | }
  559 | 
  560 | #[derive(Debug, Default)]
  561 | pub struct BinaryBlockDecompressor {}
  562 | 
  563 | impl BlockDecompressor for BinaryBlockDecompressor {
  564 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  565 |         let data = require_block_payload(data, "Binary block")?;
  566 |         // In older (not quite stable) versions we stored the bits per offset as a single byte and then the num_values
  567 |         // as four bytes.  However, this led to alignment problems and was wasteful since we already store the num_values
  568 |         // in higher layers.
  569 |         //
  570 |         // In the standard scheme we use 4 bytes for the bits per offset and 4 bytes for the bytes_start_offset and we
  571 |         // rely on the passed in num_values to be correct.
  572 | 
  573 |         // This isn't perfect but it's probably good enough and the best I think we can do.  The bits per offset will
  574 |         // never be more than 255 and it's little endian so the last 3 bytes will always be 0.  These will be the least
  575 |         // significant 3 bytes of the number of values in the old scheme.  It's pretty unlikely these are all 0 (that would
  576 |         // mean there are at least 16M values in a single page) so we'll use this to determine if the old scheme is used.
  577 |         //
  578 |         // The header fields and the offsets themselves come straight from the file.
  579 |         // The structural checks below (all O(1)) reject blocks whose regions do not
  580 |         // line up; the offset *values* are validated later, by the mandatory layout
  581 |         // validation in `VariableWidthBlock::into_arrow`, so they are not rescanned
  582 |         // here.
  583 |         if data.len() < 4 {
  584 |             return Err(Error::corrupt_file_named(
  585 |                 "variable-width block",
  586 |                 format!(
  587 |                     "block of {} bytes is too small to hold a header",
  588 |                     data.len()
  589 |                 ),
  590 |             ));
  591 |         }
  592 |         let is_old_scheme = data[1] != 0 || data[2] != 0 || data[3] != 0;
  593 | 
  594 |         let ensure_header = |header_len: usize| {
  595 |             if data.len() < header_len {
  596 |                 return Err(Error::corrupt_file_named(
  597 |                     "variable-width block",
  598 |                     format!(
  599 |                         "block of {} bytes is too small for a {} byte header",
  600 |                         data.len(),
  601 |                         header_len
  602 |                     ),
  603 |                 ));
  604 |             }
  605 |             Ok(())
  606 |         };
  607 |         let (bits_per_offset, bytes_start_offset, offset_start) = if is_old_scheme {
  608 |             // Old scheme
  609 |             let bits_per_offset = data[0];
  610 |             match bits_per_offset {
  611 |                 32 => {
  612 |                     ensure_header(9)?;
  613 |                     debug_assert_eq!(LittleEndian::read_u32(&data[1..5]), num_values as u32);
  614 |                     let bytes_start_offset = LittleEndian::read_u32(&data[5..9]);
  615 |                     (bits_per_offset, bytes_start_offset as u64, 9_u64)
  616 |                 }
  617 |                 64 => {
  618 |                     ensure_header(17)?;
  619 |                     debug_assert_eq!(LittleEndian::read_u64(&data[1..9]), num_values);
  620 |                     let bytes_start_offset = LittleEndian::read_u64(&data[9..17]);
  621 |                     (bits_per_offset, bytes_start_offset, 17)
  622 |                 }
  623 |                 _ => {
  624 |                     return Err(Error::invalid_input_source(
  625 |                         format!("Unsupported bits_per_offset={}", bits_per_offset).into(),
  626 |                     ));
  627 |                 }
  628 |             }
  629 |         } else {
  630 |             // Standard scheme
  631 |             let bits_per_offset = LittleEndian::read_u32(&data[0..4]) as u8;
  632 |             match bits_per_offset {
  633 |                 32 => {
  634 |                     ensure_header(8)?;
  635 |                     let bytes_start_offset = LittleEndian::read_u32(&data[4..8]);
  636 |                     (bits_per_offset, bytes_start_offset as u64, 8)
  637 |                 }
  638 |                 64 => {
  639 |                     ensure_header(16)?;
  640 |                     let bytes_start_offset = LittleEndian::read_u64(&data[8..16]);
  641 |                     (bits_per_offset, bytes_start_offset, 16)
  642 |                 }
  643 |                 _ => {
  644 |                     return Err(Error::invalid_input_source(
  645 |                         format!("Unsupported bits_per_offset={}", bits_per_offset).into(),
  646 |                     ));
  647 |                 }
  648 |             }
  649 |         };
  650 | 
  651 |         // The offsets region sits between the header and `bytes_start_offset`
  652 |         // and must hold exactly `num_values + 1` offsets starting at zero.
  653 |         let expected_offsets_bytes = num_values
  654 |             .checked_add(1)
  655 |             .and_then(|num_offsets| num_offsets.checked_mul(bits_per_offset as u64 / 8))
  656 |             .ok_or_else(|| {
  657 |                 Error::corrupt_file_named(
  658 |                     "variable-width block",
  659 |                     format!("offsets region size overflows for {num_values} values"),
  660 |                 )
  661 |             })?;
  662 |         if bytes_start_offset < offset_start || bytes_start_offset > data.len() as u64 {
  663 |             return Err(Error::corrupt_file_named(
  664 |                 "variable-width block",
  665 |                 format!(
  666 |                     "bytes start offset {} is outside the block (header: {} bytes, block: {} bytes)",
  667 |                     bytes_start_offset,
  668 |                     offset_start,
  669 |                     data.len()
  670 |                 ),
  671 |             ));
  672 |         }
  673 |         if bytes_start_offset - offset_start != expected_offsets_bytes {
  674 |             return Err(Error::corrupt_file_named(
  675 |                 "variable-width block",
  676 |                 format!(
  677 |                     "expected {} offset bytes for {} values but found {}",
  678 |                     expected_offsets_bytes,
  679 |                     num_values,
  680 |                     bytes_start_offset - offset_start
  681 |                 ),
  682 |             ));
  683 |         }
  684 | 
  685 |         // the next `bytes_start_offset - offset_start` stores the offsets.
  686 |         let offsets = data.slice_with_length(
  687 |             offset_start as usize,
  688 |             (bytes_start_offset - offset_start) as usize,
  689 |         );
  690 |         let first_offset = match bits_per_offset {
  691 |             32 => LittleEndian::read_u32(&offsets[0..4]) as u64,
  692 |             _ => LittleEndian::read_u64(&offsets[0..8]),
  693 |         };
  694 |         if first_offset != 0 {
  695 |             return Err(Error::corrupt_file_named(
  696 |                 "variable-width block",
  697 |                 format!("first offset must be 0 but found {first_offset}"),
  698 |             ));
  699 |         }
  700 | 
  701 |         // the rest are the binary bytes.
  702 |         let data = data.slice_with_length(
  703 |             bytes_start_offset as usize,
  704 |             data.len() - bytes_start_offset as usize,
  705 |         );
  706 | 
  707 |         Ok(DataBlock::VariableWidth(VariableWidthBlock {
  708 |             data,
  709 |             offsets,
  710 |             bits_per_offset,
  711 |             num_values,
  712 |             block_info: BlockInfo::new(),
  713 |         }))
  714 |     }
  715 | }
  716 | 
  717 | #[cfg(test)]
  718 | mod tests {
  719 |     use arrow_array::{
  720 |         ArrayRef, StringArray,
  721 |         builder::{LargeStringBuilder, StringBuilder},
  722 |     };
  723 |     use arrow_schema::{DataType, Field};
  724 | 
  725 |     use crate::{
  726 |         buffer::LanceBuffer,
  727 |         constants::{
  728 |             COMPRESSION_META_KEY, STRUCTURAL_ENCODING_FULLZIP, STRUCTURAL_ENCODING_META_KEY,
  729 |             STRUCTURAL_ENCODING_MINIBLOCK,
  730 |         },
  731 |         data::{BlockInfo, DataBlock, VariableWidthBlock},
  732 |         testing::check_specific_random,
  733 |     };
  734 |     use rstest::rstest;
  735 |     use std::{collections::HashMap, sync::Arc, vec};
  736 | 
  737 |     use crate::testing::{
  738 |         FnArrayGeneratorProvider, TestCases, TestEncoding, check_basic_random_case,
  739 |         check_round_trip_encoding_generated, check_round_trip_encoding_of_data,
  740 |     };
  741 | 
  742 |     #[rstest]
  743 |     #[test_log::test(tokio::test)]
  744 |     async fn test_utf8_binary(
  745 |         #[values(
  746 |             TestEncoding::StructuralU16,
  747 |             TestEncoding::StructuralU32,
  748 |             TestEncoding::StructuralSparse
  749 |         )]
  750 |         encoding: TestEncoding,
  751 |         #[values(4096, 1024 * 1024)] page_size: u64,
  752 |         #[values(false, true)] use_slicing: bool,
  753 |     ) {
  754 |         let field = Field::new("", DataType::Utf8, false);
  755 |         check_specific_random(
  756 |             field,
  757 |             TestCases::basic()
  758 |                 .with_encoding(encoding)
  759 |                 .with_page_sizes(vec![page_size])
  760 |                 .with_slicing_modes([use_slicing]),
  761 |         )
  762 |         .await;
  763 |     }
  764 | 
  765 |     #[rstest]
  766 |     #[test_log::test(tokio::test)]
  767 |     async fn test_binary(
  768 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  769 |         structural_encoding: &str,
  770 |         #[values(DataType::Utf8, DataType::Binary)] data_type: DataType,
  771 |         #[values(
  772 |             TestEncoding::Array,
  773 |             TestEncoding::StructuralU16,
  774 |             TestEncoding::StructuralU32,
  775 |             TestEncoding::StructuralSparse
  776 |         )]
  777 |         encoding: TestEncoding,
  778 |         #[values(4096, 1024 * 1024)] page_size: u64,
  779 |         #[values(false, true)] use_slicing: bool,
  780 |     ) {
  781 |         let mut field_metadata = HashMap::new();
  782 |         field_metadata.insert(
  783 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  784 |             structural_encoding.into(),
  785 |         );
  786 | 
  787 |         let field = Field::new("", data_type, false).with_metadata(field_metadata);
  788 |         check_basic_random_case(field, encoding, page_size, use_slicing).await;
  789 |     }
  790 | 
  791 |     #[rstest]
  792 |     #[test_log::test(tokio::test)]
  793 |     async fn test_binary_fsst(
  794 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  795 |         structural_encoding: &str,
  796 |         #[values(DataType::Binary, DataType::Utf8)] data_type: DataType,
  797 |         #[values(
  798 |             TestEncoding::StructuralU16,
  799 |             TestEncoding::StructuralU32,
  800 |             TestEncoding::StructuralSparse
  801 |         )]
  802 |         encoding: TestEncoding,
  803 |         #[values(4096, 1024 * 1024)] page_size: u64,
  804 |         #[values(false, true)] use_slicing: bool,
  805 |     ) {
  806 |         let mut field_metadata = HashMap::new();
  807 |         field_metadata.insert(
  808 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  809 |             structural_encoding.into(),
  810 |         );
  811 |         field_metadata.insert(COMPRESSION_META_KEY.to_string(), "fsst".into());
  812 |         let field = Field::new("", data_type, true).with_metadata(field_metadata);
  813 |         // TODO (https://github.com/lance-format/lance/issues/4783)
  814 |         let test_cases = TestCases::default()
  815 |             .with_encoding(encoding)
  816 |             .with_page_sizes(vec![page_size])
  817 |             .with_slicing_modes([use_slicing]);
  818 |         check_specific_random(field, test_cases).await;
  819 |     }
  820 | 
  821 |     #[rstest]
  822 |     #[test_log::test(tokio::test)]
  823 |     async fn test_fsst_large_binary(
  824 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  825 |         structural_encoding: &str,
  826 |         #[values(DataType::LargeBinary, DataType::LargeUtf8)] data_type: DataType,
  827 |         #[values(
  828 |             TestEncoding::StructuralU16,
  829 |             TestEncoding::StructuralU32,
  830 |             TestEncoding::StructuralSparse
  831 |         )]
  832 |         encoding: TestEncoding,
  833 |         #[values(4096, 1024 * 1024)] page_size: u64,
  834 |         #[values(false, true)] use_slicing: bool,
  835 |     ) {
  836 |         let mut field_metadata = HashMap::new();
  837 |         field_metadata.insert(
  838 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  839 |             structural_encoding.into(),
  840 |         );
  841 |         field_metadata.insert(COMPRESSION_META_KEY.to_string(), "fsst".into());
  842 |         let field = Field::new("", data_type, true).with_metadata(field_metadata);
  843 |         check_specific_random(
  844 |             field,
  845 |             TestCases::basic()
  846 |                 .with_encoding(encoding)
  847 |                 .with_page_sizes(vec![page_size])
  848 |                 .with_slicing_modes([use_slicing]),
  849 |         )
  850 |         .await;
  851 |     }
  852 | 
  853 |     #[rstest]
  854 |     #[test_log::test(tokio::test)]
  855 |     async fn test_large_binary_types(
  856 |         #[values(DataType::LargeBinary, DataType::LargeUtf8)] data_type: DataType,
  857 |         #[values(
  858 |             TestEncoding::Array,
  859 |             TestEncoding::StructuralU16,
  860 |             TestEncoding::StructuralU32,
  861 |             TestEncoding::StructuralSparse
  862 |         )]
  863 |         encoding: TestEncoding,
  864 |         #[values(4096, 1024 * 1024)] page_size: u64,
  865 |         #[values(false, true)] use_slicing: bool,
  866 |     ) {
  867 |         let field = Field::new("", data_type, true);
  868 |         check_basic_random_case(field, encoding, page_size, use_slicing).await;
  869 |     }
  870 | 
  871 |     #[rstest]
  872 |     #[test_log::test(tokio::test)]
  873 |     async fn test_small_strings(
  874 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  875 |         structural_encoding: &str,
  876 |         #[values(
  877 |             TestEncoding::Array,
  878 |             TestEncoding::StructuralU16,
  879 |             TestEncoding::StructuralU32,
  880 |             TestEncoding::StructuralSparse
  881 |         )]
  882 |         encoding: TestEncoding,
  883 |         #[values(4096, 1024 * 1024)] page_size: u64,
  884 |         #[values(false, true)] use_slicing: bool,
  885 |     ) {
  886 |         let mut field_metadata = HashMap::new();
  887 |         field_metadata.insert(
  888 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  889 |             structural_encoding.into(),
  890 |         );
  891 |         let field = Field::new("", DataType::Utf8, true).with_metadata(field_metadata);
  892 |         check_round_trip_encoding_generated(
  893 |             field,
  894 |             Box::new(FnArrayGeneratorProvider::new(move || {
  895 |                 lance_datagen::array::utf8_prefix_plus_counter("user_", /*is_large=*/ false)
  896 |             })),
  897 |             TestCases::basic()
  898 |                 .with_encoding(encoding)
  899 |                 .with_page_sizes(vec![page_size])
  900 |                 .with_slicing_modes([use_slicing]),
  901 |         )
  902 |         .await;
  903 |     }
  904 | 
  905 |     #[rstest]
  906 |     #[test_log::test(tokio::test)]
  907 |     async fn test_simple_binary(
  908 |         #[values(STRUCTURAL_ENCODING_MINIBLOCK, STRUCTURAL_ENCODING_FULLZIP)]
  909 |         structural_encoding: &str,
  910 |         #[values(DataType::Utf8, DataType::Binary)] data_type: DataType,
  911 |     ) {
  912 |         let string_array = StringArray::from(vec![Some("abc"), None, Some("pqr"), None, Some("m")]);
  913 |         let string_array = arrow_cast::cast(&string_array, &data_type).unwrap();
  914 | 
  915 |         let mut field_metadata = HashMap::new();
  916 |         field_metadata.insert(
  917 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
  918 |             structural_encoding.into(),
  919 |         );
  920 | 
  921 |         let test_cases = TestCases::default()
  922 |             .with_range(0..2)
  923 |             .with_range(0..3)
  924 |             .with_range(1..3)
  925 |             .with_indices(vec![0, 1, 3, 4]);
  926 |         check_round_trip_encoding_of_data(
  927 |             vec![Arc::new(string_array)],
  928 |             &test_cases,
  929 |             field_metadata,
  930 |         )
  931 |         .await;
  932 |     }
  933 | 
  934 |     #[test_log::test(tokio::test)]
  935 |     async fn test_sliced_utf8() {
  936 |         let string_array = StringArray::from(vec![Some("abc"), Some("de"), None, Some("fgh")]);
  937 |         let string_array = string_array.slice(1, 3);
  938 | 
  939 |         let test_cases = TestCases::default()
  940 |             .with_range(0..1)
  941 |             .with_range(0..2)
  942 |             .with_range(1..2);
  943 |         check_round_trip_encoding_of_data(
  944 |             vec![Arc::new(string_array)],
  945 |             &test_cases,
  946 |             HashMap::new(),
  947 |         )
  948 |         .await;
  949 |     }
  950 | 
  951 |     #[rstest]
  952 |     #[test_log::test(tokio::test)]
  953 |     async fn test_value_bigger_than_max_page_size(
  954 |         #[values(
  955 |             TestEncoding::Array,
  956 |             TestEncoding::StructuralU16,
  957 |             TestEncoding::StructuralU32,
  958 |             TestEncoding::StructuralSparse
  959 |         )]
  960 |         encoding: TestEncoding,
  961 |     ) {
  962 |         // Create one value larger than the configured 1MiB page budget.
  963 |         let big_string = String::from_iter((0..(2 * 1024 * 1024)).map(|_| '0'));
  964 |         let string_array = StringArray::from(vec![
  965 |             Some(big_string),
  966 |             Some("abc".to_string()),
  967 |             None,
  968 |             None,
  969 |             Some("xyz".to_string()),
  970 |         ]);
  971 | 
  972 |         // Drop the max page size to 1MiB
  973 |         let test_cases = TestCases::default()
  974 |             .with_max_page_size(1024 * 1024)
  975 |             .with_encoding(encoding);
  976 | 
  977 |         check_round_trip_encoding_of_data(
  978 |             vec![Arc::new(string_array)],
  979 |             &test_cases,
  980 |             HashMap::new(),
  981 |         )
  982 |         .await;
  983 |     }
  984 | 
  985 |     #[rstest]
  986 |     #[test_log::test(tokio::test)]
  987 |     async fn test_page_split_parts_do_not_evenly_divide_rows(
  988 |         #[values(
  989 |             TestEncoding::Array,
  990 |             TestEncoding::StructuralU16,
  991 |             TestEncoding::StructuralU32,
  992 |             TestEncoding::StructuralSparse
  993 |         )]
  994 |         encoding: TestEncoding,
  995 |     ) {
  996 |         // Regression: split 90 rows into four parts, where the part count does
  997 |         // not evenly divide the row count.
  998 |         let big_string = String::from_iter((0..45_000).map(|_| '0'));
  999 |         let string_array = StringArray::from_iter_values((0..90).map(|_| big_string.clone()));
 1000 | 
 1001 |         check_round_trip_encoding_of_data(
 1002 |             vec![Arc::new(string_array)],
 1003 |             &TestCases::default()
 1004 |                 .with_max_page_size(1024 * 1024)
 1005 |                 .with_encoding(encoding),
 1006 |             HashMap::new(),
 1007 |         )
 1008 |         .await;
 1009 |     }
 1010 | 
 1011 |     #[test_log::test(tokio::test)]
 1012 |     async fn test_empty_strings() {
 1013 |         // Scenario 1: Some strings are empty
 1014 | 
 1015 |         let values = [Some("abc"), Some(""), None];
 1016 |         // Test empty list at beginning, middle, and end
 1017 |         for order in [[0, 1, 2], [1, 0, 2], [2, 0, 1]] {
 1018 |             let mut string_builder = StringBuilder::new();
 1019 |             for idx in order {
 1020 |                 string_builder.append_option(values[idx]);
 1021 |             }
 1022 |             let string_array = Arc::new(string_builder.finish());
 1023 |             let test_cases = TestCases::default()
 1024 |                 .with_indices(vec![1])
 1025 |                 .with_indices(vec![0])
 1026 |                 .with_indices(vec![2])
 1027 |                 .with_indices(vec![0, 1]);
 1028 |             check_round_trip_encoding_of_data(
 1029 |                 vec![string_array.clone()],
 1030 |                 &test_cases,
 1031 |                 HashMap::new(),
 1032 |             )
 1033 |             .await;
 1034 |             let test_cases = test_cases.with_batch_size(1);
 1035 |             check_round_trip_encoding_of_data(vec![string_array], &test_cases, HashMap::new())
 1036 |                 .await;
 1037 |         }
 1038 | 
 1039 |         // Scenario 2: All strings are empty
 1040 | 
 1041 |         // When encoding an array of empty strings there are no bytes to encode
 1042 |         // which is strange and we want to ensure we handle it
 1043 |         let string_array = Arc::new(StringArray::from(vec![Some(""), None, Some("")]));
 1044 | 
 1045 |         let test_cases = TestCases::default().with_range(0..2).with_indices(vec![1]);
 1046 |         check_round_trip_encoding_of_data(vec![string_array.clone()], &test_cases, HashMap::new())
 1047 |             .await;
 1048 |         let test_cases = test_cases.with_batch_size(1);
 1049 |         check_round_trip_encoding_of_data(vec![string_array], &test_cases, HashMap::new()).await;
 1050 |     }
 1051 | 
 1052 |     #[test_log::test(tokio::test)]
 1053 |     #[ignore] // This test is quite slow in debug mode
 1054 |     async fn test_jumbo_string() {
 1055 |         // This is an overflow test.  We have a list of lists where each list
 1056 |         // has 1Mi items.  We encode 5000 of these lists and so we have over 4Gi in the
 1057 |         // offsets range
 1058 |         let mut string_builder = LargeStringBuilder::new();
 1059 |         // a 1 MiB string
 1060 |         let giant_string = String::from_iter((0..(1024 * 1024)).map(|_| '0'));
 1061 |         for _ in 0..5000 {
 1062 |             string_builder.append_option(Some(&giant_string));
 1063 |         }
 1064 |         let giant_array = Arc::new(string_builder.finish()) as ArrayRef;
 1065 |         let arrs = vec![giant_array];
 1066 | 
 1067 |         // // We can't validate because our validation relies on concatenating all input arrays
 1068 |         let test_cases = TestCases::default().without_validation();
 1069 |         check_round_trip_encoding_of_data(arrs, &test_cases, HashMap::new()).await;
 1070 |     }
 1071 | 
 1072 |     #[rstest]
 1073 |     #[test_log::test(tokio::test)]
 1074 |     async fn test_binary_dictionary_encoding(
 1075 |         #[values(true, false)] with_nulls: bool,
 1076 |         #[values(100, 500, 35000)] dict_size: u32,
 1077 |     ) {
 1078 |         let test_cases = TestCases::default().with_structural_encodings();
 1079 |         let strings = (0..dict_size)
 1080 |             .map(|i| i.to_string())
 1081 |             .collect::<Vec<String>>();
 1082 | 
 1083 |         let repeated_strings: Vec<_> = strings
 1084 |             .iter()
 1085 |             .cycle()
 1086 |             .take(70000)
 1087 |             .enumerate()
 1088 |             .map(|(i, s)| {
 1089 |                 if with_nulls && i % 7 == 0 {
 1090 |                     None
 1091 |                 } else {
 1092 |                     Some(s.clone())
 1093 |                 }
 1094 |             })
 1095 |             .collect();
 1096 |         let string_array = Arc::new(StringArray::from(repeated_strings)) as ArrayRef;
 1097 |         check_round_trip_encoding_of_data(vec![string_array], &test_cases, HashMap::new()).await;
 1098 |     }
 1099 | 
 1100 |     #[test_log::test(tokio::test)]
 1101 |     async fn test_binary_encoding_verification() {
 1102 |         use lance_datagen::{ByteCount, RowCount};
 1103 | 
 1104 |         let test_cases = TestCases::default()
 1105 |             .with_expected_encoding("variable")
 1106 |             .with_structural_encodings();
 1107 | 
 1108 |         // Test both automatic selection and explicit configuration
 1109 |         // 1. Test automatic binary encoding selection (small strings that won't trigger FSST)
 1110 |         let arr_small = lance_datagen::gen_batch()
 1111 |             .anon_col(lance_datagen::array::rand_utf8(ByteCount::from(10), false))
 1112 |             .into_batch_rows(RowCount::from(1000))
 1113 |             .unwrap()
 1114 |             .column(0)
 1115 |             .clone();
 1116 |         check_round_trip_encoding_of_data(vec![arr_small], &test_cases, HashMap::new()).await;
 1117 | 
 1118 |         // 2. Test explicit "none" compression to force binary encoding
 1119 |         let metadata_explicit =
 1120 |             HashMap::from([("lance-encoding:compression".to_string(), "none".to_string())]);
 1121 |         let arr_large = lance_datagen::gen_batch()
 1122 |             .anon_col(lance_datagen::array::rand_utf8(ByteCount::from(50), false))
 1123 |             .into_batch_rows(RowCount::from(2000))
 1124 |             .unwrap()
 1125 |             .column(0)
 1126 |             .clone();
 1127 |         check_round_trip_encoding_of_data(vec![arr_large], &test_cases, metadata_explicit).await;
 1128 |     }
 1129 | 
 1130 |     #[test]
 1131 |     fn test_binary_miniblock_with_misaligned_buffer() {
 1132 |         use super::BinaryMiniBlockDecompressor;
 1133 |         use crate::buffer::LanceBuffer;
 1134 |         use crate::compression::MiniBlockDecompressor;
 1135 |         use crate::data::DataBlock;
 1136 | 
 1137 |         // Test case 1: u32 offsets
 1138 |         {
 1139 |             let decompressor = BinaryMiniBlockDecompressor {
 1140 |                 bits_per_offset: 32,
 1141 |             };
 1142 | 
 1143 |             // Create test data with u32 offsets
 1144 |             // BinaryMiniBlock format: all offsets followed by all string data
 1145 |             // Need to ensure total size is divisible by 4 for u32
 1146 |             let mut test_data = Vec::new();
 1147 | 
 1148 |             // Offsets section (3 offsets for 2 values + 1 end offset)
 1149 |             test_data.extend_from_slice(&12u32.to_le_bytes()); // offset to start of strings (after offsets)
 1150 |             test_data.extend_from_slice(&15u32.to_le_bytes()); // offset to second string
 1151 |             test_data.extend_from_slice(&20u32.to_le_bytes()); // offset to end
 1152 | 
 1153 |             // String data section
 1154 |             test_data.extend_from_slice(b"ABCXYZ"); // 6 bytes of string data
 1155 |             test_data.extend_from_slice(&[0, 0]); // 2 bytes padding to make total 20 bytes (divisible by 4)
 1156 | 
 1157 |             // Create a misaligned buffer by adding padding and slicing
 1158 |             let mut padded = Vec::with_capacity(test_data.len() + 1);
 1159 |             padded.push(0xFF); // Padding byte to misalign
 1160 |             padded.extend_from_slice(&test_data);
 1161 | 
 1162 |             let bytes = bytes::Bytes::from(padded);
 1163 |             let misaligned = bytes.slice(1..); // Skip first byte to create misalignment
 1164 | 
 1165 |             // Create LanceBuffer with bytes_per_value=1 to bypass alignment check
 1166 |             let buffer = LanceBuffer::from_bytes(misaligned, 1);
 1167 | 
 1168 |             // Verify the buffer is actually misaligned
 1169 |             let ptr = buffer.as_ref().as_ptr();
 1170 |             assert_ne!(
 1171 |                 ptr.align_offset(4),
 1172 |                 0,
 1173 |                 "Test setup: buffer should be misaligned for u32"
 1174 |             );
 1175 | 
 1176 |             // Decompress with misaligned buffer - should work with borrow_to_typed_slice
 1177 |             let result = decompressor.decompress(vec![buffer], 2);
 1178 |             assert!(
 1179 |                 result.is_ok(),
 1180 |                 "Decompression should succeed with misaligned buffer"
 1181 |             );
 1182 | 
 1183 |             // Verify the data is correct
 1184 |             if let Ok(DataBlock::VariableWidth(block)) = result {
 1185 |                 assert_eq!(block.num_values, 2);
 1186 |                 // Data should be the strings (including padding from the original buffer)
 1187 |                 assert_eq!(&block.data.as_ref()[..6], b"ABCXYZ");
 1188 |             } else {
 1189 |                 panic!("Expected VariableWidth block");
 1190 |             }
 1191 |         }
 1192 | 
 1193 |         // Test case 2: u64 offsets
 1194 |         {
 1195 |             let decompressor = BinaryMiniBlockDecompressor {
 1196 |                 bits_per_offset: 64,
 1197 |             };
 1198 | 
 1199 |             // Create test data with u64 offsets
 1200 |             let mut test_data = Vec::new();
 1201 | 
 1202 |             // Offsets section (3 offsets for 2 values + 1 end offset)
 1203 |             test_data.extend_from_slice(&24u64.to_le_bytes()); // offset to start of strings (after offsets)
 1204 |             test_data.extend_from_slice(&29u64.to_le_bytes()); // offset to second string
 1205 |             test_data.extend_from_slice(&40u64.to_le_bytes()); // offset to end (divisible by 8)
 1206 | 
 1207 |             // String data section
 1208 |             test_data.extend_from_slice(b"HelloWorld"); // 10 bytes of string data
 1209 |             test_data.extend_from_slice(&[0, 0, 0, 0, 0, 0]); // 6 bytes padding to make total 40 bytes (divisible by 8)
 1210 | 
 1211 |             // Create misaligned buffer
 1212 |             let mut padded = Vec::with_capacity(test_data.len() + 3);
 1213 |             padded.extend_from_slice(&[0xFF, 0xFF, 0xFF]); // 3 bytes padding for misalignment
 1214 |             padded.extend_from_slice(&test_data);
 1215 | 
 1216 |             let bytes = bytes::Bytes::from(padded);
 1217 |             let misaligned = bytes.slice(3..); // Skip 3 bytes
 1218 | 
 1219 |             let buffer = LanceBuffer::from_bytes(misaligned, 1);
 1220 | 
 1221 |             // Verify misalignment for u64
 1222 |             let ptr = buffer.as_ref().as_ptr();
 1223 |             assert_ne!(
 1224 |                 ptr.align_offset(8),
 1225 |                 0,
 1226 |                 "Test setup: buffer should be misaligned for u64"
 1227 |             );
 1228 | 
 1229 |             // Decompress should succeed
 1230 |             let result = decompressor.decompress(vec![buffer], 2);
 1231 |             assert!(
 1232 |                 result.is_ok(),
 1233 |                 "Decompression should succeed with misaligned u64 buffer"
 1234 |             );
 1235 | 
 1236 |             if let Ok(DataBlock::VariableWidth(block)) = result {
 1237 |                 assert_eq!(block.num_values, 2);
 1238 |                 // Data should be the strings (including padding from the original buffer)
 1239 |                 assert_eq!(&block.data.as_ref()[..10], b"HelloWorld");
 1240 |             } else {
 1241 |                 panic!("Expected VariableWidth block");
 1242 |             }
 1243 |         }
 1244 |     }
 1245 | 
 1246 |     #[test]
 1247 |     fn test_binary_miniblock_rejects_corrupt_offsets() {
 1248 |         use super::BinaryMiniBlockDecompressor;
 1249 |         use crate::compression::MiniBlockDecompressor;
 1250 |         use lance_core::Error;
 1251 | 
 1252 |         // Chunk layout mirrors the on-disk format for ["alpha", "beta", "gamma"]:
 1253 |         // LE u32 offsets [16, 21, 25, 30] followed by the value bytes, padded to
 1254 |         // a multiple of 8 bytes.
 1255 |         fn chunk_u32(offsets: &[u32], values: &[u8]) -> LanceBuffer {
 1256 |             let mut chunk = offsets
 1257 |                 .iter()
 1258 |                 .flat_map(|offset| offset.to_le_bytes())
 1259 |                 .collect::<Vec<u8>>();
 1260 |             chunk.extend_from_slice(values);
 1261 |             chunk.resize(chunk.len().next_multiple_of(8), 0);
 1262 |             LanceBuffer::from(chunk)
 1263 |         }
 1264 | 
 1265 |         let decompressor = BinaryMiniBlockDecompressor::new(32);
 1266 | 
 1267 |         // The tail offset points past the end of the 32-byte chunk.
 1268 |         let err = decompressor
 1269 |             .decompress(
 1270 |                 vec![chunk_u32(&[16, 21, 25, 100_000], b"alphabetagamma")],
 1271 |                 3,
 1272 |             )
 1273 |             .unwrap_err();
 1274 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1275 |         assert!(err.to_string().contains("out of bounds"), "{err}");
 1276 | 
 1277 |         // Offsets go backwards, which would underflow the rebase subtraction.
 1278 |         let err = decompressor
 1279 |             .decompress(vec![chunk_u32(&[16, 25, 21, 30], b"alphabetagamma")], 3)
 1280 |             .unwrap_err();
 1281 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1282 |         assert!(err.to_string().contains("decreases"), "{err}");
 1283 | 
 1284 |         // The first offset points inside the offset table, which would alias
 1285 |         // the serialized offsets into the value bytes.
 1286 |         let err = decompressor
 1287 |             .decompress(vec![chunk_u32(&[0, 21, 25, 30], b"alphabetagamma")], 3)
 1288 |             .unwrap_err();
 1289 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1290 |         assert!(err.to_string().contains("overlaps"), "{err}");
 1291 | 
 1292 |         // The chunk stores fewer offsets than the requested value count needs.
 1293 |         let err = decompressor
 1294 |             .decompress(vec![chunk_u32(&[8, 8], &[])], 3)
 1295 |             .unwrap_err();
 1296 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1297 |         assert!(err.to_string().contains("requires 4"), "{err}");
 1298 | 
 1299 |         // The chunk size is not a multiple of the offset width.
 1300 |         let err = decompressor
 1301 |             .decompress(vec![LanceBuffer::from(vec![0u8; 10])], 1)
 1302 |             .unwrap_err();
 1303 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1304 |         assert!(err.to_string().contains("multiple"), "{err}");
 1305 | 
 1306 |         // 64-bit offsets take the same validation path.
 1307 |         fn chunk_u64(offsets: &[u64], values: &[u8]) -> LanceBuffer {
 1308 |             let mut chunk = offsets
 1309 |                 .iter()
 1310 |                 .flat_map(|offset| offset.to_le_bytes())
 1311 |                 .collect::<Vec<u8>>();
 1312 |             chunk.extend_from_slice(values);
 1313 |             chunk.resize(chunk.len().next_multiple_of(8), 0);
 1314 |             LanceBuffer::from(chunk)
 1315 |         }
 1316 |         let decompressor = BinaryMiniBlockDecompressor::new(64);
 1317 |         let err = decompressor
 1318 |             .decompress(
 1319 |                 vec![chunk_u64(&[32, 37, 41, 100_000], b"alphabetagamma")],
 1320 |                 3,
 1321 |             )
 1322 |             .unwrap_err();
 1323 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1324 |         assert!(err.to_string().contains("out of bounds"), "{err}");
 1325 |         let err = decompressor
 1326 |             .decompress(vec![chunk_u64(&[0, 37, 41, 46], b"alphabetagamma")], 3)
 1327 |             .unwrap_err();
 1328 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1329 |         assert!(err.to_string().contains("overlaps"), "{err}");
 1330 | 
 1331 |         // A valid chunk still decodes: offsets rebase to [0, 5, 9, 14].
 1332 |         let decompressor = BinaryMiniBlockDecompressor::new(32);
 1333 |         let block = decompressor
 1334 |             .decompress(vec![chunk_u32(&[16, 21, 25, 30], b"alphabetagamma")], 3)
 1335 |             .unwrap();
 1336 |         let DataBlock::VariableWidth(block) = block else {
 1337 |             panic!("expected a variable-width block");
 1338 |         };
 1339 |         assert_eq!(block.data.as_ref(), b"alphabetagamma");
 1340 |         assert_eq!(
 1341 |             block.offsets,
 1342 |             LanceBuffer::reinterpret_vec(vec![0_u32, 5, 9, 14])
 1343 |         );
 1344 |     }
 1345 | 
 1346 |     fn encoded_binary_block(bits_per_offset: u8) -> Vec<u8> {
 1347 |         use crate::compression::BlockCompressor;
 1348 | 
 1349 |         let offsets = match bits_per_offset {
 1350 |             32 => LanceBuffer::reinterpret_vec(vec![0_i32, 5, 9, 14]),
 1351 |             64 => LanceBuffer::reinterpret_vec(vec![0_i64, 5, 9, 14]),
 1352 |             _ => unreachable!(),
 1353 |         };
 1354 |         let block = DataBlock::VariableWidth(VariableWidthBlock {
 1355 |             data: LanceBuffer::copy_slice(b"alphabetagamma"),
 1356 |             offsets,
 1357 |             bits_per_offset,
 1358 |             num_values: 3,
 1359 |             block_info: BlockInfo::new(),
 1360 |         });
 1361 |         BlockCompressor::compress(&super::VariableEncoder::default(), block)
 1362 |             .unwrap()
 1363 |             .0
 1364 |             .as_ref()
 1365 |             .unwrap()
 1366 |             .to_vec()
 1367 |     }
 1368 | 
 1369 |     /// The block decompressor only checks the block structure (all O(1)); bad
 1370 |     /// offset values inside a structurally-sound block are rejected by the
 1371 |     /// mandatory layout validation when the block is converted to Arrow.
 1372 |     #[rstest]
 1373 |     #[case::i32_tail_out_of_bounds(32, 3, 100_000, "out of bounds")]
 1374 |     #[case::i64_tail_out_of_bounds(64, 3, 15, "out of bounds")]
 1375 |     #[case::i32_non_monotonic(32, 2, 4, "non-monotonic")]
 1376 |     #[case::i64_non_monotonic(64, 2, 4, "non-monotonic")]
 1377 |     fn test_binary_block_bad_offsets_rejected_at_arrow_conversion(
 1378 |         #[case] bits_per_offset: u8,
 1379 |         #[case] mutated_offset_index: usize,
 1380 |         #[case] mutated_offset_value: u64,
 1381 |         #[case] expected_message: &str,
 1382 |     ) {
 1383 |         use crate::compression::BlockDecompressor;
 1384 |         use lance_core::Error;
 1385 | 
 1386 |         let mut encoded = encoded_binary_block(bits_per_offset);
 1387 |         let bytes_per_offset = (bits_per_offset / 8) as usize;
 1388 |         // The standard scheme header is two offset-width fields.
 1389 |         let mutated_offset_start = bytes_per_offset * (2 + mutated_offset_index);
 1390 |         encoded[mutated_offset_start..mutated_offset_start + bytes_per_offset]
 1391 |             .copy_from_slice(&mutated_offset_value.to_le_bytes()[..bytes_per_offset]);
 1392 | 
 1393 |         let block = super::BinaryBlockDecompressor::default()
 1394 |             .decompress(Some(LanceBuffer::from(encoded)), 3)
 1395 |             .unwrap();
 1396 |         let data_type = match bits_per_offset {
 1397 |             32 => DataType::Binary,
 1398 |             _ => DataType::LargeBinary,
 1399 |         };
 1400 |         let err = block.into_arrow(data_type, false).unwrap_err();
 1401 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1402 |         assert!(err.to_string().contains(expected_message), "{err}");
 1403 |     }
 1404 | 
 1405 |     #[test]
 1406 |     fn test_binary_block_rejects_corrupt_structure() {
 1407 |         use crate::compression::BlockDecompressor;
 1408 |         use lance_core::Error;
 1409 | 
 1410 |         let decompressor = super::BinaryBlockDecompressor::default();
 1411 | 
 1412 |         // The first offset must be zero.
 1413 |         let mut encoded = encoded_binary_block(32);
 1414 |         encoded[8..12].copy_from_slice(&5_u32.to_le_bytes());
 1415 |         let err = decompressor
 1416 |             .decompress(Some(LanceBuffer::from(encoded)), 3)
 1417 |             .unwrap_err();
 1418 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1419 |         assert!(err.to_string().contains("first offset"), "{err}");
 1420 | 
 1421 |         // The offsets region must hold exactly num_values + 1 offsets.
 1422 |         let encoded = encoded_binary_block(32);
 1423 |         let err = decompressor
 1424 |             .decompress(Some(LanceBuffer::from(encoded)), 4)
 1425 |             .unwrap_err();
 1426 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1427 |         assert!(err.to_string().contains("offset bytes"), "{err}");
 1428 | 
 1429 |         // A block too small to hold its header is rejected, not a panic.
 1430 |         let err = decompressor
 1431 |             .decompress(Some(LanceBuffer::from(vec![0_u8; 2])), 1)
 1432 |             .unwrap_err();
 1433 |         assert!(matches!(err, Error::CorruptFile { .. }), "{err:?}");
 1434 |         assert!(err.to_string().contains("too small"), "{err}");
 1435 |     }
 1436 | }
``````
