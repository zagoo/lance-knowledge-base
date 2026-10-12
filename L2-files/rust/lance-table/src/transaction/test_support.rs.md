> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-table/src/transaction/test_support.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `64e3be63163665810bef2955d51854046322f0f49f624e520a4e47ec08e07ea6`. Reviewed physical lines: 1-199.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Shared crate-visible cfg(test) fixtures for transaction tests, in-memory metadata and inline tagged history only. Public-in-module helpers are not release API. (rust/lance-table/src/transaction/test_support.rs:1-199)

## Complete range analysis

### Lines 1-19

SPDX/docs/imports supply metadata types, stable flag, Arrow schema, UUID/time and Arcs. Parent gates the whole module under cfg(test) and pub(crate) (rust/lance-table/src/transaction.rs:41-42). No files are written or store handles opened. (rust/lance-table/src/transaction/test_support.rs:1-19)

### Lines 20-36

default_build_config returns auto_set_feature_flags true, current SystemTime nanoseconds since Unix epoch (unwrap can panic for earlier clock), use_stable_row_ids false, legacy/storage selection None, disable_transaction_file false, migration_next_row_id None and empty default spilled lineage. Docs call this resolved ManifestWriteConfig default; that external equivalence is not established by reading this fixture alone. (rust/lance-table/src/transaction/test_support.rs:20-36)

### Lines 37-46

sample_manifest constructs nonnull Arrow id:Int32, unwraps conversion to Lance Schema, wraps single Fragment::new(0) in Arc, uses exactV2_0 format and empty config, delegates Manifest::new. No physical data/row population. (rust/lance-table/src/transaction/test_support.rs:37-46)

### Lines 47-62

sample_index_metadata(name) generates v4UUID and current Utc timestamp, fields[0],empty covering,dataset_version0,Some fragment bitmap{0},detailsNone,index_version1,baseNone,filesNone. It copies name and returns unchecked IndexMetadata, not a constructed/queryable index. (rust/lance-table/src/transaction/test_support.rs:47-62)

### Lines 63-70

overlay_with_field uses legacy DataFile path o.lance, one field, no known size, dense coverage physical offset0, supplied committed version. No field/value/null or carrier validation; this is metadata even though broader overlay runtime rules may require current formats. (rust/lance-table/src/transaction/test_support.rs:63-70)

### Lines 71-86

make_stable_row_id_manifest builds id:Int32nonnull schema with supplied fragments, V2_0 and empty config; sets reader flags exactly FLAG_STABLE_ROW_IDS, next_row_id1000 and version4. Does not set writer flags here, assign fragment IDs/counts or validate lineage. Comment convention old IDs>=1/new10 is not enforced. (rust/lance-table/src/transaction/test_support.rs:71-86)

### Lines 87-104

update_txn builds Transaction::new at read_version4 with only supplied new_fragments; removed/updated/modified/compacted/preservation fields are empty; mode, inserted-key filter,offsets and tag are None. UUID auto-generates. This fixture does not exercise RewriteRows/RewriteColumns-specific paths by default. (rust/lance-table/src/transaction/test_support.rs:87-104)

### Lines 105-126

created_at_versions/last_updated_at_versions linearly find first matching fragment ID then unwrap metadata and load_sequence and collect every version to Vec. Missing fragment/metadata or decode error panics; Column load unsupported by reviewed metadata method. Both are assertion conveniences, not async preload helpers or bounded streaming. (rust/lance-table/src/transaction/test_support.rs:105-126)

### Lines 127-150

tagged_entry takes ordered (source-slice,destination-slice) transitions. Tracks source physical row counts in HashMap defaulting unseen IDs to4; per transition materializes every source address in RoaringTreemap using (source<<32)|offset and sums rows. Repeated source IDs count repeatedly in total but addresses deduplicate; no uniqueness,u32 source/offset bound, overflow or disjointness checks. Divides total by destination count: empty destinations panic; remainder silently omitted, so exact even split is an assumed fixture precondition. (rust/lance-table/src/transaction/test_support.rs:127-150)

### Lines 151-177

Serializes moved addresses to Vec with unwrap, builds each source digest from rows map with zero deleted rows, then each destination digest stores per_destination rows and updates map for later transitions. Retains input vector order and sets OrderedCompaction mapping. Sources/destinations can overlap and later duplicate destination IDs overwrite map values; no conservation/deletion/ledger validation. (rust/lance-table/src/transaction/test_support.rs:151-177)

### Lines 178-199

Wraps encoded transitions in inline FragmentReuseIndexDetails with empty legacy_versions. Starts sample metadata for FRAG_REUSE_INDEX_NAME, clears fields, sets bitmap to union of every source/destination cast unchecked as u32 (duplicates collapse and high bits truncate), sets Any type_url /lance.table.FragmentReuseIndexDetails and encode_to_vec bytes in Arc, sets index_version1. Other sample values stay, including dataset_version0/randomUUID/time. This is no disk/retry test and has no own test functions. (rust/lance-table/src/transaction/test_support.rs:178-199)

