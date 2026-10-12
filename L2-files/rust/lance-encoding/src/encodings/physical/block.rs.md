> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/encodings/physical/block.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b665f4f4e5e2a8b9353916e96e28ddf470808ec386e20e298d734996f1ac0c9f`. Reviewed physical lines: 1-884.

[Module](../../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

General buffer codec configuration/selection, Zstd and LZ4 framing, append-oriented compression, whole-block and per-value adapters, and local tests. (rust/lance-encoding/src/encodings/physical/block.rs:1-884)

## Complete range analysis

### Lines 1-23

SPDX and qualitative rationale: general compression makes whole buffers opaque and trades CPU for size; full-zip per-value compression retains value access. Comment says no mini-block variant exists yet, but contextual finalize_miniblock_compressor can wrap fixed-width mini-blocks; do not treat this module-level comment as a current whole-crate capability statement. No benchmark was run. (rust/lance-encoding/src/compression.rs:587-597) (rust/lance-encoding/src/encodings/physical/block.rs:1-23)

### Lines 24-41

Imports ArrowNativeType, Lance Error/Result, FromStr, compressor/decompressor traits, require_block_payload, binary encoder/decoder, structural metadata helpers, LanceBuffer and DataBlock types. These dependencies do the typed-buffer and nested-layout work; this file does not own disk IO or page selection. (rust/lance-encoding/src/encodings/physical/block.rs:24-41)

### Lines 42-64

Public Debug+Clone+Copy+PartialEq CompressionConfig holds crate-visible scheme:CompressionScheme and level:Option<i32>. Public new stores unchecked values; scheme() and level() copy them. No legal-level validation or feature check on construction. (rust/lance-encoding/src/encodings/physical/block.rs:42-64)

### Lines 65-81

CompressionConfig::default is Lz4 with Some(0), regardless of compiled features. Public Debug+Clone+Copy+PartialEq CompressionScheme variants are None,Fsst,Zstd,Lz4. This config default differs from CompressedBufferEncoder::default. (rust/lance-encoding/src/encodings/physical/block.rs:65-81)

### Lines 82-111

TryFrom in each direction between runtime and pb21 schemes accepts Lz4 and Zstd only. Runtime None/Fsst and protobuf unspecified produce InvalidInput with Unsupported compression scheme and Debug value. Conversion is metadata legality, not feature availability or actual compression. (rust/lance-encoding/src/encodings/physical/block.rs:82-111)

### Lines 112-140

Display spells fsst,zstd,none,lz4. FromStr accepts only exact lowercase spellings, no trim or case normalization, returns InvalidInput Unknown compression scheme: {s} otherwise. Unlike BssMode::parse this parse returns Result. (rust/lance-encoding/src/encodings/physical/block.rs:112-140)

### Lines 141-146

Public BufferCompressor:Debug+Send+Sync requires compress/decompress borrowing input slice and mutable output Vec, returning Result<()>, and config()->CompressionConfig. Implementations below append output, but trait declaration alone contains no transactional/error rollback guarantee. (rust/lance-encoding/src/encodings/physical/block.rs:141-146)

### Lines 147-174

Private zstd module gated feature=zstd imports Cursor,Write,Mutex,OnceLock and zstd bulk/stream APIs. Its pub ZstdBufferCompressor is not reachable as a public path through the private module. Fields store requested i32 level and OnceLock<Result<Mutex<Compressor<static>>,String>>. Lazy compressor context is reused only on compression; comment explains avoiding decompression-context contention as historical rationale, not measured evidence here. (rust/lance-encoding/src/encodings/physical/block.rs:147-174)

### Lines 175-201

Debug exposes level only. new stores level and empty OnceLock. Private get_compressor initializes dependency Compressor::new once, maps success into Mutex and failure into String. Initialization error is cached permanently and later calls wrap it as Internal Failed to create zstd compressor; no retry/reset path. Compressor mutation is serialized by a lock in compress; get_compressor itself just returns a reference. (rust/lance-encoding/src/encodings/physical/block.rs:175-201)

### Lines 202-238

Private is_raw_stream_format: fewer than8 bytes returns true; otherwise LE firstu32 must equal0xFD2FB528 and byte4 &0x10 must equal0 to classify raw. Other inputs are length-prefixed. IMPORTANT source discrepancy: comment names bit3/fourth bit but literal0b0001_0000 tests bit4/fifth bit; document executed mask, not comment. No external RFC was fetched. This is heuristic discrimination, not a complete frame validator; a coincidental length prefix can match the heuristic. (rust/lance-encoding/src/encodings/physical/block.rs:202-238)

### Lines 239-258

Private length-prefixed decode reads8-byte LE uncompressedu64 length, casts to usize, resizes output from old length to old+declared, and calls zstd bulk decompress into appended slice. It ignores returned decompressed byte count and never truncates/checks equality. If library succeeds with fewer bytes, remaining initialized bytes stay zero. No local allocation cap, checked-add/cast, payload checksum or rollback. This helper is reached for >=8-byte inputs by dispatcher. (rust/lance-encoding/src/encodings/physical/block.rs:239-258)

### Lines 259-277

Zstd compress appends8-byte LE input length, reserves/resizes compress_bound bytes, lazily obtains cached context, locks with unwrap (poison can panic), compresses into tail, maps codec failure to Internal Zstd compression error, then truncates to actual compressed size. On earlier error output retains prefix/resized tail; it is not restored. Level is not independently validated before dependency construction. (rust/lance-encoding/src/encodings/physical/block.rs:259-277)

### Lines 278-301

Zstd decompress accepts empty input as successful no-op. Raw-classified input uses copy_decode(Cursor,output); otherwise length-prefixed helper. Errors propagate; output may be partially appended. config always returns Zstd with Some(requested level), so requested None becomes runtime Some(0) through factory. Closing braces end feature module. (rust/lance-encoding/src/encodings/physical/block.rs:278-301)

### Lines 302-331

Private lz4 module feature gate and Debug+Default empty Lz4BufferCompressor. compress remembers existing output length, asks compress_bound, resizes by max_size+4, and calls block compress_to_buffer with modeNone and prepend_size=true. Success truncates to actual bytes; errors become Internal LZ4 compression error after mutation. No compression level is consumed. (rust/lance-encoding/src/encodings/physical/block.rs:302-331)

### Lines 332-369

LZ4 decompress rejects input shorter than4 with Internal LZ4 compressed data too short before mutation. Reads LEu32 declared length from first4, resizes appended region, calls decompress_to_buffer(input,None,tail), maps error to Internal LZ4 decompression error, and truncates to returned count. Unlike Zstd it uses returned count, but does not locally assert equality with declared size. No allocation cap or rollback. config returns Lz4,None regardless of input configuration. (rust/lance-encoding/src/encodings/physical/block.rs:332-369)

### Lines 370-391

Public Debug+Default empty NoopBufferCompressor; both compress/decompress append input bytes and return Ok. config returns None scheme and absent level. This is a working buffer copier, but runtime None cannot be converted to structural General metadata. (rust/lance-encoding/src/encodings/physical/block.rs:370-391)

### Lines 392-432

Public empty GeneralBufferCompressor namespace factory get_compressor(config)->Result<Box<dyn BufferCompressor>>: Fsst returns InvalidInput because FSST has its own path; Zstd returns feature-gated lazy context at level.unwrap_or(0), otherwise explicit package-not-built error; Lz4 returns feature-gated default ignoring level, otherwise matching error; None returns Noop. Factory success for Zstd does not prove later context initialization succeeds. (rust/lance-encoding/src/encodings/physical/block.rs:392-432)

### Lines 433-461

Public Debug GeneralBlockDecompressor stores private boxed inner BlockDecompressor and BufferCompressor. try_new constructs outer codec or propagates error. Trait decompress requires Some payload, decompresses into fresh Vec, wraps LanceBuffer and delegates inner with unchanged num_values. Empty Some is distinct from absent payload; missing payload yields InvalidInput {codec} requires one payload via helper. No local type/count validation, offset IO or streaming. (rust/lance-encoding/src/compression.rs:951-953) (rust/lance-encoding/src/encodings/physical/block.rs:433-461)

### Lines 462-489

Public Debug CompressedBufferEncoder has crate-visible boxed compressor plus private selected block_compression. Keeping selected config preserves optional level presence even if runtime defaults/ignores it. Default selects Zstd Some(0) when enabled, else Lz4 None, else None None, constructs factory with unwrap. No numeric format-version gate. All-features-off default can copy buffers but structural wrapped metadata later rejects None. (rust/lance-encoding/src/encodings/physical/block.rs:462-489)

### Lines 490-511

Public try_new config constructs runtime compressor and preserves original selected config. Public from_scheme(pb21 scheme) validates Lz4/Zstd conversion, sets levelSome(0) and calls factory; does not preserve an absent descriptor level because no level argument exists. (rust/lance-encoding/src/encodings/physical/block.rs:490-511)

### Lines 512-531

Public per_value_compress<T:ArrowNativeType> starts returned offsets with T::from_usize(0).unwrap, iterates input offset windows, casts each to usize, slices data[start..end], appends each compressed value to caller Vec and appends total compressed.len() converted to T with unwrap. Preconditions: valid monotone in-bounds offsets and representable output positions. Empty offsets still return onezero, one offset also onezero. For nonempty prefilled output Vec, first offset is0 but later offsets include preexisting bytes: caller must supply empty destination for ordinary self-contained encoding. On later error earlier appends remain. (rust/lance-encoding/src/encodings/physical/block.rs:512-531)

### Lines 532-552

Public per_value_decompress mirrors compression with independent slices and cumulative output offsets; same unchecked offset slicing, unwrap conversion, empty-input offsets and prefilled-output caveats. Neither helper verifies starting offset0, final offset==data.len, number of values, signedness or row count; generic ArrowNativeType is broader than actual u32/u64 callers. (rust/lance-encoding/src/encodings/physical/block.rs:532-552)

### Lines 553-599

PerValueCompressor impl requires VariableWidth DataBlock or Internal naming data type. Supports bits_per_offset32/64 using typed LanceBuffer borrow; other widths unreachable panic. Uses fresh output Vec and returns Variable PerValueDataBlock with same width/count and new BlockInfo. Descriptor wraps runtime compressor.config around Variable(flat offset-width,None values). Thus runtime-normalized level is used here, unlike whole-block selected config. TODO says support setting level, but actual config path can carry selected Zstd level; record TODO separately from executed construction. Wrapped descriptor can fail after compression (e.g. None codec). No null/type/count validation or whole-page assembly here. (rust/lance-encoding/src/encodings/physical/block.rs:553-599)

### Lines 600-627

VariablePerValueDecompressor impl allocates data.len()*2 hint, handles32/64 offsets only, invokes helper, returns VariableWidth DataBlock preserving width/count and resetting BlockInfo. Hint is not decompressed size cap; arithmetic and conversions unchecked. Requires previously separated compressed per-value offsets; no whole-block header parsing. (rust/lance-encoding/src/encodings/physical/block.rs:600-627)

### Lines 628-665

BlockCompressor impl accepts FixedWidth (raw data plus Flat(bits_per_value,None)) or VariableWidth (VariableEncoder::default compress, require returned Some payload or Internal); other variants InvalidInput Unsupported data block type. Compresses encoded buffer, returns Some even if empty, wraps using preserved block_compression. None/Fsst cannot produce legal General descriptor; FSST factory already fails, None may perform work before wrapped rejects it. No direct stable/unstable version dispatch here. (rust/lance-encoding/src/encodings/physical/block.rs:628-665)

### Lines 666-677

BlockDecompressor impl on CompressedBufferEncoder requires payload, decompresses outer codec, then always uses BinaryBlockDecompressor::default with unchanged num_values. It is a variable-block convenience decoder, not symmetric decoding for the same type entire FixedWidth/VariableWidth encoder surface. GeneralBlockDecompressor is the descriptor-driven composition point; strategy constructs its inner recursively. (rust/lance-encoding/src/compression.rs:1213-1231) (rust/lance-encoding/src/encodings/physical/block.rs:666-677)

### Lines 678-701

cfg(test) module imports ZstdBufferCompressor unconditionally inside tests even though zstd implementation module is feature-gated. Source indicates a no-zstd test-build resolution risk; no feature build was run. test_compression_scheme_from_str checks none,zstd only; invalid test checks unknown string error, not exact variant/message or uppercase/whitespace. (rust/lance-encoding/src/encodings/physical/block.rs:678-701)

### Lines 702-723

Feature-gated zstd test compresses Hello, world! using length-prefixed writer then auto-dispatch decode, asserting bytes equal. It does not assert raw frame or prefix literal. (rust/lance-encoding/src/encodings/physical/block.rs:702-723)

### Lines 724-770

Zstd multiple-times test reuses one compressor, appends Hello and World into one output, records compressed boundary, decodes each separate slice into one output, checks total length and both slices. This is append behavior with caller-kept boundaries, not proof that one decode handles concatenated length-prefixed frames. (rust/lance-encoding/src/encodings/physical/block.rs:724-770)

### Lines 771-790

Raw-stream compatibility test creates dependency zstd::Encoder without length prefix, writes Hello, world!, finishes and feeds public dispatch decode. Test name/comment says length-prefixed, but actual dispatcher recognizes raw input. It asserts round-trip compatibility, not heuristic collision or reserved-bit correctness. (rust/lance-encoding/src/encodings/physical/block.rs:771-790)

### Lines 791-828

Feature-gated lz4 tests import Arrow types/datagen, metadata and harness helpers. Basic LZ4 round-trip asserts Hello, world! only. No short-input/malformed-length/nonempty-output/error-rollback assertions in this test. (rust/lance-encoding/src/encodings/physical/block.rs:791-828)

### Lines 829-884

Async rstest matrix: Utf8,LargeUtf8,Binary,LargeBinary times StructuralU16/U32/Sparse times slicing false/true =24 parameter combinations before harness cases. Field metadata requests lz4, dict divisor100000 and size ratio0.0001 to discourage dictionary, and fullzip; page size1MiB. Harness expectation is literal zstd despite lz4 metadata/test name, an unresolved source inconsistency rather than proof requested codec was used. Providers generate compressible compressme-prefix+counter values with correct large flag; other type panic. Delegates to check_round_trip_encoding_generated. Complete harness/selection semantics remain pending; tests were not run. (rust/lance-encoding/src/encodings/physical/block.rs:829-884)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Encodings based on traditional block compression schemes
    5 | //!
    6 | //! Traditional compressors take in a buffer and return a smaller buffer.  All encoding
    7 | //! description is shoved into the compressed buffer and the entire buffer is needed to
    8 | //! decompress any of the data.
    9 | //!
   10 | //! These encodings are not transparent, which limits our ability to use them.  In addition
   11 | //! they are often quite expensive in CPU terms.
   12 | //!
   13 | //! However, they are effective and useful for some cases.  For example, when working with large
   14 | //! variable length values (e.g. source code files) they can be very effective.
   15 | //!
   16 | //! The module introduces the `[BufferCompressor]` trait which describes the interface for a
   17 | //! traditional block compressor.  It is implemented for the most common compression schemes
   18 | //! (zstd, lz4, etc).
   19 | //!
   20 | //! There is not yet a mini-block variant of this compressor (but could easily be one) and the
   21 | //! full zip variant works by applying compression on a per-value basis (which allows it to be
   22 | //! transparent).
   23 | 
   24 | use arrow_buffer::ArrowNativeType;
   25 | use lance_core::{Error, Result};
   26 | 
   27 | use std::str::FromStr;
   28 | 
   29 | use crate::compression::{BlockCompressor, BlockDecompressor, require_block_payload};
   30 | use crate::encodings::physical::binary::{BinaryBlockDecompressor, VariableEncoder};
   31 | use crate::format::{
   32 |     ProtobufUtils21,
   33 |     pb21::{self, CompressiveEncoding},
   34 | };
   35 | use crate::{
   36 |     buffer::LanceBuffer,
   37 |     compression::VariablePerValueDecompressor,
   38 |     data::{BlockInfo, DataBlock, VariableWidthBlock},
   39 |     encodings::logical::primitive::fullzip::{PerValueCompressor, PerValueDataBlock},
   40 | };
   41 | 
   42 | #[derive(Debug, Clone, Copy, PartialEq)]
   43 | pub struct CompressionConfig {
   44 |     pub(crate) scheme: CompressionScheme,
   45 |     pub(crate) level: Option<i32>,
   46 | }
   47 | 
   48 | impl CompressionConfig {
   49 |     /// Create a compression configuration for an encoding mechanism.
   50 |     pub fn new(scheme: CompressionScheme, level: Option<i32>) -> Self {
   51 |         Self { scheme, level }
   52 |     }
   53 | 
   54 |     /// Return the selected compression scheme.
   55 |     pub fn scheme(&self) -> CompressionScheme {
   56 |         self.scheme
   57 |     }
   58 | 
   59 |     /// Return the optional compression level.
   60 |     pub fn level(&self) -> Option<i32> {
   61 |         self.level
   62 |     }
   63 | }
   64 | 
   65 | impl Default for CompressionConfig {
   66 |     fn default() -> Self {
   67 |         Self {
   68 |             scheme: CompressionScheme::Lz4,
   69 |             level: Some(0),
   70 |         }
   71 |     }
   72 | }
   73 | 
   74 | #[derive(Debug, Clone, Copy, PartialEq)]
   75 | pub enum CompressionScheme {
   76 |     None,
   77 |     Fsst,
   78 |     Zstd,
   79 |     Lz4,
   80 | }
   81 | 
   82 | impl TryFrom<CompressionScheme> for pb21::CompressionScheme {
   83 |     type Error = Error;
   84 | 
   85 |     fn try_from(scheme: CompressionScheme) -> Result<Self> {
   86 |         match scheme {
   87 |             CompressionScheme::Lz4 => Ok(Self::CompressionAlgorithmLz4),
   88 |             CompressionScheme::Zstd => Ok(Self::CompressionAlgorithmZstd),
   89 |             _ => Err(Error::invalid_input(format!(
   90 |                 "Unsupported compression scheme: {:?}",
   91 |                 scheme
   92 |             ))),
   93 |         }
   94 |     }
   95 | }
   96 | 
   97 | impl TryFrom<pb21::CompressionScheme> for CompressionScheme {
   98 |     type Error = Error;
   99 | 
  100 |     fn try_from(scheme: pb21::CompressionScheme) -> Result<Self> {
  101 |         match scheme {
  102 |             pb21::CompressionScheme::CompressionAlgorithmLz4 => Ok(Self::Lz4),
  103 |             pb21::CompressionScheme::CompressionAlgorithmZstd => Ok(Self::Zstd),
  104 |             _ => Err(Error::invalid_input(format!(
  105 |                 "Unsupported compression scheme: {:?}",
  106 |                 scheme
  107 |             ))),
  108 |         }
  109 |     }
  110 | }
  111 | 
  112 | impl std::fmt::Display for CompressionScheme {
  113 |     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
  114 |         let scheme_str = match self {
  115 |             Self::Fsst => "fsst",
  116 |             Self::Zstd => "zstd",
  117 |             Self::None => "none",
  118 |             Self::Lz4 => "lz4",
  119 |         };
  120 |         write!(f, "{}", scheme_str)
  121 |     }
  122 | }
  123 | 
  124 | impl FromStr for CompressionScheme {
  125 |     type Err = Error;
  126 | 
  127 |     fn from_str(s: &str) -> Result<Self> {
  128 |         match s {
  129 |             "none" => Ok(Self::None),
  130 |             "fsst" => Ok(Self::Fsst),
  131 |             "zstd" => Ok(Self::Zstd),
  132 |             "lz4" => Ok(Self::Lz4),
  133 |             _ => Err(Error::invalid_input(format!(
  134 |                 "Unknown compression scheme: {}",
  135 |                 s
  136 |             ))),
  137 |         }
  138 |     }
  139 | }
  140 | 
  141 | pub trait BufferCompressor: std::fmt::Debug + Send + Sync {
  142 |     fn compress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()>;
  143 |     fn decompress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()>;
  144 |     fn config(&self) -> CompressionConfig;
  145 | }
  146 | 
  147 | #[cfg(feature = "zstd")]
  148 | mod zstd {
  149 |     use std::io::{Cursor, Write};
  150 |     use std::sync::{Mutex, OnceLock};
  151 | 
  152 |     use super::*;
  153 | 
  154 |     use ::zstd::bulk::{Compressor, decompress_to_buffer};
  155 |     use ::zstd::stream::copy_decode;
  156 | 
  157 |     /// A zstd buffer compressor that lazily creates and reuses compression contexts.
  158 |     ///
  159 |     /// The compression context is cached to enable reuse across chunks within a
  160 |     /// page. It is lazily initialized to prevent it from getting initialized on
  161 |     /// decode-only codepaths.
  162 |     ///
  163 |     /// Reuse is not implemented for decompression, only for compression:
  164 |     /// * The single-threaded benefit of reuse was negligible when measured.
  165 |     /// * Decompressors can get shared across threads, leading to mutex
  166 |     ///   contention if the same strategy is used as for compression here. This
  167 |     ///   should be mitigable with pooling but we can skip the complexity until a
  168 |     ///   need is demonstrated. The multithreaded decode benchmark effectively
  169 |     ///   demonstrates this scenario.
  170 |     pub struct ZstdBufferCompressor {
  171 |         compression_level: i32,
  172 |         compressor: OnceLock<std::result::Result<Mutex<Compressor<'static>>, String>>,
  173 |     }
  174 | 
  175 |     impl std::fmt::Debug for ZstdBufferCompressor {
  176 |         fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
  177 |             f.debug_struct("ZstdBufferCompressor")
  178 |                 .field("compression_level", &self.compression_level)
  179 |                 .finish()
  180 |         }
  181 |     }
  182 | 
  183 |     impl ZstdBufferCompressor {
  184 |         pub fn new(compression_level: i32) -> Self {
  185 |             Self {
  186 |                 compression_level,
  187 |                 compressor: OnceLock::new(),
  188 |             }
  189 |         }
  190 | 
  191 |         fn get_compressor(&self) -> Result<&Mutex<Compressor<'static>>> {
  192 |             self.compressor
  193 |                 .get_or_init(|| {
  194 |                     Compressor::new(self.compression_level)
  195 |                         .map(Mutex::new)
  196 |                         .map_err(|e| e.to_string())
  197 |                 })
  198 |                 .as_ref()
  199 |                 .map_err(|e| Error::internal(format!("Failed to create zstd compressor: {}", e)))
  200 |         }
  201 | 
  202 |         // https://datatracker.ietf.org/doc/html/rfc8878
  203 |         fn is_raw_stream_format(&self, input_buf: &[u8]) -> bool {
  204 |             if input_buf.len() < 8 {
  205 |                 return true; // can't be length prefixed format if less than 8 bytes
  206 |             }
  207 |             // read the first 4 bytes as the magic number
  208 |             let mut magic_buf = [0u8; 4];
  209 |             magic_buf.copy_from_slice(&input_buf[..4]);
  210 |             let magic = u32::from_le_bytes(magic_buf);
  211 | 
  212 |             // see RFC 8878, section 3.1.1. Zstandard Frames, which defines the magic number
  213 |             const ZSTD_MAGIC_NUMBER: u32 = 0xFD2FB528;
  214 |             if magic == ZSTD_MAGIC_NUMBER {
  215 |                 // the compressed buffer starts like a Zstd frame.
  216 |                 // Per RFC 8878, the reserved bit (with Bit Number 3, the 4th bit) in the FHD (frame header descriptor) MUST be 0
  217 |                 // see section 3.1.1.1.1. 'Frame_Header_Descriptor' and section 3.1.1.1.1.4. 'Reserved Bit' for details
  218 |                 const FHD_BYTE_INDEX: usize = 4;
  219 |                 let fhd_byte = input_buf[FHD_BYTE_INDEX];
  220 |                 const FHD_RESERVED_BIT_MASK: u8 = 0b0001_0000;
  221 |                 let reserved_bit = fhd_byte & FHD_RESERVED_BIT_MASK;
  222 | 
  223 |                 if reserved_bit != 0 {
  224 |                     // this bit is 1. This is NOT a valid zstd frame.
  225 |                     // therefore, it must be length prefixed format where the length coincidentally
  226 |                     // started with the magic number
  227 |                     false
  228 |                 } else {
  229 |                     // the reserved bit is 0. This is consistent with a valid Zstd frame.
  230 |                     // treat it as raw stream format
  231 |                     true
  232 |                 }
  233 |             } else {
  234 |                 // doesn't start with the magic number, so it can't be the raw stream format
  235 |                 false
  236 |             }
  237 |         }
  238 | 
  239 |         fn decompress_length_prefixed_zstd(
  240 |             &self,
  241 |             input_buf: &[u8],
  242 |             output_buf: &mut Vec<u8>,
  243 |         ) -> Result<()> {
  244 |             const LENGTH_PREFIX_SIZE: usize = 8;
  245 |             let mut len_buf = [0u8; LENGTH_PREFIX_SIZE];
  246 |             len_buf.copy_from_slice(&input_buf[..LENGTH_PREFIX_SIZE]);
  247 | 
  248 |             let uncompressed_len = u64::from_le_bytes(len_buf) as usize;
  249 | 
  250 |             let start = output_buf.len();
  251 |             output_buf.resize(start + uncompressed_len, 0);
  252 | 
  253 |             let compressed_data = &input_buf[LENGTH_PREFIX_SIZE..];
  254 |             decompress_to_buffer(compressed_data, &mut output_buf[start..])?;
  255 |             Ok(())
  256 |         }
  257 |     }
  258 | 
  259 |     impl BufferCompressor for ZstdBufferCompressor {
  260 |         fn compress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  261 |             output_buf.write_all(&(input_buf.len() as u64).to_le_bytes())?;
  262 | 
  263 |             let max_compressed_size = ::zstd::zstd_safe::compress_bound(input_buf.len());
  264 |             let start_pos = output_buf.len();
  265 |             output_buf.resize(start_pos + max_compressed_size, 0);
  266 | 
  267 |             let compressed_size = self
  268 |                 .get_compressor()?
  269 |                 .lock()
  270 |                 .unwrap()
  271 |                 .compress_to_buffer(input_buf, &mut output_buf[start_pos..])
  272 |                 .map_err(|e| Error::internal(format!("Zstd compression error: {}", e)))?;
  273 | 
  274 |             output_buf.truncate(start_pos + compressed_size);
  275 |             Ok(())
  276 |         }
  277 | 
  278 |         fn decompress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  279 |             if input_buf.is_empty() {
  280 |                 return Ok(());
  281 |             }
  282 | 
  283 |             let is_raw_stream_format = self.is_raw_stream_format(input_buf);
  284 |             if is_raw_stream_format {
  285 |                 copy_decode(Cursor::new(input_buf), output_buf)?;
  286 |             } else {
  287 |                 self.decompress_length_prefixed_zstd(input_buf, output_buf)?;
  288 |             }
  289 | 
  290 |             Ok(())
  291 |         }
  292 | 
  293 |         fn config(&self) -> CompressionConfig {
  294 |             CompressionConfig {
  295 |                 scheme: CompressionScheme::Zstd,
  296 |                 level: Some(self.compression_level),
  297 |             }
  298 |         }
  299 |     }
  300 | }
  301 | 
  302 | #[cfg(feature = "lz4")]
  303 | mod lz4 {
  304 |     use super::*;
  305 | 
  306 |     #[derive(Debug, Default)]
  307 |     pub struct Lz4BufferCompressor {}
  308 | 
  309 |     impl BufferCompressor for Lz4BufferCompressor {
  310 |         fn compress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  311 |             // Remember the starting position
  312 |             let start_pos = output_buf.len();
  313 | 
  314 |             // LZ4 needs space for the compressed data
  315 |             let max_size = ::lz4::block::compress_bound(input_buf.len())?;
  316 |             // Resize to ensure we have enough space (including 4 bytes for size header)
  317 |             output_buf.resize(start_pos + max_size + 4, 0);
  318 | 
  319 |             let compressed_size = ::lz4::block::compress_to_buffer(
  320 |                 input_buf,
  321 |                 None,
  322 |                 true,
  323 |                 &mut output_buf[start_pos..],
  324 |             )
  325 |             .map_err(|err| Error::internal(format!("LZ4 compression error: {}", err)))?;
  326 | 
  327 |             // Truncate to actual size
  328 |             output_buf.truncate(start_pos + compressed_size);
  329 |             Ok(())
  330 |         }
  331 | 
  332 |         fn decompress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  333 |             // When prepend_size is true, LZ4 stores the uncompressed size in the first 4 bytes
  334 |             // We can read this to know exactly how much space we need
  335 |             if input_buf.len() < 4 {
  336 |                 return Err(Error::internal("LZ4 compressed data too short".to_string()));
  337 |             }
  338 | 
  339 |             // Read the uncompressed size from the first 4 bytes (little-endian)
  340 |             let uncompressed_size =
  341 |                 u32::from_le_bytes([input_buf[0], input_buf[1], input_buf[2], input_buf[3]])
  342 |                     as usize;
  343 | 
  344 |             // Remember the starting position
  345 |             let start_pos = output_buf.len();
  346 | 
  347 |             // Resize to ensure we have the exact space needed
  348 |             output_buf.resize(start_pos + uncompressed_size, 0);
  349 | 
  350 |             // Now decompress directly into the buffer slice
  351 |             let decompressed_size =
  352 |                 ::lz4::block::decompress_to_buffer(input_buf, None, &mut output_buf[start_pos..])
  353 |                     .map_err(|err| Error::internal(format!("LZ4 decompression error: {}", err)))?;
  354 | 
  355 |             // Truncate to actual decompressed size (should be same as uncompressed_size)
  356 |             output_buf.truncate(start_pos + decompressed_size);
  357 | 
  358 |             Ok(())
  359 |         }
  360 | 
  361 |         fn config(&self) -> CompressionConfig {
  362 |             CompressionConfig {
  363 |                 scheme: CompressionScheme::Lz4,
  364 |                 level: None,
  365 |             }
  366 |         }
  367 |     }
  368 | }
  369 | 
  370 | #[derive(Debug, Default)]
  371 | pub struct NoopBufferCompressor {}
  372 | 
  373 | impl BufferCompressor for NoopBufferCompressor {
  374 |     fn compress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  375 |         output_buf.extend_from_slice(input_buf);
  376 |         Ok(())
  377 |     }
  378 | 
  379 |     fn decompress(&self, input_buf: &[u8], output_buf: &mut Vec<u8>) -> Result<()> {
  380 |         output_buf.extend_from_slice(input_buf);
  381 |         Ok(())
  382 |     }
  383 | 
  384 |     fn config(&self) -> CompressionConfig {
  385 |         CompressionConfig {
  386 |             scheme: CompressionScheme::None,
  387 |             level: None,
  388 |         }
  389 |     }
  390 | }
  391 | 
  392 | pub struct GeneralBufferCompressor {}
  393 | 
  394 | impl GeneralBufferCompressor {
  395 |     pub fn get_compressor(
  396 |         compression_config: CompressionConfig,
  397 |     ) -> Result<Box<dyn BufferCompressor>> {
  398 |         match compression_config.scheme {
  399 |             // FSST has its own compression path and isn't implemented as a generic buffer compressor
  400 |             CompressionScheme::Fsst => Err(Error::invalid_input_source(
  401 |                 "fsst is not usable as a general buffer compressor".into(),
  402 |             )),
  403 |             CompressionScheme::Zstd => {
  404 |                 #[cfg(feature = "zstd")]
  405 |                 {
  406 |                     Ok(Box::new(zstd::ZstdBufferCompressor::new(
  407 |                         compression_config.level.unwrap_or(0),
  408 |                     )))
  409 |                 }
  410 |                 #[cfg(not(feature = "zstd"))]
  411 |                 {
  412 |                     Err(Error::invalid_input_source(
  413 |                         "package was not built with zstd support".into(),
  414 |                     ))
  415 |                 }
  416 |             }
  417 |             CompressionScheme::Lz4 => {
  418 |                 #[cfg(feature = "lz4")]
  419 |                 {
  420 |                     Ok(Box::new(lz4::Lz4BufferCompressor::default()))
  421 |                 }
  422 |                 #[cfg(not(feature = "lz4"))]
  423 |                 {
  424 |                     Err(Error::invalid_input_source(
  425 |                         "package was not built with lz4 support".into(),
  426 |                     ))
  427 |                 }
  428 |             }
  429 |             CompressionScheme::None => Ok(Box::new(NoopBufferCompressor {})),
  430 |         }
  431 |     }
  432 | }
  433 | 
  434 | /// A block decompressor that first applies general-purpose compression (LZ4/Zstd)
  435 | /// before delegating to an inner block decompressor.
  436 | #[derive(Debug)]
  437 | pub struct GeneralBlockDecompressor {
  438 |     inner: Box<dyn BlockDecompressor>,
  439 |     compressor: Box<dyn BufferCompressor>,
  440 | }
  441 | 
  442 | impl GeneralBlockDecompressor {
  443 |     pub fn try_new(
  444 |         inner: Box<dyn BlockDecompressor>,
  445 |         compression: CompressionConfig,
  446 |     ) -> Result<Self> {
  447 |         let compressor = GeneralBufferCompressor::get_compressor(compression)?;
  448 |         Ok(Self { inner, compressor })
  449 |     }
  450 | }
  451 | 
  452 | impl BlockDecompressor for GeneralBlockDecompressor {
  453 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  454 |         let data = require_block_payload(data, "General block compression")?;
  455 |         let mut decompressed = Vec::new();
  456 |         self.compressor.decompress(&data, &mut decompressed)?;
  457 |         self.inner
  458 |             .decompress(Some(LanceBuffer::from(decompressed)), num_values)
  459 |     }
  460 | }
  461 | 
  462 | // An encoder which uses generic compression, such as zstd/lz4 to encode buffers
  463 | #[derive(Debug)]
  464 | pub struct CompressedBufferEncoder {
  465 |     pub(crate) compressor: Box<dyn BufferCompressor>,
  466 |     // Runtime compressors normalize levels that they default or ignore. Block descriptors must
  467 |     // retain the selected configuration so stable writers preserve those present/absent values.
  468 |     block_compression: CompressionConfig,
  469 | }
  470 | 
  471 | impl Default for CompressedBufferEncoder {
  472 |     fn default() -> Self {
  473 |         // Pick zstd if available, otherwise lz4, otherwise none
  474 |         #[cfg(feature = "zstd")]
  475 |         let (scheme, level) = (CompressionScheme::Zstd, Some(0));
  476 |         #[cfg(all(feature = "lz4", not(feature = "zstd")))]
  477 |         let (scheme, level) = (CompressionScheme::Lz4, None);
  478 |         #[cfg(not(any(feature = "zstd", feature = "lz4")))]
  479 |         let (scheme, level) = (CompressionScheme::None, None);
  480 | 
  481 |         let block_compression = CompressionConfig { scheme, level };
  482 |         let compressor = GeneralBufferCompressor::get_compressor(block_compression).unwrap();
  483 |         Self {
  484 |             compressor,
  485 |             block_compression,
  486 |         }
  487 |     }
  488 | }
  489 | 
  490 | impl CompressedBufferEncoder {
  491 |     pub fn try_new(compression_config: CompressionConfig) -> Result<Self> {
  492 |         let compressor = GeneralBufferCompressor::get_compressor(compression_config)?;
  493 |         Ok(Self {
  494 |             compressor,
  495 |             block_compression: compression_config,
  496 |         })
  497 |     }
  498 | 
  499 |     pub fn from_scheme(scheme: pb21::CompressionScheme) -> Result<Self> {
  500 |         let scheme = CompressionScheme::try_from(scheme)?;
  501 |         let block_compression = CompressionConfig {
  502 |             scheme,
  503 |             level: Some(0),
  504 |         };
  505 |         Ok(Self {
  506 |             compressor: GeneralBufferCompressor::get_compressor(block_compression)?,
  507 |             block_compression,
  508 |         })
  509 |     }
  510 | }
  511 | 
  512 | impl CompressedBufferEncoder {
  513 |     pub fn per_value_compress<T: ArrowNativeType>(
  514 |         &self,
  515 |         data: &[u8],
  516 |         offsets: &[T],
  517 |         compressed: &mut Vec<u8>,
  518 |     ) -> Result<LanceBuffer> {
  519 |         let mut new_offsets: Vec<T> = Vec::with_capacity(offsets.len());
  520 |         new_offsets.push(T::from_usize(0).unwrap());
  521 | 
  522 |         for off in offsets.windows(2) {
  523 |             let start = off[0].as_usize();
  524 |             let end = off[1].as_usize();
  525 |             self.compressor.compress(&data[start..end], compressed)?;
  526 |             new_offsets.push(T::from_usize(compressed.len()).unwrap());
  527 |         }
  528 | 
  529 |         Ok(LanceBuffer::reinterpret_vec(new_offsets))
  530 |     }
  531 | 
  532 |     pub fn per_value_decompress<T: ArrowNativeType>(
  533 |         &self,
  534 |         data: &[u8],
  535 |         offsets: &[T],
  536 |         decompressed: &mut Vec<u8>,
  537 |     ) -> Result<LanceBuffer> {
  538 |         let mut new_offsets: Vec<T> = Vec::with_capacity(offsets.len());
  539 |         new_offsets.push(T::from_usize(0).unwrap());
  540 | 
  541 |         for off in offsets.windows(2) {
  542 |             let start = off[0].as_usize();
  543 |             let end = off[1].as_usize();
  544 |             self.compressor
  545 |                 .decompress(&data[start..end], decompressed)?;
  546 |             new_offsets.push(T::from_usize(decompressed.len()).unwrap());
  547 |         }
  548 | 
  549 |         Ok(LanceBuffer::reinterpret_vec(new_offsets))
  550 |     }
  551 | }
  552 | 
  553 | impl PerValueCompressor for CompressedBufferEncoder {
  554 |     fn compress(&self, data: DataBlock) -> Result<(PerValueDataBlock, CompressiveEncoding)> {
  555 |         let data_type = data.name();
  556 |         let data = data.as_variable_width().ok_or(Error::internal(format!(
  557 |             "Attempt to use CompressedBufferEncoder on data of type {}",
  558 |             data_type
  559 |         )))?;
  560 | 
  561 |         let data_bytes = &data.data;
  562 |         let mut compressed = Vec::with_capacity(data_bytes.len());
  563 | 
  564 |         let new_offsets = match data.bits_per_offset {
  565 |             32 => self.per_value_compress::<u32>(
  566 |                 data_bytes,
  567 |                 &data.offsets.borrow_to_typed_slice::<u32>(),
  568 |                 &mut compressed,
  569 |             )?,
  570 |             64 => self.per_value_compress::<u64>(
  571 |                 data_bytes,
  572 |                 &data.offsets.borrow_to_typed_slice::<u64>(),
  573 |                 &mut compressed,
  574 |             )?,
  575 |             _ => unreachable!(),
  576 |         };
  577 | 
  578 |         let compressed = PerValueDataBlock::Variable(VariableWidthBlock {
  579 |             bits_per_offset: data.bits_per_offset,
  580 |             data: LanceBuffer::from(compressed),
  581 |             offsets: new_offsets,
  582 |             num_values: data.num_values,
  583 |             block_info: BlockInfo::new(),
  584 |         });
  585 | 
  586 |         // TODO: Support setting the level
  587 |         // TODO: Support underlying compression of data (e.g. defer to binary encoding for offset bitpacking)
  588 |         let encoding = ProtobufUtils21::wrapped(
  589 |             self.compressor.config(),
  590 |             ProtobufUtils21::variable(
  591 |                 ProtobufUtils21::flat(data.bits_per_offset as u64, None),
  592 |                 None,
  593 |             ),
  594 |         )?;
  595 | 
  596 |         Ok((compressed, encoding))
  597 |     }
  598 | }
  599 | 
  600 | impl VariablePerValueDecompressor for CompressedBufferEncoder {
  601 |     fn decompress(&self, data: VariableWidthBlock) -> Result<DataBlock> {
  602 |         let data_bytes = &data.data;
  603 |         let mut decompressed = Vec::with_capacity(data_bytes.len() * 2);
  604 | 
  605 |         let new_offsets = match data.bits_per_offset {
  606 |             32 => self.per_value_decompress(
  607 |                 data_bytes,
  608 |                 &data.offsets.borrow_to_typed_slice::<u32>(),
  609 |                 &mut decompressed,
  610 |             )?,
  611 |             64 => self.per_value_decompress(
  612 |                 data_bytes,
  613 |                 &data.offsets.borrow_to_typed_slice::<u64>(),
  614 |                 &mut decompressed,
  615 |             )?,
  616 |             _ => unreachable!(),
  617 |         };
  618 |         Ok(DataBlock::VariableWidth(VariableWidthBlock {
  619 |             bits_per_offset: data.bits_per_offset,
  620 |             data: LanceBuffer::from(decompressed),
  621 |             offsets: new_offsets,
  622 |             num_values: data.num_values,
  623 |             block_info: BlockInfo::new(),
  624 |         }))
  625 |     }
  626 | }
  627 | 
  628 | impl BlockCompressor for CompressedBufferEncoder {
  629 |     fn compress(&self, data: DataBlock) -> Result<(Option<LanceBuffer>, CompressiveEncoding)> {
  630 |         let (encoded, inner_encoding) = match data {
  631 |             DataBlock::FixedWidth(fixed_width) => (
  632 |                 fixed_width.data,
  633 |                 ProtobufUtils21::flat(fixed_width.bits_per_value, None),
  634 |             ),
  635 |             DataBlock::VariableWidth(variable_width) => {
  636 |                 // Wrap VariableEncoder to handle the encoding
  637 |                 let encoder = VariableEncoder::default();
  638 |                 let (payload, encoding) =
  639 |                     BlockCompressor::compress(&encoder, DataBlock::VariableWidth(variable_width))?;
  640 |                 (
  641 |                     payload.ok_or_else(|| {
  642 |                         Error::internal(
  643 |                             "VariableEncoder returned no payload for general compression"
  644 |                                 .to_string(),
  645 |                         )
  646 |                     })?,
  647 |                     encoding,
  648 |                 )
  649 |             }
  650 |             _ => {
  651 |                 return Err(Error::invalid_input_source(
  652 |                     "Unsupported data block type".into(),
  653 |                 ));
  654 |             }
  655 |         };
  656 | 
  657 |         let mut compressed = Vec::new();
  658 |         self.compressor.compress(&encoded, &mut compressed)?;
  659 |         Ok((
  660 |             Some(LanceBuffer::from(compressed)),
  661 |             ProtobufUtils21::wrapped(self.block_compression, inner_encoding)?,
  662 |         ))
  663 |     }
  664 | }
  665 | 
  666 | impl BlockDecompressor for CompressedBufferEncoder {
  667 |     fn decompress(&self, data: Option<LanceBuffer>, num_values: u64) -> Result<DataBlock> {
  668 |         let data = require_block_payload(data, "Compressed variable block")?;
  669 |         let mut decompressed = Vec::new();
  670 |         self.compressor.decompress(&data, &mut decompressed)?;
  671 | 
  672 |         // Delegate to BinaryBlockDecompressor which handles the inline metadata
  673 |         let inner_decoder = BinaryBlockDecompressor::default();
  674 |         inner_decoder.decompress(Some(LanceBuffer::from(decompressed)), num_values)
  675 |     }
  676 | }
  677 | 
  678 | #[cfg(test)]
  679 | mod tests {
  680 |     use super::*;
  681 |     use std::str::FromStr;
  682 | 
  683 |     use crate::encodings::physical::block::zstd::ZstdBufferCompressor;
  684 | 
  685 |     #[test]
  686 |     fn test_compression_scheme_from_str() {
  687 |         assert_eq!(
  688 |             CompressionScheme::from_str("none").unwrap(),
  689 |             CompressionScheme::None
  690 |         );
  691 |         assert_eq!(
  692 |             CompressionScheme::from_str("zstd").unwrap(),
  693 |             CompressionScheme::Zstd
  694 |         );
  695 |     }
  696 | 
  697 |     #[test]
  698 |     fn test_compression_scheme_from_str_invalid() {
  699 |         assert!(CompressionScheme::from_str("invalid").is_err());
  700 |     }
  701 | 
  702 |     #[cfg(feature = "zstd")]
  703 |     mod zstd {
  704 |         use std::io::Write;
  705 | 
  706 |         use super::*;
  707 | 
  708 |         #[test]
  709 |         fn test_compress_zstd_with_length_prefixed() {
  710 |             let compressor = ZstdBufferCompressor::new(0);
  711 |             let input_data = b"Hello, world!";
  712 |             let mut compressed_data = Vec::new();
  713 | 
  714 |             compressor
  715 |                 .compress(input_data, &mut compressed_data)
  716 |                 .unwrap();
  717 |             let mut decompressed_data = Vec::new();
  718 |             compressor
  719 |                 .decompress(&compressed_data, &mut decompressed_data)
  720 |                 .unwrap();
  721 |             assert_eq!(input_data, decompressed_data.as_slice());
  722 |         }
  723 | 
  724 |         #[test]
  725 |         fn test_zstd_compress_decompress_multiple_times() {
  726 |             let compressor = ZstdBufferCompressor::new(0);
  727 |             let (input_data_1, input_data_2) = (b"Hello ", b"World");
  728 |             let mut compressed_data = Vec::new();
  729 | 
  730 |             compressor
  731 |                 .compress(input_data_1, &mut compressed_data)
  732 |                 .unwrap();
  733 |             let compressed_length_1 = compressed_data.len();
  734 | 
  735 |             compressor
  736 |                 .compress(input_data_2, &mut compressed_data)
  737 |                 .unwrap();
  738 | 
  739 |             let mut decompressed_data = Vec::new();
  740 |             compressor
  741 |                 .decompress(
  742 |                     &compressed_data[..compressed_length_1],
  743 |                     &mut decompressed_data,
  744 |                 )
  745 |                 .unwrap();
  746 | 
  747 |             compressor
  748 |                 .decompress(
  749 |                     &compressed_data[compressed_length_1..],
  750 |                     &mut decompressed_data,
  751 |                 )
  752 |                 .unwrap();
  753 | 
  754 |             // the output should contain both input_data_1 and input_data_2
  755 |             assert_eq!(
  756 |                 decompressed_data.len(),
  757 |                 input_data_1.len() + input_data_2.len()
  758 |             );
  759 |             assert_eq!(
  760 |                 &decompressed_data[..input_data_1.len()],
  761 |                 input_data_1,
  762 |                 "First part of decompressed data should match input_1"
  763 |             );
  764 |             assert_eq!(
  765 |                 &decompressed_data[input_data_1.len()..],
  766 |                 input_data_2,
  767 |                 "Second part of decompressed data should match input_2"
  768 |             );
  769 |         }
  770 | 
  771 |         #[test]
  772 |         fn test_compress_zstd_raw_stream_format_and_decompress_with_length_prefixed() {
  773 |             let compressor = ZstdBufferCompressor::new(0);
  774 |             let input_data = b"Hello, world!";
  775 |             let mut compressed_data = Vec::new();
  776 | 
  777 |             // compress using raw stream format
  778 |             let mut encoder = ::zstd::Encoder::new(&mut compressed_data, 0).unwrap();
  779 |             encoder.write_all(input_data).unwrap();
  780 |             encoder.finish().expect("failed to encode data with zstd");
  781 | 
  782 |             // decompress using length prefixed format
  783 |             let mut decompressed_data = Vec::new();
  784 |             compressor
  785 |                 .decompress(&compressed_data, &mut decompressed_data)
  786 |                 .unwrap();
  787 |             assert_eq!(input_data, decompressed_data.as_slice());
  788 |         }
  789 |     }
  790 | 
  791 |     #[cfg(feature = "lz4")]
  792 |     mod lz4 {
  793 |         use std::{collections::HashMap, sync::Arc};
  794 | 
  795 |         use arrow_schema::{DataType, Field};
  796 |         use lance_datagen::array::{binary_prefix_plus_counter, utf8_prefix_plus_counter};
  797 | 
  798 |         use super::*;
  799 | 
  800 |         use crate::constants::DICT_SIZE_RATIO_META_KEY;
  801 |         use crate::{
  802 |             constants::{
  803 |                 COMPRESSION_META_KEY, DICT_DIVISOR_META_KEY, STRUCTURAL_ENCODING_FULLZIP,
  804 |                 STRUCTURAL_ENCODING_META_KEY,
  805 |             },
  806 |             encodings::physical::block::lz4::Lz4BufferCompressor,
  807 |             testing::{
  808 |                 FnArrayGeneratorProvider, TestCases, TestEncoding,
  809 |                 check_round_trip_encoding_generated,
  810 |             },
  811 |         };
  812 | 
  813 |         #[test]
  814 |         fn test_lz4_compress_decompress() {
  815 |             let compressor = Lz4BufferCompressor::default();
  816 |             let input_data = b"Hello, world!";
  817 |             let mut compressed_data = Vec::new();
  818 | 
  819 |             compressor
  820 |                 .compress(input_data, &mut compressed_data)
  821 |                 .unwrap();
  822 |             let mut decompressed_data = Vec::new();
  823 |             compressor
  824 |                 .decompress(&compressed_data, &mut decompressed_data)
  825 |                 .unwrap();
  826 |             assert_eq!(input_data, decompressed_data.as_slice());
  827 |         }
  828 | 
  829 |         #[rstest::rstest]
  830 |         #[test_log::test(tokio::test)]
  831 |         async fn test_lz4_compress_round_trip(
  832 |             #[values(
  833 |                 DataType::Utf8,
  834 |                 DataType::LargeUtf8,
  835 |                 DataType::Binary,
  836 |                 DataType::LargeBinary
  837 |             )]
  838 |             data_type: DataType,
  839 |             #[values(
  840 |                 TestEncoding::StructuralU16,
  841 |                 TestEncoding::StructuralU32,
  842 |                 TestEncoding::StructuralSparse
  843 |             )]
  844 |             encoding: TestEncoding,
  845 |             #[values(false, true)] use_slicing: bool,
  846 |         ) {
  847 |             let field = Field::new("", data_type.clone(), false);
  848 |             let mut field_meta = HashMap::new();
  849 |             field_meta.insert(COMPRESSION_META_KEY.to_string(), "lz4".to_string());
  850 |             // Some bad cardinality estimatation causes us to use dictionary encoding currently
  851 |             // which causes the expected encoding check to fail.
  852 |             field_meta.insert(DICT_DIVISOR_META_KEY.to_string(), "100000".to_string());
  853 |             field_meta.insert(DICT_SIZE_RATIO_META_KEY.to_string(), "0.0001".to_string());
  854 |             // Also disable size-based dictionary encoding
  855 |             field_meta.insert(
  856 |                 STRUCTURAL_ENCODING_META_KEY.to_string(),
  857 |                 STRUCTURAL_ENCODING_FULLZIP.to_string(),
  858 |             );
  859 |             let field = field.with_metadata(field_meta);
  860 |             let test_cases = TestCases::basic()
  861 |                 // Need to use large pages as small pages might be too small to compress
  862 |                 .with_page_sizes(vec![1024 * 1024])
  863 |                 .with_expected_encoding("zstd")
  864 |                 .with_encoding(encoding)
  865 |                 .with_slicing_modes([use_slicing]);
  866 | 
  867 |             // Can't use the default random provider because random data isn't compressible
  868 |             // and we will fallback to uncompressed encoding
  869 |             let datagen = Box::new(FnArrayGeneratorProvider::new(move || match data_type {
  870 |                 DataType::Utf8 => utf8_prefix_plus_counter("compressme", false),
  871 |                 DataType::Binary => {
  872 |                     binary_prefix_plus_counter(Arc::from(b"compressme".to_owned()), false)
  873 |                 }
  874 |                 DataType::LargeUtf8 => utf8_prefix_plus_counter("compressme", true),
  875 |                 DataType::LargeBinary => {
  876 |                     binary_prefix_plus_counter(Arc::from(b"compressme".to_owned()), true)
  877 |                 }
  878 |                 _ => panic!("Unsupported data type: {:?}", data_type),
  879 |             }));
  880 | 
  881 |             check_round_trip_encoding_generated(field, datagen, test_cases).await;
  882 |         }
  883 |     }
  884 | }
``````
