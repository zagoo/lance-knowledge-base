> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-encoding/Cargo.toml

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `ada56b3d6a0d4f5b0bea58aecae9bc699887a1faaf220a314997dbd8dd47e1ed`. Reviewed physical lines: 1-85.

[Module](../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Crate manifest: package inheritance, dependency declarations, optional compressor/protobuf features and three Criterion benchmark targets. (rust/lance-encoding/Cargo.toml:1-85)

## Complete range analysis

### Lines 1-13

Package lance-encoding describes file-format encoders/decoders and uses README.md. Version, edition, authors, license, repository, keywords, categories and rust-version inherit the workspace; no literal crate/Rust version is specified here. (rust/lance-encoding/Cargo.toml:1-13)

### Lines 14-23

Runtime workspace dependencies are lance-arrow, lance-core and Arrow arith/array/data/buffer/cast/schema/select. There is no lance-io dependency: EncodingsIo supplies the inversion boundary (rust/lance-encoding/src/lib.rs:33-40). Exact use sites throughout those modules remain part of later crate analysis. (rust/lance-encoding/Cargo.toml:14-23)

### Lines 24-40

Optional workspace lance-bitpacking plus workspace bytes, futures, fsst, hex, itertools, log, num-traits, prost, hyperloglogplus, tokio, tracing, bytemuck and byteorder. xxhash-rust uses explicit version requirement0.8.15 with xxh3; lz4 requirement1 and zstd requirement0.13 are optional. Requirements are not resolved lockfile versions or independently verified compatibility. fsst is unconditional here; bitpacking/lz4/zstd are opt-in dependencies enabled by the default feature set. (rust/lance-encoding/Cargo.toml:24-40)

### Lines 41-53

Dev dependencies inherit workspace lance-datagen, arrow-ord, rand, rstest, test-log, criterion, lance-testing, rand_xoshiro, proptest and serial_test. Their declaration does not establish that all local tests use them or pass. (rust/lance-encoding/Cargo.toml:41-53)

### Lines 54-64

Build dependencies prost-build and optional protobuf-src inherit workspace. Default features enable lz4,zstd,bitpacking; the three named features each select the matching dep: entry. protoc selects dep:protobuf-src and is not default. --no-default-features therefore removes these three local default selections but does not disable dependency-default features globally. (rust/lance-encoding/Cargo.toml:54-64)

### Lines 65-71

docs.rs metadata requests protoc, with an unverified service-environment explanation in the comment. cargo-machete metadata ignores prost, which is referenced by generated protobuf code rather than necessarily a literal source use. This is tool metadata, not a runtime feature. (rust/lance-encoding/Cargo.toml:65-71)

### Lines 72-85

Three separate benchmark targets decoder,encoder,buffer have harness=false; workspace lints are inherited. No custom profile, required-features list or test gating is declared here. Benchmark implementation/runner behavior and root profiles remain separate analysis. (rust/lance-encoding/Cargo.toml:72-85)

## Interaction and interpretation limits

All physical lines of this file were read in bounded, untruncated source outputs during ANALYZE71. Source is read-only and offline. No Lance build, test, lint, benchmark, generator, dependency installation or network access occurred. Crate coverage remains partial; generated Rust declarations are represented by their analyzed protobuf inputs and literal include paths, not fabricated compiler output. Contextual dependency reads establish only cited local behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | [package]
    2 | name = "lance-encoding"
    3 | version.workspace = true
    4 | edition.workspace = true
    5 | authors.workspace = true
    6 | license.workspace = true
    7 | repository.workspace = true
    8 | readme = "README.md"
    9 | description = "Encoders and decoders for the Lance file format"
   10 | keywords.workspace = true
   11 | categories.workspace = true
   12 | rust-version.workspace = true
   13 | 
   14 | [dependencies]
   15 | lance-arrow.workspace = true
   16 | lance-core.workspace = true
   17 | arrow-arith.workspace = true
   18 | arrow-array.workspace = true
   19 | arrow-data.workspace = true
   20 | arrow-buffer.workspace = true
   21 | arrow-cast.workspace = true
   22 | arrow-schema.workspace = true
   23 | arrow-select.workspace = true
   24 | lance-bitpacking = { workspace = true, optional = true }
   25 | bytes.workspace = true
   26 | futures.workspace = true
   27 | fsst.workspace = true
   28 | hex.workspace = true
   29 | itertools.workspace = true
   30 | log.workspace = true
   31 | num-traits.workspace = true
   32 | prost.workspace = true
   33 | hyperloglogplus.workspace = true
   34 | tokio.workspace = true
   35 | tracing.workspace = true
   36 | xxhash-rust = { version = "0.8.15", features = ["xxh3"] }
   37 | bytemuck.workspace = true
   38 | byteorder.workspace = true
   39 | lz4 = { version = "1", optional = true }
   40 | zstd = { version = "0.13", optional = true }
   41 | 
   42 | [dev-dependencies]
   43 | lance-datagen.workspace = true
   44 | arrow-ord.workspace = true
   45 | rand.workspace = true
   46 | rstest.workspace = true
   47 | test-log.workspace = true
   48 | criterion = { workspace = true }
   49 | lance-testing.workspace = true
   50 | rand_xoshiro = { workspace = true }
   51 | proptest.workspace = true
   52 | serial_test.workspace = true
   53 | 
   54 | [build-dependencies]
   55 | prost-build.workspace = true
   56 | protobuf-src = { workspace = true, optional = true }
   57 | 
   58 | [features]
   59 | default = ["lz4", "zstd", "bitpacking"]
   60 | protoc = ["dep:protobuf-src"]
   61 | bitpacking = ["dep:lance-bitpacking"]
   62 | lz4 = ["dep:lz4"]
   63 | zstd = ["dep:zstd"]
   64 | 
   65 | [package.metadata.docs.rs]
   66 | # docs.rs uses an older version of Ubuntu that does not have the necessary protoc version
   67 | features = ["protoc"]
   68 | 
   69 | [package.metadata.cargo-machete]
   70 | ignored = ["prost"]
   71 | 
   72 | [[bench]]
   73 | name = "decoder"
   74 | harness = false
   75 | 
   76 | [[bench]]
   77 | name = "encoder"
   78 | harness = false
   79 | 
   80 | [[bench]]
   81 | name = "buffer"
   82 | harness = false
   83 | 
   84 | [lints]
   85 | workspace = true
``````
