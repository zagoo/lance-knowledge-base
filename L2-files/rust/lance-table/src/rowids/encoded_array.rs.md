> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/encoded_array.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ebc65c4af95fc6c9a279fd5f34706287f67f9a691eec9c2b928dd8b303fce47b`. Reviewed physical lines: 1-400.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Internal owned u64 arrays with optional u16/u32 base-relative deltas and conversion/search/slicing operations. (rust/lance-table/src/rowids/encoded_array.rs:1-400)

## Complete range analysis

### Lines 1-7

SPDX and Range/DeepSizeOf imports. No IO, Arrow, async or external encoding library is used in this implementation. (rust/lance-table/src/rowids/encoded_array.rs:1-7)

### Lines 8-28

EncodedU64Array derives Debug/Clone/PartialEq/Eq/DeepSizeOf with U16{base:u64,offsets:Vec<u16>}, U32 with u32 offsets, and U64(Vec<u64>). Parent encoded_array module is private (rust/lance-table/src/rowids.rs:17-24). Documentation notes u16 saves memory only beyond two values, but constructors do not enforce that size threshold. Direct construction can violate nonoverflowing/minimum-base assumptions. (rust/lance-table/src/rowids/encoded_array.rs:8-28)

### Lines 29-48

len is backing element count. iter returns a boxed borrowing DoubleEndedIterator, decoding base+offset with ordinary u64 addition or copying U64 values. Boxing allocates iterator storage; values are lazy and order-preserving, not sorted automatically. Malformed delta overflow is unchecked here. (rust/lance-table/src/rowids/encoded_array.rs:29-48)

### Lines 49-68

get returns None for absent index; present delta values add base, plain values copy. Bounds checks use Vec::get; addition can overflow for directly constructed malformed arrays. (rust/lance-table/src/rowids/encoded_array.rs:49-68)

### Lines 69-88

min returns None for empty arrays, otherwise returns base directly for U16/U32 and scans values for U64. Thus a nonempty delta vector without offset0 has reported min below its actual minimum; serde validates overflow but does not require offset0 (rust/lance-table/src/rowids/serde.rs:174-214). Vec construction rebases to actual min, but direct/protobuf construction need not. (rust/lance-table/src/rowids/encoded_array.rs:69-88)

### Lines 89-108

max returns None for empty arrays; otherwise scans maximum delta and adds base, or scans U64. Guards make local unwrap safe for nonempty vectors; ordinary addition still depends on valid delta bounds. (rust/lance-table/src/rowids/encoded_array.rs:89-108)

### Lines 109-148

first and last preserve stored order, returning None for empty, base+endpoint delta for compressed variants or copied endpoint for U64. They do not use min/max or assume ascending order. (rust/lance-table/src/rowids/encoded_array.rs:109-148)

### Lines 149-174

binary_search delegates to sorted typed backing vectors. For deltas, a value below base returns Err(0), above representable delta maximum returns Err(len), otherwise searches cast delta. U64 searches directly. Sortedness is a caller precondition, not validated; duplicate match selection follows the standard library. (rust/lance-table/src/rowids/encoded_array.rs:149-174)

### Lines 175-192

slice(offset,len) uses native offset..offset+len slicing, so invalid bounds/overflow can panic. U16/U32 slices decode all selected values and collect through FromIterator, rebasing/reselecting compressed representation. U64 slices copy directly into U64 even if narrow. All variants allocate owned storage; no shared view. (rust/lance-table/src/rowids/encoded_array.rs:175-192)

### Lines 193-213

From<Vec<u64>> scans min/max, defaults extrema to0 for empty, returns U64(empty) for no values. For nonempty max-min<=u16::MAX choose U16; else <=u32::MAX choose U32; else retain original U64 vector. Compressed forms allocate offsets and preserve order/duplicates. A singleton is U16 despite allocation/size tradeoff in doc. No sortedness check or deduplication. (rust/lance-table/src/rowids/encoded_array.rs:193-213)

### Lines 214-232

From<Range<u64>> computes end-start with ordinary subtraction then materializes every value. It chooses U16 when length<u16::MAX, U32 when length<u32::MAX, else U64: strict length thresholds differ from inclusive max-minus-min thresholds of Vec conversion. Empty42..42 is U16{base42,empty}; length65535 already uses U32 even though largest delta65534 fits u16. Reversed range can underflow; very wide input can require enormous allocation. (rust/lance-table/src/rowids/encoded_array.rs:214-232)

### Lines 233-255

FromIterator first collects all u64 values into a Vec then delegates From<Vec>; compression is not streaming. IntoIterator consumes storage and returns boxed owned DoubleEndedIterator decoding ordinary base+offset or moving plain values. Borrowed and owned iteration share ordering/overflow rules. (rust/lance-table/src/rowids/encoded_array.rs:233-255)

### Lines 256-282

cfg(test) roundtrip helper asserts exact variant, length, first/last, scanned expected min/max, complete borrowed iteration, every valid get and FromIterator equality. It is local to test_encoded_array_from_vec; no invalid get or malformed-base contract is tested. (rust/lance-table/src/rowids/encoded_array.rs:256-282)

### Lines 283-319

Roundtrip fixtures cover emptyU64, singleton42U16, unsorted u16 offsets including0/MAX with base2*u16MAX, analogous u32 offsets/base, and plain[42,0,43,u64MAX,99]. No sortedness assumption in roundtrip. (rust/lance-table/src/rowids/encoded_array.rs:283-319)

### Lines 320-358

Double-ended fixture tests all three variants with five values/base42, compares forward and reversed reverse traversal, and alternates next/next_back against get positions. It checks value order across both ends, not allocation cost or fused/exhaustion guarantees. (rust/lance-table/src/rowids/encoded_array.rs:320-358)

### Lines 359-392

Range fixture materializes forty values above2*u16MAX into U16 and u16MAX+10 values above2*u32MAX into U32, checks exact representation and consuming roundtrip. These are source tests, not measured subsecond performance evidence. (rust/lance-table/src/rowids/encoded_array.rs:359-392)

### Lines 393-400

Comment declines a U64 range fixture because it would be very large; empty42..42 checks len0 only. Local tests do not cover binary_search, slice representation changes, exact encoding thresholds, reversed ranges, offset overflow or noncanonical min behavior. (rust/lance-table/src/rowids/encoded_array.rs:393-400)

## Interaction and interpretation limits

All400 physical lines read. No source tests/builds executed. Encoded arrays are internal to the private module; enclosing segment selection is covered at rust/lance-table/src/rowids/segment.rs:126-299; complete public sequence contracts are covered at rust/lance-table/src/rowids.rs:1-2309. Allocation/arithmetic observations are source-derived, not benchmarks.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::Range;
    5 | 
    6 | use lance_core::deepsize::DeepSizeOf;
    7 | 
    8 | /// Encoded array of u64 values.
    9 | ///
   10 | /// This is a internal data type used as part of row id indices.
   11 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
   12 | pub enum EncodedU64Array {
   13 |     /// u64 values represented as u16 offset from a base value.
   14 |     ///
   15 |     /// Useful when the min and max value are within u16 range (0..65535).
   16 |     /// Only space saving when there are more than 2 values.
   17 |     U16 { base: u64, offsets: Vec<u16> },
   18 |     /// u64 values represented as u32 offset from a base value.
   19 |     ///
   20 |     /// Useful when the min and max value are within u32 range (0..~4 billion).
   21 |     U32 { base: u64, offsets: Vec<u32> },
   22 |     /// Just a plain vector of u64 values.
   23 |     ///
   24 |     /// For when the values cover a wide range.
   25 |     U64(Vec<u64>),
   26 | }
   27 | 
   28 | impl EncodedU64Array {
   29 |     pub fn len(&self) -> usize {
   30 |         match self {
   31 |             Self::U16 { offsets, .. } => offsets.len(),
   32 |             Self::U32 { offsets, .. } => offsets.len(),
   33 |             Self::U64(values) => values.len(),
   34 |         }
   35 |     }
   36 | 
   37 |     pub fn iter(&self) -> Box<dyn DoubleEndedIterator<Item = u64> + '_> {
   38 |         match self {
   39 |             Self::U16 { base, offsets } => {
   40 |                 Box::new(offsets.iter().cloned().map(move |o| base + o as u64))
   41 |             }
   42 |             Self::U32 { base, offsets } => {
   43 |                 Box::new(offsets.iter().cloned().map(move |o| base + o as u64))
   44 |             }
   45 |             Self::U64(values) => Box::new(values.iter().cloned()),
   46 |         }
   47 |     }
   48 | 
   49 |     pub fn get(&self, i: usize) -> Option<u64> {
   50 |         match self {
   51 |             Self::U16 { base, offsets } => {
   52 |                 if i < offsets.len() {
   53 |                     Some(*base + offsets[i] as u64)
   54 |                 } else {
   55 |                     None
   56 |                 }
   57 |             }
   58 |             Self::U32 { base, offsets } => {
   59 |                 if i < offsets.len() {
   60 |                     Some(*base + offsets[i] as u64)
   61 |                 } else {
   62 |                     None
   63 |                 }
   64 |             }
   65 |             Self::U64(values) => values.get(i).copied(),
   66 |         }
   67 |     }
   68 | 
   69 |     pub fn min(&self) -> Option<u64> {
   70 |         match self {
   71 |             Self::U16 { base, offsets } => {
   72 |                 if offsets.is_empty() {
   73 |                     None
   74 |                 } else {
   75 |                     Some(*base)
   76 |                 }
   77 |             }
   78 |             Self::U32 { base, offsets } => {
   79 |                 if offsets.is_empty() {
   80 |                     None
   81 |                 } else {
   82 |                     Some(*base)
   83 |                 }
   84 |             }
   85 |             Self::U64(values) => values.iter().copied().min(),
   86 |         }
   87 |     }
   88 | 
   89 |     pub fn max(&self) -> Option<u64> {
   90 |         match self {
   91 |             Self::U16 { base, offsets } => {
   92 |                 if offsets.is_empty() {
   93 |                     None
   94 |                 } else {
   95 |                     Some(*base + offsets.iter().copied().max().unwrap() as u64)
   96 |                 }
   97 |             }
   98 |             Self::U32 { base, offsets } => {
   99 |                 if offsets.is_empty() {
  100 |                     None
  101 |                 } else {
  102 |                     Some(*base + offsets.iter().copied().max().unwrap() as u64)
  103 |                 }
  104 |             }
  105 |             Self::U64(values) => values.iter().copied().max(),
  106 |         }
  107 |     }
  108 | 
  109 |     pub fn first(&self) -> Option<u64> {
  110 |         match self {
  111 |             Self::U16 { base, offsets } => {
  112 |                 if offsets.is_empty() {
  113 |                     None
  114 |                 } else {
  115 |                     Some(*base + *offsets.first().unwrap() as u64)
  116 |                 }
  117 |             }
  118 |             Self::U32 { base, offsets } => {
  119 |                 if offsets.is_empty() {
  120 |                     None
  121 |                 } else {
  122 |                     Some(*base + *offsets.first().unwrap() as u64)
  123 |                 }
  124 |             }
  125 |             Self::U64(values) => values.first().copied(),
  126 |         }
  127 |     }
  128 | 
  129 |     pub fn last(&self) -> Option<u64> {
  130 |         match self {
  131 |             Self::U16 { base, offsets } => {
  132 |                 if offsets.is_empty() {
  133 |                     None
  134 |                 } else {
  135 |                     Some(*base + *offsets.last().unwrap() as u64)
  136 |                 }
  137 |             }
  138 |             Self::U32 { base, offsets } => {
  139 |                 if offsets.is_empty() {
  140 |                     None
  141 |                 } else {
  142 |                     Some(*base + *offsets.last().unwrap() as u64)
  143 |                 }
  144 |             }
  145 |             Self::U64(values) => values.last().copied(),
  146 |         }
  147 |     }
  148 | 
  149 |     pub fn binary_search(&self, val: u64) -> std::result::Result<usize, usize> {
  150 |         match self {
  151 |             Self::U16 { base, offsets } => match val.checked_sub(*base) {
  152 |                 None => Err(0),
  153 |                 Some(val) => {
  154 |                     if val > u16::MAX as u64 {
  155 |                         return Err(offsets.len());
  156 |                     }
  157 |                     let u16 = val as u16;
  158 |                     offsets.binary_search(&u16)
  159 |                 }
  160 |             },
  161 |             Self::U32 { base, offsets } => match val.checked_sub(*base) {
  162 |                 None => Err(0),
  163 |                 Some(val) => {
  164 |                     if val > u32::MAX as u64 {
  165 |                         return Err(offsets.len());
  166 |                     }
  167 |                     let u32 = val as u32;
  168 |                     offsets.binary_search(&u32)
  169 |                 }
  170 |             },
  171 |             Self::U64(values) => values.binary_search(&val),
  172 |         }
  173 |     }
  174 | 
  175 |     pub fn slice(&self, offset: usize, len: usize) -> Self {
  176 |         match self {
  177 |             Self::U16 { base, offsets } => offsets[offset..(offset + len)]
  178 |                 .iter()
  179 |                 .map(|o| *base + *o as u64)
  180 |                 .collect(),
  181 |             Self::U32 { base, offsets } => offsets[offset..(offset + len)]
  182 |                 .iter()
  183 |                 .map(|o| *base + *o as u64)
  184 |                 .collect(),
  185 |             Self::U64(values) => {
  186 |                 let values = values[offset..(offset + len)].to_vec();
  187 |                 Self::U64(values)
  188 |             }
  189 |         }
  190 |     }
  191 | }
  192 | 
  193 | impl From<Vec<u64>> for EncodedU64Array {
  194 |     fn from(values: Vec<u64>) -> Self {
  195 |         let min = values.iter().copied().min().unwrap_or(0);
  196 |         let max = values.iter().copied().max().unwrap_or(0);
  197 |         let range = max - min;
  198 |         if values.is_empty() {
  199 |             Self::U64(Vec::new())
  200 |         } else if range <= u16::MAX as u64 {
  201 |             let base = min;
  202 |             let offsets = values.iter().map(|v| (*v - base) as u16).collect();
  203 |             Self::U16 { base, offsets }
  204 |         } else if range <= u32::MAX as u64 {
  205 |             let base = min;
  206 |             let offsets = values.iter().map(|v| (*v - base) as u32).collect();
  207 |             Self::U32 { base, offsets }
  208 |         } else {
  209 |             Self::U64(values)
  210 |         }
  211 |     }
  212 | }
  213 | 
  214 | impl From<Range<u64>> for EncodedU64Array {
  215 |     fn from(range: Range<u64>) -> Self {
  216 |         let min = range.start;
  217 |         let max = range.end;
  218 |         let range = max - min;
  219 |         if range < u16::MAX as u64 {
  220 |             let base = min;
  221 |             let offsets = (0..range as u16).collect();
  222 |             Self::U16 { base, offsets }
  223 |         } else if range < u32::MAX as u64 {
  224 |             let base = min;
  225 |             let offsets = (0..range as u32).collect();
  226 |             Self::U32 { base, offsets }
  227 |         } else {
  228 |             Self::U64((min..max).collect())
  229 |         }
  230 |     }
  231 | }
  232 | 
  233 | impl FromIterator<u64> for EncodedU64Array {
  234 |     fn from_iter<I: IntoIterator<Item = u64>>(iter: I) -> Self {
  235 |         let values: Vec<u64> = iter.into_iter().collect();
  236 |         Self::from(values)
  237 |     }
  238 | }
  239 | 
  240 | impl IntoIterator for EncodedU64Array {
  241 |     type Item = u64;
  242 |     type IntoIter = Box<dyn DoubleEndedIterator<Item = u64>>;
  243 |     fn into_iter(self) -> Self::IntoIter {
  244 |         match self {
  245 |             Self::U16 { base, offsets } => {
  246 |                 Box::new(offsets.into_iter().map(move |o| base + o as u64))
  247 |             }
  248 |             Self::U32 { base, offsets } => {
  249 |                 Box::new(offsets.into_iter().map(move |o| base + o as u64))
  250 |             }
  251 |             Self::U64(values) => Box::new(values.into_iter()),
  252 |         }
  253 |     }
  254 | }
  255 | 
  256 | #[cfg(test)]
  257 | mod test {
  258 |     use super::*;
  259 | 
  260 |     #[test]
  261 |     fn test_encoded_array_from_vec() {
  262 |         fn roundtrip_array(values: Vec<u64>, expected: &EncodedU64Array) {
  263 |             let encoded = EncodedU64Array::from(values.clone());
  264 |             assert_eq!(&encoded, expected);
  265 | 
  266 |             assert_eq!(values.len(), encoded.len());
  267 |             assert_eq!(values.first(), encoded.first().as_ref());
  268 |             assert_eq!(values.last(), encoded.last().as_ref());
  269 |             assert_eq!(values.iter().min(), encoded.min().as_ref());
  270 |             assert_eq!(values.iter().max(), encoded.max().as_ref());
  271 | 
  272 |             let roundtripped = encoded.iter().collect::<Vec<_>>();
  273 |             assert_eq!(values, roundtripped);
  274 | 
  275 |             for (i, v) in values.iter().enumerate() {
  276 |                 assert_eq!(Some(*v), encoded.get(i));
  277 |             }
  278 | 
  279 |             let encoded2 = values.into_iter().collect::<EncodedU64Array>();
  280 |             assert_eq!(&encoded2, expected);
  281 |         }
  282 | 
  283 |         // Empty
  284 |         roundtrip_array(vec![], &EncodedU64Array::U64(vec![]));
  285 | 
  286 |         // Single value
  287 |         roundtrip_array(
  288 |             vec![42],
  289 |             &EncodedU64Array::U16 {
  290 |                 base: 42,
  291 |                 offsets: vec![0],
  292 |             },
  293 |         );
  294 | 
  295 |         // u16 version, it can start beyond the u16 range, but the
  296 |         // relative values must be within u16 range.
  297 |         let relative_values = [42, 0, 43, u16::MAX as u64, 99];
  298 |         let values = relative_values.map(|v| v + 2 * u16::MAX as u64).to_vec();
  299 |         let expected = EncodedU64Array::U16 {
  300 |             base: 2 * u16::MAX as u64,
  301 |             offsets: relative_values.iter().map(|v| *v as u16).collect(),
  302 |         };
  303 |         roundtrip_array(values, &expected);
  304 | 
  305 |         // u32 version
  306 |         let relative_values = [42, 0, 43, u32::MAX as u64, 99];
  307 |         let values = relative_values.map(|v| v + 2 * u32::MAX as u64).to_vec();
  308 |         let expected = EncodedU64Array::U32 {
  309 |             base: 2 * u32::MAX as u64,
  310 |             offsets: relative_values.iter().map(|v| *v as u32).collect(),
  311 |         };
  312 |         roundtrip_array(values, &expected);
  313 | 
  314 |         // u64 version
  315 |         let values = [42, 0, 43, u64::MAX, 99].to_vec();
  316 |         let expected = EncodedU64Array::U64(values.clone());
  317 |         roundtrip_array(values, &expected);
  318 |     }
  319 | 
  320 |     #[test]
  321 |     fn test_double_ended_iter() {
  322 |         let arrays = vec![
  323 |             EncodedU64Array::U16 {
  324 |                 base: 42,
  325 |                 offsets: vec![0, 1, 2, 3, 4],
  326 |             },
  327 |             EncodedU64Array::U32 {
  328 |                 base: 42,
  329 |                 offsets: vec![0, 1, 2, 3, 4],
  330 |             },
  331 |             EncodedU64Array::U64(vec![42, 43, 44, 45, 46]),
  332 |         ];
  333 |         for array in arrays {
  334 |             // Should be able to iterate forwards and backwards, and get the same thing.
  335 |             let forwards = array.iter().collect::<Vec<_>>();
  336 |             let mut backwards = array.iter().rev().collect::<Vec<_>>();
  337 |             backwards.reverse();
  338 |             assert_eq!(forwards, backwards);
  339 | 
  340 |             // Should be able to pull from both sides in lockstep.
  341 |             let mut expected = Vec::with_capacity(array.len());
  342 |             let mut actual = Vec::with_capacity(array.len());
  343 |             let mut iter = array.iter();
  344 |             // Alternating forwards and backwards
  345 |             for i in 0..array.len() {
  346 |                 if i % 2 == 0 {
  347 |                     actual.push(iter.next().unwrap());
  348 |                     expected.push(array.get(i / 2).unwrap());
  349 |                 } else {
  350 |                     let i = array.len() - 1 - i / 2;
  351 |                     actual.push(iter.next_back().unwrap());
  352 |                     expected.push(array.get(i).unwrap());
  353 |                 };
  354 |             }
  355 |             assert_eq!(expected, actual);
  356 |         }
  357 |     }
  358 | 
  359 |     #[test]
  360 |     fn test_encoded_array_from_range() {
  361 |         // u16 version
  362 |         let range = (2 * u16::MAX as u64)..(40 + 2 * u16::MAX as u64);
  363 |         let encoded = EncodedU64Array::from(range.clone());
  364 |         let expected_base = 2 * u16::MAX as u64;
  365 |         assert!(
  366 |             matches!(
  367 |                 encoded,
  368 |                 EncodedU64Array::U16 {
  369 |                     base,
  370 |                     ..
  371 |                 } if base == expected_base
  372 |             ),
  373 |             "{:?}",
  374 |             encoded
  375 |         );
  376 |         let roundtripped = encoded.into_iter().collect::<Vec<_>>();
  377 |         assert_eq!(range.collect::<Vec<_>>(), roundtripped);
  378 | 
  379 |         // u32 version
  380 |         let range = (2 * u32::MAX as u64)..(u16::MAX as u64 + 10 + 2 * u32::MAX as u64);
  381 |         let encoded = EncodedU64Array::from(range.clone());
  382 |         let expected_base = 2 * u32::MAX as u64;
  383 |         assert!(matches!(
  384 |             encoded,
  385 |             EncodedU64Array::U32 {
  386 |                 base,
  387 |                 ..
  388 |             } if base == expected_base
  389 |         ));
  390 |         let roundtripped = encoded.into_iter().collect::<Vec<_>>();
  391 |         assert_eq!(range.collect::<Vec<_>>(), roundtripped);
  392 | 
  393 |         // We'll skip u64 since it would take a lot of memory.
  394 | 
  395 |         // Empty one
  396 |         let range = 42..42;
  397 |         let encoded = EncodedU64Array::from(range);
  398 |         assert_eq!(encoded.len(), 0);
  399 |     }
  400 | }
``````
