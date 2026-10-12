> **Frozen snapshot — verified through iteration 85.** The document body below is retained verbatim. Its coverage, pending-work and test/fixture statements describe that historical verification scope, not current obligations. V2.1 permits source access and requires contracts plus navigation; see [current protocol](../../../../../../V21-PROTOCOL.md).

# rust/lance-file/src/versions/v1/page_table.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `6ffec60d133731d8ff8638a457065c64f0099a07b78987f8dd7ec1eed2d0d4b2`. Reviewed physical lines: 1-287.

[Module](../../../../../../L1-modules/rust-lance-file-v1-foundation.md) · [Symbols](../../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../../README.md)

## Role and visibility

Public frozen V1 page lookup structures and dense field-ID-major page-table load/write. Converts sparse in-memory BTreeMaps into an implicit-dimension signed64 pair matrix; dimensions come from external schema/metadata. (rust/lance-file/src/versions/v1/page_table.rs:1-287)

## Complete range analysis

### Lines 1-15

SPDX/imports bring Arrow Int64 builder/array/DataType, core DeepSizeOf/errors, BTreeMap, Tokio AsyncWriteExt, Reader/Writer and V1 PlainDecoder. This writer emits an Arrow values buffer directly, while loader delegates array decoding to the concrete PlainDecoder. (rust/lance-file/src/versions/v1/page_table.rs:1-15)

### Lines 16-27

PageInfo is public Clone/Debug/PartialEq/DeepSizeOf with position:usize and length:usize. new stores both without validation. Observed fixed/binary/dictionary writer callers pass logical array length, not encoded byte size; length interpretation belongs to the page encoding. (rust/lance-file/src/versions/v1/page_table.rs:16-27)

### Lines 28-35

PageTable is public Debug/Default/Clone/PartialEq/DeepSizeOf; private pages maps signed field_id -> signed batch_id -> PageInfo in sorted BTreeMaps. Default is empty. Clone duplicates maps and values; no Arc/cache or interior mutation is owned here. (rust/lance-file/src/versions/v1/page_table.rs:28-35)

### Lines 36-66

Public async load accepts borrowed reader, table position, signed inclusive min/max IDs and signed number of batches. Documentation requires caller dimensions and explains0/0 for absent/struct pages. Only max<min is explicitly rejected, as Internal with both values; negative IDs or num_batches are not rejected. (rust/lance-file/src/versions/v1/page_table.rs:36-66)

### Lines 67-74

Count inclusive field-ID range, compute ordinary usize length=num_columns*(num_batches as usize)*2, construct Int64 PlainDecoder and await decode, then unwrap Int64 downcast. Multiplication/casts, decoded length and values are not independently checked here. Negative batch count can imply a huge requested length; concrete IO/decode failures are delegated. Whole raw table is decoded before map expansion. (rust/lance-file/src/versions/v1/page_table.rs:67-74)

### Lines 75-93

For every field in the inclusive range insert an inner map; for batch0..num_batches use signed idx=field_pos_as_i32*num_batches+batch and read pair at2idx,2idx+1. Convert each signed64 position/length to usize unchecked and insert, including0/0 holes. Map lookup unwrap follows local insertion; array indexing relies on decoded shape. Negative values are not rejected. num_batches0 returns nonempty outer maps with empty inner maps, a state the writer does not safely handle. (rust/lance-file/src/versions/v1/page_table.rs:75-93)

### Lines 94-117

write documents dense placeholders. Reject completely empty outer map with InvalidInput source empty page table. Then reject supplied min_field_id>observed minimum with InvalidInput whose message uses field_id_offset. Take observed max and build inclusive[min,max]. Lower min is allowed to include ancestor/hole fields; all checks here precede writer.tell. (rust/lance-file/src/versions/v1/page_table.rs:94-117)

### Lines 118-128

Await writer.tell for start position, then find maximum batch key across all inner maps, unwrap it, and add1. Nonempty outer/all-empty inner maps panic at unwrap after tell; batch-ID max overflow and casts are unchecked. Int64Builder capacity is field_count*num_batches, although two values will be appended per cell, so it underestimates final element count. No dimensions are persisted in this method. (rust/lance-file/src/versions/v1/page_table.rs:118-128)

