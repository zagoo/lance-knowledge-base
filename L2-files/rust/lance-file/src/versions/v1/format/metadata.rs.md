> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/format/metadata.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `940693bc3999c53c7db424284c9c57833f0e02ea17263f5abfcf4541f595a45e`. Reviewed physical lines: 1-255.

[Module](../../../../../../../L1-modules/rust-lance-file-v1-foundation.md) · [Symbols](../../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../../README.md)

## Role and visibility

Public V1 metadata containers, protobuf object conversion and logical-row-to-batch mapping. Maintains signed cumulative batch offsets and page-table/schema/statistics locations; it does not read or write bytes itself. (rust/lance-file/src/versions/v1/format/metadata.rs:1-255)

## Complete range analysis

### Lines 1-13

SPDX/imports: BTreeMap makes grouped batch IDs ordered; Range describes half-open selections; file Fields/FieldsWithMeta and shared pb convert flat schemas; core Schema, DeepSizeOf and errors plus IO ProtoStruct provide metadata integration. (rust/lance-file/src/versions/v1/format/metadata.rs:1-13)

### Lines 14-33

Metadata derives Debug,Default,DeepSizeOf,PartialEq; public fields batch_offsets:Vec<i32>,page_table_position:usize,manifest_position:Option<usize>,stats_metadata:Option<StatisticsMetadata>. Defaults are empty/0/None/None. ProtoStruct associates pb::Metadata. The type imposes no nonnegative/monotone offsets or valid file-position invariant at construction. (rust/lance-file/src/versions/v1/format/metadata.rs:14-33)

### Lines 34-55

From<&Metadata> for pb::Metadata clones offsets and optional statistics leaf IDs, flattens stats schema via FieldsWithMeta but persists only fields, casts positions to u64, and maps absent manifest_position to0. Statistics Some(empty schema) remains Some; None remains None. Schema-level metadata is omitted from this stats encoding. No IO or validation. (rust/lance-file/src/versions/v1/format/metadata.rs:34-55)

### Lines 56-78

TryFrom<pb::Metadata> clones incoming batch_offsets despite owning message, casts all positions to usize without checked conversion and always produces Some(manifest_position), including Some(0). Statistics schema is reconstructed with empty schema-level metadata and can fail through Schema conversion; IDs/position are copied without checks. Thus Metadata None manifest location roundtrips as Some(0), while wire0 retains its external-manifest sentinel meaning for consumers. Offset order/count and page ranges are not validated here. (rust/lance-file/src/versions/v1/format/metadata.rs:56-78)

### Lines 79-84

BatchOffsets is public Debug/PartialEq with batch_id:i32 and offsets:Vec<u32>. Values describe one batch and in-batch row offsets; there is no constructor validation or ownership-sharing wrapper. (rust/lance-file/src/versions/v1/format/metadata.rs:79-84)

### Lines 85-103

num_batches returns0 for an empty offsets vector, otherwise len-1. len returns final signed offset cast to usize, default0; negative final values become large unsigned lengths. is_empty compares that result to0. These methods assume a cumulative sentinel vector; a singleton nonzero vector reports0batches but nonzero length. (rust/lance-file/src/versions/v1/format/metadata.rs:85-103)

### Lines 104-112

push_batch_length inserts initial0 only if offsets is empty, then appends ordinary i32 sum of supplied length and last offset. Zero or negative lengths are accepted; overflow is not checked. Existing malformed offset vectors are not repaired. Nonempty guarantee makes the last unwrap structurally safe after initialization. (rust/lance-file/src/versions/v1/format/metadata.rs:104-112)

### Lines 113-123

get_offset casts signed batch_id to usize and uses bounds-checked Vec::get. get_batch_length first gets offset(batch_id+1), then subtracts offset(batch_id) or default0. IDs are not explicitly validated: for batch_id=-1, next0 may yield the first offset while current negative lookup misses. Signed increment/subtraction are unchecked. Terminal sentinel is accessible by get_offset even though it is not a batch start. (rust/lance-file/src/versions/v1/format/metadata.rs:113-123)

### Lines 124-147

group_indices_to_batches documents sorted input but actually clones and sort_unstable sorts it. It scans increasing batch_id across cumulative ends and groups original absolute indices into an ordered BTreeMap, preserving duplicate values. Out-of-range IDs can advance to batch_id==num_batches and are retained there; no error is returned. A zero-length batch is skipped while its end<=index. Sorting changes caller ordering without a permutation result. The comment labels sort_unstable quick sort; that implementation claim is only a comment, not established by this file. (rust/lance-file/src/versions/v1/format/metadata.rs:124-147)

### Lines 148-164

