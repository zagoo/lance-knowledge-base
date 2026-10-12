> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../../V21-PROTOCOL.md).

# rust/lance-file/test_data/exact_versions/datagen.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e79f91f3560375cf39e8b38402eb10256c67eda9351bdd4ba5770b5c59200057`. Reviewed physical lines: 1-228.

[Module](../../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../../L3-symbols/format-spec.md) · [Entry](../../../../../README.md)

## Role and visibility

Standalone Rust example source intended for the pinned historical baseline API, not the current crate. Produces six deterministic binary fixtures from explicit Arrow data and baseline writers. Python copies it into a baseline examples directory before compilation. (rust/lance-file/test_data/exact_versions/datagen.rs:1-228)

## Complete range analysis

### Lines 1-24

SPDX/imports include Arrow fixtures, async_trait, core schema, baseline default_encoding_strategy/encode_batch, previous legacy writer/ManifestProvider, FsFixture, selector and EncodedBatchWriteExt APIs. DynError=Box<dyn Error+Send+Sync> supports heterogeneous fallible generator operations. (rust/lance-file/test_data/exact_versions/datagen.rs:1-24)

### Lines 25-36

Private NoManifest implements baseline async ManifestProvider::store_schema for any supplied writer/schema, returns Ok(None) and writes nothing. This selects no embedded legacy schema publication for V1 fixture. (rust/lance-file/test_data/exact_versions/datagen.rs:25-36)

### Lines 37-53

Build4097 IDs and nullable names/list values using the same remainder rules as current compatibility fixture. Names format width4; list nonnull rows contain i, optional2i,3i; multiples11 null lists. No randomness. (rust/lance-file/test_data/exact_versions/datagen.rs:37-53)

### Lines 54-72

DictionaryInt8 uses nulls at multiples13 and red/green/blue by remainder, with explicit expect on append. All LargeBinary payloads deterministic and nonnull. First dictionary value green. (rust/lance-file/test_data/exact_versions/datagen.rs:54-72)

### Lines 73-101

Schema names/types/nullability and compression/blob metadata match compatibility fixture; RecordBatch::try_new expect reports schema/array disagreement. Nullable blob declaration does not add null values. (rust/lance-file/test_data/exact_versions/datagen.rs:73-101)

### Lines 102-132

write_current_fixture uses baseline FileWriter::try_new with total cacheSome1,max-pageSome1024,format_versionSome(selector),otherDefault. Write slices up to1024, finish, reopen and read reported byte range into Vec. IO/encoding errors propagate DynError. The name current means current in the pinned baseline build, not live repository API. (rust/lance-file/test_data/exact_versions/datagen.rs:102-132)

### Lines 133-157

write_v1_fixture uses V1Writer<NoManifest>, explicit schema and empty stats collection, same five-slice sequence; finish and collect raw bytes. It does not compare or decode outputs itself. (rust/lance-file/test_data/exact_versions/datagen.rs:133-157)

### Lines 158-184

Embedded helper fixes V2_0, EncodingOptions(cache1,max1024,keeptrue,alignment64,version), chooses baseline default strategy, encode_batch, then baseline extension self-described and mini conversions, copying both Bytes into Vec. No historical API migration is performed by generator. (rust/lance-file/test_data/exact_versions/datagen.rs:158-184)

### Lines 185-197

write_fixture uses std::fs::write(output/name), which can replace existing content, propagating errors. Tokio main reads only first positional OS-string argument, missing argument returns usage error, extra args ignored; create_dir_all output before constructing data. (rust/lance-file/test_data/exact_versions/datagen.rs:185-197)

### Lines 198-218

Construct batch/core schema and set_dictionary, write V1 first, then selectorsV2_0,V2_1,V2_2 in order under fixed filenames. Sequential awaited generation/write; earlier outputs remain after later error until outer Python tempdir cleanup. No V2_3 baseline generation. (rust/lance-file/test_data/exact_versions/datagen.rs:198-218)

### Lines 219-228

Project id/name and first257rows, convert embedded schema/set_dictionary, generate two modes and write self-described then mini. Return Ok. No internal hash assertion, footer parsing, cross-process comparison or reader roundtrip; outer orchestrator/current tests own those checks. (rust/lance-file/test_data/exact_versions/datagen.rs:219-228)

## Interaction and interpretation limits