### Lines 129-146

Iterate field-major then batch0..num_batches. Existing PageInfo appends position and length cast to i64; missing pair appends[0,0]. Finish Int64Array and write_all its first Arrow buffer directly, then return prior tell position. No explicit endian conversion, alignment, length prefix, footer, flush/shutdown or atomic/abort guard appears. A partial write/error/cancellation can leave output bytes; successful return is not publication/durability. A table whose only batch key is-1 derives0batches and writes an empty buffer; more negative/overflowed dimensions remain unchecked. (rust/lance-file/src/versions/v1/page_table.rs:129-146)

### Lines 147-154

set inserts/creates field map and overwrites an existing same(field,batch) entry, discarding the old value. Accepts negative field/batch IDs and arbitrary PageInfo. Struct/hole zero entries are not automatically added in memory. (rust/lance-file/src/versions/v1/page_table.rs:147-154)

### Lines 155-161

get returns borrowed Option<&PageInfo> via two map lookups. A missing entry is None; an explicit or loaded0/0 entry is Some, so sparse pre-write and dense post-load maps need not compare equal. No IO or normalization. (rust/lance-file/src/versions/v1/page_table.rs:155-161)

### Lines 162-180

Private cfg(test) module imports temp file, pretty equality and LocalObjectReader. test_set_page_info creates PageInfo(1,2), stores at(10,20), unwraps get and compares. No overwrite/missing/negative-key tests. (rust/lance-file/src/versions/v1/page_table.rs:162-180)

### Lines 181-221

Roundtrip fixture sets populated cells(10,2),(11,1),(13,0..3) to(1,2), leaves field12 absent, supplies leading struct field9, writes to local tempfile, explicitly shuts down, then loads fields9..13 with4batches. Read/write success is unwrapped; fixture spans20cells. (rust/lance-file/src/versions/v1/page_table.rs:181-221)

### Lines 222-247

Test expected is actual.clone(), not original sparse fixture. It overwrites14 known missing cells with(0,0), then compares expected==actual. Therefore it verifies those holes/ancestor rows were decoded as zeros, but does not independently assert the six populated cells retain(1,2), table byte length/order or all expected shape. The test name alone does not establish full roundtrip correctness. (rust/lance-file/src/versions/v1/page_table.rs:222-247)

### Lines 248-273

Error test first requires empty write error to be InvalidInput with empty-page substring, then inserts(0,0)->(1,2) and requires write(min1) InvalidInput with exact offset/min substring. Files are recreated/truncated between calls; no read/write failure injection or offset-state assertions. (rust/lance-file/src/versions/v1/page_table.rs:248-273)

### Lines 274-287

Error test writes valid min0 table, opens reader without explicit shutdown of this last writer, calls load(min1,max0,batches1) and asserts Internal/message before any decoding. No reversed batch count, zero-batch rewrite, signed-size, overflow, corrupt table or partial IO test. File ends with three tests. (rust/lance-file/src/versions/v1/page_table.rs:274-287)

## Interaction and interpretation limits

