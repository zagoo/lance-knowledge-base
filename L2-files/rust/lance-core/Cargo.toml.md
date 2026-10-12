> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-core/Cargo.toml

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2c681a84cbd6f44b606060ca2f3a5cf58ab72c0f85312e9007689e5b10887731`. Reviewed physical lines: 1-65.

[Module](../../../L1-modules/rust-lance-core.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Cargo package manifest for lance-core. It declares dependency/feature/build surfaces, not executable APIs or evidence that every dependency is used by a specific algorithm. (rust/lance-core/Cargo.toml:1-65)

## Complete range analysis

### Lines 1-13

Package name is lance-core and description is Lance Columnar Format -- Core Library. Version, edition, authors, license, repository, readme, keywords, categories and minimum Rust version inherit workspace values. They cannot be resolved solely from this manifest. (rust/lance-core/Cargo.toml:1-13)

### Lines 14-25

Dependencies on Arrow array/buffer/data/schema, async-trait, lance-arrow, blake3, bytes and lance-derive inherit workspace constraints. datafusion-common and datafusion-sql are optional workspace dependencies. The manifest establishes availability, not exact usage rationale; source call sites must provide that later. (rust/lance-core/Cargo.toml:14-25)

### Lines 26-46

Workspace dependencies continue with futures, libc, libm, moka, object_store, pin-project, prost, rand, roaring, serde_json, snafu, tempfile, tokio, tokio-util, tracing, twox-hash, url and log. quick_cache is declared with version requirement 0.6 and num_cpus with 1.0 rather than workspace inheritance. These requirements are not resolved lockfile versions. No build dependency or build script is declared here. (rust/lance-core/Cargo.toml:26-46)

### Lines 47-52

Dev dependencies criterion, proptest, rstest, and tokio-stream inherit workspace definitions. Their presence suggests supported testing/benchmark tools, not actual coverage or executed checks. (rust/lance-core/Cargo.toml:47-52)

### Lines 53-59

backtrace is an empty feature, documented disabled by default with zero-sized trace storage; runtime capture additionally requires RUST_BACKTRACE=1. The zero-sized no-backtrace field is confirmed by error.rs; it does not imply a zero-sized Error enum or measured overhead. (rust/lance-core/src/error.rs:33-56) datafusion enables exactly the two optional dep:datafusion-common and dep:datafusion-sql edges. No default feature list is declared. (rust/lance-core/Cargo.toml:53-59)

### Lines 60-65

The cache_keys benchmark disables Cargo's built-in harness. Lints inherit the workspace configuration. No profile overrides, test filtering, or benchmark runtime settings are declared. (rust/lance-core/Cargo.toml:60-65)

## Interaction and interpretation limits

Exact dependency versions and reasons, feature-conditioned code and backtrace implementation remain pending outside this manifest (rust/lance-core/Cargo.toml:14-65). No Cargo command was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | [package]
    2 | name = "lance-core"
    3 | version.workspace = true
    4 | edition.workspace = true
    5 | authors.workspace = true
    6 | license.workspace = true
    7 | repository.workspace = true
    8 | readme.workspace = true
    9 | description = "Lance Columnar Format -- Core Library"
   10 | keywords.workspace = true
   11 | categories.workspace = true
   12 | rust-version.workspace = true
   13 | 
   14 | [dependencies]
   15 | arrow-array.workspace = true
   16 | arrow-buffer.workspace = true
   17 | arrow-data.workspace = true
   18 | arrow-schema.workspace = true
   19 | async-trait.workspace = true
   20 | lance-arrow.workspace = true
   21 | blake3.workspace = true
   22 | bytes.workspace = true
   23 | datafusion-common = { workspace = true, optional = true }
   24 | datafusion-sql = { workspace = true, optional = true }
   25 | lance-derive.workspace = true
   26 | futures.workspace = true
   27 | libc.workspace = true
   28 | libm.workspace = true
   29 | moka.workspace = true
   30 | quick_cache = "0.6"
   31 | num_cpus = "1.0"
   32 | object_store = { workspace = true }
   33 | pin-project.workspace = true
   34 | prost.workspace = true
   35 | rand.workspace = true
   36 | roaring.workspace = true
   37 | serde_json.workspace = true
   38 | snafu.workspace = true
   39 | tempfile.workspace = true
   40 | tokio.workspace = true
   41 | tokio-util.workspace = true
   42 | tracing.workspace = true
   43 | twox-hash.workspace = true
   44 | url.workspace = true
   45 | log.workspace = true
   46 | 
   47 | [dev-dependencies]
   48 | criterion.workspace = true
   49 | proptest.workspace = true
   50 | rstest.workspace = true
   51 | tokio-stream.workspace = true
   52 | 
   53 | [features]
   54 | # Capture Rust backtraces in error types. When disabled (the default),
   55 | # the backtrace field is zero-sized with no overhead. At runtime, capture
   56 | # is still gated by RUST_BACKTRACE=1.
   57 | backtrace = []
   58 | datafusion = ["dep:datafusion-common", "dep:datafusion-sql"]
   59 | 
   60 | [[bench]]
   61 | name = "cache_keys"
   62 | harness = false
   63 | 
   64 | [lints]
   65 | workspace = true
``````
