> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/system_index/frag_reuse/ledger.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `22f867b8b90fb41cebdf06c43f0f799d10397e13f3ed9e12827b2624dbcd6bd5`. Reviewed physical lines: 1-1042.

[Module](../../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public unified metadata ledger: strict envelope/version/digest/known-mapping validation, unsupported-transition signaling, content fingerprints and topological producer/consumer indices. One external-history callback boundary, no row-map-file IO. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:1-1042)

## Complete range analysis

### Lines 1-29

SPDX and metadata-only ledger docs state lineage decoding does not open row-map files, rejects unsupported index versions and leaves original Any preservation to callers. Compilable async example constructs version1 empty inline details and a callback returning NotSupported if external data requested; asserts empty transitions. Example is not executed here. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:1-29)

### Lines 30-55

Imports maps/queue/Future/Cursor/Arc, Bytes/Buf, DeepSizeOf, RowAddress/RowAddrRemap layouts, errors, low-level prost wire helpers, Roaring and UUID. Public Debug Mapping has OrderedCompaction(Arc<RowAddrRemap>) and StablePartition(protobuf reference); the latter preserves map_id/size/base_id without opening labels. Neither type derives Clone here. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:30-55)

### Lines 56-87

Public Debug Transition privately stores32-byte fingerprint, ordered protobuf source/destination Vecs and Mapping. Public fingerprint/sources/destinations/mapping getters borrow existing storage. Fingerprint is in-memory identity of encoded transition, not persisted ledger field; getters cannot replace private vectors or mapping. No validation or IO in getters. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:56-87)

### Lines 88-119

Public Debug FragReuseLedger privately stores ordered transitions, u32->position consumer and producer HashMaps, and unsupported flag. Private content_field requires exact case-sensitive last slash-delimited type URL component lance.table.FragmentReuseIndexDetails; plain name without slash also passes. Copies Any.value into Bytes, then scans all wire fields. Known tags1/2 must be length-delimited and exactly one total, including repeated same tag; missing/multiple content is CorruptFile. Other well-formed fields ignored. This differs from parent entry recognition requiring a slash and case-insensitive suffix. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:88-119)

### Lines 120-157

Public async generic decode validates version before envelope. Inline content proceeds without callback. External content decodes ExternalFile, requires offset+size checked u64 sum convertible to usize before invoking FnOnce, then awaits callback and checks returned byte count exactly equals size. Errors from callback propagate unchanged; malformed range/content become CorruptFile. It does not validate path, require positive size, open row-map files or itself seek; callback owns exact-range/storage policy. After await decode_content validates bytes synchronously. Cancellation can drop an in-flight callback future; no rollback/mutation here. No Send/static bound beyond Future<Result<Bytes>>. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:120-157)

### Lines 158-170

Public decode_inline validates index version/envelope, decodes tag1 into Some ledger, returns Ok(None) for tag2 without decoding or validating the ExternalFile payload/range. A structurally length-delimited but malformed external reference can therefore return None here; full external decode is stricter. No IO or callback. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:158-170)

### Lines 171-195

Private decode_content revalidates version, then scans complete content. Legacy tag1 decodes protobuf Version and lifts each group, in received order, into one OrderedCompaction transition using old/new digests and unchanged bitmap bytes. Legacy dataset_version is ignored; graph ordering later replaces version ordering. Every lifted transition passes decode_transition, so malformed legacy data can fail stricter ledger checks. The original serialized Any is not retained in returned ledger. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:171-195)

### Lines 196-217

Tagged content tag2 is CorruptFile under index_version0 before transition interpretation. Under1 require message payload and scan its raw fields. Exact mapping tags3/4 require length-delimited payload; a second recognized mapping, even duplicate same alternative, errors. Tags1/2 treated as source/destination metadata; every other outer transition tag marks unknown. Scanner consumes/validates wire framing first, and recognized wrong-wire/duplicate mapping errors precede unknown omission. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:196-217)

### Lines 218-233

Any unknown outer transition field causes entire transition omission and has_unsupported_transitions=true, even if known mapping also present or no known mapping exists. Source/destination digest and mapping contents are not semantically decoded for omitted transitions. Without unknown fields, missing mapping errors; otherwise protobuf decode and decode_transition run. Unknown content-envelope tags are skipped without setting unsupported. Nested unknown fields inside generated known messages follow prost decoding; this custom scan only checks outer transition fields. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:218-233)

### Lines 234-262

order_lineage validates/reorders supported transitions, then consumer/producer maps are built from their source/destination IDs and new positions. u64->u32 casts are safe for retained records because digest validation already restricted IDs. Omitted transitions contribute no maps/edges and can leave apparent graph gaps; caller must inspect unsupported flag before assuming history completeness. New Vec/maps own their memory, no shared cache or IO. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:234-262)

### Lines 263-293

Public unsupported getter reports omitted transitions; docs permit carrying original serialized details separately. consumer/producer perform expected-constant HashMap lookup and copy position; None means absent from retained supported graph, not proof absence from omitted history. contains_fragment ORs both maps. transitions borrows topologically ordered slice. None/empty distinction is consumed by TaggedLineage, which discards any unsupported ledger (rust/lance-table/src/system_index/frag_reuse/lineage.rs:36-43). (rust/lance-table/src/system_index/frag_reuse/ledger.rs:263-293)

### Lines 294-315

DeepSizeOf children sums both HashMap estimates, transition Vec capacity times Transition inline size, source/destination Vec capacities times digest size, and mapping children. Ordered Arc delegates shared-context accounting; StablePartition adds map_id String capacity. No separate heap cost for bool/fingerprint/scalar base/size; inline storage counted by enclosing footprint. Standard HashMap estimates and Arc dedup rules apply, not measured total RSS. Arithmetic uses ordinary usize multiplication/addition. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:294-315)

### Lines 316-332

Private exact mapping tags are3 OrderedCompaction and4 StablePartition, not an open tag range. validate_index_version admits only signed0/1; every other value including negatives returns NotSupported with actual value and upgrade advice. corrupt wraps Error::corrupt_file_named with fixed name FRI details. Validation errors are not all InvalidInput and retain this context. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:316-332)

### Lines 333-356

next_field uses prost decode_key. Length-delimited: decode u64 length, reject larger than remaining Bytes, split_to checked-by-bound length into a shared slice; initial Any copy already occurred. Other wire types skip with default DecodeContext then return None payload. Wire/parser errors map to CorruptFile; input cursor may be partly advanced on error but it is local. require_message rejects None with tag-specific must-be-length-delimited. No bespoke recursion/depth limit beyond prost helper behavior and no allocation bound separate from provided input. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:333-356)

### Lines 357-385

validate_digests requires each ID below reserved TOMBSTONE_FRAG, physical_rows<=u32MAX and deleted<=physical. RoaringBitmap rejects repeated ID within this side. Destination digests must have zero creation-time deletions. Sum live rows with checked u64 addition, reporting overflow. Empty list sums0; zero-row source/destination allowed. Source/destination cross-overlap and graph repetition are checked separately by lineage ordering; metadata does not prove actual files/counts. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:357-385)

### Lines 386-398

decode_transition first rejects empty sources, validates sources then destinations and requires equal total surviving source rows and total destination physical rows. Empty destinations valid for zero survivors. Fingerprint is BLAKE3 over generated protobuf encode_to_vec of the received known transition before mapping decode, excluding legacy dataset_version and unknown discarded protobuf fields. It is not necessarily a semantic canonical hash of equivalent Roaring layouts: bitmap payload bytes are retained verbatim. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:386-398)

### Lines 399-429

Ordered mapping deserializes RoaringTreemap from borrowed bitmap bytes and rejects trailing bytes by Cursor position. For each source, full-fragment range_cardinality must equal physical-deleted. Construct ordered u32 fragment layouts and delegate compact_with_layout, which enforces membership/offset/layout constraints; wrap dependency error as CorruptFile text. Store Arc remap. Preserve source scan order/destination order; bitmap sorting does not replace their layout order. No row-map external file read. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:399-429)

