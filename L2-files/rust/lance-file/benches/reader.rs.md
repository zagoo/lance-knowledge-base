> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../../../V21-PROTOCOL.md).

# rust/lance-file/benches/reader.rs

Status: analyzed at the file's own layer; implementation behavior outside this file is not implied. SHA-256: `e731c8396c4b97e702793e74b6cccc83d2698bb8b453bb95debe2fef1bcd7dff`. Reviewed physical lines: 1-477.

[Module](../../../../L1-modules/archive/rust-lance-file-benchmarks.md) · [Symbols](../../../../L3-symbols/symbol-index.md) · [Behavior contracts](../../../../L3-symbols/behavior-contracts.md) · [Format](../../../../L3-symbols/format-spec.md) · [Entry](../../../../README.md)

## Role and visibility

Criterion reader executable: three full-scan workloads and a memory/disk random-access matrix across exact V2_0/V2_1/V2_2, with cached per-thread readers and platform-dependent page-cache advice. Benchmark-only public helpers are not crate API. (rust/lance-file/benches/reader.rs:1-477)

## Complete range analysis

### Lines 1-29

SPDX/imports connect shared Arc/Mutex, Arrow UInt32 selectors and Int32 arrays, black_box, Criterion batches/throughput/macros, Future/Stream combinators, core temporary directories/CPU sizing, datagen, decoder filters/plugins/config, file writer/reader/version/cache helpers, object-store scheduler/unknown sizes, paths, HashMap and Tokio Runtime. This is a separate benchmark binary, not production library initialization. (rust/lance-file/benches/reader.rs:1-29)

### Lines 30-47

bench_reader iterates exact V2_0,V2_1,V2_2 (no V1 or V2_3), creates reader_{version} group, generates one random Int32 column with2*1024*1024=2097152 rows and no requested random-null wrapper, creates Runtime::new and a temporary local object store. All generation/runtime/directory/store construction occurs outside b.iter; failures unwrap. Group spelling uses ConcreteFileVersion Display. (rust/lance-file/benches/reader.rs:30-47)

### Lines 48-62

Untimed setup writes foo.lance once using actual Arrow schema converted to Lance and default file-writer options, then awaits write_batch and finish. Throughput::Bytes is input RecordBatch::get_array_memory_size cast to u64, not persisted file length or bytes actually read. No input expected sum is precomputed. (rust/lance-file/benches/reader.rs:48-62)

### Lines 63-94

Timed decode b.iter includes Runtime::block_on, a fresh ScanScheduler with testing config, unknown-size open_file, FileReader::try_open with default plugins, a newly created test_cache and default options, then RangeFull read_tasks with batch size16384, no projection and no filter. Thus the name decode includes opening, metadata/scheduling/cache setup and IO, not only decompression. test_cache requests128MiB; testing scheduler config requests256MiB buffer and use_lite_scheduler=None (rust/lance-file/src/testing.rs:78-80; rust/lance-io/src/scheduler.rs:861-865). There is no OS page-cache eviction in this workload. (rust/lance-file/benches/reader.rs:63-94)

### Lines 95-126

Each timed scan wraps row_count and i64 sum in Arc<Mutex>, maps batch tasks to boxed futures, awaits up to16 unordered, scans underlying Int32 values (not validity-aware iterator), accumulates count/sum under lock, and drains all tasks. Assert total rows equals original2097152 and black_box sum; no sum equality or full-data/null correctness check. Assertion and synchronization/consumption costs are timed. No RecordBatch collection is retained. End of all-version scan loop. (rust/lance-file/benches/reader.rs:95-126)

### Lines 127-132

Non-Linux cfg defines pub drop_file_from_cache(path:impl AsRef<std::path::Path>)->std::io::Result<()> as unconditional Ok; ignores path and performs no file access or cache eviction. Pub is visibility inside benchmark executable, not a lance_file export. The later nocache label therefore does not prove cold disk IO on these platforms. (rust/lance-file/benches/reader.rs:127-132)

### Lines 133-150

