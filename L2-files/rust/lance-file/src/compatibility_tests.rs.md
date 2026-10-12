> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/compatibility_tests.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4f0b65de5ab46724fd73c1509a6c93342f3db6f71fe22501d80b3663ec61099b`. Reviewed physical lines: 1-524.

[Module](../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Private cfg(test) compatibility harness compares current writer bytes with pinned baseline fixtures for V1/V2_0/V2_1/V2_2, validates current readers against those bytes, separately checks V2_0 embedded modes, and tests only same-revision V2_3 determinism. (rust/lance-file/src/compatibility_tests.rs:1-524)

## Complete range analysis

### Lines 1-35

SPDX/imports connect Arrow builders/casts/types/schema, Bytes, core cache/schema, encoder/decoder APIs, IO params/writer/size, rstest/Tokio and current/legacy readers/writers plus FsFixture. Entire module is private cfg(test) through lib.rs. (rust/lance-file/src/compatibility_tests.rs:1-35)

### Lines 36-52

compatibility_fixture_batch uses4097 rows: nonnull Int32 IDs0..4096; names null at multiples7 else formatted value-NNNN-deterministic-fixture; lists null at multiples11 else [i, null if i%5==0 otherwise2i,3i]. Numeric child type Int32 and list item nullable. (rust/lance-file/src/compatibility_tests.rs:36-52)

### Lines 53-71

Int8 string dictionary appends null at multiples13 else red/green/blue by remainder0/1/2; first nonnull entry is green. Blob payload is nonnull LargeBinary text blob-NNNN-deterministic-payload for every row. Dictionary insertion unwraps. (rust/lance-file/src/compatibility_tests.rs:53-71)

### Lines 72-99

Five-field Arrow schema: id nonnullable; name nullable Utf8 with compression=none; nullable List(item nullable Int32); nullable Dictionary(Int8,Utf8) with dict-values-compression=none; blob nullable LargeBinary marked lance-encoding:blob=true although actual array has no nulls. Build RecordBatch unwrap; no empty list appears in this original fixture. (rust/lance-file/src/compatibility_tests.rs:72-99)

### Lines 100-135

v1_reader_expected_batch reconstructs fixture-specific lists: original null lists become empty, null child ints become0. Dictionary null keys become green, the first nonnull dictionary value; rebuild dictionary accordingly. Other arrays and full schema remain from input. Comment attributes these losses to historical V1 behavior; this function encodes an expected oracle, not an independently inspected legacy implementation. It assumes this deterministic input. (rust/lance-file/src/compatibility_tests.rs:100-135)

### Lines 136-154

stable_fixture includes static bytes for V1,V2_0,V2_1,V2_2. V2_3 is unreachable with explicit unstable/no-fixture message. This test selection encodes no compatibility promise for prior unstable revisions. (rust/lance-file/src/compatibility_tests.rs:136-154)

### Lines 155-174

assert_blob_column_eq downcasts both to LargeBinary, checks length then each null bit and valid payload; null payload bytes are intentionally not compared. Wrong physical type can panic during cast. (rust/lance-file/src/compatibility_tests.rs:155-174)

### Lines 175-204

assert_record_batch_eq first checks full schema equality,row count,column count. A field literally named blob uses specialized LargeBinary oracle. Other arrays compare ArrayData; mismatch scans single-row slices for first difference then unwraps and panics with field/index/values. If only whole-array representation differs but no individual slice differs, diagnostic unwrap itself panics. (rust/lance-file/src/compatibility_tests.rs:175-204)

### Lines 205-231

footer_version subtracts8 and reads two little-endian u16 with unchecked slice indexing; no size/magic validation. assert_wire_bytes_equal finds first differing byte over zipped common prefix and panics with offset/values, then separately requires lengths equal. Thus equal prefix with extra suffix fails. (rust/lance-file/src/compatibility_tests.rs:205-231)

### Lines 232-256

write_current_fixture creates local FsFixture/object, options cacheSome1 and max-pageSome1024, othersDefault. V1 branch unreachable; V2_0 exact parent factory writes sequential slices of at most1024 rows then finish. For4097 rows there are5 input writes; option cache budget is divided by5 roots in writer initialization, yielding0 per field. (rust/lance-file/src/compatibility_tests.rs:232-256)

### Lines 257-294

V2_1,V2_2,V2_3 branches use their exact factories with the same slice/write/finish sequence. Reopen output and read range0..summary.size_bytes as usize, then copy Bytes into Vec. All errors unwrap; helper contains no assertions on produced contents and is not itself a test. (rust/lance-file/src/compatibility_tests.rs:257-294)

### Lines 295-317

Embedded helper explicitly uses cache1 per column,max-page1024,keep_original=true,alignment64 and exact V2_0 encoding strategy, encodes one supplied batch then returns self-described and mini encodings. These options differ from standard writer total-cache budget and defaultfalse keep-original. (rust/lance-file/src/compatibility_tests.rs:295-317)

### Lines 318-348

Current-reader oracle persists provided bytes into temp object and explicitly shuts down, opens known-size scheduler, no projection/defaultplugins/no_cache/defaultoptions, then asserts normalized exact version and that at least one physical column has more than one page. It does not require every column to have multiple pages. (rust/lance-file/src/compatibility_tests.rs:318-348)

### Lines 349-378

Read RangeFull with batch1024,readahead16,no_filter; collect all batches. Assert total rows, all schemas, then compare each batch against matching expected slice and final offset. It establishes ordered value/null/schema equality for fixture if run, not bounded-memory read behavior or malformed-input handling. (rust/lance-file/src/compatibility_tests.rs:349-378)

### Lines 379-400

rstest cases V2_0/V2_1/V2_2 under tokio::test construct fixture/core schema and load dictionary values, write current bytes, demand byte equality to checked baseline, assert expected standard footer mapping, then read baseline through current reader. This tests writer determinism as well as backward reading for this input; no test execution is claimed. (rust/lance-file/src/compatibility_tests.rs:379-400)

### Lines 401-420

Embedded compatibility uses only id/name columns of first257 rows, converts schema/sets dictionary, generates two byte forms and compares against respective includes. Both expected footer pairs must match V2_0 embedded mapping(2,0). It omits nested/list/dictionary/blob embedded data. (rust/lance-file/src/compatibility_tests.rs:401-420)

### Lines 421-450

Parse self-described fixture with inferred schema and mini fixture with explicit supplied schema. Decode each using no_filter/defaultplugins,false,EncodedBatchLayout::Array,None, then full batch oracle against input. The false/None arguments are preserved literally; detailed decoder option semantics remain outside this file. (rust/lance-file/src/compatibility_tests.rs:421-450)

### Lines 451-466

V2_3 test writes same fixture twice sequentially within current revision, asserts Vec byte equality, exact standard footer and reader roundtrip. It has no baseline fixture or previous-revision compatibility obligation. (rust/lance-file/src/compatibility_tests.rs:451-466)

### Lines 467-502

V1 test loads baseline bytes, constructs core schema with dictionary values, writes five slices via V1Writer<NotSelfDescribing> with collect_stats_for_fields=Some(empty), finishes and reads actual bytes. Assert exact byte equality and V1 standard footer mapping. It is a frozen legacy compatibility check, not a model for new feature writers. (rust/lance-file/src/compatibility_tests.rs:467-502)

### Lines 503-524

Copy baseline V1 bytes into a separate temp object and shutdown; open V1Reader with externally provided schema and read full row range. Assert5 legacy batches and compare against lossy V1 expected transformation. This does not require original null list/child/dictionary-key preservation. (rust/lance-file/src/compatibility_tests.rs:503-524)

## Interaction and interpretation limits

All524 lines read; tests were not run. The checked-in V1, all three standard V2 and both embedded V2_0 binary payloads are now fully interpreted in their supplements; standard V2_2 payload is now fully interpreted. Test assertions describe intended contracts, not observed passing results. No malformed-file, concurrent write, spill, cancellation or full format matrix is established by this one deterministic fixture.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::collections::HashMap;
    5 | use std::sync::Arc;
    6 | 
    7 | use arrow_array::builder::StringDictionaryBuilder;
    8 | use arrow_array::cast::AsArray;
    9 | use arrow_array::types::{Int8Type, Int32Type};
   10 | use arrow_array::{
   11 |     Array, ArrayRef, Int32Array, LargeBinaryArray, ListArray, RecordBatch, StringArray,
   12 | };
   13 | use arrow_schema::{DataType, Field, Schema as ArrowSchema};
   14 | use bytes::Bytes;
   15 | use futures::TryStreamExt;
   16 | use lance_core::cache::LanceCache;
   17 | use lance_core::datatypes::Schema as LanceSchema;
   18 | use lance_encoding::decoder::{DecoderPlugins, EncodedBatchLayout, FilterExpression, decode_batch};
   19 | use lance_encoding::encoder::{EncodedBatch, EncodingOptions, encode_batch};
   20 | use lance_io::ReadBatchParams;
   21 | use lance_io::traits::Writer;
   22 | use lance_io::utils::CachedFileSize;
   23 | use rstest::rstest;
   24 | use tokio::io::AsyncWriteExt;
   25 | 
   26 | use crate::reader::{EncodedBatchReaderExt, FileReader, FileReaderOptions};
   27 | use crate::testing::FsFixture;
   28 | use crate::version::ConcreteFileVersion;
   29 | use crate::versions;
   30 | use crate::versions::v1::reader::FileReader as V1Reader;
   31 | use crate::versions::v1::writer::{
   32 |     FileWriter as V1Writer, FileWriterOptions as V1WriterOptions, NotSelfDescribing,
   33 | };
   34 | use crate::writer::FileWriterOptions;
   35 | 
   36 | fn compatibility_fixture_batch() -> RecordBatch {
   37 |     let row_count = 4097;
   38 |     let ids = Arc::new(Int32Array::from_iter_values(0..row_count)) as ArrayRef;
   39 |     let names = Arc::new(StringArray::from_iter((0..row_count).map(|index| {
   40 |         (index % 7 != 0).then(|| format!("value-{index:04}-deterministic-fixture"))
   41 |     }))) as ArrayRef;
   42 |     let items = Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(
   43 |         (0..row_count).map(|index| {
   44 |             (index % 11 != 0).then(|| {
   45 |                 vec![
   46 |                     Some(index),
   47 |                     (index % 5 != 0).then_some(index * 2),
   48 |                     Some(index * 3),
   49 |                 ]
   50 |             })
   51 |         }),
   52 |     )) as ArrayRef;
   53 |     let mut categories = StringDictionaryBuilder::<Int8Type>::new();
   54 |     for index in 0..row_count {
   55 |         if index % 13 == 0 {
   56 |             categories.append_null();
   57 |         } else {
   58 |             categories
   59 |                 .append(match index % 3 {
   60 |                     0 => "red",
   61 |                     1 => "green",
   62 |                     _ => "blue",
   63 |                 })
   64 |                 .unwrap();
   65 |         }
   66 |     }
   67 |     let categories = Arc::new(categories.finish()) as ArrayRef;
   68 |     let blobs = Arc::new(LargeBinaryArray::from_iter_values(
   69 |         (0..row_count).map(|index| format!("blob-{index:04}-deterministic-payload").into_bytes()),
   70 |     )) as ArrayRef;
   71 | 
   72 |     let schema = Arc::new(ArrowSchema::new(vec![
   73 |         Field::new("id", DataType::Int32, false),
   74 |         Field::new("name", DataType::Utf8, true).with_metadata(HashMap::from([(
   75 |             "lance-encoding:compression".to_string(),
   76 |             "none".to_string(),
   77 |         )])),
   78 |         Field::new(
   79 |             "items",
   80 |             DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
   81 |             true,
   82 |         ),
   83 |         Field::new(
   84 |             "category",
   85 |             DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Utf8)),
   86 |             true,
   87 |         )
   88 |         .with_metadata(HashMap::from([(
   89 |             "lance-encoding:dict-values-compression".to_string(),
   90 |             "none".to_string(),
   91 |         )])),
   92 |         Field::new("blob", DataType::LargeBinary, true).with_metadata(HashMap::from([(
   93 |             "lance-encoding:blob".to_string(),
   94 |             "true".to_string(),
   95 |         )])),
   96 |     ]));
   97 |     RecordBatch::try_new(schema, vec![ids, names, items, categories, blobs]).unwrap()
   98 | }
   99 | 
  100 | fn v1_reader_expected_batch(batch: &RecordBatch) -> RecordBatch {
  101 |     // The V1 reader historically materializes null lists as empty, null child integers as zero,
  102 |     // and null dictionary keys as the first dictionary value.
  103 |     let items = Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(
  104 |         (0..batch.num_rows() as i32).map(|index| {
  105 |             Some(if index % 11 == 0 {
  106 |                 Vec::new()
  107 |             } else {
  108 |                 vec![
  109 |                     Some(index),
  110 |                     Some(if index % 5 == 0 { 0 } else { index * 2 }),
  111 |                     Some(index * 3),
  112 |                 ]
  113 |             })
  114 |         }),
  115 |     )) as ArrayRef;
  116 |     let mut categories = StringDictionaryBuilder::<Int8Type>::new();
  117 |     for index in 0..batch.num_rows() {
  118 |         categories
  119 |             .append(if index % 13 == 0 {
  120 |                 "green"
  121 |             } else {
  122 |                 match index % 3 {
  123 |                     0 => "red",
  124 |                     1 => "green",
  125 |                     _ => "blue",
  126 |                 }
  127 |             })
  128 |             .unwrap();
  129 |     }
  130 |     let categories = Arc::new(categories.finish()) as ArrayRef;
  131 |     let mut columns = batch.columns().to_vec();
  132 |     columns[2] = items;
  133 |     columns[3] = categories;
  134 |     RecordBatch::try_new(batch.schema(), columns).unwrap()
  135 | }
  136 | 
  137 | fn stable_fixture(version: ConcreteFileVersion) -> &'static [u8] {
  138 |     match version {
  139 |         ConcreteFileVersion::V1 => include_bytes!("../test_data/exact_versions/v1.lance"),
  140 |         ConcreteFileVersion::V2_0 => {
  141 |             include_bytes!("../test_data/exact_versions/v2_0.lance")
  142 |         }
  143 |         ConcreteFileVersion::V2_1 => {
  144 |             include_bytes!("../test_data/exact_versions/v2_1.lance")
  145 |         }
  146 |         ConcreteFileVersion::V2_2 => {
  147 |             include_bytes!("../test_data/exact_versions/v2_2.lance")
  148 |         }
  149 |         ConcreteFileVersion::V2_3 => {
  150 |             unreachable!("v2.3 is unstable and has no compatibility fixture")
  151 |         }
  152 |     }
  153 | }
  154 | 
  155 | fn assert_blob_column_eq(actual: &dyn Array, expected: &dyn Array) {
  156 |     let actual = actual.as_binary::<i64>();
  157 |     let expected = expected.as_binary::<i64>();
  158 |     assert_eq!(actual.len(), expected.len());
  159 |     for index in 0..actual.len() {
  160 |         assert_eq!(
  161 |             actual.is_null(index),
  162 |             expected.is_null(index),
  163 |             "blob validity differs at row {index}"
  164 |         );
  165 |         if actual.is_valid(index) {
  166 |             assert_eq!(
  167 |                 actual.value(index),
  168 |                 expected.value(index),
  169 |                 "blob payload differs at row {index}"
  170 |             );
  171 |         }
  172 |     }
  173 | }
  174 | 
  175 | fn assert_record_batch_eq(actual: &RecordBatch, expected: &RecordBatch) {
  176 |     assert_eq!(actual.schema_ref(), expected.schema_ref());
  177 |     assert_eq!(actual.num_rows(), expected.num_rows());
  178 |     assert_eq!(actual.num_columns(), expected.num_columns());
  179 | 
  180 |     for column_index in 0..actual.num_columns() {
  181 |         if expected.schema().field(column_index).name() == "blob" {
  182 |             assert_blob_column_eq(
  183 |                 actual.column(column_index).as_ref(),
  184 |                 expected.column(column_index).as_ref(),
  185 |             );
  186 |         } else if actual.column(column_index).to_data() != expected.column(column_index).to_data() {
  187 |             let row_index = (0..actual.num_rows())
  188 |                 .find(|row_index| {
  189 |                     actual.column(column_index).slice(*row_index, 1).to_data()
  190 |                         != expected.column(column_index).slice(*row_index, 1).to_data()
  191 |                 })
  192 |                 .unwrap();
  193 |             panic!(
  194 |                 "column {} ({}) differs at row {}: actual={:?}, expected={:?}",
  195 |                 column_index,
  196 |                 expected.schema().field(column_index).name(),
  197 |                 row_index,
  198 |                 actual.column(column_index).slice(row_index, 1),
  199 |                 expected.column(column_index).slice(row_index, 1)
  200 |             );
  201 |         }
  202 |     }
  203 | }
  204 | 
  205 | fn footer_version(bytes: &[u8]) -> (u16, u16) {
  206 |     let version_start = bytes.len() - 8;
  207 |     (
  208 |         u16::from_le_bytes([bytes[version_start], bytes[version_start + 1]]),
  209 |         u16::from_le_bytes([bytes[version_start + 2], bytes[version_start + 3]]),
  210 |     )
  211 | }
  212 | 
  213 | fn assert_wire_bytes_equal(actual: &[u8], expected: &[u8]) {
  214 |     if let Some(offset) = actual
  215 |         .iter()
  216 |         .zip(expected)
  217 |         .position(|(actual, expected)| actual != expected)
  218 |     {
  219 |         panic!(
  220 |             "wire fixture first differs at byte {offset}: actual={}, expected={}",
  221 |             actual[offset], expected[offset]
  222 |         );
  223 |     }
  224 |     assert_eq!(
  225 |         actual.len(),
  226 |         expected.len(),
  227 |         "wire fixture length changed after a common {}-byte prefix",
  228 |         actual.len().min(expected.len())
  229 |     );
  230 | }
  231 | 
  232 | async fn write_current_fixture(
  233 |     version: ConcreteFileVersion,
  234 |     batch: &RecordBatch,
  235 |     schema: &LanceSchema,
  236 | ) -> Vec<u8> {
  237 |     let fs = FsFixture::default();
  238 |     let object_writer = fs.object_store.create(&fs.tmp_path).await.unwrap();
  239 |     let options = FileWriterOptions {
  240 |         data_cache_bytes: Some(1),
  241 |         max_page_bytes: Some(1024),
  242 |         ..Default::default()
  243 |     };
  244 |     let summary = match version {
  245 |         ConcreteFileVersion::V1 => {
  246 |             unreachable!("legacy fixtures use the legacy writer")
  247 |         }
  248 |         ConcreteFileVersion::V2_0 => {
  249 |             let mut writer =
  250 |                 versions::v2_0::create_writer(object_writer, schema.clone(), options).unwrap();
  251 |             for offset in (0..batch.num_rows()).step_by(1024) {
  252 |                 let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  253 |                 writer.write_batch(&slice).await.unwrap();
  254 |             }
  255 |             writer.finish().await.unwrap()
  256 |         }
  257 |         ConcreteFileVersion::V2_1 => {
  258 |             let mut writer =
  259 |                 versions::v2_1::create_writer(object_writer, schema.clone(), options).unwrap();
  260 |             for offset in (0..batch.num_rows()).step_by(1024) {
  261 |                 let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  262 |                 writer.write_batch(&slice).await.unwrap();
  263 |             }
  264 |             writer.finish().await.unwrap()
  265 |         }
  266 |         ConcreteFileVersion::V2_2 => {
  267 |             let mut writer =
  268 |                 versions::v2_2::create_writer(object_writer, schema.clone(), options).unwrap();
  269 |             for offset in (0..batch.num_rows()).step_by(1024) {
  270 |                 let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  271 |                 writer.write_batch(&slice).await.unwrap();
  272 |             }
  273 |             writer.finish().await.unwrap()
  274 |         }
  275 |         ConcreteFileVersion::V2_3 => {
  276 |             let mut writer =
  277 |                 versions::v2_3::create_writer(object_writer, schema.clone(), options).unwrap();
  278 |             for offset in (0..batch.num_rows()).step_by(1024) {
  279 |                 let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  280 |                 writer.write_batch(&slice).await.unwrap();
  281 |             }
  282 |             writer.finish().await.unwrap()
  283 |         }
  284 |     };
  285 |     fs.object_store
  286 |         .open(&fs.tmp_path)
  287 |         .await
  288 |         .unwrap()
  289 |         .get_range(0..summary.size_bytes as usize)
  290 |         .await
  291 |         .unwrap()
  292 |         .to_vec()
  293 | }
  294 | 
  295 | async fn write_v2_0_embedded_fixtures(batch: &RecordBatch, schema: &LanceSchema) -> (Bytes, Bytes) {
  296 |     let options = EncodingOptions {
  297 |         cache_bytes_per_column: 1,
  298 |         max_page_bytes: 1024,
  299 |         keep_original_array: true,
  300 |         buffer_alignment: 64,
  301 |     };
  302 |     let encoding_strategy = crate::versions::v2_0::encoding_strategy();
  303 |     let encoded_batch = encode_batch(
  304 |         batch,
  305 |         Arc::new(schema.clone()),
  306 |         encoding_strategy.as_ref(),
  307 |         &options,
  308 |     )
  309 |     .await
  310 |     .unwrap();
  311 | 
  312 |     (
  313 |         versions::v2_0::encode_self_described_batch(&encoded_batch).unwrap(),
  314 |         versions::v2_0::encode_mini_batch(&encoded_batch).unwrap(),
  315 |     )
  316 | }
  317 | 
  318 | async fn assert_current_reader_roundtrip(
  319 |     fixture: &[u8],
  320 |     version: ConcreteFileVersion,
  321 |     expected: &RecordBatch,
  322 | ) {
  323 |     let fs = FsFixture::default();
  324 |     let mut fixture_writer = fs.object_store.create(&fs.tmp_path).await.unwrap();
  325 |     fixture_writer.write_all(fixture).await.unwrap();
  326 |     Writer::shutdown(fixture_writer.as_mut()).await.unwrap();
  327 |     let scheduler = fs
  328 |         .scheduler
  329 |         .open_file(&fs.tmp_path, &CachedFileSize::new(fixture.len() as u64))
  330 |         .await
  331 |         .unwrap();
  332 |     let reader = FileReader::try_open(
  333 |         scheduler,
  334 |         None,
  335 |         Arc::<DecoderPlugins>::default(),
  336 |         &LanceCache::no_cache(),
  337 |         FileReaderOptions::default(),
  338 |     )
  339 |     .await
  340 |     .unwrap();
  341 |     assert_eq!(reader.metadata().version(), version);
  342 |     assert!(
  343 |         reader
  344 |             .metadata()
  345 |             .column_metadatas
  346 |             .iter()
  347 |             .any(|metadata| metadata.pages.len() > 1)
  348 |     );
  349 |     let batches = reader
  350 |         .read_stream(
  351 |             ReadBatchParams::RangeFull,
  352 |             1024,
  353 |             16,
  354 |             FilterExpression::no_filter(),
  355 |         )
  356 |         .await
  357 |         .unwrap()
  358 |         .try_collect::<Vec<_>>()
  359 |         .await
  360 |         .unwrap();
  361 |     assert_eq!(
  362 |         batches.iter().map(RecordBatch::num_rows).sum::<usize>(),
  363 |         expected.num_rows()
  364 |     );
  365 |     assert!(
  366 |         batches
  367 |             .iter()
  368 |             .all(|actual| actual.schema_ref() == expected.schema_ref())
  369 |     );
  370 |     let mut row_offset = 0;
  371 |     for actual in &batches {
  372 |         let expected = expected.slice(row_offset, actual.num_rows());
  373 |         assert_record_batch_eq(actual, &expected);
  374 |         row_offset += actual.num_rows();
  375 |     }
  376 |     assert_eq!(row_offset, expected.num_rows());
  377 | }
  378 | 
  379 | #[rstest]
  380 | #[case::v2_0(ConcreteFileVersion::V2_0)]
  381 | #[case::v2_1(ConcreteFileVersion::V2_1)]
  382 | #[case::v2_2(ConcreteFileVersion::V2_2)]
  383 | #[tokio::test]
  384 | async fn stable_current_writer_and_reader_are_wire_compatible(
  385 |     #[case] version: ConcreteFileVersion,
  386 | ) {
  387 |     let batch = compatibility_fixture_batch();
  388 |     let mut schema = LanceSchema::try_from(batch.schema().as_ref()).unwrap();
  389 |     schema.set_dictionary(&batch).unwrap();
  390 | 
  391 |     let actual = write_current_fixture(version, &batch, &schema).await;
  392 |     let expected = stable_fixture(version);
  393 |     assert_wire_bytes_equal(&actual, expected);
  394 |     assert_eq!(
  395 |         footer_version(expected),
  396 |         version.to_standard_footer_numbers()
  397 |     );
  398 |     assert_current_reader_roundtrip(expected, version, &batch).await;
  399 | }
  400 | 
  401 | #[tokio::test]
  402 | async fn v2_0_embedded_writer_and_reader_are_wire_compatible() {
  403 |     let batch = compatibility_fixture_batch()
  404 |         .project(&[0, 1])
  405 |         .unwrap()
  406 |         .slice(0, 257);
  407 |     let mut schema = LanceSchema::try_from(batch.schema().as_ref()).unwrap();
  408 |     schema.set_dictionary(&batch).unwrap();
  409 | 
  410 |     let (actual_self_described, actual_mini) = write_v2_0_embedded_fixtures(&batch, &schema).await;
  411 |     let expected_self_described =
  412 |         include_bytes!("../test_data/exact_versions/v2_0_self_described.lance");
  413 |     let expected_mini = include_bytes!("../test_data/exact_versions/v2_0_mini.lance");
  414 |     assert_wire_bytes_equal(&actual_self_described, expected_self_described);
  415 |     assert_wire_bytes_equal(&actual_mini, expected_mini);
  416 | 
  417 |     let expected_footer = ConcreteFileVersion::V2_0.to_embedded_footer_numbers();
  418 |     assert_eq!(footer_version(expected_self_described), expected_footer);
  419 |     assert_eq!(footer_version(expected_mini), expected_footer);
  420 | 
  421 |     let self_described =
  422 |         EncodedBatch::try_from_self_described_lance(Bytes::from_static(expected_self_described))
  423 |             .unwrap();
  424 |     let decoded = decode_batch(
  425 |         &self_described,
  426 |         &FilterExpression::no_filter(),
  427 |         Arc::<DecoderPlugins>::default(),
  428 |         false,
  429 |         EncodedBatchLayout::Array,
  430 |         None,
  431 |     )
  432 |     .await
  433 |     .unwrap();
  434 |     assert_record_batch_eq(&decoded, &batch);
  435 | 
  436 |     let mini =
  437 |         EncodedBatch::try_from_mini_lance(Bytes::from_static(expected_mini), &schema).unwrap();
  438 |     let decoded = decode_batch(
  439 |         &mini,
  440 |         &FilterExpression::no_filter(),
  441 |         Arc::<DecoderPlugins>::default(),
  442 |         false,
  443 |         EncodedBatchLayout::Array,
  444 |         None,
  445 |     )
  446 |     .await
  447 |     .unwrap();
  448 |     assert_record_batch_eq(&decoded, &batch);
  449 | }
  450 | 
  451 | #[tokio::test]
  452 | async fn v2_3_output_is_deterministic_within_the_current_revision() {
  453 |     let batch = compatibility_fixture_batch();
  454 |     let mut schema = LanceSchema::try_from(batch.schema().as_ref()).unwrap();
  455 |     schema.set_dictionary(&batch).unwrap();
  456 | 
  457 |     let first = write_current_fixture(ConcreteFileVersion::V2_3, &batch, &schema).await;
  458 |     let second = write_current_fixture(ConcreteFileVersion::V2_3, &batch, &schema).await;
  459 |     assert_eq!(first, second);
  460 |     assert_eq!(
  461 |         footer_version(&first),
  462 |         ConcreteFileVersion::V2_3.to_standard_footer_numbers()
  463 |     );
  464 |     assert_current_reader_roundtrip(&first, ConcreteFileVersion::V2_3, &batch).await;
  465 | }
  466 | 
  467 | #[tokio::test]
  468 | async fn v1_writer_and_reader_are_wire_compatible() {
  469 |     let expected = stable_fixture(ConcreteFileVersion::V1);
  470 |     let batch = compatibility_fixture_batch();
  471 |     let mut schema = LanceSchema::try_from(batch.schema().as_ref()).unwrap();
  472 |     schema.set_dictionary(&batch).unwrap();
  473 |     let fs = FsFixture::default();
  474 |     let mut writer = V1Writer::<NotSelfDescribing>::try_new(
  475 |         fs.object_store.as_ref(),
  476 |         &fs.tmp_path,
  477 |         schema.clone(),
  478 |         &V1WriterOptions {
  479 |             collect_stats_for_fields: Some(Vec::new()),
  480 |         },
  481 |     )
  482 |     .await
  483 |     .unwrap();
  484 |     for offset in (0..batch.num_rows()).step_by(1024) {
  485 |         let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  486 |         writer.write(std::slice::from_ref(&slice)).await.unwrap();
  487 |     }
  488 |     let summary = writer.finish().await.unwrap();
  489 |     let actual = fs
  490 |         .object_store
  491 |         .open(&fs.tmp_path)
  492 |         .await
  493 |         .unwrap()
  494 |         .get_range(0..summary.size_bytes as usize)
  495 |         .await
  496 |         .unwrap();
  497 |     assert_wire_bytes_equal(actual.as_ref(), expected);
  498 |     assert_eq!(
  499 |         footer_version(expected),
  500 |         ConcreteFileVersion::V1.to_standard_footer_numbers()
  501 |     );
  502 | 
  503 |     let fixture_fs = FsFixture::default();
  504 |     let mut fixture_writer = fixture_fs
  505 |         .object_store
  506 |         .create(&fixture_fs.tmp_path)
  507 |         .await
  508 |         .unwrap();
  509 |     fixture_writer.write_all(expected).await.unwrap();
  510 |     Writer::shutdown(fixture_writer.as_mut()).await.unwrap();
  511 |     let reader = V1Reader::try_new(
  512 |         fixture_fs.object_store.as_ref(),
  513 |         &fixture_fs.tmp_path,
  514 |         schema.clone(),
  515 |     )
  516 |     .await
  517 |     .unwrap();
  518 |     let actual_batch = reader
  519 |         .read_range(0..batch.num_rows(), &schema)
  520 |         .await
  521 |         .unwrap();
  522 |     assert_eq!(reader.num_batches(), 5);
  523 |     assert_record_batch_eq(&actual_batch, &v1_reader_expected_batch(&batch));
  524 | }
``````