### Lines 430-451

StablePartition validates map_id with UUID parse and positive map_size_bytes, then stores original reference unchanged. No UUID canonical-text/v4/nil restriction, base_id resolution, actual length/file checksum/labels or row routing validation occurs here. Missing mapping returns CorruptFile. Success moves ordered digests and mapping into private Transition with previously computed fingerprint. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:430-451)

### Lines 452-476

order_lineage first indexes each destination by u64 ID and physical count, rejecting any repeated producer globally. Tracks every source ID in Roaring and rejects repeated consumer globally. This covers repeated IDs across transitions and local duplicates already checked. One fragment may be produced once and consumed once; cycle detection handles self-reuse. Original source fragments need no producer. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:452-476)

### Lines 477-499

For each source with known producer, require source.physical_rows equal producer creation physical rows; later num_deleted_rows may differ and represent intervening deletions. Add one incoming/outgoing edge per shared fragment, so the same producer/consumer pair can have multiple balanced edges. Ready queue initially includes zero-incoming transitions in input order. Allocate incoming Vec, adjacency Vec<Vec>, output capacity and Option-wrapped transition storage. Work scales with retained transitions/digests/edges, plus mapping decode costs. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:477-499)

### Lines 500-517

FIFO topological walk takes each transition once (otherwise explicit visited-twice corruption), appends it, decrements every outgoing edge count and queues when zero. Any unvisited records at end mean cycle. Independent roots preserve serialized relative order; newly ready nodes append behind already-ready nodes, so this is not a global sort by dataset_version or fragment ID. Local counters use ordinary arithmetic justified by constructed graph, not checked arithmetic. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:500-517)

### Lines 518-554

cfg(test) imports legacy compact/details/group/version types and rstest. digest helper stores supplied u64 fields. partition helper has2-row source/destination, nil UUID text, size100/base7 reference; it never opens a map. history serializes only tagged transitions into InlineContent. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:518-554)

### Lines 555-587

message_field writes length-delimited key, varint payload length and bytes for malformed-wire fixtures. ordered builds/deduplicates a RoaringTreemap, serializes with unwrap and creates mapping; address uses RowAddress encoding. assert_corrupt requires CorruptFile variant and message substring, not merely failure. Helpers are private tests only. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:555-587)

### Lines 588-630

Fingerprint test builds ordered source1 physical3/deleted1 -> destination2 rows2 with survivors offsets0/2. Lifted legacy version7 and tagged transition fingerprints must equal; changing survivor offsets to0/1 must differ. It does not prove equal fingerprints for alternate encodings of same bitmap, collision resistance or stable hash across future schema changes. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:588-630)

### Lines 631-657

Mixed fixture legacy source order2 then1 (three survivors) ->3, followed by tagged stable partition3->4. Legacy dataset_version100 is unrelated to topological identity. Decode version1 from generated content; physical counts adjusted to3 on second transition. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:631-657)

### Lines 658-689

Asserts consumer/producer positions for every retained digest, no lookup/member for u32MAX, two supported transitions, exact ordered remap including deleted offset and unknown source None. Stable reference retains base7/size100. No label file or query execution. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:658-689)

### Lines 690-720

Unknown metadata test appends tag17 length-delimited and tag7 varint to a known mapping: whole transition omitted and unsupported flag set. Unknown mapping test has missing known mapping plus tag17 between supported1->2 and3->4, alongside10->11; omitted2->3 gives no consumer2 while other three transitions retained. This tests partial ledger disclosure, not safe maintenance on it. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:690-720)

### Lines 721-754

Four named invalid-lineage cases reject duplicate producer, duplicate consumer, two-node cycle and self-cycle. Multi-fragment edge test serializes consumer before producer, source1 rows4->2/3, later source order3(with one deletion) then2 ->4 rows3; expects producer first, source order preserved and exact deleted/survivor mappings. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:721-754)

### Lines 755-779

Three ambiguous mapping cases test none, duplicate tag4, conflicting3/4; raw fields avoid generated oneof overwrite masking duplicates. Four malformed-wire cases cover truncated length, wrong transition wire, wrong mapping wire and invalid tag0. Require CorruptFile plus diagnostic substring. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:755-779)

### Lines 780-803

Four digest cases cover tombstone ID, physical_rows u32MAX+1, deleted>physical and unequal row conservation. Inconsistent-lineage test preserves each transition live-row conservation but changes consumed fragment2 physical count3 versus producer2, requiring distinct physical_rows error. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:780-803)

### Lines 804-844

Bad bitmap/reference test rejects source offset outside physical rows, wrong-fragment bitmap via survivor count, and ../escape UUID text. All-deleted source physical2/deleted2 with no destinations and empty bitmap is valid; remap returns Some(None) for its first address. Nil UUID remains accepted by other fixtures. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:804-844)

### Lines 845-877

Version test admits empty v0, rejects v2 NotSupported with value, and rejects tagged transition in v0 as CorruptFile requiring version1. Parameterized async legacy equivalence has inline/external cases; helper converts ordered mapping through legacy Group into FragReuseGroup. This is current-source legacy serializer comparison, not a released historical fixture. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:845-877)

### Lines 878-913

Legacy equivalence fixture has versions10/11: source2 then1 ->3, independent10->11, then3(with deletion)->4. Uses legacy serializer and CompactFragReuseIndex as comparison oracle. External descriptor path details.binpb offset7 size of serialized content; no actual object store. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:878-913)

### Lines 914-954

Build inline or external raw envelope and exact Any URL, decode with index_version1. Callback asserts external mode and full descriptor equality and returns owned content; inline must never invoke it. Expect three transitions; for six source/unknown addresses manually follow consumer/remap chain and compare old compact index output including deletions. It tests generated-current legacy representation, not released writer fixtures or disk reads. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:914-954)

### Lines 955-988

Independent transition test preserves source order10 then1. Five raw invalid-envelope cases reject missing, duplicate same content, conflicting inline/external, truncated length and u64MAX length. External callback would panic if invoked, confirming these errors precede IO in test intent. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:955-988)

### Lines 989-1027

Async version2/default Any case requires NotSupported/Please upgrade without callback. Two external cases reject offsetMAX+size1 overflow before IO and short read expected2/received1 after callback; callback asserts overflow did not reach it. No explicit wrong type URL, zero-size external, decode_inline malformed external body or callback-error test local here. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:989-1027)

### Lines 1028-1042

Two proptest functions feed arbitrary byte vectors length0..4096 (exclusive upper bound) to private content parser and public async envelope parser via block_on. Ignore Result to assert no panic; envelope callback returns NotSupported and does no external IO. These fuzz-style source tests are not exhaustive proofs and were not run. File has20 test functions:35 ordinary instantiated cases plus two property tests; external-read behavior uses callbacks only. (rust/lance-table/src/system_index/frag_reuse/ledger.rs:1028-1042)

## Interaction and interpretation limits

