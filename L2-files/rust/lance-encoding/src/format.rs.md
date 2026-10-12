> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/format.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `6771ecccdc5af8d9c4d0cccbad1d770c3460d967b1afefed21ee62f53f1e9aaf`. Reviewed physical lines: 1-773.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Generated protobuf module includes plus public metadata constructors for older ArrayEncoding and structural CompressiveEncoding/PageLayout families. Constructors generally describe data without validating or encoding it. (rust/lance-encoding/src/format.rs:1-773)

## Complete range analysis

### Lines 1-18

SPDX and public pb module for V2.0 grammar. Generated-code lint/name/unused/FFI allowances are scoped inside this module. include! reads OUT_DIR/lance.encodings.rs at compile time; no checked-in generated output is invented. Input is encodings_v2_0.proto through build.rs. (rust/lance-encoding/src/format.rs:1-18)

### Lines 19-34

Public pb21 module includes OUT_DIR/lance.encodings21.rs with the same generated-code allowances. Comment explicitly says V2.1 and newer: the suffix is a grammar family, not proof every variant is legal in exact V2.1. Exact version readers impose additional checks. (rust/lance-file/src/versions/v2_1/reader.rs:93-110; rust/lance-file/src/versions/v2_2/reader.rs:110-118) (rust/lance-encoding/src/format.rs:19-34)

### Lines 35-52

Imports older protobuf ArrayEncoding/variant types and aliases, Page BufferType, Nullable arms, shared CompressionConfig, DefinitionInterpretation, Constant and Result. Public empty ProtobufUtils is an associated-function namespace; no stored state, constructor requirement, IO or registration. (rust/lance-encoding/src/format.rs:35-52)

### Lines 53-60

ProtobufUtils::constant moves Vec<u8> into protobuf Bytes and wraps Some(ArrayEncoding::Constant). It does not infer data type, require a nonempty value or validate its width. This older array descriptor is distinct from ConstantLayout pages. (rust/lance-encoding/src/format.rs:53-60)

### Lines 61-68

basic_all_null_encoding builds Nullable(Some(AllNulls(empty marker))). It has no value/validity children, buffer references or row count; caller supplies those through other metadata. (rust/lance-encoding/src/format.rs:61-68)

### Lines 69-82

basic_some_null_encoding owns validity and value descriptors, boxes each under Some and wraps Nullable(Some(SomeNulls(...))). It does not validate the validity bit width, lengths, buffer indices or null population. (rust/lance-encoding/src/format.rs:69-82)

### Lines 83-92

basic_no_null_encoding boxes one value descriptor under Nullable(Some(NoNulls(...))). It declares the absence of nulls without inspecting data or adding a bitmap. (rust/lance-encoding/src/format.rs:83-92)

### Lines 93-100

block copies any &str into the older Block.scheme string and wraps ArrayEncoding::Block. No recognized-scheme parsing, feature availability or level validation occurs. (rust/lance-encoding/src/format.rs:93-100)

### Lines 101-120

flat_encoding stores supplied u64 bits_per_value and a present pb::Buffer with supplied u32 index and Page buffer type. Optional CompressionConfig maps to older string scheme through Display and preserves optional i32 level; None remains absent. There is no positive-bit-width, referenced-buffer or compressor-feature validation. CompressionScheme Display spells fsst,zstd,none,lz4 (rust/lance-encoding/src/encodings/physical/block.rs:112-121). (rust/lance-encoding/src/format.rs:101-120)

### Lines 121-130

fsl_encoding accepts u64 dimension but converts it with try_into().unwrap() to protobuf uint32, panicking above u32::MAX; zero is accepted locally. It stores has_validity and Some boxed items without checking child count, size or type. This older dimension differs from structural u64 items_per_value. (protos/encodings_v2_0.proto:159-165; protos/encodings_v2_1.proto:559-565) (rust/lance-encoding/src/format.rs:121-130)

### Lines 131-149

bitpacked_encoding stores compressed/uncompressed u64 widths, signed flag and present Page buffer with supplied index. It does not check allowed widths, relative widths or signed representation. No packing is performed. (rust/lance-encoding/src/format.rs:131-149)

### Lines 150-165

bitpacked_for_non_neg_encoding stores both u64 widths and a present Page buffer under the distinct BitpackedForNonNeg arm. It does not verify nonnegative input or allowed widths and has no signed argument. (rust/lance-encoding/src/format.rs:150-165)

### Lines 166-172

inline_bitpacking stores uncompressed u64 bit width under older InlineBitpacking; the helper emits no width header or payload itself. No validation. (rust/lance-encoding/src/format.rs:166-172)

### Lines 173-186

out_of_line_bitpacking stores uncompressed and compressed u64 widths as two direct older-message fields. Unlike structural grammar, compressed values are not represented as a nested CompressiveEncoding here. (rust/lance-encoding/src/format.rs:173-186)

### Lines 187-194

variable widens supplied u8 bits_per_offset to u32 and wraps older Variable. All u8 values are accepted; no 32/64-only rule is enforced locally. (rust/lance-encoding/src/format.rs:187-194)

### Lines 195-206

fsst boxes the supplied ArrayEncoding as binary and moves Vec symbol table to Bytes. The comment says the mini-block decompressor hard-codes its binary representation and ignores this child, with optimization suggested; that is recorded as comment rationale, not a verified property of every FSST consumer. Constructor still stores the supplied child without validation. (rust/lance-encoding/src/format.rs:195-206)

### Lines 207-212

rle stores one u64 bits_per_value in older Rle. It neither computes runs nor checks widths/counts. (rust/lance-encoding/src/format.rs:207-212)

### Lines 213-220

byte_stream_split stores one u64 bits_per_value in older ByteStreamSplit. It does not transpose data or ensure width is byte-aligned. (rust/lance-encoding/src/format.rs:213-220)

### Lines 221-237

general_mini_block boxes the inner older ArrayEncoding and stores present older Compression with Display scheme string and unchanged optional level. Unlike structural wrapped, this constructor is infallible and does not reject None/Fsst schemes. It does no compression or feature check. (rust/lance-encoding/src/format.rs:221-237)

### Lines 238-252

packed_struct moves ordered child descriptors and a present packed Page buffer reference. It does not validate child buffer references, fixed widths, sum of row sizes or compatibility; buffer_index is local metadata, not an absolute file position. (rust/lance-encoding/src/format.rs:238-252)