All physical lines of this file were read during ANALYZE60. Tests were inspected, not executed. Source remains read-only and offline; no build, test, benchmark, fixture generation or dependency installation was run. Frozen V1 behavior is recorded for compatibility, not proposed as the basis for new features. Concrete V1 binary/plain/dictionary codecs are now analyzed; full V1 reader is now analyzed; V1 statistics are fully analyzed; narrow external caller/helper context is recorded separately. Arithmetic, malformed-input, allocation and cancellation consequences are source-level observations, not executed reproductions. No unsafe block or global mutable state is declared in this file.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use arrow_array::builder::Int64Builder;
    5 | use arrow_array::{Array, Int64Array};
    6 | use arrow_schema::DataType;
    7 | use lance_core::deepsize::DeepSizeOf;
    8 | use std::collections::BTreeMap;
    9 | use tokio::io::AsyncWriteExt;
   10 | 
   11 | use lance_core::{Error, Result};
   12 | use lance_io::traits::{Reader, Writer};
   13 | 
   14 | use super::encoding::plain::PlainDecoder;
   15 | 
   16 | #[derive(Clone, Debug, PartialEq, DeepSizeOf)]
   17 | pub struct PageInfo {
   18 |     pub position: usize,
   19 |     pub length: usize,
   20 | }
   21 | 
   22 | impl PageInfo {
   23 |     pub fn new(position: usize, length: usize) -> Self {
   24 |         Self { position, length }
   25 |     }
   26 | }
   27 | 
   28 | /// Page lookup table.
   29 | ///
   30 | #[derive(Debug, Default, Clone, PartialEq, DeepSizeOf)]
   31 | pub struct PageTable {
   32 |     /// map[field-id,  map[batch-id, PageInfo]]
   33 |     pages: BTreeMap<i32, BTreeMap<i32, PageInfo>>,
   34 | }
   35 | 
   36 | impl PageTable {
   37 |     /// Load [PageTable] from disk.
   38 |     ///
   39 |     /// Parameters:
   40 |     ///  * `position`: The start position in the file where the page table is stored.
   41 |     ///  * `min_field_id`: The smallest field_id that is present in the schema.
   42 |     ///  * `max_field_id`: The largest field_id that is present in the schema.
   43 |     ///  * `num_batches`: The number of batches in the file.
   44 |     ///
   45 |     /// The page table is stored as an array. The on-disk size is determined based
   46 |     /// on the `min_field_id`, `max_field_id`, and `num_batches` parameters. If
   47 |     /// these are incorrect, the page table will not be read correctly.
   48 |     ///
   49 |     /// The full sequence of field ids `min_field_id..=max_field_id` will be loaded.
   50 |     /// Non-existent pages will be represented as (0, 0) in the page table. Pages
   51 |     /// can be non-existent because they are not present in the file, or because
   52 |     /// they are struct fields which have no data pages.
   53 |     pub async fn load(
   54 |         reader: &dyn Reader,
   55 |         position: usize,
   56 |         min_field_id: i32,
   57 |         max_field_id: i32,
   58 |         num_batches: i32,
   59 |     ) -> Result<Self> {
   60 |         if max_field_id < min_field_id {
   61 |             return Err(Error::internal(format!(
   62 |                 "max_field_id {} is less than min_field_id {}",
   63 |                 max_field_id, min_field_id
   64 |             )));
   65 |         }
   66 | 
   67 |         let field_ids = min_field_id..=max_field_id;
   68 |         let num_columns = field_ids.clone().count();
   69 |         let length = num_columns * num_batches as usize * 2;
   70 |         let decoder = PlainDecoder::new(reader, &DataType::Int64, position, length)?;
   71 |         let raw_arr = decoder.decode().await?;
   72 |         let arr = raw_arr.as_any().downcast_ref::<Int64Array>().unwrap();
   73 | 
   74 |         let mut pages = BTreeMap::default();
   75 |         for (field_pos, field_id) in field_ids.enumerate() {
   76 |             pages.insert(field_id, BTreeMap::default());
   77 |             for batch in 0..num_batches {
   78 |                 let idx = field_pos as i32 * num_batches + batch;
   79 |                 let batch_position = &arr.value((idx * 2) as usize);
   80 |                 let batch_length = &arr.value((idx * 2 + 1) as usize);
   81 |                 pages.get_mut(&field_id).unwrap().insert(
   82 |                     batch,
   83 |                     PageInfo {
   84 |                         position: *batch_position as usize,
   85 |                         length: *batch_length as usize,
   86 |                     },
   87 |                 );
   88 |             }
   89 |         }
   90 | 
   91 |         Ok(Self { pages })
   92 |     }
   93 | 
   94 |     /// Write [PageTable] to disk.
   95 |     ///
   96 |     /// `min_field_id` is the smallest field_id that is present in the schema.
   97 |     /// This might be a struct field, which has no data pages, but it still must
   98 |     /// be serialized to the page table per the format spec.
   99 |     ///
  100 |     /// Any (field_id, batch_id) combinations that are not present in the page table
  101 |     /// will be written as (0, 0) to indicate an empty page. This includes any
  102 |     /// holes in the field ids as well as struct fields which have no data pages.
  103 |     pub async fn write(&self, writer: &mut dyn Writer, min_field_id: i32) -> Result<usize> {
  104 |         if self.pages.is_empty() {
  105 |             return Err(Error::invalid_input_source("empty page table".into()));
  106 |         }
  107 | 
  108 |         let observed_min = *self.pages.keys().min().unwrap();
  109 |         if min_field_id > *self.pages.keys().min().unwrap() {
  110 |             return Err(Error::invalid_input(format!(
  111 |                 "field_id_offset {} is greater than the minimum field_id {}",
  112 |                 min_field_id, observed_min
  113 |             )));
  114 |         }
  115 |         let max_field_id = *self.pages.keys().max().unwrap();
  116 |         let field_ids = min_field_id..=max_field_id;
  117 | 
  118 |         let pos = writer.tell().await?;
  119 |         let num_batches = self
  120 |             .pages
  121 |             .values()
  122 |             .flat_map(|c_map| c_map.keys().max())
  123 |             .max()
  124 |             .unwrap()
  125 |             + 1;
  126 | 
  127 |         let mut builder =
  128 |             Int64Builder::with_capacity(field_ids.clone().count() * num_batches as usize);
  129 |         for field_id in field_ids {
  130 |             for batch in 0..num_batches {
  131 |                 if let Some(page_info) = self.get(field_id, batch) {
  132 |                     builder.append_value(page_info.position as i64);
  133 |                     builder.append_value(page_info.length as i64);
  134 |                 } else {
  135 |                     builder.append_slice(&[0, 0]);
  136 |                 }
  137 |             }
  138 |         }
  139 |         let arr = builder.finish();
  140 |         writer
  141 |             .write_all(arr.into_data().buffers()[0].as_slice())
  142 |             .await?;
  143 | 
  144 |         Ok(pos)
  145 |     }
  146 | 
  147 |     /// Set page lookup info for a page identified by `(column, batch)` pair.
  148 |     pub fn set(&mut self, field_id: i32, batch: i32, page_info: PageInfo) {
  149 |         self.pages
  150 |             .entry(field_id)
  151 |             .or_default()
  152 |             .insert(batch, page_info);
  153 |     }
  154 | 
  155 |     pub fn get(&self, field_id: i32, batch: i32) -> Option<&PageInfo> {
  156 |         self.pages
  157 |             .get(&field_id)
  158 |             .and_then(|c_map| c_map.get(&batch))
  159 |     }
  160 | }
  161 | 
  162 | #[cfg(test)]
  163 | mod tests {
  164 | 
  165 |     use super::*;
  166 |     use lance_core::utils::tempfile::TempStdFile;
  167 |     use pretty_assertions::assert_eq;
  168 | 
  169 |     use lance_io::local::LocalObjectReader;
  170 | 
  171 |     #[test]
  172 |     fn test_set_page_info() {
  173 |         let mut page_table = PageTable::default();
  174 |         let page_info = PageInfo::new(1, 2);
  175 |         page_table.set(10, 20, page_info.clone());
  176 | 
  177 |         let actual = page_table.get(10, 20).unwrap();
  178 |         assert_eq!(actual, &page_info);
  179 |     }
  180 | 
  181 |     #[tokio::test]
  182 |     async fn test_roundtrip_page_info() {
  183 |         let mut page_table = PageTable::default();
  184 |         let page_info = PageInfo::new(1, 2);
  185 | 
  186 |         // Add fields 10..14, 4 batches with some missing
  187 |         page_table.set(10, 2, page_info.clone());
  188 |         page_table.set(11, 1, page_info.clone());
  189 |         // A hole at 12
  190 |         page_table.set(13, 0, page_info.clone());
  191 |         page_table.set(13, 1, page_info.clone());
  192 |         page_table.set(13, 2, page_info.clone());
  193 |         page_table.set(13, 3, page_info.clone());
  194 | 
  195 |         let path = TempStdFile::default();
  196 | 
  197 |         // The first field_id with entries is 10, but if it's inside of a struct
  198 |         // the struct itself needs to be included in the page table. We use 9
  199 |         // here to represent the struct.
  200 |         let starting_field_id = 9;
  201 | 
  202 |         let mut writer = tokio::fs::File::create(&path).await.unwrap();
  203 |         let pos = page_table
  204 |             .write(&mut writer, starting_field_id)
  205 |             .await
  206 |             .unwrap();
  207 |         AsyncWriteExt::shutdown(&mut writer).await.unwrap();
  208 | 
  209 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  210 |             .await
  211 |             .unwrap();
  212 |         let actual = PageTable::load(
  213 |             reader.as_ref(),
  214 |             pos,
  215 |             starting_field_id, // First field id is 10, but we want to start at 9
  216 |             13,                // Last field id is 13
  217 |             4,                 // 4 batches
  218 |         )
  219 |         .await
  220 |         .unwrap();
  221 | 
  222 |         // Output should have filled in the empty pages.
  223 |         let mut expected = actual.clone();
  224 |         let default_page_info = PageInfo::new(0, 0);
  225 |         let expected_default_pages = [
  226 |             (9, 0),
  227 |             (9, 1),
  228 |             (9, 2),
  229 |             (9, 3),
  230 |             (10, 0),
  231 |             (10, 1),
  232 |             (10, 3),
  233 |             (11, 0),
  234 |             (11, 2),
  235 |             (11, 3),
  236 |             (12, 0),
  237 |             (12, 1),
  238 |             (12, 2),
  239 |             (12, 3),
  240 |         ];
  241 |         for (field_id, batch) in expected_default_pages.iter() {
  242 |             expected.set(*field_id, *batch, default_page_info.clone());
  243 |         }
  244 | 
  245 |         assert_eq!(expected, actual);
  246 |     }
  247 | 
  248 |     #[tokio::test]
  249 |     async fn test_error_handling() {
  250 |         let mut page_table = PageTable::default();
  251 | 
  252 |         let path = TempStdFile::default();
  253 | 
  254 |         // Returns an error if the page table is empty
  255 |         let mut writer = tokio::fs::File::create(&path).await.unwrap();
  256 |         let res = page_table.write(&mut writer, 1).await;
  257 |         assert!(res.is_err());
  258 |         assert!(
  259 |             matches!(res.unwrap_err(), Error::InvalidInput { source, .. } if source.to_string().contains("empty page table"))
  260 |         );
  261 | 
  262 |         let page_info = PageInfo::new(1, 2);
  263 |         page_table.set(0, 0, page_info.clone());
  264 | 
  265 |         // Returns an error if passing a min_field_id higher than the lowest field_id
  266 |         let mut writer = tokio::fs::File::create(&path).await.unwrap();
  267 |         let res = page_table.write(&mut writer, 1).await;
  268 |         assert!(res.is_err());
  269 |         assert!(
  270 |             matches!(res.unwrap_err(), Error::InvalidInput { source, .. } 
  271 |                 if source.to_string().contains("field_id_offset 1 is greater than the minimum field_id 0"))
  272 |         );
  273 | 
  274 |         let mut writer = tokio::fs::File::create(&path).await.unwrap();
  275 |         let res = page_table.write(&mut writer, 0).await.unwrap();
  276 | 
  277 |         let reader = LocalObjectReader::open_local_path(&path, 1024, None)
  278 |             .await
  279 |             .unwrap();
  280 | 
  281 |         // Returns an error if max_field_id is less than min_field_id
  282 |         let res = PageTable::load(reader.as_ref(), res, 1, 0, 1).await;
  283 |         assert!(res.is_err());
  284 |         assert!(matches!(res.unwrap_err(), Error::Internal { message, .. }
  285 |                 if message.contains("max_field_id 0 is less than min_field_id 1")));
  286 |     }
  287 | }
``````
