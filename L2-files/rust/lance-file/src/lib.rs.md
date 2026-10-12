> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/lib.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `6c03c48873148e178accdc5ca21376d66b27ed050c1e1c52c50e2be5e3284941`. Reviewed physical lines: 1-60.

[Module](../../../../L1-modules/rust-lance-file.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Crate module facade and asynchronous footer-only exact file-version recognition. (rust/lance-file/src/lib.rs:1-60)

## Complete range analysis

### Lines 1-18

SPDX; public concat,datatypes,format,reader,testing,version,versions,writer modules; io is pub(crate), compatibility_tests private cfg(test). Public LanceEncodingsIo reexport exposes selected IO type despite module visibility. Schema conversion, IO adapter, exact dispatch, writer facade and type checker are now covered; V2_1/V2_2/V2_3 concrete writers and shared structural pipeline are covered separately. The V2_0 writer, testing helpers, exact-version compatibility tests and fixture generator sources are also covered. writer_tests.rs is also fully analyzed. Shared reader metadata/index loading, local cache and read dispatch plus all its tests are now covered. Encoded-file concat compatibility, Blob part validation, page relocation and output lifecycle are now covered. The pinned V1, all three standard V2 and both embedded V2_0 binary fixtures are now fully interpreted in their supplements; all six binary fixtures are covered; decoder facade scheduling is now analyzed in cycle82; concrete logical codecs and backend IO remain pending. Frozen V1 projection/mapping, dictionary dispatch, metadata conversion/batch grouping and dense page-table helpers are now covered; their concrete binary/plain/dictionary codecs are now covered; full V1 reader is now analyzed; backend lifecycle remains pending. (rust/lance-file/src/lib.rs:1-18)

### Lines 19-35

Imports shared MAGIC, core errors, ObjectStore/Path and exact version. determine_file_version(store,path,known_size)->Result<ConcreteFileVersion> obtains size via await store.size only if unknown, checked-converts it to usize or InvalidInput with path. Supplied usize size is trusted without checking actual length; no explicit size lookup then. Underlying open behavior is delegated, so this does not prove all HEAD requests avoided. (rust/lance-file/src/lib.rs:19-35)

### Lines 36-55

Reject size<8 with InvalidInput source text and path, then await open_with_size and exactly requested range size-8..size. Compare footer[4..] to MAGIC; mismatch returns contextual InvalidInput. No explicit received-length check: fewer than4 returned bytes can panic on slice; other non8 lengths fail magic comparison. Store/range IO errors propagate. No full file parse or schema/page integrity check. (rust/lance-file/src/lib.rs:36-55)

### Lines 56-60

Decode first two little-endian u16 values from four bytes, then delegate ConcreteFileVersion::from_footer_numbers. Magic match implies exactly8 returned bytes for this equality check. Unknown version error lacks path because decoder formats just the pair. The helper recognizes accepted footer aliases only and cannot establish complete file validity. (rust/lance-file/src/lib.rs:56-60)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod concat;
    5 | pub mod datatypes;
    6 | pub mod format;
    7 | pub(crate) mod io;
    8 | pub mod reader;
    9 | pub mod testing;
   10 | pub mod version;
   11 | pub mod versions;
   12 | pub mod writer;
   13 | 
   14 | #[cfg(test)]
   15 | mod compatibility_tests;
   16 | 
   17 | pub use io::LanceEncodingsIo;
   18 | 
   19 | use format::MAGIC;
   20 | use lance_core::{Error, Result};
   21 | use lance_io::object_store::ObjectStore;
   22 | use object_store::path::Path;
   23 | use version::ConcreteFileVersion;
   24 | 
   25 | pub async fn determine_file_version(
   26 |     store: &ObjectStore,
   27 |     path: &Path,
   28 |     known_size: Option<usize>,
   29 | ) -> Result<ConcreteFileVersion> {
   30 |     let size = match known_size {
   31 |         None => usize::try_from(store.size(path).await?).map_err(|_| {
   32 |             Error::invalid_input(format!("file {} is too large for this platform", path))
   33 |         })?,
   34 |         Some(size) => size,
   35 |     };
   36 |     if size < 8 {
   37 |         return Err(Error::invalid_input_source(
   38 |             format!(
   39 |                 "the file {} does not appear to be a lance file (too small)",
   40 |                 path
   41 |             )
   42 |             .into(),
   43 |         ));
   44 |     }
   45 |     let reader = store.open_with_size(path, size).await?;
   46 |     let footer = reader.get_range((size - 8)..size).await?;
   47 |     if &footer[4..] != MAGIC {
   48 |         return Err(Error::invalid_input_source(
   49 |             format!(
   50 |                 "the file {} does not appear to be a lance file (magic mismatch)",
   51 |                 path
   52 |             )
   53 |             .into(),
   54 |         ));
   55 |     }
   56 |     let major_version = u16::from_le_bytes([footer[0], footer[1]]);
   57 |     let minor_version = u16::from_le_bytes([footer[2], footer[3]]);
   58 | 
   59 |     ConcreteFileVersion::from_footer_numbers(major_version, minor_version)
   60 | }
``````
