> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# protos/AGENTS.md

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `b5cdb94ec91dde1d215d76cb9957401a7a5e85fee6621ce3faef358a9c9db818`. Reviewed physical lines: 1-27.

[Module](../../L1-modules/protos.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Behavior contracts](../../L3-symbols/behavior-contracts.md) · [Format](../../L3-symbols/format-spec.md) · [Entry](../../README.md)

## Role and visibility

Maintainer policy for protobuf work, including persisted-format review, execution-wire compatibility, optional-field semantics, and schema documentation. It is policy documentation, not runtime code or a public API. (protos/AGENTS.md:1-27)

## Complete range analysis

### Lines 1-4

The title scopes the guide to protobufs and the root AGENTS.md link incorporates cross-language standards. (protos/AGENTS.md:1-4)

### Lines 5-10

Persisted-format protobuf changes require a PMC vote enforced by format-spec-vote. Keep the schema change with its matching docs/src/format change and compilation-only library adjustments, then implement separately. ann.proto, filtered_read.proto, and table_identifier.proto are execution wire contracts whose implementation changes belong together and do not require this format vote or format-doc change. (protos/AGENTS.md:5-10)

### Lines 11-16

Stable persisted contracts preserve existing field numbers and backwards compatibility. Exclusively unstable schemas need not preserve earlier unstable revisions, but shared stable usage must be checked first. Execution-wire field numbers stay compatible unless all producers and consumers upgrade atomically. (protos/AGENTS.md:11-16)

### Lines 17-22

Use optional for absent-versus-zero presence, mapping to Rust Option and has_* accessors. Prefer structured messages, operation-specific field scope, one representation of each fact, and parallel sequences when keys already exist elsewhere. (protos/AGENTS.md:17-22)

### Lines 23-27

Document both presence states and precise terms. Multiline comments use block syntax for folding, single-line comments use //. ci/check_proto_comments.py, pre-commit, and the Protobuf lint workflow enforce this convention; --fix can rewrite offenders. (protos/AGENTS.md:23-27)

## Interaction and interpretation limits

These are contributor rules, not evidence that all current files conform (protos/AGENTS.md:5-27). The linked root policy and CI implementation require their own coverage.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | # Protobuf Guidelines
    2 | 
    3 | Also see [root AGENTS.md](../AGENTS.md) for cross-language standards.
    4 | 
    5 | ## Change Process
    6 | 
    7 | - Changes to protobuf schemas that define a persisted Lance format require a PMC vote on the pull request, enforced by the `format-spec-vote` CI gate. See [Lance Format Specification Changes](../docs/src/community/voting.md#lance-format-specification-changes).
    8 | - Keep a persisted-format proto change in its own PR, together with the matching `docs/src/format/` change and only the library edits needed to compile. Put the implementation in a follow-up PR — voters need to read the contract, not its implementation.
    9 | - Execution-plan schemas (`ann.proto`, `filtered_read.proto`, and `table_identifier.proto`) are wire contracts, not persisted Lance formats. Changes to them belong with their implementation and do not require a format vote or a `docs/src/format/` change.
   10 | 
   11 | ## Compatibility
   12 | 
   13 | - Protobuf schemas that are part of a stable file format or any other stable persisted contract must remain backwards compatible. Never reuse or change their existing field numbers.
   14 | - Protobuf schemas used exclusively by an unstable file format follow the root file-format stability contract: do not preserve compatibility with prior unstable revisions. Before making a breaking protobuf change, verify that the schema is not shared with a stable format or another persisted contract.
   15 | - Execution wire schemas may still cross process or version boundaries. Preserve their field-number compatibility unless all producers and consumers are upgraded atomically.
   16 | 
   17 | ## Schema Design
   18 | 
   19 | - Use `optional` when you need to distinguish "not set" from "zero value" — `optional` enables presence tracking (`has_*` methods) and maps to `Option<T>` in Rust. Bare proto3 fields have no presence semantics: they always hold a value (defaulting to zero), so you cannot tell if the sender explicitly set them.
   20 | - Use structured message types (e.g., `BasePath`) instead of plain scalars, and scope fields to operation-specific messages (e.g., `InsertTransaction`) rather than generic top-level ones.
   21 | - Don't duplicate data across messages — store each fact once and derive relationships. Prefer parallel sequences over maps when keys already exist in another field.
   22 | 
   23 | ## Documentation
   24 | 
   25 | - Document the semantic meaning of both present and absent states for `optional` fields — explain when each case applies.
   26 | - Use precise domain terminology in field descriptions — avoid ambiguous abbreviations or terms that collide with domain concepts.
   27 | - Write multi-line comments as `/* text` / ` * text` / ` */` blocks so editors can fold them; keep single-line comments as `//`. The `ci/check_proto_comments.py` check (pre-commit hook and the `Protobuf lint` workflow) enforces this and can rewrite offenders with `--fix`.
``````
