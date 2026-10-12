> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/rowids/bitmap.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `788f2893961f1b22a0b197c29ae3b8a11d2b93f5438d2811777604a4b11c6fc9`. Reviewed physical lines: 1-358.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Internal LSB-first owned bitmap, borrowed slices, popcounts and bitwise materialization. (rust/lance-table/src/rowids/bitmap.rs:1-358)

## Complete range analysis

### Lines 1-10

SPDX/import and Debug-independent Bitmap declaration derive equality/clone/deep size. Public data:Vec<u8> and len:usize allow arbitrary backing length and padding state; the enclosing bitmap module is private (rust/lance-table/src/rowids.rs:17-24), so pub here is not a public module route. (rust/lance-table/src/rowids/bitmap.rs:1-10)

### Lines 11-22

pub(super) count_ones processes complete eight-byte chunks as little-endian u64 popcounts, then remaining bytes. It counts every supplied storage bit, not a logical-length mask; popcount is independent of endianness although conversion is explicitly LE. Empty input sums to zero. (rust/lance-table/src/rowids/bitmap.rs:11-22)

### Lines 23-32

Debug writes Bitmap with data as successive logical bits from index0 through len-1 followed by len. Bit order is LSB first. Formatting errors propagate; invalid backing can panic via get. It prints logical bits rather than raw hexadecimal bytes or allocation capacity. (rust/lance-table/src/rowids/bitmap.rs:23-32)

### Lines 33-38

new_empty allocates len.div_ceil(8) zero bytes and stores length through from_parts. Zero length gives empty data; allocation failure is not a Result error. (rust/lance-table/src/rowids/bitmap.rs:33-38)

### Lines 39-53

new_full allocates ceiling byte count filled with0xff, then clears all high padding bits in the final partial byte. len0 has no last-byte access. Both constructors establish zero padding, unlike direct field mutation or from_parts. (rust/lance-table/src/rowids/bitmap.rs:39-53)

### Lines 54-66

pub(crate) from_parts accepts raw bytes and length without checking shape or padding. bytes borrows the entire backing slice; into_bytes consumes bitmap, returns all backing bytes and discards logical length. Neither truncates or masks malformed storage. (rust/lance-table/src/rowids/bitmap.rs:54-66)

### Lines 67-78

set, clear and get index data[i/8] with mask1<<(i%8). There is no i<len guard: padding bits in an allocated final byte are accessible, while indices beyond storage panic. Mutators return unit, get returns bool; no checked alternative or resize occurs. (rust/lance-table/src/rowids/bitmap.rs:67-78)

### Lines 79-90

len returns stored logical length. slice constructs borrowing BitmapSlice with self/start/len and performs no bounds or overflow validation. Mutation is excluded while this immutable borrow lives, but stored slice coordinates can be invalid. (rust/lance-table/src/rowids/bitmap.rs:79-90)

### Lines 91-106

count_ones counts all stored bytes, including extra bytes or nonzero padding. count_zeros subtracts it from logical len with ordinary usize arithmetic, which can underflow for malformed state. iter emits each stored byte low bit first and takes at most len; too-short backing silently yields fewer than len values, unlike get/debug. It does not allocate or advertise exact size. (rust/lance-table/src/rowids/bitmap.rs:91-106)

### Lines 107-118

From<&[bool]> allocates an empty bitmap of the input length and sets exactly true positions in input order. It preserves length and zero padding, scanning every boolean. (rust/lance-table/src/rowids/bitmap.rs:107-118)

### Lines 119-125

BitmapSlice retains private borrowed Bitmap, start and len. It owns no backing storage and has no exposed constructor except Bitmap::slice in this file. (rust/lance-table/src/rowids/bitmap.rs:119-125)

### Lines 126-163

Slice count_ones returns0 immediately for zero length, even with invalid start. Otherwise computes first/last bytes using start+len-1, then tests a single-byte interval or first/last partial bytes and counts middle whole bytes with the helper. Bounds are enforced only by backing indexing/slicing, not bitmap logical length. Coordinates can count padding; arithmetic overflow or storage bounds panic is possible. Work is proportional to covered bytes plus at most edge bits. (rust/lance-table/src/rowids/bitmap.rs:126-163)

