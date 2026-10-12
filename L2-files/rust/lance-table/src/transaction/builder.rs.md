> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/builder.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `03cb67c4380a6b1fce0199bce565367c75f80799a79f85ae65634f16895571b3`. Reviewed physical lines: 1-90.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Transaction data and consuming builder with optional UUID generation; publicly reexported by transaction facade. (rust/lance-table/src/transaction/builder.rs:1-90)

## Complete range analysis

### Lines 1-11

SPDX, role docs and imports: Operation, DeepSizeOf, HashMap/Arc and UUID. Constructors only assemble in-memory objects and generate UUIDs; no dataset/store dependency or explicit validation routine. (rust/lance-table/src/transaction/builder.rs:1-11)

### Lines 12-26

Public Transaction derives Debug/Clone/DeepSizeOf/PartialEq. Public fields: read_version:u64 (docs first transaction should be0), uuid:String, operation:Operation, tag:Option<String>, transaction_properties:Option<Arc<HashMap<String,String>>>. All fields remain externally mutable; read-version/UUID/property consistency is not enforced by this struct. Derived equality delegates Operation to its separate handwritten PartialEq (rust/lance-table/src/transaction/conflicts.rs:18-29). (rust/lance-table/src/transaction/builder.rs:12-26)

### Lines 27-36

Public TransactionBuilder owns the same fields privately, except UUID is Option<String>. No Default/Clone/Debug derive. It permits arbitrary UUID strings, versions, tag and properties through constructors/setters; no typestate or checked validation stage. (rust/lance-table/src/transaction/builder.rs:27-36)

### Lines 37-47

new(read_version,operation)->Self moves required inputs, leaves UUID/tag/properties None. No UUID is generated until build. (rust/lance-table/src/transaction/builder.rs:37-47)

### Lines 48-57

Consuming uuid(String)->Self stores Some, replacing prior optional UUID. Consuming tag(Option<String>)->Self replaces or clears tag. Both return the modified owned builder; neither validates empty strings. (rust/lance-table/src/transaction/builder.rs:48-57)

### Lines 58-65

Consuming transaction_properties(Option<Arc<HashMap<String,String>>>)->Self moves the option/Arc, replacing or clearing it without cloning map contents or validating names/values. (rust/lance-table/src/transaction/builder.rs:58-65)

### Lines 66-79

build(self)->Transaction preserves supplied UUID verbatim, including empty/malformed strings; only absent UUID lazily invokes Uuid::new_v4().hyphenated().to_string(). It moves all owned fields and returns Transaction directly, not Result. No operation validation or version lookup. Allocation/generator dependency failures are not converted to Lance errors here. (rust/lance-table/src/transaction/builder.rs:66-79)

### Lines 80-90

Transaction::new_from_version(read_version,operation) delegates new+build, leaving tag/properties None. Transaction::new(read_version,operation,tag) adds tag setter then build. Both generate a UUID through the builder and do not make commits/retries. No tests, async functions, locks or unsafe code in this file. (rust/lance-table/src/transaction/builder.rs:80-90)

## Interaction and interpretation limits

All90 lines read. Constructor API is complete; Transaction implementations in other private child modules remain only partially analyzed. Generated UUID uniqueness/randomness and macro-generated sizing/equality are not independently measured or expanded. No local tests or runtime execution.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! The transaction itself: an operation plus the version it was based on.
    5 | 
    6 | use crate::transaction::Operation;
    7 | use lance_core::deepsize::DeepSizeOf;
    8 | use std::collections::HashMap;
    9 | use std::sync::Arc;
   10 | use uuid::Uuid;
   11 | 
   12 | /// A change to a dataset that can be retried
   13 | ///
   14 | /// This contains enough information to be able to build the next manifest,
   15 | /// given the current manifest.
   16 | #[derive(Debug, Clone, DeepSizeOf, PartialEq)]
   17 | pub struct Transaction {
   18 |     /// The version of the table this transaction is based off of. If this is
   19 |     /// the first transaction, this should be 0.
   20 |     pub read_version: u64,
   21 |     pub uuid: String,
   22 |     pub operation: Operation,
   23 |     pub tag: Option<String>,
   24 |     pub transaction_properties: Option<Arc<HashMap<String, String>>>,
   25 | }
   26 | 
   27 | /// Add TransactionBuilder for flexibly setting option without using `mut`
   28 | pub struct TransactionBuilder {
   29 |     read_version: u64,
   30 |     // uuid is optional for builder since it can autogenerate
   31 |     uuid: Option<String>,
   32 |     operation: Operation,
   33 |     tag: Option<String>,
   34 |     transaction_properties: Option<Arc<HashMap<String, String>>>,
   35 | }
   36 | 
   37 | impl TransactionBuilder {
   38 |     pub fn new(read_version: u64, operation: Operation) -> Self {
   39 |         Self {
   40 |             read_version,
   41 |             uuid: None,
   42 |             operation,
   43 |             tag: None,
   44 |             transaction_properties: None,
   45 |         }
   46 |     }
   47 | 
   48 |     pub fn uuid(mut self, uuid: String) -> Self {
   49 |         self.uuid = Some(uuid);
   50 |         self
   51 |     }
   52 | 
   53 |     pub fn tag(mut self, tag: Option<String>) -> Self {
   54 |         self.tag = tag;
   55 |         self
   56 |     }
   57 | 
   58 |     pub fn transaction_properties(
   59 |         mut self,
   60 |         transaction_properties: Option<Arc<HashMap<String, String>>>,
   61 |     ) -> Self {
   62 |         self.transaction_properties = transaction_properties;
   63 |         self
   64 |     }
   65 | 
   66 |     pub fn build(self) -> Transaction {
   67 |         let uuid = self
   68 |             .uuid
   69 |             .unwrap_or_else(|| Uuid::new_v4().hyphenated().to_string());
   70 |         Transaction {
   71 |             read_version: self.read_version,
   72 |             uuid,
   73 |             operation: self.operation,
   74 |             tag: self.tag,
   75 |             transaction_properties: self.transaction_properties,
   76 |         }
   77 |     }
   78 | }
   79 | 
   80 | impl Transaction {
   81 |     pub fn new_from_version(read_version: u64, operation: Operation) -> Self {
   82 |         TransactionBuilder::new(read_version, operation).build()
   83 |     }
   84 | 
   85 |     pub fn new(read_version: u64, operation: Operation, tag: Option<String>) -> Self {
   86 |         TransactionBuilder::new(read_version, operation)
   87 |             .tag(tag)
   88 |             .build()
   89 |     }
   90 | }
``````