Every1042 physical lines read in four bounded outputs. Full row-map reading, query fallback, attempt assembly/conservation against live data and commit publication remain pending. Legacy lifting is existing read behavior, not new migration design. Property/unit tests and derived edge cases are source evidence, not executed qualification.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Metadata-only reader for the unified fragment reuse history.
    5 | //!
    6 | //! Decoding validates lineage without opening row-map files. Unsupported index
    7 | //! versions are rejected before interpreting their content.
    8 | //! Operations that carry an index forward keep its original `Any` separately.
    9 | //!
   10 | //! ```
   11 | //! use lance_table::system_index::frag_reuse::ledger::FragReuseLedger;
   12 | //! use prost::Message;
   13 | //! use lance_table::format::pb;
   14 | //!
   15 | //! # async fn example() -> lance_core::Result<()> {
   16 | //! let details = prost_types::Any {
   17 | //!     type_url: "/lance.table.FragmentReuseIndexDetails".into(),
   18 | //!     value: pb::FragmentReuseIndexDetails {
   19 | //!         content: Some(pb::fragment_reuse_index_details::Content::Inline(Default::default())),
   20 | //!     }.encode_to_vec(),
   21 | //! };
   22 | //! let ledger = FragReuseLedger::decode(1, &details, |_| async {
   23 | //!     Err(lance_core::Error::not_supported("external content is unavailable"))
   24 | //! }).await?;
   25 | //! assert!(ledger.transitions().is_empty());
   26 | //! # Ok(())
   27 | //! # }
   28 | //! ```
   29 | 
   30 | use std::collections::{HashMap, VecDeque};
   31 | use std::future::Future;
   32 | use std::io::Cursor;
   33 | use std::sync::Arc;
   34 | 
   35 | use bytes::{Buf, Bytes};
   36 | use lance_core::deepsize::{Context, DeepSizeOf};
   37 | use lance_core::utils::address::RowAddress;
   38 | use lance_core::utils::row_addr_remap::{GroupInputWithLayout, RowAddrRemap};
   39 | use lance_core::{Error, Result};
   40 | use prost::Message;
   41 | use prost::encoding::{DecodeContext, WireType, decode_key, decode_varint, skip_field};
   42 | use roaring::{RoaringBitmap, RoaringTreemap};
   43 | use uuid::Uuid;
   44 | 
   45 | use crate::format::pb::fragment_reuse_index_details::{self as pb, transition};
   46 | 
   47 | /// A decoded mapping. External labels remain unopened until address resolution.
   48 | #[derive(Debug)]
   49 | pub enum Mapping {
   50 |     /// Bitmap/rank translation, including lifted legacy compaction groups.
   51 |     OrderedCompaction(Arc<RowAddrRemap>),
   52 |     /// Immutable row-map reference, with the base selected by its optional base ID.
   53 |     StablePartition(pb::StablePartition),
   54 | }
   55 | 
   56 | /// One whole-fragment rewrite, with fragment lists in mapping order.
   57 | #[derive(Debug)]
   58 | pub struct Transition {
   59 |     fingerprint: [u8; 32],
   60 |     sources: Vec<pb::FragmentDigest>,
   61 |     destinations: Vec<pb::FragmentDigest>,
   62 |     mapping: Mapping,
   63 | }
   64 | 
   65 | impl Transition {
   66 |     /// Content identity for sharing an unchanged mapping across FRI histories.
   67 |     /// Derived in memory from the canonical protobuf; it is not a persisted field.
   68 |     pub fn fingerprint(&self) -> &[u8; 32] {
   69 |         &self.fingerprint
   70 |     }
   71 | 
   72 |     /// Source digests at rewrite time, including deleted physical positions.
   73 |     pub fn sources(&self) -> &[pb::FragmentDigest] {
   74 |         &self.sources
   75 |     }
   76 | 
   77 |     /// Destination digests at creation time.
   78 |     pub fn destinations(&self) -> &[pb::FragmentDigest] {
   79 |         &self.destinations
   80 |     }
   81 | 
   82 |     /// Mapping semantics for a supported index version.
   83 |     pub fn mapping(&self) -> &Mapping {
   84 |         &self.mapping
   85 |     }
   86 | }
   87 | 
   88 | /// Supported transitions in fragment-lineage order, independent of serialization order.
   89 | #[derive(Debug)]
   90 | pub struct FragReuseLedger {
   91 |     transitions: Vec<Transition>,
   92 |     consumers: HashMap<u32, usize>,
   93 |     producers: HashMap<u32, usize>,
   94 |     has_unsupported_transitions: bool,
   95 | }
   96 | 
   97 | /// The single content field of FRI details: `(1, inline history)` or
   98 | /// `(2, external file reference)`, as raw bytes.
   99 | fn content_field(details: &prost_types::Any) -> Result<(u32, Bytes)> {
  100 |     if details.type_url.rsplit('/').next() != Some("lance.table.FragmentReuseIndexDetails") {
  101 |         return Err(corrupt(format!(
  102 |             "unexpected FRI details type {:?}",
  103 |             details.type_url
  104 |         )));
  105 |     }
  106 |     let mut wire = Bytes::copy_from_slice(&details.value);
  107 |     let mut content = None;
  108 |     while wire.has_remaining() {
  109 |         let (tag, payload) = next_field(&mut wire)?;
  110 |         if matches!(tag, 1 | 2) {
  111 |             let payload = require_message(tag, payload)?;
  112 |             if content.replace((tag, payload)).is_some() {
  113 |                 return Err(corrupt("multiple FRI content fields"));
  114 |             }
  115 |         }
  116 |     }
  117 |     content.ok_or_else(|| corrupt("missing FRI content"))
  118 | }
  119 | 
  120 | impl FragReuseLedger {
  121 |     /// Decode FRI details, resolving external history through `read_external`.
  122 |     /// The callback reads the exact byte range described by the external reference;
  123 |     /// it is never used for inline history or stable-partition row maps.
  124 |     /// Index versions 0 and 1 are supported. Unsupported versions require an upgrade.
  125 |     pub async fn decode<F, Fut>(
  126 |         index_version: i32,
  127 |         details: &prost_types::Any,
  128 |         read_external: F,
  129 |     ) -> Result<Self>
  130 |     where
  131 |         F: FnOnce(crate::format::pb::ExternalFile) -> Fut,
  132 |         Fut: Future<Output = Result<Bytes>>,
  133 |     {
  134 |         validate_index_version(index_version)?;
  135 |         let (tag, content) = content_field(details)?;
  136 |         let content = if tag == 1 {
  137 |             content
  138 |         } else {
  139 |             let file = crate::format::pb::ExternalFile::decode(content)
  140 |                 .map_err(|e| corrupt(e.to_string()))?;
  141 |             file.offset
  142 |                 .checked_add(file.size)
  143 |                 .and_then(|end| usize::try_from(end).ok())
  144 |                 .ok_or_else(|| corrupt("external FRI range overflow"))?;
  145 |             let expected = file.size;
  146 |             let bytes = read_external(file).await?;
  147 |             if bytes.len() as u64 != expected {
  148 |                 return Err(corrupt(format!(
  149 |                     "external FRI size mismatch: expected {expected}, received {}",
  150 |                     bytes.len()
  151 |                 )));
  152 |             }
  153 |             bytes
  154 |         };
  155 |         Self::decode_content(index_version, content)
  156 |     }
  157 | 
  158 |     /// Decode FRI details whose history is stored inline, without any I/O.
  159 |     /// `Ok(None)` when the history lives in an external file, which only
  160 |     /// [`Self::decode`] can resolve.
  161 |     pub fn decode_inline(index_version: i32, details: &prost_types::Any) -> Result<Option<Self>> {
  162 |         validate_index_version(index_version)?;
  163 |         let (tag, content) = content_field(details)?;
  164 |         if tag == 1 {
  165 |             Self::decode_content(index_version, content).map(Some)
  166 |         } else {
  167 |             Ok(None)
  168 |         }
  169 |     }
  170 | 
  171 |     // Each legacy group owns a compaction remap. Address resolution follows its
  172 |     // fragment lineage, rather than searching every group in a legacy version.
  173 |     fn decode_content(index_version: i32, content: Bytes) -> Result<Self> {
  174 |         validate_index_version(index_version)?;
  175 |         let mut remaining = content;
  176 |         let mut transitions = Vec::new();
  177 |         let mut has_unsupported_transitions = false;
  178 |         while remaining.has_remaining() {
  179 |             let (tag, payload) = next_field(&mut remaining)?;
  180 |             match tag {
  181 |                 1 => {
  182 |                     let version = pb::Version::decode(require_message(tag, payload)?)
  183 |                         .map_err(|e| corrupt(e.to_string()))?;
  184 |                     for group in version.groups {
  185 |                         transitions.push(decode_transition(pb::Transition {
  186 |                             sources: group.old_fragments,
  187 |                             destinations: group.new_fragments,
  188 |                             mapping: Some(transition::Mapping::OrderedCompaction(
  189 |                                 pb::OrderedCompaction {
  190 |                                     changed_row_addrs: group.changed_row_addrs,
  191 |                                 },
  192 |                             )),
  193 |                         })?);
  194 |                     }
  195 |                 }
  196 |                 2 => {
  197 |                     if index_version == 0 {
  198 |                         return Err(corrupt("tagged transitions require FRI index_version 1"));
  199 |                     }
  200 |                     let raw = require_message(tag, payload)?;
  201 |                     let mut fields = raw.clone();
  202 |                     let mut has_mapping = false;
  203 |                     let mut has_unknown_fields = false;
  204 |                     while fields.has_remaining() {
  205 |                         let (tag, payload) = next_field(&mut fields)?;
  206 |                         if matches!(tag, ORDERED_COMPACTION_FIELD | STABLE_PARTITION_FIELD) {
  207 |                             require_message(tag, payload)?;
  208 |                             if has_mapping {
  209 |                                 return Err(corrupt(
  210 |                                     "transition contains multiple mapping alternatives",
  211 |                                 ));
  212 |                             }
  213 |                             has_mapping = true;
  214 |                         } else if !matches!(tag, 1 | 2) {
  215 |                             has_unknown_fields = true;
  216 |                         }
  217 |                     }
  218 |                     if has_unknown_fields {
  219 |                         // The field number does not tell us whether this is metadata
  220 |                         // or a mapping. Neither is safe to partially interpret.
  221 |                         has_unsupported_transitions = true;
  222 |                         continue;
  223 |                     }
  224 |                     if !has_mapping {
  225 |                         return Err(corrupt("transition has no mapping"));
  226 |                     }
  227 |                     let decoded =
  228 |                         pb::Transition::decode(raw).map_err(|e| corrupt(e.to_string()))?;
  229 |                     transitions.push(decode_transition(decoded)?);
  230 |                 }
  231 |                 _ => {} // Unknown envelope fields do not participate in address resolution.
  232 |             }
  233 |         }
  234 |         let transitions = order_lineage(transitions)?;
  235 |         let consumers = transitions
  236 |             .iter()
  237 |             .enumerate()
  238 |             .flat_map(|(position, transition)| {
  239 |                 transition
  240 |                     .sources()
  241 |                     .iter()
  242 |                     .map(move |source| (source.id as u32, position))
  243 |             })
  244 |             .collect();
  245 |         let producers = transitions
  246 |             .iter()
  247 |             .enumerate()
  248 |             .flat_map(|(position, transition)| {
  249 |                 transition
  250 |                     .destinations()
  251 |                     .iter()
  252 |                     .map(move |destination| (destination.id as u32, position))
  253 |             })
  254 |             .collect();
  255 |         Ok(Self {
  256 |             transitions,
  257 |             consumers,
  258 |             producers,
  259 |             has_unsupported_transitions,
  260 |         })
  261 |     }
  262 | 
  263 |     /// Whether decoding omitted transitions this implementation cannot interpret.
  264 |     /// Such a ledger is insufficient for maintenance; carrying the original
  265 |     /// serialized details forward without interpreting them is still possible.
  266 |     pub fn has_unsupported_transitions(&self) -> bool {
  267 |         self.has_unsupported_transitions
  268 |     }
  269 | 
  270 |     /// Find the transition consuming a fragment in expected constant time.
  271 |     /// The returned position indexes [`Self::transitions`]. Unaffected fragments return `None`.
  272 |     pub fn consumer(&self, fragment_id: u32) -> Option<usize> {
  273 |         self.consumers.get(&fragment_id).copied()
  274 |     }
  275 | 
  276 |     /// Find the transition producing a fragment in expected constant time.
  277 |     /// The returned position indexes [`Self::transitions`]. Original fragments return `None`.
  278 |     pub fn producer(&self, fragment_id: u32) -> Option<usize> {
  279 |         self.producers.get(&fragment_id).copied()
  280 |     }
  281 | 
  282 |     /// Whether a fragment occurs anywhere in the retained lineage.
  283 |     /// Destination coverage can still describe an index storing source addresses.
  284 |     pub fn contains_fragment(&self, fragment_id: u32) -> bool {
  285 |         self.consumers.contains_key(&fragment_id) || self.producers.contains_key(&fragment_id)
  286 |     }
  287 | 
  288 |     /// Rewrites ordered so every producer precedes its consumers.
  289 |     pub fn transitions(&self) -> &[Transition] {
  290 |         &self.transitions
  291 |     }
  292 | }
  293 | 
  294 | impl DeepSizeOf for FragReuseLedger {
  295 |     fn deep_size_of_children(&self, context: &mut Context) -> usize {
  296 |         self.consumers.deep_size_of_children(context)
  297 |             + self.producers.deep_size_of_children(context)
  298 |             + self.transitions.capacity() * std::mem::size_of::<Transition>()
  299 |             + self
  300 |                 .transitions
  301 |                 .iter()
  302 |                 .map(|transition| {
  303 |                     (transition.sources.capacity() + transition.destinations.capacity())
  304 |                         * std::mem::size_of::<pb::FragmentDigest>()
  305 |                         + match &transition.mapping {
  306 |                             Mapping::OrderedCompaction(remap) => {
  307 |                                 remap.deep_size_of_children(context)
  308 |                             }
  309 |                             Mapping::StablePartition(reference) => reference.map_id.capacity(),
  310 |                         }
  311 |                 })
  312 |                 .sum::<usize>()
  313 |     }
  314 | }
  315 | 
  316 | // Exact protobuf alternatives, not the start of a reserved field-number range.
  317 | const ORDERED_COMPACTION_FIELD: u32 = 3;
  318 | const STABLE_PARTITION_FIELD: u32 = 4;
  319 | 
  320 | fn validate_index_version(index_version: i32) -> Result<()> {
  321 |     if !matches!(index_version, 0 | 1) {
  322 |         return Err(Error::not_supported(format!(
  323 |             "Unsupported FRI index_version {index_version}; supported versions are 0 and 1. Please upgrade to a newer version of Lance."
  324 |         )));
  325 |     }
  326 |     Ok(())
  327 | }
  328 | 
  329 | fn corrupt(message: impl Into<String>) -> Error {
  330 |     Error::corrupt_file_named("FRI details", message)
  331 | }
  332 | 
  333 | // Keep length-delimited payloads as zero-copy slices of the original history.
  334 | fn next_field(input: &mut Bytes) -> Result<(u32, Option<Bytes>)> {
  335 |     let (tag, wire) = decode_key(input).map_err(|e| corrupt(e.to_string()))?;
  336 |     let payload = if wire == WireType::LengthDelimited {
  337 |         let length = decode_varint(input).map_err(|e| corrupt(e.to_string()))?;
  338 |         if length > input.remaining() as u64 {
  339 |             return Err(corrupt(format!(
  340 |                 "field {tag} length {length} exceeds remaining {} bytes",
  341 |                 input.remaining()
  342 |             )));
  343 |         }
  344 |         Some(input.split_to(length as usize))
  345 |     } else {
  346 |         skip_field(wire, tag, input, DecodeContext::default())
  347 |             .map_err(|e| corrupt(e.to_string()))?;
  348 |         None
  349 |     };
  350 |     Ok((tag, payload))
  351 | }
  352 | 
  353 | fn require_message(tag: u32, payload: Option<Bytes>) -> Result<Bytes> {
  354 |     payload.ok_or_else(|| corrupt(format!("field {tag} must be length-delimited")))
  355 | }
  356 | 
  357 | fn validate_digests(digests: &[pb::FragmentDigest], is_destination: bool) -> Result<u64> {
  358 |     let mut ids = RoaringBitmap::new();
  359 |     let mut live_rows = 0_u64;
  360 |     for digest in digests {
  361 |         if digest.id >= u64::from(RowAddress::TOMBSTONE_FRAG)
  362 |             || digest.physical_rows > u32::MAX as u64
  363 |             || digest.num_deleted_rows > digest.physical_rows
  364 |         {
  365 |             return Err(corrupt(format!("invalid fragment digest {digest:?}")));
  366 |         }
  367 |         if !ids.insert(digest.id as u32) {
  368 |             return Err(corrupt(format!(
  369 |                 "duplicate fragment {} in transition",
  370 |                 digest.id
  371 |             )));
  372 |         }
  373 |         if is_destination && digest.num_deleted_rows != 0 {
  374 |             return Err(corrupt(format!(
  375 |                 "destination fragment {} has creation-time deletions",
  376 |                 digest.id
  377 |             )));
  378 |         }
  379 |         live_rows = live_rows
  380 |             .checked_add(digest.physical_rows - digest.num_deleted_rows)
  381 |             .ok_or_else(|| corrupt("fragment row count overflow"))?;
  382 |     }
  383 |     Ok(live_rows)
  384 | }
  385 | 
  386 | fn decode_transition(value: pb::Transition) -> Result<Transition> {
  387 |     if value.sources.is_empty() {
  388 |         return Err(corrupt("transition has no source fragments"));
  389 |     }
  390 |     let source_rows = validate_digests(&value.sources, false)?;
  391 |     let destination_rows = validate_digests(&value.destinations, true)?;
  392 |     if source_rows != destination_rows {
  393 |         return Err(corrupt(format!(
  394 |             "transition row counts differ: {source_rows} source rows, {destination_rows} destination rows"
  395 |         )));
  396 |     }
  397 |     let fingerprint = *blake3::hash(&value.encode_to_vec()).as_bytes();
  398 |     let mapping = match value.mapping {
  399 |         Some(transition::Mapping::OrderedCompaction(ordered)) => {
  400 |             let mut cursor = Cursor::new(&ordered.changed_row_addrs);
  401 |             let bitmap = RoaringTreemap::deserialize_from(&mut cursor)
  402 |                 .map_err(|e| corrupt(e.to_string()))?;
  403 |             if cursor.position() != ordered.changed_row_addrs.len() as u64 {
  404 |                 return Err(corrupt("trailing bytes in ordered compaction bitmap"));
  405 |             }
  406 |             for source in &value.sources {
  407 |                 let survivors =
  408 |                     bitmap.range_cardinality(RowAddress::address_range(source.id as u32));
  409 |                 if survivors != source.physical_rows - source.num_deleted_rows {
  410 |                     return Err(corrupt(format!(
  411 |                         "fragment {} bitmap has {survivors} survivors inconsistent with its digest",
  412 |                         source.id
  413 |                     )));
  414 |                 }
  415 |             }
  416 |             let layout = |fragments: &[pb::FragmentDigest]| {
  417 |                 fragments
  418 |                     .iter()
  419 |                     .map(|f| (f.id as u32, f.physical_rows as u32))
  420 |                     .collect()
  421 |             };
  422 |             let remap = RowAddrRemap::compact_with_layout([GroupInputWithLayout {
  423 |                 rewritten_old_row_addrs: bitmap,
  424 |                 old_frags: layout(&value.sources),
  425 |                 new_frags: layout(&value.destinations),
  426 |             }])
  427 |             .map_err(|e| corrupt(e.to_string()))?;
  428 |             Mapping::OrderedCompaction(Arc::new(remap))
  429 |         }
  430 |         Some(transition::Mapping::StablePartition(partition)) => {
  431 |             Uuid::parse_str(&partition.map_id).map_err(|e| {
  432 |                 corrupt(format!(
  433 |                     "invalid stable partition map_id {:?}: {e}",
  434 |                     partition.map_id
  435 |                 ))
  436 |             })?;
  437 |             if partition.map_size_bytes == 0 {
  438 |                 return Err(corrupt("stable partition map_size_bytes must be positive"));
  439 |             }
  440 |             Mapping::StablePartition(partition)
  441 |         }
  442 |         None => return Err(corrupt("transition has no mapping")),
  443 |     };
  444 |     Ok(Transition {
  445 |         fingerprint,
  446 |         sources: value.sources,
  447 |         destinations: value.destinations,
  448 |         mapping,
  449 |     })
  450 | }
  451 | 
  452 | fn order_lineage(transitions: Vec<Transition>) -> Result<Vec<Transition>> {
  453 |     let mut producers = HashMap::new();
  454 |     let mut consumers = RoaringBitmap::new();
  455 |     for (index, transition) in transitions.iter().enumerate() {
  456 |         for destination in &transition.destinations {
  457 |             if producers
  458 |                 .insert(destination.id, (index, destination.physical_rows))
  459 |                 .is_some()
  460 |             {
  461 |                 return Err(corrupt(format!(
  462 |                     "duplicate producer for fragment {}",
  463 |                     destination.id
  464 |                 )));
  465 |             }
  466 |         }
  467 |         for source in &transition.sources {
  468 |             if !consumers.insert(source.id as u32) {
  469 |                 return Err(corrupt(format!(
  470 |                     "duplicate consumer for fragment {}",
  471 |                     source.id
  472 |                 )));
  473 |             }
  474 |         }
  475 |     }
  476 |     let mut incoming = vec![0; transitions.len()];
  477 |     let mut outgoing = vec![Vec::new(); transitions.len()];
  478 |     for (consumer, transition) in transitions.iter().enumerate() {
  479 |         for source in &transition.sources {
  480 |             if let Some(&(producer, physical_rows)) = producers.get(&source.id) {
  481 |                 if source.physical_rows != physical_rows {
  482 |                     return Err(corrupt(format!(
  483 |                         "inconsistent physical_rows for fragment {}",
  484 |                         source.id
  485 |                     )));
  486 |                 }
  487 |                 incoming[consumer] += 1;
  488 |                 outgoing[producer].push(consumer);
  489 |             }
  490 |         }
  491 |     }
  492 |     let mut ready: VecDeque<_> = incoming
  493 |         .iter()
  494 |         .enumerate()
  495 |         .filter_map(|(i, &n)| (n == 0).then_some(i))
  496 |         .collect();
  497 |     let mut ordered = Vec::with_capacity(transitions.len());
  498 |     let mut transitions: Vec<_> = transitions.into_iter().map(Some).collect();
  499 |     while let Some(index) = ready.pop_front() {
  500 |         // Each transition is queued once, when its incoming count reaches zero.
  501 |         let transition = transitions[index]
  502 |             .take()
  503 |             .ok_or_else(|| corrupt("lineage visited a transition twice"))?;
  504 |         ordered.push(transition);
  505 |         for &consumer in &outgoing[index] {
  506 |             incoming[consumer] -= 1;
  507 |             if incoming[consumer] == 0 {
  508 |                 ready.push_back(consumer);
  509 |             }
  510 |         }
  511 |     }
  512 |     if ordered.len() != transitions.len() {
  513 |         return Err(corrupt("fragment lineage contains a cycle"));
  514 |     }
  515 |     Ok(ordered)
  516 | }
  517 | 
  518 | #[cfg(test)]
  519 | mod tests {
  520 |     use super::*;
  521 |     use crate::system_index::frag_reuse::{
  522 |         CompactFragReuseIndex, FragReuseGroup, FragReuseIndexDetails, FragReuseVersion,
  523 |     };
  524 |     use rstest::rstest;
  525 | 
  526 |     fn digest(id: u64, rows: u64, deleted: u64) -> pb::FragmentDigest {
  527 |         pb::FragmentDigest {
  528 |             id,
  529 |             physical_rows: rows,
  530 |             num_deleted_rows: deleted,
  531 |         }
  532 |     }
  533 | 
  534 |     fn partition(source: u64, destination: u64) -> pb::Transition {
  535 |         pb::Transition {
  536 |             sources: vec![digest(source, 2, 0)],
  537 |             destinations: vec![digest(destination, 2, 0)],
  538 |             mapping: Some(transition::Mapping::StablePartition(pb::StablePartition {
  539 |                 map_id: Uuid::nil().to_string(),
  540 |                 map_size_bytes: 100,
  541 |                 base_id: Some(7),
  542 |             })),
  543 |         }
  544 |     }
  545 | 
  546 |     fn history(transitions: Vec<pb::Transition>) -> Bytes {
  547 |         pb::InlineContent {
  548 |             legacy_versions: vec![],
  549 |             transitions,
  550 |         }
  551 |         .encode_to_vec()
  552 |         .into()
  553 |     }
  554 | 
  555 |     fn message_field(tag: u32, payload: &[u8], output: &mut Vec<u8>) {
  556 |         prost::encoding::encode_key(tag, WireType::LengthDelimited, output);
  557 |         prost::encoding::encode_varint(payload.len() as u64, output);
  558 |         output.extend_from_slice(payload);
  559 |     }
  560 | 
  561 |     fn ordered(
  562 |         sources: Vec<pb::FragmentDigest>,
  563 |         destinations: Vec<pb::FragmentDigest>,
  564 |         addresses: &[u64],
  565 |     ) -> pb::Transition {
  566 |         let bitmap: RoaringTreemap = addresses.iter().copied().collect();
  567 |         let mut changed_row_addrs = Vec::new();
  568 |         bitmap.serialize_into(&mut changed_row_addrs).unwrap();
  569 |         pb::Transition {
  570 |             sources,
  571 |             destinations,
  572 |             mapping: Some(transition::Mapping::OrderedCompaction(
  573 |                 pb::OrderedCompaction { changed_row_addrs },
  574 |             )),
  575 |         }
  576 |     }
  577 | 
  578 |     fn address(fragment: u32, offset: u32) -> u64 {
  579 |         RowAddress::new_from_parts(fragment, offset).into()
  580 |     }
  581 | 
  582 |     fn assert_corrupt(result: Result<FragReuseLedger>, message: &str) {
  583 |         let error = result.unwrap_err();
  584 |         assert!(matches!(error, Error::CorruptFile { .. }), "{error}");
  585 |         assert!(error.to_string().contains(message), "{error}");
  586 |     }
  587 | 
  588 |     #[test]
  589 |     fn mapping_identity_survives_legacy_lifting_and_tracks_content() {
  590 |         let mapping = ordered(
  591 |             vec![digest(1, 3, 1)],
  592 |             vec![digest(2, 2, 0)],
  593 |             &[address(1, 0), address(1, 2)],
  594 |         );
  595 |         let Some(transition::Mapping::OrderedCompaction(ordered_mapping)) = &mapping.mapping else {
  596 |             unreachable!()
  597 |         };
  598 |         let legacy = pb::InlineContent {
  599 |             legacy_versions: vec![pb::Version {
  600 |                 dataset_version: 7,
  601 |                 groups: vec![pb::Group {
  602 |                     changed_row_addrs: ordered_mapping.changed_row_addrs.clone(),
  603 |                     old_fragments: mapping.sources.clone(),
  604 |                     new_fragments: mapping.destinations.clone(),
  605 |                 }],
  606 |             }],
  607 |             transitions: vec![],
  608 |         }
  609 |         .encode_to_vec();
  610 |         let legacy = FragReuseLedger::decode_content(0, legacy.into()).unwrap();
  611 |         let tagged = FragReuseLedger::decode_content(1, history(vec![mapping])).unwrap();
  612 |         assert_eq!(
  613 |             legacy.transitions()[0].fingerprint(),
  614 |             tagged.transitions()[0].fingerprint()
  615 |         );
  616 |         let different = FragReuseLedger::decode_content(
  617 |             1,
  618 |             history(vec![ordered(
  619 |                 vec![digest(1, 3, 1)],
  620 |                 vec![digest(2, 2, 0)],
  621 |                 &[address(1, 0), address(1, 1)],
  622 |             )]),
  623 |         )
  624 |         .unwrap();
  625 |         assert_ne!(
  626 |             tagged.transitions()[0].fingerprint(),
  627 |             different.transitions()[0].fingerprint()
  628 |         );
  629 |     }
  630 | 
  631 |     #[test]
  632 |     fn mixed_history_uses_lineage_and_preserves_source_order() {
  633 |         let old = ordered(
  634 |             vec![digest(2, 3, 1), digest(1, 1, 0)],
  635 |             vec![digest(3, 3, 0)],
  636 |             &[address(2, 0), address(2, 2), address(1, 0)],
  637 |         );
  638 |         let Some(transition::Mapping::OrderedCompaction(mapping)) = old.mapping else {
  639 |             unreachable!()
  640 |         };
  641 |         let mut next = partition(3, 4);
  642 |         next.sources[0].physical_rows = 3;
  643 |         next.destinations[0].physical_rows = 3;
  644 |         let content: Bytes = pb::InlineContent {
  645 |             legacy_versions: vec![pb::Version {
  646 |                 dataset_version: 100,
  647 |                 groups: vec![pb::Group {
  648 |                     old_fragments: old.sources,
  649 |                     new_fragments: old.destinations,
  650 |                     changed_row_addrs: mapping.changed_row_addrs,
  651 |                 }],
  652 |             }],
  653 |             transitions: vec![next],
  654 |         }
  655 |         .encode_to_vec()
  656 |         .into();
  657 |         let ledger = FragReuseLedger::decode_content(1, content).unwrap();
  658 |         for (position, transition) in ledger.transitions().iter().enumerate() {
  659 |             for source in transition.sources() {
  660 |                 assert_eq!(ledger.consumer(source.id as u32), Some(position));
  661 |             }
  662 |         }
  663 |         assert_eq!(ledger.consumer(u32::MAX), None);
  664 |         assert_eq!(ledger.producer(u32::MAX), None);
  665 |         assert!(!ledger.contains_fragment(u32::MAX));
  666 |         for (position, transition) in ledger.transitions().iter().enumerate() {
  667 |             for destination in transition.destinations() {
  668 |                 assert_eq!(ledger.producer(destination.id as u32), Some(position));
  669 |                 assert!(ledger.contains_fragment(destination.id as u32));
  670 |             }
  671 |         }
  672 | 
  673 |         assert_eq!(ledger.transitions().len(), 2);
  674 |         assert!(!ledger.has_unsupported_transitions());
  675 |         let Mapping::OrderedCompaction(remap) = ledger.transitions()[0].mapping() else {
  676 |             unreachable!()
  677 |         };
  678 |         assert_eq!(remap.get(address(2, 0)), Some(Some(address(3, 0))));
  679 |         assert_eq!(remap.get(address(2, 1)), Some(None));
  680 |         assert_eq!(remap.get(address(2, 2)), Some(Some(address(3, 1))));
  681 |         assert_eq!(remap.get(address(1, 0)), Some(Some(address(3, 2))));
  682 |         assert_eq!(remap.get(address(9, 0)), None);
  683 |         let Mapping::StablePartition(reference) = ledger.transitions()[1].mapping() else {
  684 |             unreachable!()
  685 |         };
  686 |         assert_eq!(reference.base_id, Some(7));
  687 |         assert_eq!(reference.map_size_bytes, 100);
  688 |     }
  689 | 
  690 |     #[test]
  691 |     fn unknown_fields_do_not_partially_apply_a_known_mapping() {
  692 |         let mut raw = partition(1, 2).encode_to_vec();
  693 |         message_field(17, b"future metadata", &mut raw);
  694 |         prost::encoding::encode_key(7, WireType::Varint, &mut raw);
  695 |         prost::encoding::encode_varint(100, &mut raw);
  696 |         let mut content = Vec::new();
  697 |         message_field(2, &raw, &mut content);
  698 |         let ledger = FragReuseLedger::decode_content(1, content.into()).unwrap();
  699 |         assert!(ledger.transitions().is_empty());
  700 |         assert!(ledger.has_unsupported_transitions());
  701 |     }
  702 | 
  703 |     #[test]
  704 |     fn unknown_mapping_is_omitted_without_discarding_supported_transitions() {
  705 |         let mut unknown = partition(2, 3);
  706 |         unknown.mapping = None;
  707 |         let mut raw = unknown.encode_to_vec();
  708 |         message_field(17, b"future mapping", &mut raw);
  709 |         let mut content =
  710 |             history(vec![partition(3, 4), partition(1, 2), partition(10, 11)]).to_vec();
  711 |         message_field(2, &raw, &mut content);
  712 |         let ledger = FragReuseLedger::decode_content(1, content.into()).unwrap();
  713 |         assert!(ledger.has_unsupported_transitions());
  714 |         assert_eq!(ledger.transitions().len(), 3);
  715 |         assert!(ledger.consumer(1).is_some());
  716 |         assert_eq!(ledger.consumer(2), None);
  717 |         assert!(ledger.consumer(3).is_some());
  718 |         assert!(ledger.consumer(10).is_some());
  719 |     }
  720 | 
  721 |     #[rstest]
  722 |     #[case::duplicate_producer(vec![partition(1, 3), partition(2, 3)], "duplicate producer")]
  723 |     #[case::duplicate_consumer(vec![partition(1, 2), partition(1, 3)], "duplicate consumer")]
  724 |     #[case::cycle(vec![partition(1, 2), partition(2, 1)], "cycle")]
  725 |     #[case::self_cycle(vec![partition(1, 1)], "cycle")]
  726 |     fn rejects_invalid_lineage(#[case] transitions: Vec<pb::Transition>, #[case] message: &str) {
  727 |         assert_corrupt(
  728 |             FragReuseLedger::decode_content(1, history(transitions)),
  729 |             message,
  730 |         );
  731 |     }
  732 | 
  733 |     #[test]
  734 |     fn multi_fragment_edges_and_intervening_deletes() {
  735 |         let mut first = partition(1, 2);
  736 |         first.sources = vec![digest(1, 4, 0)];
  737 |         first.destinations = vec![digest(2, 2, 0), digest(3, 2, 0)];
  738 |         let second = ordered(
  739 |             vec![digest(3, 2, 1), digest(2, 2, 0)],
  740 |             vec![digest(4, 3, 0)],
  741 |             &[address(3, 1), address(2, 0), address(2, 1)],
  742 |         );
  743 |         let ledger = FragReuseLedger::decode_content(1, history(vec![second, first])).unwrap();
  744 |         assert_eq!(ledger.transitions()[0].sources()[0].id, 1);
  745 |         assert_eq!(ledger.transitions()[1].sources()[0].id, 3);
  746 |         let Mapping::OrderedCompaction(remap) = ledger.transitions()[1].mapping() else {
  747 |             unreachable!()
  748 |         };
  749 |         assert_eq!(remap.get(address(3, 0)), Some(None));
  750 |         for (source, destination) in [(address(3, 1), 0), (address(2, 0), 1), (address(2, 1), 2)] {
  751 |             assert_eq!(remap.get(source), Some(Some(address(4, destination))));
  752 |         }
  753 |     }
  754 | 
  755 |     #[rstest]
  756 |     #[case::missing(vec![], "no mapping")]
  757 |     #[case::duplicate_known(vec![4, 4], "multiple mapping")]
  758 |     #[case::conflicting_known(vec![3, 4], "multiple mapping")]
  759 |     fn rejects_ambiguous_mapping(#[case] tags: Vec<u32>, #[case] message: &str) {
  760 |         let mut transition = partition(1, 2);
  761 |         transition.mapping = None;
  762 |         let mut raw = transition.encode_to_vec();
  763 |         for tag in tags {
  764 |             message_field(tag, &[], &mut raw);
  765 |         }
  766 |         let mut content = Vec::new();
  767 |         message_field(2, &raw, &mut content);
  768 |         assert_corrupt(FragReuseLedger::decode_content(1, content.into()), message);
  769 |     }
  770 | 
  771 |     #[rstest]
  772 |     #[case::truncated(vec![0x12, 10, 0], "exceeds remaining")]
  773 |     #[case::wrong_transition_wire(vec![0x10, 0], "length-delimited")]
  774 |     #[case::wrong_mapping_wire(vec![0x12, 2, 0x20, 0], "length-delimited")]
  775 |     #[case::invalid_key(vec![0], "invalid tag")]
  776 |     fn rejects_malformed_wire(#[case] content: Vec<u8>, #[case] message: &str) {
  777 |         assert_corrupt(FragReuseLedger::decode_content(1, content.into()), message);
  778 |     }
  779 | 
  780 |     #[rstest]
  781 |     #[case::invalid_id(digest(u32::MAX as u64, 2, 0), "invalid fragment digest")]
  782 |     #[case::invalid_rows(digest(1, u32::MAX as u64 + 1, 0), "invalid fragment digest")]
  783 |     #[case::invalid_deletions(digest(1, 2, 3), "invalid fragment digest")]
  784 |     #[case::row_conservation(digest(1, 3, 0), "row counts differ")]
  785 |     fn rejects_invalid_digests(#[case] source: pb::FragmentDigest, #[case] message: &str) {
  786 |         let mut transition = partition(1, 2);
  787 |         transition.sources = vec![source];
  788 |         assert_corrupt(
  789 |             FragReuseLedger::decode_content(1, history(vec![transition])),
  790 |             message,
  791 |         );
  792 |     }
  793 | 
  794 |     #[test]
  795 |     fn rejects_inconsistent_lineage_counts() {
  796 |         let mut second = partition(2, 3);
  797 |         second.sources[0] = digest(2, 3, 1);
  798 |         assert_corrupt(
  799 |             FragReuseLedger::decode_content(1, history(vec![partition(1, 2), second])),
  800 |             "inconsistent physical_rows",
  801 |         );
  802 |     }
  803 | 
  804 |     #[test]
  805 |     fn rejects_bad_bitmap_and_reference() {
  806 |         let transition = ordered(
  807 |             vec![digest(1, 2, 1)],
  808 |             vec![digest(2, 1, 0)],
  809 |             &[address(1, 2)],
  810 |         );
  811 |         assert_corrupt(
  812 |             FragReuseLedger::decode_content(1, history(vec![transition])),
  813 |             "outside",
  814 |         );
  815 |         let transition = ordered(
  816 |             vec![digest(1, 2, 1)],
  817 |             vec![digest(2, 1, 0)],
  818 |             &[address(9, 0)],
  819 |         );
  820 |         assert_corrupt(
  821 |             FragReuseLedger::decode_content(1, history(vec![transition])),
  822 |             "survivors",
  823 |         );
  824 |         let mut transition = partition(1, 2);
  825 |         let Some(transition::Mapping::StablePartition(reference)) = &mut transition.mapping else {
  826 |             unreachable!()
  827 |         };
  828 |         reference.map_id = "../escape".into();
  829 |         assert_corrupt(
  830 |             FragReuseLedger::decode_content(1, history(vec![transition])),
  831 |             "map_id",
  832 |         );
  833 |     }
  834 | 
  835 |     #[test]
  836 |     fn all_deleted_source_has_no_destinations() {
  837 |         let transition = ordered(vec![digest(1, 2, 2)], vec![], &[]);
  838 |         let ledger = FragReuseLedger::decode_content(1, history(vec![transition])).unwrap();
  839 |         let Mapping::OrderedCompaction(remap) = ledger.transitions()[0].mapping() else {
  840 |             unreachable!()
  841 |         };
  842 |         assert_eq!(remap.get(address(1, 0)), Some(None));
  843 |     }
  844 | 
  845 |     #[test]
  846 |     fn version_gate() {
  847 |         assert!(
  848 |             FragReuseLedger::decode_content(0, Bytes::new())
  849 |                 .unwrap()
  850 |                 .transitions()
  851 |                 .is_empty()
  852 |         );
  853 |         let error = FragReuseLedger::decode_content(2, Bytes::new()).unwrap_err();
  854 |         assert!(matches!(error, Error::NotSupported { .. }));
  855 |         assert!(error.to_string().contains("index_version 2"));
  856 |         assert_corrupt(
  857 |             FragReuseLedger::decode_content(0, history(vec![partition(1, 2)])),
  858 |             "index_version 1",
  859 |         );
  860 |     }
  861 |     #[rstest]
  862 |     #[case::inline(false)]
  863 |     #[case::external(true)]
  864 |     #[tokio::test]
  865 |     async fn legacy_writer_round_trip_and_remap_equivalence(#[case] external: bool) {
  866 |         let group = |sources, destinations, addresses: &[u64]| {
  867 |             let transition = ordered(sources, destinations, addresses);
  868 |             let Some(transition::Mapping::OrderedCompaction(mapping)) = transition.mapping else {
  869 |                 unreachable!()
  870 |             };
  871 |             FragReuseGroup::try_from(pb::Group {
  872 |                 old_fragments: transition.sources,
  873 |                 new_fragments: transition.destinations,
  874 |                 changed_row_addrs: mapping.changed_row_addrs,
  875 |             })
  876 |             .unwrap()
  877 |         };
  878 |         let details = FragReuseIndexDetails {
  879 |             versions: vec![
  880 |                 FragReuseVersion {
  881 |                     dataset_version: 10,
  882 |                     groups: vec![
  883 |                         group(
  884 |                             vec![digest(2, 3, 1), digest(1, 1, 0)],
  885 |                             vec![digest(3, 3, 0)],
  886 |                             &[address(2, 0), address(2, 2), address(1, 0)],
  887 |                         ),
  888 |                         group(
  889 |                             vec![digest(10, 1, 0)],
  890 |                             vec![digest(11, 1, 0)],
  891 |                             &[address(10, 0)],
  892 |                         ),
  893 |                     ],
  894 |                 },
  895 |                 FragReuseVersion {
  896 |                     dataset_version: 11,
  897 |                     groups: vec![group(
  898 |                         vec![digest(3, 3, 1)],
  899 |                         vec![digest(4, 2, 0)],
  900 |                         &[address(3, 0), address(3, 2)],
  901 |                     )],
  902 |                 },
  903 |             ],
  904 |         };
  905 |         // Use the same serializer as the index-version-0 writer.
  906 |         let content = pb::InlineContent::from(&details).encode_to_vec();
  907 |         let old = CompactFragReuseIndex::try_new(Uuid::nil(), details).unwrap();
  908 |         let file = crate::format::pb::ExternalFile {
  909 |             path: "details.binpb".into(),
  910 |             offset: 7,
  911 |             size: content.len() as u64,
  912 |         };
  913 |         let mut envelope = Vec::new();
  914 |         if external {
  915 |             message_field(2, &file.encode_to_vec(), &mut envelope);
  916 |         } else {
  917 |             message_field(1, &content, &mut envelope);
  918 |         }
  919 |         let any = prost_types::Any {
  920 |             type_url: "/lance.table.FragmentReuseIndexDetails".into(),
  921 |             value: envelope,
  922 |         };
  923 |         let ledger = FragReuseLedger::decode(1, &any, |actual| async move {
  924 |             assert!(external);
  925 |             assert_eq!(actual, file);
  926 |             Ok(content.into())
  927 |         })
  928 |         .await
  929 |         .unwrap();
  930 |         assert_eq!(ledger.transitions().len(), 3);
  931 |         for source in [
  932 |             address(2, 0),
  933 |             address(2, 1),
  934 |             address(2, 2),
  935 |             address(1, 0),
  936 |             address(10, 0),
  937 |             address(99, 0),
  938 |         ] {
  939 |             let mut translated = Some(source);
  940 |             while let Some(current) = translated {
  941 |                 let fragment = RowAddress::from(current).fragment_id();
  942 |                 let Some(index) = ledger.consumer(fragment) else {
  943 |                     break;
  944 |                 };
  945 |                 let Mapping::OrderedCompaction(remap) = ledger.transitions()[index].mapping()
  946 |                 else {
  947 |                     unreachable!()
  948 |                 };
  949 |                 translated = remap.get(current).unwrap();
  950 |             }
  951 |             assert_eq!(translated, old.remap_row_id(source), "address {source}");
  952 |         }
  953 |     }
  954 | 
  955 |     #[test]
  956 |     fn independent_transitions_keep_serialized_order() {
  957 |         let ledger =
  958 |             FragReuseLedger::decode_content(1, history(vec![partition(10, 11), partition(1, 2)]))
  959 |                 .unwrap();
  960 |         assert_eq!(
  961 |             ledger
  962 |                 .transitions()
  963 |                 .iter()
  964 |                 .map(|t| t.sources()[0].id)
  965 |                 .collect::<Vec<_>>(),
  966 |             vec![10, 1]
  967 |         );
  968 |     }
  969 | 
  970 |     #[rstest]
  971 |     #[case::missing(vec![], "missing FRI content")]
  972 |     #[case::duplicate(vec![0x0a, 0, 0x0a, 0], "multiple FRI content")]
  973 |     #[case::conflicting(vec![0x0a, 0, 0x12, 0], "multiple FRI content")]
  974 |     #[case::truncated(vec![0x0a, 10, 0], "exceeds remaining")]
  975 |     #[case::oversized(vec![0x0a, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x01], "exceeds remaining")]
  976 |     #[tokio::test]
  977 |     async fn rejects_invalid_envelope(#[case] value: Vec<u8>, #[case] message: &str) {
  978 |         let any = prost_types::Any {
  979 |             type_url: "/lance.table.FragmentReuseIndexDetails".into(),
  980 |             value,
  981 |         };
  982 |         let result = FragReuseLedger::decode(1, &any, |_| async {
  983 |             panic!("invalid envelope must not read external content")
  984 |         })
  985 |         .await;
  986 |         assert_corrupt(result, message);
  987 |     }
  988 | 
  989 |     #[tokio::test]
  990 |     async fn version_gate_precedes_envelope_and_io() {
  991 |         let error = FragReuseLedger::decode(2, &prost_types::Any::default(), |_| async {
  992 |             panic!("unsupported version must not read external content")
  993 |         })
  994 |         .await
  995 |         .unwrap_err();
  996 |         assert!(matches!(error, Error::NotSupported { .. }));
  997 |         assert!(error.to_string().contains("Please upgrade"));
  998 |     }
  999 | 
 1000 |     #[rstest]
 1001 |     #[case::overflow(u64::MAX, 1, "range overflow")]
 1002 |     #[case::short_read(0, 2, "size mismatch")]
 1003 |     #[tokio::test]
 1004 |     async fn rejects_invalid_external_range(
 1005 |         #[case] offset: u64,
 1006 |         #[case] size: u64,
 1007 |         #[case] message: &str,
 1008 |     ) {
 1009 |         let file = crate::format::pb::ExternalFile {
 1010 |             path: "details.binpb".into(),
 1011 |             offset,
 1012 |             size,
 1013 |         };
 1014 |         let mut value = Vec::new();
 1015 |         message_field(2, &file.encode_to_vec(), &mut value);
 1016 |         let details = prost_types::Any {
 1017 |             type_url: "/lance.table.FragmentReuseIndexDetails".into(),
 1018 |             value,
 1019 |         };
 1020 |         let result = FragReuseLedger::decode(1, &details, |_| async move {
 1021 |             assert_ne!(offset, u64::MAX, "overflow must be rejected before IO");
 1022 |             Ok(Bytes::from_static(&[0]))
 1023 |         })
 1024 |         .await;
 1025 |         assert_corrupt(result, message);
 1026 |     }
 1027 | 
 1028 |     proptest::proptest! {
 1029 |         #[test]
 1030 |         fn arbitrary_inline_bytes_do_not_panic(raw in proptest::collection::vec(proptest::prelude::any::<u8>(), 0..4096)) {
 1031 |             let _ = FragReuseLedger::decode_content(1, raw.into());
 1032 |         }
 1033 | 
 1034 |         #[test]
 1035 |         fn arbitrary_envelopes_do_not_panic(raw in proptest::collection::vec(proptest::prelude::any::<u8>(), 0..4096)) {
 1036 |             let any = prost_types::Any { type_url: "/lance.table.FragmentReuseIndexDetails".into(), value: raw };
 1037 |             let _ = futures::executor::block_on(FragReuseLedger::decode(1, &any, |_| async {
 1038 |                 Err(Error::not_supported("no external data in parser property test"))
 1039 |             }));
 1040 |         }
 1041 |     }
 1042 | }
``````
