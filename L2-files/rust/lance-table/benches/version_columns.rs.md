> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/benches/version_columns.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `1861ed6a06c6dc3bbfefa773a8192458e704ef07a29e805b3a1f1c6fe8d89bb7`. Reviewed physical lines: 1-160.

[Module](../../../../L1-modules/archive/rust-lance-table-benchmarks.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion comparison of direct per-batch and reusable-cursor full-stream version expansion for varying RLE run counts. (rust/lance-table/benches/version_columns.rs:1-160)

## Complete range analysis

### Lines 1-21

SPDX/imports std black_box/Arc/Duration, Arrow batch/UInt64, schema, Criterion, ready futures/streams, read params, U64Segment and row-version/stream APIs. No filesystem or profiler hooks. (rust/lance-table/benches/version_columns.rs:1-21)

### Lines 22-33

make_version_sequence steps physical positions by run_length cast usize, builds capped Range spans and monotonically increasing version run_index+1, and returns public run vector. Zero step panics, overflow/casts unchecked; caller controls four shapes below. All values are synthetic positional versions. (rust/lance-table/benches/version_columns.rs:22-33)

### Lines 34-45

make_batch creates one nonnullable UInt64 value column of zeros with size cast usize and unwraps RecordBatch construction. Payload array and schema are shared by later batch clones/slices. (rust/lance-table/benches/version_columns.rs:34-45)

### Lines 46-61

Config is RangeFull, last-updated only, supplied Arc version sequence, no IDs/addresses/created/deletions and no null mode; total_rows cast to u32. It exercises version materialization independently of row-ID decoding. (rust/lance-table/benches/version_columns.rs:46-61)

### Lines 62-79

make_tasks uses step_by(batch_size as usize), emits full cloned batches or short final prefix slice, and wraps ready successes with u32 advertised count. Stream is lazy. Zero step panics even if total row range is empty; oversized counts/casts are not validated. (rust/lance-table/benches/version_columns.rs:62-79)

### Lines 80-98

Direct group reads BENCH_VERSION_ROWS default100000u64 and BENCH_VERSION_BATCH_SIZE default1024u64 then caps to total. Parse unwrap can panic. Build payload outside measurement; configure10 samples,1s warmup,3s measurement. Iterate run lengths[total_rows,1024,32,1], create sequence/config outside timing and label by actual run count. Zero total makes first run_length0 panic; small totals may produce duplicate run-count benchmark IDs, whose Criterion handling is not established here. (rust/lance-table/benches/version_columns.rs:80-98)

### Lines 99-113

Direct timed iteration clones one fixed-size batch, calls apply_row_id_and_deletes at mutable u32 offset, unwraps/black_boxes output, advances by batch_size and resets when another full batch would exceed total. It skips a nondivisible short tail and does not share version cursor across calls. Zero batch with positive total repeatedly processes zero rows; offset can wrap/panic if values exceed u32 range. No correctness assertions. (rust/lance-table/benches/version_columns.rs:99-113)

### Lines 114-130

Stream group independently rereads same env defaults/caps, builds payload and current-thread runtime outside timing, then configures10 samples,1s warmup,3s measurement. It uses no real IO and does not share state with direct group. (rust/lance-table/benches/version_columns.rs:114-130)

### Lines 131-157

For same four run lengths, iter_batched SmallInput setup clones Arc/batch and makes lazy tasks/config. Measured block_on wraps stream, buffers8, collects all output batches including tail, unwraps and black_boxes Vec. It measures a full stream per iteration versus one batch in direct group; without normalization timings are not direct like-for-like latency comparisons. Multi-run cursor state is reused within each stream, reset per iteration. No returned-version oracle or memory bound asserted. (rust/lance-table/benches/version_columns.rs:131-157)

### Lines 158-160

criterion_group registers direct and stream groups and criterion_main supplies entry; no platform branches. These are source workloads only, not executed performance or correctness results. (rust/lance-table/benches/version_columns.rs:158-160)

## Interaction and interpretation limits

All160lines read. No source benchmark execution; environment/cast/zero-step and measurement-unit caveats derived from source. Full Criterion handling of duplicate benchmark IDs is not claimed.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{hint::black_box, sync::Arc, time::Duration};
    5 | 
    6 | use arrow_array::{RecordBatch, UInt64Array};
    7 | use arrow_schema::{DataType, Field, Schema};
    8 | use criterion::{BatchSize, BenchmarkId, Criterion, criterion_group, criterion_main};
    9 | use futures::{FutureExt, StreamExt, TryStreamExt, future, stream};
   10 | use lance_io::ReadBatchParams;
   11 | use lance_table::{
   12 |     rowids::{
   13 |         segment::U64Segment,
   14 |         version::{RowDatasetVersionRun, RowDatasetVersionSequence},
   15 |     },
   16 |     utils::stream::{
   17 |         ReadBatchTask, ReadBatchTaskStream, RowIdAndDeletesConfig, apply_row_id_and_deletes,
   18 |         wrap_with_row_id_and_delete,
   19 |     },
   20 | };
   21 | 
   22 | fn make_version_sequence(total_rows: u64, run_length: u64) -> RowDatasetVersionSequence {
   23 |     let runs = (0..total_rows)
   24 |         .step_by(run_length as usize)
   25 |         .enumerate()
   26 |         .map(|(run_index, start)| RowDatasetVersionRun {
   27 |             span: U64Segment::Range(start..(start + run_length).min(total_rows)),
   28 |             version: run_index as u64 + 1,
   29 |         })
   30 |         .collect();
   31 |     RowDatasetVersionSequence { runs }
   32 | }
   33 | 
   34 | fn make_batch(batch_size: u64) -> RecordBatch {
   35 |     RecordBatch::try_new(
   36 |         Arc::new(Schema::new(vec![Field::new(
   37 |             "value",
   38 |             DataType::UInt64,
   39 |             false,
   40 |         )])),
   41 |         vec![Arc::new(UInt64Array::from(vec![0; batch_size as usize]))],
   42 |     )
   43 |     .unwrap()
   44 | }
   45 | 
   46 | fn make_config(total_rows: u64, sequence: Arc<RowDatasetVersionSequence>) -> RowIdAndDeletesConfig {
   47 |     RowIdAndDeletesConfig {
   48 |         params: ReadBatchParams::RangeFull,
   49 |         with_row_id: false,
   50 |         with_row_addr: false,
   51 |         with_row_last_updated_at_version: true,
   52 |         with_row_created_at_version: false,
   53 |         deletion_vector: None,
   54 |         row_id_sequence: None,
   55 |         last_updated_at_sequence: Some(sequence),
   56 |         created_at_sequence: None,
   57 |         make_deletions_null: false,
   58 |         total_num_rows: total_rows as u32,
   59 |     }
   60 | }
   61 | 
   62 | fn make_tasks(batch: RecordBatch, total_rows: u64, batch_size: u64) -> ReadBatchTaskStream {
   63 |     let tasks = (0..total_rows)
   64 |         .step_by(batch_size as usize)
   65 |         .map(move |offset| {
   66 |             let num_rows = batch_size.min(total_rows - offset) as usize;
   67 |             let batch = if num_rows == batch.num_rows() {
   68 |                 batch.clone()
   69 |             } else {
   70 |                 batch.slice(0, num_rows)
   71 |             };
   72 |             ReadBatchTask {
   73 |                 task: future::ready(Ok(batch)).boxed(),
   74 |                 num_rows: num_rows as u32,
   75 |             }
   76 |         });
   77 |     stream::iter(tasks).boxed()
   78 | }
   79 | 
   80 | fn bench_apply_versions(c: &mut Criterion) {
   81 |     let total_rows = std::env::var("BENCH_VERSION_ROWS")
   82 |         .map(|value| value.parse().unwrap())
   83 |         .unwrap_or(100_000_u64);
   84 |     let batch_size = std::env::var("BENCH_VERSION_BATCH_SIZE")
   85 |         .map(|value| value.parse().unwrap())
   86 |         .unwrap_or(1_024_u64)
   87 |         .min(total_rows);
   88 |     let batch = make_batch(batch_size);
   89 | 
   90 |     let mut group = c.benchmark_group("apply_version_columns");
   91 |     group.sample_size(10);
   92 |     group.warm_up_time(Duration::from_secs(1));
   93 |     group.measurement_time(Duration::from_secs(3));
   94 |     for run_length in [total_rows, 1_024, 32, 1] {
   95 |         let sequence = Arc::new(make_version_sequence(total_rows, run_length));
   96 |         let run_count = sequence.runs.len();
   97 |         let config = make_config(total_rows, sequence);
   98 |         group.bench_with_input(BenchmarkId::new("runs", run_count), &run_count, |b, _| {
   99 |             let mut batch_offset = 0_u32;
  100 |             b.iter(|| {
  101 |                 let result =
  102 |                     apply_row_id_and_deletes(batch.clone(), batch_offset, 0, &config).unwrap();
  103 |                 black_box(result);
  104 |                 batch_offset += batch_size as u32;
  105 |                 if u64::from(batch_offset) + batch_size > total_rows {
  106 |                     batch_offset = 0;
  107 |                 }
  108 |             });
  109 |         });
  110 |     }
  111 |     group.finish();
  112 | }
  113 | 
  114 | fn bench_stream_versions(c: &mut Criterion) {
  115 |     let total_rows = std::env::var("BENCH_VERSION_ROWS")
  116 |         .map(|value| value.parse().unwrap())
  117 |         .unwrap_or(100_000_u64);
  118 |     let batch_size = std::env::var("BENCH_VERSION_BATCH_SIZE")
  119 |         .map(|value| value.parse().unwrap())
  120 |         .unwrap_or(1_024_u64)
  121 |         .min(total_rows);
  122 |     let batch = make_batch(batch_size);
  123 |     let runtime = tokio::runtime::Builder::new_current_thread()
  124 |         .build()
  125 |         .unwrap();
  126 | 
  127 |     let mut group = c.benchmark_group("stream_version_columns");
  128 |     group.sample_size(10);
  129 |     group.warm_up_time(Duration::from_secs(1));
  130 |     group.measurement_time(Duration::from_secs(3));
  131 |     for run_length in [total_rows, 1_024, 32, 1] {
  132 |         let sequence = Arc::new(make_version_sequence(total_rows, run_length));
  133 |         let run_count = sequence.runs.len();
  134 |         group.bench_with_input(BenchmarkId::new("runs", run_count), &run_count, |b, _| {
  135 |             b.iter_batched(
  136 |                 || {
  137 |                     (
  138 |                         make_tasks(batch.clone(), total_rows, batch_size),
  139 |                         make_config(total_rows, sequence.clone()),
  140 |                     )
  141 |                 },
  142 |                 |(tasks, config)| {
  143 |                     let batches = runtime
  144 |                         .block_on(
  145 |                             wrap_with_row_id_and_delete(tasks, 0, config)
  146 |                                 .buffered(8)
  147 |                                 .try_collect::<Vec<_>>(),
  148 |                         )
  149 |                         .unwrap();
  150 |                     black_box(batches);
  151 |                 },
  152 |                 BatchSize::SmallInput,
  153 |             );
  154 |         });
  155 |     }
  156 |     group.finish();
  157 | }
  158 | 
  159 | criterion_group!(benches, bench_apply_versions, bench_stream_versions);
  160 | criterion_main!(benches);
``````
