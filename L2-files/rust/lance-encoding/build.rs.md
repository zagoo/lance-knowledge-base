> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-encoding/build.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e385c9646fb3ae6201e1a74b71ef4daf8edf7a59e595db6c0b8a6d289aeb12c8`. Reviewed physical lines: 1-23.

[Module](../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Build-time protobuf generation for V2.0 and V2.1+ message families. (rust/lance-encoding/build.rs:1-23)

## Complete range analysis

### Lines 1-8

SPDX header, std::io::Result import and private build-script main returning Result<()>; emits Cargo rerun-if-changed=protos. This print is a Cargo build directive, not library debugging output. (rust/lance-encoding/build.rs:1-8)

### Lines 9-14

When local protoc feature is enabled, unsafely set process environment PROTOC to protobuf_src::protoc(). No fallback branch, restore of a prior value or SAFETY explanation is supplied; the comment explains vendoring purpose, not the safety of concurrent environment mutation. Source inspection does not execute or establish build-process threading conditions. (rust/lance-encoding/build.rs:9-14)

### Lines 15-23

Create one prost_build::Config; enable --experimental_allow_proto3_optional, generated type names and Bytes for every bytes field via bytes(["."]). Compile encodings_v2_0.proto first and encodings_v2_1.proto second using ./protos include directory. Either error propagates via ? and prevents successful completion; a first successful generation is not rolled back if the second fails. No custom output directory is set; format.rs includes the generated files through OUT_DIR. Comment motivates avoiding Vec clones but supplies no measurement. (rust/lance-encoding/src/format.rs:4-33) (rust/lance-encoding/build.rs:15-23)

## Interaction and interpretation limits

All physical lines of this file were read in bounded, untruncated source outputs during ANALYZE71. Source is read-only and offline. No Lance build, test, lint, benchmark, generator, dependency installation or network access occurred. Crate coverage remains partial; generated Rust declarations are represented by their analyzed protobuf inputs and literal include paths, not fabricated compiler output. Contextual dependency reads establish only cited local behavior.

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
   17 |     prost_build.enable_type_names();
   18 |     prost_build.bytes(["."]); // Enable Bytes type for all messages to avoid Vec clones.
   19 |     prost_build.compile_protos(&["./protos/encodings_v2_0.proto"], &["./protos"])?;
   20 |     prost_build.compile_protos(&["./protos/encodings_v2_1.proto"], &["./protos"])?;
   21 | 
   22 |     Ok(())
   23 | }
``````