## Interaction and interpretation limits

All199 lines read. Fixture arithmetic limitations are source deductions, not failing production scenarios. Metadata constructors do not prove runtime validity; called tests must explicitly adjust fixture defaults and inspect expected values. Full test consumers/FRI implementation remain pending.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Fixtures shared between the tests of several submodules.
    5 | 
    6 | use crate::feature_flags::FLAG_STABLE_ROW_IDS;
    7 | use crate::format::overlay::{DataOverlayFile, OverlayCoverage};
    8 | use crate::format::{
    9 |     DataFile, DataStorageFormat, Fragment, IndexMetadata, Manifest, ManifestBuildConfig,
   10 | };
   11 | use crate::transaction::{Operation, Transaction};
   12 | use arrow_schema::{DataType, Field as ArrowField, Schema as ArrowSchema};
   13 | use chrono::Utc;
   14 | use lance_core::datatypes::Schema as LanceSchema;
   15 | use lance_file::version::ConcreteFileVersion;
   16 | use std::collections::HashMap;
   17 | use std::sync::Arc;
   18 | use uuid::Uuid;
   19 | 
   20 | /// The build config that `lance`'s `ManifestWriteConfig::default()` resolves to.
   21 | pub fn default_build_config() -> ManifestBuildConfig {
   22 |     ManifestBuildConfig {
   23 |         auto_set_feature_flags: true,
   24 |         timestamp_nanos: std::time::SystemTime::now()
   25 |             .duration_since(std::time::SystemTime::UNIX_EPOCH)
   26 |             .unwrap()
   27 |             .as_nanos(),
   28 |         use_stable_row_ids: false,
   29 |         use_legacy_format: None,
   30 |         storage_format: None,
   31 |         disable_transaction_file: false,
   32 |         migration_next_row_id: None,
   33 |         spilled_row_lineage: Default::default(),
   34 |     }
   35 | }
   36 | 
   37 | pub fn sample_manifest() -> Manifest {
   38 |     let schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
   39 |     Manifest::new(
   40 |         LanceSchema::try_from(&schema).unwrap(),
   41 |         Arc::new(vec![Fragment::new(0)]),
   42 |         DataStorageFormat::new(ConcreteFileVersion::V2_0),
   43 |         HashMap::new(),
   44 |     )
   45 | }
   46 | 
   47 | pub fn sample_index_metadata(name: &str) -> IndexMetadata {
   48 |     IndexMetadata {
   49 |         uuid: Uuid::new_v4(),
   50 |         fields: vec![0],
   51 |         covering_fields: vec![],
   52 |         name: name.to_string(),
   53 |         dataset_version: 0,
   54 |         fragment_bitmap: Some([0].into_iter().collect()),
   55 |         index_details: None,
   56 |         index_version: 1,
   57 |         created_at: Some(Utc::now()),
   58 |         base_id: None,
   59 |         files: None,
   60 |     }
   61 | }
   62 | 
   63 | pub fn overlay_with_field(field: i32, committed_version: u64) -> DataOverlayFile {
   64 |     DataOverlayFile {
   65 |         data_file: DataFile::new_legacy_from_fields("o.lance", vec![field], None),
   66 |         coverage: OverlayCoverage::dense(roaring::RoaringBitmap::from_iter([0u32])),
   67 |         committed_version,
   68 |     }
   69 | }
   70 | 
   71 | /// Existing fragments use id >= 1 to avoid collision with `Fragment::new(0)`
   72 | /// used by `sample_manifest`. New (updated) fragments use id = 10.
   73 | pub fn make_stable_row_id_manifest(fragments: Vec<Fragment>) -> Manifest {
   74 |     let schema = ArrowSchema::new(vec![ArrowField::new("id", DataType::Int32, false)]);
   75 |     let mut manifest = Manifest::new(
   76 |         LanceSchema::try_from(&schema).unwrap(),
   77 |         Arc::new(fragments),
   78 |         DataStorageFormat::new(ConcreteFileVersion::V2_0),
   79 |         HashMap::new(),
   80 |     );
   81 |     manifest.reader_feature_flags = FLAG_STABLE_ROW_IDS;
   82 |     manifest.next_row_id = 1000;
   83 |     manifest.version = 4;
   84 |     manifest
   85 | }
   86 | 
   87 | pub fn update_txn(new_fragments: Vec<Fragment>) -> Transaction {
   88 |     Transaction::new(
   89 |         4,
   90 |         Operation::Update {
   91 |             removed_fragment_ids: vec![],
   92 |             updated_fragments: vec![],
   93 |             new_fragments,
   94 |             fields_modified: vec![],
   95 |             compacted_sstables: vec![],
   96 |             fields_for_preserving_frag_bitmap: vec![],
   97 |             update_mode: None,
   98 |             inserted_rows_filter: None,
   99 |             updated_fragment_offsets: None,
  100 |         },
  101 |         None,
  102 |     )
  103 | }
  104 | 
  105 | pub fn created_at_versions(manifest: &Manifest, frag_id: u64) -> Vec<u64> {
  106 |     let frag = manifest.fragments.iter().find(|f| f.id == frag_id).unwrap();
  107 |     let seq = frag
  108 |         .created_at_version_meta
  109 |         .as_ref()
  110 |         .unwrap()
  111 |         .load_sequence()
  112 |         .unwrap();
  113 |     seq.versions().collect()
  114 | }
  115 | 
  116 | pub fn last_updated_at_versions(manifest: &Manifest, frag_id: u64) -> Vec<u64> {
  117 |     let frag = manifest.fragments.iter().find(|f| f.id == frag_id).unwrap();
  118 |     let seq = frag
  119 |         .last_updated_at_version_meta
  120 |         .as_ref()
  121 |         .unwrap()
  122 |         .load_sequence()
  123 |         .unwrap();
  124 |     seq.versions().collect()
  125 | }
  126 | 
  127 | /// A tagged fragment reuse entry whose inline history records
  128 | /// `transitions` (each `(sources, destinations)`, as ordered compactions
  129 | /// that move every row and delete none; original sources hold 4 rows, a
  130 | /// destination the rows its sources held, split evenly), with the lineage
  131 | /// bitmap the commit path would write: every source and destination.
  132 | pub fn tagged_entry(transitions: &[(&[u64], &[u64])]) -> IndexMetadata {
  133 |     use crate::format::pb::fragment_reuse_index_details::{
  134 |         Content, FragmentDigest, InlineContent, OrderedCompaction, Transition, transition,
  135 |     };
  136 |     use prost::Message;
  137 | 
  138 |     let mut rows: HashMap<u64, u64> = HashMap::new();
  139 |     let mut encoded = Vec::new();
  140 |     for (sources, destinations) in transitions {
  141 |         let mut moved = roaring::RoaringTreemap::new();
  142 |         let mut total = 0u64;
  143 |         for source in sources.iter() {
  144 |             let physical_rows = *rows.entry(*source).or_insert(4);
  145 |             for offset in 0..physical_rows {
  146 |                 moved.insert((*source << 32) | offset);
  147 |             }
  148 |             total += physical_rows;
  149 |         }
  150 |         let per_destination = total / destinations.len() as u64;
  151 |         let mut changed_row_addrs = Vec::new();
  152 |         moved.serialize_into(&mut changed_row_addrs).unwrap();
  153 |         encoded.push(Transition {
  154 |             sources: sources
  155 |                 .iter()
  156 |                 .map(|id| FragmentDigest {
  157 |                     id: *id,
  158 |                     physical_rows: rows[id],
  159 |                     num_deleted_rows: 0,
  160 |                 })
  161 |                 .collect(),
  162 |             destinations: destinations
  163 |                 .iter()
  164 |                 .map(|id| {
  165 |                     rows.insert(*id, per_destination);
  166 |                     FragmentDigest {
  167 |                         id: *id,
  168 |                         physical_rows: per_destination,
  169 |                         num_deleted_rows: 0,
  170 |                     }
  171 |                 })
  172 |                 .collect(),
  173 |             mapping: Some(transition::Mapping::OrderedCompaction(OrderedCompaction {
  174 |                 changed_row_addrs,
  175 |             })),
  176 |         });
  177 |     }
  178 |     let details = crate::format::pb::FragmentReuseIndexDetails {
  179 |         content: Some(Content::Inline(InlineContent {
  180 |             legacy_versions: vec![],
  181 |             transitions: encoded,
  182 |         })),
  183 |     };
  184 |     let mut entry = sample_index_metadata(crate::system_index::frag_reuse::FRAG_REUSE_INDEX_NAME);
  185 |     entry.fields.clear();
  186 |     entry.fragment_bitmap = Some(
  187 |         transitions
  188 |             .iter()
  189 |             .flat_map(|(sources, destinations)| sources.iter().chain(destinations.iter()))
  190 |             .map(|id| *id as u32)
  191 |             .collect(),
  192 |     );
  193 |     entry.index_details = Some(Arc::new(prost_types::Any {
  194 |         type_url: "/lance.table.FragmentReuseIndexDetails".into(),
  195 |         value: details.encode_to_vec(),
  196 |     }));
  197 |     entry.index_version = 1;
  198 |     entry
  199 | }
``````
