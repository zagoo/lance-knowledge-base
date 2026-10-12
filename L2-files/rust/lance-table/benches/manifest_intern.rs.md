> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/benches/manifest_intern.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `eb8dbf7a89f6f062a58d2bd424814e9daf82f3ef2cdbc5e20b459f09f95345e8`. Reviewed physical lines: 1-263.

[Module](../../../../L1-modules/archive/rust-lance-table-benchmarks.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion fixture for protobuf fragment conversion with/without metadata interning and DeepSizeOf estimates; no dataset storage or production reads. (rust/lance-table/benches/manifest_intern.rs:1-263)

## Complete range analysis

### Lines 1-18

SPDX, allowed stderr-print lint and module docs identify fields/column_indices/inline-version interning. Imports Criterion, core DeepSizeOf, prost encoding, generated pb, Fragment and DataFileFieldInterner. The claimed memory/throughput purpose is a benchmark design, not an observed measurement. (rust/lance-table/benches/manifest_intern.rs:1-18)

### Lines 19-25

num_fragments reads BENCH_NUM_FRAGMENTS, defaults to100000 on env read failure, and unwraps u64 parsing for any successfully read string. No positivity/range validation; malformed/negative text panics rather than falling back. (rust/lance-table/benches/manifest_intern.rs:19-25)

### Lines 26-49

Uniform fixture builds field IDs and column indices0..num_fields cast to i32. Encode one protobuf RowDatasetVersionSequence with span0..1000/version42 as raw bytes. This payload is reused by cloning into each protobuf message; no file is written. (rust/lance-table/benches/manifest_intern.rs:26-49)

### Lines 50-79

Collect n protobuf fragments with sequential u64 IDs, one data/{i}.lance file, copied field/column vectors, file version2.0, size0/baseNone, empty overlays/deletion/row-ID metadata, physical_rows1000, and identical cloned bytes in both creation/update arms. This is synthetic conversion input, not a validated stable-ID dataset or actual post-compaction snapshot. (rust/lance-table/benches/manifest_intern.rs:50-79)

### Lines 80-96

Baseline clones each protobuf fragment, Fragment::try_from unwraps and collects Vec. Interned path creates a fresh DataFileFieldInterner per whole conversion then clones/interns every fragment and collects. Both include protobuf cloning and result allocation; timed routine is not raw protobuf byte decoding or end-to-end manifest IO. Interner map lifetime ends on return while shared output Arcs survive. (rust/lance-table/benches/manifest_intern.rs:80-96)

### Lines 97-124

Diverse fixture makes same fields/columns, computes group_size=n/unique_versions and encodes one span0..1000 per version0..unique_versions. unique_versions0 divides by zero immediately. Fixed caller values10/100/500 avoid that parameter case. Memory includes all encoded payloads before fragment construction. (rust/lance-table/benches/manifest_intern.rs:97-124)

### Lines 125-157

Each fragment chooses version index min(i/group_size,unique_versions-1), then copies the same metadata shape as uniform. Final group absorbs remainder. If0<n<unique_versions, group_size0 makes the first mapping divide by zero; n=0 produces no fragments and does not execute that mapping. No input validation protects small BENCH_NUM_FRAGMENTS values across all diverse cases. (rust/lance-table/benches/manifest_intern.rs:125-157)

### Lines 158-181

manifest_intern group benchmarks uniform10/50 fields with protobuf fixtures built outside b.iter. Both no-intern and intern conversion functions are called per measured iteration; outputs are returned to Criterion. No local equality, memory-saving or throughput-normalization assertion is made. (rust/lance-table/benches/manifest_intern.rs:158-181)

### Lines 182-205

Same group benchmarks diverse10/100/500 versions with ten fields, again both conversion paths and setup outside iterations, then finish. Group uses Criterion defaults, no local sample/warmup/measurement overrides. BENCH_NUM_FRAGMENTS must be at least500 for all positive-count diverse cases to avoid division by zero. (rust/lance-table/benches/manifest_intern.rs:182-205)

### Lines 206-238

manifest_memory constructs both decoded vectors simultaneously outside timing and calls deep_size_of independently, each with its own traversal context. Prints no-intern/intern sizes and difference divided by1048576, labeled MB though units are MiB, and percentage savings. These are DeepSizeOf graph estimates, not process RSS, peak memory or allocator measurements; proto fixture and interner transient allocations are not the output graph. Difference uses ordinary usize subtraction without underflow protection. No actual values were measured in this task. (rust/lance-table/benches/manifest_intern.rs:206-238)

### Lines 239-254

Only deep_size_of on the retained interned vector is timed in memory group. No baseline measurement-time comparison or correctness assertion. Both output vectors explicitly drop after each field-count case; group finishes. (rust/lance-table/benches/manifest_intern.rs:239-254)

### Lines 255-263

Linux criterion_group registers deserialization and memory with pprof100Hz/flamegraph; non-Linux registers same targets with default Criterion. criterion_main defines benchmark entry. Profiler installation/output success and benchmark execution are unverified. (rust/lance-table/benches/manifest_intern.rs:255-263)

## Interaction and interpretation limits

All263lines read. Synthetic metadata conversion and graph estimates only; no source benchmark run, stderr measurements, historical fixture validation or memory/performance claim. Full dependency Criterion/prost/runtime behavior is not inferred.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | // Benchmarks use eprintln! to report memory stats alongside criterion output.
    5 | #![allow(clippy::print_stderr)]
    6 | 
    7 | //! Benchmark for manifest fragment interning.
    8 | //!
    9 | //! Measures memory savings and deserialization throughput when interning
   10 | //! `DataFile.fields`, `DataFile.column_indices`, and
   11 | //! `RowDatasetVersionMeta::Inline` bytes across many fragments.
   12 | 
   13 | use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
   14 | use lance_core::deepsize::DeepSizeOf;
   15 | use prost::Message;
   16 | 
   17 | use lance_table::format::pb;
   18 | use lance_table::format::{DataFileFieldInterner, Fragment};
   19 | 
   20 | fn num_fragments() -> u64 {
   21 |     std::env::var("BENCH_NUM_FRAGMENTS")
   22 |         .map(|s| s.parse().unwrap())
   23 |         .unwrap_or(100_000)
   24 | }
   25 | 
   26 | /// Build a vector of protobuf DataFragment messages that simulate a
   27 | /// homogeneous, post-compaction table: every fragment has the same field
   28 | /// list, column indices, and version metadata bytes.
   29 | fn make_uniform_pb_fragments(n: u64, num_fields: usize) -> Vec<pb::DataFragment> {
   30 |     let fields: Vec<i32> = (0..num_fields as i32).collect();
   31 |     let column_indices: Vec<i32> = (0..num_fields as i32).collect();
   32 | 
   33 |     // Simulate version metadata: a small protobuf-encoded payload
   34 |     // (identical across all fragments post-compaction)
   35 |     let version_bytes: Vec<u8> = {
   36 |         let seq = pb::RowDatasetVersionSequence {
   37 |             runs: vec![pb::RowDatasetVersionRun {
   38 |                 span: Some(pb::U64Segment {
   39 |                     segment: Some(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
   40 |                         start: 0,
   41 |                         end: 1000,
   42 |                     })),
   43 |                 }),
   44 |                 version: 42,
   45 |             }],
   46 |         };
   47 |         seq.encode_to_vec()
   48 |     };
   49 | 
   50 |     (0..n)
   51 |         .map(|i| pb::DataFragment {
   52 |             id: i,
   53 |             files: vec![pb::DataFile {
   54 |                 path: format!("data/{i}.lance"),
   55 |                 fields: fields.clone(),
   56 |                 column_indices: column_indices.clone(),
   57 |                 file_major_version: 2,
   58 |                 file_minor_version: 0,
   59 |                 file_size_bytes: 0,
   60 |                 base_id: None,
   61 |             }],
   62 |             overlays: vec![],
   63 |             deletion_file: None,
   64 |             row_id_sequence: None,
   65 |             physical_rows: 1000,
   66 |             last_updated_at_version_sequence: Some(
   67 |                 pb::data_fragment::LastUpdatedAtVersionSequence::InlineLastUpdatedAtVersions(
   68 |                     version_bytes.clone(),
   69 |                 ),
   70 |             ),
   71 |             created_at_version_sequence: Some(
   72 |                 pb::data_fragment::CreatedAtVersionSequence::InlineCreatedAtVersions(
   73 |                     version_bytes.clone(),
   74 |                 ),
   75 |             ),
   76 |         })
   77 |         .collect()
   78 | }
   79 | 
   80 | /// Deserialize protobuf fragments WITHOUT interning (baseline).
   81 | fn deserialize_without_interning(protos: &[pb::DataFragment]) -> Vec<Fragment> {
   82 |     protos
   83 |         .iter()
   84 |         .map(|p| Fragment::try_from(p.clone()).unwrap())
   85 |         .collect()
   86 | }
   87 | 
   88 | /// Deserialize protobuf fragments WITH interning.
   89 | fn deserialize_with_interning(protos: &[pb::DataFragment]) -> Vec<Fragment> {
   90 |     let mut interner = DataFileFieldInterner::default();
   91 |     protos
   92 |         .iter()
   93 |         .map(|p| interner.intern_fragment(p.clone()).unwrap())
   94 |         .collect()
   95 | }
   96 | 
   97 | /// Build fragments where each group shares the same version metadata,
   98 | /// simulating many small appends without compaction.
   99 | fn make_diverse_pb_fragments(
  100 |     n: u64,
  101 |     num_fields: usize,
  102 |     unique_versions: u64,
  103 | ) -> Vec<pb::DataFragment> {
  104 |     let fields: Vec<i32> = (0..num_fields as i32).collect();
  105 |     let column_indices: Vec<i32> = (0..num_fields as i32).collect();
  106 |     let group_size = n / unique_versions;
  107 | 
  108 |     let version_payloads: Vec<Vec<u8>> = (0..unique_versions)
  109 |         .map(|v| {
  110 |             let seq = pb::RowDatasetVersionSequence {
  111 |                 runs: vec![pb::RowDatasetVersionRun {
  112 |                     span: Some(pb::U64Segment {
  113 |                         segment: Some(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
  114 |                             start: 0,
  115 |                             end: 1000,
  116 |                         })),
  117 |                     }),
  118 |                     version: v,
  119 |                 }],
  120 |             };
  121 |             seq.encode_to_vec()
  122 |         })
  123 |         .collect();
  124 | 
  125 |     (0..n)
  126 |         .map(|i| {
  127 |             let version_idx = (i / group_size).min(unique_versions - 1) as usize;
  128 |             pb::DataFragment {
  129 |                 id: i,
  130 |                 files: vec![pb::DataFile {
  131 |                     path: format!("data/{i}.lance"),
  132 |                     fields: fields.clone(),
  133 |                     column_indices: column_indices.clone(),
  134 |                     file_major_version: 2,
  135 |                     file_minor_version: 0,
  136 |                     file_size_bytes: 0,
  137 |                     base_id: None,
  138 |                 }],
  139 |                 overlays: vec![],
  140 |                 deletion_file: None,
  141 |                 row_id_sequence: None,
  142 |                 physical_rows: 1000,
  143 |                 last_updated_at_version_sequence: Some(
  144 |                     pb::data_fragment::LastUpdatedAtVersionSequence::InlineLastUpdatedAtVersions(
  145 |                         version_payloads[version_idx].clone(),
  146 |                     ),
  147 |                 ),
  148 |                 created_at_version_sequence: Some(
  149 |                     pb::data_fragment::CreatedAtVersionSequence::InlineCreatedAtVersions(
  150 |                         version_payloads[version_idx].clone(),
  151 |                     ),
  152 |                 ),
  153 |             }
  154 |         })
  155 |         .collect()
  156 | }
  157 | 
  158 | fn bench_deserialization(c: &mut Criterion) {
  159 |     let mut group = c.benchmark_group("manifest_intern");
  160 |     let n = num_fragments();
  161 | 
  162 |     for num_fields in [10, 50] {
  163 |         let protos = make_uniform_pb_fragments(n, num_fields);
  164 | 
  165 |         group.bench_with_input(
  166 |             BenchmarkId::new("deserialize_no_intern", num_fields),
  167 |             &num_fields,
  168 |             |b, _| {
  169 |                 b.iter(|| deserialize_without_interning(&protos));
  170 |             },
  171 |         );
  172 | 
  173 |         group.bench_with_input(
  174 |             BenchmarkId::new("deserialize_with_intern", num_fields),
  175 |             &num_fields,
  176 |             |b, _| {
  177 |                 b.iter(|| deserialize_with_interning(&protos));
  178 |             },
  179 |         );
  180 |     }
  181 | 
  182 |     // Benchmark with many unique version payloads
  183 |     for unique_versions in [10, 100, 500] {
  184 |         let protos = make_diverse_pb_fragments(n, 10, unique_versions);
  185 | 
  186 |         group.bench_with_input(
  187 |             BenchmarkId::new("deserialize_no_intern_diverse", unique_versions),
  188 |             &unique_versions,
  189 |             |b, _| {
  190 |                 b.iter(|| deserialize_without_interning(&protos));
  191 |             },
  192 |         );
  193 | 
  194 |         group.bench_with_input(
  195 |             BenchmarkId::new("deserialize_with_intern_diverse", unique_versions),
  196 |             &unique_versions,
  197 |             |b, _| {
  198 |                 b.iter(|| deserialize_with_interning(&protos));
  199 |             },
  200 |         );
  201 |     }
  202 | 
  203 |     group.finish();
  204 | }
  205 | 
  206 | fn bench_memory(c: &mut Criterion) {
  207 |     let mut group = c.benchmark_group("manifest_memory");
  208 |     let n = num_fragments();
  209 | 
  210 |     for num_fields in [10, 50] {
  211 |         let protos = make_uniform_pb_fragments(n, num_fields);
  212 | 
  213 |         let no_intern = deserialize_without_interning(&protos);
  214 |         let with_intern = deserialize_with_interning(&protos);
  215 | 
  216 |         let size_no_intern = no_intern.deep_size_of();
  217 |         let size_with_intern = with_intern.deep_size_of();
  218 | 
  219 |         eprintln!(
  220 |             "\n[{} fragments, {} fields] Memory without interning: {:.2} MB",
  221 |             n,
  222 |             num_fields,
  223 |             size_no_intern as f64 / 1_048_576.0
  224 |         );
  225 |         eprintln!(
  226 |             "[{} fragments, {} fields] Memory with interning:    {:.2} MB",
  227 |             n,
  228 |             num_fields,
  229 |             size_with_intern as f64 / 1_048_576.0
  230 |         );
  231 |         eprintln!(
  232 |             "[{} fragments, {} fields] Savings:                  {:.2} MB ({:.1}%)",
  233 |             n,
  234 |             num_fields,
  235 |             (size_no_intern - size_with_intern) as f64 / 1_048_576.0,
  236 |             (1.0 - size_with_intern as f64 / size_no_intern as f64) * 100.0
  237 |         );
  238 | 
  239 |         // Benchmark deep_size_of measurement itself (sanity check)
  240 |         group.bench_with_input(
  241 |             BenchmarkId::new("deep_size_of_interned", num_fields),
  242 |             &num_fields,
  243 |             |b, _| {
  244 |                 b.iter(|| with_intern.deep_size_of());
  245 |             },
  246 |         );
  247 | 
  248 |         drop(no_intern);
  249 |         drop(with_intern);
  250 |     }
  251 | 
  252 |     group.finish();
  253 | }
  254 | 
  255 | #[cfg(target_os = "linux")]
  256 | criterion_group!(
  257 |     name = benches;
  258 |     config = Criterion::default().with_profiler(lance_testing::pprof::PProfProfiler::new(100, lance_testing::pprof::Output::Flamegraph(None)));
  259 |     targets = bench_deserialization, bench_memory
  260 | );
  261 | #[cfg(not(target_os = "linux"))]
  262 | criterion_group!(benches, bench_deserialization, bench_memory);
  263 | criterion_main!(benches);
``````
