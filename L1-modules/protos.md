> **V2.1 navigation and contract layer.** Source reading is permitted. Production contracts retained from iteration 85 remain valid at the recorded snapshot. Historical line-count/test-coverage statements are provenance, not completeness requirements. Use [V2.1 protocol](../V21-PROTOCOL.md) and CORE-MANIFEST.json for current scope.

> Refresh 2026-10-12, `011953c22097b67b699595adbe99e7f0155d83e4`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-12.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-11, `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-11.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-09, `db684d1f0726c00b6defb7963a604a7719e82b5a`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-09.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

> Refresh 2026-10-07, `84d1681e07af565837f2d97e72ff1b8b040cd15c`: source coordinates updated. [Changed contracts](../L3-symbols/refresh-2026-10-07.md) supersede pre-refresh claims only for the listed changes. Unchanged analysis is retained.

# Protobuf subsystem

**Deep schema coverage retained.** All 13 root schemas have frozen verified L2 records. Generated output is excluded. Runtime contracts are synthesized from the retained file/table/encoding material in M1.

[Orientation](../L0-orientation.md) · [Symbols](../L3-symbols/symbol-index.md) · [Format](../L3-symbols/format-spec.md) · [Cookbook](../L4-crosscutting/cookbook.md)

The subsystem declares persisted Lance state and execution-wire contracts. Maintainers explicitly distinguish ANN/filtered-read/table-identity wire schemas from persisted format changes; stable persisted contracts and cross-version wire contracts impose different change processes. Schemas must preserve presence semantics when absence differs from zero. (protos/AGENTS.md:5-25)

## Reviewed surfaces

| File | Public surface and boundary |
|---|---|
| [ann.proto](../L2-files/protos/ann.proto.md) | RQ approximation mode, covering projection, vector query, IVF sub-index/routing wire nodes; protos/ann.proto:12-103 |
| [filtered_read.proto](../L2-files/protos/filtered_read.proto.md) | Read options, projection/blob policy, threading, planned/distributed filters and wrapper; protos/filtered_read.proto:10-126 |
| [table_identifier.proto](../L2-files/protos/table_identifier.proto.md) | Remote reconstruction identity and optional manifest payload; protos/table_identifier.proto:8-20 |
| [fragment_metadata.proto](../L2-files/protos/fragment_metadata.proto.md) | Fragments, data/overlay/deletion metadata, hidden lineage, fragment-tree state/actions; protos/fragment_metadata.proto:8-455 |
| [rowids.proto](../L2-files/protos/rowids.proto.md) | Ordered row-ID segments, packed values, version runs; protos/rowids.proto:11-120 |
| [index.proto](../L2-files/protos/index.proto.md) | Vector metadata and new index details in lance.index.pb; protos/index.proto:6-383 |
| [index_old.proto](../L2-files/protos/index_old.proto.md) | Historical lance.table detail type identities, zone maps and tokenizer/FTS configuration; protos/index_old.proto:6-118 |
| [AGENTS.md](../L2-files/protos/AGENTS.md.md) | Schema change and documentation rules; protos/AGENTS.md:1-27 |
| [license_header.txt](../L2-files/protos/license_header.txt.md) | Literal SPDX header; protos/license_header.txt:1-2 |
| [file.proto](../L2-files/protos/file.proto.md) | Shared logical schema and file descriptor, historical metadata and v1 field encodings; protos/file.proto:8-223 |
| [file2.proto](../L2-files/protos/file2.proto.md) | Minimal v2 physical envelope, footer and column/page metadata; protos/file2.proto:11-223 |
| [encodings_v2_0.proto](../L2-files/protos/encodings_v2_0.proto.md) | Array/buffer tree and column wrappers; protos/encodings_v2_0.proto:10-358 |
| [encodings_v2_1.proto](../L2-files/protos/encodings_v2_1.proto.md) | Structural/compressive trees with explicit 2.2/2.3 extensions; protos/encodings_v2_1.proto:8-659 |
| [table.proto](../L2-files/protos/table.proto.md) | Manifests, index metadata, fragment reuse, MemWAL and sharding contracts; protos/table.proto:31-798 |
| [transaction.proto](../L2-files/protos/transaction.proto.md) | Transaction identity and 16 operation variants; protos/transaction.proto:12-438 |

Every exact public declaration, field number, union arm, and enum value for this reviewed subset is retained in the linked L2 appendix and searchable through the L3 symbol index. The schema files themselves have no private Rust functions, allocators, async lifecycles, or executable error handling; validation described in comments is a required contract rather than proof of enforcement. (protos/ann.proto:1-103; protos/filtered_read.proto:1-126; protos/fragment_metadata.proto:1-455; protos/index.proto:1-383)

## Dependencies and extension boundaries

ANN imports table identity, table index metadata, and index metric types; filtered read imports table identity; index imports protobuf Any and historical index details. These are schema type dependencies. Build-time generators, crate boundaries, and runtime registrations remain pending. (protos/ann.proto:8-10; protos/ann.proto:92-95; protos/filtered_read.proto:8-8; protos/index.proto:8-9)

Add new detail kinds in index.proto; do not relocate existing lance.table types solely for naming consistency because serialized identities matter. Extending existing historical messages is explicitly allowed where needed. The explanatory comment abbreviates the new namespace as lance.index, but the actual package is lance.index.pb. (protos/index_old.proto:8-17; protos/index.proto:6-6)

There are no environment-variable declarations or Cargo feature definitions in the reviewed schema bodies. Manifest feature requirements occur as explicit numeric contracts: overlays need 64, and hidden column lineage needs 2048. Actual supported flags, their stability, and read/write gates must be established from table and Rust code. (protos/fragment_metadata.proto:19-27; protos/fragment_metadata.proto:43-51)

Decoder failure modes are not executable in these files. Notable required validations include MinHash field ranges before allocation, unknown signature-version rejection, and exact lineage column cardinality. (protos/index.proto:332-382; protos/fragment_metadata.proto:288-305)

Table imports Any, Timestamp, shared file schema and publicly re-exports fragment metadata. Transaction imports file/table/Any. file2 imports Any and Empty but only uses Empty in declarations; old encoding schema imports Empty for plain column encoding. The new encoding schema has no imports. These are schema dependencies, not a reconstructed Cargo dependency graph. (protos/table.proto:8-11; protos/transaction.proto:6-10; protos/file2.proto:8-9; protos/file2.proto:154-163; protos/encodings_v2_0.proto:8-8; protos/encodings_v2_0.proto:350-358; protos/encodings_v2_1.proto:1-9)

The current extension seams described by the schemas are Any-typed index details with case-insensitive type URLs, recursive encoding/layout unions, transaction operation variants, sharding transform/SQL choices, and optional namespaced configuration maps. They each require matching runtime dispatch/validation, which has not yet been analyzed. (protos/table.proto:353-367; protos/encodings_v2_1.proto:288-304; protos/encodings_v2_1.proto:640-659; protos/transaction.proto:410-433; protos/table.proto:775-798; protos/table.proto:241-247)

## Source refresh map — 2026-10-11

Current source `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9`. [Changed contracts](../L3-symbols/refresh-2026-10-11.md). Existing directory responsibilities remain; declarations below locate changed boundaries.

### `protos/ann.proto`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `protos/encodings_v2_1.proto`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `protos/filtered_read.proto`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `protos/fragment_metadata.proto`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

### `protos/table.proto`

Existing directory responsibility; changed declarations and implementation ranges are listed below.

