> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/bloomfilter/as_bytes.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b1b2ec2d67f72405c448465615b6407f286ae4aa0f338446ea0a8d66911724b8`. Reviewed physical lines: 1-164.

[Module](../../../../../../L1-modules/rust-lance-core-bloom.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public AsBytes trait and13 concrete primitive/string/slice implementations used as the canonical input byte representation for SBBF hashing. All numeric forms use explicit little-endian representation; borrowed textual/byte forms do not allocate. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:1-164)

## Complete range analysis

### Lines 1-14

SPDX and module docs describe a local counterpart to the Parquet AsBytes trait without that external dependency. Public AsBytes::as_bytes(&self)->impl AsRef<[u8]> allows implementations to return arrays or borrowed slices, rather than requiring one concrete return type or always allocating. The external reference is not fetched. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:1-14)

### Lines 15-38

AsBytes for i32/i64/f32/f64 returns each value's to_le_bytes fixed-size array. Width is4 or8 bytes; floating bit patterns are preserved, with no normalization for positive/negative zero or NaN payloads. This defines hash input bytes, not application-level numeric equality. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:15-38)

### Lines 39-63

u8 returns a one-element array with return bound AsRef<[Self]> (Self=u8); u16/u32/u64 return their little-endian arrays. No type tag or length prefix is included, so equal-width signed/unsigned values with equal bits have equal input bytes across implementations. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:39-63)

### Lines 64-87

i8 casts to u8 and returns that single byte, retaining the low-eight-bit representation; i16 uses to_le_bytes. str delegates to its inherent UTF-8 as_bytes and [u8] returns the borrowed slice unchanged. Neither borrowed form includes a terminator, copies payload bytes or normalizes Unicode. No explicit String or fixed-byte-array implementation is declared here. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:64-87)

### Lines 88-97

bool maps true to[1u8] and false to[0u8]. Those bytes overlap the corresponding u8 values by design; no logical-type discriminator is added. The private cfg(test) module imports the parent definitions. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:88-97)

### Lines 98-118

Signed integer tests check i32 hexadecimal0x12345678 gives[78,56,34,12] and i64 hexadecimal0x123456789ABCDEF0 gives[F0,DE,BC,9A,78,56,34,12], with exact4/8-byte lengths. They do not cover negative signed values or unsigned implementations. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:98-118)

### Lines 119-139

Float tests assert f32/f64 1.0 little-endian IEEE byte patterns and lengths. They omit signed zero, infinities, NaNs and alternative NaN payloads; no normalization requirement is implied by these positive fixtures. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:119-139)

### Lines 140-153

String test explicitly calls AsBytes::as_bytes on str hello and expects its UTF-8 bytes; byte-slice test retains[1,2,3,4,5]. Neither tests Unicode normalization or owned String generic inference. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:140-153)

### Lines 154-164

Boolean test checks both true->[1] and false->[0], then closes the module. All local assertions were inspected, not executed. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:154-164)

## Interaction and interpretation limits

The external reference URL is preserved as source attribution only; no network source was read. Scalar-index canonicalization, null handling and cross-language value mapping remain pending. Only the listed types implement AsBytes here, and floating equality normalization is absent. Tests were read, not executed. (rust/lance-core/src/utils/bloomfilter/as_bytes.rs:4-92; rust/lance-core/src/utils/bloomfilter/as_bytes.rs:94-164)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Local implementation of AsBytes trait
    5 | //!
    6 | //! This trait provides conversion from primitive types to byte slices,
    7 | //! similar to parquet::data_type::AsBytes but without the external dependency.
    8 | 
    9 | /// Trait to convert primitive types to byte slices
   10 | /// Reference: <https://arrow.apache.org/rust/src/parquet/data_type.rs.html>
   11 | pub trait AsBytes {
   12 |     /// Convert the value to a byte slice
   13 |     fn as_bytes(&self) -> impl AsRef<[u8]>;
   14 | }
   15 | 
   16 | impl AsBytes for i32 {
   17 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   18 |         self.to_le_bytes()
   19 |     }
   20 | }
   21 | 
   22 | impl AsBytes for i64 {
   23 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   24 |         self.to_le_bytes()
   25 |     }
   26 | }
   27 | 
   28 | impl AsBytes for f32 {
   29 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   30 |         self.to_le_bytes()
   31 |     }
   32 | }
   33 | 
   34 | impl AsBytes for f64 {
   35 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   36 |         self.to_le_bytes()
   37 |     }
   38 | }
   39 | 
   40 | impl AsBytes for u8 {
   41 |     fn as_bytes(&self) -> impl AsRef<[Self]> {
   42 |         [*self]
   43 |     }
   44 | }
   45 | 
   46 | impl AsBytes for u16 {
   47 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   48 |         self.to_le_bytes()
   49 |     }
   50 | }
   51 | 
   52 | impl AsBytes for u32 {
   53 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   54 |         self.to_le_bytes()
   55 |     }
   56 | }
   57 | 
   58 | impl AsBytes for u64 {
   59 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   60 |         self.to_le_bytes()
   61 |     }
   62 | }
   63 | 
   64 | impl AsBytes for i8 {
   65 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   66 |         [*self as u8]
   67 |     }
   68 | }
   69 | 
   70 | impl AsBytes for i16 {
   71 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   72 |         self.to_le_bytes()
   73 |     }
   74 | }
   75 | 
   76 | impl AsBytes for str {
   77 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   78 |         Self::as_bytes(self)
   79 |     }
   80 | }
   81 | 
   82 | impl AsBytes for [u8] {
   83 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   84 |         self
   85 |     }
   86 | }
   87 | 
   88 | impl AsBytes for bool {
   89 |     fn as_bytes(&self) -> impl AsRef<[u8]> {
   90 |         if *self { [1u8] } else { [0u8] }
   91 |     }
   92 | }
   93 | 
   94 | #[cfg(test)]
   95 | mod tests {
   96 |     use super::*;
   97 | 
   98 |     #[test]
   99 |     fn test_i32_as_bytes() {
  100 |         let val = 0x12345678i32;
  101 |         let bytes = val.as_bytes();
  102 |         assert_eq!(bytes.as_ref().len(), 4);
  103 |         // Check that we get the expected bytes in little-endian format
  104 |         assert_eq!(bytes.as_ref(), &[0x78, 0x56, 0x34, 0x12]);
  105 |     }
  106 | 
  107 |     #[test]
  108 |     fn test_i64_as_bytes() {
  109 |         let val = 0x123456789ABCDEF0i64;
  110 |         let bytes = val.as_bytes();
  111 |         assert_eq!(bytes.as_ref().len(), 8);
  112 |         // Check that we get the expected bytes in little-endian format
  113 |         assert_eq!(
  114 |             bytes.as_ref(),
  115 |             &[0xF0, 0xDE, 0xBC, 0x9A, 0x78, 0x56, 0x34, 0x12]
  116 |         );
  117 |     }
  118 | 
  119 |     #[test]
  120 |     fn test_f32_as_bytes() {
  121 |         let val = 1.0f32;
  122 |         let bytes = val.as_bytes();
  123 |         assert_eq!(bytes.as_ref().len(), 4);
  124 |         // f32 representation of 1.0 is [0x00, 0x00, 0x80, 0x3F] in little-endian
  125 |         assert_eq!(bytes.as_ref(), &[0x00, 0x00, 0x80, 0x3F]);
  126 |     }
  127 | 
  128 |     #[test]
  129 |     fn test_f64_as_bytes() {
  130 |         let val = 1.0f64;
  131 |         let bytes = val.as_bytes();
  132 |         assert_eq!(bytes.as_ref().len(), 8);
  133 |         // f64 representation of 1.0 is [0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F] in little-endian
  134 |         assert_eq!(
  135 |             bytes.as_ref(),
  136 |             &[0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xF0, 0x3F]
  137 |         );
  138 |     }
  139 | 
  140 |     #[test]
  141 |     fn test_str_as_bytes() {
  142 |         let val = "hello";
  143 |         let bytes = AsBytes::as_bytes(val);
  144 |         assert_eq!(bytes.as_ref(), b"hello");
  145 |     }
  146 | 
  147 |     #[test]
  148 |     fn test_slice_as_bytes() {
  149 |         let val: &[u8] = &[1, 2, 3, 4, 5];
  150 |         let bytes = val.as_bytes();
  151 |         assert_eq!(bytes.as_ref(), &[1, 2, 3, 4, 5]);
  152 |     }
  153 | 
  154 |     #[test]
  155 |     fn test_bool_as_bytes() {
  156 |         let val_true = true;
  157 |         let bytes_true = val_true.as_bytes();
  158 |         assert_eq!(bytes_true.as_ref(), &[1u8]);
  159 | 
  160 |         let val_false = false;
  161 |         let bytes_false = val_false.as_bytes();
  162 |         assert_eq!(bytes_false.as_ref(), &[0u8]);
  163 |     }
  164 | }
``````
