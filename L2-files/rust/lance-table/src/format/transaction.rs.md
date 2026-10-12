> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/transaction.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `941f53ce541730599afaba8573a9a1fa81960e2e6766d4063434dfd71ea3249e`. Reviewed physical lines: 1-163.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public format-layer protobuf Transaction wrapper and conservative operation classification for schema-validation decisions; distinct from the transaction module builder type. (rust/lance-table/src/format/transaction.rs:1-163)

## Complete range analysis

### Lines 1-15

SPDX and module documentation motivate avoiding dependence on higher lance layers and postponing protobuf conversion. The comment says crate-local, but the actual pub struct and public format facade expose this type outside the crate; internal-use README policy is a separate issue. Imports generated pb. (rust/lance-table/src/format/transaction.rs:1-15)

### Lines 16-29

Clone/Debug/PartialEq Transaction contains a public inner:pb::Transaction; as_pb borrows it immutably. It is not an independent normalized Rust operation model, and direct public mutation can construct any protobuf state. No validation occurs in this wrapper. (rust/lance-table/src/format/transaction.rs:16-29)

### Lines 30-41

may_change_schema delegates to operation_may_change_schema(&inner). Docs motivate permitting non-schema-changing operations, including deletes, to repair existing invalid primary keys, while conservatively classifying unknown operations. This method returns a policy boolean and performs no primary-key validation or commit. (rust/lance-table/src/format/transaction.rs:30-41)

### Lines 42-54

Standalone classifier accepts &pb::Transaction, independent of encoded length or optional inline-manifest storage. For UpdateConfig it returns true when either field_metadata_updates or field_metadata is nonempty. A nonempty map containing an empty update still qualifies; table config-only changes do not. Comments explain a size-dependent commit bug avoidance, but actual caller ordering remains pending. (rust/lance-table/src/format/transaction.rs:42-54)

### Lines 55-70

Returns false for exactly Append, Delete, CreateIndex, Rewrite, DataReplacement, ReserveFragments, Update, UpdateMemWalState, UpdateBases and DataOverlay. Wildcard returns true for every other recognized variant and None (including unknown wire operations that decode to no known arm). It examines only operation variant and UpdateConfig field-map emptiness, not payload consistency or data validity. (rust/lance-table/src/format/transaction.rs:55-70)

### Lines 71-83

From<format::Transaction> for pb::Transaction moves inner out; reverse From wraps by value. Neither encodes wire bytes, clones payload, checks sizes nor validates schema despite the write-boundary serialize wording in docs. (rust/lance-table/src/format/transaction.rs:71-83)

### Lines 84-109

cfg(test) imports prost::Message. Exempt-delete test clones a default Delete transaction, enlarges tag to4MiB and asserts encoded_len grows beyond100 times small; both classifications remain false. It does not invoke manifest inline threshold logic, encode bytes or actually commit. (rust/lance-table/src/format/transaction.rs:84-109)

### Lines 110-124

DataOverlay exemption fixture uses default payload and asserts classifier false. The comment describes a prior invalid-primary-key upgrade scenario, but this local test does not construct that dataset or run validation. (rust/lance-table/src/format/transaction.rs:110-124)

### Lines 125-146

UpdateConfig fixture with config_updates only is exempt. Inserting field_metadata_updates entry0 holding an empty UpdateMap makes it schema-changing. Legacy field_metadata branch is implemented but not separately tested here. (rust/lance-table/src/format/transaction.rs:125-146)

### Lines 147-163

Overwrite default payload must classify true; default transaction with no operation also true. This is not an exhaustive operation matrix test. All tests were read, not executed. (rust/lance-table/src/format/transaction.rs:147-163)

## Interaction and interpretation limits

