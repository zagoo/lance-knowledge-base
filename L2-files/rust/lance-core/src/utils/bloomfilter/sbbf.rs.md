> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/bloomfilter/sbbf.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `faed7b471b762f7bc187fab40aaac41e4b69870cf60cb9bd54afed42e99bb473`. Reviewed physical lines: 1-622.

[Module](../../../../../../L1-modules/rust-lance-core-bloom.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public split-block Bloom-filter implementation, dedicated error/result types and fluent builder. Private256-bit blocks, fixed salts and xxHash64(seed0) define membership and a headerless raw little-endian bitset representation. A bounded-size constructor uses an analytical probability estimate; generic byte conversion is supplied by its sibling trait. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:1-622)

## Complete range analysis

### Lines 1-37

SPDX plus full ASF license notice preserve origin attribution. Module docs describe a local public-API adaptation of Arrow Parquet SBBF, link the upstream spec/implementation and a FIXME issue asking for upstream public visibility. These links are source commentary, not verified external evidence. Imports are sibling AsBytes, libm::lgamma, standard Error/Display/Write and twox_hash::XxHash64. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:1-37)

### Lines 38-75

Public SbbfError derives Debug with InvalidFpp{fpp:f64}, WriteError{source:io::Error}, InvalidData{message:String}. Display includes probability, underlying write error or malformed-data reason respectively. Error::source returns Some only for WriteError. Public Result<T> aliases std::result::Result<T,SbbfError>, distinct from lance_core::Result; no automatic IO From conversion is provided here. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:38-75)

### Lines 76-95

Private SALT has eight exact u32 values in lane order:0x47b6137b,0x44974d91,0x8824ad5b,0xa2b7289d,0x705495c7,0x2df1424b,0x9efc4947,0x5c6bfb31. Private Block([u32;8]) derives Debug/Copy/Clone and represents256 bits/32bytes. Associated ZERO initializes all words0. Changing salt or lane order changes existing filter membership interpretation. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-95)

### Lines 96-108

Block::mask(x) for each of eight lanes multiplies x by its salt with wrapping u32 arithmetic, shifts right27 to obtain bit index0..31, and sets exactly1<<index. It returns one bit per lane in a new fixed array, without heap allocation. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:96-108)

### Lines 109-133

to_le_bytes delegates to native-byte transmute on little-endian targets; other targets swap each u32 before native conversion. to_ne_bytes performs the only unsafe block: value transmute [u32;8] into[u8;32]. Safety comment correctly relies on equal size and no invalid bit patterns in either array; it does not borrow misaligned memory or extend lifetimes. swap_bytes exists only on non-little-endian targets. Local tests do not execute every target architecture. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:109-133)

### Lines 134-169

insert ORs each lane with its mask bit, never clearing bits. check returns false at the first lane lacking its bit, otherwise true after all eight. Private Index/IndexMut implementations delegate to the underlying array and use its bounds checks; loop indices0..8 are valid. Membership requires all eight bits, whereas later intersection tests need only one shared bit. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:134-169)

### Lines 170-192

Private false_positive_probability(ndv,log_space_bytes) implements the locally documented analytical model: bytes=2^log, ndv converted to f64; zero ndv returns0 and density ndv/(bytes*8)>2 returns1 early. Otherwise lambda=256/((bytes*8)/ndv), loglambda=ln(lambda). The u64 shift is used only at internal binary-search midpoints<64; this function does not itself validate arbitrary shift inputs. External paper attribution is not independently checked. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:170-192)

### Lines 193-213

The estimator sums i=749 down through0 (750 terms). logp=i*ln(lambda)-lambda-lgamma(i+1); logfinner=8*ln(1-(31/32)^i); add exp(logp+logfinner), then min(result,1). Descending order aims to add smaller terms first; comment claims750 converges for tests, not a rigorous bound for all inputs. Float rounding/underflow remains part of the implementation. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:193-213)

### Lines 214-233

Size bounds are private log2 byte exponents5 and27 (32B through128MiB). min_log2_bytes binary-searches low0/high64, setting high when estimated probability<=target, otherwise low, and returns high when adjacent. It returns an exponent in1..=64, not yet constrained to allocation bounds. Midpoints never equal64, so estimator shifts stay within u64 width. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:214-233)

### Lines 234-270

Public Sbbf derives Debug/Clone with private Vec<Block>. new(bitset) rejects only lengths not divisible by32 as InvalidData, then parses each32-byte chunk into eight little-endian u32 words and collects owned blocks. It accepts empty input, non-power-of-two block counts and sizes beyond the bounded constructor maximum. Empty filters serialize/intersect but insert/check index block0 and panic (rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-317). SIMD optimization is a doc intent; local source uses scalar loops. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:234-270)

