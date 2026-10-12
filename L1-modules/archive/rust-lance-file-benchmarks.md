> **Historical archive — superseded scope.** Coverage counts, pending work and acceptance outcomes below are dated historical evidence. They do not define current work or completion. Tests/binaries remain excluded; see [V2.1 protocol](../../V21-PROTOCOL.md).

# File reader and schema benchmark contracts

Complete source scope: reader.rs477 lines and schema.rs73 lines. Both are separate Criterion executables with harness=false, not public lance_file API modules. Twenty-eight declarations include platform alternatives and macro invocations; macro-expanded code is not fabricated. No benchmark, source build/test, cache eviction or fixture creation was executed. (rust/lance-file/Cargo.toml:41-69) (rust/lance-file/benches/reader.rs:1-477) (rust/lance-file/benches/schema.rs:1-73)

[File crate](../rust-lance-file.md) · [Reader L2](../../L2-files/rust/lance-file/benches/reader.rs.md) · [Schema L2](../../L2-files/rust/lance-file/benches/schema.rs.md) · [Reader runtime](../rust-lance-file-shared-reader.md) · [Symbols](../../L3-symbols/symbol-index.md) · [Build/test](../../L4-crosscutting/build-and-test.md) · [Pitfalls](../../L4-crosscutting/pitfalls.md)

## What is measured

| Workload | Untimed construction / setup closure | Timed operation | Advertised unit |
|---|---|---|---|
| reader_{version}/decode, three exact versions | Generate2097152 random Int32 rows; create runtime/temp store; write/finish foo.lance | New scheduler, unknown-size file open, reader metadata/cache setup, full scan in16384-row tasks,16 unordered consumers, row count and raw value sum | Input Arrow batch get_array_memory_size bytes |
| take, nominal32 cases | Per store/version generate524288000 nullable Int32 rows; write file; create/warm T readers. iter_batched setup optionally advises page-cache eviction | spawn_blocking/join, cached reader indexed reads in1- or100-row chunks, up to64 chunk futures per worker, count assertions and raw value sums | T*floor(100000/T) elements |
| schema_from_flat_fields, four cases | Build flat parent/left/right protobuf Field messages | Schema::try_from on borrowed black_box Fields, with new schema returned to Criterion | ALL flat root+leaf entries, not physical leaf count |

Sources: (rust/lance-file/benches/reader.rs:30-126) (rust/lance-file/benches/reader.rs:173-477) (rust/lance-file/benches/schema.rs:20-73). The decode label includes opening and result consumption. The take selectors are a deterministic stride5120, not sampled random positions. No workload asserts returned values against expected data; reader workloads assert row counts and black_box their sums. They read raw Int32 values without validity checks, which matters for the0.1 requested random-null fixture. (rust/lance-file/benches/reader.rs:95-121) (rust/lance-file/benches/reader.rs:207-228) (rust/lance-file/benches/reader.rs:300-350)

## Version and case matrix

Reader workloads use exact V2_0,V2_1,V2_2, excluding V1 and V2_3. Random-access dimensions are mem/disk, single/multi worker, group size1/100 and cached/nocache. Nocache is skipped for every mem case and every V2_0 case:12 nominal mem registrations plus20 disk. Names encode computed thread count rather than the Boolean mode; T=1 makes the two mode names identical, with Criterion handling unverified. (rust/lance-file/benches/reader.rs:31-35) (rust/lance-file/benches/reader.rs:354-402)

Constants are TOTAL_ROWS100000, ROW_GAP5120, MAX_PARALLELISM64. Selected offsets0..511994880 fit the524288000-row source. Cached worker selectors split using q=floor(100000/T). The read helper further splits by g=rows_at_a_time with no tail handling. Actual parallel decoded rows are T*g*floor(q/g); advertised throughput is T*q. Single-worker mode instead passes all100000 selectors through reader0 and therefore processes the full selector list for either active g. The row-count assertion checks each full chunk only and cannot detect omitted tail selectors. (rust/lance-file/benches/reader.rs:151-165) (rust/lance-file/benches/reader.rs:225-247) (rust/lance-file/benches/reader.rs:292-352) (rust/lance-file/benches/reader.rs:384-448)

## Runtime, cache and lifetime

~~~text
bench_random_access owns TempDir and global current-thread Runtime
  +-- static cache key = filesystem label + version string
  |     +-- all100000 UInt32 selectors
  |     +-- T entries: Arc<FileReader>, selector slice, Arc<current-thread Runtime>
  +-- setup: optional platform cache advice
  +-- timed global block_on
        +-- spawn_blocking per worker (one for single mode)
        +-- worker Runtime::block_on -> <=64 indexed chunk futures
              +-- each chunk sequentially awaits its decoder batch tasks
~~~

