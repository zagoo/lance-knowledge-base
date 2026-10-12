> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/traits.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4f8d001652fb9cc97befee6e3de24d7ac521c8274b512ba71bf9321a7bd4b534`. Reviewed physical lines: 1-27.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Small dataset abstraction allowing row-taking through lance-core without a concrete lance Dataset dependency. Rust visibility is public, while its documentation explicitly labels it an Internal API. (rust/lance-core/src/traits.rs:1-27)

## Complete range analysis

### Lines 1-11

License and Dataset Traits module documentation precede Debug, RecordBatch, crate Result and datatypes::Schema imports. Both schema arguments are Lance core Schema, not Arrow Schema. (rust/lance-core/src/traits.rs:1-11)

### Lines 12-21

#[async_trait::async_trait] annotates pub trait DatasetTakeRows: Debug + Send + Sync. Its prose calls it TakeRow and says without the lance trait, but actual identifier and dependency boundary are DatasetTakeRows in lance-core. The HTML warning declares Internal API despite pub visibility. Implementors must satisfy debug formatting and thread-safety bounds; macro-expanded ABI/future signatures require the dependency implementation and are not fabricated here. (rust/lance-core/src/traits.rs:12-21)

### Lines 22-27

fn schema(&self) -> &Schema borrows dataset schema. async fn take_rows(&self, row_ids: &[u64], projection: &Schema) -> Result<RecordBatch> takes internal row IDs and projection, returning one batch or Lance error. No default implementation, row-order/missing-ID policy, cancellation behavior, IO, or tests exist here; those belong to implementors. Changing to physical addresses based solely on u64 representation would violate the documented row-ID meaning. (rust/lance-core/src/traits.rs:22-27)

## Interaction and interpretation limits

The concrete Dataset impl is declared at rust/lance/src/dataset.rs:4108-4108. Arc<dyn DatasetTakeRows> is used by IVF builder/IO interfaces at rust/lance/src/index/vector/ivf/builder.rs:250-250 and rust/lance/src/index/vector/ivf/io.rs:309-309. Only those lexical use sites have been inspected; execution semantics are still pending and the reference evidence is retained in analysis/iteration-003-references.txt.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Dataset Traits
    5 | 
    6 | use std::fmt::Debug;
    7 | 
    8 | use arrow_array::RecordBatch;
    9 | 
   10 | use crate::{Result, datatypes::Schema};
   11 | 
   12 | /// `TakeRow` trait.
   13 | ///
   14 | /// It offers a lightweight trait to use `take_rows()` over a dataset, without
   15 | /// depending on the `lance` trait.
   16 | ///
   17 | /// <section class="warning">
   18 | /// Internal API
   19 | /// </section>
   20 | #[async_trait::async_trait]
   21 | pub trait DatasetTakeRows: Debug + Send + Sync {
   22 |     /// The schema of the dataset.
   23 |     fn schema(&self) -> &Schema;
   24 | 
   25 |     /// Take rows by the internal ROW ids.
   26 |     async fn take_rows(&self, row_ids: &[u64], projection: &Schema) -> Result<RecordBatch>;
   27 | }
``````
