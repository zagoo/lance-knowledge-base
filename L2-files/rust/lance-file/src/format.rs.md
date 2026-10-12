> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/format.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c81394bb941d2e5c68350491259079bd8dd64625997d4c0c53260cf501afcb34`. Reviewed physical lines: 1-33.

[Module](../../../../L1-modules/rust-lance-file.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public generated protobuf modules and shared legacy file footer constants. (rust/lance-file/src/format.rs:1-33)

## Complete range analysis

### Lines 1-16

SPDX plus public pb module with local allow attributes for Clippy, naming, unused and improper ctypes. include! loads OUT_DIR/lance.file.rs generated at build time. This facade contains no handwritten field definitions or runtime parser. (rust/lance-file/src/format.rs:1-16)

### Lines 17-29

Public pbfile similarly relaxes generated-code lints and includes OUT_DIR/lance.file.v2.rs. Distinguishes protobuf packages/file envelopes from caller-facing file-version selectors. Generated source is absent until build; schemas remain authoritative source inputs. (rust/lance-file/src/format.rs:17-29)

### Lines 30-33

Public legacy file constants MAJOR_VERSION:i16=0,MINOR_VERSION:i16=2,MAGIC:&[u8;4]=LANC. The broad comment mentions versions/1.version, but these constants are not every format version and differ from table manifest minor1; current exact mappings live in version.rs. This declaration specifies values, not serialized byte order. (rust/lance-file/src/format.rs:30-33)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | /// Protobuf definitions for Lance Format
    5 | pub mod pb {
    6 |     #![allow(clippy::all)]
    7 |     #![allow(non_upper_case_globals)]
    8 |     #![allow(non_camel_case_types)]
    9 |     #![allow(non_snake_case)]
   10 |     #![allow(unused)]
   11 |     #![allow(improper_ctypes)]
   12 |     #![allow(clippy::upper_case_acronyms)]
   13 |     #![allow(clippy::use_self)]
   14 |     include!(concat!(env!("OUT_DIR"), "/lance.file.rs"));
   15 | }
   16 | 
   17 | /// Protobuf definitions for Lance Format v2
   18 | pub mod pbfile {
   19 |     #![allow(clippy::all)]
   20 |     #![allow(non_upper_case_globals)]
   21 |     #![allow(non_camel_case_types)]
   22 |     #![allow(non_snake_case)]
   23 |     #![allow(unused)]
   24 |     #![allow(improper_ctypes)]
   25 |     #![allow(clippy::upper_case_acronyms)]
   26 |     #![allow(clippy::use_self)]
   27 |     include!(concat!(env!("OUT_DIR"), "/lance.file.v2.rs"));
   28 | }
   29 | 
   30 | /// These version/magic values are written at the end of Lance files (e.g. versions/1.version)
   31 | pub const MAJOR_VERSION: i16 = 0;
   32 | pub const MINOR_VERSION: i16 = 2;
   33 | pub const MAGIC: &[u8; 4] = b"LANC";
``````
