> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/transaction/proto.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `864d413aeea2e6f8c7a8d74036d02cb0dd700e8af7987f750b9753aee0d507a5`. Reviewed physical lines: 1-885.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

All16 transaction operation protobuf conversions, group/index/UpdateMap converters, envelope normalizations and format-wrapper bridge. Trait implementations are externally reachable through public types despite private proto module. Two local metadata-only tests. (rust/lance-table/src/transaction/proto.rs:1-885)

## Complete range analysis

### Lines 1-27

SPDX/module documentation identifies transaction protobuf conversions as durability boundary. Imports nested metadata/codecs, all operation groups/maps/modes, Schema/Fields, Roaring, HashMap/Arc and UUID. This file converts Rust and generated protobuf objects; it does not itself encode/decode complete protobuf bytes, choose storage paths, publish manifests or validate an operation. Nested bitmap/overlay converters do handle bytes. Documentation that added fields must roundtrip is an intent, not proof all Rust representations roundtrip identically. (rust/lance-table/src/transaction/proto.rs:1-27)

### Lines 28-54

DataReplacementGroup borrowed->protobuf copies fragment ID and always emits Some(new_file), delegating DataFile conversion. Owned protobuf->Rust requires new_file or InvalidInput with exact required-field text, then delegates TryFrom. Neither verifies target fragment existence, column schema or file contents. Typo protobug in comment has no behavior. (rust/lance-table/src/transaction/proto.rs:28-54)

### Lines 55-82

DataOverlayGroup borrowed->protobuf maps overlays in existing order, preserving fragment ID; owned reverse maps each DataOverlayFile through TryFrom and short-circuit collects Result<Vec>. No group/inner overlay sorting, duplicate-ID check, field alignment or committed-version stamping. Empty overlay Vec accepted. Nested converter requires file/coverage and decodes Roaring (rust/lance-table/src/format/overlay.rs:277-328). (rust/lance-table/src/transaction/proto.rs:55-82)

### Lines 83-120

Transaction::try_from owns pb::Transaction, matching its operation first. Append maps fragments via fallible metadata conversion; Clone moves all five values unchanged, with no UUID/path/version/deep-clone validation. Delete converts updated fragments then moves deleted IDs and predicate; neither parses predicates nor checks ID sets. Conversion preserves vector order; errors stop collection and drop local values. (rust/lance-table/src/transaction/proto.rs:83-120)

### Lines 121-147

Overwrite decoder discards schema_metadata explicitly TODO, converts fragments then reconstructs Schema from flat Fields, maps empty config map to None and empty initial bases to None. Nonempty bases map infallibly preserving order. Some(empty) optional maps/vectors cannot survive this wire representation. Contextual Fields reconstruction returns schema metadata empty and does not invoke Schema::validate; field-level conversion is its separate dependency (rust/lance-file/src/datatypes.rs:157-245). (rust/lance-table/src/transaction/proto.rs:121-147)

### Lines 148-184

ReserveFragments copies count. Rewrite prefers nonempty groups and ignores old flat fragment lists entirely; otherwise constructs exactly one RewriteGroup from old/new flat lists, even when both empty. Group conversion errors propagate before rewritten-index conversion. Rewritten indices convert from borrowed items; frag_reuse_index always None. Thus empty in-memory groups serialize empty and decode as one empty group, and transient reuse entry disappears; in-memory equality need not roundtrip. No merged history assembly occurs here. (rust/lance-table/src/transaction/proto.rs:148-184)

### Lines 185-216

CreateIndex decodes new then removed metadata lists via IndexMetadata::try_from, preserving order. Merge decodes fragments and Fields schema but discards schema_metadata TODO; preserves_nullability bool passes through. Comment says missing old bool defaults false causing conservative conflicts, but full resolver behavior remains pending. Restore copies version with no lookup. (rust/lance-table/src/transaction/proto.rs:185-216)

### Lines 217-251

Update decoder moves removed IDs and converts updated/new fragment lists, then maps compacted SSTables using CompactedSsTable::try_from(m).unwrap(). Missing shard UUID is a possible error in that nested converter, so malformed input can panic despite outer Result, unlike UpdateMemWalState below. Mode0 or any unknown integer becomes Some(RewriteRows),1 Some(RewriteColumns); None is never produced by decode. Field lists pass unchanged; optional inserted key filter uses fallible conversion/transpose. No ID/bounds/key-set validation. Contextual SSTable converter requires shard_id and validates UUID bytes (rust/lance-table/src/system_index/mem_wal.rs:125-139). (rust/lance-table/src/transaction/proto.rs:217-251)

### Lines 252-284

Offset decoder selects field10 bitmap map if its outer map is nonempty, even if all values are zero-length bytes; otherwise field9 UInt32List fallback. Selected field10 skips zero-byte values, decodes other Roaring payloads with InvalidInput including fragment ID/error, and has no explicit trailing-byte exhaustion check. Valid encoded empty bitmap remains a map entry and therefore Some; field9 skips empty lists and deduplicates/sorts offsets through Roaring. Result None only if resulting map has no entries. No per-ID merge with fallback: one field10 entry suppresses every field9 entry. HashMap conversion order and first malformed error unspecified. (rust/lance-table/src/transaction/proto.rs:252-284)

### Lines 285-314

Project rebuilds Schema from Fields and carries nullability bool, with conservative-old-bool conflict commentary only. UpdateConfig detects new style by any Some config/table/schema map or nonempty field map; detects old style only by nonempty legacy upserts/deletes/schema/field map. Both true returns InvalidInput via invalid_input_source. Present empty new map counts as present; empty old scalar maps/lists do not. No compatibility/version gate selects the branch. (rust/lance-table/src/transaction/proto.rs:285-314)

### Lines 315-353

Old UpdateConfig translates nonempty config upserts/deletes into Some incremental UpdateMap, otherwise None; nonempty old schema metadata into Some replacement, empty into None. Every legacy field map entry becomes replacement UpdateMap, even if inner metadata empty (thus can clear a field when applied). Old u32 field IDs cast as i32 without range check, wrapping high values. table_metadata_updates always None. Translation clones string data and HashMap iteration order can affect resulting ordered entries; no old writer is added. (rust/lance-table/src/transaction/proto.rs:315-353)

### Lines 354-374

New UpdateConfig clones optional UpdateMaps and every field map entry using From<&...>, preserving signed field IDs, entry order and replace/None values. All-empty old/new fields take this branch and produce all optional None and empty field map. No duplicate edit/key/value validation or normalization; Some(empty) remains distinguishable here. (rust/lance-table/src/transaction/proto.rs:354-374)

### Lines 375-409

