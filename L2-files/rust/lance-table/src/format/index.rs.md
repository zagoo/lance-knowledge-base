> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-07: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-07-84d1681e.md) at `84d1681e07af565837f2d97e72ff1b8b040cd15c` supersede affected historical statements; body remains frozen. Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/index.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `9fcc1501e0558a517743b2e269acc3540deffb0e6e5f660d40cdcd5944cbaace`. Reviewed physical lines: 1-707.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Index identity, dependency and coverage metadata, protobuf validation, index-list cache codec and file-size discovery. (rust/lance-table/src/format/index.rs:1-707)

## Complete range analysis

### Lines 1-20

SPDX, module purpose and imports: HashMap/HashSet/Arc, chrono, StreamExt, DeepSizeOf, object-store abstractions, RoaringBitmap, Uuid, protobuf and cache entry IO. These are metadata operations; implementations of index algorithms and store listing live elsewhere. (rust/lance-table/src/format/index.rs:1-20)

### Lines 21-29

IndexFile derives Debug/Clone/PartialEq/DeepSizeOf and exposes path:String relative to an index directory and size_bytes:u64. The type itself enforces neither relative-path syntax nor size correctness. (rust/lance-table/src/format/index.rs:21-29)

### Lines 30-68

IndexMetadata derives Debug/Clone/PartialEq. Public uuid identifies the index, fields lists dependency IDs, covering_fields is documented as a proper suffix carried but not searched, name is human readable, dataset_version records the training/update snapshot and fragment_bitmap is optional coverage that may include deleted fragments. None means unknown, not empty. The documented fields[0] convention has a system-index empty-list exception implemented below. (rust/lance-table/src/format/index.rs:30-68)

### Lines 69-95

Remaining public fields: optional Arc<prost_types::Any> details, i32 index_version, optional UTC created_at, optional external-base u32 ID and optional Vec<IndexFile>. Details/time/files are optional for older metadata; newer-details presence is a comment, not validated here. File-size metadata is intended to avoid HEAD calls and serve describe output; actual consuming IO is outside this file. (rust/lance-table/src/format/index.rs:69-95)

### Lines 96-118

effective_fragment_bitmap returns None for unknown coverage, otherwise allocates intersection with supplied existing fragments. file_size_map clones paths into a HashMap, with later duplicate paths overwriting earlier sizes; None and Some(empty) both yield empty maps. No store lookup or metadata mutation. (rust/lance-table/src/format/index.rs:96-118)

### Lines 119-136

total_size_bytes returns None only for absent files and sums every recorded u64 size, including duplicate paths, with ordinary unchecked arithmetic; Some(empty) is Some(0). deleted_fragment_bitmap returns stored-minus-existing or None if unknown, allocating the result. (rust/lance-table/src/format/index.rs:119-136)

### Lines 137-155

results_are_row_addrs is a type-URL heuristic only. ZoneMapIndexDetails and BloomFilterIndexDetails use case-sensitive ends_with on the entire URL without namespace validation. FM requires a slash, then compares its final component case-insensitively with the full lance.index.pb.FMIndexDetails name. Missing details or other types return false. It never decodes Any bytes, checks index version or calls ScalarIndex; comments about rewrite/remap are design intent, not implemented here. (rust/lance-table/src/format/index.rs:137-155)

### Lines 156-180

keyed_fields slices the prefix of fields using len.saturating_sub(covering_fields.len); overlong or all-covering lists yield an empty prefix. It does not check actual suffix content. keyed_field returns Some(id) only for exactly one prefix entry; empty and composite prefixes return None. Directly constructed malformed metadata can bypass decode validation. (rust/lance-table/src/format/index.rs:156-180)

### Lines 181-211

validate_covering_fields returns Ok immediately for empty covering_fields, including empty fields. Otherwise first collects all covering IDs absent from fields and returns InvalidInput including index name, missing IDs and both lists. Membership uses repeated linear contains: O(covering_count*field_count); schema existence, negative IDs and index-kind capabilities are not checked. Error precedence favors missing IDs. (rust/lance-table/src/format/index.rs:181-211)

### Lines 212-244

Validation next finds first duplicate covering ID with a HashSet; then rejects covering length >= fields length; finally requires exact ordered suffix equality. Errors carry name and relevant values, and success returns Ok. Duplicate IDs elsewhere in fields are not rejected; for example fields=[7,7], covering=[7] passes. No whole-schema or at-most-one-key rule is enforced. (rust/lance-table/src/format/index.rs:212-244)

### Lines 245-260

Custom DeepSizeOf sums UUID byte children, fields/covering/name/dataset-version children, optional bitmap serialized_size and files children. It omits heap held by index_details Any and uses serialized bitmap size as an estimate rather than measured allocation. Inline fields are covered by the trait outer size; this function alone is not total retained memory. (rust/lance-table/src/format/index.rs:245-260)

### Lines 261-287

TryFrom protobuf first maps zero-length bitmap bytes to None, otherwise deserializes Roaring and propagates its IO error through core Error. A valid encoded empty bitmap remains Some(empty). Empty repeated files becomes None; nonempty entries move path/size into IndexFile without validation. (rust/lance-table/src/format/index.rs:261-287)

### Lines 288-318

Decoder requires UUID presence and delegates its byte-length validation, moves metadata fields, wraps Any in Arc, defaults absent index_version to0 and maps timestamp u64 as i64 milliseconds. Chrono rejection triggers expect panic, not Result error. After construction, validate_covering_fields runs and propagates InvalidInput. No feature-word, Any payload, file path/size, fragment-ID or creation-time range validation beyond that occurs. (rust/lance-table/src/format/index.rs:288-318)