Linux alternative opens the supplied path, borrows its live file descriptor and unsafely calls libc::posix_fadvise(fd,0,0,POSIX_FADV_DONTNEED). Comment identifies constant4 and intent to drop pages. No raw pointer/buffer is passed; File stays alive through call. There is no SAFETY comment, fsync, post-advice residency check or guarantee the advisory request removes every cache. Nonzero returned error number is converted directly with from_raw_os_error; open/advice failures return Err, then caller unwraps. File drops afterward. This call was not executed. (rust/lance-file/benches/reader.rs:133-150)

### Lines 151-168

Private constants: MAX_PARALLELISM64, ROW_GAP5120, TOTAL_ROWS100000. Gap comment intends distinct disk pages but compression/scheduler behavior may change actual IO units. CachedReader owns Arc<FileReader>, UInt32Array selector and Arc<Runtime>; CachedReaders retains all_indices plus Vec<CachedReader>. FileCache aliases HashMap<(String,String),Arc<CachedReaders>> for filesystem/version keys. Neither struct owns TempDir. (rust/lance-file/benches/reader.rs:151-168)

### Lines 169-192

get_cached_readers borrows TempDir, filesystem label and Runtime and accepts exact version. A function-local static LazyLock<Mutex<FileCache>> lazily creates a process-wide cache. Key is filesystem.to_string plus version.to_string; it excludes directory path, CPU count, options and row grouping. Hit clones Arc under lock and returns. Lock poison panics. Miss releases lookup lock before expensive creation, so concurrent misses are not coalesced and later insert can replace prior cached entry. Current benchmark caller invokes setup sequentially. (rust/lance-file/benches/reader.rs:169-192)

### Lines 193-206

On miss determine compute count T via cached get_num_compute_intensive_cpus. Label exactly mem creates memory:// store; every other string uses the supplied temporary path. Filename is bench_{version}.lance ONLY; filesystem is in cache key/store choice, contrary to comment claiming both filesystem and version in filename. Current mem/disk stores keep active cases separate; arbitrary other labels sharing a directory are not isolated by filename. CPU helper clamps fallback to1, honors LANCE_CPU_THREADS>=1 or CPU count minus LANCE_IO_CORE_RESERVATION default2, caches its result and panics on invalid explicit numeric text (rust/lance-core/src/utils/tokio.rs:12-76). (rust/lance-file/benches/reader.rs:193-206)

### Lines 207-224

Untimed miss setup materializes one Int32 column of500*1024*1024=524288000 rows with requested random-null probability0.1, creates/writes/finishes a versioned file with default options. Requested raw Int32 payload is2097152000 bytes (2000MiB), plus a potential65536000-byte validity bitmap and other allocation/encoding overhead; these are arithmetic size estimates, not measured peak RSS, exact null count or encoded file size. Full batch stays alive while writer/readers warm up, then leaves helper scope. No streaming fixture generation is used. (rust/lance-file/benches/reader.rs:207-224)

### Lines 225-239

Create100000 UInt32 selectors i*5120, first0,last511994880, all below524288000 fixture rows. This is a deterministic strided access pattern, not random selector generation. Compute rows_per_thread=floor(100000/T), allocate T CachedReader slots and slice contiguous equal chunks, dropping division remainder from per-thread slices while preserving full all_indices separately. Build one current-thread Runtime per slice without enable_all/enable_io/enable_time calls; runtime/scheduler compatibility is delegated, not executed here. (rust/lance-file/benches/reader.rs:225-239)

### Lines 240-264

Open each per-thread reader and warm it with read_task rows_at_a_time100 outside timing, then retain reader/indices/runtime. Warmup itself discards incomplete groups through read_task floor division. Wrap all readers/full selectors in Arc, lock cache again and insert/reassign key. Static cache retains readers/stores/runtimes for process lifetime without retaining TempDir; future cache hits with another directory can reuse stale file paths after directory cleanup. No explicit cache invalidation/reset or cleanup hook is defined. (rust/lance-file/benches/reader.rs:240-264)

### Lines 265-291

open_reader block_on creates a new testing scheduler, opens unknown file size, opens FileReader with no projection, default decoder plugins, fresh128MiB test cache, and a redundantly explicit DecoderConfig default inside FileReaderOptions default. Returns Arc reader and unwraps all failures. Every cached worker reader has separate cache/scheduler construction. Neither method clears OS pages nor disables Lance caches (rust/lance-file/src/testing.rs:78-80; rust/lance-io/src/scheduler.rs:861-865). (rust/lance-file/benches/reader.rs:265-291)

