> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-table/Cargo.toml

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8bd319693a70dc2c09792eed809788edb66e64bee6c7cb64f4e068f1936b725b`. Reviewed physical lines: 1-87.

[Module](../../../L1-modules/rust-lance-table.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Workspace-inheriting package manifest for internal table-format utilities, with optional DynamoDB and vendored-protoc integration. (rust/lance-table/Cargo.toml:1-87)

## Complete range analysis

### Lines 1-13

Package name is lance-table; version, edition, authors, license, repository, keywords, categories and minimum Rust version inherit workspace values. README.md and the utility description are local. This file does not establish the inherited version numbers. (rust/lance-table/Cargo.toml:1-13)

### Lines 14-25

Runtime dependencies link Arrow family types/IPC and the lance-arrow/core/file/select/io crates, plus async-trait. Each declaration uses the workspace dependency; actual use sites require their corresponding source analysis. (rust/lance-table/Cargo.toml:14-25)

### Lines 26-48

AWS credential/DynamoDB dependencies are optional. DynamoDB explicitly disables default features and requests default-https-client plus rt-tokio. Remaining workspace dependencies provide BLAKE3, bytes/byte order, time, futures/logging, object store, protobuf/types, randomness, ranges/bitmaps, serde/JSON, semver/Snafu, Tokio/tracing, URL and UUID. Pins are in the still-pending root workspace/lockfiles. (rust/lance-table/Cargo.toml:26-48)

### Lines 49-57

Dev dependencies use workspace datagen/testing plus arrow-schema, criterion, pretty_assertions, proptest and rstest. Their presence does not prove any tests have executed. (rust/lance-table/Cargo.toml:49-57)

### Lines 58-65

prost-build is a build dependency. Optional protobuf-src is selected by protoc; dynamodb selects both optional AWS dependencies and lance-io/aws. There is no default feature list in this manifest. (rust/lance-table/Cargo.toml:58-65)

### Lines 66-69

docs.rs builds request protoc; the comment attributes this to an older Ubuntu protoc. This is a declared docs build setting, not current docs.rs environment verification. (rust/lance-table/Cargo.toml:66-69)

### Lines 70-81

Three separate harness=false Criterion-style bench targets are named row_id_index, manifest_intern and system_columns. Source and actual measurement behavior are separate files. (rust/lance-table/Cargo.toml:70-81)

### Lines 82-87

The fourth harness=false target is version_columns. Workspace lints are inherited. No ad hoc profile override is declared here. (rust/lance-table/Cargo.toml:82-87)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | [package]
    2 | name = "lance-table"
    3 | version.workspace = true
    4 | edition.workspace = true
    5 | authors.workspace = true
    6 | license.workspace = true
    7 | repository.workspace = true
    8 | readme = "README.md"
    9 | description = "Utilities for the Lance table format"
   10 | keywords.workspace = true
   11 | categories.workspace = true
   12 | rust-version.workspace = true
   13 | 
   14 | [dependencies]
   15 | lance-arrow.workspace = true
   16 | lance-core.workspace = true
   17 | lance-file.workspace = true
   18 | lance-select.workspace = true
   19 | lance-io.workspace = true
   20 | arrow.workspace = true
   21 | arrow-array.workspace = true
   22 | arrow-buffer.workspace = true
   23 | arrow-ipc.workspace = true
   24 | arrow-schema.workspace = true
   25 | async-trait.workspace = true
   26 | aws-credential-types = { workspace = true, optional = true }
   27 | blake3.workspace = true
   28 | aws-sdk-dynamodb = { workspace = true, optional = true, default-features = false, features = ["default-https-client", "rt-tokio"] }
   29 | byteorder.workspace = true
   30 | bytes.workspace = true
   31 | chrono.workspace = true
   32 | futures.workspace = true
   33 | log.workspace = true
   34 | object_store.workspace = true
   35 | prost.workspace = true
   36 | prost-types.workspace = true
   37 | rand.workspace = true
   38 | rangemap.workspace = true
   39 | roaring.workspace = true
   40 | serde.workspace = true
   41 | serde_json.workspace = true
   42 | semver.workspace = true
   43 | snafu.workspace = true
   44 | tokio.workspace = true
   45 | tracing.workspace = true
   46 | url.workspace = true
   47 | uuid.workspace = true
   48 | 
   49 | [dev-dependencies]
   50 | lance-datagen.workspace = true
   51 | lance-testing.workspace = true
   52 | arrow-schema.workspace = true
   53 | criterion.workspace = true
   54 | pretty_assertions.workspace = true
   55 | proptest.workspace = true
   56 | rstest.workspace = true
   57 | 
   58 | [build-dependencies]
   59 | prost-build.workspace = true
   60 | protobuf-src = { workspace = true, optional = true }
   61 | 
   62 | [features]
   63 | dynamodb = ["dep:aws-sdk-dynamodb", "dep:aws-credential-types", "lance-io/aws"]
   64 | protoc = ["dep:protobuf-src"]
   65 | 
   66 | [package.metadata.docs.rs]
   67 | # docs.rs uses an older version of Ubuntu that does not have the necessary protoc version
   68 | features = ["protoc"]
   69 | 
   70 | [[bench]]
   71 | name = "row_id_index"
   72 | harness = false
   73 | 
   74 | [[bench]]
   75 | name = "manifest_intern"
   76 | harness = false
   77 | 
   78 | [[bench]]
   79 | name = "system_columns"
   80 | harness = false
   81 | 
   82 | [[bench]]
   83 | name = "version_columns"
   84 | harness = false
   85 | 
   86 | [lints]
   87 | workspace = true
``````
