> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-core/src/utils/assume.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4b861f163fe38ceca7b28fa4a2183f22b6c85bd86b09f9885ee0b2f8d5577171`. Reviewed physical lines: 1-43.

[Module](../../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Exported checked assertion macros retaining the assume names while preserving safe release-mode checks. Macro exports are reachable at the lance_core crate root, despite being defined in utils::assume. (rust/lance-core/src/utils/assume.rs:1-43)

## Complete range analysis

### Lines 1-3

SPDX header and separator. (rust/lance-core/src/utils/assume.rs:1-3)

### Lines 4-18

#[macro_export] macro_rules! assume accepts either one expression or an expression plus formatting tokens, forwarding to assert! in both arms. Documentation explicitly rejects undefined behavior from invalid assumptions in safe Rust and promises checks in release builds. This is not debug_assert or unchecked compiler assumption; false conditions panic with default or supplied assertion message. (rust/lance-core/src/utils/assume.rs:4-18)

### Lines 19-29

#[macro_export] assume_eq accepts two expressions or those plus formatting tokens, forwarding to assert_eq!. Equality/debug-format trait requirements and evaluation details are inherited from that standard macro. It does not cast types, return a Result, or mark an impossible branch with unsafe code. (rust/lance-core/src/utils/assume.rs:19-29)

### Lines 30-43

Private cfg(test) tests assume_rejects_false_conditions and assume_eq_rejects_unequal_values use catch_unwind to assert both plain and custom-message arms panic. They do not test successful assertions, message contents, argument side effects or compile-time trait errors. Tests are retained in exact evidence and were not executed. (rust/lance-core/src/utils/assume.rs:30-43)

## Interaction and interpretation limits

Changing these wrappers to unchecked assumptions would violate their explicit safe-code contract (rust/lance-core/src/utils/assume.rs:4-28). Repository invocation sites and downstream expectations remain to be indexed; macros call only assert!/assert_eq! locally.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Assert an invariant that should also be visible to the optimizer.
    5 | ///
    6 | /// Unlike [`debug_assert!`], this remains checked in release builds. This is
    7 | /// required because the macro can be invoked from safe Rust and an invalid
    8 | /// assumption must not become undefined behavior.
    9 | #[macro_export]
   10 | macro_rules! assume {
   11 |     ($cond:expr) => {
   12 |         assert!($cond)
   13 |     };
   14 |     ($cond:expr, $($arg:tt)+) => {
   15 |         assert!($cond, $($arg)+)
   16 |     };
   17 | }
   18 | 
   19 | /// Helper macro for equality assumptions.
   20 | #[macro_export]
   21 | macro_rules! assume_eq {
   22 |     ($left:expr, $right:expr) => {
   23 |         assert_eq!($left, $right)
   24 |     };
   25 |     ($left:expr, $right:expr, $($arg:tt)+) => {
   26 |         assert_eq!($left, $right, $($arg)+)
   27 |     };
   28 | }
   29 | 
   30 | #[cfg(test)]
   31 | mod tests {
   32 |     #[test]
   33 |     fn assume_rejects_false_conditions() {
   34 |         assert!(std::panic::catch_unwind(|| assume!(false)).is_err());
   35 |         assert!(std::panic::catch_unwind(|| assume!(false, "invalid condition")).is_err());
   36 |     }
   37 | 
   38 |     #[test]
   39 |     fn assume_eq_rejects_unequal_values() {
   40 |         assert!(std::panic::catch_unwind(|| assume_eq!(1, 2)).is_err());
   41 |         assert!(std::panic::catch_unwind(|| assume_eq!(1, 2, "invalid equality")).is_err());
   42 |     }
   43 | }
``````