All228 lines read without compilation/execution. Old previous::writer, LanceFileVersion, FileWriterOptions.format_version, EncodingOptions.version and EncodedBatchWriteExt references are intentional baseline APIs; current compatibility is not inferred. Local filesystem writes and unwrap/expect paths are generator behavior only.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::collections::HashMap;
    5 | use std::path::Path;
    6 | use std::sync::Arc;
    7 | 
    8 | use arrow_array::builder::StringDictionaryBuilder;
    9 | use arrow_array::types::{Int8Type, Int32Type};
   10 | use arrow_array::{ArrayRef, Int32Array, LargeBinaryArray, ListArray, RecordBatch, StringArray};
   11 | use arrow_schema::{DataType, Field, Schema as ArrowSchema};
   12 | use async_trait::async_trait;
   13 | use lance_core::datatypes::Schema as LanceSchema;
   14 | use lance_encoding::encoder::{EncodingOptions, default_encoding_strategy, encode_batch};
   15 | use lance_file::previous::writer::{
   16 |     FileWriter as V1Writer, FileWriterOptions as V1WriterOptions, ManifestProvider,
   17 | };
   18 | use lance_file::testing::FsFixture;
   19 | use lance_file::version::LanceFileVersion;
   20 | use lance_file::writer::{EncodedBatchWriteExt, FileWriter, FileWriterOptions};
   21 | use lance_io::traits::Writer;
   22 | 
   23 | type DynError = Box<dyn std::error::Error + Send + Sync>;
   24 | 
   25 | struct NoManifest;
   26 | 
   27 | #[async_trait]
   28 | impl ManifestProvider for NoManifest {
   29 |     async fn store_schema(
   30 |         _: &mut dyn Writer,
   31 |         _: &LanceSchema,
   32 |     ) -> lance_core::Result<Option<usize>> {
   33 |         Ok(None)
   34 |     }
   35 | }
   36 | 
   37 | fn compatibility_fixture_batch() -> RecordBatch {
   38 |     let row_count = 4097;
   39 |     let ids = Arc::new(Int32Array::from_iter_values(0..row_count)) as ArrayRef;
   40 |     let names = Arc::new(StringArray::from_iter((0..row_count).map(|index| {
   41 |         (index % 7 != 0).then(|| format!("value-{index:04}-deterministic-fixture"))
   42 |     }))) as ArrayRef;
   43 |     let items = Arc::new(ListArray::from_iter_primitive::<Int32Type, _, _>(
   44 |         (0..row_count).map(|index| {
   45 |             (index % 11 != 0).then(|| {
   46 |                 vec![
   47 |                     Some(index),
   48 |                     (index % 5 != 0).then_some(index * 2),
   49 |                     Some(index * 3),
   50 |                 ]
   51 |             })
   52 |         }),
   53 |     )) as ArrayRef;
   54 |     let mut categories = StringDictionaryBuilder::<Int8Type>::new();
   55 |     for index in 0..row_count {
   56 |         if index % 13 == 0 {
   57 |             categories.append_null();
   58 |         } else {
   59 |             categories
   60 |                 .append(match index % 3 {
   61 |                     0 => "red",
   62 |                     1 => "green",
   63 |                     _ => "blue",
   64 |                 })
   65 |                 .expect("fixture dictionary values must fit");
   66 |         }
   67 |     }
   68 |     let categories = Arc::new(categories.finish()) as ArrayRef;
   69 |     let blobs = Arc::new(LargeBinaryArray::from_iter_values(
   70 |         (0..row_count).map(|index| format!("blob-{index:04}-deterministic-payload").into_bytes()),
   71 |     )) as ArrayRef;
   72 | 
   73 |     let schema = Arc::new(ArrowSchema::new(vec![
   74 |         Field::new("id", DataType::Int32, false),
   75 |         Field::new("name", DataType::Utf8, true).with_metadata(HashMap::from([(
   76 |             "lance-encoding:compression".to_string(),
   77 |             "none".to_string(),
   78 |         )])),
   79 |         Field::new(
   80 |             "items",
   81 |             DataType::List(Arc::new(Field::new("item", DataType::Int32, true))),
   82 |             true,
   83 |         ),
   84 |         Field::new(
   85 |             "category",
   86 |             DataType::Dictionary(Box::new(DataType::Int8), Box::new(DataType::Utf8)),
   87 |             true,
   88 |         )
   89 |         .with_metadata(HashMap::from([(
   90 |             "lance-encoding:dict-values-compression".to_string(),
   91 |             "none".to_string(),
   92 |         )])),
   93 |         Field::new("blob", DataType::LargeBinary, true).with_metadata(HashMap::from([(
   94 |             "lance-encoding:blob".to_string(),
   95 |             "true".to_string(),
   96 |         )])),
   97 |     ]));
   98 |     RecordBatch::try_new(schema, vec![ids, names, items, categories, blobs])
   99 |         .expect("fixture schema and arrays must agree")
  100 | }
  101 | 
  102 | async fn write_current_fixture(
  103 |     version: LanceFileVersion,
  104 |     batch: &RecordBatch,
  105 |     schema: &LanceSchema,
  106 | ) -> Result<Vec<u8>, DynError> {
  107 |     let fs = FsFixture::default();
  108 |     let object_writer = fs.object_store.create(&fs.tmp_path).await?;
  109 |     let mut writer = FileWriter::try_new(
  110 |         object_writer,
  111 |         schema.clone(),
  112 |         FileWriterOptions {
  113 |             data_cache_bytes: Some(1),
  114 |             max_page_bytes: Some(1024),
  115 |             format_version: Some(version),
  116 |             ..Default::default()
  117 |         },
  118 |     )?;
  119 |     for offset in (0..batch.num_rows()).step_by(1024) {
  120 |         let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  121 |         writer.write_batch(&slice).await?;
  122 |     }
  123 |     let summary = writer.finish().await?;
  124 |     Ok(fs
  125 |         .object_store
  126 |         .open(&fs.tmp_path)
  127 |         .await?
  128 |         .get_range(0..summary.size_bytes as usize)
  129 |         .await?
  130 |         .to_vec())
  131 | }
  132 | 
  133 | async fn write_v1_fixture(batch: &RecordBatch, schema: &LanceSchema) -> Result<Vec<u8>, DynError> {
  134 |     let fs = FsFixture::default();
  135 |     let mut writer = V1Writer::<NoManifest>::try_new(
  136 |         fs.object_store.as_ref(),
  137 |         &fs.tmp_path,
  138 |         schema.clone(),
  139 |         &V1WriterOptions {
  140 |             collect_stats_for_fields: Some(Vec::new()),
  141 |         },
  142 |     )
  143 |     .await?;
  144 |     for offset in (0..batch.num_rows()).step_by(1024) {
  145 |         let slice = batch.slice(offset, (batch.num_rows() - offset).min(1024));
  146 |         writer.write(std::slice::from_ref(&slice)).await?;
  147 |     }
  148 |     let summary = writer.finish().await?;
  149 |     Ok(fs
  150 |         .object_store
  151 |         .open(&fs.tmp_path)
  152 |         .await?
  153 |         .get_range(0..summary.size_bytes as usize)
  154 |         .await?
  155 |         .to_vec())
  156 | }
  157 | 
  158 | async fn write_v2_0_embedded_fixtures(
  159 |     batch: &RecordBatch,
  160 |     schema: &LanceSchema,
  161 | ) -> Result<(Vec<u8>, Vec<u8>), DynError> {
  162 |     let version = LanceFileVersion::V2_0;
  163 |     let options = EncodingOptions {
  164 |         cache_bytes_per_column: 1,
  165 |         max_page_bytes: 1024,
  166 |         keep_original_array: true,
  167 |         buffer_alignment: 64,
  168 |         version,
  169 |     };
  170 |     let encoding_strategy = default_encoding_strategy(version);
  171 |     let encoded_batch = encode_batch(
  172 |         batch,
  173 |         Arc::new(schema.clone()),
  174 |         encoding_strategy.as_ref(),
  175 |         &options,
  176 |     )
  177 |     .await?;
  178 | 
  179 |     Ok((
  180 |         encoded_batch.try_to_self_described_lance(version)?.to_vec(),
  181 |         encoded_batch.try_to_mini_lance(version)?.to_vec(),
  182 |     ))
  183 | }
  184 | 
  185 | fn write_fixture(output_dir: &Path, name: &str, bytes: &[u8]) -> Result<(), DynError> {
  186 |     std::fs::write(output_dir.join(name), bytes)?;
  187 |     Ok(())
  188 | }
  189 | 
  190 | #[tokio::main]
  191 | async fn main() -> Result<(), DynError> {
  192 |     let output_dir = std::env::args_os()
  193 |         .nth(1)
  194 |         .map(std::path::PathBuf::from)
  195 |         .ok_or("usage: exact_version_fixture_generator <output-directory>")?;
  196 |     std::fs::create_dir_all(&output_dir)?;
  197 | 
  198 |     let batch = compatibility_fixture_batch();
  199 |     let mut schema = LanceSchema::try_from(batch.schema().as_ref())?;
  200 |     schema.set_dictionary(&batch)?;
  201 | 
  202 |     write_fixture(
  203 |         &output_dir,
  204 |         "v1.lance",
  205 |         &write_v1_fixture(&batch, &schema).await?,
  206 |     )?;
  207 |     for (version, name) in [
  208 |         (LanceFileVersion::V2_0, "v2_0.lance"),
  209 |         (LanceFileVersion::V2_1, "v2_1.lance"),
  210 |         (LanceFileVersion::V2_2, "v2_2.lance"),
  211 |     ] {
  212 |         write_fixture(
  213 |             &output_dir,
  214 |             name,
  215 |             &write_current_fixture(version, &batch, &schema).await?,
  216 |         )?;
  217 |     }
  218 | 
  219 |     let embedded_batch = batch.project(&[0, 1])?.slice(0, 257);
  220 |     let mut embedded_schema = LanceSchema::try_from(embedded_batch.schema().as_ref())?;
  221 |     embedded_schema.set_dictionary(&embedded_batch)?;
  222 |     let (self_described, mini) =
  223 |         write_v2_0_embedded_fixtures(&embedded_batch, &embedded_schema).await?;
  224 |     write_fixture(&output_dir, "v2_0_self_described.lance", &self_described)?;
  225 |     write_fixture(&output_dir, "v2_0_mini.lance", &mini)?;
  226 | 
  227 |     Ok(())
  228 | }
``````
