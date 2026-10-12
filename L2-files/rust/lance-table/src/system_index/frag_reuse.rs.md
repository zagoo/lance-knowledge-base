> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/frag_reuse.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `77ac08f7b9b49c36edc92a39065c326ee9d5ade01a2a145dbe79ea73f26e4a2d`. Reviewed physical lines: 1-856.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Fragment-reuse public module routing, reserved identifiers, existing legacy metadata conversions and materialized/compact remap adapters. These frozen compatibility surfaces are documented without modification or feature extension. (rust/lance-table/src/system_index/frag_reuse.rs:1-856)

## Complete range analysis

### Lines 1-28

SPDX, public gate/ledger/lineage/metadata modules and imports connect Arrow, shared ownership, metadata, legacy serde, Roaring and core remaps. Public reserved name is __lance_frag_reuse and details filename details.binpb. This file combines existing compatibility models/adapters with module routing; new tagged logic is in child modules. No async production operation, IO or unsafe block here. (rust/lance-table/src/system_index/frag_reuse.rs:1-28)

### Lines 29-49

Public is_frag_reuse_index_entry requires exact reserved name plus Some details with a slash-containing URL and case-insensitive final type name equal protobuf full_name. It does not inspect index_version/details bytes/flags. Public FragDigest derives Debug/Clone/Eq/serde/DeepSizeOf and exposes id:u64 and physical/deleted counts:usize without constructor validation. (rust/lance-table/src/system_index/frag_reuse.rs:29-49)

### Lines 50-87

Borrowed FragDigest->protobuf copies ID and casts counts to u64. Fragment->FragDigest requires physical_rows via expect, defaults missing deletion file or unknown deleted count to0; it does not read deletion metadata. Protobuf->FragDigest is TryFrom<Result> but always Ok with unchecked u64->usize casts, potentially truncating on narrow targets. No deleted<=physical or tombstone-ID guard. (rust/lance-table/src/system_index/frag_reuse.rs:50-87)

### Lines 88-124

Public FragReuseGroup stores raw changed-row-address bytes and ordered old/new digest vectors, with serde/equality/deep-size derives. Encoder clones bytes/converts vectors; decoder moves bytes and collects fallible digest conversions, which locally always succeed. No bitmap decode, trailing check, row conservation or sorting. Empty groups allowed by data representation. (rust/lance-table/src/system_index/frag_reuse.rs:88-124)

### Lines 125-154

Public FragReuseVersion stores dataset_version and group Vec with standard derives. Bidirectional protobuf conversions preserve current sequence order and version; decoder delegates group conversion, no sort or monotonic-version validation. (rust/lance-table/src/system_index/frag_reuse.rs:125-154)

### Lines 155-174

old_frag_ids/new_frag_ids allocate Vecs flattening groups and preserving order/duplicates. new_frag_bitmap first allocates full new-ID Vec then casts every ID to u32 into Roaring, deduplicating/truncating without validation. These methods expose metadata only. (rust/lance-table/src/system_index/frag_reuse.rs:155-174)

### Lines 175-212

Public content enum has Inline(FragReuseIndexDetails) and External(ExternalFile), with serde/deep-size/equality. Public details contains only legacy versions. Borrowed details->InlineContent converts then stable-sorts ascending dataset_version, emits legacy_versions and empty transitions. Reverse reads only legacy_versions, silently discards all tagged transitions, and does not sort. This is an existing legacy representation, not a valid tagged-history roundtrip or a recommendation to extend its writer. (rust/lance-table/src/system_index/frag_reuse.rs:175-212)

### Lines 213-240

Details.new_frag_bitmap unions all new IDs across all versions, including intermediate retired IDs, using unchecked u32 casts and per-version Vec allocation. Public legacy FragReuseIndex is retained for API/serde compatibility and owns public UUID, materialized map Vec and details. Comment says dataset loading uses compact adapter; full current reader dispatch remains separate pending evidence. DeepSizeOf counts maps/details children; UUID owns no heap. (rust/lance-table/src/system_index/frag_reuse.rs:213-240)

### Lines 241-267

Legacy new stores supplied UUID/maps/details without relating or validating them. is_empty tests all maps empty, ignoring details. remap_row_id starts Some input then sequentially queries each map; absent key passes through, mapped None stays deleted and later maps skipped. Values named row IDs here follow physical-address remap use, not stable logical IDs. No chain cycle search: applies each version map once. (rust/lance-table/src/system_index/frag_reuse.rs:241-267)

### Lines 268-292

Legacy in-place loop applies each map to each Some element; None remains, absent passes through. RowAddrTreeMap adapter unwraps row_addrs(), so any full-fragment selection panics; maps/deleted filters materialize a new set. RoaringTreemap adapter similarly filter-maps all addresses into a new deduplicated set. Full-fragment iterator condition is rust/lance-select/src/mask.rs:493-514. Order/duplicate multiplicity are set semantics. (rust/lance-table/src/system_index/frag_reuse.rs:268-292)

### Lines 293-311

Legacy RecordBatch/Array adapters pass closures into shared remap helpers; fragment bitmap delegates metadata helper. Public Result on batch/bitmap does not prevent helper assertion/downcast/iterator panics. These wrappers do not perform IO, schema lookup or synchronization. (rust/lance-table/src/system_index/frag_reuse.rs:293-311)

### Lines 312-329

Public CompactFragReuseIndex derives Debug/Clone/Eq, exposes UUID/details but keeps RowAddrRemap private. Docs motivate bitmap/rank compact representation rather than per-row HashMaps. DeepSizeOf sums remap/details children; retained raw bitmap bytes in details and decoded remap both consume storage. Public details can be mutated independently of private remap after construction, so representation consistency is caller-owned. (rust/lance-table/src/system_index/frag_reuse.rs:312-329)

### Lines 330-345

Public doc(hidden) from_row_id_maps builds RowAddrRemap::direct per supplied HashMap then chains them, storing supplied details unchanged. It preserves a materialized compatibility/testing path; no relation/validation between maps and details and no IO. (rust/lance-table/src/system_index/frag_reuse.rs:330-345)

### Lines 346-371

Public try_new traverses details.versions in existing Vec order (does not sort by dataset_version), then groups. Deserialize each RoaringTreemap and wrap errors as Index with vector version/group positions; no Cursor exhaustion/trailing-byte check. Convert old/new digest ID/physical counts through fragment_layout. Deleted counts are ignored by this constructor, unlike ledger digest validation. (rust/lance-table/src/system_index/frag_reuse.rs:346-371)

