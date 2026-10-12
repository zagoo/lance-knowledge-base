> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/statistics.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `60c2b4d4d34c0ff821c1b4fc3c2f01efc8d42852a8aaad6b362f6f8cf52db32c`. Reviewed physical lines: 1-1269.

[Module](../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

DataBlock statistic keys, eager/lazy computation, shared cached Arrow arrays, approximate cardinality, bit/run/entropy estimators and ten local tests. (rust/lance-encoding/src/statistics.rs:1-1269)

## Complete range analysis

### Lines 1-18

SPDX and imports: Arc,fmt,RandomState/Hash,Arrow arrays/primitive bounds,HyperLogLogPlus,PrimInt and every relevant DataBlock variant. Statistics describe physical representations; no async, IO or local unsafe. Dependencies supply typed-buffer borrowing and HLL internals, not reimplemented here. (rust/lance-encoding/src/statistics.rs:1-18)

### Lines 19-51

Public Clone Copy PartialEq Eq Hash Stat variants BitWidth,DataSize,Cardinality,FixedSize,NullCount,MaxLength,RunCount,BytePositionEntropy; manual Debug spells variant name and Display delegates Debug. FixedSize has no computation here; NullCount only supplied by AllNull here. Most values use UInt64Array, with lengths depending on statistic. (rust/lance-encoding/src/statistics.rs:19-51)

### Lines 52-72

Public ComputeStat declares compute_stat(&mut self) without Result. DataBlock dispatch no-ops Empty,Constant,AllNull,Dictionary; Nullable computes underlying data only; FixedWidth,VariableWidth,FixedSizeList,Opaque,Struct delegate. Panics/poisoned locks are not converted into recoverable errors. (rust/lance-encoding/src/statistics.rs:52-72)

### Lines 73-88

VariableWidth compute requires shared statistic map empty or panics, computes physical data_size and max_length, then inserts DataSize/MaxLength under write lock. No cardinality yet. Empty check and insertion are separate lock acquisitions; once-only condition is not atomic across shared BlockInfo clones. (rust/lance-encoding/src/statistics.rs:73-88)

### Lines 89-116

FixedWidth compute eagerly calculates physical DataSize, chunked BitWidth, MaxLength=floor(bits/8), RunCount and BytePositionEntropy before one write lock inserts all five. No once-only guard and no clearing other entries, including cached Cardinality. Recomputing after data changes can retain stale cardinality, especially with shared BlockInfo. (rust/lance-encoding/src/data.rs:63-85) (rust/lance-encoding/src/statistics.rs:89-116)

### Lines 117-139

FixedSizeList compute delegates child unchanged; comment suggests future list-splitting optimization but no special list algorithm exists. Opaque computes/inserts DataSize only. Repeated fixed-list compute over already-computed variable child can encounter variable once-only panic. (rust/lance-encoding/src/statistics.rs:117-139)

### Lines 140-160

Public GetStat:fmt::Debug exposes optional Arc<dyn Array>, expect_stat panics missing key with self/stat, and generic expect_single_stat<T> downcasts primitive array, panics if len!=1 and returns value0. Wrong type panics via Arrow accessor; scalar helper does not inspect validity of the array element. (rust/lance-encoding/src/statistics.rs:140-160)

### Lines 161-186

DataBlock get_stat returns None for Empty/Constant and delegates every other variant. Nullable simply forwards to underlying data; its null bitmap and own BlockInfo do not participate. Comment about deprecation in2.1 is design guidance, not an attribute. NULL semantics are therefore not generally represented in these statistics. (rust/lance-encoding/src/statistics.rs:161-186)

### Lines 187-216

Variable getter panics if whole map empty, even for an unsupported requested stat. Existing entry clones Arc; absent non-Cardinality returnsNone. Missing Cardinality computes outside lock, then takes write lock, rechecks map nonempty and entry-or-inserts. Concurrent callers may duplicate a full scan; first cached value wins. (rust/lance-encoding/src/statistics.rs:187-216)

### Lines 217-231

FixedSizeList getter asks child for same stat. MaxLength maps returned UInt64 value0 multiplied by dimension, unchecked; every other stat forwards unchanged. Cardinality/run/bit statistics describe child elements, not distinct lists; no dimension scaling except MaxLength. (rust/lance-encoding/src/statistics.rs:217-231)

### Lines 232-259

Variable compute_cardinality creates HyperLogLogPlus<&[u8],Xxh3Builder> with precision4 and unwraps constructor. Comment motivates xxhash versus SipHash1-3 based on estimates, not a measured guarantee in this task.32-bit path hashes every adjacent unsigned offset window payload, including empty strings; no logical-count/null filtering. (rust/lance-encoding/src/statistics.rs:232-259)

### Lines 260-281

64-bit cardinality path mirrors with offsets cast to usize. Unsupported width unreachable panic. Return hll.count() as u64 in one UInt64Array; approximate floating estimate is truncated by cast. Descending/out-of-bounds offsets can panic; offset windows drive count independently of num_values. (rust/lance-encoding/src/statistics.rs:260-281)

### Lines 282-310

Variable max_length scans differences of every adjacent unsigned32/64 offset pair and returns maximum or0 for fewer than two offsets. Unsupported width unreachable. Does not validate monotonicity, payload bounds or logical count; descending subtraction can panic/wrap depending checks. Length is encoded bytes, not Unicode character count. (rust/lance-encoding/src/statistics.rs:282-310)

### Lines 311-323

AllNull get_stat dynamically creates scalar NullCount=num_values or DataSize=0, otherwiseNone; no initialized map required. MaxLength and Cardinality are not supplied. (rust/lance-encoding/src/statistics.rs:311-323)

### Lines 324-352

Fixed getter also panics empty map, returns cached Arc first, and lazily computes only missing Cardinality for widths64or128. Other absent stats returnNone. Compute outside lock, then entry-or-insert; unlike Variable no second empty-map check. Cache can be shared across cloned blocks. (rust/lance-encoding/src/data.rs:63-85) (rust/lance-encoding/src/statistics.rs:324-352)

### Lines 353-370

Fixed max_bit_widths returns[0] immediately when num_values0. Otherwise local CHUNK_SIZE=1024 and nested calculate_max_bit_width<T:PrimInt> process all physical typed values in chunks, OR each chunk then compute width-leading_zeros. It does not restrict scans to num_values or validate length consistency. (rust/lance-encoding/src/statistics.rs:353-370)

### Lines 371-407

Bit width dispatch interprets physical bytes as unsigned8/16/32/64 words; other widths return one configured-width entry (including1/128). Signed negatives contribute full native bit patterns, as do raw float bits. Nonzero count with empty physical data yields empty result for native widths; zero count ignores physical bytes. No feature gate. (rust/lance-encoding/src/statistics.rs:371-407)

### Lines 408-440

Fixed cardinality supports64-bit raw u64 values with Xxh3Builder and128-bit raw u128 with fresh RandomState, both HLL precision4. Every physical typed value is hashed irrespective of logical count; random seed can change128-bit estimates between uncached computations. Wrong width unreachable. Output scalar cast estimate; no exactness/error bound promised. (rust/lance-encoding/src/statistics.rs:408-440)

### Lines 441-477

Run-count comments describe adjacent equal values. Actual run_count returns[0] for declared count0; nested generic count_runs returns0 for empty physical slice, otherwise1+adjacent transitions. Dispatch begins unsigned8/16/32, so equality is physical bit equality, not original floating/null semantics. (rust/lance-encoding/src/statistics.rs:441-477)

### Lines 478-503

Run-count dispatch includes64/128-bit unsigned physical words; unsupported widths return declared num_values as pessimistic no-runs estimate. Supported widths scan whole buffer independently of positive logical count. Signed-zero/NaN comparisons follow raw words if floating payloads are represented at these widths. (rust/lance-encoding/src/statistics.rs:478-503)

### Lines 504-530

Byte-position entropy samples first min(num_values-as-usize,64) declared values using local SAMPLE_SIZE=64. Zero sample gives empty UInt64Array. For each floor(bits/8) byte position, count occurrences in256 u32 counters; missing physical positions are skipped rather than errors. One-bit boolean width has zero byte positions. (rust/lance-encoding/src/statistics.rs:504-530)

### Lines 531-551

For each byte position compute Shannon -sum(p*log2(p)), dividing each count by declared sample count even if bytes were missing; multiply1000 and castu64. All positions share first64-row sample, not random/full scan. Malformed short data yields unnormalized frequencies; widths and allocation/cast arithmetic remain trusted. (rust/lance-encoding/src/statistics.rs:531-551)

### Lines 552-578

Opaque and Struct get_stat require nonempty map then clone requested entry orNone. Dictionary returnsNone for every key regardless of contents. No fallback computes struct or opaque cardinality. (rust/lance-encoding/src/statistics.rs:552-578)

### Lines 579-596

Struct compute takes data_size and sums each child expect_single_stat<UInt64Type>(MaxLength), then inserts DataSize/MaxLength. Does not compute children first; missing/wrong child stats panic. Sum unchecked, empty children produce zero stats. AllNull/Dictionary/Empty/Constant child MaxLength unavailable through dispatch. (rust/lance-encoding/src/statistics.rs:579-596)

### Lines 597-619

Private cfg(test) module imports arrays, builders, ArrowData, seeded Xoshiro DEFAULT_SEED and random generation. Tests are source evidence only; no local entropy tests. Normal from_arrays computes stats before wrapping nullable values. (rust/lance-encoding/src/data.rs:2020-2030) (rust/lance-encoding/src/statistics.rs:597-619)

### Lines 620-706

Data-size test compares three Int32 batches and seeded random Binary against Arrow own data-buffer sums (Binary includes offsets and payload), Struct against child own-buffer sums, Dictionary againstNone, and nullable Int32 against values buffers excluding null bitmap. Confirms payload accounting rather than total in-memory allocation. (rust/lance-encoding/src/statistics.rs:620-706)

### Lines 707-770

Integer bit-width test starts Int8 cases [1,2,3]->2, max positive->7, lower masks->5 and negative->8, then begins Int16 cases. All use DataBlock::from_array to initialize stats and assert UInt64Array equality, without runtime evidence here. (rust/lance-encoding/src/statistics.rs:707-770)

### Lines 771-850

Continues Int16 positive/boundary/negative cases and Int32 positive/boundary/negative cases. The helper operates on unsigned representation, so any negative signed input yields full width. Source appendix preserves every literal input and expected number. (rust/lance-encoding/src/statistics.rs:771-850)

### Lines 851-930

Completes signed32/64 fixtures and starts unsigned8/16 cases. Repeated explicit fixtures test single chunks of small arrays, signed extremes and widening boundaries; no parameterized harness used locally. (rust/lance-encoding/src/statistics.rs:851-930)

### Lines 931-1030

Completes unsigned16/32/64 fixtures including u64::MAX. All explicit integer tests compare whole BitWidth arrays. No direct zero-count, empty typed buffer, width1/128 fallback or mismatched declared-count test here. (rust/lance-encoding/src/statistics.rs:931-1030)

### Lines 1031-1060

Multi-chunk bit-width test concatenates1024 values3,1024 values8 and10 values-1 separately for signed8/16/32/64; expect[2,4,native width]. Covers1024 chunk boundaries and short tail using true physical lengths. (rust/lance-encoding/src/statistics.rs:1031-1060)

### Lines 1061-1070

Random Binary three-value test confirms unsupported BitWidth returnsNone after ordinary construction; it does not test an uninitialized statistics map (which panics). (rust/lance-encoding/src/statistics.rs:1061-1070)

### Lines 1071-1125

Variable cardinality tests String and LargeString fixtures: two unique hello/world, three unique sentences and repeated Samuel/Saunders/Samuel produce2,3,2 respectively. Small exact expected estimates do not establish general HLL exactness. All values present, no null/empty malformed-buffer coverage. (rust/lance-encoding/src/statistics.rs:1071-1125)

### Lines 1126-1171

Variable MaxLength tests String/LargeString hello/world, sentence lengths and String Samuel/Saunders/Samuel. All ASCII and present. Assertions use byte string len, not character counts; no direct zero-window/descending/sliced offset case. (rust/lance-encoding/src/statistics.rs:1126-1171)

### Lines 1172-1215

RunCount test covers Int32 consecutive triples->3, five unique->5, mixed nine->5, five repeated42->1, UInt8 three pairs->3 and Int64 five values->3. Comment single value means one distinct value across five rows. No zero rows, boolean,128-bit, nonconsecutive equal raw floats or count mismatch. (rust/lance-encoding/src/statistics.rs:1172-1215)

### Lines 1216-1230

Fixed lazy-cardinality test builds seven Int64[1,2,3,1,2,3,1], checks DataSize/BitWidth cached and Cardinality absent. Does not call cardinality getter. (rust/lance-encoding/src/statistics.rs:1216-1230)

### Lines 1231-1246

Fixed on-demand test uses same Int64 fixture, invokes getter expecting scalar3 then asserts Cardinality now present. No repeat-get Arc identity or concurrent cache initialization check. (rust/lance-encoding/src/statistics.rs:1231-1246)

### Lines 1247-1269

Variable lazy test String[a,b,a] checks DataSize/MaxLength present/Cardinality absent, calls getter for2, then checks cached. Ten test functions total; no direct BytePositionEntropy,128-bit HLL, poisoned locks, recomputation/stale-cache, invalid scalar-stat or NULL filtering regression tests. (rust/lance-encoding/src/statistics.rs:1247-1269)

## Interaction and interpretation limits

Every physical source line read during ANALYZE76 in bounded untruncated primary reads. No repository build, test, lint, benchmark, generator or installation executed. Failure-path observations are source deductions, not reproductions; contextual files remain pending unless previously analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{
    5 |     fmt::{self},
    6 |     hash::{Hash, RandomState},
    7 |     sync::Arc,
    8 | };
    9 | 
   10 | use arrow_array::{Array, ArrowPrimitiveType, UInt64Array, cast::AsArray, types::UInt64Type};
   11 | use hyperloglogplus::{HyperLogLog, HyperLogLogPlus};
   12 | use num_traits::PrimInt;
   13 | 
   14 | use crate::data::{
   15 |     AllNullDataBlock, DataBlock, DictionaryDataBlock, FixedSizeListBlock, FixedWidthDataBlock,
   16 |     NullableDataBlock, OpaqueBlock, StructDataBlock, VariableWidthBlock,
   17 | };
   18 | 
   19 | #[derive(Clone, Copy, PartialEq, Eq, Hash)]
   20 | pub enum Stat {
   21 |     BitWidth,
   22 |     DataSize,
   23 |     Cardinality,
   24 |     FixedSize,
   25 |     NullCount,
   26 |     MaxLength,
   27 |     RunCount,
   28 |     BytePositionEntropy,
   29 | }
   30 | 
   31 | impl fmt::Debug for Stat {
   32 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   33 |         match self {
   34 |             Self::BitWidth => write!(f, "BitWidth"),
   35 |             Self::DataSize => write!(f, "DataSize"),
   36 |             Self::Cardinality => write!(f, "Cardinality"),
   37 |             Self::FixedSize => write!(f, "FixedSize"),
   38 |             Self::NullCount => write!(f, "NullCount"),
   39 |             Self::MaxLength => write!(f, "MaxLength"),
   40 |             Self::RunCount => write!(f, "RunCount"),
   41 |             Self::BytePositionEntropy => write!(f, "BytePositionEntropy"),
   42 |         }
   43 |     }
   44 | }
   45 | 
   46 | impl fmt::Display for Stat {
   47 |     fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
   48 |         write!(f, "{:?}", self)
   49 |     }
   50 | }
   51 | 
   52 | pub trait ComputeStat {
   53 |     fn compute_stat(&mut self);
   54 | }
   55 | 
   56 | impl ComputeStat for DataBlock {
   57 |     fn compute_stat(&mut self) {
   58 |         match self {
   59 |             Self::Empty() => {}
   60 |             Self::Constant(_) => {}
   61 |             Self::AllNull(_) => {}
   62 |             Self::Nullable(data_block) => data_block.data.compute_stat(),
   63 |             Self::FixedWidth(data_block) => data_block.compute_stat(),
   64 |             Self::FixedSizeList(data_block) => data_block.compute_stat(),
   65 |             Self::VariableWidth(data_block) => data_block.compute_stat(),
   66 |             Self::Opaque(data_block) => data_block.compute_stat(),
   67 |             Self::Struct(data_block) => data_block.compute_stat(),
   68 |             Self::Dictionary(_) => {}
   69 |         }
   70 |     }
   71 | }
   72 | 
   73 | impl ComputeStat for VariableWidthBlock {
   74 |     fn compute_stat(&mut self) {
   75 |         if !self.block_info.0.read().unwrap().is_empty() {
   76 |             panic!("compute_stat should only be called once during DataBlock construction");
   77 |         }
   78 |         let data_size = self.data_size();
   79 |         let data_size_array = Arc::new(UInt64Array::from(vec![data_size]));
   80 | 
   81 |         let max_length_array = self.max_length();
   82 | 
   83 |         let mut info = self.block_info.0.write().unwrap();
   84 |         info.insert(Stat::DataSize, data_size_array);
   85 |         info.insert(Stat::MaxLength, max_length_array);
   86 |     }
   87 | }
   88 | 
   89 | impl ComputeStat for FixedWidthDataBlock {
   90 |     fn compute_stat(&mut self) {
   91 |         // compute this datablock's data_size
   92 |         let data_size = self.data_size();
   93 |         let data_size_array = Arc::new(UInt64Array::from(vec![data_size]));
   94 | 
   95 |         // compute this datablock's max_bit_width
   96 |         let max_bit_widths = self.max_bit_widths();
   97 | 
   98 |         // the MaxLength of FixedWidthDataBlock is it's self.bits_per_value / 8
   99 |         let max_len = self.bits_per_value / 8;
  100 |         let max_len_array = Arc::new(UInt64Array::from(vec![max_len]));
  101 | 
  102 |         // compute run count
  103 |         let run_count_array = self.run_count();
  104 | 
  105 |         // compute byte position entropy
  106 |         let byte_position_entropy = self.byte_position_entropy();
  107 | 
  108 |         let mut info = self.block_info.0.write().unwrap();
  109 |         info.insert(Stat::DataSize, data_size_array);
  110 |         info.insert(Stat::BitWidth, max_bit_widths);
  111 |         info.insert(Stat::MaxLength, max_len_array);
  112 |         info.insert(Stat::RunCount, run_count_array);
  113 |         info.insert(Stat::BytePositionEntropy, byte_position_entropy);
  114 |     }
  115 | }
  116 | 
  117 | impl ComputeStat for FixedSizeListBlock {
  118 |     fn compute_stat(&mut self) {
  119 |         // We leave the child stats unchanged.  This may seem odd (e.g. should bit width be the
  120 |         // bit width of the child * dimension?) but it's because we use these stats to determine
  121 |         // compression and we are currently just compressing the child data.
  122 |         //
  123 |         // There is a potential opportunity here to do better.  For example, if we have a FSL of
  124 |         // 4 32-bit integers then we should probably treat them as a single 128-bit integer or maybe
  125 |         // even 4 columns of 32-bit integers.  This might yield better compression.
  126 |         self.child.compute_stat();
  127 |     }
  128 | }
  129 | 
  130 | impl ComputeStat for OpaqueBlock {
  131 |     fn compute_stat(&mut self) {
  132 |         // compute this datablock's data_size
  133 |         let data_size = self.data_size();
  134 |         let data_size_array = Arc::new(UInt64Array::from(vec![data_size]));
  135 |         let mut info = self.block_info.0.write().unwrap();
  136 |         info.insert(Stat::DataSize, data_size_array);
  137 |     }
  138 | }
  139 | 
  140 | pub trait GetStat: fmt::Debug {
  141 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>>;
  142 | 
  143 |     fn expect_stat(&self, stat: Stat) -> Arc<dyn Array> {
  144 |         self.get_stat(stat)
  145 |             .unwrap_or_else(|| panic!("{:?} DataBlock does not have `{}` statistics.", self, stat))
  146 |     }
  147 | 
  148 |     fn expect_single_stat<T: ArrowPrimitiveType>(&self, stat: Stat) -> T::Native {
  149 |         let stat_value = self.expect_stat(stat);
  150 |         let stat_value = stat_value.as_primitive::<T>();
  151 |         if stat_value.len() != 1 {
  152 |             panic!(
  153 |                 "{:?} DataBlock does not have exactly one value for `{} statistics.",
  154 |                 self, stat
  155 |             );
  156 |         }
  157 |         stat_value.value(0)
  158 |     }
  159 | }
  160 | 
  161 | impl GetStat for DataBlock {
  162 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  163 |         match self {
  164 |             Self::Empty() => None,
  165 |             Self::Constant(_) => None,
  166 |             Self::AllNull(data_block) => data_block.get_stat(stat),
  167 |             Self::Nullable(data_block) => data_block.get_stat(stat),
  168 |             Self::FixedWidth(data_block) => data_block.get_stat(stat),
  169 |             Self::FixedSizeList(data_block) => data_block.get_stat(stat),
  170 |             Self::VariableWidth(data_block) => data_block.get_stat(stat),
  171 |             Self::Opaque(data_block) => data_block.get_stat(stat),
  172 |             Self::Struct(data_block) => data_block.get_stat(stat),
  173 |             Self::Dictionary(data_block) => data_block.get_stat(stat),
  174 |         }
  175 |     }
  176 | }
  177 | 
  178 | // NullableDataBlock will be deprecated in Lance 2.1.
  179 | impl GetStat for NullableDataBlock {
  180 |     // This function simply returns the statistics of the inner `DataBlock` of `NullableDataBlock`,
  181 |     // this is not accurate but `NullableDataBlock` is going to be deprecated in Lance 2.1 anyway.
  182 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  183 |         self.data.get_stat(stat)
  184 |     }
  185 | }
  186 | 
  187 | impl GetStat for VariableWidthBlock {
  188 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  189 |         {
  190 |             let block_info = self.block_info.0.read().unwrap();
  191 |             if block_info.is_empty() {
  192 |                 panic!("get_stat should be called after statistics are computed.");
  193 |             }
  194 |             if let Some(stat_value) = block_info.get(&stat) {
  195 |                 return Some(stat_value.clone());
  196 |             }
  197 |         }
  198 | 
  199 |         if stat != Stat::Cardinality {
  200 |             return None;
  201 |         }
  202 | 
  203 |         let computed = self.compute_cardinality();
  204 |         let mut block_info = self.block_info.0.write().unwrap();
  205 |         if block_info.is_empty() {
  206 |             panic!("get_stat should be called after statistics are computed.");
  207 |         }
  208 |         Some(
  209 |             block_info
  210 |                 .entry(stat)
  211 |                 .or_insert_with(|| computed.clone())
  212 |                 .clone(),
  213 |         )
  214 |     }
  215 | }
  216 | 
  217 | impl GetStat for FixedSizeListBlock {
  218 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  219 |         let child_stat = self.child.get_stat(stat);
  220 |         match stat {
  221 |             Stat::MaxLength => child_stat.map(|max_length| {
  222 |                 // this is conservative when working with variable length data as we shouldn't assume
  223 |                 // that we have a list of all max-length elements but it's cheap and easy to calculate
  224 |                 let max_length = max_length.as_primitive::<UInt64Type>().value(0);
  225 |                 Arc::new(UInt64Array::from(vec![max_length * self.dimension])) as Arc<dyn Array>
  226 |             }),
  227 |             _ => child_stat,
  228 |         }
  229 |     }
  230 | }
  231 | 
  232 | impl VariableWidthBlock {
  233 |     // Caveat: the computation here assumes VariableWidthBlock.offsets maps directly to VariableWidthBlock.data
  234 |     // without any adjustment(for example, no null_adjustment for offsets)
  235 |     fn compute_cardinality(&self) -> Arc<dyn Array> {
  236 |         const PRECISION: u8 = 4;
  237 |         // The default hasher (currently sip hash 1-3) does not seem to give good results
  238 |         // with HLL.
  239 |         //
  240 |         // In particular, when using randomly generated 12-byte strings, the HLL count was
  241 |         // suggested a cardinality of 500 (out of 1000 unique items and hashes) at least 10%
  242 |         // of the time.
  243 |         //
  244 |         // Using xxhash3 consistently gives better results.
  245 |         let mut hll: HyperLogLogPlus<&[u8], xxhash_rust::xxh3::Xxh3Builder> =
  246 |             HyperLogLogPlus::new(PRECISION, xxhash_rust::xxh3::Xxh3Builder::default()).unwrap();
  247 | 
  248 |         match self.bits_per_offset {
  249 |             32 => {
  250 |                 let offsets_ref = self.offsets.borrow_to_typed_slice::<u32>();
  251 |                 let offsets: &[u32] = offsets_ref.as_ref();
  252 | 
  253 |                 offsets
  254 |                     .iter()
  255 |                     .zip(offsets.iter().skip(1))
  256 |                     .for_each(|(&start, &end)| {
  257 |                         hll.insert(&self.data[start as usize..end as usize]);
  258 |                     });
  259 |                 let cardinality = hll.count() as u64;
  260 |                 Arc::new(UInt64Array::from(vec![cardinality]))
  261 |             }
  262 |             64 => {
  263 |                 let offsets_ref = self.offsets.borrow_to_typed_slice::<u64>();
  264 |                 let offsets: &[u64] = offsets_ref.as_ref();
  265 | 
  266 |                 offsets
  267 |                     .iter()
  268 |                     .zip(offsets.iter().skip(1))
  269 |                     .for_each(|(&start, &end)| {
  270 |                         hll.insert(&self.data[start as usize..end as usize]);
  271 |                     });
  272 | 
  273 |                 let cardinality = hll.count() as u64;
  274 |                 Arc::new(UInt64Array::from(vec![cardinality]))
  275 |             }
  276 |             _ => {
  277 |                 unreachable!("the bits_per_offset of VariableWidthBlock can only be 32 or 64")
  278 |             }
  279 |         }
  280 |     }
  281 | 
  282 |     fn max_length(&mut self) -> Arc<dyn Array> {
  283 |         match self.bits_per_offset {
  284 |             32 => {
  285 |                 let offsets = self.offsets.borrow_to_typed_slice::<u32>();
  286 |                 let offsets = offsets.as_ref();
  287 |                 let max_len = offsets
  288 |                     .windows(2)
  289 |                     .map(|pair| pair[1] - pair[0])
  290 |                     .max()
  291 |                     .unwrap_or(0);
  292 |                 Arc::new(UInt64Array::from(vec![max_len as u64]))
  293 |             }
  294 |             64 => {
  295 |                 let offsets = self.offsets.borrow_to_typed_slice::<u64>();
  296 |                 let offsets = offsets.as_ref();
  297 |                 let max_len = offsets
  298 |                     .windows(2)
  299 |                     .map(|pair| pair[1] - pair[0])
  300 |                     .max()
  301 |                     .unwrap_or(0);
  302 |                 Arc::new(UInt64Array::from(vec![max_len]))
  303 |             }
  304 |             _ => {
  305 |                 unreachable!("the type of offsets in VariableWidth can only be u32 or u64");
  306 |             }
  307 |         }
  308 |     }
  309 | }
  310 | 
  311 | impl GetStat for AllNullDataBlock {
  312 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  313 |         match stat {
  314 |             Stat::NullCount => {
  315 |                 let null_count = self.num_values;
  316 |                 Some(Arc::new(UInt64Array::from(vec![null_count])))
  317 |             }
  318 |             Stat::DataSize => Some(Arc::new(UInt64Array::from(vec![0]))),
  319 |             _ => None,
  320 |         }
  321 |     }
  322 | }
  323 | 
  324 | impl GetStat for FixedWidthDataBlock {
  325 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  326 |         {
  327 |             let block_info = self.block_info.0.read().unwrap();
  328 | 
  329 |             if block_info.is_empty() {
  330 |                 panic!("get_stat should be called after statistics are computed.");
  331 |             }
  332 | 
  333 |             if let Some(stat_value) = block_info.get(&stat) {
  334 |                 return Some(stat_value.clone());
  335 |             }
  336 |         }
  337 | 
  338 |         if stat == Stat::Cardinality && (self.bits_per_value == 64 || self.bits_per_value == 128) {
  339 |             let computed = self.cardinality();
  340 |             let mut block_info = self.block_info.0.write().unwrap();
  341 |             Some(
  342 |                 block_info
  343 |                     .entry(stat)
  344 |                     .or_insert_with(|| computed.clone())
  345 |                     .clone(),
  346 |             )
  347 |         } else {
  348 |             None
  349 |         }
  350 |     }
  351 | }
  352 | 
  353 | impl FixedWidthDataBlock {
  354 |     fn max_bit_widths(&mut self) -> Arc<dyn Array> {
  355 |         if self.num_values == 0 {
  356 |             return Arc::new(UInt64Array::from(vec![0u64]));
  357 |         }
  358 | 
  359 |         const CHUNK_SIZE: usize = 1024;
  360 | 
  361 |         fn calculate_max_bit_width<T: PrimInt>(slice: &[T], bits_per_value: u64) -> Vec<u64> {
  362 |             slice
  363 |                 .chunks(CHUNK_SIZE)
  364 |                 .map(|chunk| {
  365 |                     let max_value = chunk.iter().fold(T::zero(), |acc, &x| acc | x);
  366 |                     bits_per_value - max_value.leading_zeros() as u64
  367 |                 })
  368 |                 .collect()
  369 |         }
  370 | 
  371 |         match self.bits_per_value {
  372 |             8 => {
  373 |                 let u8_slice = self.data.borrow_to_typed_slice::<u8>();
  374 |                 let u8_slice = u8_slice.as_ref();
  375 |                 Arc::new(UInt64Array::from(calculate_max_bit_width(
  376 |                     u8_slice,
  377 |                     self.bits_per_value,
  378 |                 )))
  379 |             }
  380 |             16 => {
  381 |                 let u16_slice = self.data.borrow_to_typed_slice::<u16>();
  382 |                 let u16_slice = u16_slice.as_ref();
  383 |                 Arc::new(UInt64Array::from(calculate_max_bit_width(
  384 |                     u16_slice,
  385 |                     self.bits_per_value,
  386 |                 )))
  387 |             }
  388 |             32 => {
  389 |                 let u32_slice = self.data.borrow_to_typed_slice::<u32>();
  390 |                 let u32_slice = u32_slice.as_ref();
  391 |                 Arc::new(UInt64Array::from(calculate_max_bit_width(
  392 |                     u32_slice,
  393 |                     self.bits_per_value,
  394 |                 )))
  395 |             }
  396 |             64 => {
  397 |                 let u64_slice = self.data.borrow_to_typed_slice::<u64>();
  398 |                 let u64_slice = u64_slice.as_ref();
  399 |                 Arc::new(UInt64Array::from(calculate_max_bit_width(
  400 |                     u64_slice,
  401 |                     self.bits_per_value,
  402 |                 )))
  403 |             }
  404 |             _ => Arc::new(UInt64Array::from(vec![self.bits_per_value])),
  405 |         }
  406 |     }
  407 | 
  408 |     fn cardinality(&self) -> Arc<dyn Array> {
  409 |         match self.bits_per_value {
  410 |             64 => {
  411 |                 let u64_slice_ref = self.data.borrow_to_typed_slice::<u64>();
  412 |                 let u64_slice = u64_slice_ref.as_ref();
  413 | 
  414 |                 const PRECISION: u8 = 4;
  415 |                 let mut hll: HyperLogLogPlus<u64, xxhash_rust::xxh3::Xxh3Builder> =
  416 |                     HyperLogLogPlus::new(PRECISION, xxhash_rust::xxh3::Xxh3Builder::default())
  417 |                         .unwrap();
  418 |                 for val in u64_slice {
  419 |                     hll.insert(val);
  420 |                 }
  421 |                 let cardinality = hll.count() as u64;
  422 |                 Arc::new(UInt64Array::from(vec![cardinality]))
  423 |             }
  424 |             128 => {
  425 |                 let u128_slice_ref = self.data.borrow_to_typed_slice::<u128>();
  426 |                 let u128_slice = u128_slice_ref.as_ref();
  427 | 
  428 |                 const PRECISION: u8 = 4;
  429 |                 let mut hll: HyperLogLogPlus<u128, RandomState> =
  430 |                     HyperLogLogPlus::new(PRECISION, RandomState::new()).unwrap();
  431 |                 for val in u128_slice {
  432 |                     hll.insert(val);
  433 |                 }
  434 |                 let cardinality = hll.count() as u64;
  435 |                 Arc::new(UInt64Array::from(vec![cardinality]))
  436 |             }
  437 |             _ => unreachable!(),
  438 |         }
  439 |     }
  440 | 
  441 |     /// Counts the number of runs (consecutive sequences of equal values) in the data.
  442 |     ///
  443 |     /// A "run" is defined as a sequence of one or more consecutive equal values.
  444 |     /// For example:
  445 |     /// - `[1, 1, 2, 2, 2, 3]` has 3 runs: [1,1], [2,2,2], and [3]
  446 |     /// - `[1, 2, 3, 4]` has 4 runs (each value is its own run)
  447 |     /// - `[5, 5, 5, 5]` has 1 run
  448 |     ///
  449 |     /// This count is used to determine if RLE compression would be effective.
  450 |     /// Fewer runs relative to the total number of values indicates better RLE compression potential.
  451 |     fn run_count(&mut self) -> Arc<dyn Array> {
  452 |         if self.num_values == 0 {
  453 |             return Arc::new(UInt64Array::from(vec![0u64]));
  454 |         }
  455 | 
  456 |         // Inner function to count runs in typed data
  457 |         fn count_runs<T: PartialEq + Copy>(slice: &[T]) -> u64 {
  458 |             if slice.is_empty() {
  459 |                 return 0;
  460 |             }
  461 | 
  462 |             // Start with 1 run (the first value)
  463 |             let mut runs = 1u64;
  464 |             let mut prev = slice[0];
  465 | 
  466 |             // Count value transitions (each transition indicates a new run)
  467 |             for &val in &slice[1..] {
  468 |                 if val != prev {
  469 |                     runs += 1;
  470 |                     prev = val;
  471 |                 }
  472 |             }
  473 | 
  474 |             runs
  475 |         }
  476 | 
  477 |         let run_count = match self.bits_per_value {
  478 |             8 => {
  479 |                 let u8_slice = self.data.borrow_to_typed_slice::<u8>();
  480 |                 count_runs(u8_slice.as_ref())
  481 |             }
  482 |             16 => {
  483 |                 let u16_slice = self.data.borrow_to_typed_slice::<u16>();
  484 |                 count_runs(u16_slice.as_ref())
  485 |             }
  486 |             32 => {
  487 |                 let u32_slice = self.data.borrow_to_typed_slice::<u32>();
  488 |                 count_runs(u32_slice.as_ref())
  489 |             }
  490 |             64 => {
  491 |                 let u64_slice = self.data.borrow_to_typed_slice::<u64>();
  492 |                 count_runs(u64_slice.as_ref())
  493 |             }
  494 |             128 => {
  495 |                 let u128_slice = self.data.borrow_to_typed_slice::<u128>();
  496 |                 count_runs(u128_slice.as_ref())
  497 |             }
  498 |             _ => self.num_values, // For other bit widths, assume no runs
  499 |         };
  500 | 
  501 |         Arc::new(UInt64Array::from(vec![run_count]))
  502 |     }
  503 | 
  504 |     /// Calculates entropy for each byte position.
  505 |     /// Returns an array with entropy values for each byte position (scaled by 1000 for integer storage).
  506 |     /// Lower entropy in specific byte positions indicates better suitability for BSS.
  507 |     fn byte_position_entropy(&mut self) -> Arc<dyn Array> {
  508 |         const SAMPLE_SIZE: usize = 64; // Sample more values for better entropy estimation
  509 | 
  510 |         // Get sample size (min of data length and SAMPLE_SIZE)
  511 |         let sample_count = (self.num_values as usize).min(SAMPLE_SIZE);
  512 | 
  513 |         if sample_count == 0 {
  514 |             // Return empty array for empty data
  515 |             return Arc::new(UInt64Array::from(vec![] as Vec<u64>));
  516 |         }
  517 | 
  518 |         let bytes_per_value = (self.bits_per_value / 8) as usize;
  519 |         let mut entropies = Vec::with_capacity(bytes_per_value);
  520 | 
  521 |         // Calculate entropy for each byte position
  522 |         for pos in 0..bytes_per_value {
  523 |             let mut byte_counts = [0u32; 256];
  524 | 
  525 |             // Count occurrences of each byte value at this position
  526 |             for i in 0..sample_count {
  527 |                 let byte_offset = i * bytes_per_value + pos;
  528 |                 if byte_offset < self.data.len() {
  529 |                     byte_counts[self.data[byte_offset] as usize] += 1;
  530 |                 }
  531 |             }
  532 | 
  533 |             // Calculate Shannon entropy for this position
  534 |             let mut entropy = 0.0f64;
  535 |             let total = sample_count as f64;
  536 | 
  537 |             for &count in &byte_counts {
  538 |                 if count > 0 {
  539 |                     let p = count as f64 / total;
  540 |                     entropy -= p * p.log2();
  541 |                 }
  542 |             }
  543 | 
  544 |             // Scale by 1000 and store as integer for efficient storage
  545 |             entropies.push((entropy * 1000.0) as u64);
  546 |         }
  547 | 
  548 |         Arc::new(UInt64Array::from(entropies))
  549 |     }
  550 | }
  551 | 
  552 | impl GetStat for OpaqueBlock {
  553 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  554 |         let block_info = self.block_info.0.read().unwrap();
  555 | 
  556 |         if block_info.is_empty() {
  557 |             panic!("get_stat should be called after statistics are computed.");
  558 |         }
  559 |         block_info.get(&stat).cloned()
  560 |     }
  561 | }
  562 | 
  563 | impl GetStat for DictionaryDataBlock {
  564 |     fn get_stat(&self, _stat: Stat) -> Option<Arc<dyn Array>> {
  565 |         None
  566 |     }
  567 | }
  568 | 
  569 | impl GetStat for StructDataBlock {
  570 |     fn get_stat(&self, stat: Stat) -> Option<Arc<dyn Array>> {
  571 |         let block_info = self.block_info.0.read().unwrap();
  572 |         if block_info.is_empty() {
  573 |             panic!("get_stat should be called after statistics are computed.")
  574 |         }
  575 |         block_info.get(&stat).cloned()
  576 |     }
  577 | }
  578 | 
  579 | impl ComputeStat for StructDataBlock {
  580 |     fn compute_stat(&mut self) {
  581 |         let data_size = self.data_size();
  582 |         let data_size_array = Arc::new(UInt64Array::from(vec![data_size]));
  583 | 
  584 |         let max_len = self
  585 |             .children
  586 |             .iter()
  587 |             .map(|child| child.expect_single_stat::<UInt64Type>(Stat::MaxLength))
  588 |             .sum::<u64>();
  589 |         let max_len_array = Arc::new(UInt64Array::from(vec![max_len]));
  590 | 
  591 |         let mut info = self.block_info.0.write().unwrap();
  592 |         info.insert(Stat::DataSize, data_size_array);
  593 |         info.insert(Stat::MaxLength, max_len_array);
  594 |     }
  595 | }
  596 | 
  597 | #[cfg(test)]
  598 | mod tests {
  599 |     use std::sync::Arc;
  600 | 
  601 |     use arrow_array::{
  602 |         ArrayRef, Int8Array, Int16Array, Int32Array, Int64Array, LargeStringArray, StringArray,
  603 |         UInt8Array, UInt16Array, UInt32Array, UInt64Array,
  604 |     };
  605 |     use arrow_schema::{DataType, Field};
  606 |     use lance_arrow::DataTypeExt;
  607 |     use lance_datagen::{ArrayGeneratorExt, DEFAULT_SEED, RowCount, array};
  608 |     use rand::SeedableRng;
  609 | 
  610 |     use crate::statistics::{GetStat, Stat};
  611 | 
  612 |     use super::DataBlock;
  613 | 
  614 |     use arrow_array::{
  615 |         Array,
  616 |         cast::AsArray,
  617 |         types::{Int32Type, UInt64Type},
  618 |     };
  619 |     use arrow_select::concat::concat;
  620 |     #[test]
  621 |     fn test_data_size_stat() {
  622 |         let mut rng = rand_xoshiro::Xoshiro256PlusPlus::seed_from_u64(DEFAULT_SEED.0);
  623 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[false, false, false]);
  624 |         let arr1 = genn.generate(RowCount::from(3), &mut rng).unwrap();
  625 |         let arr2 = genn.generate(RowCount::from(3), &mut rng).unwrap();
  626 |         let arr3 = genn.generate(RowCount::from(3), &mut rng).unwrap();
  627 |         let block = DataBlock::from_arrays(&[arr1.clone(), arr2.clone(), arr3.clone()], 9);
  628 | 
  629 |         let concatenated_array = concat(&[
  630 |             &*Arc::new(arr1.clone()) as &dyn Array,
  631 |             &*Arc::new(arr2.clone()) as &dyn Array,
  632 |             &*Arc::new(arr3.clone()) as &dyn Array,
  633 |         ])
  634 |         .unwrap();
  635 | 
  636 |         let data_size = block.expect_single_stat::<UInt64Type>(Stat::DataSize);
  637 | 
  638 |         let total_buffer_size: usize = concatenated_array
  639 |             .to_data()
  640 |             .buffers()
  641 |             .iter()
  642 |             .map(|buffer| buffer.len())
  643 |             .sum();
  644 |         assert!(data_size == total_buffer_size as u64);
  645 | 
  646 |         // test DataType::Binary
  647 |         let mut genn = lance_datagen::array::rand_type(&DataType::Binary);
  648 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
  649 |         let block = DataBlock::from_array(arr.clone());
  650 |         let data_size = block.expect_single_stat::<UInt64Type>(Stat::DataSize);
  651 | 
  652 |         let total_buffer_size: usize = arr
  653 |             .to_data()
  654 |             .buffers()
  655 |             .iter()
  656 |             .map(|buffer| buffer.len())
  657 |             .sum();
  658 |         assert!(data_size == total_buffer_size as u64);
  659 | 
  660 |         // test DataType::Struct
  661 |         let fields = vec![
  662 |             Arc::new(Field::new("int_field", DataType::Int32, false)),
  663 |             Arc::new(Field::new("float_field", DataType::Float32, false)),
  664 |         ]
  665 |         .into();
  666 | 
  667 |         let mut genn = lance_datagen::array::rand_type(&DataType::Struct(fields));
  668 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
  669 |         let block = DataBlock::from_array(arr.clone());
  670 |         let (_, arr_parts, _) = arr.as_struct().clone().into_parts();
  671 |         let total_buffer_size: usize = arr_parts
  672 |             .iter()
  673 |             .map(|arr| {
  674 |                 arr.to_data()
  675 |                     .buffers()
  676 |                     .iter()
  677 |                     .map(|buffer| buffer.len())
  678 |                     .sum::<usize>()
  679 |             })
  680 |             .sum();
  681 |         let data_size = block.expect_single_stat::<UInt64Type>(Stat::DataSize);
  682 |         assert!(data_size == total_buffer_size as u64);
  683 | 
  684 |         // test DataType::Dictionary
  685 |         let mut genn = array::rand_type(&DataType::Dictionary(
  686 |             Box::new(DataType::Int32),
  687 |             Box::new(DataType::Utf8),
  688 |         ));
  689 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
  690 |         let block = DataBlock::from_array(arr.clone());
  691 |         assert!(block.get_stat(Stat::DataSize).is_none());
  692 | 
  693 |         let mut genn = array::rand::<Int32Type>().with_nulls(&[false, true, false]);
  694 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
  695 |         let block = DataBlock::from_array(arr.clone());
  696 |         let data_size = block.expect_single_stat::<UInt64Type>(Stat::DataSize);
  697 |         let total_buffer_size: usize = arr
  698 |             .to_data()
  699 |             .buffers()
  700 |             .iter()
  701 |             .map(|buffer| buffer.len())
  702 |             .sum();
  703 | 
  704 |         assert!(data_size == total_buffer_size as u64);
  705 |     }
  706 | 
  707 |     #[test]
  708 |     fn test_bit_width_stat_for_integers() {
  709 |         let int8_array = Int8Array::from(vec![1, 2, 3]);
  710 |         let array_ref: ArrayRef = Arc::new(int8_array);
  711 |         let block = DataBlock::from_array(array_ref);
  712 | 
  713 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  714 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  715 | 
  716 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref(),);
  717 | 
  718 |         let int8_array = Int8Array::from(vec![0x1, 0x2, 0x3, 0x7F]);
  719 |         let array_ref: ArrayRef = Arc::new(int8_array);
  720 |         let block = DataBlock::from_array(array_ref);
  721 | 
  722 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![7])) as ArrayRef;
  723 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  724 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref(),);
  725 | 
  726 |         let int8_array = Int8Array::from(vec![0x1, 0x2, 0x3, 0xF, 0x1F]);
  727 |         let array_ref: ArrayRef = Arc::new(int8_array);
  728 |         let block = DataBlock::from_array(array_ref);
  729 | 
  730 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![5])) as ArrayRef;
  731 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  732 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref(),);
  733 | 
  734 |         let int8_array = Int8Array::from(vec![-1, 2, 3]);
  735 |         let array_ref: ArrayRef = Arc::new(int8_array);
  736 |         let block = DataBlock::from_array(array_ref);
  737 | 
  738 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  739 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  740 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  741 | 
  742 |         let int16_array = Int16Array::from(vec![1, 2, 3]);
  743 |         let array_ref: ArrayRef = Arc::new(int16_array);
  744 |         let block = DataBlock::from_array(array_ref);
  745 | 
  746 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  747 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  748 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  749 | 
  750 |         let int16_array = Int16Array::from(vec![0x1, 0x2, 0x3, 0x7F]);
  751 |         let array_ref: ArrayRef = Arc::new(int16_array);
  752 |         let block = DataBlock::from_array(array_ref);
  753 | 
  754 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![7])) as ArrayRef;
  755 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  756 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  757 | 
  758 |         let int16_array = Int16Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  759 |         let array_ref: ArrayRef = Arc::new(int16_array);
  760 |         let block = DataBlock::from_array(array_ref);
  761 | 
  762 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  763 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  764 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  765 | 
  766 |         let int16_array = Int16Array::from(vec![0x1, 0x2, 0x3, 0x1FF]);
  767 |         let array_ref: ArrayRef = Arc::new(int16_array);
  768 |         let block = DataBlock::from_array(array_ref);
  769 | 
  770 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
  771 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  772 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  773 | 
  774 |         let int16_array = Int16Array::from(vec![0x1, 0x2, 0x3, 0xF, 0x1F]);
  775 |         let array_ref: ArrayRef = Arc::new(int16_array);
  776 |         let block = DataBlock::from_array(array_ref);
  777 | 
  778 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![5])) as ArrayRef;
  779 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  780 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  781 | 
  782 |         let int16_array = Int16Array::from(vec![-1, 2, 3]);
  783 |         let array_ref: ArrayRef = Arc::new(int16_array);
  784 |         let block = DataBlock::from_array(array_ref);
  785 | 
  786 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![16])) as ArrayRef;
  787 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  788 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  789 | 
  790 |         let int32_array = Int32Array::from(vec![1, 2, 3]);
  791 |         let array_ref: ArrayRef = Arc::new(int32_array);
  792 |         let block = DataBlock::from_array(array_ref);
  793 | 
  794 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  795 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  796 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  797 | 
  798 |         let int32_array = Int32Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  799 |         let array_ref: ArrayRef = Arc::new(int32_array);
  800 |         let block = DataBlock::from_array(array_ref);
  801 | 
  802 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  803 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  804 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  805 | 
  806 |         let int32_array = Int32Array::from(vec![0x1, 0x2, 0x3, 0xFF, 0x1FF]);
  807 |         let array_ref: ArrayRef = Arc::new(int32_array);
  808 |         let block = DataBlock::from_array(array_ref);
  809 | 
  810 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
  811 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  812 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  813 | 
  814 |         let int32_array = Int32Array::from(vec![-1, 2, 3]);
  815 |         let array_ref: ArrayRef = Arc::new(int32_array);
  816 |         let block = DataBlock::from_array(array_ref);
  817 | 
  818 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![32])) as ArrayRef;
  819 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  820 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  821 | 
  822 |         let int32_array = Int32Array::from(vec![-1, 2, 3, -88]);
  823 |         let array_ref: ArrayRef = Arc::new(int32_array);
  824 |         let block = DataBlock::from_array(array_ref);
  825 | 
  826 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![32])) as ArrayRef;
  827 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  828 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  829 | 
  830 |         let int64_array = Int64Array::from(vec![1, 2, 3]);
  831 |         let array_ref: ArrayRef = Arc::new(int64_array);
  832 |         let block = DataBlock::from_array(array_ref);
  833 | 
  834 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  835 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  836 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  837 | 
  838 |         let int64_array = Int64Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  839 |         let array_ref: ArrayRef = Arc::new(int64_array);
  840 |         let block = DataBlock::from_array(array_ref);
  841 | 
  842 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  843 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  844 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  845 | 
  846 |         let int64_array = Int64Array::from(vec![0x1, 0x2, 0x3, 0xFF, 0x1FF]);
  847 |         let array_ref: ArrayRef = Arc::new(int64_array);
  848 |         let block = DataBlock::from_array(array_ref);
  849 | 
  850 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
  851 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  852 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  853 | 
  854 |         let int64_array = Int64Array::from(vec![-1, 2, 3]);
  855 |         let array_ref: ArrayRef = Arc::new(int64_array);
  856 |         let block = DataBlock::from_array(array_ref);
  857 | 
  858 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![64])) as ArrayRef;
  859 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  860 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  861 | 
  862 |         let int64_array = Int64Array::from(vec![-1, 2, 3, -88]);
  863 |         let array_ref: ArrayRef = Arc::new(int64_array);
  864 |         let block = DataBlock::from_array(array_ref);
  865 | 
  866 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![64])) as ArrayRef;
  867 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  868 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  869 | 
  870 |         let uint8_array = UInt8Array::from(vec![1, 2, 3]);
  871 |         let array_ref: ArrayRef = Arc::new(uint8_array);
  872 |         let block = DataBlock::from_array(array_ref);
  873 | 
  874 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  875 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  876 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  877 | 
  878 |         let uint8_array = UInt8Array::from(vec![0x1, 0x2, 0x3, 0x7F]);
  879 |         let array_ref: ArrayRef = Arc::new(uint8_array);
  880 |         let block = DataBlock::from_array(array_ref);
  881 | 
  882 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![7])) as ArrayRef;
  883 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  884 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  885 | 
  886 |         let uint8_array = UInt8Array::from(vec![0x1, 0x2, 0x3, 0xF, 0x1F]);
  887 |         let array_ref: ArrayRef = Arc::new(uint8_array);
  888 |         let block = DataBlock::from_array(array_ref);
  889 | 
  890 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![5])) as ArrayRef;
  891 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  892 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  893 | 
  894 |         let uint8_array = UInt8Array::from(vec![1, 2, 3, 0xF]);
  895 |         let array_ref: ArrayRef = Arc::new(uint8_array);
  896 |         let block = DataBlock::from_array(array_ref);
  897 | 
  898 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![4])) as ArrayRef;
  899 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  900 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  901 | 
  902 |         let uint16_array = UInt16Array::from(vec![1, 2, 3]);
  903 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  904 |         let block = DataBlock::from_array(array_ref);
  905 | 
  906 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  907 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  908 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  909 | 
  910 |         let uint16_array = UInt16Array::from(vec![0x1, 0x2, 0x3, 0x7F]);
  911 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  912 |         let block = DataBlock::from_array(array_ref);
  913 | 
  914 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![7])) as ArrayRef;
  915 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  916 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  917 | 
  918 |         let uint16_array = UInt16Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  919 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  920 |         let block = DataBlock::from_array(array_ref);
  921 | 
  922 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  923 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  924 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  925 | 
  926 |         let uint16_array = UInt16Array::from(vec![0x1, 0x2, 0x3, 0x1FF]);
  927 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  928 |         let block = DataBlock::from_array(array_ref);
  929 | 
  930 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
  931 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  932 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  933 | 
  934 |         let uint16_array = UInt16Array::from(vec![0x1, 0x2, 0x3, 0xF, 0x1F]);
  935 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  936 |         let block = DataBlock::from_array(array_ref);
  937 | 
  938 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![5])) as ArrayRef;
  939 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  940 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  941 | 
  942 |         let uint16_array = UInt16Array::from(vec![1, 2, 3, 0xFFFF]);
  943 |         let array_ref: ArrayRef = Arc::new(uint16_array);
  944 |         let block = DataBlock::from_array(array_ref);
  945 | 
  946 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![16])) as ArrayRef;
  947 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  948 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  949 | 
  950 |         let uint32_array = UInt32Array::from(vec![1, 2, 3]);
  951 |         let array_ref: ArrayRef = Arc::new(uint32_array);
  952 |         let block = DataBlock::from_array(array_ref);
  953 | 
  954 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  955 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  956 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  957 | 
  958 |         let uint32_array = UInt32Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  959 |         let array_ref: ArrayRef = Arc::new(uint32_array);
  960 |         let block = DataBlock::from_array(array_ref);
  961 | 
  962 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
  963 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  964 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref(),);
  965 | 
  966 |         let uint32_array = UInt32Array::from(vec![0x1, 0x2, 0x3, 0xFF, 0x1FF]);
  967 |         let array_ref: ArrayRef = Arc::new(uint32_array);
  968 |         let block = DataBlock::from_array(array_ref);
  969 | 
  970 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
  971 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  972 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  973 | 
  974 |         let uint32_array = UInt32Array::from(vec![1, 2, 3, 0xF]);
  975 |         let array_ref: ArrayRef = Arc::new(uint32_array);
  976 |         let block = DataBlock::from_array(array_ref);
  977 | 
  978 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![4])) as ArrayRef;
  979 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  980 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  981 | 
  982 |         let uint32_array = UInt32Array::from(vec![1, 2, 3, 0x77]);
  983 |         let array_ref: ArrayRef = Arc::new(uint32_array);
  984 |         let block = DataBlock::from_array(array_ref);
  985 | 
  986 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![7])) as ArrayRef;
  987 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  988 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  989 | 
  990 |         let uint64_array = UInt64Array::from(vec![1, 2, 3]);
  991 |         let array_ref: ArrayRef = Arc::new(uint64_array);
  992 |         let block = DataBlock::from_array(array_ref);
  993 | 
  994 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![2])) as ArrayRef;
  995 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
  996 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
  997 | 
  998 |         let uint64_array = UInt64Array::from(vec![0x1, 0x2, 0x3, 0xFF]);
  999 |         let array_ref: ArrayRef = Arc::new(uint64_array);
 1000 |         let block = DataBlock::from_array(array_ref);
 1001 | 
 1002 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![8])) as ArrayRef;
 1003 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
 1004 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
 1005 | 
 1006 |         let uint64_array = UInt64Array::from(vec![0x1, 0x2, 0x3, 0xFF, 0x1FF]);
 1007 |         let array_ref: ArrayRef = Arc::new(uint64_array);
 1008 |         let block = DataBlock::from_array(array_ref);
 1009 | 
 1010 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![9])) as ArrayRef;
 1011 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
 1012 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
 1013 | 
 1014 |         let uint64_array = UInt64Array::from(vec![0, 2, 3, 0xFFFF]);
 1015 |         let array_ref: ArrayRef = Arc::new(uint64_array);
 1016 |         let block = DataBlock::from_array(array_ref);
 1017 | 
 1018 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![16])) as ArrayRef;
 1019 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
 1020 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
 1021 | 
 1022 |         let uint64_array = UInt64Array::from(vec![1, 2, 3, 0xFFFF_FFFF_FFFF_FFFF]);
 1023 |         let array_ref: ArrayRef = Arc::new(uint64_array);
 1024 |         let block = DataBlock::from_array(array_ref);
 1025 | 
 1026 |         let expected_bit_width = Arc::new(UInt64Array::from(vec![64])) as ArrayRef;
 1027 |         let actual_bit_width = block.expect_stat(Stat::BitWidth);
 1028 |         assert_eq!(actual_bit_width.as_ref(), expected_bit_width.as_ref());
 1029 |     }
 1030 | 
 1031 |     #[test]
 1032 |     fn test_bit_width_stat_more_than_1024() {
 1033 |         for data_type in [
 1034 |             DataType::Int8,
 1035 |             DataType::Int16,
 1036 |             DataType::Int32,
 1037 |             DataType::Int64,
 1038 |         ] {
 1039 |             let array1 = Int64Array::from(vec![3; 1024]);
 1040 |             let array2 = Int64Array::from(vec![8; 1024]);
 1041 |             let array3 = Int64Array::from(vec![-1; 10]);
 1042 |             let array1 = arrow_cast::cast(&array1, &data_type).unwrap();
 1043 |             let array2 = arrow_cast::cast(&array2, &data_type).unwrap();
 1044 |             let array3 = arrow_cast::cast(&array3, &data_type).unwrap();
 1045 | 
 1046 |             let arrays: Vec<&dyn arrow_array::Array> =
 1047 |                 vec![array1.as_ref(), array2.as_ref(), array3.as_ref()];
 1048 |             let concatenated = concat(&arrays).unwrap();
 1049 |             let block = DataBlock::from_array(concatenated.clone());
 1050 | 
 1051 |             let expected_bit_width = Arc::new(UInt64Array::from(vec![
 1052 |                 2,
 1053 |                 4,
 1054 |                 (data_type.byte_width() * 8) as u64,
 1055 |             ])) as ArrayRef;
 1056 |             let actual_bit_widths = block.expect_stat(Stat::BitWidth);
 1057 |             assert_eq!(actual_bit_widths.as_ref(), expected_bit_width.as_ref(),);
 1058 |         }
 1059 |     }
 1060 | 
 1061 |     #[test]
 1062 |     fn test_bit_width_when_none() {
 1063 |         let mut rng = rand_xoshiro::Xoshiro256PlusPlus::seed_from_u64(DEFAULT_SEED.0);
 1064 |         let mut genn = lance_datagen::array::rand_type(&DataType::Binary);
 1065 |         let arr = genn.generate(RowCount::from(3), &mut rng).unwrap();
 1066 |         let block = DataBlock::from_array(arr.clone());
 1067 |         assert!(block.get_stat(Stat::BitWidth).is_none(),);
 1068 |     }
 1069 | 
 1070 |     #[test]
 1071 |     fn test_cardinality_variable_width_datablock() {
 1072 |         let string_array = StringArray::from(vec![Some("hello"), Some("world")]);
 1073 |         let block = DataBlock::from_array(string_array);
 1074 |         let expected_cardinality = 2;
 1075 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1076 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1077 | 
 1078 |         let string_array = StringArray::from(vec![
 1079 |             Some("to be named by variables"),
 1080 |             Some("to be passed as arguments to procedures"),
 1081 |             Some("to be returned as values of procedures"),
 1082 |         ]);
 1083 |         let block = DataBlock::from_array(string_array);
 1084 |         let expected_cardinality = 3;
 1085 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1086 | 
 1087 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1088 | 
 1089 |         let string_array = StringArray::from(vec![
 1090 |             Some("Samuel Eilenberg"),
 1091 |             Some("Saunders Mac Lane"),
 1092 |             Some("Samuel Eilenberg"),
 1093 |         ]);
 1094 |         let block = DataBlock::from_array(string_array);
 1095 |         let expected_cardinality = 2;
 1096 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1097 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1098 | 
 1099 |         let string_array = LargeStringArray::from(vec![Some("hello"), Some("world")]);
 1100 |         let block = DataBlock::from_array(string_array);
 1101 |         let expected_cardinality = 2;
 1102 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1103 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1104 | 
 1105 |         let string_array = LargeStringArray::from(vec![
 1106 |             Some("to be named by variables"),
 1107 |             Some("to be passed as arguments to procedures"),
 1108 |             Some("to be returned as values of procedures"),
 1109 |         ]);
 1110 |         let block = DataBlock::from_array(string_array);
 1111 |         let expected_cardinality = 3;
 1112 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1113 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1114 | 
 1115 |         let string_array = LargeStringArray::from(vec![
 1116 |             Some("Samuel Eilenberg"),
 1117 |             Some("Saunders Mac Lane"),
 1118 |             Some("Samuel Eilenberg"),
 1119 |         ]);
 1120 |         let block = DataBlock::from_array(string_array);
 1121 |         let expected_cardinality = 2;
 1122 |         let actual_cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1123 |         assert_eq!(actual_cardinality, expected_cardinality,);
 1124 |     }
 1125 | 
 1126 |     #[test]
 1127 |     fn test_max_length_variable_width_datablock() {
 1128 |         let string_array = StringArray::from(vec![Some("hello"), Some("world")]);
 1129 |         let block = DataBlock::from_array(string_array.clone());
 1130 |         let expected_max_length = string_array.value_length(0) as u64;
 1131 |         let actual_max_length = block.expect_single_stat::<UInt64Type>(Stat::MaxLength);
 1132 |         assert_eq!(actual_max_length, expected_max_length);
 1133 | 
 1134 |         let string_array = StringArray::from(vec![
 1135 |             Some("to be named by variables"),
 1136 |             Some("to be passed as arguments to procedures"), // string that has max length
 1137 |             Some("to be returned as values of procedures"),
 1138 |         ]);
 1139 |         let block = DataBlock::from_array(string_array.clone());
 1140 |         let expected_max_length = string_array.value_length(1) as u64;
 1141 |         let actual_max_length = block.expect_single_stat::<UInt64Type>(Stat::MaxLength);
 1142 |         assert_eq!(actual_max_length, expected_max_length);
 1143 | 
 1144 |         let string_array = StringArray::from(vec![
 1145 |             Some("Samuel Eilenberg"),
 1146 |             Some("Saunders Mac Lane"), // string that has max length
 1147 |             Some("Samuel Eilenberg"),
 1148 |         ]);
 1149 |         let block = DataBlock::from_array(string_array.clone());
 1150 |         let expected_max_length = string_array.value_length(1) as u64;
 1151 |         let actual_max_length = block.expect_single_stat::<UInt64Type>(Stat::MaxLength);
 1152 |         assert_eq!(actual_max_length, expected_max_length);
 1153 | 
 1154 |         let string_array = LargeStringArray::from(vec![Some("hello"), Some("world")]);
 1155 |         let block = DataBlock::from_array(string_array.clone());
 1156 |         let expected_max_length = string_array.value_length(1) as u64;
 1157 |         let actual_max_length = block.expect_single_stat::<UInt64Type>(Stat::MaxLength);
 1158 |         assert_eq!(actual_max_length, expected_max_length);
 1159 | 
 1160 |         let string_array = LargeStringArray::from(vec![
 1161 |             Some("to be named by variables"),
 1162 |             Some("to be passed as arguments to procedures"), // string that has max length
 1163 |             Some("to be returned as values of procedures"),
 1164 |         ]);
 1165 |         let block = DataBlock::from_array(string_array.clone());
 1166 |         let expected_max_length = string_array.value(1).len() as u64;
 1167 |         let actual_max_length = block.expect_single_stat::<UInt64Type>(Stat::MaxLength);
 1168 | 
 1169 |         assert_eq!(actual_max_length, expected_max_length);
 1170 |     }
 1171 | 
 1172 |     #[test]
 1173 |     fn test_run_count_stat() {
 1174 |         // Test with highly repetitive data
 1175 |         let int32_array = Int32Array::from(vec![1, 1, 1, 2, 2, 2, 3, 3, 3]);
 1176 |         let block = DataBlock::from_array(int32_array);
 1177 |         let expected_run_count = 3;
 1178 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1179 |         assert_eq!(actual_run_count, expected_run_count);
 1180 | 
 1181 |         // Test with no repetition
 1182 |         let int32_array = Int32Array::from(vec![1, 2, 3, 4, 5]);
 1183 |         let block = DataBlock::from_array(int32_array);
 1184 |         let expected_run_count = 5;
 1185 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1186 |         assert_eq!(actual_run_count, expected_run_count);
 1187 | 
 1188 |         // Test with mixed pattern
 1189 |         let int32_array = Int32Array::from(vec![1, 1, 2, 3, 3, 3, 4, 5, 5]);
 1190 |         let block = DataBlock::from_array(int32_array);
 1191 |         let expected_run_count = 5;
 1192 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1193 |         assert_eq!(actual_run_count, expected_run_count);
 1194 | 
 1195 |         // Test with single value
 1196 |         let int32_array = Int32Array::from(vec![42, 42, 42, 42, 42]);
 1197 |         let block = DataBlock::from_array(int32_array);
 1198 |         let expected_run_count = 1;
 1199 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1200 |         assert_eq!(actual_run_count, expected_run_count);
 1201 | 
 1202 |         // Test with different data types
 1203 |         let uint8_array = UInt8Array::from(vec![1, 1, 2, 2, 3, 3]);
 1204 |         let block = DataBlock::from_array(uint8_array);
 1205 |         let expected_run_count = 3;
 1206 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1207 |         assert_eq!(actual_run_count, expected_run_count);
 1208 | 
 1209 |         let int64_array = Int64Array::from(vec![100, 100, 200, 300, 300]);
 1210 |         let block = DataBlock::from_array(int64_array);
 1211 |         let expected_run_count = 3;
 1212 |         let actual_run_count = block.expect_single_stat::<UInt64Type>(Stat::RunCount);
 1213 |         assert_eq!(actual_run_count, expected_run_count);
 1214 |     }
 1215 | 
 1216 |     #[test]
 1217 |     fn test_fixed_width_cardinality_is_lazy() {
 1218 |         let int64_array = Int64Array::from(vec![1, 2, 3, 1, 2, 3, 1]);
 1219 |         let block = DataBlock::from_array(int64_array);
 1220 | 
 1221 |         let DataBlock::FixedWidth(fixed) = &block else {
 1222 |             panic!("Expected FixedWidth datablock");
 1223 |         };
 1224 | 
 1225 |         let info = fixed.block_info.0.read().unwrap();
 1226 |         assert!(info.contains_key(&Stat::DataSize));
 1227 |         assert!(info.contains_key(&Stat::BitWidth));
 1228 |         assert!(!info.contains_key(&Stat::Cardinality));
 1229 |     }
 1230 | 
 1231 |     #[test]
 1232 |     fn test_fixed_width_cardinality_computed_on_demand() {
 1233 |         let int64_array = Int64Array::from(vec![1, 2, 3, 1, 2, 3, 1]);
 1234 |         let block = DataBlock::from_array(int64_array);
 1235 | 
 1236 |         let cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1237 |         assert_eq!(cardinality, 3);
 1238 | 
 1239 |         let DataBlock::FixedWidth(fixed) = &block else {
 1240 |             panic!("Expected FixedWidth datablock");
 1241 |         };
 1242 | 
 1243 |         let info = fixed.block_info.0.read().unwrap();
 1244 |         assert!(info.contains_key(&Stat::Cardinality));
 1245 |     }
 1246 | 
 1247 |     #[test]
 1248 |     fn test_variable_width_cardinality_is_lazy() {
 1249 |         let string_array = StringArray::from(vec!["a", "b", "a"]);
 1250 |         let block = DataBlock::from_array(string_array);
 1251 | 
 1252 |         let DataBlock::VariableWidth(var) = &block else {
 1253 |             panic!("Expected VariableWidth datablock");
 1254 |         };
 1255 | 
 1256 |         {
 1257 |             let info = var.block_info.0.read().unwrap();
 1258 |             assert!(info.contains_key(&Stat::DataSize));
 1259 |             assert!(info.contains_key(&Stat::MaxLength));
 1260 |             assert!(!info.contains_key(&Stat::Cardinality));
 1261 |         }
 1262 | 
 1263 |         let cardinality = block.expect_single_stat::<UInt64Type>(Stat::Cardinality);
 1264 |         assert_eq!(cardinality, 2);
 1265 | 
 1266 |         let info = var.block_info.0.read().unwrap();
 1267 |         assert!(info.contains_key(&Stat::Cardinality));
 1268 |     }
 1269 | }
``````
