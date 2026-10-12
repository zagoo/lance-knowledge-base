> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/src/utils.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `7fa24db6ff2de6c3bd759b45206b52f95db28f9837b75a3408a46d8c512d5942`. Reviewed physical lines: 1-49.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Iterator extension attaching caller-supplied exact remaining size; also exposes stream utilities. (rust/lance-table/src/utils.rs:1-49)

## Complete range analysis

### Lines 1-10

SPDX prelude, public stream module and public LanceIteratorExtension trait. exact_size consumes Sized self and returns ExactSize<Self>; the trait declaration itself does not require Iterator. (rust/lance-table/src/utils.rs:1-10)

### Lines 11-19

Blanket implementation for every Iterator stores the original iterator and caller-provided usize size without counting or validation. No iteration or collection happens at construction. (rust/lance-table/src/utils.rs:11-19)

### Lines 20-29

ExactSize<I> is a public wrapper with private inner and size fields. Documentation motivates flatten-style precomputed sizes and links an upstream discussion; that URL was not accessed. (rust/lance-table/src/utils.rs:20-29)

### Lines 30-42

Iterator forwards Item. next polls inner, leaves size unchanged on None, and decrements by1 for every Some. The caller must supply the true remaining count: too small can underflow (panic when overflow checks apply, otherwise wrap); too large remains overreported even after inner exhaustion. No fused guarantee is added. (rust/lance-table/src/utils.rs:30-42)

### Lines 43-49

size_hint returns (size,Some(size)) unconditionally; ExactSizeIterator is implemented without overriding len or adding checks. This declaration trusts the constructor count and does not independently enforce the exact-size contract. (rust/lance-table/src/utils.rs:43-49)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod stream;
    5 | 
    6 | pub trait LanceIteratorExtension {
    7 |     fn exact_size(self, size: usize) -> ExactSize<Self>
    8 |     where
    9 |         Self: Sized;
   10 | }
   11 | 
   12 | impl<I: Iterator> LanceIteratorExtension for I {
   13 |     fn exact_size(self, size: usize) -> ExactSize<Self>
   14 |     where
   15 |         Self: Sized,
   16 |     {
   17 |         ExactSize { inner: self, size }
   18 |     }
   19 | }
   20 | 
   21 | /// A iterator that is tagged with a known size. This is useful when we are
   22 | /// able to pre-compute the size of the iterator but the iterator implementation
   23 | /// isn't able to itself. A common example is when using `flatten()`.
   24 | ///
   25 | /// This is inspired by discussion in <https://github.com/rust-lang/rust/issues/68995>
   26 | pub struct ExactSize<I> {
   27 |     inner: I,
   28 |     size: usize,
   29 | }
   30 | 
   31 | impl<I: Iterator> Iterator for ExactSize<I> {
   32 |     type Item = I::Item;
   33 | 
   34 |     fn next(&mut self) -> Option<Self::Item> {
   35 |         match self.inner.next() {
   36 |             None => None,
   37 |             Some(x) => {
   38 |                 self.size -= 1;
   39 |                 Some(x)
   40 |             }
   41 |         }
   42 |     }
   43 | 
   44 |     fn size_hint(&self) -> (usize, Option<usize>) {
   45 |         (self.size, Some(self.size))
   46 |     }
   47 | }
   48 | 
   49 | impl<T: Iterator> ExactSizeIterator for ExactSize<T> {}
``````
