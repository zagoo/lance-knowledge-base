> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-file/README.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `3d272ed08e1e482c25863099d276a6940763058e7707a4d425f2af1c755c3019`. Reviewed physical lines: 1-6.

[Module](../../../L1-modules/rust-lance-file.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Maintainer statement of crate responsibility and supported usage boundary. (rust/lance-file/README.md:1-6)

## Complete range analysis

### Lines 1-6

Crate titled lance-file is described as an internal sub-crate containing Lance file-format readers/writers. External documentation link is not fetched. Explicit not-intended-for-external-usage policy remains distinct from its public Rust module visibility. (rust/lance-file/README.md:1-6)

## Interaction and interpretation limits

Complete bounded read and authored physical-line coverage. No build, test, benchmark or network execution; delegated implementations remain pending unless separately analyzed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # lance-file
    2 | 
    3 | `lance-file` is an internal sub-crate, containing readers and writers for the
    4 | [Lance file format](https://lance.org/format/file/).
    5 | 
    6 | **Important Note**: This crate is **not intended for external usage**.
``````