DataReplacement and DataOverlay collect fallible group conversions. UpdateMemWalState collects CompactedSsTable::try_from with ?, propagating errors rather than Update branch unwrap. UpdateBases maps BasePath infallibly. Missing operation returns Internal(Transaction message did not contain an operation), not InvalidInput. No unrecognized enum fallback at this typed oneof level; absent operation may also represent information discarded by a prior protobuf decoder, whose unknown handling is outside this file. (rust/lance-table/src/transaction/proto.rs:375-409)

### Lines 410-427

After operation success, decoder copies read_version, clones uuid despite owning message, maps empty tag to None or clones nonempty tag, maps empty properties HashMap to None or moves nonempty map into new Arc. UUID syntax/version/read-version validity is unchecked; optional empty tag/properties lose presence. Properties Arc sharing is not preserved across conversion. TransactionBuilder is not invoked. (rust/lance-table/src/transaction/proto.rs:410-427)

### Lines 428-472

Borrowed RewrittenIndex decoder requires old_id then new_id Options, converts each UUID with propagated error, then requires/clones new_index_details Any. Copies version without capability check; empty files list becomes None, nonempty becomes newly allocated IndexFile list with cloned paths and copied optional sizes. Error precedence follows struct-field evaluation. No old/new inequality, Any type/version or file-content validation; Some(empty) list cannot roundtrip distinctly. (rust/lance-table/src/transaction/proto.rs:428-472)

### Lines 473-491

Owned RewriteGroup decoder converts old fragments then new fragments through Fragment::try_from and collects separate Vecs. Empty lists accepted, order preserved, metadata sorting/normalization inside Fragment converter can still change nested representation. No uniqueness, total row conservation or group disjointness checks. (rust/lance-table/src/transaction/proto.rs:473-491)

### Lines 492-524

Borrowed Transaction encoder exhaustively matches Operation. Append converts all fragments; Clone copies bool/version and clones name/path/branch; Delete converts updated fragments and clones deleted IDs/predicate. Returns protobuf object directly, no Result and no complete byte serialization/IO. All lists preserve current input order. (rust/lance-table/src/transaction/proto.rs:492-524)

### Lines 525-554

Overwrite encoder converts fragment list and flattens schema through Fields::from, writes empty schema_metadata TODO, clones optional config or default empty, clones/converts optional bases or empty. Schema-level metadata is absent from Fields output; Project/Merge share same flattening. ReserveFragments copies count. None and Some(empty) encode identically for config/bases. Fields flatten context reads only field tree, not schema.metadata (rust/lance-file/src/datatypes.rs:292-300). (rust/lance-table/src/transaction/proto.rs:525-554)

### Lines 555-579

Rewrite encoder emits groups and rewritten indices, explicitly ignores frag_reuse_index and uses defaults for old flat lists; it never writes the legacy flattened representation. Empty group Vec therefore triggers old-layout fallback on reverse conversion. CreateIndex maps new/removed full metadata lists. No sorting, feature gate, rewrite-history merge or payload validation. (rust/lance-table/src/transaction/proto.rs:555-579)

### Lines 580-623

Merge emits fragments, flattened schema, empty schema_metadata and exact preserves_nullability; Restore copies version. Update clones all ID/field lists, converts updated/new fragments and compacted SSTables, encodes RewriteRows0/RewriteColumns1 and None0, maps optional inserted filter. These operations allocate new owned protobuf collections; no streaming conversion or alias sharing for vectors/maps. (rust/lance-table/src/transaction/proto.rs:580-623)

### Lines 624-641

Update encoder always leaves old field9 map empty and writes only field10 bitmap bytes. It ignores empty Roaring bitmaps, serializes each nonempty bitmap into fresh Vec with expect(RoaringBitmap serialization cannot fail), then collects HashMap. No optimize() call, explicit preallocation, bitmap bounds or key-subset check. None, Some(empty map) and a map consisting only of empty bitmaps all emit empty and decode None. Comment calls empty old field forward compatibility; compatibility with any released reader still needs its gates/fixtures, not this comment alone. (rust/lance-table/src/transaction/proto.rs:624-641)

### Lines 642-675

Project emits flattened fields and bool. UpdateConfig writes all three optional new UpdateMaps and signed field metadata map; all four legacy fields set empty defaults. Some empty new map is retained as present, preserving replace semantics. No dual-writing for old consumers, no automatic migration of existing transactions or format gate here. (rust/lance-table/src/transaction/proto.rs:642-675)

### Lines 676-710

DataReplacement/DataOverlay emit groups in order using local converters. UpdateMemWalState converts all pointers through infallible borrowed converter; UpdateBases clones each BasePath then consumes it into protobuf. Match exhaustively covers all16 variants. Repeated groups/IDs remain repeated; no reorder, deduplication, IO or locks. (rust/lance-table/src/transaction/proto.rs:676-710)

### Lines 711-725

Transaction envelope encoder clones complete properties map behind Arc or defaults empty, copies read_version, clones UUID, emits Some(operation), and maps tag None to empty String. Does not generate UUID or validate it. Eager unwrap_or empty String allocation request is visible though empty String normally has no heap data; no measured allocation claim. Envelope presence normalizations mean derived Rust PartialEq may differ after conversion. (rust/lance-table/src/transaction/proto.rs:711-725)

### Lines 726-749

RewrittenIndex encoder always emits Some old/new protobuf UUIDs and Some cloned Any details, copies version, maps optional file list to cloned paths/copied sizes or default empty. Ordering preserved; no semantic checks. Its decoder collapses empty list to None, so exact representation roundtrip is not guaranteed. (rust/lance-table/src/transaction/proto.rs:726-749)

### Lines 750-766

RewriteGroup encoder allocates old/new protobuf fragment Vecs preserving sequence order. Fragment converters may serialize nested optional counts as sentinels; no operation validation, conservation check or group normalization. (rust/lance-table/src/transaction/proto.rs:750-766)

### Lines 767-798

Bidirectional borrowed UpdateMap converters clone every key and optional value, preserve entry order/duplicates, None deletion tokens, empty strings and replace flag. Both always succeed; no application, validation or sorting. Some outer map presence is handled by Transaction arms, not these methods. (rust/lance-table/src/transaction/proto.rs:767-798)

### Lines 799-813

From<&Transaction> for format::Transaction delegates to pb::Transaction conversion then wraps public inner; format wrapper is distinct from in-memory operation Transaction. cfg(test) module imports DataFile and OverlayCoverage. No test fixture creates actual transaction files here. (rust/lance-table/src/transaction/proto.rs:799-813)

### Lines 814-841

