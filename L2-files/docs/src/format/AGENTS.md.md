> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# docs/src/format/AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `5eb07a2e13f8cac129f0f756d9ebf01de9ac5c4396d36f0650eacb760298a1eb`. Reviewed physical lines: 1-20.

[Module](../../../../L1-modules/contributor-policy.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Maintainer rules for authoritative format documentation, including vote separation and exact schema/algorithm detail. (docs/src/format/AGENTS.md:1-20)

## Complete range analysis

### Lines 1-9

The guide inherits root rules. Format doc changes require a PMC vote enforced by format-spec-vote; pair the spec/proto contract and only compilation-required library edits in one PR, implement separately afterward. (docs/src/format/AGENTS.md:1-9)

### Lines 10-15

Keep format docs concise reference text; place code examples in user guides. Express file schemas as explicit PyArrow schema definitions, and use language-neutral JSON Schema/protobuf rather than Rust structures for general contracts. These rules coexist: schema definitions are expressly required even though illustrative code examples belong elsewhere. (docs/src/format/AGENTS.md:10-15)

### Lines 16-20

Explain actual evolution mechanics (IDs/tombstones/rewrites), algorithms with parameters, precision, order, normalization and steps, and index file schemas plus navigation/entry-point/page-type distinctions. Naming an algorithm or deferring to an outside spec is insufficient. Bitmap index docs are the referenced pattern, pending their own analysis. (docs/src/format/AGENTS.md:16-20)

## Interaction and interpretation limits

This contract applies to repository format docs and informs KB rigor; the external KB does not modify that source directory (docs/src/format/AGENTS.md:5-20).

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Format Documentation Guidelines
    2 | 
    3 | Also see [root AGENTS.md](../../../AGENTS.md) for cross-language standards.
    4 | 
    5 | ## Change Process
    6 | 
    7 | - Changes here require a PMC vote on the pull request, enforced by the `format-spec-vote` CI gate. See [Lance Format Specification Changes](../community/voting.md#lance-format-specification-changes).
    8 | - Keep a spec change in its own PR, together with the matching `protos/` change and only the library edits needed to compile. Put the implementation in a follow-up PR — voters need to read the contract, not its implementation.
    9 | 
   10 | ## Style
   11 | 
   12 | - Keep format docs as concise, text-only reference — no code examples (put those in user guide sections).
   13 | - Express file schemas as `pyarrow` schema definitions, not markdown tables or informal text — pyarrow schemas are unambiguous and executable.
   14 | - Use language-agnostic definitions (JSON Schema, protobuf) — not language-specific code like Rust structs.
   15 | 
   16 | ## Content
   17 | 
   18 | - Explain schema/data evolution with concrete mechanics (field IDs, tombstones, data rewrites) — don't just name operations or defer to external specs.
   19 | - Describe all algorithms with full detail: parameters, precision, ordering, normalization bounds, and implementation steps — never reference an algorithm by name alone.
   20 | - Index docs must include explicit file schemas and describe reader navigation (page type distinction, root/entry point location) — follow the pattern in `index/scalar/bitmap.md`.
``````