### Lines 253-266

packed_struct_fixed_width_mini_block boxes supplied data under flat and moves ordered Vec<u32> bits_per_values. No check relates those child widths to the child descriptor or a payload row width. (rust/lance-encoding/src/format.rs:253-266)

### Lines 267-280

binary boxes independently supplied byte/indices descriptors and stores u64 null_adjustment unchanged. It does not compute offsets, normalize nulls, require monotonicity or validate adjustment against payload length. (rust/lance-encoding/src/format.rs:267-280)

### Lines 281-294

dict_encoding boxes indices/items and stores u32 num_items as num_dictionary_items. No key bounds, dictionary uniqueness, null or count validation. (rust/lance-encoding/src/format.rs:281-294)

### Lines 295-306

fixed_size_binary boxes data as bytes and stores u32 byte_width, accepting zero locally. It does not check actual payload or child encoding width. This closes the older ProtobufUtils impl. (rust/lance-encoding/src/format.rs:295-306)

### Lines 307-311

Private impl_common_protobuf_utils macro accepts module and struct-name identifiers, emits an empty public struct and associated impl. Its sole invocation later substitutes pb21 and ProtobufUtils21. Generated utility methods therefore have concrete public names despite appearing lexically inside a private macro. (rust/lance-encoding/src/format.rs:670-670) (rust/lance-encoding/src/format.rs:307-311)

### Lines 312-327

Generated ProtobufUtils21::flat returns Some(CompressiveEncoding::Flat) with u64 bits_per_value and supplied optional BufferCompression as data. It does not construct a page buffer reference; no width, scheme or level validation. None means no leaf buffer-compression descriptor. (rust/lance-encoding/src/format.rs:312-327)

### Lines 328-339

Generated constant wraps Constant with supplied Option<Bytes>; None and Some(empty) remain distinct field-presence states. It builds a compressive descriptor, not ConstantLayout, and does not choose page length/type/nullness or validate literal size. (rust/lance-encoding/src/format.rs:328-339)

### Lines 340-357

Generated fsl boxes supplied CompressiveEncoding values and stores u64 items_per_value plus has_validity. No narrowing conversion unlike older fsl_encoding; zero/count/validity consistency remain unchecked. (rust/lance-encoding/src/format.rs:340-357)

### Lines 358-373

Generated variable boxes offset descriptor and moves optional BufferCompression for values. It does not encode numeric offsets or establish whether their base is a chunk or payload; physical format implementation owns that. (rust/lance-encoding/src/format.rs:358-373)

### Lines 374-389

Generated inline_bitpacking stores uncompressed u64 width and optional BufferCompression for its values. No buffer index or compressed bit width is supplied, and no payload packing or legality check occurs. (rust/lance-encoding/src/format.rs:374-389)

### Lines 390-405

Generated out_of_line_bitpacking stores uncompressed u64 width and a boxed nested values descriptor. This differs from older direct compressed-width field; nested descriptor owns the compressed representation. No validation. (rust/lance-encoding/src/format.rs:390-405)

### Lines 406-416

Generated buffer_compression returns Result<BufferCompression>, converting runtime CompressionScheme with pb21::CompressionScheme::try_from, casting the enum to i32 and preserving optional level. Conversion accepts Lz4=1 and Zstd=2; None/Fsst return InvalidInput naming the unsupported scheme. No compressor-feature or level-range check occurs in this conversion. (rust/lance-encoding/src/encodings/physical/block.rs:75-95; protos/encodings_v2_1.proto:379-383) (rust/lance-encoding/src/format.rs:406-416)

### Lines 417-432

Generated wrapped returns General with Some(buffer_compression(...)) and Some boxed values. Conversion failure propagates via ? before success; no payload transformation is performed. Runtime None is not an accepted way to request an uncompressed General wrapper; omit the optional compression descriptor at the leaf instead where the relevant helper supports it. (rust/lance-encoding/src/encodings/physical/block.rs:82-95) (rust/lance-encoding/src/format.rs:417-432)

### Lines 433-448

Generated rle boxes values and run_lengths as separate present CompressiveEncoding children. No run/count validation or packing is done. (rust/lance-encoding/src/format.rs:433-448)

### Lines 449-462

Generated byte_stream_split boxes one values descriptor under ByteStreamSplit. This structural tree composition differs from older descriptor containing only bits_per_value. (rust/lance-encoding/src/format.rs:449-462)

### Lines 463-478

Generated fsst moves symbol_table Vec to Bytes and boxes nested values. It does not create a general BufferCompression Fsst scheme or validate table/value agreement. (rust/lance-encoding/src/format.rs:463-478)

### Lines 479-501

Private generated def_inter_to_repdef_layer exhaustively maps the six DefinitionInterpretation variants to corresponding RepDefLayer i32 codes: AllValidItem1,AllValidList2,NullableItem3,NullableList4,EmptyableList5,NullableAndEmptyableList6. It never emits Unspecified0; no integer cast of the Rust enum is used. (protos/encodings_v2_1.proto:54-69; rust/lance-encoding/src/repdef.rs:593-613) (rust/lance-encoding/src/format.rs:479-501)

### Lines 502-530

Public generated repdef_layer_to_def_interp first try_from(i32).unwrap(), so an unknown numeric enum value panics. Known Unspecified0 explicitly panics with Unspecified repdef layer. Known values1..6 map to the six interpretations. This helper returns the enum directly, not Result, and supplies no forward-compatibility fallback for new layer codes. (rust/lance-encoding/src/format.rs:502-530)

### Lines 531-572

Generated miniblock_layout takes optional rep/def, required value, depth u32, buffers/items u64, optional(dictionary,count), interpretation slice and has_large_chunk bool. It always asserts nonempty interpretations. Some dictionary preserves count including0; None becomes(None,0). Layers preserve input order via mapper, values become Some, and all numeric/large-chunk fields are copied. It does not validate level encodings, repetition depth, counts, buffers or exact-version legality. (rust/lance-encoding/src/format.rs:531-572)

### Lines 573-601

Private generated full_zip_layout accepts u8 rep/def widths, selected Details arm, values, interpretations, u32 total and visible items. It widens widths to u32, stores Some details/values, maps layers in input order and returns FullZipLayout. Unlike miniblock_layout it does not assert nonempty interpretations, validate visible<=total, or check widths. (rust/lance-encoding/src/format.rs:573-601)

