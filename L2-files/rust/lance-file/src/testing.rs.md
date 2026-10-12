> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/src/testing.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8abe88fe9476f3add5e8b748dfcfd57a69b48a04e830e98f89be1322ad0bb7ef`. Reviewed physical lines: 1-123.

[Module](../../../../L1-modules/rust-lance-file-v20-compatibility.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Public testing module helpers create a temporary local filesystem/scheduler fixture, fully collect input batches for writing, read all output batches and count rows. These are public Rust test utilities, not streaming production interfaces. (rust/lance-file/src/testing.rs:1-123)

## Complete range analysis

### Lines 1-21

SPDX/imports connect Arc, Arrow RecordBatchReader/ArrowError, TryStreamExt, core cache/schema/tempfile, decoder plugins/filter, IO scheduler/params/cached size and file reader/version/writer options. (rust/lance-file/src/testing.rs:1-21)

### Lines 22-41

Public FsFixture exposes TempObjFile, Arc<ObjectStore>, Arc<ScanScheduler>. Default constructs temporary object path, local store and default_for_testing scheduler, retaining all three. Cleanup semantics are delegated to TempObjFile; no explicit Drop here. (rust/lance-file/src/testing.rs:22-41)

### Lines 42-60

WrittenFile publicly holds Arc<core Schema>, Vec<RecordBatch> and Vec<(u32,u32)> mapping. write_lance_file creates object writer then converts input reader schema and constructs exact-version facade writer; all failures unwrap. Returned original core schema is cloned into writer before later metadata mutations. (rust/lance-file/src/testing.rs:42-60)

### Lines 61-77

Collect entire RecordBatchReader into Result<Vec<_>,ArrowError> before any write_batch, unwrap errors, await each batch sequentially, clone mapping, add schema foo=bar, finish and discard summary. Return retained schema/data/mapping; returned schema does not receive added foo metadata because writer owned a clone. Input failure can occur after creating object and encoders. (rust/lance-file/src/testing.rs:61-77)

### Lines 78-81

test_cache returns fresh Arc<LanceCache> with128MiB capacity on every call; it is not shared global state. (rust/lance-file/src/testing.rs:78-81)

### Lines 82-101

read_lance_file opens scheduler with unknown file size, then FileReader::try_open with no explicit projection, supplied decoder plugins, a fresh test cache and default reader options. Each error unwraps; caller filter is retained for stream call. (rust/lance-file/src/testing.rs:82-101)

### Lines 102-112

Require read schema metadata foo=bar via unwrap/assert. Read RangeFull using batch size1024 and readahead16 with supplied filter, await stream creation then collect all RecordBatches into Vec. No comparison with original values in this helper. (rust/lance-file/src/testing.rs:102-112)

### Lines 113-123

count_lance_file calls full read helper, retains collected Vec until summation, sums each batch num_rows as usize. It is not a metadata-only count and inherits foo metadata assertion, decode/filter IO and unwrap panics. (rust/lance-file/src/testing.rs:113-123)

## Interaction and interpretation limits

All123 lines read. Helpers use unwrap/assert extensively and return values rather than Result. No source tests or IO were executed. ObjectStore/scheduler and delegated decoder internals remain pending; the full shared file reader is analyzed; no performance or durability result follows from these harness bodies.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::sync::Arc;
    5 | 
    6 | use arrow_array::{RecordBatch, RecordBatchReader};
    7 | use arrow_schema::ArrowError;
    8 | use futures::TryStreamExt;
    9 | use lance_core::{cache::LanceCache, datatypes::Schema, utils::tempfile::TempObjFile};
   10 | use lance_encoding::decoder::{DecoderPlugins, FilterExpression};
   11 | use lance_io::{
   12 |     ReadBatchParams,
   13 |     object_store::ObjectStore,
   14 |     scheduler::{ScanScheduler, SchedulerConfig},
   15 |     utils::CachedFileSize,
   16 | };
   17 | 
   18 | use crate::reader::{FileReader, FileReaderOptions};
   19 | use crate::version::ConcreteFileVersion;
   20 | use crate::{versions, writer::FileWriterOptions};
   21 | 
   22 | pub struct FsFixture {
   23 |     pub tmp_path: TempObjFile,
   24 |     pub object_store: Arc<ObjectStore>,
   25 |     pub scheduler: Arc<ScanScheduler>,
   26 | }
   27 | 
   28 | impl Default for FsFixture {
   29 |     fn default() -> Self {
   30 |         let tmp_path = TempObjFile::default();
   31 |         let object_store = Arc::new(ObjectStore::local());
   32 |         let scheduler =
   33 |             ScanScheduler::new(object_store.clone(), SchedulerConfig::default_for_testing());
   34 |         Self {
   35 |             object_store,
   36 |             tmp_path,
   37 |             scheduler,
   38 |         }
   39 |     }
   40 | }
   41 | 
   42 | pub struct WrittenFile {
   43 |     pub schema: Arc<Schema>,
   44 |     pub data: Vec<RecordBatch>,
   45 |     pub field_id_mapping: Vec<(u32, u32)>,
   46 | }
   47 | 
   48 | pub async fn write_lance_file(
   49 |     data: impl RecordBatchReader,
   50 |     fs: &FsFixture,
   51 |     version: ConcreteFileVersion,
   52 |     options: FileWriterOptions,
   53 | ) -> WrittenFile {
   54 |     let writer = fs.object_store.create(&fs.tmp_path).await.unwrap();
   55 | 
   56 |     let lance_schema = lance_core::datatypes::Schema::try_from(data.schema().as_ref()).unwrap();
   57 | 
   58 |     let mut file_writer =
   59 |         versions::create_writer(version, writer, lance_schema.clone(), options).unwrap();
   60 | 
   61 |     let data = data
   62 |         .collect::<std::result::Result<Vec<_>, ArrowError>>()
   63 |         .unwrap();
   64 | 
   65 |     for batch in &data {
   66 |         file_writer.write_batch(batch).await.unwrap();
   67 |     }
   68 |     let field_id_mapping = file_writer.field_id_to_column_indices().to_vec();
   69 |     file_writer.add_schema_metadata("foo", "bar");
   70 |     file_writer.finish().await.unwrap();
   71 |     WrittenFile {
   72 |         schema: Arc::new(lance_schema),
   73 |         data,
   74 |         field_id_mapping,
   75 |     }
   76 | }
   77 | 
   78 | pub fn test_cache() -> Arc<LanceCache> {
   79 |     Arc::new(LanceCache::with_capacity(128 * 1024 * 1024))
   80 | }
   81 | 
   82 | pub async fn read_lance_file(
   83 |     fs: &FsFixture,
   84 |     decoder_middleware: Arc<DecoderPlugins>,
   85 |     filter: FilterExpression,
   86 | ) -> Vec<RecordBatch> {
   87 |     let file_scheduler = fs
   88 |         .scheduler
   89 |         .open_file(&fs.tmp_path, &CachedFileSize::unknown())
   90 |         .await
   91 |         .unwrap();
   92 |     let file_reader = FileReader::try_open(
   93 |         file_scheduler,
   94 |         None,
   95 |         decoder_middleware,
   96 |         &test_cache(),
   97 |         FileReaderOptions::default(),
   98 |     )
   99 |     .await
  100 |     .unwrap();
  101 | 
  102 |     let schema = file_reader.schema();
  103 |     assert_eq!(schema.metadata.get("foo").unwrap(), "bar");
  104 | 
  105 |     let batch_stream = file_reader
  106 |         .read_stream(ReadBatchParams::RangeFull, 1024, 16, filter)
  107 |         .await
  108 |         .unwrap();
  109 | 
  110 |     batch_stream.try_collect().await.unwrap()
  111 | }
  112 | 
  113 | pub async fn count_lance_file(
  114 |     fs: &FsFixture,
  115 |     decoder_middleware: Arc<DecoderPlugins>,
  116 |     filter: FilterExpression,
  117 | ) -> usize {
  118 |     read_lance_file(fs, decoder_middleware, filter)
  119 |         .await
  120 |         .iter()
  121 |         .map(|b| b.num_rows())
  122 |         .sum()
  123 | }
``````