### Lines 271-289

with_log2_num_bytes takes an exponent despite doc wording about number of bytes, clamps it to[5,27], allocates a zero byte vector of1<<clamped exponent, then parses/copies it into block storage through new().unwrap(). The unwrap is guarded by a positive multiple-of32 allocation; peak construction holds both vectors temporarily. with_ndv_fpp accepts range[0,1), including0 and signed negative zero, and rejects1,negative nonzero,NaN/infinity. It estimates an exponent then applies the same clamp, so requested probability is not guaranteed when size saturates. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:271-289)

### Lines 290-319

hash_to_block_index takes high32 bits of hash, saturating-multiplies by number of blocks in u64, then shifts right32 and casts usize. For ordinary positive block counts this maps the upper hash fraction to a block; extremely large counts with saturation bias mapping. insert<T:AsBytes+?Sized> and check hash canonical bytes through hash_as_bytes; insert_hash/check_hash use low32 for the block mask and directly index. Empty raw filters panic. check_hash docs simultaneously allow false positives and claim every uninserted hash returns false; the latter is incorrect for a Bloom filter and contradicted by the bit-test algorithm. Correct guarantee for matching hash/layout is no false negatives for inserted hashes; false means definitely absent. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:290-319)

### Lines 320-338

write_bitset writes every block's32 little-endian bytes via Write::write_all, wrapping the first IO error as WriteError; earlier output may already be written and no rollback or flush occurs. to_bytes allocates a Vec with blocks.len()*32 capacity and appends each block in order. Both emit raw bitset only, without magic, version, hash ID, seed, type tag, probability or count header. Empty raw filters emit zero bytes. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:320-338)

### Lines 339-353

num_blocks returns Vec length. size_bytes is live length*32; estimated_memory_size is capacity*sizeof(Block), accounting allocated block storage only. Despite its total-memory doc, it excludes the Sbbf/Vec header and construction/serialization temporaries. No DeepSizeOf implementation exists here. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:339-353)

### Lines 354-380

might_intersect requires equal block counts, else InvalidData with both sizes. It returns true as soon as any lane word shares any set bit, otherwise false. This is weaker than testing a complete eight-bit element mask and can have many false positives. No-false-negative set-disjointness interpretation requires filters built with matching canonicalization/hash/layout; equal length alone cannot verify provenance. Two empty raw filters return false. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:354-380)

### Lines 381-417

might_intersect_bytes allocates self.to_bytes before calling static bytes_might_intersect. Static method rejects unequal byte lengths, then checks each byte AND for any nonzero bit. It accepts equal empty or non-multiple-of32 slices because it does not validate Bloom structure. False implies no common represented element only under compatible encoding assumptions; arbitrary byte overlap itself is exact. There is no eight-lane check, SIMD intrinsic, async operation or persisted schema validation in these methods. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:381-417)

### Lines 418-426

Private SEED=0 and generic hash_as_bytes feed AsBytes bytes directly to XxHash64::oneshot. There is no type discriminator or normalization stage; signed-zero/NaN behavior and cross-type byte collisions follow the sibling implementations (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-92). Seed/hash algorithm must agree for insertion, query and interpretation of serialized filters. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:418-426)

### Lines 427-461

Public SbbfBuilder owns private optional ndv,fpp,log2_num_bytes fields. new sets all None; consuming expected_items/false_positive_probability/log2_num_bytes setters replace their option without validation. The last method accepts a log2 exponent despite a doc saying bytes directly. No Clone/Debug derive is declared for the builder. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:427-461)

### Lines 462-481

build prioritizes Some(log2_num_bytes) and returns the clamped-size constructor even when ndv/fpp are also supplied or fpp is invalid. Only absent explicit size plus both ndv/fpp invokes probability validation; incomplete input returns InvalidData requiring either size or both values. It does not reject mutually exclusive options, despite the repository rule for new builder design. Default delegates to new, so default.build fails for missing config. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:462-481)

### Lines 482-507

Private tests check exact xxHash64(seed0) empty-string result17241709254077376921, then for1000 low32 integers assert each mask lane is a power of two and inserting/checking that same value into a fresh zero Block succeeds. These do not compare a full upstream golden bitset or test non-little-endian serialization. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-507)

### Lines 508-527

SBBF membership test allocates2^10 bytes and inserts integers0..1000, checking each immediately; it does not recheck all at the end or measure false-positive rate. Builder test with ndv1000/fpp0.01 asserts only nonzero block count, not achieved probability or exact allocation. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:508-527)

### Lines 528-550

String fixture inserts str hello/world and a byte slice bytes, checks all three and rejects one specific not_inserted string. The variables are borrowed strs, not owned String implementations. This one negative check does not prove no false positives generally. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:528-550)

