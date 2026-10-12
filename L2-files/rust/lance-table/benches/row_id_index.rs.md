> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-table/benches/row_id_index.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `8f9ef6d166aaa424cffb1469fc0eeb10014a49417ac46221f12e6bfd33191b1e`. Reviewed physical lines: 1-626.

[Module](../../../../L1-modules/rust-lance-table-row-index.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion workloads for RowIdIndex construction/lookup, row-ID column application, synthetic interleaved fragment history and bitmap-mask density. Includes optional CSV serialization-size output and synthetic protobuf row-ID generators. This is benchmark source, not recorded performance evidence. (rust/lance-table/benches/row_id_index.rs:1-626)

## Complete range analysis

### Lines 1-39

SPDX, historical TODO/checklist/questions and imports establish benchmark scope. Checklist says build/get work is unfinished even though later functions implement workloads; it is not authoritative current coverage. Imports include HashMap/Write/Range/Arc, Arrow, Criterion, row addresses/deletions, scan parameters/masks, table row-ID codecs/index/stream adapter, Prost and seeded SmallRng. External Criterion documentation URL was not fetched. (rust/lance-table/benches/row_id_index.rs:1-39)

### Lines 40-53

make_sequence starts from a contiguous RowIdSequence, collects every other ID up to requested deletions and calls sequence.delete. This removes IDs from the sequence itself; it is not a tombstoned physical fragment. The request is capped implicitly by available alternating IDs, so a requested80% can remove at most ceil(original length/2), not80%. No ratio validation or error return. (rust/lance-table/benches/row_id_index.rs:40-53)

### Lines 54-75

make_frag_sequences integer-divides total rows by fragment count, constructs exactly that many equal-sized ranges, requests (rows_per_frag as f32 * ratio) as usize deletions from alternating IDs, capped at the available ceil(rows_per_frag/2) candidates, advances the original ID span and returns Arc sequences with fragment ordinal cast to u32. Remainder rows are dropped, num_frags=0 would divide by zero, and precision and saturating float-to-usize cast behavior are inherited from Rust (nonnegative finite products truncate toward zero). The later constructed DeletionVector objects are empty because removed IDs are already absent from sequences. The helper cap also applies to the benchmark ratio0.8; that label is not an actual80% deletion fraction. (rust/lance-table/benches/row_id_index.rs:40-53; rust/lance-table/benches/row_id_index.rs:205-218) (rust/lance-table/benches/row_id_index.rs:54-75)

### Lines 76-91

num_rows parses BENCH_NUM_ROWS as u64 with unwrap and defaults to1,000,000 on any env-read error. Invalid Unicode takes the default; malformed set numeric text panics. No positive/minimum/multiple-of100 check. SizeStats owns structure label, f32 ratio and u64 bytes; SizeStatsFile optionally owns an OS file. (rust/lance-table/benches/row_id_index.rs:76-91)

### Lines 92-115

SizeStatsFile::new reads BENCH_SIZE_STATS_FILE and, if present, File::create truncates/creates that path then writes CSV header structure,percent_deletions,size. Otherwise output is disabled. write_row emits quoted structure plus numeric fields using writeln and unwrap; it does not escape arbitrary quotes or explicitly flush. The caller supplies controlled labels. These effects were not executed in this task. (rust/lance-table/benches/row_id_index.rs:92-115)

### Lines 116-141

bench_creation creates row_id_index_creation group and optional CSV sink. For ratios0,0.25,0.5, setup constructs100 fragment sequences plus empty deletion vectors outside timing. BuildIndex iterations call RowIdIndex::new and drop the resulting index; they include constructor sidecar/heuristic/merge work and destructor, not sequence generation or disk IO. (rust/lance-table/benches/row_id_index.rs:116-141)

### Lines 142-163

The RowIdIndex CSV size is the sum of serialized RowIdSequence byte lengths computed outside timing, not the in-memory index or a persisted merged lookup map. TODOs about collecting serialized size/adding HashMap are partly stale because those operations appear in this function. Tombstoned versus compacted comparison is not implemented by empty deletion vectors. (rust/lance-table/benches/row_id_index.rs:142-163)

### Lines 164-204

The creation comparison materializes flat ID/address Vecs outside timing; addresses are dense surviving sequence ordinals. FlatData CSV reports exactly16 bytes per remaining row, excluding Vec/HashMap overhead. BuildHashMap times constructing an unreserved HashMap and extending zipped pairs, then drops it. No BTreeMap, correctness assertion or explicit black_box is present in these two creation workloads. Group finishes after all ratios. (rust/lance-table/benches/row_id_index.rs:164-204)

### Lines 205-240

bench_get_single creates100 fragments for ratios0,0.02,0.25,0.5,0.8 and builds the RowIdIndex outside timing. Its mutable query generator adds241861 modulo BENCH_NUM_ROWS, starting at0. Each GetIndex iteration performs ONE get and discards the Result, including errors. Zero rows causes modulo-zero panic; dropped remainder and deleted IDs can be misses. The80% label does not equal actual removal due to alternating-ID cap. (rust/lance-table/benches/row_id_index.rs:205-240)

### Lines 241-277

HashMap lookup setup separately flattens/builds the baseline outside timing. Crucially each GetHashMap timed iteration loops over ALL IDs0..num_rows, while GetIndex performs one lookup. No throughput normalization corrects this difference, and num_rows parses the environment inside the HashMap iteration. The two reported per-iteration times are not directly comparable single-get latency. Results are ignored without explicit black_box or assertions. (rust/lance-table/benches/row_id_index.rs:241-277)

### Lines 278-316

bench_apply_row_id creates one non-null UInt64 value batch0..num_rows outside timing. RowIdAndDeletesConfig uses default parameters, row-ID true, address/creation/update columns false, no deletion or row/version sequences, no nullification, and total rows cast to u32. Each iteration clones the batch handle and calls apply_row_id_and_deletes(batch,0,0,&config), discarding Result. Complete stream-adapter behavior is covered at rust/lance-table/src/utils/stream.rs:355-848; this measures the call including clone, not just one primitive lookup. (rust/lance-table/benches/row_id_index.rs:278-316)

### Lines 317-336

shot_fragments parses BENCH_SHOT_FRAGMENTS with unwrap and defaults to2000; doc suggests19960 to mimic a historical table, not a measured reproduction here. SHOT_ROWS_PER_FRAGMENT=870,000. hash_byte mixes position XOR seed with two explicit wrapping u64 multipliers, rotate-left23, and the high byte of little-endian output. It is a cheap deterministic workload generator, not a cryptographic hash or proven uniform distribution. (rust/lance-table/benches/row_id_index.rs:317-336)

### Lines 337-363

bitmap_segment constructs a protobuf RangeWithBitmap, allocating ceil(span/8) bytes and selecting each bit when hash_byte %100 < density_pct, then clears trailing padding. Positions passed to hash are segment-local; seed varies independently. End-start and usize conversions are unchecked. Modulo100 of a byte can bias density, so comments such as82% are nominal thresholds, not guaranteed fractions. (rust/lance-table/benches/row_id_index.rs:337-363)

### Lines 364-398

holes_segment filters local offsets with hash_byte %100 < holes_pct, casts them to u32, emits little-endian four-byte offsets and constructs protobuf RangeWithHoles with U32Array base=start. Iteration keeps holes sorted. range_segment builds a plain protobuf half-open Range. Neither validates arbitrary caller bounds/span against u32, relying on fixed benchmark sizes. (rust/lance-table/benches/row_id_index.rs:364-398)

### Lines 399-426

sample_segment unwraps the protobuf arm. Plain Range samples a random slot; bitmap samples a slot and checks its bit; holes samples a local u32 offset then linearly scans encoded four-byte hole entries. Returns None for a sampled hole, and unreachable for other encodings. Empty ranges/unsupported shapes can panic. Sampling cost is setup work, not measured lookup cost. (rust/lance-table/benches/row_id_index.rs:399-426)

### Lines 427-450

shot_table_like seeds SmallRng, groups up to16 fragments and chooses each group compacted with rng0..100 <44. Uncompacted or single-fragment groups retain one plain Range per fragment. The comment's about half and historical17.4B table description are approximate fixture rationale; current default is2000 fragments. No real dataset or deletion/compaction operation is loaded. (rust/lance-table/benches/row_id_index.rs:427-450)

### Lines 451-479

Compacted groups split every source span in halves, shuffle all slices, take pairs and sort each pair's bounds. A pair can contain halves from the same original fragment despite the comment saying different sources. Each slice independently chooses nominal1% holes with probability1/3, otherwise nominal82% bitmap occupancy, using a fresh seed. Disjoint slices are reassigned to output fragments, producing overlapping envelopes without duplicate source slots. (rust/lance-table/benches/row_id_index.rs:451-479)

### Lines 480-503

Build a100,000-ID pool by uniformly choosing a fragment then one of its segments and rejection-sampling holes until full. This is not a uniform sample over all live rows; selection weights depend on fragment/segment length/density. No attempt limit exists. Zero fragments or empty selected spans can panic; all-hole input could loop. Each sequence is then Prost-encoded and decoded through read_row_ids to build Arc sources with empty deletion vectors and ordinal u32 fragment IDs. Pool generation/codec work happens before timed benchmarks. (rust/lance-table/benches/row_id_index.rs:480-503)

### Lines 504-534

bench_shot_table uses group row_id_index_shot_table, sample_size10, fixed seed7 and configured fragments*870,000 nominal slots. It times constructor separately, builds one index for lookup, then get_many for1/1000/100000 pooled IDs with matching Elements throughput and asserts every result Some inside each timed iteration. Single get cycles from pool index1, asserts Some and uses Elements1. Assertions establish source intent, not exact-address validation or executed performance. (rust/lance-table/benches/row_id_index.rs:504-534)

### Lines 535-573

bench_bitmap_mask_density creates a million-slot sequence excluding every17th ID and asserts its representation is one RangeWithBitmap. Group uses15 samples,250ms warmup,1s measurement. Ten hit counts from1 through all live rows generate roughly spaced allowed IDs (or clone all), build masks outside timing, then black_box mask_to_offset_ranges. It times selection across density, not RowIdIndex::get, and contains no expected-output assertion for each mask. (rust/lance-table/benches/row_id_index.rs:535-573)

### Lines 574-610

bench_broad_dataset_wide_mask compares one100,000-slot fragment at5,000,000 with a roughly10-million-ID dataset-wide allow set, both excluding every17th ID. It asserts bitmap representation, builds local and broad masks outside timing and measures black_box mask_to_offset_ranges with10 samples,300ms warmup,2s measurement. Source comment expects the range-based path to avoid scanning the broad allow list; the benchmark neither asserts branch choice nor a timing ratio. Wide setup eagerly retains a large Vec. (rust/lance-table/benches/row_id_index.rs:574-610)

### Lines 611-626

Linux Criterion registration runs all six benchmark functions with lance_testing PProfProfiler configured100 and Flamegraph output. Non-Linux registers the same six targets without profiler. criterion_main!(benches) supplies entry point. This file declares no unit tests or benchmark results; running it can allocate large synthetic fixtures and create/truncate the optional CSV path. (rust/lance-table/benches/row_id_index.rs:611-626)

## Interaction and interpretation limits

All 626 lines were read, including benchmark setup, assertions, environment knobs and platform registration. No benchmark was executed, no CSV generated and no performance claim measured. Constructor and mask implementations are documented separately; full apply_row_id_and_deletes remains pending. Treat ratios, labels and historical comments as workload intent, with the explicit setup/comparison limitations above.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | 
    4 | // TODO:
    5 | // - [x] Create base cases with HashMap
    6 | // - [x] Create on-disk size measurement
    7 | // - [x] Create different cases for the index. Ideal, 25% deletions, 80% deletions + compaction.
    8 | // - [ ] Create a benchmark for the get method
    9 | //   - [x] Average over all valid values
   10 | //   - [ ] Time to get a value that is not in the index
   11 | // - [ ] Create a benchmark for the new method (building the in-memory index)
   12 | // Optional:
   13 | // - [ ] Create in-memory size measurement (if possible)
   14 | 
   15 | // Questions:
   16 | // How can I write out the file? Where should I put it?
   17 | // How can I take a argument to set the size of the index?
   18 | 
   19 | use std::{collections::HashMap, io::Write, ops::Range, sync::Arc};
   20 | 
   21 | use arrow_array::{RecordBatch, UInt64Array};
   22 | use arrow_schema::{DataType, Field, Schema};
   23 | use criterion::{BenchmarkId, Criterion, criterion_group, criterion_main};
   24 | 
   25 | use lance_core::utils::address::RowAddress;
   26 | use lance_core::utils::deletion::DeletionVector;
   27 | use lance_io::ReadBatchParams;
   28 | use lance_select::{RowAddrMask, RowAddrTreeMap};
   29 | use lance_table::format::pb;
   30 | use lance_table::rowids::FragmentRowIdIndex;
   31 | use lance_table::{
   32 |     rowids::{RowIdIndex, RowIdSequence, read_row_ids, write_row_ids},
   33 |     utils::stream::{RowIdAndDeletesConfig, apply_row_id_and_deletes},
   34 | };
   35 | use prost::Message;
   36 | use rand::rngs::SmallRng;
   37 | use rand::seq::SliceRandom;
   38 | use rand::{Rng, SeedableRng};
   39 | 
   40 | fn make_sequence(row_id_range: Range<u64>, deletions: usize) -> RowIdSequence {
   41 |     let mut sequence = RowIdSequence::from(row_id_range);
   42 | 
   43 |     // Delete every other row
   44 |     let delete_ids = sequence
   45 |         .iter()
   46 |         .step_by(2)
   47 |         .take(deletions)
   48 |         .collect::<Vec<_>>();
   49 |     sequence.delete(delete_ids);
   50 | 
   51 |     sequence
   52 | }
   53 | 
   54 | fn make_frag_sequences(
   55 |     num_rows: u64,
   56 |     num_frags: u64,
   57 |     percent_deletion: f32,
   58 | ) -> Vec<(u32, Arc<RowIdSequence>)> {
   59 |     let rows_per_frag = num_rows / num_frags;
   60 |     let mut start = 0;
   61 |     (0..num_frags)
   62 |         .map(|i| {
   63 |             let sequence = make_sequence(
   64 |                 start..(start + rows_per_frag),
   65 |                 (rows_per_frag as f32 * percent_deletion) as usize,
   66 |             );
   67 |             start += rows_per_frag;
   68 |             (i as u32, Arc::new(sequence))
   69 |         })
   70 |         .collect()
   71 | }
   72 | 
   73 | // For range of values
   74 | // https://bheisler.github.io/criterion.rs/book/user_guide/benchmarking_with_inputs.html
   75 | 
   76 | fn num_rows() -> u64 {
   77 |     std::env::var("BENCH_NUM_ROWS")
   78 |         .map(|s| s.parse().unwrap())
   79 |         .unwrap_or(1_000_000)
   80 | }
   81 | 
   82 | struct SizeStats {
   83 |     structure: String,
   84 |     percent_deletions: f32,
   85 |     size: u64,
   86 | }
   87 | 
   88 | struct SizeStatsFile {
   89 |     file: Option<std::fs::File>,
   90 | }
   91 | 
   92 | impl SizeStatsFile {
   93 |     fn new() -> Self {
   94 |         if let Ok(path) = std::env::var("BENCH_SIZE_STATS_FILE") {
   95 |             let mut file = std::fs::File::create(path).unwrap();
   96 |             // Header row
   97 |             writeln!(file, "structure,percent_deletions,size").unwrap();
   98 |             Self { file: Some(file) }
   99 |         } else {
  100 |             Self { file: None }
  101 |         }
  102 |     }
  103 | 
  104 |     fn write_row(&mut self, stats: SizeStats) {
  105 |         if let Some(file) = &mut self.file {
  106 |             writeln!(
  107 |                 file,
  108 |                 "\"{}\",{},{}",
  109 |                 stats.structure, stats.percent_deletions, stats.size
  110 |             )
  111 |             .unwrap();
  112 |         }
  113 |     }
  114 | }
  115 | 
  116 | fn bench_creation(c: &mut Criterion) {
  117 |     let mut group = c.benchmark_group("row_id_index_creation");
  118 |     let mut stats_file = SizeStatsFile::new();
  119 | 
  120 |     for percent_deletions in [0.0, 0.25, 0.5] {
  121 |         let sequences = make_frag_sequences(num_rows(), 100, percent_deletions);
  122 | 
  123 |         let fragment_indices: Vec<FragmentRowIdIndex> = sequences
  124 |             .iter()
  125 |             .map(|(frag_id, sequence)| FragmentRowIdIndex {
  126 |                 fragment_id: *frag_id,
  127 |                 row_id_sequence: sequence.clone(),
  128 |                 deletion_vector: Arc::new(DeletionVector::default()),
  129 |             })
  130 |             .collect();
  131 | 
  132 |         group.bench_with_input(
  133 |             BenchmarkId::new("BuildIndex", percent_deletions),
  134 |             &percent_deletions,
  135 |             |b, _| {
  136 |                 b.iter(|| {
  137 |                     let _index = RowIdIndex::new(&fragment_indices).unwrap();
  138 |                 });
  139 |             },
  140 |         );
  141 | 
  142 |         // Measure size of index
  143 |         {
  144 |             let mut size = 0;
  145 |             for (_frag_id, sequence) in &sequences {
  146 |                 size += write_row_ids(sequence).len() as u64;
  147 |             }
  148 |             let stats = SizeStats {
  149 |                 structure: "RowIdIndex".to_string(),
  150 |                 percent_deletions,
  151 |                 size,
  152 |             };
  153 |             stats_file.write_row(stats);
  154 |         }
  155 | 
  156 |         // TODO: we should compare tombstoned vs compacted. We don't mind the
  157 |         // regression in the tombstoned case, but we want to see the improvement
  158 |         // in the compacted case.
  159 | 
  160 |         // TODO: collect size of sequences when serialized
  161 | 
  162 |         // TODO: also show building a BTreeMap and HashMap
  163 | 
  164 |         let flat_data = sequences
  165 |             .iter()
  166 |             .map(|(frag_id, sequence)| {
  167 |                 let row_ids = sequence.iter().collect::<Vec<_>>();
  168 |                 let row_addresses = (0..sequence.len())
  169 |                     .map(|i| RowAddress::new_from_parts(*frag_id, i as u32))
  170 |                     .map(u64::from)
  171 |                     .collect::<Vec<_>>();
  172 |                 (row_ids, row_addresses)
  173 |             })
  174 |             .collect::<Vec<_>>();
  175 | 
  176 |         // Size of flat data is just 16 bytes per row
  177 |         let size = flat_data
  178 |             .iter()
  179 |             .map(|(ids, _addresses)| ids.len() * 16)
  180 |             .sum::<usize>() as u64;
  181 |         let stats = SizeStats {
  182 |             structure: "FlatData".to_string(),
  183 |             percent_deletions,
  184 |             size,
  185 |         };
  186 |         stats_file.write_row(stats);
  187 | 
  188 |         group.bench_with_input(
  189 |             BenchmarkId::new("BuildHashMap", percent_deletions),
  190 |             &percent_deletions,
  191 |             |b, _| {
  192 |                 b.iter(|| {
  193 |                     let mut index = HashMap::new();
  194 |                     index.extend(flat_data.iter().flat_map(|(ids, addresses)| {
  195 |                         ids.iter().copied().zip(addresses.iter().copied())
  196 |                     }));
  197 |                 });
  198 |             },
  199 |         );
  200 |     }
  201 | 
  202 |     group.finish();
  203 | }
  204 | 
  205 | fn bench_get_single(c: &mut Criterion) {
  206 |     let mut group = c.benchmark_group("row_id_index_get_single");
  207 | 
  208 |     for percent_deletions in [0.0, 0.02, 0.25, 0.5, 0.8] {
  209 |         let sequences = make_frag_sequences(num_rows(), 100, percent_deletions);
  210 | 
  211 |         let fragment_indices: Vec<FragmentRowIdIndex> = sequences
  212 |             .iter()
  213 |             .map(|(frag_id, sequence)| FragmentRowIdIndex {
  214 |                 fragment_id: *frag_id,
  215 |                 row_id_sequence: sequence.clone(),
  216 |                 deletion_vector: Arc::new(DeletionVector::default()),
  217 |             })
  218 |             .collect();
  219 | 
  220 |         let index = RowIdIndex::new(&fragment_indices).unwrap();
  221 | 
  222 |         let mut i = 0;
  223 |         let total_rows: u64 = num_rows();
  224 |         let mut next_id = || {
  225 |             let id = i;
  226 |             i += 241861;
  227 |             i %= total_rows;
  228 |             id
  229 |         };
  230 | 
  231 |         group.bench_with_input(
  232 |             BenchmarkId::new("GetIndex", percent_deletions),
  233 |             &percent_deletions,
  234 |             |b, _| {
  235 |                 b.iter(|| {
  236 |                     let _ = index.get(next_id());
  237 |                 });
  238 |             },
  239 |         );
  240 | 
  241 |         let flat_data = sequences
  242 |             .iter()
  243 |             .map(|(frag_id, sequence)| {
  244 |                 let row_ids = sequence.iter().collect::<Vec<_>>();
  245 |                 let row_addresses = (0..sequence.len())
  246 |                     .map(|i| RowAddress::new_from_parts(*frag_id, i as u32))
  247 |                     .map(u64::from)
  248 |                     .collect::<Vec<_>>();
  249 |                 (row_ids, row_addresses)
  250 |             })
  251 |             .collect::<Vec<_>>();
  252 | 
  253 |         let index =
  254 |             {
  255 |                 let mut index = HashMap::new();
  256 |                 index.extend(flat_data.iter().flat_map(|(ids, addresses)| {
  257 |                     ids.iter().copied().zip(addresses.iter().copied())
  258 |                 }));
  259 |                 index
  260 |             };
  261 | 
  262 |         group.bench_with_input(
  263 |             BenchmarkId::new("GetHashMap", percent_deletions),
  264 |             &percent_deletions,
  265 |             |b, _| {
  266 |                 b.iter(|| {
  267 |                     for i in 0..num_rows() {
  268 |                         let _ = index.get(&i);
  269 |                     }
  270 |                 });
  271 |             },
  272 |         );
  273 |     }
  274 | 
  275 |     group.finish();
  276 | }
  277 | 
  278 | fn bench_apply_row_id(c: &mut Criterion) {
  279 |     let mut group = c.benchmark_group("apply_row_id");
  280 | 
  281 |     let batch = RecordBatch::try_new(
  282 |         Arc::new(Schema::new(vec![Field::new(
  283 |             "value",
  284 |             DataType::UInt64,
  285 |             false,
  286 |         )])),
  287 |         vec![Arc::new(UInt64Array::from(
  288 |             (0..num_rows()).collect::<Vec<_>>(),
  289 |         ))],
  290 |     )
  291 |     .unwrap();
  292 | 
  293 |     let config = RowIdAndDeletesConfig {
  294 |         params: ReadBatchParams::default(),
  295 |         with_row_id: true,
  296 |         with_row_addr: false,
  297 |         with_row_last_updated_at_version: false,
  298 |         with_row_created_at_version: false,
  299 |         deletion_vector: None,
  300 |         row_id_sequence: None,
  301 |         last_updated_at_sequence: None,
  302 |         created_at_sequence: None,
  303 |         make_deletions_null: false,
  304 |         total_num_rows: num_rows() as u32,
  305 |     };
  306 | 
  307 |     group.bench_function("ApplyRowId", |b| {
  308 |         let batch = batch.clone();
  309 |         b.iter(|| {
  310 |             let _ = apply_row_id_and_deletes(batch.clone(), 0, 0, &config);
  311 |         });
  312 |     });
  313 | 
  314 |     group.finish();
  315 | }
  316 | 
  317 | /// A fragment count large enough for the probe gate, small enough to build in
  318 | /// seconds. `BENCH_SHOT_FRAGMENTS=19960` reproduces the real table.
  319 | fn shot_fragments() -> usize {
  320 |     std::env::var("BENCH_SHOT_FRAGMENTS")
  321 |         .map(|s| s.parse().unwrap())
  322 |         .unwrap_or(2000)
  323 | }
  324 | 
  325 | /// Rows per fragment of the shot table (17.4B rows over 19,960 fragments).
  326 | const SHOT_ROWS_PER_FRAGMENT: u64 = 870_000;
  327 | 
  328 | /// Mixes a position into a pseudo-random byte cheaply enough to fill gigabits.
  329 | fn hash_byte(position: u64, seed: u64) -> u8 {
  330 |     (position ^ seed)
  331 |         .wrapping_mul(0x9E37_79B9_7F4A_7C15)
  332 |         .rotate_left(23)
  333 |         .wrapping_mul(0xD1B5_4A32_D192_ED03)
  334 |         .to_le_bytes()[7]
  335 | }
  336 | 
  337 | /// `start..end` as a bitmap segment keeping about `density_pct` of its slots.
  338 | fn bitmap_segment(start: u64, end: u64, density_pct: u8, seed: u64) -> pb::U64Segment {
  339 |     let len = (end - start) as usize;
  340 |     let mut data = vec![0u8; len.div_ceil(8)];
  341 |     for (byte_index, byte) in data.iter_mut().enumerate() {
  342 |         let mut bits = 0u8;
  343 |         for bit in 0..8 {
  344 |             if hash_byte((byte_index * 8 + bit) as u64, seed) % 100 < density_pct {
  345 |                 bits |= 1 << bit;
  346 |             }
  347 |         }
  348 |         *byte = bits;
  349 |     }
  350 |     if !len.is_multiple_of(8) {
  351 |         data[len / 8] &= (1u8 << (len % 8)) - 1;
  352 |     }
  353 |     pb::U64Segment {
  354 |         segment: Some(pb::u64_segment::Segment::RangeWithBitmap(
  355 |             pb::u64_segment::RangeWithBitmap {
  356 |                 start,
  357 |                 end,
  358 |                 bitmap: data,
  359 |             },
  360 |         )),
  361 |     }
  362 | }
  363 | 
  364 | /// `start..end` minus about `holes_pct` percent of its slots, as sorted holes.
  365 | fn holes_segment(start: u64, end: u64, holes_pct: u8, seed: u64) -> pb::U64Segment {
  366 |     let holes: Vec<u32> = (0..(end - start))
  367 |         .filter(|offset| hash_byte(*offset, seed) % 100 < holes_pct)
  368 |         .map(|offset| offset as u32)
  369 |         .collect();
  370 |     let offsets = holes.iter().flat_map(|hole| hole.to_le_bytes()).collect();
  371 |     pb::U64Segment {
  372 |         segment: Some(pb::u64_segment::Segment::RangeWithHoles(
  373 |             pb::u64_segment::RangeWithHoles {
  374 |                 start,
  375 |                 end,
  376 |                 holes: Some(pb::EncodedU64Array {
  377 |                     array: Some(pb::encoded_u64_array::Array::U32Array(
  378 |                         pb::encoded_u64_array::U32Array {
  379 |                             base: start,
  380 |                             offsets,
  381 |                         },
  382 |                     )),
  383 |                 }),
  384 |             },
  385 |         )),
  386 |     }
  387 | }
  388 | 
  389 | fn range_segment(start: u64, end: u64) -> pb::U64Segment {
  390 |     pb::U64Segment {
  391 |         segment: Some(pb::u64_segment::Segment::Range(pb::u64_segment::Range {
  392 |             start,
  393 |             end,
  394 |         })),
  395 |     }
  396 | }
  397 | 
  398 | /// A live row id from `segment`, or `None` when the sampled slot is a hole.
  399 | fn sample_segment(segment: &pb::U64Segment, rng: &mut SmallRng) -> Option<u64> {
  400 |     use pb::u64_segment::Segment::*;
  401 |     match segment.segment.as_ref().unwrap() {
  402 |         Range(range) => Some(rng.random_range(range.start..range.end)),
  403 |         RangeWithBitmap(bitmap) => {
  404 |             let offset = rng.random_range(0..(bitmap.end - bitmap.start)) as usize;
  405 |             (bitmap.bitmap[offset / 8] & (1 << (offset % 8)) != 0)
  406 |                 .then_some(bitmap.start + offset as u64)
  407 |         }
  408 |         RangeWithHoles(holes) => {
  409 |             let offset = rng.random_range(0..(holes.end - holes.start)) as u32;
  410 |             let Some(pb::encoded_u64_array::Array::U32Array(array)) =
  411 |                 holes.holes.as_ref().unwrap().array.as_ref()
  412 |             else {
  413 |                 unreachable!()
  414 |             };
  415 |             let is_hole = array
  416 |                 .offsets
  417 |                 .as_chunks::<4>()
  418 |                 .0
  419 |                 .iter()
  420 |                 .any(|hole| u32::from_le_bytes(*hole) == offset);
  421 |             (!is_hole).then_some(holes.start + offset as u64)
  422 |         }
  423 |         _ => unreachable!(),
  424 |     }
  425 | }
  426 | 
  427 | /// Fragments shaped like the shot table after deletes and compaction: about
  428 | /// half keep one `Range`; the rest were compacted in groups of 16, and each
  429 | /// output fragment holds two dense (82%) slices taken from different source
  430 | /// fragments, so spans interleave and one id sits under up to 16 fragments.
  431 | /// One compacted slice in three carries only 1% holes instead of a bitmap.
  432 | /// Returns the fragments and a pool of live row ids to query.
  433 | fn shot_table_like(
  434 |     num_fragments: usize,
  435 |     rows_per_fragment: u64,
  436 |     seed: u64,
  437 | ) -> (Vec<FragmentRowIdIndex>, Vec<u64>) {
  438 |     const GROUP: usize = 16;
  439 |     let mut rng = SmallRng::seed_from_u64(seed);
  440 |     let mut sequences: Vec<Vec<pb::U64Segment>> = Vec::with_capacity(num_fragments);
  441 |     for group_start in (0..num_fragments).step_by(GROUP) {
  442 |         let group_end = (group_start + GROUP).min(num_fragments);
  443 |         let is_compacted = rng.random_range(0..100) < 44;
  444 |         if !is_compacted || group_end - group_start < 2 {
  445 |             for fragment in group_start..group_end {
  446 |                 let start = fragment as u64 * rows_per_fragment;
  447 |                 sequences.push(vec![range_segment(start, start + rows_per_fragment)]);
  448 |             }
  449 |             continue;
  450 |         }
  451 |         let half = rows_per_fragment / 2;
  452 |         let mut slices: Vec<(u64, u64)> = (group_start..group_end)
  453 |             .flat_map(|fragment| {
  454 |                 let start = fragment as u64 * rows_per_fragment;
  455 |                 [
  456 |                     (start, start + half),
  457 |                     (start + half, start + rows_per_fragment),
  458 |                 ]
  459 |             })
  460 |             .collect();
  461 |         slices.shuffle(&mut rng);
  462 |         for pair in slices.as_chunks::<2>().0 {
  463 |             let mut pair = *pair;
  464 |             pair.sort_unstable();
  465 |             let segments = pair
  466 |                 .iter()
  467 |                 .map(|(start, end)| {
  468 |                     let seed = rng.random();
  469 |                     if rng.random_range(0..3) == 0 {
  470 |                         holes_segment(*start, *end, 1, seed)
  471 |                     } else {
  472 |                         bitmap_segment(*start, *end, 82, seed)
  473 |                     }
  474 |                 })
  475 |                 .collect();
  476 |             sequences.push(segments);
  477 |         }
  478 |     }
  479 | 
  480 |     let mut pool = Vec::with_capacity(100_000);
  481 |     while pool.len() < 100_000 {
  482 |         let segments = &sequences[rng.random_range(0..sequences.len())];
  483 |         let segment = &segments[rng.random_range(0..segments.len())];
  484 |         if let Some(id) = sample_segment(segment, &mut rng) {
  485 |             pool.push(id);
  486 |         }
  487 |     }
  488 | 
  489 |     let fragments = sequences
  490 |         .into_iter()
  491 |         .enumerate()
  492 |         .map(|(fragment_id, segments)| {
  493 |             let bytes = pb::RowIdSequence { segments }.encode_to_vec();
  494 |             FragmentRowIdIndex {
  495 |                 fragment_id: fragment_id as u32,
  496 |                 row_id_sequence: Arc::new(read_row_ids(&bytes).unwrap()),
  497 |                 deletion_vector: Arc::new(DeletionVector::default()),
  498 |             }
  499 |         })
  500 |         .collect();
  501 |     (fragments, pool)
  502 | }
  503 | 
  504 | fn bench_shot_table(c: &mut Criterion) {
  505 |     let mut group = c.benchmark_group("row_id_index_shot_table");
  506 |     group.sample_size(10);
  507 |     let (fragments, pool) = shot_table_like(shot_fragments(), SHOT_ROWS_PER_FRAGMENT, 7);
  508 | 
  509 |     group.bench_function("build", |b| {
  510 |         b.iter(|| RowIdIndex::new(&fragments).unwrap());
  511 |     });
  512 | 
  513 |     let index = RowIdIndex::new(&fragments).unwrap();
  514 |     for n in [1usize, 1000, 100_000] {
  515 |         let ids = &pool[..n];
  516 |         group.throughput(criterion::Throughput::Elements(n as u64));
  517 |         group.bench_with_input(BenchmarkId::new("get_many", n), &ids, |b, ids| {
  518 |             b.iter(|| {
  519 |                 let out = index.get_many(ids).unwrap();
  520 |                 assert!(out.iter().all(Option::is_some));
  521 |             });
  522 |         });
  523 |     }
  524 |     group.throughput(criterion::Throughput::Elements(1));
  525 |     let mut next = 0usize;
  526 |     group.bench_function("get", |b| {
  527 |         b.iter(|| {
  528 |             next = (next + 1) % pool.len();
  529 |             assert!(index.get(pool[next]).unwrap().is_some());
  530 |         });
  531 |     });
  532 |     group.finish();
  533 | }
  534 | 
  535 | fn bench_bitmap_mask_density(c: &mut Criterion) {
  536 |     let span = 1_000_000_u64;
  537 |     let live: Vec<u64> = (0..span).filter(|id| id % 17 != 0).collect();
  538 |     let sequence = RowIdSequence::from(live.as_slice());
  539 |     assert!(matches!(
  540 |         sequence.segments(),
  541 |         [lance_table::rowids::segment::U64Segment::RangeWithBitmap { .. }]
  542 |     ));
  543 | 
  544 |     let mut group = c.benchmark_group("bitmap_mask_density");
  545 |     group.sample_size(15);
  546 |     group.warm_up_time(std::time::Duration::from_millis(250));
  547 |     group.measurement_time(std::time::Duration::from_secs(1));
  548 |     for hits in [
  549 |         1_usize,
  550 |         1_000,
  551 |         10_000,
  552 |         20_000,
  553 |         50_000,
  554 |         100_000,
  555 |         200_000,
  556 |         400_000,
  557 |         800_000,
  558 |         live.len(),
  559 |     ] {
  560 |         let ids: Vec<u64> = if hits == live.len() {
  561 |             live.clone()
  562 |         } else {
  563 |             (0..hits)
  564 |                 .map(|index| live[(index + 1) * (live.len() - 1) / hits])
  565 |                 .collect()
  566 |         };
  567 |         let mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(ids.as_slice()));
  568 |         group.bench_with_input(BenchmarkId::from_parameter(hits), &mask, |b, mask| {
  569 |             b.iter(|| std::hint::black_box(sequence.mask_to_offset_ranges(mask)));
  570 |         });
  571 |     }
  572 |     group.finish();
  573 | }
  574 | 
  575 | fn bench_broad_dataset_wide_mask(c: &mut Criterion) {
  576 |     // Regression scenario: a dataset-wide allow-list applied to one
  577 |     // small-span fragment. The selection is far broader than the span, so
  578 |     // the call must keep the old range-based path instead of scanning ~10M
  579 |     // selected ids for a 100k-span segment.
  580 |     let frag_start = 5_000_000_u64;
  581 |     let span = 100_000_u64;
  582 |     let live: Vec<u64> = (frag_start..frag_start + span)
  583 |         .filter(|id| id % 17 != 0)
  584 |         .collect();
  585 |     let sequence = RowIdSequence::from(live.as_slice());
  586 |     assert!(matches!(
  587 |         sequence.segments(),
  588 |         [lance_table::rowids::segment::U64Segment::RangeWithBitmap { .. }]
  589 |     ));
  590 | 
  591 |     let mut wide: Vec<u64> = (0..10_000_000)
  592 |         .filter(|id| id % 17 != 0 && (*id < frag_start || *id >= frag_start + span))
  593 |         .collect();
  594 |     wide.extend(live.iter().copied());
  595 |     let wide_mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(wide.as_slice()));
  596 |     let local_mask = RowAddrMask::from_allowed(RowAddrTreeMap::from_iter(live.as_slice()));
  597 | 
  598 |     let mut group = c.benchmark_group("broad_mask_fragment");
  599 |     group.sample_size(10);
  600 |     group.warm_up_time(std::time::Duration::from_millis(300));
  601 |     group.measurement_time(std::time::Duration::from_secs(2));
  602 |     group.bench_function("fragment-only", |b| {
  603 |         b.iter(|| std::hint::black_box(sequence.mask_to_offset_ranges(&local_mask)));
  604 |     });
  605 |     group.bench_function("dataset-wide", |b| {
  606 |         b.iter(|| std::hint::black_box(sequence.mask_to_offset_ranges(&wide_mask)));
  607 |     });
  608 |     group.finish();
  609 | }
  610 | 
  611 | #[cfg(target_os = "linux")]
  612 | criterion_group!(
  613 |     name = benches;
  614 |     config=Criterion::default().with_profiler(lance_testing::pprof::PProfProfiler::new(100, lance_testing::pprof::Output::Flamegraph(None)));
  615 |     targets=bench_creation, bench_get_single, bench_apply_row_id, bench_shot_table, bench_bitmap_mask_density, bench_broad_dataset_wide_mask);
  616 | #[cfg(not(target_os = "linux"))]
  617 | criterion_group!(
  618 |     benches,
  619 |     bench_creation,
  620 |     bench_get_single,
  621 |     bench_apply_row_id,
  622 |     bench_shot_table,
  623 |     bench_bitmap_mask_density,
  624 |     bench_broad_dataset_wide_mask
  625 | );
  626 | criterion_main!(benches);
``````