### Lines 164-180

Slice count_zeros subtracts selected ones from its len. From<BitmapSlice> allocates a new empty bitmap and loops every selected bit, get(start+i) then set(i), compacting into a fresh zero-padded backing. This is a copying O(bits) conversion, not a zero-copy offset view; zero length performs no source access. Invalid coordinates follow get/ordinary-addition behavior. (rust/lance-table/src/rowids/bitmap.rs:164-180)

### Lines 181-214

cfg(test) test_bitmap checks len10 initially empty, sets0,1,4,5,9, verifies counts and exact debug bitstring1100110001, clears1,4 then checks1000010001 and a five-bit slice count. It exercises LSB logical order across the second byte. (rust/lance-table/src/rowids/bitmap.rs:181-214)

### Lines 215-237

Count fixture tests lengths1,7,8,63,64,65,130 with every third bit set against div_ceil(3). Direct-storage mutation fixture changes two bytes and checks immediate popcount updates, proving no count cache. No malformed padding/length case is asserted. (rust/lance-table/src/rowids/bitmap.rs:215-237)

### Lines 238-258

Equality fixture builds alternating bitmaps of lengths48 through55 from both full and empty constructors and asserts equality. This covers final-byte padding normalization together with logical bits; equality derives over both data and len. (rust/lance-table/src/rowids/bitmap.rs:238-258)

### Lines 259-280

Property fixture creates boolean arrays of length0..100, clamps start and length to valid coordinates, and compares slice popcount/zero count against the boolean subslice. It deliberately generates valid slices only. (rust/lance-table/src/rowids/bitmap.rs:259-280)

### Lines 281-294

Iteration fixture checks empty length10 emits ten false values and full length10 emits ten true values; it tests logical truncation of final-byte padding. (rust/lance-table/src/rowids/bitmap.rs:281-294)

### Lines 295-318

Iteration fixture sets0,3,7,9 in length10 and asserts the complete ten-boolean output, covering the byte boundary and final valid bit. (rust/lance-table/src/rowids/bitmap.rs:295-318)

### Lines 319-347

Iteration fixture for length15 sets0,7,14 and asserts all fifteen booleans in order, crossing bytes while omitting final padding bit. (rust/lance-table/src/rowids/bitmap.rs:319-347)

### Lines 348-358

Property fixture converts arbitrary boolean arrays of length0..100 into Bitmap and asserts iterator equality with original values. No direct slice-copy, invalid from_parts, overflow, logical out-of-range access or malformed-short iterator test appears locally. (rust/lance-table/src/rowids/bitmap.rs:348-358)

## Interaction and interpretation limits

