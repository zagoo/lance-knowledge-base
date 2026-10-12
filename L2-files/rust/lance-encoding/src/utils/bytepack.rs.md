> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-encoding/src/utils/bytepack.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8a2ea158447762ffa1479cb835daad7789ef7bc7c106f3fcc7130094bc64fdd9`. Reviewed physical lines: 1-306.

[Module](../../../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Fixed-byte-width unsigned integer writer and iterator decoder; zero-width writer is an omission mode, not an encoded integer stream. (rust/lance-encoding/src/utils/bytepack.rs:1-306)

## Complete range analysis

### Lines 1-8

SPDX/module comment explicitly distinguishes byte packing from bit packing; import Lance Error/Result. No file header or codec registration. (rust/lance-encoding/src/utils/bytepack.rs:1-8)

### Lines 9-24

Public U8BytePacker with private Vec<u8> data; private with_capacity reserves requested bytes, private append pushes u8. These are wrappers, not externally callable constructors. (rust/lance-encoding/src/utils/bytepack.rs:9-24)

### Lines 25-40

Public U16BytePacker has private Vec and private capacity*2 allocation without checked multiplication; append extends two little-endian bytes. (rust/lance-encoding/src/utils/bytepack.rs:25-40)

### Lines 41-56

Public U32BytePacker uses capacity*4 and four LE bytes per append; no internal validation beyond input u32 type. (rust/lance-encoding/src/utils/bytepack.rs:41-56)

### Lines 57-72

Public U64BytePacker uses capacity*8 and eight LE bytes. Allocation arithmetic may overflow or allocation may fail; constructors return Self rather than Result. (rust/lance-encoding/src/utils/bytepack.rs:57-72)

### Lines 73-91

Public BytepackedIntegerEncoder variants U8/U16/U32/U64 own their packers; Zero carries no data/count. Smallest possible width in docs means width selected from caller-provided max, not actual values or arbitrary bit widths. No Debug/Clone derive. (rust/lance-encoding/src/utils/bytepack.rs:73-91)

### Lines 92-107

Public with_capacity(capacity:usize,max_value:u64)->Self selects Zero for0, U8 through255, U16 through65535, U32 throughu32::MAX, U64 otherwise. Capacity is a reserve hint, not append limit. The original max and number of values are not retained. (rust/lance-encoding/src/utils/bytepack.rs:92-107)

### Lines 108-136

Public append(value:u64)->Result<()> rejects values exceeding chosen U8/U16/U32 width with InvalidInput naming value and width before mutation. A value exceeding original max still succeeds if selected width can hold it. U64 accepts everyu64. Zero accepts even u64::MAX and records nothing. Successful path calls append_trusted then Ok; omission exception is explicitly tested. (rust/lance-encoding/src/utils/bytepack.rs:108-136)

### Lines 137-156

Crate-visible append_trusted debug_asserts try_from success for U8/U16/U32 then casts to narrow integer. Release-mode invalid values can truncate; no runtime Result check. U64 appends directly; Zero no-ops. Caller must supply bounds when an index is enabled. Contextual full-zip writer selects max0 to suppress repetition index and still calls append_trusted, explaining why Zero discards arbitrary offsets. (rust/lance-encoding/src/encodings/logical/primitive.rs:6555-6607) (rust/lance-encoding/src/utils/bytepack.rs:137-156)

### Lines 157-168

Public into_data consumes encoder and moves backing Vec, or returns empty Vec for Zero. No width, length, magic, checksum or terminator accompanies bytes; caller must know width/count externally. (rust/lance-encoding/src/utils/bytepack.rs:157-168)

### Lines 169-176

Public ByteUnpacker<I:Iterator<Item=u8>> enum has only U8/U16/U32/U64 variants over the iterator; no Zero or count-bearing variant. (rust/lance-encoding/src/utils/bytepack.rs:169-176)

### Lines 177-189

Public generic new<I:IntoIterator<IntoIter=T>>(data,size:usize)->impl Iterator<Item=u64> accepts sizes1,2,4,8, consumes data.into_iter, otherwise panics Invalid size. clippy allowance acknowledges new does not spell Self return. It does not check byte length divisibility. Passing size0 for Zero output is invalid even when empty. (rust/lance-encoding/src/utils/bytepack.rs:177-189)

### Lines 190-225

Iterator impl Item=u64. next returns None only if first byte is absent; remaining1/3/7 bytes unwrap and panic on truncated final element after consuming its prefix. Multi-byte values use from_le_bytes. U8 simply widens. No explicit size_hint, exact-size/fused guarantee or framing count is added. (rust/lance-encoding/src/utils/bytepack.rs:190-225)

### Lines 226-289

cfg(test) module test_bytepacked_integer_encoder covers all four widths, exact byte vectors and round-trip collect. Inputs: [50,20,30] width1; [500,200,300] width2; [500000,200000,300000] width4; [0x5000000000,0x2000000000,0x3000000000] width8. Full literal expected bytes preserved below. (rust/lance-encoding/src/utils/bytepack.rs:226-289)

### Lines 290-306

test_bytepacked_integer_encoder_rejects_overflow loops U8/U16/U32 max+1, asserts error text contains width, then asserts Zero accepts u64::MAX and yields empty data. No invalid-size/truncated-stream, unchanged-state-on-error, release trusted-overflow or capacity overflow test here; no tests executed. (rust/lance-encoding/src/utils/bytepack.rs:290-306)

## Interaction and interpretation limits

All physical lines were read in bounded source outputs during ANALYZE72. Offline, read-only inspection; no Lance build, test, lint, benchmark, generator or dependency installation ran. Exact declarations are preserved below and in the symbol index. Other files are only covered at cited contextual ranges; no whole-crate completion or runtime validation is implied.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Utilities for byte (not bit) packing for situations where saving a few
    5 | //! bits is less important than simplicity and speed.
    6 | 
    7 | use lance_core::{Error, Result};
    8 | 
    9 | pub struct U8BytePacker {
   10 |     data: Vec<u8>,
   11 | }
   12 | 
   13 | impl U8BytePacker {
   14 |     fn with_capacity(capacity: usize) -> Self {
   15 |         Self {
   16 |             data: Vec::with_capacity(capacity),
   17 |         }
   18 |     }
   19 | 
   20 |     fn append(&mut self, value: u8) {
   21 |         self.data.push(value);
   22 |     }
   23 | }
   24 | 
   25 | pub struct U16BytePacker {
   26 |     data: Vec<u8>,
   27 | }
   28 | 
   29 | impl U16BytePacker {
   30 |     fn with_capacity(capacity: usize) -> Self {
   31 |         Self {
   32 |             data: Vec::with_capacity(capacity * 2),
   33 |         }
   34 |     }
   35 | 
   36 |     fn append(&mut self, value: u16) {
   37 |         self.data.extend_from_slice(&value.to_le_bytes());
   38 |     }
   39 | }
   40 | 
   41 | pub struct U32BytePacker {
   42 |     data: Vec<u8>,
   43 | }
   44 | 
   45 | impl U32BytePacker {
   46 |     fn with_capacity(capacity: usize) -> Self {
   47 |         Self {
   48 |             data: Vec::with_capacity(capacity * 4),
   49 |         }
   50 |     }
   51 | 
   52 |     fn append(&mut self, value: u32) {
   53 |         self.data.extend_from_slice(&value.to_le_bytes());
   54 |     }
   55 | }
   56 | 
   57 | pub struct U64BytePacker {
   58 |     data: Vec<u8>,
   59 | }
   60 | 
   61 | impl U64BytePacker {
   62 |     fn with_capacity(capacity: usize) -> Self {
   63 |         Self {
   64 |             data: Vec::with_capacity(capacity * 8),
   65 |         }
   66 |     }
   67 | 
   68 |     fn append(&mut self, value: u64) {
   69 |         self.data.extend_from_slice(&value.to_le_bytes());
   70 |     }
   71 | }
   72 | 
   73 | /// A bytepacked integer encoder that automatically chooses the smallest
   74 | /// possible integer type to store the given values.
   75 | ///
   76 | /// This is byte packing (not bit packing).  Not even that, we only fit things into
   77 | /// sizes of 1,2,4,8 bytes.  It's simple, fast, and easy but doesn't provide the
   78 | /// maximum possible compression.
   79 | ///
   80 | /// Still, it's useful for things like offsets which are often small and fit into a
   81 | /// u16 or u32 but sometimes might need the full u64 range.
   82 | ///
   83 | /// In the future we can investigate replacing this with something more sophisticated.
   84 | pub enum BytepackedIntegerEncoder {
   85 |     U8(U8BytePacker),
   86 |     U16(U16BytePacker),
   87 |     U32(U32BytePacker),
   88 |     U64(U64BytePacker),
   89 |     Zero,
   90 | }
   91 | 
   92 | impl BytepackedIntegerEncoder {
   93 |     /// Create a new encoder with the given capacity and maximum value.
   94 |     pub fn with_capacity(capacity: usize, max_value: u64) -> Self {
   95 |         if max_value == 0 {
   96 |             Self::Zero
   97 |         } else if max_value <= u8::MAX as u64 {
   98 |             Self::U8(U8BytePacker::with_capacity(capacity))
   99 |         } else if max_value <= u16::MAX as u64 {
  100 |             Self::U16(U16BytePacker::with_capacity(capacity))
  101 |         } else if max_value <= u32::MAX as u64 {
  102 |             Self::U32(U32BytePacker::with_capacity(capacity))
  103 |         } else {
  104 |             Self::U64(U64BytePacker::with_capacity(capacity))
  105 |         }
  106 |     }
  107 | 
  108 |     /// Append a value to the encoder.
  109 |     ///
  110 |     /// # Errors
  111 |     ///
  112 |     /// Returns an error if `value` does not fit in the width selected at
  113 |     /// construction time.
  114 |     pub fn append(&mut self, value: u64) -> Result<()> {
  115 |         match self {
  116 |             Self::U8(_) if value > u8::MAX as u64 => {
  117 |                 return Err(Error::invalid_input(format!(
  118 |                     "value {value} does not fit in bytepacked u8"
  119 |                 )));
  120 |             }
  121 |             Self::U16(_) if value > u16::MAX as u64 => {
  122 |                 return Err(Error::invalid_input(format!(
  123 |                     "value {value} does not fit in bytepacked u16"
  124 |                 )));
  125 |             }
  126 |             Self::U32(_) if value > u32::MAX as u64 => {
  127 |                 return Err(Error::invalid_input(format!(
  128 |                     "value {value} does not fit in bytepacked u32"
  129 |                 )));
  130 |             }
  131 |             _ => {}
  132 |         }
  133 |         self.append_trusted(value);
  134 |         Ok(())
  135 |     }
  136 | 
  137 |     /// Append a value whose range is guaranteed by the caller's construction.
  138 |     pub(crate) fn append_trusted(&mut self, value: u64) {
  139 |         match self {
  140 |             Self::U8(packer) => {
  141 |                 debug_assert!(u8::try_from(value).is_ok());
  142 |                 packer.append(value as u8);
  143 |             }
  144 |             Self::U16(packer) => {
  145 |                 debug_assert!(u16::try_from(value).is_ok());
  146 |                 packer.append(value as u16);
  147 |             }
  148 |             Self::U32(packer) => {
  149 |                 debug_assert!(u32::try_from(value).is_ok());
  150 |                 packer.append(value as u32);
  151 |             }
  152 |             Self::U64(packer) => packer.append(value),
  153 |             Self::Zero => {}
  154 |         }
  155 |     }
  156 | 
  157 |     /// Convert the encoder into a vector of bytes.
  158 |     pub fn into_data(self) -> Vec<u8> {
  159 |         match self {
  160 |             Self::U8(packer) => packer.data,
  161 |             Self::U16(packer) => packer.data,
  162 |             Self::U32(packer) => packer.data,
  163 |             Self::U64(packer) => packer.data,
  164 |             Self::Zero => Vec::new(),
  165 |         }
  166 |     }
  167 | }
  168 | 
  169 | /// An iterator that unpacks bytes into integers (currently only u64)
  170 | pub enum ByteUnpacker<I: Iterator<Item = u8>> {
  171 |     U8(I),
  172 |     U16(I),
  173 |     U32(I),
  174 |     U64(I),
  175 | }
  176 | 
  177 | impl<T: Iterator<Item = u8>> ByteUnpacker<T> {
  178 |     #[allow(clippy::new_ret_no_self)]
  179 |     pub fn new<I: IntoIterator<IntoIter = T>>(data: I, size: usize) -> impl Iterator<Item = u64> {
  180 |         match size {
  181 |             1 => Self::U8(data.into_iter()),
  182 |             2 => Self::U16(data.into_iter()),
  183 |             4 => Self::U32(data.into_iter()),
  184 |             8 => Self::U64(data.into_iter()),
  185 |             _ => panic!("Invalid size"),
  186 |         }
  187 |     }
  188 | }
  189 | 
  190 | impl<I: Iterator<Item = u8>> Iterator for ByteUnpacker<I> {
  191 |     type Item = u64;
  192 | 
  193 |     fn next(&mut self) -> Option<Self::Item> {
  194 |         match self {
  195 |             Self::U8(iter) => iter.next().map(|v| v as u64),
  196 |             Self::U16(iter) => {
  197 |                 let first_byte = iter.next()?;
  198 |                 Some(u16::from_le_bytes([first_byte, iter.next().unwrap()]) as u64)
  199 |             }
  200 |             Self::U32(iter) => {
  201 |                 let first_byte = iter.next()?;
  202 |                 Some(u32::from_le_bytes([
  203 |                     first_byte,
  204 |                     iter.next().unwrap(),
  205 |                     iter.next().unwrap(),
  206 |                     iter.next().unwrap(),
  207 |                 ]) as u64)
  208 |             }
  209 |             Self::U64(iter) => {
  210 |                 let first_byte = iter.next()?;
  211 |                 Some(u64::from_le_bytes([
  212 |                     first_byte,
  213 |                     iter.next().unwrap(),
  214 |                     iter.next().unwrap(),
  215 |                     iter.next().unwrap(),
  216 |                     iter.next().unwrap(),
  217 |                     iter.next().unwrap(),
  218 |                     iter.next().unwrap(),
  219 |                     iter.next().unwrap(),
  220 |                 ]))
  221 |             }
  222 |         }
  223 |     }
  224 | }
  225 | 
  226 | #[cfg(test)]
  227 | mod tests {
  228 |     use super::*;
  229 | 
  230 |     #[test]
  231 |     fn test_bytepacked_integer_encoder() {
  232 |         // Fits in u8
  233 |         let mut encoder = BytepackedIntegerEncoder::with_capacity(10, 100);
  234 |         encoder.append(50).unwrap();
  235 |         encoder.append(20).unwrap();
  236 |         encoder.append(30).unwrap();
  237 |         let data = encoder.into_data();
  238 |         assert_eq!(data, vec![50, 20, 30]);
  239 | 
  240 |         assert_eq!(
  241 |             ByteUnpacker::new(data, 1).collect::<Vec<_>>(),
  242 |             vec![50, 20, 30]
  243 |         );
  244 | 
  245 |         // Requires u16
  246 |         let mut encoder = BytepackedIntegerEncoder::with_capacity(10, 1000);
  247 |         encoder.append(500).unwrap();
  248 |         encoder.append(200).unwrap();
  249 |         encoder.append(300).unwrap();
  250 |         let data = encoder.into_data();
  251 |         assert_eq!(data, vec![244, 1, 200, 0, 44, 1]);
  252 | 
  253 |         assert_eq!(
  254 |             ByteUnpacker::new(data, 2).collect::<Vec<_>>(),
  255 |             vec![500, 200, 300]
  256 |         );
  257 | 
  258 |         // Requires u32
  259 |         let mut encoder = BytepackedIntegerEncoder::with_capacity(10, 1000000);
  260 |         encoder.append(500000).unwrap();
  261 |         encoder.append(200000).unwrap();
  262 |         encoder.append(300000).unwrap();
  263 |         let data = encoder.into_data();
  264 |         assert_eq!(data, vec![32, 161, 7, 0, 64, 13, 3, 0, 224, 147, 4, 0]);
  265 | 
  266 |         assert_eq!(
  267 |             ByteUnpacker::new(data, 4).collect::<Vec<_>>(),
  268 |             vec![500000, 200000, 300000]
  269 |         );
  270 | 
  271 |         // Requires u64
  272 |         let mut encoder = BytepackedIntegerEncoder::with_capacity(10, 0x10000000000);
  273 |         encoder.append(0x5000000000).unwrap();
  274 |         encoder.append(0x2000000000).unwrap();
  275 |         encoder.append(0x3000000000).unwrap();
  276 |         let data = encoder.into_data();
  277 |         assert_eq!(
  278 |             data,
  279 |             vec![
  280 |                 0, 0, 0, 0, 80, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 48, 0, 0, 0
  281 |             ]
  282 |         );
  283 | 
  284 |         assert_eq!(
  285 |             ByteUnpacker::new(data, 8).collect::<Vec<_>>(),
  286 |             vec![0x5000000000, 0x2000000000, 0x3000000000]
  287 |         );
  288 |     }
  289 | 
  290 |     #[test]
  291 |     fn test_bytepacked_integer_encoder_rejects_overflow() {
  292 |         for (max_value, invalid_value, expected_width) in [
  293 |             (u8::MAX as u64, u8::MAX as u64 + 1, "u8"),
  294 |             (u16::MAX as u64, u16::MAX as u64 + 1, "u16"),
  295 |             (u32::MAX as u64, u32::MAX as u64 + 1, "u32"),
  296 |         ] {
  297 |             let mut encoder = BytepackedIntegerEncoder::with_capacity(1, max_value);
  298 |             let error = encoder.append(invalid_value).unwrap_err();
  299 |             assert!(error.to_string().contains(expected_width), "{error}");
  300 |         }
  301 | 
  302 |         let mut disabled = BytepackedIntegerEncoder::with_capacity(1, 0);
  303 |         disabled.append(u64::MAX).unwrap();
  304 |         assert!(disabled.into_data().is_empty());
  305 |     }
  306 | }
``````
