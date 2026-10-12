> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../V21-PROTOCOL.md).

# rust/lance-table/README.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `2b081014f061f0e2b5035413bd3a76ce979d4280f8d5ba7b64beecec2dc9ac9b`. Reviewed physical lines: 1-6.

[Module](../../../L1-modules/rust-lance-table.md) · [Symbols](../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../L3-symbols/behavior-contracts.md) · [Format](../../../L3-symbols/format-spec.md) · [Entry](../../../README.md)

## Role and visibility

Internal-use declaration for the lance-table package. (rust/lance-table/README.md:1-6)

## Complete range analysis

### Lines 1-6

Names lance-table as an internal sub-crate, links the Lance table-format documentation and explicitly says it is not intended for external usage. The external site was not visited. Rust pub visibility remains distinct from this package-level support policy. (rust/lance-table/README.md:1-6)

## Interaction and interpretation limits

Only this file is analyzed; imported implementations and downstream consumers remain pending unless separately listed in the manifest. No Rust build or test was run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # lance-table
    2 | 
    3 | `lance-table` is an internal sub-crate for the
    4 | [Lance table format](https://lance.org/format/table/).
    5 | 
    6 | **Important Note**: This crate is **not intended for external usage**.
``````