### Lines 372-391

Collect per-version GroupInputWithLayout, call compact_with_layout, wrap any layout error as Index with version position and original text, append remap then chain all versions. Success retains original details and UUID. Empty versions/groups pass according to core constructor; no global graph uniqueness/topological sort. This differs from ledger reconstruction and must not be used as new tagged format foundation. (rust/lance-table/src/system_index/frag_reuse.rs:372-391)

### Lines 392-422

row_addr_remap borrows private chain; is_empty delegates; remap_row_id converts outer None (unaffected or out-of-range offset) to Some original and preserves deletion inner None. In-place delegates core remap. Tree-map adapter unwraps enumerable partial-only selection, then remaps/filter-deletes; Roaring adapter also materializes new set. All synchronous; missing-map behavior is deliberately pass-through. (rust/lance-table/src/system_index/frag_reuse.rs:392-422)

### Lines 423-446

Compact batch docs explicitly assume exactly two columns and name btree/value-row_id or vector/row_id-vector examples; wrappers invoke shared functions. Array wrapper returns UInt64 PrimitiveArray; bitmap wrapper delegates legacy metadata rule. Neither validates input on its own, and no entire-index loader/writer is implemented here. (rust/lance-table/src/system_index/frag_reuse.rs:423-446)

### Lines 447-467

Shared RecordBatch helper asserts exactly2 schema fields, computes other index1-row_id_idx without checked subtraction, accesses selected column and assumes UInt64 through AsArray. Reads values buffer ignoring input validity and creates Some for every underlying value, so a null row-ID slot is treated as its backing numeric value. Remap closure mutates owned Option vector; collect surviving original positions and new IDs into two Vecs. Deleted mappings drop rows, retaining input order. Caller must ensure row_id_idx0/1 and appropriate nonnull semantics. (rust/lance-table/src/system_index/frag_reuse.rs:447-467)

### Lines 468-483

Create UInt64 selection array and Arrow take other column, propagating error. Build nonnullable UInt64 mapped ID array, pair with taken values, sort two columns by original positions and RecordBatch::try_new using original schema. Allocates batch-sized buffers; does not stream. Original input null row-ID validity is not restored, unlike array helper. Metadata/schema retained through existing Arc. (rust/lance-table/src/system_index/frag_reuse.rs:468-483)

### Lines 484-504

Shared array helper downcasts to UInt64 with expect, enumerates preserving each input null as None and values as Some, invokes closure then builds PrimitiveArray from option Vec. Deleted mappings become null slots rather than dropping rows; length/order remain. Wrong physical type panics, no Result. This differs from batch helper both in input-null handling and deletion shape. (rust/lance-table/src/system_index/frag_reuse.rs:484-504)

### Lines 505-528

Shared bitmap helper walks versions/groups in stored order and removes each old ID with unchecked as u32, counting successful removals. If some but not all old vector entries removed, source comments link historical straddle bug and explain withholding new IDs to avoid claiming unindexed rows; scan/persist behavior is rationale awaiting complete consumers. Empty/zero-overlap group makes no insertion; duplicates in old list can make a logically full set look partial. (rust/lance-table/src/system_index/frag_reuse.rs:505-528)

### Lines 529-548

Straddling group emits tracing warning and continues after removals, deliberately omitting destinations. Complete covered group inserts all new IDs as u32; later groups see progressively updated bitmap. Returns Ok unconditionally in current code, unlike newer recalculation helper that errors on partial groups. No physical index rebuild or persistence; preserve existing legacy behavior. (rust/lance-table/src/system_index/frag_reuse.rs:529-548)

### Lines 549-569

fragment_layout checked-converts ID and physical_rows to u32 or Index error naming vector version/group, old/new role and invalid value. Does not itself reject reserved u32MAX ID or compare deleted counts; core remap applies its separate layout checks. Returns pair unchanged on success. (rust/lance-table/src/system_index/frag_reuse.rs:549-569)

### Lines 570-598

cfg(test) imports rstest; addr fixture encodes RowAddress; serialize_changed deduplicates/sorts Roaring, preallocates serialized size and unwraps write; digest fixture always sets deleted count0. Therefore subsequent deletion examples demonstrate old constructor ignores digest deletion count and uses bitmap/layout. (rust/lance-table/src/system_index/frag_reuse.rs:570-598)

### Lines 599-633

Compact chain test builds version1 source1 physical4 with survivors0/2/3 split10(rows1)/11(rows2), plus source3 entirely removed; version2 survivors10:0 and11:1 merge20(rows2). Details roundtrip through legacy serializer before construction, exercising its version sort; raw digest deletion counts remain0. (rust/lance-table/src/system_index/frag_reuse.rs:599-633)

### Lines 634-669

Asserts source1:0/3 survive to20:0/1, source1:1/2 and3:0 deleted; unknown2:0 and out-of-range1:4 pass through. In-place vector confirms deletion and preexisting None behavior and order. No record-batch/null/full-fragment adapter exercised. (rust/lance-table/src/system_index/frag_reuse.rs:634-669)

### Lines 670-691

Malformed bitmap bytes1/2/3 must yield Error::Index with exact version0/group0 prefix. Only bad serialization is tested here, not trailing bytes after otherwise valid payload. (rust/lance-table/src/system_index/frag_reuse.rs:670-691)

### Lines 692-731

Three named layout cases reject unknown bitmap source fragment2, source1 offset1 when physical1, and duplicate old fragment1. Require Error::Index plus FRI version0, rewrite group0 and specific reason text. No global producer/consumer cycle validation expected for this adapter. (rust/lance-table/src/system_index/frag_reuse.rs:692-731)

### Lines 732-783

Async-tagged serialization test contains no await/IO. Constructs reverse dataset versions2 then1, each one group with arbitrary invalid bitmap bytes and nonconserving source1-row to two1-row destinations. It tests permissive metadata conversion, not usable remap validity. (rust/lance-table/src/system_index/frag_reuse.rs:732-783)

### Lines 784-856

Convert to InlineContent and back; assert two versions sorted1 then2 and exact bitmap bytes/old/new digests in each. Sorting occurs in encoder; reverse converter preserves supplied order. This file has four test functions, six instantiated cases, with no local tests for materialized-map wrappers, array/batch null differences, straddle healing or full-fragment panics. No tests executed. (rust/lance-table/src/system_index/frag_reuse.rs:784-856)