Transient rewrite test constructs read_version1, empty groups/indices and Some sample frag-reuse metadata, converts Rust->protobuf->Rust and asserts only reuse entry None under Rewrite. It does not assert group shape, complete Transaction equality or bytes; empty groups become one empty group without being caught. Comment says other writers need groups, but complete conflict protocol still requires resolver analysis. (rust/lance-table/src/transaction/proto.rs:814-841)

### Lines 842-868

Overlay test creates bitmap{1,4}, legacy metadata file overlay-0.lance field3, dense coverage and committed_version6. Converts just overlay into protobuf, then builds pb::Transaction read_version1/randomUUID with one group fragment7; remaining envelope defaults. Does not start with Rust Transaction encoder or prost byte encode/decode. (rust/lance-table/src/transaction/proto.rs:842-868)

### Lines 869-885

Overlay decoder assertions require group count1,fragment7,overlay count1,version6 and coverage equalbitmap. It does not assert filename/field IDs/tag/properties/ordering or full Rust->protobuf reverse transaction roundtrip. Two local tests only; malformed SSTables/offset payloads, mixed config styles, None/empty normalizations, metadata loss, legacy rewrite fallback and all16 operation conversion matrices lack direct local tests in this file. Other modules may cover them; no tests were executed. (rust/lance-table/src/transaction/proto.rs:869-885)

## Interaction and interpretation limits

