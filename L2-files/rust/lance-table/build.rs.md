> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-table/build.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2198372b7b5fa2e98a1bf9e86f068aee4da0c44190973477f573d212b73d7d8a`. Reviewed physical lines: 1-32.

[Module](../../../L1-modules/rust-lance-table.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Cargo build script generating table protobuf Rust bindings. (rust/lance-table/build.rs:1-32)

## Complete range analysis

### Lines 1-8

License/import prelude and main returning std::io::Result. Cargo is told to rerun the build script when protos changes; generated output is consumed by format::pb. (rust/lance-table/build.rs:1-8)

### Lines 9-14

With feature protoc, an unsafe block sets the build process PROTOC environment variable to protobuf_src::protoc(). Without that feature this assignment is compiled out. This is build-time configuration, not a runtime table option. (rust/lance-table/build.rs:9-14)

### Lines 15-21

Prost maps the .lance.file package to ::lance_file::format::pb, enables proto3 optional support and type names, and maps DataFragment.inline_row_ids to Bytes. The comment motivates zero-copy slices and reports a roughly98% large-manifest share; the percentage is an unmeasured source-comment claim, while the configuration itself is explicit. (rust/lance-table/build.rs:15-21)

### Lines 22-32

Compile table.proto, transaction.proto and rowids.proto with ./protos include directory, propagate compilation IO errors with ?, then return Ok. No checked-in generated output or successful compilation is established by reading this script. (rust/lance-table/build.rs:22-32)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::io::Result;
    5 | 
    6 | fn main() -> Result<()> {
    7 |     println!("cargo:rerun-if-changed=protos");
    8 | 
    9 |     #[cfg(feature = "protoc")]
   10 |     // Use vendored protobuf compiler if requested.
   11 |     unsafe {
   12 |         std::env::set_var("PROTOC", protobuf_src::protoc());
   13 |     }
   14 | 
   15 |     let mut prost_build = prost_build::Config::new();
   16 |     prost_build.extern_path(".lance.file", "::lance_file::format::pb");
   17 |     prost_build.protoc_arg("--experimental_allow_proto3_optional");
   18 |     prost_build.enable_type_names();
   19 |     // Inline row id sequences are ~98% of a large manifest. Decoding them as
   20 |     // `Bytes` slices the fetched buffer instead of copying into a `Vec<u8>`.
   21 |     prost_build.bytes([".lance.table.DataFragment.inline_row_ids"]);
   22 |     prost_build.compile_protos(
   23 |         &[
   24 |             "./protos/table.proto",
   25 |             "./protos/transaction.proto",
   26 |             "./protos/rowids.proto",
   27 |         ],
   28 |         &["./protos"],
   29 |     )?;
   30 | 
   31 |     Ok(())
   32 | }
``````