All358 physical lines read in bounded chunks. Private parent-module visibility matters. Behavior described from source; no tests executed. Enclosing segment selection/masking is now covered at rust/lance-table/src/rowids/segment.rs:126-299 and rust/lance-table/src/rowids/segment.rs:694-746; full local sequence behavior is covered at rust/lance-table/src/rowids.rs:1-2309; stream/dataset callers remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use lance_core::deepsize::DeepSizeOf;
    5 | 
    6 | #[derive(PartialEq, Eq, Clone, DeepSizeOf)]
    7 | pub struct Bitmap {
    8 |     pub data: Vec<u8>,
    9 |     pub len: usize,
   10 | }
   11 | 
   12 | /// Set bits in `data`, counted a word at a time.
   13 | pub(super) fn count_ones(data: &[u8]) -> usize {
   14 |     let (words, tail) = data.as_chunks::<8>();
   15 |     let full: usize = words
   16 |         .iter()
   17 |         .map(|word| u64::from_le_bytes(*word).count_ones() as usize)
   18 |         .sum();
   19 |     let tail: usize = tail.iter().map(|byte| byte.count_ones() as usize).sum();
   20 |     full + tail
   21 | }
   22 | 
   23 | impl std::fmt::Debug for Bitmap {
   24 |     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
   25 |         write!(f, "Bitmap {{ data: ")?;
   26 |         for i in 0..self.len {
   27 |             write!(f, "{}", if self.get(i) { "1" } else { "0" })?;
   28 |         }
   29 |         write!(f, ", len: {} }}", self.len)
   30 |     }
   31 | }
   32 | 
   33 | impl Bitmap {
   34 |     pub fn new_empty(len: usize) -> Self {
   35 |         let data = vec![0; len.div_ceil(8)];
   36 |         Self::from_parts(data, len)
   37 |     }
   38 | 
   39 |     pub fn new_full(len: usize) -> Self {
   40 |         let mut data = vec![0xff; len.div_ceil(8)];
   41 |         // Zero past the end of len
   42 |         let remainder = len % 8;
   43 |         if remainder != 0 {
   44 |             let last_byte = data.last_mut().unwrap();
   45 |             let bits_to_clear = 8 - remainder;
   46 |             for offset_from_end in 0..bits_to_clear {
   47 |                 let i = 7 - offset_from_end;
   48 |                 *last_byte &= !(1 << i);
   49 |             }
   50 |         }
   51 |         Self::from_parts(data, len)
   52 |     }
   53 | 
   54 |     pub(crate) fn from_parts(data: Vec<u8>, len: usize) -> Self {
   55 |         Self { data, len }
   56 |     }
   57 | 
   58 |     #[inline]
   59 |     pub(crate) fn bytes(&self) -> &[u8] {
   60 |         &self.data
   61 |     }
   62 | 
   63 |     pub(crate) fn into_bytes(self) -> Vec<u8> {
   64 |         self.data
   65 |     }
   66 | 
   67 |     pub fn set(&mut self, i: usize) {
   68 |         self.data[i / 8] |= 1 << (i % 8);
   69 |     }
   70 | 
   71 |     pub fn clear(&mut self, i: usize) {
   72 |         self.data[i / 8] &= !(1 << (i % 8));
   73 |     }
   74 | 
   75 |     pub fn get(&self, i: usize) -> bool {
   76 |         self.data[i / 8] & (1 << (i % 8)) != 0
   77 |     }
   78 | 
   79 |     pub fn len(&self) -> usize {
   80 |         self.len
   81 |     }
   82 | 
   83 |     pub fn slice(&self, start: usize, len: usize) -> BitmapSlice<'_> {
   84 |         BitmapSlice {
   85 |             bitmap: self,
   86 |             start,
   87 |             len,
   88 |         }
   89 |     }
   90 | 
   91 |     pub fn count_ones(&self) -> usize {
   92 |         count_ones(&self.data)
   93 |     }
   94 | 
   95 |     pub fn count_zeros(&self) -> usize {
   96 |         self.len - self.count_ones()
   97 |     }
   98 | 
   99 |     pub fn iter(&self) -> impl Iterator<Item = bool> + '_ {
  100 |         self.data
  101 |             .iter()
  102 |             .flat_map(|&x| (0..8).map(move |i| x & (1 << i) != 0))
  103 |             .take(self.len)
  104 |     }
  105 | }
  106 | 
  107 | impl From<&[bool]> for Bitmap {
  108 |     fn from(slice: &[bool]) -> Self {
  109 |         let mut bitmap = Self::new_empty(slice.len());
  110 |         for (i, &b) in slice.iter().enumerate() {
  111 |             if b {
  112 |                 bitmap.set(i);
  113 |             }
  114 |         }
  115 |         bitmap
  116 |     }
  117 | }
  118 | 
  119 | // Make a slice of bitmap
  120 | pub struct BitmapSlice<'a> {
  121 |     bitmap: &'a Bitmap,
  122 |     start: usize,
  123 |     len: usize,
  124 | }
  125 | 
  126 | impl BitmapSlice<'_> {
  127 |     pub fn count_ones(&self) -> usize {
  128 |         if self.len == 0 {
  129 |             return 0;
  130 |         }
  131 |         let first_byte = self.start / 8;
  132 |         let last_byte = (self.start + self.len - 1) / 8;
  133 |         if first_byte == last_byte {
  134 |             let byte = self.bitmap.data[first_byte];
  135 |             let mut count = 0;
  136 |             for i in self.start % 8..((self.start + self.len - 1) % 8 + 1) {
  137 |                 if byte & (1 << i) != 0 {
  138 |                     count += 1;
  139 |                 }
  140 |             }
  141 |             count
  142 |         } else {
  143 |             let mut count = 0;
  144 |             // Handle first byte
  145 |             for i in self.start % 8..8 {
  146 |                 if self.bitmap.data[first_byte] & (1 << i) != 0 {
  147 |                     count += 1;
  148 |                 }
  149 |             }
  150 | 
  151 |             // Handle last bytes
  152 |             for i in 0..((self.start + self.len - 1) % 8 + 1) {
  153 |                 if self.bitmap.data[last_byte] & (1 << i) != 0 {
  154 |                     count += 1;
  155 |                 }
  156 |             }
  157 | 
  158 |             // Middle bytes can just use count_ones
  159 |             count += count_ones(&self.bitmap.data[first_byte + 1..last_byte]);
  160 |             count
  161 |         }
  162 |     }
  163 | 
  164 |     pub fn count_zeros(&self) -> usize {
  165 |         self.len - self.count_ones()
  166 |     }
  167 | }
  168 | 
  169 | impl From<BitmapSlice<'_>> for Bitmap {
  170 |     fn from(slice: BitmapSlice) -> Self {
  171 |         let mut bitmap = Self::new_empty(slice.len);
  172 |         for i in 0..slice.len {
  173 |             if slice.bitmap.get(slice.start + i) {
  174 |                 bitmap.set(i);
  175 |             }
  176 |         }
  177 |         bitmap
  178 |     }
  179 | }
  180 | 
  181 | #[cfg(test)]
  182 | mod tests {
  183 |     use super::*;
  184 |     use proptest::prop_assert_eq;
  185 | 
  186 |     #[test]
  187 |     fn test_bitmap() {
  188 |         let mut bitmap = Bitmap::new_empty(10);
  189 |         assert_eq!(bitmap.len(), 10);
  190 |         assert_eq!(bitmap.count_ones(), 0);
  191 | 
  192 |         bitmap.set(0);
  193 |         bitmap.set(1);
  194 |         bitmap.set(4);
  195 |         bitmap.set(5);
  196 |         bitmap.set(9);
  197 |         assert_eq!(bitmap.count_ones(), 5);
  198 |         assert_eq!(
  199 |             format!("{:?}", bitmap),
  200 |             "Bitmap { data: 1100110001, len: 10 }"
  201 |         );
  202 | 
  203 |         bitmap.clear(1);
  204 |         bitmap.clear(4);
  205 |         assert_eq!(bitmap.count_ones(), 3);
  206 |         assert_eq!(
  207 |             format!("{:?}", bitmap),
  208 |             "Bitmap { data: 1000010001, len: 10 }"
  209 |         );
  210 | 
  211 |         let bitmap_slice = bitmap.slice(5, 5);
  212 |         assert_eq!(bitmap_slice.count_ones(), 2);
  213 |     }
  214 | 
  215 |     #[test]
  216 |     fn test_count_ones_spans_words_and_tail() {
  217 |         for len in [1_usize, 7, 8, 63, 64, 65, 130] {
  218 |             let mut bitmap = Bitmap::new_empty(len);
  219 |             for i in (0..len).step_by(3) {
  220 |                 bitmap.set(i);
  221 |             }
  222 |             assert_eq!(bitmap.count_ones(), len.div_ceil(3), "len {len}");
  223 |         }
  224 |     }
  225 | 
  226 |     #[test]
  227 |     fn test_count_ones_tracks_direct_data_mutation() {
  228 |         let mut bitmap = Bitmap::new_empty(16);
  229 |         assert_eq!(bitmap.count_ones(), 0);
  230 | 
  231 |         bitmap.data[0] = 0b1010_0101;
  232 |         assert_eq!(bitmap.count_ones(), 4);
  233 | 
  234 |         bitmap.data[1] = 0xff;
  235 |         assert_eq!(bitmap.count_ones(), 12);
  236 |     }
  237 | 
  238 |     #[test]
  239 |     fn test_equality() {
  240 |         for len in 48..56 {
  241 |             let mut bitmap1 = Bitmap::new_empty(len);
  242 |             for i in 0..len {
  243 |                 if i % 2 == 0 {
  244 |                     bitmap1.set(i);
  245 |                 }
  246 |             }
  247 | 
  248 |             let mut bitmap2 = Bitmap::new_full(len);
  249 |             for i in 0..len {
  250 |                 if i % 2 == 1 {
  251 |                     bitmap2.clear(i);
  252 |                 }
  253 |             }
  254 | 
  255 |             assert_eq!(bitmap1, bitmap2);
  256 |         }
  257 |     }
  258 | 
  259 |     proptest::proptest! {
  260 |         #[test]
  261 |         fn test_bitmap_slice(
  262 |             values in proptest::collection::vec(proptest::bool::ANY, 0..100),
  263 |             mut start in 0..100usize,
  264 |             mut len in 0..100usize,
  265 |         ) {
  266 |             if start > values.len() {
  267 |                 start = values.len();
  268 |             }
  269 |             if len > values.len() - start {
  270 |                 len = values.len() - start;
  271 |             }
  272 | 
  273 |             let bitmap = Bitmap::from(values.as_slice());
  274 |             let slice = bitmap.slice(start, len);
  275 |             let values_slice = values[start..(start + len)].to_vec();
  276 | 
  277 |             prop_assert_eq!(slice.count_ones(), values_slice.iter().filter(|&&x| x).count());
  278 |         }
  279 |     }
  280 | 
  281 |     #[test]
  282 |     fn test_bitmap_iter_empty() {
  283 |         let bitmap = Bitmap::new_empty(10);
  284 |         let values: Vec<bool> = bitmap.iter().collect();
  285 |         assert_eq!(values, vec![false; 10]);
  286 |     }
  287 | 
  288 |     #[test]
  289 |     fn test_bitmap_iter_full() {
  290 |         let bitmap = Bitmap::new_full(10);
  291 |         let values: Vec<bool> = bitmap.iter().collect();
  292 |         assert_eq!(values, vec![true; 10]);
  293 |     }
  294 | 
  295 |     #[test]
  296 |     fn test_bitmap_iter_partial() {
  297 |         let mut bitmap = Bitmap::new_empty(10);
  298 |         bitmap.set(0);
  299 |         bitmap.set(3);
  300 |         bitmap.set(7);
  301 |         bitmap.set(9);
  302 | 
  303 |         let values: Vec<bool> = bitmap.iter().collect();
  304 |         let expected = vec![
  305 |             true,  // 0
  306 |             false, // 1
  307 |             false, // 2
  308 |             true,  // 3
  309 |             false, // 4
  310 |             false, // 5
  311 |             false, // 6
  312 |             true,  // 7
  313 |             false, // 8
  314 |             true,  // 9
  315 |         ];
  316 |         assert_eq!(values, expected);
  317 |     }
  318 | 
  319 |     #[test]
  320 |     fn test_bitmap_iter_edge_cases() {
  321 |         // Test with length that's not a multiple of 8
  322 |         let mut bitmap = Bitmap::new_empty(15);
  323 |         bitmap.set(0);
  324 |         bitmap.set(7);
  325 |         bitmap.set(14);
  326 | 
  327 |         let values: Vec<bool> = bitmap.iter().collect();
  328 |         let expected = vec![
  329 |             true,  // 0
  330 |             false, // 1
  331 |             false, // 2
  332 |             false, // 3
  333 |             false, // 4
  334 |             false, // 5
  335 |             false, // 6
  336 |             true,  // 7
  337 |             false, // 8
  338 |             false, // 9
  339 |             false, // 10
  340 |             false, // 11
  341 |             false, // 12
  342 |             false, // 13
  343 |             true,  // 14
  344 |         ];
  345 |         assert_eq!(values, expected);
  346 |     }
  347 | 
  348 |     proptest::proptest! {
  349 |         #[test]
  350 |         fn test_bitmap_iter_property(
  351 |             values in proptest::collection::vec(proptest::bool::ANY, 0..100)
  352 |         ) {
  353 |             let bitmap = Bitmap::from(values.as_slice());
  354 |             let iter_values: Vec<bool> = bitmap.iter().collect();
  355 |             assert_eq!(iter_values, values);
  356 |         }
  357 |     }
  358 | }
``````