### Lines 602-623

Public fixed_full_zip_layout supplies Details::BitsPerValue(bits_per_value u32) to the private common helper with unchanged widths, values, layers and counts. It does not inspect fixed-width payload or compute bit counts. (rust/lance-encoding/src/format.rs:602-623)

### Lines 624-645

Public variable_full_zip_layout supplies Details::BitsPerOffset(bits_per_offset u32) with otherwise unchanged arguments. The oneof distinguishes this descriptor from fixed full-zip even if numeric values match; no offset legality check. (rust/lance-encoding/src/format.rs:624-645)

### Lines 646-669

Public generated blob_layout boxes a supplied PageLayout and maps interpretation slice in order; it performs no descriptor/payload IO, null/empty distinction or inner-layout validation. Empty layer slice is accepted locally. This closes impl and macro definition; blank lines have no additional behavior. (rust/lance-encoding/src/format.rs:646-669)

### Lines 670-672

Only macro instantiation is impl_common_protobuf_utils!(pb21,ProtobufUtils21). Following inherent impl adds structural-only helpers to that same generated public type. There is no ProtobufUtils23 instantiation or version dispatch here. (rust/lance-encoding/src/format.rs:670-672)

### Lines 673-693

constant_layout maps Option<Vec<u8>> to Option<Bytes>, preserving None versus Some(empty), clears rep/def compression and sets both level counts0. It maps layers without asserting nonempty. It does not enforce inline byte limit, scalar type, page buffers or all-nullness; absent inline bytes can accompany an out-of-line scalar elsewhere. (rust/lance-encoding/src/encodings/logical/primitive/constant.rs:31-80) (rust/lance-encoding/src/format.rs:673-693)

### Lines 694-717

compressed_all_null_constant_layout forces inline_value=None while preserving optional rep/def descriptors and u64 counts, mapping layers in order. Despite its name, it never verifies all-nullness or count/stream agreement; caller owns those invariants. Empty layers and absent streams with nonzero counts are not rejected here. (rust/lance-encoding/src/format.rs:694-717)

### Lines 718-733

Structural packed_struct moves ordered Vec<u64> child widths into bits_per_value and boxes required compressed values. This is the fixed-width packed grammar, distinct from older helper taking child ArrayEncoding descriptors and a Page buffer index. No width-sum or type check. (rust/lance-encoding/src/format.rs:718-733)

### Lines 734-745

packed_struct_variable moves ordered FieldEncoding vector into VariablePackedStruct. Empty fields and malformed children are not rejected here; exact reader version and codec implementations determine support. (rust/lance-encoding/src/format.rs:734-745)

### Lines 746-759

packed_struct_field_fixed creates a FieldEncoding with present supplied value descriptor and BitsPerValue(u64) oneof arm. It neither derives width from data nor validates it. (rust/lance-encoding/src/format.rs:746-759)

### Lines 760-773

packed_struct_field_variable creates present value descriptor and BitsPerLength(u64) oneof arm; this is a length-width descriptor, not fixed payload width or an absolute offset. Final braces close function/impl. No local test module, unsafe block, async lifecycle, global state, runtime version branch, byte serialization or codec execution exists in format.rs. (rust/lance-encoding/src/format.rs:760-773)

## Interaction and interpretation limits

