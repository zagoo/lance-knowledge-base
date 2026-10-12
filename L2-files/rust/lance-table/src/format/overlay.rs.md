> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../V21-PROTOCOL.md). Refresh 2026-10-11: [current coordinates and changed contracts](../../../../../refresh-addenda/2026-10-11-4ac2f7c8.md) at `4ac2f7c88be1ea2ab2c0fbb61d02238883fc18b9` supersede affected historical statements; body remains frozen.

# rust/lance-table/src/format/overlay.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `51b54b38a5cde0ded98b1dfd9ec21d8ebc02a76c8799edc025ec6bd805aa1dd0`. Reviewed physical lines: 1-475.

[Module](../../../../../L1-modules/rust-lance-table.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Physical cell coverage metadata, stable overlay order, tombstoning and Roaring serialization boundaries. (rust/lance-table/src/format/overlay.rs:1-475)

## Complete range analysis

### Lines 1-35

SPDX and module contract: coverage uses physical offsets including deleted rows, never live-row numbering; values align to bitmap rank (number of set bits below the offset), one value column per field, no offset-key column. Shared coverage is dense, per-field coverage sparse. Parsed bitmaps are Arc-shared. Highest committed version wins; equal versions use later list position. Replacing base fields must tombstone stale slots without shifting per-field coverage. These are format invariants described here; actual rank-based reading/writing and commit retry stamping are outside this module. (rust/lance-table/src/format/overlay.rs:1-35)

### Lines 36-55

Exports child staleness module (now analyzed at rust/lance-table/src/format/overlay/staleness.rs:1-415), imports core errors/deepsize, Roaring/serde, Path, DataFile and protobuf. Public TOMBSTONE_FIELD_ID:i32=-2 marks obsolete field slots. Negative IDs other than-2 are not implicitly tombstones in the helper below. (rust/lance-table/src/format/overlay.rs:36-55)

### Lines 56-75

OverlayCoverage derives clone/equality and custom serde through private OverlayCoverageBytes. Shared contains Arc<RoaringBitmap> for all fields; PerField contains Vec<Arc<RoaringBitmap>> position-aligned with data_file.fields by contract. Types themselves impose no length/cardinality/physical-row bound. Clones share bitmap contents but clone the Vec of handles. (rust/lance-table/src/format/overlay.rs:56-75)

### Lines 76-96

Private serialized enum has Shared(Vec<u8>) and PerField(Vec<Vec<u8>>), preserving Roaring bytes. deserialize_roaring maps Roaring decode error to CorruptFile with supplied path and original error text. There is no explicit exhaustion check for trailing bytes. Serde uses an empty path because owner context is unavailable. (rust/lance-table/src/format/overlay.rs:76-96)

### Lines 97-116

serialize_roaring clones and optimize()s a bitmap, preallocates serialized_size bytes and unwraps Vec serialization; unexpected error would panic. From<OverlayCoverage> consumes Arc handles/Vec and serializes each bitmap via this helper without mutating shared originals. No cross-field equality deduplication in output. (rust/lance-table/src/format/overlay.rs:97-116)

### Lines 117-136

TryFrom serialized coverage uses Path::default, deserializes every bitmap into a new Arc, and propagates first error. Empty per-field Vec is accepted. It cannot check alignment with data_file.fields because coverage is decoded in isolation. (rust/lance-table/src/format/overlay.rs:117-136)

### Lines 137-164

DeepSizeOf deduplicates each Arc bitmap by pointer in shared Context. First visit adds size_of<RoaringBitmap> plus serialized_size proxy; later visits add0. PerField also adds Vec capacity times Arc handle size. Refcount allocation overhead is excluded and closeness of serialized-size proxy is a source comment, not measured memory. Distinct cloned Vec allocations are still charged separately. (rust/lance-table/src/format/overlay.rs:137-164)

### Lines 165-176

dense wraps supplied owned bitmap in one Arc; sparse maps each supplied owned bitmap into its own Arc. Neither checks field count, offset range, overlap or rank cardinality. (rust/lance-table/src/format/overlay.rs:165-176)

### Lines 177-191

DataOverlayFile exposes data_file, coverage and committed_version:u64, with Debug/Clone/equality/serde/DeepSizeOf derives. Version is documented as commit-time stamp restamped on retry; this struct has no commit or stamp routine and accepts arbitrary versions. (rust/lance-table/src/format/overlay.rs:177-191)

### Lines 192-214

coverage_for_field returns an Arc clone. Shared returns its bitmap for any requested usize without checking field bounds. PerField gets only its bitmap Vec index and returns InvalidInput with bitmap count/requested position if absent. It does not compare data_file.fields length or reject tombstoned fields. (rust/lance-table/src/format/overlay.rs:192-214)

### Lines 215-222

sort_overlays_newest_last uses stable slice.sort_by_key on committed_version ascending, preserving original order for ties. It mutates ordering only; no versions, fields or coverage change. (rust/lance-table/src/format/overlay.rs:215-222)

### Lines 223-241

verify_overlays_newest_last scans adjacent windows and returns InvalidInput on first strictly descending version pair with both values. Empty/singleton/equal versions pass. This validates order only, not coverage/field shape or commit ownership; callers must invoke it to obtain write-side protection. (rust/lance-table/src/format/overlay.rs:223-241)

### Lines 242-276

tombstone_overlay_fields rebuilds every overlay field list, replacing nonnegative IDs whose u32 value occurs in supplied fields with-2. Coverage and column indices are left in place, preserving position. It then retains overlays with any field !=-2, so empty field lists/all-2 overlays are removed and other negative IDs remain. Even untouched overlays get a fresh field Arc/list; supplied-field membership is linear for every field. It does not delete physical files, recompute sizes or validate schema. (rust/lance-table/src/format/overlay.rs:242-276)

### Lines 277-296

From<&DataOverlayFile> always emits Some(data_file) and Some(coverage), selecting SharedOffsetBitmap or FieldCoverage with optimized serialized bitmaps, preserving version. DataFile conversion is delegated. No physical write, sorting, tombstoning or alignment validation. (rust/lance-table/src/format/overlay.rs:277-296)

### Lines 297-328

TryFrom protobuf first requires data_file (InvalidInput), derives its path, then requires coverage (InvalidInput) and parses Roaring with that path (CorruptFile). Converts DataFile only after coverage parsing, preserves committed_version, and accepts empty/mismatched per-field bitmap counts. No validate/sort/version support check runs here. (rust/lance-table/src/format/overlay.rs:297-328)

### Lines 329-358

cfg(test) missing-field fixture constructs no-coverage and no-data-file protobufs and asserts diagnostic substrings. It tests required option presence but not corrupted bitmap bytes or shape/cardinality errors. (rust/lance-table/src/format/overlay.rs:329-358)

### Lines 359-386

Run-optimization fixture encodes dense offsets0..1_000_000, asserts <1% of prior serialized size and recovered coverage equality. It uses a legacy DataFile metadata constructor without writing a legacy file. Not executed. (rust/lance-table/src/format/overlay.rs:359-386)

### Lines 387-405

Serde JSON roundtrip loops dense populated/empty, sparse populated+empty and zero-bitmap sparse coverage, asserting exact equality. These cases confirm intended empty representations, not field-count validation or persisted historical fixtures. (rust/lance-table/src/format/overlay.rs:387-405)

### Lines 406-444

Tombstone fixture has sparse[3,5], single[5], untouched[7]; replacing5 leaves two overlays, first fields[3,-2] and last[7]. It does not assert coverage/column arrays or physically remove files; implementation leaves those arrays untouched. (rust/lance-table/src/format/overlay.rs:406-444)

### Lines 445-459

Ordering test accepts empty and versions[1,2,2,5], rejects[2,1] with newest-last diagnostic. Stable tie sorting itself is covered in fragment tests, not here. (rust/lance-table/src/format/overlay.rs:445-459)

### Lines 460-475

Sparse coverage lookup fixture accepts positions0/1 and rejects5 with field-position diagnostic. No Shared out-of-range or mismatch-length fixture. All tests read, not run. (rust/lance-table/src/format/overlay.rs:460-475)

## Interaction and interpretation limits

Every475 lines read. Module invariants are distinguished from enforcement. Reader rank merge, staleness implementation, transaction stamps and file IO remain pending; no runtime qualification.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | //! Data overlay files.
    5 | //!
    6 | //! An overlay file supplies new values for a subset of `(physical offset, field)`
    7 | //! cells within a fragment, without rewriting the fragment's base data files. See
    8 | //! the Data Overlay Files specification for the full rules; the invariants this
    9 | //! module relies on are:
   10 | //!
   11 | //! - **Physical-offset coverage.** Coverage bitmaps index *physical* row offsets
   12 | //!   (positions in the base data files, counting deleted rows), so they are stable
   13 | //!   across deletions, like deletion vectors.
   14 | //! - **Rank-based values.** The overlay's `data_file` stores one value column per
   15 | //!   field, with no row-offset key column. Within a value column, a covered
   16 | //!   offset's value sits at its **rank** — the 0-based count of set bits below it
   17 | //!   in that field's coverage bitmap.
   18 | //! - **Dense vs. sparse coverage.** A dense overlay shares one bitmap across every
   19 | //!   field ([`OverlayCoverage::Shared`]); a sparse overlay carries one bitmap per
   20 | //!   field ([`OverlayCoverage::PerField`]).
   21 | //! - **Parse once.** Bitmaps are parsed from their 32-bit Roaring encoding a single
   22 | //!   time when the fragment loads and held behind an `Arc`, so cloning a fragment
   23 | //!   is cheap.
   24 | //! - **Newest-last ordering.** A fragment's overlays are stored newest-last and
   25 | //!   stable-sorted by `committed_version` on load (see [`sort_overlays_newest_last`]),
   26 | //!   with list position breaking ties for equal versions. When two overlays cover
   27 | //!   the same `(offset, field)`, the higher `committed_version` wins.
   28 | //! - **Field tombstones.** When new base values are written for a field (a
   29 | //!   DataReplacement, or an in-place column rewrite), any overlay value for that
   30 | //!   field is stale and must stop shadowing the fresh base. The field is marked
   31 | //!   obsolete in the overlay's `data_file.fields` with [`TOMBSTONE_FIELD_ID`]
   32 | //!   (the same sentinel used for obsolete base columns) rather than physically
   33 | //!   removed, so the overlay's other fields — and its coverage positions — stay
   34 | //!   intact (see [`tombstone_overlay_fields`]).
   35 | 
   36 | pub mod staleness;
   37 | 
   38 | use std::sync::Arc;
   39 | 
   40 | use lance_core::Error;
   41 | use lance_core::deepsize::DeepSizeOf;
   42 | use lance_core::error::Result;
   43 | use roaring::RoaringBitmap;
   44 | use serde::{Deserialize, Serialize};
   45 | 
   46 | use object_store::path::Path;
   47 | 
   48 | use super::DataFile;
   49 | use crate::format::pb;
   50 | 
   51 | /// Field-id sentinel marking a tombstoned (obsolete) field within an overlay's
   52 | /// `data_file.fields`. Matches the tombstone convention for obsolete columns in
   53 | /// base data files; a tombstoned field's values are ignored on read.
   54 | pub const TOMBSTONE_FIELD_ID: i32 = -2;
   55 | 
   56 | /// Which `(physical offset, field)` cells a [`DataOverlayFile`] provides values
   57 | /// for.
   58 | ///
   59 | /// Bitmaps are parsed from their 32-bit Roaring encoding once when the fragment
   60 | /// is loaded and held behind an `Arc` so cloning a fragment is cheap; use
   61 | /// [`DataOverlayFile::coverage_for_field`] to obtain the one that applies to a
   62 | /// given field.
   63 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
   64 | #[serde(into = "OverlayCoverageBytes", try_from = "OverlayCoverageBytes")]
   65 | pub enum OverlayCoverage {
   66 |     /// A single bitmap that applies to every field in the overlay's
   67 |     /// `data_file.fields` (a dense / rectangular overlay): every covered offset
   68 |     /// has a value for every field.
   69 |     Shared(Arc<RoaringBitmap>),
   70 |     /// One bitmap per field, in the same order as the overlay's
   71 |     /// `data_file.fields` (a sparse overlay): different fields may cover
   72 |     /// different offset sets.
   73 |     PerField(Vec<Arc<RoaringBitmap>>),
   74 | }
   75 | 
   76 | /// Serialized form of [`OverlayCoverage`] — each bitmap as its 32-bit Roaring
   77 | /// byte encoding. The in-memory form parses these once at load.
   78 | #[derive(Debug, Clone, Serialize, Deserialize)]
   79 | enum OverlayCoverageBytes {
   80 |     Shared(Vec<u8>),
   81 |     PerField(Vec<Vec<u8>>),
   82 | }
   83 | 
   84 | // The bytes come from a persisted overlay (the protobuf manifest or a
   85 | // serialized fragment), so a decode failure is on-disk corruption, not caller
   86 | // input. `path` locates the overlay's data file when known (empty on the serde
   87 | // path, which deserializes coverage in isolation).
   88 | fn deserialize_roaring(bytes: &[u8], path: &Path) -> Result<RoaringBitmap> {
   89 |     RoaringBitmap::deserialize_from(bytes).map_err(|e| {
   90 |         Error::corrupt_file(
   91 |             path.clone(),
   92 |             format!("failed to deserialize overlay coverage bitmap: {e}"),
   93 |         )
   94 |     })
   95 | }
   96 | 
   97 | fn serialize_roaring(bitmap: &RoaringBitmap) -> Vec<u8> {
   98 |     let mut bitmap = bitmap.clone();
   99 |     bitmap.optimize();
  100 |     let mut bytes = Vec::with_capacity(bitmap.serialized_size());
  101 |     // Writing to a Vec is infallible.
  102 |     bitmap.serialize_into(&mut bytes).unwrap();
  103 |     bytes
  104 | }
  105 | 
  106 | impl From<OverlayCoverage> for OverlayCoverageBytes {
  107 |     fn from(coverage: OverlayCoverage) -> Self {
  108 |         match coverage {
  109 |             OverlayCoverage::Shared(bitmap) => Self::Shared(serialize_roaring(&bitmap)),
  110 |             OverlayCoverage::PerField(bitmaps) => {
  111 |                 Self::PerField(bitmaps.iter().map(|b| serialize_roaring(b)).collect())
  112 |             }
  113 |         }
  114 |     }
  115 | }
  116 | 
  117 | impl TryFrom<OverlayCoverageBytes> for OverlayCoverage {
  118 |     type Error = Error;
  119 | 
  120 |     fn try_from(bytes: OverlayCoverageBytes) -> Result<Self> {
  121 |         // Serde deserializes the coverage in isolation, so the owning data
  122 |         // file's path is not available here.
  123 |         let path = Path::default();
  124 |         Ok(match bytes {
  125 |             OverlayCoverageBytes::Shared(b) => {
  126 |                 Self::Shared(Arc::new(deserialize_roaring(&b, &path)?))
  127 |             }
  128 |             OverlayCoverageBytes::PerField(bs) => Self::PerField(
  129 |                 bs.iter()
  130 |                     .map(|b| deserialize_roaring(b, &path).map(Arc::new))
  131 |                     .collect::<Result<_>>()?,
  132 |             ),
  133 |         })
  134 |     }
  135 | }
  136 | 
  137 | impl DeepSizeOf for OverlayCoverage {
  138 |     fn deep_size_of_children(&self, context: &mut lance_core::deepsize::Context) -> usize {
  139 |         // The same `Arc<RoaringBitmap>` is shared across every clone of a
  140 |         // fragment, so mark each Arc's pointer and count its heap only the first
  141 |         // time it is seen — otherwise walking many fragments double-counts the
  142 |         // shared bitmaps. RoaringBitmap does not expose its allocation size; its
  143 |         // serialized size is a cheap, close proxy for the heap it holds.
  144 |         let bitmap_heap = |bitmap: &Arc<RoaringBitmap>,
  145 |                            context: &mut lance_core::deepsize::Context| {
  146 |             if context.mark_seen(Arc::as_ptr(bitmap) as usize) {
  147 |                 std::mem::size_of::<RoaringBitmap>() + bitmap.serialized_size()
  148 |             } else {
  149 |                 0
  150 |             }
  151 |         };
  152 |         match self {
  153 |             Self::Shared(bitmap) => bitmap_heap(bitmap, context),
  154 |             Self::PerField(bitmaps) => {
  155 |                 bitmaps.capacity() * std::mem::size_of::<Arc<RoaringBitmap>>()
  156 |                     + bitmaps
  157 |                         .iter()
  158 |                         .map(|b| bitmap_heap(b, context))
  159 |                         .sum::<usize>()
  160 |             }
  161 |         }
  162 |     }
  163 | }
  164 | 
  165 | impl OverlayCoverage {
  166 |     /// Build a dense coverage from a single bitmap shared across every field.
  167 |     pub fn dense(bitmap: RoaringBitmap) -> Self {
  168 |         Self::Shared(Arc::new(bitmap))
  169 |     }
  170 | 
  171 |     /// Build a sparse coverage from one bitmap per field.
  172 |     pub fn sparse(bitmaps: Vec<RoaringBitmap>) -> Self {
  173 |         Self::PerField(bitmaps.into_iter().map(Arc::new).collect())
  174 |     }
  175 | }
  176 | 
  177 | /// An overlay file supplies new values for a subset of `(physical offset, field)`
  178 | /// cells within a fragment, without rewriting the fragment's base data files. See
  179 | /// the [module documentation](self) for the coverage, rank, and versioning rules.
  180 | #[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize, DeepSizeOf)]
  181 | pub struct DataOverlayFile {
  182 |     /// The data file storing the overlay's new cell values.
  183 |     pub data_file: DataFile,
  184 |     /// Which cells this overlay provides values for.
  185 |     pub coverage: OverlayCoverage,
  186 |     /// The dataset version at which this overlay became effective (the version of
  187 |     /// the commit that introduced it, stamped at commit time and re-stamped on
  188 |     /// retry). Higher wins when two overlays cover the same `(offset, field)`.
  189 |     pub committed_version: u64,
  190 | }
  191 | 
  192 | impl DataOverlayFile {
  193 |     /// The parsed coverage bitmap that applies to the field stored at
  194 |     /// `field_pos` within `data_file.fields`.
  195 |     ///
  196 |     /// For a dense overlay the same shared bitmap is returned for every field;
  197 |     /// for a sparse overlay the per-field bitmap at `field_pos` is returned. The
  198 |     /// bitmap is already parsed, so this is a cheap `Arc` clone.
  199 |     pub fn coverage_for_field(&self, field_pos: usize) -> Result<Arc<RoaringBitmap>> {
  200 |         match &self.coverage {
  201 |             OverlayCoverage::Shared(bitmap) => Ok(bitmap.clone()),
  202 |             OverlayCoverage::PerField(bitmaps) => {
  203 |                 bitmaps.get(field_pos).cloned().ok_or_else(|| {
  204 |                     Error::invalid_input(format!(
  205 |                         "overlay per-field coverage has {} bitmaps but field position {} was requested",
  206 |                         bitmaps.len(),
  207 |                         field_pos
  208 |                     ))
  209 |                 })
  210 |             }
  211 |         }
  212 |     }
  213 | }
  214 | 
  215 | /// Stable-sort a fragment's overlays newest-last by `committed_version`. The
  216 | /// stable sort preserves list position as the tiebreak for equal versions, so
  217 | /// resolution can rely on the ordering without re-checking. See the [module
  218 | /// documentation](self) for the ordering invariant.
  219 | pub fn sort_overlays_newest_last(overlays: &mut [DataOverlayFile]) {
  220 |     overlays.sort_by_key(|overlay| overlay.committed_version);
  221 | }
  222 | 
  223 | /// Verify a fragment's overlays are stored newest-last (non-decreasing
  224 | /// `committed_version`), the ordering invariant readers rely on for
  225 | /// resolution. Returns an error identifying the first out-of-order pair.
  226 | ///
  227 | /// [`sort_overlays_newest_last`] normalizes on load; this is the write-side
  228 | /// guard that rejects any commit path that assembled overlays out of order. See
  229 | /// the [module documentation](self) for the ordering invariant.
  230 | pub fn verify_overlays_newest_last(overlays: &[DataOverlayFile]) -> Result<()> {
  231 |     for pair in overlays.windows(2) {
  232 |         if pair[0].committed_version > pair[1].committed_version {
  233 |             return Err(Error::invalid_input(format!(
  234 |                 "overlay files must be stored newest-last, but committed_version {} precedes {}",
  235 |                 pair[0].committed_version, pair[1].committed_version
  236 |             )));
  237 |         }
  238 |     }
  239 |     Ok(())
  240 | }
  241 | 
  242 | /// Tombstone `fields` across a fragment's `overlays`, dropping any overlay left
  243 | /// with no live fields.
  244 | ///
  245 | /// Called when new base values are written for those fields (a DataReplacement,
  246 | /// or an in-place column rewrite): the stale overlay values must stop shadowing
  247 | /// the fresh base. Each matching field id is replaced with [`TOMBSTONE_FIELD_ID`]
  248 | /// in place, preserving the overlay's remaining fields and its coverage positions
  249 | /// (a per-field coverage bitmap stays aligned with `data_file.fields`). An overlay
  250 | /// whose fields are now all tombstoned is removed entirely. See the [module
  251 | /// documentation](self) for the tombstone invariant.
  252 | pub fn tombstone_overlay_fields(overlays: &mut Vec<DataOverlayFile>, fields: &[u32]) {
  253 |     for overlay in overlays.iter_mut() {
  254 |         let tombstoned: Vec<i32> = overlay
  255 |             .data_file
  256 |             .fields
  257 |             .iter()
  258 |             .map(|&field| {
  259 |                 if field >= 0 && fields.contains(&(field as u32)) {
  260 |                     TOMBSTONE_FIELD_ID
  261 |                 } else {
  262 |                     field
  263 |                 }
  264 |             })
  265 |             .collect();
  266 |         overlay.data_file.fields = tombstoned.into();
  267 |     }
  268 |     overlays.retain(|overlay| {
  269 |         overlay
  270 |             .data_file
  271 |             .fields
  272 |             .iter()
  273 |             .any(|&field| field != TOMBSTONE_FIELD_ID)
  274 |     });
  275 | }
  276 | 
  277 | impl From<&DataOverlayFile> for pb::DataOverlayFile {
  278 |     fn from(overlay: &DataOverlayFile) -> Self {
  279 |         let coverage = match &overlay.coverage {
  280 |             OverlayCoverage::Shared(bitmap) => {
  281 |                 pb::data_overlay_file::Coverage::SharedOffsetBitmap(serialize_roaring(bitmap))
  282 |             }
  283 |             OverlayCoverage::PerField(bitmaps) => {
  284 |                 pb::data_overlay_file::Coverage::FieldCoverage(pb::FieldCoverage {
  285 |                     offset_bitmaps: bitmaps.iter().map(|b| serialize_roaring(b)).collect(),
  286 |                 })
  287 |             }
  288 |         };
  289 |         Self {
  290 |             data_file: Some(pb::DataFile::from(&overlay.data_file)),
  291 |             coverage: Some(coverage),
  292 |             committed_version: overlay.committed_version,
  293 |         }
  294 |     }
  295 | }
  296 | 
  297 | impl TryFrom<pb::DataOverlayFile> for DataOverlayFile {
  298 |     type Error = Error;
  299 | 
  300 |     fn try_from(proto: pb::DataOverlayFile) -> Result<Self> {
  301 |         let data_file = proto
  302 |             .data_file
  303 |             .ok_or_else(|| Error::invalid_input("DataOverlayFile is missing its data_file"))?;
  304 |         let path = Path::from(data_file.path.as_str());
  305 |         let coverage = match proto.coverage {
  306 |             Some(pb::data_overlay_file::Coverage::SharedOffsetBitmap(bytes)) => {
  307 |                 OverlayCoverage::Shared(Arc::new(deserialize_roaring(&bytes, &path)?))
  308 |             }
  309 |             Some(pb::data_overlay_file::Coverage::FieldCoverage(fc)) => OverlayCoverage::PerField(
  310 |                 fc.offset_bitmaps
  311 |                     .iter()
  312 |                     .map(|b| deserialize_roaring(b, &path).map(Arc::new))
  313 |                     .collect::<Result<_>>()?,
  314 |             ),
  315 |             None => {
  316 |                 return Err(Error::invalid_input(
  317 |                     "DataOverlayFile is missing its coverage",
  318 |                 ));
  319 |             }
  320 |         };
  321 |         Ok(Self {
  322 |             data_file: DataFile::try_from(data_file)?,
  323 |             coverage,
  324 |             committed_version: proto.committed_version,
  325 |         })
  326 |     }
  327 | }
  328 | 
  329 | #[cfg(test)]
  330 | mod tests {
  331 |     use super::*;
  332 | 
  333 |     #[test]
  334 |     fn test_data_overlay_missing_fields_error() {
  335 |         // A DataOverlayFile proto missing its coverage or data_file is rejected.
  336 |         let no_coverage = pb::DataOverlayFile {
  337 |             data_file: Some(pb::DataFile::from(&DataFile::new_legacy_from_fields(
  338 |                 "overlay.lance",
  339 |                 vec![3],
  340 |                 None,
  341 |             ))),
  342 |             coverage: None,
  343 |             committed_version: 1,
  344 |         };
  345 |         let err = DataOverlayFile::try_from(no_coverage).unwrap_err();
  346 |         assert!(err.to_string().contains("missing its coverage"), "{err}");
  347 | 
  348 |         let no_data_file = pb::DataOverlayFile {
  349 |             data_file: None,
  350 |             coverage: Some(pb::data_overlay_file::Coverage::SharedOffsetBitmap(
  351 |                 serialize_roaring(&RoaringBitmap::from_iter([0u32])),
  352 |             )),
  353 |             committed_version: 1,
  354 |         };
  355 |         let err = DataOverlayFile::try_from(no_data_file).unwrap_err();
  356 |         assert!(err.to_string().contains("missing its data_file"), "{err}");
  357 |     }
  358 | 
  359 |     #[test]
  360 |     fn test_coverage_bitmap_serialized_run_optimized() {
  361 |         let bitmap = RoaringBitmap::from_sorted_iter(0..1_000_000).unwrap();
  362 |         let unoptimized_size = bitmap.serialized_size();
  363 | 
  364 |         let overlay = DataOverlayFile {
  365 |             data_file: DataFile::new_legacy_from_fields("overlay.lance", vec![3], None),
  366 |             coverage: OverlayCoverage::dense(bitmap.clone()),
  367 |             committed_version: 1,
  368 |         };
  369 | 
  370 |         let proto = pb::DataOverlayFile::from(&overlay);
  371 |         let Some(pb::data_overlay_file::Coverage::SharedOffsetBitmap(bytes)) = &proto.coverage
  372 |         else {
  373 |             panic!("dense coverage must serialize as a shared offset bitmap");
  374 |         };
  375 |         assert!(
  376 |             bytes.len() < unoptimized_size / 100,
  377 |             "expected run-optimized coverage ({} bytes) to be <1% of the \
  378 |              unoptimized serialization ({} bytes)",
  379 |             bytes.len(),
  380 |             unoptimized_size
  381 |         );
  382 | 
  383 |         let recovered = DataOverlayFile::try_from(proto).unwrap();
  384 |         assert_eq!(recovered.coverage, OverlayCoverage::dense(bitmap));
  385 |     }
  386 | 
  387 |     #[test]
  388 |     fn test_overlay_coverage_serde_json_roundtrip() {
  389 |         // The custom serde impl round-trips through JSON for dense/sparse,
  390 |         // including empty bitmaps and a zero-bitmap sparse coverage.
  391 |         for coverage in [
  392 |             OverlayCoverage::dense(RoaringBitmap::from_iter([1u32, 5, 100])),
  393 |             OverlayCoverage::dense(RoaringBitmap::new()),
  394 |             OverlayCoverage::sparse(vec![
  395 |                 RoaringBitmap::from_iter([2u32, 3]),
  396 |                 RoaringBitmap::new(),
  397 |             ]),
  398 |             OverlayCoverage::sparse(vec![]),
  399 |         ] {
  400 |             let json = serde_json::to_string(&coverage).unwrap();
  401 |             let back: OverlayCoverage = serde_json::from_str(&json).unwrap();
  402 |             assert_eq!(back, coverage);
  403 |         }
  404 |     }
  405 | 
  406 |     #[test]
  407 |     fn test_tombstone_overlay_fields() {
  408 |         // An overlay covering fields [3, 5]: replacing field 5 tombstones just
  409 |         // field 5's slot and keeps field 3. An overlay covering only field 5 is
  410 |         // dropped entirely. An overlay touching no replaced field is untouched.
  411 |         let mut overlays = vec![
  412 |             DataOverlayFile {
  413 |                 data_file: DataFile::new_legacy_from_fields("a.lance", vec![3, 5], None),
  414 |                 coverage: OverlayCoverage::sparse(vec![
  415 |                     RoaringBitmap::from_iter([0u32]),
  416 |                     RoaringBitmap::from_iter([1u32]),
  417 |                 ]),
  418 |                 committed_version: 1,
  419 |             },
  420 |             DataOverlayFile {
  421 |                 data_file: DataFile::new_legacy_from_fields("b.lance", vec![5], None),
  422 |                 coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
  423 |                 committed_version: 1,
  424 |             },
  425 |             DataOverlayFile {
  426 |                 data_file: DataFile::new_legacy_from_fields("c.lance", vec![7], None),
  427 |                 coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
  428 |                 committed_version: 1,
  429 |             },
  430 |         ];
  431 | 
  432 |         tombstone_overlay_fields(&mut overlays, &[5]);
  433 | 
  434 |         // The single-field overlay on field 5 is gone; the others remain.
  435 |         assert_eq!(overlays.len(), 2);
  436 |         // Field 3 preserved, field 5 tombstoned in place (coverage stays aligned).
  437 |         assert_eq!(
  438 |             overlays[0].data_file.fields.as_ref(),
  439 |             &[3, TOMBSTONE_FIELD_ID]
  440 |         );
  441 |         // The untouched overlay keeps its field.
  442 |         assert_eq!(overlays[1].data_file.fields.as_ref(), &[7]);
  443 |     }
  444 | 
  445 |     #[test]
  446 |     fn test_verify_overlays_newest_last() {
  447 |         let mk = |version: u64| DataOverlayFile {
  448 |             data_file: DataFile::new_legacy_from_fields("o.lance", vec![3], None),
  449 |             coverage: OverlayCoverage::dense(RoaringBitmap::from_iter([0u32])),
  450 |             committed_version: version,
  451 |         };
  452 |         // Non-decreasing (including equal versions) is accepted.
  453 |         assert!(verify_overlays_newest_last(&[]).is_ok());
  454 |         assert!(verify_overlays_newest_last(&[mk(1), mk(2), mk(2), mk(5)]).is_ok());
  455 |         // A newer version before an older one is rejected.
  456 |         let err = verify_overlays_newest_last(&[mk(2), mk(1)]).unwrap_err();
  457 |         assert!(err.to_string().contains("newest-last"), "{err}");
  458 |     }
  459 | 
  460 |     #[test]
  461 |     fn test_coverage_for_field_out_of_bounds() {
  462 |         let overlay = DataOverlayFile {
  463 |             data_file: DataFile::new_legacy_from_fields("o.lance", vec![2, 4], None),
  464 |             coverage: OverlayCoverage::sparse(vec![
  465 |                 RoaringBitmap::from_iter([1u32]),
  466 |                 RoaringBitmap::from_iter([2u32]),
  467 |             ]),
  468 |             committed_version: 1,
  469 |         };
  470 |         assert!(overlay.coverage_for_field(0).is_ok());
  471 |         assert!(overlay.coverage_for_field(1).is_ok());
  472 |         let err = overlay.coverage_for_field(5).unwrap_err();
  473 |         assert!(err.to_string().contains("field position"), "{err}");
  474 |     }
  475 | }
``````
