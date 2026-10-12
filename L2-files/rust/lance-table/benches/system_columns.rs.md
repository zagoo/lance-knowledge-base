> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/benches/system_columns.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `4a13f45275c9489820a85645d69940db14d148d48ea95931173f25528b01e114`. Reviewed physical lines: 1-172.

[Module](../../../../L1-modules/archive/rust-lance-table-benchmarks.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion benchmark for full task-stream row-ID/system-column materialization across sparse ID densities, payload presence and variable task sizes. (rust/lance-table/benches/system_columns.rs:1-172)

## Complete range analysis

### Lines 1-17

SPDX/imports std black_box/Arc/Duration, Arrow batches/explicit row-count options, schema, Criterion BatchSize/IDs, ready futures/streams, read params and public row-ID/stream APIs. No platform-specific profiler or file/store API. (rust/lance-table/benches/system_columns.rs:1-17)

### Lines 18-38

make_batch creates a nonnullable UInt64 value column of zeros or an empty-schema zero-column batch with explicit requested row count. Constructors unwrap. Payload vector/schema are prepared once per benchmark shape, later cloned/sliced. (rust/lance-table/benches/system_columns.rs:18-38)

### Lines 39-70

make_tasks lazily emits until offset==total_rows. Variable mode alternates max(batch_size-1,1) then batch_size; fixed mode always batch_size. Clamp each request to remaining rows, advance offset, clone full batch or slice prefix, and emit a ready boxed task with num_rows as u32. Actual task production/cloning occurs when benchmark consumes the lazy stream, not all in setup. No validation: batch_size0 with positive total loops on zero-length tasks in fixed mode; variable mode can attempt a one-row slice of a zero-row batch. (rust/lance-table/benches/system_columns.rs:39-70)

### Lines 71-91

make_config always requests stable row IDs with supplied Arc sequence and RangeFull. all-system switch additionally requests address and both version columns; versions absent therefore become version1 in stream implementation. No deletion/null mode; total_rows cast unchecked to u32. This does not measure multi-run version expansion. (rust/lance-table/benches/system_columns.rs:71-91)

### Lines 92-106

BENCH_SYSTEM_ROWS defaults100000usize; BENCH_SYSTEM_BATCH_SIZE defaults1024usize then min(total_rows). Successful malformed values panic via parse.unwrap; missing/non-Unicode env uses defaults. BENCH_SYSTEM_VARIABLE_BATCHES is true only for exact string1 (no trimming). Current-thread Tokio runtime is built without enable_all; ready-future workload needs no real IO/timer. Zero total yields zero tasks; zero batch with positive total is not rejected. (rust/lance-table/benches/system_columns.rs:92-106)

### Lines 107-130

stream_row_ids uses10 samples,1s warmup,3s measurement. Sparse sequences are built once per hole_stride2/17 by excluding multiples from infinite u64 source until total_rows live IDs, then encoding. Cross payload false/true with IDs-only/all-system for eight shapes. Parameter names include density stride, payload, system mode and variable flag, not total row/batch counts. No resulting encoding type is asserted. (rust/lance-table/benches/system_columns.rs:107-130)

### Lines 131-162

iter_batched SmallInput setup clones batch/sequence and constructs lazy task stream plus config. Measured routine wraps stream, buffers8, block_on collects every RecordBatch into Vec, unwraps and black_boxes complete outputs. This includes lazy task creation, array/schema work, stream driving and retained output buffers; setup excludes bulk sequence construction. No ID/value/count oracle or throughput Elements normalization. It measures full selected-stream processing per iteration, not single-batch latency. (rust/lance-table/benches/system_columns.rs:131-162)

### Lines 163-172

Close all shape loops/group; criterion_group and criterion_main register only bench_stream_row_ids on every platform. No benchmark was run and timing settings are requests to Criterion, not observed duration or throughput. (rust/lance-table/benches/system_columns.rs:163-172)

## Interaction and interpretation limits

All172lines read. Whole in-memory stream benchmark retains all results; no IO, deletes, corrupt-input assertions or measured results. Environment hazards are source deductions. Source benchmark not run.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | use std::{hint::black_box, sync::Arc, time::Duration};
    5 | 
    6 | use arrow_array::{RecordBatch, RecordBatchOptions, UInt64Array};
    7 | use arrow_schema::{DataType, Field, Schema};
    8 | use criterion::{BatchSize, BenchmarkId, Criterion, criterion_group, criterion_main};
    9 | use futures::{FutureExt, StreamExt, TryStreamExt, future, stream};
   10 | use lance_io::ReadBatchParams;
   11 | use lance_table::{
   12 |     rowids::RowIdSequence,
   13 |     utils::stream::{
   14 |         ReadBatchTask, ReadBatchTaskStream, RowIdAndDeletesConfig, wrap_with_row_id_and_delete,
   15 |     },
   16 | };
   17 | 
   18 | fn make_batch(batch_size: usize, has_payload: bool) -> RecordBatch {
   19 |     if has_payload {
   20 |         RecordBatch::try_new(
   21 |             Arc::new(Schema::new(vec![Field::new(
   22 |                 "value",
   23 |                 DataType::UInt64,
   24 |                 false,
   25 |             )])),
   26 |             vec![Arc::new(UInt64Array::from(vec![0; batch_size]))],
   27 |         )
   28 |         .unwrap()
   29 |     } else {
   30 |         RecordBatch::try_new_with_options(
   31 |             Arc::new(Schema::empty()),
   32 |             Vec::new(),
   33 |             &RecordBatchOptions::new().with_row_count(Some(batch_size)),
   34 |         )
   35 |         .unwrap()
   36 |     }
   37 | }
   38 | 
   39 | fn make_tasks(
   40 |     batch: RecordBatch,
   41 |     total_rows: usize,
   42 |     batch_size: usize,
   43 |     variable_batches: bool,
   44 | ) -> ReadBatchTaskStream {
   45 |     let mut offset = 0;
   46 |     let mut use_short_batch = true;
   47 |     let tasks = std::iter::from_fn(move || {
   48 |         if offset == total_rows {
   49 |             return None;
   50 |         }
   51 |         let requested = if variable_batches && use_short_batch {
   52 |             batch_size.saturating_sub(1).max(1)
   53 |         } else {
   54 |             batch_size
   55 |         };
   56 |         use_short_batch = !use_short_batch;
   57 |         let num_rows = requested.min(total_rows - offset);
   58 |         offset += num_rows;
   59 |         let batch = if num_rows == batch.num_rows() {
   60 |             batch.clone()
   61 |         } else {
   62 |             batch.slice(0, num_rows)
   63 |         };
   64 |         Some(ReadBatchTask {
   65 |             task: future::ready(Ok(batch)).boxed(),
   66 |             num_rows: num_rows as u32,
   67 |         })
   68 |     });
   69 |     stream::iter(tasks).boxed()
   70 | }
   71 | 
   72 | fn make_config(
   73 |     total_rows: usize,
   74 |     sequence: Arc<RowIdSequence>,
   75 |     with_all_system_columns: bool,
   76 | ) -> RowIdAndDeletesConfig {
   77 |     RowIdAndDeletesConfig {
   78 |         params: ReadBatchParams::RangeFull,
   79 |         with_row_id: true,
   80 |         with_row_addr: with_all_system_columns,
   81 |         with_row_last_updated_at_version: with_all_system_columns,
   82 |         with_row_created_at_version: with_all_system_columns,
   83 |         deletion_vector: None,
   84 |         row_id_sequence: Some(sequence),
   85 |         last_updated_at_sequence: None,
   86 |         created_at_sequence: None,
   87 |         make_deletions_null: false,
   88 |         total_num_rows: total_rows as u32,
   89 |     }
   90 | }
   91 | 
   92 | fn bench_stream_row_ids(c: &mut Criterion) {
   93 |     let total_rows = std::env::var("BENCH_SYSTEM_ROWS")
   94 |         .map(|value| value.parse().unwrap())
   95 |         .unwrap_or(100_000_usize);
   96 |     let batch_size = std::env::var("BENCH_SYSTEM_BATCH_SIZE")
   97 |         .map(|value| value.parse().unwrap())
   98 |         .unwrap_or(1_024_usize)
   99 |         .min(total_rows);
  100 |     let variable_batches = std::env::var("BENCH_SYSTEM_VARIABLE_BATCHES")
  101 |         .map(|value| value == "1")
  102 |         .unwrap_or(false);
  103 |     let runtime = tokio::runtime::Builder::new_current_thread()
  104 |         .build()
  105 |         .unwrap();
  106 | 
  107 |     let mut group = c.benchmark_group("stream_row_ids");
  108 |     group.sample_size(10);
  109 |     group.warm_up_time(Duration::from_secs(1));
  110 |     group.measurement_time(Duration::from_secs(3));
  111 |     for hole_stride in [2_u64, 17] {
  112 |         let sequence = Arc::new(
  113 |             RowIdSequence::try_from_iter(
  114 |                 (0_u64..)
  115 |                     .filter(|value| value % hole_stride != 0)
  116 |                     .take(total_rows),
  117 |             )
  118 |             .unwrap(),
  119 |         );
  120 |         for has_payload in [false, true] {
  121 |             for with_all_system_columns in [false, true] {
  122 |                 let batch = make_batch(batch_size, has_payload);
  123 |                 let system_columns = if with_all_system_columns {
  124 |                     "all"
  125 |                 } else {
  126 |                     "row_id"
  127 |                 };
  128 |                 let parameter = format!(
  129 |                     "holes_{hole_stride}/payload_{has_payload}/system_{system_columns}/variable_{variable_batches}"
  130 |                 );
  131 |                 group.bench_with_input(
  132 |                     BenchmarkId::new("shape", parameter),
  133 |                     &has_payload,
  134 |                     |b, _| {
  135 |                         b.iter_batched(
  136 |                             || {
  137 |                                 (
  138 |                                     make_tasks(
  139 |                                         batch.clone(),
  140 |                                         total_rows,
  141 |                                         batch_size,
  142 |                                         variable_batches,
  143 |                                     ),
  144 |                                     make_config(
  145 |                                         total_rows,
  146 |                                         sequence.clone(),
  147 |                                         with_all_system_columns,
  148 |                                     ),
  149 |                                 )
  150 |                             },
  151 |                             |(tasks, config)| {
  152 |                                 let batches = runtime
  153 |                                     .block_on(
  154 |                                         wrap_with_row_id_and_delete(tasks, 0, config)
  155 |                                             .buffered(8)
  156 |                                             .try_collect::<Vec<_>>(),
  157 |                                     )
  158 |                                     .unwrap();
  159 |                                 black_box(batches);
  160 |                             },
  161 |                             BatchSize::SmallInput,
  162 |                         );
  163 |                     },
  164 |                 );
  165 |             }
  166 |         }
  167 |     }
  168 |     group.finish();
  169 | }
  170 | 
  171 | criterion_group!(benches, bench_stream_row_ids);
  172 | criterion_main!(benches);
``````
