> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-09: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-09-db684d1f.md) at `db684d1f0726c00b6defb7963a604a7719e82b5a` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/mem_wal.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `323b214bd2e21be31d4b4c9da49c8b7ef07b22f30388e4d780866e830f5de38b`. Reviewed physical lines: 1-660.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Public MemWAL metadata models, protobuf conversion, synchronous details opening and failure-atomic compaction-progress metadata replacement. Complete shard fencing/recovery/store IO is outside this module. (rust/lance-table/src/system_index/mem_wal.rs:1-660)

## Complete range analysis

### Lines 1-26

SPDX and module documentation describe configuration, compaction progress and eventually consistent shard snapshots. Comments say writers now update shard manifests rather than rewriting the index per write; complete writer execution is outside this file. Imports HashMap/HashSet, Arc, core errors/deep size, serde, UUID and generated metadata. Public reserved name is exactly __lance_mem_wal. No environment reads, async work, locks or IO are introduced here. (rust/lance-table/src/system_index/mem_wal.rs:1-26)

### Lines 27-55

Public ShardId aliases Uuid; the UUID-v4 comment is not a type-level restriction. Public SsTable derives debug/clone/equality/serde/deep size; generation and path identify immutable flushed MemTable data stored as a Lance dataset by contract. Optional in_memory_bytes estimates payload only, excluding reader per-array overhead. physical_rows counts older duplicate-key rows hidden by deletion vectors. primary_key_bytes is total across physical rows, not per-row, and is absent for no primary key. None means unmeasured, never zero; public construction imposes no consistency/path/count checks. (rust/lance-table/src/system_index/mem_wal.rs:27-55)

### Lines 56-80

SsTable::unmeasured stores supplied generation/path with all three measurements None. Borrowed conversion to pb::SsTable clones path and copies scalars/options without validation, file access or measurement. Some(0) remains distinct from None. (rust/lance-table/src/system_index/mem_wal.rs:56-80)

### Lines 81-99

Owned pb::SsTable conversion moves path and preserves generation/measurement options unchanged. Public CompactedSsTable derives Debug/Clone/equality/PartialOrd/Hash/serde, owning UUID and generation. Derived ordering considers shard_id before generation; it is not a per-shard progress validator. No Ord derive is declared. (rust/lance-table/src/system_index/mem_wal.rs:81-99)

### Lines 100-124

CompactedSsTable deep-size children returns0 for fixed inline UUID/u64; new merely stores values. Borrowed protobuf conversion always writes Some UUID bytes through format converter and exact generation. Neither constructor nor encoder checks UUID variant/version or positive generation. (rust/lance-table/src/system_index/mem_wal.rs:100-124)

### Lines 125-140

Owned CompactedSsTable protobuf decoding requires shard_id Option or InvalidInput Missing shard_id in CompactedSsTable, then propagates Uuid::try_from errors using nested ?. The shared UUID converter requires16 bytes but does not enforce v4 (rust/lance-table/src/format.rs:57-68). All u64 generations including0 accepted. (rust/lance-table/src/system_index/mem_wal.rs:125-140)

### Lines 141-165

Public Default/serde/deep-size IndexCatchupProgress stores index_name and ordered Vec<CompactedSsTable>. new stores unchecked input. caught_up_generation_for_shard linearly finds the first matching shard and copies generation; duplicate entries are not normalized. None on absence is documented as fully caught up, not generation0, and method performs no comparison against current compaction. (rust/lance-table/src/system_index/mem_wal.rs:141-165)

### Lines 166-193

IndexCatchupProgress encoding clones name and maps entries in existing order. Decoding moves name, converts every CompactedSsTable with short-circuit Result collection and preserves order. UUID errors propagate; empty names/lists and duplicate shard IDs are accepted here. (rust/lance-table/src/system_index/mem_wal.rs:166-193)

### Lines 194-226

Public Copy/Default/equality/serde ShardStatus has default Active and Sealed. Docs describe Sealed as reversible durable in-doubt state for drop-table two-phase commit, rejecting writer claims elsewhere. Private to_i32 writes0/1; from_i32 maps exactly1 to Sealed and every other signed value to Active. Unknown values therefore lose their original discriminant when roundtripped. This forward-default policy does not itself enforce fencing or rollback. (rust/lance-table/src/system_index/mem_wal.rs:194-226)

### Lines 227-256

Public ShardManifest owns shard UUID, version, u32 spec ID, HashMap<String,Vec<u8>> computed field values, writer_epoch, two WAL positions, current_generation, ordered SSTables and status. Field bytes are documented LE Arrow scalar representation interpreted by ShardingField.result_type; no encoding/validation performed here. Replay-after is last covered position and recovery starts+1;0 means no flush, last-seen0 means no written entry, positions otherwise1-based by contract. Status-preservation and sole-writer comments describe external protocols, not guarantees of this freely mutable struct. (rust/lance-table/src/system_index/mem_wal.rs:227-256)

### Lines 257-274

ShardManifest::next_version returns self.version+1 with ordinary u64 arithmetic, without checked overflow or mutation. Docs require gap-free CAS allocation because readers stop at the first missing version, but no CAS/IO is implemented. At u64MAX ordinary Rust overflow behavior applies; not a Result error. DeepSizeOf counts only field-map and SSTable-vector children; scalars/status/UUID remain inline. (rust/lance-table/src/system_index/mem_wal.rs:257-274)

### Lines 275-298