### Lines 292-310

read_task receives Runtime reference, owned reader Arc, UInt32Array and rows_at_a_time. Capture total selector length. Its local read_batch closure calls read_tasks with Indices, rows_at_a_time cast to u32, no projection/filter, awaits creation and allocates a fresh Arc<Mutex<(row_count,sum)>> per selector chunk. No nonzero/u32-range input validation is local; active call sites use1 or100. (rust/lance-file/benches/reader.rs:292-310)

### Lines 311-336

Within each selector chunk, stream.then awaits each batch task sequentially, sums the raw Int32 values buffer including backing values under null slots, locks aggregate, and drains all output. Assert only rows_at_a_time equals decoded row count; black_box sum without comparing expected values/nulls. Returns unit. This is a consumption anti-elision operation, not a correctness oracle for values or null placement. (rust/lance-file/benches/reader.rs:311-336)

### Lines 337-353

Runtime block_on enumerates0..floor(num_rows/rows_at_a_time), clones reader and selector handles, slices exact-size contiguous chunks, and awaits up toMAX_PARALLELISM64 chunk futures unordered. Final collect::<Vec<_>>() retains unit results, not RecordBatch payloads. Remainder selectors are silently unprocessed; zero group size would divide by zero. No outer assertion compares consumed rows to original selector length. Per-call decoded count is rows_at_a_time*floor(num_rows/rows_at_a_time). (rust/lance-file/benches/reader.rs:337-353)

### Lines 354-370

bench_random_access defines filesystems[mem,disk], one current-thread global runtime without enable_all and one TempDir, creates take group, and chooses V2_0,V2_1,V2_2 only. Current runtime handles spawn_blocking coordination, while cached per-reader current-thread runtimes execute read_task. No direct benchmark-specific environment lookup in this file; CPU/env effects enter the helper. (rust/lance-file/benches/reader.rs:354-370)

### Lines 371-393

For each store/version get cached readers before registering cases. Cartesian loops choose multithreaded false/true, rows_at_a_time1/100 and cached true/false, skipping nocache for mem or V2_0. Nominal32 random-access registrations:12mem and20disk; if compute T=1 both thread-mode names coincide, and duplicate-name handling is Criterion-dependent/unverified. Active multithread uses cached compute count T, otherwise1. Throughput Elements advertises T*floor(100000/T); it does not account for later rows_at_a_time truncation. Actual parallel count is T*g*floor(floor(100000/T)/g), where g is1 or100; single-thread uses full100000 selectors, divisible by both active g. (rust/lance-file/benches/reader.rs:371-393)

### Lines 394-413

Benchmark name formats filesystem_version_{num_threads}thread_{rows_at_a_time}_{cached|nocache}. iter_batched setup closure optionally constructs absolute temporary filename bench_{version}.lance and redundantly joins it to tempdir again, then invokes drop_file_from_cache and unwraps. This is the Criterion setup closure, separate from timed routine; no direct local timer surrounds advice. It does not recreate cached readers or clear Lance caches. On non-Linux the helper is a no-op; on Linux it only requests advisory eviction. (rust/lance-file/benches/reader.rs:394-413)

### Lines 414-437

Timed routine clones cached Arc and block_on global runtime. Multithread branch allocates join-handle Vec, iterates cached worker readers, clones each runtime/indices/reader and spawn_blocking one read_task per worker, then awaits handles in launch order with unwrap. All tasks launch before joins; inner calls each allow64 concurrent chunks, so at most64*T chunk futures can be active across workers, independent of decoder-internal parallelism. Timing includes task dispatch/join/Arc clones and consumption. (rust/lance-file/benches/reader.rs:414-437)

### Lines 438-463

Single-thread branch still spawn_blocking, using reader0/runtime0 but full all_indices rather than worker0 slice, then awaits one handle. No direct bound on Tokio blocking pool size is configured here. BatchSize::PerIteration requests one setup per timed iteration; comment claiming at least0.1s work is rationale, not measured evidence. Function exits loops and lets local TempDir/global runtime drop, while static cached Arcs remain; there is no explicit group.finish in this function. (rust/lance-file/benches/reader.rs:438-463)

### Lines 464-477

