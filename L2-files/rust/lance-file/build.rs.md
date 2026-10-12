> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-file/build.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `fe664208c36b534cd27ca93c2581d64b117d5f54168b84dcc2fae6438c86e9c8`. Reviewed physical lines: 1-29.

[Module](../../../L1-modules/rust-lance-file.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Build-time protobuf compiler configuration and workspace encoding-type mapping. (rust/lance-file/build.rs:1-29)

## Complete range analysis

### Lines 1-8

SPDX/std::io::Result/main; emits cargo:rerun-if-changed=protos. Cargo directive is build communication, not a runtime debug print. It watches a directory path; source symlink resolves to shared protobuf files. (rust/lance-file/build.rs:1-8)

### Lines 9-14

With Cargo feature protoc, an unsafe block sets process environment PROTOC to protobuf_src::protoc(). Comment says vendored compiler; no explicit SAFETY rationale or synchronization appears. Without feature this branch is absent and compiler selection delegates prost-build defaults. This build script was not executed. (rust/lance-file/build.rs:9-14)

### Lines 15-29

Creates prost_build::Config, passes --experimental_allow_proto3_optional and maps .lance.encodings to ::lance_encoding::format::pb. Compiles file.proto,file2.proto,encodings_v2_0.proto,encodings_v2_1.proto with ./protos include root, propagates compiler IO error then Ok. No bytes mapping/custom serde derives or output override here; generated includes are used by format.rs. (rust/lance-file/build.rs:15-29)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

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
   16 |     prost_build.protoc_arg("--experimental_allow_proto3_optional");
   17 |     prost_build.extern_path(".lance.encodings", "::lance_encoding::format::pb");
   18 |     prost_build.compile_protos(
   19 |         &[
   20 |             "./protos/file.proto",
   21 |             "./protos/file2.proto",
   22 |             "./protos/encodings_v2_0.proto",
   23 |             "./protos/encodings_v2_1.proto",
   24 |         ],
   25 |         &["./protos"],
   26 |     )?;
   27 | 
   28 |     Ok(())
   29 | }
``````
