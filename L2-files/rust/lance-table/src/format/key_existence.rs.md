> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/format/key_existence.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4eef017c397912d5c1b44add32a9e9820f3f78427d9161ff3a898a2bd153a66b`. Reviewed physical lines: 1-718.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Merge-insert conflict key representation, Bloom builder, exact/Bloom overlap policy and Arrow key extraction. (rust/lance-table/src/format/key_existence.rs:1-718)

## Complete range analysis

### Lines 1-29

SPDX and module purpose: merge-insert join keys enter transaction-carried Bloom data for concurrent conflict checks. Imports HashSet/DefaultHasher, Arrow arrays/types, protobuf and core Sbbf/DeepSizeOf. Defaults are8192 expected items and0.00057 probability; comment says16KiB, while actual sizing delegates SbbfBuilder. Consumer condition that ON matches primary key is not enforced here. (rust/lance-table/src/format/key_existence.rs:1-29)

### Lines 30-41

KeyValue derives Debug/Clone/PartialEq/Eq/Hash; variants String, Int64, UInt64, Binary, List, Struct and Composite own their values. Structural derived equality/hash and explicit byte/hash_value methods are distinct representations. There is no Null or generic Arrow scalar variant. (rust/lance-table/src/format/key_existence.rs:30-41)

### Lines 42-59

to_bytes clones UTF8/binary bytes or writes little-endian8-byte signed/unsigned integers. List/Struct/Composite recursively concatenate each child bytes followed by a zero byte, with no type tag, length prefix or escaping. This is not injective: String and Binary with equal bytes coincide, positive Int64/UInt64 coincide, collection variant boundaries are not distinguished, and embedded NUL can create ambiguous child partitions. Empty containers all encode empty. Allocates a fresh Vec and nested temporary Vecs per call. (rust/lance-table/src/format/key_existence.rs:42-59)

### Lines 60-66

hash_value hashes the resulting Vec<u8> with a newly created std DefaultHasher and returns u64. It is not the derived KeyValue::hash and not Sbbf byte hashing. No explicit persisted hash-version or algorithm contract is stored here; equal resulting bytes imply equal hash. ExactSet below stores these hashes, not original keys, and its exactness is only about hash membership. (rust/lance-table/src/format/key_existence.rs:60-66)

### Lines 67-88

KeyExistenceFilterBuilder owns Sbbf, supplied ordered field_ids and item_count; derives Debug/Clone. new sets fixed expected items/probability via SbbfBuilder and expects success, panicking if configuration construction fails. It accepts empty/duplicate/negative field IDs and does not inspect schema. (rust/lance-table/src/format/key_existence.rs:67-88)

### Lines 89-104

insert consumes KeyValue, allocates to_bytes, inserts into Sbbf, increments item_count with ordinary arithmetic and always returns Ok locally; duplicate inserts count again. contains allocates same byte representation and checks membership. might_intersect delegates Sbbf comparison and translates its error to InvalidInput; field_ids are not compared and filter never grows here. (rust/lance-table/src/format/key_existence.rs:89-104)

### Lines 105-120

field_ids borrows the input list, estimated_size_bytes returns Sbbf bitmap size only (not all owned metadata/temporary allocations), len counts insertion calls and is_empty tests count==0. These are not distinct-key cardinality estimates. (rust/lance-table/src/format/key_existence.rs:105-120)

### Lines 121-133

build borrows builder and clones field IDs plus serializes Sbbf bytes into FilterType::Bloom. num_bits=(size_bytes as u32)*8, number_of_items remains default expected capacity8192, probability remains default; actual insertion count is not persisted. Builder remains usable afterward. (rust/lance-table/src/format/key_existence.rs:121-133)

### Lines 134-149

From<&builder> to transaction protobuf directly emits the same Bloom bitmap/config and field IDs without first constructing KeyExistenceFilter. Again number_of_items is capacity configuration, not observed row count; no validation or serialization error branch. (rust/lance-table/src/format/key_existence.rs:134-149)

### Lines 150-169

FilterType derives Debug/Clone/DeepSizeOf/PartialEq, containing ExactSet(HashSet<u64>) or Bloom{bitmap,num_bits,number_of_items,probability}. KeyExistenceFilter publicly exposes ordered field IDs and filter with same derives. Comment says only created for primary-key matching ON columns, but public fields and constructors do not enforce that condition. (rust/lance-table/src/format/key_existence.rs:150-169)

### Lines 170-186

from_bloom_filter is a forwarding build convenience. intersects returns tuple(intersection,possible_false_positive). Exact/Exact checks whether any u64 hash from left is in right and returns(has,false), including false for empty sets. Mixed Exact/Bloom returns(true,true) unconditionally, even for empties, because representations use different hashes. No field-ID comparison or original-value confirmation. (rust/lance-table/src/format/key_existence.rs:170-186)

### Lines 187-214

Bloom/Bloom first compares expected item count and absolute probability difference >f64::EPSILON, errors InvalidInput with both config pairs on mismatch, then delegates Sbbf::bytes_might_intersect and maps errors to InvalidInput. num_bits and field_ids are ignored. Returns(has,has), so disjoint is(false,false), overlap(true,true). NaN or equal infinities can evade probability-difference rejection because the comparison is false for NaN. Byte-length/layout compatibility is delegated; core method checks only equal lengths and any shared bit, not element-level overlap. (rust/lance-table/src/format/key_existence.rs:187-214)

### Lines 215-245

From<&filter> preserves field_ids, emits Exact hashes in HashSet iteration order (not canonical) or clones all Bloom fields unchanged. No config, num_bits/bitmap consistency, hash-version or field validation. It constructs protobuf but does not write transaction files. (rust/lance-table/src/format/key_existence.rs:215-245)

### Lines 246-281

TryFrom<&protobuf> deduplicates exact hashes by HashSet; for Bloom copies bytes/num_bits and replaces only zero number_of_items/probability with defaults8192/0.00057 for compatibility. Other values including NaN/negative probabilities are accepted. Missing data becomes empty ExactSet. Clones field_ids and always returns Ok locally; malformed bitmaps are not decoded/validated here. (rust/lance-table/src/format/key_existence.rs:246-281)

### Lines 282-310

extract_key_value_from_batch visits on_columns in supplied order, resolves exact top-level schema names, returns None if missing, null at row_idx or unsupported extraction. Empty column list returns None, one returns bare key, many Composite. Duplicate column names are allowed; no dotted nested-path resolution or row bounds check. A bad row index can trigger Arrow access panic rather than None. Owns copied strings/binary/nested data. (rust/lance-table/src/format/key_existence.rs:282-310)

### Lines 311-344

Private extractor supports Utf8/LargeUtf8 -> owned String, UInt64/Int64 directly, UInt32/Int32 widened to64 bits, Binary/LargeBinary -> owned Vec. String/binary downcast failures return None; numeric AsArray casts rely on matching concrete Arrow representation. This helper does not itself check top-level validity; its callers do. Floats, bool, decimals, dates/timestamps, small integers and view types fall through unsupported. (rust/lance-table/src/format/key_existence.rs:311-344)

### Lines 345-372

List and LargeList downcast with unwrap, obtain row child array then recursively extract each element in order. Any null/unsupported child aborts entire key. Empty list yields Some(List(empty)); both list widths share representation. Capacity preallocated to child length; arbitrary nesting may recurse and allocate repeatedly. FixedSizeList is not handled. (rust/lance-table/src/format/key_existence.rs:345-372)

### Lines 373-390

Struct downcasts fallibly, walks columns in schema order at same row index, rejects any null/unsupported child and recursively creates Struct(Vec). Field names/type metadata are not encoded in KeyValue. Empty struct would produce empty Struct. All other data types return None; successful branch wrapped Some. (rust/lance-table/src/format/key_existence.rs:373-390)

### Lines 391-449

cfg(test) imports and Int32 list fixture produces[1,2] and[3,4,5], asserts widened Int64 elements/lengths and differing hash_value for these two samples. It does not prove collision freedom. (rust/lance-table/src/format/key_existence.rs:391-449)

### Lines 450-478

Empty Int32 list fixture asserts extraction succeeds with empty List. It does not test null list versus empty or filter encoding equivalences. (rust/lance-table/src/format/key_existence.rs:450-478)

### Lines 479-526

UTF8 list fixture asserts lists[a,bc] and[de] contents/lengths and differing explicit hashes. No embedded-NUL or ambiguous-boundary case. (rust/lance-table/src/format/key_existence.rs:479-526)

### Lines 527-564

List null-child fixture accepts[1,2] and returns None for[3,null], checking both content and null rejection. Outer list null, deeply nested null and unsupported children are not covered. (rust/lance-table/src/format/key_existence.rs:527-564)

### Lines 565-619

Int32 struct fixture with columns a,b extracts[1,2] and[3,4] as widened Int64 Struct, verifies contents and differing sample hashes. Names are used only to construct Arrow schema, not included in keys. (rust/lance-table/src/format/key_existence.rs:565-619)

### Lines 620-674

UTF8 struct fixture extracts alice/smith and bob/jones in column order, verifies contents/length and differing hashes. No composite multi-ON-column fixture here. (rust/lance-table/src/format/key_existence.rs:620-674)

### Lines 675-718

Struct null-child fixture accepts first row[1,2] and rejects second[null,3]. All tests read, not executed. This file has no direct builder/config/intersection/protobuf roundtrip fixture; core Bloom tests cover lower-level algorithms, not full concurrent transaction correctness. (rust/lance-table/src/format/key_existence.rs:675-718)

## Interaction and interpretation limits

Every718 lines read. Public module exposes filter/key APIs, but primary-key eligibility, commit conflict callers, serialization sites and concurrent transaction outcomes remain pending. Hash collisions/ambiguous bytes are local deductions, not reproduced failures. No build/test/benchmark run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Key existence tracking for merge insert conflict detection.
    5 | //!
    6 | //! A merge insert records the join keys it inserted into a bloom filter, which
    7 | //! is carried in the transaction so a concurrent commit can detect whether it
    8 | //! inserted any of the same keys. The filter is serialized into the transaction
    9 | //! protobuf, so it lives at the table layer next to [`crate::format::pb`].
   10 | 
   11 | use std::collections::HashSet;
   12 | use std::collections::hash_map::DefaultHasher;
   13 | use std::hash::{Hash, Hasher};
   14 | 
   15 | use crate::format::pb;
   16 | use arrow_array::cast::AsArray;
   17 | use arrow_array::{
   18 |     Array, BinaryArray, LargeBinaryArray, LargeListArray, LargeStringArray, ListArray, RecordBatch,
   19 |     StringArray, StructArray,
   20 | };
   21 | use arrow_schema::DataType;
   22 | use lance_core::Result;
   23 | use lance_core::deepsize::DeepSizeOf;
   24 | use lance_core::utils::bloomfilter::sbbf::{Sbbf, SbbfBuilder};
   25 | 
   26 | // Default bloom filter config: 8192 items @ 0.00057 fpp -> 16KiB filter
   27 | pub const BLOOM_FILTER_DEFAULT_NUMBER_OF_ITEMS: u64 = 8192;
   28 | pub const BLOOM_FILTER_DEFAULT_PROBABILITY: f64 = 0.00057;
   29 | 
   30 | /// Key value for conflict detection.
   31 | #[derive(Debug, Clone, PartialEq, Eq, Hash)]
   32 | pub enum KeyValue {
   33 |     String(String),
   34 |     Int64(i64),
   35 |     UInt64(u64),
   36 |     Binary(Vec<u8>),
   37 |     List(Vec<Self>),
   38 |     Struct(Vec<Self>),
   39 |     Composite(Vec<Self>),
   40 | }
   41 | 
   42 | impl KeyValue {
   43 |     pub fn to_bytes(&self) -> Vec<u8> {
   44 |         match self {
   45 |             Self::String(s) => s.as_bytes().to_vec(),
   46 |             Self::Int64(i) => i.to_le_bytes().to_vec(),
   47 |             Self::UInt64(u) => u.to_le_bytes().to_vec(),
   48 |             Self::Binary(b) => b.clone(),
   49 |             Self::List(values) | Self::Struct(values) | Self::Composite(values) => {
   50 |                 let mut result = Vec::new();
   51 |                 for value in values {
   52 |                     result.extend_from_slice(&value.to_bytes());
   53 |                     result.push(0);
   54 |                 }
   55 |                 result
   56 |             }
   57 |         }
   58 |     }
   59 | 
   60 |     pub fn hash_value(&self) -> u64 {
   61 |         let mut hasher = DefaultHasher::new();
   62 |         self.to_bytes().hash(&mut hasher);
   63 |         hasher.finish()
   64 |     }
   65 | }
   66 | 
   67 | /// Builder for KeyExistenceFilter using Split Block Bloom Filter.
   68 | #[derive(Debug, Clone)]
   69 | pub struct KeyExistenceFilterBuilder {
   70 |     sbbf: Sbbf,
   71 |     field_ids: Vec<i32>,
   72 |     item_count: usize,
   73 | }
   74 | 
   75 | impl KeyExistenceFilterBuilder {
   76 |     pub fn new(field_ids: Vec<i32>) -> Self {
   77 |         let sbbf = SbbfBuilder::new()
   78 |             .expected_items(BLOOM_FILTER_DEFAULT_NUMBER_OF_ITEMS)
   79 |             .false_positive_probability(BLOOM_FILTER_DEFAULT_PROBABILITY)
   80 |             .build()
   81 |             .expect("Failed to build SBBF");
   82 |         Self {
   83 |             sbbf,
   84 |             field_ids,
   85 |             item_count: 0,
   86 |         }
   87 |     }
   88 | 
   89 |     pub fn insert(&mut self, key: KeyValue) -> Result<()> {
   90 |         self.sbbf.insert(&key.to_bytes()[..]);
   91 |         self.item_count += 1;
   92 |         Ok(())
   93 |     }
   94 | 
   95 |     pub fn contains(&self, key: &KeyValue) -> bool {
   96 |         self.sbbf.check(&key.to_bytes()[..])
   97 |     }
   98 | 
   99 |     pub fn might_intersect(&self, other: &Self) -> Result<bool> {
  100 |         self.sbbf
  101 |             .might_intersect(&other.sbbf)
  102 |             .map_err(|e| lance_core::Error::invalid_input(e.to_string()))
  103 |     }
  104 | 
  105 |     pub fn field_ids(&self) -> &[i32] {
  106 |         &self.field_ids
  107 |     }
  108 | 
  109 |     pub fn estimated_size_bytes(&self) -> usize {
  110 |         self.sbbf.size_bytes()
  111 |     }
  112 | 
  113 |     pub fn len(&self) -> usize {
  114 |         self.item_count
  115 |     }
  116 | 
  117 |     pub fn is_empty(&self) -> bool {
  118 |         self.item_count == 0
  119 |     }
  120 | 
  121 |     pub fn build(&self) -> KeyExistenceFilter {
  122 |         KeyExistenceFilter {
  123 |             field_ids: self.field_ids.clone(),
  124 |             filter: FilterType::Bloom {
  125 |                 bitmap: self.sbbf.to_bytes(),
  126 |                 num_bits: (self.sbbf.size_bytes() as u32) * 8,
  127 |                 number_of_items: BLOOM_FILTER_DEFAULT_NUMBER_OF_ITEMS,
  128 |                 probability: BLOOM_FILTER_DEFAULT_PROBABILITY,
  129 |             },
  130 |         }
  131 |     }
  132 | }
  133 | 
  134 | impl From<&KeyExistenceFilterBuilder> for pb::transaction::KeyExistenceFilter {
  135 |     fn from(builder: &KeyExistenceFilterBuilder) -> Self {
  136 |         Self {
  137 |             field_ids: builder.field_ids.clone(),
  138 |             data: Some(pb::transaction::key_existence_filter::Data::Bloom(
  139 |                 pb::transaction::BloomFilter {
  140 |                     bitmap: builder.sbbf.to_bytes(),
  141 |                     num_bits: (builder.sbbf.size_bytes() as u32) * 8,
  142 |                     number_of_items: BLOOM_FILTER_DEFAULT_NUMBER_OF_ITEMS,
  143 |                     probability: BLOOM_FILTER_DEFAULT_PROBABILITY,
  144 |                 },
  145 |             )),
  146 |         }
  147 |     }
  148 | }
  149 | 
  150 | /// Filter type for key existence data.
  151 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
  152 | pub enum FilterType {
  153 |     ExactSet(HashSet<u64>),
  154 |     Bloom {
  155 |         bitmap: Vec<u8>,
  156 |         num_bits: u32,
  157 |         number_of_items: u64,
  158 |         probability: f64,
  159 |     },
  160 | }
  161 | 
  162 | /// Tracks keys of inserted rows for conflict detection.
  163 | /// Only created when ON columns match the schema's unenforced primary key.
  164 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
  165 | pub struct KeyExistenceFilter {
  166 |     pub field_ids: Vec<i32>,
  167 |     pub filter: FilterType,
  168 | }
  169 | 
  170 | impl KeyExistenceFilter {
  171 |     pub fn from_bloom_filter(bloom: &KeyExistenceFilterBuilder) -> Self {
  172 |         bloom.build()
  173 |     }
  174 | 
  175 |     /// Check if two filters intersect. Returns (has_intersection, might_be_false_positive).
  176 |     /// Errors if bloom filter configs don't match.
  177 |     pub fn intersects(&self, other: &Self) -> Result<(bool, bool)> {
  178 |         match (&self.filter, &other.filter) {
  179 |             (FilterType::ExactSet(a), FilterType::ExactSet(b)) => {
  180 |                 Ok((a.iter().any(|h| b.contains(h)), false))
  181 |             }
  182 |             (FilterType::ExactSet(_), FilterType::Bloom { .. })
  183 |             | (FilterType::Bloom { .. }, FilterType::ExactSet(_)) => {
  184 |                 // Can't compare different hash schemes, assume intersection
  185 |                 Ok((true, true))
  186 |             }
  187 |             (
  188 |                 FilterType::Bloom {
  189 |                     bitmap: a_bits,
  190 |                     number_of_items: a_num_items,
  191 |                     probability: a_prob,
  192 |                     ..
  193 |                 },
  194 |                 FilterType::Bloom {
  195 |                     bitmap: b_bits,
  196 |                     number_of_items: b_num_items,
  197 |                     probability: b_prob,
  198 |                     ..
  199 |                 },
  200 |             ) => {
  201 |                 if a_num_items != b_num_items || (a_prob - b_prob).abs() > f64::EPSILON {
  202 |                     return Err(lance_core::Error::invalid_input(format!(
  203 |                         "Bloom filter config mismatch: ({}, {}) vs ({}, {})",
  204 |                         a_num_items, a_prob, b_num_items, b_prob
  205 |                     )));
  206 |                 }
  207 |                 let has = Sbbf::bytes_might_intersect(a_bits, b_bits)
  208 |                     .map_err(|e| lance_core::Error::invalid_input(e.to_string()))?;
  209 |                 Ok((has, has))
  210 |             }
  211 |         }
  212 |     }
  213 | }
  214 | 
  215 | impl From<&KeyExistenceFilter> for pb::transaction::KeyExistenceFilter {
  216 |     fn from(filter: &KeyExistenceFilter) -> Self {
  217 |         match &filter.filter {
  218 |             FilterType::ExactSet(hashes) => Self {
  219 |                 field_ids: filter.field_ids.clone(),
  220 |                 data: Some(pb::transaction::key_existence_filter::Data::Exact(
  221 |                     pb::transaction::ExactKeySetFilter {
  222 |                         key_hashes: hashes.iter().copied().collect(),
  223 |                     },
  224 |                 )),
  225 |             },
  226 |             FilterType::Bloom {
  227 |                 bitmap,
  228 |                 num_bits,
  229 |                 number_of_items,
  230 |                 probability,
  231 |             } => Self {
  232 |                 field_ids: filter.field_ids.clone(),
  233 |                 data: Some(pb::transaction::key_existence_filter::Data::Bloom(
  234 |                     pb::transaction::BloomFilter {
  235 |                         bitmap: bitmap.clone(),
  236 |                         num_bits: *num_bits,
  237 |                         number_of_items: *number_of_items,
  238 |                         probability: *probability,
  239 |                     },
  240 |                 )),
  241 |             },
  242 |         }
  243 |     }
  244 | }
  245 | 
  246 | impl TryFrom<&pb::transaction::KeyExistenceFilter> for KeyExistenceFilter {
  247 |     type Error = lance_core::Error;
  248 | 
  249 |     fn try_from(message: &pb::transaction::KeyExistenceFilter) -> Result<Self> {
  250 |         let filter = match message.data.as_ref() {
  251 |             Some(pb::transaction::key_existence_filter::Data::Exact(exact)) => {
  252 |                 FilterType::ExactSet(exact.key_hashes.iter().copied().collect())
  253 |             }
  254 |             Some(pb::transaction::key_existence_filter::Data::Bloom(b)) => {
  255 |                 // Use defaults for backwards compatibility
  256 |                 let number_of_items = if b.number_of_items == 0 {
  257 |                     BLOOM_FILTER_DEFAULT_NUMBER_OF_ITEMS
  258 |                 } else {
  259 |                     b.number_of_items
  260 |                 };
  261 |                 let probability = if b.probability == 0.0 {
  262 |                     BLOOM_FILTER_DEFAULT_PROBABILITY
  263 |                 } else {
  264 |                     b.probability
  265 |                 };
  266 |                 FilterType::Bloom {
  267 |                     bitmap: b.bitmap.clone(),
  268 |                     num_bits: b.num_bits,
  269 |                     number_of_items,
  270 |                     probability,
  271 |                 }
  272 |             }
  273 |             None => FilterType::ExactSet(HashSet::new()),
  274 |         };
  275 |         Ok(Self {
  276 |             field_ids: message.field_ids.clone(),
  277 |             filter,
  278 |         })
  279 |     }
  280 | }
  281 | 
  282 | /// Extract key value from a batch row. Returns None if null or unsupported type.
  283 | pub fn extract_key_value_from_batch(
  284 |     batch: &RecordBatch,
  285 |     row_idx: usize,
  286 |     on_columns: &[String],
  287 | ) -> Option<KeyValue> {
  288 |     let mut parts: Vec<KeyValue> = Vec::with_capacity(on_columns.len());
  289 | 
  290 |     for col_name in on_columns {
  291 |         let (col_idx, _) = batch.schema().column_with_name(col_name)?;
  292 |         let column = batch.column(col_idx);
  293 | 
  294 |         if column.is_null(row_idx) {
  295 |             return None;
  296 |         }
  297 | 
  298 |         let key_part = extract_key_value(column, row_idx)?;
  299 |         parts.push(key_part);
  300 |     }
  301 | 
  302 |     if parts.is_empty() {
  303 |         None
  304 |     } else if parts.len() == 1 {
  305 |         Some(parts.into_iter().next().unwrap())
  306 |     } else {
  307 |         Some(KeyValue::Composite(parts))
  308 |     }
  309 | }
  310 | 
  311 | fn extract_key_value(array: &dyn Array, row_idx: usize) -> Option<KeyValue> {
  312 |     let v = match array.data_type() {
  313 |         DataType::Utf8 => {
  314 |             let arr = array.as_any().downcast_ref::<StringArray>()?;
  315 |             KeyValue::String(arr.value(row_idx).to_string())
  316 |         }
  317 |         DataType::LargeUtf8 => {
  318 |             let arr = array.as_any().downcast_ref::<LargeStringArray>()?;
  319 |             KeyValue::String(arr.value(row_idx).to_string())
  320 |         }
  321 |         DataType::UInt64 => {
  322 |             let arr = array.as_primitive::<arrow_array::types::UInt64Type>();
  323 |             KeyValue::UInt64(arr.value(row_idx))
  324 |         }
  325 |         DataType::Int64 => {
  326 |             let arr = array.as_primitive::<arrow_array::types::Int64Type>();
  327 |             KeyValue::Int64(arr.value(row_idx))
  328 |         }
  329 |         DataType::UInt32 => {
  330 |             let arr = array.as_primitive::<arrow_array::types::UInt32Type>();
  331 |             KeyValue::UInt64(arr.value(row_idx) as u64)
  332 |         }
  333 |         DataType::Int32 => {
  334 |             let arr = array.as_primitive::<arrow_array::types::Int32Type>();
  335 |             KeyValue::Int64(arr.value(row_idx) as i64)
  336 |         }
  337 |         DataType::Binary => {
  338 |             let arr = array.as_any().downcast_ref::<BinaryArray>()?;
  339 |             KeyValue::Binary(arr.value(row_idx).to_vec())
  340 |         }
  341 |         DataType::LargeBinary => {
  342 |             let arr = array.as_any().downcast_ref::<LargeBinaryArray>()?;
  343 |             KeyValue::Binary(arr.value(row_idx).to_vec())
  344 |         }
  345 |         DataType::List(_) => {
  346 |             let list_array = array.as_any().downcast_ref::<ListArray>().unwrap();
  347 |             let values = list_array.value(row_idx);
  348 | 
  349 |             let mut elements = Vec::with_capacity(values.len());
  350 |             for i in 0..values.len() {
  351 |                 if values.is_null(i) {
  352 |                     return None;
  353 |                 }
  354 |                 let element = extract_key_value(&values, i)?;
  355 |                 elements.push(element);
  356 |             }
  357 |             KeyValue::List(elements)
  358 |         }
  359 |         DataType::LargeList(_) => {
  360 |             let list_array = array.as_any().downcast_ref::<LargeListArray>().unwrap();
  361 |             let values = list_array.value(row_idx);
  362 | 
  363 |             let mut elements = Vec::with_capacity(values.len());
  364 |             for i in 0..values.len() {
  365 |                 if values.is_null(i) {
  366 |                     return None;
  367 |                 }
  368 |                 let element = extract_key_value(&values, i)?;
  369 |                 elements.push(element);
  370 |             }
  371 |             KeyValue::List(elements)
  372 |         }
  373 |         DataType::Struct(_) => {
  374 |             let struct_array = array.as_any().downcast_ref::<StructArray>()?;
  375 |             let mut elements = Vec::with_capacity(struct_array.num_columns());
  376 |             for i in 0..struct_array.num_columns() {
  377 |                 let child = struct_array.column(i);
  378 |                 if child.is_null(row_idx) {
  379 |                     return None;
  380 |                 }
  381 |                 let field_value = extract_key_value(child.as_ref(), row_idx)?;
  382 |                 elements.push(field_value);
  383 |             }
  384 |             KeyValue::Struct(elements)
  385 |         }
  386 |         _ => return None,
  387 |     };
  388 |     Some(v)
  389 | }
  390 | 
  391 | #[cfg(test)]
  392 | mod tests {
  393 |     use super::*;
  394 |     use std::sync::Arc;
  395 | 
  396 |     use arrow_array::builder::{Int32Builder, ListBuilder, StringBuilder};
  397 |     use arrow_array::{Int32Array, RecordBatch, StringArray, StructArray};
  398 |     use arrow_schema::{Field, Schema};
  399 | 
  400 |     #[test]
  401 |     fn test_extract_key_value_from_batch_list_int() {
  402 |         let values_builder = Int32Builder::new();
  403 |         let mut list_builder = ListBuilder::new(values_builder);
  404 | 
  405 |         list_builder.append_value([Some(1), Some(2)]);
  406 |         list_builder.append_value([Some(3), Some(4), Some(5)]);
  407 | 
  408 |         let list_array = list_builder.finish();
  409 | 
  410 |         let schema = Arc::new(Schema::new(vec![Field::new(
  411 |             "id",
  412 |             list_array.data_type().clone(),
  413 |             false,
  414 |         )]));
  415 | 
  416 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(list_array)])
  417 |             .expect("batch should be valid");
  418 | 
  419 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  420 |             .expect("first row should produce a key");
  421 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")])
  422 |             .expect("second row should produce a key");
  423 | 
  424 |         match &key0 {
  425 |             KeyValue::List(values) => {
  426 |                 assert_eq!(values.len(), 2);
  427 |                 assert_eq!(values[0], KeyValue::Int64(1));
  428 |                 assert_eq!(values[1], KeyValue::Int64(2));
  429 |             }
  430 |             other => panic!("expected list key, got {:?}", other),
  431 |         }
  432 | 
  433 |         match &key1 {
  434 |             KeyValue::List(values) => {
  435 |                 assert_eq!(values.len(), 3);
  436 |                 assert_eq!(values[0], KeyValue::Int64(3));
  437 |                 assert_eq!(values[1], KeyValue::Int64(4));
  438 |                 assert_eq!(values[2], KeyValue::Int64(5));
  439 |             }
  440 |             other => panic!("expected list key, got {:?}", other),
  441 |         }
  442 | 
  443 |         assert_ne!(
  444 |             key0.hash_value(),
  445 |             key1.hash_value(),
  446 |             "different list values should hash differently",
  447 |         );
  448 |     }
  449 | 
  450 |     #[test]
  451 |     fn test_extract_key_value_from_batch_empty_list() {
  452 |         let values_builder = Int32Builder::new();
  453 |         let mut list_builder = ListBuilder::new(values_builder);
  454 | 
  455 |         list_builder.append_value(std::iter::empty::<Option<i32>>());
  456 | 
  457 |         let list_array = list_builder.finish();
  458 | 
  459 |         let schema = Arc::new(Schema::new(vec![Field::new(
  460 |             "id",
  461 |             list_array.data_type().clone(),
  462 |             false,
  463 |         )]));
  464 | 
  465 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(list_array)])
  466 |             .expect("batch should be valid");
  467 | 
  468 |         let key = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  469 |             .expect("empty list should still produce a key");
  470 | 
  471 |         match key {
  472 |             KeyValue::List(values) => {
  473 |                 assert!(values.is_empty(), "expected empty list");
  474 |             }
  475 |             other => panic!("expected list key, got {:?}", other),
  476 |         }
  477 |     }
  478 | 
  479 |     #[test]
  480 |     fn test_extract_key_value_from_batch_list_utf8() {
  481 |         let values_builder = StringBuilder::new();
  482 |         let mut list_builder = ListBuilder::new(values_builder);
  483 | 
  484 |         list_builder.append_value([Some("a"), Some("bc")]);
  485 |         list_builder.append_value([Some("de")]);
  486 | 
  487 |         let list_array = list_builder.finish();
  488 | 
  489 |         let schema = Arc::new(Schema::new(vec![Field::new(
  490 |             "id",
  491 |             list_array.data_type().clone(),
  492 |             false,
  493 |         )]));
  494 | 
  495 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(list_array)])
  496 |             .expect("batch should be valid");
  497 | 
  498 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  499 |             .expect("first row should produce a key");
  500 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")])
  501 |             .expect("second row should produce a key");
  502 | 
  503 |         match &key0 {
  504 |             KeyValue::List(values) => {
  505 |                 assert_eq!(values.len(), 2);
  506 |                 assert_eq!(values[0], KeyValue::String("a".to_string()));
  507 |                 assert_eq!(values[1], KeyValue::String("bc".to_string()));
  508 |             }
  509 |             other => panic!("expected list key, got {:?}", other),
  510 |         }
  511 | 
  512 |         match &key1 {
  513 |             KeyValue::List(values) => {
  514 |                 assert_eq!(values.len(), 1);
  515 |                 assert_eq!(values[0], KeyValue::String("de".to_string()));
  516 |             }
  517 |             other => panic!("expected list key, got {:?}", other),
  518 |         }
  519 | 
  520 |         assert_ne!(
  521 |             key0.hash_value(),
  522 |             key1.hash_value(),
  523 |             "different list values should hash differently",
  524 |         );
  525 |     }
  526 | 
  527 |     #[test]
  528 |     fn test_extract_key_value_from_batch_list_with_null_child() {
  529 |         let values_builder = Int32Builder::new();
  530 |         let mut list_builder = ListBuilder::new(values_builder);
  531 | 
  532 |         list_builder.append_value([Some(1), Some(2)]);
  533 |         list_builder.append_value([Some(3), None]);
  534 | 
  535 |         let list_array = list_builder.finish();
  536 | 
  537 |         let schema = Arc::new(Schema::new(vec![Field::new(
  538 |             "id",
  539 |             list_array.data_type().clone(),
  540 |             false,
  541 |         )]));
  542 | 
  543 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(list_array)])
  544 |             .expect("batch should be valid");
  545 | 
  546 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  547 |             .expect("first row should produce a key");
  548 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")]);
  549 | 
  550 |         match &key0 {
  551 |             KeyValue::List(values) => {
  552 |                 assert_eq!(values.len(), 2);
  553 |                 assert_eq!(values[0], KeyValue::Int64(1));
  554 |                 assert_eq!(values[1], KeyValue::Int64(2));
  555 |             }
  556 |             other => panic!("expected list key, got {:?}", other),
  557 |         }
  558 | 
  559 |         assert!(
  560 |             key1.is_none(),
  561 |             "list row with a null child should not produce a key",
  562 |         );
  563 |     }
  564 | 
  565 |     #[test]
  566 |     fn test_extract_key_value_from_batch_struct_int() {
  567 |         let a_values = Int32Array::from(vec![1, 3]);
  568 |         let b_values = Int32Array::from(vec![2, 4]);
  569 | 
  570 |         let struct_array = StructArray::from(vec![
  571 |             (
  572 |                 Arc::new(Field::new("a", arrow_schema::DataType::Int32, false)),
  573 |                 Arc::new(a_values) as Arc<dyn arrow_array::Array>,
  574 |             ),
  575 |             (
  576 |                 Arc::new(Field::new("b", arrow_schema::DataType::Int32, false)),
  577 |                 Arc::new(b_values) as Arc<dyn arrow_array::Array>,
  578 |             ),
  579 |         ]);
  580 | 
  581 |         let schema = Arc::new(Schema::new(vec![Field::new(
  582 |             "id",
  583 |             struct_array.data_type().clone(),
  584 |             false,
  585 |         )]));
  586 | 
  587 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(struct_array)])
  588 |             .expect("batch should be valid");
  589 | 
  590 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  591 |             .expect("first row should produce a key");
  592 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")])
  593 |             .expect("second row should produce a key");
  594 | 
  595 |         match &key0 {
  596 |             KeyValue::Struct(values) => {
  597 |                 assert_eq!(values.len(), 2);
  598 |                 assert_eq!(values[0], KeyValue::Int64(1));
  599 |                 assert_eq!(values[1], KeyValue::Int64(2));
  600 |             }
  601 |             other => panic!("expected struct key, got {:?}", other),
  602 |         }
  603 | 
  604 |         match &key1 {
  605 |             KeyValue::Struct(values) => {
  606 |                 assert_eq!(values.len(), 2);
  607 |                 assert_eq!(values[0], KeyValue::Int64(3));
  608 |                 assert_eq!(values[1], KeyValue::Int64(4));
  609 |             }
  610 |             other => panic!("expected struct key, got {:?}", other),
  611 |         }
  612 | 
  613 |         assert_ne!(
  614 |             key0.hash_value(),
  615 |             key1.hash_value(),
  616 |             "different struct values should hash differently",
  617 |         );
  618 |     }
  619 | 
  620 |     #[test]
  621 |     fn test_extract_key_value_from_batch_struct_utf8() {
  622 |         let first_names = StringArray::from(vec!["alice", "bob"]);
  623 |         let last_names = StringArray::from(vec!["smith", "jones"]);
  624 | 
  625 |         let struct_array = StructArray::from(vec![
  626 |             (
  627 |                 Arc::new(Field::new("first", arrow_schema::DataType::Utf8, false)),
  628 |                 Arc::new(first_names) as Arc<dyn arrow_array::Array>,
  629 |             ),
  630 |             (
  631 |                 Arc::new(Field::new("last", arrow_schema::DataType::Utf8, false)),
  632 |                 Arc::new(last_names) as Arc<dyn arrow_array::Array>,
  633 |             ),
  634 |         ]);
  635 | 
  636 |         let schema = Arc::new(Schema::new(vec![Field::new(
  637 |             "id",
  638 |             struct_array.data_type().clone(),
  639 |             false,
  640 |         )]));
  641 | 
  642 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(struct_array)])
  643 |             .expect("batch should be valid");
  644 | 
  645 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  646 |             .expect("first row should produce a key");
  647 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")])
  648 |             .expect("second row should produce a key");
  649 | 
  650 |         match &key0 {
  651 |             KeyValue::Struct(values) => {
  652 |                 assert_eq!(values.len(), 2);
  653 |                 assert_eq!(values[0], KeyValue::String("alice".to_string()));
  654 |                 assert_eq!(values[1], KeyValue::String("smith".to_string()));
  655 |             }
  656 |             other => panic!("expected struct key, got {:?}", other),
  657 |         }
  658 | 
  659 |         match &key1 {
  660 |             KeyValue::Struct(values) => {
  661 |                 assert_eq!(values.len(), 2);
  662 |                 assert_eq!(values[0], KeyValue::String("bob".to_string()));
  663 |                 assert_eq!(values[1], KeyValue::String("jones".to_string()));
  664 |             }
  665 |             other => panic!("expected struct key, got {:?}", other),
  666 |         }
  667 | 
  668 |         assert_ne!(
  669 |             key0.hash_value(),
  670 |             key1.hash_value(),
  671 |             "different struct values should hash differently",
  672 |         );
  673 |     }
  674 | 
  675 |     #[test]
  676 |     fn test_extract_key_value_from_batch_struct_with_null_child() {
  677 |         let a_values = Int32Array::from(vec![Some(1), None]);
  678 |         let b_values = Int32Array::from(vec![Some(2), Some(3)]);
  679 | 
  680 |         let struct_array = StructArray::from(vec![
  681 |             (
  682 |                 Arc::new(Field::new("a", arrow_schema::DataType::Int32, true)),
  683 |                 Arc::new(a_values) as Arc<dyn arrow_array::Array>,
  684 |             ),
  685 |             (
  686 |                 Arc::new(Field::new("b", arrow_schema::DataType::Int32, true)),
  687 |                 Arc::new(b_values) as Arc<dyn arrow_array::Array>,
  688 |             ),
  689 |         ]);
  690 | 
  691 |         let schema = Arc::new(Schema::new(vec![Field::new(
  692 |             "id",
  693 |             struct_array.data_type().clone(),
  694 |             false,
  695 |         )]));
  696 | 
  697 |         let batch = RecordBatch::try_new(schema, vec![Arc::new(struct_array)])
  698 |             .expect("batch should be valid");
  699 | 
  700 |         let key0 = extract_key_value_from_batch(&batch, 0, &[String::from("id")])
  701 |             .expect("first row should produce a key");
  702 |         let key1 = extract_key_value_from_batch(&batch, 1, &[String::from("id")]);
  703 | 
  704 |         match &key0 {
  705 |             KeyValue::Struct(values) => {
  706 |                 assert_eq!(values.len(), 2);
  707 |                 assert_eq!(values[0], KeyValue::Int64(1));
  708 |                 assert_eq!(values[1], KeyValue::Int64(2));
  709 |             }
  710 |             other => panic!("expected struct key, got {:?}", other),
  711 |         }
  712 | 
  713 |         assert!(
  714 |             key1.is_none(),
  715 |             "struct row with a null child should not produce a key",
  716 |         );
  717 |     }
  718 | }
``````