Borrowed ShardManifest protobuf conversion emits Some shard UUID; copies counters/spec/positions; turns HashMap fields into cloned repeated entries in unspecified map iteration order; maps SSTables preserving order; and writes status discriminant. Equivalent maps can produce differently ordered protobuf vectors. No version/position monotonicity, field-type, uniqueness or generation checks. (rust/lance-table/src/system_index/mem_wal.rs:275-298)

### Lines 299-328

Owned ShardManifest decoder first requires valid16-byte shard UUID, then collects repeated field entries into HashMap so later duplicate field IDs replace earlier values. Moves SSTable values through infallible converter and maps unknown status to Active. No relation checked between replay-after and last-seen, no SSTable sorting or spec-field interpretation. Only missing/malformed shard UUID yields a local validation error. (rust/lance-table/src/system_index/mem_wal.rs:299-328)

### Lines 329-364

Public ShardingField derives debug/clone/equality/serde/deep size, with field_id String, source_ids Vec<i32>, optional transform/expression strings, result_type String and string parameters. Borrowed protobuf conversion clones all fields; owned reverse moves them. Both transform and expression may be present or absent, source IDs may repeat or be negative, and arbitrary types/parameters pass without parsing. Actual sharding validation/evaluation is elsewhere. (rust/lance-table/src/system_index/mem_wal.rs:329-364)

### Lines 365-390

Public ShardingSpec contains u32 spec_id and ordered Vec<ShardingField> with the same derives. Encoding maps borrowed fields and copies ID; decoding consumes/maps fields. No sorting, duplicate spec/field checks, source existence checks or expression execution. Empty fields accepted. (rust/lance-table/src/system_index/mem_wal.rs:365-390)

### Lines 391-410

Public Default MemWalIndexDetails contains signed snapshot timestamp, u32 shard count, optional opaque inline snapshot bytes, sharding specs, maintained index names, maintain_all_indexes bool, compacted generations, index catchup and writer_config_defaults string map. Derived defaults are0/false/None/empty; docs say persisted writer defaults can be overridden by per-writer nonpersisted config. This struct neither parses config nor materializes snapshot bytes or derives num_shards from their contents. (rust/lance-table/src/system_index/mem_wal.rs:391-410)

### Lines 411-430

Borrowed details conversion copies scalars, clones snapshots/name/config maps, maps specs/progress in Vec order and always emits maintain_all_indexes Some(bool). It does not preserve absence of that protobuf optional flag. Full nested structures are cloned into a new protobuf object; no byte serialization or storage in this conversion. (rust/lance-table/src/system_index/mem_wal.rs:411-430)

### Lines 431-460

Owned details decoder moves snapshots/config/names, maps specs, defaults absent maintain_all_indexes to false, then fallibly decodes compacted entries followed by catchup entries. Error precedence follows those two collections; malformed UUID can fail despite arbitrary other metadata being accepted. No duplicate/index-name/generation/spec/config validation, no snapshot count/timestamp consistency checks. Unknown protobuf fields have already been handled by dependency decoder. (rust/lance-table/src/system_index/mem_wal.rs:431-460)

### Lines 461-489

Public MemWalIndex derives Debug/Clone/equality/deep size and exposes mutable details. new only stores. compacted_generation_for_shard linearly returns first matching compacted marker. index_caught_up_generation first finds exact index name then first shard entry; absent index or shard returns None, documented as fully caught up. It does not inspect maintain_all_indexes or infer catchup from latest generation. Duplicate earlier entries shadow later ones. (rust/lance-table/src/system_index/mem_wal.rs:461-489)

### Lines 490-509

Public load_mem_wal_index_details consumes IndexMetadata but borrows its optional Any. Missing details yields Error::Index; explicit type-url precheck is case-sensitive ends_with MemWalIndexDetails, then Any::to_msg<pb::MemWalIndexDetails> and fallible object conversion run with propagated errors. The suffix precheck is not a complete description of dependency to_msg type validation. No index name/index_version/fields/files/base/UUID checks or IO. A borrowed caller must clone metadata to retain it. (rust/lance-table/src/system_index/mem_wal.rs:490-509)

### Lines 510-517

Public open_mem_wal_index consumes metadata, synchronously loads details, wraps MemWalIndex in a fresh Arc and returns Result. Despite open in its name, this function performs no storage access/cache lookup, and owns no async cancellation lifecycle. Parsing/allocation errors propagate before a returned Arc exists. (rust/lance-table/src/system_index/mem_wal.rs:510-517)

### Lines 518-539

Public update_mem_wal_index_compacted_sstables takes mutable metadata slice, caller dataset_version and owned progress Vec. Docs explain row mutations must publish with matching generation; accepting a stale worker while retaining a newer marker could hide uninserted SSTable rows. Empty proposed Vec returns Ok immediately, before index existence/type checks and without changing any UUID/version. Local code mutates metadata only; complete transaction publication is a caller obligation. (rust/lance-table/src/system_index/mem_wal.rs:518-539)

### Lines 540-564

Before inspecting current metadata, allocate HashSet to proposed count and reject any repeated UUID with InvalidInput, even if generations equal/differ. Then choose first metadata entry with exact reserved name; if absent return InvalidInput explaining compaction progress cannot invent a system index. Duplicate reserved entries are not rejected; first wins. Validation precedence is empty, duplicate proposal, missing current index. (rust/lance-table/src/system_index/mem_wal.rs:540-564)