All physical lines of this file were read in bounded, untruncated source outputs during ANALYZE71. Source is read-only and offline. No Lance build, test, lint, benchmark, generator, dependency installation or network access occurred. Crate coverage remains partial; generated Rust declarations are represented by their analyzed protobuf inputs and literal include paths, not fabricated compiler output. Contextual dependency reads establish only cited local behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Protobuf definitions for encodings
    5 | ///
    6 | /// These are the messages used for describing encoding in the 2.0 format
    7 | pub mod pb {
    8 |     #![allow(clippy::all)]
    9 |     #![allow(non_upper_case_globals)]
   10 |     #![allow(non_camel_case_types)]
   11 |     #![allow(non_snake_case)]
   12 |     #![allow(unused)]
   13 |     #![allow(improper_ctypes)]
   14 |     #![allow(clippy::upper_case_acronyms)]
   15 |     #![allow(clippy::use_self)]
   16 |     include!(concat!(env!("OUT_DIR"), "/lance.encodings.rs"));
   17 | }
   18 | 
   19 | /// Protobuf definitions for encodings21
   20 | ///
   21 | /// These are the messages used for describing encoding in the 2.1 format
   22 | /// and any newer formats.
   23 | pub mod pb21 {
   24 |     #![allow(clippy::all)]
   25 |     #![allow(non_upper_case_globals)]
   26 |     #![allow(non_camel_case_types)]
   27 |     #![allow(non_snake_case)]
   28 |     #![allow(unused)]
   29 |     #![allow(improper_ctypes)]
   30 |     #![allow(clippy::upper_case_acronyms)]
   31 |     #![allow(clippy::use_self)]
   32 |     include!(concat!(env!("OUT_DIR"), "/lance.encodings21.rs"));
   33 | }
   34 | 
   35 | use pb::{
   36 |     ArrayEncoding, Binary, Bitpacked, BitpackedForNonNeg, Block, Dictionary, FixedSizeBinary,
   37 |     FixedSizeList, Flat, Fsst, InlineBitpacking, Nullable, OutOfLineBitpacking, PackedStruct,
   38 |     PackedStructFixedWidthMiniBlock, Rle, Variable,
   39 |     array_encoding::ArrayEncoding as ArrayEncodingEnum,
   40 |     buffer::BufferType,
   41 |     nullable::{AllNull, NoNull, Nullability, SomeNull},
   42 | };
   43 | 
   44 | use crate::{encodings::physical::block::CompressionConfig, repdef::DefinitionInterpretation};
   45 | 
   46 | use self::pb::Constant;
   47 | use lance_core::Result;
   48 | 
   49 | // Utility functions for creating complex protobuf objects
   50 | pub struct ProtobufUtils {}
   51 | 
   52 | impl ProtobufUtils {
   53 |     pub fn constant(value: Vec<u8>) -> ArrayEncoding {
   54 |         ArrayEncoding {
   55 |             array_encoding: Some(ArrayEncodingEnum::Constant(Constant {
   56 |                 value: value.into(),
   57 |             })),
   58 |         }
   59 |     }
   60 | 
   61 |     pub fn basic_all_null_encoding() -> ArrayEncoding {
   62 |         ArrayEncoding {
   63 |             array_encoding: Some(ArrayEncodingEnum::Nullable(Box::new(Nullable {
   64 |                 nullability: Some(Nullability::AllNulls(AllNull {})),
   65 |             }))),
   66 |         }
   67 |     }
   68 | 
   69 |     pub fn basic_some_null_encoding(
   70 |         validity: ArrayEncoding,
   71 |         values: ArrayEncoding,
   72 |     ) -> ArrayEncoding {
   73 |         ArrayEncoding {
   74 |             array_encoding: Some(ArrayEncodingEnum::Nullable(Box::new(Nullable {
   75 |                 nullability: Some(Nullability::SomeNulls(Box::new(SomeNull {
   76 |                     validity: Some(Box::new(validity)),
   77 |                     values: Some(Box::new(values)),
   78 |                 }))),
   79 |             }))),
   80 |         }
   81 |     }
   82 | 
   83 |     pub fn basic_no_null_encoding(values: ArrayEncoding) -> ArrayEncoding {
   84 |         ArrayEncoding {
   85 |             array_encoding: Some(ArrayEncodingEnum::Nullable(Box::new(Nullable {
   86 |                 nullability: Some(Nullability::NoNulls(Box::new(NoNull {
   87 |                     values: Some(Box::new(values)),
   88 |                 }))),
   89 |             }))),
   90 |         }
   91 |     }
   92 | 
   93 |     pub fn block(scheme: &str) -> ArrayEncoding {
   94 |         ArrayEncoding {
   95 |             array_encoding: Some(ArrayEncodingEnum::Block(Block {
   96 |                 scheme: scheme.to_string(),
   97 |             })),
   98 |         }
   99 |     }
  100 | 
  101 |     pub fn flat_encoding(
  102 |         bits_per_value: u64,
  103 |         buffer_index: u32,
  104 |         compression: Option<CompressionConfig>,
  105 |     ) -> ArrayEncoding {
  106 |         ArrayEncoding {
  107 |             array_encoding: Some(ArrayEncodingEnum::Flat(Flat {
  108 |                 bits_per_value,
  109 |                 buffer: Some(pb::Buffer {
  110 |                     buffer_index,
  111 |                     buffer_type: BufferType::Page as i32,
  112 |                 }),
  113 |                 compression: compression.map(|compression_config| pb::Compression {
  114 |                     scheme: compression_config.scheme.to_string(),
  115 |                     level: compression_config.level,
  116 |                 }),
  117 |             })),
  118 |         }
  119 |     }
  120 | 
  121 |     pub fn fsl_encoding(dimension: u64, items: ArrayEncoding, has_validity: bool) -> ArrayEncoding {
  122 |         ArrayEncoding {
  123 |             array_encoding: Some(ArrayEncodingEnum::FixedSizeList(Box::new(FixedSizeList {
  124 |                 dimension: dimension.try_into().unwrap(),
  125 |                 items: Some(Box::new(items)),
  126 |                 has_validity,
  127 |             }))),
  128 |         }
  129 |     }
  130 | 
  131 |     pub fn bitpacked_encoding(
  132 |         compressed_bits_per_value: u64,
  133 |         uncompressed_bits_per_value: u64,
  134 |         buffer_index: u32,
  135 |         signed: bool,
  136 |     ) -> ArrayEncoding {
  137 |         ArrayEncoding {
  138 |             array_encoding: Some(ArrayEncodingEnum::Bitpacked(Bitpacked {
  139 |                 compressed_bits_per_value,
  140 |                 buffer: Some(pb::Buffer {
  141 |                     buffer_index,
  142 |                     buffer_type: BufferType::Page as i32,
  143 |                 }),
  144 |                 uncompressed_bits_per_value,
  145 |                 signed,
  146 |             })),
  147 |         }
  148 |     }
  149 | 
  150 |     pub fn bitpacked_for_non_neg_encoding(
  151 |         compressed_bits_per_value: u64,
  152 |         uncompressed_bits_per_value: u64,
  153 |         buffer_index: u32,
  154 |     ) -> ArrayEncoding {
  155 |         ArrayEncoding {
  156 |             array_encoding: Some(ArrayEncodingEnum::BitpackedForNonNeg(BitpackedForNonNeg {
  157 |                 compressed_bits_per_value,
  158 |                 buffer: Some(pb::Buffer {
  159 |                     buffer_index,
  160 |                     buffer_type: BufferType::Page as i32,
  161 |                 }),
  162 |                 uncompressed_bits_per_value,
  163 |             })),
  164 |         }
  165 |     }
  166 |     pub fn inline_bitpacking(uncompressed_bits_per_value: u64) -> ArrayEncoding {
  167 |         ArrayEncoding {
  168 |             array_encoding: Some(ArrayEncodingEnum::InlineBitpacking(InlineBitpacking {
  169 |                 uncompressed_bits_per_value,
  170 |             })),
  171 |         }
  172 |     }
  173 |     pub fn out_of_line_bitpacking(
  174 |         uncompressed_bits_per_value: u64,
  175 |         compressed_bits_per_value: u64,
  176 |     ) -> ArrayEncoding {
  177 |         ArrayEncoding {
  178 |             array_encoding: Some(ArrayEncodingEnum::OutOfLineBitpacking(
  179 |                 OutOfLineBitpacking {
  180 |                     uncompressed_bits_per_value,
  181 |                     compressed_bits_per_value,
  182 |                 },
  183 |             )),
  184 |         }
  185 |     }
  186 | 
  187 |     pub fn variable(bits_per_offset: u8) -> ArrayEncoding {
  188 |         ArrayEncoding {
  189 |             array_encoding: Some(ArrayEncodingEnum::Variable(Variable {
  190 |                 bits_per_offset: bits_per_offset as u32,
  191 |             })),
  192 |         }
  193 |     }
  194 | 
  195 |     // Construct a `FsstMiniBlock` ArrayEncoding, the inner `binary_mini_block` encoding is actually
  196 |     // not used and `FsstMiniBlockDecompressor` constructs a `binary_mini_block` in a `hard-coded` fashion.
  197 |     // This can be an optimization later.
  198 |     pub fn fsst(data: ArrayEncoding, symbol_table: Vec<u8>) -> ArrayEncoding {
  199 |         ArrayEncoding {
  200 |             array_encoding: Some(ArrayEncodingEnum::Fsst(Box::new(Fsst {
  201 |                 binary: Some(Box::new(data)),
  202 |                 symbol_table: symbol_table.into(),
  203 |             }))),
  204 |         }
  205 |     }
  206 | 
  207 |     pub fn rle(bits_per_value: u64) -> ArrayEncoding {
  208 |         ArrayEncoding {
  209 |             array_encoding: Some(ArrayEncodingEnum::Rle(Rle { bits_per_value })),
  210 |         }
  211 |     }
  212 | 
  213 |     pub fn byte_stream_split(bits_per_value: u64) -> ArrayEncoding {
  214 |         ArrayEncoding {
  215 |             array_encoding: Some(ArrayEncodingEnum::ByteStreamSplit(pb::ByteStreamSplit {
  216 |                 bits_per_value,
  217 |             })),
  218 |         }
  219 |     }
  220 | 
  221 |     pub fn general_mini_block(
  222 |         inner: ArrayEncoding,
  223 |         compression: CompressionConfig,
  224 |     ) -> ArrayEncoding {
  225 |         ArrayEncoding {
  226 |             array_encoding: Some(ArrayEncodingEnum::GeneralMiniBlock(Box::new(
  227 |                 pb::GeneralMiniBlock {
  228 |                     inner: Some(Box::new(inner)),
  229 |                     compression: Some(pb::Compression {
  230 |                         scheme: compression.scheme.to_string(),
  231 |                         level: compression.level,
  232 |                     }),
  233 |                 },
  234 |             ))),
  235 |         }
  236 |     }
  237 | 
  238 |     pub fn packed_struct(
  239 |         child_encodings: Vec<ArrayEncoding>,
  240 |         packed_buffer_index: u32,
  241 |     ) -> ArrayEncoding {
  242 |         ArrayEncoding {
  243 |             array_encoding: Some(ArrayEncodingEnum::PackedStruct(PackedStruct {
  244 |                 inner: child_encodings,
  245 |                 buffer: Some(pb::Buffer {
  246 |                     buffer_index: packed_buffer_index,
  247 |                     buffer_type: BufferType::Page as i32,
  248 |                 }),
  249 |             })),
  250 |         }
  251 |     }
  252 | 
  253 |     pub fn packed_struct_fixed_width_mini_block(
  254 |         data: ArrayEncoding,
  255 |         bits_per_values: Vec<u32>,
  256 |     ) -> ArrayEncoding {
  257 |         ArrayEncoding {
  258 |             array_encoding: Some(ArrayEncodingEnum::PackedStructFixedWidthMiniBlock(
  259 |                 Box::new(PackedStructFixedWidthMiniBlock {
  260 |                     flat: Some(Box::new(data)),
  261 |                     bits_per_values,
  262 |                 }),
  263 |             )),
  264 |         }
  265 |     }
  266 | 
  267 |     pub fn binary(
  268 |         indices_encoding: ArrayEncoding,
  269 |         bytes_encoding: ArrayEncoding,
  270 |         null_adjustment: u64,
  271 |     ) -> ArrayEncoding {
  272 |         ArrayEncoding {
  273 |             array_encoding: Some(ArrayEncodingEnum::Binary(Box::new(Binary {
  274 |                 bytes: Some(Box::new(bytes_encoding)),
  275 |                 indices: Some(Box::new(indices_encoding)),
  276 |                 null_adjustment,
  277 |             }))),
  278 |         }
  279 |     }
  280 | 
  281 |     pub fn dict_encoding(
  282 |         indices: ArrayEncoding,
  283 |         items: ArrayEncoding,
  284 |         num_items: u32,
  285 |     ) -> ArrayEncoding {
  286 |         ArrayEncoding {
  287 |             array_encoding: Some(ArrayEncodingEnum::Dictionary(Box::new(Dictionary {
  288 |                 indices: Some(Box::new(indices)),
  289 |                 items: Some(Box::new(items)),
  290 |                 num_dictionary_items: num_items,
  291 |             }))),
  292 |         }
  293 |     }
  294 | 
  295 |     pub fn fixed_size_binary(data: ArrayEncoding, byte_width: u32) -> ArrayEncoding {
  296 |         ArrayEncoding {
  297 |             array_encoding: Some(ArrayEncodingEnum::FixedSizeBinary(Box::new(
  298 |                 FixedSizeBinary {
  299 |                     bytes: Some(Box::new(data)),
  300 |                     byte_width,
  301 |                 },
  302 |             ))),
  303 |         }
  304 |     }
  305 | }
  306 | 
  307 | macro_rules! impl_common_protobuf_utils {
  308 |     ($module:ident, $struct_name:ident) => {
  309 |         pub struct $struct_name {}
  310 | 
  311 |         impl $struct_name {
  312 |             pub fn flat(
  313 |                 bits_per_value: u64,
  314 |                 values_compression: Option<crate::format::$module::BufferCompression>,
  315 |             ) -> crate::format::$module::CompressiveEncoding {
  316 |                 crate::format::$module::CompressiveEncoding {
  317 |                     compression: Some(
  318 |                         crate::format::$module::compressive_encoding::Compression::Flat(
  319 |                             crate::format::$module::Flat {
  320 |                                 bits_per_value,
  321 |                                 data: values_compression,
  322 |                             },
  323 |                         ),
  324 |                     ),
  325 |                 }
  326 |             }
  327 | 
  328 |             pub fn constant(
  329 |                 value: Option<bytes::Bytes>,
  330 |             ) -> crate::format::$module::CompressiveEncoding {
  331 |                 crate::format::$module::CompressiveEncoding {
  332 |                     compression: Some(
  333 |                         crate::format::$module::compressive_encoding::Compression::Constant(
  334 |                             crate::format::$module::Constant { value },
  335 |                         ),
  336 |                     ),
  337 |                 }
  338 |             }
  339 | 
  340 |             pub fn fsl(
  341 |                 items_per_value: u64,
  342 |                 has_validity: bool,
  343 |                 values: crate::format::$module::CompressiveEncoding,
  344 |             ) -> crate::format::$module::CompressiveEncoding {
  345 |                 crate::format::$module::CompressiveEncoding {
  346 |                     compression: Some(
  347 |                         crate::format::$module::compressive_encoding::Compression::FixedSizeList(
  348 |                             Box::new(crate::format::$module::FixedSizeList {
  349 |                                 items_per_value,
  350 |                                 has_validity,
  351 |                                 values: Some(Box::new(values)),
  352 |                             }),
  353 |                         ),
  354 |                     ),
  355 |                 }
  356 |             }
  357 | 
  358 |             pub fn variable(
  359 |                 offsets_desc: crate::format::$module::CompressiveEncoding,
  360 |                 values_compression: Option<crate::format::$module::BufferCompression>,
  361 |             ) -> crate::format::$module::CompressiveEncoding {
  362 |                 crate::format::$module::CompressiveEncoding {
  363 |                     compression: Some(
  364 |                         crate::format::$module::compressive_encoding::Compression::Variable(
  365 |                             Box::new(crate::format::$module::Variable {
  366 |                                 offsets: Some(Box::new(offsets_desc)),
  367 |                                 values: values_compression,
  368 |                             }),
  369 |                         ),
  370 |                     ),
  371 |                 }
  372 |             }
  373 | 
  374 |             pub fn inline_bitpacking(
  375 |                 uncompressed_bits_per_value: u64,
  376 |                 values_compression: Option<crate::format::$module::BufferCompression>,
  377 |             ) -> crate::format::$module::CompressiveEncoding {
  378 |                 crate::format::$module::CompressiveEncoding {
  379 |                     compression: Some(
  380 |                         crate::format::$module::compressive_encoding::Compression::InlineBitpacking(
  381 |                             crate::format::$module::InlineBitpacking {
  382 |                                 uncompressed_bits_per_value,
  383 |                                 values: values_compression,
  384 |                             },
  385 |                         ),
  386 |                     ),
  387 |                 }
  388 |             }
  389 | 
  390 |             pub fn out_of_line_bitpacking(
  391 |                 uncompressed_bits_per_value: u64,
  392 |                 values: crate::format::$module::CompressiveEncoding,
  393 |             ) -> crate::format::$module::CompressiveEncoding {
  394 |                 crate::format::$module::CompressiveEncoding {
  395 |                     compression: Some(
  396 |                         crate::format::$module::compressive_encoding::Compression::OutOfLineBitpacking(
  397 |                             Box::new(crate::format::$module::OutOfLineBitpacking {
  398 |                                 uncompressed_bits_per_value,
  399 |                                 values: Some(Box::new(values)),
  400 |                             }),
  401 |                         ),
  402 |                     ),
  403 |                 }
  404 |             }
  405 | 
  406 |             pub fn buffer_compression(
  407 |                 compression: CompressionConfig,
  408 |             ) -> Result<crate::format::$module::BufferCompression> {
  409 |                 Ok(crate::format::$module::BufferCompression {
  410 |                     scheme: crate::format::$module::CompressionScheme::try_from(
  411 |                         compression.scheme,
  412 |                     )? as i32,
  413 |                     level: compression.level,
  414 |                 })
  415 |             }
  416 | 
  417 |             pub fn wrapped(
  418 |                 compression: CompressionConfig,
  419 |                 values: crate::format::$module::CompressiveEncoding,
  420 |             ) -> Result<crate::format::$module::CompressiveEncoding> {
  421 |                 Ok(crate::format::$module::CompressiveEncoding {
  422 |                     compression: Some(
  423 |                         crate::format::$module::compressive_encoding::Compression::General(
  424 |                             Box::new(crate::format::$module::General {
  425 |                                 compression: Some(Self::buffer_compression(compression)?),
  426 |                                 values: Some(Box::new(values)),
  427 |                             }),
  428 |                         ),
  429 |                     ),
  430 |                 })
  431 |             }
  432 | 
  433 |             pub fn rle(
  434 |                 values: crate::format::$module::CompressiveEncoding,
  435 |                 run_lengths: crate::format::$module::CompressiveEncoding,
  436 |             ) -> crate::format::$module::CompressiveEncoding {
  437 |                 crate::format::$module::CompressiveEncoding {
  438 |                     compression: Some(
  439 |                         crate::format::$module::compressive_encoding::Compression::Rle(Box::new(
  440 |                             crate::format::$module::Rle {
  441 |                                 values: Some(Box::new(values)),
  442 |                                 run_lengths: Some(Box::new(run_lengths)),
  443 |                             },
  444 |                         )),
  445 |                     ),
  446 |                 }
  447 |             }
  448 | 
  449 |             pub fn byte_stream_split(
  450 |                 values: crate::format::$module::CompressiveEncoding,
  451 |             ) -> crate::format::$module::CompressiveEncoding {
  452 |                 crate::format::$module::CompressiveEncoding {
  453 |                     compression: Some(
  454 |                         crate::format::$module::compressive_encoding::Compression::ByteStreamSplit(
  455 |                             Box::new(crate::format::$module::ByteStreamSplit {
  456 |                                 values: Some(Box::new(values)),
  457 |                             }),
  458 |                         ),
  459 |                     ),
  460 |                 }
  461 |             }
  462 | 
  463 |             pub fn fsst(
  464 |                 data: crate::format::$module::CompressiveEncoding,
  465 |                 symbol_table: Vec<u8>,
  466 |             ) -> crate::format::$module::CompressiveEncoding {
  467 |                 crate::format::$module::CompressiveEncoding {
  468 |                     compression: Some(
  469 |                         crate::format::$module::compressive_encoding::Compression::Fsst(
  470 |                             Box::new(crate::format::$module::Fsst {
  471 |                                 symbol_table: symbol_table.into(),
  472 |                                 values: Some(Box::new(data)),
  473 |                             }),
  474 |                         ),
  475 |                     ),
  476 |                 }
  477 |             }
  478 | 
  479 |             fn def_inter_to_repdef_layer(def: DefinitionInterpretation) -> i32 {
  480 |                 match def {
  481 |                     DefinitionInterpretation::AllValidItem => {
  482 |                         crate::format::$module::RepDefLayer::RepdefAllValidItem as i32
  483 |                     }
  484 |                     DefinitionInterpretation::AllValidList => {
  485 |                         crate::format::$module::RepDefLayer::RepdefAllValidList as i32
  486 |                     }
  487 |                     DefinitionInterpretation::NullableItem => {
  488 |                         crate::format::$module::RepDefLayer::RepdefNullableItem as i32
  489 |                     }
  490 |                     DefinitionInterpretation::NullableList => {
  491 |                         crate::format::$module::RepDefLayer::RepdefNullableList as i32
  492 |                     }
  493 |                     DefinitionInterpretation::EmptyableList => {
  494 |                         crate::format::$module::RepDefLayer::RepdefEmptyableList as i32
  495 |                     }
  496 |                     DefinitionInterpretation::NullableAndEmptyableList => {
  497 |                         crate::format::$module::RepDefLayer::RepdefNullAndEmptyList as i32
  498 |                     }
  499 |                 }
  500 |             }
  501 | 
  502 |             pub fn repdef_layer_to_def_interp(
  503 |                 layer: i32,
  504 |             ) -> DefinitionInterpretation {
  505 |                 let layer = crate::format::$module::RepDefLayer::try_from(layer).unwrap();
  506 |                 match layer {
  507 |                     crate::format::$module::RepDefLayer::RepdefAllValidItem => {
  508 |                         DefinitionInterpretation::AllValidItem
  509 |                     }
  510 |                     crate::format::$module::RepDefLayer::RepdefAllValidList => {
  511 |                         DefinitionInterpretation::AllValidList
  512 |                     }
  513 |                     crate::format::$module::RepDefLayer::RepdefNullableItem => {
  514 |                         DefinitionInterpretation::NullableItem
  515 |                     }
  516 |                     crate::format::$module::RepDefLayer::RepdefNullableList => {
  517 |                         DefinitionInterpretation::NullableList
  518 |                     }
  519 |                     crate::format::$module::RepDefLayer::RepdefEmptyableList => {
  520 |                         DefinitionInterpretation::EmptyableList
  521 |                     }
  522 |                     crate::format::$module::RepDefLayer::RepdefNullAndEmptyList => {
  523 |                         DefinitionInterpretation::NullableAndEmptyableList
  524 |                     }
  525 |                     crate::format::$module::RepDefLayer::RepdefUnspecified => {
  526 |                         panic!("Unspecified repdef layer")
  527 |                     }
  528 |                 }
  529 |             }
  530 | 
  531 |             #[allow(clippy::too_many_arguments)]
  532 |             pub fn miniblock_layout(
  533 |                 rep_encoding: Option<crate::format::$module::CompressiveEncoding>,
  534 |                 def_encoding: Option<crate::format::$module::CompressiveEncoding>,
  535 |                 value_encoding: crate::format::$module::CompressiveEncoding,
  536 |                 repetition_index_depth: u32,
  537 |                 num_buffers: u64,
  538 |                 dictionary_encoding: Option<(
  539 |                     crate::format::$module::CompressiveEncoding,
  540 |                     u64,
  541 |                 )>,
  542 |                 def_meaning: &[DefinitionInterpretation],
  543 |                 num_items: u64,
  544 |                 has_large_chunk: bool,
  545 |     ) -> crate::format::$module::PageLayout {
  546 |                 assert!(!def_meaning.is_empty());
  547 |                 let (dictionary, num_dictionary_items) = dictionary_encoding
  548 |                     .map(|(d, i)| (Some(d), i))
  549 |                     .unwrap_or((None, 0));
  550 |                 crate::format::$module::PageLayout {
  551 |                     layout: Some(
  552 |                         crate::format::$module::page_layout::Layout::MiniBlockLayout(
  553 |                             crate::format::$module::MiniBlockLayout {
  554 |                                 def_compression: def_encoding,
  555 |                                 rep_compression: rep_encoding,
  556 |                                 value_compression: Some(value_encoding),
  557 |                                 repetition_index_depth,
  558 |                                 num_buffers,
  559 |                                 dictionary,
  560 |                                 num_dictionary_items,
  561 |                                 layers: def_meaning
  562 |                                     .iter()
  563 |                                     .map(|&def| Self::def_inter_to_repdef_layer(def))
  564 |                                     .collect(),
  565 |                                 num_items,
  566 |                                 has_large_chunk,
  567 |                 },
  568 |                         ),
  569 |                     ),
  570 |                 }
  571 |             }
  572 | 
  573 |             fn full_zip_layout(
  574 |                 bits_rep: u8,
  575 |                 bits_def: u8,
  576 |                 details: crate::format::$module::full_zip_layout::Details,
  577 |                 value_encoding: crate::format::$module::CompressiveEncoding,
  578 |                 def_meaning: &[DefinitionInterpretation],
  579 |                 num_items: u32,
  580 |                 num_visible_items: u32,
  581 |             ) -> crate::format::$module::PageLayout {
  582 |                 crate::format::$module::PageLayout {
  583 |                     layout: Some(
  584 |                         crate::format::$module::page_layout::Layout::FullZipLayout(
  585 |                             crate::format::$module::FullZipLayout {
  586 |                                 bits_rep: bits_rep as u32,
  587 |                                 bits_def: bits_def as u32,
  588 |                                 details: Some(details),
  589 |                                 value_compression: Some(value_encoding),
  590 |                                 num_items,
  591 |                                 num_visible_items,
  592 |                                 layers: def_meaning
  593 |                                     .iter()
  594 |                                     .map(|&def| Self::def_inter_to_repdef_layer(def))
  595 |                                     .collect(),
  596 |                             },
  597 |                         ),
  598 |                     ),
  599 |                 }
  600 |             }
  601 | 
  602 |             pub fn fixed_full_zip_layout(
  603 |                 bits_rep: u8,
  604 |                 bits_def: u8,
  605 |                 bits_per_value: u32,
  606 |                 value_encoding: crate::format::$module::CompressiveEncoding,
  607 |                 def_meaning: &[DefinitionInterpretation],
  608 |                 num_items: u32,
  609 |                 num_visible_items: u32,
  610 |             ) -> crate::format::$module::PageLayout {
  611 |                 Self::full_zip_layout(
  612 |                     bits_rep,
  613 |                     bits_def,
  614 |                     crate::format::$module::full_zip_layout::Details::BitsPerValue(
  615 |                         bits_per_value,
  616 |                     ),
  617 |                     value_encoding,
  618 |                     def_meaning,
  619 |                     num_items,
  620 |                     num_visible_items,
  621 |                 )
  622 |             }
  623 | 
  624 |             pub fn variable_full_zip_layout(
  625 |                 bits_rep: u8,
  626 |                 bits_def: u8,
  627 |                 bits_per_offset: u32,
  628 |                 value_encoding: crate::format::$module::CompressiveEncoding,
  629 |                 def_meaning: &[DefinitionInterpretation],
  630 |                 num_items: u32,
  631 |                 num_visible_items: u32,
  632 |             ) -> crate::format::$module::PageLayout {
  633 |                 Self::full_zip_layout(
  634 |                     bits_rep,
  635 |                     bits_def,
  636 |                     crate::format::$module::full_zip_layout::Details::BitsPerOffset(
  637 |                         bits_per_offset,
  638 |                     ),
  639 |                     value_encoding,
  640 |                     def_meaning,
  641 |                     num_items,
  642 |                     num_visible_items,
  643 |                 )
  644 |             }
  645 | 
  646 |             pub fn blob_layout(
  647 |                 inner_layout: crate::format::$module::PageLayout,
  648 |                 def_meaning: &[DefinitionInterpretation],
  649 |             ) -> crate::format::$module::PageLayout {
  650 |                 crate::format::$module::PageLayout {
  651 |                     layout: Some(
  652 |                         crate::format::$module::page_layout::Layout::BlobLayout(Box::new(
  653 |                             crate::format::$module::BlobLayout {
  654 |                                 inner_layout: Some(Box::new(inner_layout)),
  655 |                                 layers: def_meaning
  656 |                                     .iter()
  657 |                                     .map(|&def| Self::def_inter_to_repdef_layer(def))
  658 |                                     .collect(),
  659 |                             },
  660 |                         )),
  661 |                     ),
  662 |                 }
  663 |             }
  664 | 
  665 | 
  666 |         }
  667 |     };
  668 | }
  669 | 
  670 | impl_common_protobuf_utils!(pb21, ProtobufUtils21);
  671 | 
  672 | impl ProtobufUtils21 {
  673 |     pub fn constant_layout(
  674 |         def_meaning: &[DefinitionInterpretation],
  675 |         inline_value: Option<Vec<u8>>,
  676 |     ) -> crate::format::pb21::PageLayout {
  677 |         crate::format::pb21::PageLayout {
  678 |             layout: Some(crate::format::pb21::page_layout::Layout::ConstantLayout(
  679 |                 crate::format::pb21::ConstantLayout {
  680 |                     inline_value: inline_value.map(bytes::Bytes::from),
  681 |                     rep_compression: None,
  682 |                     def_compression: None,
  683 |                     num_rep_values: 0,
  684 |                     num_def_values: 0,
  685 |                     layers: def_meaning
  686 |                         .iter()
  687 |                         .map(|&def| Self::def_inter_to_repdef_layer(def))
  688 |                         .collect(),
  689 |                 },
  690 |             )),
  691 |         }
  692 |     }
  693 | 
  694 |     pub fn compressed_all_null_constant_layout(
  695 |         def_meaning: &[DefinitionInterpretation],
  696 |         rep_compression: Option<crate::format::pb21::CompressiveEncoding>,
  697 |         def_compression: Option<crate::format::pb21::CompressiveEncoding>,
  698 |         num_rep_values: u64,
  699 |         num_def_values: u64,
  700 |     ) -> crate::format::pb21::PageLayout {
  701 |         crate::format::pb21::PageLayout {
  702 |             layout: Some(crate::format::pb21::page_layout::Layout::ConstantLayout(
  703 |                 crate::format::pb21::ConstantLayout {
  704 |                     inline_value: None,
  705 |                     rep_compression,
  706 |                     def_compression,
  707 |                     num_rep_values,
  708 |                     num_def_values,
  709 |                     layers: def_meaning
  710 |                         .iter()
  711 |                         .map(|&def| Self::def_inter_to_repdef_layer(def))
  712 |                         .collect(),
  713 |                 },
  714 |             )),
  715 |         }
  716 |     }
  717 | 
  718 |     pub fn packed_struct(
  719 |         values: crate::format::pb21::CompressiveEncoding,
  720 |         bits_per_values: Vec<u64>,
  721 |     ) -> crate::format::pb21::CompressiveEncoding {
  722 |         crate::format::pb21::CompressiveEncoding {
  723 |             compression: Some(
  724 |                 crate::format::pb21::compressive_encoding::Compression::PackedStruct(Box::new(
  725 |                     crate::format::pb21::PackedStruct {
  726 |                         bits_per_value: bits_per_values,
  727 |                         values: Some(Box::new(values)),
  728 |                     },
  729 |                 )),
  730 |             ),
  731 |         }
  732 |     }
  733 | 
  734 |     pub fn packed_struct_variable(
  735 |         fields: Vec<crate::format::pb21::variable_packed_struct::FieldEncoding>,
  736 |     ) -> crate::format::pb21::CompressiveEncoding {
  737 |         crate::format::pb21::CompressiveEncoding {
  738 |             compression: Some(
  739 |                 crate::format::pb21::compressive_encoding::Compression::VariablePackedStruct(
  740 |                     crate::format::pb21::VariablePackedStruct { fields },
  741 |                 ),
  742 |             ),
  743 |         }
  744 |     }
  745 | 
  746 |     pub fn packed_struct_field_fixed(
  747 |         value_encoding: crate::format::pb21::CompressiveEncoding,
  748 |         bits_per_value: u64,
  749 |     ) -> crate::format::pb21::variable_packed_struct::FieldEncoding {
  750 |         crate::format::pb21::variable_packed_struct::FieldEncoding {
  751 |             value: Some(value_encoding),
  752 |             layout: Some(
  753 |                 crate::format::pb21::variable_packed_struct::field_encoding::Layout::BitsPerValue(
  754 |                     bits_per_value,
  755 |                 ),
  756 |             ),
  757 |         }
  758 |     }
  759 | 
  760 |     pub fn packed_struct_field_variable(
  761 |         value_encoding: crate::format::pb21::CompressiveEncoding,
  762 |         bits_per_length: u64,
  763 |     ) -> crate::format::pb21::variable_packed_struct::FieldEncoding {
  764 |         crate::format::pb21::variable_packed_struct::FieldEncoding {
  765 |             value: Some(value_encoding),
  766 |             layout: Some(
  767 |                 crate::format::pb21::variable_packed_struct::field_encoding::Layout::BitsPerLength(
  768 |                     bits_per_length,
  769 |                 ),
  770 |             ),
  771 |         }
  772 |     }
  773 | }
``````
