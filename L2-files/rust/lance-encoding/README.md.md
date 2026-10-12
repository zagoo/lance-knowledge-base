> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-encoding/README.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `c28b080b0e79e6e857c88fef7c225f380e0f3d27ce4e408614214c2b10b83439`. Reviewed physical lines: 1-6.

[Module](../../../L1-modules/rust-lance-encoding.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Internal-package purpose and support-policy statement. (rust/lance-encoding/README.md:1-6)

## Complete range analysis

### Lines 1-6

Names lance-encoding as an internal sub-crate containing Lance-file encoders/decoders and explicitly not intended for external usage. Rust pub visibility still exposes symbols; this support-policy statement does not make their visibility private. (rust/lance-encoding/README.md:1-6)

## Interaction and interpretation limits

All physical lines of this file were read in bounded, untruncated source outputs during ANALYZE71. Source is read-only and offline. No Lance build, test, lint, benchmark, generator, dependency installation or network access occurred. Crate coverage remains partial; generated Rust declarations are represented by their analyzed protobuf inputs and literal include paths, not fabricated compiler output. Contextual dependency reads establish only cited local behavior.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # lance-encoding
    2 | 
    3 | `lance-encoding` is an internal sub-crate, containing encoders and decoders
    4 | for the Lance file format.
    5 | 
    6 | **Important Note**: This crate is **not intended for external usage**.
``````