The function-local LazyLock cache is protected only during lookup and insertion; concurrent misses are not deduplicated. Key excludes temporary directory, options and CPU count. Cached entries own readers/stores/runtimes but not TempDir, so a later invocation with a new directory can reuse paths whose prior directory was cleaned up. These are source lifecycle risks, not reproduced failures. File name is bench_{version}.lance; the comment saying filesystem is encoded in the name is inaccurate. (rust/lance-file/benches/reader.rs:156-263) (rust/lance-file/benches/reader.rs:354-462)

Each reader opens with a fresh test_cache requesting128MiB and a testing scheduler configured for256MiB buffered IO and use_lite_scheduler=None. That testing constructor does not read the LANCE_USE_LITE_SCHEDULER environment variable; SchedulerConfig::new has that separate behavior. The benchmarks never clear the retained Lance caches. Current-thread runtime builders do not call enable_all/enable_io/enable_time; whether delegated IO needs those drivers is not established by this benchmark source. (rust/lance-file/benches/reader.rs:235-290) (rust/lance-file/benches/reader.rs:354-359) (rust/lance-file/src/testing.rs:78-80; rust/lance-io/src/scheduler.rs:850-865)

T comes from the core cached compute-count helper: explicit LANCE_CPU_THREADS must be at least1; otherwise CPU count minus LANCE_IO_CORE_RESERVATION (default2), falling back to1 when reservation consumes available CPUs. Invalid numeric environment text panics on first relevant initialization. The benchmark does not configure the Tokio blocking pool size or pin threads. (rust/lance-file/benches/reader.rs:193-193) (rust/lance-file/benches/reader.rs:384-388) (rust/lance-file/benches/reader.rs:414-448) (rust/lance-core/src/utils/tokio.rs:12-76)

## Cache-advice semantics and unsafe boundary

On non-Linux, drop_file_from_cache returns Ok without using the path. On Linux it opens the file and calls unsafe posix_fadvise with live fd, offset0,length0 and POSIX_FADV_DONTNEED; nonzero return becomes a direct OS error. No pointer buffer is passed, but the code contains no SAFETY comment or residency verification. This is advisory and preserves the already-open reader/Lance cache. The nocache label is not a verified cold-cache or disk-read guarantee. It runs in iter_batched setup, whose local source is distinct from the timed routine. (rust/lance-file/benches/reader.rs:128-149) (rust/lance-file/benches/reader.rs:403-454)

## Schema fixture and denominator

Each schema root is struct_i with id3*i,parent-1, followed by left_i/right_i Int32 leaves IDs3*i+1/+2. Other protobuf fields use Default. Even leaf count is asserted; huge-count overflow/truncation is not guarded, though active sizes fit. No protobuf bytes are decoded by this workload. (rust/lance-file/benches/schema.rs:10-52)

| Label leaf count | Roots | Throughput flat entries |
|---|---|---|
|1024|512|1536|
|4096|2048|6144|
|16384|8192|24576|
|65536|32768|98304|

The prebuilt Fields are outside the timed closure; reconstruction and resulting allocations occur inside. There is no shape/equality or measured-performance threshold assertion. (rust/lance-file/benches/schema.rs:54-70)

## Configuration, commands and measurement limits

Reader Criterion config sets significance_level0.1 and sample_size10; Linux adds PProfProfiler::new(100,Flamegraph(None)). The profiler implementation remains pending, so100 is recorded as a supplied parameter rather than asserted frequency. Schema uses Criterion defaults. Neither file specifies a warmup/measurement duration. The reader comment asserting at least0.1s per iteration is unmeasured rationale. (rust/lance-file/benches/reader.rs:451-477) (rust/lance-file/benches/schema.rs:72-73)

Repository policy selects release-with-debug for benchmark work. Once running benchmarks is separately intended, command forms are cargo bench -p lance-file --bench reader --profile release-with-debug and the corresponding --bench schema. These are command constructions from Cargo targets and policy, not commands run or validated here; the root profile/toolchain files remain separately pending. (AGENTS.md:19-31; rust/lance-file/Cargo.toml:63-69)

The random-access fixture requests2000MiB of raw Int32 values plus up to62.5MiB validity bitmap before writer/read/scheduler overhead. This is arithmetic, not RSS or encoded-size measurement. Input generation is eager and occurs outside timing; multiple store/version cached readers persist. No timing, throughput, hardware comparability, cloud IO or overall scalability claim follows from this analysis. (rust/lance-file/benches/reader.rs:173-263)

## Exact declarations

Qualified names in the index use a benches/reader or benches/schema documentation namespace; they identify separate executables, not exported Rust library paths. Conditional alternatives retain the same declared name and their cfg. Macro calls are preserved without inventing expansion signatures.

