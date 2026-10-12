> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/bit.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `24619b6b6db3e44fff92182140523489b8d2d2d59a7b32e9105bfed2b8741de7`. Reviewed physical lines: 1-153.

[Module](../../../../../L1-modules/rust-lance-core-storage.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public power-of-two, alignment-padding and bit-width helpers, a private lookup table, doctests and local numerical tests. (rust/lance-core/src/utils/bit.rs:1-153)

## Complete range analysis

### Lines 1-17

SPDX metadata and documentation introduce is_pwr_two(u64)->bool. It computes n&(n-1)==0. Doctest positives are one, two and 1024; negatives are three and 1000. Zero is not guarded: subtracting one underflows with checked arithmetic; when subtraction wraps, zero returns true. It is therefore not a total mathematical nonzero-power-of-two predicate. (rust/lance-core/src/utils/bit.rs:1-17)

### Lines 18-32

pad_bytes<const ALIGN:usize>(n:usize)->usize debug-asserts is_pwr_two(ALIGN as u64), then computes (ALIGN-(n&(ALIGN-1)))&(ALIGN-1). For a valid nonzero power-of-two alignment it gives zero for aligned n, otherwise bytes to next boundary, without first adding ALIGN to n. Doctest ALIGN=8 checks n=0/1/8/9 gives 0/7/0/7. Invalid alignment is not validated with a returned error and debug_assert may be disabled. (rust/lance-core/src/utils/bit.rs:18-32)

### Lines 33-47

pad_bytes_to(n:usize,align:usize)->usize implements the same mask formula and debug assertion with runtime alignment. Examples use alignment eight and the same four cases. Non-power-of-two inputs need not give modular padding, and zero can cause arithmetic underflow; no release-mode input validation is added. (rust/lance-core/src/utils/bit.rs:33-47)

### Lines 48-62

pad_bytes_u64<const ALIGN:u64>(n:u64)->u64 is the u64 version of the same mask formula and debug check; its examples mirror the usize functions. Correctness requires a nonzero power-of-two ALIGN. Arithmetic/checking behavior for invalid inputs follows the same unguarded subtractions. (rust/lance-core/src/utils/bit.rs:48-62)

### Lines 63-74

LOG_TABLE_256 is private [u8;256]. Despite the logarithm comment, entries encode bit width: 0->0, 1->1, 2..3->2, 4..7->3, doubling groups up to 128..255->8. It is a byte lookup for the routine below; there is no runtime table generation. (rust/lance-core/src/utils/bit.rs:63-74)

### Lines 75-110

log_2_ceil(val:u32)->u32 always asserts val>0. It selects the most significant nonzero byte via val>>16 and subsequent >>8 branches, returning the lookup width plus 0/8/16/24. The result is floor(log2(val))+1 for positive val, not mathematical ceil(log2(val)) at powers of two (e.g. 256 yields nine). Documentation examples follow this bit-width behavior. Two branch comments mislabel the tested byte ranges: the upper_half==0/third_quarter!=0 branch uses bits 8..16, and upper_half!=0/first_quarter==0 uses bits 16..24; the code shifts/offsets are authoritative. (rust/lance-core/src/utils/bit.rs:75-110)

### Lines 111-127

The cfg(test) module imports the helpers. test_bit_utils checks 4/1024 positive and 5 negative, then all three padding functions with 100 aligned to 64 giving 28. It omits zero is_pwr_two and invalid alignments. (rust/lance-core/src/utils/bit.rs:111-127)

### Lines 128-153

test_log_2_ceil defines a coverage-excluded local classic implementation counting right shifts until zero. It compares the optimized routine for 1..16384 plus 51200, 1<<30 and 100000, covering the byte-selection branches and bit-width semantics. It does not call zero or explicitly u32::MAX. The Stanford algorithm URL is a source comment and was not accessed; all tests were read, not run. (rust/lance-core/src/utils/bit.rs:128-153)

## Interaction and interpretation limits

These functions are pure arithmetic apart from assertions. Consumers may rely on current bit-width semantics despite the name; whole-repository uses remain pending. No claim of invalid-input safety or runtime test success is made. (rust/lance-core/src/utils/bit.rs:15-62; rust/lance-core/src/utils/bit.rs:75-153)

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Returns true if the given number is a power of two.
    5 | ///
    6 | /// ```
    7 | /// use lance_core::utils::bit::is_pwr_two;
    8 | ///
    9 | /// assert!(is_pwr_two(1));
   10 | /// assert!(is_pwr_two(2));
   11 | /// assert!(is_pwr_two(1024));
   12 | /// assert!(!is_pwr_two(3));
   13 | /// assert!(!is_pwr_two(1000));
   14 | /// ```
   15 | pub fn is_pwr_two(n: u64) -> bool {
   16 |     n & (n - 1) == 0
   17 | }
   18 | 
   19 | /// Returns the number of padding bytes needed to align `n` to `ALIGN`.
   20 | ///
   21 | /// ```
   22 | /// use lance_core::utils::bit::pad_bytes;
   23 | ///
   24 | /// assert_eq!(pad_bytes::<8>(0), 0);
   25 | /// assert_eq!(pad_bytes::<8>(1), 7);
   26 | /// assert_eq!(pad_bytes::<8>(8), 0);
   27 | /// assert_eq!(pad_bytes::<8>(9), 7);
   28 | /// ```
   29 | pub fn pad_bytes<const ALIGN: usize>(n: usize) -> usize {
   30 |     debug_assert!(is_pwr_two(ALIGN as u64));
   31 |     (ALIGN - (n & (ALIGN - 1))) & (ALIGN - 1)
   32 | }
   33 | 
   34 | /// Returns the number of padding bytes needed to align `n` to `align`.
   35 | ///
   36 | /// ```
   37 | /// use lance_core::utils::bit::pad_bytes_to;
   38 | ///
   39 | /// assert_eq!(pad_bytes_to(0, 8), 0);
   40 | /// assert_eq!(pad_bytes_to(1, 8), 7);
   41 | /// assert_eq!(pad_bytes_to(8, 8), 0);
   42 | /// assert_eq!(pad_bytes_to(9, 8), 7);
   43 | /// ```
   44 | pub fn pad_bytes_to(n: usize, align: usize) -> usize {
   45 |     debug_assert!(is_pwr_two(align as u64));
   46 |     (align - (n & (align - 1))) & (align - 1)
   47 | }
   48 | 
   49 | /// Returns the number of padding bytes needed to align `n` to `ALIGN` (u64 version).
   50 | ///
   51 | /// ```
   52 | /// use lance_core::utils::bit::pad_bytes_u64;
   53 | ///
   54 | /// assert_eq!(pad_bytes_u64::<8>(0), 0);
   55 | /// assert_eq!(pad_bytes_u64::<8>(1), 7);
   56 | /// assert_eq!(pad_bytes_u64::<8>(8), 0);
   57 | /// assert_eq!(pad_bytes_u64::<8>(9), 7);
   58 | /// ```
   59 | pub fn pad_bytes_u64<const ALIGN: u64>(n: u64) -> u64 {
   60 |     debug_assert!(is_pwr_two(ALIGN));
   61 |     (ALIGN - (n & (ALIGN - 1))) & (ALIGN - 1)
   62 | }
   63 | 
   64 | // This is a lookup table for the log2 of the first 256 numbers
   65 | const LOG_TABLE_256: [u8; 256] = [
   66 |     0, 1, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5,
   67 |     6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
   68 |     7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
   69 |     7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7,
   70 |     8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
   71 |     8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
   72 |     8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
   73 |     8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
   74 | ];
   75 | 
   76 | /// Returns the number of bits needed to represent the given number.
   77 | ///
   78 | /// Inspired by <https://graphics.stanford.edu/~seander/bithacks.html>
   79 | ///
   80 | /// ```
   81 | /// use lance_core::utils::bit::log_2_ceil;
   82 | ///
   83 | /// assert_eq!(log_2_ceil(1), 1);
   84 | /// assert_eq!(log_2_ceil(2), 2);
   85 | /// assert_eq!(log_2_ceil(255), 8);
   86 | /// assert_eq!(log_2_ceil(256), 9);
   87 | /// ```
   88 | pub fn log_2_ceil(val: u32) -> u32 {
   89 |     assert!(val > 0);
   90 |     let upper_half = val >> 16;
   91 |     if upper_half == 0 {
   92 |         let third_quarter = val >> 8;
   93 |         if third_quarter == 0 {
   94 |             // Use lowest 8 bits (upper 24 are 0)
   95 |             LOG_TABLE_256[val as usize] as u32
   96 |         } else {
   97 |             // Use bits 16..24 (0..16 are 0)
   98 |             LOG_TABLE_256[third_quarter as usize] as u32 + 8
   99 |         }
  100 |     } else {
  101 |         let first_quarter = upper_half >> 8;
  102 |         if first_quarter == 0 {
  103 |             // Use bits 8..16 (0..8 are 0)
  104 |             16 + LOG_TABLE_256[upper_half as usize] as u32
  105 |         } else {
  106 |             // Use most significant bits (it's a big number!)
  107 |             24 + LOG_TABLE_256[first_quarter as usize] as u32
  108 |         }
  109 |     }
  110 | }
  111 | 
  112 | #[cfg(test)]
  113 | mod tests {
  114 |     use crate::utils::bit::{is_pwr_two, log_2_ceil, pad_bytes, pad_bytes_to, pad_bytes_u64};
  115 | 
  116 |     #[test]
  117 |     fn test_bit_utils() {
  118 |         // Test values not in doctests
  119 |         assert!(is_pwr_two(4));
  120 |         assert!(is_pwr_two(1024));
  121 |         assert!(!is_pwr_two(5));
  122 | 
  123 |         // Test different alignment (64) not shown in doctests
  124 |         assert_eq!(pad_bytes::<64>(100), 28);
  125 |         assert_eq!(pad_bytes_to(100, 64), 28);
  126 |         assert_eq!(pad_bytes_u64::<64>(100), 28);
  127 |     }
  128 | 
  129 |     #[test]
  130 |     fn test_log_2_ceil() {
  131 |         #[cfg_attr(coverage, coverage(off))]
  132 |         fn classic_approach(mut val: u32) -> u32 {
  133 |             let mut counter = 0;
  134 |             while val > 0 {
  135 |                 val >>= 1;
  136 |                 counter += 1;
  137 |             }
  138 |             counter
  139 |         }
  140 | 
  141 |         for i in 1..(16 * 1024) {
  142 |             assert_eq!(log_2_ceil(i), classic_approach(i));
  143 |         }
  144 |         assert_eq!(log_2_ceil(50 * 1024), classic_approach(50 * 1024));
  145 |         assert_eq!(
  146 |             log_2_ceil(1024 * 1024 * 1024),
  147 |             classic_approach(1024 * 1024 * 1024)
  148 |         );
  149 |         // Cover the branch where upper_half != 0 but first_quarter == 0
  150 |         // (value between 2^16 and 2^24)
  151 |         assert_eq!(log_2_ceil(100_000), classic_approach(100_000));
  152 |     }
  153 | }
``````