### Lines 319-337

Protobuf encoder clones the optional bitmap, optimizes run containers and serializes into Vec, preserving original bitmap. Unexpected serialization error logs then clears bytes, which future decoding interprets as unknown coverage. Conversion has no Result. Contiguous-ID compression motivation in comments is not a universal bound or measured performance result. (rust/lance-table/src/format/index.rs:319-337)

### Lines 338-370

Encoding clones file records (None and Some(empty) both become empty repeated field), UUID/name/fields/covering/details, always emits Some(index_version), casts signed timestamp milliseconds to u64, and preserves base ID. It does not call covering validation. Any contents are cloned out of Arc; negative timestamps wrap at the cast. (rust/lance-table/src/format/index.rs:338-370)

### Lines 371-384

Cache codec documentation describes pb::IndexSection wrapping repeated metadata and orphan-rule reason for callback construction. ArcAny is a private Arc<dyn Any+Send+Sync> alias. Type ID is exactly lance.table.IndexMetadataList; body version constant is1. Cache envelope framing belongs to core, not this protobuf section. (rust/lance-table/src/format/index.rs:371-384)

### Lines 385-397

serialize_index_metadata downcasts ArcAny to Vec<IndexMetadata> with expect (wrong type panics), converts all elements into pb::IndexSection and calls writer.write_header, propagating that Result. Allocates the protobuf list and cloned payloads; no streaming index-by-index persistence. (rust/lance-table/src/format/index.rs:385-397)

### Lines 398-416

deserialize_index_metadata reads one pb::IndexSection header, converts all elements with IndexMetadata::try_from, aborts on first error, then returns Arc<Vec<_>> erased as ArcAny. It neither branches on reader.version nor checks trailing data. index_metadata_codec constructs CacheCodec from exact type ID, version1 and these callbacks; core handles envelope version/type failures separately. Timestamp conversion panics are not converted to local errors. (rust/lance-table/src/format/index.rs:398-416)

### Lines 417-443

Async list_index_files_with_sizes consumes ObjectStore::read_dir_all(index_dir,None) in stream order into Vec. First listing error aborts and discards accumulated output. Relative paths use string strip_prefix and trim all leading slashes, falling back to filename or empty string; no path-component-boundary check occurs locally. Size is metadata.size. No explicit HEAD, sort, deduplication or filtering; memory grows with all paths. Actual store traversal semantics and callers remain pending. (rust/lance-table/src/format/index.rs:417-443)

### Lines 444-481

cfg(test) module and run-optimization fixture: coverage0..1_000_000, encode, assert serialized bytes <1% of unoptimized size, decode and assert bitmap equality. This is source-level test intent, not an executed benchmark or compression guarantee for arbitrary IDs. (rust/lance-table/src/format/index.rs:444-481)

### Lines 482-553

Codec roundtrip fixture creates two metadata records with distinct optional bitmap/base/files values, uses HashMap<String,Vec<u8>> as simulated disk and asserts decoded UUID/name/fields/dataset_version/bitmap/index_version/base/files. It is not real disk-cache IO and does not assert every field (covering/details/time are omitted from its equality checks). (rust/lance-table/src/format/index.rs:482-553)

### Lines 554-579

Covering-field protobuf roundtrip fixture uses fields[7,11,13], covering[11,13], asserts wire covering list, then full metadata equality after decode. It establishes this valid suffix case, not all validation cases. (rust/lance-table/src/format/index.rs:554-579)

### Lines 580-604

Malformed covering protobuf fixture replaces valid covering[11] with prefix[7], expects InvalidInput and message must come last. It tests validation at decode rather than only the direct validator. (rust/lance-table/src/format/index.rs:580-604)

### Lines 605-628

Seven rstest keyed-prefix cases cover ordinary single key, one/two carried columns, composite with/without covering, empty system metadata and overlong invalid covering. Test asserts exact prefix and singleton helper using the shared metadata constructor. It does not validate malformed non-suffix data before prefix slicing. (rust/lance-table/src/format/index.rs:605-628)

### Lines 629-644

Test helper index_metadata_with constructs uuid/name/version and supplied fields/covering, with no bitmap/details/time/base/files. Defaults are fixture choices, not a production Default implementation. (rust/lance-table/src/format/index.rs:629-644)

### Lines 645-661

Six rstest type-URL cases assert row-address classification for ZoneMap, Bloom, FM, case-insensitive FM, foreign FM namespace false and BTree false. It builds opaque Any with empty bytes; no actual index is loaded. Missing details/no-slash FM/foreign ZoneMap suffix are not covered here. (rust/lance-table/src/format/index.rs:645-661)

### Lines 662-707

Eleven rstest validation cases cover empty/system lists, valid suffixes, non-suffix and wrong order, missing IDs, all fields carried, duplicate covering and error precedence. Success asserts Ok; failures match InvalidInput and message fragment. All tests were read, not executed; invalid timestamp/cache downcast panic, file listing and memory-estimate behavior have no direct fixture here. (rust/lance-table/src/format/index.rs:662-707)

## Interaction and interpretation limits

