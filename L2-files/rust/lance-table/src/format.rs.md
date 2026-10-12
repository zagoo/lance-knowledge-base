> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4a1d3da76c4f38cb94ceb99859cacddf0e589720d0e61078d9b73bcaf94c4b45`. Reviewed physical lines: 1-78.

[Module](../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public metadata facade, generated table bindings, manifest footer identifiers and UUID conversions. (rust/lance-table/src/format.rs:1-78)

## Complete range analysis

### Lines 1-14

Imports Arrow byte-slice conversion and UUID. fragment, index, manifest, row_ids and transaction are private child modules, while key_existence and overlay are public. Visibility of reexported types is determined by the following explicit facade declarations. (rust/lance-table/src/format.rs:1-14)

### Lines 15-30

Reexports the three row dataset-version types from rowids::version; every public fragment item; IndexFile/IndexMetadata/index_metadata_codec/list_index_files_with_sizes; the listed manifest/version/schema-reader helpers; external/inline row-id types and reserved field IDs; Transaction and operation_may_change_schema. Private-module paths themselves remain inaccessible externally. Fragment, manifest and row-ID/transaction wrappers are now covered in their L2 entries; index metadata is now covered; row-version implementation is now covered at rust/lance-table/src/rowids/version.rs:1-1134; nested row-ID codecs are now covered at rust/lance-table/src/rowids/serde.rs:1-884; segment operations are now covered at rust/lance-table/src/rowids/segment.rs:1-1624; full sequence operations are now covered at rust/lance-table/src/rowids.rs:1-2309; row-ID index is now covered at rust/lance-table/src/rowids/index.rs:1-1641; table stream utilities are now covered at rust/lance-table/src/utils/stream.rs:1-1887; full Dataset transaction consumers remain pending. (rust/lance-table/src/format.rs:15-30)

### Lines 31-38

Uses core Error/Result. Public Index aliases IndexMetadata with deprecated(since=0.36.1, note=Use IndexMetadata instead); the preceding comment attributes the rename to trait-name conflicts. No wrapper object or conversion is introduced. (rust/lance-table/src/format.rs:31-38)

### Lines 39-50

Public pb module includes OUT_DIR/lance.table.rs generated during the build. Generated code relaxes the named Clippy/naming/unused/improper_ctypes lints locally. The module contains no handwritten wire definitions. (rust/lance-table/src/format.rs:39-50)

### Lines 51-56

Manifest footer identifiers are signed i16 MAJOR_VERSION=0, MINOR_VERSION=1 and four-byte MAGIC=LANC. These are table-manifest identifiers; this file does not specify footer byte order or data-file v2 version handling. (rust/lance-table/src/format.rs:51-56)

### Lines 57-70

TryFrom<&pb::Uuid> for uuid::Uuid rejects lengths other than16 with InvalidInput text Protobuf UUID is malformed. Otherwise copies bytes into a stack [u8;16] and constructs Uuid::from_bytes. It validates length, not UUID version/variant semantics. (rust/lance-table/src/format.rs:57-70)

### Lines 71-78

From<&Uuid> for pb::Uuid copies the UUID bytes into a new Vec field. Conversion is infallible and does not parse or format a textual UUID. (rust/lance-table/src/format.rs:71-78)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use arrow_buffer::ToByteSlice;
    5 | use uuid::Uuid;
    6 | 
    7 | mod fragment;
    8 | mod index;
    9 | pub mod key_existence;
   10 | mod manifest;
   11 | pub mod overlay;
   12 | mod row_ids;
   13 | mod transaction;
   14 | 
   15 | pub use crate::rowids::version::{
   16 |     RowDatasetVersionMeta, RowDatasetVersionRun, RowDatasetVersionSequence,
   17 | };
   18 | pub use fragment::*;
   19 | pub use index::{IndexFile, IndexMetadata, index_metadata_codec, list_index_files_with_sizes};
   20 | 
   21 | pub use manifest::{
   22 |     BasePath, DETACHED_VERSION_MASK, DataStorageFormat, Manifest, ManifestBuildConfig,
   23 |     SelfDescribingFileReader, WriterVersion, is_detached_version,
   24 |     populate_manifest_schema_dictionaries,
   25 | };
   26 | pub use row_ids::{
   27 |     ExternalFile, InlineRowIds, ROW_CREATED_AT_VERSION_FIELD_ID, ROW_ID_FIELD_ID,
   28 |     ROW_LAST_UPDATED_AT_VERSION_FIELD_ID, RowIdMeta,
   29 | };
   30 | pub use transaction::{Transaction, operation_may_change_schema};
   31 | 
   32 | use lance_core::{Error, Result};
   33 | 
   34 | // In 0.36.1 we renamed Index to IndexMetadata because Index conflicted too much with the
   35 | // Index trait.  This is left in for backward compatibility.
   36 | #[deprecated(since = "0.36.1", note = "Use IndexMetadata instead")]
   37 | pub type Index = IndexMetadata;
   38 | 
   39 | /// Protobuf definitions for Lance Format
   40 | pub mod pb {
   41 |     #![allow(clippy::all)]
   42 |     #![allow(non_upper_case_globals)]
   43 |     #![allow(non_camel_case_types)]
   44 |     #![allow(non_snake_case)]
   45 |     #![allow(unused)]
   46 |     #![allow(improper_ctypes)]
   47 |     #![allow(clippy::upper_case_acronyms)]
   48 |     #![allow(clippy::use_self)]
   49 |     include!(concat!(env!("OUT_DIR"), "/lance.table.rs"));
   50 | }
   51 | 
   52 | /// These version/magic values are written at the end of manifest files (e.g. versions/1.version)
   53 | pub const MAJOR_VERSION: i16 = 0;
   54 | pub const MINOR_VERSION: i16 = 1;
   55 | pub const MAGIC: &[u8; 4] = b"LANC";
   56 | 
   57 | impl TryFrom<&pb::Uuid> for Uuid {
   58 |     type Error = Error;
   59 | 
   60 |     fn try_from(p: &pb::Uuid) -> Result<Self> {
   61 |         if p.uuid.len() != 16 {
   62 |             return Err(Error::invalid_input(
   63 |                 "Protobuf UUID is malformed".to_string(),
   64 |             ));
   65 |         }
   66 |         let mut buf: [u8; 16] = [0; 16];
   67 |         buf.copy_from_slice(p.uuid.to_byte_slice());
   68 |         Ok(Self::from_bytes(buf))
   69 |     }
   70 | }
   71 | 
   72 | impl From<&Uuid> for pb::Uuid {
   73 |     fn from(value: &Uuid) -> Self {
   74 |         Self {
   75 |             uuid: value.into_bytes().to_vec(),
   76 |         }
   77 |     }
   78 | }
``````