### Lines 565-585

Clone selected IndexMetadata and fully decode into local mutable details before any slice mutation. For each proposed shard in supplied order, find first matching stored marker: reject generation<=existing with both values and UUID; greater replaces only generation; absent appends proposed entry including generation0. Earlier local changes are discarded if a later proposal fails. Existing duplicate shard markers are not rejected and only first is updated; no shard existence check against specs/snapshots, no num_shards update and no automatic catchup advancement. Expected proposal HashSet work is linear; repeated stored Vec scans can be O(proposals*(existing+proposals)). (rust/lance-table/src/system_index/mem_wal.rs:565-585)

### Lines 586-591

After all validation, build fresh metadata then assign at original index position; ? evaluates before replacement, so Result failure leaves caller slice unchanged. Other indices/order remain intact. Unrelated decoded MemWalIndexDetails fields are carried through, but unknown protobuf bytes and optional maintain_all flag absence are not byte-verbatim preserved. Outer metadata fields are recreated by new_mem_wal_index_meta, not copied from old entry. No files written or rows changed here. (rust/lance-table/src/system_index/mem_wal.rs:586-591)

### Lines 592-618

Public new_mem_wal_index_meta consumes details and returns IndexMetadata with fresh v4 UUID, reserved name, empty indexed/covering fields, caller dataset_version, no fragment bitmap, Some Arc Any encoding of details, index_version0, current UTC creation timestamp, no base_id and no files. UUID is generated before Any serialization; timestamp after it. Failure returns before metadata is installed. Docs explain UUID change invalidates decoded-details cache; contextual dataset open includes metadata UUID in cache-key construction (rust/lance/src/index.rs:3802-3832). The helper performs serialization/allocation/randomness/time reads but no object-store IO. (rust/lance-table/src/system_index/mem_wal.rs:592-618)

### Lines 619-642

Private cfg(test) module imports parent. First test constructs old-style pb::SsTable with all three size fields None and generation7, converts it and asserts generation and every None. No physical older release fixture is read, no path assertion or storage IO. This tests presence semantics via current protobuf construction. (rust/lance-table/src/system_index/mem_wal.rs:619-642)

### Lines 643-660

Second test constructs generation7/path aaa_gen_7 with4096 payload bytes,10 physical rows and80 primary-key bytes. Borrowed encoder must preserve all Some values and owned decoder must equal full original SsTable. Exactly two local unit tests; they were read, not executed. Other methods have contextual tests in lance/src/index/mem_wal.rs, which remains partially analyzed. (rust/lance-table/src/system_index/mem_wal.rs:643-660)

## Interaction and interpretation limits