Linux criterion_group benches uses Criterion default overridden to significance_level0.1 and sample_size10 plus PProfProfiler::new(100,Output::Flamegraph(None)); profiler parameter interpretation is delegated. Non-Linux omits profiler but uses same significance/sample settings. Both target bench_reader and bench_random_access; criterion_main!(benches) supplies entry point. No explicit warmup/measurement duration or standalone test module. Cargo registers reader with harness=false (rust/lance-file/Cargo.toml:63-65). (rust/lance-file/benches/reader.rs:464-477)

## Interaction and interpretation limits

All477 physical lines read in two complete bounded outputs during ANALYZE65. No benchmarks, tests, builds, file-cache eviction or generated data creation were executed. Concurrency, remainder loss, unchecked value sums and lifecycle observations derive from source, not measurements. Decoder/IO/datagen implementations outside narrow context remain pending; do not infer physical cold-cache guarantees or encoding performance from workload labels.

## Exact declarations and numbered evidence

This appendix retains every physical line, including comments and spacing. Numeric tags, qualified type names, and complete declarations are authoritative for this file. Line annotations above explain their semantics; this copy alone is not the coverage claim.

``````text
    1 | // SPDX-License-Identifier: Apache-2.0
    2 | // SPDX-FileCopyrightText: Copyright The Lance Authors
    3 | use std::sync::{Arc, Mutex};
    4 | 
    5 | use arrow_array::{UInt32Array, cast::AsArray, types::Int32Type};
    6 | use arrow_schema::DataType;
    7 | use std::hint::black_box;
    8 | 
    9 | use criterion::{BatchSize, Criterion, Throughput, criterion_group, criterion_main};
   10 | use futures::{FutureExt, StreamExt};
   11 | use lance_core::utils::{tempfile::TempDir, tokio::get_num_compute_intensive_cpus};
   12 | use lance_datagen::ArrayGeneratorExt;
   13 | use lance_encoding::decoder::{DecoderConfig, DecoderPlugins, FilterExpression};
   14 | use lance_file::{
   15 |     reader::{FileReader, FileReaderOptions},
   16 |     testing::test_cache,
   17 |     version::ConcreteFileVersion,
   18 |     versions as file_versions,
   19 |     writer::FileWriterOptions,
   20 | };
   21 | use lance_io::{
   22 |     object_store::ObjectStore,
   23 |     scheduler::{ScanScheduler, SchedulerConfig},
   24 |     utils::CachedFileSize,
   25 | };
   26 | use object_store::path::Path;
   27 | use std::collections::HashMap;
   28 | use tokio::runtime::Runtime;
   29 | 
   30 | fn bench_reader(c: &mut Criterion) {
   31 |     for version in [
   32 |         ConcreteFileVersion::V2_0,
   33 |         ConcreteFileVersion::V2_1,
   34 |         ConcreteFileVersion::V2_2,
   35 |     ] {
   36 |         let mut group = c.benchmark_group(format!("reader_{}", version));
   37 |         let data = lance_datagen::gen_batch()
   38 |             .anon_col(lance_datagen::array::rand_type(&DataType::Int32))
   39 |             .into_batch_rows(lance_datagen::RowCount::from(2 * 1024 * 1024))
   40 |             .unwrap();
   41 |         let rt = tokio::runtime::Runtime::new().unwrap();
   42 | 
   43 |         let tmpdir = TempDir::default();
   44 |         let (object_store, base_path) = rt
   45 |             .block_on(ObjectStore::from_uri(&tmpdir.path_str()))
   46 |             .unwrap();
   47 | 
   48 |         let file_path = base_path.clone().join("foo.lance");
   49 |         let object_writer = rt.block_on(object_store.create(&file_path)).unwrap();
   50 | 
   51 |         let mut writer = file_versions::create_writer(
   52 |             version,
   53 |             object_writer,
   54 |             data.schema().as_ref().try_into().unwrap(),
   55 |             FileWriterOptions::default(),
   56 |         )
   57 |         .unwrap();
   58 |         rt.block_on(writer.write_batch(&data)).unwrap();
   59 |         rt.block_on(writer.finish()).unwrap();
   60 |         group.throughput(criterion::Throughput::Bytes(
   61 |             data.get_array_memory_size() as u64
   62 |         ));
   63 |         group.bench_function("decode", |b| {
   64 |             b.iter(|| {
   65 |                 let object_store = &object_store;
   66 |                 let file_path = &file_path;
   67 |                 let data = &data;
   68 |                 rt.block_on(async move {
   69 |                     let store_scheduler = ScanScheduler::new(
   70 |                         object_store.clone(),
   71 |                         SchedulerConfig::default_for_testing(),
   72 |                     );
   73 |                     let scheduler = store_scheduler
   74 |                         .open_file(file_path, &CachedFileSize::unknown())
   75 |                         .await
   76 |                         .unwrap();
   77 |                     let reader = FileReader::try_open(
   78 |                         scheduler.clone(),
   79 |                         None,
   80 |                         Arc::<DecoderPlugins>::default(),
   81 |                         &test_cache(),
   82 |                         FileReaderOptions::default(),
   83 |                     )
   84 |                     .await
   85 |                     .unwrap();
   86 |                     let stream = reader
   87 |                         .read_tasks(
   88 |                             lance_io::ReadBatchParams::RangeFull,
   89 |                             16 * 1024,
   90 |                             None,
   91 |                             FilterExpression::no_filter(),
   92 |                         )
   93 |                         .await
   94 |                         .unwrap();
   95 |                     let stats = Arc::new(Mutex::new((0, 0)));
   96 |                     let mut stream = stream
   97 |                         .map(|batch_task| {
   98 |                             let stats = stats.clone();
   99 |                             async move {
  100 |                                 let batch = batch_task.task.await.unwrap();
  101 |                                 let row_count = batch.num_rows();
  102 |                                 let sum = batch
  103 |                                     .column(0)
  104 |                                     .as_primitive::<Int32Type>()
  105 |                                     .values()
  106 |                                     .iter()
  107 |                                     .map(|v| *v as i64)
  108 |                                     .sum::<i64>();
  109 |                                 let mut stats = stats.lock().unwrap();
  110 |                                 stats.0 += row_count;
  111 |                                 stats.1 += sum;
  112 |                             }
  113 |                             .boxed()
  114 |                         })
  115 |                         .buffer_unordered(16);
  116 |                     while (stream.next().await).is_some() {}
  117 |                     let stats = stats.lock().unwrap();
  118 |                     let row_count = stats.0;
  119 |                     let sum = stats.1;
  120 |                     assert_eq!(data.num_rows(), row_count);
  121 |                     black_box(sum);
  122 |                 });
  123 |             })
  124 |         });
  125 |     }
  126 | }
  127 | 
  128 | #[cfg(not(target_os = "linux"))]
  129 | pub fn drop_file_from_cache(_path: impl AsRef<std::path::Path>) -> std::io::Result<()> {
  130 |     Ok(())
  131 | }
  132 | 
  133 | #[cfg(target_os = "linux")]
  134 | pub fn drop_file_from_cache(path: impl AsRef<std::path::Path>) -> std::io::Result<()> {
  135 |     use std::os::unix::io::AsRawFd;
  136 | 
  137 |     let file = std::fs::File::open(path.as_ref())?;
  138 |     let fd = file.as_raw_fd();
  139 | 
  140 |     // POSIX_FADV_DONTNEED = 4
  141 |     // This tells the kernel to drop the file from the page cache
  142 |     let result = unsafe { libc::posix_fadvise(fd, 0, 0, libc::POSIX_FADV_DONTNEED) };
  143 | 
  144 |     if result != 0 {
  145 |         return Err(std::io::Error::from_raw_os_error(result));
  146 |     }
  147 | 
  148 |     Ok(())
  149 | }
  150 | 
  151 | const MAX_PARALLELISM: usize = 64;
  152 | // Need at least 5K rows between indices to spread data across disk pages
  153 | const ROW_GAP: usize = 1024 * 5;
  154 | const TOTAL_ROWS: usize = 100_000;
  155 | 
  156 | struct CachedReader {
  157 |     reader: Arc<FileReader>,
  158 |     indices: UInt32Array,
  159 |     runtime: Arc<Runtime>,
  160 | }
  161 | 
  162 | struct CachedReaders {
  163 |     all_indices: UInt32Array,
  164 |     readers: Vec<CachedReader>,
  165 | }
  166 | 
  167 | type FileCache = HashMap<(String, String), Arc<CachedReaders>>;
  168 | 
  169 | /// Get or create a lance file for benchmarking.
  170 | ///
  171 | /// This function caches the results so files are only created once per (filesystem, version) combination.
  172 | /// The version and filesystem are encoded in the filename to avoid collisions.
  173 | fn get_cached_readers(
  174 |     tmpdir: &TempDir,
  175 |     filesystem: &str,
  176 |     rt: &Runtime,
  177 |     version: ConcreteFileVersion,
  178 | ) -> Arc<CachedReaders> {
  179 |     use std::sync::{LazyLock, Mutex};
  180 | 
  181 |     static FILE_CACHE: LazyLock<Mutex<FileCache>> = LazyLock::new(|| Mutex::new(HashMap::new()));
  182 | 
  183 |     let key = (filesystem.to_string(), version.to_string());
  184 | 
  185 |     // Check cache first
  186 |     {
  187 |         let cache = FILE_CACHE.lock().unwrap();
  188 |         if let Some(cached) = cache.get(&key) {
  189 |             return cached.clone();
  190 |         }
  191 |     }
  192 | 
  193 |     let num_threads = get_num_compute_intensive_cpus();
  194 | 
  195 |     // Create object store
  196 |     let (object_store, base_path) = if filesystem == "mem" {
  197 |         rt.block_on(ObjectStore::from_uri("memory://")).unwrap()
  198 |     } else {
  199 |         rt.block_on(ObjectStore::from_uri(&tmpdir.path_str()))
  200 |             .unwrap()
  201 |     };
  202 | 
  203 |     // Create filename with version to avoid collisions
  204 |     let filename = format!("bench_{}.lance", version);
  205 |     let file_path = base_path.join(filename.as_str());
  206 | 
  207 |     // Generate data
  208 |     let data = lance_datagen::gen_batch()
  209 |         .anon_col(lance_datagen::array::rand_type(&DataType::Int32).with_random_nulls(0.1))
  210 |         .into_batch_rows(lance_datagen::RowCount::from(500 * 1024 * 1024))
  211 |         .unwrap();
  212 | 
  213 |     // Write file
  214 |     let object_writer = rt.block_on(object_store.create(&file_path)).unwrap();
  215 |     let mut writer = file_versions::create_writer(
  216 |         version,
  217 |         object_writer,
  218 |         data.schema().as_ref().try_into().unwrap(),
  219 |         FileWriterOptions::default(),
  220 |     )
  221 |     .unwrap();
  222 |     rt.block_on(writer.write_batch(&data)).unwrap();
  223 |     rt.block_on(writer.finish()).unwrap();
  224 | 
  225 |     let indices = (0..TOTAL_ROWS as u32)
  226 |         .map(|i| i * ROW_GAP as u32)
  227 |         .collect::<Vec<_>>();
  228 |     let all_indices = UInt32Array::from(indices);
  229 | 
  230 |     let rows_per_thread = TOTAL_ROWS / num_threads;
  231 | 
  232 |     let mut readers = Vec::with_capacity(num_threads);
  233 |     for i in 0..num_threads {
  234 |         let indices = all_indices.slice(i * rows_per_thread, rows_per_thread);
  235 |         let runtime = Arc::new(
  236 |             tokio::runtime::Builder::new_current_thread()
  237 |                 .build()
  238 |                 .unwrap(),
  239 |         );
  240 |         let reader = open_reader(&runtime, &object_store, &file_path);
  241 |         // Warm up reader
  242 |         read_task(
  243 |             &runtime,
  244 |             reader.clone(),
  245 |             indices.clone(),
  246 |             /*rows_at_a_time=*/ 100,
  247 |         );
  248 |         readers.push(CachedReader {
  249 |             reader,
  250 |             indices,
  251 |             runtime,
  252 |         });
  253 |     }
  254 | 
  255 |     let cached_readers = Arc::new(CachedReaders {
  256 |         all_indices,
  257 |         readers,
  258 |     });
  259 | 
  260 |     let mut cache = FILE_CACHE.lock().unwrap();
  261 |     cache.insert(key, cached_readers.clone());
  262 |     cached_readers
  263 | }
  264 | 
  265 | fn open_reader(rt: &Runtime, object_store: &Arc<ObjectStore>, file_path: &Path) -> Arc<FileReader> {
  266 |     rt.block_on(async {
  267 |         let store_scheduler =
  268 |             ScanScheduler::new(object_store.clone(), SchedulerConfig::default_for_testing());
  269 |         let scheduler = store_scheduler
  270 |             .open_file(file_path, &CachedFileSize::unknown())
  271 |             .await
  272 |             .unwrap();
  273 |         Arc::new(
  274 |             FileReader::try_open(
  275 |                 scheduler.clone(),
  276 |                 None,
  277 |                 Arc::<DecoderPlugins>::default(),
  278 |                 &test_cache(),
  279 |                 FileReaderOptions {
  280 |                     decoder_config: DecoderConfig {
  281 |                         ..Default::default()
  282 |                     },
  283 |                     ..Default::default()
  284 |                 },
  285 |             )
  286 |             .await
  287 |             .unwrap(),
  288 |         )
  289 |     })
  290 | }
  291 | 
  292 | fn read_task(
  293 |     runtime: &Runtime,
  294 |     reader: Arc<FileReader>,
  295 |     indices: UInt32Array,
  296 |     rows_at_a_time: usize,
  297 | ) {
  298 |     let num_rows = indices.len();
  299 | 
  300 |     let read_batch = |reader: Arc<FileReader>, indices: UInt32Array| async move {
  301 |         let stream = reader
  302 |             .read_tasks(
  303 |                 lance_io::ReadBatchParams::Indices(indices),
  304 |                 rows_at_a_time as u32,
  305 |                 None,
  306 |                 FilterExpression::no_filter(),
  307 |             )
  308 |             .await
  309 |             .unwrap();
  310 |         let stats = Arc::new(Mutex::new((0, 0)));
  311 |         let mut stream = stream.then(|batch_task| {
  312 |             let stats = stats.clone();
  313 |             async move {
  314 |                 let batch = batch_task.task.await.unwrap();
  315 |                 let row_count = batch.num_rows();
  316 |                 let sum = batch
  317 |                     .column(0)
  318 |                     .as_primitive::<Int32Type>()
  319 |                     .values()
  320 |                     .iter()
  321 |                     .map(|v| *v as i64)
  322 |                     .sum::<i64>();
  323 |                 let mut stats = stats.lock().unwrap();
  324 |                 stats.0 += row_count;
  325 |                 stats.1 += sum;
  326 |             }
  327 |             .boxed()
  328 |         });
  329 |         while (stream.next().await).is_some() {}
  330 |         let stats = stats.lock().unwrap();
  331 |         let row_count = stats.0;
  332 |         let sum = stats.1;
  333 |         assert_eq!(rows_at_a_time, row_count);
  334 |         black_box(sum);
  335 |     };
  336 | 
  337 |     runtime.block_on(async move {
  338 |         futures::stream::iter(0..num_rows / rows_at_a_time)
  339 |             .map(|i| {
  340 |                 let reader = reader.clone();
  341 |                 let indices = indices.clone();
  342 |                 async move {
  343 |                     let reader = reader.clone();
  344 |                     let indices = indices.slice(i * rows_at_a_time, rows_at_a_time);
  345 |                     read_batch(reader, indices).await;
  346 |                 }
  347 |             })
  348 |             .buffer_unordered(MAX_PARALLELISM)
  349 |             .collect::<Vec<_>>()
  350 |             .await;
  351 |     });
  352 | }
  353 | 
  354 | fn bench_random_access(c: &mut Criterion) {
  355 |     let filesystems = ["mem", "disk"];
  356 | 
  357 |     let global_runtime = tokio::runtime::Builder::new_current_thread()
  358 |         .build()
  359 |         .unwrap();
  360 | 
  361 |     let tmpdir = TempDir::default();
  362 | 
  363 |     let mut group = c.benchmark_group("take");
  364 | 
  365 |     let versions = [
  366 |         ConcreteFileVersion::V2_0,
  367 |         ConcreteFileVersion::V2_1,
  368 |         ConcreteFileVersion::V2_2,
  369 |     ];
  370 | 
  371 |     for filesystem in filesystems {
  372 |         for version in versions {
  373 |             // Get or create the file (cached)
  374 |             let cached_readers = get_cached_readers(&tmpdir, filesystem, &global_runtime, version);
  375 | 
  376 |             for multithreaded in [false, true] {
  377 |                 for rows_at_a_time in [1, 100] {
  378 |                     for cached in [true, false] {
  379 |                         if !cached && (filesystem == "mem" || version == ConcreteFileVersion::V2_0)
  380 |                         {
  381 |                             continue;
  382 |                         }
  383 | 
  384 |                         let num_threads = if multithreaded {
  385 |                             get_num_compute_intensive_cpus()
  386 |                         } else {
  387 |                             1
  388 |                         };
  389 |                         let rows_per_thread = TOTAL_ROWS / num_threads;
  390 |                         group.throughput(Throughput::Elements(
  391 |                             rows_per_thread as u64 * num_threads as u64,
  392 |                         ));
  393 | 
  394 |                         group.bench_function(
  395 |                             format!(
  396 |                                 "{}_{}_{}thread_{}_{}",
  397 |                                 filesystem,
  398 |                                 version,
  399 |                                 num_threads,
  400 |                                 rows_at_a_time,
  401 |                                 if cached { "cached" } else { "nocache" },
  402 |                             ),
  403 |                             |b| {
  404 |                                 b.iter_batched(
  405 |                                     || {
  406 |                                         if !cached {
  407 |                                             let filename = tmpdir
  408 |                                                 .std_path()
  409 |                                                 .join(format!("bench_{}.lance", version));
  410 |                                             drop_file_from_cache(tmpdir.std_path().join(&filename))
  411 |                                                 .unwrap();
  412 |                                         }
  413 |                                     },
  414 |                                     |_| {
  415 |                                         let cached_readers = cached_readers.clone();
  416 |                                         global_runtime.block_on(async move {
  417 |                                             let mut handles = Vec::with_capacity(num_threads);
  418 |                                             if multithreaded {
  419 |                                                 for reader in &cached_readers.readers {
  420 |                                                     let runtime = reader.runtime.clone();
  421 |                                                     let indices = reader.indices.clone();
  422 |                                                     let reader = reader.reader.clone();
  423 |                                                     handles.push(tokio::task::spawn_blocking(
  424 |                                                         move || {
  425 |                                                             read_task(
  426 |                                                                 &runtime,
  427 |                                                                 reader,
  428 |                                                                 indices,
  429 |                                                                 rows_at_a_time,
  430 |                                                             );
  431 |                                                         },
  432 |                                                     ));
  433 |                                                 }
  434 |                                                 for handle in handles {
  435 |                                                     handle.await.unwrap();
  436 |                                                 }
  437 |                                             } else {
  438 |                                                 tokio::task::spawn_blocking(move || {
  439 |                                                     read_task(
  440 |                                                         &cached_readers.readers[0].runtime,
  441 |                                                         cached_readers.readers[0].reader.clone(),
  442 |                                                         cached_readers.all_indices.clone(),
  443 |                                                         rows_at_a_time,
  444 |                                                     )
  445 |                                                 })
  446 |                                                 .await
  447 |                                                 .unwrap();
  448 |                                             }
  449 |                                         });
  450 |                                     },
  451 |                                     // We have at least 0.1 seconds of work per iteration so don't need to worry about
  452 |                                     // overhead of BatchSize::PerIteration
  453 |                                     BatchSize::PerIteration,
  454 |                                 );
  455 |                             },
  456 |                         );
  457 |                     }
  458 |                 }
  459 |             }
  460 |         }
  461 |     }
  462 | }
  463 | 
  464 | #[cfg(target_os = "linux")]
  465 | criterion_group!(
  466 |     name=benches;
  467 |     config = Criterion::default().significance_level(0.1).sample_size(10)
  468 |         .with_profiler(lance_testing::pprof::PProfProfiler::new(100, lance_testing::pprof::Output::Flamegraph(None)));
  469 |     targets = bench_reader, bench_random_access);
  470 | 
  471 | // Non-linux version does not support pprof.
  472 | #[cfg(not(target_os = "linux"))]
  473 | criterion_group!(
  474 |     name=benches;
  475 |     config = Criterion::default().significance_level(0.1).sample_size(10);
  476 |     targets = bench_reader, bench_random_access);
  477 | criterion_main!(benches);
``````