| Declaration | Visibility / condition | Exact source | Location |
|---|---|---|---|
| reader::bench_reader | private; all targets | `fn bench_reader(c: &mut Criterion) {` | rust/lance-file/benches/reader.rs:30-30 |
| reader::drop_file_from_cache | pub in benchmark executable; not(target_os = "linux") | `pub fn drop_file_from_cache(_path: impl AsRef<std::path::Path>) -> std::io::Result<()> {` | rust/lance-file/benches/reader.rs:129-129 |
| reader::drop_file_from_cache | pub in benchmark executable; target_os = "linux" | `pub fn drop_file_from_cache(path: impl AsRef<std::path::Path>) -> std::io::Result<()> {` | rust/lance-file/benches/reader.rs:134-134 |
| reader::MAX_PARALLELISM | private; all targets | `const MAX_PARALLELISM: usize = 64;` | rust/lance-file/benches/reader.rs:151-151 |
| reader::ROW_GAP | private; all targets | `const ROW_GAP: usize = 1024 * 5;` | rust/lance-file/benches/reader.rs:153-153 |
| reader::TOTAL_ROWS | private; all targets | `const TOTAL_ROWS: usize = 100_000;` | rust/lance-file/benches/reader.rs:154-154 |
| reader::CachedReader | private; all targets | `struct CachedReader {` | rust/lance-file/benches/reader.rs:156-156 |
| reader::CachedReader::reader | private; all targets | `reader: Arc<FileReader>,` | rust/lance-file/benches/reader.rs:157-157 |
| reader::CachedReader::indices | private; all targets | `indices: UInt32Array,` | rust/lance-file/benches/reader.rs:158-158 |
| reader::CachedReader::runtime | private; all targets | `runtime: Arc<Runtime>,` | rust/lance-file/benches/reader.rs:159-159 |
| reader::CachedReaders | private; all targets | `struct CachedReaders {` | rust/lance-file/benches/reader.rs:162-162 |
| reader::CachedReaders::all_indices | private; all targets | `all_indices: UInt32Array,` | rust/lance-file/benches/reader.rs:163-163 |
| reader::CachedReaders::readers | private; all targets | `readers: Vec<CachedReader>,` | rust/lance-file/benches/reader.rs:164-164 |
| reader::FileCache | private; all targets | `type FileCache = HashMap<(String, String), Arc<CachedReaders>>;` | rust/lance-file/benches/reader.rs:167-167 |
| reader::get_cached_readers | private; all targets | `fn get_cached_readers(     tmpdir: &TempDir,     filesystem: &str,     rt: &Runtime,     version: ConcreteFileVersion, ) -> Arc<CachedReaders> {` | rust/lance-file/benches/reader.rs:173-178 |
| reader::get_cached_readers::FILE_CACHE | function-local private; all targets | `static FILE_CACHE: LazyLock<Mutex<FileCache>> = LazyLock::new(\|\| Mutex::new(HashMap::new()));` | rust/lance-file/benches/reader.rs:181-181 |
| reader::open_reader | private; all targets | `fn open_reader(rt: &Runtime, object_store: &Arc<ObjectStore>, file_path: &Path) -> Arc<FileReader> {` | rust/lance-file/benches/reader.rs:265-265 |
| reader::read_task | private; all targets | `fn read_task(     runtime: &Runtime,     reader: Arc<FileReader>,     indices: UInt32Array,     rows_at_a_time: usize, ) {` | rust/lance-file/benches/reader.rs:292-297 |
| reader::read_task::read_batch | function-local private; all targets | `let read_batch = \|reader: Arc<FileReader>, indices: UInt32Array\| async move {` | rust/lance-file/benches/reader.rs:300-300 |
| reader::bench_random_access | private; all targets | `fn bench_random_access(c: &mut Criterion) {` | rust/lance-file/benches/reader.rs:354-354 |
| reader::benches | macro-generated; target_os = "linux" | `criterion_group!(     name=benches;     config = Criterion::default().significance_level(0.1).sample_size(10)         .with_profiler(lance_testing::pprof::PProfProfiler::new(100, lance_testing::pprof::Output::Flamegraph(None)));     targets = bench_reader, bench_random_access);` | rust/lance-file/benches/reader.rs:465-469 |
| reader::benches | macro-generated; not(target_os = "linux") | `criterion_group!(     name=benches;     config = Criterion::default().significance_level(0.1).sample_size(10);     targets = bench_reader, bench_random_access);` | rust/lance-file/benches/reader.rs:473-476 |
| reader::main | macro-generated; all targets | `criterion_main!(benches);` | rust/lance-file/benches/reader.rs:477-477 |
| schema::proto_field | private; all targets | `fn proto_field(id: i32, parent_id: i32, name: String, logical_type: &str) -> pb::Field {` | rust/lance-file/benches/schema.rs:10-10 |
| schema::wide_two_leaf_structs | private; all targets | `fn wide_two_leaf_structs(num_physical_columns: usize) -> Fields {` | rust/lance-file/benches/schema.rs:24-24 |
| schema::bench_schema_reconstruction | private; all targets | `fn bench_schema_reconstruction(c: &mut Criterion) {` | rust/lance-file/benches/schema.rs:54-54 |
| schema::benches | macro-generated; all targets | `criterion_group!(benches, bench_schema_reconstruction);` | rust/lance-file/benches/schema.rs:72-72 |
| schema::main | macro-generated; all targets | `criterion_main!(benches);` | rust/lance-file/benches/schema.rs:73-73 |