Map iteration yields increasing batch IDs. Each group reads batch_offsets[batch_id] and subtracts that offset cast to u32, collecting BatchOffsets. Nonempty indices with entirely empty batch_offsets panic on this indexing; a nonempty sentinel vector permits a terminal pseudo-batch for out-of-file rows. Unsigned subtraction is unchecked on malformed offsets. An empty indices slice yields no groups. The observed V1 take consumer rejects batch_id>=num_batches later. (rust/lance-file/src/versions/v1/format/metadata.rs:148-164)

### Lines 165-182

range_to_batches returns Result but first unwraps final offset, so empty metadata panics. Only range.end>last_as_usize is explicitly rejected as InvalidInput with range/bound. It casts start to i32 and binary-searches offsets, using insertion_point-1 on a miss. Unsorted/nonzero-first offsets, large casts and underflow are not checked; duplicate cumulative offsets permit binary_search to select any matching entry. It does not reject start>end. (rust/lance-file/src/versions/v1/format/metadata.rs:165-182)

### Lines 183-196

Iterate from chosen batch while below num_batches; stop once batch_start>=range.end. Append clamped(relative start..end) using unchecked usize subtraction, then return vector. Reversed ranges can yield reversed subranges; an empty range inside a nonempty batch can produce an empty subrange, while an empty range at its start stops immediately. The V1 reader short-circuits Range::is_empty before invoking this helper, so these helper-level observations are not claims that that caller exposes them. (rust/lance-file/src/versions/v1/format/metadata.rs:183-196)

### Lines 197-208

StatisticsMetadata derives Debug,PartialEq,DeepSizeOf and exposes schema:Schema,leaf_field_ids:Vec<i32>,page_table_position:usize. Documentation describes per-field i.null_count/min_value/max_value names; this container does not enforce those names, schema/ID cardinality or statistics completeness. (rust/lance-file/src/versions/v1/format/metadata.rs:197-208)

### Lines 209-235

Private cfg(test) module imports parent. test_group_indices_to_batch pushes20twice, groups[6,24], requires two groups exactly(batch0,[6])and(batch1,[4]). It does not test sorting, duplicates, empty metadata, boundaries, invalid indices, negative offsets or conversion presence. (rust/lance-file/src/versions/v1/format/metadata.rs:209-235)

### Lines 236-255

test_range_to_batches builds lengths[5,10,15,20], cumulative[0,5,15,30,50]. Asserts0..10->[0:0..5,1:0..5],2..10->[0:2..5,1:0..5],15..33->[2:0..15,3:0..3],14..33->[1:9..10,2:0..15,3:0..3]. No error, empty/reversed range, duplicate-offset or overflow oracle. File ends with two tests; protobuf/schema conversion has no direct unit roundtrip here. (rust/lance-file/src/versions/v1/format/metadata.rs:236-255)

## Interaction and interpretation limits