### Lines 551-576

Numeric fixture inserts42i32,12345i64,PI f64 and true, checks each and rejects999i32. It does not exercise unsigned types, false, floating signed zero/NaN or cross-type canonicalization. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:551-576)

### Lines 577-593

Estimator test asserts unbounded min_log2_bytes results: ndv10 at fpp0.1/0.01/0.001 yields3/4/5; ndv100 yields7/8/8; ndv1000 yields10/11/12. The small exponents3/4 are estimator outputs, while public construction clamps them to5. No empirical FPP sampling or boundary-probability test appears. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:577-593)

### Lines 594-622

Serialization test builds ndv100/fpp0.01, inserts0..50, serializes to_bytes, asserts nonempty length==size_bytes, reparses with new, compares block count, rechecks all inserted values and rejects999. It does not test write_bitset failures, malformed/empty raw input, intersections, conflicting builder options, exact bytes or architecture compatibility. Tests were inspected but not executed; module ends. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:594-622)

## Interaction and interpretation limits

All622 lines were read, including scalar loops, endian-dependent unsafe transmute and tests. External Parquet/paper/issue URLs were not fetched; compatibility is the module's stated intent plus the exact local algorithm, not cross-implementation fixture validation. The raw filter has no Lance scalar-index metadata, version or null semantics. No runtime tests/benchmarks were run; false-positive performance, upstream compatibility, current callers and released-format classification remain pending. (rust/lance-core/src/utils/bloomfilter/sbbf.rs:21-36; rust/lance-core/src/utils/bloomfilter/sbbf.rs:76-212; rust/lance-core/src/utils/bloomfilter/sbbf.rs:482-622)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | // Licensed to the Apache Software Foundation (ASF) under one
    5 | // or more contributor license agreements.  See the NOTICE file
    6 | // distributed with this work for additional information
    7 | // regarding copyright ownership.  The ASF licenses this file
    8 | // to you under the Apache License, Version 2.0 (the
    9 | // "License"); you may not use this file except in compliance
   10 | // with the License.  You may obtain a copy of the License at
   11 | //
   12 | //   http://www.apache.org/licenses/LICENSE-2.0
   13 | //
   14 | // Unless required by applicable law or agreed to in writing,
   15 | // software distributed under the License is distributed on an
   16 | // "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
   17 | // KIND, either express or implied.  See the License for the
   18 | // specific language governing permissions and limitations
   19 | // under the License.
   20 | 
   21 | //! Split Block Bloom Filter (SBBF) implementation for Lance
   22 | //!
   23 | //! Based on the Apache Arrow Parquet SBBF implementation but with public APIs
   24 | //! for use in Lance indexing. This implementation follows the Parquet spec
   25 | //! <https://github.com/apache/arrow-rs/blob/main/parquet/src/bloom_filter/mod.rs>
   26 | //! for SBBF as described in <https://github.com/apache/parquet-format/blob/master/BloomFilter.md>
   27 | //! FIXME: Make the upstream SBBF implementation public so that this file could be
   28 | //! removed from Lance.
   29 | //! <https://github.com/apache/arrow-rs/issues/8277>
   30 | 
   31 | use super::as_bytes::AsBytes;
   32 | use libm::lgamma;
   33 | use std::error::Error;
   34 | use std::fmt;
   35 | use std::io::Write;
   36 | use twox_hash::XxHash64;
   37 | 
   38 | #[derive(Debug)]
   39 | pub enum SbbfError {
   40 |     InvalidFpp { fpp: f64 },
   41 |     WriteError { source: std::io::Error },
   42 |     InvalidData { message: String },
   43 | }
   44 | 
   45 | impl fmt::Display for SbbfError {
   46 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   47 |         match self {
   48 |             Self::InvalidFpp { fpp } => {
   49 |                 write!(
   50 |                     f,
   51 |                     "False positive probability must be between 0.0 and 1.0, got {}",
   52 |                     fpp
   53 |                 )
   54 |             }
   55 |             Self::WriteError { source } => {
   56 |                 write!(f, "Failed to write bloom filter: {}", source)
   57 |             }
   58 |             Self::InvalidData { message } => {
   59 |                 write!(f, "Invalid bloom filter data: {}", message)
   60 |             }
   61 |         }
   62 |     }
   63 | }
   64 | 
   65 | impl Error for SbbfError {
   66 |     fn source(&self) -> Option<&(dyn Error + 'static)> {
   67 |         match self {
   68 |             Self::WriteError { source } => Some(source),
   69 |             _ => None,
   70 |         }
   71 |     }
   72 | }
   73 | 
   74 | pub type Result<T> = std::result::Result<T, SbbfError>;
   75 | 
   76 | /// Salt as defined in the Parquet spec
   77 | const SALT: [u32; 8] = [
   78 |     0x47b6137b_u32,
   79 |     0x44974d91_u32,
   80 |     0x8824ad5b_u32,
   81 |     0xa2b7289d_u32,
   82 |     0x705495c7_u32,
   83 |     0x2df1424b_u32,
   84 |     0x9efc4947_u32,
   85 |     0x5c6bfb31_u32,
   86 | ];
   87 | 
   88 | /// Each block is 256 bits, broken up into eight contiguous "words", each consisting of 32 bits.
   89 | /// Each word is thought of as an array of bits; each bit is either "set" or "not set".
   90 | #[derive(Debug, Copy, Clone)]
   91 | struct Block([u32; 8]);
   92 | 
   93 | impl Block {
   94 |     const ZERO: Self = Self([0; 8]);
   95 | 
   96 |     /// Takes as its argument a single unsigned 32-bit integer and returns a block in which each
   97 |     /// word has exactly one bit set.
   98 |     fn mask(x: u32) -> Self {
   99 |         let mut result = [0_u32; 8];
  100 |         for i in 0..8 {
  101 |             // wrapping instead of checking for overflow
  102 |             let y = x.wrapping_mul(SALT[i]);
  103 |             let y = y >> 27;
  104 |             result[i] = 1 << y;
  105 |         }
  106 |         Self(result)
  107 |     }
  108 | 
  109 |     #[inline]
  110 |     #[cfg(target_endian = "little")]
  111 |     fn to_le_bytes(self) -> [u8; 32] {
  112 |         self.to_ne_bytes()
  113 |     }
  114 | 
  115 |     #[inline]
  116 |     #[cfg(not(target_endian = "little"))]
  117 |     fn to_le_bytes(self) -> [u8; 32] {
  118 |         self.swap_bytes().to_ne_bytes()
  119 |     }
  120 | 
  121 |     #[inline]
  122 |     fn to_ne_bytes(self) -> [u8; 32] {
  123 |         // SAFETY: [u32; 8] and [u8; 32] have the same size and neither has invalid bit patterns.
  124 |         unsafe { std::mem::transmute(self.0) }
  125 |     }
  126 | 
  127 |     #[inline]
  128 |     #[cfg(not(target_endian = "little"))]
  129 |     fn swap_bytes(mut self) -> Self {
  130 |         self.0.iter_mut().for_each(|x| *x = x.swap_bytes());
  131 |         self
  132 |     }
  133 | 
  134 |     /// Setting every bit in the block that was also set in the result from mask
  135 |     fn insert(&mut self, hash: u32) {
  136 |         let mask = Self::mask(hash);
  137 |         for i in 0..8 {
  138 |             self[i] |= mask[i];
  139 |         }
  140 |     }
  141 | 
  142 |     /// Returns true when every bit that is set in the result of mask is also set in the block.
  143 |     fn check(&self, hash: u32) -> bool {
  144 |         let mask = Self::mask(hash);
  145 |         for i in 0..8 {
  146 |             if self[i] & mask[i] == 0 {
  147 |                 return false;
  148 |             }
  149 |         }
  150 |         true
  151 |     }
  152 | }
  153 | 
  154 | impl std::ops::Index<usize> for Block {
  155 |     type Output = u32;
  156 | 
  157 |     #[inline]
  158 |     fn index(&self, index: usize) -> &Self::Output {
  159 |         self.0.index(index)
  160 |     }
  161 | }
  162 | 
  163 | impl std::ops::IndexMut<usize> for Block {
  164 |     #[inline]
  165 |     fn index_mut(&mut self, index: usize) -> &mut Self::Output {
  166 |         self.0.index_mut(index)
  167 |     }
  168 | }
  169 | 
  170 | // This implements the false positive probability in Putze et al.'s "Cache-, hash-and
  171 | // space-efficient bloom filters", equation 3.
  172 | #[inline]
  173 | fn false_positive_probability(ndv: u64, log_space_bytes: u8) -> f64 {
  174 |     const WORD_BITS: f64 = 32.0;
  175 |     const BUCKET_WORDS: f64 = 8.0;
  176 |     let bytes = (1u64 << log_space_bytes) as f64;
  177 |     let ndv = ndv as f64;
  178 |     if ndv == 0.0 {
  179 |         return 0.0;
  180 |     }
  181 |     // This short-cuts a slowly-converging sum for very dense filters
  182 |     if ndv / (bytes * u8::BITS as f64) > 2.0 {
  183 |         return 1.0;
  184 |     }
  185 |     let mut result: f64 = 0.0;
  186 |     // lam is the usual parameter to the Poisson's PMF. Following the notation in the paper,
  187 |     // lam is B/c, where B is the number of bits in a bucket and c is the number of bits per
  188 |     // distinct value
  189 |     let lam = BUCKET_WORDS * WORD_BITS / ((bytes * u8::BITS as f64) / ndv);
  190 |     // Some of the calculations are done in log-space to increase numerical stability
  191 |     let loglam = lam.ln();
  192 | 
  193 |     // 750 iterations are sufficient to cause the sum to converge in all of the tests. In
  194 |     // other words, setting the iterations higher than 750 will give the same result as
  195 |     // leaving it at 750.
  196 |     const ITERS: i32 = 750;
  197 |     // We start with the highest value of i, since the values we're adding to result are
  198 |     // mostly smaller at high i, and this increases accuracy to sum from the smallest
  199 |     // values up.
  200 |     for i in (0..ITERS).rev() {
  201 |         // The PMF of the Poisson distribution is lam^i * exp(-lam) / i!. In logspace, using
  202 |         // lgamma for the log of the factorial function:
  203 |         let logp = i as f64 * loglam - lam - lgamma((i + 1).into());
  204 |         // The f_inner part of the equation in the paper is the probability of a single
  205 |         // collision in the bucket. Since there are kBucketWords non-overlapping lanes in each
  206 |         // bucket, the log of this probability is:
  207 |         let logfinner = BUCKET_WORDS * (1.0 - (1.0 - 1.0 / WORD_BITS).powi(i)).ln();
  208 |         // Here we are forced out of log-space calculations
  209 |         result += (logp + logfinner).exp();
  210 |     }
  211 |     result.min(1.0)
  212 | }
  213 | 
  214 | /// Minimum and maximum filter sizes
  215 | const BITSET_LOG2_MIN_BYTES: u8 = 5; // 32B (1 Block)
  216 | const BITSET_LOG2_MAX_BYTES: u8 = 27; // 128MiB
  217 | 
  218 | #[inline]
  219 | fn min_log2_bytes(ndv: u64, fpp: f64) -> u8 {
  220 |     let mut low = 0;
  221 |     let mut high = 64;
  222 |     while high > low + 1 {
  223 |         let mid = (high + low) / 2;
  224 |         let candidate = false_positive_probability(ndv, mid);
  225 |         if candidate <= fpp {
  226 |             high = mid;
  227 |         } else {
  228 |             low = mid;
  229 |         }
  230 |     }
  231 |     high
  232 | }
  233 | 
  234 | /// A Split Block Bloom Filter (SBBF) implementation
  235 | ///
  236 | /// This is a high-performance bloom filter optimized for SIMD operations,
  237 | /// compatible with the Parquet specification.
  238 | #[derive(Debug, Clone)]
  239 | pub struct Sbbf {
  240 |     blocks: Vec<Block>,
  241 | }
  242 | 
  243 | impl Sbbf {
  244 |     /// Create a new SBBF from raw bitset data
  245 |     pub fn new(bitset: &[u8]) -> Result<Self> {
  246 |         if !bitset.len().is_multiple_of(32) {
  247 |             return Err(SbbfError::InvalidData {
  248 |                 message: format!(
  249 |                     "Bitset length must be a multiple of 32, got {}",
  250 |                     bitset.len()
  251 |                 ),
  252 |             });
  253 |         }
  254 | 
  255 |         let data = bitset
  256 |             .as_chunks::<{ 4 * 8 }>()
  257 |             .0
  258 |             .iter()
  259 |             .map(|chunk| {
  260 |                 let mut block = Block::ZERO;
  261 |                 for (i, word) in chunk.as_chunks::<4>().0.iter().enumerate() {
  262 |                     block[i] = u32::from_le_bytes(*word);
  263 |                 }
  264 |                 block
  265 |             })
  266 |             .collect::<Vec<Block>>();
  267 | 
  268 |         Ok(Self { blocks: data })
  269 |     }
  270 | 
  271 |     /// Create a new empty SBBF with the given number of bytes
  272 |     /// The actual size will be adjusted to the next power of two within bounds
  273 |     pub fn with_log2_num_bytes(log2_num_bytes: u8) -> Self {
  274 |         let num_bytes =
  275 |             1_usize << log2_num_bytes.clamp(BITSET_LOG2_MIN_BYTES, BITSET_LOG2_MAX_BYTES);
  276 |         let bitset = vec![0_u8; num_bytes];
  277 |         // unwrap is safe because we know the size is valid
  278 |         Self::new(&bitset).unwrap()
  279 |     }
  280 | 
  281 |     /// Create a new SBBF with given number of distinct values and false positive probability
  282 |     pub fn with_ndv_fpp(ndv: u64, fpp: f64) -> Result<Self> {
  283 |         if !(0.0..1.0).contains(&fpp) {
  284 |             return Err(SbbfError::InvalidFpp { fpp });
  285 |         }
  286 |         let log2_num_bytes = min_log2_bytes(ndv, fpp);
  287 |         Ok(Self::with_log2_num_bytes(log2_num_bytes))
  288 |     }
  289 | 
  290 |     /// Get the hash-to-block-index for a given hash
  291 |     #[inline]
  292 |     fn hash_to_block_index(&self, hash: u64) -> usize {
  293 |         (((hash >> 32).saturating_mul(self.blocks.len() as u64)) >> 32) as usize
  294 |     }
  295 | 
  296 |     /// Insert an AsBytes value into the filter
  297 |     pub fn insert<T: AsBytes + ?Sized>(&mut self, value: &T) {
  298 |         self.insert_hash(hash_as_bytes(value));
  299 |     }
  300 | 
  301 |     /// Insert a hash into the filter
  302 |     pub fn insert_hash(&mut self, hash: u64) {
  303 |         let block_index = self.hash_to_block_index(hash);
  304 |         self.blocks[block_index].insert(hash as u32)
  305 |     }
  306 | 
  307 |     /// Check if an AsBytes value is probably present or definitely absent in the filter
  308 |     pub fn check<T: AsBytes + ?Sized>(&self, value: &T) -> bool {
  309 |         self.check_hash(hash_as_bytes(value))
  310 |     }
  311 | 
  312 |     /// Check if a hash is in the filter. May return
  313 |     /// true for values that were never inserted ("false positive")
  314 |     /// but will always return false if a hash has not been inserted.
  315 |     pub fn check_hash(&self, hash: u64) -> bool {
  316 |         let block_index = self.hash_to_block_index(hash);
  317 |         self.blocks[block_index].check(hash as u32)
  318 |     }
  319 | 
  320 |     /// Write the bitset in serialized form to the writer
  321 |     pub fn write_bitset<W: Write>(&self, mut writer: W) -> Result<()> {
  322 |         for block in &self.blocks {
  323 |             writer
  324 |                 .write_all(block.to_le_bytes().as_slice())
  325 |                 .map_err(|source| SbbfError::WriteError { source })?;
  326 |         }
  327 |         Ok(())
  328 |     }
  329 | 
  330 |     /// Get the raw bitset as bytes
  331 |     pub fn to_bytes(&self) -> Vec<u8> {
  332 |         let mut result = Vec::with_capacity(self.blocks.len() * 32);
  333 |         for block in &self.blocks {
  334 |             result.extend_from_slice(&block.to_le_bytes());
  335 |         }
  336 |         result
  337 |     }
  338 | 
  339 |     /// Get the number of blocks in this filter
  340 |     pub fn num_blocks(&self) -> usize {
  341 |         self.blocks.len()
  342 |     }
  343 | 
  344 |     /// Get the size in bytes of this filter
  345 |     pub fn size_bytes(&self) -> usize {
  346 |         self.blocks.len() * 32
  347 |     }
  348 | 
  349 |     /// Return the total in memory size of this bloom filter in bytes
  350 |     pub fn estimated_memory_size(&self) -> usize {
  351 |         self.blocks.capacity() * std::mem::size_of::<Block>()
  352 |     }
  353 | 
  354 |     /// Check if this filter might intersect with another filter.
  355 |     /// Returns true if there's at least one bit position where both filters have a 1.
  356 |     /// This is a fast check that may return false positives but never false negatives.
  357 |     ///
  358 |     /// Returns an error if the filters have different sizes, as bloom filters with
  359 |     /// different configurations cannot be reliably compared.
  360 |     pub fn might_intersect(&self, other: &Self) -> Result<bool> {
  361 |         if self.blocks.len() != other.blocks.len() {
  362 |             return Err(SbbfError::InvalidData {
  363 |                 message: format!(
  364 |                     "Cannot compare bloom filters with different sizes: {} blocks vs {} blocks. \
  365 |                      Both filters must use the same configuration.",
  366 |                     self.blocks.len(),
  367 |                     other.blocks.len()
  368 |                 ),
  369 |             });
  370 |         }
  371 |         for i in 0..self.blocks.len() {
  372 |             for j in 0..8 {
  373 |                 if (self.blocks[i][j] & other.blocks[i][j]) != 0 {
  374 |                     return Ok(true);
  375 |                 }
  376 |             }
  377 |         }
  378 |         Ok(false)
  379 |     }
  380 | 
  381 |     /// Check if this filter might intersect with a raw bitmap.
  382 |     /// The bitmap should be in the same format as produced by to_bytes().
  383 |     ///
  384 |     /// Returns an error if the bitmaps have different sizes, as bloom filters with
  385 |     /// different configurations cannot be reliably compared.
  386 |     pub fn might_intersect_bytes(&self, other_bytes: &[u8]) -> Result<bool> {
  387 |         Self::bytes_might_intersect(&self.to_bytes(), other_bytes)
  388 |     }
  389 | 
  390 |     /// Check if two raw bloom filter bitmaps might intersect.
  391 |     /// Returns true if there's at least one bit position where both filters have a 1.
  392 |     ///
  393 |     /// This is a fast probabilistic check: if it returns false, the filters definitely
  394 |     /// have no common elements. If it returns true, they might have common elements
  395 |     /// (with possible false positives).
  396 |     ///
  397 |     /// Returns an error if the bitmaps have different sizes, as bloom filters with
  398 |     /// different configurations cannot be reliably compared.
  399 |     pub fn bytes_might_intersect(a: &[u8], b: &[u8]) -> Result<bool> {
  400 |         if a.len() != b.len() {
  401 |             return Err(SbbfError::InvalidData {
  402 |                 message: format!(
  403 |                     "Cannot compare bloom filters with different sizes: {} bytes vs {} bytes. \
  404 |                      Both filters must use the same configuration.",
  405 |                     a.len(),
  406 |                     b.len()
  407 |                 ),
  408 |             });
  409 |         }
  410 |         for i in 0..a.len() {
  411 |             if (a[i] & b[i]) != 0 {
  412 |                 return Ok(true);
  413 |             }
  414 |         }
  415 |         Ok(false)
  416 |     }
  417 | }
  418 | 
  419 | // Per spec we use xxHash with seed=0
  420 | const SEED: u64 = 0;
  421 | 
  422 | #[inline]
  423 | fn hash_as_bytes<A: AsBytes + ?Sized>(value: &A) -> u64 {
  424 |     XxHash64::oneshot(SEED, value.as_bytes().as_ref())
  425 | }
  426 | 
  427 | /// Builder for creating SBBF instances with a fluent API
  428 | pub struct SbbfBuilder {
  429 |     ndv: Option<u64>,
  430 |     fpp: Option<f64>,
  431 |     log2_num_bytes: Option<u8>,
  432 | }
  433 | 
  434 | impl SbbfBuilder {
  435 |     /// Create a new SBBF builder
  436 |     pub fn new() -> Self {
  437 |         Self {
  438 |             ndv: None,
  439 |             fpp: None,
  440 |             log2_num_bytes: None,
  441 |         }
  442 |     }
  443 | 
  444 |     /// Set the expected number of distinct values
  445 |     pub fn expected_items(mut self, ndv: u64) -> Self {
  446 |         self.ndv = Some(ndv);
  447 |         self
  448 |     }
  449 | 
  450 |     /// Set the desired false positive probability
  451 |     pub fn false_positive_probability(mut self, fpp: f64) -> Self {
  452 |         self.fpp = Some(fpp);
  453 |         self
  454 |     }
  455 | 
  456 |     /// Set the number of bytes directly
  457 |     pub fn log2_num_bytes(mut self, log2_num_bytes: u8) -> Self {
  458 |         self.log2_num_bytes = Some(log2_num_bytes);
  459 |         self
  460 |     }
  461 | 
  462 |     /// Build the SBBF
  463 |     pub fn build(self) -> Result<Sbbf> {
  464 |         if let Some(log2_num_bytes) = self.log2_num_bytes {
  465 |             Ok(Sbbf::with_log2_num_bytes(log2_num_bytes))
  466 |         } else if let (Some(ndv), Some(fpp)) = (self.ndv, self.fpp) {
  467 |             Sbbf::with_ndv_fpp(ndv, fpp)
  468 |         } else {
  469 |             Err(SbbfError::InvalidData {
  470 |                 message: "Must specify either log2_num_bytes or both ndv and fpp".to_string(),
  471 |             })
  472 |         }
  473 |     }
  474 | }
  475 | 
  476 | impl Default for SbbfBuilder {
  477 |     fn default() -> Self {
  478 |         Self::new()
  479 |     }
  480 | }
  481 | 
  482 | #[cfg(test)]
  483 | mod tests {
  484 |     use super::*;
  485 | 
  486 |     #[test]
  487 |     fn test_hash_bytes() {
  488 |         assert_eq!(hash_as_bytes(""), 17241709254077376921);
  489 |     }
  490 | 
  491 |     #[test]
  492 |     fn test_mask_set_quick_check() {
  493 |         for i in 0..1_000 {
  494 |             let result = Block::mask(i);
  495 |             assert!(result.0.iter().all(|&x| x.is_power_of_two()));
  496 |         }
  497 |     }
  498 | 
  499 |     #[test]
  500 |     fn test_block_insert_and_check() {
  501 |         for i in 0..1_000 {
  502 |             let mut block = Block::ZERO;
  503 |             block.insert(i);
  504 |             assert!(block.check(i));
  505 |         }
  506 |     }
  507 | 
  508 |     #[test]
  509 |     fn test_sbbf_insert_and_check() {
  510 |         let mut sbbf = Sbbf::with_log2_num_bytes(10);
  511 |         for i in 0..1_000 {
  512 |             sbbf.insert(&i);
  513 |             assert!(sbbf.check(&i));
  514 |         }
  515 |     }
  516 | 
  517 |     #[test]
  518 |     fn test_sbbf_builder() {
  519 |         let sbbf = SbbfBuilder::new()
  520 |             .expected_items(1000)
  521 |             .false_positive_probability(0.01)
  522 |             .build()
  523 |             .unwrap();
  524 | 
  525 |         assert!(sbbf.num_blocks() > 0);
  526 |     }
  527 | 
  528 |     #[test]
  529 |     fn test_sbbf_string_types() {
  530 |         let mut sbbf = SbbfBuilder::new()
  531 |             .expected_items(100)
  532 |             .false_positive_probability(0.01)
  533 |             .build()
  534 |             .unwrap();
  535 | 
  536 |         // Test different string types
  537 |         let string_val = "hello";
  538 |         let str_val = "world";
  539 |         let bytes_val = b"bytes";
  540 | 
  541 |         sbbf.insert(string_val);
  542 |         sbbf.insert(str_val);
  543 |         sbbf.insert(&bytes_val[..]);
  544 | 
  545 |         assert!(sbbf.check(string_val));
  546 |         assert!(sbbf.check(str_val));
  547 |         assert!(sbbf.check(&bytes_val[..]));
  548 |         assert!(!sbbf.check("not_inserted"));
  549 |     }
  550 | 
  551 |     #[test]
  552 |     fn test_sbbf_numeric_types() {
  553 |         let mut sbbf = SbbfBuilder::new()
  554 |             .expected_items(100)
  555 |             .false_positive_probability(0.01)
  556 |             .build()
  557 |             .unwrap();
  558 | 
  559 |         // Test different numeric types
  560 |         let i32_val = 42i32;
  561 |         let i64_val = 12345i64;
  562 |         let f64_val = std::f64::consts::PI;
  563 |         let bool_val = true;
  564 | 
  565 |         sbbf.insert(&i32_val);
  566 |         sbbf.insert(&i64_val);
  567 |         sbbf.insert(&f64_val);
  568 |         sbbf.insert(&bool_val);
  569 | 
  570 |         assert!(sbbf.check(&i32_val));
  571 |         assert!(sbbf.check(&i64_val));
  572 |         assert!(sbbf.check(&f64_val));
  573 |         assert!(sbbf.check(&bool_val));
  574 |         assert!(!sbbf.check(&999i32));
  575 |     }
  576 | 
  577 |     #[test]
  578 |     fn test_num_of_bits_from_ndv_fpp() {
  579 |         for (fpp, ndv, log2_num_bytes) in &[
  580 |             (0.1, 10, 3),
  581 |             (0.01, 10, 4),
  582 |             (0.001, 10, 5),
  583 |             (0.1, 100, 7),
  584 |             (0.01, 100, 8),
  585 |             (0.001, 100, 8),
  586 |             (0.1, 1000, 10),
  587 |             (0.01, 1000, 11),
  588 |             (0.001, 1000, 12),
  589 |         ] {
  590 |             assert_eq!(*log2_num_bytes, min_log2_bytes(*ndv, *fpp));
  591 |         }
  592 |     }
  593 | 
  594 |     #[test]
  595 |     fn test_serialization() {
  596 |         let mut sbbf = SbbfBuilder::new()
  597 |             .expected_items(100)
  598 |             .false_positive_probability(0.01)
  599 |             .build()
  600 |             .unwrap();
  601 | 
  602 |         // Insert some values
  603 |         for i in 0..50 {
  604 |             sbbf.insert(&i);
  605 |         }
  606 | 
  607 |         // Serialize to bytes
  608 |         let bytes = sbbf.to_bytes();
  609 |         assert!(!bytes.is_empty());
  610 |         assert_eq!(bytes.len(), sbbf.size_bytes());
  611 | 
  612 |         // Deserialize from bytes
  613 |         let sbbf2 = Sbbf::new(&bytes).unwrap();
  614 |         assert_eq!(sbbf.num_blocks(), sbbf2.num_blocks());
  615 | 
  616 |         // Check that deserialized filter works
  617 |         for i in 0..50 {
  618 |             assert!(sbbf2.check(&i));
  619 |         }
  620 |         assert!(!sbbf2.check(&999));
  621 |     }
  622 | }
``````
