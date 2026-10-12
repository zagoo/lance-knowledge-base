> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-file/Cargo.toml

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `a82f2099580260efe48edecfa8e877e9ee796a31c6ab8c74336a4dfbe85a9722`. Reviewed physical lines: 1-72.

[Module](../../../L1-modules/rust-lance-file.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Crate package/dependency/feature and benchmark declarations. (rust/lance-file/Cargo.toml:1-72)

## Complete range analysis

### Lines 1-13

Package name lance-file; version/edition/authors/license/repository/keywords/categories/rust-version inherit workspace, readme README.md and description Utilities for the Lance file format. This file has no literal package/toolchain versions. (rust/lance-file/Cargo.toml:1-13)

### Lines 14-25

Runtime workspace dependencies: lance-arrow,core,encoding,io and arrow-arith,array,buffer,cast,data,schema,select. They declare intended Arrow/file/core integration; local lance-file use sites are now analyzed; complete dependency implementations remain pending. No optional flag on these dependencies here. (rust/lance-file/Cargo.toml:14-25)

### Lines 26-40

Other runtime dependencies inherit workspace: async-recursion,async-trait,byteorder,bytes,datafusion-common,futures,log,num-traits,object_store,prost,prost-types,serde,tokio,tracing. Reviewed imports confirm core errors/deepsize,serde and ObjectStore/Path usage; exhaustive purpose/version/features require root and each use site, not inference from names. (rust/lance-file/Cargo.toml:26-40)

### Lines 41-51

Dev dependencies inherit workspace lance-datagen,lance-testing,criterion,rstest,proptest,pretty_assertions,rand,test-log,libc. Declaration alone does not show every test/benchmark consumer or guarantee test success. (rust/lance-file/Cargo.toml:41-51)

### Lines 52-58

Build dependencies prost-build and optional protobuf-src inherit workspace; sole declared local feature protoc enables dep:protobuf-src. No local default feature list is declared; dependency default features still follow workspace declarations. (rust/lance-file/Cargo.toml:52-58)

### Lines 59-72

docs.rs requests protoc with comment about its Ubuntu compiler age (unverified service condition). Reader and schema benches set harness=false. Workspace lints inherited. Both local benchmark sources are analyzed; dependency runner internals and workspace build profiles remain separate pending analysis. No benchmark command was run. (rust/lance-file/Cargo.toml:59-72)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | [package]
    2 | name = "lance-file"
    3 | version.workspace = true
    4 | edition.workspace = true
    5 | authors.workspace = true
    6 | license.workspace = true
    7 | repository.workspace = true
    8 | readme = "README.md"
    9 | description = "Utilities for the Lance file format"
   10 | keywords.workspace = true
   11 | categories.workspace = true
   12 | rust-version.workspace = true
   13 | 
   14 | [dependencies]
   15 | lance-arrow.workspace = true
   16 | lance-core.workspace = true
   17 | lance-encoding.workspace = true
   18 | lance-io.workspace = true
   19 | arrow-arith.workspace = true
   20 | arrow-array.workspace = true
   21 | arrow-buffer.workspace = true
   22 | arrow-cast.workspace = true
   23 | arrow-data.workspace = true
   24 | arrow-schema.workspace = true
   25 | arrow-select.workspace = true
   26 | async-recursion.workspace = true
   27 | async-trait.workspace = true
   28 | byteorder.workspace = true
   29 | bytes.workspace = true
   30 | datafusion-common.workspace = true
   31 | futures.workspace = true
   32 | log.workspace = true
   33 | num-traits.workspace = true
   34 | object_store.workspace = true
   35 | prost.workspace = true
   36 | prost-types.workspace = true
   37 | serde.workspace = true
   38 | tokio.workspace = true
   39 | tracing.workspace = true
   40 | 
   41 | [dev-dependencies]
   42 | lance-datagen.workspace = true
   43 | lance-testing.workspace = true
   44 | criterion.workspace = true
   45 | rstest.workspace = true
   46 | proptest.workspace = true
   47 | pretty_assertions.workspace = true
   48 | rand.workspace = true
   49 | test-log.workspace = true
   50 | libc.workspace = true
   51 | 
   52 | [build-dependencies]
   53 | prost-build.workspace = true
   54 | protobuf-src = { workspace = true, optional = true }
   55 | 
   56 | [features]
   57 | protoc = ["dep:protobuf-src"]
   58 | 
   59 | [package.metadata.docs.rs]
   60 | # docs.rs uses an older version of Ubuntu that does not have the necessary protoc version
   61 | features = ["protoc"]
   62 | 
   63 | [[bench]]
   64 | name = "reader"
   65 | harness = false
   66 | 
   67 | [[bench]]
   68 | name = "schema"
   69 | harness = false
   70 | 
   71 | [lints]
   72 | workspace = true
``````