All physical lines of this file were read during ANALYZE60. Tests were inspected, not executed. Source remains read-only and offline; no build, test, benchmark, fixture generation or dependency installation was run. Frozen V1 behavior is recorded for compatibility, not proposed as the basis for new features. Concrete V1 binary/plain/dictionary codecs are now analyzed; full V1 reader is now analyzed; V1 statistics are fully analyzed; narrow external caller/helper context is recorded separately. Arithmetic, malformed-input, allocation and cancellation consequences are source-level observations, not executed reproductions. No unsafe block or global mutable state is declared in this file.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::collections::BTreeMap;
    5 | use std::ops::Range;
    6 | 
    7 | use crate::datatypes::{Fields, FieldsWithMeta};
    8 | use crate::format::pb;
    9 | use lance_core::datatypes::Schema;
   10 | use lance_core::deepsize::DeepSizeOf;
   11 | use lance_core::{Error, Result};
   12 | use lance_io::traits::ProtoStruct;
   13 | 
   14 | /// Data File Metadata
   15 | #[derive(Debug, Default, DeepSizeOf, PartialEq)]
   16 | pub struct Metadata {
   17 |     /// Offset of each record batch.
   18 |     pub batch_offsets: Vec<i32>,
   19 | 
   20 |     /// The file position of the page table in the file.
   21 |     pub page_table_position: usize,
   22 | 
   23 |     /// The file position of the manifest block in the file.
   24 |     pub manifest_position: Option<usize>,
   25 | 
   26 |     /// Metadata about statistics.
   27 |     pub stats_metadata: Option<StatisticsMetadata>,
   28 | }
   29 | 
   30 | impl ProtoStruct for Metadata {
   31 |     type Proto = pb::Metadata;
   32 | }
   33 | 
   34 | impl From<&Metadata> for pb::Metadata {
   35 |     fn from(m: &Metadata) -> Self {
   36 |         let statistics = if let Some(stats_meta) = &m.stats_metadata {
   37 |             let fields_with_meta: FieldsWithMeta = (&stats_meta.schema).into();
   38 |             Some(pb::metadata::StatisticsMetadata {
   39 |                 schema: fields_with_meta.fields.0,
   40 |                 fields: stats_meta.leaf_field_ids.clone(),
   41 |                 page_table_position: stats_meta.page_table_position as u64,
   42 |             })
   43 |         } else {
   44 |             None
   45 |         };
   46 | 
   47 |         Self {
   48 |             batch_offsets: m.batch_offsets.clone(),
   49 |             page_table_position: m.page_table_position as u64,
   50 |             manifest_position: m.manifest_position.unwrap_or(0) as u64,
   51 |             statistics,
   52 |         }
   53 |     }
   54 | }
   55 | 
   56 | impl TryFrom<pb::Metadata> for Metadata {
   57 |     type Error = Error;
   58 |     fn try_from(m: pb::Metadata) -> Result<Self> {
   59 |         Ok(Self {
   60 |             batch_offsets: m.batch_offsets.clone(),
   61 |             page_table_position: m.page_table_position as usize,
   62 |             manifest_position: Some(m.manifest_position as usize),
   63 |             stats_metadata: if let Some(stats_meta) = m.statistics {
   64 |                 Some(StatisticsMetadata {
   65 |                     schema: Schema::try_from(FieldsWithMeta {
   66 |                         fields: Fields(stats_meta.schema),
   67 |                         metadata: Default::default(),
   68 |                     })?,
   69 |                     leaf_field_ids: stats_meta.fields,
   70 |                     page_table_position: stats_meta.page_table_position as usize,
   71 |                 })
   72 |             } else {
   73 |                 None
   74 |             },
   75 |         })
   76 |     }
   77 | }
   78 | 
   79 | #[derive(Debug, PartialEq)]
   80 | pub struct BatchOffsets {
   81 |     pub batch_id: i32,
   82 |     pub offsets: Vec<u32>,
   83 | }
   84 | 
   85 | impl Metadata {
   86 |     /// Get the number of batches in this file.
   87 |     pub fn num_batches(&self) -> usize {
   88 |         if self.batch_offsets.is_empty() {
   89 |             0
   90 |         } else {
   91 |             self.batch_offsets.len() - 1
   92 |         }
   93 |     }
   94 | 
   95 |     /// Get the number of records in this file
   96 |     pub fn len(&self) -> usize {
   97 |         *self.batch_offsets.last().unwrap_or(&0) as usize
   98 |     }
   99 | 
  100 |     pub fn is_empty(&self) -> bool {
  101 |         self.len() == 0
  102 |     }
  103 | 
  104 |     /// Push the length of the batch.
  105 |     pub fn push_batch_length(&mut self, batch_len: i32) {
  106 |         if self.batch_offsets.is_empty() {
  107 |             self.batch_offsets.push(0)
  108 |         }
  109 |         self.batch_offsets
  110 |             .push(batch_len + self.batch_offsets.last().unwrap())
  111 |     }
  112 | 
  113 |     /// Get the starting offset of the batch.
  114 |     pub fn get_offset(&self, batch_id: i32) -> Option<i32> {
  115 |         self.batch_offsets.get(batch_id as usize).copied()
  116 |     }
  117 | 
  118 |     /// Get the length of the batch.
  119 |     pub fn get_batch_length(&self, batch_id: i32) -> Option<i32> {
  120 |         self.get_offset(batch_id + 1)
  121 |             .map(|o| o - self.get_offset(batch_id).unwrap_or_default())
  122 |     }
  123 | 
  124 |     /// Group row indices into each batch.
  125 |     ///
  126 |     /// The indices must be sorted.
  127 |     // TODO: pub(crate)
  128 |     pub fn group_indices_to_batches(&self, indices: &[u32]) -> Vec<BatchOffsets> {
  129 |         let mut batch_id: i32 = 0;
  130 |         let num_batches = self.num_batches() as i32;
  131 |         let mut indices_per_batch: BTreeMap<i32, Vec<u32>> = BTreeMap::new();
  132 | 
  133 |         let mut indices = Vec::from(indices);
  134 |         // sort unstable is quick sort and is almost always faster than sort
  135 |         indices.sort_unstable();
  136 | 
  137 |         for idx in indices.iter() {
  138 |             while batch_id < num_batches && *idx >= self.batch_offsets[batch_id as usize + 1] as u32
  139 |             {
  140 |                 batch_id += 1;
  141 |             }
  142 |             indices_per_batch
  143 |                 .entry(batch_id)
  144 |                 .and_modify(|v| v.push(*idx))
  145 |                 .or_insert(vec![*idx]);
  146 |         }
  147 | 
  148 |         indices_per_batch
  149 |             .iter()
  150 |             .map(|(batch_id, indices)| {
  151 |                 let batch_offset = self.batch_offsets[*batch_id as usize];
  152 |                 // Adjust indices to be the in-batch offsets.
  153 |                 let in_batch_offsets = indices
  154 |                     .iter()
  155 |                     .map(|i| i - batch_offset as u32)
  156 |                     .collect::<Vec<_>>();
  157 |                 BatchOffsets {
  158 |                     batch_id: *batch_id,
  159 |                     offsets: in_batch_offsets,
  160 |                 }
  161 |             })
  162 |             .collect()
  163 |     }
  164 | 
  165 |     /// Map the range of row indices to the corresponding batches.
  166 |     ///
  167 |     /// It returns a list of (batch_id, in_batch_range) tuples.
  168 |     // TODO: pub(crate)
  169 |     pub fn range_to_batches(&self, range: Range<usize>) -> Result<Vec<(i32, Range<usize>)>> {
  170 |         if range.end > *(self.batch_offsets.last().unwrap()) as usize {
  171 |             return Err(Error::invalid_input(format!(
  172 |                 "Range {:?} is out of bounds {}",
  173 |                 range,
  174 |                 self.batch_offsets.last().unwrap()
  175 |             )));
  176 |         }
  177 |         let offsets = self.batch_offsets.as_slice();
  178 |         let mut batch_id = offsets
  179 |             .binary_search(&(range.start as i32))
  180 |             .unwrap_or_else(|x| x - 1);
  181 |         let mut batches = vec![];
  182 | 
  183 |         while batch_id < self.num_batches() {
  184 |             let batch_start = offsets[batch_id] as usize;
  185 |             if batch_start >= range.end {
  186 |                 break;
  187 |             }
  188 |             let start = std::cmp::max(range.start, batch_start) - batch_start;
  189 |             let end = std::cmp::min(range.end, offsets[batch_id + 1] as usize) - batch_start;
  190 |             batches.push((batch_id as i32, start..end));
  191 |             batch_id += 1;
  192 |         }
  193 |         Ok(batches)
  194 |     }
  195 | }
  196 | 
  197 | /// Metadata about the statistics
  198 | #[derive(Debug, PartialEq, DeepSizeOf)]
  199 | pub struct StatisticsMetadata {
  200 |     /// Schema of the page-level statistics.
  201 |     ///
  202 |     /// For a given field with id `i`, the statistics are stored in the field
  203 |     /// `i.null_count`, `i.min_value`, and `i.max_value`.
  204 |     pub schema: Schema,
  205 |     pub leaf_field_ids: Vec<i32>,
  206 |     pub page_table_position: usize,
  207 | }
  208 | 
  209 | #[cfg(test)]
  210 | mod tests {
  211 |     use super::*;
  212 | 
  213 |     #[test]
  214 |     fn test_group_indices_to_batch() {
  215 |         let mut metadata = Metadata::default();
  216 |         metadata.push_batch_length(20);
  217 |         metadata.push_batch_length(20);
  218 | 
  219 |         let batches = metadata.group_indices_to_batches(&[6, 24]);
  220 |         assert_eq!(batches.len(), 2);
  221 |         assert_eq!(
  222 |             batches,
  223 |             vec![
  224 |                 BatchOffsets {
  225 |                     batch_id: 0,
  226 |                     offsets: vec![6]
  227 |                 },
  228 |                 BatchOffsets {
  229 |                     batch_id: 1,
  230 |                     offsets: vec![4]
  231 |                 }
  232 |             ]
  233 |         );
  234 |     }
  235 | 
  236 |     #[test]
  237 |     fn test_range_to_batches() {
  238 |         let mut metadata = Metadata::default();
  239 |         for l in [5, 10, 15, 20] {
  240 |             metadata.push_batch_length(l);
  241 |         }
  242 | 
  243 |         let batches = metadata.range_to_batches(0..10).unwrap();
  244 |         assert_eq!(batches, vec![(0, 0..5), (1, 0..5)]);
  245 | 
  246 |         let batches = metadata.range_to_batches(2..10).unwrap();
  247 |         assert_eq!(batches, vec![(0, 2..5), (1, 0..5)]);
  248 | 
  249 |         let batches = metadata.range_to_batches(15..33).unwrap();
  250 |         assert_eq!(batches, vec![(2, 0..15), (3, 0..3)]);
  251 | 
  252 |         let batches = metadata.range_to_batches(14..33).unwrap();
  253 |         assert_eq!(batches, vec![(1, 9..10), (2, 0..15), (3, 0..3)]);
  254 |     }
  255 | }
``````
