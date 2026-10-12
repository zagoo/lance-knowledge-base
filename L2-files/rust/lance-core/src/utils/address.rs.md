> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/address.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a0f748e3adac6d3aeec8d6d25189a7ff8d73b752779d6add9c7913428ec2c9d2`. Reviewed physical lines: 1-116.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public RowAddress newtype and conversion/formatting helpers for physical fragment-plus-offset addresses. The inner u64 is private. Derived Copy/ordering/hash behavior and arithmetic determine the representation; it is distinct from a stable logical row ID. (rust/lance-core/src/utils/address.rs:1-116)

## Complete range analysis

### Lines 1-25

SPDX and Range import precede a doctest showing fragment 5/offset 100 construction, accessors, lossless u64 round trip and '(5, 100)' display. pub struct RowAddress(u64) derives Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash; ordering is the underlying integer order, hence fragment first then offset given its bit layout. No repr(transparent) attribute is declared, so do not promise an external memory ABI. (rust/lance-core/src/utils/address.rs:1-25)

### Lines 26-40

Public associated constants: FRAGMENT_SIZE:u64=1<<32, TOMBSTONE_FRAG:u32=0xffffffff, TOMBSTONE_ROW:u64=0xffffffffffffffff. new_from_u64(row_addr:u64)->Self wraps without checking. new_from_parts(fragment_id:u32,row_offset:u32)->Self combines fragment in upper 32 bits and offset in lower via shift and OR. Constructors do not reject reserved tombstone values, and cannot return errors. (rust/lance-core/src/utils/address.rs:26-40)

### Lines 41-58

first_row(fragment_id:u32)->Self delegates to new_from_parts(fragment_id,0). address_range(fragment_id:u32)->Range<u64> returns first_row(fragment)..first_row(fragment+1), half-open. The doctest checks boundaries for fragment 2. Addition fragment_id+1 has no checked_add/guard; callers must avoid u32::MAX, whose next fragment is unrepresentable and may panic with overflow checking or wrap without it. This is a source-derived edge case, not an executed test result. (rust/lance-core/src/utils/address.rs:41-58)

### Lines 59-79

fragment_id(&self)->u32 shifts right 32; row_offset(&self)->u32 truncates low 32. From<RowAddress> for u64 and From<u64> for RowAddress are lossless raw conversions with no validation and no allocation. Changing the packing changes the interpretation of raw physical-address values even if the From conversions still round-trip losslessly. (rust/lance-core/src/utils/address.rs:59-79)

### Lines 80-91

Debug::fmt(&self,f:&mut std::fmt::Formatter)->std::fmt::Result delegates to Display through write!. Display::fmt(&self,f:&mut Formatter<'_>)->fmt::Result writes '(fragment_id, row_offset)' using the accessors. No logging occurs: output goes to the supplied formatter, and formatting errors propagate as fmt::Result. (rust/lance-core/src/utils/address.rs:80-91)

### Lines 92-116

Private cfg(test) module imports the parent items. test_row_address checks raw 0x0000_0001_0000_0002 decodes 1/2, address_range(3).start, a 7/8 round trip and Debug '(1, 2)'. Doctests cover further Display and range-end assertions. Neither shown test exercises u32::MAX range overflow or constructor rejection because constructors do not reject. Tests were read but not run; no measured duration is claimed. (rust/lance-core/src/utils/address.rs:92-116)

## Interaction and interpretation limits

Local callees are new_from_parts, first_row, From conversion, accessors and write!/formatting (rust/lance-core/src/utils/address.rs:33-89). Repository-wide callers remain to be indexed during row-address/fragment analysis. No unsafe block, shared mutation or async operation occurs in this file. The reserved maximum-fragment boundary must be considered before using address_range with arbitrary u32 input (rust/lance-core/src/utils/address.rs:27-56).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::ops::Range;
    5 | 
    6 | /// A row address encodes a fragment ID (upper 32 bits) and row offset (lower 32 bits).
    7 | ///
    8 | /// ```
    9 | /// use lance_core::utils::address::RowAddress;
   10 | ///
   11 | /// let addr = RowAddress::new_from_parts(5, 100);
   12 | /// assert_eq!(addr.fragment_id(), 5);
   13 | /// assert_eq!(addr.row_offset(), 100);
   14 | ///
   15 | /// // Convert to/from u64
   16 | /// let raw: u64 = addr.into();
   17 | /// let addr2: RowAddress = raw.into();
   18 | /// assert_eq!(addr, addr2);
   19 | ///
   20 | /// // Display format
   21 | /// assert_eq!(format!("{}", addr), "(5, 100)");
   22 | /// ```
   23 | #[derive(Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
   24 | pub struct RowAddress(u64);
   25 | 
   26 | impl RowAddress {
   27 |     pub const FRAGMENT_SIZE: u64 = 1 << 32;
   28 |     /// A fragment id that will never be used.
   29 |     pub const TOMBSTONE_FRAG: u32 = 0xffffffff;
   30 |     /// A row id that will never be used.
   31 |     pub const TOMBSTONE_ROW: u64 = 0xffffffffffffffff;
   32 | 
   33 |     pub fn new_from_u64(row_addr: u64) -> Self {
   34 |         Self(row_addr)
   35 |     }
   36 | 
   37 |     pub fn new_from_parts(fragment_id: u32, row_offset: u32) -> Self {
   38 |         Self(((fragment_id as u64) << 32) | row_offset as u64)
   39 |     }
   40 | 
   41 |     /// Returns the address for the first row of a fragment.
   42 |     pub fn first_row(fragment_id: u32) -> Self {
   43 |         Self::new_from_parts(fragment_id, 0)
   44 |     }
   45 | 
   46 |     /// Returns the range of u64 addresses for a given fragment.
   47 |     ///
   48 |     /// ```
   49 |     /// use lance_core::utils::address::RowAddress;
   50 |     ///
   51 |     /// let range = RowAddress::address_range(2);
   52 |     /// assert_eq!(range.start, 2 * RowAddress::FRAGMENT_SIZE);
   53 |     /// assert_eq!(range.end, 3 * RowAddress::FRAGMENT_SIZE);
   54 |     /// ```
   55 |     pub fn address_range(fragment_id: u32) -> Range<u64> {
   56 |         u64::from(Self::first_row(fragment_id))..u64::from(Self::first_row(fragment_id + 1))
   57 |     }
   58 | 
   59 |     pub fn fragment_id(&self) -> u32 {
   60 |         (self.0 >> 32) as u32
   61 |     }
   62 | 
   63 |     pub fn row_offset(&self) -> u32 {
   64 |         self.0 as u32
   65 |     }
   66 | }
   67 | 
   68 | impl From<RowAddress> for u64 {
   69 |     fn from(row_addr: RowAddress) -> Self {
   70 |         row_addr.0
   71 |     }
   72 | }
   73 | 
   74 | impl From<u64> for RowAddress {
   75 |     fn from(row_addr: u64) -> Self {
   76 |         Self(row_addr)
   77 |     }
   78 | }
   79 | 
   80 | impl std::fmt::Debug for RowAddress {
   81 |     fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
   82 |         write!(f, "{}", self) // use Display
   83 |     }
   84 | }
   85 | 
   86 | impl std::fmt::Display for RowAddress {
   87 |     fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
   88 |         write!(f, "({}, {})", self.fragment_id(), self.row_offset())
   89 |     }
   90 | }
   91 | 
   92 | #[cfg(test)]
   93 | mod tests {
   94 |     use super::*;
   95 | 
   96 |     #[test]
   97 |     fn test_row_address() {
   98 |         // new_from_u64 (not in doctest)
   99 |         let addr = RowAddress::new_from_u64(0x0000_0001_0000_0002);
  100 |         assert_eq!(addr.fragment_id(), 1);
  101 |         assert_eq!(addr.row_offset(), 2);
  102 | 
  103 |         // address_range uses first_row internally (coverage)
  104 |         let range = RowAddress::address_range(3);
  105 |         assert_eq!(range.start, 3 * RowAddress::FRAGMENT_SIZE);
  106 | 
  107 |         // From impls with different values than doctest
  108 |         let addr2 = RowAddress::new_from_parts(7, 8);
  109 |         let raw: u64 = addr2.into();
  110 |         let addr3: RowAddress = raw.into();
  111 |         assert_eq!(addr2, addr3);
  112 | 
  113 |         // Debug format (doctest only tests Display)
  114 |         assert_eq!(format!("{:?}", addr), "(1, 2)");
  115 |     }
  116 | }
``````