Every707 lines read; public index types/functions are reexported by format facade though defining module is private. Consumers, index algorithms, manifest index IO and release compatibility remain incomplete. No source/build/test/benchmark mutation or execution.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Metadata for index
    5 | 
    6 | use std::collections::{HashMap, HashSet};
    7 | use std::sync::Arc;
    8 | 
    9 | use chrono::{DateTime, Utc};
   10 | use futures::StreamExt;
   11 | use lance_core::deepsize::DeepSizeOf;
   12 | use lance_io::object_store::ObjectStore;
   13 | use object_store::path::Path;
   14 | use roaring::RoaringBitmap;
   15 | use uuid::Uuid;
   16 | 
   17 | use super::pb;
   18 | use lance_core::cache::{CacheEntryReader, CacheEntryWriter};
   19 | use lance_core::{Error, Result};
   20 | 
   21 | /// Metadata about a single file within an index segment.
   22 | #[derive(Debug, Clone, PartialEq, DeepSizeOf)]
   23 | pub struct IndexFile {
   24 |     /// Path relative to the index directory (e.g., "index.idx", "auxiliary.idx")
   25 |     pub path: String,
   26 |     /// Size of the file in bytes
   27 |     pub size_bytes: u64,
   28 | }
   29 | 
   30 | /// Index metadata
   31 | #[derive(Debug, Clone, PartialEq)]
   32 | pub struct IndexMetadata {
   33 |     /// Unique ID across all dataset versions.
   34 |     pub uuid: Uuid,
   35 | 
   36 |     /// Fields to build the index.
   37 |     ///
   38 |     /// `fields[0]` is always a column the index is keyed on. Trailing entries
   39 |     /// may instead be merely carried, not keyed on -- see [`Self::covering_fields`].
   40 |     pub fields: Vec<i32>,
   41 | 
   42 |     /// Fields whose values this index carries but is not keyed on.
   43 |     ///
   44 |     /// Always a suffix of [`Self::fields`], and never all of it, so
   45 |     /// `fields[0]` is always a column the index is keyed on. Empty for an
   46 |     /// index that carries no extra columns.
   47 |     ///
   48 |     /// These ids also appear in [`Self::fields`]. That is deliberate: every
   49 |     /// consumer that reads `fields` as the index's dependency set then covers
   50 |     /// them with no change.
   51 |     pub covering_fields: Vec<i32>,
   52 | 
   53 |     /// Human readable index name
   54 |     pub name: String,
   55 | 
   56 |     /// The version of the dataset this index was last updated on
   57 |     ///
   58 |     /// This is set when the index is created (based on the version used to train the index)
   59 |     /// This is updated when the index is updated or remapped
   60 |     pub dataset_version: u64,
   61 | 
   62 |     /// The fragment ids this index covers.
   63 |     ///
   64 |     /// This may contain fragment ids that no longer exist in the dataset.
   65 |     ///
   66 |     /// If this is None, then this is unknown.
   67 |     pub fragment_bitmap: Option<RoaringBitmap>,
   68 | 
   69 |     /// Metadata specific to the index type
   70 |     ///
   71 |     /// This is an Option because older versions of Lance may not have this defined.  However, it should always
   72 |     /// be present in newer versions.
   73 |     pub index_details: Option<Arc<prost_types::Any>>,
   74 | 
   75 |     /// The index version.
   76 |     pub index_version: i32,
   77 | 
   78 |     /// Timestamp when the index was created
   79 |     ///
   80 |     /// This field is optional for backward compatibility. For existing indices created before
   81 |     /// this field was added, this will be None.
   82 |     pub created_at: Option<DateTime<Utc>>,
   83 | 
   84 |     /// The base path index of the index files. Used when the index is imported or referred from another dataset.
   85 |     /// Lance uses it as key of the base_paths field in Manifest to determine the actual base path of the index files.
   86 |     pub base_id: Option<u32>,
   87 | 
   88 |     /// List of files and their sizes for this index segment.
   89 |     /// This enables skipping HEAD calls when opening indices and provides
   90 |     /// visibility into index storage size via describe_indices().
   91 |     /// This is None if the file sizes are unknown. This happens for indices created
   92 |     /// before this field was added.
   93 |     pub files: Option<Vec<IndexFile>>,
   94 | }
   95 | 
   96 | impl IndexMetadata {
   97 |     pub fn effective_fragment_bitmap(
   98 |         &self,
   99 |         existing_fragments: &RoaringBitmap,
  100 |     ) -> Option<RoaringBitmap> {
  101 |         let fragment_bitmap = self.fragment_bitmap.as_ref()?;
  102 |         Some(fragment_bitmap & existing_fragments)
  103 |     }
  104 | 
  105 |     /// Returns a map of relative file paths to their sizes.
  106 |     /// Returns an empty map if file information is not available.
  107 |     pub fn file_size_map(&self) -> HashMap<String, u64> {
  108 |         self.files
  109 |             .as_ref()
  110 |             .map(|files| {
  111 |                 files
  112 |                     .iter()
  113 |                     .map(|f| (f.path.clone(), f.size_bytes))
  114 |                     .collect()
  115 |             })
  116 |             .unwrap_or_default()
  117 |     }
  118 | 
  119 |     /// Returns the total size of all files in this index segment in bytes.
  120 |     /// Returns None if file information is not available.
  121 |     pub fn total_size_bytes(&self) -> Option<u64> {
  122 |         self.files
  123 |             .as_ref()
  124 |             .map(|files| files.iter().map(|f| f.size_bytes).sum())
  125 |     }
  126 | 
  127 |     /// Returns the set of fragments which are part of the fragment bitmap
  128 |     /// but no longer in the dataset.
  129 |     pub fn deleted_fragment_bitmap(
  130 |         &self,
  131 |         existing_fragments: &RoaringBitmap,
  132 |     ) -> Option<RoaringBitmap> {
  133 |         let fragment_bitmap = self.fragment_bitmap.as_ref()?;
  134 |         Some(fragment_bitmap - existing_fragments)
  135 |     }
  136 | 
  137 |     /// True when the index reports matches as physical row addresses rather than row ids
  138 |     /// (`ScalarIndex::results_are_row_addresses`).
  139 |     ///
  140 |     /// Such an index cannot follow its data through a rewrite: the addresses it stores
  141 |     /// name fragments and offsets, and neither kind supports remap.
  142 |     pub fn results_are_row_addrs(&self) -> bool {
  143 |         self.index_details.as_ref().is_some_and(|details| {
  144 |             let is_fm = details
  145 |                 .type_url
  146 |                 .rsplit_once('/')
  147 |                 .is_some_and(|(_, details_type_name)| {
  148 |                     details_type_name.eq_ignore_ascii_case("lance.index.pb.FMIndexDetails")
  149 |                 });
  150 |             details.type_url.ends_with("ZoneMapIndexDetails")
  151 |                 || details.type_url.ends_with("BloomFilterIndexDetails")
  152 |                 || is_fm
  153 |         })
  154 |     }
  155 | 
  156 |     /// The prefix of [`Self::fields`] this index is keyed on, with the carried
  157 |     /// columns of [`Self::covering_fields`] removed.
  158 |     ///
  159 |     /// Only this prefix decides which column an index answers for; the full
  160 |     /// `fields` vector answers what invalidates it. Empty for a system index
  161 |     /// that declares no fields, and empty for a declaration longer than
  162 |     /// `fields`: decoding validates, but metadata built by a caller this build
  163 |     /// never validated does not, and failing closed beats an underflow.
  164 |     pub fn keyed_fields(&self) -> &[i32] {
  165 |         let keyed = self.fields.len().saturating_sub(self.covering_fields.len());
  166 |         &self.fields[..keyed]
  167 |     }
  168 | 
  169 |     /// The single column this index is keyed on, or `None` when it is keyed on
  170 |     /// several -- a genuinely composite index -- or on none at all.
  171 |     ///
  172 |     /// Most selection paths are only defined for one keyed column, so they can
  173 |     /// compare this against the column they are resolving.
  174 |     pub fn keyed_field(&self) -> Option<i32> {
  175 |         match self.keyed_fields() {
  176 |             [only] => Some(*only),
  177 |             _ => None,
  178 |         }
  179 |     }
  180 | 
  181 |     /// Check the covering declaration against [`Self::fields`].
  182 |     ///
  183 |     /// Carried columns must be a suffix of `fields` and must not consume all of
  184 |     /// it, so `fields[0]` is always a column the index is keyed on. An empty
  185 |     /// declaration is always valid, which is what keeps the system indices --
  186 |     /// `mem_wal` and `frag_reuse`, both of which commit no fields at all --
  187 |     /// passing this check.
  188 |     ///
  189 |     /// The rules are checked from most to least specific, because one bad
  190 |     /// declaration usually trips several: an id that is not a field at all is
  191 |     /// reported ahead of the length and ordering rules, which would otherwise
  192 |     /// name a consequence instead of the cause.
  193 |     pub fn validate_covering_fields(&self) -> Result<()> {
  194 |         if self.covering_fields.is_empty() {
  195 |             return Ok(());
  196 |         }
  197 | 
  198 |         let missing: Vec<i32> = self
  199 |             .covering_fields
  200 |             .iter()
  201 |             .copied()
  202 |             .filter(|f| !self.fields.contains(f))
  203 |             .collect();
  204 |         if !missing.is_empty() {
  205 |             return Err(Error::invalid_input(format!(
  206 |                 "index '{}' declares covering fields {:?} but {:?} are not \
  207 |                  among its fields {:?}",
  208 |                 self.name, self.covering_fields, missing, self.fields,
  209 |             )));
  210 |         }
  211 | 
  212 |         // A column carried twice would be projected twice. The suffix check
  213 |         // below cannot stand in for this, because `fields` may repeat the id in
  214 |         // the same positions -- `fields = [7, 11, 11]` has `[11, 11]` as a
  215 |         // genuine tail.
  216 |         let mut seen = HashSet::with_capacity(self.covering_fields.len());
  217 |         if let Some(duplicate) = self.covering_fields.iter().find(|f| !seen.insert(**f)) {
  218 |             return Err(Error::invalid_input(format!(
  219 |                 "index '{}' declares covering field {} more than once in {:?}",
  220 |                 self.name, duplicate, self.covering_fields,
  221 |             )));
  222 |         }
  223 | 
  224 |         if self.covering_fields.len() >= self.fields.len() {
  225 |             return Err(Error::invalid_input(format!(
  226 |                 "index '{}' declares covering fields {:?} but its fields are {:?}; \
  227 |                  at least one field must remain indexed",
  228 |                 self.name, self.covering_fields, self.fields,
  229 |             )));
  230 |         }
  231 | 
  232 |         let suffix_start = self.fields.len() - self.covering_fields.len();
  233 |         if self.fields[suffix_start..] != self.covering_fields[..] {
  234 |             return Err(Error::invalid_input(format!(
  235 |                 "index '{}' declares covering fields {:?} which are not the trailing \
  236 |                  entries of {:?}; covering fields must come last",
  237 |                 self.name, self.covering_fields, self.fields,
  238 |             )));
  239 |         }
  240 | 
  241 |         Ok(())
  242 |     }
  243 | }
  244 | 
  245 | impl DeepSizeOf for IndexMetadata {
  246 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  247 |         self.uuid.as_bytes().deep_size_of_children(context)
  248 |             + self.fields.deep_size_of_children(context)
  249 |             + self.covering_fields.deep_size_of_children(context)
  250 |             + self.name.deep_size_of_children(context)
  251 |             + self.dataset_version.deep_size_of_children(context)
  252 |             + self
  253 |                 .fragment_bitmap
  254 |                 .as_ref()
  255 |                 .map(|fragment_bitmap| fragment_bitmap.serialized_size())
  256 |                 .unwrap_or(0)
  257 |             + self.files.deep_size_of_children(context)
  258 |     }
  259 | }
  260 | 
  261 | impl TryFrom<pb::IndexMetadata> for IndexMetadata {
  262 |     type Error = Error;
  263 | 
  264 |     fn try_from(proto: pb::IndexMetadata) -> Result<Self> {
  265 |         let fragment_bitmap = if proto.fragment_bitmap.is_empty() {
  266 |             None
  267 |         } else {
  268 |             Some(RoaringBitmap::deserialize_from(
  269 |                 &mut proto.fragment_bitmap.as_slice(),
  270 |             )?)
  271 |         };
  272 | 
  273 |         let files = if proto.files.is_empty() {
  274 |             None
  275 |         } else {
  276 |             Some(
  277 |                 proto
  278 |                     .files
  279 |                     .into_iter()
  280 |                     .map(|f| IndexFile {
  281 |                         path: f.path,
  282 |                         size_bytes: f.size_bytes,
  283 |                     })
  284 |                     .collect(),
  285 |             )
  286 |         };
  287 | 
  288 |         let metadata = Self {
  289 |             uuid: proto.uuid.as_ref().map(Uuid::try_from).ok_or_else(|| {
  290 |                 Error::invalid_input("uuid field does not exist in Index metadata".to_string())
  291 |             })??,
  292 |             name: proto.name,
  293 |             fields: proto.fields,
  294 |             covering_fields: proto.covering_fields,
  295 |             dataset_version: proto.dataset_version,
  296 |             fragment_bitmap,
  297 |             index_details: proto.index_details.map(Arc::new),
  298 |             index_version: proto.index_version.unwrap_or_default(),
  299 |             created_at: proto.created_at.map(|ts| {
  300 |                 DateTime::from_timestamp_millis(ts as i64)
  301 |                     .expect("Invalid timestamp in index metadata")
  302 |             }),
  303 |             base_id: proto.base_id,
  304 |             files,
  305 |         };
  306 | 
  307 |         // This is the single boundary between manifest bytes and
  308 |         // `IndexMetadata`, so validating once here is what lets every reader
  309 |         // treat the declaration as a trailing slice of `fields`. A manifest
  310 |         // that fails this was written by something that did not follow the
  311 |         // format contract; refuse it rather than let each use site quietly
  312 |         // ignore the index.
  313 |         metadata.validate_covering_fields()?;
  314 | 
  315 |         Ok(metadata)
  316 |     }
  317 | }
  318 | 
  319 | impl From<&IndexMetadata> for pb::IndexMetadata {
  320 |     fn from(idx: &IndexMetadata) -> Self {
  321 |         let mut fragment_bitmap = Vec::new();
  322 |         if let Some(bitmap) = &idx.fragment_bitmap {
  323 |             // Fragment ids are allocated monotonically, so index coverage is
  324 |             // highly contiguous. Run containers are part of the standard
  325 |             // roaring serialization format, so converting eligible containers
  326 |             // to runs before writing shrinks the bitmap from O(fragments) to
  327 |             // O(runs) bytes.
  328 |             let mut bitmap = bitmap.clone();
  329 |             bitmap.optimize();
  330 |             if let Err(e) = bitmap.serialize_into(&mut fragment_bitmap) {
  331 |                 // In theory, this should never error. But if we do, just
  332 |                 // recover gracefully.
  333 |                 log::error!("Failed to serialize fragment bitmap: {}", e);
  334 |                 fragment_bitmap.clear();
  335 |             }
  336 |         }
  337 | 
  338 |         let files = idx
  339 |             .files
  340 |             .as_ref()
  341 |             .map(|files| {
  342 |                 files
  343 |                     .iter()
  344 |                     .map(|f| pb::IndexFile {
  345 |                         path: f.path.clone(),
  346 |                         size_bytes: f.size_bytes,
  347 |                     })
  348 |                     .collect()
  349 |             })
  350 |             .unwrap_or_default();
  351 | 
  352 |         Self {
  353 |             uuid: Some((&idx.uuid).into()),
  354 |             name: idx.name.clone(),
  355 |             fields: idx.fields.clone(),
  356 |             covering_fields: idx.covering_fields.clone(),
  357 |             dataset_version: idx.dataset_version,
  358 |             fragment_bitmap,
  359 |             index_details: idx
  360 |                 .index_details
  361 |                 .as_ref()
  362 |                 .map(|details| details.as_ref().clone()),
  363 |             index_version: Some(idx.index_version),
  364 |             created_at: idx.created_at.map(|dt| dt.timestamp_millis() as u64),
  365 |             base_id: idx.base_id,
  366 |             files,
  367 |         }
  368 |     }
  369 | }
  370 | 
  371 | /// Returns a [`CacheCodec`](lance_core::cache::CacheCodec) for `Vec<IndexMetadata>`.
  372 | ///
  373 | /// Uses `pb::IndexSection` (which wraps `repeated IndexMetadata`) as the wire
  374 | /// format, reusing the existing `TryFrom`/`From` conversions.
  375 | ///
  376 | /// Uses [`CacheCodec::new`](lance_core::cache::CacheCodec::new) because the
  377 | /// orphan rule prevents `impl CacheCodecImpl for Vec<IndexMetadata>`.
  378 | type ArcAny = Arc<dyn std::any::Any + Send + Sync>;
  379 | 
  380 | /// Stable type identifier for the `Vec<IndexMetadata>` cache entry.
  381 | const INDEX_METADATA_TYPE_ID: &str = "lance.table.IndexMetadataList";
  382 | /// Body schema version written by this build.
  383 | const INDEX_METADATA_VERSION: u32 = 1;
  384 | 
  385 | fn serialize_index_metadata(
  386 |     any: &ArcAny,
  387 |     writer: &mut CacheEntryWriter<'_>,
  388 | ) -> lance_core::Result<()> {
  389 |     let vec = any
  390 |         .downcast_ref::<Vec<IndexMetadata>>()
  391 |         .expect("index_metadata_codec: wrong type (this is a bug in the cache layer)");
  392 |     let section = pb::IndexSection {
  393 |         indices: vec.iter().map(pb::IndexMetadata::from).collect(),
  394 |     };
  395 |     writer.write_header(&section)
  396 | }
  397 | 
  398 | fn deserialize_index_metadata(reader: &mut CacheEntryReader<'_>) -> lance_core::Result<ArcAny> {
  399 |     let section: pb::IndexSection = reader.read_header()?;
  400 |     let indices: Vec<IndexMetadata> = section
  401 |         .indices
  402 |         .into_iter()
  403 |         .map(IndexMetadata::try_from)
  404 |         .collect::<lance_core::Result<_>>()?;
  405 |     Ok(Arc::new(indices))
  406 | }
  407 | 
  408 | pub fn index_metadata_codec() -> lance_core::cache::CacheCodec {
  409 |     lance_core::cache::CacheCodec::new(
  410 |         INDEX_METADATA_TYPE_ID,
  411 |         INDEX_METADATA_VERSION,
  412 |         serialize_index_metadata,
  413 |         deserialize_index_metadata,
  414 |     )
  415 | }
  416 | 
  417 | /// List all files in an index directory with their sizes.
  418 | ///
  419 | /// Returns a list of `IndexFile` structs containing relative paths and sizes.
  420 | /// This is used to capture file metadata after index creation/modification.
  421 | pub async fn list_index_files_with_sizes(
  422 |     object_store: &ObjectStore,
  423 |     index_dir: &Path,
  424 | ) -> Result<Vec<IndexFile>> {
  425 |     let mut files = Vec::new();
  426 |     let mut stream = object_store.read_dir_all(index_dir, None);
  427 |     while let Some(meta) = stream.next().await {
  428 |         let meta = meta?;
  429 |         // Get relative path by stripping the index_dir prefix
  430 |         let relative_path = meta
  431 |             .location
  432 |             .as_ref()
  433 |             .strip_prefix(index_dir.as_ref())
  434 |             .map(|s| s.trim_start_matches('/').to_string())
  435 |             .unwrap_or_else(|| meta.location.filename().unwrap_or("").to_string());
  436 |         files.push(IndexFile {
  437 |             path: relative_path,
  438 |             size_bytes: meta.size,
  439 |         });
  440 |     }
  441 |     Ok(files)
  442 | }
  443 | 
  444 | #[cfg(test)]
  445 | mod tests {
  446 |     use super::*;
  447 |     use rstest::rstest;
  448 |     use std::collections::HashMap;
  449 | 
  450 |     #[test]
  451 |     fn test_fragment_bitmap_serialized_run_optimized() {
  452 |         let bitmap = RoaringBitmap::from_sorted_iter(0..1_000_000).unwrap();
  453 |         let unoptimized_size = bitmap.serialized_size();
  454 | 
  455 |         let metadata = IndexMetadata {
  456 |             uuid: Uuid::new_v4(),
  457 |             name: "my_index".to_string(),
  458 |             fields: vec![0],
  459 |             covering_fields: vec![],
  460 |             dataset_version: 1,
  461 |             fragment_bitmap: Some(bitmap.clone()),
  462 |             index_details: None,
  463 |             index_version: 1,
  464 |             created_at: None,
  465 |             base_id: None,
  466 |             files: None,
  467 |         };
  468 | 
  469 |         let proto = pb::IndexMetadata::from(&metadata);
  470 |         assert!(
  471 |             proto.fragment_bitmap.len() < unoptimized_size / 100,
  472 |             "expected run-optimized bitmap ({} bytes) to be <1% of the \
  473 |              unoptimized serialization ({} bytes)",
  474 |             proto.fragment_bitmap.len(),
  475 |             unoptimized_size
  476 |         );
  477 | 
  478 |         let recovered = IndexMetadata::try_from(proto).unwrap();
  479 |         assert_eq!(recovered.fragment_bitmap, Some(bitmap));
  480 |     }
  481 | 
  482 |     /// Demonstrates the pattern a disk-backed cache backend would use:
  483 |     /// serialize entries to bytes, store in a key-value map, then
  484 |     /// deserialize on retrieval.
  485 |     #[test]
  486 |     fn test_index_metadata_codec_roundtrip() {
  487 |         let codec = index_metadata_codec();
  488 | 
  489 |         let original = vec![
  490 |             IndexMetadata {
  491 |                 uuid: Uuid::new_v4(),
  492 |                 name: "my_index".to_string(),
  493 |                 fields: vec![0, 1],
  494 |                 covering_fields: vec![],
  495 |                 dataset_version: 42,
  496 |                 fragment_bitmap: Some(RoaringBitmap::from_iter([1, 2, 3])),
  497 |                 index_details: None,
  498 |                 index_version: 1,
  499 |                 created_at: None,
  500 |                 base_id: None,
  501 |                 files: Some(vec![IndexFile {
  502 |                     path: "index.idx".to_string(),
  503 |                     size_bytes: 1024,
  504 |                 }]),
  505 |             },
  506 |             IndexMetadata {
  507 |                 uuid: Uuid::new_v4(),
  508 |                 name: "second_index".to_string(),
  509 |                 fields: vec![2],
  510 |                 covering_fields: vec![],
  511 |                 dataset_version: 43,
  512 |                 fragment_bitmap: None,
  513 |                 index_details: None,
  514 |                 index_version: 2,
  515 |                 created_at: None,
  516 |                 base_id: Some(7),
  517 |                 files: None,
  518 |             },
  519 |         ];
  520 | 
  521 |         // Simulate a disk-backed store: HashMap<String, Vec<u8>>
  522 |         let mut store: HashMap<String, Vec<u8>> = HashMap::new();
  523 | 
  524 |         // Serialize into the store
  525 |         let key = "dataset/v42/Vec<IndexMetadata>".to_string();
  526 |         let mut buf = Vec::new();
  527 |         let entry: Arc<dyn std::any::Any + Send + Sync> = Arc::new(original.clone());
  528 |         codec.serialize(&entry, &mut buf).unwrap();
  529 |         store.insert(key.clone(), buf);
  530 | 
  531 |         // Deserialize from the store
  532 |         let bytes = store.get(&key).unwrap();
  533 |         let recovered = codec
  534 |             .deserialize(&bytes::Bytes::copy_from_slice(bytes))
  535 |             .hit()
  536 |             .expect("entry should decode as a hit");
  537 |         let recovered = recovered
  538 |             .downcast::<Vec<IndexMetadata>>()
  539 |             .expect("downcast should succeed");
  540 | 
  541 |         assert_eq!(original.len(), recovered.len());
  542 |         for (orig, rec) in original.iter().zip(recovered.iter()) {
  543 |             assert_eq!(orig.uuid, rec.uuid);
  544 |             assert_eq!(orig.name, rec.name);
  545 |             assert_eq!(orig.fields, rec.fields);
  546 |             assert_eq!(orig.dataset_version, rec.dataset_version);
  547 |             assert_eq!(orig.fragment_bitmap, rec.fragment_bitmap);
  548 |             assert_eq!(orig.index_version, rec.index_version);
  549 |             assert_eq!(orig.base_id, rec.base_id);
  550 |             assert_eq!(orig.files, rec.files);
  551 |         }
  552 |     }
  553 | 
  554 |     /// The covering declaration must survive both conversion directions.
  555 |     /// A dropped `covering_fields` would leave index files holding carried
  556 |     /// columns the manifest no longer names.
  557 |     #[test]
  558 |     fn test_covering_fields_survives_proto_roundtrip() {
  559 |         let original = IndexMetadata {
  560 |             uuid: Uuid::new_v4(),
  561 |             name: "covered".to_string(),
  562 |             fields: vec![7, 11, 13],
  563 |             covering_fields: vec![11, 13],
  564 |             dataset_version: 1,
  565 |             fragment_bitmap: None,
  566 |             index_details: None,
  567 |             index_version: 0,
  568 |             created_at: None,
  569 |             base_id: None,
  570 |             files: None,
  571 |         };
  572 | 
  573 |         let proto = pb::IndexMetadata::from(&original);
  574 |         assert_eq!(proto.covering_fields, vec![11, 13]);
  575 | 
  576 |         let recovered = IndexMetadata::try_from(proto).unwrap();
  577 |         assert_eq!(recovered, original);
  578 |     }
  579 | 
  580 |     /// `TryFrom<pb::IndexMetadata>` is the only path from manifest bytes to
  581 |     /// `IndexMetadata`, so validating here is what lets every reader downstream
  582 |     /// assume the declaration really is a trailing slice of `fields`. Without
  583 |     /// it, a malformed declaration reaches each use site instead, where the
  584 |     /// keyed count saturates to zero and the index is silently ignored.
  585 |     #[test]
  586 |     fn test_try_from_proto_rejects_a_malformed_covering_declaration() {
  587 |         let mut proto = pb::IndexMetadata::from(&index_metadata_with(vec![7, 11], vec![11]));
  588 |         // The leading entry, not the trailing one: claims the keyed column is
  589 |         // carried.
  590 |         proto.covering_fields = vec![7];
  591 | 
  592 |         let err = IndexMetadata::try_from(proto)
  593 |             .expect_err("a malformed covering declaration must not decode");
  594 |         assert!(
  595 |             matches!(err, Error::InvalidInput { .. }),
  596 |             "expected InvalidInput, got {:?}",
  597 |             err
  598 |         );
  599 |         assert!(
  600 |             err.to_string().contains("must come last"),
  601 |             "unexpected message: {err}"
  602 |         );
  603 |     }
  604 | 
  605 |     /// Only the keyed prefix decides which column an index answers for, and
  606 |     /// nearly every selection path needs exactly one such column. Metadata read
  607 |     /// from a manifest this build never wrote can still be malformed, so both
  608 |     /// accessors must fail closed -- no keyed field -- rather than underflow.
  609 |     #[rstest]
  610 |     #[case::not_covered(vec![7], vec![], vec![7], Some(7))]
  611 |     #[case::covered(vec![7, 11], vec![11], vec![7], Some(7))]
  612 |     #[case::covered_multi(vec![7, 11, 13], vec![11, 13], vec![7], Some(7))]
  613 |     #[case::covered_composite(vec![7, 11, 13], vec![13], vec![7, 11], None)]
  614 |     #[case::composite(vec![7, 11], vec![], vec![7, 11], None)]
  615 |     #[case::system_index_no_fields(vec![], vec![], vec![], None)]
  616 |     #[case::malformed_longer_than_fields(vec![7], vec![11, 13], vec![], None)]
  617 |     fn test_keyed_fields(
  618 |         #[case] fields: Vec<i32>,
  619 |         #[case] covering_fields: Vec<i32>,
  620 |         #[case] expected_keyed: Vec<i32>,
  621 |         #[case] expected_single: Option<i32>,
  622 |     ) {
  623 |         let metadata = index_metadata_with(fields, covering_fields);
  624 | 
  625 |         assert_eq!(metadata.keyed_fields(), expected_keyed.as_slice());
  626 |         assert_eq!(metadata.keyed_field(), expected_single);
  627 |     }
  628 | 
  629 |     fn index_metadata_with(fields: Vec<i32>, covering_fields: Vec<i32>) -> IndexMetadata {
  630 |         IndexMetadata {
  631 |             uuid: Uuid::new_v4(),
  632 |             name: "idx".to_string(),
  633 |             fields,
  634 |             covering_fields,
  635 |             dataset_version: 1,
  636 |             fragment_bitmap: None,
  637 |             index_details: None,
  638 |             index_version: 0,
  639 |             created_at: None,
  640 |             base_id: None,
  641 |             files: None,
  642 |         }
  643 |     }
  644 | 
  645 |     #[rstest]
  646 |     #[case::zone_map("type.googleapis.com/lance.table.ZoneMapIndexDetails", true)]
  647 |     #[case::bloom_filter("type.googleapis.com/lance.index.pb.BloomFilterIndexDetails", true)]
  648 |     #[case::fm("type.googleapis.com/lance.index.pb.FMIndexDetails", true)]
  649 |     #[case::fm_case_insensitive("type.googleapis.com/LANCE.INDEX.PB.FMINDEXDETAILS", true)]
  650 |     #[case::foreign_fm_terminal_name("type.googleapis.com/example.FMIndexDetails", false)]
  651 |     #[case::btree("type.googleapis.com/lance.table.BTreeIndexDetails", false)]
  652 |     fn test_results_are_row_addrs(#[case] type_url: &str, #[case] expected: bool) {
  653 |         let mut metadata = index_metadata_with(vec![0], vec![]);
  654 |         metadata.index_details = Some(Arc::new(prost_types::Any {
  655 |             type_url: type_url.to_string(),
  656 |             value: Vec::new(),
  657 |         }));
  658 | 
  659 |         assert_eq!(metadata.results_are_row_addrs(), expected);
  660 |     }
  661 | 
  662 |     #[rstest]
  663 |     #[case::empty_is_valid(vec![7], vec![], None)]
  664 |     // mem_wal and frag_reuse both commit no fields at all; a bare
  665 |     // `covering_fields.len() < fields.len()` check would reject them.
  666 |     #[case::system_index_no_fields(vec![], vec![], None)]
  667 |     #[case::valid_single_covered(vec![7, 11], vec![11], None)]
  668 |     #[case::valid_suffix(vec![7, 11, 13], vec![11, 13], None)]
  669 |     #[case::not_a_suffix(vec![7, 11, 13], vec![11], Some("must come last"))]
  670 |     #[case::not_a_subset(vec![7, 11], vec![99], Some("are not among its fields"))]
  671 |     #[case::wrong_order(vec![7, 11, 13], vec![13, 11], Some("must come last"))]
  672 |     #[case::all_fields_covered(vec![7], vec![7], Some("at least one field must remain indexed"))]
  673 |     #[case::covers_the_search_key(vec![7, 11], vec![7, 11], Some("at least one field must remain indexed"))]
  674 |     // `fields` repeats the id in the same positions, so `[11, 11]` is a genuine
  675 |     // tail of it -- only the duplicate check rejects this.
  676 |     #[case::duplicate_covered(vec![7, 11, 11], vec![11, 11], Some("more than once"))]
  677 |     // Both over-long and naming an unknown id: the unknown id is the cause, so
  678 |     // it must be reported ahead of "at least one field must remain indexed".
  679 |     #[case::unknown_id_reported_before_length(vec![7, 11], vec![99, 11], Some("are not among its fields"))]
  680 |     fn test_validate_covering_fields(
  681 |         #[case] fields: Vec<i32>,
  682 |         #[case] covering_fields: Vec<i32>,
  683 |         #[case] expected_error: Option<&str>,
  684 |     ) {
  685 |         let metadata = index_metadata_with(fields, covering_fields);
  686 |         let result = metadata.validate_covering_fields();
  687 | 
  688 |         match expected_error {
  689 |             None => assert!(result.is_ok(), "expected valid, got {:?}", result),
  690 |             Some(fragment) => {
  691 |                 let err = result.expect_err("expected a validation error");
  692 |                 assert!(
  693 |                     matches!(err, Error::InvalidInput { .. }),
  694 |                     "expected InvalidInput, got {:?}",
  695 |                     err
  696 |                 );
  697 |                 let message = err.to_string();
  698 |                 assert!(
  699 |                     message.contains(fragment),
  700 |                     "expected message to contain {:?}, got {:?}",
  701 |                     fragment,
  702 |                     message
  703 |                 );
  704 |             }
  705 |         }
  706 |     }
  707 | }
``````