format facade reexports this wrapper and classifier at rust/lance-table/src/format.rs:30-30. Lexical search finds a separate transaction-module builder reexport at rust/lance-table/src/transaction.rs:44-44; that type and all commit/primary-key-validation consumers remain pending. This file alone does not establish operation conflict handling or commit durability.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Transaction struct for lance-table format layer.
    5 | //!
    6 | //! This struct is introduced to provide a Struct-first API for passing transaction
    7 | //! information within the lance-table crate. It mirrors the protobuf Transaction
    8 | //! message at a semantic level while remaining crate-local, so lance-table does
    9 | //! not depend on higher layers (e.g., lance crate).
   10 | //!
   11 | //! Conversion to protobuf occurs at the write boundary. See the `From<Transaction>`
   12 | //! implementation below.
   13 | 
   14 | use crate::format::pb;
   15 | 
   16 | #[derive(Clone, Debug, PartialEq)]
   17 | pub struct Transaction {
   18 |     /// Crate-local representation backing: protobuf Transaction.
   19 |     /// Keeping this simple avoids ring dependencies while still enabling
   20 |     /// Struct-first parameter passing in lance-table.
   21 |     pub inner: pb::Transaction,
   22 | }
   23 | 
   24 | impl Transaction {
   25 |     /// Accessor for testing or internal inspection if needed.
   26 |     pub fn as_pb(&self) -> &pb::Transaction {
   27 |         &self.inner
   28 |     }
   29 | 
   30 |     /// Whether this transaction can change the schema, and so can introduce or
   31 |     /// worsen an invalid primary key.
   32 |     ///
   33 |     /// The rest leave the key exactly as they found it, so a table that already
   34 |     /// carries an invalid one stays writable through them -- including the
   35 |     /// deletes needed to repair it. An unrecognized operation counts as
   36 |     /// schema-changing: an unknown write is not a safe one to exempt.
   37 |     pub fn may_change_schema(&self) -> bool {
   38 |         operation_may_change_schema(&self.inner)
   39 |     }
   40 | }
   41 | 
   42 | /// The same classification for a protobuf that has not been wrapped yet.
   43 | ///
   44 | /// The commit path has to classify the operation before it knows whether the
   45 | /// encoded bytes are small enough to inline into the manifest. Reading the
   46 | /// disposition off the inline copy instead would tie it to the payload size,
   47 | /// so the identical operation would be classified one way under the inline
   48 | /// limit and the other way above it.
   49 | pub fn operation_may_change_schema(transaction: &pb::Transaction) -> bool {
   50 |     use pb::transaction::Operation;
   51 |     match transaction.operation.as_ref() {
   52 |         Some(Operation::UpdateConfig(update)) => {
   53 |             !update.field_metadata_updates.is_empty() || !update.field_metadata.is_empty()
   54 |         }
   55 |         Some(
   56 |             Operation::Append(_)
   57 |             | Operation::Delete(_)
   58 |             | Operation::CreateIndex(_)
   59 |             | Operation::Rewrite(_)
   60 |             | Operation::DataReplacement(_)
   61 |             | Operation::ReserveFragments(_)
   62 |             | Operation::Update(_)
   63 |             | Operation::UpdateMemWalState(_)
   64 |             | Operation::UpdateBases(_)
   65 |             | Operation::DataOverlay(_),
   66 |         ) => false,
   67 |         _ => true,
   68 |     }
   69 | }
   70 | 
   71 | /// Write-boundary conversion: serialize using protobuf at the last step.
   72 | impl From<Transaction> for pb::Transaction {
   73 |     fn from(tx: Transaction) -> Self {
   74 |         tx.inner
   75 |     }
   76 | }
   77 | 
   78 | impl From<pb::Transaction> for Transaction {
   79 |     fn from(pb_tx: pb::Transaction) -> Self {
   80 |         Self { inner: pb_tx }
   81 |     }
   82 | }
   83 | 
   84 | #[cfg(test)]
   85 | mod tests {
   86 |     use super::*;
   87 |     use prost::Message;
   88 | 
   89 |     /// The classification that must never depend on payload size. A MemWAL
   90 |     /// table's transactions carry mem-table state and routinely outgrow the
   91 |     /// inline limit, so an exempt operation has to stay exempt while large --
   92 |     /// otherwise the deletes that repair an invalid key are blocked on exactly
   93 |     /// the tables most likely to have one.
   94 |     #[test]
   95 |     fn an_exempt_operation_is_classified_the_same_at_any_size() {
   96 |         let small = pb::Transaction {
   97 |             operation: Some(pb::transaction::Operation::Delete(
   98 |                 pb::transaction::Delete::default(),
   99 |             )),
  100 |             ..Default::default()
  101 |         };
  102 |         let mut large = small.clone();
  103 |         large.tag = "x".repeat(4 * 1024 * 1024);
  104 | 
  105 |         assert!(large.encoded_len() > small.encoded_len() * 100);
  106 |         assert!(!operation_may_change_schema(&small));
  107 |         assert!(!operation_may_change_schema(&large));
  108 |     }
  109 | 
  110 |     /// An overlay attaches files to existing fragments and supplies new cell
  111 |     /// values; it carries no schema. Omitting it left a legacy nullable-key
  112 |     /// dataset unable to commit one, which is the upgrade path this exemption
  113 |     /// exists to keep open.
  114 |     #[test]
  115 |     fn a_data_overlay_is_exempt() {
  116 |         let overlay = pb::Transaction {
  117 |             operation: Some(pb::transaction::Operation::DataOverlay(
  118 |                 pb::transaction::DataOverlay::default(),
  119 |             )),
  120 |             ..Default::default()
  121 |         };
  122 |         assert!(!operation_may_change_schema(&overlay));
  123 |     }
  124 | 
  125 |     #[test]
  126 |     fn field_metadata_updates_change_schema() {
  127 |         let mut update = pb::transaction::UpdateConfig {
  128 |             config_updates: Some(pb::transaction::UpdateMap::default()),
  129 |             ..Default::default()
  130 |         };
  131 |         let config_only = pb::Transaction {
  132 |             operation: Some(pb::transaction::Operation::UpdateConfig(update.clone())),
  133 |             ..Default::default()
  134 |         };
  135 |         assert!(!operation_may_change_schema(&config_only));
  136 | 
  137 |         update
  138 |             .field_metadata_updates
  139 |             .insert(0, pb::transaction::UpdateMap::default());
  140 |         let field_update = pb::Transaction {
  141 |             operation: Some(pb::transaction::Operation::UpdateConfig(update)),
  142 |             ..Default::default()
  143 |         };
  144 |         assert!(operation_may_change_schema(&field_update));
  145 |     }
  146 | 
  147 |     /// And the converse, so the exemption cannot silently widen to everything.
  148 |     #[test]
  149 |     fn a_schema_carrying_operation_is_never_exempt() {
  150 |         let overwrite = pb::Transaction {
  151 |             operation: Some(pb::transaction::Operation::Overwrite(
  152 |                 pb::transaction::Overwrite::default(),
  153 |             )),
  154 |             ..Default::default()
  155 |         };
  156 |         assert!(operation_may_change_schema(&overwrite));
  157 | 
  158 |         // An operation this build does not recognise must not be exempt
  159 |         // either: an unknown write is not a safe one to skip.
  160 |         let unknown = pb::Transaction::default();
  161 |         assert!(operation_may_change_schema(&unknown));
  162 |     }
  163 | }
``````
