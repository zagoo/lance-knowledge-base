> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen. Refresh 2026-10-12: [current coordinates and changed contracts](../../../../refresh-addenda/2026-10-12-011953c2.md) at `011953c22097b67b699595adbe99e7f0155d83e4` supersede affected historical statements; body remains frozen.

# rust/lance-core/src/lib.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `1dc8f04b575d437985afa2254cebf1ee33e7e8bcd1771728c605596fcdb3c51c`. Reviewed physical lines: 1-98.

[Module](../../../../L1-modules/rust-lance-core.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Crate root exporting common modules/errors, public system-column names and lazily initialized Arrow fields, and pure string-to-lineage/system classification functions. No per-dataset mutable state or IO is implemented here. (rust/lance-core/src/lib.rs:1-98)

## Complete range analysis

### Lines 1-10

SPDX comments and cfg_attr(coverage, feature(coverage_attribute)) enable coverage-only compiler support. extern crate self as lance_core lets derive expansion refer to this crate by its external name. Imports are Arrow DataType/Field (aliased ArrowField) and std::sync::LazyLock. (rust/lance-core/src/lib.rs:1-10)

### Lines 11-21

Public modules are cache, container, datatypes, deepsize, error, levenshtein, traits, utils. The root publicly re-exports ArrowResult, Error, FenceReason, Result and box_error from error. Re-export signatures and variant contracts require error.rs analysis; root visibility alone does not reconstruct them. (rust/lance-core/src/lib.rs:11-21)

### Lines 22-34

Public &str constants are WILDCARD='*' for non-system columns; ROW_ID='_rowid'; ROW_ADDR='_rowaddr'; ROW_OFFSET='_rowoffset'; ROW_LAST_UPDATED_AT_VERSION='_row_last_updated_at_version'; ROW_CREATED_AT_VERSION='_row_created_at_version'. These exact strings form cross-module schema identity, so renaming changes caller matching and column references. (rust/lance-core/src/lib.rs:22-34)

### Lines 35-53

Five public LazyLock<ArrowField> statics use corresponding names, DataType::UInt64, and nullable=true. ROW_ID_FIELD and ROW_ADDR_FIELD comments explain validity bitmaps can be selection vectors; ROW_OFFSET_FIELD stays nullable for compatibility. Creation/update-version fields are also nullable in code. These logical scan fields differ from the persisted non-null hidden-lineage columns required by the schema (protos/fragment_metadata.proto:288-305); do not infer a format contradiction simply from different nullability. (rust/lance-core/src/lib.rs:35-53)

### Lines 54-66

Public i32 reserved IDs are ROW_ID_FIELD_ID=-3, ROW_CREATED_AT_VERSION_FIELD_ID=-4, ROW_LAST_UPDATED_AT_VERSION_FIELD_ID=-5. Comments reserve all negatives, naming -1 unassigned and -2 tombstoned. The prose writes '-3..=-5' informally, not as executable Rust range syntax. Exact numeric identities agree with fragment metadata (protos/fragment_metadata.proto:288-305). (rust/lance-core/src/lib.rs:54-66)

### Lines 67-80

pub fn row_lineage_field_id(column_name: &str) -> Option<i32> is an exact, case-sensitive match: row-ID/created/update names return -3/-4/-5 respectively; every other string, including row address and row offset, returns None. It performs no allocation, IO, mutation, or fallible operation; its only callees are language match/Option construction. The comments identify these as the only negative IDs a physical data-file schema may carry, distinct from fragment field-mapping tombstones. Exact names and reserved numeric values are declared at rust/lance-core/src/lib.rs:22-65. (rust/lance-core/src/lib.rs:67-80)

### Lines 81-98

pub fn is_system_column(column_name: &str) -> bool uses matches! for the five row metadata names, returning false for all other strings including '*'. It is exact/case-sensitive, with no allocation, IO or error path. Comments call all system columns virtual and say user write paths must reject stored names because scanners inject them. This broad prose coexists with the explicit hidden-lineage physical-column facility above; the function itself does not enforce a write restriction or distinguish user fields from internal lineage writes. No unit-test module is present in this file. (rust/lance-core/src/lib.rs:81-98)

## Interaction and interpretation limits

Reference search finds lineage matching in schema projection/version handling (rust/lance-core/src/datatypes/schema.rs:357-357; rust/lance/src/dataset/versions/mod.rs:205-205), and system-name checks in write insertion and projection (rust/lance/src/dataset/write/insert.rs:379-379; rust/lance-datafusion/src/projection.rs:309-309). These are observed lexical use sites; surrounding lifecycles/callers are not yet fully analyzed. Evidence of matching lines is retained in analysis/iteration-003-references.txt.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | #![cfg_attr(coverage, feature(coverage_attribute))]
    4 | 
    5 | // Allow the derive macro to reference `lance_core::deepsize` from within this crate.
    6 | extern crate self as lance_core;
    7 | 
    8 | use arrow_schema::{DataType, Field as ArrowField};
    9 | use std::sync::LazyLock;
   10 | 
   11 | pub mod cache;
   12 | pub mod container;
   13 | pub mod datatypes;
   14 | pub mod deepsize;
   15 | pub mod error;
   16 | pub mod levenshtein;
   17 | pub mod traits;
   18 | pub mod utils;
   19 | 
   20 | pub use error::{ArrowResult, Error, FenceReason, Result, box_error};
   21 | 
   22 | /// Wildcard to indicate all non-system columns
   23 | pub const WILDCARD: &str = "*";
   24 | /// Column name for the meta row ID.
   25 | pub const ROW_ID: &str = "_rowid";
   26 | /// Column name for the meta row address.
   27 | pub const ROW_ADDR: &str = "_rowaddr";
   28 | /// Column name for the meta row offset.
   29 | pub const ROW_OFFSET: &str = "_rowoffset";
   30 | /// Column name for the row's last updated at dataset version.
   31 | pub const ROW_LAST_UPDATED_AT_VERSION: &str = "_row_last_updated_at_version";
   32 | /// Column name for the row's created at dataset version.
   33 | pub const ROW_CREATED_AT_VERSION: &str = "_row_created_at_version";
   34 | 
   35 | /// Row ID field. This is nullable because its validity bitmap is sometimes used
   36 | /// as a selection vector.
   37 | pub static ROW_ID_FIELD: LazyLock<ArrowField> =
   38 |     LazyLock::new(|| ArrowField::new(ROW_ID, DataType::UInt64, true));
   39 | /// Row address field. This is nullable because its validity bitmap is sometimes used
   40 | /// as a selection vector.
   41 | pub static ROW_ADDR_FIELD: LazyLock<ArrowField> =
   42 |     LazyLock::new(|| ArrowField::new(ROW_ADDR, DataType::UInt64, true));
   43 | /// Row offset field. This is nullable merely for compatibility with the other
   44 | /// fields.
   45 | pub static ROW_OFFSET_FIELD: LazyLock<ArrowField> =
   46 |     LazyLock::new(|| ArrowField::new(ROW_OFFSET, DataType::UInt64, true));
   47 | /// Row last updated at version field.
   48 | pub static ROW_LAST_UPDATED_AT_VERSION_FIELD: LazyLock<ArrowField> =
   49 |     LazyLock::new(|| ArrowField::new(ROW_LAST_UPDATED_AT_VERSION, DataType::UInt64, true));
   50 | /// Row created at version field.
   51 | pub static ROW_CREATED_AT_VERSION_FIELD: LazyLock<ArrowField> =
   52 |     LazyLock::new(|| ArrowField::new(ROW_CREATED_AT_VERSION, DataType::UInt64, true));
   53 | 
   54 | /// Field id of the hidden `_rowid` column a spilled row id sequence lives in.
   55 | ///
   56 | /// Field ids are `i32` and every negative value is reserved for system use:
   57 | /// `-1` is the unassigned sentinel, `-2` the tombstone for a field superseded by
   58 | /// a later data file, and `-3..=-5` the three row lineage columns.
   59 | pub const ROW_ID_FIELD_ID: i32 = -3;
   60 | /// Field id of the hidden `_row_created_at_version` column a spilled created-at
   61 | /// version sequence lives in.
   62 | pub const ROW_CREATED_AT_VERSION_FIELD_ID: i32 = -4;
   63 | /// Field id of the hidden `_row_last_updated_at_version` column a spilled
   64 | /// last-updated-at version sequence lives in.
   65 | pub const ROW_LAST_UPDATED_AT_VERSION_FIELD_ID: i32 = -5;
   66 | 
   67 | /// The reserved field id of a row lineage column, by column name.
   68 | ///
   69 | /// These are the only negative field ids a data file schema may carry: a
   70 | /// lineage sequence spilled into the fragment's own data file is written as a
   71 | /// column under this id, next to the user columns.
   72 | pub fn row_lineage_field_id(column_name: &str) -> Option<i32> {
   73 |     match column_name {
   74 |         ROW_ID => Some(ROW_ID_FIELD_ID),
   75 |         ROW_CREATED_AT_VERSION => Some(ROW_CREATED_AT_VERSION_FIELD_ID),
   76 |         ROW_LAST_UPDATED_AT_VERSION => Some(ROW_LAST_UPDATED_AT_VERSION_FIELD_ID),
   77 |         _ => None,
   78 |     }
   79 | }
   80 | 
   81 | /// Check if a column name is a system column.
   82 | ///
   83 | /// System columns are virtual columns that are computed at read time and don't
   84 | /// exist in the physical data files. They include:
   85 | /// - `_rowid`: The row ID
   86 | /// - `_rowaddr`: The row address
   87 | /// - `_rowoffset`: The row offset
   88 | /// - `_row_last_updated_at_version`: The version when the row was last updated
   89 | /// - `_row_created_at_version`: The version when the row was created
   90 | ///
   91 | /// Write paths must reject a stored column named for one: the scanner injects
   92 | /// these itself, so a stored copy collides with the injected one on read.
   93 | pub fn is_system_column(column_name: &str) -> bool {
   94 |     matches!(
   95 |         column_name,
   96 |         ROW_ID | ROW_ADDR | ROW_OFFSET | ROW_LAST_UPDATED_AT_VERSION | ROW_CREATED_AT_VERSION
   97 |     )
   98 | }
``````
