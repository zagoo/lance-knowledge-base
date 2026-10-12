> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Consult [current clarifications](../../../../../../FROZEN-ERRATA.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/packed.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `703b9017ec4194f39315a1223b013b8536f4ae5a27c40fcd5aeee828f897b71a`. Reviewed physical lines: 1-1571.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Row-major packed structs: fixed mini-block, fixed and variable per-value interfaces, child accumulators and nine local tests. File-version selection belongs to the caller. (rust/lance-encoding/src/encodings/physical/packed.rs:1-1571)

## Complete range analysis

### Lines 1-39

SPDX/module documentation presents row-major struct packing and transparency only when children are transparent. Imports connect Arrow UInt64 stats, Field, compression traits, ValueEncoder/Decoder, DataBlockBuilder, buffers and protobuf21 helpers. No production async, IO, unsafe or local feature/version gate. (rust/lance-encoding/src/encodings/physical/packed.rs:1-39)

### Lines 40-70

Private struct_data_block_to_fixed_width_data_block obtains scalar DataSize (panic if absent/wrong type), reserves that many bytes, takes count from first child, and copies each row/child FixedWidth slice using supplied field bits/8. Empty children, wrong kinds, missing width entries or short slices panic; widths/count consistency and byte alignment are assumed. Width sum and arithmetic unchecked. Fresh FixedWidth stats; struct validity discarded. (rust/lance-encoding/src/encodings/physical/packed.rs:40-70)

### Lines 71-105

Public Debug Default empty PackedStructFixedWidthMiniBlockEncoder implements MiniBlockCompressor. Requires Struct else InvalidInputSource with block-encoder wording; unwraps every child FixedWidth, zips bytes, then calls boxed raw ValueEncoder with supplied context. Wraps result in PackedStruct(inner,field widths). No recursive child compression, ratio test or extra validation. (rust/lance-encoding/src/encodings/physical/packed.rs:71-105)

### Lines 106-133

Public Debug PackedStructFixedWidthMiniBlockDecompressor stores Vec<u64> widths and boxed MiniBlockDecompressor. Public new unwraps descriptor.values.compression, accepts only Flat via ValueDecompressor::from_flat; other compression panics with Lance2.1 wording. Does not validate nonempty/aligned widths or sum agreement. (rust/lance-encoding/src/encodings/physical/packed.rs:106-133)

### Lines 134-187

Mini decode asserts one buffer, invokes inner with external count, requires FixedWidth else panic, and asserts total row width byte-aligned. Floor each child width/8, construct prefix positions using len-1 (empty list underflow), allocate per-child count*width and copy strided slices. No check sum(child widths)==row width, so malformed widths can overlap/cross rows or leave bytes unused. Returns Struct with None validity/fresh stats; no size estimator override. (rust/lance-encoding/src/encodings/physical/packed.rs:134-187)

### Lines 188-221

Private Debug FixedPackedFieldData wraps one FixedWidthDataBlock. append_row_bytes rejects non-byte-aligned widths, uses checked row*bytes and checked end, rejects end beyond actual buffer, and copies slice. It does not check block logical count or trailing unused bytes. Validation runs only for visited rows; zero rows bypass it. (rust/lance-encoding/src/encodings/physical/packed.rs:188-221)

### Lines 222-258

Private Debug VariablePackedFieldData distinguishes Fixed from Variable(block,bits_per_length). Fixed delegates; variable requires prefix bits multiple8 and byte width4or8, then dispatches on offset width32/64. These are compressed child lengths, not necessarily original Arrow string lengths. (rust/lance-encoding/src/encodings/physical/packed.rs:222-258)

### Lines 259-297

Variable append borrows unsigned typed offsets, directly indexes row and row+1, checks only end<=data.len, computes end-start and enforces matching prefix width before writing little-endian u32/u64 length and selected payload. Unsupported offset width InvalidInput. Missing offsets, decreasing ranges and unchecked subtraction/casts can panic or truncate; there is no explicit start<=end validation. No null bitmap in row bytes. (rust/lance-encoding/src/encodings/physical/packed.rs:259-297)

### Lines 298-326

Private check_struct_validity validates Struct variant, at least one child, exact metadata field count and equal child logical counts. All errors InvalidInput. Despite name, it does not validate struct/child nullability, actual buffer sizes, schema types or offset validity. (rust/lance-encoding/src/encodings/physical/packed.rs:298-326)

### Lines 327-357

Public Debug PackedStructVariablePerValueEncoder stores Arc<dyn CompressionStrategy> and Vec<Field>; public new stores without checks. Per-value compress calls check_struct_validity and retains original child count. Sequentially asks the supplied strategy to create and execute a child per-value compressor for each schema field. (rust/lance-encoding/src/encodings/physical/packed.rs:327-357)

### Lines 358-384

For Fixed compressed children record nested encoding and bits_per_value; for Variable children record nested encoding and offset width as bits_per_length. Store corresponding local append wrappers. No post-compression count agreement or metadata/type consistency checks on custom child compressors. (rust/lance-encoding/src/encodings/physical/packed.rs:358-384)

### Lines 385-417

Build all row payloads in one growing Vec, record initial0 and each ending offset in Vec<u64>, track maximum row length and checked aggregate length. Capacity count-as-usize+1 is unchecked. Choose32-bit offsets only if total bytes and max row length<=u32::MAX, allocating a converted Vec; else64. Return VariableWidth with original count/fresh stats and VariablePackedStruct field metadata. Row buffers coexist with compressed children, and no struct validity is retained. (rust/lance-encoding/src/encodings/physical/packed.rs:385-417)

### Lines 418-443

Crate-internal Debug PackedStructFixedPerValueEncoder retains only field count from constructor Vec<Field>. Per-value compress validates struct/counts then rejects has_variable_width_child. That helper means any direct child not FixedWidth, including fixed-size-list/nullable/nested structs; it is not a recursive variable-width test. (rust/lance-encoding/src/data.rs:1037-1041) (rust/lance-encoding/src/encodings/physical/packed.rs:418-443)

### Lines 444-466

Fixed per-value compression uses raw ValueEncoder for each child, discards its descriptor, requires Fixed result and checked-adds bits_per_value. Errors identify unsupported fixed layout or row-width overflow. The direct-child precheck prevents using ValueEncoder fixed-size-list support here. (rust/lance-encoding/src/encodings/physical/packed.rs:444-466)

### Lines 467-495

Reserve row bytes using saturating rowbytes*count, then interleave fields via guarded append_row_bytes; debug-check cumulative row size. Byte-alignment comment assumes rows were visited, so zero rows do not exercise append checks. Return FixedWidth with summed width/original count/fresh stats and PackedStruct(Flat(sum,None),field widths); no adaptive compression. (rust/lance-encoding/src/encodings/physical/packed.rs:467-495)

### Lines 496-523

Crate-internal Debug VariablePackedStructFieldKind has Fixed{bits_per_value,Arc<dyn FixedPerValueDecompressor>} and Variable{bits_per_length,Arc<dyn VariablePerValueDecompressor>}. Crate-internal Debug wrapper exposes kind within crate. Public Debug PackedStructVariablePerValueDecompressor has private fields and crate-internal infallible new; descriptor parsing is external. (rust/lance-encoding/src/encodings/physical/packed.rs:496-523)

### Lines 524-564

Private Debug FixedFieldAccumulator owns DataBlockBuilder,width and one zero-filled placeholder value. append_empty appends0..1. new rejects non-byte-alignment, checked-divides by8 and checked-multiplies capacity by count, then allocates one placeholder. Zero width passes these checks; size-to-usize casts unchecked. Builder allocation is lazy until append. (rust/lance-encoding/src/data.rs:2071-2088) (rust/lance-encoding/src/encodings/physical/packed.rs:524-564)

### Lines 565-586

Fixed accumulator finish expects FixedWidth or InvalidInput. Private FieldAccumulator variants are Fixed,Variable32 and Variable64, the latter two each hold a builder and empty value. Underlying builder.finish panics if no append ever occurred; thus zero-row variable-packed decode with any configured field reaches a panic, not the local mismatch error. Fixed width0 can later divide by zero in builder finish. These are source deductions only. (rust/lance-encoding/src/data.rs:344-377; rust/lance-encoding/src/data.rs:2113-2116) (rust/lance-encoding/src/encodings/physical/packed.rs:565-586)

### Lines 587-605

FieldAccumulator::append_empty inserts one placeholder into every field: fixed zero bytes or variable empty bytes with equal offsets. Comment connects empty full-zip payload to rep/def null/invalid items; local representation does not mark placeholders null, relying on the surrounding structural layer. (rust/lance-encoding/src/encodings/physical/packed.rs:587-605)

### Lines 606-633

VariablePerValueDecompressor copies all input offsets into Vec<u64>, accepting32/64 only, then requires exact length count-as-usize+1. Wrong width/count returns InvalidInput. Does not require first offset0 or final offset exactly payload length; casts/count addition unchecked. (rust/lance-encoding/src/encodings/physical/packed.rs:606-633)

### Lines 634-672

Build one accumulator per field. Fixed uses checked allocation estimate; each variable builder uses entire packed input length as estimate and a one-value empty block offsets[0,0] with matching32/64 width. Unsupported bits_per_length InvalidInput. Many variable fields can reserve multiples of the input size once builders materialize. (rust/lance-encoding/src/encodings/physical/packed.rs:634-672)

### Lines 673-713

For each row, cast offsets to usize and reject end beyond bytes or start>end. Empty row appends placeholders to all fields and continues. Otherwise initialize cursor and iterate field/accumulator pairs; fixed child consumes configured byte width after row-bound check, copying into a temporary one-value FixedWidth block then appending. No outer prefix/suffix exhaustion check. (rust/lance-encoding/src/encodings/physical/packed.rs:673-713)

### Lines 714-754

Variable32 child requires four prefix bytes within row, reads u32LE payload length, bounds-checks payload end, copies bytes into a temporary one-value VariableWidth block offsets[0,len], appends, advances cursor. Cursor additions unchecked; malformed inputs return InvalidInput for ordinary bounds failures. No UTF-8/type validation here. (rust/lance-encoding/src/encodings/physical/packed.rs:714-754)

### Lines 755-802

Variable64 mirrors with eight prefix bytes/u64LE length cast to usize. Wrong accumulator/layout pairing InvalidInput. After every nonempty row, cursor must exactly equal row_end; trailing bytes rejected. Empty rows bypass that field parse entirely. No child codec invoked during row splitting. (rust/lance-encoding/src/encodings/physical/packed.rs:755-802)

### Lines 803-836

Finalize each fixed builder, then invoke its FixedPerValueDecompressor with external total count. Variable32 builder must yield VariableWidth else panic, debug-check width32, set width from field length metadata and invoke child variable decoder. No check decoded child count/type matches outer schema. (rust/lance-encoding/src/encodings/physical/packed.rs:803-836)

### Lines 837-867

Variable64 finalize mirrors32. Mismatch returns InvalidInput. Return Struct children with fresh BlockInfo and validityNone. Decoding materializes offsets, copied per-field payloads and temporary row blocks; no streaming, size-estimator override or local async/IO. Child errors propagate. (rust/lance-encoding/src/encodings/physical/packed.rs:837-867)

### Lines 868-914

Private Debug PackedStructFixedFieldDecoder stores width and boxed fixed decoder. Crate-internal Debug PackedStructFixedPerValueDecompressor stores these. Its crate-internal fallible new requires values and compression, rejects non-Flat, then builds raw ValueDecompressor for every listed width. It ignores the parent Flat width/data descriptor and accepts empty width lists; child alignment/sum checked later. (rust/lance-encoding/src/encodings/physical/packed.rs:868-914)

### Lines 915-946

Fixed per-value decode rejects non-byte-aligned input row or child widths, sums child byte widths and requires equality with input row bytes. Sum/casts unchecked. Require actual buffer at least saturating(rowbytes*external count), not exact length, ignoring input block.num_values and surplus bytes. All local errors InvalidInput. (rust/lance-encoding/src/encodings/physical/packed.rs:915-946)

### Lines 947-982

Allocate/copy every child by strided slices and raw-decode with external count, then Struct validityNone/fresh stats. bits_per_value sums configured child widths unchecked. Empty child list with zero row width returns empty Struct, which cannot itself preserve an independent row count. No decoded-size override. (rust/lance-encoding/src/encodings/physical/packed.rs:947-982)

### Lines 983-1050

Private cfg(test) module imports Arrow types, test strategies, protobuf and metadata keys. Five private helpers convert Int64,Int32,String,LargeString,Binary arrays into expected block variants or panic. Tests construct nonnullable payloads unless explicitly exercising an empty row; schema nullable flags alone do not create null data. (rust/lance-encoding/src/encodings/physical/packed.rs:983-1050)

### Lines 1051-1132

variable_packed_struct_round_trip uses UInt32[1,2,42] and Utf8 offsets[0,1,4,4]/bytes abcz with nullable schema flag but no actual nulls; compute child stats, StructuralU32 strategy, require Variable result/default decode. Assert both child widths, raw id bytes and full string offsets/payload. No exact packed-byte or field-descriptor assertion. (rust/lance-encoding/src/encodings/physical/packed.rs:1051-1132)

### Lines 1133-1208

variable_packed_struct_large_utf8_round_trip uses Int64[10,20,30,40] and four LargeUtf8 strings including a long sentence. StructuralU32/default decode, checks fixed child and64-bit offsets/all string bytes. It verifies large offset type with small data, not >4GiB allocation. (rust/lance-encoding/src/encodings/physical/packed.rs:1133-1208)

### Lines 1209-1251

Async variable_packed_struct_utf8_round_trip creates three rows UInt32+Utf8+LargeUtf8, marks packed metadata true, uses u32 structural harness and expects variable_packed_struct name. This is harness source evidence; no test executed here. (rust/lance-encoding/src/encodings/physical/packed.rs:1209-1251)

### Lines 1252-1343

variable_packed_struct_multi_variable_round_trip combines Utf8 categories, Binary payloads including one empty item and Int32 values across four rows. StructuralU32/default decode verifies offsets, bytes and bit widths for all three fields. No null value despite nullable field metadata. (rust/lance-encoding/src/encodings/physical/packed.rs:1252-1343)

### Lines 1344-1374

variable_packed_struct_requires_v22 builds Int64+Utf8 three-row struct and asserts StructuralU16 strategy create_per_value returns NotSupported. Name does not prove production V2.2 all-fixed support: test StructuralU32 uses all-packed helper, while production V2.2 allows only variable-packed per-value and V2.3 adds fixed per-value. (rust/lance-encoding/src/testing.rs:162-181; rust/lance-file/src/versions/v2_2/compression.rs:77-93; rust/lance-file/src/versions/v2_3/compression.rs:77-92) (rust/lance-encoding/src/encodings/physical/packed.rs:1344-1374)

### Lines 1375-1405

Empty-row test explicitly constructs fixed32 raw and variable32 raw child decoders, avoiding strategy selection. Configures one fixed and one variable field to isolate placeholder behavior. (rust/lance-encoding/src/encodings/physical/packed.rs:1375-1405)

### Lines 1406-1443

Writes packed row1 [u32LE1][u32LE1][a] and row3 [u32LE2][u32LE0]; row offsets[0,9,9,17]. Decode must produce fixed[1,0,2], variable offsets[0,1,1,1] and bytes a. This is an empty middle row, not a zero-row block or validation of rep/def/nullable Arrow output. (rust/lance-encoding/src/encodings/physical/packed.rs:1406-1443)

### Lines 1444-1503

fixed_packed_struct_round_trip compresses Int32[1,2,3,4]+Int64[10,20,30,40] using StructuralU32 test strategy; require Fixed result, default fixed decode count4, assert both child widths/payloads. No exact interleaved bytes or malformed-layout assertion. (rust/lance-encoding/src/encodings/physical/packed.rs:1444-1503)

### Lines 1504-1539

Async fixed_packed_struct_full_zip_round_trip forces packed=true and fullzip metadata for the same two fields/four rows. u32 structural harness expects packed_struct name. Comment calls this file-writer wiring; test strategy is not identical to production V2.2 policy. No direct mini-block test appears in this module. (rust/lance-encoding/src/encodings/physical/packed.rs:1504-1539)

### Lines 1540-1571

fixed_packed_struct_rejects_variable_child directly constructs fixed encoder over Int32+Utf8 two rows, asserts InvalidInput and fixed-width substring. Nine test functions total. Local gaps include zero rows, zero width, malformed descriptors/offsets/prefixes, misaligned widths, null child codecs and input/count mismatch. Tests read only. (rust/lance-encoding/src/encodings/physical/packed.rs:1540-1571)

## Interaction and interpretation limits

Every physical source line read during ANALYZE76 in bounded untruncated primary reads. No repository build, test, lint, benchmark, generator or installation executed. Failure-path observations are source deductions, not reproductions; contextual files remain pending unless previously analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Packed encoding
    5 | //!
    6 | //! These encodings take struct data and compress it in a way that all fields are collected
    7 | //! together.
    8 | //!
    9 | //! This encoding can be transparent or opaque.  In order to be transparent we must use transparent
   10 | //! compression on all children.  Then we can zip together the compressed children.
   11 | 
   12 | use std::{convert::TryInto, sync::Arc};
   13 | 
   14 | use arrow_array::types::UInt64Type;
   15 | use lance_core::{Error, Result, datatypes::Field};
   16 | 
   17 | use crate::{
   18 |     buffer::LanceBuffer,
   19 |     compression::{
   20 |         CompressionStrategy, FixedPerValueDecompressor, MiniBlockDecompressor,
   21 |         VariablePerValueDecompressor,
   22 |     },
   23 |     data::{
   24 |         BlockInfo, DataBlock, DataBlockBuilder, FixedWidthDataBlock, StructDataBlock,
   25 |         VariableWidthBlock,
   26 |     },
   27 |     encodings::logical::primitive::{
   28 |         fullzip::{PerValueCompressor, PerValueDataBlock},
   29 |         miniblock::{MiniBlockCompressed, MiniBlockCompressionContext, MiniBlockCompressor},
   30 |     },
   31 |     format::{
   32 |         ProtobufUtils21,
   33 |         pb21::{CompressiveEncoding, PackedStruct, compressive_encoding::Compression},
   34 |     },
   35 |     statistics::{GetStat, Stat},
   36 | };
   37 | 
   38 | use super::value::{ValueDecompressor, ValueEncoder};
   39 | 
   40 | // Transforms a `StructDataBlock` into a row major `FixedWidthDataBlock`.
   41 | // Only fields with fixed-width fields are supported for now, and the
   42 | // assumption that all fields has `bits_per_value % 8 == 0` is made.
   43 | fn struct_data_block_to_fixed_width_data_block(
   44 |     struct_data_block: StructDataBlock,
   45 |     bits_per_values: &[u64],
   46 | ) -> DataBlock {
   47 |     let data_size = struct_data_block.expect_single_stat::<UInt64Type>(Stat::DataSize);
   48 |     let mut output = Vec::with_capacity(data_size as usize);
   49 |     let num_values = struct_data_block.children[0].num_values();
   50 | 
   51 |     for i in 0..num_values as usize {
   52 |         for (j, child) in struct_data_block.children.iter().enumerate() {
   53 |             let bytes_per_value = (bits_per_values[j] / 8) as usize;
   54 |             let this_data = child
   55 |                 .as_fixed_width_ref()
   56 |                 .unwrap()
   57 |                 .data
   58 |                 .slice_with_length(bytes_per_value * i, bytes_per_value);
   59 |             output.extend_from_slice(&this_data);
   60 |         }
   61 |     }
   62 | 
   63 |     DataBlock::FixedWidth(FixedWidthDataBlock {
   64 |         bits_per_value: bits_per_values.iter().copied().sum(),
   65 |         data: LanceBuffer::from(output),
   66 |         num_values,
   67 |         block_info: BlockInfo::default(),
   68 |     })
   69 | }
   70 | 
   71 | #[derive(Debug, Default)]
   72 | pub struct PackedStructFixedWidthMiniBlockEncoder {}
   73 | 
   74 | impl MiniBlockCompressor for PackedStructFixedWidthMiniBlockEncoder {
   75 |     fn compress(
   76 |         &self,
   77 |         context: MiniBlockCompressionContext,
   78 |         data: DataBlock,
   79 |     ) -> Result<(MiniBlockCompressed, CompressiveEncoding)> {
   80 |         match data {
   81 |             DataBlock::Struct(struct_data_block) => {
   82 |                 let bits_per_values = struct_data_block.children.iter().map(|data_block| data_block.as_fixed_width_ref().unwrap().bits_per_value).collect::<Vec<_>>();
   83 | 
   84 |                 // transform struct datablock to fixed-width data block.
   85 |                 let data_block = struct_data_block_to_fixed_width_data_block(struct_data_block, &bits_per_values);
   86 | 
   87 |                 // store and transformed fixed-width data block.
   88 |                 let value_miniblock_compressor = Box::new(ValueEncoder::default()) as Box<dyn MiniBlockCompressor>;
   89 |                 let (value_miniblock_compressed, value_array_encoding) =
   90 |                 value_miniblock_compressor.compress(context, data_block)?;
   91 | 
   92 |                 Ok((
   93 |                     value_miniblock_compressed,
   94 |                     ProtobufUtils21::packed_struct(value_array_encoding, bits_per_values),
   95 |                 ))
   96 |             }
   97 |             _ => Err(Error::invalid_input_source(format!(
   98 |                 "Cannot compress a data block of type {} with PackedStructFixedWidthBlockEncoder",
   99 |                 data.name()
  100 |             )
  101 |             .into())),
  102 |         }
  103 |     }
  104 | }
  105 | 
  106 | #[derive(Debug)]
  107 | pub struct PackedStructFixedWidthMiniBlockDecompressor {
  108 |     bits_per_values: Vec<u64>,
  109 |     array_encoding: Box<dyn MiniBlockDecompressor>,
  110 | }
  111 | 
  112 | impl PackedStructFixedWidthMiniBlockDecompressor {
  113 |     pub fn new(description: &PackedStruct) -> Self {
  114 |         let array_encoding: Box<dyn MiniBlockDecompressor> = match description
  115 |             .values
  116 |             .as_ref()
  117 |             .unwrap()
  118 |             .compression
  119 |             .as_ref()
  120 |             .unwrap()
  121 |         {
  122 |             Compression::Flat(flat) => Box::new(ValueDecompressor::from_flat(flat)),
  123 |             _ => panic!(
  124 |                 "Currently only `ArrayEncoding::Flat` is supported in packed struct encoding in Lance 2.1."
  125 |             ),
  126 |         };
  127 |         Self {
  128 |             bits_per_values: description.bits_per_value.clone(),
  129 |             array_encoding,
  130 |         }
  131 |     }
  132 | }
  133 | 
  134 | impl MiniBlockDecompressor for PackedStructFixedWidthMiniBlockDecompressor {
  135 |     fn decompress(&self, data: Vec<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  136 |         assert_eq!(data.len(), 1);
  137 |         let encoded_data_block = self.array_encoding.decompress(data, num_values)?;
  138 |         let DataBlock::FixedWidth(encoded_data_block) = encoded_data_block else {
  139 |             panic!("ValueDecompressor should output FixedWidth DataBlock")
  140 |         };
  141 | 
  142 |         let bytes_per_values = self
  143 |             .bits_per_values
  144 |             .iter()
  145 |             .map(|bits_per_value| *bits_per_value as usize / 8)
  146 |             .collect::<Vec<_>>();
  147 | 
  148 |         assert!(encoded_data_block.bits_per_value % 8 == 0);
  149 |         let encoded_bytes_per_row = (encoded_data_block.bits_per_value / 8) as usize;
  150 | 
  151 |         // use a prefix_sum vector as a helper to reconstruct to `StructDataBlock`.
  152 |         let mut prefix_sum = vec![0; self.bits_per_values.len()];
  153 |         for i in 0..(self.bits_per_values.len() - 1) {
  154 |             prefix_sum[i + 1] = prefix_sum[i] + bytes_per_values[i];
  155 |         }
  156 | 
  157 |         let mut children_data_block = vec![];
  158 |         for i in 0..self.bits_per_values.len() {
  159 |             let child_buf_size = bytes_per_values[i] * num_values as usize;
  160 |             let mut child_buf: Vec<u8> = Vec::with_capacity(child_buf_size);
  161 | 
  162 |             for j in 0..num_values as usize {
  163 |                 // the start of the data at this row is `j * encoded_bytes_per_row`, and the offset for this field is `prefix_sum[i]`, this field has length `bytes_per_values[i]`.
  164 |                 let this_value = encoded_data_block.data.slice_with_length(
  165 |                     prefix_sum[i] + (j * encoded_bytes_per_row),
  166 |                     bytes_per_values[i],
  167 |                 );
  168 | 
  169 |                 child_buf.extend_from_slice(&this_value);
  170 |             }
  171 | 
  172 |             let child = DataBlock::FixedWidth(FixedWidthDataBlock {
  173 |                 data: LanceBuffer::from(child_buf),
  174 |                 bits_per_value: self.bits_per_values[i],
  175 |                 num_values,
  176 |                 block_info: BlockInfo::default(),
  177 |             });
  178 |             children_data_block.push(child);
  179 |         }
  180 |         Ok(DataBlock::Struct(StructDataBlock {
  181 |             children: children_data_block,
  182 |             block_info: BlockInfo::default(),
  183 |             validity: None,
  184 |         }))
  185 |     }
  186 | }
  187 | 
  188 | #[derive(Debug)]
  189 | struct FixedPackedFieldData {
  190 |     block: FixedWidthDataBlock,
  191 | }
  192 | 
  193 | impl FixedPackedFieldData {
  194 |     fn append_row_bytes(&self, row_idx: usize, output: &mut Vec<u8>) -> Result<()> {
  195 |         let bits_per_value = self.block.bits_per_value;
  196 |         if !bits_per_value.is_multiple_of(8) {
  197 |             return Err(Error::invalid_input(
  198 |                 "Packed struct encoding requires byte-aligned fixed-width children",
  199 |             ));
  200 |         }
  201 |         let bytes_per_value = (bits_per_value / 8) as usize;
  202 |         let start = row_idx
  203 |             .checked_mul(bytes_per_value)
  204 |             .ok_or_else(|| Error::invalid_input("Packed struct row size overflow"))?;
  205 |         let end = start.checked_add(bytes_per_value).ok_or_else(|| {
  206 |             Error::invalid_input(format!(
  207 |                 "Packed struct fixed child range overflow: row_idx={row_idx}, \
  208 |                  bytes_per_value={bytes_per_value}"
  209 |             ))
  210 |         })?;
  211 |         let data = self.block.data.as_ref();
  212 |         if end > data.len() {
  213 |             return Err(Error::invalid_input(
  214 |                 "Packed struct fixed child out of bounds",
  215 |             ));
  216 |         }
  217 |         output.extend_from_slice(&data[start..end]);
  218 |         Ok(())
  219 |     }
  220 | }
  221 | 
  222 | #[derive(Debug)]
  223 | enum VariablePackedFieldData {
  224 |     Fixed(FixedPackedFieldData),
  225 |     Variable {
  226 |         block: VariableWidthBlock,
  227 |         bits_per_length: u64,
  228 |     },
  229 | }
  230 | 
  231 | impl VariablePackedFieldData {
  232 |     fn append_row_bytes(&self, row_idx: usize, output: &mut Vec<u8>) -> Result<()> {
  233 |         match self {
  234 |             Self::Fixed(fixed_data) => fixed_data.append_row_bytes(row_idx, output),
  235 |             Self::Variable {
  236 |                 block,
  237 |                 bits_per_length,
  238 |             } => {
  239 |                 if !bits_per_length.is_multiple_of(8) {
  240 |                     return Err(Error::invalid_input(
  241 |                         "Packed struct variable children must have byte-aligned length prefixes",
  242 |                     ));
  243 |                 }
  244 |                 let prefix_bytes = (*bits_per_length / 8) as usize;
  245 |                 if !(prefix_bytes == 4 || prefix_bytes == 8) {
  246 |                     return Err(Error::invalid_input(
  247 |                         "Packed struct variable children must use 32 or 64-bit length prefixes",
  248 |                     ));
  249 |                 }
  250 |                 match block.bits_per_offset {
  251 |                     32 => {
  252 |                         let offsets = block.offsets.borrow_to_typed_slice::<u32>();
  253 |                         let start = offsets[row_idx] as usize;
  254 |                         let end = offsets[row_idx + 1] as usize;
  255 |                         if end > block.data.len() {
  256 |                             return Err(Error::invalid_input(
  257 |                                 "Packed struct variable child offsets out of bounds",
  258 |                             ));
  259 |                         }
  260 |                         let len = (end - start) as u32;
  261 |                         if prefix_bytes != std::mem::size_of::<u32>() {
  262 |                             return Err(Error::invalid_input(
  263 |                                 "Packed struct variable child length prefix mismatch",
  264 |                             ));
  265 |                         }
  266 |                         output.extend_from_slice(&len.to_le_bytes());
  267 |                         output.extend_from_slice(&block.data[start..end]);
  268 |                         Ok(())
  269 |                     }
  270 |                     64 => {
  271 |                         let offsets = block.offsets.borrow_to_typed_slice::<u64>();
  272 |                         let start = offsets[row_idx] as usize;
  273 |                         let end = offsets[row_idx + 1] as usize;
  274 |                         if end > block.data.len() {
  275 |                             return Err(Error::invalid_input(
  276 |                                 "Packed struct variable child offsets out of bounds",
  277 |                             ));
  278 |                         }
  279 |                         let len = (end - start) as u64;
  280 |                         if prefix_bytes != std::mem::size_of::<u64>() {
  281 |                             return Err(Error::invalid_input(
  282 |                                 "Packed struct variable child length prefix mismatch",
  283 |                             ));
  284 |                         }
  285 |                         output.extend_from_slice(&len.to_le_bytes());
  286 |                         output.extend_from_slice(&block.data[start..end]);
  287 |                         Ok(())
  288 |                     }
  289 |                     _ => Err(Error::invalid_input(
  290 |                         "Packed struct variable child must use 32 or 64-bit offsets",
  291 |                     )),
  292 |                 }
  293 |             }
  294 |         }
  295 |     }
  296 | }
  297 | 
  298 | fn check_struct_validity(data: DataBlock, field_length: usize) -> Result<StructDataBlock> {
  299 |     let DataBlock::Struct(struct_block) = data else {
  300 |         return Err(Error::invalid_input(
  301 |             "Packed struct encoder requires Struct data block",
  302 |         ));
  303 |     };
  304 | 
  305 |     if struct_block.children.is_empty() {
  306 |         return Err(Error::invalid_input(
  307 |             "Packed struct encoder requires at least one child field",
  308 |         ));
  309 |     }
  310 |     if struct_block.children.len() != field_length {
  311 |         return Err(Error::invalid_input(
  312 |             "Struct field metadata does not match number of children",
  313 |         ));
  314 |     }
  315 | 
  316 |     let num_values = struct_block.children[0].num_values();
  317 |     for child in struct_block.children.iter() {
  318 |         if child.num_values() != num_values {
  319 |             return Err(Error::invalid_input(
  320 |                 "Packed struct children must have matching value counts",
  321 |             ));
  322 |         }
  323 |     }
  324 |     Ok(struct_block)
  325 | }
  326 | 
  327 | #[derive(Debug)]
  328 | pub struct PackedStructVariablePerValueEncoder {
  329 |     strategy: Arc<dyn CompressionStrategy>,
  330 |     fields: Vec<Field>,
  331 | }
  332 | 
  333 | impl PackedStructVariablePerValueEncoder {
  334 |     pub fn new(strategy: Arc<dyn CompressionStrategy>, fields: Vec<Field>) -> Self {
  335 |         Self { strategy, fields }
  336 |     }
  337 | }
  338 | 
  339 | impl PerValueCompressor for PackedStructVariablePerValueEncoder {
  340 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  341 |         let struct_block = check_struct_validity(data, self.fields.len())?;
  342 |         let num_values = struct_block.children[0].num_values();
  343 |         let mut field_data = Vec::with_capacity(self.fields.len());
  344 |         let mut field_metadata = Vec::with_capacity(self.fields.len());
  345 | 
  346 |         for (field, child_block) in self.fields.iter().zip(struct_block.children) {
  347 |             let compressor = self.strategy.create_per_value(field, &child_block)?;
  348 |             let (compressed, encoding) = compressor.compress(child_block)?;
  349 |             match compressed {
  350 |                 PerValueDataBlock::Fixed(block) => {
  351 |                     field_metadata.push(ProtobufUtils21::packed_struct_field_fixed(
  352 |                         encoding,
  353 |                         block.bits_per_value,
  354 |                     ));
  355 |                     let block = FixedPackedFieldData { block };
  356 |                     field_data.push(VariablePackedFieldData::Fixed(block));
  357 |                 }
  358 |                 PerValueDataBlock::Variable(block) => {
  359 |                     let bits_per_length = block.bits_per_offset as u64;
  360 |                     field_metadata.push(ProtobufUtils21::packed_struct_field_variable(
  361 |                         encoding,
  362 |                         bits_per_length,
  363 |                     ));
  364 |                     field_data.push(VariablePackedFieldData::Variable {
  365 |                         block,
  366 |                         bits_per_length,
  367 |                     });
  368 |                 }
  369 |             }
  370 |         }
  371 | 
  372 |         let mut row_data: Vec<u8> = Vec::new();
  373 |         let mut row_offsets: Vec<u64> = Vec::with_capacity(num_values as usize + 1);
  374 |         row_offsets.push(0);
  375 |         let mut total_bytes: usize = 0;
  376 |         let mut max_row_len: usize = 0;
  377 |         for row in 0..num_values as usize {
  378 |             let start = row_data.len();
  379 |             for field in &field_data {
  380 |                 field.append_row_bytes(row, &mut row_data)?;
  381 |             }
  382 |             let end = row_data.len();
  383 |             let row_len = end - start;
  384 |             max_row_len = max_row_len.max(row_len);
  385 |             total_bytes = total_bytes
  386 |                 .checked_add(row_len)
  387 |                 .ok_or_else(|| Error::invalid_input("Packed struct row data size overflow"))?;
  388 |             row_offsets.push(end as u64);
  389 |         }
  390 |         debug_assert_eq!(total_bytes, row_data.len());
  391 | 
  392 |         let use_u32_offsets = total_bytes <= u32::MAX as usize && max_row_len <= u32::MAX as usize;
  393 |         let bits_per_offset = if use_u32_offsets { 32 } else { 64 };
  394 |         let offsets_buffer = if use_u32_offsets {
  395 |             let offsets_u32 = row_offsets
  396 |                 .iter()
  397 |                 .map(|&offset| offset as u32)
  398 |                 .collect::<Vec<_>>();
  399 |             LanceBuffer::reinterpret_vec(offsets_u32)
  400 |         } else {
  401 |             LanceBuffer::reinterpret_vec(row_offsets)
  402 |         };
  403 | 
  404 |         let data_block = VariableWidthBlock {
  405 |             data: LanceBuffer::from(row_data),
  406 |             bits_per_offset,
  407 |             offsets: offsets_buffer,
  408 |             num_values,
  409 |             block_info: BlockInfo::new(),
  410 |         };
  411 | 
  412 |         Ok((
  413 |             PerValueDataBlock::Variable(data_block),
  414 |             ProtobufUtils21::packed_struct_variable(field_metadata),
  415 |         ))
  416 |     }
  417 | }
  418 | 
  419 | #[derive(Debug)]
  420 | pub(crate) struct PackedStructFixedPerValueEncoder {
  421 |     field_len: usize,
  422 | }
  423 | 
  424 | impl PackedStructFixedPerValueEncoder {
  425 |     pub(crate) fn new(fields: Vec<Field>) -> Self {
  426 |         Self {
  427 |             field_len: fields.len(),
  428 |         }
  429 |     }
  430 | }
  431 | 
  432 | impl PerValueCompressor for PackedStructFixedPerValueEncoder {
  433 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  434 |         let struct_block = check_struct_validity(data, self.field_len)?;
  435 | 
  436 |         if struct_block.has_variable_width_child() {
  437 |             return Err(Error::invalid_input(
  438 |                 "Packed struct fixed encoding requires all children to be fixed-width",
  439 |             ));
  440 |         }
  441 | 
  442 |         let num_values = struct_block.children[0].num_values();
  443 |         // Fixed length - supporting only flat encoding
  444 |         let compressor = Box::new(ValueEncoder::default()) as Box<dyn PerValueCompressor>;
  445 |         let mut field_data = Vec::with_capacity(self.field_len);
  446 |         let mut field_bits_per_value = Vec::with_capacity(self.field_len);
  447 |         let mut bits_per_row: u64 = 0;
  448 | 
  449 |         for child_block in struct_block.children.into_iter() {
  450 |             let (compressed, ..) = compressor.compress(child_block)?;
  451 |             match compressed {
  452 |                 PerValueDataBlock::Fixed(block) => {
  453 |                     bits_per_row = bits_per_row
  454 |                         .checked_add(block.bits_per_value)
  455 |                         .ok_or_else(|| Error::invalid_input("Packed struct row width overflow"))?;
  456 |                     field_bits_per_value.push(block.bits_per_value);
  457 |                     field_data.push(FixedPackedFieldData { block });
  458 |                 }
  459 |                 _ => {
  460 |                     return Err(Error::invalid_input(
  461 |                         "Packed struct fixed encoding requires all children to be fixed-width",
  462 |                     ));
  463 |                 }
  464 |             }
  465 |         }
  466 | 
  467 |         // Children are validated byte-aligned in `append_row_bytes`, so the row width
  468 |         // is an exact number of bytes.
  469 |         let bytes_per_row = (bits_per_row / 8) as usize;
  470 |         let mut row_data: Vec<u8> =
  471 |             Vec::with_capacity(bytes_per_row.saturating_mul(num_values as usize));
  472 |         for row in 0..num_values as usize {
  473 |             for field in &field_data {
  474 |                 field.append_row_bytes(row, &mut row_data)?;
  475 |             }
  476 |             debug_assert_eq!(row_data.len(), bytes_per_row * (row + 1));
  477 |         }
  478 | 
  479 |         let data_block = FixedWidthDataBlock {
  480 |             data: LanceBuffer::from(row_data),
  481 |             bits_per_value: bits_per_row,
  482 |             num_values,
  483 |             block_info: BlockInfo::new(),
  484 |         };
  485 | 
  486 |         Ok((
  487 |             PerValueDataBlock::Fixed(data_block),
  488 |             ProtobufUtils21::packed_struct(
  489 |                 ProtobufUtils21::flat(bits_per_row, None),
  490 |                 field_bits_per_value,
  491 |             ),
  492 |         ))
  493 |     }
  494 | }
  495 | 
  496 | #[derive(Debug)]
  497 | pub(crate) enum VariablePackedStructFieldKind {
  498 |     Fixed {
  499 |         bits_per_value: u64,
  500 |         decompressor: Arc<dyn FixedPerValueDecompressor>,
  501 |     },
  502 |     Variable {
  503 |         bits_per_length: u64,
  504 |         decompressor: Arc<dyn VariablePerValueDecompressor>,
  505 |     },
  506 | }
  507 | 
  508 | #[derive(Debug)]
  509 | pub(crate) struct VariablePackedStructFieldDecoder {
  510 |     pub(crate) kind: VariablePackedStructFieldKind,
  511 | }
  512 | 
  513 | #[derive(Debug)]
  514 | pub struct PackedStructVariablePerValueDecompressor {
  515 |     fields: Vec<VariablePackedStructFieldDecoder>,
  516 | }
  517 | 
  518 | impl PackedStructVariablePerValueDecompressor {
  519 |     pub(crate) fn new(fields: Vec<VariablePackedStructFieldDecoder>) -> Self {
  520 |         Self { fields }
  521 |     }
  522 | }
  523 | 
  524 | #[derive(Debug)]
  525 | struct FixedFieldAccumulator {
  526 |     builder: DataBlockBuilder,
  527 |     bits_per_value: u64,
  528 |     empty_value: DataBlock,
  529 | }
  530 | 
  531 | impl FixedFieldAccumulator {
  532 |     fn append_empty(&mut self) -> Result<()> {
  533 |         self.builder.append(&self.empty_value, 0..1)
  534 |     }
  535 | 
  536 |     fn new(bits_per_value: u64, num_values: u64) -> Result<Self> {
  537 |         if !bits_per_value.is_multiple_of(8) {
  538 |             return Err(Error::invalid_input(
  539 |                 "Packed struct fixed child must be byte-aligned",
  540 |             ));
  541 |         }
  542 | 
  543 |         let bytes_per_value = bits_per_value.checked_div(8).ok_or_else(|| {
  544 |             Error::invalid_input("Invalid bits per value for packed struct field")
  545 |         })?;
  546 | 
  547 |         let estimate = bytes_per_value
  548 |             .checked_mul(num_values)
  549 |             .ok_or_else(|| Error::invalid_input("Packed struct fixed child allocation overflow"))?;
  550 | 
  551 |         let empty_value = DataBlock::FixedWidth(FixedWidthDataBlock {
  552 |             data: LanceBuffer::from(vec![0_u8; bytes_per_value as usize]),
  553 |             bits_per_value,
  554 |             num_values: 1,
  555 |             block_info: BlockInfo::new(),
  556 |         });
  557 | 
  558 |         Ok(Self {
  559 |             builder: DataBlockBuilder::with_capacity_estimate(estimate),
  560 |             bits_per_value,
  561 |             empty_value,
  562 |         })
  563 |     }
  564 | 
  565 |     fn finish(self) -> Result<FixedWidthDataBlock> {
  566 |         let DataBlock::FixedWidth(block) = self.builder.finish() else {
  567 |             return Err(Error::invalid_input(
  568 |                 "Expected fixed-width datablock from builder",
  569 |             ));
  570 |         };
  571 |         Ok(block)
  572 |     }
  573 | }
  574 | 
  575 | enum FieldAccumulator {
  576 |     Fixed(FixedFieldAccumulator),
  577 |     Variable32 {
  578 |         builder: DataBlockBuilder,
  579 |         empty_value: DataBlock,
  580 |     },
  581 |     Variable64 {
  582 |         builder: DataBlockBuilder,
  583 |         empty_value: DataBlock,
  584 |     },
  585 | }
  586 | 
  587 | impl FieldAccumulator {
  588 |     // In full-zip variable packed decoding, rep/def may produce a visible row
  589 |     // with an empty payload (e.g. null/invalid item). We still need to append
  590 |     // one placeholder per child so child row counts remain aligned.
  591 |     fn append_empty(&mut self) -> Result<()> {
  592 |         match self {
  593 |             Self::Fixed(fixed_field_accumulator) => fixed_field_accumulator.append_empty(),
  594 |             Self::Variable32 {
  595 |                 builder,
  596 |                 empty_value,
  597 |             } => builder.append(empty_value, 0..1),
  598 |             Self::Variable64 {
  599 |                 builder,
  600 |                 empty_value,
  601 |             } => builder.append(empty_value, 0..1),
  602 |         }
  603 |     }
  604 | }
  605 | 
  606 | impl VariablePerValueDecompressor for PackedStructVariablePerValueDecompressor {
  607 |     fn decompress(&self, data: VariableWidthBlock) -> Result<DataBlock> {
  608 |         let num_values = data.num_values;
  609 |         let offsets_u64 = match data.bits_per_offset {
  610 |             32 => data
  611 |                 .offsets
  612 |                 .borrow_to_typed_slice::<u32>()
  613 |                 .iter()
  614 |                 .map(|v| *v as u64)
  615 |                 .collect::<Vec<_>>(),
  616 |             64 => data
  617 |                 .offsets
  618 |                 .borrow_to_typed_slice::<u64>()
  619 |                 .as_ref()
  620 |                 .to_vec(),
  621 |             _ => {
  622 |                 return Err(Error::invalid_input(
  623 |                     "Packed struct row offsets must be 32 or 64 bits",
  624 |                 ));
  625 |             }
  626 |         };
  627 | 
  628 |         if offsets_u64.len() != num_values as usize + 1 {
  629 |             return Err(Error::invalid_input(
  630 |                 "Packed struct row offsets length mismatch",
  631 |             ));
  632 |         }
  633 | 
  634 |         let mut accumulators = Vec::with_capacity(self.fields.len());
  635 |         for field in &self.fields {
  636 |             match &field.kind {
  637 |                 VariablePackedStructFieldKind::Fixed { bits_per_value, .. } => {
  638 |                     let accumulator = FixedFieldAccumulator::new(*bits_per_value, num_values)?;
  639 |                     accumulators.push(FieldAccumulator::Fixed(accumulator));
  640 |                 }
  641 |                 VariablePackedStructFieldKind::Variable {
  642 |                     bits_per_length, ..
  643 |                 } => match bits_per_length {
  644 |                     32 => accumulators.push(FieldAccumulator::Variable32 {
  645 |                         builder: DataBlockBuilder::with_capacity_estimate(data.data.len() as u64),
  646 |                         empty_value: DataBlock::VariableWidth(VariableWidthBlock {
  647 |                             data: LanceBuffer::empty(),
  648 |                             bits_per_offset: 32,
  649 |                             offsets: LanceBuffer::reinterpret_vec(vec![0_u32, 0_u32]),
  650 |                             num_values: 1,
  651 |                             block_info: BlockInfo::new(),
  652 |                         }),
  653 |                     }),
  654 |                     64 => accumulators.push(FieldAccumulator::Variable64 {
  655 |                         builder: DataBlockBuilder::with_capacity_estimate(data.data.len() as u64),
  656 |                         empty_value: DataBlock::VariableWidth(VariableWidthBlock {
  657 |                             data: LanceBuffer::empty(),
  658 |                             bits_per_offset: 64,
  659 |                             offsets: LanceBuffer::reinterpret_vec(vec![0_u64, 0_u64]),
  660 |                             num_values: 1,
  661 |                             block_info: BlockInfo::new(),
  662 |                         }),
  663 |                     }),
  664 |                     _ => {
  665 |                         return Err(Error::invalid_input(
  666 |                             "Packed struct variable child must use 32 or 64-bit length prefixes",
  667 |                         ));
  668 |                     }
  669 |                 },
  670 |             }
  671 |         }
  672 | 
  673 |         for row_idx in 0..num_values as usize {
  674 |             let row_start = offsets_u64[row_idx] as usize;
  675 |             let row_end = offsets_u64[row_idx + 1] as usize;
  676 |             if row_end > data.data.len() || row_start > row_end {
  677 |                 return Err(Error::invalid_input(
  678 |                     "Packed struct row bounds exceed buffer",
  679 |                 ));
  680 |             }
  681 |             if row_start == row_end {
  682 |                 for accumulator in accumulators.iter_mut() {
  683 |                     accumulator.append_empty()?;
  684 |                 }
  685 |                 continue;
  686 |             }
  687 |             let mut cursor = row_start;
  688 |             for (field, accumulator) in self.fields.iter().zip(accumulators.iter_mut()) {
  689 |                 match (&field.kind, accumulator) {
  690 |                     (
  691 |                         VariablePackedStructFieldKind::Fixed { bits_per_value, .. },
  692 |                         FieldAccumulator::Fixed(fixed_accumulator),
  693 |                     ) => {
  694 |                         debug_assert_eq!(*bits_per_value, fixed_accumulator.bits_per_value);
  695 |                         let bytes_per_value = (*bits_per_value / 8) as usize;
  696 |                         let end = cursor + bytes_per_value;
  697 |                         if end > row_end {
  698 |                             return Err(Error::invalid_input(
  699 |                                 "Packed struct fixed child exceeds row bounds",
  700 |                             ));
  701 |                         }
  702 |                         let value_block = DataBlock::FixedWidth(FixedWidthDataBlock {
  703 |                             data: LanceBuffer::from(data.data[cursor..end].to_vec()),
  704 |                             bits_per_value: *bits_per_value,
  705 |                             num_values: 1,
  706 |                             block_info: BlockInfo::new(),
  707 |                         });
  708 |                         fixed_accumulator.builder.append(&value_block, 0..1)?;
  709 |                         cursor = end;
  710 |                     }
  711 |                     (
  712 |                         VariablePackedStructFieldKind::Variable {
  713 |                             bits_per_length, ..
  714 |                         },
  715 |                         FieldAccumulator::Variable32 { builder, .. },
  716 |                     ) => {
  717 |                         if *bits_per_length != 32 {
  718 |                             return Err(Error::invalid_input(
  719 |                                 "Packed struct length prefix size mismatch",
  720 |                             ));
  721 |                         }
  722 |                         let end = cursor + std::mem::size_of::<u32>();
  723 |                         if end > row_end {
  724 |                             return Err(Error::invalid_input(
  725 |                                 "Packed struct variable child length prefix out of bounds",
  726 |                             ));
  727 |                         }
  728 |                         let len = u32::from_le_bytes(
  729 |                             data.data[cursor..end]
  730 |                                 .try_into()
  731 |                                 .expect("slice has exact length"),
  732 |                         ) as usize;
  733 |                         cursor = end;
  734 |                         let value_end = cursor + len;
  735 |                         if value_end > row_end {
  736 |                             return Err(Error::invalid_input(
  737 |                                 "Packed struct variable child exceeds row bounds",
  738 |                             ));
  739 |                         }
  740 |                         let value_block = DataBlock::VariableWidth(VariableWidthBlock {
  741 |                             data: LanceBuffer::from(data.data[cursor..value_end].to_vec()),
  742 |                             bits_per_offset: 32,
  743 |                             offsets: LanceBuffer::reinterpret_vec(vec![0_u32, len as u32]),
  744 |                             num_values: 1,
  745 |                             block_info: BlockInfo::new(),
  746 |                         });
  747 |                         builder.append(&value_block, 0..1)?;
  748 |                         cursor = value_end;
  749 |                     }
  750 |                     (
  751 |                         VariablePackedStructFieldKind::Variable {
  752 |                             bits_per_length, ..
  753 |                         },
  754 |                         FieldAccumulator::Variable64 { builder, .. },
  755 |                     ) => {
  756 |                         if *bits_per_length != 64 {
  757 |                             return Err(Error::invalid_input(
  758 |                                 "Packed struct length prefix size mismatch",
  759 |                             ));
  760 |                         }
  761 |                         let end = cursor + std::mem::size_of::<u64>();
  762 |                         if end > row_end {
  763 |                             return Err(Error::invalid_input(
  764 |                                 "Packed struct variable child length prefix out of bounds",
  765 |                             ));
  766 |                         }
  767 |                         let len = u64::from_le_bytes(
  768 |                             data.data[cursor..end]
  769 |                                 .try_into()
  770 |                                 .expect("slice has exact length"),
  771 |                         ) as usize;
  772 |                         cursor = end;
  773 |                         let value_end = cursor + len;
  774 |                         if value_end > row_end {
  775 |                             return Err(Error::invalid_input(
  776 |                                 "Packed struct variable child exceeds row bounds",
  777 |                             ));
  778 |                         }
  779 |                         let value_block = DataBlock::VariableWidth(VariableWidthBlock {
  780 |                             data: LanceBuffer::from(data.data[cursor..value_end].to_vec()),
  781 |                             bits_per_offset: 64,
  782 |                             offsets: LanceBuffer::reinterpret_vec(vec![0_u64, len as u64]),
  783 |                             num_values: 1,
  784 |                             block_info: BlockInfo::new(),
  785 |                         });
  786 |                         builder.append(&value_block, 0..1)?;
  787 |                         cursor = value_end;
  788 |                     }
  789 |                     _ => {
  790 |                         return Err(Error::invalid_input(
  791 |                             "Packed struct accumulator kind mismatch",
  792 |                         ));
  793 |                     }
  794 |                 }
  795 |             }
  796 |             if cursor != row_end {
  797 |                 return Err(Error::invalid_input(
  798 |                     "Packed struct row parsing did not consume full row",
  799 |                 ));
  800 |             }
  801 |         }
  802 | 
  803 |         let mut children = Vec::with_capacity(self.fields.len());
  804 |         for (field, accumulator) in self.fields.iter().zip(accumulators) {
  805 |             match (field, accumulator) {
  806 |                 (
  807 |                     VariablePackedStructFieldDecoder {
  808 |                         kind: VariablePackedStructFieldKind::Fixed { decompressor, .. },
  809 |                     },
  810 |                     FieldAccumulator::Fixed(fixed_accumulator),
  811 |                 ) => {
  812 |                     let finished_accumulator = fixed_accumulator.finish()?;
  813 |                     let decoded = decompressor.decompress(finished_accumulator, num_values)?;
  814 |                     children.push(decoded);
  815 |                 }
  816 |                 (
  817 |                     VariablePackedStructFieldDecoder {
  818 |                         kind:
  819 |                             VariablePackedStructFieldKind::Variable {
  820 |                                 bits_per_length,
  821 |                                 decompressor,
  822 |                             },
  823 |                     },
  824 |                     FieldAccumulator::Variable32 { builder, .. },
  825 |                 ) => {
  826 |                     let DataBlock::VariableWidth(mut block) = builder.finish() else {
  827 |                         panic!("Expected variable-width datablock from builder");
  828 |                     };
  829 |                     debug_assert_eq!(block.bits_per_offset, 32);
  830 |                     block.bits_per_offset = (*bits_per_length) as u8;
  831 |                     let decoded = decompressor.decompress(block)?;
  832 |                     children.push(decoded);
  833 |                 }
  834 |                 (
  835 |                     VariablePackedStructFieldDecoder {
  836 |                         kind:
  837 |                             VariablePackedStructFieldKind::Variable {
  838 |                                 bits_per_length,
  839 |                                 decompressor,
  840 |                             },
  841 |                     },
  842 |                     FieldAccumulator::Variable64 { builder, .. },
  843 |                 ) => {
  844 |                     let DataBlock::VariableWidth(mut block) = builder.finish() else {
  845 |                         panic!("Expected variable-width datablock from builder");
  846 |                     };
  847 |                     debug_assert_eq!(block.bits_per_offset, 64);
  848 |                     block.bits_per_offset = (*bits_per_length) as u8;
  849 |                     let decoded = decompressor.decompress(block)?;
  850 |                     children.push(decoded);
  851 |                 }
  852 |                 _ => {
  853 |                     return Err(Error::invalid_input(
  854 |                         "Packed struct accumulator mismatch during finalize",
  855 |                     ));
  856 |                 }
  857 |             }
  858 |         }
  859 | 
  860 |         Ok(DataBlock::Struct(StructDataBlock {
  861 |             children,
  862 |             block_info: BlockInfo::new(),
  863 |             validity: None,
  864 |         }))
  865 |     }
  866 | }
  867 | 
  868 | #[derive(Debug)]
  869 | struct PackedStructFixedFieldDecoder {
  870 |     bits_per_value: u64,
  871 |     decompressor: Box<dyn FixedPerValueDecompressor>,
  872 | }
  873 | 
  874 | #[derive(Debug)]
  875 | pub(crate) struct PackedStructFixedPerValueDecompressor {
  876 |     decoders: Vec<PackedStructFixedFieldDecoder>,
  877 | }
  878 | 
  879 | impl PackedStructFixedPerValueDecompressor {
  880 |     pub(crate) fn new(description: &PackedStruct) -> Result<Self> {
  881 |         let compression = description
  882 |             .values
  883 |             .as_ref()
  884 |             .ok_or_else(|| Error::invalid_input("PackedStruct missing values encoding"))?
  885 |             .compression
  886 |             .as_ref()
  887 |             .ok_or_else(|| {
  888 |                 Error::invalid_input("PackedStruct values missing compression encoding")
  889 |             })?;
  890 | 
  891 |         // The encoder always flat-encodes each child, so that is the only layout we can decode.
  892 |         if !matches!(compression, Compression::Flat(..)) {
  893 |             return Err(Error::invalid_input(
  894 |                 "PackedStruct fixed encoding currently requires flat compression",
  895 |             ));
  896 |         }
  897 | 
  898 |         let decoders = description
  899 |             .bits_per_value
  900 |             .iter()
  901 |             .map(|&bits_per_value| {
  902 |                 let flat = crate::format::pb21::Flat {
  903 |                     bits_per_value,
  904 |                     data: None,
  905 |                 };
  906 |                 PackedStructFixedFieldDecoder {
  907 |                     bits_per_value,
  908 |                     decompressor: Box::new(ValueDecompressor::from_flat(&flat)),
  909 |                 }
  910 |             })
  911 |             .collect();
  912 |         Ok(Self { decoders })
  913 |     }
  914 | }
  915 | 
  916 | impl FixedPerValueDecompressor for PackedStructFixedPerValueDecompressor {
  917 |     fn decompress(&self, data: FixedWidthDataBlock, num_values: u64) -> Result<DataBlock> {
  918 |         if !data.bits_per_value.is_multiple_of(8) {
  919 |             return Err(Error::invalid_input(
  920 |                 "Packed struct fixed encoding requires byte-aligned children",
  921 |             ));
  922 |         }
  923 |         let bytes_per_row = (data.bits_per_value / 8) as usize;
  924 | 
  925 |         // Byte offset of each child within a packed row (a running prefix sum of the
  926 |         // child widths). The final offset must equal the packed row width.
  927 |         let mut child_bytes = Vec::with_capacity(self.decoders.len());
  928 |         for decoder in &self.decoders {
  929 |             if !decoder.bits_per_value.is_multiple_of(8) {
  930 |                 return Err(Error::invalid_input(
  931 |                     "Packed struct fixed child must be byte-aligned",
  932 |                 ));
  933 |             }
  934 |             child_bytes.push((decoder.bits_per_value / 8) as usize);
  935 |         }
  936 |         if child_bytes.iter().sum::<usize>() != bytes_per_row {
  937 |             return Err(Error::invalid_input(
  938 |                 "Packed struct child widths do not sum to the packed row width",
  939 |             ));
  940 |         }
  941 |         if bytes_per_row.saturating_mul(num_values as usize) > data.data.len() {
  942 |             return Err(Error::invalid_input(
  943 |                 "Packed struct row bounds exceed buffer",
  944 |             ));
  945 |         }
  946 | 
  947 |         // Un-zip the row-major buffer one child at a time by gathering that child's
  948 |         // slice out of every row, then hand the column to the child decompressor.
  949 |         let bytes = data.data.as_ref();
  950 |         let mut children = Vec::with_capacity(self.decoders.len());
  951 |         let mut field_offset = 0;
  952 |         for (decoder, &field_bytes) in self.decoders.iter().zip(child_bytes.iter()) {
  953 |             let mut child_buf = Vec::with_capacity(field_bytes * num_values as usize);
  954 |             for row_idx in 0..num_values as usize {
  955 |                 let start = row_idx * bytes_per_row + field_offset;
  956 |                 child_buf.extend_from_slice(&bytes[start..start + field_bytes]);
  957 |             }
  958 |             let child_block = FixedWidthDataBlock {
  959 |                 data: LanceBuffer::from(child_buf),
  960 |                 bits_per_value: decoder.bits_per_value,
  961 |                 num_values,
  962 |                 block_info: BlockInfo::new(),
  963 |             };
  964 |             children.push(decoder.decompressor.decompress(child_block, num_values)?);
  965 |             field_offset += field_bytes;
  966 |         }
  967 | 
  968 |         Ok(DataBlock::Struct(StructDataBlock {
  969 |             children,
  970 |             block_info: BlockInfo::new(),
  971 |             validity: None,
  972 |         }))
  973 |     }
  974 | 
  975 |     fn bits_per_value(&self) -> u64 {
  976 |         self.decoders
  977 |             .iter()
  978 |             .map(|decoder| decoder.bits_per_value)
  979 |             .sum()
  980 |     }
  981 | }
  982 | 
  983 | #[cfg(test)]
  984 | mod tests {
  985 |     use super::*;
  986 |     use crate::{
  987 |         compression::CompressionStrategy,
  988 |         compression::DefaultDecompressionStrategy,
  989 |         compression_config::CompressionParams,
  990 |         constants::{
  991 |             PACKED_STRUCT_META_KEY, STRUCTURAL_ENCODING_FULLZIP, STRUCTURAL_ENCODING_META_KEY,
  992 |         },
  993 |         statistics::ComputeStat,
  994 |         testing::{
  995 |             TestCases, TestEncoding, check_round_trip_encoding_of_data, test_compression_strategy,
  996 |         },
  997 |     };
  998 |     use arrow_array::{
  999 |         Array, ArrayRef, BinaryArray, Int32Array, Int64Array, LargeStringArray, StringArray,
 1000 |         StructArray, UInt32Array,
 1001 |     };
 1002 |     use arrow_schema::{DataType, Field as ArrowField, Fields};
 1003 |     use std::collections::HashMap;
 1004 |     use std::sync::Arc;
 1005 | 
 1006 |     fn fixed_block_from_array(array: Int64Array) -> FixedWidthDataBlock {
 1007 |         let num_values = array.len() as u64;
 1008 |         let block = DataBlock::from_arrays(&[Arc::new(array) as ArrayRef], num_values);
 1009 |         match block {
 1010 |             DataBlock::FixedWidth(block) => block,
 1011 |             _ => panic!("Expected fixed-width data block"),
 1012 |         }
 1013 |     }
 1014 | 
 1015 |     fn fixed_i32_block_from_array(array: Int32Array) -> FixedWidthDataBlock {
 1016 |         let num_values = array.len() as u64;
 1017 |         let block = DataBlock::from_arrays(&[Arc::new(array) as ArrayRef], num_values);
 1018 |         match block {
 1019 |             DataBlock::FixedWidth(block) => block,
 1020 |             _ => panic!("Expected fixed-width data block"),
 1021 |         }
 1022 |     }
 1023 | 
 1024 |     fn variable_block_from_string_array(array: StringArray) -> VariableWidthBlock {
 1025 |         let num_values = array.len() as u64;
 1026 |         let block = DataBlock::from_arrays(&[Arc::new(array) as ArrayRef], num_values);
 1027 |         match block {
 1028 |             DataBlock::VariableWidth(block) => block,
 1029 |             _ => panic!("Expected variable-width block"),
 1030 |         }
 1031 |     }
 1032 | 
 1033 |     fn variable_block_from_large_string_array(array: LargeStringArray) -> VariableWidthBlock {
 1034 |         let num_values = array.len() as u64;
 1035 |         let block = DataBlock::from_arrays(&[Arc::new(array) as ArrayRef], num_values);
 1036 |         match block {
 1037 |             DataBlock::VariableWidth(block) => block,
 1038 |             _ => panic!("Expected variable-width block"),
 1039 |         }
 1040 |     }
 1041 | 
 1042 |     fn variable_block_from_binary_array(array: BinaryArray) -> VariableWidthBlock {
 1043 |         let num_values = array.len() as u64;
 1044 |         let block = DataBlock::from_arrays(&[Arc::new(array) as ArrayRef], num_values);
 1045 |         match block {
 1046 |             DataBlock::VariableWidth(block) => block,
 1047 |             _ => panic!("Expected variable-width block"),
 1048 |         }
 1049 |     }
 1050 | 
 1051 |     #[test]
 1052 |     fn variable_packed_struct_round_trip() -> Result<()> {
 1053 |         let arrow_fields: Fields = vec![
 1054 |             ArrowField::new("id", DataType::UInt32, false),
 1055 |             ArrowField::new("name", DataType::Utf8, true),
 1056 |         ]
 1057 |         .into();
 1058 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1059 |         let struct_field = Field::try_from(&arrow_struct)?;
 1060 | 
 1061 |         let ids = vec![1_u32, 2, 42];
 1062 |         let id_bytes = ids
 1063 |             .iter()
 1064 |             .flat_map(|value| value.to_le_bytes())
 1065 |             .collect::<Vec<_>>();
 1066 |         let mut id_block = FixedWidthDataBlock {
 1067 |             data: LanceBuffer::reinterpret_vec(ids),
 1068 |             bits_per_value: 32,
 1069 |             num_values: 3,
 1070 |             block_info: BlockInfo::new(),
 1071 |         };
 1072 |         id_block.compute_stat();
 1073 |         let id_block = DataBlock::FixedWidth(id_block);
 1074 | 
 1075 |         let name_offsets = vec![0_i32, 1, 4, 4];
 1076 |         let name_bytes = b"abcz".to_vec();
 1077 |         let mut name_block = VariableWidthBlock {
 1078 |             data: LanceBuffer::from(name_bytes.clone()),
 1079 |             bits_per_offset: 32,
 1080 |             offsets: LanceBuffer::reinterpret_vec(name_offsets.clone()),
 1081 |             num_values: 3,
 1082 |             block_info: BlockInfo::new(),
 1083 |         };
 1084 |         name_block.compute_stat();
 1085 |         let name_block = DataBlock::VariableWidth(name_block);
 1086 | 
 1087 |         let struct_block = StructDataBlock {
 1088 |             children: vec![id_block, name_block],
 1089 |             block_info: BlockInfo::new(),
 1090 |             validity: None,
 1091 |         };
 1092 | 
 1093 |         let data_block = DataBlock::Struct(struct_block);
 1094 | 
 1095 |         let compression_strategy =
 1096 |             test_compression_strategy(TestEncoding::StructuralU32, CompressionParams::default());
 1097 |         let compressor = crate::compression::CompressionStrategy::create_per_value(
 1098 |             compression_strategy.as_ref(),
 1099 |             &struct_field,
 1100 |             &data_block,
 1101 |         )?;
 1102 |         let (compressed, encoding) = compressor.compress(data_block)?;
 1103 | 
 1104 |         let PerValueDataBlock::Variable(zipped) = compressed else {
 1105 |             panic!("expected variable-width packed struct output");
 1106 |         };
 1107 | 
 1108 |         let decompression_strategy = DefaultDecompressionStrategy::default();
 1109 |         let decompressor =
 1110 |             crate::compression::DecompressionStrategy::create_variable_per_value_decompressor(
 1111 |                 &decompression_strategy,
 1112 |                 &encoding,
 1113 |             )?;
 1114 |         let decoded = decompressor.decompress(zipped)?;
 1115 | 
 1116 |         let DataBlock::Struct(decoded_struct) = decoded else {
 1117 |             panic!("expected struct datablock after decode");
 1118 |         };
 1119 | 
 1120 |         let decoded_id = decoded_struct.children[0].as_fixed_width_ref().unwrap();
 1121 |         assert_eq!(decoded_id.bits_per_value, 32);
 1122 |         assert_eq!(decoded_id.data.as_ref(), id_bytes.as_slice());
 1123 | 
 1124 |         let decoded_name = decoded_struct.children[1].as_variable_width_ref().unwrap();
 1125 |         assert_eq!(decoded_name.bits_per_offset, 32);
 1126 |         let decoded_offsets = decoded_name.offsets.borrow_to_typed_slice::<i32>();
 1127 |         assert_eq!(decoded_offsets.as_ref(), name_offsets.as_slice());
 1128 |         assert_eq!(decoded_name.data.as_ref(), name_bytes.as_slice());
 1129 | 
 1130 |         Ok(())
 1131 |     }
 1132 | 
 1133 |     #[test]
 1134 |     fn variable_packed_struct_large_utf8_round_trip() -> Result<()> {
 1135 |         let arrow_fields: Fields = vec![
 1136 |             ArrowField::new("value", DataType::Int64, false),
 1137 |             ArrowField::new("text", DataType::LargeUtf8, false),
 1138 |         ]
 1139 |         .into();
 1140 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1141 |         let struct_field = Field::try_from(&arrow_struct)?;
 1142 | 
 1143 |         let id_block = fixed_block_from_array(Int64Array::from(vec![10, 20, 30, 40]));
 1144 |         let payload_array = LargeStringArray::from(vec![
 1145 |             "alpha",
 1146 |             "a considerably longer payload for testing",
 1147 |             "mid",
 1148 |             "z",
 1149 |         ]);
 1150 |         let payload_block = variable_block_from_large_string_array(payload_array);
 1151 | 
 1152 |         let struct_block = StructDataBlock {
 1153 |             children: vec![
 1154 |                 DataBlock::FixedWidth(id_block.clone()),
 1155 |                 DataBlock::VariableWidth(payload_block.clone()),
 1156 |             ],
 1157 |             block_info: BlockInfo::new(),
 1158 |             validity: None,
 1159 |         };
 1160 | 
 1161 |         let data_block = DataBlock::Struct(struct_block);
 1162 | 
 1163 |         let compression_strategy =
 1164 |             test_compression_strategy(TestEncoding::StructuralU32, CompressionParams::default());
 1165 |         let compressor = crate::compression::CompressionStrategy::create_per_value(
 1166 |             compression_strategy.as_ref(),
 1167 |             &struct_field,
 1168 |             &data_block,
 1169 |         )?;
 1170 |         let (compressed, encoding) = compressor.compress(data_block)?;
 1171 | 
 1172 |         let PerValueDataBlock::Variable(zipped) = compressed else {
 1173 |             panic!("expected variable-width packed struct output");
 1174 |         };
 1175 | 
 1176 |         let decompression_strategy = DefaultDecompressionStrategy::default();
 1177 |         let decompressor =
 1178 |             crate::compression::DecompressionStrategy::create_variable_per_value_decompressor(
 1179 |                 &decompression_strategy,
 1180 |                 &encoding,
 1181 |             )?;
 1182 |         let decoded = decompressor.decompress(zipped)?;
 1183 | 
 1184 |         let DataBlock::Struct(decoded_struct) = decoded else {
 1185 |             panic!("expected struct datablock after decode");
 1186 |         };
 1187 | 
 1188 |         let decoded_id = decoded_struct.children[0].as_fixed_width_ref().unwrap();
 1189 |         assert_eq!(decoded_id.bits_per_value, 64);
 1190 |         assert_eq!(decoded_id.data.as_ref(), id_block.data.as_ref());
 1191 | 
 1192 |         let decoded_payload = decoded_struct.children[1].as_variable_width_ref().unwrap();
 1193 |         assert_eq!(decoded_payload.bits_per_offset, 64);
 1194 |         assert_eq!(
 1195 |             decoded_payload
 1196 |                 .offsets
 1197 |                 .borrow_to_typed_slice::<i64>()
 1198 |                 .as_ref(),
 1199 |             payload_block
 1200 |                 .offsets
 1201 |                 .borrow_to_typed_slice::<i64>()
 1202 |                 .as_ref()
 1203 |         );
 1204 |         assert_eq!(decoded_payload.data.as_ref(), payload_block.data.as_ref());
 1205 | 
 1206 |         Ok(())
 1207 |     }
 1208 | 
 1209 |     #[tokio::test]
 1210 |     async fn variable_packed_struct_utf8_round_trip() {
 1211 |         // schema: Struct<id: UInt32, uri: Utf8, long_text: LargeUtf8>
 1212 |         let fields = Fields::from(vec![
 1213 |             Arc::new(ArrowField::new("id", DataType::UInt32, false)),
 1214 |             Arc::new(ArrowField::new("uri", DataType::Utf8, false)),
 1215 |             Arc::new(ArrowField::new("long_text", DataType::LargeUtf8, false)),
 1216 |         ]);
 1217 | 
 1218 |         // mark struct as packed
 1219 |         let mut meta = HashMap::new();
 1220 |         meta.insert(PACKED_STRUCT_META_KEY.to_string(), "true".to_string());
 1221 | 
 1222 |         let array = Arc::new(StructArray::from(vec![
 1223 |             (
 1224 |                 fields[0].clone(),
 1225 |                 Arc::new(UInt32Array::from(vec![1, 2, 3])) as ArrayRef,
 1226 |             ),
 1227 |             (
 1228 |                 fields[1].clone(),
 1229 |                 Arc::new(StringArray::from(vec![
 1230 |                     Some("a"),
 1231 |                     Some("b"),
 1232 |                     Some("/tmp/x"),
 1233 |                 ])) as ArrayRef,
 1234 |             ),
 1235 |             (
 1236 |                 fields[2].clone(),
 1237 |                 Arc::new(LargeStringArray::from(vec![
 1238 |                     Some("alpha"),
 1239 |                     Some("a considerably longer payload for testing"),
 1240 |                     Some("mid"),
 1241 |                 ])) as ArrayRef,
 1242 |             ),
 1243 |         ]));
 1244 | 
 1245 |         let test_cases = TestCases::default()
 1246 |             .with_u32_structural_encodings()
 1247 |             .with_expected_encoding("variable_packed_struct");
 1248 | 
 1249 |         check_round_trip_encoding_of_data(vec![array], &test_cases, meta).await;
 1250 |     }
 1251 | 
 1252 |     #[test]
 1253 |     fn variable_packed_struct_multi_variable_round_trip() -> Result<()> {
 1254 |         let arrow_fields: Fields = vec![
 1255 |             ArrowField::new("category", DataType::Utf8, false),
 1256 |             ArrowField::new("payload", DataType::Binary, false),
 1257 |             ArrowField::new("count", DataType::Int32, false),
 1258 |         ]
 1259 |         .into();
 1260 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1261 |         let struct_field = Field::try_from(&arrow_struct)?;
 1262 | 
 1263 |         let category_array = StringArray::from(vec!["red", "blue", "green", "red"]);
 1264 |         let category_block = variable_block_from_string_array(category_array);
 1265 |         let payload_values: Vec<Vec<u8>> =
 1266 |             vec![vec![0x01, 0x02], vec![], vec![0x05, 0x06, 0x07], vec![0xff]];
 1267 |         let payload_array =
 1268 |             BinaryArray::from_iter_values(payload_values.iter().map(|v| v.as_slice()));
 1269 |         let payload_block = variable_block_from_binary_array(payload_array);
 1270 |         let count_block = fixed_i32_block_from_array(Int32Array::from(vec![1, 2, 3, 4]));
 1271 | 
 1272 |         let struct_block = StructDataBlock {
 1273 |             children: vec![
 1274 |                 DataBlock::VariableWidth(category_block.clone()),
 1275 |                 DataBlock::VariableWidth(payload_block.clone()),
 1276 |                 DataBlock::FixedWidth(count_block.clone()),
 1277 |             ],
 1278 |             block_info: BlockInfo::new(),
 1279 |             validity: None,
 1280 |         };
 1281 | 
 1282 |         let data_block = DataBlock::Struct(struct_block);
 1283 | 
 1284 |         let compression_strategy =
 1285 |             test_compression_strategy(TestEncoding::StructuralU32, CompressionParams::default());
 1286 |         let compressor = crate::compression::CompressionStrategy::create_per_value(
 1287 |             compression_strategy.as_ref(),
 1288 |             &struct_field,
 1289 |             &data_block,
 1290 |         )?;
 1291 |         let (compressed, encoding) = compressor.compress(data_block)?;
 1292 | 
 1293 |         let PerValueDataBlock::Variable(zipped) = compressed else {
 1294 |             panic!("expected variable-width packed struct output");
 1295 |         };
 1296 | 
 1297 |         let decompression_strategy = DefaultDecompressionStrategy::default();
 1298 |         let decompressor =
 1299 |             crate::compression::DecompressionStrategy::create_variable_per_value_decompressor(
 1300 |                 &decompression_strategy,
 1301 |                 &encoding,
 1302 |             )?;
 1303 |         let decoded = decompressor.decompress(zipped)?;
 1304 | 
 1305 |         let DataBlock::Struct(decoded_struct) = decoded else {
 1306 |             panic!("expected struct datablock after decode");
 1307 |         };
 1308 | 
 1309 |         let decoded_category = decoded_struct.children[0].as_variable_width_ref().unwrap();
 1310 |         assert_eq!(decoded_category.bits_per_offset, 32);
 1311 |         assert_eq!(
 1312 |             decoded_category
 1313 |                 .offsets
 1314 |                 .borrow_to_typed_slice::<i32>()
 1315 |                 .as_ref(),
 1316 |             category_block
 1317 |                 .offsets
 1318 |                 .borrow_to_typed_slice::<i32>()
 1319 |                 .as_ref()
 1320 |         );
 1321 |         assert_eq!(decoded_category.data.as_ref(), category_block.data.as_ref());
 1322 | 
 1323 |         let decoded_payload = decoded_struct.children[1].as_variable_width_ref().unwrap();
 1324 |         assert_eq!(decoded_payload.bits_per_offset, 32);
 1325 |         assert_eq!(
 1326 |             decoded_payload
 1327 |                 .offsets
 1328 |                 .borrow_to_typed_slice::<i32>()
 1329 |                 .as_ref(),
 1330 |             payload_block
 1331 |                 .offsets
 1332 |                 .borrow_to_typed_slice::<i32>()
 1333 |                 .as_ref()
 1334 |         );
 1335 |         assert_eq!(decoded_payload.data.as_ref(), payload_block.data.as_ref());
 1336 | 
 1337 |         let decoded_count = decoded_struct.children[2].as_fixed_width_ref().unwrap();
 1338 |         assert_eq!(decoded_count.bits_per_value, 32);
 1339 |         assert_eq!(decoded_count.data.as_ref(), count_block.data.as_ref());
 1340 | 
 1341 |         Ok(())
 1342 |     }
 1343 | 
 1344 |     #[test]
 1345 |     fn variable_packed_struct_requires_v22() {
 1346 |         let arrow_fields: Fields = vec![
 1347 |             ArrowField::new("value", DataType::Int64, false),
 1348 |             ArrowField::new("text", DataType::Utf8, false),
 1349 |         ]
 1350 |         .into();
 1351 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1352 |         let struct_field = Field::try_from(&arrow_struct).unwrap();
 1353 | 
 1354 |         let value_block = fixed_block_from_array(Int64Array::from(vec![1, 2, 3]));
 1355 |         let text_block =
 1356 |             variable_block_from_string_array(StringArray::from(vec!["a", "bb", "ccc"]));
 1357 | 
 1358 |         let struct_block = StructDataBlock {
 1359 |             children: vec![
 1360 |                 DataBlock::FixedWidth(value_block),
 1361 |                 DataBlock::VariableWidth(text_block),
 1362 |             ],
 1363 |             block_info: BlockInfo::new(),
 1364 |             validity: None,
 1365 |         };
 1366 | 
 1367 |         let compression_strategy =
 1368 |             test_compression_strategy(TestEncoding::StructuralU16, CompressionParams::default());
 1369 |         let result =
 1370 |             compression_strategy.create_per_value(&struct_field, &DataBlock::Struct(struct_block));
 1371 | 
 1372 |         assert!(matches!(result, Err(Error::NotSupported { .. })));
 1373 |     }
 1374 | 
 1375 |     #[test]
 1376 |     fn variable_packed_struct_decompress_empty_row() -> Result<()> {
 1377 |         let strategy = DefaultDecompressionStrategy::default();
 1378 |         let fixed_decompressor = Arc::from(
 1379 |             crate::compression::DecompressionStrategy::create_fixed_per_value_decompressor(
 1380 |                 &strategy,
 1381 |                 &ProtobufUtils21::flat(32, None),
 1382 |             )?,
 1383 |         );
 1384 |         let variable_decompressor = Arc::from(
 1385 |             crate::compression::DecompressionStrategy::create_variable_per_value_decompressor(
 1386 |                 &strategy,
 1387 |                 &ProtobufUtils21::variable(ProtobufUtils21::flat(32, None), None),
 1388 |             )?,
 1389 |         );
 1390 | 
 1391 |         let decompressor = PackedStructVariablePerValueDecompressor::new(vec![
 1392 |             VariablePackedStructFieldDecoder {
 1393 |                 kind: VariablePackedStructFieldKind::Fixed {
 1394 |                     bits_per_value: 32,
 1395 |                     decompressor: fixed_decompressor,
 1396 |                 },
 1397 |             },
 1398 |             VariablePackedStructFieldDecoder {
 1399 |                 kind: VariablePackedStructFieldKind::Variable {
 1400 |                     bits_per_length: 32,
 1401 |                     decompressor: variable_decompressor,
 1402 |                 },
 1403 |             },
 1404 |         ]);
 1405 | 
 1406 |         let mut row_data = Vec::new();
 1407 |         row_data.extend_from_slice(&1_u32.to_le_bytes());
 1408 |         row_data.extend_from_slice(&1_u32.to_le_bytes());
 1409 |         row_data.extend_from_slice(b"a");
 1410 |         row_data.extend_from_slice(&2_u32.to_le_bytes());
 1411 |         row_data.extend_from_slice(&0_u32.to_le_bytes());
 1412 | 
 1413 |         let input = VariableWidthBlock {
 1414 |             data: LanceBuffer::from(row_data),
 1415 |             bits_per_offset: 32,
 1416 |             offsets: LanceBuffer::reinterpret_vec(vec![0_u32, 9_u32, 9_u32, 17_u32]),
 1417 |             num_values: 3,
 1418 |             block_info: BlockInfo::new(),
 1419 |         };
 1420 | 
 1421 |         let decoded = decompressor.decompress(input)?;
 1422 |         let DataBlock::Struct(decoded_struct) = decoded else {
 1423 |             panic!("expected struct output");
 1424 |         };
 1425 | 
 1426 |         let fixed = decoded_struct.children[0].as_fixed_width_ref().unwrap();
 1427 |         assert_eq!(fixed.bits_per_value, 32);
 1428 |         assert_eq!(
 1429 |             fixed.data.borrow_to_typed_slice::<u32>().as_ref(),
 1430 |             &[1, 0, 2]
 1431 |         );
 1432 | 
 1433 |         let variable = decoded_struct.children[1].as_variable_width_ref().unwrap();
 1434 |         assert_eq!(variable.bits_per_offset, 32);
 1435 |         assert_eq!(
 1436 |             variable.offsets.borrow_to_typed_slice::<u32>().as_ref(),
 1437 |             &[0_u32, 1_u32, 1_u32, 1_u32]
 1438 |         );
 1439 |         assert_eq!(variable.data.as_ref(), b"a");
 1440 | 
 1441 |         Ok(())
 1442 |     }
 1443 | 
 1444 |     #[test]
 1445 |     fn fixed_packed_struct_round_trip() -> Result<()> {
 1446 |         let arrow_fields: Fields = vec![
 1447 |             ArrowField::new("id", DataType::Int32, false),
 1448 |             ArrowField::new("value", DataType::Int64, false),
 1449 |         ]
 1450 |         .into();
 1451 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1452 |         let struct_field = Field::try_from(&arrow_struct)?;
 1453 | 
 1454 |         let id_block = fixed_i32_block_from_array(Int32Array::from(vec![1, 2, 3, 4]));
 1455 |         let value_block = fixed_block_from_array(Int64Array::from(vec![10, 20, 30, 40]));
 1456 | 
 1457 |         let struct_block = StructDataBlock {
 1458 |             children: vec![
 1459 |                 DataBlock::FixedWidth(id_block.clone()),
 1460 |                 DataBlock::FixedWidth(value_block.clone()),
 1461 |             ],
 1462 |             block_info: BlockInfo::new(),
 1463 |             validity: None,
 1464 |         };
 1465 | 
 1466 |         let data_block = DataBlock::Struct(struct_block);
 1467 | 
 1468 |         let compression_strategy =
 1469 |             test_compression_strategy(TestEncoding::StructuralU32, CompressionParams::default());
 1470 |         let compressor = CompressionStrategy::create_per_value(
 1471 |             compression_strategy.as_ref(),
 1472 |             &struct_field,
 1473 |             &data_block,
 1474 |         )?;
 1475 |         let (compressed, encoding) = compressor.compress(data_block)?;
 1476 | 
 1477 |         let PerValueDataBlock::Fixed(zipped) = compressed else {
 1478 |             panic!("expected fixed-width packed struct output");
 1479 |         };
 1480 | 
 1481 |         let decompression_strategy = DefaultDecompressionStrategy::default();
 1482 |         let decompressor =
 1483 |             crate::compression::DecompressionStrategy::create_fixed_per_value_decompressor(
 1484 |                 &decompression_strategy,
 1485 |                 &encoding,
 1486 |             )?;
 1487 |         let decoded = decompressor.decompress(zipped, 4)?;
 1488 | 
 1489 |         let DataBlock::Struct(decoded_struct) = decoded else {
 1490 |             panic!("expected struct datablock after decode");
 1491 |         };
 1492 | 
 1493 |         let decoded_id = decoded_struct.children[0].as_fixed_width_ref().unwrap();
 1494 |         assert_eq!(decoded_id.bits_per_value, 32);
 1495 |         assert_eq!(decoded_id.data.as_ref(), id_block.data.as_ref());
 1496 | 
 1497 |         let decoded_value = decoded_struct.children[1].as_fixed_width_ref().unwrap();
 1498 |         assert_eq!(decoded_value.bits_per_value, 64);
 1499 |         assert_eq!(decoded_value.data.as_ref(), value_block.data.as_ref());
 1500 | 
 1501 |         Ok(())
 1502 |     }
 1503 | 
 1504 |     // End-to-end round trip through the file writer. Requesting full-zip on an
 1505 |     // all-fixed-width struct routes to `PackedStructFixedPerValueEncoder` (mini-block
 1506 |     // is only chosen for narrow structs), exercising the writer/reader wiring rather
 1507 |     // than just the block-level compress/decompress above.
 1508 |     #[tokio::test]
 1509 |     async fn fixed_packed_struct_full_zip_round_trip() {
 1510 |         let fields = Fields::from(vec![
 1511 |             Arc::new(ArrowField::new("id", DataType::Int32, false)),
 1512 |             Arc::new(ArrowField::new("value", DataType::Int64, false)),
 1513 |         ]);
 1514 | 
 1515 |         let mut meta = HashMap::new();
 1516 |         meta.insert(PACKED_STRUCT_META_KEY.to_string(), "true".to_string());
 1517 |         meta.insert(
 1518 |             STRUCTURAL_ENCODING_META_KEY.to_string(),
 1519 |             STRUCTURAL_ENCODING_FULLZIP.to_string(),
 1520 |         );
 1521 | 
 1522 |         let array = Arc::new(StructArray::from(vec![
 1523 |             (
 1524 |                 fields[0].clone(),
 1525 |                 Arc::new(Int32Array::from(vec![1, 2, 3, 4])) as ArrayRef,
 1526 |             ),
 1527 |             (
 1528 |                 fields[1].clone(),
 1529 |                 Arc::new(Int64Array::from(vec![10, 20, 30, 40])) as ArrayRef,
 1530 |             ),
 1531 |         ]));
 1532 | 
 1533 |         let test_cases = TestCases::default()
 1534 |             .with_u32_structural_encodings()
 1535 |             .with_expected_encoding("packed_struct");
 1536 | 
 1537 |         check_round_trip_encoding_of_data(vec![array], &test_cases, meta).await;
 1538 |     }
 1539 | 
 1540 |     #[test]
 1541 |     fn fixed_packed_struct_rejects_variable_child() -> Result<()> {
 1542 |         let arrow_fields: Fields = vec![
 1543 |             ArrowField::new("id", DataType::Int32, false),
 1544 |             ArrowField::new("name", DataType::Utf8, false),
 1545 |         ]
 1546 |         .into();
 1547 |         let arrow_struct = ArrowField::new("item", DataType::Struct(arrow_fields), false);
 1548 |         let struct_field = Field::try_from(&arrow_struct)?;
 1549 | 
 1550 |         let struct_block = DataBlock::Struct(StructDataBlock {
 1551 |             children: vec![
 1552 |                 DataBlock::FixedWidth(fixed_i32_block_from_array(Int32Array::from(vec![1, 2]))),
 1553 |                 DataBlock::VariableWidth(variable_block_from_string_array(StringArray::from(
 1554 |                     vec!["a", "bb"],
 1555 |                 ))),
 1556 |             ],
 1557 |             block_info: BlockInfo::new(),
 1558 |             validity: None,
 1559 |         });
 1560 | 
 1561 |         let encoder = PackedStructFixedPerValueEncoder::new(struct_field.children);
 1562 |         let err = encoder.compress(struct_block).unwrap_err();
 1563 |         assert!(matches!(&err, Error::InvalidInput { .. }));
 1564 |         assert!(
 1565 |             err.to_string().contains("fixed-width"),
 1566 |             "unexpected error: {err}"
 1567 |         );
 1568 | 
 1569 |         Ok(())
 1570 |     }
 1571 | }
``````