All885 lines read in four bounded chunks. Full byte framing/storage/commit IO remains pending; this file handles generated protobuf objects and nested bitmap bytes only. Historical fallbacks are existing frozen read surfaces, not new migration guidance. Contextual Fields and CompactedSsTable implementations are read but their whole files remain pending. No internet, source edits, build or runtime test; derived panic/normalization cases are source deductions.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Conversions between the transaction types and their protobuf encoding.
    5 | //!
    6 | //! A transaction is persisted as a `pb::Transaction` alongside the manifest it
    7 | //! produced, so these conversions are the format contract for everything in this
    8 | //! module: a field added to an `Operation` is only durable once it round-trips
    9 | //! here.
   10 | 
   11 | use crate::format::key_existence::KeyExistenceFilter;
   12 | use crate::format::pb;
   13 | use crate::format::{BasePath, Fragment, IndexFile, IndexMetadata, overlay::DataOverlayFile};
   14 | use crate::system_index::mem_wal::CompactedSsTable;
   15 | use crate::transaction::{
   16 |     DataOverlayGroup, DataReplacementGroup, Operation, RewriteGroup, RewrittenIndex, Transaction,
   17 |     UpdateMap, UpdateMapEntry, UpdateMode, UpdatedFragmentOffsets, translate_config_updates,
   18 |     translate_schema_metadata_updates,
   19 | };
   20 | use lance_core::datatypes::Schema;
   21 | use lance_core::{Error, Result};
   22 | use lance_file::datatypes::Fields;
   23 | use roaring::RoaringBitmap;
   24 | use std::collections::HashMap;
   25 | use std::sync::Arc;
   26 | use uuid::Uuid;
   27 | 
   28 | impl From<&DataReplacementGroup> for pb::transaction::DataReplacementGroup {
   29 |     fn from(DataReplacementGroup(fragment_id, new_file): &DataReplacementGroup) -> Self {
   30 |         Self {
   31 |             fragment_id: *fragment_id,
   32 |             new_file: Some(new_file.into()),
   33 |         }
   34 |     }
   35 | }
   36 | 
   37 | /// Convert a protobug DataReplacementGroup to a rust native DataReplacementGroup
   38 | /// this is unfortunately TryFrom instead of From because of the Option in the pb::DataReplacementGroup
   39 | impl TryFrom<pb::transaction::DataReplacementGroup> for DataReplacementGroup {
   40 |     type Error = Error;
   41 | 
   42 |     fn try_from(message: pb::transaction::DataReplacementGroup) -> Result<Self> {
   43 |         Ok(Self(
   44 |             message.fragment_id,
   45 |             message
   46 |                 .new_file
   47 |                 .ok_or(Error::invalid_input(
   48 |                     "DataReplacementGroup must have a new_file",
   49 |                 ))?
   50 |                 .try_into()?,
   51 |         ))
   52 |     }
   53 | }
   54 | 
   55 | impl From<&DataOverlayGroup> for pb::transaction::DataOverlayGroup {
   56 |     fn from(group: &DataOverlayGroup) -> Self {
   57 |         Self {
   58 |             fragment_id: group.fragment_id,
   59 |             overlays: group
   60 |                 .overlays
   61 |                 .iter()
   62 |                 .map(pb::DataOverlayFile::from)
   63 |                 .collect(),
   64 |         }
   65 |     }
   66 | }
   67 | 
   68 | impl TryFrom<pb::transaction::DataOverlayGroup> for DataOverlayGroup {
   69 |     type Error = Error;
   70 | 
   71 |     fn try_from(message: pb::transaction::DataOverlayGroup) -> Result<Self> {
   72 |         Ok(Self {
   73 |             fragment_id: message.fragment_id,
   74 |             overlays: message
   75 |                 .overlays
   76 |                 .into_iter()
   77 |                 .map(DataOverlayFile::try_from)
   78 |                 .collect::<Result<Vec<_>>>()?,
   79 |         })
   80 |     }
   81 | }
   82 | 
   83 | impl TryFrom<pb::Transaction> for Transaction {
   84 |     type Error = Error;
   85 | 
   86 |     fn try_from(message: pb::Transaction) -> Result<Self> {
   87 |         let operation = match message.operation {
   88 |             Some(pb::transaction::Operation::Append(pb::transaction::Append { fragments })) => {
   89 |                 Operation::Append {
   90 |                     fragments: fragments
   91 |                         .into_iter()
   92 |                         .map(Fragment::try_from)
   93 |                         .collect::<Result<Vec<_>>>()?,
   94 |                 }
   95 |             }
   96 |             Some(pb::transaction::Operation::Clone(pb::transaction::Clone {
   97 |                 is_shallow,
   98 |                 ref_name,
   99 |                 ref_version,
  100 |                 ref_path,
  101 |                 branch_name,
  102 |             })) => Operation::Clone {
  103 |                 is_shallow,
  104 |                 ref_name,
  105 |                 ref_version,
  106 |                 ref_path,
  107 |                 branch_name,
  108 |             },
  109 |             Some(pb::transaction::Operation::Delete(pb::transaction::Delete {
  110 |                 updated_fragments,
  111 |                 deleted_fragment_ids,
  112 |                 predicate,
  113 |             })) => Operation::Delete {
  114 |                 updated_fragments: updated_fragments
  115 |                     .into_iter()
  116 |                     .map(Fragment::try_from)
  117 |                     .collect::<Result<Vec<_>>>()?,
  118 |                 deleted_fragment_ids,
  119 |                 predicate,
  120 |             },
  121 |             Some(pb::transaction::Operation::Overwrite(pb::transaction::Overwrite {
  122 |                 fragments,
  123 |                 schema,
  124 |                 schema_metadata: _schema_metadata, // TODO: handle metadata
  125 |                 config_upsert_values,
  126 |                 initial_bases,
  127 |             })) => {
  128 |                 let config_upsert_option = if config_upsert_values.is_empty() {
  129 |                     None
  130 |                 } else {
  131 |                     Some(config_upsert_values)
  132 |                 };
  133 | 
  134 |                 Operation::Overwrite {
  135 |                     fragments: fragments
  136 |                         .into_iter()
  137 |                         .map(Fragment::try_from)
  138 |                         .collect::<Result<Vec<_>>>()?,
  139 |                     schema: Schema::try_from(&Fields(schema))?,
  140 |                     config_upsert_values: config_upsert_option,
  141 |                     initial_bases: if initial_bases.is_empty() {
  142 |                         None
  143 |                     } else {
  144 |                         Some(initial_bases.into_iter().map(BasePath::from).collect())
  145 |                     },
  146 |                 }
  147 |             }
  148 |             Some(pb::transaction::Operation::ReserveFragments(
  149 |                 pb::transaction::ReserveFragments { num_fragments },
  150 |             )) => Operation::ReserveFragments { num_fragments },
  151 |             Some(pb::transaction::Operation::Rewrite(pb::transaction::Rewrite {
  152 |                 old_fragments,
  153 |                 new_fragments,
  154 |                 groups,
  155 |                 rewritten_indices,
  156 |             })) => {
  157 |                 let groups = if !groups.is_empty() {
  158 |                     groups
  159 |                         .into_iter()
  160 |                         .map(RewriteGroup::try_from)
  161 |                         .collect::<Result<_>>()?
  162 |                 } else {
  163 |                     vec![RewriteGroup {
  164 |                         old_fragments: old_fragments
  165 |                             .into_iter()
  166 |                             .map(Fragment::try_from)
  167 |                             .collect::<Result<Vec<_>>>()?,
  168 |                         new_fragments: new_fragments
  169 |                             .into_iter()
  170 |                             .map(Fragment::try_from)
  171 |                             .collect::<Result<Vec<_>>>()?,
  172 |                     }]
  173 |                 };
  174 |                 let rewritten_indices = rewritten_indices
  175 |                     .iter()
  176 |                     .map(RewrittenIndex::try_from)
  177 |                     .collect::<Result<_>>()?;
  178 | 
  179 |                 Operation::Rewrite {
  180 |                     groups,
  181 |                     rewritten_indices,
  182 |                     frag_reuse_index: None,
  183 |                 }
  184 |             }
  185 |             Some(pb::transaction::Operation::CreateIndex(pb::transaction::CreateIndex {
  186 |                 new_indices,
  187 |                 removed_indices,
  188 |             })) => Operation::CreateIndex {
  189 |                 new_indices: new_indices
  190 |                     .into_iter()
  191 |                     .map(IndexMetadata::try_from)
  192 |                     .collect::<Result<_>>()?,
  193 |                 removed_indices: removed_indices
  194 |                     .into_iter()
  195 |                     .map(IndexMetadata::try_from)
  196 |                     .collect::<Result<_>>()?,
  197 |             },
  198 |             Some(pb::transaction::Operation::Merge(pb::transaction::Merge {
  199 |                 fragments,
  200 |                 schema,
  201 |                 schema_metadata: _schema_metadata, // TODO: handle metadata
  202 |                 preserves_nullability,
  203 |             })) => Operation::Merge {
  204 |                 fragments: fragments
  205 |                     .into_iter()
  206 |                     .map(Fragment::try_from)
  207 |                     .collect::<Result<Vec<_>>>()?,
  208 |                 schema: Schema::try_from(&Fields(schema))?,
  209 |                 // False for a writer that predates the field: no assertion, so
  210 |                 // a legacy required-field merge still conflicts and a legacy
  211 |                 // nullable merge over-conflicts, which only retries.
  212 |                 preserves_nullability,
  213 |             },
  214 |             Some(pb::transaction::Operation::Restore(pb::transaction::Restore { version })) => {
  215 |                 Operation::Restore { version }
  216 |             }
  217 |             Some(pb::transaction::Operation::Update(pb::transaction::Update {
  218 |                 removed_fragment_ids,
  219 |                 updated_fragments,
  220 |                 new_fragments,
  221 |                 fields_modified,
  222 |                 compacted_sstables,
  223 |                 fields_for_preserving_frag_bitmap,
  224 |                 update_mode,
  225 |                 inserted_rows,
  226 |                 updated_fragment_offsets,
  227 |                 updated_fragment_offset_bitmaps,
  228 |             })) => Operation::Update {
  229 |                 removed_fragment_ids,
  230 |                 updated_fragments: updated_fragments
  231 |                     .into_iter()
  232 |                     .map(Fragment::try_from)
  233 |                     .collect::<Result<Vec<_>>>()?,
  234 |                 new_fragments: new_fragments
  235 |                     .into_iter()
  236 |                     .map(Fragment::try_from)
  237 |                     .collect::<Result<Vec<_>>>()?,
  238 |                 fields_modified,
  239 |                 compacted_sstables: compacted_sstables
  240 |                     .into_iter()
  241 |                     .map(|m| CompactedSsTable::try_from(m).unwrap())
  242 |                     .collect(),
  243 |                 fields_for_preserving_frag_bitmap,
  244 |                 update_mode: match update_mode {
  245 |                     0 => Some(UpdateMode::RewriteRows),
  246 |                     1 => Some(UpdateMode::RewriteColumns),
  247 |                     _ => Some(UpdateMode::RewriteRows),
  248 |                 },
  249 |                 inserted_rows_filter: inserted_rows
  250 |                     .map(|ik| KeyExistenceFilter::try_from(&ik))
  251 |                     .transpose()?,
  252 |                 updated_fragment_offsets: {
  253 |                     // Prefer field 10 (RoaringBitmap bytes); fall back to field 9 (UInt32List)
  254 |                     // for manifests written before this change.
  255 |                     let m: HashMap<u64, RoaringBitmap> =
  256 |                         if !updated_fragment_offset_bitmaps.is_empty() {
  257 |                             updated_fragment_offset_bitmaps
  258 |                                 .into_iter()
  259 |                                 .filter(|(_, bytes)| !bytes.is_empty())
  260 |                                 .map(|(id, bytes)| {
  261 |                                     let bitmap = RoaringBitmap::deserialize_from(bytes.as_slice())
  262 |                                         .map_err(|e| {
  263 |                                             Error::invalid_input(format!(
  264 |                                                 "invalid updated_fragment_offset_bitmaps \
  265 |                                                      for fragment {id}: {e}"
  266 |                                             ))
  267 |                                         })?;
  268 |                                     Ok((id, bitmap))
  269 |                                 })
  270 |                                 .collect::<Result<HashMap<_, _>>>()?
  271 |                         } else {
  272 |                             updated_fragment_offsets
  273 |                                 .into_iter()
  274 |                                 .filter(|(_, list)| !list.values.is_empty())
  275 |                                 .map(|(id, list)| (id, RoaringBitmap::from_iter(list.values)))
  276 |                                 .collect()
  277 |                         };
  278 |                     if m.is_empty() {
  279 |                         None
  280 |                     } else {
  281 |                         Some(UpdatedFragmentOffsets(m))
  282 |                     }
  283 |                 },
  284 |             },
  285 |             Some(pb::transaction::Operation::Project(pb::transaction::Project {
  286 |                 schema,
  287 |                 preserves_nullability,
  288 |             })) => Operation::Project {
  289 |                 schema: Schema::try_from(&Fields(schema))?,
  290 |                 // False for a writer that predates the field: no assertion, so
  291 |                 // a legacy tightening still conflicts and a legacy rename
  292 |                 // over-conflicts, which only retries.
  293 |                 preserves_nullability,
  294 |             },
  295 |             Some(pb::transaction::Operation::UpdateConfig(update_config)) => {
  296 |                 // Check if new-style fields are present
  297 |                 let has_new_fields = update_config.config_updates.is_some()
  298 |                     || update_config.table_metadata_updates.is_some()
  299 |                     || update_config.schema_metadata_updates.is_some()
  300 |                     || !update_config.field_metadata_updates.is_empty();
  301 | 
  302 |                 // Check if old-style fields are present
  303 |                 let has_old_fields = !update_config.upsert_values.is_empty()
  304 |                     || !update_config.delete_keys.is_empty()
  305 |                     || !update_config.schema_metadata.is_empty()
  306 |                     || !update_config.field_metadata.is_empty();
  307 | 
  308 |                 // Error if both are present
  309 |                 if has_new_fields && has_old_fields {
  310 |                     return Err(Error::invalid_input_source(
  311 |                         "Cannot mix old and new style UpdateConfig fields".into(),
  312 |                     ));
  313 |                 }
  314 | 
  315 |                 if has_old_fields {
  316 |                     // Translate old-style to new-style
  317 |                     let config_updates = if !update_config.upsert_values.is_empty()
  318 |                         || !update_config.delete_keys.is_empty()
  319 |                     {
  320 |                         Some(translate_config_updates(
  321 |                             &update_config.upsert_values,
  322 |                             &update_config.delete_keys,
  323 |                         ))
  324 |                     } else {
  325 |                         None
  326 |                     };
  327 | 
  328 |                     let schema_metadata_updates = if !update_config.schema_metadata.is_empty() {
  329 |                         Some(translate_schema_metadata_updates(
  330 |                             &update_config.schema_metadata,
  331 |                         ))
  332 |                     } else {
  333 |                         None
  334 |                     };
  335 | 
  336 |                     let field_metadata_updates = update_config
  337 |                         .field_metadata
  338 |                         .into_iter()
  339 |                         .map(|(field_id, field_meta_update)| {
  340 |                             (
  341 |                                 field_id as i32,
  342 |                                 translate_schema_metadata_updates(&field_meta_update.metadata),
  343 |                             )
  344 |                         })
  345 |                         .collect();
  346 | 
  347 |                     Operation::UpdateConfig {
  348 |                         config_updates,
  349 |                         table_metadata_updates: None,
  350 |                         schema_metadata_updates,
  351 |                         field_metadata_updates,
  352 |                     }
  353 |                 } else {
  354 |                     // Use new-style fields directly (convert from protobuf)
  355 |                     Operation::UpdateConfig {
  356 |                         config_updates: update_config.config_updates.as_ref().map(UpdateMap::from),
  357 |                         table_metadata_updates: update_config
  358 |                             .table_metadata_updates
  359 |                             .as_ref()
  360 |                             .map(UpdateMap::from),
  361 |                         schema_metadata_updates: update_config
  362 |                             .schema_metadata_updates
  363 |                             .as_ref()
  364 |                             .map(UpdateMap::from),
  365 |                         field_metadata_updates: update_config
  366 |                             .field_metadata_updates
  367 |                             .iter()
  368 |                             .map(|(field_id, pb_update_map)| {
  369 |                                 (*field_id, UpdateMap::from(pb_update_map))
  370 |                             })
  371 |                             .collect(),
  372 |                     }
  373 |                 }
  374 |             }
  375 |             Some(pb::transaction::Operation::DataReplacement(
  376 |                 pb::transaction::DataReplacement { replacements },
  377 |             )) => Operation::DataReplacement {
  378 |                 replacements: replacements
  379 |                     .into_iter()
  380 |                     .map(DataReplacementGroup::try_from)
  381 |                     .collect::<Result<Vec<_>>>()?,
  382 |             },
  383 |             Some(pb::transaction::Operation::UpdateMemWalState(
  384 |                 pb::transaction::UpdateMemWalState { compacted_sstables },
  385 |             )) => Operation::UpdateMemWalState {
  386 |                 compacted_sstables: compacted_sstables
  387 |                     .into_iter()
  388 |                     .map(CompactedSsTable::try_from)
  389 |                     .collect::<Result<_>>()?,
  390 |             },
  391 |             Some(pb::transaction::Operation::UpdateBases(pb::transaction::UpdateBases {
  392 |                 new_bases,
  393 |             })) => Operation::UpdateBases {
  394 |                 new_bases: new_bases.into_iter().map(BasePath::from).collect(),
  395 |             },
  396 |             Some(pb::transaction::Operation::DataOverlay(pb::transaction::DataOverlay {
  397 |                 groups,
  398 |             })) => Operation::DataOverlay {
  399 |                 groups: groups
  400 |                     .into_iter()
  401 |                     .map(DataOverlayGroup::try_from)
  402 |                     .collect::<Result<Vec<_>>>()?,
  403 |             },
  404 |             None => {
  405 |                 return Err(Error::internal(
  406 |                     "Transaction message did not contain an operation".to_string(),
  407 |                 ));
  408 |             }
  409 |         };
  410 |         Ok(Self {
  411 |             read_version: message.read_version,
  412 |             uuid: message.uuid.clone(),
  413 |             operation,
  414 |             tag: if message.tag.is_empty() {
  415 |                 None
  416 |             } else {
  417 |                 Some(message.tag.clone())
  418 |             },
  419 |             transaction_properties: if message.transaction_properties.is_empty() {
  420 |                 None
  421 |             } else {
  422 |                 Some(Arc::new(message.transaction_properties))
  423 |             },
  424 |         })
  425 |     }
  426 | }
  427 | 
  428 | impl TryFrom<&pb::transaction::rewrite::RewrittenIndex> for RewrittenIndex {
  429 |     type Error = Error;
  430 | 
  431 |     fn try_from(message: &pb::transaction::rewrite::RewrittenIndex) -> Result<Self> {
  432 |         Ok(Self {
  433 |             old_id: message
  434 |                 .old_id
  435 |                 .as_ref()
  436 |                 .map(Uuid::try_from)
  437 |                 .ok_or_else(|| {
  438 |                     Error::invalid_input("required field (old_id) missing from message".to_string())
  439 |                 })??,
  440 |             new_id: message
  441 |                 .new_id
  442 |                 .as_ref()
  443 |                 .map(Uuid::try_from)
  444 |                 .ok_or_else(|| {
  445 |                     Error::invalid_input("required field (new_id) missing from message".to_string())
  446 |                 })??,
  447 |             new_index_details: message
  448 |                 .new_index_details
  449 |                 .as_ref()
  450 |                 .ok_or_else(|| {
  451 |                     Error::invalid_input("new_index_details is a required field".to_string())
  452 |                 })?
  453 |                 .clone(),
  454 |             new_index_version: message.new_index_version,
  455 |             new_index_files: if message.new_index_files.is_empty() {
  456 |                 None
  457 |             } else {
  458 |                 Some(
  459 |                     message
  460 |                         .new_index_files
  461 |                         .iter()
  462 |                         .map(|f| IndexFile {
  463 |                             path: f.path.clone(),
  464 |                             size_bytes: f.size_bytes,
  465 |                         })
  466 |                         .collect(),
  467 |                 )
  468 |             },
  469 |         })
  470 |     }
  471 | }
  472 | 
  473 | impl TryFrom<pb::transaction::rewrite::RewriteGroup> for RewriteGroup {
  474 |     type Error = Error;
  475 | 
  476 |     fn try_from(message: pb::transaction::rewrite::RewriteGroup) -> Result<Self> {
  477 |         Ok(Self {
  478 |             old_fragments: message
  479 |                 .old_fragments
  480 |                 .into_iter()
  481 |                 .map(Fragment::try_from)
  482 |                 .collect::<Result<Vec<_>>>()?,
  483 |             new_fragments: message
  484 |                 .new_fragments
  485 |                 .into_iter()
  486 |                 .map(Fragment::try_from)
  487 |                 .collect::<Result<Vec<_>>>()?,
  488 |         })
  489 |     }
  490 | }
  491 | 
  492 | impl From<&Transaction> for pb::Transaction {
  493 |     fn from(value: &Transaction) -> Self {
  494 |         let operation = match &value.operation {
  495 |             Operation::Append { fragments } => {
  496 |                 pb::transaction::Operation::Append(pb::transaction::Append {
  497 |                     fragments: fragments.iter().map(pb::DataFragment::from).collect(),
  498 |                 })
  499 |             }
  500 |             Operation::Clone {
  501 |                 is_shallow,
  502 |                 ref_name,
  503 |                 ref_version,
  504 |                 ref_path,
  505 |                 branch_name,
  506 |             } => pb::transaction::Operation::Clone(pb::transaction::Clone {
  507 |                 is_shallow: *is_shallow,
  508 |                 ref_name: ref_name.clone(),
  509 |                 ref_version: *ref_version,
  510 |                 ref_path: ref_path.clone(),
  511 |                 branch_name: branch_name.clone(),
  512 |             }),
  513 |             Operation::Delete {
  514 |                 updated_fragments,
  515 |                 deleted_fragment_ids,
  516 |                 predicate,
  517 |             } => pb::transaction::Operation::Delete(pb::transaction::Delete {
  518 |                 updated_fragments: updated_fragments
  519 |                     .iter()
  520 |                     .map(pb::DataFragment::from)
  521 |                     .collect(),
  522 |                 deleted_fragment_ids: deleted_fragment_ids.clone(),
  523 |                 predicate: predicate.clone(),
  524 |             }),
  525 |             Operation::Overwrite {
  526 |                 fragments,
  527 |                 schema,
  528 |                 config_upsert_values,
  529 |                 initial_bases,
  530 |             } => {
  531 |                 pb::transaction::Operation::Overwrite(pb::transaction::Overwrite {
  532 |                     fragments: fragments.iter().map(pb::DataFragment::from).collect(),
  533 |                     schema: Fields::from(schema).0,
  534 |                     schema_metadata: Default::default(), // TODO: handle metadata
  535 |                     config_upsert_values: config_upsert_values
  536 |                         .clone()
  537 |                         .unwrap_or(Default::default()),
  538 |                     initial_bases: initial_bases
  539 |                         .as_ref()
  540 |                         .map(|paths| {
  541 |                             paths
  542 |                                 .iter()
  543 |                                 .cloned()
  544 |                                 .map(|bp: BasePath| -> pb::BasePath { bp.into() })
  545 |                                 .collect::<Vec<pb::BasePath>>()
  546 |                         })
  547 |                         .unwrap_or_default(),
  548 |                 })
  549 |             }
  550 |             Operation::ReserveFragments { num_fragments } => {
  551 |                 pb::transaction::Operation::ReserveFragments(pb::transaction::ReserveFragments {
  552 |                     num_fragments: *num_fragments,
  553 |                 })
  554 |             }
  555 |             Operation::Rewrite {
  556 |                 groups,
  557 |                 rewritten_indices,
  558 |                 frag_reuse_index: _,
  559 |             } => pb::transaction::Operation::Rewrite(pb::transaction::Rewrite {
  560 |                 groups: groups
  561 |                     .iter()
  562 |                     .map(pb::transaction::rewrite::RewriteGroup::from)
  563 |                     .collect(),
  564 |                 rewritten_indices: rewritten_indices
  565 |                     .iter()
  566 |                     .map(|rewritten| rewritten.into())
  567 |                     .collect(),
  568 |                 ..Default::default()
  569 |             }),
  570 |             Operation::CreateIndex {
  571 |                 new_indices,
  572 |                 removed_indices,
  573 |             } => pb::transaction::Operation::CreateIndex(pb::transaction::CreateIndex {
  574 |                 new_indices: new_indices.iter().map(pb::IndexMetadata::from).collect(),
  575 |                 removed_indices: removed_indices
  576 |                     .iter()
  577 |                     .map(pb::IndexMetadata::from)
  578 |                     .collect(),
  579 |             }),
  580 |             Operation::Merge {
  581 |                 fragments,
  582 |                 schema,
  583 |                 preserves_nullability,
  584 |             } => pb::transaction::Operation::Merge(pb::transaction::Merge {
  585 |                 fragments: fragments.iter().map(pb::DataFragment::from).collect(),
  586 |                 schema: Fields::from(schema).0,
  587 |                 schema_metadata: Default::default(), // TODO: handle metadata
  588 |                 preserves_nullability: *preserves_nullability,
  589 |             }),
  590 |             Operation::Restore { version } => {
  591 |                 pb::transaction::Operation::Restore(pb::transaction::Restore { version: *version })
  592 |             }
  593 |             Operation::Update {
  594 |                 removed_fragment_ids,
  595 |                 updated_fragments,
  596 |                 new_fragments,
  597 |                 fields_modified,
  598 |                 compacted_sstables,
  599 |                 fields_for_preserving_frag_bitmap,
  600 |                 update_mode,
  601 |                 inserted_rows_filter,
  602 |                 updated_fragment_offsets,
  603 |             } => pb::transaction::Operation::Update(pb::transaction::Update {
  604 |                 removed_fragment_ids: removed_fragment_ids.clone(),
  605 |                 updated_fragments: updated_fragments
  606 |                     .iter()
  607 |                     .map(pb::DataFragment::from)
  608 |                     .collect(),
  609 |                 new_fragments: new_fragments.iter().map(pb::DataFragment::from).collect(),
  610 |                 fields_modified: fields_modified.clone(),
  611 |                 compacted_sstables: compacted_sstables
  612 |                     .iter()
  613 |                     .map(pb::CompactedSsTable::from)
  614 |                     .collect(),
  615 |                 fields_for_preserving_frag_bitmap: fields_for_preserving_frag_bitmap.clone(),
  616 |                 update_mode: update_mode
  617 |                     .as_ref()
  618 |                     .map(|mode| match mode {
  619 |                         UpdateMode::RewriteRows => 0,
  620 |                         UpdateMode::RewriteColumns => 1,
  621 |                     })
  622 |                     .unwrap_or(0),
  623 |                 inserted_rows: inserted_rows_filter.as_ref().map(|ik| ik.into()),
  624 |                 // Field 9: no longer written; kept empty for forward compat.
  625 |                 updated_fragment_offsets: HashMap::new(),
  626 |                 // Field 10: RoaringBitmap bytes.
  627 |                 updated_fragment_offset_bitmaps: updated_fragment_offsets
  628 |                     .as_ref()
  629 |                     .map(|UpdatedFragmentOffsets(m)| {
  630 |                         m.iter()
  631 |                             .filter(|(_, b)| !b.is_empty())
  632 |                             .map(|(frag_id, b)| {
  633 |                                 let mut buf = Vec::new();
  634 |                                 b.serialize_into(&mut buf)
  635 |                                     .expect("RoaringBitmap serialization cannot fail");
  636 |                                 (*frag_id, buf)
  637 |                             })
  638 |                             .collect::<HashMap<_, _>>()
  639 |                     })
  640 |                     .unwrap_or_default(),
  641 |             }),
  642 |             Operation::Project {
  643 |                 schema,
  644 |                 preserves_nullability,
  645 |             } => pb::transaction::Operation::Project(pb::transaction::Project {
  646 |                 schema: Fields::from(schema).0,
  647 |                 preserves_nullability: *preserves_nullability,
  648 |             }),
  649 |             Operation::UpdateConfig {
  650 |                 config_updates,
  651 |                 table_metadata_updates,
  652 |                 schema_metadata_updates,
  653 |                 field_metadata_updates,
  654 |             } => pb::transaction::Operation::UpdateConfig(pb::transaction::UpdateConfig {
  655 |                 config_updates: config_updates
  656 |                     .as_ref()
  657 |                     .map(pb::transaction::UpdateMap::from),
  658 |                 table_metadata_updates: table_metadata_updates
  659 |                     .as_ref()
  660 |                     .map(pb::transaction::UpdateMap::from),
  661 |                 schema_metadata_updates: schema_metadata_updates
  662 |                     .as_ref()
  663 |                     .map(pb::transaction::UpdateMap::from),
  664 |                 field_metadata_updates: field_metadata_updates
  665 |                     .iter()
  666 |                     .map(|(field_id, update_map)| {
  667 |                         (*field_id, pb::transaction::UpdateMap::from(update_map))
  668 |                     })
  669 |                     .collect(),
  670 |                 // Leave old fields empty - we only write new-style fields
  671 |                 upsert_values: Default::default(),
  672 |                 delete_keys: Default::default(),
  673 |                 schema_metadata: Default::default(),
  674 |                 field_metadata: Default::default(),
  675 |             }),
  676 |             Operation::DataReplacement { replacements } => {
  677 |                 pb::transaction::Operation::DataReplacement(pb::transaction::DataReplacement {
  678 |                     replacements: replacements
  679 |                         .iter()
  680 |                         .map(pb::transaction::DataReplacementGroup::from)
  681 |                         .collect(),
  682 |                 })
  683 |             }
  684 |             Operation::DataOverlay { groups } => {
  685 |                 pb::transaction::Operation::DataOverlay(pb::transaction::DataOverlay {
  686 |                     groups: groups
  687 |                         .iter()
  688 |                         .map(pb::transaction::DataOverlayGroup::from)
  689 |                         .collect(),
  690 |                 })
  691 |             }
  692 |             Operation::UpdateMemWalState { compacted_sstables } => {
  693 |                 pb::transaction::Operation::UpdateMemWalState(pb::transaction::UpdateMemWalState {
  694 |                     compacted_sstables: compacted_sstables
  695 |                         .iter()
  696 |                         .map(pb::CompactedSsTable::from)
  697 |                         .collect::<Vec<_>>(),
  698 |                 })
  699 |             }
  700 |             Operation::UpdateBases { new_bases } => {
  701 |                 pb::transaction::Operation::UpdateBases(pb::transaction::UpdateBases {
  702 |                     new_bases: new_bases
  703 |                         .iter()
  704 |                         .cloned()
  705 |                         .map(|bp: BasePath| -> pb::BasePath { bp.into() })
  706 |                         .collect::<Vec<pb::BasePath>>(),
  707 |                 })
  708 |             }
  709 |         };
  710 | 
  711 |         let transaction_properties = value
  712 |             .transaction_properties
  713 |             .as_ref()
  714 |             .map(|arc| arc.as_ref().clone())
  715 |             .unwrap_or_default();
  716 |         Self {
  717 |             read_version: value.read_version,
  718 |             uuid: value.uuid.clone(),
  719 |             operation: Some(operation),
  720 |             tag: value.tag.clone().unwrap_or("".to_string()),
  721 |             transaction_properties,
  722 |         }
  723 |     }
  724 | }
  725 | 
  726 | impl From<&RewrittenIndex> for pb::transaction::rewrite::RewrittenIndex {
  727 |     fn from(value: &RewrittenIndex) -> Self {
  728 |         Self {
  729 |             old_id: Some((&value.old_id).into()),
  730 |             new_id: Some((&value.new_id).into()),
  731 |             new_index_details: Some(value.new_index_details.clone()),
  732 |             new_index_version: value.new_index_version,
  733 |             new_index_files: value
  734 |                 .new_index_files
  735 |                 .as_ref()
  736 |                 .map(|files| {
  737 |                     files
  738 |                         .iter()
  739 |                         .map(|f| pb::IndexFile {
  740 |                             path: f.path.clone(),
  741 |                             size_bytes: f.size_bytes,
  742 |                         })
  743 |                         .collect()
  744 |                 })
  745 |                 .unwrap_or_default(),
  746 |         }
  747 |     }
  748 | }
  749 | 
  750 | impl From<&RewriteGroup> for pb::transaction::rewrite::RewriteGroup {
  751 |     fn from(value: &RewriteGroup) -> Self {
  752 |         Self {
  753 |             old_fragments: value
  754 |                 .old_fragments
  755 |                 .iter()
  756 |                 .map(pb::DataFragment::from)
  757 |                 .collect(),
  758 |             new_fragments: value
  759 |                 .new_fragments
  760 |                 .iter()
  761 |                 .map(pb::DataFragment::from)
  762 |                 .collect(),
  763 |         }
  764 |     }
  765 | }
  766 | 
  767 | impl From<&UpdateMap> for pb::transaction::UpdateMap {
  768 |     fn from(update_map: &UpdateMap) -> Self {
  769 |         Self {
  770 |             update_entries: update_map
  771 |                 .update_entries
  772 |                 .iter()
  773 |                 .map(|entry| pb::transaction::UpdateMapEntry {
  774 |                     key: entry.key.clone(),
  775 |                     value: entry.value.clone(),
  776 |                 })
  777 |                 .collect(),
  778 |             replace: update_map.replace,
  779 |         }
  780 |     }
  781 | }
  782 | 
  783 | impl From<&pb::transaction::UpdateMap> for UpdateMap {
  784 |     fn from(pb_update_map: &pb::transaction::UpdateMap) -> Self {
  785 |         Self {
  786 |             update_entries: pb_update_map
  787 |                 .update_entries
  788 |                 .iter()
  789 |                 .map(|entry| UpdateMapEntry {
  790 |                     key: entry.key.clone(),
  791 |                     value: entry.value.clone(),
  792 |                 })
  793 |                 .collect(),
  794 |             replace: pb_update_map.replace,
  795 |         }
  796 |     }
  797 | }
  798 | 
  799 | impl From<&Transaction> for crate::format::Transaction {
  800 |     fn from(value: &Transaction) -> Self {
  801 |         let pb_transaction: pb::Transaction = value.into();
  802 |         Self {
  803 |             inner: pb_transaction,
  804 |         }
  805 |     }
  806 | }
  807 | 
  808 | #[cfg(test)]
  809 | mod tests {
  810 |     use super::*;
  811 |     use crate::format::DataFile;
  812 |     use crate::format::overlay::OverlayCoverage;
  813 | 
  814 |     #[test]
  815 |     fn test_rewrite_frag_reuse_update_stays_in_memory() {
  816 |         // The fragment reuse update never enters the transaction file:
  817 |         // other writers' conflict decisions only need the fragment sets in
  818 |         // `groups`.
  819 |         let entry = crate::transaction::test_support::sample_index_metadata(
  820 |             crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME,
  821 |         );
  822 |         let transaction = Transaction::new(
  823 |             1,
  824 |             Operation::Rewrite {
  825 |                 groups: vec![],
  826 |                 rewritten_indices: vec![],
  827 |                 frag_reuse_index: Some(entry),
  828 |             },
  829 |             None,
  830 |         );
  831 |         let decoded = Transaction::try_from(pb::Transaction::from(&transaction)).unwrap();
  832 |         match decoded.operation {
  833 |             Operation::Rewrite {
  834 |                 frag_reuse_index, ..
  835 |             } => {
  836 |                 assert!(frag_reuse_index.is_none());
  837 |             }
  838 |             other => panic!("expected Rewrite, got {other:?}"),
  839 |         }
  840 |     }
  841 | 
  842 |     #[test]
  843 |     fn test_data_overlay_operation_roundtrips() {
  844 |         // A DataOverlay operation survives the protobuf round-trip, preserving
  845 |         // the target fragment, the overlay's coverage, and its committed_version.
  846 |         let mut bitmap = roaring::RoaringBitmap::new();
  847 |         bitmap.insert(1);
  848 |         bitmap.insert(4);
  849 |         let overlay = DataOverlayFile {
  850 |             data_file: DataFile::new_legacy_from_fields("overlay-0.lance", vec![3], None),
  851 |             coverage: OverlayCoverage::dense(bitmap.clone()),
  852 |             committed_version: 6,
  853 |         };
  854 |         let pb_overlay = pb::DataOverlayFile::from(&overlay);
  855 | 
  856 |         let message = pb::Transaction {
  857 |             read_version: 1,
  858 |             uuid: Uuid::new_v4().to_string(),
  859 |             operation: Some(pb::transaction::Operation::DataOverlay(
  860 |                 pb::transaction::DataOverlay {
  861 |                     groups: vec![pb::transaction::DataOverlayGroup {
  862 |                         fragment_id: 7,
  863 |                         overlays: vec![pb_overlay],
  864 |                     }],
  865 |                 },
  866 |             )),
  867 |             ..Default::default()
  868 |         };
  869 | 
  870 |         let txn = Transaction::try_from(message).unwrap();
  871 |         match txn.operation {
  872 |             Operation::DataOverlay { groups } => {
  873 |                 assert_eq!(groups.len(), 1);
  874 |                 assert_eq!(groups[0].fragment_id, 7);
  875 |                 assert_eq!(groups[0].overlays.len(), 1);
  876 |                 assert_eq!(groups[0].overlays[0].committed_version, 6);
  877 |                 assert_eq!(
  878 |                     *groups[0].overlays[0].coverage_for_field(0).unwrap(),
  879 |                     bitmap
  880 |                 );
  881 |             }
  882 |             other => panic!("expected DataOverlay, got {other:?}"),
  883 |         }
  884 |     }
  885 | }
``````