## Interaction and interpretation limits

Every856 physical lines read in four bounded outputs. Full index loader/query/commit consumers remain pending; local remap/codec behavior does not prove complete legacy or tagged release compatibility. Source read-only, no network/build/test/benchmark. Existing fallback paths are documented, not recommendations for new features.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | pub mod gate;
    5 | pub mod ledger;
    6 | pub mod lineage;
    7 | pub mod metadata;
    8 | 
    9 | use std::{collections::HashMap, io::Cursor, sync::Arc};
   10 | 
   11 | use arrow_array::cast::AsArray;
   12 | use arrow_array::types::UInt64Type;
   13 | use arrow_array::{Array, ArrayRef, PrimitiveArray, RecordBatch, UInt64Array};
   14 | use lance_core::deepsize::{Context, DeepSizeOf};
   15 | use lance_core::utils::row_addr_remap::{GroupInputWithLayout, RowAddrRemap};
   16 | use lance_core::{Error, Result};
   17 | use lance_select::RowAddrTreeMap;
   18 | use prost::Name;
   19 | use roaring::{RoaringBitmap, RoaringTreemap};
   20 | use serde::{Deserialize, Serialize};
   21 | use uuid::Uuid;
   22 | 
   23 | use crate::format::pb::fragment_reuse_index_details::InlineContent;
   24 | use crate::format::{ExternalFile, Fragment, IndexMetadata, pb};
   25 | 
   26 | pub const FRAG_REUSE_INDEX_NAME: &str = "__lance_frag_reuse";
   27 | pub const FRAG_REUSE_DETAILS_FILE_NAME: &str = "details.binpb";
   28 | 
   29 | /// Whether `index` is the fragment reuse index itself, not a user index that
   30 | /// borrows its name.
   31 | pub fn is_frag_reuse_index_entry(index: &IndexMetadata) -> bool {
   32 |     index.name == FRAG_REUSE_INDEX_NAME
   33 |         && index.index_details.as_ref().is_some_and(|details| {
   34 |             details
   35 |                 .type_url
   36 |                 .rsplit_once('/')
   37 |                 .is_some_and(|(_, type_name)| {
   38 |                     type_name.eq_ignore_ascii_case(&pb::FragmentReuseIndexDetails::full_name())
   39 |                 })
   40 |         })
   41 | }
   42 | 
   43 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
   44 | pub struct FragDigest {
   45 |     pub id: u64,
   46 |     pub physical_rows: usize,
   47 |     pub num_deleted_rows: usize,
   48 | }
   49 | 
   50 | impl From<&FragDigest> for pb::fragment_reuse_index_details::FragmentDigest {
   51 |     fn from(digest: &FragDigest) -> Self {
   52 |         Self {
   53 |             id: digest.id,
   54 |             physical_rows: digest.physical_rows as u64,
   55 |             num_deleted_rows: digest.num_deleted_rows as u64,
   56 |         }
   57 |     }
   58 | }
   59 | 
   60 | impl From<&Fragment> for FragDigest {
   61 |     fn from(fragment: &Fragment) -> Self {
   62 |         Self {
   63 |             id: fragment.id,
   64 |             physical_rows: fragment
   65 |                 .physical_rows
   66 |                 .expect("Fragment doesn't have physical rows recorded"),
   67 |             num_deleted_rows: fragment
   68 |                 .deletion_file
   69 |                 .as_ref()
   70 |                 .and_then(|d| d.num_deleted_rows)
   71 |                 .unwrap_or(0),
   72 |         }
   73 |     }
   74 | }
   75 | 
   76 | impl TryFrom<pb::fragment_reuse_index_details::FragmentDigest> for FragDigest {
   77 |     type Error = Error;
   78 | 
   79 |     fn try_from(digest: pb::fragment_reuse_index_details::FragmentDigest) -> Result<Self> {
   80 |         Ok(Self {
   81 |             id: digest.id,
   82 |             physical_rows: digest.physical_rows as usize,
   83 |             num_deleted_rows: digest.num_deleted_rows as usize,
   84 |         })
   85 |     }
   86 | }
   87 | 
   88 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
   89 | pub struct FragReuseGroup {
   90 |     pub changed_row_addrs: Vec<u8>,
   91 |     pub old_frags: Vec<FragDigest>,
   92 |     pub new_frags: Vec<FragDigest>,
   93 | }
   94 | 
   95 | impl From<&FragReuseGroup> for pb::fragment_reuse_index_details::Group {
   96 |     fn from(group: &FragReuseGroup) -> Self {
   97 |         Self {
   98 |             changed_row_addrs: group.changed_row_addrs.clone(),
   99 |             old_fragments: group.old_frags.iter().map(|f| f.into()).collect(),
  100 |             new_fragments: group.new_frags.iter().map(|f| f.into()).collect(),
  101 |         }
  102 |     }
  103 | }
  104 | 
  105 | impl TryFrom<pb::fragment_reuse_index_details::Group> for FragReuseGroup {
  106 |     type Error = Error;
  107 | 
  108 |     fn try_from(group: pb::fragment_reuse_index_details::Group) -> Result<Self> {
  109 |         Ok(Self {
  110 |             changed_row_addrs: group.changed_row_addrs,
  111 |             old_frags: group
  112 |                 .old_fragments
  113 |                 .into_iter()
  114 |                 .map(FragDigest::try_from)
  115 |                 .collect::<Result<_>>()?,
  116 |             new_frags: group
  117 |                 .new_fragments
  118 |                 .into_iter()
  119 |                 .map(FragDigest::try_from)
  120 |                 .collect::<Result<_>>()?,
  121 |         })
  122 |     }
  123 | }
  124 | 
  125 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  126 | pub struct FragReuseVersion {
  127 |     pub dataset_version: u64,
  128 |     pub groups: Vec<FragReuseGroup>,
  129 | }
  130 | 
  131 | impl From<&FragReuseVersion> for pb::fragment_reuse_index_details::Version {
  132 |     fn from(version: &FragReuseVersion) -> Self {
  133 |         Self {
  134 |             dataset_version: version.dataset_version,
  135 |             groups: version.groups.iter().map(|g| g.into()).collect(),
  136 |         }
  137 |     }
  138 | }
  139 | 
  140 | impl TryFrom<pb::fragment_reuse_index_details::Version> for FragReuseVersion {
  141 |     type Error = Error;
  142 | 
  143 |     fn try_from(version: pb::fragment_reuse_index_details::Version) -> Result<Self> {
  144 |         Ok(Self {
  145 |             dataset_version: version.dataset_version,
  146 |             groups: version
  147 |                 .groups
  148 |                 .into_iter()
  149 |                 .map(FragReuseGroup::try_from)
  150 |                 .collect::<Result<_>>()?,
  151 |         })
  152 |     }
  153 | }
  154 | 
  155 | impl FragReuseVersion {
  156 |     pub fn old_frag_ids(&self) -> Vec<u64> {
  157 |         self.groups
  158 |             .iter()
  159 |             .flat_map(|g| g.old_frags.iter().map(|f| f.id))
  160 |             .collect::<Vec<_>>()
  161 |     }
  162 | 
  163 |     pub fn new_frag_ids(&self) -> Vec<u64> {
  164 |         self.groups
  165 |             .iter()
  166 |             .flat_map(|g| g.new_frags.iter().map(|f| f.id))
  167 |             .collect::<Vec<_>>()
  168 |     }
  169 | 
  170 |     pub fn new_frag_bitmap(&self) -> RoaringBitmap {
  171 |         RoaringBitmap::from_iter(self.new_frag_ids().iter().map(|&id| id as u32))
  172 |     }
  173 | }
  174 | 
  175 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  176 | pub enum FragReuseIndexDetailsContentType {
  177 |     Inline(FragReuseIndexDetails),
  178 |     External(ExternalFile),
  179 | }
  180 | 
  181 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  182 | pub struct FragReuseIndexDetails {
  183 |     pub versions: Vec<FragReuseVersion>,
  184 | }
  185 | 
  186 | impl From<&FragReuseIndexDetails> for InlineContent {
  187 |     fn from(details: &FragReuseIndexDetails) -> Self {
  188 |         let mut versions: Vec<pb::fragment_reuse_index_details::Version> =
  189 |             details.versions.iter().map(|m| m.into()).collect();
  190 |         // sort from oldest to latest version
  191 |         versions.sort_by_key(|v| v.dataset_version);
  192 |         Self {
  193 |             legacy_versions: versions,
  194 |             transitions: Vec::new(),
  195 |         }
  196 |     }
  197 | }
  198 | 
  199 | impl TryFrom<InlineContent> for FragReuseIndexDetails {
  200 |     type Error = Error;
  201 | 
  202 |     fn try_from(content: InlineContent) -> Result<Self> {
  203 |         Ok(Self {
  204 |             versions: content
  205 |                 .legacy_versions
  206 |                 .into_iter()
  207 |                 .map(|m| m.try_into())
  208 |                 .collect::<Result<Vec<_>>>()?,
  209 |         })
  210 |     }
  211 | }
  212 | 
  213 | impl FragReuseIndexDetails {
  214 |     pub fn new_frag_bitmap(&self) -> RoaringBitmap {
  215 |         RoaringBitmap::from_iter(
  216 |             self.versions
  217 |                 .iter()
  218 |                 .flat_map(|v| v.new_frag_ids().into_iter().map(|id| id as u32)),
  219 |         )
  220 |     }
  221 | }
  222 | 
  223 | /// An index that stores materialized row ID maps.
  224 | ///
  225 | /// This type is retained for API and serde compatibility. Dataset loading uses
  226 | /// [`CompactFragReuseIndex`] so persisted FRI details are not expanded into a
  227 | /// hash-map entry for every affected row.
  228 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
  229 | pub struct FragReuseIndex {
  230 |     pub uuid: Uuid,
  231 |     pub row_id_maps: Vec<HashMap<u64, Option<u64>>>,
  232 |     pub details: FragReuseIndexDetails,
  233 | }
  234 | 
  235 | impl DeepSizeOf for FragReuseIndex {
  236 |     fn deep_size_of_children(&self, cx: &mut Context) -> usize {
  237 |         self.row_id_maps.deep_size_of_children(cx) + self.details.deep_size_of_children(cx)
  238 |     }
  239 | }
  240 | 
  241 | impl FragReuseIndex {
  242 |     pub fn new(
  243 |         uuid: Uuid,
  244 |         row_id_maps: Vec<HashMap<u64, Option<u64>>>,
  245 |         details: FragReuseIndexDetails,
  246 |     ) -> Self {
  247 |         Self {
  248 |             uuid,
  249 |             row_id_maps,
  250 |             details,
  251 |         }
  252 |     }
  253 | 
  254 |     pub fn is_empty(&self) -> bool {
  255 |         self.row_id_maps.iter().all(HashMap::is_empty)
  256 |     }
  257 | 
  258 |     pub fn remap_row_id(&self, row_id: u64) -> Option<u64> {
  259 |         let mut mapped = Some(row_id);
  260 |         for row_id_map in &self.row_id_maps {
  261 |             if let Some(current) = mapped {
  262 |                 mapped = row_id_map.get(&current).copied().unwrap_or(mapped);
  263 |             }
  264 |         }
  265 |         mapped
  266 |     }
  267 | 
  268 |     pub fn remap_row_ids_in_place(&self, row_ids: &mut [Option<u64>]) {
  269 |         for row_id_map in &self.row_id_maps {
  270 |             for row_id in row_ids.iter_mut() {
  271 |                 if let Some(current) = *row_id
  272 |                     && let Some(mapped) = row_id_map.get(&current)
  273 |                 {
  274 |                     *row_id = *mapped;
  275 |                 }
  276 |             }
  277 |         }
  278 |     }
  279 | 
  280 |     pub fn remap_row_addrs_tree_map(&self, row_addrs: &RowAddrTreeMap) -> RowAddrTreeMap {
  281 |         RowAddrTreeMap::from_iter(
  282 |             row_addrs
  283 |                 .row_addrs()
  284 |                 .unwrap()
  285 |                 .filter_map(|addr| self.remap_row_id(u64::from(addr))),
  286 |         )
  287 |     }
  288 | 
  289 |     pub fn remap_row_ids_roaring_tree_map(&self, row_ids: &RoaringTreemap) -> RoaringTreemap {
  290 |         RoaringTreemap::from_iter(row_ids.iter().filter_map(|addr| self.remap_row_id(addr)))
  291 |     }
  292 | 
  293 |     pub fn remap_row_ids_record_batch(
  294 |         &self,
  295 |         batch: RecordBatch,
  296 |         row_id_idx: usize,
  297 |     ) -> Result<RecordBatch> {
  298 |         remap_row_ids_record_batch(batch, row_id_idx, |row_ids| {
  299 |             self.remap_row_ids_in_place(row_ids)
  300 |         })
  301 |     }
  302 | 
  303 |     pub fn remap_row_ids_array(&self, array: ArrayRef) -> PrimitiveArray<UInt64Type> {
  304 |         remap_row_ids_array(array, |row_ids| self.remap_row_ids_in_place(row_ids))
  305 |     }
  306 | 
  307 |     pub fn remap_fragment_bitmap(&self, fragment_bitmap: &mut RoaringBitmap) -> Result<()> {
  308 |         remap_fragment_bitmap(&self.details, fragment_bitmap)
  309 |     }
  310 | }
  311 | 
  312 | /// A compact row-address remap chain for deferred compactions.
  313 | ///
  314 | /// Each FRI version retains rewritten-row bitmaps and fragment layouts. Queries
  315 | /// use bitmap rank plus the ordered new-fragment ranges instead of storing one
  316 | /// hash-map entry per affected row.
  317 | #[derive(Debug, Clone, PartialEq, Eq)]
  318 | pub struct CompactFragReuseIndex {
  319 |     pub uuid: Uuid,
  320 |     row_addr_remap: RowAddrRemap,
  321 |     pub details: FragReuseIndexDetails,
  322 | }
  323 | 
  324 | impl DeepSizeOf for CompactFragReuseIndex {
  325 |     fn deep_size_of_children(&self, cx: &mut Context) -> usize {
  326 |         self.row_addr_remap.deep_size_of_children(cx) + self.details.deep_size_of_children(cx)
  327 |     }
  328 | }
  329 | 
  330 | impl CompactFragReuseIndex {
  331 |     #[doc(hidden)]
  332 |     pub fn from_row_id_maps(
  333 |         uuid: Uuid,
  334 |         row_id_maps: Vec<HashMap<u64, Option<u64>>>,
  335 |         details: FragReuseIndexDetails,
  336 |     ) -> Self {
  337 |         Self {
  338 |             uuid,
  339 |             row_addr_remap: RowAddrRemap::chained(
  340 |                 row_id_maps.into_iter().map(RowAddrRemap::direct),
  341 |             ),
  342 |             details,
  343 |         }
  344 |     }
  345 | 
  346 |     /// Build a queryable index directly from serialized FRI details without
  347 |     /// expanding each affected row into a hash map.
  348 |     pub fn try_new(uuid: Uuid, details: FragReuseIndexDetails) -> Result<Self> {
  349 |         let mut version_remaps = Vec::with_capacity(details.versions.len());
  350 |         for (version_idx, version) in details.versions.iter().enumerate() {
  351 |             let mut groups = Vec::with_capacity(version.groups.len());
  352 |             for (group_idx, group) in version.groups.iter().enumerate() {
  353 |                 let changed_row_addrs = RoaringTreemap::deserialize_from(Cursor::new(
  354 |                     &group.changed_row_addrs,
  355 |                 ))
  356 |                 .map_err(|error| {
  357 |                     Error::index(format!(
  358 |                         "failed to deserialize changed row addresses for FRI version {version_idx}, group {group_idx}: {error}"
  359 |                     ))
  360 |                 })?;
  361 |                 let old_frags = group
  362 |                     .old_frags
  363 |                     .iter()
  364 |                     .map(|frag| fragment_layout(frag, "old", version_idx, group_idx))
  365 |                     .collect::<Result<Vec<_>>>()?;
  366 |                 let new_frags = group
  367 |                     .new_frags
  368 |                     .iter()
  369 |                     .map(|frag| fragment_layout(frag, "new", version_idx, group_idx))
  370 |                     .collect::<Result<Vec<_>>>()?;
  371 |                 groups.push(GroupInputWithLayout {
  372 |                     rewritten_old_row_addrs: changed_row_addrs,
  373 |                     old_frags,
  374 |                     new_frags,
  375 |                 });
  376 |             }
  377 |             let remap = RowAddrRemap::compact_with_layout(groups).map_err(|error| {
  378 |                 Error::index(format!(
  379 |                     "failed to build compact remap for FRI version {version_idx}: {error}"
  380 |                 ))
  381 |             })?;
  382 |             version_remaps.push(remap);
  383 |         }
  384 | 
  385 |         Ok(Self {
  386 |             uuid,
  387 |             row_addr_remap: RowAddrRemap::chained(version_remaps),
  388 |             details,
  389 |         })
  390 |     }
  391 | 
  392 |     /// The ordered remap chain used by index and transaction remapping paths.
  393 |     pub fn row_addr_remap(&self) -> &RowAddrRemap {
  394 |         &self.row_addr_remap
  395 |     }
  396 | 
  397 |     /// Returns whether the index contains no row-address remapping.
  398 |     pub fn is_empty(&self) -> bool {
  399 |         self.row_addr_remap.is_empty()
  400 |     }
  401 | 
  402 |     pub fn remap_row_id(&self, row_id: u64) -> Option<u64> {
  403 |         self.row_addr_remap.get(row_id).unwrap_or(Some(row_id))
  404 |     }
  405 | 
  406 |     /// Apply all FRI versions to row addresses in place. `None` values remain
  407 |     /// deleted and missing mappings pass through unchanged.
  408 |     pub fn remap_row_ids_in_place(&self, row_ids: &mut [Option<u64>]) {
  409 |         self.row_addr_remap.remap_in_place(row_ids);
  410 |     }
  411 | 
  412 |     pub fn remap_row_addrs_tree_map(&self, row_addrs: &RowAddrTreeMap) -> RowAddrTreeMap {
  413 |         RowAddrTreeMap::from_iter(row_addrs.row_addrs().unwrap().filter_map(|addr| {
  414 |             let addr_as_u64 = u64::from(addr);
  415 |             self.remap_row_id(addr_as_u64)
  416 |         }))
  417 |     }
  418 | 
  419 |     pub fn remap_row_ids_roaring_tree_map(&self, row_ids: &RoaringTreemap) -> RoaringTreemap {
  420 |         RoaringTreemap::from_iter(row_ids.iter().filter_map(|addr| self.remap_row_id(addr)))
  421 |     }
  422 | 
  423 |     /// Remap a record batch that contains a row_id column at index `row_id_idx`
  424 |     /// Currently this assumes there are only 2 columns in the schema,
  425 |     /// which is the case for all indexes.
  426 |     /// For example, for btree, the schema is (value, row_id).
  427 |     /// For vector index storage, the schema is (row_id, vector).
  428 |     pub fn remap_row_ids_record_batch(
  429 |         &self,
  430 |         batch: RecordBatch,
  431 |         row_id_idx: usize,
  432 |     ) -> Result<RecordBatch> {
  433 |         remap_row_ids_record_batch(batch, row_id_idx, |row_ids| {
  434 |             self.remap_row_ids_in_place(row_ids)
  435 |         })
  436 |     }
  437 | 
  438 |     pub fn remap_row_ids_array(&self, array: ArrayRef) -> PrimitiveArray<UInt64Type> {
  439 |         remap_row_ids_array(array, |row_ids| self.remap_row_ids_in_place(row_ids))
  440 |     }
  441 | 
  442 |     pub fn remap_fragment_bitmap(&self, fragment_bitmap: &mut RoaringBitmap) -> Result<()> {
  443 |         remap_fragment_bitmap(&self.details, fragment_bitmap)
  444 |     }
  445 | }
  446 | 
  447 | fn remap_row_ids_record_batch(
  448 |     batch: RecordBatch,
  449 |     row_id_idx: usize,
  450 |     remap: impl FnOnce(&mut [Option<u64>]),
  451 | ) -> Result<RecordBatch> {
  452 |     assert_eq!(batch.schema().fields().len(), 2);
  453 |     let other_column_idx = 1 - row_id_idx;
  454 |     let row_ids = batch.column(row_id_idx).as_primitive::<UInt64Type>();
  455 |     let mut remapped_row_ids = row_ids
  456 |         .values()
  457 |         .iter()
  458 |         .copied()
  459 |         .map(Some)
  460 |         .collect::<Vec<_>>();
  461 |     remap(&mut remapped_row_ids);
  462 |     let (val_indices, new_row_ids): (Vec<u64>, Vec<u64>) = remapped_row_ids
  463 |         .iter()
  464 |         .enumerate()
  465 |         .filter_map(|(idx, new_id)| new_id.map(|new_id| (idx as u64, new_id)))
  466 |         .unzip();
  467 |     let new_val_indices = UInt64Array::from_iter_values(val_indices);
  468 |     let new_vals = arrow::compute::take(batch.column(other_column_idx), &new_val_indices, None)?;
  469 | 
  470 |     let mut batch_data: Vec<(usize, ArrayRef)> = vec![
  471 |         (
  472 |             row_id_idx,
  473 |             Arc::new(UInt64Array::from_iter_values(new_row_ids)) as ArrayRef,
  474 |         ),
  475 |         (other_column_idx, Arc::new(new_vals)),
  476 |     ];
  477 |     batch_data.sort_by_key(|(i, _)| *i);
  478 |     Ok(RecordBatch::try_new(
  479 |         batch.schema(),
  480 |         batch_data.into_iter().map(|(_, item)| item).collect(),
  481 |     )?)
  482 | }
  483 | 
  484 | fn remap_row_ids_array(
  485 |     array: ArrayRef,
  486 |     remap: impl FnOnce(&mut [Option<u64>]),
  487 | ) -> PrimitiveArray<UInt64Type> {
  488 |     let primitive_array = array
  489 |         .as_any()
  490 |         .downcast_ref::<PrimitiveArray<UInt64Type>>()
  491 |         .expect("expected row IDs to be uint64 array");
  492 |     let mut remapped = (0..primitive_array.len())
  493 |         .map(|i| {
  494 |             if primitive_array.is_null(i) {
  495 |                 None
  496 |             } else {
  497 |                 Some(primitive_array.value(i))
  498 |             }
  499 |         })
  500 |         .collect::<Vec<_>>();
  501 |     remap(&mut remapped);
  502 |     PrimitiveArray::from(remapped)
  503 | }
  504 | 
  505 | fn remap_fragment_bitmap(
  506 |     details: &FragReuseIndexDetails,
  507 |     fragment_bitmap: &mut RoaringBitmap,
  508 | ) -> Result<()> {
  509 |     for version in details.versions.iter() {
  510 |         for group in version.groups.iter() {
  511 |             let mut removed = 0;
  512 |             for old_frag in group.old_frags.iter() {
  513 |                 if fragment_bitmap.remove(old_frag.id as u32) {
  514 |                     removed += 1;
  515 |                 }
  516 |             }
  517 | 
  518 |             if removed > 0 {
  519 |                 if removed != group.old_frags.len() {
  520 |                     // Straddle: the index covered only part of this rewrite
  521 |                     // group. Caused by the bug fixed in
  522 |                     // <https://github.com/lance-format/lance/pull/6610>.
  523 |                     // We've already removed the indexed old_frags from the
  524 |                     // bitmap above; deliberately do NOT insert new_frags,
  525 |                     // since the merged fragment also contains rows that
  526 |                     // were never indexed. Affected rows fall through to
  527 |                     // flat scan until the next optimize_indices. The fix
  528 |                     // is persisted on the next write via build_manifest.
  529 |                     tracing::warn!(
  530 |                         "Healing straddling fragment-reuse rewrite group in index bitmap: \
  531 |                              group {:?} was only partially indexed ({} of {} old fragments). \
  532 |                              Affected rows will use flat scan until the next optimize_indices.",
  533 |                         group.old_frags,
  534 |                         removed,
  535 |                         group.old_frags.len(),
  536 |                     );
  537 |                     continue;
  538 |                 }
  539 | 
  540 |                 for new_frag in group.new_frags.iter() {
  541 |                     fragment_bitmap.insert(new_frag.id as u32);
  542 |                 }
  543 |             }
  544 |         }
  545 |     }
  546 |     Ok(())
  547 | }
  548 | 
  549 | fn fragment_layout(
  550 |     frag: &FragDigest,
  551 |     role: &str,
  552 |     version_idx: usize,
  553 |     group_idx: usize,
  554 | ) -> Result<(u32, u32)> {
  555 |     let fragment_id = u32::try_from(frag.id).map_err(|_| {
  556 |         Error::index(format!(
  557 |             "FRI version {version_idx}, group {group_idx} has {role} fragment id {} outside the row-address range",
  558 |             frag.id
  559 |         ))
  560 |     })?;
  561 |     let physical_rows = u32::try_from(frag.physical_rows).map_err(|_| {
  562 |         Error::index(format!(
  563 |             "FRI version {version_idx}, group {group_idx} has {role} fragment {fragment_id} with physical_rows={} outside the row-address range",
  564 |             frag.physical_rows
  565 |         ))
  566 |     })?;
  567 |     Ok((fragment_id, physical_rows))
  568 | }
  569 | 
  570 | #[cfg(test)]
  571 | mod tests {
  572 | 
  573 |     use super::*;
  574 |     use rstest::rstest;
  575 | 
  576 |     fn addr(fragment_id: u32, offset: u32) -> u64 {
  577 |         u64::from(lance_core::utils::address::RowAddress::new_from_parts(
  578 |             fragment_id,
  579 |             offset,
  580 |         ))
  581 |     }
  582 | 
  583 |     fn serialize_changed(addrs: impl IntoIterator<Item = u64>) -> Vec<u8> {
  584 |         let changed = RoaringTreemap::from_iter(addrs);
  585 |         let mut bytes = Vec::with_capacity(changed.serialized_size());
  586 |         changed.serialize_into(&mut bytes).unwrap();
  587 |         bytes
  588 |     }
  589 | 
  590 |     fn digest(id: u64, physical_rows: usize) -> FragDigest {
  591 |         FragDigest {
  592 |             id,
  593 |             physical_rows,
  594 |             num_deleted_rows: 0,
  595 |         }
  596 |     }
  597 | 
  598 |     #[test]
  599 |     fn test_compact_fri_tristate_one_to_many_and_chain() {
  600 |         let details = FragReuseIndexDetails {
  601 |             versions: vec![
  602 |                 FragReuseVersion {
  603 |                     dataset_version: 1,
  604 |                     groups: vec![
  605 |                         // One old fragment is split into two new fragments.
  606 |                         FragReuseGroup {
  607 |                             changed_row_addrs: serialize_changed([
  608 |                                 addr(1, 0),
  609 |                                 addr(1, 2),
  610 |                                 addr(1, 3),
  611 |                             ]),
  612 |                             old_frags: vec![digest(1, 4)],
  613 |                             new_frags: vec![digest(10, 1), digest(11, 2)],
  614 |                         },
  615 |                         // A separate rewrite group deletes an entire fragment.
  616 |                         FragReuseGroup {
  617 |                             changed_row_addrs: serialize_changed([]),
  618 |                             old_frags: vec![digest(3, 2)],
  619 |                             new_frags: vec![],
  620 |                         },
  621 |                     ],
  622 |                 },
  623 |                 FragReuseVersion {
  624 |                     dataset_version: 2,
  625 |                     groups: vec![FragReuseGroup {
  626 |                         changed_row_addrs: serialize_changed([addr(10, 0), addr(11, 1)]),
  627 |                         old_frags: vec![digest(10, 1), digest(11, 2)],
  628 |                         new_frags: vec![digest(20, 2)],
  629 |                     }],
  630 |                 },
  631 |             ],
  632 |         };
  633 |         let details = FragReuseIndexDetails::try_from(InlineContent::from(&details)).unwrap();
  634 |         let fri = CompactFragReuseIndex::try_new(Uuid::new_v4(), details).unwrap();
  635 | 
  636 |         // Surviving rows follow both versions in oldest-to-newest order.
  637 |         assert_eq!(fri.remap_row_id(addr(1, 0)), Some(addr(20, 0)));
  638 |         assert_eq!(fri.remap_row_id(addr(1, 3)), Some(addr(20, 1)));
  639 |         // Deletes can happen in either the first or a later version.
  640 |         assert_eq!(fri.remap_row_id(addr(1, 1)), None);
  641 |         assert_eq!(fri.remap_row_id(addr(1, 2)), None);
  642 |         assert_eq!(fri.remap_row_id(addr(3, 0)), None);
  643 |         // Uncovered fragments and out-of-range offsets retain the existing
  644 |         // missing-map pass-through semantics.
  645 |         assert_eq!(fri.remap_row_id(addr(2, 0)), Some(addr(2, 0)));
  646 |         assert_eq!(fri.remap_row_id(addr(1, 4)), Some(addr(1, 4)));
  647 | 
  648 |         let mut batch = vec![
  649 |             Some(addr(1, 0)),
  650 |             Some(addr(1, 1)),
  651 |             Some(addr(1, 2)),
  652 |             Some(addr(1, 3)),
  653 |             Some(addr(2, 0)),
  654 |             None,
  655 |         ];
  656 |         fri.remap_row_ids_in_place(&mut batch);
  657 |         assert_eq!(
  658 |             batch,
  659 |             vec![
  660 |                 Some(addr(20, 0)),
  661 |                 None,
  662 |                 None,
  663 |                 Some(addr(20, 1)),
  664 |                 Some(addr(2, 0)),
  665 |                 None,
  666 |             ]
  667 |         );
  668 |     }
  669 | 
  670 |     #[test]
  671 |     fn test_compact_fri_rejects_invalid_changed_row_bitmap() {
  672 |         let details = FragReuseIndexDetails {
  673 |             versions: vec![FragReuseVersion {
  674 |                 dataset_version: 1,
  675 |                 groups: vec![FragReuseGroup {
  676 |                     changed_row_addrs: vec![1, 2, 3],
  677 |                     old_frags: vec![digest(1, 1)],
  678 |                     new_frags: vec![digest(2, 1)],
  679 |                 }],
  680 |             }],
  681 |         };
  682 |         let error = CompactFragReuseIndex::try_new(Uuid::new_v4(), details).unwrap_err();
  683 |         assert!(matches!(error, Error::Index { .. }));
  684 |         assert!(
  685 |             error
  686 |                 .to_string()
  687 |                 .contains("failed to deserialize changed row addresses for FRI version 0, group 0"),
  688 |             "{error}"
  689 |         );
  690 |     }
  691 | 
  692 |     #[rstest]
  693 |     #[case::unknown_fragment(
  694 |         vec![addr(2, 0)],
  695 |         vec![digest(1, 1)],
  696 |         "from fragments [2] not in its old fragments"
  697 |     )]
  698 |     #[case::offset_out_of_range(
  699 |         vec![addr(1, 1)],
  700 |         vec![digest(1, 1)],
  701 |         "row offset outside old fragment 1 with physical_rows=1"
  702 |     )]
  703 |     #[case::duplicate_old_fragment(
  704 |         vec![addr(1, 0)],
  705 |         vec![digest(1, 1), digest(1, 1)],
  706 |         "old fragment 1 more than once"
  707 |     )]
  708 |     fn test_compact_fri_preserves_layout_validation(
  709 |         #[case] changed_addrs: Vec<u64>,
  710 |         #[case] old_frags: Vec<FragDigest>,
  711 |         #[case] expected_message: &str,
  712 |     ) {
  713 |         let details = FragReuseIndexDetails {
  714 |             versions: vec![FragReuseVersion {
  715 |                 dataset_version: 1,
  716 |                 groups: vec![FragReuseGroup {
  717 |                     changed_row_addrs: serialize_changed(changed_addrs),
  718 |                     old_frags,
  719 |                     new_frags: vec![digest(10, 1)],
  720 |                 }],
  721 |             }],
  722 |         };
  723 | 
  724 |         let error = CompactFragReuseIndex::try_new(Uuid::new_v4(), details).unwrap_err();
  725 |         assert!(matches!(error, Error::Index { .. }));
  726 |         let message = error.to_string();
  727 |         assert!(message.contains("FRI version 0"), "{message}");
  728 |         assert!(message.contains("rewrite group 0"), "{message}");
  729 |         assert!(message.contains(expected_message), "{message}");
  730 |     }
  731 | 
  732 |     #[tokio::test]
  733 |     async fn test_serialize_deserialize_index_details() {
  734 |         // Create sample FragReuseVersions with different dataset versions
  735 |         let version1 = FragReuseVersion {
  736 |             dataset_version: 2,
  737 |             groups: vec![FragReuseGroup {
  738 |                 changed_row_addrs: vec![1, 2, 3],
  739 |                 old_frags: vec![FragDigest {
  740 |                     id: 1,
  741 |                     physical_rows: 1,
  742 |                     num_deleted_rows: 0,
  743 |                 }],
  744 |                 new_frags: vec![
  745 |                     FragDigest {
  746 |                         id: 2,
  747 |                         physical_rows: 1,
  748 |                         num_deleted_rows: 0,
  749 |                     },
  750 |                     FragDigest {
  751 |                         id: 3,
  752 |                         physical_rows: 1,
  753 |                         num_deleted_rows: 0,
  754 |                     },
  755 |                 ],
  756 |             }],
  757 |         };
  758 | 
  759 |         let version2 = FragReuseVersion {
  760 |             dataset_version: 1,
  761 |             groups: vec![FragReuseGroup {
  762 |                 changed_row_addrs: vec![4, 5, 6],
  763 |                 old_frags: vec![FragDigest {
  764 |                     id: 2,
  765 |                     physical_rows: 1,
  766 |                     num_deleted_rows: 0,
  767 |                 }],
  768 |                 new_frags: vec![
  769 |                     FragDigest {
  770 |                         id: 4,
  771 |                         physical_rows: 1,
  772 |                         num_deleted_rows: 0,
  773 |                     },
  774 |                     FragDigest {
  775 |                         id: 5,
  776 |                         physical_rows: 1,
  777 |                         num_deleted_rows: 0,
  778 |                     },
  779 |                 ],
  780 |             }],
  781 |         };
  782 | 
  783 |         // Create FragReuseIndexDetails with versions in reverse order
  784 |         let details = FragReuseIndexDetails {
  785 |             versions: vec![version1, version2],
  786 |         };
  787 | 
  788 |         // Convert to protobuf format
  789 |         let inline_content: InlineContent = (&details).into();
  790 | 
  791 |         // Convert back to FragReuseIndexDetails
  792 |         let roundtrip_details = FragReuseIndexDetails::try_from(inline_content).unwrap();
  793 | 
  794 |         // Verify the roundtrip
  795 |         assert_eq!(roundtrip_details.versions.len(), 2);
  796 | 
  797 |         // Verify versions are sorted by dataset_version (oldest to latest)
  798 |         assert_eq!(roundtrip_details.versions[0].dataset_version, 1);
  799 |         assert_eq!(
  800 |             roundtrip_details.versions[0].groups[0].changed_row_addrs,
  801 |             vec![4, 5, 6]
  802 |         );
  803 |         assert_eq!(
  804 |             roundtrip_details.versions[0].groups[0].new_frags,
  805 |             vec![
  806 |                 FragDigest {
  807 |                     id: 4,
  808 |                     physical_rows: 1,
  809 |                     num_deleted_rows: 0,
  810 |                 },
  811 |                 FragDigest {
  812 |                     id: 5,
  813 |                     physical_rows: 1,
  814 |                     num_deleted_rows: 0,
  815 |                 }
  816 |             ]
  817 |         );
  818 |         assert_eq!(
  819 |             roundtrip_details.versions[0].groups[0].old_frags,
  820 |             vec![FragDigest {
  821 |                 id: 2,
  822 |                 physical_rows: 1,
  823 |                 num_deleted_rows: 0,
  824 |             }]
  825 |         );
  826 | 
  827 |         assert_eq!(roundtrip_details.versions[1].dataset_version, 2);
  828 |         assert_eq!(
  829 |             roundtrip_details.versions[1].groups[0].changed_row_addrs,
  830 |             vec![1, 2, 3]
  831 |         );
  832 |         assert_eq!(
  833 |             roundtrip_details.versions[1].groups[0].new_frags,
  834 |             vec![
  835 |                 FragDigest {
  836 |                     id: 2,
  837 |                     physical_rows: 1,
  838 |                     num_deleted_rows: 0,
  839 |                 },
  840 |                 FragDigest {
  841 |                     id: 3,
  842 |                     physical_rows: 1,
  843 |                     num_deleted_rows: 0,
  844 |                 }
  845 |             ]
  846 |         );
  847 |         assert_eq!(
  848 |             roundtrip_details.versions[1].groups[0].old_frags,
  849 |             vec![FragDigest {
  850 |                 id: 1,
  851 |                 physical_rows: 1,
  852 |                 num_deleted_rows: 0,
  853 |             }]
  854 |         );
  855 |     }
  856 | }
``````