All660 physical lines read. Two local tests read, not run. Contextual dataset cache and transaction callers plus selected external tests are documented separately; these partial reads do not mark those files analyzed. No source modification, network or source build/test occurred.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! MemWAL index data structures and metadata helpers.
    5 | //!
    6 | //! The MemWAL Index stores:
    7 | //! - Configuration (sharding_specs, maintained_indexes)
    8 | //! - SSTable compaction progress
    9 | //! - Shard state snapshots (eventually consistent)
   10 | //!
   11 | //! Writers no longer update the index on every write. Instead, they update
   12 | //! shard manifests directly. This module provides functions to:
   13 | //! - Load the MemWAL index
   14 | //! - Update compacted SSTables (called during merge-insert commits)
   15 | 
   16 | use std::collections::{HashMap, HashSet};
   17 | use std::sync::Arc;
   18 | 
   19 | use lance_core::deepsize::DeepSizeOf;
   20 | use lance_core::{Error, Result};
   21 | use serde::{Deserialize, Serialize};
   22 | use uuid::Uuid;
   23 | 
   24 | use crate::format::{IndexMetadata, pb};
   25 | 
   26 | pub const MEM_WAL_INDEX_NAME: &str = "__lance_mem_wal";
   27 | 
   28 | /// Type alias for shard identifier (UUID v4).
   29 | pub type ShardId = Uuid;
   30 | 
   31 | /// An SSTable: the immutable result of flushing a MemTable, stored as a Lance dataset.
   32 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
   33 | pub struct SsTable {
   34 |     pub generation: u64,
   35 |     pub path: String,
   36 |     /// Payload size of the rows, as the writer's MemTable accounted for them.
   37 |     ///
   38 |     /// An estimate of the payload, not a bound on what reading the SSTable
   39 |     /// costs: it excludes the per-array structure a reader materializes, so a
   40 |     /// consumer budgeting memory from it must add its own headroom.
   41 |     ///
   42 |     /// `None` on an SSTable written before these fields existed, which a reader
   43 |     /// must carry as unmeasured rather than as zero. The same applies to the two
   44 |     /// below.
   45 |     pub in_memory_bytes: Option<u64>,
   46 |     /// Rows held, counting the older duplicates of a primary key that the
   47 |     /// generation's deletion vector masks.
   48 |     pub physical_rows: Option<u64>,
   49 |     /// Total payload size of the primary-key columns over every row in
   50 |     /// [`Self::physical_rows`] -- not a per-row size, which varies for a
   51 |     /// variable-length key. Carries the same estimate caveat as
   52 |     /// [`Self::in_memory_bytes`], and is also `None` on a table with no primary
   53 |     /// key.
   54 |     pub primary_key_bytes: Option<u64>,
   55 | }
   56 | 
   57 | impl SsTable {
   58 |     /// An SSTable whose contents were not measured at flush.
   59 |     pub fn unmeasured(generation: u64, path: String) -> Self {
   60 |         Self {
   61 |             generation,
   62 |             path,
   63 |             in_memory_bytes: None,
   64 |             physical_rows: None,
   65 |             primary_key_bytes: None,
   66 |         }
   67 |     }
   68 | }
   69 | 
   70 | impl From<&SsTable> for pb::SsTable {
   71 |     fn from(sstable: &SsTable) -> Self {
   72 |         Self {
   73 |             generation: sstable.generation,
   74 |             path: sstable.path.clone(),
   75 |             in_memory_bytes: sstable.in_memory_bytes,
   76 |             physical_rows: sstable.physical_rows,
   77 |             primary_key_bytes: sstable.primary_key_bytes,
   78 |         }
   79 |     }
   80 | }
   81 | 
   82 | impl From<pb::SsTable> for SsTable {
   83 |     fn from(sstable: pb::SsTable) -> Self {
   84 |         Self {
   85 |             generation: sstable.generation,
   86 |             path: sstable.path,
   87 |             in_memory_bytes: sstable.in_memory_bytes,
   88 |             physical_rows: sstable.physical_rows,
   89 |             primary_key_bytes: sstable.primary_key_bytes,
   90 |         }
   91 |     }
   92 | }
   93 | 
   94 | /// A pointer to the latest SSTable compacted for a shard.
   95 | #[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Hash, Serialize, Deserialize)]
   96 | pub struct CompactedSsTable {
   97 |     pub shard_id: Uuid,
   98 |     pub generation: u64,
   99 | }
  100 | 
  101 | impl DeepSizeOf for CompactedSsTable {
  102 |     fn deep_size_of_children(&self, _context: &mut lance_core::deepsize::Context) -> usize {
  103 |         0 // UUID is 16 bytes fixed size, no heap allocations
  104 |     }
  105 | }
  106 | 
  107 | impl CompactedSsTable {
  108 |     pub fn new(shard_id: Uuid, generation: u64) -> Self {
  109 |         Self {
  110 |             shard_id,
  111 |             generation,
  112 |         }
  113 |     }
  114 | }
  115 | 
  116 | impl From<&CompactedSsTable> for pb::CompactedSsTable {
  117 |     fn from(sstable: &CompactedSsTable) -> Self {
  118 |         Self {
  119 |             shard_id: Some((&sstable.shard_id).into()),
  120 |             generation: sstable.generation,
  121 |         }
  122 |     }
  123 | }
  124 | 
  125 | impl TryFrom<pb::CompactedSsTable> for CompactedSsTable {
  126 |     type Error = Error;
  127 | 
  128 |     fn try_from(sstable: pb::CompactedSsTable) -> lance_core::Result<Self> {
  129 |         let shard_id = sstable
  130 |             .shard_id
  131 |             .as_ref()
  132 |             .map(Uuid::try_from)
  133 |             .ok_or_else(|| Error::invalid_input("Missing shard_id in CompactedSsTable"))??;
  134 |         Ok(Self {
  135 |             shard_id,
  136 |             generation: sstable.generation,
  137 |         })
  138 |     }
  139 | }
  140 | 
  141 | /// Tracks which compacted SSTable generation a base table index covers.
  142 | /// Used to determine whether to read from SSTable indexes or base table.
  143 | #[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  144 | pub struct IndexCatchupProgress {
  145 |     pub index_name: String,
  146 |     pub caught_up_generations: Vec<CompactedSsTable>,
  147 | }
  148 | 
  149 | impl IndexCatchupProgress {
  150 |     pub fn new(index_name: String, caught_up_generations: Vec<CompactedSsTable>) -> Self {
  151 |         Self {
  152 |             index_name,
  153 |             caught_up_generations,
  154 |         }
  155 |     }
  156 | 
  157 |     /// Get the caught up generation for a specific shard.
  158 |     /// Returns None if the shard is not present (assumed fully caught up).
  159 |     pub fn caught_up_generation_for_shard(&self, shard_id: &Uuid) -> Option<u64> {
  160 |         self.caught_up_generations
  161 |             .iter()
  162 |             .find(|sstable| &sstable.shard_id == shard_id)
  163 |             .map(|sstable| sstable.generation)
  164 |     }
  165 | }
  166 | 
  167 | impl From<&IndexCatchupProgress> for pb::IndexCatchupProgress {
  168 |     fn from(icp: &IndexCatchupProgress) -> Self {
  169 |         Self {
  170 |             index_name: icp.index_name.clone(),
  171 |             caught_up_generations: icp
  172 |                 .caught_up_generations
  173 |                 .iter()
  174 |                 .map(|sstable| sstable.into())
  175 |                 .collect(),
  176 |         }
  177 |     }
  178 | }
  179 | 
  180 | impl TryFrom<pb::IndexCatchupProgress> for IndexCatchupProgress {
  181 |     type Error = Error;
  182 | 
  183 |     fn try_from(icp: pb::IndexCatchupProgress) -> lance_core::Result<Self> {
  184 |         Ok(Self {
  185 |             index_name: icp.index_name,
  186 |             caught_up_generations: icp
  187 |                 .caught_up_generations
  188 |                 .into_iter()
  189 |                 .map(CompactedSsTable::try_from)
  190 |                 .collect::<lance_core::Result<_>>()?,
  191 |         })
  192 |     }
  193 | }
  194 | 
  195 | /// Lifecycle status of a WAL shard, persisted in [`ShardManifest`].
  196 | ///
  197 | /// `Sealed` is the durable in-doubt record for drop-table two-phase
  198 | /// commit: a sealed shard refuses new writer claims (enforced in
  199 | /// `claim_epoch`) but is reversible back to `Active` on rollback.
  200 | #[derive(Debug, Clone, Copy, Default, PartialEq, Eq, Serialize, Deserialize)]
  201 | pub enum ShardStatus {
  202 |     /// Normal: the shard accepts writer claims.
  203 |     #[default]
  204 |     Active,
  205 |     /// A drop is in flight: claims are refused. Reversible.
  206 |     Sealed,
  207 | }
  208 | 
  209 | impl ShardStatus {
  210 |     /// Map to the protobuf enum discriminant (`pb::ShardStatus`).
  211 |     fn to_i32(self) -> i32 {
  212 |         match self {
  213 |             Self::Active => 0,
  214 |             Self::Sealed => 1,
  215 |         }
  216 |     }
  217 | 
  218 |     /// Map from the protobuf enum discriminant; unknown values decode as
  219 |     /// `Active` (forward-compatible default).
  220 |     fn from_i32(v: i32) -> Self {
  221 |         match v {
  222 |             1 => Self::Sealed,
  223 |             _ => Self::Active,
  224 |         }
  225 |     }
  226 | }
  227 | 
  228 | /// Shard manifest containing epoch-based fencing and WAL state.
  229 | /// Each shard has exactly one active writer at any time.
  230 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
  231 | pub struct ShardManifest {
  232 |     pub shard_id: Uuid,
  233 |     pub version: u64,
  234 |     pub shard_spec_id: u32,
  235 |     /// Computed shard field values as raw Arrow scalar bytes, keyed by field id.
  236 |     /// The byte encoding follows Arrow's little-endian convention: int32 is 4 LE
  237 |     /// bytes, utf8 is raw UTF-8 bytes, etc. The result_type in the corresponding
  238 |     /// ShardingField from the ShardingSpec determines how to interpret each value.
  239 |     pub shard_field_values: HashMap<String, Vec<u8>>,
  240 |     pub writer_epoch: u64,
  241 |     /// The most recent WAL entry position flushed to a MemTable.
  242 |     /// Recovery replays from `replay_after_wal_entry_position + 1`. The
  243 |     /// default value 0 means "no flush has ever stamped this shard" — WAL
  244 |     /// positions themselves are 1-based, so 0 is never a valid covered
  245 |     /// position.
  246 |     pub replay_after_wal_entry_position: u64,
  247 |     /// The most recent WAL entry position observed at manifest write time.
  248 |     /// Default 0 means "no entry has been written yet"; WAL positions are
  249 |     /// 1-based.
  250 |     pub wal_entry_position_last_seen: u64,
  251 |     pub current_generation: u64,
  252 |     pub sstables: Vec<SsTable>,
  253 |     /// Lifecycle status (drop-table 2PC). Defaults to `Active`; preserved
  254 |     /// across claims via `..base` so only fresh constructions set it.
  255 |     pub status: ShardStatus,
  256 | }
  257 | 
  258 | impl ShardManifest {
  259 |     /// The version a manifest built on this one must carry.
  260 |     ///
  261 |     /// Manifest versions are CAS-allocated and must stay gap-free: a reader
  262 |     /// scans forward and stops at the first version it cannot find, so a gap
  263 |     /// hides everything past it.
  264 |     pub fn next_version(&self) -> u64 {
  265 |         self.version + 1
  266 |     }
  267 | }
  268 | 
  269 | impl DeepSizeOf for ShardManifest {
  270 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  271 |         self.shard_field_values.deep_size_of_children(context)
  272 |             + self.sstables.deep_size_of_children(context)
  273 |     }
  274 | }
  275 | 
  276 | impl From<&ShardManifest> for pb::ShardManifest {
  277 |     fn from(rm: &ShardManifest) -> Self {
  278 |         Self {
  279 |             shard_id: Some((&rm.shard_id).into()),
  280 |             version: rm.version,
  281 |             shard_spec_id: rm.shard_spec_id,
  282 |             shard_field_entries: rm
  283 |                 .shard_field_values
  284 |                 .iter()
  285 |                 .map(|(k, v)| pb::ShardFieldEntry {
  286 |                     field_id: k.clone(),
  287 |                     value: v.clone(),
  288 |                 })
  289 |                 .collect(),
  290 |             writer_epoch: rm.writer_epoch,
  291 |             replay_after_wal_entry_position: rm.replay_after_wal_entry_position,
  292 |             wal_entry_position_last_seen: rm.wal_entry_position_last_seen,
  293 |             current_generation: rm.current_generation,
  294 |             sstables: rm.sstables.iter().map(|sstable| sstable.into()).collect(),
  295 |             status: rm.status.to_i32(),
  296 |         }
  297 |     }
  298 | }
  299 | 
  300 | impl TryFrom<pb::ShardManifest> for ShardManifest {
  301 |     type Error = Error;
  302 | 
  303 |     fn try_from(rm: pb::ShardManifest) -> lance_core::Result<Self> {
  304 |         let shard_id = rm
  305 |             .shard_id
  306 |             .as_ref()
  307 |             .map(Uuid::try_from)
  308 |             .ok_or_else(|| Error::invalid_input("Missing shard_id in ShardManifest"))??;
  309 |         let shard_field_values = rm
  310 |             .shard_field_entries
  311 |             .into_iter()
  312 |             .map(|e| (e.field_id, e.value))
  313 |             .collect();
  314 |         Ok(Self {
  315 |             shard_id,
  316 |             version: rm.version,
  317 |             shard_spec_id: rm.shard_spec_id,
  318 |             shard_field_values,
  319 |             writer_epoch: rm.writer_epoch,
  320 |             replay_after_wal_entry_position: rm.replay_after_wal_entry_position,
  321 |             wal_entry_position_last_seen: rm.wal_entry_position_last_seen,
  322 |             current_generation: rm.current_generation,
  323 |             sstables: rm.sstables.into_iter().map(SsTable::from).collect(),
  324 |             status: ShardStatus::from_i32(rm.status),
  325 |         })
  326 |     }
  327 | }
  328 | 
  329 | /// Sharding field definition.
  330 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  331 | pub struct ShardingField {
  332 |     pub field_id: String,
  333 |     pub source_ids: Vec<i32>,
  334 |     pub transform: Option<String>,
  335 |     pub expression: Option<String>,
  336 |     pub result_type: String,
  337 |     pub parameters: HashMap<String, String>,
  338 | }
  339 | 
  340 | impl From<&ShardingField> for pb::ShardingField {
  341 |     fn from(rf: &ShardingField) -> Self {
  342 |         Self {
  343 |             field_id: rf.field_id.clone(),
  344 |             source_ids: rf.source_ids.clone(),
  345 |             transform: rf.transform.clone(),
  346 |             expression: rf.expression.clone(),
  347 |             result_type: rf.result_type.clone(),
  348 |             parameters: rf.parameters.clone(),
  349 |         }
  350 |     }
  351 | }
  352 | 
  353 | impl From<pb::ShardingField> for ShardingField {
  354 |     fn from(rf: pb::ShardingField) -> Self {
  355 |         Self {
  356 |             field_id: rf.field_id,
  357 |             source_ids: rf.source_ids,
  358 |             transform: rf.transform,
  359 |             expression: rf.expression,
  360 |             result_type: rf.result_type,
  361 |             parameters: rf.parameters,
  362 |         }
  363 |     }
  364 | }
  365 | 
  366 | /// Sharding spec definition.
  367 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  368 | pub struct ShardingSpec {
  369 |     pub spec_id: u32,
  370 |     pub fields: Vec<ShardingField>,
  371 | }
  372 | 
  373 | impl From<&ShardingSpec> for pb::ShardingSpec {
  374 |     fn from(rs: &ShardingSpec) -> Self {
  375 |         Self {
  376 |             spec_id: rs.spec_id,
  377 |             fields: rs.fields.iter().map(|f| f.into()).collect(),
  378 |         }
  379 |     }
  380 | }
  381 | 
  382 | impl From<pb::ShardingSpec> for ShardingSpec {
  383 |     fn from(rs: pb::ShardingSpec) -> Self {
  384 |         Self {
  385 |             spec_id: rs.spec_id,
  386 |             fields: rs.fields.into_iter().map(ShardingField::from).collect(),
  387 |         }
  388 |     }
  389 | }
  390 | 
  391 | /// Index details for MemWAL Index, stored in IndexMetadata.index_details.
  392 | #[derive(Debug, Clone, Default, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  393 | pub struct MemWalIndexDetails {
  394 |     pub snapshot_ts_millis: i64,
  395 |     pub num_shards: u32,
  396 |     pub inline_snapshots: Option<Vec<u8>>,
  397 |     pub sharding_specs: Vec<ShardingSpec>,
  398 |     pub maintained_indexes: Vec<String>,
  399 |     pub maintain_all_indexes: bool,
  400 |     pub compacted_sstables: Vec<CompactedSsTable>,
  401 |     pub index_catchup: Vec<IndexCatchupProgress>,
  402 |     /// Default `ShardWriter` configuration values for this MemWAL index.
  403 |     ///
  404 |     /// Persisted so every writer — across processes and restarts — starts
  405 |     /// from the same default writer configuration. These are defaults only;
  406 |     /// an individual writer may still override any value at runtime in its
  407 |     /// own (non-persisted) `ShardWriterConfig`.
  408 |     pub writer_config_defaults: HashMap<String, String>,
  409 | }
  410 | 
  411 | impl From<&MemWalIndexDetails> for pb::MemWalIndexDetails {
  412 |     fn from(details: &MemWalIndexDetails) -> Self {
  413 |         Self {
  414 |             snapshot_ts_millis: details.snapshot_ts_millis,
  415 |             num_shards: details.num_shards,
  416 |             inline_snapshots: details.inline_snapshots.clone(),
  417 |             sharding_specs: details.sharding_specs.iter().map(|rs| rs.into()).collect(),
  418 |             maintained_indexes: details.maintained_indexes.clone(),
  419 |             maintain_all_indexes: Some(details.maintain_all_indexes),
  420 |             compacted_sstables: details
  421 |                 .compacted_sstables
  422 |                 .iter()
  423 |                 .map(|sstable| sstable.into())
  424 |                 .collect(),
  425 |             index_catchup: details.index_catchup.iter().map(|icp| icp.into()).collect(),
  426 |             writer_config_defaults: details.writer_config_defaults.clone(),
  427 |         }
  428 |     }
  429 | }
  430 | 
  431 | impl TryFrom<pb::MemWalIndexDetails> for MemWalIndexDetails {
  432 |     type Error = Error;
  433 | 
  434 |     fn try_from(details: pb::MemWalIndexDetails) -> lance_core::Result<Self> {
  435 |         Ok(Self {
  436 |             snapshot_ts_millis: details.snapshot_ts_millis,
  437 |             num_shards: details.num_shards,
  438 |             inline_snapshots: details.inline_snapshots,
  439 |             sharding_specs: details
  440 |                 .sharding_specs
  441 |                 .into_iter()
  442 |                 .map(ShardingSpec::from)
  443 |                 .collect(),
  444 |             maintained_indexes: details.maintained_indexes,
  445 |             maintain_all_indexes: details.maintain_all_indexes.unwrap_or(false),
  446 |             compacted_sstables: details
  447 |                 .compacted_sstables
  448 |                 .into_iter()
  449 |                 .map(CompactedSsTable::try_from)
  450 |                 .collect::<lance_core::Result<_>>()?,
  451 |             index_catchup: details
  452 |                 .index_catchup
  453 |                 .into_iter()
  454 |                 .map(IndexCatchupProgress::try_from)
  455 |                 .collect::<lance_core::Result<_>>()?,
  456 |             writer_config_defaults: details.writer_config_defaults,
  457 |         })
  458 |     }
  459 | }
  460 | 
  461 | /// MemWAL Index provides access to MemWAL configuration and state.
  462 | #[derive(Debug, Clone, PartialEq, Eq, DeepSizeOf)]
  463 | pub struct MemWalIndex {
  464 |     pub details: MemWalIndexDetails,
  465 | }
  466 | 
  467 | impl MemWalIndex {
  468 |     pub fn new(details: MemWalIndexDetails) -> Self {
  469 |         Self { details }
  470 |     }
  471 | 
  472 |     pub fn compacted_generation_for_shard(&self, shard_id: &Uuid) -> Option<u64> {
  473 |         self.details
  474 |             .compacted_sstables
  475 |             .iter()
  476 |             .find(|sstable| &sstable.shard_id == shard_id)
  477 |             .map(|sstable| sstable.generation)
  478 |     }
  479 | 
  480 |     /// Get the caught up generation for a specific index and shard.
  481 |     /// Returns None if the index is not tracked (assumed fully caught up).
  482 |     pub fn index_caught_up_generation(&self, index_name: &str, shard_id: &Uuid) -> Option<u64> {
  483 |         self.details
  484 |             .index_catchup
  485 |             .iter()
  486 |             .find(|icp| icp.index_name == index_name)
  487 |             .and_then(|icp| icp.caught_up_generation_for_shard(shard_id))
  488 |     }
  489 | }
  490 | 
  491 | // Reading and updating the `IndexMetadata` entry that carries the details above.
  492 | 
  493 | /// Load MemWalIndexDetails from an IndexMetadata.
  494 | pub fn load_mem_wal_index_details(index: IndexMetadata) -> Result<MemWalIndexDetails> {
  495 |     if let Some(details_any) = index.index_details.as_ref() {
  496 |         if !details_any.type_url.ends_with("MemWalIndexDetails") {
  497 |             return Err(Error::index(format!(
  498 |                 "Index details is not for the MemWAL index, but {}",
  499 |                 details_any.type_url
  500 |             )));
  501 |         }
  502 | 
  503 |         Ok(MemWalIndexDetails::try_from(
  504 |             details_any.to_msg::<pb::MemWalIndexDetails>()?,
  505 |         )?)
  506 |     } else {
  507 |         Err(Error::index("Index details not found for the MemWAL index"))
  508 |     }
  509 | }
  510 | 
  511 | /// Open the MemWAL index from its metadata.
  512 | pub fn open_mem_wal_index(index: IndexMetadata) -> Result<Arc<MemWalIndex>> {
  513 |     Ok(Arc::new(MemWalIndex::new(load_mem_wal_index_details(
  514 |         index,
  515 |     )?)))
  516 | }
  517 | 
  518 | /// Update `compacted_sstables` in the MemWAL index.
  519 | ///
  520 | /// Called from the final data-changing merge-insert commit for a compaction
  521 | /// target, so the rows and the generation that describes them publish
  522 | /// together.
  523 | ///
  524 | /// A proposed generation must be **strictly greater** than the one the latest
  525 | /// state records for that shard, and a stale one fails the whole transaction.
  526 | /// Accepting it while keeping the larger marker would publish that worker's row
  527 | /// mutations under a generation it did not produce, and anything reading only
  528 | /// the marker could then stop serving SSTables whose rows were never inserted.
  529 | ///
  530 | /// Every other `MemWalIndexDetails` field is carried through untouched.
  531 | pub fn update_mem_wal_index_compacted_sstables(
  532 |     indices: &mut [IndexMetadata],
  533 |     dataset_version: u64,
  534 |     new_compacted_sstables: Vec<CompactedSsTable>,
  535 | ) -> Result<()> {
  536 |     if new_compacted_sstables.is_empty() {
  537 |         return Ok(());
  538 |     }
  539 | 
  540 |     let mut seen_shards = HashSet::with_capacity(new_compacted_sstables.len());
  541 |     for sstable in &new_compacted_sstables {
  542 |         if !seen_shards.insert(sstable.shard_id) {
  543 |             return Err(Error::invalid_input(format!(
  544 |                 "Duplicate shard {} in one SSTable compaction update; each shard \
  545 |                  may advance at most once per transaction",
  546 |                 sstable.shard_id
  547 |             )));
  548 |         }
  549 |     }
  550 | 
  551 |     // Default details would describe a table with no MemWAL shards at all, so
  552 |     // the recorded generation would name a shard nothing can corroborate.
  553 |     // Refuse instead of inventing metadata.
  554 |     let pos = indices
  555 |         .iter()
  556 |         .position(|idx| idx.name == MEM_WAL_INDEX_NAME)
  557 |         .ok_or_else(|| {
  558 |             Error::invalid_input(format!(
  559 |                 "Cannot record SSTable compaction progress: the {} system index \
  560 |                  does not exist on this table",
  561 |                 MEM_WAL_INDEX_NAME
  562 |             ))
  563 |         })?;
  564 | 
  565 |     // Validated against a copy so a rejected update leaves `indices` exactly as
  566 |     // the caller passed it.
  567 |     let mut details = load_mem_wal_index_details(indices[pos].clone())?;
  568 | 
  569 |     for new_sstable in new_compacted_sstables {
  570 |         match details
  571 |             .compacted_sstables
  572 |             .iter_mut()
  573 |             .find(|sstable| sstable.shard_id == new_sstable.shard_id)
  574 |         {
  575 |             Some(existing) if new_sstable.generation <= existing.generation => {
  576 |                 return Err(Error::invalid_input(format!(
  577 |                     "Stale SSTable compaction for shard {}: proposed generation {} \
  578 |                      is not greater than the recorded generation {}",
  579 |                     new_sstable.shard_id, new_sstable.generation, existing.generation
  580 |                 )));
  581 |             }
  582 |             Some(existing) => existing.generation = new_sstable.generation,
  583 |             None => details.compacted_sstables.push(new_sstable),
  584 |         }
  585 |     }
  586 | 
  587 |     // Replaced in place so the index list keeps its order.
  588 |     indices[pos] = new_mem_wal_index_meta(dataset_version, details)?;
  589 |     Ok(())
  590 | }
  591 | 
  592 | /// Create a new MemWAL index metadata entry.
  593 | ///
  594 | /// A fresh UUID is minted on every rewrite, including metadata-only updates.
  595 | /// The decoded-details cache is keyed on that UUID, so the change of identity
  596 | /// is what invalidates it; holding the UUID steady would leave a warmed reader
  597 | /// answering with the state from before the update.
  598 | pub fn new_mem_wal_index_meta(
  599 |     dataset_version: u64,
  600 |     details: MemWalIndexDetails,
  601 | ) -> Result<IndexMetadata> {
  602 |     Ok(IndexMetadata {
  603 |         uuid: Uuid::new_v4(),
  604 |         name: MEM_WAL_INDEX_NAME.to_string(),
  605 |         fields: vec![],
  606 |         covering_fields: vec![],
  607 |         dataset_version,
  608 |         fragment_bitmap: None,
  609 |         index_details: Some(Arc::new(prost_types::Any::from_msg(
  610 |             &pb::MemWalIndexDetails::from(&details),
  611 |         )?)),
  612 |         index_version: 0,
  613 |         created_at: Some(chrono::Utc::now()),
  614 |         base_id: None,
  615 |         // Memory WAL index is inline (no files)
  616 |         files: None,
  617 |     })
  618 | }
  619 | 
  620 | #[cfg(test)]
  621 | mod tests {
  622 |     use super::*;
  623 | 
  624 |     /// An SSTable written before the size fields existed decodes as
  625 |     /// unmeasured, not as zero. A reader that saw zero would treat a full
  626 |     /// generation as costing nothing.
  627 |     #[test]
  628 |     fn an_sstable_without_the_size_fields_decodes_as_unmeasured() {
  629 |         let legacy = pb::SsTable {
  630 |             generation: 7,
  631 |             path: "aaa_gen_7".to_string(),
  632 |             in_memory_bytes: None,
  633 |             physical_rows: None,
  634 |             primary_key_bytes: None,
  635 |         };
  636 |         let decoded = SsTable::from(legacy);
  637 |         assert_eq!(decoded.generation, 7);
  638 |         assert_eq!(decoded.in_memory_bytes, None);
  639 |         assert_eq!(decoded.physical_rows, None);
  640 |         assert_eq!(decoded.primary_key_bytes, None);
  641 |     }
  642 | 
  643 |     /// All three survive the round trip, so a reader sees what the flush
  644 |     /// measured rather than a default.
  645 |     #[test]
  646 |     fn the_recorded_size_survives_the_round_trip() {
  647 |         let recorded = SsTable {
  648 |             generation: 7,
  649 |             path: "aaa_gen_7".to_string(),
  650 |             in_memory_bytes: Some(4_096),
  651 |             physical_rows: Some(10),
  652 |             primary_key_bytes: Some(80),
  653 |         };
  654 |         let encoded = pb::SsTable::from(&recorded);
  655 |         assert_eq!(encoded.in_memory_bytes, Some(4_096));
  656 |         assert_eq!(encoded.physical_rows, Some(10));
  657 |         assert_eq!(encoded.primary_key_bytes, Some(80));
  658 |         assert_eq!(SsTable::from(encoded), recorded);
  659 |     }
  660 | }
``````
